/**
 * Unified warning/error system for Directix directives
 *
 * Provides structured, localized error messages with:
 * - Directive name context
 * - Parameter validation messages
 * - Stack trace in development mode
 * - Warning levels (debug, info, warn, error)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface WarningOptions {
	/** Directive name */
	directive?: string
	/** Message key or raw message */
	message: string
	/** Additional context parameters */
	params?: Record<string, any>
	/** Log level */
	level?: LogLevel
	/** Stack trace (only in development) */
	stack?: boolean
}

let globalI18n: ((key: string, params?: Record<string, any>) => string) | null = null,
	isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production',
	globalLevel: LogLevel = 'warn'

/**
 * Set i18n translation function
 */
export function setWarningI18n(t: (key: string, params?: Record<string, any>) => string): void {
	globalI18n = t
}

/**
 * Set development mode
 */
export function setWarningDevMode(dev: boolean): void {
	isDev = dev
}

/**
 * Set global log level
 */
export function setWarningLevel(level: LogLevel): void {
	globalLevel = level
}

/**
 * Format a warning message
 */
function formatMessage(options: WarningOptions): string {
	const { directive, message, params = {} } = options

	// Try i18n translation first
	let formattedMessage = message
	if (globalI18n && !message.includes(' ')) {
		// Looks like a translation key
		const key = directive ? `directives.${directive}.${message}` : message
		const translated = globalI18n(key, params)
		if (translated !== key) {
			formattedMessage = translated
		}
	}

	// Interpolate parameters
	if (params && Object.keys(params).length > 0) {
		formattedMessage = formattedMessage.replace(/\{(\w+)\}/g, (_, name) => {
			return params[name] !== undefined ? String(params[name]) : `{${name}}`
		})
	}

	// Add directive prefix
	if (directive) {
		return `[Directix] v-${directive}: ${formattedMessage}`
	}

	return `[Directix] ${formattedMessage}`
}

/**
 * Log a message with the appropriate level
 */
function log(level: LogLevel, message: string, showStack = false): void {
	const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
	const currentIndex = levels.indexOf(globalLevel)
	const messageIndex = levels.indexOf(level)

	// Skip if message level is below global level
	if (messageIndex < currentIndex) return

	// Debug uses info, others use their own method
	const effectiveLevel = level === 'debug' ? 'info' : level
	const stackTrace = showStack && isDev ? `\n${new Error('Stack trace').stack?.split('\n').slice(2).join('\n')}` : ''

	if (effectiveLevel === 'info') {
		console.info(message, stackTrace)
	} else if (effectiveLevel === 'warn') {
		console.warn(message, stackTrace)
	} else if (effectiveLevel === 'error') {
		console.error(message, stackTrace)
	}
}

/**
 * Show a debug message (only in development)
 */
export function debug(message: string, params?: Record<string, any>): void {
	log('debug', formatMessage({ message, params }), false)
}

/**
 * Show an info message
 */
export function info(message: string, params?: Record<string, any>): void {
	log('info', formatMessage({ message, params }), false)
}

/**
 * Show a warning message
 */
export function warn(options: WarningOptions): void
export function warn(message: string, params?: Record<string, any>): void
export function warn(optionsOrMessage: WarningOptions | string, params?: Record<string, any>): void {
	const options = typeof optionsOrMessage === 'string' ? { message: optionsOrMessage, params } : optionsOrMessage

	log(options.level || 'warn', formatMessage(options), options.stack && isDev)
}

/**
 * Show an error message
 */
export function error(options: WarningOptions): void
export function error(message: string, params?: Record<string, any>): void
export function error(optionsOrMessage: WarningOptions | string, params?: Record<string, any>): void {
	const options = typeof optionsOrMessage === 'string' ? { message: optionsOrMessage, params, level: 'error' as LogLevel } : { ...optionsOrMessage, level: 'error' as LogLevel }

	log('error', formatMessage(options), options.stack && isDev)
}

/**
 * Directive-specific warning helper
 */
export function directiveWarn(directive: string, message: string, params?: Record<string, any>): void {
	warn({ directive, message, params })
}

/**
 * Directive-specific error helper
 */
export function directiveError(directive: string, message: string, params?: Record<string, any>): void {
	error({ directive, message, params })
}

/**
 * Parameter validation warning
 */
export function warnInvalidParam(directive: string, param: string, value: any, expected: string): void {
	warn({
		directive,
		message: 'errors.type_error',
		params: { param, expected, actual: typeof value },
	})
}

/**
 * Missing parameter warning
 */
export function warnMissingParam(directive: string, param: string): void {
	warn({
		directive,
		message: 'errors.missing_required',
		params: { param },
	})
}

/**
 * SSR not supported warning
 */
export function warnSSRNotSupported(directive: string): void {
	warn({
		directive,
		message: 'errors.ssr_not_supported',
		params: { directive },
	})
}

/**
 * Deprecation warning
 */
export function warnDeprecated(feature: string, alternative: string): void {
	warn({
		message: 'warnings.deprecated',
		params: { feature, alternative },
	})
}

/**
 * Feature not supported warning
 */
export function warnNotSupported(feature: string): void {
	warn({
		message: 'errors.not_supported',
		params: { feature },
	})
}

/**
 * Assert a condition and throw an error if false
 */
export function assert(condition: boolean, message: string, directive?: string): asserts condition {
	if (!condition) {
		throw new Error(formatMessage({ directive, message }))
	}
}

/**
 * Assert a parameter type
 */
export function assertType<T>(
	value: unknown,
	type: 'string' | 'number' | 'boolean' | 'object' | 'function' | 'symbol' | 'bigint' | 'undefined',
	directive: string,
	param: string,
): asserts value is T {
	// eslint-disable-next-line valid-typeof
	if (typeof value !== type) {
		throw new TypeError(formatMessage({
			directive,
			message: 'errors.type_error',
			params: { param, expected: type, actual: typeof value },
		}))
	}
}

/**
 * Assert a number is positive
 */
export function assertPositive(value: number, directive: string, param: string): void {
	assertType<number>(value, 'number', directive, param)
	if (value <= 0) {
		throw new Error(formatMessage({
			directive,
			message: 'errors.value_out_of_range',
			params: { param, min: '0', max: 'Infinity' },
		}))
	}
}

/**
 * Assert a number is within range
 */
export function assertRange(
	value: number,
	min: number,
	max: number,
	directive: string,
	param: string,
): void {
	assertType<number>(value, 'number', directive, param)
	if (value < min || value > max) {
		throw new Error(formatMessage({
			directive,
			message: 'errors.value_out_of_range',
			params: { param, min: String(min), max: String(max) },
		}))
	}
}
