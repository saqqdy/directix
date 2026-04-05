import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, ref, unref, watch } from 'vue'

/**
 * Easing type
 */
export type CounterEasing = 'linear' | 'easeOut' | 'easeInOut' | 'easeOutQuart' | 'easeOutExpo'

/**
 * Options for useCounter composable
 */
export interface UseCounterOptions {
	/** Target value */
	value: number | Ref<number>

	/** Starting value */
	startValue?: number

	/** Animation duration */
	duration?: number

	/** Decimal places */
	decimals?: number

	/** Use grouping separator */
	useGrouping?: boolean

	/** Locale */
	locale?: string

	/** Custom formatter */
	formatter?: (value: number) => string

	/** Easing function */
	easing?: CounterEasing

	/** Custom easing function */
	customEasing?: (t: number) => number

	/** Callback on update */
	onUpdate?: (value: number, formattedValue: string) => void

	/** Callback on complete */
	onComplete?: (value: number) => void

	/** Callback on start */
	onStart?: () => void
}

/**
 * Return type for useCounter composable
 */
export interface UseCounterReturn {
	/** Current value */
	currentValue: Ref<number>

	/** Formatted value */
	formattedValue: Ref<string>

	/** Whether animating */
	isAnimating: Ref<boolean>

	/** Set target value */
	setValue: (value: number) => void

	/** Start animation */
	start: () => void

	/** Stop animation */
	stop: () => void

	/** Bind counter to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Easing functions
 */
const easingFunctions: Record<CounterEasing, (t: number) => number> = {
	linear: t => t,
	easeOut: t => 1 - (1 - t) ** 3,
	easeInOut: t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
	easeOutQuart: t => 1 - (1 - t) ** 4,
	easeOutExpo: t => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
}

/**
 * Format number
 */
function formatNumber(value: number, options: UseCounterOptions): string {
	if (options.formatter) {
		return options.formatter(value)
	}

	return new Intl.NumberFormat(options.locale || 'en-US', {
		minimumFractionDigits: options.decimals || 0,
		maximumFractionDigits: options.decimals || 0,
		useGrouping: options.useGrouping || false,
	}).format(value)
}

/**
 * Composable for animated number counter
 *
 * @param options - Configuration options
 * @returns Counter utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useCounter } from 'directix'
 *
 * const containerRef = ref(null)
 * const { currentValue, formattedValue, setValue, bind } = useCounter({
 *   value: 1000,
 *   duration: 2000,
 *   useGrouping: true
 * })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <span ref="containerRef">0</span>
 * </template>
 * ```
 */
export function useCounter(options: UseCounterOptions): UseCounterReturn {
	const currentValue = ref(options.startValue ?? 0)
	const formattedValue = ref(formatNumber(currentValue.value, options))
	const isAnimating = ref(false)

	let currentElement: HTMLElement | null = null,
		animationFrame: number | null = null,
		startTime: number | null = null,
		targetValue = unref(options.value),
		startVal = currentValue.value

	function animate(timestamp: number): void {
		if (!startTime) {
			startTime = timestamp
		}

		const elapsed = timestamp - startTime
		const duration = options.duration || 2000
		const progress = Math.min(elapsed / duration, 1)

		// Apply easing
		const easingFn = options.customEasing || easingFunctions[options.easing || 'easeOutQuart']
		const easedProgress = easingFn(progress)

		// Calculate current value
		currentValue.value = startVal + (targetValue - startVal) * easedProgress

		// Format and update
		formattedValue.value = formatNumber(currentValue.value, options)

		if (currentElement) {
			currentElement.textContent = formattedValue.value
		}

		options.onUpdate?.(currentValue.value, formattedValue.value)

		// Continue or complete
		if (progress < 1) {
			animationFrame = requestAnimationFrame(animate)
		} else {
			currentValue.value = targetValue
			formattedValue.value = formatNumber(targetValue, options)
			if (currentElement) {
				currentElement.textContent = formattedValue.value
			}
			isAnimating.value = false
			animationFrame = null
			options.onComplete?.(targetValue)
		}
	}

	function start(): void {
		if (isAnimating.value) return

		isAnimating.value = true
		startTime = null
		startVal = currentValue.value
		options.onStart?.()

		animationFrame = requestAnimationFrame(animate)
	}

	function stop(): void {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame)
			animationFrame = null
		}
		isAnimating.value = false
	}

	function setValue(newValue: number): void {
		targetValue = newValue
		startVal = currentValue.value
		startTime = null

		if (!isAnimating.value) {
			start()
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element
		element.classList.add('v-counter')

		// Set initial value
		element.textContent = formattedValue.value

		// Watch for value changes
		if (typeof options.value !== 'number') {
			watch(options.value, newVal => {
				setValue(newVal)
			})
		}

		// Start animation
		start()

		return unbind
	}

	function unbind(): void {
		stop()
		if (currentElement) {
			currentElement.classList.remove('v-counter')
		}
		currentElement = null
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		currentValue,
		formattedValue,
		isAnimating,
		setValue,
		start,
		stop,
		bind,
	}
}
