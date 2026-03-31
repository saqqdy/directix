import { onUnmounted, ref, type Ref, unref, watch } from 'vue'

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
 * Options for useCountdown composable
 */
export interface UseCountdownOptions {
	/**
	 * Target time (Date object, timestamp, or ISO string)
	 * @required
	 */
	target: Date | number | string | Ref<Date | number | string>

	/**
	 * Format string or custom format function
	 * - 'dd:hh:mm:ss' - Days:Hours:Minutes:Seconds
	 * - 'hh:mm:ss' - Hours:Minutes:Seconds
	 * - 'mm:ss' - Minutes:Seconds
	 * - 'ss' - Seconds only
	 * @default 'hh:mm:ss'
	 */
	format?: string | CountdownFormatFunction | Ref<string | CountdownFormatFunction>

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
	interval?: number | Ref<number>

	/**
	 * Whether to show milliseconds
	 * @default false
	 */
	showMilliseconds?: boolean | Ref<boolean>

	/**
	 * Whether to auto-start
	 * @default true
	 */
	autoStart?: boolean | Ref<boolean>

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
 * Return type for useCountdown composable
 */
export interface UseCountdownReturn {
	/**
	 * Current countdown time
	 */
	time: Ref<CountdownTime>

	/**
	 * Formatted time string
	 */
	formatted: Ref<string>

	/**
	 * Whether countdown is running
	 */
	running: Ref<boolean>

	/**
	 * Whether countdown is paused
	 */
	paused: Ref<boolean>

	/**
	 * Whether countdown has completed
	 */
	completed: Ref<boolean>

	/**
	 * Start the countdown
	 */
	start: () => void

	/**
	 * Pause the countdown
	 */
	pause: () => void

	/**
	 * Resume the countdown
	 */
	resume: () => void

	/**
	 * Reset the countdown
	 */
	reset: () => void
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

	const pad = (n: number, len = 2): string => String(n).padStart(len, '0')

	// Replace placeholders
	const result = format
		.replace(/dd/gi, pad(time.days))
		.replace(/hh/gi, pad(time.hours))
		.replace(/mm/gi, pad(time.minutes))
		.replace(/ss/gi, pad(time.seconds))
		.replace(/S{3}/gi, pad(time.milliseconds, 3))
		.replace(/SS/gi, pad(Math.floor(time.milliseconds / 10)))
		.replace(/S/gi, String(Math.floor(time.milliseconds / 100)))

	return result
}

/**
 * Composable for countdown timer functionality
 *
 * @param options - Configuration options
 * @returns Countdown utilities and state
 *
 * @example
 * ```vue
 * <script setup>
 * import { useCountdown } from 'directix'
 *
 * const targetDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
 *
 * const { formatted, running, completed, pause, resume } = useCountdown({
 *   target: targetDate,
 *   format: 'hh:mm:ss',
 *   onComplete: () => console.log('Done!')
 * })
 * </script>
 *
 * <template>
 *   <div>
 *     <p>{{ formatted }}</p>
 *     <button @click="pause" v-if="running">Pause</button>
 *     <button @click="resume" v-if="!running && !completed">Resume</button>
 *   </div>
 * </template>
 * ```
 */
export function useCountdown(options: UseCountdownOptions): UseCountdownReturn {
	const {
		target,
		format = 'hh:mm:ss',
		onComplete,
		onTick,
		interval = 1000,
		autoStart = true,
	} = options

	// State
	const time = ref<CountdownTime>(calculateTime(0))
	const formatted = ref<string>('')
	const running = ref(false)
	const paused = ref(false)
	const completed = ref(false)

	// Internal state
	let intervalId: ReturnType<typeof setInterval> | null = null,
		targetTime = 0,
		remainingWhenPaused = 0

	const getInterval = (): number => unref(interval)
	const getFormat = (): string | CountdownFormatFunction => unref(format)

	/**
	 * Update the countdown display
	 */
	function update(): void {
		const now = Date.now()
		const remaining = targetTime - now

		if (remaining <= 0) {
			time.value = calculateTime(0)
			formatted.value = formatTime(time.value, getFormat())
			completed.value = true
			running.value = false
			stop()

			if (onComplete) {
				onComplete()
			}
			return
		}

		time.value = calculateTime(remaining)
		formatted.value = formatTime(time.value, getFormat())

		if (onTick) {
			onTick(time.value)
		}
	}

	/**
	 * Start the countdown
	 */
	function start(): void {
		if (running.value) return

		// Update target time from ref
		targetTime = parseTargetTime(unref(target))
		running.value = true
		paused.value = false
		completed.value = false

		// Initial update
		update()

		// Start interval
		intervalId = setInterval(update, getInterval())
	}

	/**
	 * Stop the countdown
	 */
	function stop(): void {
		if (intervalId) {
			clearInterval(intervalId)
			intervalId = null
		}
		running.value = false
	}

	/**
	 * Pause the countdown
	 */
	function pause(): void {
		if (!running.value) return

		remainingWhenPaused = targetTime - Date.now()
		stop()
		paused.value = true
	}

	/**
	 * Resume the countdown
	 */
	function resume(): void {
		if (running.value || !paused.value) return

		// Recalculate target time from remaining time
		targetTime = Date.now() + remainingWhenPaused
		running.value = true
		paused.value = false

		// Initial update
		update()

		// Start interval
		intervalId = setInterval(update, getInterval())
	}

	/**
	 * Reset the countdown
	 */
	function reset(): void {
		stop()
		paused.value = false
		completed.value = false
		remainingWhenPaused = 0
		time.value = calculateTime(0)
		formatted.value = formatTime(time.value, getFormat())
	}

	// Watch for target changes
	watch(
		() => unref(target),
		newTarget => {
			if (running.value) {
				targetTime = parseTargetTime(newTarget)
			}
		},
	)

	// Auto-start if enabled
	if (unref(autoStart)) {
		start()
	}

	// Cleanup on unmount
	onUnmounted(() => {
		stop()
	})

	return {
		time,
		formatted,
		running,
		paused,
		completed,
		start,
		pause,
		resume,
		reset,
	}
}

export { calculateTime, formatTime, parseTargetTime }
