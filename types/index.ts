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
