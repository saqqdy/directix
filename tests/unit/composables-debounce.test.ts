import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { debounceFn, useDebounce } from '../../src/composables/use-debounce'

describe('useDebounce', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should debounce function calls', () => {
			const handler = vi.fn()
			const { run } = useDebounce({ handler, wait: 300 })

			run('a')
			run('b')
			run('c')

			expect(handler).not.toHaveBeenCalled()

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(1)
			expect(handler).toHaveBeenCalledWith('c')
		})

		it('should use default wait time', () => {
			const handler = vi.fn()
			const { run } = useDebounce({ handler })

			run('test')

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should pass multiple arguments', () => {
			const handler = vi.fn()
			const { run } = useDebounce({ handler, wait: 100 })

			run('a', 'b', 'c')

			vi.advanceTimersByTime(100)

			expect(handler).toHaveBeenCalledWith('a', 'b', 'c')
		})
	})

	describe('cancel', () => {
		it('should cancel pending execution', () => {
			const handler = vi.fn()
			const { run, cancel } = useDebounce({ handler, wait: 300 })

			run('test')
			cancel()

			vi.advanceTimersByTime(300)

			expect(handler).not.toHaveBeenCalled()
		})

		it('should clear timer and state on cancel', () => {
			const handler = vi.fn()
			const { run, cancel, pending } = useDebounce({ handler, wait: 300 })

			run('test')
			expect(pending()).toBe(true)

			cancel()
			expect(pending()).toBe(false)
		})
	})

	describe('flush', () => {
		it('should immediately execute pending call', () => {
			const handler = vi.fn()
			const { run, flush } = useDebounce({ handler, wait: 300 })

			run('test')

			expect(handler).not.toHaveBeenCalled()

			flush()

			expect(handler).toHaveBeenCalledTimes(1)
			expect(handler).toHaveBeenCalledWith('test')
		})

		it('should not execute if no pending call', () => {
			const handler = vi.fn()
			const { flush } = useDebounce({ handler, wait: 300 })

			flush()

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('pending', () => {
		it('should return true when pending', () => {
			const handler = vi.fn()
			const { run, pending } = useDebounce({ handler, wait: 300 })

			run('test')

			expect(pending()).toBe(true)
		})

		it('should return false when not pending', () => {
			const handler = vi.fn()
			const { pending } = useDebounce({ handler, wait: 300 })

			expect(pending()).toBe(false)
		})

		it('should return false after execution', () => {
			const handler = vi.fn()
			const { run, pending } = useDebounce({ handler, wait: 300 })

			run('test')
			vi.advanceTimersByTime(300)

			expect(pending()).toBe(false)
		})
	})

	describe('leading option', () => {
		it('should invoke immediately on first call when leading is true', () => {
			const handler = vi.fn()
			const { run } = useDebounce({
				handler,
				wait: 300,
				leading: true,
				trailing: false,
			})

			run('test')

			expect(handler).toHaveBeenCalledTimes(1)
			expect(handler).toHaveBeenCalledWith('test')
		})

		it('should not invoke again during wait period', () => {
			const handler = vi.fn()
			const { run } = useDebounce({
				handler,
				wait: 300,
				leading: true,
				trailing: false,
			})

			run('a')
			expect(handler).toHaveBeenCalledTimes(1)

			run('b')

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(1)
		})
	})

	describe('trailing option', () => {
		it('should invoke after wait when trailing is true', () => {
			const handler = vi.fn()
			const { run } = useDebounce({
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

		it('should not invoke when trailing is false', () => {
			const handler = vi.fn()
			const { run } = useDebounce({
				handler,
				wait: 300,
				leading: true,
				trailing: false,
			})

			run('test')
			vi.advanceTimersByTime(300)

			// Only leading should have been called
			expect(handler).toHaveBeenCalledTimes(1)
		})
	})

	describe('reactive wait', () => {
		it('should support reactive wait time', () => {
			const handler = vi.fn()
			const wait = ref(300)
			const { run } = useDebounce({ handler, wait })

			run('a')
			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(1)

			wait.value = 100

			run('b')
			vi.advanceTimersByTime(100)

			expect(handler).toHaveBeenCalledTimes(2)
		})
	})
})

describe('debounceFn', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should create a debounced function', () => {
		const handler = vi.fn()
		const debounced = debounceFn(handler, 300)

		debounced('test')

		vi.advanceTimersByTime(300)

		expect(handler).toHaveBeenCalledWith('test')
	})

	it('should have cancel method', () => {
		const handler = vi.fn()
		const debounced = debounceFn(handler, 300)

		debounced('test')
		debounced.cancel()

		vi.advanceTimersByTime(300)

		expect(handler).not.toHaveBeenCalled()
	})

	it('should have flush method', () => {
		const handler = vi.fn()
		const debounced = debounceFn(handler, 300)

		debounced('test')
		debounced.flush()

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('should support options', () => {
		const handler = vi.fn()
		const debounced = debounceFn(handler, 300, { leading: true })

		debounced('test')

		expect(handler).toHaveBeenCalledTimes(1)
	})
})
