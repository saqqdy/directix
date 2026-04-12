import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useLongPress } from '../../src/composables/use-long-press'

describe('useLongPress', () => {
	let element: HTMLElement

	beforeEach(() => {
		vi.useFakeTimers()
		element = document.createElement('button')
		document.body.appendChild(element)
	})

	afterEach(() => {
		vi.useRealTimers()
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with isPressing false', () => {
			const { isPressing } = useLongPress()

			expect(isPressing.value).toBe(false)
		})

		it('should set isPressing on start', () => {
			const { isPressing, start } = useLongPress()

			start(new MouseEvent('mousedown'))

			expect(isPressing.value).toBe(true)
		})

		it('should reset isPressing on stop', () => {
			const { isPressing, start, stop } = useLongPress()

			start(new MouseEvent('mousedown'))
			expect(isPressing.value).toBe(true)

			stop(new MouseEvent('mouseup'))
			expect(isPressing.value).toBe(false)
		})
	})

	describe('trigger', () => {
		it('should trigger after default duration', () => {
			const onTrigger = vi.fn()
			const { start } = useLongPress({ onTrigger })

			start(new MouseEvent('mousedown'))

			vi.advanceTimersByTime(500)

			expect(onTrigger).toHaveBeenCalled()
		})

		it('should trigger after custom duration', () => {
			const onTrigger = vi.fn()
			const { start } = useLongPress({ onTrigger, duration: 1000 })

			start(new MouseEvent('mousedown'))

			vi.advanceTimersByTime(500)
			expect(onTrigger).not.toHaveBeenCalled()

			vi.advanceTimersByTime(500)
			expect(onTrigger).toHaveBeenCalled()
		})

		it('should not trigger if stopped early', () => {
			const onTrigger = vi.fn()
			const { start, stop } = useLongPress({ onTrigger })

			start(new MouseEvent('mousedown'))
			vi.advanceTimersByTime(200)
			stop(new MouseEvent('mouseup'))

			vi.advanceTimersByTime(500)

			expect(onTrigger).not.toHaveBeenCalled()
		})
	})

	describe('callbacks', () => {
		it('should call onStart when pressing starts', () => {
			const onStart = vi.fn()
			const { start } = useLongPress({ onStart })

			const event = new MouseEvent('mousedown')
			start(event)

			expect(onStart).toHaveBeenCalledWith(event)
		})

		it('should call onCancel when pressing stops', () => {
			const onCancel = vi.fn()
			const { start, stop } = useLongPress({ onCancel })

			start(new MouseEvent('mousedown'))
			stop(new MouseEvent('mouseup'))

			expect(onCancel).toHaveBeenCalled()
		})

		it('should not call onCancel after trigger', () => {
			const onCancel = vi.fn()
			const onTrigger = vi.fn()
			const { start } = useLongPress({ onCancel, onTrigger })

			start(new MouseEvent('mousedown'))
			vi.advanceTimersByTime(500)

			expect(onTrigger).toHaveBeenCalled()
			expect(onCancel).not.toHaveBeenCalled()
		})
	})

	describe('onTick', () => {
		it('should call onTick during press', () => {
			const onTick = vi.fn()
			const { start } = useLongPress({ onTick, duration: 500, tickInterval: 100 })

			start(new MouseEvent('mousedown'))

			vi.advanceTimersByTime(100)
			expect(onTick).toHaveBeenCalledTimes(1)

			vi.advanceTimersByTime(100)
			expect(onTick).toHaveBeenCalledTimes(2)
		})

		it('should pass remaining time to onTick', () => {
			const onTick = vi.fn()
			const { start } = useLongPress({ onTick, duration: 500, tickInterval: 100 })

			start(new MouseEvent('mousedown'))

			vi.advanceTimersByTime(100)
			expect(onTick).toHaveBeenCalledWith(400)
		})
	})

	describe('prevent option', () => {
		it('should prevent default by default', () => {
			const preventDefault = vi.fn()
			const { start } = useLongPress()

			const event = { preventDefault } as unknown as MouseEvent
			start(event)

			expect(preventDefault).toHaveBeenCalled()
		})

		it('should not prevent default when prevent is false', () => {
			const preventDefault = vi.fn()
			const { start } = useLongPress({ prevent: false })

			const event = { preventDefault } as unknown as MouseEvent
			start(event)

			expect(preventDefault).not.toHaveBeenCalled()
		})
	})

	describe('bind', () => {
		it('should bind mouse events', () => {
			const onTrigger = vi.fn()
			const { bind } = useLongPress({ onTrigger })

			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown'))
			vi.advanceTimersByTime(500)

			expect(onTrigger).toHaveBeenCalled()
		})

		it('should cancel on mouseleave', () => {
			const onTrigger = vi.fn()
			const { bind } = useLongPress({ onTrigger })

			bind(element)

			element.dispatchEvent(new MouseEvent('mousedown'))
			element.dispatchEvent(new MouseEvent('mouseleave'))
			vi.advanceTimersByTime(500)

			expect(onTrigger).not.toHaveBeenCalled()
		})

		it('should return unbind function', () => {
			const onTrigger = vi.fn()
			const { bind } = useLongPress({ onTrigger })

			const unbind = bind(element)

			element.dispatchEvent(new MouseEvent('mousedown'))

			unbind()

			vi.advanceTimersByTime(500)
			expect(onTrigger).not.toHaveBeenCalled()
		})

		it('should handle touch events', () => {
			const onTrigger = vi.fn()
			const { bind } = useLongPress({ onTrigger })

			bind(element)

			const touchEvent = new TouchEvent('touchstart')
			element.dispatchEvent(touchEvent)

			vi.advanceTimersByTime(500)

			expect(onTrigger).toHaveBeenCalled()
		})
	})

	describe('reactive duration', () => {
		it('should support reactive duration', () => {
			const duration = ref(500)
			const onTrigger = vi.fn()
			const { start } = useLongPress({ duration, onTrigger })

			start(new MouseEvent('mousedown'))
			vi.advanceTimersByTime(500)

			expect(onTrigger).toHaveBeenCalledTimes(1)
		})
	})
})
