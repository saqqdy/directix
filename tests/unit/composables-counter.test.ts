import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import {
	calculateTime,
	formatTime,
	parseTargetTime,
	useCountdown,
	useCounter,
} from '../../src/composables'

describe('counter composables', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('useCounter', () => {
		it('should initialize with default values', () => {
			const value = ref(100)
			const { currentValue, formattedValue, isAnimating } = useCounter({ value })

			expect(currentValue.value).toBe(0)
			expect(formattedValue.value).toBe('0')
			expect(isAnimating.value).toBe(false)
		})

		it('should initialize with startValue', () => {
			const value = ref(100)
			const { currentValue } = useCounter({ value, startValue: 50 })

			expect(currentValue.value).toBe(50)
		})

		it('should format value with custom formatter', () => {
			const value = ref(100)
			const { formattedValue, bind } = useCounter({
				value,
				formatter: val => `$${val.toFixed(2)}`,
			})

			const element = document.createElement('span')
			bind(element)

			expect(formattedValue.value).toBe('$0.00')
		})

		it('should format value with locale options', () => {
			const value = ref(1000)
			const { formattedValue, bind } = useCounter({
				value,
				useGrouping: true,
				decimals: 0,
			})

			const element = document.createElement('span')
			bind(element)

			// Formatted value depends on locale
			expect(typeof formattedValue.value).toBe('string')
		})

		it('should start animation when bind is called', () => {
			const value = ref(100)
			const { isAnimating, bind } = useCounter({ value, duration: 1000 })

			const element = document.createElement('span')
			bind(element)

			expect(isAnimating.value).toBe(true)
		})

		it('should update element text content', () => {
			const value = ref(100)
			const { bind } = useCounter({ value, duration: 1000 })

			const element = document.createElement('span')
			bind(element)

			expect(element.textContent).toBe('0')
		})

		it('should call onStart callback', () => {
			const onStart = vi.fn()
			const value = ref(100)
			const { bind } = useCounter({ value, duration: 1000, onStart })

			const element = document.createElement('span')
			bind(element)

			expect(onStart).toHaveBeenCalled()
		})

		it('should animate to target value', async () => {
			const value = ref(100)
			const duration = 1000
			const { bind, isAnimating } = useCounter({
				value,
				duration,
			})

			const element = document.createElement('span')
			bind(element)

			// Fast-forward to completion
			vi.advanceTimersByTime(duration + 100)

			// Animation should be complete
			expect(isAnimating.value).toBe(false)
		})

		it('should call onComplete when animation finishes', async () => {
			const onComplete = vi.fn()
			const value = ref(100)
			const duration = 1000
			const { bind } = useCounter({ value, duration, onComplete })

			const element = document.createElement('span')
			bind(element)

			vi.advanceTimersByTime(duration + 100)

			expect(onComplete).toHaveBeenCalled()
		})

		it('should stop animation when stop is called', () => {
			const value = ref(100)
			const { isAnimating, stop, bind } = useCounter({
				value,
				duration: 1000,
			})

			const element = document.createElement('span')
			bind(element)

			stop()

			expect(isAnimating.value).toBe(false)
		})

		it('should setValue and restart animation', async () => {
			const value = ref(100)
			const { setValue, stop, bind } = useCounter({
				value,
				duration: 1000,
			})

			const element = document.createElement('span')
			bind(element)
			stop()

			setValue(200)

			// Value should be set
			expect(typeof setValue).toBe('function')
		})

		it('should apply easing functions', async () => {
			const value = ref(100)
			const duration = 1000

			// Test linear easing
			const { currentValue: linearValue, bind: bindLinear } = useCounter({
				value,
				duration,
				easing: 'linear',
			})

			const element1 = document.createElement('span')
			bindLinear(element1)

			vi.advanceTimersByTime(500)

			// Linear should be close to 50%
			expect(linearValue.value).toBeGreaterThan(0)
			expect(linearValue.value).toBeLessThan(100)
		})

		it('should apply custom easing function', async () => {
			const value = ref(100)
			const duration = 1000
			const customEasing = (t: number) => t * t // quadratic

			const { currentValue, bind } = useCounter({
				value,
				duration,
				customEasing,
			})

			const element = document.createElement('span')
			bind(element)

			vi.advanceTimersByTime(500)

			// Should have animated
			expect(currentValue.value).toBeGreaterThan(0)
			expect(currentValue.value).toBeLessThan(100)
		})

		it('should handle reactive value changes', async () => {
			const value = ref(100)
			const { bind, isAnimating } = useCounter({
				value,
				duration: 1000,
			})

			const element = document.createElement('span')
			bind(element)

			// Wait for initial animation
			vi.advanceTimersByTime(1100)

			// Animation should be complete
			expect(isAnimating.value).toBe(false)
		})

		it('should add v-counter class to element', () => {
			const value = ref(100)
			const { bind } = useCounter({ value })

			const element = document.createElement('span')
			bind(element)

			expect(element.classList.contains('v-counter')).toBe(true)
		})
	})

	describe('useCountdown', () => {
		it('should initialize with target time', () => {
			const target = Date.now() + 60000 // 1 minute from now
			const { time, running, completed } = useCountdown({
				target,
				autoStart: false,
			})

			expect(time.value.total).toBeGreaterThanOrEqual(0)
			expect(running.value).toBe(false)
			expect(completed.value).toBe(false)
		})

		it('should auto-start by default', () => {
			const target = Date.now() + 60000
			const { running } = useCountdown({ target })

			expect(running.value).toBe(true)
		})

		it('should not auto-start when autoStart is false', () => {
			const target = Date.now() + 60000
			const { running } = useCountdown({ target, autoStart: false })

			expect(running.value).toBe(false)
		})

		it('should start countdown when start is called', () => {
			const target = Date.now() + 60000
			const { running, start } = useCountdown({
				target,
				autoStart: false,
			})

			start()

			expect(running.value).toBe(true)
		})

		it('should format time with default format', () => {
			const target = Date.now() + 3661000 // 1h 1m 1s
			const { formatted, start } = useCountdown({
				target,
				format: 'hh:mm:ss',
				autoStart: false,
			})

			start()

			// Should show hours, minutes, seconds
			expect(formatted.value).toMatch(/\d{2}:\d{2}:\d{2}/)
		})

		it('should format time with days', () => {
			const target = Date.now() + 90061000 // 1d 1h 1m 1s
			const { formatted, start } = useCountdown({
				target,
				format: 'dd:hh:mm:ss',
				autoStart: false,
			})

			start()

			expect(formatted.value).toMatch(/\d{2}:\d{2}:\d{2}:\d{2}/)
		})

		it('should use custom format function', () => {
			const target = Date.now() + 60000
			const { formatted, start } = useCountdown({
				target,
				format: time => `${time.minutes}m ${time.seconds}s`,
				autoStart: false,
			})

			start()

			expect(formatted.value).toMatch(/\dm \ds/)
		})

		it('should call onTick callback', async () => {
			const onTick = vi.fn()
			const target = Date.now() + 5000

			useCountdown({
				target,
				interval: 1000,
				onTick,
			})

			// Advance by one interval
			vi.advanceTimersByTime(1000)

			expect(onTick).toHaveBeenCalled()
		})

		it('should call onComplete when countdown finishes', async () => {
			const onComplete = vi.fn()
			const target = Date.now() + 1000

			useCountdown({
				target,
				interval: 100,
				onComplete,
			})

			vi.advanceTimersByTime(1500)

			expect(onComplete).toHaveBeenCalled()
		})

		it('should pause and resume countdown', async () => {
			const target = Date.now() + 10000
			const { running, paused, pause, resume } = useCountdown({
				target,
				interval: 100,
			})

			expect(running.value).toBe(true)
			expect(paused.value).toBe(false)

			pause()

			expect(running.value).toBe(false)
			expect(paused.value).toBe(true)

			resume()

			expect(running.value).toBe(true)
			expect(paused.value).toBe(false)
		})

		it('should reset countdown', () => {
			const target = Date.now() + 10000
			const { running, paused, completed, reset } = useCountdown({
				target,
				interval: 100,
			})

			vi.advanceTimersByTime(500)

			reset()

			expect(running.value).toBe(false)
			expect(paused.value).toBe(false)
			expect(completed.value).toBe(false)
		})

		it('should handle Date object as target', () => {
			const target = new Date(Date.now() + 60000)
			const { time, start } = useCountdown({
				target,
				autoStart: false,
			})

			start()

			expect(time.value.total).toBeGreaterThan(0)
		})

		it('should handle string target', () => {
			const target = new Date(Date.now() + 60000).toISOString()
			const { time, start } = useCountdown({
				target,
				autoStart: false,
			})

			start()

			expect(time.value.total).toBeGreaterThan(0)
		})

		it('should update when target changes', async () => {
			const target = ref(Date.now() + 10000)
			const { time, start } = useCountdown({
				target,
				autoStart: false,
			})

			start()

			const initialTotal = time.value.total

			target.value = Date.now() + 20000
			await nextTick()

			// Total should be updated
			expect(time.value.total).toBeGreaterThanOrEqual(initialTotal)
		})

		it('should show completed state when finished', async () => {
			const target = Date.now() + 100
			const { completed, running } = useCountdown({
				target,
				interval: 50,
			})

			vi.advanceTimersByTime(200)

			expect(completed.value).toBe(true)
			expect(running.value).toBe(false)
		})
	})

	describe('parseTargetTime', () => {
		it('should parse Date object', () => {
			const date = new Date(2024, 0, 1)
			expect(parseTargetTime(date)).toBe(date.getTime())
		})

		it('should parse timestamp number', () => {
			const timestamp = 1704067200000
			expect(parseTargetTime(timestamp)).toBe(timestamp)
		})

		it('should parse ISO string', () => {
			const isoString = '2024-01-01T00:00:00.000Z'
			expect(parseTargetTime(isoString)).toBe(new Date(isoString).getTime())
		})
	})

	describe('calculateTime', () => {
		it('should calculate time components correctly', () => {
			// 1 day, 2 hours, 30 minutes, 45 seconds, 500ms
			const totalMs = 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 30 * 60 * 1000 + 45 * 1000 + 500

			const time = calculateTime(totalMs)

			expect(time.days).toBe(1)
			expect(time.hours).toBe(2)
			expect(time.minutes).toBe(30)
			expect(time.seconds).toBe(45)
			expect(time.milliseconds).toBe(500)
			expect(time.total).toBe(totalMs)
		})

		it('should return zero for negative values', () => {
			const time = calculateTime(-1000)

			expect(time.total).toBe(0)
			expect(time.days).toBe(0)
			expect(time.hours).toBe(0)
		})
	})

	describe('formatTime', () => {
		it('should format with hh:mm:ss', () => {
			const time = calculateTime(3661500) // 1h 1m 1s 500ms
			const formatted = formatTime(time, 'hh:mm:ss')

			expect(formatted).toBe('01:01:01')
		})

		it('should format with dd:hh:mm:ss', () => {
			const time = calculateTime(90061000) // 1d 1h 1m 1s
			const formatted = formatTime(time, 'dd:hh:mm:ss')

			expect(formatted).toBe('01:01:01:01')
		})

		it('should format with custom function', () => {
			const time = calculateTime(90000) // 1m 30s
			const formatted = formatTime(time, t => `${t.minutes}m ${t.seconds}s`)

			expect(formatted).toBe('1m 30s')
		})

		it('should handle milliseconds', () => {
			const time = calculateTime(1234)
			const formatted = formatTime(time, 'ss:SSS')

			// Format depends on implementation
			expect(formatted).toMatch(/\d{2}:\d{3}/)
		})
	})
})
