import { computed, ref, type Ref, unref, watch } from 'vue'

/**
 * Options for useNumber composable
 */
export interface UseNumberOptions {
	/**
	 * The numeric value
	 */
	value: number | Ref<number>

	/**
	 * Number of decimal places
	 * @default 0
	 */
	precision?: number | Ref<number>

	/**
	 * Thousands separator
	 * @default ','
	 */
	separator?: string | Ref<string>

	/**
	 * Decimal separator
	 * @default '.'
	 */
	decimal?: string | Ref<string>

	/**
	 * Prefix string (e.g., '$')
	 */
	prefix?: string | Ref<string>

	/**
	 * Suffix string (e.g., '%')
	 */
	suffix?: string | Ref<string>
}

/**
 * Return type for useNumber composable
 */
export interface UseNumberReturn {
	/**
	 * The formatted number string
	 */
	formatted: Ref<string>

	/**
	 * The numeric value
	 */
	value: Ref<number>

	/**
	 * Parse a formatted string back to number
	 */
	parse: (formatted: string) => number
}

/**
 * Format number with options
 */
function formatNumber(
	value: number,
	options: {
		precision?: number
		separator?: string
		decimal?: string
		prefix?: string
		suffix?: string
	} = {},
): string {
	const {
		precision = 0,
		separator = ',',
		decimal = '.',
		prefix = '',
		suffix = '',
	} = options

	const fixed = value.toFixed(precision)
	const [intPart, decPart] = fixed.split('.')

	// Add thousands separator
	const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)

	let result = formattedInt

	if (precision > 0 && decPart) {
		result += decimal + decPart
	}

	return prefix + result + suffix
}

/**
 * Parse formatted number string to number
 */
function parseNumber(
	formatted: string,
	options: {
		decimal?: string
		prefix?: string
		suffix?: string
	} = {},
): number {
	const { decimal = '.', prefix = '', suffix = '' } = options

	// Remove prefix, suffix, and whitespace
	let cleaned = formatted
		.replace(new RegExp(`^${escapeRegex(prefix)}`), '')
		.replace(new RegExp(`${escapeRegex(suffix)}$`), '')
		.replace(/\s/g, '')

	// Handle different decimal separators
	if (decimal !== '.') {
		// Remove thousands separators (usually ',')
		cleaned = cleaned.replace(/,/g, '')
		// Replace decimal separator with '.'
		cleaned = cleaned.replace(new RegExp(`\\${decimal}`, 'g'), '.')
	} else {
		// Remove thousands separators
		cleaned = cleaned.replace(/,/g, '')
	}

	return parseFloat(cleaned) || 0
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Composable for formatting numbers
 *
 * @param options - Configuration options
 * @returns Number formatting utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useNumber } from 'directix'
 *
 * const count = ref(1234567)
 *
 * const { formatted } = useNumber({
 *   value: count,
 *   precision: 2,
 *   suffix: ' items'
 * })
 * // formatted.value = '1,234,567.00 items'
 * </script>
 *
 * <template>
 *   <span>{{ formatted }}</span>
 * </template>
 * ```
 */
export function useNumber(options: UseNumberOptions): UseNumberReturn {
	const {
		value,
		precision = 0,
		separator = ',',
		decimal = '.',
		prefix = '',
		suffix = '',
	} = options

	// State
	const valueRef = ref(unref(value))

	/**
	 * Get format options
	 */
	function getFormatOptions(): {
		precision: number
		separator: string
		decimal: string
		prefix: string
		suffix: string
	} {
		return {
			precision: unref(precision),
			separator: unref(separator),
			decimal: unref(decimal),
			prefix: unref(prefix),
			suffix: unref(suffix),
		}
	}

	/**
	 * Formatted number string
	 */
	const formatted = computed(() => {
		return formatNumber(valueRef.value, getFormatOptions())
	})

	/**
	 * Parse formatted string to number
	 */
	function parse(formattedString: string): number {
		return parseNumber(formattedString, {
			decimal: unref(decimal),
			prefix: unref(prefix),
			suffix: unref(suffix),
		})
	}

	// Watch for value changes
	watch(
		() => unref(value),
		newValue => {
			valueRef.value = newValue
		},
	)

	return {
		value: valueRef,
		formatted,
		parse,
	}
}

/**
 * Utility function to format number
 *
 * @param value - Numeric value
 * @param options - Format options
 * @returns Formatted number string
 *
 * @example
 * ```ts
 * import { formatNumber } from 'directix'
 *
 * formatNumber(1234567) // '1,234,567'
 * formatNumber(1234.56, { precision: 2, suffix: '%' }) // '1,234.56%'
 * ```
 */
export { formatNumber, parseNumber }

/**
 * Create a number formatter with preset options
 *
 * @param options - Format options
 * @returns Number formatter function
 *
 * @example
 * ```ts
 * import { createNumberFormatter } from 'directix'
 *
 * const formatPercent = createNumberFormatter({ suffix: '%', precision: 1 })
 * formatPercent(85.5) // '85.5%'
 * ```
 */
export function createNumberFormatter(
	options: {
		precision?: number
		separator?: string
		decimal?: string
		prefix?: string
		suffix?: string
	} = {},
): (value: number) => string {
	return (value: number) => formatNumber(value, options)
}
