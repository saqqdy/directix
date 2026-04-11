import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { createDelayedClick, useClickDelay } from '../../src/composables/use-click-delay'

describe('useClickDelay', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with isPending false', () => {
			const handler = vi.fn()
			const { isPending } = useClickDelay({ handler })

			expect(isPending.value).toBe(false)
		})

		it('should return click, reset, and cancel functions', () => {
			const handler = vi.fn()
			const { click, reset, cancel } = useClickDelay({ handler })

			expect(typeof click).toBe('function')
			expect(typeof reset).toBe('function')
			expect(typeof cancel).toBe('function')
		})
	})

	describe('click handler', () => {
		it('should call handler on click', () => {
			const handler = vi.fn()
			const { click } = useClickDelay({ handler })

			const event = new MouseEvent('click')
			click(event)

			expect(handler).toHaveBeenCalledWith(event)
		})

		it('should set isPending to true during delay', () => {
			const handler = vi.fn()
			const { click, isPending } = useClickDelay({ handler, delay: 300 })

			const event = new MouseEvent('click')
			click(event)

			expect(isPending.value).toBe(true)
		})

		it('should reset isPending after delay', async () => {
			const handler = vi.fn()
			const { click, isPending } = useClickDelay({ handler, delay: 300 })

			const event = new MouseEvent('click')
			click(event)

			expect(isPending.value).toBe(true)

			// Advance time past delay
			vi.advanceTimersByTime(300)
			await nextTick()

			expect(isPending.value).toBe(false)
		})

		it('should prevent click when pending', () => {
			const handler = vi.fn()
			const { click } = useClickDelay({ handler, delay: 300 })

			const event1 = new MouseEvent('click')
			const event2 = new MouseEvent('click')

			click(event1)
			expect(handler).toHaveBeenCalledTimes(1)

			click(event2)
			// Handler should not be called again
			expect(handler).toHaveBeenCalledTimes(1)
		})
	})

	describe('disabled option', () => {
		it('should not call handler when disabled', () => {
			const handler = vi.fn()
			const { click } = useClickDelay({ handler, disabled: true })

			const event = new MouseEvent('click')
			click(event)

			expect(handler).not.toHaveBeenCalled()
		})

		it('should prevent event when disabled', () => {
			const handler = vi.fn()
			const { click } = useClickDelay({ handler, disabled: true })

			const event = new MouseEvent('click')
			const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
			click(event)

			expect(preventDefaultSpy).toHaveBeenCalled()
		})

		it('should work with reactive disabled', async () => {
			const handler = vi.fn()
			const disabled = ref(true)
			const { click } = useClickDelay({ handler, disabled })

			const event = new MouseEvent('click')
			click(event)
			expect(handler).not.toHaveBeenCalled()

			// Enable
			disabled.value = false
			await nextTick()

			click(event)
			expect(handler).toHaveBeenCalled()
		})
	})

	describe('reset', () => {
		it('should reset pending state', async () => {
			const handler = vi.fn()
			const { click, isPending, reset } = useClickDelay({ handler, delay: 300 })

			const event = new MouseEvent('click')
			click(event)

			expect(isPending.value).toBe(true)

			reset()

			expect(isPending.value).toBe(false)
		})

		it('should allow click after reset', () => {
			const handler = vi.fn()
			const { click, reset } = useClickDelay({ handler, delay: 300 })

			const event1 = new MouseEvent('click')
			const event2 = new MouseEvent('click')

			click(event1)
			expect(handler).toHaveBeenCalledTimes(1)

			reset()

			click(event2)
			expect(handler).toHaveBeenCalledTimes(2)
		})
	})

	describe('cancel', () => {
		it('should cancel pending timeout', async () => {
			const handler = vi.fn()
			const { click, isPending, cancel } = useClickDelay({ handler, delay: 300 })

			const event = new MouseEvent('click')
			click(event)

			expect(isPending.value).toBe(true)

			cancel()

			// Advance time - isPending should still be true because we only canceled the timeout
			vi.advanceTimersByTime(300)
			await nextTick()

			// isPending stays true because we didn't reset
			expect(isPending.value).toBe(true)
		})
	})

	describe('reactive delay', () => {
		it('should work with reactive delay', async () => {
			const handler = vi.fn()
			const delay = ref(300)
			const { click, isPending } = useClickDelay({ handler, delay })

			const event = new MouseEvent('click')
			click(event)

			expect(isPending.value).toBe(true)

			// Advance by 300ms
			vi.advanceTimersByTime(300)
			await nextTick()

			expect(isPending.value).toBe(false)
		})
	})

	describe('touch events', () => {
		it('should handle touch events', () => {
			const handler = vi.fn()
			const { click } = useClickDelay({ handler })

			const event = new TouchEvent('touchstart')
			click(event)

			expect(handler).toHaveBeenCalledWith(event)
		})
	})
})

describe('createDelayedClick', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	it('should create a delayed click handler', () => {
		const handler = vi.fn()
		const delayedClick = createDelayedClick(handler, 300)

		const event = new MouseEvent('click')
		delayedClick(event)

		expect(handler).toHaveBeenCalledWith(event)
	})

	it('should prevent rapid clicks', () => {
		const handler = vi.fn()
		const delayedClick = createDelayedClick(handler, 300)

		const event1 = new MouseEvent('click')
		const event2 = new MouseEvent('click')

		delayedClick(event1)
		expect(handler).toHaveBeenCalledTimes(1)

		delayedClick(event2)
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('should allow click after delay', async () => {
		const handler = vi.fn()
		const delayedClick = createDelayedClick(handler, 300)

		const event1 = new MouseEvent('click')
		const event2 = new MouseEvent('click')

		delayedClick(event1)
		expect(handler).toHaveBeenCalledTimes(1)

		// Advance time past delay
		vi.advanceTimersByTime(300)
		await nextTick()

		delayedClick(event2)
		expect(handler).toHaveBeenCalledTimes(2)
	})

	it('should prevent event when pending', () => {
		const handler = vi.fn()
		const delayedClick = createDelayedClick(handler, 300)

		const event1 = new MouseEvent('click')
		const event2 = new MouseEvent('click')
		const preventDefaultSpy = vi.spyOn(event2, 'preventDefault')

		delayedClick(event1)
		delayedClick(event2)

		expect(preventDefaultSpy).toHaveBeenCalled()
	})
})
