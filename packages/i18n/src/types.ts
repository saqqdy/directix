/**
 * i18n type definitions
 */

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
 * i18n options
 */
export interface I18nOptions {
	locale?: string
	fallbackLocale?: string
	messages: Record<string, I18nMessages>
}

/**
 * i18n instance
 */
export interface I18nInstance {
	locale: string
	fallbackLocale: string
	messages: I18nMessages
	setLocale: (locale: string) => void
	t: (key: string, params?: Record<string, any>) => string
}
