import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useClickOutside } from '../../src/composables/use-click-outside'

describe('useClickOutside', () => {
	let element: HTMLElement,
		handler: ReturnType<typeof vi.fn>

	beforeEach(() => {
		element = document.createElement('div')
		document.body.appendChild(element)
		handler = vi.fn()
	})

	afterEach(() => {
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should call handler when clicking outside', () => {
			const { bind } = useClickOutside({ handler })
			bind(element)

			document.body.click()

			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should not call handler when clicking inside', () => {
			const { bind } = useClickOutside({ handler })
			bind(element)

			element.click()

			expect(handler).not.toHaveBeenCalled()
		})

		it('should not call handler when clicking children', () => {
			const child = document.createElement('span')
			element.appendChild(child)

			const { bind } = useClickOutside({ handler })
			bind(element)

			child.click()

			expect(handler).not.toHaveBeenCalled()
		})

		it('should return unbind function', () => {
			const { bind } = useClickOutside({ handler })
			const unbind = bind(element)

			document.body.click()
			expect(handler).toHaveBeenCalledTimes(1)

			unbind()

			document.body.click()
			expect(handler).toHaveBeenCalledTimes(1) // Not called again
		})
	})

	describe('exclude option', () => {
		it('should not trigger when clicking excluded element', () => {
			const excluded = document.createElement('button')
			document.body.appendChild(excluded)

			const { bind } = useClickOutside({
				handler,
				exclude: [excluded],
			})
			bind(element)

			excluded.click()

			expect(handler).not.toHaveBeenCalled()
		})

		it('should not trigger when clicking excluded element children', () => {
			const excluded = document.createElement('div')
			const child = document.createElement('span')
			excluded.appendChild(child)
			document.body.appendChild(excluded)

			const { bind } = useClickOutside({
				handler,
				exclude: [excluded],
			})
			bind(element)

			child.click()

			expect(handler).not.toHaveBeenCalled()
		})

		it('should support string selector for exclude', () => {
			const excluded = document.createElement('button')
			excluded.id = 'trigger'
			document.body.appendChild(excluded)

			const { bind } = useClickOutside({
				handler,
				exclude: ['#trigger'],
			})
			bind(element)

			excluded.click()

			expect(handler).not.toHaveBeenCalled()
		})

		it('should support function returning element for exclude', () => {
			const excluded = document.createElement('button')
			document.body.appendChild(excluded)

			const { bind } = useClickOutside({
				handler,
				exclude: [() => excluded],
			})
			bind(element)

			excluded.click()

			expect(handler).not.toHaveBeenCalled()
		})

		it('should support ref for exclude', () => {
			const excludedRef = ref<HTMLElement | null>(null)
			const excluded = document.createElement('button')
			document.body.appendChild(excluded)
			excludedRef.value = excluded

			const { bind } = useClickOutside({
				handler,
				exclude: [excludedRef],
			})
			bind(element)

			excluded.click()

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('events option', () => {
		it('should listen to custom events', () => {
			const { bind } = useClickOutside({
				handler,
				events: ['mousedown'],
			})
			bind(element)

			document.body.dispatchEvent(new MouseEvent('mousedown'))

			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should listen to multiple events', () => {
			const { bind } = useClickOutside({
				handler,
				events: ['click', 'mousedown'],
			})
			bind(element)

			document.body.dispatchEvent(new MouseEvent('mousedown'))
			document.body.click()

			expect(handler).toHaveBeenCalledTimes(2)
		})

		it('should support touch events', () => {
			const { bind } = useClickOutside({
				handler,
				events: ['touchstart'],
			})
			bind(element)

			document.body.dispatchEvent(new TouchEvent('touchstart'))

			expect(handler).toHaveBeenCalledTimes(1)
		})
	})

	describe('capture option', () => {
		it('should use capture mode by default', () => {
			const addSpy = vi.spyOn(document, 'addEventListener')

			const { bind } = useClickOutside({ handler })
			bind(element)

			expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function), {
				capture: true,
				passive: true,
			})
		})

		it('should not use capture when disabled', () => {
			const addSpy = vi.spyOn(document, 'addEventListener')

			const { bind } = useClickOutside({
				handler,
				capture: false,
			})
			bind(element)

			expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function), {
				capture: false,
				passive: true,
			})
		})
	})

	describe('stop and prevent options', () => {
		it('should stop propagation when stop is true', () => {
			const { bind } = useClickOutside({
				handler,
				stop: true,
			})
			bind(element)

			const event = new MouseEvent('click', { bubbles: true })
			const stopSpy = vi.spyOn(event, 'stopPropagation')

			document.body.dispatchEvent(event)

			expect(stopSpy).toHaveBeenCalled()
		})

		it('should prevent default when prevent is true', () => {
			const { bind } = useClickOutside({
				handler,
				prevent: true,
			})
			bind(element)

			const event = new MouseEvent('click', { bubbles: true, cancelable: true })
			const preventSpy = vi.spyOn(event, 'preventDefault')

			document.body.dispatchEvent(event)

			expect(preventSpy).toHaveBeenCalled()
		})
	})
})
