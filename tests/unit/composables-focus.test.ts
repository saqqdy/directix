import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFocus } from '../../src/composables/use-focus'

describe('useFocus', () => {
	let element: HTMLInputElement

	beforeEach(() => {
		element = document.createElement('input')
		document.body.appendChild(element)
	})

	afterEach(() => {
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with isFocused false', () => {
			const { isFocused } = useFocus()

			expect(isFocused.value).toBe(false)
		})

		it('should track focus state after binding', () => {
			const { isFocused, bind } = useFocus()
			bind(element)

			expect(isFocused.value).toBe(false)

			element.focus()

			expect(isFocused.value).toBe(true)
		})

		it('should track blur state', () => {
			const { isFocused, bind } = useFocus()
			bind(element)

			element.focus()
			expect(isFocused.value).toBe(true)

			element.blur()
			expect(isFocused.value).toBe(false)
		})
	})

	describe('focus and blur methods', () => {
		it('should focus the element programmatically', () => {
			const { focus, bind } = useFocus()
			bind(element)

			focus()

			expect(document.activeElement).toBe(element)
		})

		it('should blur the element programmatically', () => {
			const { blur, bind } = useFocus()
			bind(element)

			element.focus()
			expect(document.activeElement).toBe(element)

			blur()
			expect(document.activeElement).not.toBe(element)
		})

		it('should not focus non-focusable elements', () => {
			const div = document.createElement('div')
			document.body.appendChild(div)

			const { focus, bind } = useFocus()
			bind(div)

			focus()

			expect(document.activeElement).not.toBe(div)
		})

		it('should focus link elements with href', () => {
			const link = document.createElement('a')
			link.href = '#'
			document.body.appendChild(link)

			const { focus, bind } = useFocus()
			bind(link)

			// Should not throw error
			expect(() => focus()).not.toThrow()
		})

		it('should not focus link elements without href', () => {
			const link = document.createElement('a')
			document.body.appendChild(link)

			const { focus, bind } = useFocus()
			bind(link)

			// Should not throw error
			expect(() => focus()).not.toThrow()
		})
	})

	describe('bind', () => {
		it('should return unbind function', () => {
			const { isFocused, bind } = useFocus()
			const unbind = bind(element)

			element.focus()
			expect(isFocused.value).toBe(true)

			unbind()

			// After unbind, state should be reset
			expect(isFocused.value).toBe(false)
		})

		it('should cleanup previous binding when binding new element', () => {
			const element2 = document.createElement('input')
			document.body.appendChild(element2)

			const { isFocused, bind } = useFocus()
			bind(element)
			bind(element2)

			element.focus()
			expect(isFocused.value).toBe(false) // First element is no longer tracked

			element2.focus()
			expect(isFocused.value).toBe(true) // Second element is tracked
		})
	})

	describe('callbacks', () => {
		it('should call onFocus callback', () => {
			const onFocus = vi.fn()
			const { bind } = useFocus({ onFocus })
			bind(element)

			element.dispatchEvent(new FocusEvent('focus'))

			expect(onFocus).toHaveBeenCalled()
		})

		it('should call onBlur callback', () => {
			const onBlur = vi.fn()
			const { bind } = useFocus({ onBlur })
			bind(element)

			element.focus()
			element.dispatchEvent(new FocusEvent('blur'))

			expect(onBlur).toHaveBeenCalled()
		})

		it('should pass event to callbacks', () => {
			const onFocus = vi.fn()
			const { bind } = useFocus({ onFocus })
			bind(element)

			const event = new FocusEvent('focus')
			element.dispatchEvent(event)

			expect(onFocus).toHaveBeenCalledWith(event)
		})
	})

	describe('initial state', () => {
		it('should detect if element is already focused', () => {
			element.focus()

			const { isFocused, bind } = useFocus()
			bind(element)

			expect(isFocused.value).toBe(true)
		})
	})
})
