import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

const STATE_KEY = '__mask' as const

/**
 * Mask directive options
 */
export interface MaskOptions {
	/** Mask pattern: # digit, A letter, N alphanumeric, X any, others as literals */
	mask: string
	/** Placeholder character @default '_' */
	placeholder?: string
	/** Show mask placeholder on focus @default true */
	showPlaceholder?: boolean
	/** Show mask on blur @default false */
	showMaskOnBlur?: boolean
	/** Clear incomplete on blur @default false */
	clearIncomplete?: boolean
	/** Disable @default false */
	disabled?: boolean
	/** Callback when value changes */
	onChange?: (value: string, rawValue: string) => void
	/** Callback when mask is complete */
	onComplete?: (value: string) => void
}

export type MaskBinding = string | MaskOptions

interface MaskToken {
	pattern: RegExp
	placeholder: string
	isLiteral: boolean
}

interface MaskState {
	options: MaskOptions
	tokens: MaskToken[]
	placeholder: string
	inputHandler: (e: Event) => void
	focusHandler: () => void
	blurHandler: () => void
}

const TOKEN_PATTERNS: Record<string, RegExp> = {
	'#': /\d/,
	A: /[A-Za-z]/,
	N: /[A-Za-z0-9]/,
	X: /./,
}

function parseMask(mask: string, placeholder: string): MaskToken[] {
	return [...mask].map(char => {
		const pattern = TOKEN_PATTERNS[char]

		return pattern ? { pattern, placeholder, isLiteral: false } : { pattern: new RegExp(`\\${char}`), placeholder: char, isLiteral: true }
	})
}

function normalizeOptions(binding: MaskBinding | undefined): MaskOptions {
	if (typeof binding === 'string') return { mask: binding, placeholder: '_', showPlaceholder: true }
	if (!binding?.mask) throw new Error('[Directix] v-mask: mask is required')

	return { placeholder: '_', showPlaceholder: true, showMaskOnBlur: false, clearIncomplete: false, disabled: false, ...binding }
}

function isInput(el: HTMLElement): el is HTMLInputElement | HTMLTextAreaElement {
	return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
}

/**
 * Format value with mask
 */
function formatValue(value: string, tokens: MaskToken[], placeholder: string, showPlaceholder: boolean): string {
	let result = '',
		valueIndex = 0

	for (const token of tokens) {
		if (valueIndex >= value.length) {
			result += token.isLiteral ? token.placeholder : (showPlaceholder ? placeholder : '')
			continue
		}

		const inputChar = value[valueIndex]

		if (token.isLiteral) {
			if (inputChar === token.placeholder) valueIndex++
			result += token.placeholder
		} else if (token.pattern.test(inputChar)) {
			result += inputChar
			valueIndex++
		} else if (inputChar === placeholder) {
			result += showPlaceholder ? placeholder : ''
			valueIndex++
		} else {
			valueIndex++
			// Re-check this token with next input char - need to decrement in loop
		}
	}

	return result
}

/**
 * Get raw value (without mask literals)
 */
function getRawValue(value: string, tokens: MaskToken[], placeholder: string): string {
	let raw = ''

	for (let i = 0; i < value.length && i < tokens.length; i++) {
		if (!tokens[i].isLiteral && value[i] !== placeholder) {
			raw += value[i]
		}
	}

	return raw
}

/**
 * Check if mask is complete
 */
function isComplete(value: string, tokens: MaskToken[], placeholder: string): boolean {
	for (let i = 0; i < tokens.length; i++) {
		if (!tokens[i].isLiteral && (i >= value.length || value[i] === placeholder)) {
			return false
		}
	}

	return true
}

/**
 * Calculate cursor position, skipping literals
 */
function getCursorPos(tokens: MaskToken[], rawCursorPos: number): number {
	let pos = rawCursorPos

	while (pos < tokens.length && tokens[pos].isLiteral) {
		pos++
	}

	return Math.min(pos, tokens.length)
}

/**
 * v-mask directive
 *
 * @example
 * ```vue
 * <input v-mask="'###-##-####'" placeholder="SSN" />
 * <input v-mask="'(###) ###-####'" placeholder="Phone" />
 * <input v-mask="{ mask: '##/##/####' }" placeholder="Date" />
 * ```
 */
export const vMask = defineDirective<MaskBinding, HTMLInputElement>({
	name: 'mask',
	ssr: false,
	defaults: { placeholder: '_', showPlaceholder: true, showMaskOnBlur: false, clearIncomplete: false, disabled: false },

	mounted(el, binding) {
		if (!isInput(el)) {
			console.warn('[Directix] v-mask: directive must be used on input or textarea elements')

			return
		}

		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		const placeholder = options.placeholder || '_'
		const tokens = parseMask(options.mask, placeholder)

		const inputHandler = (e: Event): void => {
			const target = e.target as HTMLInputElement
			const rawValue = target.value
			const cursorPos = target.selectionStart || 0

			const formatted = formatValue(rawValue, tokens, placeholder, options.showPlaceholder ?? true)

			if (formatted !== rawValue) {
				target.value = formatted
				target.setSelectionRange(getCursorPos(tokens, cursorPos), getCursorPos(tokens, cursorPos))
				target.dispatchEvent(new Event('input', { bubbles: true }))

				return
			}

			options.onChange?.(formatted, getRawValue(formatted, tokens, placeholder))
			if (isComplete(formatted, tokens, placeholder)) {
				options.onComplete?.(formatted)
			}
		}

		const focusHandler = (): void => {
			if (!el.value && options.showPlaceholder) {
				el.value = formatValue('', tokens, placeholder, true)
			}
		}

		const blurHandler = (): void => {
			if (!options.showMaskOnBlur && !isComplete(el.value, tokens, placeholder) && options.clearIncomplete) {
				el.value = ''
			}
		}

		on(el, 'input', inputHandler)
		on(el, 'focus', focusHandler)
		on(el, 'blur', blurHandler)

		;(el as any)[STATE_KEY] = { options, tokens, placeholder, inputHandler, focusHandler, blurHandler }

		if (el.value) {
			el.value = formatValue(el.value, tokens, placeholder, options.showPlaceholder ?? true)
		}
	},

	updated(el, binding) {
		const state: MaskState = (el as any)[STATE_KEY]

		if (!state) return
		state.options = normalizeOptions(binding.value)
		state.tokens = parseMask(state.options.mask, state.placeholder)
	},

	unmounted(el) {
		const state: MaskState = (el as any)[STATE_KEY]

		if (!state) return
		off(el, 'input', state.inputHandler)
		off(el, 'focus', state.focusHandler)
		off(el, 'blur', state.blurHandler)
		delete (el as any)[STATE_KEY]
	},
})

export default vMask
