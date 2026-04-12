import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useHover } from '../../src/composables/use-hover'

describe('useHover', () => {
	let element: HTMLElement

	beforeEach(() => {
		vi.useFakeTimers()
		element = document.createElement('div')
		document.body.appendChild(element)
	})

	afterEach(() => {
		vi.useRealTimers()
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with isHovering false', () => {
			const { isHovering } = useHover()

			expect(isHovering.value).toBe(false)
		})

		it('should track hover state after binding', () => {
			const { isHovering, bind } = useHover()
			bind(element)

			expect(isHovering.value).toBe(false)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(isHovering.value).toBe(true)
		})

		it('should track mouse leave', () => {
			const { isHovering, bind } = useHover()
			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			expect(isHovering.value).toBe(true)

			element.dispatchEvent(new MouseEvent('mouseleave'))
			expect(isHovering.value).toBe(false)
		})
	})

	describe('bind', () => {
		it('should return unbind function', () => {
			const { isHovering, bind } = useHover()
			const unbind = bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			expect(isHovering.value).toBe(true)

			unbind()

			element.dispatchEvent(new MouseEvent('mouseleave'))
			// After unbind, state should remain true
			expect(isHovering.value).toBe(true)
		})

		it('should remove event listeners on unbind', () => {
			const { isHovering, bind } = useHover()
			const unbind = bind(element)

			unbind()

			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(isHovering.value).toBe(false)
		})
	})

	describe('callbacks', () => {
		it('should call onEnter callback', () => {
			const onEnter = vi.fn()
			const { bind } = useHover({ onEnter })
			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(onEnter).toHaveBeenCalled()
		})

		it('should call onLeave callback', () => {
			const onLeave = vi.fn()
			const { bind } = useHover({ onLeave })
			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			element.dispatchEvent(new MouseEvent('mouseleave'))

			expect(onLeave).toHaveBeenCalled()
		})

		it('should pass event to callbacks', () => {
			const onEnter = vi.fn()
			const { bind } = useHover({ onEnter })
			bind(element)

			const event = new MouseEvent('mouseenter')
			element.dispatchEvent(event)

			expect(onEnter).toHaveBeenCalledWith(event)
		})
	})

	describe('enterDelay option', () => {
		it('should delay enter state', () => {
			const { isHovering, bind } = useHover({ enterDelay: 200 })
			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(isHovering.value).toBe(false)

			vi.advanceTimersByTime(200)

			expect(isHovering.value).toBe(true)
		})

		it('should cancel enter on quick leave', () => {
			const onEnter = vi.fn()
			const { isHovering, bind } = useHover({ enterDelay: 200, onEnter })
			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			element.dispatchEvent(new MouseEvent('mouseleave'))

			vi.advanceTimersByTime(200)

			expect(isHovering.value).toBe(false)
			expect(onEnter).not.toHaveBeenCalled()
		})

		it('should support reactive enterDelay', () => {
			const enterDelay = ref(100)
			const { isHovering, bind } = useHover({ enterDelay })
			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			vi.advanceTimersByTime(100)

			expect(isHovering.value).toBe(true)
		})
	})

	describe('leaveDelay option', () => {
		it('should delay leave state', () => {
			const { isHovering, bind } = useHover({ leaveDelay: 200 })
			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			expect(isHovering.value).toBe(true)

			element.dispatchEvent(new MouseEvent('mouseleave'))

			expect(isHovering.value).toBe(true)

			vi.advanceTimersByTime(200)

			expect(isHovering.value).toBe(false)
		})

		it('should cancel leave on quick re-enter', () => {
			const onLeave = vi.fn()
			const { isHovering, bind } = useHover({ leaveDelay: 200, onLeave })
			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			element.dispatchEvent(new MouseEvent('mouseleave'))
			element.dispatchEvent(new MouseEvent('mouseenter'))

			vi.advanceTimersByTime(200)

			expect(isHovering.value).toBe(true)
			expect(onLeave).not.toHaveBeenCalled()
		})
	})

	describe('class option', () => {
		it('should add class on hover', () => {
			const { bind } = useHover({ class: 'is-hovering' })
			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(element.classList.contains('is-hovering')).toBe(true)
		})

		it('should remove class on leave', () => {
			const { bind } = useHover({ class: 'is-hovering' })
			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			element.dispatchEvent(new MouseEvent('mouseleave'))

			expect(element.classList.contains('is-hovering')).toBe(false)
		})
	})
})
