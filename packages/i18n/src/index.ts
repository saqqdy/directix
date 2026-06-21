/**
 * Directix i18n - Internationalization support for directive messages
 *
 * Provides locale-aware warning messages, error messages, and help text
 * for all Directix directives.
 */

// Export locale detection and loading
export { LocaleDetector } from './detector'
export { createI18n, getLocale, setLocale, t, type I18nInstance, type I18nMessages, type I18nOptions } from './i18n'
export { LocaleLoader } from './loader'
// Export timezone and locale utilities
export {
	detectLocaleInfo,
	formatCurrencyLocale,
	formatDateLocale,
	formatNumberLocale,
	getDateFormat,
	getLocaleDisplayName,
	getNumberFormat,
	getSupportedRegions,
	getTimezoneInfo,
	parseLocale,
	type DateFormatOptions,
	type LocaleInfo,
	type NumberFormatOptions,
	type TimezoneInfo,
} from './locale'
// Export all locale messages (alphabetical order)
export { deDE } from './locales/de-DE'
export { enUS } from './locales/en-US'
export { esES } from './locales/es-ES'
export { frFR } from './locales/fr-FR'
export { jaJP } from './locales/ja-JP'
export { koKR } from './locales/ko-KR'
export { ruRU } from './locales/ru-RU'
export { zhCN } from './locales/zh-CN'
