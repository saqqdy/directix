import { defineDirective } from '@directix/core'

/**
 * Trim position
 */
export type TrimPosition = 'start' | 'end' | 'both'

/**
 * Trim directive options
 */
export interface TrimOptions {
	/**
	 * Trim position
	 * @default 'both'
	 */
	position?: TrimPosition

	/**
	 * Whether to trim on input (for input elements)
	 * @default true
	 */
	onInput?: boolean

	/**
	 * Whether to trim on blur
	 * @default true
	 */
	onBlur?: boolean

	/**
	 * Custom characters to trim (in addition to whitespace)
	 */
	chars?: string
}

/**
 * Directive binding value type
 */
export type TrimBinding = boolean | TrimPosition | TrimOptions

/**
 * Element state storage
 */
interface TrimState {
	options: TrimOptions
	inputHandler?: () => void
	blurHandler?: () => void
}

/**
 * Trim text based on options
 */
function trimText(text: string, options: TrimOptions): string {
	const { position = 'both', chars } = options

	// Build regex pattern for custom chars
	const charPattern = chars ? `[\\s${escapeRegex(chars)}]` : '\\s'

	switch (position) {
		case 'start':
			return text.replace(new RegExp(`^${charPattern}+`, 'g'), '')

		case 'end':
			return text.replace(new RegExp(`${charPattern}+$`, 'g'), '')

		case 'both':
		default:
			return text.replace(new RegExp(`^${charPattern}+|${charPattern}+$`, 'g'), '')
	}
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * v-trim directive
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Simple usage: trim both sides -->
 *   <input v-trim v-model="text" />
 *
 *   <!-- Trim only start -->
 *   <input v-trim="'start'" v-model="text" />
 *
 *   <!-- Trim only end -->
 *   <input v-trim="'end'" v-model="text" />
 *
 *   <!-- With options -->
 *   <input v-trim="{ position: 'both', onBlur: true }" v-model="text" />
 *
 *   <!-- For display only -->
 *   <span v-trim>  Text with spaces  </span>
 * </template>
 * ```
 */
export const vTrim = defineDirective<TrimBinding, HTMLElement>({
	name: 'trim',
	ssr: true,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
			setupInputElement(el as HTMLInputElement | HTMLTextAreaElement, options)
		} else {
			// For non-input elements, trim text content
			const text = el.textContent || ''

			el.textContent = trimText(text, options)
		}
	},

	updated(el, binding) {
		const options = normalizeOptions(binding.value)
		const state: TrimState | undefined = (el as any).__trim

		if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
			// For input elements, trimming happens on blur/input events
			if (state) {
				state.options = options
			}
		} else {
			// For non-input elements, trim text content
			const text = el.textContent || ''

			el.textContent = trimText(text, options)
		}
	},

	unmounted(el) {
		const state: TrimState | undefined = (el as any).__trim

		if (state?.inputHandler) {
			el.removeEventListener('input', state.inputHandler)
		}
		if (state?.blurHandler) {
			el.removeEventListener('blur', state.blurHandler)
		}

		delete (el as any).__trim
	},
})

/**
 * Setup input element
 */
function setupInputElement(el: HTMLInputElement | HTMLTextAreaElement, options: TrimOptions): void {
	const state: TrimState = { options }

	;(el as any).__trim = state

	const performTrim = (): void => {
		const originalValue = el.value
		const trimmed = trimText(originalValue, options)

		if (originalValue !== trimmed) {
			el.value = trimmed
			el.dispatchEvent(new Event('input', { bubbles: true }))
		}
	}

	// Create handlers based on options
	if (options.onInput) {
		const inputHandler = (): void => {
			// For real-time trimming, we need to be careful about cursor position
			// We'll only trim on blur for better UX, or trim end on input
			const originalValue = el.value
			const cursorPos = el.selectionStart

			// Trim end while typing
			const trimmed = originalValue.replace(/\s+$/g, '')

			if (originalValue !== trimmed) {
				el.value = trimmed
				// Adjust cursor position
				if (cursorPos !== null) {
					const newCursorPos = Math.min(cursorPos, trimmed.length)

					el.setSelectionRange(newCursorPos, newCursorPos)
				}
			}
		}

		el.addEventListener('input', inputHandler)
		state.inputHandler = inputHandler
	}

	if (options.onBlur) {
		const blurHandler = (): void => performTrim()

		el.addEventListener('blur', blurHandler)
		state.blurHandler = blurHandler
	}

	// Initial trim
	if (el.value) {
		performTrim()
	}
}

/**
 * Normalize options
 */
function normalizeOptions(binding: TrimBinding | undefined): TrimOptions {
	if (binding === undefined || binding === true) {
		return { position: 'both', onInput: true, onBlur: true }
	}

	if (binding === false) {
		return { position: 'both', onInput: false, onBlur: false }
	}

	if (typeof binding === 'string') {
		return { position: binding, onInput: true, onBlur: true }
	}

	return {
		position: binding.position ?? 'both',
		onInput: binding.onInput ?? true,
		onBlur: binding.onBlur ?? true,
		chars: binding.chars,
	}
}

export default vTrim
