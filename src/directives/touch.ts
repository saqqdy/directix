import { defineDirective } from '@directix/core'

/**
 * Swipe direction
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down'

/**
 * Touch gesture options
 */
export interface TouchOptions {
	/** Minimum swipe distance in pixels @default 30 */
	swipeThreshold?: number
	/** Maximum time for a swipe in milliseconds @default 500 */
	swipeTimeout?: number
	/** Minimum pinch scale change @default 0.1 */
	pinchThreshold?: number
	/** Enable swipe detection @default true */
	enableSwipe?: boolean
	/** Enable pinch detection @default true */
	enablePinch?: boolean
	/** Enable rotate detection @default true */
	enableRotate?: boolean
	/** Enable tap detection @default true */
	enableTap?: boolean
	/** Maximum time for a tap in milliseconds @default 250 */
	tapTimeout?: number
	/** Maximum movement for a tap in pixels @default 10 */
	tapThreshold?: number
	/** Enable long press detection @default true */
	enableLongPress?: boolean
	/** Long press timeout in milliseconds @default 500 */
	longPressTimeout?: number
	/** Enable mouse event simulation for desktop @default true */
	enableMouse?: boolean

	onSwipe?: (direction: SwipeDirection, event: TouchEvent | MouseEvent) => void
	onSwipeLeft?: (event: TouchEvent | MouseEvent) => void
	onSwipeRight?: (event: TouchEvent | MouseEvent) => void
	onSwipeUp?: (event: TouchEvent | MouseEvent) => void
	onSwipeDown?: (event: TouchEvent | MouseEvent) => void
	onPinch?: (scale: number, event: TouchEvent) => void
	onRotate?: (angle: number, event: TouchEvent) => void
	onTap?: (event: TouchEvent | MouseEvent) => void
	onLongPress?: (event: TouchEvent | MouseEvent) => void
	onTouchStart?: (event: TouchEvent | MouseEvent) => void
	onTouchMove?: (event: TouchEvent | MouseEvent) => void
	onTouchEnd?: (event: TouchEvent | MouseEvent) => void
}

interface TouchState {
	options: TouchOptions
	startX: number
	startY: number
	startTime: number
	startDistance: number
	startAngle: number
	lastScale: number
	lastAngle: number
	longPressTimer: ReturnType<typeof setTimeout> | null
	isLongPress: boolean
	isMouseDown: boolean
	lastTouchEndTime: number
	handlers: {
		touchStart: (e: TouchEvent) => void
		touchMove: (e: TouchEvent) => void
		touchEnd: (e: TouchEvent) => void
		mouseDown?: (e: MouseEvent) => void
		mouseMove?: (e: MouseEvent) => void
		mouseUp?: (e: MouseEvent) => void
	}
}

const getDistance = (x1: number, y1: number, x2: number, y2: number): number =>
	Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

const getAngle = (x1: number, y1: number, x2: number, y2: number): number =>
	(Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI

const MOUSE_IGNORE_DURATION = 400

export const vTouch = defineDirective<TouchOptions, HTMLElement>({
	name: 'touch',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		const state: TouchState = {
			options,
			startX: 0,
			startY: 0,
			startTime: 0,
			startDistance: 0,
			startAngle: 0,
			lastScale: 1,
			lastAngle: 0,
			longPressTimer: null,
			isLongPress: false,
			isMouseDown: false,
			lastTouchEndTime: 0,
			handlers: { touchStart: () => {}, touchMove: () => {}, touchEnd: () => {} },
		}

		;(el as any).__touch = state

		const clearLongPressTimer = () => {
			if (state.longPressTimer) {
				clearTimeout(state.longPressTimer)
				state.longPressTimer = null
			}
		}

		const startLongPressTimer = (event: TouchEvent | MouseEvent) => {
			clearLongPressTimer()
			if (state.options.enableLongPress && state.options.onLongPress) {
				state.longPressTimer = setTimeout(() => {
					state.isLongPress = true
					state.options.onLongPress!(event)
				}, state.options.longPressTimeout || 500)
			}
		}

		const exceedsThreshold = (x: number, y: number): boolean => {
			const threshold = state.options.tapThreshold || 10
			return Math.abs(x - state.startX) > threshold || Math.abs(y - state.startY) > threshold
		}

		const handleGestureEnd = (endX: number, endY: number, event: TouchEvent | MouseEvent) => {
			if (state.isLongPress) return

			const duration = Date.now() - state.startTime
			const deltaX = endX - state.startX
			const deltaY = endY - state.startY
			const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

			// Swipe detection
			if (
				state.options.enableSwipe
				&& distance >= (state.options.swipeThreshold || 30)
				&& duration <= (state.options.swipeTimeout || 500)
			) {
				const direction: SwipeDirection = Math.abs(deltaX) > Math.abs(deltaY) ? (deltaX > 0 ? 'right' : 'left') : (deltaY > 0 ? 'down' : 'up')

				state.options.onSwipe?.(direction, event)
				if (direction === 'left') state.options.onSwipeLeft?.(event)
				else if (direction === 'right') state.options.onSwipeRight?.(event)
				else if (direction === 'up') state.options.onSwipeUp?.(event)
				else if (direction === 'down') state.options.onSwipeDown?.(event)
			}
			// Tap detection
			else if (
				state.options.enableTap
				&& distance < (state.options.tapThreshold || 10)
				&& duration < (state.options.tapTimeout || 250)
			) {
				state.options.onTap?.(event)
			}
		}

		// Touch handlers
		const handleTouchStart = (e: TouchEvent) => {
			// Prevent page zoom on multi-touch
			if (e.touches.length > 1) {
				e.preventDefault()
			}

			state.startTime = Date.now()
			state.isLongPress = false

			if (e.touches.length === 1) {
				state.startX = e.touches[0].clientX
				state.startY = e.touches[0].clientY
				startLongPressTimer(e)
			} else if (e.touches.length === 2) {
				clearLongPressTimer()
				const [t1, t2] = e.touches
				state.startDistance = getDistance(t1.clientX, t1.clientY, t2.clientX, t2.clientY)
				state.startAngle = getAngle(t1.clientX, t1.clientY, t2.clientX, t2.clientY)
				state.lastScale = 1
				state.lastAngle = 0
			}

			state.options.onTouchStart?.(e)
		}

		const handleTouchMove = (e: TouchEvent) => {
			// Prevent page scroll and zoom during gesture
			if (e.touches.length >= 1) {
				e.preventDefault()
			}

			if (state.longPressTimer && e.touches.length === 1 && exceedsThreshold(e.touches[0].clientX, e.touches[0].clientY)) {
				clearLongPressTimer()
			}

			if (e.touches.length === 2) {
				const [t1, t2] = e.touches
				const currentDistance = getDistance(t1.clientX, t1.clientY, t2.clientX, t2.clientY)
				const currentAngle = getAngle(t1.clientX, t1.clientY, t2.clientX, t2.clientY)

				if (state.options.enablePinch && state.options.onPinch) {
					const scale = currentDistance / state.startDistance
					if (Math.abs(scale - state.lastScale) >= (state.options.pinchThreshold || 0.1)) {
						state.options.onPinch(scale, e)
						state.lastScale = scale
					}
				}

				if (state.options.enableRotate && state.options.onRotate) {
					const angleDiff = currentAngle - state.startAngle
					if (Math.abs(angleDiff - state.lastAngle) > 5) {
						state.options.onRotate(angleDiff, e)
						state.lastAngle = angleDiff
					}
				}
			}

			state.options.onTouchMove?.(e)
		}

		const handleTouchEnd = (e: TouchEvent) => {
			clearLongPressTimer()

			if (e.touches.length === 0) {
				state.lastTouchEndTime = Date.now()
				const touch = e.changedTouches[0]
				handleGestureEnd(touch.clientX, touch.clientY, e)
			}

			state.options.onTouchEnd?.(e)
		}

		// Mouse handlers for desktop
		const handleMouseDown = (e: MouseEvent) => {
			if (!state.options.enableMouse) return
			// Ignore simulated mouse events after touch
			if (Date.now() - state.lastTouchEndTime < MOUSE_IGNORE_DURATION) return

			e.preventDefault()
			state.isMouseDown = true
			state.startTime = Date.now()
			state.startX = e.clientX
			state.startY = e.clientY
			state.isLongPress = false
			startLongPressTimer(e)

			state.options.onTouchStart?.(e)
		}

		const handleMouseMove = (e: MouseEvent) => {
			if (!state.isMouseDown || !state.options.enableMouse) return
			if (state.longPressTimer && exceedsThreshold(e.clientX, e.clientY)) {
				clearLongPressTimer()
			}
			state.options.onTouchMove?.(e)
		}

		const handleMouseUp = (e: MouseEvent) => {
			if (!state.isMouseDown || !state.options.enableMouse) return

			state.isMouseDown = false
			clearLongPressTimer()

			if (!state.isLongPress) {
				handleGestureEnd(e.clientX, e.clientY, e)
			}

			state.options.onTouchEnd?.(e)
		}

		state.handlers = { touchStart: handleTouchStart, touchMove: handleTouchMove, touchEnd: handleTouchEnd, mouseDown: handleMouseDown, mouseMove: handleMouseMove, mouseUp: handleMouseUp }

		el.addEventListener('touchstart', handleTouchStart, { passive: false })
		el.addEventListener('touchmove', handleTouchMove, { passive: false })
		el.addEventListener('touchend', handleTouchEnd)
		el.addEventListener('touchcancel', handleTouchEnd)

		if (options.enableMouse) {
			el.addEventListener('mousedown', handleMouseDown)
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		}
	},

	updated(el, binding) {
		const state = (el as any).__touch as TouchState | undefined
		if (state) state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state = (el as any).__touch as TouchState | undefined

		if (state?.longPressTimer) clearTimeout(state.longPressTimer)

		if (state?.handlers) {
			el.removeEventListener('touchstart', state.handlers.touchStart)
			el.removeEventListener('touchmove', state.handlers.touchMove)
			el.removeEventListener('touchend', state.handlers.touchEnd)
			el.removeEventListener('touchcancel', state.handlers.touchEnd)
			if (state.handlers.mouseDown) el.removeEventListener('mousedown', state.handlers.mouseDown)
			if (state.handlers.mouseMove) document.removeEventListener('mousemove', state.handlers.mouseMove)
			if (state.handlers.mouseUp) document.removeEventListener('mouseup', state.handlers.mouseUp)
		}

		delete (el as any).__touch
	},
})

function normalizeOptions(binding: TouchOptions | undefined): TouchOptions {
	return {
		swipeThreshold: binding?.swipeThreshold ?? 30,
		swipeTimeout: binding?.swipeTimeout ?? 500,
		pinchThreshold: binding?.pinchThreshold ?? 0.1,
		enableSwipe: binding?.enableSwipe ?? true,
		enablePinch: binding?.enablePinch ?? true,
		enableRotate: binding?.enableRotate ?? true,
		enableTap: binding?.enableTap ?? true,
		tapTimeout: binding?.tapTimeout ?? 250,
		tapThreshold: binding?.tapThreshold ?? 10,
		enableLongPress: binding?.enableLongPress ?? true,
		longPressTimeout: binding?.longPressTimeout ?? 500,
		enableMouse: binding?.enableMouse ?? true,
		onSwipe: binding?.onSwipe,
		onSwipeLeft: binding?.onSwipeLeft,
		onSwipeRight: binding?.onSwipeRight,
		onSwipeUp: binding?.onSwipeUp,
		onSwipeDown: binding?.onSwipeDown,
		onPinch: binding?.onPinch,
		onRotate: binding?.onRotate,
		onTap: binding?.onTap,
		onLongPress: binding?.onLongPress,
		onTouchStart: binding?.onTouchStart,
		onTouchMove: binding?.onTouchMove,
		onTouchEnd: binding?.onTouchEnd,
	}
}

export default vTouch
