'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6">
          <h2 className="font-bold text-lg">Fixeth</h2>
        </div>
        <nav className="space-y-2 px-4">
          <Link
            href="/dashboard"
            className="block p-3 rounded hover:bg-gray-100 font-medium"
          >
            {t('dashboard.overview')}
          </Link>
          <Link
            href="/tracks"
            className="block p-3 rounded hover:bg-gray-100"
          >
            {t('dashboard.tracks')}
          </Link>
          <Link
            href="/profile"
            className="block p-3 rounded hover:bg-gray-100"
          >
            {t('dashboard.profile')}
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
