import { isBrowser } from '@directix/core'
import { onUnmounted, ref, type Ref, unref, watch } from 'vue'

/**
 * Options for useVisible composable
 */
export interface UseVisibleOptions {
	/**
	 * Initial visibility
	 * @default true
	 */
	initial?: boolean | Ref<boolean>

	/**
	 * Whether to use visibility: hidden instead of display: none
	 * @default false
	 */
	useHidden?: boolean

	/**
	 * Callback when visibility changes
	 */
	onChange?: (isVisible: boolean) => void
}

/**
 * Return type for useVisible composable
 */
export interface UseVisibleReturn {
	/** Current visibility state */
	visible: Ref<boolean>

	/** Show the element */
	show: () => void

	/** Hide the element */
	hide: () => void

	/** Toggle visibility */
	toggle: () => void

	/** Bind visibility control to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Composable for controlling element visibility
 *
 * @param options - Configuration options
 * @returns Visibility utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useVisible } from 'directix'
 *
 * const modal = ref(null)
 * const { visible, show, hide, toggle, bind } = useVisible({
 *   initial: false,
 *   onChange: (v) => console.log('Visible:', v)
 * })
 *
 * onMounted(() => bind(modal.value))
 * </script>
 *
 * <template>
 *   <button @click="toggle">Toggle Modal</button>
 *   <div ref="modal" v-show="visible">Modal Content</div>
 * </template>
 * ```
 */
export function useVisible(options: UseVisibleOptions = {}): UseVisibleReturn {
	const {
		initial = true,
		useHidden = false,
		onChange,
	} = options

	const visible = ref(unref(initial))

	let currentElement: HTMLElement | null = null,
		originalDisplay = '',
		originalVisibility = ''

	function show(): void {
		visible.value = true
	}

	function hide(): void {
		visible.value = false
	}

	function toggle(): void {
		visible.value = !visible.value
	}

	function applyVisibility(isVisible: boolean): void {
		if (!currentElement) return

		if (isVisible) {
			currentElement.classList.remove('v-hidden')
			currentElement.classList.add('v-visible')

			if (useHidden) {
				currentElement.style.visibility = originalVisibility || 'visible'
			} else {
				currentElement.style.display = originalDisplay
			}
		} else {
			currentElement.classList.remove('v-visible')
			currentElement.classList.add('v-hidden')

			if (useHidden) {
				currentElement.style.visibility = 'hidden'
			} else {
				currentElement.style.display = 'none'
			}
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		unbind()

		currentElement = element

		// Store original styles
		originalDisplay = element.style.display
		originalVisibility = element.style.visibility

		// Apply initial visibility
		applyVisibility(visible.value)

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			// Restore original styles
			currentElement.style.display = originalDisplay
			currentElement.style.visibility = originalVisibility
			currentElement.classList.remove('v-hidden', 'v-visible')
		}
		currentElement = null
	}

	// Watch for visibility changes
	watch(visible, (newValue, oldValue) => {
		if (newValue !== oldValue) {
			applyVisibility(newValue)
			onChange?.(newValue)
		}
	})

	// Watch for initial ref changes
	if (typeof initial === 'object' && 'value' in initial) {
		watch(initial, newValue => {
			visible.value = newValue
		})
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		visible,
		show,
		hide,
		toggle,
		bind,
	}
}
