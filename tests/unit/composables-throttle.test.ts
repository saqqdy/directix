import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { throttleFn, useThrottle } from '../../src/composables/use-throttle'

describe('useThrottle', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should throttle function calls', () => {
			const handler = vi.fn()
			const { run } = useThrottle({ handler, wait: 300 })

			run('a')
			expect(handler).toHaveBeenCalledTimes(1)
			expect(handler).toHaveBeenCalledWith('a')

			run('b')
			run('c')

			expect(handler).toHaveBeenCalledTimes(1)

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(2)
			expect(handler).toHaveBeenLastCalledWith('c')
		})

		it('should use default wait time', () => {
			const handler = vi.fn()
			const { run } = useThrottle({ handler })

			run('test')

			expect(handler).toHaveBeenCalledTimes(1)

			vi.advanceTimersByTime(300)

			run('test2')
			expect(handler).toHaveBeenCalledTimes(2)
		})

		it('should pass multiple arguments', () => {
			const handler = vi.fn()
			const { run } = useThrottle({ handler, wait: 100 })

			run('a', 'b', 'c')

			expect(handler).toHaveBeenCalledWith('a', 'b', 'c')
		})
	})

	describe('cancel', () => {
		it('should cancel pending trailing call', () => {
			const handler = vi.fn()
			const { run, cancel } = useThrottle({ handler, wait: 300 })

			run('a')
			expect(handler).toHaveBeenCalledTimes(1)

			run('b')
			cancel()

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should clear timer when cancel is called during pending execution', () => {
			const handler = vi.fn()
			const { run, cancel } = useThrottle({ handler, wait: 300, leading: true, trailing: true })

			// First call executes immediately
			run('a')
			expect(handler).toHaveBeenCalledTimes(1)

			// Second call should set up trailing timer
			run('b')
			// No immediate execution
			expect(handler).toHaveBeenCalledTimes(1)

			// Cancel while timer is pending
			cancel()

			// Advance past wait time
			vi.advanceTimersByTime(300)

			// Handler should still only have been called once (trailing was cancelled)
			expect(handler).toHaveBeenCalledTimes(1)
		})
	})

	describe('leading option', () => {
		it('should invoke immediately when leading is true (default)', () => {
			const handler = vi.fn()
			const { run } = useThrottle({
				handler,
				wait: 300,
				leading: true,
			})

			run('test')

			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should not invoke immediately when leading is false', () => {
			const handler = vi.fn()
			const { run } = useThrottle({
				handler,
				wait: 300,
				leading: false,
				trailing: true,
			})

			run('test')

			expect(handler).not.toHaveBeenCalled()

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(1)
		})
	})

	describe('trailing option', () => {
		it('should invoke trailing call by default', () => {
			const handler = vi.fn()
			const { run } = useThrottle({
				handler,
				wait: 300,
				leading: true,
				trailing: true,
			})

			run('a')
			run('b')

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(2)
		})

		it('should not invoke trailing call when trailing is false', () => {
			const handler = vi.fn()
			const { run } = useThrottle({
				handler,
				wait: 300,
				leading: true,
				trailing: false,
			})

			run('a')
			run('b')

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(1)
		})
	})

	describe('reactive wait', () => {
		it('should support reactive wait time', () => {
			const handler = vi.fn()
			const wait = ref(300)
			const { run } = useThrottle({ handler, wait })

			run('a')
			expect(handler).toHaveBeenCalledTimes(1)

			vi.advanceTimersByTime(300)

			run('b')
			expect(handler).toHaveBeenCalledTimes(2)

			wait.value = 100
			vi.advanceTimersByTime(100)

			run('c')
			expect(handler).toHaveBeenCalledTimes(3)
		})
	})
})

describe('throttleFn', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should create a throttled function', () => {
		const handler = vi.fn()
		const throttled = throttleFn(handler, 300)

		throttled('test')

		expect(handler).toHaveBeenCalledWith('test')
	})

	it('should have cancel method', () => {
		const handler = vi.fn()
		const throttled = throttleFn(handler, 300)

		throttled('a')
		throttled('b')
		throttled.cancel()

		vi.advanceTimersByTime(300)

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('should support options', () => {
		const handler = vi.fn()
		const throttled = throttleFn(handler, 300, { leading: false, trailing: true })

		throttled('test')

		expect(handler).not.toHaveBeenCalled()

		vi.advanceTimersByTime(300)

		expect(handler).toHaveBeenCalledTimes(1)
	})
})
