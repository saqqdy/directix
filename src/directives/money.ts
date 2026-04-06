import { defineDirective } from '@directix/core'
import { isInputElement } from '@directix/shared'
import { clampValue, type NumberFormatOptions, parseToNumber, setupNumberInput } from '../utils/number'

/**
 * Money directive options
 */
export interface MoneyOptions extends NumberFormatOptions {
	/** Currency symbol @default '$' */
	symbol?: string
	/** Symbol position @default 'before' */
	symbolPosition?: 'before' | 'after'
}

export type MoneyBinding = string | MoneyOptions

interface MoneyState {
	options: MoneyOptions
	cleanup: () => void
}

/**
 * Format number to money string
 */
function formatMoney(value: number, options: MoneyOptions): string {
	const { precision = 2, separator = ',', decimal = '.', symbol = '$', symbolPosition = 'before' } = options

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

export const vMoney = defineDirective<MoneyBinding, HTMLElement>({
	name: 'money',
	ssr: true,

	mounted(el, binding) {
		const options: MoneyOptions = typeof binding.value === 'string' ? { symbol: binding.value } : (binding.value ?? {})

		// Set defaults for money
		options.precision = options.precision ?? 2

		if (isInputElement(el)) {
			const { symbol = '$', symbolPosition = 'before' } = options
			// For money, prefix is the symbol when positioned before
			const prefix = symbolPosition === 'before' ? symbol : ''
			const cleanup = setupNumberInput(el as HTMLInputElement, { ...options, prefix }, formatMoney)

			;(el as any).__money = { options, cleanup }

			// Format initial value after DOM is ready
			requestAnimationFrame(() => {
				const inputEl = el as HTMLInputElement

				if (inputEl.value) {
					const num = parseToNumber(inputEl.value, options.decimal || '.')

					if (num !== null) {
						const formatted = formatMoney(clampValue(num, options), options)

						if (formatted !== inputEl.value) {
							inputEl.value = formatted
							inputEl.dispatchEvent(new Event('input', { bubbles: true }))
						}
					}
				}
			})
		} else {
			// For non-input elements, format the text content
			let value: number | null = null

			if (binding.value && typeof binding.value === 'object' && 'value' in binding.value) {
				value = (binding.value as any).value
			} else {
				// Try to parse from element's text content
				const textContent = el.textContent?.trim()

				if (textContent) {
					value = parseToNumber(textContent, options.decimal || '.')
				}
			}

			if (value !== null) {
				el.textContent = formatMoney(clampValue(value, options), options)
			}
		}
	},

	updated(el, binding) {
		const options: MoneyOptions = typeof binding.value === 'string' ? { symbol: binding.value } : (binding.value ?? {})

		// Set defaults for money
		options.precision = options.precision ?? 2

		const state: MoneyState | undefined = (el as any).__money

		if (state) {
			state.options = options
		} else if (!isInputElement(el)) {
			// Only format non-input elements on update
			let value: number | null = null

			if (binding.value && typeof binding.value === 'object' && 'value' in binding.value) {
				value = (binding.value as any).value
			}

			if (value !== null) {
				el.textContent = formatMoney(clampValue(value, options), options)
			}
		}
	},

	unmounted(el) {
		const state: MoneyState | undefined = (el as any).__money

		state?.cleanup()
		delete (el as any).__money
	},
})

export default vMoney
