/**
 * i18n type definitions
 */

/**
 * Supported locale codes
 */
export type LocaleCode
	= | 'zh-CN'
		| 'en-US'
		| 'ja-JP'
		| 'ko-KR'
		| 'fr-FR'
		| 'de-DE'
		| 'es-ES'
		| 'ru-RU'

/**
 * Locale messages structure
 */
export interface I18nMessages {
	directives: Record<string, DirectiveMessages>
	errors: ErrorMessages
	warnings: WarningMessages
	help: Record<string, string>
}

/**
 * Per-directive messages
 */
export interface DirectiveMessages {
	description: string
	params?: Record<string, string>
	errors?: Record<string, string>
	warnings?: Record<string, string>
}

/**
 * Global error messages
 */
export interface ErrorMessages {
	invalid_param: string
	missing_required: string
	type_error: string
	value_out_of_range: string
	not_supported: string
	ssr_not_supported: string
}

/**
 * Global warning messages
 */
export interface WarningMessages {
	deprecated: string
	experimental: string
	performance: string
	fallback: string
}

/**
 * i18n configuration
 */
export interface I18nConfig {
	/** Current locale */
	locale: LocaleCode
	/** Fallback locale when translation is missing */
	fallback?: LocaleCode
	/** Whether to suppress missing translation warnings */
	silent?: boolean
}

/**
 * i18n options (user-facing)
 */
export interface I18nOptions {
	locale?: LocaleCode
	fallbackLocale?: LocaleCode
	messages: Record<string, I18nMessages>
}

/**
 * i18n instance
 */
export interface I18nInstance {
	locale: LocaleCode
	fallbackLocale: LocaleCode
	messages: I18nMessages
	setLocale: (locale: LocaleCode) => void
	t: (key: string, params?: Record<string, any>) => string
}

/**
 * Validation result for locale checking
 */
export interface LocaleValidationResult {
	locale: string
	missing: string[]
	extra: string[]
	coverage: number
}

/**
 * Translation quality issue
 */
export interface TranslationIssue {
	key: string
	issue: string
	severity: 'error' | 'warning'
}
