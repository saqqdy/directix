import { isBrowser } from '@directix/core'
import { getScrollParent } from '@directix/shared'
import { onUnmounted, readonly, ref, type Ref, unref } from 'vue'

/**
 * Options for useSticky composable
 */
export interface UseStickyOptions {
	/**
	 * Offset from top in pixels
	 * @default 0
	 */
	offsetTop?: number | Ref<number>

	/**
	 * Callback when stick state changes
	 */
	onStick?: (isSticky: boolean) => void

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>
}

/**
 * Return type for useSticky composable
 */
export interface UseStickyReturn {
	/** Whether the element is sticky */
	isSticky: Readonly<Ref<boolean>>

	/** Bind sticky behavior to an element */
	bind: (element: HTMLElement) => () => void

	/** Stop observing */
	stop: () => void
}

/**
 * Composable for sticky positioning
 *
 * @param options - Configuration options
 * @returns Sticky utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useSticky } from 'directix'
 *
 * const headerRef = ref(null)
 * const { isSticky, bind } = useSticky({
 *   offsetTop: 60,
 *   onStick: (sticky) => console.log('Sticky:', sticky)
 * })
 *
 * onMounted(() => bind(headerRef.value))
 * </script>
 *
 * <template>
 *   <header ref="headerRef" :class="{ sticky: isSticky }">
 *     Navigation
 *   </header>
 * </template>
 * ```
 */
export function useSticky(options: UseStickyOptions = {}): UseStickyReturn {
	const {
		offsetTop = 0,
		onStick,
		disabled = false,
	} = options

	const isSticky = ref(false)

	let currentElement: HTMLElement | null = null,
		scrollContainer: Element | Window | null = null,
		scrollHandler: (() => void) | null = null,
		placeholder: HTMLDivElement | null = null,
		originalStyles: {
			position: string
			top: string
			width: string
		} | null = null

	function checkSticky(): void {
		if (!currentElement || unref(disabled)) return

		const container = scrollContainer === window ? document.documentElement : (scrollContainer as Element)
		const containerRect = container.getBoundingClientRect()
		const elementRect = currentElement.getBoundingClientRect()
		const currentOffsetTop = unref(offsetTop)

		const shouldBeSticky = elementRect.top <= currentOffsetTop && containerRect.top <= currentOffsetTop

		if (shouldBeSticky !== isSticky.value) {
			isSticky.value = shouldBeSticky

			if (shouldBeSticky) {
				// Create placeholder to maintain layout
				if (!placeholder) {
					placeholder = document.createElement('div')
					placeholder.style.width = `${elementRect.width}px`
					placeholder.style.height = `${elementRect.height}px`
					currentElement.parentNode?.insertBefore(placeholder, currentElement)
				}

				// Apply sticky styles
				currentElement.style.position = 'fixed'
				currentElement.style.top = `${currentOffsetTop}px`
				currentElement.style.width = `${elementRect.width}px`
				currentElement.classList.add('v-sticky--active')
			} else {
				// Remove placeholder
				if (placeholder) {
					placeholder.remove()
					placeholder = null
				}

				// Restore original styles
				if (originalStyles) {
					currentElement.style.position = originalStyles.position
					currentElement.style.top = originalStyles.top
					currentElement.style.width = originalStyles.width
				}
				currentElement.classList.remove('v-sticky--active')
			}

			onStick?.(shouldBeSticky)
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		stop()

		currentElement = element

		// Store original styles
		originalStyles = {
			position: element.style.position,
			top: element.style.top,
			width: element.style.width,
		}

		// Add base class
		element.classList.add('v-sticky')

		// Get scroll container
		scrollContainer = getScrollParent(element)

		// Bind scroll event
		scrollHandler = checkSticky
		scrollContainer.addEventListener('scroll', scrollHandler, { passive: true })

		// Initial check
		checkSticky()

		return stop
	}

	function stop(): void {
		if (scrollContainer && scrollHandler) {
			scrollContainer.removeEventListener('scroll', scrollHandler)
		}

		if (currentElement) {
			if (originalStyles) {
				currentElement.style.position = originalStyles.position
				currentElement.style.top = originalStyles.top
				currentElement.style.width = originalStyles.width
			}
			currentElement.classList.remove('v-sticky', 'v-sticky--active')
		}

		if (placeholder) {
			placeholder.remove()
			placeholder = null
		}

		scrollContainer = null
		scrollHandler = null
		currentElement = null
		isSticky.value = false
	}

	// Cleanup on unmount
	onUnmounted(() => {
		stop()
	})

	return {
		isSticky: readonly(isSticky),
		bind,
		stop,
	}
}
