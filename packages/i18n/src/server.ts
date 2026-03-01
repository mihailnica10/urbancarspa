/**
 * Server-side i18next configuration
 * For Astro SSR and API routes
 */

import { createInstance } from 'i18next'
import { i18nConfig, type SupportedLocale } from './config.js'
import * as ro from '../locales/ro/common.json' assert { type: 'json' }
import * as en from '../locales/en/common.json' assert { type: 'json' }

const resources = {
  ro: { common: ro.default },
  en: { common: en.default },
}

/**
 * Create an i18next instance for server-side use
 */
export async function initServerI18n(locale: SupportedLocale = 'ro') {
  const i18n = createInstance({
    ...i18nConfig,
    lng: locale,
    resources,
  })

  await i18n.init()
  return i18n
}

/**
 * Get translations for a specific locale (for Astro SSR)
 */
export function getTranslations(locale: SupportedLocale) {
  return resources[locale]?.common || resources.ro.common
}

/**
 * Get a translation function for server-side rendering
 */
export function getTranslator(locale: SupportedLocale) {
  const translations = getTranslations(locale)

  return function t(key: string, params?: Record<string, string | number>) {
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      value = value?.[k]
    }

    if (typeof value !== 'string') {
      return key
    }

    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, paramKey) => params[paramKey]?.toString() || '')
    }

    return value
  }
}

export { i18nConfig, SUPPORTED_LOCALES, DEFAULT_LOCALE }
export type { SupportedLocale }
