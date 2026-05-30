import type { AssessmentQuestion, Track } from "@/types/ui";

export const i18n: { [key: string]: Record<string, string> } = {
  en: {
    brand: "Fixeth",
    tagline: "Learn. Prove. Build.",
    dashboard: "Dashboard",
    guidedVideo: "Guided Video",
    notebook: "Notebook",
    quizAssign: "Quiz & Homework",
    submissions: "Submissions Hub",
    codeSpace: "IDE Codespace",
    tools: "Developer Tools",
    aiMentor: "AI Mentor",
    greeting: "Welcome back",
    continueBtn: "Continue Learning →",
    activeTrack: "Active Tracks",
    weeklyGoal: "Weekly Target",
    streak: "Activity Days",
    certificates: "Credentials",
    quizAvg: "Quiz Standing",
    lessonsCompleted: "Lessons Complete",
    jobMarket: "📈 National Developer Demand",
    liveVia: "Live analytics",
    trending: "Trending Frameworks",
    myTracks: "My Learning Progress",
    analyticsOverview: "Learning Analytics",
    learningTrend: "30-Day Completion Trend",
    moduleDistribution: "Module Completion Mix",
    completionHeatmap: "Completion Heatmap",
    activityLastDays: "Last 30 days",
    recentCompletions: "Latest completions",
    noActivityYet: "No completion activity yet",
    recentActivity: "Recent History",
    nextUp: "Coming up next",
    careerIntel: "Bangladesh Skill Index",
    submitWork: "Upload Assignment Content",
    uploadFiles: "Add Workspace Files",
    dragDrop: "Drag files here, or click to browse",
    submissionHistory: "Uploaded files archive",
    rubric: "Academic Rubric",
    aiFeedback: "AI Code Analysis",
    peerReview: "Peer Consensus",
    aiMentorTitle: "AI Studio Mentor",
    askAnything: "Send a message to your mentor...",
    generateQuiz: "Compile interactive practice questions",
    explainConcept: "Deconstruct technical terms",
    multilevel: "Cognitive Levels",
    connectGitHub: "Synchronize remote workspace",
    indeedConnect: "Activate Job Trends",
    cloudConnect: "Configure Self-Hosted Cluster",
    ollamaSetup: "Sync local Ollama client",
    byoaKey: "Bring-Your-Own-Access Keys",
    language: "Current Language",
    darkMode: "Interface Theme",
    onboarding1: "What is your primary technical objective?",
    onboarding2: "What is your starting engineering level?",
    onboarding3: "Choose your professional learning track",
    onboarding4: "Take Baseline Diagnostic Placement Assessment",
    skipAssessment: "Skip Assessment — Load Baseline Curriculum",
    startAssessment: "Run Diagnostic Appraisal (Recommended)",
    completedBadge: "Completed",
    notYetCompletedBadge: "Available",
    gitConnected: "Synced with GitHub",
    fetchLocal: "Drag & Drop or Open Files Local",
    terminalLabel: "Bash Command Interactive Terminal Console",
    community: "Community AI",
    certs: "Certificates",
    profileView: "View Profile",
    profileSettings: "Account Settings",
    profilePreferences: "Preferences",
    profileSignOut: "Sign out"
  },
  bn: {
    brand: "ফিক্সেথ",
    tagline: "শিখুন। প্রমাণ করুন। গড়ুন।",
    dashboard: "ড্যাশবোর্ড",
    community: "কমিউনিটি এআই",
    certs: "সার্টিফিকেট",
    guidedVideo: "গাইডেড ভিডিও ক্লাস",
    notebook: "নোটবুক ল্যাব",
    quizAssign: "কুইজ ও বাড়ির কাজ",
    submissions: "জমাকৃত কাজসমূহ",
    codeSpace: "আইডিই কোডস্পেস",
    tools: "ডেভেলপার টুলস",
    aiMentor: "এআই মেন্টর",
    greeting: "স্বাগতম",
    continueBtn: "পড়াশোনা চালিয়ে যান ➜",
    activeTrack: "সক্রিয় ট্র্যাকসমূহ",
    weeklyGoal: "সাপ্তাহিক টার্গেট",
    streak: "সক্রিয়তার দিন",
    certificates: "অর্জনসমূহ",
    quizAvg: "পরীক্ষার গড় নম্বর",
    lessonsCompleted: "সম্পন্ন লেকচার",
    jobMarket: "📈 জাতীয় ডেভেলপার নিয়োগ সূচক",
    liveVia: "লাইভ ডাটা বিশ্লেষণ",
    trending: "চাহিদাপূর্ণ টেকনোলজি",
    myTracks: "আমার প্রগতি",
    analyticsOverview: "লার্নিং অ্যানালিটিক্স",
    learningTrend: "৩০ দিনের সম্পন্নতার ট্রেন্ড",
    moduleDistribution: "মডিউল সম্পন্নতার বণ্টন",
    completionHeatmap: "সম্পন্নতার হিটম্যাপ",
    activityLastDays: "গত ৩০ দিন",
    recentCompletions: "সাম্প্রতিক সম্পন্নতা",
    noActivityYet: "এখনও কোনো সম্পন্নতার কার্যক্রম নেই",
    recentActivity: "সাম্প্রতিক ইতিহাস",
    nextUp: "পরবর্তী পাঠ",
    careerIntel: "বাংলাদেশ স্কিল ইনডেক্স",
    submitWork: "অ্যাসাইনমেন্ট জমা দিন",
    uploadFiles: "ফাইল যুক্ত করুন",
    dragDrop: "এখানে ফাইল টেনে আনুন অথবা ক্লিক করে খুঁজুন",
    submissionHistory: "জমাকৃত ফাইল আর্কাইভ",
    rubric: "মূল্যায়ন রুব্রিক",
    aiFeedback: "এআই কোড বিশ্লেষণ",
    peerReview: "সহপাঠী ফিডব্যাক",
    aiMentorTitle: "এআই স্টুডিও মেন্টর",
    askAnything: "আপনার মেন্টরকে যেকোনো প্রশ্ন করুন...",
    generateQuiz: "অনুশীলনী কুইজ তৈরি করুন",
    explainConcept: "প্রযুক্তিগত পরিভাষা বিশ্লেষণ",
    multilevel: "জ্ঞানীয় স্তরসমূহ",
    connectGitHub: "রিমোট ওয়ার্কস্পেস সিঙ্ক করুন",
    indeedConnect: "চাকরির বাজার মনিটর অন করুন",
    cloudConnect: "সেলফ-হোস্টেড ক্লাস্টার কনফিগার করুন",
    ollamaSetup: "লোকাল ওলামা সিঙ্ক করুন",
    byoaKey: "ইউজার এপিআই কী ব্যবহার করুন (BYOA)",
    language: "চলতি ভাষা",
    darkMode: "থিম পরিবর্তন",
    onboarding1: "আপনার প্রধান কারিগরি বা পেশাদার লক্ষ্য কী?",
    onboarding2: "আপনার বর্তমান কোডিং অভিজ্ঞতা কেমন?",
    onboarding3: "আপনার ক্যারিয়ার লার্নিং ট্র্যাক বেছে নিন",
    onboarding4: "ব্যক্তিগত বেসলাইন ডায়াগনস্টিক প্লেসমেন্ট মূল্যায়ন",
    skipAssessment: "মূল্যায়ন বাদ দিন — বেসিক কোর্স লোড করুন",
    startAssessment: "ডায়াগনস্টিক মূল্যায়ন শুরু করুন (প্রস্তাবিত)",
    completedBadge: "সম্পন্ন",
    notYetCompletedBadge: "অংশগ্রহণযোগ্য",
    gitConnected: "গিটহাব সংযুক্ত আছে",
    fetchLocal: "লোকাল ফাইল টেনে আনুন / ওপেন করুন",
    terminalLabel: "ব্যাশ কমান্ড ইন্টারঅ্যাক্টিভ টার্মিনাল কনসোল",
    profileView: "প্রোফাইল দেখুন",
    profileSettings: "অ্যাকাউন্ট সেটিংস",
    profilePreferences: "পছন্দসমূহ",
    profileSignOut: "সাইন আউট"
  }
};

export const tracks: Track[] = [
  { id: "ds", icon: "📊", titleEn: "Data Science & AI Engineering", titleBn: "ডেটা সায়েন্স ও এআই ইঞ্জিনিয়ারিং", completed: false },
  { id: "fe", icon: "🎨", titleEn: "Frontend Web Development (React & TS)", titleBn: "ফ্রন্টএন্ড ওয়েব ডেভেলপমেন্ট (React & TS)", completed: true },
  { id: "be", icon: "⚙️", titleEn: "Backend Systems & Database Design", titleBn: "ব্যাকএন্ড সিস্টেম ও ডাটাবেজ ডিজাইন", completed: false },
  { id: "dl", icon: "💻", titleEn: "Digital Literacy & Professional Office Tools", titleBn: "ডিজিটাল লিটারেসি ও অফিস টুলস", completed: true },
  { id: "uiux", icon: "✨", titleEn: "UI/UX Product Design & Wireframing", titleBn: "ইউআই/ইউএক্স প্রোডাক্ট ডিজাইন ও ওয়্যারফ্রেমিং", completed: true },
  { id: "mobile", icon: "📱", titleEn: "Cross-Platform Mobile Apps (Flutter & Dart)", titleBn: "মোবাইল অ্যাপস ডেভেলপমেন্ট (Flutter)", completed: false },
  { id: "cyber", icon: "🛡️", titleEn: "Cyber Security & Defensive Networks", titleBn: "সাইবার সিকিউরিটি ও ডিফেন্সিভ নেটওয়ার্কিং", completed: false },
  { id: "devops", icon: "☁️", titleEn: "DevOps Engineering & Cloud Computing", titleBn: "ডেভঅপ্স ইঞ্জিনিয়ারিং ও ক্লাউড কম্পিউটিং", completed: false },
  { id: "marketing", icon: "📈", titleEn: "Technical SEO & Data-Driven Marketing", titleBn: "টেকনিক্যাল এসইও ও ডাটা-ড্রিভেন মার্কেটিং", completed: false },
  { id: "fullstack", icon: "🚀", titleEn: "Full Stack Web Software Engineering", titleBn: "ফুল স্ট্যাক ওয়েব সফটওয়্যার ইঞ্জিনিয়ারিং", completed: false }
];

export const assessments: { [trackId: string]: AssessmentQuestion[] } = {
  ds: [
    {
      qEn: "Which Python package provides highly optimized multi-dimensional vector array object interfaces?",
      qBn: "পাইথনে মাল্টি-ডাইমেনশনাল ভেক্টর অ্যারে অবজেক্ট অপারেশনের জন্য মূলত কোন লাইব্রেরি ব্যবহার করা হয়?",
      optsEn: ["Pandas", "NumPy", "Scikit-Learn", "Matplotlib"],
      optsBn: ["প্যান্ডাস (Pandas)", "নামপাই (NumPy)", "সাইকিট-লার্ন (Scikit-Learn)", "ম্যাটপ্লটলিব"],
      ans: 1
    },
    {
      qEn: "In Machine Learning, how is 'supervised learning' defined?",
      qBn: "মেশিন লার্নিং-এর ক্ষেত্রে 'সুপারভাইজড লার্নিং' (Supervised Learning) বলতে কী বোঝায়?",
      optsEn: [
        "Analyzing systems with unlabeled input parameters",
        "Training prediction models on labeled supervisor data patterns",
        "Evolving game characters using continuous randomized score increments",
        "Initiating training code completely void of initial source data arrays"
      ],
      optsBn: [
        "যেকোনো লেবেলবিহীন ইনপুট প্যারামিটার নিয়ে কাজ করা",
        "লেবেলযুক্ত চিহ্নিত ডাটা ব্যবহার করে প্রেডিকশন মডেল ট্রেইন করা",
        "ক্রমাগত র‍্যান্ডম স্কোর বৃদ্ধির মাধ্যমে গেম ক্যারেক্টার ইভলভ করা",
        "কোনো রকম ইনপুট ডাটা অ্যারে ছাড়াই প্রোগ্রাম চালানো"
      ],
      ans: 1
    },
    {
      qEn: "Which library is best for tabular data manipulation in Python?",
      qBn: "পাইথনে টেবুলার ডেটা ম্যানিপুলেশনের জন্য কোন লাইব্রেরি সবচেয়ে উপযুক্ত?",
      optsEn: ["Matplotlib", "Pandas", "Flask", "Requests"],
      optsBn: ["Matplotlib", "Pandas", "Flask", "Requests"],
      ans: 1
    },
    {
      qEn: "A bar chart is typically used to show:",
      qBn: "বার চার্ট সাধারণত দেখায়:",
      optsEn: ["Comparisons across categories", "Only time series", "Password strength", "Network latency only"],
      optsBn: ["বিভাগ অনুযায়ী তুলনা", "শুধু সময় ধারা", "পাসওয়ার্ড শক্তি", "শুধু নেটওয়ার্ক লেটেন্সি"],
      ans: 0
    },
    {
      qEn: "Train/test split helps prevent:",
      qBn: "ট্রেন/টেস্ট স্প্লিট সাহায্য করে প্রতিরোধ করে:",
      optsEn: ["Overfitting", "Syntax errors", "Missing fonts", "Slow WiFi"],
      optsBn: ["ওভারফিটিং", "সিনট্যাক্স ত্রুটি", "ফন্ট অনুপস্থিতি", "ধীর ওয়াইফাই"],
      ans: 0
    }
  ],
  fe: [
    {
      qEn: "Which React Hook is standardized for conducting side effects like network queries?",
      qBn: "ফাংশনাল রিয়্যাক্ট কম্পোনেন্টে নেটওয়ার্ক রিকোয়েস্ট বা সাইড ইফেক্টস সম্পন্ন করার জন্য কোন হুক নির্ধারিত?",
      optsEn: ["useState", "useMemo", "useEffect", "useRef"],
      optsBn: ["useState", "useMemo", "useEffect", "useRef"],
      ans: 2
    },
    {
      qEn: "What is the primary utility of semantic HTML syntax elements on modern web browsers?",
      qBn: "আধুনিক ওয়েব ব্রাউজারে সেমান্টিক এইচটিএমএল (Semantic HTML) লেখার মূল উদ্দেশ্য কী?",
      optsEn: [
        "Compressing loading times of browser assets",
        "Embedding client-side relational SQL databases",
        "Expressing clear structural purposes of containers (<article>, <section>) to client software and crawlers",
        "Encrypting form data during submission"
      ],
      optsBn: [
        "ব্রাউজার সামগ্রীর লোডিং সময় সংক্ষিপ্ত করা",
        "ক্লায়েন্ট-সাইডে রিলেশনাল এসকিউএল ডাটাবেজ যুক্ত করা",
        "পেজের মূল কাঠামোগুলোকে (<article>, <section>) সার্চ ইঞ্জিন ও ব্রাউজারের কাছে অর্থপূর্ণ করা",
        "ফর্ম সাবমিশনের সময় ডাটা পাসওয়ার্ড সিঙ্ক্রোনাইজ করা"
      ],
      ans: 2
    }
  ],
  be: [
    {
      qEn: "Which HTTP request verb represents making a structured new item entry inside a server data repository?",
      qBn: "একটি ব্যাকএন্ড সার্ভারে নতুন তথ্য জমা দিতে মূলত কোন HTTP মেথড ব্যবহার করা হয়?",
      optsEn: ["GET", "POST", "PUT", "DELETE"],
      optsBn: ["GET (গেট)", "POST (পোস্ট)", "PUT (পুট)", "DELETE (ডিলিট)"],
      ans: 1
    },
    {
      qEn: "In relational schema systems, which constraint manages referential link consistency across tables?",
      qBn: "রিলেশনাল ডাটাবেজে দুটি টেবিলের তথ্যের মধ্যে যোগসূত্র স্থাপন ও স্থায়িত্ব রক্ষা করার পদ্ধতিকে কী বলা হয়?",
      optsEn: ["Primary Unique Index", "Foreign Key reference linkage", "Local SHA-256 Checksum", "Memory Page table indexing"],
      optsBn: ["প্রাইমারি ইউনিক ইনডেক্স", "ফরেন কি (Foreign Key) রেফারেন্স লিংকেজ", "লোকাল SHA-256 চেকসাম", "মেমোরি পেজ টেবিল ইনডেক্সিং"],
      ans: 1
    }
  ],
  dl: [
    {
      qEn: "Which of these passwords conforms to modern, hardened security parameter directives against brute forcing?",
      qBn: "নিচের কোন ধরনের পাসওয়ার্ড ব্রুট-ফোর্স হ্যাকিং প্রতিরোধে সবচেয়ে শক্তিশালী ও নিরাপদ?",
      optsEn: ["mybirthday1995", "12345678abc", "dH8_!kLs2_#pQx9", "admin123"],
      optsBn: ["mybirthday1995", "12345678abc", "dH8_!kLs2_#pQx9", "admin123"],
      ans: 2
    },
    {
      qEn: "In grid-based spreadsheets (e.g. MS Excel), what alphabetical representation marks vertical Columns?",
      qBn: "স্প্রেডশিটে (যেমন এমএস এক্সেল) খাড়া কলামগুলোকে (Columns) সাধারণত কী চিহ্ন দ্বারা প্রকাশ করা হয়?",
      optsEn: ["Arabic integers: 1, 2, 3", "Upper alphabetic series: A, B, C", "Special characters: #, $, %", "Roman index digits: I, II, III"],
      optsBn: ["সংখ্যা: ১, ২, ৩", "ইংরেজি বড় হাতের অক্ষরমালা: A, B, C", "বিশেষ সাংকেতিক চিহ্ন: #, $, %", "রোমান সংখ্যা সিরিজ: I, II, III"],
      ans: 1
    },
    {
      qEn: "Two-factor authentication (2FA) adds:",
      qBn: "টু-ফ্যাক্টর অথেন্টিকেশন (2FA) যোগ করে:",
      optsEn: ["A second verification step", "Faster downloads", "More ads", "Unlimited storage"],
      optsBn: ["দ্বিতীয় যাচাই ধাপ", "দ্রুত ডাউনলোড", "আরও বিজ্ঞাপন", "আনলিমিটেড স্টোরেজ"],
      ans: 0
    },
    {
      qEn: "A browser bookmark saves:",
      qBn: "ব্রাউজার বুকমার্ক সংরক্ষণ করে:",
      optsEn: ["A page URL for quick access", "Your password in plain text", "The entire hard drive", "Only images"],
      optsBn: ["দ্রুত অ্যাক্সেসের জন্য পেজ URL", "প্লেইন টেক্সটে পাসওয়ার্ড", "পুরো হার্ড ড্রাইভ", "শুধু ছবি"],
      ans: 0
    },
    {
      qEn: "Cloud storage lets you:",
      qBn: "ক্লাউড স্টোরেজ আপনাকে দেয়:",
      optsEn: ["Access files from multiple devices", "Remove the internet", "Print without a printer", "Skip updates forever"],
      optsBn: ["একাধিক ডিভাইস থেকে ফাইল অ্যাক্সেস", "ইন্টারনেট সরানো", "প্রিন্টার ছাড়া প্রিন্ট", "চিরকাল আপডেট বাদ"],
      ans: 0
    }
  ]
};

export const fallbackAssessment: AssessmentQuestion[] = [
  {
    qEn: "What is a variable in programming syntax?",
    qBn: "প্রোগ্রামিংয়ের পরিভাষায় ভ্যারিয়েবল (Variable) বলতে নিচের কোনটি বোঝায়?",
    optsEn: [
      "A completely hard-sealed unalterable logic parameter",
      "A designated name allocated as a container in system ram holding reference data values",
      "A continuously looping syntax module",
      "A script running outside the program process"
    ],
    optsBn: [
      "সম্পূর্ণ পরিবর্তনহীন ও লক করা একটি লজিক প্যারামিটার",
      "কম্পিউটার মেমোরিতে ডাটা মান সাময়িকভাবে ধরে রাখার নামযুক্ত স্থান",
      "একটি অবিরাম চলমান লুপের অংশ",
      "অ্যাপ্লিকেশন প্রসেসের বাইরে চলমান এক্সটারনাল স্ক্রিপ্ট"
    ],
    ans: 1
  },
  {
    qEn: "Which coding construct allows repetitive command iterations until target checks resolve?",
    qBn: "নির্দিষ্ট শর্ত পূরণ না হওয়া পর্যন্ত বারবার একই কোডের অংশ চালানোর জন্য কোনটি ব্যবহার করা হয়?",
    optsEn: ["Conditional If-Else route", "Constant declaration assignment", "Looping structures (For/While)", "Global function pointers"],
    optsBn: ["কন্ডিশনাল ইফ-এলস (If-Else) রুট", "কনস্ট্যান্ট ডিক্লারেশন অ্যাসাইনমেন্ট", "লুপিং মেকানিজম (যেমন For/While লুপ)", "গ্লোবাল ফাংশন পয়েন্টার"],
    ans: 2
  }
];
