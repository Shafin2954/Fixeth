"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Globe2,
  GraduationCap,
  ArrowRight,
  Clock,
  Languages,
  TrendingUp,
  GitBranch,
  Monitor,
  Zap,
  Server,
  Database,
} from "lucide-react";
import { usePublicPrefs } from "@/components/public/public-lang";
import TeamGrid from "@/components/docs/TeamGrid";
import type { TeamMember } from "@/types";

const COPY = {
  en: {
    title: "We're building the learning platform Bangladesh deserves",
    sub: "Three builders, one conviction: quality tech education shouldn't require leaving your language behind.",
    missionTitle: "Why Fixeth",
    missionBody:
      "170 million Bangladeshis — half under 30 — and almost every serious tech education platform is English-only and one-size-fits-all. Fixeth is AI-native and Bengali-first: any YouTube lecture becomes an interactive tutor, curricula follow live job market data from Bdjobs and Chakri, and every learner gets an adaptive path instead of a fixed playlist.",
    teamTitle: "The team",
    nrbTitle: "NRB collaboration",
    nrbBadge: "Non-Resident Bangladeshi network",
    nrbName: "S M Sadman Sakib Sayor — University of Debrecen, Hungary",
    nrbBody:
      "Our academic advisor is a Bangladeshi-origin university lecturer based in Hungary, reviewing curriculum structure and assessment design. The NRB diaspora — 15M+ strong — is both our advisory network and a launch market: diaspora parents sponsoring tech education for family back home.",
    ctaTitle: "Want to work with us?",
    ctaBody: "Institutional pilots, content partnerships, or NRB mentorship — we'd love to talk.",
    cta: "Get started free",
  },
  bn: {
    title: "বাংলাদেশ যে লার্নিং প্ল্যাটফর্মের যোগ্য, আমরা সেটাই গড়ছি",
    sub: "তিনজন নির্মাতা, একটাই বিশ্বাস: মানসম্মত টেক শিক্ষার জন্য নিজের ভাষা ছেড়ে আসতে হবে না।",
    missionTitle: "কেন Fixeth",
    missionBody:
      "১৭ কোটি বাংলাদেশি — অর্ধেকের বয়স ৩০-এর নিচে — অথচ প্রায় সব মানসম্মত টেক শিক্ষা প্ল্যাটফর্ম শুধু ইংরেজিতে, সবার জন্য একই ছাঁচে। Fixeth AI-নেটিভ এবং বাংলা-প্রথম: যেকোনো ইউটিউব লেকচার হয়ে ওঠে ইন্টারঅ্যাক্টিভ টিউটর, কারিকুলাম চলে Bdjobs ও Chakri-র লাইভ জব মার্কেট ডেটা অনুযায়ী, আর প্রতিটি শিক্ষার্থী পায় নিজস্ব অ্যাডাপটিভ পাথ।",
    teamTitle: "আমাদের টিম",
    nrbTitle: "NRB সহযোগিতা",
    nrbBadge: "প্রবাসী বাংলাদেশি নেটওয়ার্ক",
    nrbName: "এস এম সাদমান সাকিব সায়োর — ইউনিভার্সিটি অব ডেব্রেসেন, হাঙ্গেরি",
    nrbBody:
      "আমাদের একাডেমিক উপদেষ্টা হাঙ্গেরিতে কর্মরত একজন বাংলাদেশি বংশোদ্ভূত বিশ্ববিদ্যালয় লেকচারার, যিনি কারিকুলাম কাঠামো ও মূল্যায়ন ডিজাইন পর্যালোচনা করেন। দেড় কোটিরও বেশি প্রবাসী বাংলাদেশি আমাদের উপদেষ্টা নেটওয়ার্ক এবং লঞ্চ মার্কেট — প্রবাসী অভিভাবকরা দেশে পরিবারের জন্য টেক শিক্ষা স্পনসর করছেন।",
    ctaTitle: "আমাদের সাথে কাজ করতে চান?",
    ctaBody: "প্রতিষ্ঠানিক পাইলট, কনটেন্ট পার্টনারশিপ বা NRB মেন্টরশিপ — কথা বলতে আমরা আগ্রহী।",
    cta: "ফ্রিতে শুরু করুন",
  },
};

const LANDING_COPY = {
  en: {
    heroEyebrow: "AI-native learning for Bangladesh",
    featuresTitle: "See Fixeth in action",
    pipelineTitle: "How content gets made",
    pipelineBody:
      "Admins drop a YouTube URL as a lesson in the database. A scheduled n8n workflow picks it up, a Python server downloads the audio and transcribes it with Whisper, the transcript is chunked (~150 words each), embedded locally with Ollama (nomic-embed-text), and written into the vector store. Content creation is a drop-in-a-link operation — no manual transcription.",
    conceptsTitle: "Built for how Bangladesh actually learns",
    techStackTitle: "Built With",
    ctaPrimary: "Get started free",
    stats: [
      { value: "5+", label: "Tracks" },
      { value: "EN · বাংলা", label: "Languages" },
      { value: "6", label: "Job signals" },
    ],
  },
  bn: {
    heroEyebrow: "বাংলাদেশের জন্য AI-নেটিভ শিক্ষা",
    featuresTitle: "Fixeth সরাসরি দেখুন",
    pipelineTitle: "কনটেন্ট কীভাবে তৈরি হয়",
    pipelineBody:
      "অ্যাডমিন একটি YouTube URL ডেটাবেজে লেসন হিসেবে যোগ করেন। একটি নির্ধারিত n8n ওয়ার্কফ্লো এটি ধরে নেয়, Python সার্ভার অডিও ডাউনলোড করে Whisper দিয়ে ট্রান্সক্রাইব করে, ট্রান্সক্রিপ্ট ~১৫০ শব্দের চাংকে ভাগ হয়, Ollama (nomic-embed-text) দিয়ে লোকালি এম্বেড হয়ে ভেক্টর স্টোরে যায়। কনটেন্ট তৈরি মানে শুধু একটি লিংক দেওয়া — ম্যানুয়াল ট্রান্সক্রিপশন নেই।",
    conceptsTitle: "বাংলাদেশ যেভাবে শেখে, সেভাবেই তৈরি",
    techStackTitle: "কীভাবে তৈরি করা হয়েছে",
    ctaPrimary: "ফ্রিতে শুরু করুন",
    stats: [
      { value: "5+", label: "ট্র্যাক" },
      { value: "ENG · বাংলা", label: "ভাষা" },
      { value: "6", label: "জব সিগন্যাল" },
    ],
  },
};

const SHOWCASE_FEATURES = [
  {
    title: { en: "Timestamp-seek AI chat", bn: "টাইমস্ট্যাম্প-সিক AI চ্যাট" },
    body: {
      en: "Ask a question in the chat, and the AI locates the exact moment in the video where it's explained — then seeks there instantly. No scrubbing, no guessing.",
      bn: "চ্যাটে প্রশ্ন করুন, AI ভিডিওর সঠিক মুহূর্তটি খুঁজে তৎক্ষণাৎ সেখানে চলে যায়। স্ক্রাব করতে হবে না, অনুমান করতে হবে না।",
    },
    media: { type: "video" as const, src: "/features/chat.mp4" },
    reverse: false,
  },
  {
    title: { en: "AI Mentor with memory", bn: "মেমরি-সহ AI মেন্টর" },
    body: {
      en: "The AI Mentor tracks your progress, struggles, and milestones across sessions — building a persistent cognitive profile so every answer is personalised to you.",
      bn: "AI মেন্টর সেশন জুড়ে আপনার অগ্রগতি, দুর্বলতা ও মাইলস্টোন ট্র্যাক করে — একটি স্থায়ী কগনিটিভ প্রোফাইল তৈরি করে যাতে প্রতিটি উত্তর আপনার জন্য ব্যক্তিগত।",
    },
    media: { type: "video" as const, src: "/features/mentor.mp4", poster: "/features/ai_mentor_page.png" },
    reverse: true,
  },
  {
    title: { en: "In-browser Python IDE", bn: "ব্রাউজারেই Python IDE" },
    body: {
      en: "A real Pyodide-powered code editor with terminal — run Python directly in the browser, no install needed. Connect GitHub or upload files.",
      bn: "Pyodide-চালিত রিয়েল কোড এডিটর ও টার্মিনাল — ব্রাউজারেই Python চালান, কোনো ইনস্টলেশন নেই। GitHub কানেক্ট বা ফাইল আপলোড করুন।",
    },
    media: { type: "image" as const, src: "/features/codespace.png", alt: "Fixeth Codespace IDE" },
    reverse: false,
  },
  {
    title: { en: "In-browser Jupyter notebook", bn: "ব্রাউজারেই Jupyter নোটবুক" },
    body: {
      en: "A full notebook experience running a real Pyodide kernel — write code cells, markdown, and see live output without leaving the platform.",
      bn: "পূর্ণ নোটবুক অভিজ্ঞতা রিয়েল Pyodide কার্নেলে — কোড সেল, মার্কডাউন লিখুন এবং প্ল্যাটফর্ম না ছেড়েই লাইভ আউটপুট দেখুন।",
    },
    media: { type: "image" as const, src: "/features/notebook.png", alt: "Fixeth Notebook" },
    reverse: true,
  },
];

const CONCEPTS = [
  {
    title: { en: "Bengali-first, always", bn: "সবসময় বাংলা-প্রথম" },
    body: {
      en: "UI, subtitles and the AI tutor work in both English and বাংলা. Technical terms stay in English.",
      bn: "UI, সাবটাইটেল এবং AI টিউটর — ইংরেজি ও বাংলা দুই ভাষাতেই।",
    },
    Icon: Languages,
  },
  {
    title: { en: "Live job market signals", bn: "লাইভ জব মার্কেট সিগন্যাল" },
    body: {
      en: "Skills demand scraped weekly from Bdjobs and Chakri. Your curriculum follows what employers want.",
      bn: "Bdjobs ও Chakri থেকে সাপ্তাহিক স্কিল চাহিদা সংগ্রহ।",
    },
    Icon: TrendingUp,
  },
  {
    title: { en: "Adaptive learning path", bn: "অ্যাডাপটিভ লার্নিং পাথ" },
    body: {
      en: "A concept graph tracks prerequisites — skip what you know, get help where you struggle.",
      bn: "কনসেপ্ট গ্রাফ পূর্বশর্ত ট্র্যাক করে — যা জানেন তা স্কিপ করুন।",
    },
    Icon: GitBranch,
  },
  {
    title: { en: "Timestamp-seek AI chat", bn: "টাইমস্ট্যাম্প-সিক AI চ্যাট" },
    body: {
      en: "Ask any question. The AI finds the exact moment in the video where it's explained.",
      bn: "যেকোনো প্রশ্ন করুন। AI ভিডিওর সঠিক মুহূর্ত খুঁজে বের করে।",
    },
    Icon: Clock,
  },
];

const TECH_STACK_LAYERS = [
  {
    title: { en: "Frontend & UI", bn: "ফ্রনটএন্ড & UI" },
    items: [
      { Icon: Monitor, text: { en: "Next.js 14 (App Router)", bn: "Next.js 14 (App Router)" } },
      { Icon: Zap, text: { en: "TypeScript + Tailwind + shadcn/ui", bn: "TypeScript + Tailwind + shadcn/ui" } },
    ],
  },
  {
    title: { en: "AI & Intelligence", bn: "AI & বুদ্ধিমত্তা" },
    items: [
      { Icon: Server, text: { en: "Claude (Reasoning) + GPT-4o (Translation)", bn: "Claude (Reasoning) + GPT-4o (Translation)" } },
      { Icon: Database, text: { en: "pgvector + PostgreSQL (RAG + Concept Graph)", bn: "pgvector + PostgreSQL (RAG + Concept Graph)" } },
    ],
  },
  {
    title: { en: "Developer Tools", bn: "ডেভেলপার টুলস" },
    items: [
      { Icon: Server, text: { en: "Cursor + Claude Code + Lovable", bn: "Cursor + Claude Code + Lovable" } },
      { Icon: Zap, text: { en: "Judge0 CE + Playwright + Supabase", bn: "Judge0 CE + Playwright + Supabase" } },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  const { lang } = usePublicPrefs();
  const c = COPY[lang];
  const landing = LANDING_COPY[lang];
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((res) => {
        const members: TeamMember[] = res?.data?.members ?? [];
        // exclude Sadman — already featured in the NRB block
        setTeamMembers(members.filter((m) => !m.full_name.includes("Sadman")));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:py-20">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[640px] -translate-x-1/2 rounded-full bg-[#00C896]/15 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 lg:grid-cols-2 lg:gap-14 lg:pb-24 lg:pt-20">
          {/* Text */}
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.12 }}
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00C896]/30 bg-[#00C896]/10 px-3.5 py-1.5 text-xs font-bold text-[#00A87E] dark:text-[#00C896]"
            >
              <span className="size-1.5 rounded-full bg-[#00C896]" />
              {landing.heroEyebrow}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-3xl font-black tracking-tight sm:text-4xl"
            >
              {c.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-3 max-w-xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg"
            >
              {c.sub}
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-10 flex gap-8"
            >
              {landing.stats.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-xl font-black text-neutral-900 dark:text-white">{value}</div>
                  <div className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#00C896] px-6 py-3 text-base font-extrabold text-black no-underline shadow-[0_8px_30px_rgba(0,200,150,0.35)] transition-transform hover:-translate-y-0.5"
              >
                {landing.ctaPrimary}
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero mock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl dark:border-neutral-800 dark:bg-[#13131A]">
              {/* Mock video frame */}
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex size-14 items-center justify-center rounded-full bg-[#00C896]"
                >
                  <svg className="ml-0.5 size-[22px] fill-black" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </motion.div>
                {/* Seek bar with animated playhead jump */}
                <div className="absolute inset-x-3 bottom-3">
                  <div className="relative h-1.5 rounded-full bg-white/20">
                    <motion.div
                      className="h-full rounded-full bg-[#00C896]"
                      animate={{ width: ["18%", "18%", "72%", "72%"] }}
                      transition={{ duration: 5, times: [0, 0.5, 0.62, 1], repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute -top-7 rounded-md bg-[#F5A623] px-1.5 py-0.5 font-mono text-[10px] font-black text-black"
                      animate={{ left: ["18%", "18%", "68%", "68%"], opacity: [0, 0, 1, 1] }}
                      transition={{ duration: 5, times: [0, 0.5, 0.62, 1], repeat: Infinity }}
                    >
                      14:32
                    </motion.div>
                  </div>
                </div>
              </div>
              {/* Mock chat */}
              <div className="mt-4 flex flex-col gap-2.5">
                <div className="self-end rounded-2xl rounded-br-md bg-[#00C896] px-3.5 py-2 text-sm font-semibold text-black">
                  What is a prompt?
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="self-start rounded-2xl rounded-bl-md bg-neutral-100 px-3.5 py-2 text-sm leading-relaxed text-neutral-800 dark:bg-[#22222E] dark:text-neutral-200"
                >
                  A prompt is the instruction you give the AI — explained at{" "}
                  <motion.span
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex items-center gap-1 rounded-md border border-[#F5A623]/40 bg-[#F5A623]/15 px-1.5 py-0.5 font-mono text-xs font-black text-[#C07000] dark:text-[#F5A623]"
                  >
                    ⏱ 14:32
                  </motion.span>{" "}
                  in this lecture.
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                  className="self-start text-xs font-bold text-[#00A87E] dark:text-[#00C896]"
                >
                  ▶ Video seeks to 14:32
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-[#0F0F16] sm:p-8"
      >
        <h2 className="text-xl font-extrabold">{c.missionTitle}</h2>
        <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
          {c.missionBody}
        </p>
      </motion.section>

      {/* ── Feature showcase blocks ───────────────────────────── */}
      <section className="mt-20">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl font-black tracking-tight sm:text-3xl"
        >
          {landing.featuresTitle}
        </motion.h2>

        <div className="mt-14 flex flex-col gap-20">
          {SHOWCASE_FEATURES.map((feat, idx) => (
            <motion.div
              key={feat.title.en}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.05 }}
              className={`flex flex-col items-center gap-10 lg:flex-row${feat.reverse ? " lg:flex-row-reverse" : ""}`}
            >
              {/* Media */}
              <div className="w-full lg:w-3/5">
                {feat.media.type === "video" ? (
                  <video
                    src={feat.media.src}
                    poster={"poster" in feat.media ? feat.media.poster : undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full rounded-2xl border border-neutral-200 shadow-xl dark:border-neutral-800"
                  />
                ) : (
                  <Image
                    src={feat.media.src}
                    alt={feat.media.alt ?? feat.title.en}
                    width={900}
                    height={560}
                    className="w-full rounded-2xl border border-neutral-200 shadow-xl dark:border-neutral-800"
                  />
                )}
              </div>

              {/* Text */}
              <div className="w-full lg:w-2/5">
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#00A87E] dark:text-[#00C896]">
                  Feature {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-black tracking-tight sm:text-2xl">
                  {lang === "en" ? feat.title.en : feat.title.bn}
                </h3>
                <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {lang === "en" ? feat.body.en : feat.body.bn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── n8n pipeline section ──────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="mt-24"
      >
        <div className="flex flex-col items-center gap-10 lg:flex-row">
          <div className="w-full lg:w-3/5">
            <Image
              src="/features/n8n.gif"
              alt="n8n automation pipeline"
              width={900}
              height={560}
              unoptimized
              className="w-full rounded-2xl border border-neutral-200 shadow-xl dark:border-neutral-800"
            />
          </div>
          <div className="w-full lg:w-2/5">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#F5A623]/30 bg-[#F5A623]/10 px-3 py-1 text-xs font-bold text-[#C07000] dark:text-[#F5A623]">
              Automation
            </span>
            <h2 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">
              {landing.pipelineTitle}
            </h2>
            <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-400">
              {landing.pipelineBody}
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── Concept strip ─────────────────────────────────────── */}
      <section className="mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl font-black tracking-tight sm:text-3xl"
        >
          {landing.conceptsTitle}
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONCEPTS.map((concept, idx) => (
            <motion.div
              key={concept.title.en}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-[#13131A]"
            >
              <div className="mb-3.5 flex size-10 items-center justify-center rounded-xl bg-[#00C896]/10 text-[#00A87E] dark:text-[#00C896]">
                <concept.Icon size={20} />
              </div>
              <h3 className="text-base font-extrabold">
                {lang === "en" ? concept.title.en : concept.title.bn}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {lang === "en" ? concept.body.en : concept.body.bn}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Tech stack ────────────────────────────────────────── */}
      <section className="mt-20">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl font-black tracking-tight sm:text-3xl"
        >
          {landing.techStackTitle}
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TECH_STACK_LAYERS.map((layer) => (
            <div key={layer.title.en}>
              <h3 className="mb-4 text-base font-semibold text-neutral-800 dark:text-neutral-200">
                {lang === "en" ? layer.title.en : layer.title.bn}
              </h3>
              <div className="space-y-2">
                {layer.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#00C896]/10 text-[#00A87E] dark:text-[#00C896]">
                      <item.Icon size={16} />
                    </div>
                    <span>{lang === "en" ? item.text.en : item.text.bn}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────── */}
      {teamMembers.length > 0 && (
        <section className="mt-20">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-center text-xl font-extrabold"
          >
            {c.teamTitle}
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            <TeamGrid members={teamMembers} />
          </motion.div>
        </section>
      )}

      {/* ── NRB collaboration ─────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="mt-14 overflow-hidden rounded-2xl border border-[#3AA0FF]/30 bg-gradient-to-br from-[#3AA0FF]/8 to-transparent p-6 dark:border-[#3AA0FF]/25 sm:p-8"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#3AA0FF]/15 text-[#2060CC] dark:text-[#3AA0FF]">
            <Globe2 size={26} />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3AA0FF]/30 bg-[#3AA0FF]/10 px-3 py-1 text-xs font-bold text-[#2060CC] dark:text-[#3AA0FF]">
              <GraduationCap size={13} />
              {c.nrbBadge}
            </span>
            <h2 className="mt-3 text-lg font-extrabold">{c.nrbTitle}</h2>
            <p className="mt-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">{c.nrbName}</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{c.nrbBody}</p>
          </div>
        </div>
      </motion.section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="mt-14 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-black">{c.ctaTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            {c.ctaBody}
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#00C896] px-7 py-3 text-base font-extrabold text-black no-underline shadow-[0_8px_30px_rgba(0,200,150,0.35)] transition-transform hover:-translate-y-0.5"
          >
            {c.cta}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
