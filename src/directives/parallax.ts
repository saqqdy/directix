import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

/**
 * Parallax directive options
 */
export interface ParallaxOptions {
	/**
	 * Parallax speed factor (0-1)
	 * @default 0.5
	 */
	speed?: number

	/**
	 * Whether parallax is enabled
	 * @default true
	 */
	enabled?: boolean

	/**
	 * Minimum scroll position
	 */
	minScroll?: number

	/**
	 * Maximum scroll position
	 */
	maxScroll?: number

	/**
	 * Whether to reverse direction
	 * @default false
	 */
	reverse?: boolean

	/**
	 * Horizontal parallax
	 * @default false
	 */
	horizontal?: boolean

	/**
	 * Custom transform function
	 */
	transform?: (offset: number, el: HTMLElement) => string

	/**
	 * Whether to use CSS transform
	 * @default true
	 */
	useTransform?: boolean

	/**
	 * Mobile breakpoint (disable below this width)
	 */
	mobileBreakpoint?: number
}

/**
 * Directive binding value type
 */
export type ParallaxBinding = boolean | number | ParallaxOptions

/**
 * Element state storage
 */
interface ParallaxState {
	options: ParallaxOptions
	scrollHandler: () => void
	resizeHandler: () => void
	isVisible: boolean
	lastOffset: number
	ticking: boolean
}

/**
 * Normalize options
 */
function normalizeOptions(binding: ParallaxBinding | undefined): ParallaxOptions {
	if (typeof binding === 'boolean') {
		return { enabled: binding }
	}

	if (typeof binding === 'number') {
		return { speed: binding }
	}

	return {
		speed: 0.5,
		enabled: true,
		reverse: false,
		horizontal: false,
		useTransform: true,
		...binding,
	}
}

/**
 * Check if mobile
 */
function isMobile(breakpoint?: number): boolean {
	if (!breakpoint) return false
	return window.innerWidth < breakpoint
}

/**
 * v-parallax directive
 * Parallax scrolling effect
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Simple parallax -->
 *   <div v-parallax>Parallax content</div>
 *
 *   <!-- With speed factor -->
 *   <div v-parallax="0.3">Slower parallax</div>
 *
 *   <!-- With options -->
 *   <div v-parallax="{
 *     speed: 0.5,
 *     reverse: true,
 *     mobileBreakpoint: 768
 *   }">
 *     Reverse parallax, disabled on mobile
 *   </div>
 * </template>
 * ```
 */
export const vParallax = defineDirective<ParallaxBinding, HTMLElement>({
	name: 'parallax',
	ssr: false,

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)

		const state: ParallaxState = {
			options,
			scrollHandler: () => handleScroll(el, state),
			resizeHandler: () => handleResize(el, state),
			isVisible: true,
			lastOffset: 0,
			ticking: false,
		}

		;(el as any).__parallax = state

		// Set initial styles
		el.style.willChange = 'transform'

		// Add scroll listener
		const scrollParent = getScrollParent(el)
		on(scrollParent, 'scroll', state.scrollHandler, { passive: true })
		on(window, 'resize', state.resizeHandler, { passive: true })

		// Initial position
		handleScroll(el, state)

		el.classList.add('v-parallax')
	},

	updated(el, binding) {
		const state: ParallaxState = (el as any).__parallax
		if (!state) return
		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: ParallaxState = (el as any).__parallax
		if (!state) return

		const scrollParent = getScrollParent(el)
		off(scrollParent, 'scroll', state.scrollHandler)
		off(window, 'resize', state.resizeHandler)

		el.style.willChange = ''
		el.style.transform = ''

		el.classList.remove('v-parallax')
		delete (el as any).__parallax
	},
})

/**
 * Handle scroll event
 */
function handleScroll(el: HTMLElement, state: ParallaxState): void {
	if (!state.options.enabled || isMobile(state.options.mobileBreakpoint)) {
		return
	}

	if (state.ticking) return

	state.ticking = true

	requestAnimationFrame(() => {
		const rect = el.getBoundingClientRect()
		const viewportHeight = window.innerHeight

		// Check if element is in viewport
		state.isVisible = rect.top < viewportHeight && rect.bottom > 0

		if (state.isVisible) {
			const scrollY = window.scrollY
			const elementTop = rect.top + scrollY

			// Calculate parallax offset
			let offset = (scrollY - elementTop) * (state.options.speed || 0.5)

			// Apply min/max constraints
			if (state.options.minScroll !== undefined) {
				offset = Math.max(offset, state.options.minScroll)
			}
			if (state.options.maxScroll !== undefined) {
				offset = Math.min(offset, state.options.maxScroll)
			}

			// Reverse if needed
			if (state.options.reverse) {
				offset = -offset
			}

			// Apply transform
			if (state.options.transform) {
				el.style.transform = state.options.transform(offset, el)
			} else if (state.options.useTransform !== false) {
				if (state.options.horizontal) {
					el.style.transform = `translateX(${offset}px)`
				} else {
					el.style.transform = `translateY(${offset}px)`
				}
			}

			state.lastOffset = offset
		}

		state.ticking = false
	})
}

/**
 * Handle resize event
 */
function handleResize(el: HTMLElement, state: ParallaxState): void {
	handleScroll(el, state)
}

/**
 * Get scroll parent element
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

export default vParallax
