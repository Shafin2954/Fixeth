'use client'

import { useTranslations } from 'next-intl'

interface DashboardStatsProps {
  enrollmentsCount: number
  progressPercent: number
  streak: number
}

export function DashboardStats({
  enrollmentsCount,
  progressPercent,
  streak,
}: DashboardStatsProps) {
  const t = useTranslations()

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg border">
        <p className="text-gray-600 text-sm">{t('dashboard.enrollments')}</p>
        <p className="text-2xl font-bold mt-2">{enrollmentsCount}</p>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <p className="text-gray-600 text-sm">{t('dashboard.progress')}</p>
        <p className="text-2xl font-bold mt-2">{progressPercent}%</p>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <p className="text-gray-600 text-sm">{t('dashboard.streak')}</p>
        <p className="text-2xl font-bold mt-2">🔥 {streak}</p>
      </div>
    </div>
  )
}
