import { isBrowser } from '@directix/core'
import { onUnmounted, readonly, ref, type Ref } from 'vue'

/**
 * Mobile Optimization Utilities for Directix
 *
 * Provides mobile-specific enhancements including:
 * - Touch gesture optimizations
 * - Passive event listeners
 * - Haptic feedback
 * - Performance optimizations
 * - PWA support utilities
 */

/**
 * Touch gesture thresholds
 */
export interface TouchGestureThresholds {
	/** Tap recognition threshold in pixels */
	tap?: number
	/** Long press time threshold in ms */
	longPress?: number
	/** Swipe distance threshold in pixels */
	swipe?: number
	/** Pinch scale threshold */
	pinch?: number
	/** Rotate angle threshold in degrees */
	rotate?: number
	/** Double tap interval in ms */
	doubleTap?: number
	/** Velocity threshold for swipe in px/s */
	swipeVelocity?: number
}

/**
 * Default gesture thresholds
 */
const DEFAULT_THRESHOLDS: Required<TouchGestureThresholds> = {
	tap: 10,
	longPress: 500,
	swipe: 30,
	pinch: 0.1,
	rotate: 5,
	doubleTap: 300,
	swipeVelocity: 0.3,
}

/**
 * Extended touch gesture types
 */
export type ExtendedGestureType
	= | 'tap'
		| 'doubleTap'
		| 'longPress'
		| 'swipe'
		| 'pan'
		| 'pinch'
		| 'pinchIn'
		| 'pinchOut'
		| 'rotate'
		| 'twoFingerTap'
		| 'threeFingerTap'
		| 'edgeSwipe'

/**
 * Touch feedback configuration
 */
export interface TouchFeedbackConfig {
	/** Enable haptic feedback */
	haptic?: boolean
	/** Enable visual feedback */
	visual?: boolean
	/** Visual feedback class name */
	visualClass?: string
	/** Visual feedback duration in ms */
	visualDuration?: number
}

/**
 * Extended touch gesture event
 */
export interface ExtendedTouchEvent {
	/** Gesture type */
	type: ExtendedGestureType
	/** Swipe direction (for swipe gesture) */
	direction?: 'left' | 'right' | 'up' | 'down'
	/** Distance in pixels */
	distance?: number
	/** Velocity in px/s */
	velocity?: number
	/** Angle in degrees */
	angle?: number
	/** Scale factor (for pinch) */
	scale?: number
	/** Rotation in degrees */
	rotation?: number
	/** Center point */
	center?: { x: number, y: number }
	/** Original touch event */
	event: TouchEvent
	/** Duration in ms */
	duration?: number
}

/**
 * Options for enhanced touch handling
 */
export interface UseEnhancedTouchOptions {
	/** Gesture recognition thresholds */
	thresholds?: TouchGestureThresholds
	/** Touch feedback configuration */
	feedback?: TouchFeedbackConfig
	/** Gesture priority order */
	priority?: ExtendedGestureType[]
	/** Debounce time between gestures in ms */
	debounce?: number
	/** Throttle time for continuous gestures in ms */
	throttle?: number
	/** Enable passive listeners */
	passive?: boolean
	/** Disable gesture */
	disabled?: boolean | Ref<boolean>
	/** Gesture callbacks */
	onTap?: (e: ExtendedTouchEvent) => void
	onDoubleTap?: (e: ExtendedTouchEvent) => void
	onLongPress?: (e: ExtendedTouchEvent) => void
	onSwipe?: (e: ExtendedTouchEvent) => void
	onSwipeLeft?: (e: ExtendedTouchEvent) => void
	onSwipeRight?: (e: ExtendedTouchEvent) => void
	onSwipeUp?: (e: ExtendedTouchEvent) => void
	onSwipeDown?: (e: ExtendedTouchEvent) => void
	onPan?: (e: ExtendedTouchEvent) => void
	onPinch?: (e: ExtendedTouchEvent) => void
	onPinchIn?: (e: ExtendedTouchEvent) => void
	onPinchOut?: (e: ExtendedTouchEvent) => void
	onRotate?: (e: ExtendedTouchEvent) => void
	onTwoFingerTap?: (e: ExtendedTouchEvent) => void
	onEdgeSwipe?: (e: ExtendedTouchEvent) => void
}

/**
 * Return type for useEnhancedTouch
 */
export interface UseEnhancedTouchReturn {
	/** Current active gesture */
	activeGesture: Readonly<Ref<ExtendedGestureType | null>>
	/** Bind touch events to element */
	bind: (element: HTMLElement) => () => void
	/** Whether currently touching */
	isTouching: Readonly<Ref<boolean>>
}

/**
 * Trigger haptic feedback
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'selection' = 'light'): void {
	if (!isBrowser()) return

	const nav = navigator as any
	if (nav.vibrate) {
		const patterns: Record<string, number | number[]> = {
			light: 10,
			medium: 20,
			heavy: 30,
			selection: [10, 50, 10],
		}
		nav.vibrate(patterns[type])
	}
}

/**
 * Apply visual feedback to element
 */
export function applyVisualFeedback(
	element: HTMLElement,
	options: TouchFeedbackConfig = {},
): () => void {
	const {
		visualClass = 'directix-touch-active',
		visualDuration = 150,
	} = options

	element.classList.add(visualClass)

	const timer = setTimeout(() => {
		element.classList.remove(visualClass)
	}, visualDuration)

	return () => {
		clearTimeout(timer)
		element.classList.remove(visualClass)
	}
}

/**
 * Calculate velocity between two points
 */
function calculateVelocity(
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	duration: number,
): number {
	if (duration === 0) return 0
	const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)
	return distance / duration
}

/**
 * Check if point is at screen edge
 */
function isEdgePoint(x: number, y: number, edgeSize = 20): { isEdge: boolean, edge?: 'left' | 'right' | 'top' | 'bottom' } {
	if (!isBrowser()) return { isEdge: false }

	const width = window.innerWidth
	const height = window.innerHeight

	if (x <= edgeSize) return { isEdge: true, edge: 'left' }
	if (x >= width - edgeSize) return { isEdge: true, edge: 'right' }
	if (y <= edgeSize) return { isEdge: true, edge: 'top' }
	if (y >= height - edgeSize) return { isEdge: true, edge: 'bottom' }

	return { isEdge: false }
}

/**
 * Enhanced touch composable with full gesture support
 */
export function useEnhancedTouch(options: UseEnhancedTouchOptions = {}): UseEnhancedTouchReturn {
	const {
		thresholds: userThresholds = {},
		feedback = {},
		debounce = 0,
		throttle = 16,
		passive = true,
		disabled = false,
		onTap,
		onDoubleTap,
		onLongPress,
		onSwipe,
		onSwipeLeft,
		onSwipeRight,
		onSwipeUp,
		onSwipeDown,
		onPan,
		onPinch,
		onPinchIn,
		onPinchOut,
		onRotate,
		onTwoFingerTap,
		onEdgeSwipe,
	} = options

	const thresholds = { ...DEFAULT_THRESHOLDS, ...userThresholds }
	const activeGesture = ref<ExtendedGestureType | null>(null)
	const isTouching = ref(false)

	let currentElement: HTMLElement | null = null,
		startX = 0, startY = 0, startTime = 0,
		lastTapTime = 0,
		lastPanTime = 0,
		longPressTimer: ReturnType<typeof setTimeout> | null = null,
		initialPinchDistance = 0, initialAngle = 0,
		removeVisualFeedback: (() => void) | null = null,
		lastGestureTime = 0

	function getTouchCenter(touches: TouchList): { x: number, y: number } {
		let x = 0, y = 0
		for (let i = 0; i < touches.length; i++) {
			x += touches[i].clientX
			y += touches[i].clientY
		}
		return { x: x / touches.length, y: y / touches.length }
	}

	function getDistance(t1: Touch, t2: Touch): number {
		return Math.sqrt((t1.clientX - t2.clientX) ** 2 + (t1.clientY - t2.clientY) ** 2)
	}

	function getAngle(t1: Touch, t2: Touch): number {
		return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * (180 / Math.PI)
	}

	function shouldProcessGesture(): boolean {
		if (typeof disabled === 'boolean' ? disabled : disabled.value) return false
		if (debounce > 0 && Date.now() - lastGestureTime < debounce) return false
		return true
	}

	function handleTouchStart(e: TouchEvent): void {
		if (!shouldProcessGesture()) return

		isTouching.value = true
		startTime = Date.now()
		activeGesture.value = null

		// Haptic feedback on touch start
		if (feedback.haptic) {
			triggerHaptic('light')
		}

		if (e.touches.length === 1) {
			startX = e.touches[0].clientX
			startY = e.touches[0].clientY

			// Start long press timer
			if (onLongPress) {
				longPressTimer = setTimeout(() => {
					if (!activeGesture.value) {
						activeGesture.value = 'longPress'
						lastGestureTime = Date.now()
						onLongPress({
							type: 'longPress',
							center: { x: startX, y: startY },
							event: e,
							duration: Date.now() - startTime,
						})
						if (feedback.haptic) triggerHaptic('medium')
					}
				}, thresholds.longPress)
			}
		} else if (e.touches.length === 2) {
			// Cancel long press for multi-touch
			if (longPressTimer) {
				clearTimeout(longPressTimer)
				longPressTimer = null
			}

			initialPinchDistance = getDistance(e.touches[0], e.touches[1])
			initialAngle = getAngle(e.touches[0], e.touches[1])
		}
	}

	function handleTouchMove(e: TouchEvent): void {
		if (!shouldProcessGesture()) return

		// Cancel long press on move
		if (longPressTimer) {
			clearTimeout(longPressTimer)
			longPressTimer = null
		}

		if (e.touches.length === 1) {
			const currentX = e.touches[0].clientX
			const currentY = e.touches[0].clientY

			// Pan gesture
			if (onPan) {
				const now = Date.now()
				if (now - lastPanTime >= throttle) {
					lastPanTime = now
					const deltaX = currentX - startX
					const deltaY = currentY - startY
					const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

					if (distance > thresholds.tap) {
						activeGesture.value = 'pan'
						onPan({
							type: 'pan',
							distance,
							angle: Math.atan2(deltaY, deltaX) * (180 / Math.PI),
							center: { x: currentX, y: currentY },
							event: e,
						})
					}
				}
			}
		} else if (e.touches.length === 2) {
			const currentDistance = getDistance(e.touches[0], e.touches[1])
			const currentAngle = getAngle(e.touches[0], e.touches[1])

			// Pinch gesture
			if (onPinch && initialPinchDistance > 0) {
				const scale = currentDistance / initialPinchDistance
				const deltaScale = Math.abs(scale - 1)
				if (deltaScale > thresholds.pinch) {
					activeGesture.value = 'pinch'
					onPinch({
						type: 'pinch',
						scale,
						center: getTouchCenter(e.touches),
						event: e,
					})

					if (scale < 1 && onPinchIn) {
						onPinchIn({
							type: 'pinchIn',
							scale,
							center: getTouchCenter(e.touches),
							event: e,
						})
					} else if (scale > 1 && onPinchOut) {
						onPinchOut({
							type: 'pinchOut',
							scale,
							center: getTouchCenter(e.touches),
							event: e,
						})
					}
				}
			}

			// Rotate gesture
			if (onRotate) {
				const rotation = currentAngle - initialAngle
				if (Math.abs(rotation) > thresholds.rotate) {
					activeGesture.value = 'rotate'
					onRotate({
						type: 'rotate',
						rotation,
						center: getTouchCenter(e.touches),
						event: e,
					})
				}
			}
		}
	}

	function handleTouchEnd(e: TouchEvent): void {
		if (!shouldProcessGesture()) return

		isTouching.value = false

		// Cancel long press timer
		if (longPressTimer) {
			clearTimeout(longPressTimer)
			longPressTimer = null
		}

		const duration = Date.now() - startTime
		const endX = e.changedTouches[0]?.clientX ?? startX
		const endY = e.changedTouches[0]?.clientY ?? startY
		const deltaX = endX - startX
		const deltaY = endY - startY
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
		const velocity = calculateVelocity(startX, startY, endX, endY, duration)

		// Multi-finger gestures
		if (e.touches.length === 0 && e.changedTouches.length === 2 && onTwoFingerTap) {
			const twoFingerDistance = getDistance(e.changedTouches[0], e.changedTouches[1])
			if (twoFingerDistance < 50) {
				activeGesture.value = 'twoFingerTap'
				onTwoFingerTap({
					type: 'twoFingerTap',
					center: getTouchCenter(e.changedTouches),
					event: e,
				})
			}
		}

		// Single finger end
		if (e.changedTouches.length === 1) {
			// Swipe gesture
			if (distance >= thresholds.swipe) {
				let direction: 'left' | 'right' | 'up' | 'down'
				if (Math.abs(deltaX) > Math.abs(deltaY)) {
					direction = deltaX > 0 ? 'right' : 'left'
				} else {
					direction = deltaY > 0 ? 'down' : 'up'
				}

				// Check edge swipe
				const edge = isEdgePoint(startX, startY)
				if (edge.isEdge && onEdgeSwipe) {
					activeGesture.value = 'edgeSwipe'
					onEdgeSwipe({
						type: 'edgeSwipe',
						direction,
						distance,
						velocity,
						center: { x: endX, y: endY },
						event: e,
					})
				}

				// Regular swipe
				if (!activeGesture.value) {
					activeGesture.value = 'swipe'
					const swipeEvent: ExtendedTouchEvent = {
						type: 'swipe',
						direction,
						distance,
						velocity,
						angle: Math.atan2(deltaY, deltaX) * (180 / Math.PI),
						center: { x: endX, y: endY },
						event: e,
						duration,
					}

					onSwipe?.(swipeEvent)
					if (direction === 'left') onSwipeLeft?.(swipeEvent)
					if (direction === 'right') onSwipeRight?.(swipeEvent)
					if (direction === 'up') onSwipeUp?.(swipeEvent)
					if (direction === 'down') onSwipeDown?.(swipeEvent)

					if (feedback.haptic) triggerHaptic('light')
				}
			} else if (distance < thresholds.tap && duration < 300) {
				// Tap / Double tap
				const now = Date.now()
				const timeSinceLastTap = now - lastTapTime

				if (timeSinceLastTap < thresholds.doubleTap && onDoubleTap) {
					activeGesture.value = 'doubleTap'
					onDoubleTap({
						type: 'doubleTap',
						center: { x: endX, y: endY },
						event: e,
						duration,
					})
					if (feedback.haptic) triggerHaptic('medium')
					lastTapTime = 0
				} else if (onTap) {
					// Delay to check for double tap
					if (onDoubleTap) {
						setTimeout(() => {
							if (activeGesture.value !== 'doubleTap') {
								activeGesture.value = 'tap'
								onTap({
									type: 'tap',
									center: { x: endX, y: endY },
									event: e,
									duration,
								})
								if (feedback.haptic) triggerHaptic('light')
							}
						}, thresholds.doubleTap)
					} else {
						activeGesture.value = 'tap'
						onTap({
							type: 'tap',
							center: { x: endX, y: endY },
							event: e,
							duration,
						})
						if (feedback.haptic) triggerHaptic('light')
					}
					lastTapTime = now
				}
			}
		}

		// Reset visual feedback
		if (removeVisualFeedback) {
			removeVisualFeedback()
			removeVisualFeedback = null
		}

		lastGestureTime = Date.now()

		// Reset gesture after a short delay
		setTimeout(() => {
			activeGesture.value = null
		}, 100)
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()
		currentElement = element

		const touchOptions: AddEventListenerOptions = passive ? { passive: true } : undefined as any

		element.addEventListener('touchstart', handleTouchStart, touchOptions)
		element.addEventListener('touchmove', handleTouchMove, { passive: false })
		element.addEventListener('touchend', handleTouchEnd)
		element.addEventListener('touchcancel', handleTouchEnd)

		// Visual feedback on touch
		if (feedback.visual) {
			element.addEventListener('touchstart', () => {
				removeVisualFeedback = applyVisualFeedback(element, feedback)
			})
		}

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			currentElement.removeEventListener('touchstart', handleTouchStart)
			currentElement.removeEventListener('touchmove', handleTouchMove)
			currentElement.removeEventListener('touchend', handleTouchEnd)
			currentElement.removeEventListener('touchcancel', handleTouchEnd)
		}

		if (longPressTimer) {
			clearTimeout(longPressTimer)
			longPressTimer = null
		}

		if (removeVisualFeedback) {
			removeVisualFeedback()
			removeVisualFeedback = null
		}

		currentElement = null
		activeGesture.value = null
		isTouching.value = false
	}

	onUnmounted(unbind)

	return {
		activeGesture: readonly(activeGesture),
		bind,
		isTouching: readonly(isTouching),
	}
}

/**
 * Passive event listener options helper
 */
export const PASSIVE_OPTIONS: AddEventListenerOptions = { passive: true }
export const NON_PASSIVE_OPTIONS: AddEventListenerOptions = { passive: false }

/**
 * Add passive event listener
 */
export function addPassiveListener(
	element: EventTarget,
	event: string,
	handler: EventListener,
	options?: AddEventListenerOptions,
): () => void {
	element.addEventListener(event, handler, { passive: true, ...options })
	return () => element.removeEventListener(event, handler)
}

/**
 * Add non-passive event listener (for events that need preventDefault)
 */
export function addNonPassiveListener(
	element: EventTarget,
	event: string,
	handler: EventListener,
	options?: AddEventListenerOptions,
): () => void {
	element.addEventListener(event, handler, { passive: false, ...options })
	return () => element.removeEventListener(event, handler)
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
	if (!isBrowser()) return false
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
	if (!isBrowser()) return false
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Get device pixel ratio
 */
export function getDevicePixelRatio(): number {
	if (!isBrowser()) return 1
	return window.devicePixelRatio || 1
}

/**
 * PWA configuration
 */
export interface PWAConfig {
	/** Service worker configuration */
	serviceWorker?: {
		/** Enable service worker */
		enabled?: boolean
		/** Service worker scope */
		scope?: string
		/** Update strategy */
		updateStrategy?: 'auto' | 'manual'
		/** Registration path */
		path?: string
	}
	/** Cache configuration */
	cache?: {
		/** Static resource strategy */
		static?: 'cache-first' | 'network-first' | 'stale-while-revalidate'
		/** Dynamic resource strategy */
		dynamic?: 'network-first' | 'cache-first'
		/** Maximum age in seconds */
		maxAge?: number
		/** Maximum cache entries */
		maxSize?: number
	}
	/** Offline support */
	offline?: {
		/** Enable offline support */
		enabled?: boolean
		/** Fallback page */
		fallbackPage?: string
		/** Show offline indicator */
		offlineIndicator?: boolean
	}
}

/**
 * PWA utilities
 */
export interface UsePWAReturn {
	/** Whether online */
	isOnline: Readonly<Ref<boolean>>
	/** Whether registered */
	isRegistered: Readonly<Ref<boolean>>
	/** Whether update available */
	needsUpdate: Readonly<Ref<boolean>>
	/** Register service worker */
	register: () => Promise<void>
	/** Update service worker */
	update: () => Promise<void>
	/** Unregister service worker */
	unregister: () => Promise<void>
	/** Initialize PWA */
	init: () => () => void
}

export function usePWA(config: PWAConfig = {}): UsePWAReturn {
	const {
		serviceWorker: swConfig = {},
	} = config

	const isOnline = ref(isBrowser() ? navigator.onLine : true)
	const isRegistered = ref(false)
	const needsUpdate = ref(false)

	let registration: ServiceWorkerRegistration | null = null

	function handleOnline(): void {
		isOnline.value = true
	}

	function handleOffline(): void {
		isOnline.value = false
	}

	async function register(): Promise<void> {
		if (!isBrowser() || !('serviceWorker' in navigator)) return
		if (!swConfig.enabled) return

		try {
			registration = await navigator.serviceWorker.register(
				swConfig.path || '/sw.js',
				{ scope: swConfig.scope || '/' },
			)

			isRegistered.value = true

			registration.addEventListener('updatefound', () => {
				const newWorker = registration?.installing
				if (newWorker) {
					newWorker.addEventListener('statechange', () => {
						if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
							needsUpdate.value = true
						}
					})
				}
			})
		} catch (error) {
			console.warn('[Directix] Service Worker registration failed:', error)
		}
	}

	async function update(): Promise<void> {
		if (!registration) return

		try {
			await registration.update()
			if (registration.waiting) {
				registration.waiting.postMessage({ type: 'SKIP_WAITING' })
			}
		} catch (error) {
			console.warn('[Directix] Service Worker update failed:', error)
		}
	}

	async function unregister(): Promise<void> {
		if (!registration) return

		try {
			await registration.unregister()
			isRegistered.value = false
			registration = null
		} catch (error) {
			console.warn('[Directix] Service Worker unregistration failed:', error)
		}
	}

	function init(): () => void {
		if (!isBrowser()) return () => {}

		window.addEventListener('online', handleOnline)
		window.addEventListener('offline', handleOffline)

		register()

		return () => {
			window.removeEventListener('online', handleOnline)
			window.removeEventListener('offline', handleOffline)
		}
	}

	onUnmounted(() => {
		unregister()
	})

	return {
		isOnline: readonly(isOnline),
		isRegistered: readonly(isRegistered),
		needsUpdate: readonly(needsUpdate),
		register,
		update,
		unregister,
		init,
	}
}

/**
 * Object pool for reusing objects (memory optimization)
 */
export class ObjectPool<T> {
	private pool: T[] = []
	private factory: () => T
	private reset: (item: T) => void
	private maxSize: number

	constructor(
		factory: () => T,
		reset: (item: T) => void,
		maxSize = 100,
	) {
		this.factory = factory
		this.reset = reset
		this.maxSize = maxSize
	}

	acquire(): T {
		if (this.pool.length > 0) {
			return this.pool.pop()!
		}
		return this.factory()
	}

	release(item: T): void {
		if (this.pool.length < this.maxSize) {
			this.reset(item)
			this.pool.push(item)
		}
	}

	get size(): number {
		return this.pool.length
	}

	clear(): void {
		this.pool.length = 0
	}
}
