'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function Navbar() {
  const t = useTranslations()

  return (
    <nav className="border-b bg-white">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold">
          Fixeth
        </Link>
        <div className="flex gap-4">
          <Link href="/tracks" className="hover:text-blue-600">
            {t('nav.tracks')}
          </Link>
          <Link href="/dashboard" className="hover:text-blue-600">
            {t('nav.dashboard')}
          </Link>
          <Link href="/profile" className="hover:text-blue-600">
            {t('nav.profile')}
          </Link>
        </div>
      </div>
    </nav>
  )
}
