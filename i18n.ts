import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

const locales = ['en', 'bn'] as const

export default getRequestConfig(async () => {
  const locale = 'en' // default
  
  if (!locales.includes(locale as any)) notFound()

  return {
    locale,
    messages: {
      en: (await import('./lib/i18n/en.json')).default,
      bn: (await import('./lib/i18n/bn.json')).default,
    },
  }
})
