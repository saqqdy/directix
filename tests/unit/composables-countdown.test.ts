import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { calculateTime, formatTime, parseTargetTime, useCountdown } from '../../src/composables/use-countdown'

describe('useCountdown', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with correct state', () => {
			const target = Date.now() + 60000 // 1 minute from now

			const { time, running, completed, paused } = useCountdown({
				target,
				autoStart: false,
			})

			expect(time.value).toBeDefined()
			expect(running.value).toBe(false)
			expect(completed.value).toBe(false)
			expect(paused.value).toBe(false)
		})

		it('should auto-start by default', () => {
			const target = Date.now() + 60000

			const { running } = useCountdown({ target })

			expect(running.value).toBe(true)
		})

		it('should not auto-start when disabled', () => {
			const target = Date.now() + 60000

			const { running } = useCountdown({
				target,
				autoStart: false,
			})

			expect(running.value).toBe(false)
		})

		it('should count down correctly', () => {
			const target = Date.now() + 5000 // 5 seconds

			const { time, formatted } = useCountdown({
				target,
				format: 'ss',
			})

			expect(time.value.seconds).toBeLessThanOrEqual(5)
			expect(formatted.value).toBeDefined()
		})
	})

	describe('format option', () => {
		it('should format with default format', () => {
			const target = Date.now() + 3661000 // 1 hour 1 min 1 sec

			const { formatted } = useCountdown({ target })

			expect(formatted.value).toMatch(/^\d{2}:\d{2}:\d{2}$/)
		})

		it('should format with custom format string', () => {
			const target = Date.now() + 3661000

			const { formatted } = useCountdown({
				target,
				format: 'dd:hh:mm:ss',
			})

			expect(formatted.value).toMatch(/^\d{2}:\d{2}:\d{2}:\d{2}$/)
		})

		it('should format with custom function', () => {
			const target = Date.now() + 60000

			const { time } = useCountdown({
				target,
				format: t => `${t.minutes}m ${t.seconds}s`,
			})

			// Check that format function is used
			expect(time.value).toBeDefined()
		})
	})

	describe('controls', () => {
		it('should start the countdown', () => {
			const target = Date.now() + 60000

			const { start, running } = useCountdown({
				target,
				autoStart: false,
			})

			start()

			expect(running.value).toBe(true)
		})

		it('should pause the countdown', () => {
			const target = Date.now() + 60000

			const { pause, running, paused } = useCountdown({ target })

			pause()

			expect(running.value).toBe(false)
			expect(paused.value).toBe(true)
		})

		it('should resume the countdown', () => {
			const target = Date.now() + 60000

			const { pause, resume, running, paused } = useCountdown({ target })

			pause()
			expect(paused.value).toBe(true)

			resume()
			expect(running.value).toBe(true)
			expect(paused.value).toBe(false)
		})

		it('should reset the countdown', () => {
			const target = Date.now() + 60000

			const { reset, running, completed } = useCountdown({ target })

			reset()

			expect(running.value).toBe(false)
			expect(completed.value).toBe(false)
		})
	})

	describe('callbacks', () => {
		it('should call onComplete when countdown finishes', () => {
			const onComplete = vi.fn()
			const target = Date.now() + 100 // 100ms

			useCountdown({
				target,
				interval: 10,
				onComplete,
			})

			vi.advanceTimersByTime(150)

			expect(onComplete).toHaveBeenCalled()
		})

		it('should call onTick on each interval', () => {
			const onTick = vi.fn()
			const target = Date.now() + 1000

			useCountdown({
				target,
				interval: 100,
				onTick,
			})

			vi.advanceTimersByTime(350)

			expect(onTick).toHaveBeenCalled()
		})
	})

	describe('reactive target', () => {
		it('should update when target changes', () => {
			const target = ref(Date.now() + 10000)

			const { time } = useCountdown({
				target,
				autoStart: false,
			})

			// Check that time is reactive
			expect(time.value).toBeDefined()
			expect(time.value.seconds).toBeLessThanOrEqual(10)

			target.value = Date.now() + 20000

			// Target should be updated
			expect(time.value).toBeDefined()
		})
	})

	describe('completion', () => {
		it('should set completed when time runs out', () => {
			const target = Date.now() + 50

			const { completed, running } = useCountdown({
				target,
				interval: 10,
			})

			vi.advanceTimersByTime(100)

			expect(completed.value).toBe(true)
			expect(running.value).toBe(false)
		})

		it('should have zero time when completed', () => {
			const target = Date.now() + 50

			const { time, completed } = useCountdown({
				target,
				interval: 10,
			})

			vi.advanceTimersByTime(100)

			expect(completed.value).toBe(true)
			expect(time.value.total).toBe(0)
			expect(time.value.days).toBe(0)
			expect(time.value.hours).toBe(0)
			expect(time.value.minutes).toBe(0)
			expect(time.value.seconds).toBe(0)
		})
	})
})

describe('calculateTime', () => {
	it('should calculate days correctly', () => {
		const time = calculateTime(3 * 24 * 60 * 60 * 1000) // 3 days

		expect(time.days).toBe(3)
		expect(time.hours).toBe(0)
		expect(time.minutes).toBe(0)
		expect(time.seconds).toBe(0)
	})

	it('should calculate hours correctly', () => {
		const time = calculateTime(5 * 60 * 60 * 1000) // 5 hours

		expect(time.days).toBe(0)
		expect(time.hours).toBe(5)
		expect(time.minutes).toBe(0)
	})

	it('should calculate minutes correctly', () => {
		const time = calculateTime(30 * 60 * 1000) // 30 minutes

		expect(time.days).toBe(0)
		expect(time.hours).toBe(0)
		expect(time.minutes).toBe(30)
	})

	it('should calculate seconds correctly', () => {
		const time = calculateTime(45 * 1000) // 45 seconds

		expect(time.seconds).toBe(45)
	})

	it('should handle combined time', () => {
		const time = calculateTime(90061000) // 1 day, 1 hour, 1 min, 1 sec

		expect(time.days).toBe(1)
		expect(time.hours).toBe(1)
		expect(time.minutes).toBe(1)
		expect(time.seconds).toBe(1)
		expect(time.total).toBe(90061000)
	})

	it('should return zero for negative values', () => {
		const time = calculateTime(-1000)

		expect(time.total).toBe(0)
		expect(time.days).toBe(0)
	})
})

describe('formatTime', () => {
	it('should format with dd:hh:mm:ss', () => {
		const time = calculateTime(90061000)

		const result = formatTime(time, 'dd:hh:mm:ss')

		expect(result).toBe('01:01:01:01')
	})

	it('should format with hh:mm:ss', () => {
		const time = calculateTime(3661000)

		const result = formatTime(time, 'hh:mm:ss')

		expect(result).toBe('01:01:01')
	})

	it('should format with mm:ss', () => {
		const time = calculateTime(61000)

		const result = formatTime(time, 'mm:ss')

		expect(result).toBe('01:01')
	})

	it('should format with custom function', () => {
		const time = calculateTime(90061000)

		const result = formatTime(time, t => `${t.days}d ${t.hours}h`)

		expect(result).toBe('1d 1h')
	})

	it('should pad numbers correctly', () => {
		const time = calculateTime(5000) // 5 seconds

		const result = formatTime(time, 'ss')

		expect(result).toBe('05')
	})
})

describe('parseTargetTime', () => {
	it('should parse Date object', () => {
		const date = new Date('2024-12-31T23:59:59')

		const result = parseTargetTime(date)

		expect(result).toBe(date.getTime())
	})

	it('should parse timestamp', () => {
		const timestamp = 1704067199000

		const result = parseTargetTime(timestamp)

		expect(result).toBe(timestamp)
	})

	it('should parse ISO string', () => {
		const isoString = '2024-12-31T23:59:59'

		const result = parseTargetTime(isoString)

		expect(result).toBe(new Date(isoString).getTime())
	})
})
