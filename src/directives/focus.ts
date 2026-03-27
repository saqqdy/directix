import { defineDirective, isBrowser } from '@directix/core'

/**
 * Focus directive options
 */
export interface FocusOptions {
	/**
	 * Whether to auto focus
	 * @default true
	 */
	focus?: boolean

	/**
	 * Whether to refocus when binding value changes
	 * @default false
	 */
	refocus?: boolean

	/**
	 * Callback when focused
	 */
	onFocus?: (el: HTMLElement) => void

	/**
	 * Callback when blurred
	 */
	onBlur?: (el: HTMLElement) => void
}

/**
 * Directive binding value type
 */
export type FocusBinding = boolean | FocusOptions

/**
 * Element state storage
 */
interface FocusState {
	options: FocusOptions
	handleFocus: () => void
	handleBlur: () => void
	lastValue: FocusBinding
}

const FOCUSABLE_TAGS = new Set(['input', 'textarea', 'select', 'button'])

/**
 * Compare two values for equality (supports primitive types and shallow object comparison)
 */
function isEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true
	if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
	const objA = a as Record<string, unknown>
	const objB = b as Record<string, unknown>
	const keysA = Object.keys(objA)
	const keysB = Object.keys(objB)

	if (keysA.length !== keysB.length) return false

	return keysA.every(key => objA[key] === objB[key])
}

/**
 * v-focus directive
 *
 * @example
 * ```vue
 * <template>
 *   <input v-focus />
 *   <input v-focus="{ focus: true, refocus: true }" />
 * </template>
 * ```
 */
export const vFocus = defineDirective<FocusBinding, HTMLElement>({
	name: 'focus',
	ssr: false,
	defaults: {
		focus: true,
		refocus: false,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (!options.focus || !isFocusable(el)) {
			if (options.focus) {
				console.warn('[Directix] v-focus: Element is not focusable')
			}

			return
		}

		const handleFocus = (): void => options.onFocus?.(el)
		const handleBlur = (): void => options.onBlur?.(el)

		el.addEventListener('focus', handleFocus)
		el.addEventListener('blur', handleBlur)

		;(el as any).__focus = {
			options,
			handleFocus,
			handleBlur,
			lastValue: binding.value,
		} as FocusState

		el.focus()
	},

	updated(el, binding) {
		const state: FocusState | undefined = (el as any).__focus

		if (!state) return

		const newOptions = normalizeOptions(binding.value)

		// Update event listeners only when callbacks change
		if (newOptions.onFocus !== state.options.onFocus) {
			el.removeEventListener('focus', state.handleFocus)
			state.handleFocus = () => newOptions.onFocus?.(el)
			el.addEventListener('focus', state.handleFocus)
		}

		if (newOptions.onBlur !== state.options.onBlur) {
			el.removeEventListener('blur', state.handleBlur)
			state.handleBlur = () => newOptions.onBlur?.(el)
			el.addEventListener('blur', state.handleBlur)
		}

		// Check if value actually changed
		const valueChanged = !isEqual(binding.value, state.lastValue)

		// Refocus when value changes and refocus is enabled
		if (newOptions.refocus && newOptions.focus && valueChanged) {
			el.focus()
		}

		state.options = newOptions
		state.lastValue = binding.value
	},

	unmounted(el) {
		const state: FocusState | undefined = (el as any).__focus

		if (!state) return

		el.removeEventListener('focus', state.handleFocus)
		el.removeEventListener('blur', state.handleBlur)
		delete (el as any).__focus
	},
})

/**
 * Normalize options
 */
function normalizeOptions(binding: FocusBinding | undefined): FocusOptions {
	if (typeof binding === 'boolean') {
		return { focus: binding, refocus: false }
	}

	return {
		focus: true,
		refocus: false,
		...binding,
	}
}

/**
 * Check if element is focusable
 */
function isFocusable(el: HTMLElement): boolean {
	if (!isBrowser()) return false

	const tagName = el.tagName.toLowerCase()

	// Form elements
	if (FOCUSABLE_TAGS.has(tagName)) {
		return !(el as HTMLInputElement).disabled
	}

	// Contenteditable elements
	if (el.isContentEditable) return true

	// Elements with tabindex
	const tabindex = el.getAttribute('tabindex')

	if (tabindex != null) return tabindex !== '-1'

	// Link elements
	if (tagName === 'a' || tagName === 'area') {
		return el.hasAttribute('href')
	}

	return false
}

export default vFocus
