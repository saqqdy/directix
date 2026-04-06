import { describe, expect, it, vi } from 'vitest'
import {
	isInputElement,
	setupTextTransformInput,
	type TextTransformOptions,
	transformTextContent,
} from '../../src/utils/text-transform'

describe('text-transform utils', () => {
	describe('isInputElement', () => {
		it('should return true for INPUT element', () => {
			const input = document.createElement('input')
			expect(isInputElement(input)).toBe(true)
		})

		it('should return true for TEXTAREA element', () => {
			const textarea = document.createElement('textarea')
			expect(isInputElement(textarea)).toBe(true)
		})

		it('should return false for DIV element', () => {
			const div = document.createElement('div')
			expect(isInputElement(div)).toBe(false)
		})

		it('should return false for SPAN element', () => {
			const span = document.createElement('span')
			expect(isInputElement(span)).toBe(false)
		})
	})

	describe('setupTextTransformInput', () => {
		it('should transform initial value on setup', () => {
			const input = document.createElement('input')
			input.value = 'hello'

			const cleanup = setupTextTransformInput(input, { onInput: true }, text => text.toUpperCase())

			expect(input.value).toBe('HELLO')
			cleanup()
		})

		it('should transform value on input event', () => {
			const input = document.createElement('input')
			input.value = ''

			const cleanup = setupTextTransformInput(input, { onInput: true }, text => text.toUpperCase())

			// Simulate input
			input.value = 'world'
			input.dispatchEvent(new Event('input', { bubbles: true }))

			expect(input.value).toBe('WORLD')
			cleanup()
		})

		it('should not transform when onInput is false', () => {
			const input = document.createElement('input')
			input.value = 'hello'

			const cleanup = setupTextTransformInput(
				input,
				{ onInput: false } as TextTransformOptions,
				text => text.toUpperCase(),
			)

			expect(input.value).toBe('hello')

			// Simulate input
			input.value = 'world'
			input.dispatchEvent(new Event('input', { bubbles: true }))

			expect(input.value).toBe('world')
			cleanup()
		})

		it('should restore cursor position after transform', () => {
			const input = document.createElement('input')
			input.value = ''

			const cleanup = setupTextTransformInput(input, { onInput: true }, text => text.toUpperCase())

			// Simulate input with cursor position
			input.value = 'hello'
			input.setSelectionRange(3, 3)
			input.dispatchEvent(new Event('input', { bubbles: true }))

			expect(input.value).toBe('HELLO')
			expect(input.selectionStart).toBe(3)
			expect(input.selectionEnd).toBe(3)
			cleanup()
		})

		it('should dispatch input event after transform', () => {
			const input = document.createElement('input')
			input.value = ''
			const inputHandler = vi.fn()
			input.addEventListener('input', inputHandler)

			const cleanup = setupTextTransformInput(input, { onInput: true }, text => text.toUpperCase())

			// Simulate input
			input.value = 'hello'
			input.dispatchEvent(new Event('input', { bubbles: true }))

			// Should have been called (initial + transform dispatch)
			expect(inputHandler).toHaveBeenCalled()
			cleanup()
		})

		it('should not dispatch input event if value unchanged', () => {
			const input = document.createElement('input')
			input.value = ''
			let dispatchCount = 0

			// Track dispatchEvent calls
			const originalDispatch = input.dispatchEvent.bind(input)
			input.dispatchEvent = (event: Event) => {
				if (event.type === 'input') dispatchCount++
				return originalDispatch(event)
			}

			const cleanup = setupTextTransformInput(input, { onInput: true }, text => text)

			const initialCount = dispatchCount

			// Simulate input with same value (no transformation)
			input.value = 'hello'
			input.dispatchEvent(new Event('input', { bubbles: true }))

			// Should not have dispatched additional input event
			expect(dispatchCount).toBe(initialCount + 1) // only the original event
			cleanup()
		})

		it('should cleanup event listener', () => {
			const input = document.createElement('input')
			input.value = ''

			const cleanup = setupTextTransformInput(input, { onInput: true }, text => text.toUpperCase())

			// Verify it works before cleanup
			input.value = 'hello'
			input.dispatchEvent(new Event('input', { bubbles: true }))
			expect(input.value).toBe('HELLO')

			// Cleanup
			cleanup()

			// Should not transform after cleanup
			input.value = 'world'
			input.dispatchEvent(new Event('input', { bubbles: true }))
			expect(input.value).toBe('world')
		})

		it('should work with textarea element', () => {
			const textarea = document.createElement('textarea')
			textarea.value = 'hello'

			const cleanup = setupTextTransformInput(textarea, { onInput: true }, text => text.toUpperCase())

			expect(textarea.value).toBe('HELLO')
			cleanup()
		})
	})

	describe('transformTextContent', () => {
		it('should transform text content of element', () => {
			const div = document.createElement('div')
			div.textContent = 'hello world'

			transformTextContent(div, text => text.toUpperCase())

			expect(div.textContent).toBe('HELLO WORLD')
		})

		it('should handle empty text content', () => {
			const div = document.createElement('div')
			div.textContent = ''

			transformTextContent(div, text => text.toUpperCase())

			expect(div.textContent).toBe('')
		})

		it('should handle null text content', () => {
			const div = document.createElement('div')
			div.textContent = null as unknown as string

			transformTextContent(div, text => text.toUpperCase())

			expect(div.textContent).toBe('')
		})

		it('should handle whitespace', () => {
			const div = document.createElement('div')
			div.textContent = '  hello  world  '

			transformTextContent(div, text => text.trim())

			expect(div.textContent).toBe('hello  world')
		})

		it('should handle special characters', () => {
			const div = document.createElement('div')
			div.textContent = 'hello!@#$%^&*()world'

			transformTextContent(div, text => text.toUpperCase())

			expect(div.textContent).toBe('HELLO!@#$%^&*()WORLD')
		})
	})
})
