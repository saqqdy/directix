import { defineDirective, isBrowser } from '@directix/core'

/**
 * Counter easing function type
 */
export type CounterEasing = 'linear' | 'easeOut' | 'easeInOut' | 'easeOutQuart' | 'easeOutExpo'

/**
 * Counter directive options
 */
export interface CounterOptions {
	/**
	 * Target value
	 */
	value: number

	/**
	 * Starting value
	 * @default 0
	 */
	startValue?: number

	/**
	 * Animation duration in milliseconds
	 * @default 2000
	 */
	duration?: number

	/**
	 * Number of decimal places
	 * @default 0
	 */
	decimals?: number

	/**
	 * Whether to use thousands separator
	 * @default false
	 */
	useGrouping?: boolean

	/**
	 * Locale for formatting
	 * @default 'en-US'
	 */
	locale?: string

	/**
	 * Custom format function
	 */
	formatter?: (value: number) => string

	/**
	 * Easing function
	 * @default 'easeOutQuart'
	 */
	easing?: CounterEasing

	/**
	 * Custom easing function
	 */
	customEasing?: (t: number) => number

	/**
	 * Animation delay in milliseconds
	 * @default 0
	 */
	delay?: number

	/**
	 * Callback on each frame
	 */
	onUpdate?: (value: number, formattedValue: string) => void

	/**
	 * Callback when animation completes
	 */
	onComplete?: (value: number) => void

	/**
	 * Callback when animation starts
	 */
	onStart?: () => void
}

/**
 * Directive binding value type
 */
export type CounterBinding = number | CounterOptions

/**
 * Element state storage
 */
interface CounterState {
	options: CounterOptions
	animationFrame: number | null
	startTime: number | null
	startValue: number
	currentValue: number
}

/**
 * Normalize options
 */
function normalizeOptions(binding: CounterBinding | undefined): CounterOptions {
	if (typeof binding === 'number') {
		return { value: binding }
	}

	return {
		value: 0,
		startValue: 0,
		duration: 2000,
		decimals: 0,
		useGrouping: false,
		locale: 'en-US',
		easing: 'easeOutQuart',
		delay: 0,
		...(binding || {}),
	}
}

/**
 * Easing functions
 */
const easingFunctions: Record<CounterEasing, (t: number) => number> = {
	linear: t => t,
	easeOut: t => 1 - (1 - t) ** 3,
	easeInOut: t => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2,
	easeOutQuart: t => 1 - (1 - t) ** 4,
	easeOutExpo: t => t === 1 ? 1 : 1 - 2 ** (-10 * t),
}

/**
 * Format number
 */
function formatNumber(value: number, options: CounterOptions): string {
	if (options.formatter) {
		return options.formatter(value)
	}

	return new Intl.NumberFormat(options.locale, {
		minimumFractionDigits: options.decimals,
		maximumFractionDigits: options.decimals,
		useGrouping: options.useGrouping,
	}).format(value)
}

/**
 * v-counter directive
 * Animated number counter
 *
 * @example
 * ```vue
 * <template>
 *   <span v-counter="1000">0</span>
 *
 *   <span v-counter="{
 *     value: 10000,
 *     duration: 3000,
 *     decimals: 2,
 *     useGrouping: true
 *   }">0</span>
 *
 *   <span v-counter="{
 *     value: targetValue,
 *     formatter: (v) => '$' + v.toFixed(2)
 *   }">0</span>
 * </template>
 * ```
 */
export const vCounter = defineDirective<CounterBinding, HTMLElement>({
	name: 'counter',
	ssr: true,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		const state: CounterState = {
			options,
			animationFrame: null,
			startTime: null,
			startValue: options.startValue || 0,
			currentValue: options.startValue || 0,
		}

		;(el as any).__counter = state

		// Set initial value
		el.textContent = formatNumber(state.startValue, options)

		el.classList.add('v-counter')

		// Start animation after delay
		if (isBrowser() && options.value !== state.startValue) {
			setTimeout(() => {
				animateCounter(el, state)
			}, options.delay || 0)
		}
	},

	updated(el, binding) {
		const state: CounterState = (el as any).__counter

		if (!state) return

		const newOptions = normalizeOptions(binding.value)
		const oldValue = state.options.value
		const newValue = newOptions.value

		// Cancel current animation
		if (state.animationFrame) {
			cancelAnimationFrame(state.animationFrame)
			state.animationFrame = null
		}

		// Update start value to current value for smooth transition
		state.startValue = state.currentValue
		state.startTime = null
		state.options = newOptions

		// Restart animation if value changed
		if (newValue !== oldValue) {
			animateCounter(el, state)
		}
	},

	unmounted(el) {
		const state: CounterState = (el as any).__counter

		if (!state) return

		if (state.animationFrame) {
			cancelAnimationFrame(state.animationFrame)
		}

		el.classList.remove('v-counter')
		delete (el as any).__counter
	},
})

/**
 * Animate counter
 */
function animateCounter(el: HTMLElement, state: CounterState): void {
	const { options, startValue } = state
	const endValue = options.value
	const duration = options.duration || 2000

	state.startTime = null
	options.onStart?.()

	function animate(timestamp: number): void {
		if (!state.startTime) {
			state.startTime = timestamp
		}

		const elapsed = timestamp - state.startTime
		const progress = Math.min(elapsed / duration, 1)

		// Apply easing
		const easingFn = options.customEasing || easingFunctions[options.easing || 'easeOutQuart']
		const easedProgress = easingFn(progress)

		// Calculate current value
		state.currentValue = startValue + (endValue - startValue) * easedProgress

		// Format and update
		const formattedValue = formatNumber(state.currentValue, options)
		el.textContent = formattedValue

		options.onUpdate?.(state.currentValue, formattedValue)

		// Continue or complete
		if (progress < 1) {
			state.animationFrame = requestAnimationFrame(animate)
		} else {
			state.currentValue = endValue
			el.textContent = formatNumber(endValue, options)
			state.animationFrame = null
			options.onComplete?.(endValue)
		}
	}

	state.animationFrame = requestAnimationFrame(animate)
}

export default vCounter
