import { defineDirective } from '@directix/core'
import { clampValue, formatNumber, type NumberFormatOptions, parseToNumber, setupNumberInput } from '../utils/number'

/**
 * Number directive options
 */
export interface NumberOptions extends NumberFormatOptions {
	/** Prefix string (e.g., '$') */
	prefix?: string
	/** Suffix string (e.g., '%') */
	suffix?: string
}

export type NumberBinding = number | NumberOptions

interface NumberState {
	options: NumberOptions
	cleanup: () => void
}

export const vNumber = defineDirective<NumberBinding, HTMLElement>({
	name: 'number',
	ssr: true,

	mounted(el, binding) {
		const options: NumberOptions = typeof binding.value === 'number' ? { precision: binding.value } : (binding.value ?? {})

		if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
			const cleanup = setupNumberInput(el as HTMLInputElement, options, formatNumber)

			;(el as any).__number = { options, cleanup }

			// Format initial value after DOM is ready
			requestAnimationFrame(() => {
				const inputEl = el as HTMLInputElement

				if (inputEl.value) {
					const num = parseToNumber(inputEl.value, options.decimal || '.')

					if (num !== null) {
						const formatted = formatNumber(clampValue(num, options), options)

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

			if (typeof binding.value === 'number') {
				value = binding.value
			} else if (binding.value && typeof binding.value === 'object' && 'value' in binding.value) {
				value = (binding.value as any).value
			} else {
				// Try to parse from element's text content
				const textContent = el.textContent?.trim()

				if (textContent) {
					value = parseToNumber(textContent, options.decimal || '.')
				}
			}

			if (value !== null) {
				el.textContent = formatNumber(clampValue(value, options), options)
			}
		}
	},

	updated(el, binding) {
		const options: NumberOptions = typeof binding.value === 'number' ? { precision: binding.value } : (binding.value ?? {})

		const state: NumberState | undefined = (el as any).__number

		if (state) {
			state.options = options
		} else if (!(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
			// Only format non-input elements on update
			let value: number | null = null

			if (typeof binding.value === 'number') {
				value = binding.value
			} else if (binding.value && typeof binding.value === 'object' && 'value' in binding.value) {
				value = (binding.value as any).value
			}

			if (value !== null) {
				el.textContent = formatNumber(clampValue(value, options), options)
			}
		}
	},

	unmounted(el) {
		const state: NumberState | undefined = (el as any).__number

		state?.cleanup()
		delete (el as any).__number
	},
})

export default vNumber
