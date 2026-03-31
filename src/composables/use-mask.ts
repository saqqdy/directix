import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, unref } from 'vue'

/**
 * Options for useMask composable
 */
export interface UseMaskOptions {
	/**
	 * Mask pattern: # digit, A letter, N alphanumeric, X any, others as literals
	 */
	mask: string | Ref<string>

	/**
	 * Placeholder character
	 * @default '_'
	 */
	placeholder?: string

	/**
	 * Show mask placeholder on focus
	 * @default true
	 */
	showPlaceholder?: boolean

	/**
	 * Show mask on blur
	 * @default false
	 */
	showMaskOnBlur?: boolean

	/**
	 * Clear incomplete on blur
	 * @default false
	 */
	clearIncomplete?: boolean

	/**
	 * Disable
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>

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
 * Return type for useMask composable
 */
export interface UseMaskReturn {
	/** Get formatted value */
	getFormattedValue: (value: string) => string

	/** Get raw value (without mask literals) */
	getRawValue: (value: string) => string

	/** Check if mask is complete */
	isComplete: (value: string) => boolean

	/** Bind mask to an input element */
	bind: (element: HTMLInputElement | HTMLTextAreaElement) => () => void
}

interface MaskToken {
	pattern: RegExp
	placeholder: string
	isLiteral: boolean
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

/**
 * Composable for input masking
 *
 * @param options - Configuration options
 * @returns Mask utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useMask } from 'directix'
 *
 * const inputRef = ref(null)
 * const { bind, getRawValue } = useMask({
 *   mask: '###-##-####',
 *   placeholder: '_'
 * })
 *
 * onMounted(() => bind(inputRef.value))
 * </script>
 *
 * <template>
 *   <input ref="inputRef" type="text" />
 * </template>
 * ```
 */
export function useMask(options: UseMaskOptions): UseMaskReturn {
	const {
		mask,
		placeholder = '_',
		showPlaceholder = true,
		showMaskOnBlur = false,
		clearIncomplete = false,
		disabled: _disabled = false,
		onChange,
		onComplete,
	} = options

	let currentElement: HTMLInputElement | HTMLTextAreaElement | null = null,
		inputHandler: ((e: Event) => void) | null = null,
		focusHandler: (() => void) | null = null,
		blurHandler: (() => void) | null = null

	function getTokens(): MaskToken[] {
		return parseMask(unref(mask), placeholder)
	}

	function formatValue(value: string, tokens: MaskToken[], show: boolean): string {
		let result = '',
			valueIndex = 0

		for (const token of tokens) {
			if (valueIndex >= value.length) {
				result += token.isLiteral ? token.placeholder : (show ? placeholder : '')
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
				result += show ? placeholder : ''
				valueIndex++
			} else {
				valueIndex++
			}
		}

		return result
	}

	function getRawValue(value: string, tokens: MaskToken[]): string {
		let raw = ''
		for (let i = 0; i < value.length && i < tokens.length; i++) {
			if (!tokens[i].isLiteral && value[i] !== placeholder) {
				raw += value[i]
			}
		}
		return raw
	}

	function checkComplete(value: string, tokens: MaskToken[]): boolean {
		for (let i = 0; i < tokens.length; i++) {
			if (!tokens[i].isLiteral && (i >= value.length || value[i] === placeholder)) {
				return false
			}
		}
		return true
	}

	function getCursorPos(tokens: MaskToken[], rawCursorPos: number): number {
		let pos = rawCursorPos
		while (pos < tokens.length && tokens[pos].isLiteral) {
			pos++
		}
		return Math.min(pos, tokens.length)
	}

	function handleInput(e: Event): void {
		const target = e.target as HTMLInputElement
		const tokens = getTokens()
		const rawValue = target.value
		const cursorPos = target.selectionStart || 0

		const formatted = formatValue(rawValue, tokens, showPlaceholder)

		if (formatted !== rawValue) {
			target.value = formatted
			target.setSelectionRange(getCursorPos(tokens, cursorPos), getCursorPos(tokens, cursorPos))
			target.dispatchEvent(new Event('input', { bubbles: true }))
			return
		}

		onChange?.(formatted, getRawValue(formatted, tokens))
		if (checkComplete(formatted, tokens)) {
			onComplete?.(formatted)
		}
	}

	function handleFocus(): void {
		if (!currentElement) return
		const tokens = getTokens()
		if (!currentElement.value && showPlaceholder) {
			currentElement.value = formatValue('', tokens, true)
		}
	}

	function handleBlur(): void {
		if (!currentElement) return
		const tokens = getTokens()
		if (!showMaskOnBlur && !checkComplete(currentElement.value, tokens) && clearIncomplete) {
			currentElement.value = ''
		}
	}

	function bind(element: HTMLInputElement | HTMLTextAreaElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		unbind()

		currentElement = element

		inputHandler = handleInput
		focusHandler = handleFocus
		blurHandler = handleBlur

		element.addEventListener('input', inputHandler)
		element.addEventListener('focus', focusHandler)
		element.addEventListener('blur', blurHandler)

		// Format initial value
		if (element.value) {
			const tokens = getTokens()
			element.value = formatValue(element.value, tokens, showPlaceholder)
		}

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			if (inputHandler) currentElement.removeEventListener('input', inputHandler)
			if (focusHandler) currentElement.removeEventListener('focus', focusHandler)
			if (blurHandler) currentElement.removeEventListener('blur', blurHandler)
		}
		currentElement = null
		inputHandler = null
		focusHandler = null
		blurHandler = null
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		getFormattedValue: (value: string) => formatValue(value, getTokens(), showPlaceholder),
		getRawValue: (value: string) => getRawValue(value, getTokens()),
		isComplete: (value: string) => checkComplete(value, getTokens()),
		bind,
	}
}
