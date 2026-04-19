/**
 * Directix i18n - Internationalization support for directive messages
 *
 * Provides locale-aware warning messages, error messages, and help text
 * for all Directix directives.
 */

export { createI18n, getLocale, setLocale, t, type I18nInstance, type I18nMessages, type I18nOptions } from './i18n'
export { enUS } from './locales/en-US'
export { jaJP } from './locales/ja-JP'
export { zhCN } from './locales/zh-CN'
