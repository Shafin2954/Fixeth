/**
 * TypeScript Interfaces & Shared Domain Types
 * Brand: Fixeth
 */

export interface Track {
  id: string;
  icon: string;
  titleEn: string;
  titleBn: string;
  completed: boolean;
}

export interface AssessmentQuestion {
  qEn: string;
  qBn: string;
  optsEn: string[];
  optsBn: string[];
  ans: number;
}

export interface UserEvaluation {
  skipped: boolean;
  score?: number;
  percentage?: number;
  strengths?: string[];
  weaknesses?: string[];
  completedAt?: string;
}

export interface Lesson {
  id: number;
  title: string;
  done: boolean;
  dur: string;
  active?: boolean;
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface ChatMessage {
  role: "user" | "ai";
  text: string;
  timestamp?: string;
  ts?: string;
}

export interface CodeFiles {
  [filename: string]: string;
}

export interface UserProfile {
  name: string;
  email: string;
  title?: string;
  location?: string;
  bio?: string;
  division?:
    | "Dhaka"
    | "Chittagong"
    | "Sylhet"
    | "Rajshahi"
    | "Khulna"
    | "Barisal"
    | "Rangpur"
    | "Mymensingh";
  jobFocus?: "job" | "upskill" | "switch" | "explore";
  certificateName?: string;
  publicPortfolio?: boolean;
}

export interface UserPreferences {
  layoutDensity: "compact" | "comfortable" | "spacious";
  colorPreset: "mint" | "ocean" | "sunset" | "rose";
  accentColor: string;
  mentorTone: "concise" | "balanced" | "deep";
  weeklyGoal: number;
  contentVisibility: {
    showCommunity: boolean;
    showCertificates: boolean;
    showMentor: boolean;
    showPortfolio: boolean;
  };
  dataPreferences: {
    allowTelemetry: boolean;
    allowPersonalization: boolean;
    autoSaveProgress: boolean;
    downloadFormat: "json" | "csv";
  };
  dataSaver: boolean;
  editor: {
    theme: "monokai" | "one-dark" | "solarized" | "vibrant" | "github-light";
    fontSize: number;
    lineWrapping: boolean;
    indentSize: 2 | 4;
    keymap: "standard" | "vim" | "emacs";
  };
  ai: {
    apiKey: string;
    model: "gemini-flash" | "gemini-pro" | "gemini-1.5" | "ollama";
    ollamaUrl: string;
    ollamaModel: string;
    persona: "socratic" | "academic" | "bengali" | "rpg";
    defaultCognitiveLevel: "ELI5" | "Student" | "Pro" | "Research";
  };
}
