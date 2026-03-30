import { defineDirective } from '@directix/core'

/**
 * Swipe direction
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down'

/**
 * Swipe handler
 */
export type SwipeHandler = (direction: SwipeDirection, event: TouchEvent) => void

/**
 * Swipe options
 */
export interface SwipeOptions {
	/**
	 * Handler to call on swipe
	 */
	handler?: SwipeHandler

	/**
	 * Minimum distance to trigger swipe (in pixels)
	 * @default 50
	 */
	threshold?: number

	/**
	 * Maximum time for swipe (in ms)
	 * @default 300
	 */
	maxTime?: number

	/**
	 * Minimum velocity (pixels per ms)
	 * @default 0.3
	 */
	minVelocity?: number

	/**
	 * Allowed directions
	 * @default ['left', 'right', 'up', 'down']
	 */
	directions?: SwipeDirection[]

	/**
	 * Whether to prevent default scroll on swipe
	 * @default true
	 */
	preventScrollOnSwipe?: boolean

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Callback on swipe left
	 */
	onLeft?: () => void

	/**
	 * Callback on swipe right
	 */
	onRight?: () => void

	/**
	 * Callback on swipe up
	 */
	onUp?: () => void

	/**
	 * Callback on swipe down
	 */
	onDown?: () => void
}

/**
 * Directive binding value type
 */
export type SwipeBinding = SwipeHandler | SwipeOptions

/**
 * Element state storage
 */
interface SwipeState {
	options: SwipeOptions
	startX: number
	startY: number
	startTime: number
	handler: (e: TouchEvent) => void
}

/**
 * Get swipe direction from deltas
 */
function getSwipeDirection(
	deltaX: number,
	deltaY: number,
	allowedDirections: SwipeDirection[],
): SwipeDirection | null {
	const absX = Math.abs(deltaX)
	const absY = Math.abs(deltaY)

	// Determine primary direction
	if (absX > absY) {
		// Horizontal swipe
		const direction = deltaX > 0 ? 'right' : 'left'
		if (allowedDirections.includes(direction)) {
			return direction
		}
	} else {
		// Vertical swipe
		const direction = deltaY > 0 ? 'down' : 'up'
		if (allowedDirections.includes(direction)) {
			return direction
		}
	}

	return null
}

/**
 * Normalize options
 */
function normalizeOptions(binding: SwipeBinding): SwipeOptions {
	if (typeof binding === 'function') {
		return { handler: binding }
	}

	return {
		handler: binding.handler,
		threshold: binding.threshold ?? 50,
		maxTime: binding.maxTime ?? 300,
		minVelocity: binding.minVelocity ?? 0.3,
		directions: binding.directions ?? ['left', 'right', 'up', 'down'],
		preventScrollOnSwipe: binding.preventScrollOnSwipe ?? true,
		disabled: binding.disabled ?? false,
		onLeft: binding.onLeft,
		onRight: binding.onRight,
		onUp: binding.onUp,
		onDown: binding.onDown,
	}
}

/**
 * v-swipe directive
 *
 * Detects swipe gestures on an element.
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Basic usage -->
 *   <div v-swipe="handleSwipe">Swipe me</div>
 *
 *   <!-- With direction callbacks -->
 *   <div v-swipe="{
 *     onLeft: () => prevSlide(),
 *     onRight: () => nextSlide(),
 *     threshold: 100
 *   }">
 *     Swipe left/right
 *   </div>
 *
 *   <!-- Only horizontal swipes -->
 *   <div v-swipe="{
 *     handler: handleSwipe,
 *     directions: ['left', 'right']
 *   }">
 *     Horizontal only
 *   </div>
 * </template>
 * ```
 */
export const vSwipe = defineDirective<SwipeBinding, HTMLElement>({
	name: 'swipe',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled) return

		// Setup touch styles
		el.style.touchAction = 'pan-y'

		const state: SwipeState = {
			options,
			startX: 0,
			startY: 0,
			startTime: 0,
			handler: createSwipeHandler(el, options),
		}

		;(el as any).__swipe = state

		el.addEventListener('touchstart', handleTouchStart, { passive: true })
		el.addEventListener('touchend', state.handler)
	},

	updated(el, binding) {
		const state: SwipeState | undefined = (el as any).__swipe

		const newOptions = normalizeOptions(binding.value)

		if (!state) {
			if (!newOptions.disabled) {
				const newState: SwipeState = {
					options: newOptions,
					startX: 0,
					startY: 0,
					startTime: 0,
					handler: createSwipeHandler(el, newOptions),
				}
				;(el as any).__swipe = newState
				el.addEventListener('touchstart', handleTouchStart, { passive: true })
				el.addEventListener('touchend', newState.handler)
			}
			return
		}

		state.options = newOptions
		state.handler = createSwipeHandler(el, newOptions)

		// Handle disabled state
		if (newOptions.disabled && !state.options.disabled) {
			el.removeEventListener('touchstart', handleTouchStart)
			el.removeEventListener('touchend', state.handler)
		} else if (!newOptions.disabled && state.options.disabled) {
			el.addEventListener('touchstart', handleTouchStart, { passive: true })
			el.addEventListener('touchend', state.handler)
		}
	},

	unmounted(el) {
		const state: SwipeState | undefined = (el as any).__swipe

		if (!state) return

		el.removeEventListener('touchstart', handleTouchStart)
		el.removeEventListener('touchend', state.handler)

		delete (el as any).__swipe
	},
})

/**
 * Touch start handler
 */
function handleTouchStart(e: TouchEvent): void {
	const state: SwipeState | undefined = (e.currentTarget as any).__swipe
	if (!state) return

	state.startX = e.touches[0].clientX
	state.startY = e.touches[0].clientY
	state.startTime = Date.now()
}

/**
 * Create swipe handler
 */
function createSwipeHandler(el: HTMLElement, options: SwipeOptions): (e: TouchEvent) => void {
	return (e: TouchEvent) => {
		const state: SwipeState | undefined = (el as any).__swipe
		if (!state || options.disabled) return

		const touch = e.changedTouches[0]
		const deltaX = touch.clientX - state.startX
		const deltaY = touch.clientY - state.startY
		const deltaTime = Date.now() - state.startTime
		const absX = Math.abs(deltaX)
		const absY = Math.abs(deltaY)

		// Check time threshold
		if (deltaTime > (options.maxTime || 300)) return

		// Check distance threshold
		const distance = Math.max(absX, absY)
		if (distance < (options.threshold || 50)) return

		// Check velocity
		const velocity = distance / deltaTime
		if (velocity < (options.minVelocity || 0.3)) return

		// Get direction
		const direction = getSwipeDirection(
			deltaX,
			deltaY,
			options.directions || ['left', 'right', 'up', 'down'],
		)

		if (!direction) return

		// Prevent scroll on swipe
		if (options.preventScrollOnSwipe) {
			e.preventDefault()
		}

		// Call handlers
		if (options.handler) {
			options.handler(direction, e)
		}

		// Direction-specific callbacks
		switch (direction) {
			case 'left':
				options.onLeft?.()
				break
			case 'right':
				options.onRight?.()
				break
			case 'up':
				options.onUp?.()
				break
			case 'down':
				options.onDown?.()
				break
		}

		// Dispatch custom event
		el.dispatchEvent(
			new CustomEvent('swipe', {
				detail: { direction, deltaX, deltaY, deltaTime },
			}),
		)
	}
}

export default vSwipe
