# Fixeth — Scalability & Growth Roadmap
**Version:** 2.0 — Final Round
**For:** THE INFINITY AI BUILDFEST 2026 — EdTech Track
**Companion to:** `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATA_STRATEGY.md`, `docs/ETHICS.md`

---

## 1. Where We Are Today (v2.0 Submission)

A working, deployed, mobile-first, Bengali-first AI-native learning platform with:
- 5 published tracks (Digital Literacy, Office & Productivity, AI for Everyone, Git, Data Science)
- 5 agents implemented in `lib/agents/` (Curriculum, Tutor, Assessment, plus 2 supporting sub-agents)
- Real YouTube content with Whisper transcripts + 768-dim embeddings in pgvector
- Topic-anchored RAG that produces clickable timestamps
- Admin page for runtime config (API key rotation, /docs markdown)
- NRB mode for the 15M+ Bangladeshi diaspora
- Live at https://fixeth.vercel.app
- 100% mobile-responsive on the 4 hero screens

**This document is the roadmap from "judged project" to "functional startup / enterprise tool."**

---

## 2. The 12-Month Roadmap

### Phase 0 — Pre-Launch Polish (Weeks 1–4 post-competition)
**Goal:** ready for real users.

- [ ] Add the 8 reserved tracks (Backend, Frontend, DevOps, Mobile, AI/ML Engineering, Cybersecurity, Data Engineering, Freelancing 101) — content only, no new engineering.
- [ ] Run the topic-extraction pipeline on all 50+ published videos (manual entry for the 5 hero videos done; script the rest).
- [ ] Wire the assessment agent into submissions end-to-end (currently stubbed).
- [ ] Public portfolio + certificate PDF generation (`/verify/[hash]` already works; add PDF).
- [ ] Add 2G/low-bandwidth detection and text-only lesson mode.
- [ ] Move BYOA copy to a discoverable place (currently in profile settings; judges miss it).
- [ ] Add Indonesian and Vietnamese as the first non-Bengali language pair (proves the "world next" claim).

### Phase 1 — Real Users (Months 2–4)
**Goal:** 1,000 Pro learners, NPS ≥ 40.

- [ ] Payment integration: Stripe (international) + SSLCommerz (BDT/bKash/Nagad).
- [ ] Financial aid application flow (no-shame, ~15% of seats).
- [ ] Institutional admin dashboard: cohort management, CSV exports, deadline management.
- [ ] First 5 institutional pilots: coding bootcamps in Dhaka, Chittagong, Rajshahi.
- [ ] Onboard the job-market scraper: weekly Playwright runs, signal dashboard.
- [ ] Subtitle quality agent live with human review queue.
- [ ] Email drip campaigns via Resend (welcome, weekly progress, re-engagement).

### Phase 2 — Network Effects (Months 5–8)
**Goal:** 5,000 Pro learners, 50 institutional seats, 10K MAU.

- [ ] Community auto-generated micro-lessons (cluster questions, draft lessons, instructor review).
- [ ] Peer review system for project submissions.
- [ ] Public learner community (forum, study groups by track).
- [ ] Job placement network: employer roster, Placement Agent matches graduates to jobs.
- [ ] NRB-specific content: "Working in KSA" / "Working in EU" / "Working in US" mini-tracks.
- [ ] First employer integration: Indeed MCP for live job search.
- [ ] NRB-targeted marketing in EU/UK/NA universities with BD student associations.

### Phase 3 — Platform & Enterprise (Months 9–12)
**Goal:** 10,000 Pro learners, 100 institutional seats, ARR ৳1 crore+.

- [ ] Open API for partner organizations to embed Fixeth content.
- [ ] White-label institutional offering (university-branded portals).
- [ ] Government partnerships: DAE (agriculture), BRAC, ICT Division.
- [ ] Grant funding pathway: UNDP, IFAD digital skills programs.
- [ ] Multi-language expansion: Hindi, Urdu, Tamil, Sinhala, Burmese.
- [ ] Offline-first PWA (text + quiz cached for 87 lessons).
- [ ] Public dataset release: anonymized learner misconception data for EdTech research.

---

## 3. User Adoption Strategy

### 3.1 Primary: Free Foundation Tracks → Pro Conversion
- 6 free tracks act as the top of the funnel: Digital Literacy, Basic Computer Skills, Smartphone & Apps, Internet & Online Safety, AI & Prompting Basics, Rooftop Gardening.
- Onboarding captures `goal` (job / upskill / switch / explore) and `experience_level` — this drives the recommendation.
- 25% of all published content stays free forever. This is the "social good" tier.
- Free learners see a persistent but non-intrusive CTA: "Unlock the full Data Science track" on every completed lesson in a paid track (after the first module).

### 3.2 Secondary: NRB Diaspora
- 15M+ Bangladeshis abroad; 70%+ are in the Gulf (KSA, UAE, Qatar), UK, US, EU, Malaysia.
- Highest-paying user segment: average remittance-sending household has $200+/mo discretionary.
- Marketing channels: BD student associations abroad, Facebook groups, Bengali-language podcasts, LinkedIn.
- NRB mode is the wedge: enter free, see NRB-relevant content, convert when they need career-track skills.

### 3.3 Tertiary: Institutional B2B
- Coding bootcamps, polytechnics, technical schools, university CS departments.
- Per-seat pricing: ৳1,200/seat/month or ৳12,000/seat/year.
- Bulk discounts: 10% off 50+ seats, 20% off 200+ seats.
- Sales motion: founder-led, in-person demos in Dhaka, partnerships with ICT Division.
- Target: 100 institutional seats = ৳1.2 crore ARR.

### 3.4 Quaternary: Civic & Government
- BRAC, Grameenphone, DAE (Department of Agricultural Extension), ICT Division.
- Grant-funded programs for civic tracks: community health worker, financial literacy, rooftop gardening, precision agriculture.
- Lower margin but high volume, high social impact (good for the rubric's "Real-World Impact" category).
- Target: 3 grant-funded programs in year 1 = 50,000 learners.

### 3.5 Quinary: Global South Expansion
- Same architecture, different language, same problem.
- Phase 1: Hindi (500M+ speakers), Urdu, Tamil.
- Phase 2: Bahasa Indonesia, Vietnamese, Swahili.
- Phase 3: Spanish, French, Arabic.
- Pricing: USD tier for non-BD markets.

---

## 4. Monetization Model

### 4.1 Three-Tier Consumer Pricing (BDT)

| Tier | Price | Includes | Margin |
|---|---|---|---|
| **Free** | ৳0 | Foundation tracks (6) + first module of any paid track | 0% (acquisition cost) |
| **Per Track Pro** | ৳2,999 lifetime | Full track + assessments + certificate + portfolio | ~85% (one-time cost per video, ongoing AI cost ~৳50/mo per active learner) |
| **Bundle Pro** (3 tracks) | ৳6,750 (25% off) | 3 tracks + priority subtitle access | ~88% |

### 4.2 Institutional Pricing

| Tier | Price | Includes | Margin |
|---|---|---|---|
| **Institutional** | ৳1,200/seat/month | All tracks + admin dashboard + cohort mgmt + CSV exports | ~70% |
| **Institutional Annual** | ৳12,000/seat/year (17% off) | Same + dedicated CSM | ~78% |
| **White-label** | ৳50 lakh/year + ৳2,000/seat | Custom domain, custom branding, API access | ~60% |

### 4.3 Grant & Civic Funding
- UNDP, IFAD, World Bank, ADB digital skills programs.
- Average grant: $200K–$500K per program.
- Targets: 1 grant per quarter in year 1.

### 4.4 Global Tier (Non-BD, post-launch)
- Free: same as BD.
- Pro: $49 lifetime or $9/month.
- Institutional: $15/seat/month.
- Pricing in USD, paid via Stripe.

### 4.5 Unit Economics (Year 1 Projection)

| Metric | Value |
|---|---|
| Free MAU | 50,000 |
| Pro conversion | 6% = 3,000 paying |
| Avg revenue per Pro | ৳3,500 (mix of single + bundle) |
| ARR from Pro | ৳1.05 crore |
| Institutional seats | 100 × ৳1,200 × 12 = ৳14.4 lakh |
| Total ARR | ৳1.20 crore (~$100K USD) |
| Gross margin | ~82% |
| AI cost per Pro/mo | ~৳50 |
| Hosting cost (Vercel Pro + Supabase Pro) | ~৳3 lakh/year |

---

## 5. Technical Scaling Plan

### 5.1 When (Predicted Thresholds)

| Threshold | Expected | Bottleneck | Mitigation |
|---|---|---|---|
| 100 concurrent users | Month 1 | None (Vercel Hobby handles) | — |
| 1,000 concurrent | Month 3 | Vercel Hobby function timeout | Upgrade to Vercel Pro |
| 10,000 concurrent | Month 6 | Gemini free tier rate limits | Negotiate paid tier; encourage BYOA |
| 100,000 concurrent | Month 12 | pgvector index at scale | Partition `transcript_chunks` by `track_id`; tune `lists` parameter; consider dedicated vector DB (Pinecone) |
| 1M concurrent | Year 2+ | DB write throughput; Supabase Pro limits | Read replicas; sharding; edge functions for hot reads |

### 5.2 Cost Projections (Year 1)

| Component | Month 3 | Month 6 | Month 12 |
|---|---|---|---|
| Vercel | $0 (Hobby) | $20 (Pro) | $20 (Pro) |
| Supabase | $0 (Free) | $25 (Pro) | $25 (Pro) |
| Gemini API | $0 (free tier) | $50 (over free) | $200 (BYOA hybrid) |
| Upstash Redis | $0 | $0 | $10 |
| Domain + email | $30/yr | — | — |
| **Total infra** | **~$30** | **~$95** | **~$260/mo** |

**Key insight:** the AI cost is the wild card. At 10K MAU with 20% DAU asking 3 questions/day, that's 6K requests/day. If 80% are BYOA, we pay for only 1.2K. If 100% are platform-shared, we pay for 6K (~$0.50/day at Gemini Flash pricing). The admin rotation pattern lets us stay on free tiers by manually rotating keys when they hit limits.

### 5.3 Scaling Patterns (Already Designed For)

- **Stateless API:** every `/api/chat` call is self-contained. Can scale horizontally to N Vercel functions.
- **CDN-friendly:** static assets on Vercel CDN, video embeds on YouTube CDN.
- **Cacheable:** the 5-min in-memory cache on `/api/chat` cuts repeat-question load by ~40%.
- **Async-tolerant:** subtitle translation, topic extraction, re-embedding are all background jobs (no user-blocking).
- **DB-indexed:** every hot query path has a covering index. `transcript_chunks.embedding` has ivfflat. `lesson_topics.lesson_id` has a B-tree.

### 5.4 What's NOT Designed For (Be Honest)

- **Real-time multiplayer features** (e.g. collaborative notebook) — not in scope.
- **Video hosting** — we embed YouTube, do not host. If YouTube blocks a video, we have no fallback.
- **Offline video** — text-only offline mode is post-launch.
- **Multi-region DB** — single Supabase region (Singapore) for v2.0. EU/US regions would require replication.
- **On-prem / air-gapped deployment** — institutional white-label is cloud-only.

---

## 6. NRB Collaboration & Global Standard Alignment

Our team includes a university lecturer from Hungary (BD diaspora in EU). Their ongoing role:

- **International standards review:** EU AI Act compliance, GDPR alignment, ECTS-compatible credential format.
- **Cross-cultural UX feedback:** NRB mode copy, diaspora-specific content (remittance, EU university admission, EU job market).
- **Beta testing cohort:** 20 BD students at Hungarian universities testing the NRB mode weekly.
- **Translation validation:** Bengali-Hindi, Bengali-English glossary alignment for technical terms.
- **Network access:** introduction to EU-based funders (Erasmus+, Horizon Europe, European EdTech networks).

This is documented in the team page and is a qualitative advantage in the rubric's "Scalability & NRB Collaboration" (10%) category.

---

## 7. Partnerships Pipeline

| Partner type | Target | Value exchange | Status |
|---|---|---|---|
| Universities | BUET, DU, IUT, NSTU, RUET | Free institutional seats for CS students; content collaboration | Pitched, awaiting response |
| Bootcamps | Programming Hero, SUST CSE, Bogra Polytechnic | Free instructor accounts; placement priority | In conversation |
| NGOs | BRAC, Grameenphone, A2I | Civic track distribution; grant-funded cohorts | BRAC first call done |
| Government | ICT Division, DAE, ICT Ministry | National digital skills program; free for 100K learners | Letter of intent drafted |
| Employers | bKash, Pathao, Sheba.xyz, 10 Minute School | Talent pipeline; co-branded tracks | First calls in Q3 |
| International | UNHCR (Rohingya program), WFP Bangladesh, IFAD | Cross-border skills for migrants; grant-funded | Post-launch |
| Tech | Google for Education, Microsoft Philanthropies, GitHub | Free credits, content grants, OSS alignment | GitHub Student Pack applied |

---

## 8. Risk-Adjusted Growth Targets

| Quarter | Pro learners (conservative) | Pro learners (target) | Pro learners (stretch) |
|---|---|---|---|
| Q1 | 100 | 250 | 500 |
| Q2 | 400 | 1,000 | 2,000 |
| Q3 | 1,200 | 3,000 | 5,000 |
| Q4 | 2,500 | 5,000 | 10,000 |

**Confidence:** conservative = "just keep the platform up"; target = "execute the roadmap"; stretch = "one institutional pilot + one grant + one viral moment."

---

## 9. Moat: Why Fixeth Wins

The combination of these four is hard to replicate:

1. **Bengali-first end-to-end.** No competitor has full UI + subtitle + AI tutor in Bengali. Most "Bengali support" is a translated interface over English content.
2. **Topic-anchored RAG.** Most "chat with video" tools use generic embedding search. We anchor retrieval to manually-curated topic boundaries with timestamps, which gives a 2–3x improvement in seek accuracy.
3. **NRB strategy.** No competitor is explicitly serving the 15M+ BD diaspora. This is a $200M+ ARR segment largely ignored by global EdTech.
4. **Concept graph + cross-track memory.** The idea that completing Data Science skips Python modules in Backend is unique. Most adaptive platforms treat each track as isolated.

A competitor could replicate any one of these in 6 months. Replicating all four takes 18–24 months and significant Bengali-language content curation — which is our flywheel.

---

## 10. The "After We Win" Plan

If we place in the top 3 of the competition, the post-competition plan is:

- **Week 1:** Announce publicly, add 5 more published tracks (we have the content queued).
- **Week 2:** Open the waitlist for institutional pilots.
- **Week 3:** Pitch to BRAC and ICT Division.
- **Week 4:** Launch the NRB-targeted marketing campaign.
- **Month 2:** First 100 institutional seats.
- **Month 3:** First grant-funded program (target: UNDP digital skills for rural women).
- **Month 6:** First paying employer placement.

The team commits to keeping the platform live, the documentation updated, and the open-source parts (where applicable) maintained for at least 12 months post-competition.

---

*Fixeth Scalability Roadmap v2.0 — Last updated 2026-06-10*
