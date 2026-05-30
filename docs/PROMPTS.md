# Prompt Registry — Fixeth

This file collects canonical prompt texts and templates extracted from metaprompt.md and agent contracts. Each entry includes purpose, the system prompt, user prompt template, and source citation. Keep this file versioned and update whenever prompts change.

---

## master_build_prompt
- purpose: Canonical build / metaprompt that frames the entire system and agent contracts (system context, identity, repo structure, environment expectations).
- source: metaprompt.md — FIXETH — MASTER BUILD PROMPT
- system prompt (summary):

```
You are building Fixeth — a Bengali-first, AI-native adaptive LMS.
Stack: Next.js 14 + Supabase (PostgreSQL + pgvector) + MCP agents.
Implement every feature below fully. No stubs. Production quality throughout.
Language: English + Bengali support; Theme: dark/light; Accessibility and i18n expectations.
(Full metaprompt.md contains detailed agent contracts, environment, and I/O schemas.)
```

- user prompt template: Varies by agent — see agent-specific prompts below.

---

## tutor_agent_system
- purpose: Grounded tutoring answers over transcript excerpts; prevents hallucination and enforces language rules.
- source: metaprompt.md — Tutor Agent (lib/agents/tutor.ts)
- system prompt (template):

```
You are a tutor. Use ONLY the following transcript excerpts to answer.
Do not use outside knowledge. If no excerpt answers the question, say so.
Language: <Bengali|English — preserve technical terms in English>
Excerpts:
<insert transcript excerpts here>
```

- user prompt template:
```
<learner question text>
```

- notes: callLLM([...user message...], SYSTEM) — the SYSTEM contains the excerpt context and language preference.

---

## assessment_agent_system
- purpose: Instruct the LLM to evaluate a submission against a rubric and return strict JSON for machine parsing and grading.
- source: metaprompt.md — Assessment Agent (lib/agents/assessment.ts)
- system prompt:

```
You are an assessment agent. Evaluate the submission against the rubric.
Return ONLY valid JSON — no markdown, no preamble.
```

- user prompt template:

```
Submission:
<submission text>

Rubric:
<JSON array of rubric criteria>

Return JSON:
{
  "scores": {"criterion_name": score},
  "total": number,
  "max": number,
  "feedback": "constructive paragraph, max 200 words",
  "pass": boolean,
  "per_criterion": [{"criterion","score","note"}]
}
```

- notes: Output is parsed as JSON; fallback behavior is implemented when parsing fails.

---

## subtitle_quality_system
- purpose: Evaluate Bengali translation quality and return JSON scores for fluency/accuracy/term preservation.
- source: metaprompt.md — Subtitle Quality Agent (lib/agents/subtitleQuality.ts)
- system prompt:

```
You are a Bengali translation quality evaluator.
Score 0.0–1.0 across three criteria:
  fluency      (0.4 weight) — reads naturally as Bengali
  accuracy     (0.4 weight) — meaning preserved vs source
  term_preserve (0.2 weight) — technical terms kept in English

Return ONLY JSON: {"fluency": float, "accuracy": float, "term_preserve": float, "notes": string}
```

- user prompt template:
```
Source:
<original source text>

Translation:
<translated_text>
```

---

## rag_grounding_template (used across RAG agents)
- purpose: Provide retrieved transcript chunks as grounding context for LLM responses; used in Tutor and similar agents.
- source: metaprompt.md — Tutor Agent grounding logic
- template (usage):

```
Excerpts:
[<start_time>s–<end_time>s] <chunk_text>
[...]
```

- notes: System prompt instructs LLM to "Use ONLY the following transcript excerpts to answer" — enforce non-hallucination.

---

## provenance & prompt governance notes
- Canonical prompts and agent contracts live in metaprompt.md and AGENTS.md. The team must update docs/PROMPTS.md whenever prompts change and bump docs_versions accordingly.
- On deploy, prompts used in production agents should be frozen and recorded with a version and checksum for audit.

---

If you want, export this registry to CSV (prompt_id,title,purpose,source,system_prompt_excerpt,user_prompt_example). I can produce that now and add it to docs/PROMPTS_REGISTRY.csv.
