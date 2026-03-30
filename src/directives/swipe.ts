import { defineDirective } from '@directix/core'

export type SwipeDirection = 'left' | 'right' | 'up' | 'down'

export type SwipeHandler = (direction: SwipeDirection, event: Event) => void

export interface SwipeOptions {
	handler?: SwipeHandler
	threshold?: number
	maxTime?: number
	directions?: SwipeDirection[]
	preventScrollOnSwipe?: boolean
	disabled?: boolean
	mouse?: boolean
	onLeft?: () => void
	onRight?: () => void
	onUp?: () => void
	onDown?: () => void
}

export type SwipeBinding = SwipeHandler | SwipeOptions

interface SwipeState {
	options: SwipeOptions
	startX: number
	startY: number
	startTime: number
	isActive: boolean
	handlers: {
		touchStart: (e: TouchEvent) => void
		touchMove: (e: TouchEvent) => void
		touchEnd: (e: TouchEvent) => void
		mouseDown: (e: MouseEvent) => void
		mouseUp: (e: MouseEvent) => void
	}
}

const DEFAULT_THRESHOLD = 30
const DEFAULT_MAX_TIME = 500
const DEFAULT_DIRECTIONS: SwipeDirection[] = ['left', 'right', 'up', 'down']

function getSwipeDirection(
	deltaX: number,
	deltaY: number,
	allowedDirections: SwipeDirection[],
): SwipeDirection | null {
	const absX = Math.abs(deltaX)
	const absY = Math.abs(deltaY)

	if (absX > absY) {
		const direction = deltaX > 0 ? 'right' : 'left'
		return allowedDirections.includes(direction) ? direction : null
	} else {
		const direction = deltaY > 0 ? 'down' : 'up'
		return allowedDirections.includes(direction) ? direction : null
	}
}

function normalizeOptions(binding: SwipeBinding): SwipeOptions {
	if (typeof binding === 'function') return { handler: binding }

	return {
		handler: binding.handler,
		threshold: binding.threshold ?? DEFAULT_THRESHOLD,
		maxTime: binding.maxTime ?? DEFAULT_MAX_TIME,
		directions: binding.directions ?? [...DEFAULT_DIRECTIONS],
		preventScrollOnSwipe: binding.preventScrollOnSwipe ?? true,
		disabled: binding.disabled ?? false,
		mouse: binding.mouse ?? true,
		onLeft: binding.onLeft,
		onRight: binding.onRight,
		onUp: binding.onUp,
		onDown: binding.onDown,
	}
}

function triggerSwipe(
	state: SwipeState,
	deltaX: number,
	deltaY: number,
	deltaTime: number,
	event: Event,
	el: HTMLElement,
): void {
	const { options } = state

	// Check time
	if (deltaTime > (options.maxTime ?? DEFAULT_MAX_TIME)) return

	// Check distance
	const distance = Math.max(Math.abs(deltaX), Math.abs(deltaY))
	if (distance < (options.threshold ?? DEFAULT_THRESHOLD)) return

	// Get direction
	const direction = getSwipeDirection(deltaX, deltaY, options.directions ?? DEFAULT_DIRECTIONS)
	if (!direction) return

	// Prevent scroll
	if (options.preventScrollOnSwipe && event.cancelable) {
		event.preventDefault()
	}

	// Call handlers
	options.handler?.(direction, event)

	// Direction-specific callbacks
	const callbacks: Record<SwipeDirection, (() => void) | undefined> = {
		left: options.onLeft,
		right: options.onRight,
		up: options.onUp,
		down: options.onDown,
	}
	callbacks[direction]?.()

	// Dispatch custom event
	el.dispatchEvent(new CustomEvent('swipe', { detail: { direction, deltaX, deltaY, deltaTime } }))
}

function createSwipeHandler(
	el: HTMLElement,
	state: SwipeState,
): (clientX: number, clientY: number, event: Event) => void {
	return (clientX, clientY, event) => {
		const deltaX = clientX - state.startX
		const deltaY = clientY - state.startY
		const deltaTime = Date.now() - state.startTime
		triggerSwipe(state, deltaX, deltaY, deltaTime, event, el)
	}
}

function setupState(el: HTMLElement, options: SwipeOptions): SwipeState | null {
	if (options.disabled) return null

	el.style.touchAction = 'none'
	el.style.userSelect = 'none'

	const state: SwipeState = {
		options,
		startX: 0,
		startY: 0,
		startTime: 0,
		isActive: false,
		handlers: null as any,
	}

	const handleSwipe = createSwipeHandler(el, state)

	state.handlers = {
		touchStart: (e: TouchEvent) => {
			if (state.options.disabled) return
			state.startX = e.touches[0].clientX
			state.startY = e.touches[0].clientY
			state.startTime = Date.now()
			state.isActive = true
		},

		touchMove: (e: TouchEvent) => {
			if (!state.isActive || state.options.disabled) return
			if (state.options.preventScrollOnSwipe) {
				e.preventDefault()
			}
		},

		touchEnd: (e: TouchEvent) => {
			if (!state.isActive || state.options.disabled) return
			state.isActive = false
			const touch = e.changedTouches[0]
			handleSwipe(touch.clientX, touch.clientY, e)
		},

		mouseDown: (e: MouseEvent) => {
			if (state.options.disabled) return
			state.startX = e.clientX
			state.startY = e.clientY
			state.startTime = Date.now()
			state.isActive = true
		},

		mouseUp: (e: MouseEvent) => {
			if (!state.isActive || state.options.disabled) return
			state.isActive = false
			handleSwipe(e.clientX, e.clientY, e)
		},
	}

	return state
}

function bindEvents(el: HTMLElement, state: SwipeState): void {
	const { handlers } = state
	const enableMouse = state.options.mouse ?? true

	el.addEventListener('touchstart', handlers.touchStart, { passive: true })
	el.addEventListener('touchmove', handlers.touchMove, { passive: false })
	el.addEventListener('touchend', handlers.touchEnd)
	el.addEventListener('touchcancel', handlers.touchEnd)

	if (enableMouse) {
		el.addEventListener('mousedown', handlers.mouseDown)
		el.addEventListener('mouseup', handlers.mouseUp)
		el.addEventListener('mouseleave', handlers.mouseUp)
	}
}

function unbindEvents(el: HTMLElement, state: SwipeState): void {
	const { handlers } = state
	const enableMouse = state.options.mouse ?? true

	el.removeEventListener('touchstart', handlers.touchStart)
	el.removeEventListener('touchmove', handlers.touchMove)
	el.removeEventListener('touchend', handlers.touchEnd)
	el.removeEventListener('touchcancel', handlers.touchEnd)

	if (enableMouse) {
		el.removeEventListener('mousedown', handlers.mouseDown)
		el.removeEventListener('mouseup', handlers.mouseUp)
		el.removeEventListener('mouseleave', handlers.mouseUp)
	}
}

export const vSwipe = defineDirective<SwipeBinding, HTMLElement>({
	name: 'swipe',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)
		const state = setupState(el, options)
		if (!state) return

		;(el as any).__swipe = state
		bindEvents(el, state)
	},

	updated(el, binding) {
		const state: SwipeState | undefined = (el as any).__swipe
		const newOptions = normalizeOptions(binding.value)

		if (!state) {
			const newState = setupState(el, newOptions)
			if (newState) {
				;(el as any).__swipe = newState
				bindEvents(el, newState)
			}
			return
		}

		const wasDisabled = state.options.disabled
		const wasMouseEnabled = state.options.mouse ?? true
		const nowMouseEnabled = newOptions.mouse ?? true

		state.options = newOptions

		if (newOptions.disabled && !wasDisabled) {
			unbindEvents(el, state)
		} else if (!newOptions.disabled && wasDisabled) {
			bindEvents(el, state)
		} else if (wasMouseEnabled !== nowMouseEnabled) {
			if (wasMouseEnabled) {
				el.removeEventListener('mousedown', state.handlers.mouseDown)
				el.removeEventListener('mouseup', state.handlers.mouseUp)
				el.removeEventListener('mouseleave', state.handlers.mouseUp)
			}
			if (nowMouseEnabled) {
				el.addEventListener('mousedown', state.handlers.mouseDown)
				el.addEventListener('mouseup', state.handlers.mouseUp)
				el.addEventListener('mouseleave', state.handlers.mouseUp)
			}
		}
	},

	unmounted(el) {
		const state: SwipeState | undefined = (el as any).__swipe
		if (!state) return

		unbindEvents(el, state)
		delete (el as any).__swipe
	},
})

export default vSwipe
