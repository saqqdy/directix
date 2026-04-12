import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useHotkey } from '../../src/composables/use-hotkey'

describe('useHotkey', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should track enabled state', () => {
			const { enabled, enable, disable, toggle } = useHotkey()

			expect(enabled.value).toBe(true)

			disable()
			expect(enabled.value).toBe(false)

			enable()
			expect(enabled.value).toBe(true)

			toggle()
			expect(enabled.value).toBe(false)
		})

		it('should add and remove hotkeys', () => {
			const handler = vi.fn()
			const { add, remove, clear } = useHotkey()

			add({ key: 'ctrl+s', handler })
			expect(typeof remove).toBe('function')
			remove('s')
			expect(typeof clear).toBe('function')
			clear()
		})

		it('should handle key events', () => {
			const handler = vi.fn()
			useHotkey({
				hotkey: { key: 'ctrl+s', handler },
			})

			// Simulate keyboard event
			const event = new KeyboardEvent('keydown', {
				key: 's',
				ctrlKey: true,
			})
			document.dispatchEvent(event)

			expect(handler).toHaveBeenCalled()
		})

		it('should support key aliases', () => {
			const handler = vi.fn()
			useHotkey({
				hotkey: { key: 'esc', handler },
			})

			const event = new KeyboardEvent('keydown', {
				key: 'Escape',
			})
			document.dispatchEvent(event)

			expect(handler).toHaveBeenCalled()
		})

		it('should respect disabled state', () => {
			const handler = vi.fn()
			const disabled = ref(true)
			const { add: addHotkey } = useHotkey()

			addHotkey({ key: 'ctrl+a', handler, disabled })

			const event = new KeyboardEvent('keydown', {
				key: 'a',
				ctrlKey: true,
			})
			document.dispatchEvent(event)

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('multiple hotkeys', () => {
		it('should support multiple hotkeys via hotkeys array', () => {
			const handler1 = vi.fn()
			const handler2 = vi.fn()

			useHotkey({
				hotkeys: [
					{ key: 'ctrl+s', handler: handler1 },
					{ key: 'ctrl+z', handler: handler2 },
				],
			})

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true }))
			expect(handler1).toHaveBeenCalled()

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }))
			expect(handler2).toHaveBeenCalled()
		})
	})

	describe('modifier keys', () => {
		it('should handle alt modifier', () => {
			const handler = vi.fn()
			useHotkey({
				hotkey: { key: 'alt+a', handler },
			})

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', altKey: true }))
			expect(handler).toHaveBeenCalled()
		})

		it('should handle shift modifier', () => {
			const handler = vi.fn()
			useHotkey({
				hotkey: { key: 'shift+b', handler },
			})

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', shiftKey: true }))
			expect(handler).toHaveBeenCalled()
		})

		it('should handle multiple modifiers', () => {
			const handler = vi.fn()
			useHotkey({
				hotkey: { key: 'ctrl+alt+c', handler },
			})

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, altKey: true }))
			expect(handler).toHaveBeenCalled()
		})
	})

	describe('prevent and stop options', () => {
		it('should prevent default by default', () => {
			const handler = vi.fn()
			useHotkey({
				hotkey: { key: 'ctrl+d', handler },
			})

			const event = new KeyboardEvent('keydown', { key: 'd', ctrlKey: true, cancelable: true })
			const preventSpy = vi.spyOn(event, 'preventDefault')

			document.dispatchEvent(event)

			expect(preventSpy).toHaveBeenCalled()
		})

		it('should stop propagation when stop is true', () => {
			const handler = vi.fn()
			useHotkey({
				hotkey: { key: 'ctrl+e', handler, stop: true },
			})

			const event = new KeyboardEvent('keydown', { key: 'e', ctrlKey: true })
			const stopSpy = vi.spyOn(event, 'stopPropagation')

			document.dispatchEvent(event)

			expect(stopSpy).toHaveBeenCalled()
		})
	})

	describe('keyup option', () => {
		it('should trigger on keyup when keyup is true', () => {
			const handler = vi.fn()
			useHotkey({
				hotkey: { key: 'ctrl+f', handler, keyup: true },
			})

			document.dispatchEvent(new KeyboardEvent('keyup', { key: 'f', ctrlKey: true }))
			expect(handler).toHaveBeenCalled()
		})
	})

	describe('enabled option', () => {
		it('should not trigger when globally disabled', () => {
			const handler = vi.fn()
			const { disable } = useHotkey({
				hotkey: { key: 'ctrl+g', handler },
			})

			disable()

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g', ctrlKey: true }))
			expect(handler).not.toHaveBeenCalled()
		})

		it('should start disabled when enabled option is false', () => {
			const handler = vi.fn()
			const { enabled } = useHotkey({
				hotkey: { key: 'ctrl+h', handler },
				enabled: false,
			})

			expect(enabled.value).toBe(false)
		})
	})

	describe('dynamic hotkey management', () => {
		it('should add hotkeys dynamically', () => {
			const handler = vi.fn()
			const { add } = useHotkey()

			add({ key: 'ctrl+i', handler })

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'i', ctrlKey: true }))
			expect(handler).toHaveBeenCalled()
		})

		it('should clear all hotkeys', () => {
			const handler1 = vi.fn()
			const handler2 = vi.fn()
			const { add, clear } = useHotkey()

			add({ key: 'ctrl+j', handler: handler1 })
			add({ key: 'ctrl+k', handler: handler2 })
			clear()

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', ctrlKey: true }))
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
			expect(handler1).not.toHaveBeenCalled()
			expect(handler2).not.toHaveBeenCalled()
		})
	})

	describe('key aliases', () => {
		it('should support space alias', () => {
			const handler = vi.fn()
			useHotkey({ hotkey: { key: 'space', handler } })

			document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
			expect(handler).toHaveBeenCalled()
		})

		it('should support arrow key aliases', () => {
			const handler = vi.fn()
			useHotkey({ hotkey: { key: 'up', handler } })

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
			expect(handler).toHaveBeenCalled()
		})

		it('should support enter alias', () => {
			const handler = vi.fn()
			useHotkey({ hotkey: { key: 'enter', handler } })

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
			expect(handler).toHaveBeenCalled()
		})

		it('should support tab alias', () => {
			const handler = vi.fn()
			useHotkey({ hotkey: { key: 'tab', handler } })

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
			expect(handler).toHaveBeenCalled()
		})

		it('should support backspace alias', () => {
			const handler = vi.fn()
			useHotkey({ hotkey: { key: 'backspace', handler } })

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }))
			expect(handler).toHaveBeenCalled()
		})

		it('should support delete alias', () => {
			const handler = vi.fn()
			useHotkey({ hotkey: { key: 'delete', handler } })

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }))
			expect(handler).toHaveBeenCalled()
		})

		it('should support pageup/pagedown aliases', () => {
			const handlerUp = vi.fn()
			const handlerDown = vi.fn()

			useHotkey({
				hotkeys: [
					{ key: 'pageup', handler: handlerUp },
					{ key: 'pagedown', handler: handlerDown },
				],
			})

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp' }))
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown' }))

			expect(handlerUp).toHaveBeenCalled()
			expect(handlerDown).toHaveBeenCalled()
		})

		it('should support home/end aliases', () => {
			const handlerHome = vi.fn()
			const handlerEnd = vi.fn()

			useHotkey({
				hotkeys: [
					{ key: 'home', handler: handlerHome },
					{ key: 'end', handler: handlerEnd },
				],
			})

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }))
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }))

			expect(handlerHome).toHaveBeenCalled()
			expect(handlerEnd).toHaveBeenCalled()
		})
	})

	describe('case insensitivity', () => {
		it('should match keys case-insensitively', () => {
			const handler = vi.fn()
			useHotkey({ hotkey: { key: 'ctrl+L', handler } })

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', ctrlKey: true }))
			expect(handler).toHaveBeenCalled()
		})
	})
})
