import { isBrowser } from '@directix/core'
import { onUnmounted, readonly, ref, type Ref } from 'vue'

/**
 * Options for useFocus composable
 */
export interface UseFocusOptions {
	/**
	 * Callback when element is focused
	 */
	onFocus?: (event: FocusEvent) => void

	/**
	 * Callback when element loses focus
	 */
	onBlur?: (event: FocusEvent) => void
}

/**
 * Return type for useFocus composable
 */
export interface UseFocusReturn {
	/** Whether the element is currently focused */
	isFocused: Readonly<Ref<boolean>>

	/** Focus the element */
	focus: () => void

	/** Blur the element */
	blur: () => void

	/** Bind focus tracking to an element */
	bind: (element: HTMLElement) => () => void
}

const FOCUSABLE_TAGS = new Set(['input', 'textarea', 'select', 'button'])

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

/**
 * Composable for managing element focus
 *
 * @param options - Configuration options
 * @returns Focus utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useFocus } from 'directix'
 *
 * const input = ref(null)
 * const { isFocused, focus, bind } = useFocus({
 *   onBlur: () => validate()
 * })
 *
 * onMounted(() => bind(input.value))
 *
 * // Programmatically focus
 * function handleButtonClick() {
 *   focus()
 * }
 * </script>
 *
 * <template>
 *   <input ref="input" />
 *   <button @click="focus">Focus Input</button>
 * </template>
 * ```
 */
export function useFocus(options: UseFocusOptions = {}): UseFocusReturn {
	const { onFocus, onBlur } = options

	const isFocused = ref(false)

	let currentElement: HTMLElement | null = null,
		focusHandler: ((e: FocusEvent) => void) | null = null,
		blurHandler: ((e: FocusEvent) => void) | null = null

	function focus(): void {
		if (currentElement && isFocusable(currentElement)) {
			currentElement.focus()
		}
	}

	function blur(): void {
		if (currentElement) {
			currentElement.blur()
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		unbind()

		currentElement = element

		focusHandler = (e: FocusEvent) => {
			isFocused.value = true
			onFocus?.(e)
		}

		blurHandler = (e: FocusEvent) => {
			isFocused.value = false
			onBlur?.(e)
		}

		element.addEventListener('focus', focusHandler)
		element.addEventListener('blur', blurHandler)

		// Check initial state
		isFocused.value = document.activeElement === element

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			if (focusHandler) {
				currentElement.removeEventListener('focus', focusHandler)
			}
			if (blurHandler) {
				currentElement.removeEventListener('blur', blurHandler)
			}
		}
		currentElement = null
		focusHandler = null
		blurHandler = null
		isFocused.value = false
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		isFocused: readonly(isFocused),
		focus,
		blur,
		bind,
	}
}
