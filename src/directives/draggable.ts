import { defineDirective } from '@directix/core'

/**
 * Draggable axis
 */
export type DraggableAxis = 'x' | 'y' | 'both'

/**
 * Draggable directive options
 */
export interface DraggableOptions {
	/**
	 * Drag axis
	 * @default 'both'
	 */
	axis?: DraggableAxis

	/**
	 * Constrain to parent element
	 * @default false
	 */
	constrain?: boolean

	/**
	 * Boundary element selector or element
	 */
	boundary?: string | HTMLElement | (() => HTMLElement | null)

	/**
	 * Handle element selector
	 */
	handle?: string

	/**
	 * Whether dragging is disabled
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Grid snapping [x, y]
	 */
	grid?: [number, number]

	/**
	 * Start drag callback
	 */
	onStart?: (position: { x: number, y: number }, event: MouseEvent | TouchEvent) => void

	/**
	 * Drag callback
	 */
	onDrag?: (position: { x: number, y: number }, event: MouseEvent | TouchEvent) => void

	/**
	 * End drag callback
	 */
	onEnd?: (position: { x: number, y: number }, event: MouseEvent | TouchEvent) => void
}

/**
 * Directive binding value type
 */
export type DraggableBinding = boolean | DraggableOptions

/**
 * Draggable state
 */
interface DraggableState {
	options: DraggableOptions
	isDragging: boolean
	startX: number
	startY: number
	offsetX: number
	offsetY: number
	initialLeft: number
	initialTop: number
	boundaryWidth: number
	boundaryHeight: number
	elWidth: number
	elHeight: number
	handleEl: HTMLElement | null
	moveHandler: ((e: MouseEvent | TouchEvent) => void) | null
	endHandler: ((e: MouseEvent | TouchEvent) => void) | null
}

/**
 * Get element boundary
 */
function getBoundary(_el: HTMLElement, boundary?: string | HTMLElement | (() => HTMLElement | null)): DOMRect | null {
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
 * Get client coordinates from mouse or touch event
 */
function getClientCoords(e: MouseEvent | TouchEvent): { clientX: number, clientY: number } {
	if (e.type.startsWith('touch')) {
		const touch = (e as TouchEvent).touches[0]
		return { clientX: touch.clientX, clientY: touch.clientY }
	}
	const mouseEvent = e as MouseEvent
	return { clientX: mouseEvent.clientX, clientY: mouseEvent.clientY }
}

/**
 * Parse transform translate values
 */
function parseTranslate(transform: string): { x: number, y: number } {
	const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
	if (match) {
		return { x: parseFloat(match[1]), y: parseFloat(match[2]) }
	}
	return { x: 0, y: 0 }
}

/**
 * Normalize options
 */
function normalizeOptions(binding: DraggableBinding): DraggableOptions {
	if (binding === undefined || binding === true) {
		return { axis: 'both', constrain: false, disabled: false }
	}

	if (binding === false) {
		return { axis: 'both', constrain: false, disabled: true }
	}

	return {
		axis: binding.axis ?? 'both',
		constrain: binding.constrain ?? false,
		boundary: binding.boundary,
		handle: binding.handle,
		disabled: binding.disabled ?? false,
		grid: binding.grid,
		onStart: binding.onStart,
		onDrag: binding.onDrag,
		onEnd: binding.onEnd,
	}
}

/**
 * v-draggable directive
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Simple usage -->
 *   <div v-draggable>Drag me</div>
 *
 *   <!-- Constrain to parent -->
 *   <div v-draggable="{ constrain: true }">Drag me</div>
 *
 *   <!-- With handle -->
 *   <div v-draggable="{ handle: '.drag-handle' }">
 *     <div class="drag-handle">Drag here</div>
 *     <div>Content</div>
 *   </div>
 *
 *   <!-- With callbacks -->
 *   <div v-draggable="{ onDrag: handleDrag }">Drag me</div>
 * </template>
 * ```
 */
export const vDraggable = defineDirective<DraggableBinding, HTMLElement>({
	name: 'draggable',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)
		if (options.disabled) return

		// Make element positionable
		if (getComputedStyle(el).position === 'static') {
			el.style.position = 'absolute'
		}

		const state: DraggableState = {
			options,
			isDragging: false,
			startX: 0,
			startY: 0,
			offsetX: 0,
			offsetY: 0,
			initialLeft: 0,
			initialTop: 0,
			boundaryWidth: 0,
			boundaryHeight: 0,
			elWidth: 0,
			elHeight: 0,
			handleEl: options.handle ? el.querySelector(options.handle) : null,
			moveHandler: null,
			endHandler: null,
		}

		;(el as any).__draggable = state

		// Add event listeners to handle or element
		const targetEl = state.handleEl || el
		targetEl.addEventListener('mousedown', startDrag)
		targetEl.addEventListener('touchstart', startDrag, { passive: false })

		function startDrag(e: MouseEvent | TouchEvent): void {
			if (state.options.disabled) return

			// Prevent default for touch events
			if (e.type === 'touchstart') {
				e.preventDefault()
			}

			const { clientX, clientY } = getClientCoords(e)
			state.isDragging = true
			state.startX = clientX
			state.startY = clientY

			// Get current transform offset
			const { x, y } = parseTranslate(el.style.transform)
			state.offsetX = x
			state.offsetY = y

			// Store boundary info for constraint
			if (state.options.constrain || state.options.boundary) {
				const boundary = state.options.boundary ? getBoundary(el, state.options.boundary) : el.parentElement?.getBoundingClientRect()

				if (boundary) {
					const elRect = el.getBoundingClientRect()
					state.initialLeft = elRect.left - boundary.left
					state.initialTop = elRect.top - boundary.top
					state.boundaryWidth = boundary.width
					state.boundaryHeight = boundary.height
					state.elWidth = elRect.width
					state.elHeight = elRect.height
				}
			}

			// Add drag class
			el.classList.add('v-draggable--dragging')

			// Create move and end handlers
			state.moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
				if (!state.isDragging) return

				const { clientX: moveX, clientY: moveY } = getClientCoords(moveEvent)
				let deltaX = moveX - state.startX,
					deltaY = moveY - state.startY

				// Apply axis constraint
				if (state.options.axis === 'x') {
					deltaY = 0
				} else if (state.options.axis === 'y') {
					deltaX = 0
				}

				// Apply grid snapping
				if (state.options.grid) {
					deltaX = Math.round(deltaX / state.options.grid[0]) * state.options.grid[0]
					deltaY = Math.round(deltaY / state.options.grid[1]) * state.options.grid[1]
				}

				// eslint-disable-next-line one-var
				let newX = state.offsetX + deltaX,
					newY = state.offsetY + deltaY

				// Apply boundary constraints
				if (state.options.constrain || state.options.boundary) {
					const newLeft = state.initialLeft + deltaX
					const newTop = state.initialTop + deltaY
					const maxLeft = state.boundaryWidth - state.elWidth
					const maxTop = state.boundaryHeight - state.elHeight

					const constrainedLeft = Math.max(0, Math.min(newLeft, maxLeft))
					const constrainedTop = Math.max(0, Math.min(newTop, maxTop))

					newX = state.offsetX + (constrainedLeft - state.initialLeft)
					newY = state.offsetY + (constrainedTop - state.initialTop)
				}

				// Apply transform
				el.style.transform = `translate(${newX}px, ${newY}px)`

				// Call callback
				state.options.onDrag?.({ x: newX, y: newY }, moveEvent)
			}

			state.endHandler = () => {
				if (!state.isDragging) return

				state.isDragging = false
				el.classList.remove('v-draggable--dragging')

				// Remove event listeners
				if (state.moveHandler) {
					document.removeEventListener('mousemove', state.moveHandler)
					document.removeEventListener('touchmove', state.moveHandler)
				}
				if (state.endHandler) {
					document.removeEventListener('mouseup', state.endHandler)
					document.removeEventListener('touchend', state.endHandler)
				}

				// Get final position
				const { x: finalX, y: finalY } = parseTranslate(el.style.transform)
				state.options.onEnd?.({ x: finalX, y: finalY }, new MouseEvent('mouseup'))
			}

			// Add move and end listeners
			document.addEventListener('mousemove', state.moveHandler)
			document.addEventListener('touchmove', state.moveHandler, { passive: false })
			document.addEventListener('mouseup', state.endHandler)
			document.addEventListener('touchend', state.endHandler)

			// Call start callback
			state.options.onStart?.({ x: state.offsetX, y: state.offsetY }, e)
		}
	},

	updated(el, binding) {
		const state: DraggableState | undefined = (el as any).__draggable
		if (!state) return

		state.options = normalizeOptions(binding.value)

		// Update handle element
		if (state.options.handle) {
			state.handleEl = el.querySelector(state.options.handle)
		}
	},

	unmounted(el) {
		const state: DraggableState | undefined = (el as any).__draggable
		if (!state) return

		// Remove event listeners
		if (state.moveHandler) {
			document.removeEventListener('mousemove', state.moveHandler)
			document.removeEventListener('touchmove', state.moveHandler)
		}
		if (state.endHandler) {
			document.removeEventListener('mouseup', state.endHandler)
			document.removeEventListener('touchend', state.endHandler)
		}

		delete (el as any).__draggable
	},
})

export default vDraggable
