/**
 * Directix i18n - Internationalization support for directive messages
 *
 * Provides locale-aware warning messages, error messages, and help text
 * for all Directix directives.
 */

export { createI18n, getLocale, setLocale, t, type I18nInstance, type I18nMessages, type I18nOptions } from './i18n'
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
export { enUS } from './locales/en-US'
export { jaJP } from './locales/ja-JP'

export { zhCN } from './locales/zh-CN'
