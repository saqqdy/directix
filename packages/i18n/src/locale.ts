/**
 * Timezone and locale utilities
 *
 * Provides timezone-aware formatting and locale detection for Directix.
 */

/**
 * Timezone info
 */
export interface TimezoneInfo {
	/** Timezone identifier (e.g., 'Asia/Shanghai') */
	id: string
	/** UTC offset in hours */
	offset: number
	/** Offset string (e.g., '+08:00') */
	offsetString: string
	/** Whether DST is active */
	isDST: boolean
	/** Locale timezone name */
	name: string
}

/**
 * Locale info
 */
export interface LocaleInfo {
	/** Locale code (e.g., 'zh-CN') */
	locale: string
	/** Language code (e.g., 'zh') */
	language: string
	/** Region/country code (e.g., 'CN') */
	region: string | null
	/** Script code (e.g., 'Hant') */
	script: string | null
	/** Browser detected locale */
	browserLocale: string
	/** System timezone */
	timezone: string
}

/**
 * Date format options per region
 */
export interface DateFormatOptions {
	/** Date format pattern */
	datePattern: string
	/** Time format pattern */
	timePattern: string
	/** 12/24 hour format */
	hourCycle: 'h12' | 'h23' | 'h24'
	/** First day of week (0=Sunday, 1=Monday) */
	firstDayOfWeek: number
	/** Date separator */
	dateSeparator: string
	/** Time separator */
	timeSeparator: string
}

/**
 * Number format options per region
 */
export interface NumberFormatOptions {
	/** Decimal separator */
	decimalSeparator: string
	/** Thousands separator */
	thousandsSeparator: string
	/** Currency symbol */
	currencySymbol: string
	/** Currency position ('before' or 'after') */
	currencyPosition: 'before' | 'after'
	/** Decimal places for currency */
	currencyDecimals: number
}

/**
 * Region-specific formatting defaults
 */
const REGION_FORMATS: Record<string, { date: DateFormatOptions, number: NumberFormatOptions }> = {
	CN: {
		date: {
			datePattern: 'YYYY-MM-DD',
			timePattern: 'HH:mm:ss',
			hourCycle: 'h23',
			firstDayOfWeek: 1,
			dateSeparator: '-',
			timeSeparator: ':',
		},
		number: {
			decimalSeparator: '.',
			thousandsSeparator: ',',
			currencySymbol: '¥',
			currencyPosition: 'before',
			currencyDecimals: 2,
		},
	},
	US: {
		date: {
			datePattern: 'MM/DD/YYYY',
			timePattern: 'hh:mm:ss a',
			hourCycle: 'h12',
			firstDayOfWeek: 0,
			dateSeparator: '/',
			timeSeparator: ':',
		},
		number: {
			decimalSeparator: '.',
			thousandsSeparator: ',',
			currencySymbol: '$',
			currencyPosition: 'before',
			currencyDecimals: 2,
		},
	},
	JP: {
		date: {
			datePattern: 'YYYY/MM/DD',
			timePattern: 'HH:mm:ss',
			hourCycle: 'h23',
			firstDayOfWeek: 0,
			dateSeparator: '/',
			timeSeparator: ':',
		},
		number: {
			decimalSeparator: '.',
			thousandsSeparator: ',',
			currencySymbol: '¥',
			currencyPosition: 'before',
			currencyDecimals: 0,
		},
	},
	DE: {
		date: {
			datePattern: 'DD.MM.YYYY',
			timePattern: 'HH:mm:ss',
			hourCycle: 'h23',
			firstDayOfWeek: 1,
			dateSeparator: '.',
			timeSeparator: ':',
		},
		number: {
			decimalSeparator: ',',
			thousandsSeparator: '.',
			currencySymbol: '€',
			currencyPosition: 'after',
			currencyDecimals: 2,
		},
	},
	FR: {
		date: {
			datePattern: 'DD/MM/YYYY',
			timePattern: 'HH:mm:ss',
			hourCycle: 'h23',
			firstDayOfWeek: 1,
			dateSeparator: '/',
			timeSeparator: ':',
		},
		number: {
			decimalSeparator: ',',
			thousandsSeparator: ' ',
			currencySymbol: '€',
			currencyPosition: 'after',
			currencyDecimals: 2,
		},
	},
	GB: {
		date: {
			datePattern: 'DD/MM/YYYY',
			timePattern: 'HH:mm:ss',
			hourCycle: 'h23',
			firstDayOfWeek: 1,
			dateSeparator: '/',
			timeSeparator: ':',
		},
		number: {
			decimalSeparator: '.',
			thousandsSeparator: ',',
			currencySymbol: '£',
			currencyPosition: 'before',
			currencyDecimals: 2,
		},
	},
	KR: {
		date: {
			datePattern: 'YYYY.MM.DD',
			timePattern: 'HH:mm:ss',
			hourCycle: 'h23',
			firstDayOfWeek: 0,
			dateSeparator: '.',
			timeSeparator: ':',
		},
		number: {
			decimalSeparator: '.',
			thousandsSeparator: ',',
			currencySymbol: '₩',
			currencyPosition: 'before',
			currencyDecimals: 0,
		},
	},
	IN: {
		date: {
			datePattern: 'DD/MM/YYYY',
			timePattern: 'HH:mm:ss',
			hourCycle: 'h23',
			firstDayOfWeek: 0,
			dateSeparator: '/',
			timeSeparator: ':',
		},
		number: {
			decimalSeparator: '.',
			thousandsSeparator: ',',
			currencySymbol: '₹',
			currencyPosition: 'before',
			currencyDecimals: 2,
		},
	},
}

/**
 * Default format (ISO-like)
 */
const DEFAULT_FORMAT = {
	date: {
		datePattern: 'YYYY-MM-DD',
		timePattern: 'HH:mm:ss',
		hourCycle: 'h23',
		firstDayOfWeek: 1,
		dateSeparator: '-',
		timeSeparator: ':',
	},
	number: {
		decimalSeparator: '.',
		thousandsSeparator: ',',
		currencySymbol: '$',
		currencyPosition: 'before',
		currencyDecimals: 2,
	},
}

/**
 * Get timezone info
 */
export function getTimezoneInfo(): TimezoneInfo {
	const now = new Date()

	// Get timezone offset
	const offsetMinutes = -now.getTimezoneOffset()
	const offsetHours = offsetMinutes / 60
	const offsetSign = offsetHours >= 0 ? '+' : '-'
	const absHours = Math.abs(Math.floor(offsetHours))
	const absMinutes = Math.abs(offsetMinutes % 60)
	const offsetString = `${offsetSign}${String(absHours).padStart(2, '0')}:${String(absMinutes).padStart(2, '0')}`

	// Try to get timezone name
	let timezoneId = 'UTC',
		timezoneName = 'UTC'

	if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
		try {
			timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone
			timezoneName = timezoneId.split('/').pop() || timezoneId
		} catch {
			// Fallback to offset-based name
			timezoneName = `UTC${offsetString}`
		}
	} else {
		timezoneName = `UTC${offsetString}`
	}

	// Check DST (simplified)
	const janOffset = -new Date(now.getFullYear(), 0, 1).getTimezoneOffset()
	const julOffset = -new Date(now.getFullYear(), 6, 1).getTimezoneOffset()
	const isDST = offsetMinutes !== Math.max(janOffset, julOffset)

	return {
		id: timezoneId,
		name: timezoneName,
		offset: offsetHours,
		offsetString,
		isDST,
	}
}

/**
 * Detect user locale info
 */
export function detectLocaleInfo(): LocaleInfo {
	const browserLocale = typeof navigator !== 'undefined' ? (navigator.language || (navigator as any).userLanguage || 'en-US') : 'en-US'

	const timezone = typeof Intl !== 'undefined' && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'

	// Parse locale
	const parts = browserLocale.split('-')
	const language = parts[0] || 'en'
	let region: string | null = null,
		script: string | null = null

	for (let i = 1; i < parts.length; i++) {
		if (parts[i].length === 2 || parts[i].length === 3) {
			// Region code (2 letters) or script code (4 letters)
			if (parts[i].length === 2) {
				region = parts[i].toUpperCase()
			} else if (parts[i].length === 4) {
				script = parts[i]
			}
		}
	}

	return {
		locale: browserLocale,
		language,
		region,
		script,
		browserLocale,
		timezone,
	}
}

/**
 * Get region-specific date format
 */
export function getDateFormat(region?: string): DateFormatOptions {
	const localeInfo = detectLocaleInfo()
	const targetRegion = region || localeInfo.region || 'US'

	return REGION_FORMATS[targetRegion]?.date || DEFAULT_FORMAT.date
}

/**
 * Get region-specific number format
 */
export function getNumberFormat(region?: string): NumberFormatOptions {
	const localeInfo = detectLocaleInfo()
	const targetRegion = region || localeInfo.region || 'US'

	return REGION_FORMATS[targetRegion]?.number || DEFAULT_FORMAT.number
}

/**
 * Format date with locale-specific pattern
 */
export function formatDateLocale(date: Date | string | number, options?: Partial<DateFormatOptions>): string {
	const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
	const format = options ? { ...getDateFormat(), ...options } : getDateFormat()

	// Use Intl.DateTimeFormat for proper locale formatting
	if (typeof Intl !== 'undefined') {
		try {
			const localeInfo = detectLocaleInfo()
			const formatter = new Intl.DateTimeFormat(localeInfo.locale, {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hourCycle: format.hourCycle === 'h12' ? 'h12' : 'h23',
			})
			return formatter.format(d)
		} catch {
			// Fallback to manual formatting
		}
	}

	// Manual fallback
	const year = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	const hours = String(d.getHours()).padStart(2, '0')
	const minutes = String(d.getMinutes()).padStart(2, '0')
	const seconds = String(d.getSeconds()).padStart(2, '0')

	return `${year}${format.dateSeparator}${month}${format.dateSeparator}${day} ${hours}${format.timeSeparator}${minutes}${format.timeSeparator}${seconds}`
}

/**
 * Format number with locale-specific separators
 */
export function formatNumberLocale(value: number, decimals?: number, options?: Partial<NumberFormatOptions>): string {
	const format = options ? { ...getNumberFormat(), ...options } : getNumberFormat()

	// Use Intl.NumberFormat for proper locale formatting
	if (typeof Intl !== 'undefined') {
		try {
			const localeInfo = detectLocaleInfo()
			const formatter = new Intl.NumberFormat(localeInfo.locale, {
				minimumFractionDigits: decimals ?? 0,
				maximumFractionDigits: decimals ?? 2,
			})
			return formatter.format(value)
		} catch {
			// Fallback to manual formatting
		}
	}

	// Manual fallback
	const fixedValue = decimals !== undefined ? value.toFixed(decimals) : String(value)
	const [intPart, decPart] = fixedValue.split('.')
	const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, format.thousandsSeparator)

	if (decPart) {
		return `${formattedInt}${format.decimalSeparator}${decPart}`
	}
	return formattedInt
}

/**
 * Format currency with locale-specific format
 */
export function formatCurrencyLocale(value: number, options?: Partial<NumberFormatOptions>): string {
	const format = options ? { ...getNumberFormat(), ...options } : getNumberFormat()

	// Use Intl.NumberFormat for proper locale formatting
	if (typeof Intl !== 'undefined') {
		try {
			const localeInfo = detectLocaleInfo()
			const formatter = new Intl.NumberFormat(localeInfo.locale, {
				style: 'currency',
				currency: getCurrencyCode(localeInfo.region || 'US'),
				minimumFractionDigits: format.currencyDecimals,
				maximumFractionDigits: format.currencyDecimals,
			})
			return formatter.format(value)
		} catch {
			// Fallback to manual formatting
		}
	}

	// Manual fallback
	const formattedNumber = formatNumberLocale(value, format.currencyDecimals, format)
	return format.currencyPosition === 'before' ? `${format.currencySymbol}${formattedNumber}` : `${formattedNumber}${format.currencySymbol}`
}

/**
 * Get currency code from region
 */
function getCurrencyCode(region: string): string {
	const CURRENCY_MAP: Record<string, string> = {
		CN: 'CNY',
		US: 'USD',
		JP: 'JPY',
		DE: 'EUR',
		FR: 'EUR',
		GB: 'GBP',
		KR: 'KRW',
		IN: 'INR',
	}
	return CURRENCY_MAP[region] || 'USD'
}

/**
 * Parse locale string into components
 */
export function parseLocale(locale: string): { language: string, region: string | null, script: string | null } {
	const parts = locale.replace(/_/g, '-').split('-')
	const language = parts[0] || 'en'
	let region: string | null = null,
		script: string | null = null

	for (let i = 1; i < parts.length; i++) {
		if (parts[i].length === 2) {
			region = parts[i].toUpperCase()
		} else if (parts[i].length === 4) {
			script = parts[i]
		}
	}

	return { language, region, script }
}

/**
 * Get all supported regions
 */
export function getSupportedRegions(): string[] {
	return Object.keys(REGION_FORMATS)
}

/**
 * Get locale display name
 */
export function getLocaleDisplayName(locale: string, displayLocale?: string): string {
	if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
		try {
			const displayNames = new Intl.DisplayNames([displayLocale || detectLocaleInfo().locale], { type: 'locale' as Intl.DisplayNamesType })
			return displayNames.of(locale) || locale
		} catch {
			return locale
		}
	}
	return locale
}
