// User roles
export type UserRole = 'learner' | 'institutional_admin' | 'platform_admin'
export type UserPlan = 'free' | 'pro'
export type AuthProvider = 'google' | 'github' | 'email'
export type Language = 'en' | 'bn'
export type UiTier = 1 | 2 | 3

// User
export interface User {
  id: string
  name: string
  email: string
  auth_provider?: AuthProvider
  role: UserRole
  plan: UserPlan
  institution_id?: string
  onboarding_complete: boolean
  preferred_language: Language
  preferred_theme?: string
  goal?: string
  experience_level?: string
  ui_tier?: UiTier
  streak: number
  created_at: string
  last_active: string
}

// Tracks & Concepts
export interface Track {
  id: string
  slug: string
  title_en: string
  title_bn?: string
  description_en?: string
  description_bn?: string
  price_bdt: number
  is_free: boolean
  difficulty?: string
  estimated_hours?: number
  tier: UiTier
  published: boolean
  skills?: string[]
  tools?: string[]
}

export interface Concept {
  id: string
  label: string
  track_id: string
  difficulty: number // 1-5
}

export interface ConceptEdge {
  from_concept: string
  to_concept: string
  type: 'requires' | 'reinforces'
}

export interface LearnerMastery {
  user_id: string
  concept_id: string
  score: number
  mastered: boolean
  mastered_at?: string
}

// Lessons
export interface Module {
  id: string
  track_id: string
  title_en: string
  title_bn?: string
  order_index: number
}

export interface Lesson {
  id: string
  module_id: string
  title_en: string
  title_bn?: string
  youtube_video_id: string | null
  notes_md?: string | null
  notes_bn_md?: string | null
  order_index: number
  estimated_mins?: number | null
  concept_ids?: string[]
}

export interface LessonResource {
  id: string
  lesson_id: string
  label: string
  url: string
}

// Subtitles & Transcripts
export interface Subtitle {
  id: string
  lesson_id: string
  lang: Language
  vtt_url: string
  auto_score: number
  reviewed: boolean
}

export interface TranscriptChunk {
  id: string
  lesson_id: string
  chunk_text: string
  start_time: number
  end_time: number
  embedding?: number[] // pgvector(1536)
}

// Job market signals for dashboard & matching
export interface JobMarketSignal {
  skill: string
  source: string
  mention_count: number
  week_change_pct?: number
  avg_salary_bdt?: number
  in_curriculum?: boolean
  status?: string
  created_at?: string
}

// Enrollment
export interface Enrollment {
  id: string
  user_id: string
  track_id: string
  enrolled_at: string
  completed_at?: string
  current_lesson_id?: string | null
  progress_percent: number
  final_score?: number
  certificate_id?: string
  financial_aid: boolean
  track?: Track
}

export interface Progress {
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at?: string | null
  watch_pct: number
}

// API Response
export interface ApiResponse<T> {
  data?: T
  error?: string
}

// Docs module
export type DocSectionType = 'markdown' | 'mermaid' | 'feature-matrix' | 'live-stats'
export type DocVisibilityMode = 'off' | 'scheduled' | 'always-on'

export interface DocSlide {
  id: string
  title: string
  body: string
}

export interface DocSection {
  id: string
  title: string
  type: DocSectionType
  body: string
}

export interface TeamMember {
  id: string
  full_name: string
  role: string
  email?: string | null
  avatar_url?: string | null
}

export interface DocTeam {
  name?: string
  members: TeamMember[]
}

export interface DocContent {
  hero: {
    title: string
    subtitle?: string
    tagline?: string
  }
  slides: DocSlide[]
  sections: DocSection[]
  team: DocTeam
  meta?: {
    github_url?: string
  }
}

export interface DocRecord {
  id: string
  slug: string
  title: string
  content: DocContent
  is_published: boolean
  visible_override: boolean
  start_ts: string | null
  end_ts: string | null
  updated_at?: string
}

export interface DocVisibility {
  mode: DocVisibilityMode
  start_ts?: string | null
  end_ts?: string | null
}

export interface LiveStats {
  tracks: number
  lessons: number
  users: number
  enrollments: number
  features: number
}
