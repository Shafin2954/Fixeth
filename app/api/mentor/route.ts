import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runServerFallbackChat, AiFallbackUnavailableError } from "@/lib/ai/server-fallback";

const bodySchema = z.object({
  question: z.string().min(1).max(4000),
  language: z.enum(["en", "bn"]).default("en"),
  cognitiveLevel: z.enum(["ELI5", "Student", "Pro", "Research"]).default("Student"),
  persona: z.string().optional()
});

const COGNITIVE_INSTRUCTIONS: Record<string, string> = {
  ELI5: "Explain like I'm 5 using simple, everyday analogies. Avoid jargon.",
  Student: "Explain at an undergraduate student level with clear examples.",
  Pro: "Answer for an experienced professional. Be precise and technical.",
  Research: "Answer at a research level with depth, nuance and references to underlying mechanics."
};

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ data: null, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 422 }
    );
  }

  const { question, language, cognitiveLevel } = parsed.data;

  const system = [
    "You are Fixeth's personal AI Mentor for an IT-placement learner in Bangladesh.",
    COGNITIVE_INSTRUCTIONS[cognitiveLevel],
    language === "bn"
      ? "Respond in Bengali (বাংলা). Use simple, clear language appropriate for Bangladeshi learners."
      : "Respond in clear English.",
    "Be encouraging and concrete. Use short code snippets when helpful.",
    "Format your response using markdown — use bullet points, bold, and code blocks as appropriate.",
    "Keep responses focused and actionable."
  ].join(" ");

  try {
    const answer = await runServerFallbackChat(system, question);
    return NextResponse.json({ data: { answer }, error: null });
  } catch (err) {
    if (err instanceof AiFallbackUnavailableError) {
      return NextResponse.json(
        {
          data: null,
          error:
            language === "bn"
              ? "AI সাময়িকভাবে অনুপলব্ধ। অ্যাডমিন প্যানেলে একটি OpenAI API কী যোগ করুন।"
              : "AI temporarily unavailable. Add an OpenAI API key in the Admin Panel."
        },
        { status: 503 }
      );
    }
    console.error("[/api/mentor]", err);
    return NextResponse.json(
      { data: null, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
