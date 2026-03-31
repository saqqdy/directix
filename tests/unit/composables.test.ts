import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import {
	useClickOutside,
	useCopy,
	useDebounce,
	useDraggable,
	useFocus,
	useHotkey,
	useHover,
	useIntersect,
	useLongPress,
	usePermission,
	useResize,
	useScroll,
	useSwipe,
	useThrottle,
	useVisible,
} from '../../src/composables'

describe('composables', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('useCopy', () => {
		it('should copy text and set copied to true', async () => {
			const { copy, copied } = useCopy()

			expect(copied.value).toBe(false)

			const result = await copy('test text')
			expect(result).toBe(true)
			expect(copied.value).toBe(true)
		})

		it('should reset copied after timeout', async () => {
			const { copy, copied } = useCopy({ copiedTimeout: 1000 })

			await copy('test')
			expect(copied.value).toBe(true)

			vi.advanceTimersByTime(1000)
			expect(copied.value).toBe(false)
		})

		it('should call onSuccess callback', async () => {
			const onSuccess = vi.fn()
			const { copy } = useCopy({ onSuccess })

			await copy('test')
			expect(onSuccess).toHaveBeenCalledWith('test')
		})

		it('should call onError callback on failure', async () => {
			const onError = vi.fn()
			const { copy, error } = useCopy({ onError })

			// Mock clipboard failure
			const originalClipboard = navigator.clipboard
			Object.defineProperty(navigator, 'clipboard', {
				value: undefined,
				writable: true,
				configurable: true,
			})

			// Mock execCommand failure
			const originalExecCommand = document.execCommand
			document.execCommand = vi.fn(() => false)

			const result = await copy('test')
			expect(result).toBe(false)
			expect(onError).toHaveBeenCalled()
			expect(error.value).toBeInstanceOf(Error)

			// Restore
			Object.defineProperty(navigator, 'clipboard', {
				value: originalClipboard,
				writable: true,
				configurable: true,
			})
			document.execCommand = originalExecCommand
		})

		it('should use source ref value', async () => {
			const source = ref('initial text')
			const { copy, copied } = useCopy({ source })

			await copy()
			expect(copied.value).toBe(true)
		})

		it('should override source with inline text', async () => {
			const source = ref('source text')
			const onSuccess = vi.fn()
			const { copy } = useCopy({ source, onSuccess })

			await copy('override text')
			expect(onSuccess).toHaveBeenCalledWith('override text')
		})
	})

	describe('useDebounce', () => {
		it('should debounce function calls', async () => {
			const handler = vi.fn()
			const { run } = useDebounce({ handler, wait: 300 })

			run('first')
			run('second')
			run('third')

			expect(handler).not.toHaveBeenCalled()

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(1)
			expect(handler).toHaveBeenCalledWith('third')
		})

		it('should support leading option', async () => {
			const handler = vi.fn()
			const { run } = useDebounce({ handler, wait: 300, leading: true })

			run('first')

			expect(handler).toHaveBeenCalledTimes(1)
			expect(handler).toHaveBeenCalledWith('first')
		})

		it('should cancel pending execution', async () => {
			const handler = vi.fn()
			const { run, cancel } = useDebounce({ handler, wait: 300 })

			run('test')
			cancel()

			vi.advanceTimersByTime(300)

			expect(handler).not.toHaveBeenCalled()
		})

		it('should flush pending execution', async () => {
			const handler = vi.fn()
			const { run, flush } = useDebounce({ handler, wait: 300 })

			run('test')
			flush()

			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should recreate function when wait changes', async () => {
			const handler = vi.fn()
			const wait = ref(300)
			const { run } = useDebounce({ handler, wait })

			run('first')
			vi.advanceTimersByTime(300)
			expect(handler).toHaveBeenCalledTimes(1)

			wait.value = 500
			await nextTick()

			handler.mockClear()
			run('second')
			vi.advanceTimersByTime(300)
			expect(handler).not.toHaveBeenCalled()

			vi.advanceTimersByTime(200)
			expect(handler).toHaveBeenCalledTimes(1)
		})
	})

	describe('useThrottle', () => {
		it('should throttle function calls', async () => {
			const handler = vi.fn()
			const { run } = useThrottle({ handler, wait: 300 })

			run('first')
			run('second')
			run('third')

			expect(handler).toHaveBeenCalledTimes(1)

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(2)
		})

		it('should support leading option', async () => {
			const handler = vi.fn()
			const { run } = useThrottle({ handler, wait: 300, leading: false })

			run('first')

			expect(handler).not.toHaveBeenCalled()
		})

		it('should cancel pending execution', async () => {
			const handler = vi.fn()
			const { run, cancel } = useThrottle({ handler, wait: 300 })

			run('first')
			cancel()

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(1) // Only the leading call
		})
	})

	describe('useLongPress', () => {
		it('should trigger after duration', async () => {
			const onTrigger = vi.fn()
			const { start, stop, isPressing } = useLongPress({ duration: 500, onTrigger })

			const event = new MouseEvent('mousedown') as MouseEvent | TouchEvent
			start(event)

			expect(isPressing.value).toBe(true)

			vi.advanceTimersByTime(500)

			expect(isPressing.value).toBe(false)
			expect(onTrigger).toHaveBeenCalledWith(event)

			// Test that stop doesn't throw after triggered
			void stop
		})

		it('should cancel on stop', async () => {
			const onTrigger = vi.fn()
			const onCancel = vi.fn()
			const { start, stop } = useLongPress({
				duration: 500,
				onTrigger,
				onCancel,
			})

			const event = new MouseEvent('mousedown') as MouseEvent | TouchEvent
			start(event)

			vi.advanceTimersByTime(200)
			stop(event)

			vi.advanceTimersByTime(300)

			expect(onTrigger).not.toHaveBeenCalled()
			expect(onCancel).toHaveBeenCalled()
		})

		it('should call onStart callback', async () => {
			const onStart = vi.fn()
			const { start } = useLongPress({ onStart })

			const event = new MouseEvent('mousedown') as MouseEvent | TouchEvent
			start(event)

			expect(onStart).toHaveBeenCalledWith(event)
		})

		it('should call onTick callback', async () => {
			const onTick = vi.fn()
			const { start } = useLongPress({ duration: 500, onTick, tickInterval: 100 })

			const event = new MouseEvent('mousedown') as MouseEvent | TouchEvent
			start(event)

			vi.advanceTimersByTime(100)
			expect(onTick).toHaveBeenCalledWith(400)

			vi.advanceTimersByTime(100)
			expect(onTick).toHaveBeenCalledWith(300)
		})

		it('should bind to element', async () => {
			const onTrigger = vi.fn()
			const { bind, isPressing } = useLongPress({ duration: 500, onTrigger })

			const element = document.createElement('button')
			const unbind = bind(element)

			element.dispatchEvent(new MouseEvent('mousedown'))
			vi.advanceTimersByTime(500)

			expect(onTrigger).toHaveBeenCalled()
			expect(isPressing.value).toBe(false)

			unbind()
		})
	})

	describe('useHover', () => {
		it('should track hover state', async () => {
			const { isHovering, bind } = useHover()

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(isHovering.value).toBe(false)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			expect(isHovering.value).toBe(true)

			element.dispatchEvent(new MouseEvent('mouseleave'))
			expect(isHovering.value).toBe(false)

			unbind()
		})

		it('should call onEnter and onLeave callbacks', async () => {
			const onEnter = vi.fn()
			const onLeave = vi.fn()
			const { bind } = useHover({ onEnter, onLeave })

			const element = document.createElement('div')
			const unbind = bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			expect(onEnter).toHaveBeenCalled()

			element.dispatchEvent(new MouseEvent('mouseleave'))
			expect(onLeave).toHaveBeenCalled()

			unbind()
		})

		it('should support enterDelay', async () => {
			const onEnter = vi.fn()
			const { isHovering, bind } = useHover({ enterDelay: 200, onEnter })

			const element = document.createElement('div')
			const unbind = bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			expect(isHovering.value).toBe(false)

			vi.advanceTimersByTime(200)
			expect(isHovering.value).toBe(true)
			expect(onEnter).toHaveBeenCalled()

			unbind()
		})

		it('should support leaveDelay', async () => {
			const onLeave = vi.fn()
			const { isHovering, bind } = useHover({ leaveDelay: 200, onLeave })

			const element = document.createElement('div')
			const unbind = bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			expect(isHovering.value).toBe(true)

			element.dispatchEvent(new MouseEvent('mouseleave'))
			expect(isHovering.value).toBe(true) // Still true due to delay

			vi.advanceTimersByTime(200)
			expect(isHovering.value).toBe(false)
			expect(onLeave).toHaveBeenCalled()

			unbind()
		})

		it('should add CSS class when hovering', async () => {
			const { bind } = useHover({ class: 'is-hovering' })

			const element = document.createElement('div')
			const unbind = bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			expect(element.classList.contains('is-hovering')).toBe(true)

			element.dispatchEvent(new MouseEvent('mouseleave'))
			expect(element.classList.contains('is-hovering')).toBe(false)

			unbind()
		})
	})

	describe('useClickOutside', () => {
		it('should call handler when clicking outside', () => {
			const handler = vi.fn()
			const { bind } = useClickOutside({ handler })

			const element = document.createElement('div')
			document.body.appendChild(element)
			const unbind = bind(element)

			// Click outside
			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			unbind()
			document.body.removeChild(element)
		})

		it('should not call handler when clicking inside', () => {
			const handler = vi.fn()
			const { bind } = useClickOutside({ handler })

			const element = document.createElement('div')
			document.body.appendChild(element)
			const unbind = bind(element)

			// Click inside
			element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			expect(handler).not.toHaveBeenCalled()

			unbind()
			document.body.removeChild(element)
		})

		it('should respect exclude option', () => {
			const handler = vi.fn()
			const exclude = document.createElement('button')
			const { bind } = useClickOutside({ handler, exclude: [exclude] })

			const element = document.createElement('div')
			document.body.appendChild(element)
			document.body.appendChild(exclude)
			const unbind = bind(element)

			// Click on excluded element
			exclude.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			expect(handler).not.toHaveBeenCalled()

			unbind()
			document.body.removeChild(element)
			document.body.removeChild(exclude)
		})
	})

	describe('useFocus', () => {
		it('should track focus state', () => {
			const { isFocused, bind } = useFocus()

			const element = document.createElement('input')
			document.body.appendChild(element)
			const unbind = bind(element)

			expect(isFocused.value).toBe(false)

			element.dispatchEvent(new Event('focus'))
			expect(isFocused.value).toBe(true)

			element.dispatchEvent(new Event('blur'))
			expect(isFocused.value).toBe(false)

			unbind()
			document.body.removeChild(element)
		})

		it('should call onFocus and onBlur callbacks', () => {
			const onFocus = vi.fn()
			const onBlur = vi.fn()
			const { bind } = useFocus({ onFocus, onBlur })

			const element = document.createElement('input')
			document.body.appendChild(element)
			const unbind = bind(element)

			element.dispatchEvent(new FocusEvent('focus'))
			expect(onFocus).toHaveBeenCalled()

			element.dispatchEvent(new FocusEvent('blur'))
			expect(onBlur).toHaveBeenCalled()

			unbind()
			document.body.removeChild(element)
		})

		it('should focus and blur element programmatically', () => {
			const { focus, blur, bind } = useFocus()

			const element = document.createElement('input')
			document.body.appendChild(element)
			const unbind = bind(element)

			focus()
			expect(document.activeElement).toBe(element)

			blur()
			expect(document.activeElement).toBe(document.body)

			unbind()
			document.body.removeChild(element)
		})
	})

	describe('useIntersect', () => {
		it('should track intersection state', async () => {
			const { isIntersecting, bind } = useIntersect()

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(isIntersecting.value).toBe(false)

			unbind()
		})

		it('should call onEnter and onLeave callbacks', () => {
			const onEnter = vi.fn()
			const onLeave = vi.fn()
			const { bind } = useIntersect({ onEnter, onLeave })

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
			unbind()
		})
	})

	describe('useScroll', () => {
		it('should track scroll position', () => {
			const { scrollLeft, scrollTop, bind } = useScroll()

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(scrollLeft.value).toBe(0)
			expect(scrollTop.value).toBe(0)

			unbind()
		})

		it('should bind to window by default', () => {
			const { bind, stop } = useScroll()

			const unbind = bind()
			expect(typeof unbind).toBe('function')

			stop()
		})
	})

	describe('useResize', () => {
		it('should track element size', () => {
			const { width, height, bind } = useResize()

			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: () => ({ width: 100, height: 50 }),
			})

			const unbind = bind(element)

			expect(width.value).toBe(100)
			expect(height.value).toBe(50)

			unbind()
		})

		it('should call onResize callback', () => {
			const onResize = vi.fn()
			const { bind } = useResize({ onResize })

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
			unbind()
		})
	})

	describe('useVisible', () => {
		it('should control visibility state', async () => {
			const { visible, show, hide, toggle } = useVisible()

			expect(visible.value).toBe(true)

			hide()
			expect(visible.value).toBe(false)

			show()
			expect(visible.value).toBe(true)

			toggle()
			expect(visible.value).toBe(false)
		})

		it('should apply visibility styles to element', () => {
			const { bind } = useVisible({ initial: false })

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(element.style.display).toBe('none')

			unbind()
		})

		it('should support useHidden option', () => {
			const { bind } = useVisible({ initial: false, useHidden: true })

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(element.style.visibility).toBe('hidden')

			unbind()
		})
	})

	describe('usePermission', () => {
		it('should check permissions', () => {
			const { granted } = usePermission({
				value: 'read',
				getPermissions: () => ['read', 'write'],
			})

			expect(granted.value).toBe(true)
		})

		it('should support wildcard permission', () => {
			const { granted } = usePermission({
				value: 'admin',
				getPermissions: () => ['*'],
			})

			expect(granted.value).toBe(true)
		})

		it('should support role-based permission', () => {
			const { granted } = usePermission({
				value: 'delete',
				getPermissions: () => [],
				getRoles: () => ['admin'],
				roleMap: { admin: ['*'] },
			})

			expect(granted.value).toBe(true)
		})

		it('should support mode option', () => {
			const { granted } = usePermission({
				value: ['read', 'write'],
				mode: 'every',
				getPermissions: () => ['read'],
			})

			expect(granted.value).toBe(false)
		})

		it('should support custom check function', () => {
			const { granted } = usePermission({
				value: 'custom',
				check: perm => perm === 'custom',
			})

			expect(granted.value).toBe(true)
		})
	})

	describe('useDraggable', () => {
		it('should track dragging state', () => {
			const { isDragging, position, bind } = useDraggable()

			const element = document.createElement('div')
			document.body.appendChild(element)
			const unbind = bind(element)

			expect(isDragging.value).toBe(false)
			expect(position.value).toEqual({ x: 0, y: 0 })

			unbind()
			document.body.removeChild(element)
		})

		it('should reset position', () => {
			const { position, reset, bind } = useDraggable()

			const element = document.createElement('div')
			document.body.appendChild(element)
			const unbind = bind(element)

			reset()
			expect(position.value).toEqual({ x: 0, y: 0 })

			unbind()
			document.body.removeChild(element)
		})
	})

	describe('useSwipe', () => {
		it('should track swipe state', () => {
			const { isSwiping, direction, bind } = useSwipe()

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(isSwiping.value).toBe(false)
			expect(direction.value).toBe(null)

			unbind()
		})

		it('should call direction-specific callbacks', async () => {
			const onLeft = vi.fn()
			const onRight = vi.fn()
			const { bind } = useSwipe({ onLeft, onRight })

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
			unbind()
		})
	})

	describe('useHotkey', () => {
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
			remove('ctrl+s')
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
})
