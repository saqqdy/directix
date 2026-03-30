import { defineDirective } from '@directix/core'

/**
 * Countdown format function
 */
export type CountdownFormatFunction = (time: CountdownTime) => string

/**
 * Countdown complete callback
 */
export type CountdownCompleteCallback = () => void

/**
 * Countdown tick callback
 */
export type CountdownTickCallback = (time: CountdownTime) => void

/**
 * Countdown time object
 */
export interface CountdownTime {
	days: number
	hours: number
	minutes: number
	seconds: number
	milliseconds: number
	total: number
}

/**
 * Countdown directive options
 */
export interface CountdownOptions {
	/**
	 * Target time (Date object, timestamp, or ISO string)
	 * @required
	 */
	target: Date | number | string

	/**
	 * Format string or custom format function
	 * - 'dd:hh:mm:ss' - Days:Hours:Minutes:Seconds
	 * - 'hh:mm:ss' - Hours:Minutes:Seconds
	 * - 'mm:ss' - Minutes:Seconds
	 * - 'ss' - Seconds only
	 * @default 'hh:mm:ss'
	 */
	format?: string | CountdownFormatFunction

	/**
	 * Callback when countdown completes
	 */
	onComplete?: CountdownCompleteCallback

	/**
	 * Callback on each tick
	 */
	onTick?: CountdownTickCallback

	/**
	 * Update interval in milliseconds
	 * @default 1000
	 */
	interval?: number

	/**
	 * Whether to show milliseconds
	 * @default false
	 */
	showMilliseconds?: boolean

	/**
	 * Whether to auto-start
	 * @default true
	 */
	autoStart?: boolean

	/**
	 * Custom labels for i18n
	 */
	labels?: {
		days?: string
		hours?: string
		minutes?: string
		seconds?: string
		milliseconds?: string
	}
}

/**
 * Directive binding value type
 */
export type CountdownBinding = CountdownOptions | Date | number | string

/**
 * Element state storage
 */
interface CountdownState {
	options: CountdownOptions
	targetTime: number
	intervalId: ReturnType<typeof setInterval> | null
	paused: boolean
	remaining: number
}

/**
 * Parse target time to timestamp
 */
function parseTargetTime(target: Date | number | string): number {
	if (target instanceof Date) {
		return target.getTime()
	}

	if (typeof target === 'number') {
		return target
	}

	return new Date(target).getTime()
}

/**
 * Calculate remaining time
 */
function calculateTime(remaining: number): CountdownTime {
	const total = Math.max(0, remaining)

	return {
		days: Math.floor(total / (1000 * 60 * 60 * 24)),
		hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
		minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
		seconds: Math.floor((total % (1000 * 60)) / 1000),
		milliseconds: total % 1000,
		total,
	}
}

/**
 * Format time to string
 */
function formatTime(time: CountdownTime, format: string | CountdownFormatFunction): string {
	if (typeof format === 'function') {
		return format(time)
	}

	const pad = (n: number, len = 2) => String(n).padStart(len, '0')

	// Replace placeholders
	let result = format
		.replace(/dd/gi, pad(time.days))
		.replace(/hh/gi, pad(time.hours))
		.replace(/mm/gi, pad(time.minutes))
		.replace(/ss/gi, pad(time.seconds))
		.replace(/SSS/gi, pad(time.milliseconds, 3))
		.replace(/SS/gi, pad(Math.floor(time.milliseconds / 10)))
		.replace(/S/gi, String(Math.floor(time.milliseconds / 100)))

	return result
}

/**
 * Normalize options
 */
function normalizeOptions(binding: CountdownBinding): CountdownOptions {
	if (typeof binding === 'object' && binding !== null && 'target' in binding) {
		return {
			target: binding.target,
			format: binding.format ?? 'hh:mm:ss',
			onComplete: binding.onComplete,
			onTick: binding.onTick,
			interval: binding.interval ?? 1000,
			showMilliseconds: binding.showMilliseconds ?? false,
			autoStart: binding.autoStart ?? true,
			labels: binding.labels,
		}
	}

	// binding is Date | number | string
	return {
		target: binding as Date | number | string,
		format: 'hh:mm:ss',
		interval: 1000,
		showMilliseconds: false,
		autoStart: true,
	}
}

/**
 * v-countdown directive
 *
 * Displays a countdown timer.
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Basic usage -->
 *   <span v-countdown="targetDate"></span>
 *
 *   <!-- With timestamp -->
 *   <span v-countdown="Date.now() + 60000"></span>
 *
 *   <!-- With options -->
 *   <span v-countdown="{
 *     target: targetDate,
 *     format: 'dd:hh:mm:ss',
 *     onComplete: handleComplete
 *   }"></span>
 *
 *   <!-- With custom format function -->
 *   <span v-countdown="{
 *     target: targetDate,
 *     format: (time) => `${time.days} days ${time.hours}:${time.minutes}:${time.seconds}`
 *   }"></span>
 * </template>
 * ```
 */
export const vCountdown = defineDirective<CountdownBinding, HTMLElement>({
	name: 'countdown',
	ssr: true,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)
		const targetTime = parseTargetTime(options.target)

		const state: CountdownState = {
			options,
			targetTime,
			intervalId: null,
			paused: false,
			remaining: 0,
		}

		;(el as any).__countdown = state

		if (options.autoStart !== false) {
			startCountdown(el, state)
		} else {
			// Show initial time
			updateDisplay(el, state)
		}
	},

	updated(el, binding) {
		const state: CountdownState = (el as any).__countdown
		const newOptions = normalizeOptions(binding.value)
		const newTargetTime = parseTargetTime(newOptions.target)

		// Check if target changed
		if (newTargetTime !== state.targetTime) {
			state.targetTime = newTargetTime
			state.options = newOptions

			// Clear existing interval if any
			if (state.intervalId) {
				clearInterval(state.intervalId)
				state.intervalId = null
			}

			// Restart countdown if not paused
			if (!state.paused) {
				startCountdown(el, state)
			}
		} else {
			state.options = newOptions
		}
	},

	unmounted(el) {
		const state: CountdownState | undefined = (el as any).__countdown

		if (state?.intervalId) {
			clearInterval(state.intervalId)
		}

		delete (el as any).__countdown
	},
})

/**
 * Start countdown
 */
function startCountdown(el: HTMLElement, state: CountdownState): void {
	const tick = () => {
		const now = Date.now()
		state.remaining = state.targetTime - now

		if (state.remaining <= 0) {
			state.remaining = 0
			updateDisplay(el, state)
			stopCountdown(state)

			// Call onComplete
			if (state.options.onComplete) {
				state.options.onComplete()
			}

			// Dispatch event
			el.dispatchEvent(new CustomEvent('countdown:complete'))
			return
		}

		updateDisplay(el, state)

		// Call onTick
		if (state.options.onTick) {
			const time = calculateTime(state.remaining)
			state.options.onTick(time)
		}
	}

	// Initial tick
	tick()

	// Start interval
	state.intervalId = setInterval(tick, state.options.interval || 1000)
}

/**
 * Stop countdown
 */
function stopCountdown(state: CountdownState): void {
	if (state.intervalId) {
		clearInterval(state.intervalId)
		state.intervalId = null
	}
}

/**
 * Update display
 */
function updateDisplay(el: HTMLElement, state: CountdownState): void {
	const time = calculateTime(state.remaining)
	const display = formatTime(time, state.options.format || 'hh:mm:ss')
	el.textContent = display
}

// Export helper functions for external use
export { calculateTime, formatTime, parseTargetTime }

export default vCountdown
