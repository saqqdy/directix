import { defineDirective } from '@directix/core'

/**
 * Fade animation direction
 */
export type FadeDirection = 'in' | 'out' | 'toggle'

/**
 * Fade directive options
 */
export interface FadeOptions {
	/**
	 * Fade direction
	 * @default 'toggle'
	 */
	direction?: FadeDirection

	/**
	 * Whether element is visible initially
	 * @default true
	 */
	visible?: boolean

	/**
	 * Animation duration in milliseconds
	 * @default 300
	 */
	duration?: number

	/**
	 * Animation delay in milliseconds
	 * @default 0
	 */
	delay?: number

	/**
	 * CSS easing function
	 * @default 'ease'
	 */
	easing?: string

	/**
	 * Minimum opacity when fading out
	 * @default 0
	 */
	minOpacity?: number

	/**
	 * Maximum opacity when fading in
	 * @default 1
	 */
	maxOpacity?: number

	/**
	 * Callback when fade starts
	 */
	onStart?: (direction: 'in' | 'out') => void

	/**
	 * Callback when fade completes
	 */
	onComplete?: (direction: 'in' | 'out') => void
}

/**
 * Directive binding value type
 */
export type FadeBinding = boolean | FadeDirection | FadeOptions

/**
 * Element state storage
 */
interface FadeState {
	options: FadeOptions
	currentOpacity: number
	animationFrame: number | null
	isAnimating: boolean
}

/**
 * Normalize options
 */
function normalizeOptions(binding: FadeBinding | undefined): FadeOptions {
	if (typeof binding === 'boolean') {
		return { visible: binding }
	}

	if (typeof binding === 'string') {
		return { direction: binding as FadeDirection }
	}

	return {
		direction: 'toggle',
		visible: true,
		duration: 300,
		delay: 0,
		easing: 'ease',
		minOpacity: 0,
		maxOpacity: 1,
		...binding,
	}
}

/**
 * Parse easing to timing function
 */
function getTimingFunction(easing: string): string {
	const easingMap: Record<string, string> = {
		ease: 'ease',
		'ease-in': 'ease-in',
		'ease-out': 'ease-out',
		'ease-in-out': 'ease-in-out',
		linear: 'linear',
	}

	return easingMap[easing] || easing
}

/**
 * v-fade directive
 * Fade in/out transition effect
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Toggle visibility with fade -->
 *   <div v-fade="isVisible">Fade content</div>
 *
 *   <!-- Fade in only -->
 *   <div v-fade="'in'">Fade in</div>
 *
 *   <!-- Fade out only -->
 *   <div v-fade="'out'">Fade out</div>
 *
 *   <!-- With options -->
 *   <div v-fade="{
 *     visible: isVisible,
 *     duration: 500,
 *     easing: 'ease-in-out',
 *     onComplete: () => console.log('Fade complete')
 *   }">
 *     Content
 *   </div>
 * </template>
 * ```
 */
export const vFade = defineDirective<FadeBinding, HTMLElement>({
	name: 'fade',
	ssr: true,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		const state: FadeState = {
			options,
			currentOpacity: options.visible ? options.maxOpacity || 1 : options.minOpacity || 0,
			animationFrame: null,
			isAnimating: false,
		}

		;(el as any).__fade = state

		// Set initial state
		el.style.transition = `opacity ${options.duration}ms ${getTimingFunction(options.easing || 'ease')} ${options.delay}ms`
		el.style.opacity = String(state.currentOpacity)

		// Hide element if starting invisible
		if (!options.visible) {
			el.style.display = 'none'
		}

		el.classList.add('v-fade')
	},

	updated(el, binding) {
		const state: FadeState = (el as any).__fade

		if (!state) return

		const newOptions = normalizeOptions(binding.value)
		const wasVisible = state.options.visible !== false
		const isVisible = newOptions.visible !== false

		state.options = newOptions

		// Update transition
		el.style.transition = `opacity ${newOptions.duration}ms ${getTimingFunction(newOptions.easing || 'ease')} ${newOptions.delay}ms`

		if (wasVisible !== isVisible) {
			animate(el, state, isVisible ? 'in' : 'out')
		}
	},

	unmounted(el) {
		const state: FadeState = (el as any).__fade

		if (!state) return

		if (state.animationFrame) {
			cancelAnimationFrame(state.animationFrame)
		}

		el.classList.remove('v-fade')

		delete (el as any).__fade
	},
})

/**
 * Animate fade
 */
function animate(el: HTMLElement, state: FadeState, direction: 'in' | 'out'): void {
	if (state.isAnimating) return

	const options = state.options
	state.isAnimating = true

	options.onStart?.(direction)

	if (direction === 'in') {
		// Show element before fade in
		el.style.display = ''
		el.style.opacity = String(options.minOpacity || 0)

		// Force reflow
		String(el.offsetHeight)

		// Fade in
		requestAnimationFrame(() => {
			el.style.opacity = String(options.maxOpacity || 1)

			setTimeout(() => {
				state.isAnimating = false
				state.currentOpacity = options.maxOpacity || 1
				options.onComplete?.(direction)
			}, (options.duration || 300) + (options.delay || 0))
		})
	} else {
		// Fade out
		el.style.opacity = String(options.minOpacity || 0)

		setTimeout(() => {
			state.isAnimating = false
			state.currentOpacity = options.minOpacity || 0
			el.style.display = 'none'
			options.onComplete?.(direction)
		}, (options.duration || 300) + (options.delay || 0))
	}
}

export default vFade
