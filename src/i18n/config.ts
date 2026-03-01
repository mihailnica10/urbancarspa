/**
 * i18next configuration for server-side rendering
 */

import * as i18next from 'i18next'

// Supported locales
export const SUPPORTED_LOCALES = ['ro', 'en'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]

// Default locale (Romanian)
export const DEFAULT_LOCALE: Locale = 'ro'

// Locale names for display
export const LOCALE_NAMES: Record<Locale, string> = {
  ro: 'Română',
  en: 'English',
}

// Inline translations for the Worker environment
const TRANSLATIONS = {
  ro: {
    common: {
      welcome: 'Bine ai venit',
      loading: 'Se încarcă...',
      readMore: 'Citește mai mult',
      contact: 'Contact',
      appointments: 'Programări',
      services: 'Servicii',
      about: 'Despre',
      home: 'Acasă',
    },
    tenant: {
      tagline: 'Servicii premium',
      bookNow: 'Programează acum',
      callNow: 'Sună acum',
    },
    errors: {
      notFound: 'Pagina nu a fost găsită',
      somethingWentWrong: 'Ceva nu a mers bine',
    },
  },
  en: {
    common: {
      welcome: 'Welcome',
      loading: 'Loading...',
      readMore: 'Read more',
      contact: 'Contact',
      appointments: 'Appointments',
      services: 'Services',
      about: 'About',
      home: 'Home',
    },
    tenant: {
      tagline: 'Premium services',
      bookNow: 'Book now',
      callNow: 'Call now',
    },
    errors: {
      notFound: 'Page not found',
      somethingWentWrong: 'Something went wrong',
    },
  },
}

// Configure i18next
export async function configureI18n(locale: Locale = DEFAULT_LOCALE) {
  await i18next.init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES,
    defaultNS: 'common',
    ns: ['common', 'tenant', 'errors'],
    resources: TRANSLATIONS,
    react: {
      useSuspense: false,
    },
  })

  return i18next
}

// Get locale from Accept-Language header
export function getLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase())

  // Find first supported locale
  for (const lang of languages) {
    // Direct match
    if (SUPPORTED_LOCALES.includes(lang as Locale)) {
      return lang as Locale
    }

    // Prefix match (e.g., 'ro-RO' -> 'ro')
    const prefix = lang.split('-')[0] as Locale
    if (SUPPORTED_LOCALES.includes(prefix)) {
      return prefix
    }
  }

  return DEFAULT_LOCALE
}

// Detect locale from URL, header, or cookie
export function detectLocale(
  url: URL,
  headers: Headers,
  cookies: Record<string, string>
): Locale {
  const pathname = url.pathname

  // 1. Check URL path
  const pathSegments = pathname.split('/').filter(Boolean)
  const potentialLocale = pathSegments[0] as Locale

  if (SUPPORTED_LOCALES.includes(potentialLocale)) {
    return potentialLocale
  }

  // 2. Check cookie
  const cookieLocale = cookies['userLanguage'] || cookies['i18next']
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale
  }

  // 3. Check Accept-Language header
  const acceptLanguage = headers.get('accept-language')
  return getLocaleFromHeader(acceptLanguage)
}

// Get localized URL
export function getLocalizedUrl(path: string, locale: Locale): string {
  // Remove leading slash
  const cleanPath = path.replace(/^\//, '')

  // Return with locale prefix
  return `/${locale}${cleanPath ? '/' + cleanPath : ''}`
}

// Get alternate locales for a page
export function getAlternateLocales(path: string): Record<Locale, string> {
  const pathWithoutLocale = path.replace(/^\/[a-z]{2}(\/|$)/, '/')
  const baseUrl = pathWithoutLocale || '/'

  return {
    ro: `/ro${baseUrl === '/' ? '' : baseUrl}`,
    en: `/en${baseUrl === '/' ? '' : baseUrl}`,
  }
}
