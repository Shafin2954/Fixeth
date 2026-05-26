'use client'

import { Lesson } from '@/types'
import Link from 'next/link'

interface LessonListProps {
  lessons: Lesson[]
  moduleId: string
}

export function LessonList({ lessons, moduleId }: LessonListProps) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson) => (
        <Link
          key={lesson.id}
          href={`/tracks/lesson/${lesson.id}`}
          className="block p-4 border rounded hover:bg-gray-50"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">{lesson.title}</p>
              <p className="text-sm text-gray-500">{lesson.youtube_video_id && '📹 Video'}</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
