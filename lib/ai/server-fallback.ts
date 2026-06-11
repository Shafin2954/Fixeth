import { createAdminClient } from "@/lib/supabase/admin";

type ApiKeySlot = {
  slot: number;
  key: string;
  status: "active" | "limit_used" | "empty";
};

type ApiKeyConfig = {
  slots?: ApiKeySlot[];
};

export class AiFallbackUnavailableError extends Error {
  constructor(message = "AI temporarily unavailable. Add your own key in Settings.") {
    super(message);
    this.name = "AiFallbackUnavailableError";
  }
}

class OpenAIApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = status === 429 ? "RateLimitError" : "OpenAIError";
  }
}

function parseSlots(value: unknown): ApiKeySlot[] {
  const config = value as ApiKeyConfig | null;
  return (config?.slots || [])
    .filter((slot) => slot && typeof slot.slot === "number")
    .map((slot) => ({
      slot: slot.slot,
      key: String(slot.key || ""),
      status: slot.status || "empty"
    }));
}

async function loadKeySlots(): Promise<ApiKeySlot[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_config")
    .select("value")
    .eq("key", "api_keys")
    .maybeSingle();

  if (error) throw new AiFallbackUnavailableError(error.message);
  return parseSlots(data?.value);
}

async function callOpenAI(key: string, system: string, prompt: string): Promise<string> {
  const model = process.env.OPENAI_FALLBACK_MODEL || "gpt-4o-mini"; // Using known valid model
  const url = "https://api.openai.com/v1/chat/completions";

  // Prepare request body - gpt-4o-mini supports these parameters
  const requestBody: any = {
    model: model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ],
    temperature: 0.35,
    max_completion_tokens: 900
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new OpenAIApiError(res.status, `OpenAI API ${res.status}: ${detail.slice(0, 500)}`);
  }

  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content || "";

  if (!text.trim()) throw new Error("OpenAI returned an empty response.");
  return text.trim();
}

export async function runServerFallbackChat(system: string, prompt: string): Promise<string> {
  const slots = await loadKeySlots();
  const active = slots.find((slot) => slot.status === "active" && slot.key);
  const backup = slots.find((slot) => slot.status !== "limit_used" && slot.status !== "empty" && slot.key && slot.slot !== active?.slot);
  const candidates = [active, backup].filter(Boolean) as ApiKeySlot[];

  if (!candidates.length) throw new AiFallbackUnavailableError();

  let lastError: unknown = null;
  for (const slot of candidates) {
    try {
      return await callOpenAI(slot.key, system, prompt);
    } catch (error) {
      lastError = error;
      console.error("[server-fallback] OpenAI request failed", {
        slot: slot.slot,
        status: error instanceof OpenAIApiError ? error.status : undefined,
        message: error instanceof Error ? error.message : String(error)
      });
      if ((error as Error).name !== "RateLimitError") break;
    }
  }

  if (lastError instanceof AiFallbackUnavailableError) throw lastError;
  throw new AiFallbackUnavailableError();
}