"use client";

import React, { useState } from "react";

interface CommunityItem {
  id: string;
  q: string;
  qBn: string;
  asks: number;
  status: "Generated" | "Pending review" | "Draft";
  rating?: number;
  contentEn: string;
  contentBn: string;
}

export default function CommunityScreen({ T, t, lang }: { T: any; t: any; lang: string }) {
  const [items, setItems] = useState<CommunityItem[]>([
    {
      id: "q-1",
      q: "Why does Python use indentation instead of braces?",
      qBn: "পাইথন কেন ব্র্যাকেটের বদলে ইনডেন্টেশন (খালি জায়গা) ব্যবহার করে?",
      asks: 482,
      status: "Generated",
      rating: 4.8,
      contentEn: "Python uses indentation to define the hierarchy and association of blocks of code instead of curly braces <b>{}</b>. This is a core philosophy centered around code readability (PEP 8). Mandatory indentation enforces a clean, uniform style across all developers' codebases, meaning you can read someone else's script as easily as compile-time checks.",
      contentBn: "পাইথন কোডের ব্লক বা হায়ারার্কি বোঝানোর জন্য কার্লি ব্র্যাকেট বা দ্বিতীয় বন্ধনীর <b>{}</b> বদলে ইনডেন্টেশন (ট্যাব বা নির্দিষ্ট পরিমাণ স্পেস) ব্যবহার করে। এটি কোডের পঠনযোগ্যতা (PEP 8) বাড়ানোর জন্য পাইথনের একটি অন্যতম দর্শনের অংশ। এই নিয়মটি সব কোডারদের বাধ্য করে একই রকম গোছানো পদ্ধতিতে কোড লিখতে।"
    },
    {
      id: "q-2",
      q: "What is the difference between list and tuple?",
      qBn: "লিস্ট এবং টুপল এর মধ্যে আসল পার্থক্য কী?",
      asks: 391,
      status: "Pending review",
      rating: 4.6,
      contentEn: "Lists are <b>mutable</b> (can be changed after creation, elements can be appended or popped) and defined with brackets <code>[]</code>. Tuples are <b>immutable</b> (cannot be changed once created, write-locked) and defined with parentheses <code>()</code>. Tuples are faster, occupy less memory, and are suitable for write-protected constant configurations.",
      contentBn: "লিস্ট হচ্ছে <b>মিউটেবল</b> (তৈরির পর পরিবর্তনযোগ্য, আইটেম যোগ/বাদ করা যায়) এবং এটি স্কয়ার ব্র্যাকেট <code>[]</code> দিয়ে লেখা হয়। অন্যদিকে টুপল হচ্ছে <b>ইমিউটেবল</b> (তৈরির পর পরিবর্তন করা সম্ভব নয়, রাইট-লকড) এবং এটি সাধারণ ব্র্যাকেট <code>()</code> দিয়ে নির্দেশ করা হয়। টুপল অনেক দ্রুত কাজ করে এবং কম মেমোরি খরচ করে।"
    },
    {
      id: "q-3",
      q: "How do I handle missing data in Pandas?",
      qBn: "প্যান্ডাসে মিসিং ডেটা বা নাল ভ্যালু কীভাবে সমাধান করবো?",
      asks: 287,
      status: "Generated",
      rating: 4.7,
      contentEn: "Missing data in Pandas dataframes is typically represented as NaN/None. You can use <code>df.isna()</code> to find null values, <code>df.dropna()</code> to discard missing rows/columns, or <code>df.fillna(value)</code> to substitute empty items with statistical mean, median, constant value, or interpolated lines.",
      contentBn: "প্যান্ডাস লাইব্রেরিতে ফিলাপহীন বা মিসিং ডেটাকে সাধারণত NaN/None হিসেবে চিহ্নিত করা হয়। আপনি <code>df.isna()</code> ব্যবহার করে ফাকা সেল খুঁজে পেতে পারেন, <code>df.dropna()</code> দিয়ে খালি সারি বা কলাম মুছে দিতে পারেন, অথবা <code>df.fillna()</code> দিয়ে গড় (Mean/Median) বা অন্য কোনো কনস্ট্যান্ট ভ্যালু বসাতে পারেন।"
    },
    {
      id: "q-4",
      q: "When should I use a generator vs a list?",
      qBn: "কখন লুপে জেনারেটর এবং কখন সাধারণ লিস্ট ব্যবহার করা উচিত?",
      asks: 244,
      status: "Draft",
      rating: 4.5,
      contentEn: "Use a list when you need to access elements repeatedly, slice items, or execute random index read-writes. All list elements reside in RAM simultaneously. Use a generator (with the <code>yield</code> keyword of function stacks) when you compute enormous or infinite data arrays sequentially. Generators evaluate items lazily (one at a time), keeping RAM footprint extremely small.",
      contentBn: "লিস্ট ব্যবহার করুন যখন আপনার ডেটার উপাদান বারবার দেখতে হবে, স্লাইস করতে হবে বা পজিশনভিত্তিক অ্যাক্সেস লাগবে। জেনারেটর ব্যবহার করবেন যখন খুব বড় বা অসীম ডেটা সিকোয়েন্স একের পর এক প্রসেস করতে হবে। জেনারেটর <code>yield</code> কিওয়ার্ডের মাধ্যমে একবারে একটি আইটেম অলসভাবে (lazy) প্রসেস করে।"
    },
    {
      id: "q-5",
      q: "Why is my model overfitting?",
      qBn: "আমার মেশিন লার্নিং মডেল কেন ওভারফিট করছে?",
      asks: 196,
      status: "Generated",
      rating: 4.9,
      contentEn: "Overfitting happens when a predictive model memorizes the training dataset patterns too closely, including random noise, rather than generalizing. Signs include perfect training accuracy but very poor cross-validation/test scores. Fix it by compiling more training data, applying regularization coefficients (L1/L2), dropping out active neural layers, or simplifying feature depth.",
      contentBn: "ওভারফিটিং ঘটে যখন কোনো লার্নিং মডেল ট্রেনিং ডেটা খুব সূক্ষ্মভাবে মুখস্থ করে ফেলে যার ফলে নতুন ডেটাতে ভালো ফল দিতে পারে না। এর লক্ষণ হলো ট্রেনিং করার সময় পারফেক্ট স্কোর অথচ টেস্ট রান করার সময় ভুল ফলাফল। এটি সমাধান করতে আরও কোয়ালিটি ডেটা সংগ্রহ করুন, রেগুলারাইজেশন (L1/L2) বা ড্রপআউট কৌশল ব্যবহার করুন।"
    }
  ]);

  const [activeReviewItem, setActiveReviewItem] = useState<CommunityItem | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stats aggregate
  const totalAsks = items.reduce((acc, item) => acc + item.asks, 0);
  const generatedCount = items.filter((i) => i.status === "Generated").length;
  const pendingCount = items.filter((i) => i.status === "Pending review").length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleApprove = (id: string, name: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Generated" } : item))
    );
    showToast(lang === "bn" ? `"${name}" লেসনটি অনুমোদিত ও প্রকাশিত হয়েছে!` : `Lesson "${name}" has been approved and published!`);
  };

  const handleReject = (id: string, name: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Draft" } : item))
    );
    showToast(lang === "bn" ? `"${name}" লেসনটি ড্রাফটে স্থানান্তরিত করা হয়েছে` : `Lesson "${name}" has been returned to drafts`);
  };

  const handleSuggest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    const newItem: CommunityItem = {
      id: `q-${Date.now()}`,
      q: topicInput,
      qBn: topicInput,
      asks: 1,
      status: "Pending review",
      contentEn: "This newly suggested topic is awaiting automatic synthetic generation and review by academic instructors. It will soon compile into micro-lessons with code playground presets.",
      contentBn: "আপনার সুপারিশকৃত নতুন টপিকটি এআই প্রসেসিংয়ের অপেক্ষায় আছে। শীঘ্রই এটি বাংলায় কোড উদাহরণসহ অনুশীলনী পাঠে কম্পাইল হবে।"
    };

    setItems((prev) => [newItem, ...prev]);
    setShowSuggestModal(false);
    setTopicInput("");
    showToast(lang === "bn" ? "নতুন সূচি প্রস্তাব সফল হয়েছে!" : "Successfully proposed new micro lesson topic!");
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg0, position: "relative" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px 60px" }}>
        
        {/* Header Block inline styled */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24
          }}
        >
          <div>
            <h1 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 950, color: T.txt0, margin: 0 }}>
              <span>👥</span>
              {lang === "bn" ? "কমিউনিটি লার্নিং ইন্টেলিজেন্স" : "Community Learning Intelligence"}
            </h1>
            <p style={{ fontSize: 11.5, color: T.txt1, marginTop: 4, marginBottom: 0 }}>
              {lang === "bn"
                ? "সব শিক্ষার্থীর সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নগুলো — অটো-জেনারেটেড মাইক্রো লেসনে রূপান্তরিত"
                : "Most asked questions across all active learners — auto-generated into targeted micro lessons"}
            </p>
          </div>
          <button
            onClick={() => setShowSuggestModal(true)}
            style={{
              background: T.accent,
              color: "#000",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: T.shadow,
              transition: "all 0.15s ease",
              outline: "none"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
          >
            + {lang === "bn" ? "নতুন টপিক প্রস্তাব করুন" : "Suggest a topic"}
          </button>
        </div>

        {/* Dynamic 4-Column Metric Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            {
              label: lang === "bn" ? "এ সপ্তাহে মোট প্রশ্ন" : "Questions this week",
              value: totalAsks.toLocaleString(),
              delta: "+12% " + (lang === "bn" ? "বৃদ্ধি" : "increase"),
              color: T.accent,
              dim: T.accentDim
            },
            {
              label: lang === "bn" ? "অটো-জেনারেটেড লেসন" : "Auto-generated lessons",
              value: (items.length * 9).toString(),
              delta: `${generatedCount} ` + (lang === "bn" ? "প্রকাশিত হয়েছে" : "published live"),
              color: T.purple,
              dim: T.purpleDim
            },
            {
              label: lang === "bn" ? "পর্যালোচনাধীন লেসন" : "Instructor reviews pending",
              value: pendingCount.toString(),
              delta: lang === "bn" ? "শিক্ষক অনুমতি প্রয়োজন" : "Action required",
              color: T.amber,
              dim: T.amberDim
            },
            {
              label: lang === "bn" ? "গড় লেসন রেটিং" : "Avg lesson rating",
              value: "4.7 / 5.0",
              delta: "★★★★★",
              color: T.blue,
              dim: T.blueDim
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: T.bg1,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: "16px 18px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
              }}
            >
              <div style={{ fontSize: 10.5, color: T.txt1, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2px" }}>
                {item.label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: T.txt0, margin: "6px 0 2px" }}>
                {item.value}
              </div>
              <div style={{ fontSize: 11, color: item.color, fontWeight: 700 }}>
                {item.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Main List Workspace Card */}
        <div
          style={{
            background: T.bg1,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: "20px",
            boxShadow: T.shadow
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.border}`, paddingBottom: 16, marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: T.txt0, margin: 0 }}>
              {lang === "bn" ? "জনপ্রিয় প্রশ্নাবলী → এআই মাইক্রো লেসন প্যানেল" : "Most Asked Questions → Generated Micro Lessons"}
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                  padding: "14px 16px",
                  borderRadius: 10,
                  background: T.bg2,
                  border: `1px solid ${T.border}`,
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 850, color: T.txt0 }}>
                    {lang === "bn" ? c.qBn : c.q}
                  </div>
                  <div style={{ fontSize: 11, color: T.txt1, marginTop: 4 }}>
                    {c.asks} {lang === "bn" ? "জন শিক্ষার্থী প্রশ্নটি করেছেন" : "learners active in tracking this topic"} • {lang === "bn" ? "অটো-লেসন উপলব্ধ" : "interactive context ready"}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  {/* Status Badges */}
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 900,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: 6,
                      background:
                        c.status === "Generated"
                          ? T.accentDim
                          : c.status === "Pending review"
                          ? T.amberDim
                          : T.bg3,
                      border: `1px solid ${
                        c.status === "Generated"
                          ? T.accent + "50"
                          : c.status === "Pending review"
                          ? T.amber + "50"
                          : T.borderHi
                      }`,
                      color:
                        c.status === "Generated"
                          ? T.accent
                          : c.status === "Pending review"
                          ? T.amber
                          : T.txt1
                    }}
                  >
                    {c.status === "Generated"
                      ? (lang === "bn" ? "প্রকাশিত" : "Generated")
                      : c.status === "Pending review"
                      ? (lang === "bn" ? "পর্যালোচনায়" : "Pending review")
                      : (lang === "bn" ? "ড্রাফট" : "Draft")}
                  </span>

                  {/* Actions buttons */}
                  <button
                    onClick={() => setActiveReviewItem(c)}
                    style={{
                      background: T.bg3,
                      color: T.txt1,
                      border: `1.5px solid ${T.border}`,
                      borderRadius: 6,
                      padding: "6px 14px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.1s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = T.txt0;
                      e.currentTarget.style.borderColor = T.borderHi;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = T.txt1;
                      e.currentTarget.style.borderColor = T.border;
                    }}
                  >
                    {lang === "bn" ? "রিভিউ" : "Review"}
                  </button>

                  {c.status === "Pending review" && (
                    <button
                      onClick={() => handleApprove(c.id, c.q)}
                      style={{
                        background: T.accent,
                        color: "#000",
                        border: "none",
                        borderRadius: 6,
                        padding: "6.5px 14px",
                        fontSize: 11.5,
                        fontWeight: 800,
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                    >
                      {lang === "bn" ? "অনুমোদন" : "Approve"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 1. REVIEW MODAL */}
      {activeReviewItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 1000
          }}
        >
          <div
            style={{
              background: T.bg1,
              border: `1px solid ${T.borderHi}`,
              borderRadius: 14,
              maxWidth: 600,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
          >
            {/* Modal Title/Header */}
            <div
              style={{
                background: T.bg2,
                padding: "16px 20px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 900, background: T.accentDim, color: T.accent, padding: "2px 6px", borderRadius: 4, letterSpacing: "1px" }}>
                  🤖 AI GENERATED
                </span>
                <span style={{ fontSize: 11.5, color: T.txt1 }}>
                  {activeReviewItem.status === "Generated" ? (lang === "bn" ? "প্রকাশিত পাঠ" : "Published Lesson") : (lang === "bn" ? "শিক্ষক পর্যালোচনায়" : "Pending Review Mode")}
                </span>
              </div>
              <button
                onClick={() => setActiveReviewItem(null)}
                style={{ background: "none", border: "none", color: T.txt1, cursor: "pointer", fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content Frame */}
            <div style={{ padding: "20px 24px", maxHeight: "60vh", overflowY: "auto" }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: T.txt0, margin: "0 0 16px" }}>
                💡 {lang === "bn" ? activeReviewItem.qBn : activeReviewItem.q}
              </h2>

              <div
                style={{
                  fontSize: 13,
                  color: T.txt0,
                  lineHeight: 1.6,
                  background: T.bg0,
                  padding: "14px 18px",
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  marginBottom: 16
                }}
                dangerouslySetInnerHTML={{
                  __html: lang === "bn" ? activeReviewItem.contentBn : activeReviewItem.contentEn
                }}
              />

              <div
                style={{
                  background: T.bg2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "12px 16px"
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 800, color: T.accent, marginBottom: 8 }}>
                  📊 {lang === "bn" ? "শিক্ষাদানের গুণগত সূচক সংকেত" : "Quality Assurance & Telemetry Tracker"}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11, color: T.txt1 }}>
                    {lang === "bn" ? "কোডিং নির্ভুলতা" : "Fidelity Index"}: <b style={{ color: T.txt0 }}>97%</b>
                  </div>
                  <div style={{ fontSize: 11, color: T.txt1 }}>
                    {lang === "bn" ? "পঠনযোগ্যতা মান" : "Lexical Clarity"}: <b style={{ color: T.txt0 }}>94%</b>
                  </div>
                  <div style={{ fontSize: 11, color: T.txt1 }}>
                    {lang === "bn" ? "বাংলা অনুবাদ" : "Bilingual Maps"}: <b style={{ color: T.accent }}>✓ {lang === "bn" ? "সম্পূর্ণ" : "Synced"}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Interactions */}
            <div
              style={{
                background: T.bg2,
                padding: "14px 20px",
                borderTop: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10
              }}
            >
              <button
                onClick={() => {
                  handleReject(activeReviewItem.id, activeReviewItem.q);
                  setActiveReviewItem(null);
                }}
                style={{
                  background: "transparent",
                  border: `1px solid ${T.red}`,
                  color: T.red,
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                {lang === "bn" ? "বাতিল করুন" : "Reject"}
              </button>

              <button
                onClick={() => {
                  handleApprove(activeReviewItem.id, activeReviewItem.q);
                  setActiveReviewItem(null);
                }}
                style={{
                  background: T.accent,
                  color: "#000",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 20px",
                  fontSize: 11.5,
                  fontWeight: 900,
                  cursor: "pointer"
                }}
              >
                {lang === "bn" ? "অনুমোদন করুন " : "Approve & Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUGGEST TOPIC MODAL */}
      {showSuggestModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 1000
          }}
        >
          <form
            onSubmit={handleSuggest}
            style={{
              background: T.bg1,
              border: `1px solid ${T.borderHi}`,
              borderRadius: 14,
              maxWidth: 500,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
          >
            <div
              style={{
                background: T.bg2,
                padding: "16px 20px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 900, color: T.txt0 }}>
                💡 {lang === "bn" ? "নতুন এআই পাঠ সূচি প্রস্তাব" : "Suggest a Learning Topic"}
              </span>
              <button
                type="button"
                onClick={() => setShowSuggestModal(false)}
                style={{ background: "none", border: "none", color: T.txt1, cursor: "pointer", fontSize: 16 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "20px" }}>
              <p style={{ margin: "0 0 12px", fontSize: 11, color: T.txt1, lineHeight: 1.5 }}>
                {lang === "bn"
                  ? "যে প্রোগ্রামিং বিষয়টি শিখছেন কিন্তু বুঝতে সমস্যা হচ্ছে সেটি লিখুন। আমাদের এআই মডেল স্বয়ংক্রিয়ভাবে কোড উদাহরণসহ অনুশীলনী পাঠ তৈরি করবে।"
                  : "Submit an active programming problem or pattern. Our synthetic pipeline will immediately generate a localized sandbox explanation for reviews."}
              </p>

              <label style={{ fontSize: 11, fontWeight: 700, color: T.txt0, display: "block", marginBottom: 6 }}>
                {lang === "bn" ? "আপনার প্রশ্ন বা টপিক" : "Type your query or topic"}
              </label>
              <input
                type="text"
                required
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder={
                  lang === "bn"
                    ? "যেমন: ডেকোরেটর ফাংশন কীভাবে কাজ করে?"
                    : "e.g. How do decorators solve structural logging tasks?"
                }
                style={{
                  width: "100%",
                  background: T.bg2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontSize: 12.5,
                  color: "#fff",
                  outline: "none"
                }}
              />
            </div>

            <div
              style={{
                background: T.bg2,
                padding: "14px 20px",
                borderTop: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10
              }}
            >
              <button
                type="button"
                onClick={() => setShowSuggestModal(false)}
                style={{
                  background: "transparent",
                  border: `1px solid ${T.border}`,
                  color: T.txt1,
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                {lang === "bn" ? "বাতিল" : "Cancel"}
              </button>

              <button
                type="submit"
                style={{
                  background: T.accent,
                  color: "#000",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 20px",
                  fontSize: 11.5,
                  fontWeight: 900,
                  cursor: "pointer"
                }}
              >
                {lang === "bn" ? "জমা দিন" : "Submit Idea"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FLOAT INTERACTIVE TOAST */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#00c896",
            color: "#040407",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,200,150,0.3)",
            fontWeight: 900,
            fontSize: 12,
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "fadeInUp 0.15s ease-out"
          }}
        >
          <span>✓</span>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
