import { isBrowser } from '@directix/core'
import { getElement } from '@directix/shared'
import { onUnmounted, type Ref, unref } from 'vue'

/**
 * Click outside handler
 */
export type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void

/**
 * Options for useClickOutside composable
 */
export interface UseClickOutsideOptions {
	/**
	 * Callback when clicking outside
	 */
	handler: ClickOutsideHandler

	/**
	 * Excluded element selectors or element references
	 */
	exclude?: (string | HTMLElement | (() => HTMLElement | null) | Ref<HTMLElement | null>)[]

	/**
	 * Whether to use capture mode
	 * @default true
	 */
	capture?: boolean

	/**
	 * Event types to listen for
	 * @default ['click']
	 */
	events?: ('click' | 'mousedown' | 'mouseup' | 'touchstart' | 'touchend')[]

	/**
	 * Stop propagation
	 * @default false
	 */
	stop?: boolean

	/**
	 * Prevent default behavior
	 * @default false
	 */
	prevent?: boolean
}

/**
 * Return type for useClickOutside composable
 */
export interface UseClickOutsideReturn {
	/**
	 * Bind click outside detection to an element
	 */
	bind: (element: HTMLElement) => () => void
}

/**
 * Check if click is valid (outside the element)
 */
function isValidClick(
	el: HTMLElement,
	event: Event,
	exclude: UseClickOutsideOptions['exclude'],
): boolean {
	const target = event.target as Node

	// Check if clicked on element itself or its children
	if (el.contains(target)) {
		return false
	}

	// Check excluded elements
	if (exclude?.length) {
		for (const item of exclude) {
			const excludeEl = typeof item === 'function' ? item() : unref(item)
			const resolved = typeof excludeEl === 'string' ? getElement(excludeEl) : excludeEl

			if (resolved && (resolved === target || resolved.contains(target))) {
				return false
			}
		}
	}

	return true
}

/**
 * Composable for detecting clicks outside an element
 *
 * @param options - Configuration options
 * @returns Click outside utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useClickOutside } from 'directix'
 *
 * const dropdown = ref(null)
 * const show = ref(false)
 *
 * const { bind } = useClickOutside({
 *   handler: () => show.value = false,
 *   exclude: [() => triggerRef.value]
 * })
 *
 * onMounted(() => bind(dropdown.value))
 * </script>
 * ```
 */
export function useClickOutside(options: UseClickOutsideOptions): UseClickOutsideReturn {
	const {
		handler,
		exclude = [],
		capture = true,
		events = ['click'],
		stop = false,
		prevent = false,
	} = options

	let currentElement: HTMLElement | null = null
	const handlers = new Map<string, (event: Event) => void>()

	function createEventHandler(_eventType: string): (event: Event) => void {
		return (event: Event) => {
			if (!currentElement) return

			// Check event target
			if (!isValidClick(currentElement, event, exclude)) {
				return
			}

			// Stop propagation
			if (stop) {
				event.stopPropagation()
			}

			// Prevent default behavior
			if (prevent) {
				event.preventDefault()
			}

			// Call handler
			handler(event as MouseEvent | TouchEvent)
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous binding
		unbind()

		currentElement = element

		// Bind events
		events.forEach(eventType => {
			const eventHandler = createEventHandler(eventType)
			handlers.set(eventType, eventHandler)

			document.addEventListener(eventType, eventHandler, {
				capture,
				passive: !prevent,
			})
		})

		// Return unbind function
		return unbind
	}

	function unbind(): void {
		handlers.forEach((eventHandler, eventType) => {
			document.removeEventListener(eventType, eventHandler, { capture })
		})
		handlers.clear()
		currentElement = null
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		bind,
	}
}
