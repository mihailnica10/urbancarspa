/**
 * Client-side i18next configuration
 * For React apps (admin panel)
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { i18nConfig } from './config.js'

// Initialize i18next for client-side
export async function initClientI18n() {
  await i18n.use(initReactI18next).init(i18nConfig)

  // Load translations dynamically
  const locales = import.meta.glob<Record<string, string>>('../../locales/*.json', { eager: true })

  for (const locale of i18nConfig.supportedLngs || []) {
    const path = `../../locales/${locale}/common.json`
    const translations = locales[path]?.default || {}

    i18n.addResourceBundle(locale, 'common', translations, true, true)
  }

  return i18n
}

export { i18n }
export { useTranslation } from 'react-i18next'
export type { SupportedLocale } from './config.js'
