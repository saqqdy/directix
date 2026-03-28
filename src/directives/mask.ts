import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

/**
 * Mask token types
 */
interface MaskToken {
	/** Character pattern */
	pattern: RegExp
	/** Placeholder character */
	placeholder: string
	/** Whether the character is optional */
	optional?: boolean
}

/**
 * Mask directive options
 */
export interface MaskOptions {
	/**
	 * Mask pattern
	 * - Use '#' for digit
	 * - Use 'A' for letter
	 * - Use 'N' for alphanumeric
	 * - Use 'X' for any character
	 * - Use other characters as literals
	 */
	mask: string

	/**
	 * Placeholder character for unfilled positions
	 * @default '_'
	 */
	placeholder?: string

	/**
	 * Whether to show mask placeholder on focus
	 * @default true
	 */
	showPlaceholder?: boolean

	/**
	 * Whether to show mask on blur (even if empty)
	 * @default false
	 */
	showMaskOnBlur?: boolean

	/**
	 * Whether to clear mask on blur if incomplete
	 * @default false
	 */
	clearIncomplete?: boolean

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Callback when value changes
	 */
	onChange?: (value: string, rawValue: string) => void

	/**
	 * Callback when mask is complete
	 */
	onComplete?: (value: string) => void
}

/**
 * Directive binding value type
 */
export type MaskBinding = string | MaskOptions

/**
 * Element state storage
 */
interface MaskState {
	options: MaskOptions
	inputHandler: (e: Event) => void
	focusHandler: (e: Event) => void
	blurHandler: (e: Event) => void
	tokens: MaskToken[]
	lastValue: string
}

/**
 * Token patterns
 */
const TOKEN_PATTERNS: Record<string, RegExp> = {
	'#': /\d/,
	A: /[A-Za-z]/,
	N: /[A-Za-z0-9]/,
	X: /./,
}

/**
 * Parse mask string into tokens
 */
function parseMask(mask: string, placeholder: string): MaskToken[] {
	const tokens: MaskToken[] = []

	for (const char of mask) {
		if (TOKEN_PATTERNS[char]) {
			tokens.push({
				pattern: TOKEN_PATTERNS[char],
				placeholder,
			})
		} else {
			// Literal character
			tokens.push({
				pattern: new RegExp(`\\${char}`),
				placeholder: char,
			})
		}
	}

	return tokens
}

/**
 * Normalize options
 */
function normalizeOptions(binding: MaskBinding | undefined): MaskOptions {
	if (typeof binding === 'string') {
		return { mask: binding, placeholder: '_', showPlaceholder: true }
	}

	if (!binding || !binding.mask) {
		throw new Error('[Directix] v-mask: mask is required')
	}

	return {
		placeholder: '_',
		showPlaceholder: true,
		showMaskOnBlur: false,
		clearIncomplete: false,
		disabled: false,
		...binding,
	}
}

/**
 * Check if element is input or textarea
 */
function isInput(el: HTMLElement): el is HTMLInputElement | HTMLTextAreaElement {
	return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
}

/**
 * Get raw value (without mask literals)
 */
function getRawValue(value: string, tokens: MaskToken[], placeholder: string): string {
	let raw = ''

	for (let i = 0; i < value.length && i < tokens.length; i++) {
		if (tokens[i].placeholder === placeholder) {
			if (value[i] !== placeholder) {
				raw += value[i]
			}
		}
	}

	return raw
}

/**
 * Format value with mask
 */
function formatValue(
	value: string,
	tokens: MaskToken[],
	placeholder: string,
	showPlaceholder: boolean,
): string {
	let result = '',
		valueIndex = 0

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i]

		if (valueIndex < value.length && token.pattern.test(value[valueIndex])) {
			result += value[valueIndex]
			valueIndex++
		} else if (token.placeholder === placeholder) {
			result += showPlaceholder ? placeholder : ''
		} else {
			// Literal character
			result += token.placeholder
		}
	}

	return result
}

/**
 * Check if mask is complete
 */
function isComplete(value: string, tokens: MaskToken[], placeholder: string): boolean {
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i].placeholder === placeholder) {
			if (i >= value.length || value[i] === placeholder) {
				return false
			}
		}
	}

	return true
}

/**
 * v-mask directive
 *
 * @example
 * ```vue
 * <template>
 *   <input v-mask="'###-##-####'" placeholder="SSN" />
 *   <input v-mask="'(###) ###-####'" placeholder="Phone" />
 *   <input v-mask="{ mask: '##/##/####', placeholder: 'dd/mm/yyyy' }" />
 * </template>
 * ```
 */
export const vMask = defineDirective<MaskBinding, HTMLInputElement>({
	name: 'mask',
	ssr: false,
	defaults: {
		placeholder: '_',
		showPlaceholder: true,
		showMaskOnBlur: false,
		clearIncomplete: false,
		disabled: false,
	},

	mounted(el, binding) {
		if (!isInput(el)) {
			console.warn('[Directix] v-mask: directive must be used on input or textarea elements')

			return
		}

		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		const tokens = parseMask(options.mask, options.placeholder || '_')

		const state: MaskState = {
			options,
			tokens,
			lastValue: el.value,
			inputHandler: (e: Event) => {
				const target = e.target as HTMLInputElement
				const rawValue = target.value

				// Format value
				const formatted = formatValue(
					rawValue,
					state.tokens,
					state.options.placeholder || '_',
					state.options.showPlaceholder ?? true,
				)

				// Update input value
				target.value = formatted

				// Get raw value
				const raw = getRawValue(formatted, state.tokens, state.options.placeholder || '_')

				// Trigger callback
				state.options.onChange?.(formatted, raw)

				// Check if complete
				if (isComplete(formatted, state.tokens, state.options.placeholder || '_')) {
					state.options.onComplete?.(formatted)
				}

				state.lastValue = formatted
			},
			focusHandler: () => {
				if (!el.value && state.options.showPlaceholder) {
					el.value = formatValue('', state.tokens, state.options.placeholder || '_', true)
				}
			},
			blurHandler: () => {
				if (!state.options.showMaskOnBlur && !isComplete(el.value, state.tokens, state.options.placeholder || '_')) {
					if (state.options.clearIncomplete) {
						el.value = ''
					}
				}
			},
		}

		// Store state
		;(el as any).__mask = state

		// Bind events
		on(el, 'input', state.inputHandler)
		on(el, 'focus', state.focusHandler)
		on(el, 'blur', state.blurHandler)

		// Format initial value
		if (el.value) {
			const formatted = formatValue(
				el.value,
				tokens,
				options.placeholder || '_',
				options.showPlaceholder ?? true,
			)

			el.value = formatted
		}
	},

	updated(el, binding) {
		const state: MaskState = (el as any).__mask

		if (!state) return

		state.options = normalizeOptions(binding.value)
		state.tokens = parseMask(state.options.mask, state.options.placeholder || '_')
	},

	unmounted(el) {
		const state: MaskState = (el as any).__mask

		if (!state) return

		// Unbind events
		off(el, 'input', state.inputHandler)
		off(el, 'focus', state.focusHandler)
		off(el, 'blur', state.blurHandler)

		delete (el as any).__mask
	},
})

export default vMask
