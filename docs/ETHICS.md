# Fixeth — Ethics, Bias & Responsible AI
**Version:** 2.0 — Final Round
**For:** THE INFINITY AI BUILDFEST 2026 — EdTech Track
**Companion to:** `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATA_STRATEGY.md`, `docs/SCALABILITY_ROADMAP.md`

> This document describes Fixeth's stance on ethical AI, bias mitigation, transparency, and the safeguards we have built (or plan to build) into every system that touches a learner. It is the "evidence of how you mitigate bias and ensure transparency" deliverable required by the final-round rubric.

---

## 1. Core Ethical Principles

We commit to these five principles. Every feature, every model choice, every UI decision is measured against them.

| Principle | What it means in practice |
|---|---|
| **Transparency** | The learner always knows what the AI is doing, why, and on what data. No black boxes. |
| **Non-hallucination** | The AI cannot fabricate. It is grounded in retrieved content or it says "I don't know." |
| **Fairness** | The system does not disadvantage any learner by gender, religion, ethnicity, location, or device. |
| **Privacy** | We collect the minimum data required, store it securely, and never sell it. |
| **Human agency** | The learner is always in control. The AI suggests, the learner decides. |

---

## 2. The Hallucination Problem & Our Solution

### 2.1 The problem
Large language models confidently generate plausible-sounding answers even when they have no factual basis. In an educational context, this is dangerous: a learner who trusts the AI can be misled into learning wrong things.

### 2.2 Our mitigation: RAG grounding with a hard retrieval threshold
Every AI response in the Tutor Agent goes through this chain:

```
User question
  ↓
Embed question (Ollama nomic-embed-text, 768-dim)
  ↓
Topic-anchored cosine search over transcript_chunks
  ↓
Filter: similarity >= 0.7
  ↓
If 0 chunks pass → "I couldn't find this in the video."
If >= 1 chunk passes → ground the LLM's answer in ONLY those chunks
  ↓
LLM is explicitly instructed: "Use ONLY the following excerpts. Do not use outside knowledge."
  ↓
Answer includes [ts:MM:SS] citation tied to the source chunk
  ↓
Learner can verify: click the timestamp, see the original video moment
```

**Key claim:** the system cannot hallucinate outside the video content because the LLM has no access to anything else. If the video doesn't cover the question, the system says so.

### 2.3 What "grounded" means
The system prompt for the Tutor Agent is:

```
You are Fixeth's in-video tutor for the lesson "<lesson_title>".
You are given the lesson transcript as lines that each begin with a
timestamp marker in the exact form [ts:MM:SS].

When you reference a moment in the video, you MUST cite it by copying the
EXACT [ts:MM:SS] marker from the transcript line you are drawing from —
never invent or reformat a timestamp.

Prefer answering from the transcript; if it does not cover the question,
say so briefly, then give a short general answer without a marker.

Respond in <language>.
```

This prompt is the contract. Any LLM call goes through it. No exceptions.

### 2.4 Known limitations (we are honest)
- The LLM can still *misinterpret* the retrieved chunks. If the chunk is ambiguous, the LLM might pick the wrong interpretation. We mitigate by including 3–5 chunks for context, not just 1.
- The LLM can still *omit* the timestamp marker if the prompt is misread. We parse responses for the marker format; if missing, the UI shows "no timestamp found" and suggests rephrasing.
- The embedding model can fail to find a relevant chunk that's worded differently. We mitigate by the 0.7 threshold — better to say "I don't know" than to give a wrong answer.
- Manual topic boundaries are imperfect. A bad topic split → bad retrieval. We mitigate by allowing multiple topics per video and ranking by similarity.

---

## 3. Bias in the AI Tutor

### 3.1 Sources of bias we have considered
1. **Training data bias in the LLM.** Gemini 2.0 Flash was trained on internet-scale data with documented biases (gender, race, religion, language).
2. **Translation bias.** Bengali is underrepresented in LLM training data. Translations to/from Bengali can be stilted or carry cultural assumptions.
3. **Content bias.** Our curated YouTube videos are English-first. The Bengali subtitles are machine-translated. The voices, examples, and cultural references skew toward Western contexts.
4. **Selection bias in the curriculum.** We chose tracks based on job-market signals (which themselves are biased toward formal-sector employment).

### 3.2 Mitigations we have built

| Bias | Mitigation |
|---|---|
| LLM training bias | RAG grounding: the LLM has no access to its training knowledge, only retrieved chunks. Stereotypes cannot leak through if they are not in the source material. |
| Translation bias | Glossary enforcement: 50–100 technical terms are preserved in English to avoid translation ambiguity. Subtitle quality scoring catches the worst translations. |
| Content bias | NRB mode surfaces content that is BD-context-aware. We are actively curating more BD-origin content creators (post-launch). |
| Curriculum selection bias | Job-market signals (post-launch) surface what employers actually want, not what we think is important. Admin review before any curriculum change. |
| Gender / religion / ethnicity | The AI tutor is given no demographic data about the learner. The personalization engine skips lessons based on demonstrated mastery, not on identity. |

### 3.3 What we have NOT solved (be honest)
- The LLM may still reflect the biases of its training data in *phrasing* — even when grounded in retrieved content, it may choose wording that subtly favors one group over another. We rely on the learner to apply critical thinking.
- The curriculum selection reflects our team's blind spots. We are 3 people. We do not have a diversity advisory board. (We will, post-launch.)
- The Bengali translation quality varies by topic. Highly technical content is worse than conversational content. We are tracking this metric but do not have a fix yet.

---

## 4. Bias in the Personalization Engine

### 4.1 What the adaptive path does
For a learner enrolled in a track, the adaptive path:
1. Fetches the concept graph for that track.
2. Looks up the learner's mastery scores for each concept (from `learner_mastery`).
3. Builds an ordered list of concepts:
   - score >= 80 → skip ("already mastered")
   - score < 60 + attempts > 0 → inject a remedial micro-lesson
   - else → include in normal order

### 4.2 What could go wrong (bias-wise)
- **Self-fulfilling skip:** if a learner performs poorly on a diagnostic, they get remedial content. If they perform well, they skip. If the diagnostic itself is biased (e.g. assumes prior knowledge), the path is biased.
- **Mastery threshold:** we use 80 for "mastered" and 60 for "needs help." These are arbitrary. They could be set too high (causing over-skipping) or too low (causing frustration).
- **Concept graph bias:** the graph reflects our team's understanding of the domain. For Data Science, this is well-trodden. For emerging topics (AI agents, prompt engineering), the graph is incomplete.

### 4.3 Mitigations
- **Diagnostic must have ≥ 8 questions** to avoid single-question misplacement (per `plan.md`).
- **Learner can override the path at any time** — the path is a suggestion, not a constraint.
- **Mastery thresholds are shown to the learner** — "We consider you mastered if you score 80% or higher on the concept quiz."
- **Path is auditable:** the `adaptive_paths.path_json` is stored and the learner can see exactly which concepts were skipped and why.

### 4.4 What we have NOT solved
- The 80/60 thresholds have not been empirically tuned. They are reasonable defaults but not validated against real learner outcomes.
- The concept graph for tracks other than Data Science is sparse. The adaptive path for those tracks is essentially a linear sequence.

---

## 5. Bias in Bengali Translation

### 5.1 The problem
Bengali is a low-resource language relative to English. LLM translations to Bengali can:
- Use stilted, formal register that learners don't speak
- Drop technical terms in translation ("function" → "কার্যকরণ" instead of keeping "function")
- Carry cultural assumptions (e.g. idioms that don't translate)
- Be inconsistent (different translations of the same term in different lessons)

### 5.2 Mitigations
- **Glossary enforcement:** technical terms are explicitly listed in the system prompt as "keep in English." The LLM is graded on term preservation (0.2 weight in the quality score).
- **Quality scoring:** the Subtitle Quality Agent scores fluency, accuracy, and term preservation. Below 0.85, the translation goes to human review (post-launch).
- **Learner flagging:** every subtitle segment has a "Report incorrect translation" button. Flags feed the review queue.
- **Idiom test:** every translation is checked for English idioms that didn't translate. If found, the LLM is re-prompted with a "do not translate idioms literally" instruction.

### 5.3 What we have NOT solved
- We do not have a native Bengali reviewer on the team. Quality scoring is LLM-based, not human-based. (We are recruiting, post-launch.)
- Some videos have content that simply does not have a good Bengali equivalent (e.g. very specific Western software tutorials). For these, the English transcript is the source of truth and the Bengali subtitle is a best-effort translation.

---

## 6. Data Privacy & Learner Rights

See `docs/DATA_STRATEGY.md` for the full data strategy. Summary of learner rights:

| Right | Implementation |
|---|---|
| Access | Export all my data as JSON |
| Rectification | Edit my profile, change my language, change my goal |
| Deletion | Delete my account; all data removed within 30 days |
| Portability | JSON export of profile + progress + quiz results |
| Object | Opt out of personalization; opt out of AI features |
| Withdraw consent | Toggle off NRB mode, toggle off AI tutor, toggle off tracking |
| Complain | Contact form on `/about` page |

**We do not:**
- Sell learner data to third parties.
- Share learner data with advertisers.
- Use learner data to train third-party LLMs.
- Store BYOA API keys on our servers.
- Track learners across other sites (no third-party analytics scripts).

---

## 7. Transparency Mechanisms

### 7.1 To learners
- **AI indicator badge:** every AI-generated response has a "✨ AI-generated" indicator.
- **Source citation:** every Tutor Agent response includes a clickable `[ts:MM:SS]` marker.
- **Confidence threshold:** when retrieval fails, the system says "I couldn't find this in the video" rather than guessing.
- **Adaptive path explainability:** the dashboard shows the full adaptive path with skip reasons.
- **BYOA status:** profile shows whether the user is using their own key or the platform's shared key.
- **Data export:** users can download all their data at any time.

### 7.2 To admins
- **Audit log:** every admin action is logged with timestamp, action, details, and actor.
- **Read-only logs:** admins can read `admin_audit` but cannot edit it.
- **No impersonation:** admins cannot view a learner's screen "as them."

### 7.3 To the public
- **All prompts are documented** in `docs/PROMPTS.md` with version history.
- **All model choices are documented** in `docs/ARCHITECTURE.md` §7.
- **All data sources are documented** in `docs/DATA_STRATEGY.md`.
- **The PRD maps to the rubric** in `docs/PRD.md` §14 — every claim has a backing artifact.

### 7.4 To regulators
- **Privacy policy** on `/privacy` (post-launch, drafted in this PRD's §11 of `DATA_STRATEGY.md`).
- **AI policy** on `/ai-policy` (post-launch, drafted in this document).
- **Contact for data requests:** admin@fixeth.ai.

---

## 8. Human Agency

The learner is always in control. The system never:
- Forces a learner to take a lesson.
- Locks a learner out of a track for poor performance.
- Auto-publishes any content the learner creates.
- Makes a decision about the learner's career or financial aid without human review.
- Persists state the learner cannot see or delete.

The system always:
- Shows the learner what it is doing and why.
- Lets the learner override any AI suggestion (path order, skipped concept, recommended track).
- Lets the learner delete their account and all associated data.
- Lets the learner export their data at any time.

---

## 9. The Cases We Are Prepared To Defend

### 9.1 "What if a learner asks the AI something harmful?"
- The RAG grounding limits the AI to retrieved chunks. If the question is off-topic, the AI says "I couldn't find this in the video."
- We do not have a general-purpose chat. Every chat is anchored to a specific lesson's transcript.
- We do not have a "free-form" AI mentor in v2.0. The AI Mentor is a stub.

### 9.2 "What if a learner uses AI to cheat on a quiz?"
- Quizzes are short-answer or MCQ. We do not have take-home exams in v2.0.
- The Assessment Agent (post-launch) will check submissions for AI-generated content patterns. For v2.0, we acknowledge this is a limitation.

### 9.3 "What if a learner is demotivated by the adaptive path?"
- The learner can override the path at any time.
- The path is shown as a suggestion, not a constraint.
- We do not show "you failed" or "you are behind" — we show "here's what to do next."

### 9.4 "What if a judge asks if we used their data to train?"
- We did not. The fine-tuning section of `plan.md` says "No evidence of LoRA/QLoRA or full model fine-tuning in repo." This is current and remains true.
- BYOA keys never reach our server. We have no access to them.

### 9.5 "What if a judge asks about the EU AI Act?"
- Fixeth is classified as a "limited risk" AI system under the EU AI Act.
- Our transparency obligations (source citation, visible AI indicators, public model documentation) meet the requirements.
- For high-risk use cases (e.g. employment decisions based on our assessments), we do not make such decisions. The Assessment Agent gives feedback; humans make the final call.

---

## 10. Open Questions We Acknowledge

These are the ethical questions we have not fully answered. We list them honestly because a responsible AI team knows what it does not know.

1. **Long-term effect of AI tutors on learning outcomes.** Does an AI tutor help or hurt deep learning? We do not have RCT data. We plan to study this in year 1.
2. **Cultural representation in the curriculum.** Our curriculum skews toward Western software tools and examples. We are actively curating more BD-origin content, but we are not there yet.
3. **Bengali language quality at the edge.** The quality of our Bengali translations degrades for highly technical or culturally specific content. We do not have a quality floor enforced at the segment level.
4. **Learner data after account deletion.** When a learner deletes their account, we delete from the live DB. Backups may retain data for up to 30 days (Supabase backup cycle). We do not control backup retention beyond that.
5. **Model drift.** The Gemini API may update its model behind the scenes. Our system prompts are written for Gemini 2.0 Flash as of submission time. A model update could change behavior. We will re-validate quarterly.

---

## 11. Our Commitment

We commit to:
- Publishing updates to this document whenever we change a model, a prompt, a data source, or a safeguard.
- Notifying learners (via in-app banner + email) of any material change to how their data is used.
- Responding to data requests within 30 days.
- Maintaining a public changelog of AI-related decisions.
- Reviewing this document every 6 months.

If you find an ethical issue with Fixeth, email us at **ethics@fixeth.ai**. We will respond within 7 days.

---

*Fixeth Ethics v2.0 — Last updated 2026-06-10*
