import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => ({
  locale: 'en',
  messages: {
    en: (await import('./lib/i18n/en.json')).default,
    bn: (await import('./lib/i18n/bn.json')).default,
  },
  defaultLocale: 'en',
  timeZone: 'Asia/Dhaka',
}))
