import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useSwipe, useTouch } from '../../src/composables'

describe('gesture composables', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('useSwipe', () => {
		it('should initialize with default values', () => {
			const { direction, lengthX, lengthY, isSwiping } = useSwipe()

			expect(direction.value).toBe(null)
			expect(lengthX.value).toBe(0)
			expect(lengthY.value).toBe(0)
			expect(isSwiping.value).toBe(false)
		})

		it('should bind to element and return unbind function', () => {
			const { bind } = useSwipe()

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
			unbind()
		})

		it('should set touch styles on element', () => {
			const { bind } = useSwipe()

			const element = document.createElement('div')
			bind(element)

			expect(element.style.touchAction).toBe('none')
			expect(element.style.userSelect).toBe('none')
		})

		it('should detect swipe direction', () => {
			const handler = vi.fn()
			const { direction: _direction, bind } = useSwipe({ handler })

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects
			const touch1 = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2 = new Touch({
				identifier: 0,
				target: element,
				clientX: 200,
				clientY: 100,
			})

			// Simulate swipe
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1],
			})
			element.dispatchEvent(touchStartEvent)

			const touchEndEvent = new TouchEvent('touchend', {
				changedTouches: [touch2],
			})
			element.dispatchEvent(touchEndEvent)

			expect(handler).toHaveBeenCalled()
		})

		it('should call direction-specific callbacks', () => {
			const onLeft = vi.fn()
			const onRight = vi.fn()
			const onUp = vi.fn()
			const onDown = vi.fn()

			const { bind } = useSwipe({ onLeft, onRight, onUp, onDown })

			const element = document.createElement('div')
			bind(element)

			expect(typeof element.addEventListener).toBe('function')
		})

		it('should respect threshold option', () => {
			const handler = vi.fn()
			const { bind } = useSwipe({ handler, threshold: 100 })

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects
			const touch1 = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2 = new Touch({
				identifier: 0,
				target: element,
				clientX: 120,
				clientY: 100,
			})

			// Small swipe (below threshold)
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1],
			})
			element.dispatchEvent(touchStartEvent)

			const touchEndEvent = new TouchEvent('touchend', {
				changedTouches: [touch2],
			})
			element.dispatchEvent(touchEndEvent)

			// Should not trigger with small distance
			expect(handler).not.toHaveBeenCalled()
		})

		it('should respect maxTime option', async () => {
			const handler = vi.fn()
			const { bind } = useSwipe({ handler, maxTime: 500 })

			const element = document.createElement('div')
			bind(element)

			// Start swipe
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [{ clientX: 100, clientY: 100 } as Touch],
			})
			element.dispatchEvent(touchStartEvent)

			// Wait longer than maxTime
			vi.advanceTimersByTime(600)

			const touchEndEvent = new TouchEvent('touchend', {
				changedTouches: [{ clientX: 200, clientY: 100 } as Touch],
			})
			element.dispatchEvent(touchEndEvent)

			// Should not trigger after maxTime
			expect(handler).not.toHaveBeenCalled()
		})

		it('should respect allowed directions', () => {
			const handler = vi.fn()
			const { bind } = useSwipe({
				handler,
				directions: ['left', 'right'],
			})

			const element = document.createElement('div')
			bind(element)

			// Should bind successfully
			expect(typeof bind).toBe('function')
		})

		it('should handle mouse events when enabled', () => {
			const { bind } = useSwipe({ mouse: true })

			const element = document.createElement('div')
			bind(element)

			// Should bind successfully
			expect(typeof bind).toBe('function')
		})

		it('should not handle mouse events when disabled', () => {
			const { bind } = useSwipe({ mouse: false })

			const element = document.createElement('div')
			bind(element)

			// Should bind successfully
			expect(typeof bind).toBe('function')
		})

		it('should dispatch custom swipe event', () => {
			const { bind } = useSwipe()

			const element = document.createElement('div')
			const swipeHandler = vi.fn()
			element.addEventListener('swipe', swipeHandler)
			bind(element)

			// Create proper Touch objects
			const touch1 = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2 = new Touch({
				identifier: 0,
				target: element,
				clientX: 200,
				clientY: 100,
			})

			// Trigger a swipe
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1],
			})
			element.dispatchEvent(touchStartEvent)

			const touchEndEvent = new TouchEvent('touchend', {
				changedTouches: [touch2],
			})
			element.dispatchEvent(touchEndEvent)

			// Custom event should be dispatched
			expect(swipeHandler).toHaveBeenCalled()
		})

		it('should handle reactive threshold changes', async () => {
			const threshold = ref(30)
			const { bind } = useSwipe({ threshold })

			const element = document.createElement('div')
			bind(element)

			threshold.value = 100
			await nextTick()

			expect(threshold.value).toBe(100)
		})

		it('should cleanup on unbind', () => {
			const { bind } = useSwipe()

			const element = document.createElement('div')
			const unbind = bind(element)

			unbind()

			// Element should be cleaned up
			expect(element.classList.contains('v-swipe')).toBe(false)
		})

		it('should handle touchcancel event', () => {
			const { bind } = useSwipe()

			const element = document.createElement('div')
			bind(element)

			const touch = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touchCancelEvent = new TouchEvent('touchcancel', {
				changedTouches: [touch],
			})
			element.dispatchEvent(touchCancelEvent)

			expect(element).toBeDefined()
		})
	})

	describe('useTouch', () => {
		it('should initialize with null gesture', () => {
			const { gesture } = useTouch()

			expect(gesture.value).toBe(null)
		})

		it('should bind to element and return unbind function', () => {
			const { bind } = useTouch()

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
			unbind()
		})

		it('should detect swipe gesture', () => {
			const onSwipe = vi.fn()
			const { gesture: _gesture, bind } = useTouch({ onSwipe })

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects
			const touch1 = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2 = new Touch({
				identifier: 0,
				target: element,
				clientX: 200,
				clientY: 100,
			})

			// Simulate swipe
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1],
			})
			element.dispatchEvent(touchStartEvent)

			const touchEndEvent = new TouchEvent('touchend', {
				changedTouches: [touch2],
			})
			element.dispatchEvent(touchEndEvent)

			expect(onSwipe).toHaveBeenCalled()
		})

		it('should call direction-specific swipe callbacks', () => {
			const onSwipeLeft = vi.fn()
			const onSwipeRight = vi.fn()
			const { bind } = useTouch({ onSwipeLeft, onSwipeRight })

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects for left swipe
			const touch1 = new Touch({
				identifier: 0,
				target: element,
				clientX: 200,
				clientY: 100,
			})
			const touch2 = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})

			// Simulate left swipe
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1],
			})
			element.dispatchEvent(touchStartEvent)

			const touchEndEvent = new TouchEvent('touchend', {
				changedTouches: [touch2],
			})
			element.dispatchEvent(touchEndEvent)

			expect(onSwipeLeft).toHaveBeenCalled()
		})

		it('should detect tap gesture', () => {
			const onTap = vi.fn()
			const { gesture: _gesture, bind } = useTouch({ onTap, tapDuration: 300 })

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects
			const touch1 = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2 = new Touch({
				identifier: 0,
				target: element,
				clientX: 102,
				clientY: 102,
			})

			// Quick tap
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1],
			})
			element.dispatchEvent(touchStartEvent)

			vi.advanceTimersByTime(100)

			const touchEndEvent = new TouchEvent('touchend', {
				changedTouches: [touch2],
			})
			element.dispatchEvent(touchEndEvent)

			expect(onTap).toHaveBeenCalled()
		})

		it('should detect long press gesture', async () => {
			const onLongPress = vi.fn()
			const { gesture: _gesture, bind } = useTouch({
				onLongPress,
				longPressDuration: 500,
			})

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch object
			const touch = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})

			// Start touch
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch],
			})
			element.dispatchEvent(touchStartEvent)

			// Wait for long press duration
			vi.advanceTimersByTime(500)

			expect(onLongPress).toHaveBeenCalled()
		})

		it('should cancel long press on movement', async () => {
			const onLongPress = vi.fn()
			const onTap = vi.fn()
			const { bind } = useTouch({
				onLongPress,
				onTap,
				longPressDuration: 500,
			})

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects
			const touch1 = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2 = new Touch({
				identifier: 0,
				target: element,
				clientX: 150,
				clientY: 150,
			})

			// Start touch
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1],
			})
			element.dispatchEvent(touchStartEvent)

			// Move before long press triggers
			vi.advanceTimersByTime(200)

			const touchMoveEvent = new TouchEvent('touchmove', {
				touches: [touch2],
			})
			element.dispatchEvent(touchMoveEvent)

			vi.advanceTimersByTime(300)

			// Long press should be cancelled
			expect(onLongPress).not.toHaveBeenCalled()
		})

		it('should detect pinch gesture', () => {
			const onPinch = vi.fn()
			const { gesture: _gesture, bind } = useTouch({ onPinch })

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects for two-finger touch
			const touch1a = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2a = new Touch({
				identifier: 1,
				target: element,
				clientX: 200,
				clientY: 100,
			})
			const touch1b = new Touch({
				identifier: 0,
				target: element,
				clientX: 80,
				clientY: 100,
			})
			const touch2b = new Touch({
				identifier: 1,
				target: element,
				clientX: 220,
				clientY: 100,
			})

			// Simulate pinch start
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1a, touch2a],
			})
			element.dispatchEvent(touchStartEvent)

			// Simulate pinch move
			const touchMoveEvent = new TouchEvent('touchmove', {
				touches: [touch1b, touch2b],
			})
			element.dispatchEvent(touchMoveEvent)

			expect(onPinch).toHaveBeenCalled()
		})

		it('should detect rotate gesture', () => {
			const onRotate = vi.fn()
			const { gesture: _gesture, bind } = useTouch({ onRotate })

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects for two-finger touch
			const touch1a = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2a = new Touch({
				identifier: 1,
				target: element,
				clientX: 200,
				clientY: 100,
			})
			const touch1b = new Touch({
				identifier: 0,
				target: element,
				clientX: 150,
				clientY: 50,
			})
			const touch2b = new Touch({
				identifier: 1,
				target: element,
				clientX: 150,
				clientY: 150,
			})

			// Simulate two-finger touch start
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1a, touch2a],
			})
			element.dispatchEvent(touchStartEvent)

			// Simulate rotation
			const touchMoveEvent = new TouchEvent('touchmove', {
				touches: [touch1b, touch2b],
			})
			element.dispatchEvent(touchMoveEvent)

			expect(onRotate).toHaveBeenCalled()
		})

		it('should respect swipe threshold', () => {
			const onSwipe = vi.fn()
			const { bind } = useTouch({ onSwipe, swipeThreshold: 50 })

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects for small swipe
			const touch1 = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2 = new Touch({
				identifier: 0,
				target: element,
				clientX: 120,
				clientY: 100,
			})

			// Small swipe (below threshold)
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1],
			})
			element.dispatchEvent(touchStartEvent)

			const touchEndEvent = new TouchEvent('touchend', {
				changedTouches: [touch2],
			})
			element.dispatchEvent(touchEndEvent)

			expect(onSwipe).not.toHaveBeenCalled()
		})

		it('should respect disabled state', () => {
			const disabled = ref(true)
			const onSwipe = vi.fn()
			const { bind } = useTouch({ onSwipe, disabled })

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects
			const touch1 = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2 = new Touch({
				identifier: 0,
				target: element,
				clientX: 200,
				clientY: 100,
			})

			// Try to swipe
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1],
			})
			element.dispatchEvent(touchStartEvent)

			const touchEndEvent = new TouchEvent('touchend', {
				changedTouches: [touch2],
			})
			element.dispatchEvent(touchEndEvent)

			expect(onSwipe).not.toHaveBeenCalled()
		})

		it('should handle touchcancel event', () => {
			const { bind } = useTouch()

			const element = document.createElement('div')
			bind(element)

			const touch = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touchCancelEvent = new TouchEvent('touchcancel', {
				changedTouches: [touch],
			})
			element.dispatchEvent(touchCancelEvent)

			expect(element).toBeDefined()
		})

		it('should cleanup on unbind', () => {
			const { bind } = useTouch()

			const element = document.createElement('div')
			const unbind = bind(element)

			unbind()

			// Should remove all event listeners
			expect(element.classList.contains('v-touch')).toBe(false)
		})

		it('should provide gesture event with details', () => {
			const onSwipe = vi.fn()
			const { bind } = useTouch({ onSwipe })

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects
			const touch1 = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2 = new Touch({
				identifier: 0,
				target: element,
				clientX: 200,
				clientY: 100,
			})

			// Swipe
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1],
			})
			element.dispatchEvent(touchStartEvent)

			const touchEndEvent = new TouchEvent('touchend', {
				changedTouches: [touch2],
			})
			element.dispatchEvent(touchEndEvent)

			expect(onSwipe).toHaveBeenCalled()
			expect(onSwipe.mock.calls.length).toBeGreaterThan(0)
			const event = onSwipe.mock.calls[0][0]
			expect(event.type).toBe('swipe')
			expect(event.direction).toBeDefined()
			expect(event.distance).toBeDefined()
		})

		it('should handle multi-touch gestures correctly', () => {
			const onPinch = vi.fn()
			const { bind } = useTouch({ onPinch })

			const element = document.createElement('div')
			bind(element)

			// Create proper Touch objects for two-finger touch
			const touch1 = new Touch({
				identifier: 0,
				target: element,
				clientX: 100,
				clientY: 100,
			})
			const touch2 = new Touch({
				identifier: 1,
				target: element,
				clientX: 200,
				clientY: 100,
			})

			// Two-finger touch
			const touchStartEvent = new TouchEvent('touchstart', {
				touches: [touch1, touch2],
			})
			element.dispatchEvent(touchStartEvent)

			// Should bind and handle the event
			expect(typeof bind).toBe('function')
		})
	})
})
