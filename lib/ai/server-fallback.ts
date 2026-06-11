import { createAdminClient } from "@/lib/supabase/admin";
import { resolveGeminiModel } from "@/lib/ai/byoa";

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

class GeminiApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = status === 429 ? "RateLimitError" : "GeminiError";
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

async function callGemini(key: string, system: string, prompt: string): Promise<string> {
  const model = resolveGeminiModel(process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    key
  )}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.35, maxOutputTokens: 900 }
    })
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new GeminiApiError(res.status, `Gemini API ${res.status}: ${detail.slice(0, 500)}`);
  }

  const json = await res.json();
  const text =
    json?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text).join("") || "";

  if (!text.trim()) throw new Error("Gemini returned an empty response.");
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
      return await callGemini(slot.key, system, prompt);
    } catch (error) {
      lastError = error;
      console.error("[server-fallback] Gemini request failed", {
        slot: slot.slot,
        status: error instanceof GeminiApiError ? error.status : undefined,
        message: error instanceof Error ? error.message : String(error)
      });
      if ((error as Error).name !== "RateLimitError") break;
    }
  }

  if (lastError instanceof AiFallbackUnavailableError) throw lastError;
  throw new AiFallbackUnavailableError();
}
