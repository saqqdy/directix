import { isBrowser } from '@directix/core'
import { onUnmounted, ref, type Ref } from 'vue'

/**
 * Pan gesture event data
 */
export interface PanEvent {
	direction: 'left' | 'right' | 'up' | 'down'
	deltaX: number
	deltaY: number
	distance: number
	x: number
	y: number
	startX: number
	startY: number
	isPanning: boolean
	isFirst: boolean
	isFinal: boolean
	velocity: number
}

/**
 * Options for usePan composable
 */
export interface UsePanOptions {
	/** Callback when pan starts */
	onStart?: (e: PanEvent) => void

	/** Callback during pan */
	onPan?: (e: PanEvent) => void

	/** Callback when pan ends */
	onEnd?: (e: PanEvent) => void

	/** Minimum distance to trigger */
	threshold?: number

	/** Direction constraint */
	direction?: 'horizontal' | 'vertical' | 'all'

	/** Prevent default behavior */
	preventDefault?: boolean

	/** Pointer types */
	pointers?: ('touch' | 'mouse')[]
}

/**
 * Return type for usePan composable
 */
export interface UsePanReturn {
	/** Whether pan is in progress */
	isPanning: Ref<boolean>

	/** Current pan direction */
	direction: Ref<'left' | 'right' | 'up' | 'down' | null>

	/** Pan distance */
	distance: Ref<number>

	/** Bind pan to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Get direction from delta
 */
function getDirection(deltaX: number, deltaY: number): 'left' | 'right' | 'up' | 'down' {
	if (Math.abs(deltaX) > Math.abs(deltaY)) {
		return deltaX > 0 ? 'right' : 'left'
	}
	return deltaY > 0 ? 'down' : 'up'
}

/**
 * Check if direction is allowed
 */
function isDirectionAllowed(direction: 'left' | 'right' | 'up' | 'down', constraint?: 'horizontal' | 'vertical' | 'all'): boolean {
	if (!constraint || constraint === 'all') return true
	if (constraint === 'horizontal') return direction === 'left' || direction === 'right'
	return direction === 'up' || direction === 'down'
}

/**
 * Get position from event
 */
function getPosition(e: TouchEvent | MouseEvent): { x: number, y: number } {
	if ('touches' in e && e.touches.length > 0) {
		return { x: e.touches[0].clientX, y: e.touches[0].clientY }
	}
	return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
}

/**
 * Composable for pan gesture
 *
 * @param options - Configuration options
 * @returns Pan gesture utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { usePan } from 'directix'
 *
 * const containerRef = ref(null)
 * const { isPanning, direction, bind } = usePan({
 *   onPan: (e) => console.log('Pan:', e.direction, e.distance)
 * })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef">Swipe me</div>
 * </template>
 * ```
 */
export function usePan(options: UsePanOptions = {}): UsePanReturn {
	const { onStart, onPan, onEnd, threshold = 10, direction: directionConstraint = 'all', preventDefault = true, pointers = ['touch', 'mouse'] } = options

	const isPanning = ref(false)
	const direction = ref<'left' | 'right' | 'up' | 'down' | null>(null)
	const distance = ref(0)

	let currentElement: HTMLElement | null = null,
		startX = 0,
		startY = 0,
		currentX = 0,
		currentY = 0,
		startTime = 0,
		handlers: { [key: string]: (e: Event) => void } = {}

	function createPanEvent(_e: TouchEvent | MouseEvent, isFirst: boolean = false, isFinal: boolean = false): PanEvent {
		const deltaX = currentX - startX
		const deltaY = currentY - startY
		const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
		const duration = Date.now() - startTime

		const dir = getDirection(deltaX, deltaY)

		return {
			direction: dir,
			deltaX,
			deltaY,
			distance: dist,
			x: currentX,
			y: currentY,
			startX,
			startY,
			isPanning: isPanning.value,
			isFirst,
			isFinal,
			velocity: dist / (duration || 1),
		}
	}

	function handleStart(e: Event): void {
		const event = e as TouchEvent | MouseEvent
		const pos = getPosition(event)

		startX = pos.x
		startY = pos.y
		currentX = pos.x
		currentY = pos.y
		isPanning.value = false
		startTime = Date.now()

		if (preventDefault) e.preventDefault()
	}

	function handleMove(e: Event): void {
		const event = e as TouchEvent | MouseEvent
		const pos = getPosition(event)

		currentX = pos.x
		currentY = pos.y

		const deltaX = currentX - startX
		const deltaY = currentY - startY
		const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

		if (!isPanning.value && dist < threshold) return

		const dir = getDirection(deltaX, deltaY)
		if (!isDirectionAllowed(dir, directionConstraint)) return

		if (preventDefault) e.preventDefault()

		const wasPanning = isPanning.value
		isPanning.value = true
		direction.value = dir
		distance.value = dist

		const panEvent = createPanEvent(event, !wasPanning)

		if (!wasPanning) {
			onStart?.(panEvent)
		}

		onPan?.(panEvent)
	}

	function handleEnd(e: Event): void {
		if (!isPanning.value) return

		const panEvent = createPanEvent(e as TouchEvent | MouseEvent, false, true)
		onEnd?.(panEvent)

		isPanning.value = false
		direction.value = null
		distance.value = 0
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element

		// Touch events
		if (pointers.includes('touch')) {
			handlers.touchstart = handleStart
			handlers.touchmove = handleMove
			handlers.touchend = handleEnd
			handlers.touchcancel = handleEnd

			element.addEventListener('touchstart', handlers.touchstart, { passive: false })
			element.addEventListener('touchmove', handlers.touchmove, { passive: false })
			element.addEventListener('touchend', handlers.touchend)
			element.addEventListener('touchcancel', handlers.touchcancel)
		}

		// Mouse events
		if (pointers.includes('mouse')) {
			handlers.mousedown = handleStart
			handlers.mousemove = handleMove
			handlers.mouseup = handleEnd

			element.addEventListener('mousedown', handlers.mousedown)

			// Use document for move and up
			document.addEventListener('mousemove', handlers.mousemove)
			document.addEventListener('mouseup', handlers.mouseup)
		}

		element.classList.add('v-pan')

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			Object.entries(handlers).forEach(([event, handler]) => {
				if (event.startsWith('mouse') && (event === 'mousemove' || event === 'mouseup')) {
					document.removeEventListener(event, handler)
				} else {
					currentElement?.removeEventListener(event, handler)
				}
			})

			currentElement.classList.remove('v-pan')
		}

		currentElement = null
		handlers = {}
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		isPanning,
		direction,
		distance,
		bind,
	}
}
