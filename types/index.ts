// User roles
export type UserRole = 'learner' | 'institutional_admin' | 'platform_admin'
export type UserPlan = 'free' | 'pro'
export type AuthProvider = 'google' | 'github' | 'email'
export type Language = 'en' | 'bn'

// User
export interface User {
  id: string
  name: string
  email: string
  auth_provider: AuthProvider
  role: UserRole
  plan: UserPlan
  institution_id?: string
  onboarding_complete: boolean
  preferred_language: Language
  streak: number
  created_at: string
  last_active: string
}

// Tracks & Concepts
export interface Track {
  id: string
  title: string
  slug: string
  description: string
  price: number // in BDT paisa
  difficulty: string
  estimated_hours: number
  skills: string[]
  published: boolean
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
  title: string
  order_index: number
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  youtube_video_id: string
  notes?: string
  order_index: number
  concept_ids: string[]
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
  current_lesson_id?: string
  progress_percent: number
  final_score?: number
  certificate_id?: string
  financial_aid: boolean
}

// API Response
export interface ApiResponse<T> {
  data?: T
  error?: string
}
