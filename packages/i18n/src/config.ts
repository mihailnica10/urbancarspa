import type { InitOptions } from 'i18next'

export const DEFAULT_LOCALE = 'ro'
export const SUPPORTED_LOCALES = ['ro', 'en'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const i18nConfig: InitOptions = {
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: SUPPORTED_LOCALES,
  defaultNS: 'common',
  ns: ['common'],
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false,
  },
}
