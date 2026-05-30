// Bring-Your-Own-API (BYOA) client-side LLM helper.
//
// Keys live in the user's browser (preferences.ai), never on our server.
// Supports Google Gemini (REST) and a local Ollama host. All calls run from
// the client so there is zero platform inference cost.

export type AiPrefs = {
  apiKey: string;
  model: "gemini-flash" | "gemini-pro" | "gemini-1.5" | "ollama" | string;
  ollamaUrl: string;
  ollamaModel: string;
  persona?: string;
  defaultCognitiveLevel?: string;
};

export type AiMessage = { role: "user" | "assistant"; content: string };

export class AiNotConfiguredError extends Error {
  constructor() {
    super("AI_NOT_CONFIGURED");
    this.name = "AiNotConfiguredError";
  }
}

// Map the UI's friendly model ids to concrete Gemini model names.
const GEMINI_MODEL_MAP: Record<string, string> = {
  "gemini-flash": "gemini-2.0-flash",
  "gemini-pro": "gemini-1.5-pro",
  "gemini-1.5": "gemini-1.5-flash"
};

function resolveGeminiModel(model: string): string {
  return GEMINI_MODEL_MAP[model] || model || "gemini-2.0-flash";
}

export function isAiConfigured(prefs: AiPrefs | undefined | null): boolean {
  if (!prefs) return false;
  if (prefs.model === "ollama") return Boolean(prefs.ollamaUrl && prefs.ollamaModel);
  return Boolean(prefs.apiKey);
}

async function callGemini(
  prefs: AiPrefs,
  system: string,
  messages: AiMessage[]
): Promise<string> {
  const model = resolveGeminiModel(prefs.model);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    prefs.apiKey
  )}`;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024 }
    })
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini API ${res.status}: ${detail.slice(0, 200)}`);
  }

  const json = await res.json();
  const text =
    json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") ?? "";
  if (!text) throw new Error("Gemini returned an empty response.");
  return text.trim();
}

async function callOllama(
  prefs: AiPrefs,
  system: string,
  messages: AiMessage[]
): Promise<string> {
  const res = await fetch(`${prefs.ollamaUrl.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: prefs.ollamaModel,
      stream: false,
      messages: [{ role: "system", content: system }, ...messages]
    })
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Ollama ${res.status}: ${detail.slice(0, 200)}`);
  }
  const json = await res.json();
  const text = json?.message?.content ?? "";
  if (!text) throw new Error("Ollama returned an empty response.");
  return String(text).trim();
}

/**
 * Run a chat completion using the learner's own provider configuration.
 * Throws AiNotConfiguredError when no key/host is set.
 */
export async function runChat(
  prefs: AiPrefs,
  system: string,
  messages: AiMessage[]
): Promise<string> {
  if (!isAiConfigured(prefs)) throw new AiNotConfiguredError();
  if (prefs.model === "ollama") return callOllama(prefs, system, messages);
  return callGemini(prefs, system, messages);
}
