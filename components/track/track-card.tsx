'use client'

import Link from 'next/link'
import { Track } from '@/types'
import { useTranslations } from 'next-intl'

interface TrackCardProps {
  track: Track
}

export function TrackCard({ track }: TrackCardProps) {
  const t = useTranslations()

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{track.title}</h3>
      <p className="text-gray-600 text-sm mt-2">{track.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-blue-600 font-semibold">
          ৳{(track.price / 100).toFixed(2)}
        </span>
        <Link
          href={`/tracks/${track.slug}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {t('actions.view')} →
        </Link>
      </div>
    </div>
  )
}
