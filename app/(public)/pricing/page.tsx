"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { usePublicPrefs } from "@/components/public/public-lang";

const COPY = {
  en: {
    title: "Simple, honest pricing",
    sub: "Start free. Upgrade when you're ready. Institutional plans for schools, NGOs and training centers.",
    popular: "Most popular",
    cta: "Get started",
    ctaContact: "Contact us",
    perMonth: "/month",
    tiers: [
      {
        name: "Free",
        price: "৳0",
        blurb: "Everything you need to start learning today.",
        features: [
          "All published tracks",
          "AI video chat (shared platform quota)",
          "Bengali + English subtitles",
          "Progress tracking & streaks",
          "Job market signals dashboard"
        ]
      },
      {
        name: "Pro",
        price: "৳499",
        blurb: "For serious learners aiming at a job offer.",
        popular: true,
        features: [
          "Everything in Free",
          "Priority AI quota — no waiting",
          "Bring your own AI key (BYOA)",
          "Personalized adaptive path",
          "Verified skill certificates",
          "Mock interview practice"
        ]
      },
      {
        name: "Institutional",
        price: "Custom",
        blurb: "For schools, NGOs and training programs.",
        features: [
          "Everything in Pro",
          "Cohort dashboards & reporting",
          "Custom curriculum mapping",
          "Bulk learner onboarding",
          "Dedicated support",
          "Offline-friendly deployments"
        ]
      }
    ],
    note: "Payments are not live yet during the pilot — every learner currently gets Free access. Pricing shown reflects the launch plan."
  },
  bn: {
    title: "সহজ, স্বচ্ছ মূল্য",
    sub: "ফ্রিতে শুরু করুন। প্রস্তুত হলে আপগ্রেড করুন। স্কুল, এনজিও ও ট্রেনিং সেন্টারের জন্য প্রাতিষ্ঠানিক প্ল্যান।",
    popular: "সবচেয়ে জনপ্রিয়",
    cta: "শুরু করুন",
    ctaContact: "যোগাযোগ করুন",
    perMonth: "/মাস",
    tiers: [
      {
        name: "ফ্রি",
        price: "৳০",
        blurb: "আজই শেখা শুরু করতে যা যা দরকার, সবই।",
        features: [
          "সব প্রকাশিত ট্র্যাক",
          "AI ভিডিও চ্যাট (শেয়ার্ড প্ল্যাটফর্ম কোটা)",
          "বাংলা + ইংরেজি সাবটাইটেল",
          "প্রগ্রেস ট্র্যাকিং ও স্ট্রিক",
          "জব মার্কেট সিগন্যাল ড্যাশবোর্ড"
        ]
      },
      {
        name: "প্রো",
        price: "৳৪৯৯",
        blurb: "যারা চাকরির অফার পেতে সিরিয়াস, তাদের জন্য।",
        popular: true,
        features: [
          "ফ্রি-র সবকিছু",
          "অগ্রাধিকার AI কোটা — অপেক্ষা নেই",
          "নিজের AI কী ব্যবহার করুন (BYOA)",
          "ব্যক্তিগতকৃত অ্যাডাপটিভ পাথ",
          "ভেরিফাইড স্কিল সার্টিফিকেট",
          "মক ইন্টারভিউ অনুশীলন"
        ]
      },
      {
        name: "প্রাতিষ্ঠানিক",
        price: "আলোচনাসাপেক্ষ",
        blurb: "স্কুল, এনজিও ও ট্রেনিং প্রোগ্রামের জন্য।",
        features: [
          "প্রো-র সবকিছু",
          "কোহর্ট ড্যাশবোর্ড ও রিপোর্টিং",
          "কাস্টম কারিকুলাম ম্যাপিং",
          "বাল্ক লার্নার অনবোর্ডিং",
          "ডেডিকেটেড সাপোর্ট",
          "অফলাইন-বান্ধব ডিপ্লয়মেন্ট"
        ]
      }
    ],
    note: "পাইলট চলাকালীন পেমেন্ট এখনো চালু হয়নি — সব শিক্ষার্থী বর্তমানে ফ্রি অ্যাক্সেস পাচ্ছেন। প্রদর্শিত মূল্য লঞ্চ পরিকল্পনা অনুযায়ী।"
  }
};

export default function PricingPage() {
  const { lang } = usePublicPrefs();
  const c = COPY[lang];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{c.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-neutral-600 dark:text-neutral-400">
          {c.sub}
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        {c.tiers.map((tier, idx) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.1 }}
            className={`relative flex flex-col rounded-2xl border p-6 ${
              tier.popular
                ? "border-[#00C896] bg-white shadow-[0_12px_40px_rgba(0,200,150,0.18)] dark:bg-[#13131A]"
                : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#13131A]"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00C896] px-3 py-1 text-xs font-extrabold text-black">
                {c.popular}
              </span>
            )}

            <h2 className="text-lg font-extrabold">{tier.name}</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-black">{tier.price}</span>
              {tier.price.startsWith("৳") && tier.price !== "৳0" && tier.price !== "৳০" && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400">{c.perMonth}</span>
              )}
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{tier.blurb}</p>

            <ul className="mt-5 flex flex-1 flex-col gap-2.5">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#00A87E] dark:text-[#00C896]" />
                  <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={idx === 2 ? "/about" : "/signup"}
              className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-extrabold no-underline ${
                tier.popular
                  ? "bg-[#00C896] text-black shadow-[0_6px_20px_rgba(0,200,150,0.3)]"
                  : "border border-neutral-300 text-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
              }`}
            >
              {idx === 2 ? c.ctaContact : c.cta}
            </Link>
          </motion.div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-neutral-500 dark:text-neutral-500">
        {c.note}
      </p>
    </div>
  );
}
