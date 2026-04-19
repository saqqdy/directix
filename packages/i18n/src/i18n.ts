import type { I18nMessages, I18nOptions } from './types'
import { zhCN } from './locales/zh-CN'

// Re-export types
export type { DirectiveMessages, ErrorMessages, I18nMessages, I18nOptions, WarningMessages } from './types'

/**
 * Global i18n instance
 */
let currentLocale = 'zh-CN',
	currentMessages: I18nMessages = zhCN

/**
 * Create i18n instance
 */
export function createI18n(options: I18nOptions): I18nInstance {
	const { locale = 'zh-CN', fallbackLocale = 'en-US', messages } = options

	currentLocale = locale
	currentMessages = messages[locale] || messages[fallbackLocale] || zhCN

	return {
		locale: currentLocale,
		fallbackLocale,
		messages: currentMessages,
		setLocale: (newLocale: string) => {
			currentLocale = newLocale
			if (messages[newLocale]) {
				currentMessages = messages[newLocale]
			}
		},
		t: (key: string, params?: Record<string, any>) => t(key, params),
	}
}

/**
 * Set current locale
 */
export function setLocale(locale: string): void {
	currentLocale = locale
}

/**
 * Get current locale
 */
export function getLocale(): string {
	return currentLocale
}

/**
 * Translate a message key
 * @param key - Dot-notation key like 'directives.debounce.invalid_wait'
 * @param params - Interpolation parameters
 */
export function t(key: string, params?: Record<string, any>): string {
	const keys = key.split('.')
	let result: any = currentMessages

	for (const k of keys) {
		if (result && typeof result === 'object' && k in result) {
			result = result[k]
		} else {
			return key
		}
	}

	if (typeof result !== 'string') {
		return key
	}

	// Interpolate parameters
	if (params) {
		return result.replace(/\{(\w+)\}/g, (_, name) => {
			return params[name] !== undefined ? String(params[name]) : `{${name}}`
		})
	}

	return result
}

/**
 * i18n instance type
 */
export interface I18nInstance {
	locale: string
	fallbackLocale: string
	messages: I18nMessages
	setLocale: (locale: string) => void
	t: (key: string, params?: Record<string, any>) => string
}
