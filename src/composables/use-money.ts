import { computed, ref, type Ref, unref, watch } from 'vue'

/**
 * Options for useMoney composable
 */
export interface UseMoneyOptions {
	/**
	 * The numeric value
	 */
	value: number | Ref<number>

	/**
	 * Currency symbol
	 * @default '$'
	 */
	symbol?: string | Ref<string>

	/**
	 * Symbol position
	 * @default 'before'
	 */
	symbolPosition?: 'before' | 'after' | Ref<'before' | 'after'>

	/**
	 * Number of decimal places
	 * @default 2
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
}

/**
 * Return type for useMoney composable
 */
export interface UseMoneyReturn {
	/**
	 * The formatted money string
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
 * Format number to money string
 */
function formatMoney(
	value: number,
	options: {
		precision?: number
		separator?: string
		decimal?: string
		symbol?: string
		symbolPosition?: 'before' | 'after'
	} = {},
): string {
	const {
		precision = 2,
		separator = ',',
		decimal = '.',
		symbol = '$',
		symbolPosition = 'before',
	} = options

	const fixed = value.toFixed(precision)
	const [intPart, decPart] = fixed.split('.')

	// Add thousands separator
	const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)

	let result = formattedInt

	if (precision > 0 && decPart) {
		result += decimal + decPart
	}

	return symbolPosition === 'before' ? symbol + result : result + symbol
}

/**
 * Parse formatted money string to number
 */
function parseMoney(
	formatted: string,
	options: {
		decimal?: string
		symbol?: string
	} = {},
): number {
	const { decimal = '.', symbol = '$' } = options

	// Remove symbol and whitespace
	let cleaned = formatted.replace(new RegExp(`[${symbol}\\s]`, 'g'), '')

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
 * Composable for formatting numbers as money
 *
 * @param options - Configuration options
 * @returns Money formatting utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useMoney } from 'directix'
 *
 * const price = ref(1234.56)
 *
 * const { formatted } = useMoney({
 *   value: price,
 *   symbol: '€',
 *   symbolPosition: 'after'
 * })
 * // formatted.value = '1,234.56€'
 * </script>
 *
 * <template>
 *   <span>{{ formatted }}</span>
 * </template>
 * ```
 */
export function useMoney(options: UseMoneyOptions): UseMoneyReturn {
	const {
		value,
		symbol = '$',
		symbolPosition = 'before',
		precision = 2,
		separator = ',',
		decimal = '.',
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
		symbol: string
		symbolPosition: 'before' | 'after'
	} {
		return {
			precision: unref(precision),
			separator: unref(separator),
			decimal: unref(decimal),
			symbol: unref(symbol),
			symbolPosition: unref(symbolPosition),
		}
	}

	/**
	 * Formatted money string
	 */
	const formatted = computed(() => {
		return formatMoney(valueRef.value, getFormatOptions())
	})

	/**
	 * Parse formatted string to number
	 */
	function parse(formattedString: string): number {
		return parseMoney(formattedString, {
			decimal: unref(decimal),
			symbol: unref(symbol),
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
 * Utility function to format number as money
 *
 * @param value - Numeric value
 * @param options - Format options
 * @returns Formatted money string
 *
 * @example
 * ```ts
 * import { formatMoney } from 'directix'
 *
 * formatMoney(1234.56) // '$1,234.56'
 * formatMoney(1234.56, { symbol: '€', symbolPosition: 'after' }) // '1,234.56€'
 * ```
 */
export { formatMoney, parseMoney }

/**
 * Create a money formatter with preset options
 *
 * @param options - Format options
 * @returns Money formatter function
 *
 * @example
 * ```ts
 * import { createMoneyFormatter } from 'directix'
 *
 * const formatEuro = createMoneyFormatter({ symbol: '€', symbolPosition: 'after' })
 * formatEuro(1234.56) // '1,234.56€'
 * ```
 */
export function createMoneyFormatter(
	options: {
		symbol?: string
		symbolPosition?: 'before' | 'after'
		precision?: number
		separator?: string
		decimal?: string
	} = {},
): (value: number) => string {
	return (value: number) => formatMoney(value, options)
}
