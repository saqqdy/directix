import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

/**
 * Ripple directive options
 */
export interface RippleOptions {
	/**
	 * Ripple color
	 * @default 'currentColor'
	 */
	color?: string

	/**
	 * Ripple duration in milliseconds
	 * @default 600
	 */
	duration?: number

	/**
	 * Whether to disable ripple
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Initial scale of ripple
	 * @default 0
	 */
	initialScale?: number

	/**
	 * Final scale of ripple
	 * @default 2
	 */
	finalScale?: number
}

/**
 * Directive binding value type
 */
export type RippleBinding = boolean | string | RippleOptions

/**
 * Element state storage
 */
interface RippleState {
	options: RippleOptions
	clickHandler: (e: Event) => void
}

/**
 * Normalize options
 */
function normalizeOptions(binding: RippleBinding | undefined): RippleOptions {
	if (binding === false) {
		return { disabled: true, color: 'currentColor', duration: 600 }
	}

	if (typeof binding === 'string') {
		return { color: binding, duration: 600 }
	}

	const base: RippleOptions = {
		color: 'currentColor',
		duration: 600,
		disabled: false,
		initialScale: 0,
		finalScale: 2,
	}

	return binding && typeof binding === 'object' ? { ...base, ...binding } : base
}

/**
 * Create ripple element
 */
function createRipple(
	event: MouseEvent,
	el: HTMLElement,
	options: RippleOptions,
): HTMLSpanElement | null {
	// Get element dimensions
	const rect = el.getBoundingClientRect()

	// Calculate ripple position
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top

	// Calculate ripple size (use diagonal for full coverage)
	const size = Math.max(rect.width, rect.height) * 2

	// Create ripple element
	const ripple = document.createElement('span')

	ripple.className = 'v-ripple__wave'
	ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    background-color: ${options.color};
    width: ${size}px;
    height: ${size}px;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
    transform: scale(${options.initialScale});
    opacity: 0.3;
    z-index: 0;
  `

	return ripple
}

/**
 * Animate ripple
 */
function animateRipple(ripple: HTMLElement, options: RippleOptions): void {
	const duration = options.duration || 600
	const initialScale = options.initialScale || 0
	const finalScale = options.finalScale || 2

	// Use Web Animations API if available
	if (typeof ripple.animate === 'function') {
		ripple.animate(
			[
				{ transform: `scale(${initialScale})`, opacity: 0.3 },
				{ transform: `scale(${finalScale})`, opacity: 0 },
			],
			{
				duration,
				easing: 'ease-out',
				fill: 'forwards',
			},
		).onfinish = () => {
			ripple.remove()
		}
	} else {
		// Fallback for older browsers
		ripple.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`

		// Force reflow
		String(ripple.offsetHeight)

		ripple.style.transform = `scale(${finalScale})`
		ripple.style.opacity = '0'

		setTimeout(() => {
			ripple.remove()
		}, duration)
	}
}

/**
 * v-ripple directive
 *
 * @example
 * ```vue
 * <template>
 *   <button v-ripple>Click me</button>
 *   <button v-ripple="'rgba(255, 255, 255, 0.3)'">Custom color</button>
 *   <button v-ripple="{ color: 'red', duration: 800 }">Custom options</button>
 * </template>
 * ```
 */
export const vRipple = defineDirective<RippleBinding, HTMLElement>({
	name: 'ripple',
	ssr: false,
	defaults: {
		color: 'currentColor',
		duration: 600,
		disabled: false,
		initialScale: 0,
		finalScale: 2,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		// Ensure element has proper positioning
		const computedStyle = getComputedStyle(el)

		if (computedStyle.position === 'static') {
			el.style.position = 'relative'
		}

		// Ensure overflow is hidden to contain ripple
		if (computedStyle.overflow === 'visible') {
			el.style.overflow = 'hidden'
		}

		// Add base class
		el.classList.add('v-ripple')

		const state: RippleState = {
			options,
			clickHandler: (e: Event) => {
				// Ignore if disabled
				if (state.options.disabled) return

				const mouseEvent = e as MouseEvent

				// Create and append ripple
				const ripple = createRipple(mouseEvent, el, state.options)

				if (ripple) {
					el.appendChild(ripple)
					animateRipple(ripple, state.options)
				}
			},
		}

		// Store state
		;(el as any).__ripple = state

		// Bind click event
		on(el, 'click', state.clickHandler)
	},

	updated(el, binding) {
		const state: RippleState = (el as any).__ripple

		if (!state) return

		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: RippleState = (el as any).__ripple

		if (!state) return

		// Unbind event
		off(el, 'click', state.clickHandler)

		// Remove class
		el.classList.remove('v-ripple')

		delete (el as any).__ripple
	},
})

export default vRipple
