import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, ref, unref } from 'vue'

/**
 * Options for useParallax composable
 */
export interface UseParallaxOptions {
	/** Parallax speed factor */
	speed?: number | Ref<number>

	/** Whether enabled */
	enabled?: boolean | Ref<boolean>

	/** Reverse direction */
	reverse?: boolean

	/** Horizontal parallax */
	horizontal?: boolean

	/** Custom transform function */
	transform?: (offset: number, el: HTMLElement) => string

	/** Mobile breakpoint */
	mobileBreakpoint?: number
}

/**
 * Return type for useParallax composable
 */
export interface UseParallaxReturn {
	/** Current offset */
	offset: Ref<number>

	/** Whether parallax is active */
	isActive: Ref<boolean>

	/** Bind parallax to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Check if mobile
 */
function isMobile(breakpoint?: number): boolean {
	if (!breakpoint) return false
	return window.innerWidth < breakpoint
}

/**
 * Get scroll parent
 */
function getScrollParent(el: HTMLElement): Element | Window {
	let parent: Element | null = el.parentElement

	while (parent) {
		const { overflow, overflowX, overflowY } = getComputedStyle(parent)
		if (/(auto|scroll)/.test(overflow + overflowX + overflowY)) {
			return parent
		}
		parent = parent.parentElement
	}

	return window
}

/**
 * Composable for parallax scrolling
 *
 * @param options - Configuration options
 * @returns Parallax utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useParallax } from 'directix'
 *
 * const containerRef = ref(null)
 * const { offset, bind } = useParallax({ speed: 0.5 })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef">Parallax content</div>
 * </template>
 * ```
 */
export function useParallax(options: UseParallaxOptions = {}): UseParallaxReturn {
	const offset = ref(0)
	const isActive = ref(false)

	let currentElement: HTMLElement | null = null,
		scrollHandler: (() => void) | null = null,
		scrollParent: Element | Window | null = null,
		ticking = false

	function handleScroll(): void {
		if (!unref(options.enabled) || isMobile(options.mobileBreakpoint)) {
			return
		}

		if (ticking) return

		ticking = true

		requestAnimationFrame(() => {
			if (!currentElement) return

			const rect = currentElement.getBoundingClientRect()
			const viewportHeight = window.innerHeight

			isActive.value = rect.top < viewportHeight && rect.bottom > 0

			if (isActive.value) {
				const scrollY = window.scrollY
				const elementTop = rect.top + scrollY

				let newOffset = (scrollY - elementTop) * (unref(options.speed) || 0.5)

				if (options.reverse) {
					newOffset = -newOffset
				}

				offset.value = newOffset

				if (options.transform) {
					currentElement.style.transform = options.transform(newOffset, currentElement)
				} else if (options.horizontal) {
					currentElement.style.transform = `translateX(${newOffset}px)`
				} else {
					currentElement.style.transform = `translateY(${newOffset}px)`
				}
			}

			ticking = false
		})
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element
		element.style.willChange = 'transform'

		scrollHandler = handleScroll
		scrollParent = getScrollParent(element)

		scrollParent.addEventListener('scroll', scrollHandler, { passive: true })
		window.addEventListener('resize', scrollHandler, { passive: true })

		// Initial calculation
		handleScroll()

		element.classList.add('v-parallax')

		return unbind
	}

	function unbind(): void {
		if (scrollParent && scrollHandler) {
			scrollParent.removeEventListener('scroll', scrollHandler)
			window.removeEventListener('resize', scrollHandler)
		}

		if (currentElement) {
			currentElement.style.willChange = ''
			currentElement.style.transform = ''
			currentElement.classList.remove('v-parallax')
		}

		currentElement = null
		scrollHandler = null
		scrollParent = null
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		offset,
		isActive,
		bind,
	}
}
