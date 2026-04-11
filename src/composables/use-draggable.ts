import { isBrowser } from '@directix/core'
import { onUnmounted, readonly, ref, type Ref, unref } from 'vue'

/**
 * Draggable axis
 */
export type DraggableAxis = 'x' | 'y' | 'both'

/**
 * Position type
 */
export interface Position {
	x: number
	y: number
}

/**
 * Options for useDraggable composable
 */
export interface UseDraggableOptions {
	/**
	 * Drag axis
	 * @default 'both'
	 */
	axis?: DraggableAxis | Ref<DraggableAxis>

	/**
	 * Constrain to parent element
	 * @default false
	 */
	constrain?: boolean | Ref<boolean>

	/**
	 * Boundary element selector or element
	 */
	boundary?: string | HTMLElement | (() => HTMLElement | null)

	/**
	 * Handle element selector
	 */
	handle?: string

	/**
	 * Grid snapping [x, y]
	 */
	grid?: [number, number] | Ref<[number, number]>

	/**
	 * Whether dragging is disabled
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>

	/**
	 * Start drag callback
	 */
	onStart?: (position: Position, event: MouseEvent | TouchEvent) => void

	/**
	 * Drag callback
	 */
	onDrag?: (position: Position, event: MouseEvent | TouchEvent) => void

	/**
	 * End drag callback
	 */
	onEnd?: (position: Position, event: MouseEvent | TouchEvent) => void
}

/**
 * Return type for useDraggable composable
 */
export interface UseDraggableReturn {
	/** Current position */
	position: Readonly<Ref<Position>>

	/** Whether the element is being dragged */
	isDragging: Readonly<Ref<boolean>>

	/** Reset position to origin */
	reset: () => void

	/** Bind draggable behavior to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Get element boundary
 */
function getBoundary(boundary?: string | HTMLElement | (() => HTMLElement | null)): DOMRect | null {
	if (!boundary) return null

	if (typeof boundary === 'function') {
		const boundaryEl = boundary()
		return boundaryEl?.getBoundingClientRect() ?? null
	}

	if (typeof boundary === 'string') {
		const boundaryEl = document.querySelector(boundary)
		return boundaryEl?.getBoundingClientRect() ?? null
	}

	return boundary.getBoundingClientRect()
}

/**
 * Get client coordinates from event
 */
function getClientCoords(e: MouseEvent | TouchEvent): { clientX: number, clientY: number } {
	if (e.type.startsWith('touch')) {
		const touch = (e as TouchEvent).touches[0] || (e as TouchEvent).changedTouches[0]
		return { clientX: touch.clientX, clientY: touch.clientY }
	}
	const mouseEvent = e as MouseEvent
	return { clientX: mouseEvent.clientX, clientY: mouseEvent.clientY }
}

/**
 * Parse transform translate values
 */
function parseTranslate(transform: string): Position {
	const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
	if (match) {
		return { x: parseFloat(match[1]), y: parseFloat(match[2]) }
	}
	return { x: 0, y: 0 }
}

/**
 * Composable for making elements draggable
 *
 * @param options - Configuration options
 * @returns Draggable utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useDraggable } from 'directix'
 *
 * const target = ref(null)
 * const { position, isDragging, bind } = useDraggable({
 *   constrain: true,
 *   onEnd: (pos) => console.log('Dropped at:', pos)
 * })
 *
 * onMounted(() => bind(target.value))
 * </script>
 *
 * <template>
 *   <div ref="target" :class="{ dragging: isDragging }">
 *     Drag me!
 *   </div>
 * </template>
 * ```
 */
export function useDraggable(options: UseDraggableOptions = {}): UseDraggableReturn {
	const {
		axis = 'both',
		constrain = false,
		boundary,
		handle,
		grid,
		disabled = false,
		onStart,
		onDrag,
		onEnd,
	} = options

	const position = ref<Position>({ x: 0, y: 0 })
	const isDragging = ref(false)

	let currentElement: HTMLElement | null = null,
		handleEl: HTMLElement | null = null,
		startX = 0,
		startY = 0,
		offsetX = 0,
		offsetY = 0,
		initialLeft = 0,
		initialTop = 0,
		boundaryWidth = 0,
		boundaryHeight = 0,
		elWidth = 0,
		elHeight = 0

	function startDrag(e: MouseEvent | TouchEvent): void {
		if (unref(disabled)) return

		e.preventDefault()

		const { clientX, clientY } = getClientCoords(e)
		isDragging.value = true
		startX = clientX
		startY = clientY

		// Get current transform offset
		const { x, y } = parseTranslate(currentElement!.style.transform)
		offsetX = x
		offsetY = y

		// Store boundary info
		if (unref(constrain) || boundary) {
			const boundaryRect = boundary ? getBoundary(boundary) : currentElement!.parentElement?.getBoundingClientRect()

			if (boundaryRect) {
				const elRect = currentElement!.getBoundingClientRect()
				initialLeft = elRect.left - boundaryRect.left
				initialTop = elRect.top - boundaryRect.top
				boundaryWidth = boundaryRect.width
				boundaryHeight = boundaryRect.height
				elWidth = elRect.width
				elHeight = elRect.height
			}
		}

		currentElement!.classList.add('v-draggable--dragging')

		document.addEventListener('mousemove', handleDrag)
		document.addEventListener('mouseup', endDrag)
		document.addEventListener('touchmove', handleDrag, { passive: false })
		document.addEventListener('touchend', endDrag)

		onStart?.({ x: offsetX, y: offsetY }, e)
	}

	function handleDrag(e: MouseEvent | TouchEvent): void {
		if (!isDragging.value || unref(disabled)) return

		e.preventDefault()

		const { clientX, clientY } = getClientCoords(e)
		let deltaX = clientX - startX,
			deltaY = clientY - startY

		// Apply axis constraint
		const currentAxis = unref(axis)
		if (currentAxis === 'x') {
			deltaY = 0
		} else if (currentAxis === 'y') {
			deltaX = 0
		}

		// Apply grid snapping
		const currentGrid = unref(grid)
		if (currentGrid) {
			deltaX = Math.round(deltaX / currentGrid[0]) * currentGrid[0]
			deltaY = Math.round(deltaY / currentGrid[1]) * currentGrid[1]
		}

		// eslint-disable-next-line one-var
		let newX = offsetX + deltaX,
			newY = offsetY + deltaY

		// Apply boundary constraints
		if (unref(constrain) || boundary) {
			const newLeft = initialLeft + deltaX
			const newTop = initialTop + deltaY
			const maxLeft = boundaryWidth - elWidth
			const maxTop = boundaryHeight - elHeight

			const constrainedLeft = Math.max(0, Math.min(newLeft, maxLeft))
			const constrainedTop = Math.max(0, Math.min(newTop, maxTop))

			newX = offsetX + (constrainedLeft - initialLeft)
			newY = offsetY + (constrainedTop - initialTop)
		}

		currentElement!.style.transform = `translate(${newX}px, ${newY}px)`
		position.value = { x: newX, y: newY }

		onDrag?.({ x: newX, y: newY }, e)
	}

	function endDrag(e: MouseEvent | TouchEvent): void {
		if (!isDragging.value) return

		isDragging.value = false
		currentElement?.classList.remove('v-draggable--dragging')

		document.removeEventListener('mousemove', handleDrag)
		document.removeEventListener('mouseup', endDrag)
		document.removeEventListener('touchmove', handleDrag)
		document.removeEventListener('touchend', endDrag)

		onEnd?.({ ...position.value }, e)
	}

	function reset(): void {
		if (currentElement) {
			currentElement.style.transform = 'translate(0px, 0px)'
			position.value = { x: 0, y: 0 }
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		unbind()

		currentElement = element

		// Make element positionable
		if (getComputedStyle(element).position === 'static') {
			element.style.position = 'absolute'
		}

		// Get handle element
		handleEl = handle ? element.querySelector(handle) : null
		const target = handleEl || element

		target.addEventListener('mousedown', startDrag)
		target.addEventListener('touchstart', startDrag, { passive: false })

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			const target = handleEl || currentElement
			target.removeEventListener('mousedown', startDrag)
			target.removeEventListener('touchstart', startDrag)
		}
		currentElement = null
		handleEl = null
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		position: readonly(position),
		isDragging: readonly(isDragging),
		reset,
		bind,
	}
}
