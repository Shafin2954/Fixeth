"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe2, GraduationCap, ArrowRight } from "lucide-react";
import { usePublicPrefs } from "@/components/public/public-lang";

// TODO: replace placeholder teammate / lecturer names before the demo.
const TEAM = [
  {
    initial: "S",
    nameEn: "Shafin Ahmed",
    nameBn: "শাফিন আহমেদ",
    roleEn: "Full-stack & AI engineering",
    roleBn: "ফুল-স্ট্যাক ও AI ইঞ্জিনিয়ারিং",
    color: "#00C896"
  },
  {
    initial: "T",
    nameEn: "Teammate Two",
    nameBn: "টিমমেট টু",
    roleEn: "Product, mobile UI & design",
    roleBn: "প্রোডাক্ট, মোবাইল UI ও ডিজাইন",
    color: "#3AA0FF"
  },
  {
    initial: "T",
    nameEn: "Teammate Three",
    nameBn: "টিমমেট থ্রি",
    roleEn: "Data, scraping & content pipeline",
    roleBn: "ডেটা, স্ক্র্যাপিং ও কনটেন্ট পাইপলাইন",
    color: "#F5A623"
  }
];

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
    nrbName: "Dr. Lecturer Name — Budapest, Hungary",
    nrbBody:
      "Our academic advisor is a Bangladeshi-origin university lecturer based in Hungary, reviewing curriculum structure and assessment design. The NRB diaspora — 15M+ strong — is both our advisory network and a launch market: diaspora parents sponsoring tech education for family back home.",
    ctaTitle: "Want to work with us?",
    ctaBody: "Institutional pilots, content partnerships, or NRB mentorship — we'd love to talk.",
    cta: "Get started free"
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
    nrbName: "ড. লেকচারার নাম — বুদাপেস্ট, হাঙ্গেরি",
    nrbBody:
      "আমাদের একাডেমিক উপদেষ্টা হাঙ্গেরিতে কর্মরত একজন বাংলাদেশি বংশোদ্ভূত বিশ্ববিদ্যালয় লেকচারার, যিনি কারিকুলাম কাঠামো ও মূল্যায়ন ডিজাইন পর্যালোচনা করেন। ১.৫ কোটিরও বেশি প্রবাসী বাংলাদেশি আমাদের উপদেষ্টা নেটওয়ার্ক এবং লঞ্চ মার্কেট — প্রবাসী অভিভাবকরা দেশে পরিবারের জন্য টেক শিক্ষা স্পনসর করছেন।",
    ctaTitle: "আমাদের সাথে কাজ করতে চান?",
    ctaBody: "প্রাতিষ্ঠানিক পাইলট, কনটেন্ট পার্টনারশিপ বা NRB মেন্টরশিপ — কথা বলতে আমরা আগ্রহী।",
    cta: "ফ্রিতে শুরু করুন"
  }
};

export default function AboutPage() {
  const { lang } = usePublicPrefs();
  const c = COPY[lang];

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400">{c.sub}</p>
      </motion.div>

      {/* Mission */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mt-14 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-[#0F0F16] sm:p-8"
      >
        <h2 className="text-xl font-extrabold">{c.missionTitle}</h2>
        <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
          {c.missionBody}
        </p>
      </motion.section>

      {/* Team */}
      <section className="mt-14">
        <h2 className="text-center text-xl font-extrabold">{c.teamTitle}</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TEAM.map((member, idx) => (
            <motion.div
              key={member.nameEn}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-[#13131A]"
            >
              <div
                className="flex size-16 items-center justify-center rounded-full text-2xl font-black text-black"
                style={{ background: member.color }}
              >
                {member.initial}
              </div>
              <h3 className="mt-4 text-base font-extrabold">
                {lang === "bn" ? member.nameBn : member.nameEn}
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {lang === "bn" ? member.roleBn : member.roleEn}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NRB / Hungarian lecturer */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
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
            <p className="mt-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">
              {c.nrbName}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {c.nrbBody}
            </p>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <section className="mt-14 text-center">
        <h2 className="text-2xl font-black">{c.ctaTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
          {c.ctaBody}
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#00C896] px-7 py-3 text-base font-extrabold text-black no-underline shadow-[0_8px_30px_rgba(0,200,150,0.35)]"
        >
          {c.cta}
          <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
