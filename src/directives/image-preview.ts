import { defineDirective } from '@directix/core'

// ============================================================================
// Types
// ============================================================================

/**
 * Image preview options
 */
export interface ImagePreviewOptions {
	/** Image source URL */
	src?: string
	/** Preview image source URL (higher resolution) */
	previewSrc?: string
	/** Alt text for accessibility */
	alt?: string
	/** Whether preview is disabled @default false */
	disabled?: boolean
	/** Close on click outside @default true */
	closeOnClickOutside?: boolean
	/** Close on escape key @default true */
	closeOnEsc?: boolean
	/** Show close button @default true */
	showCloseButton?: boolean
	/** Z-index of the preview overlay @default 9999 */
	zIndex?: number
	/** Custom class for the preview overlay */
	class?: string
	/** Enable pinch zoom on mobile @default true */
	enablePinchZoom?: boolean
	/** Enable double tap to zoom @default true */
	enableDoubleTap?: boolean
	/** Enable swipe up to close @default true */
	enableSwipeClose?: boolean
	/** Show zoom indicator @default true */
	showZoomIndicator?: boolean
	/** Minimum zoom scale @default 0.5 */
	minScale?: number
	/** Maximum zoom scale @default 5 */
	maxScale?: number
	/** Callback when preview opens */
	onOpen?: () => void
	/** Callback when preview closes */
	onClose?: () => void
}

export type ImagePreviewBinding = string | ImagePreviewOptions

interface TransformState {
	scale: number
	translateX: number
	translateY: number
}

interface GestureState {
	isDragging: boolean
	startX: number
	startY: number
	startDistance: number
	startScale: number
	lastTapTime: number
	swipeStartY: number
}

interface PreviewState {
	options: ImagePreviewOptions
	overlay: HTMLElement | null
	imageContainer: HTMLElement | null
	image: HTMLImageElement | null
	isOpen: boolean
	transform: TransformState
	gesture: GestureState
	handlers: {
		click: () => void
		esc: ((e: KeyboardEvent) => void) | null
		touchStart: ((e: TouchEvent) => void) | null
		touchMove: ((e: TouchEvent) => void) | null
		touchEnd: ((e: TouchEvent) => void) | null
		mouseDown: ((e: MouseEvent) => void) | null
		mouseMove: ((e: MouseEvent) => void) | null
		mouseUp: ((e: MouseEvent) => void) | null
		wheel: ((e: WheelEvent) => void) | null
	}
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULTS = {
	minScale: 0.5,
	maxScale: 5,
	doubleTapZoom: 2.5,
	swipeThreshold: 100,
	tapTimeout: 300,
	animationDuration: 300,
	hintDuration: 3000,
	zoomIndicatorDuration: 1500,
} as const

let globalZIndex = 9999

// ============================================================================
// Utility Functions
// ============================================================================

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value))
}

// ============================================================================
// UI Components
// ============================================================================

function createOverlay(options: ImagePreviewOptions): {
	overlay: HTMLElement
	imageContainer: HTMLElement
	image: HTMLImageElement
} {
	const zIndex = options.zIndex ?? ++globalZIndex

	// Main overlay
	const overlay = document.createElement('div')
	overlay.className = 'v-image-preview-overlay'
	if (options.class) overlay.classList.add(options.class)

	Object.assign(overlay.style, {
		position: 'fixed',
		inset: '0',
		background: 'rgba(0, 0, 0, 0.95)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: String(zIndex),
		cursor: 'zoom-out',
		opacity: '0',
		transition: 'opacity 0.3s',
		touchAction: 'none',
		overflow: 'hidden',
	} as CSSStyleDeclaration)

	// Image container
	const imageContainer = document.createElement('div')
	Object.assign(imageContainer.style, {
		position: 'relative',
		transformOrigin: 'center center',
		transition: 'transform 0.1s ease-out',
		willChange: 'transform',
	} as CSSStyleDeclaration)

	// Image element
	const image = document.createElement('img')
	image.src = options.previewSrc || options.src || ''
	image.alt = options.alt || ''
	Object.assign(image.style, {
		maxWidth: '95vw',
		maxHeight: '90vh',
		objectFit: 'contain',
		cursor: 'grab',
		userSelect: 'none',
		WebkitUserDrag: 'none',
	} as CSSStyleDeclaration)
	image.addEventListener('dragstart', e => e.preventDefault())

	imageContainer.appendChild(image)

	// Close button
	if (options.showCloseButton !== false) {
		const closeBtn = document.createElement('button')
		closeBtn.className = 'v-image-preview-close'
		closeBtn.innerHTML = '×'
		closeBtn.setAttribute('aria-label', 'Close preview')

		Object.assign(closeBtn.style, {
			position: 'fixed',
			top: '16px',
			right: '16px',
			width: '44px',
			height: '44px',
			border: 'none',
			background: 'rgba(255, 255, 255, 0.15)',
			color: 'white',
			fontSize: '28px',
			cursor: 'pointer',
			borderRadius: '50%',
			transition: 'background 0.2s, transform 0.2s',
			zIndex: String(zIndex + 1),
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			backdropFilter: 'blur(10px)',
			WebkitBackdropFilter: 'blur(10px)',
		} as CSSStyleDeclaration)

		const setBtnStyle = (bg: string, scale: string): void => {
			closeBtn.style.background = bg
			closeBtn.style.transform = scale
		}

		closeBtn.addEventListener('mouseenter', () => setBtnStyle('rgba(255, 255, 255, 0.25)', 'scale(1.1)'))
		closeBtn.addEventListener('mouseleave', () => setBtnStyle('rgba(255, 255, 255, 0.15)', 'scale(1)'))
		closeBtn.addEventListener('touchstart', () => setBtnStyle('rgba(255, 255, 255, 0.35)', 'scale(1.15)'), { passive: true })
		closeBtn.addEventListener('touchend', () => setBtnStyle('rgba(255, 255, 255, 0.15)', 'scale(1)'), { passive: true })

		overlay.appendChild(closeBtn)
	}

	// Zoom indicator
	if (options.showZoomIndicator !== false) {
		const zoomIndicator = document.createElement('div')
		zoomIndicator.className = 'v-image-preview-zoom'
		zoomIndicator.textContent = '100%'

		Object.assign(zoomIndicator.style, {
			position: 'fixed',
			bottom: '24px',
			left: '50%',
			transform: 'translateX(-50%)',
			background: 'rgba(0, 0, 0, 0.6)',
			color: 'white',
			padding: '8px 16px',
			borderRadius: '20px',
			fontSize: '14px',
			fontWeight: '500',
			opacity: '0',
			transition: 'opacity 0.3s',
			zIndex: String(zIndex + 1),
			backdropFilter: 'blur(10px)',
			WebkitBackdropFilter: 'blur(10px)',
		} as CSSStyleDeclaration)

		overlay.appendChild(zoomIndicator)
	}

	// Hint
	const hint = document.createElement('div')
	hint.className = 'v-image-preview-hint'
	hint.textContent = 'Pinch to zoom • Double tap • Swipe up to close'

	Object.assign(hint.style, {
		position: 'fixed',
		bottom: '60px',
		left: '50%',
		transform: 'translateX(-50%)',
		color: 'rgba(255, 255, 255, 0.6)',
		fontSize: '12px',
		opacity: '1',
		transition: 'opacity 0.5s',
		zIndex: String(zIndex + 1),
		pointerEvents: 'none',
	} as CSSStyleDeclaration)

	overlay.appendChild(hint)
	setTimeout(() => (hint.style.opacity = '0'), DEFAULTS.hintDuration)

	overlay.appendChild(imageContainer)

	return { overlay, imageContainer, image }
}

// ============================================================================
// Transform Helpers
// ============================================================================

interface TransformManager {
	updateTransform: (animate?: boolean) => void
	resetTransform: () => void
	constrainScale: (newScale: number) => number
	constrainTranslate: (x: number, y: number) => { x: number, y: number }
}

function createTransformManager(state: PreviewState): TransformManager {
	const updateTransform = (animate = false): void => {
		if (!state.imageContainer) return

		const { scale, translateX, translateY } = state.transform
		state.imageContainer.style.transition = animate ? 'transform 0.2s ease-out' : 'none'
		state.imageContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`

		// Update zoom indicator
		const zoomIndicator = state.overlay?.querySelector('.v-image-preview-zoom') as HTMLElement | null
		if (zoomIndicator) {
			zoomIndicator.textContent = `${Math.round(scale * 100)}%`
			zoomIndicator.style.opacity = '1'

			clearTimeout((zoomIndicator as any)._hideTimer)
			;(zoomIndicator as any)._hideTimer = setTimeout(() => {
				zoomIndicator.style.opacity = '0'
			}, DEFAULTS.zoomIndicatorDuration)
		}
	}

	const resetTransform = (): void => {
		state.transform = { scale: 1, translateX: 0, translateY: 0 }
		updateTransform(true)
	}

	const constrainScale = (newScale: number): number => {
		const { minScale = DEFAULTS.minScale, maxScale = DEFAULTS.maxScale } = state.options
		return clamp(newScale, minScale, maxScale)
	}

	const constrainTranslate = (x: number, y: number): { x: number, y: number } => {
		const { scale } = state.transform
		if (!state.image || scale <= 1) return { x: 0, y: 0 }

		const rect = state.image.getBoundingClientRect()
		const maxX = (rect.width * (scale - 1)) / 2
		const maxY = (rect.height * (scale - 1)) / 2

		return {
			x: clamp(x, -maxX, maxX),
			y: clamp(y, -maxY, maxY),
		}
	}

	return { updateTransform, resetTransform, constrainScale, constrainTranslate }
}

// ============================================================================
// Gesture Handlers
// ============================================================================

interface GestureHandlers {
	handleTouchStart: (e: TouchEvent) => void
	handleTouchMove: (e: TouchEvent) => void
	handleTouchEnd: (e: TouchEvent) => void
	handleMouseDown: (e: MouseEvent) => void
	handleMouseMove: (e: MouseEvent) => void
	handleMouseUp: () => void
	handleWheel: (e: WheelEvent) => void
}

function createGestureHandlers(
	state: PreviewState,
	transformManager: TransformManager,
	closePreview: () => void,
): GestureHandlers {
	const { updateTransform, resetTransform, constrainScale, constrainTranslate } = transformManager

	const handleTouchStart = (e: TouchEvent): void => {
		if (!state.imageContainer) return

		const now = Date.now()
		const { gesture, transform, options } = state

		if (e.touches.length === 1) {
			// Double tap detection
			if (options.enableDoubleTap !== false && now - gesture.lastTapTime < DEFAULTS.tapTimeout) {
				e.preventDefault()
				transform.scale = transform.scale > 1 ? 1 : constrainScale(DEFAULTS.doubleTapZoom)
				gesture.lastTapTime = 0
				updateTransform(true)
				return
			}

			gesture.lastTapTime = now
			gesture.isDragging = true
			gesture.startX = e.touches[0].clientX - transform.translateX
			gesture.startY = e.touches[0].clientY - transform.translateY
			gesture.swipeStartY = e.touches[0].clientY
		} else if (e.touches.length === 2 && options.enablePinchZoom !== false) {
			gesture.isDragging = false
			gesture.startDistance = getDistance(
				e.touches[0].clientX,
				e.touches[0].clientY,
				e.touches[1].clientX,
				e.touches[1].clientY,
			)
			gesture.startScale = transform.scale
		}
	}

	const handleTouchMove = (e: TouchEvent): void => {
		if (!state.imageContainer) return
		e.preventDefault()

		const { gesture, transform, options } = state

		if (e.touches.length === 1 && gesture.isDragging) {
			const newX = e.touches[0].clientX - gesture.startX
			const newY = e.touches[0].clientY - gesture.startY
			const constrained = constrainTranslate(newX, newY)

			transform.translateX = constrained.x
			transform.translateY = constrained.y
			updateTransform(false)
		} else if (e.touches.length === 2 && options.enablePinchZoom !== false) {
			const currentDistance = getDistance(
				e.touches[0].clientX,
				e.touches[0].clientY,
				e.touches[1].clientX,
				e.touches[1].clientY,
			)

			transform.scale = constrainScale(gesture.startScale * (currentDistance / gesture.startDistance))
			updateTransform(false)
		}
	}

	const handleTouchEnd = (e: TouchEvent): void => {
		const { gesture, transform, options } = state
		gesture.isDragging = false

		// Swipe up to close
		if (options.enableSwipeClose !== false && e.changedTouches.length === 1 && transform.scale <= 1) {
			const deltaY = e.changedTouches[0].clientY - gesture.swipeStartY
			if (deltaY < -DEFAULTS.swipeThreshold) {
				closePreview()
				return
			}
		}

		// Snap back if scale < 1
		if (transform.scale < 1) {
			resetTransform()
		}
	}

	const handleMouseDown = (e: MouseEvent): void => {
		if (!state.imageContainer) return

		state.gesture.isDragging = true
		state.gesture.startX = e.clientX - state.transform.translateX
		state.gesture.startY = e.clientY - state.transform.translateY
		state.imageContainer.style.cursor = 'grabbing'
	}

	const handleMouseMove = (e: MouseEvent): void => {
		if (!state.gesture.isDragging || !state.imageContainer) return

		const newX = e.clientX - state.gesture.startX
		const newY = e.clientY - state.gesture.startY
		const constrained = constrainTranslate(newX, newY)

		state.transform.translateX = constrained.x
		state.transform.translateY = constrained.y
		updateTransform(false)
	}

	const handleMouseUp = (): void => {
		state.gesture.isDragging = false
		if (state.imageContainer) {
			state.imageContainer.style.cursor = 'grab'
		}
	}

	const handleWheel = (e: WheelEvent): void => {
		if (!state.imageContainer || state.options.enablePinchZoom === false) return
		e.preventDefault()

		const delta = e.deltaY > 0 ? 0.9 : 1.1
		state.transform.scale = constrainScale(state.transform.scale * delta)
		updateTransform(false)

		// Reset if too small
		if (state.transform.scale < 0.8) {
			setTimeout(resetTransform, 100)
		}
	}

	return { handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel }
}

// ============================================================================
// Normalize Options
// ============================================================================

function normalizeOptions(binding: ImagePreviewBinding, el: HTMLElement): ImagePreviewOptions {
	const elSrc = el.tagName === 'IMG' ? (el as HTMLImageElement).src : undefined
	const elPreviewSrc = el.getAttribute('data-preview') || undefined
	const elAlt = el.tagName === 'IMG' ? (el as HTMLImageElement).alt : el.getAttribute('alt') || undefined

	if (typeof binding === 'string') {
		return {
			src: binding,
			previewSrc: elPreviewSrc,
			alt: elAlt,
			enablePinchZoom: true,
			enableDoubleTap: true,
			enableSwipeClose: true,
			showZoomIndicator: true,
			showCloseButton: true,
			closeOnClickOutside: true,
			closeOnEsc: true,
			minScale: DEFAULTS.minScale,
			maxScale: DEFAULTS.maxScale,
		}
	}

	return {
		src: binding?.src || elSrc,
		previewSrc: binding?.previewSrc || elPreviewSrc,
		alt: binding?.alt || elAlt,
		disabled: binding?.disabled ?? false,
		closeOnClickOutside: binding?.closeOnClickOutside ?? true,
		closeOnEsc: binding?.closeOnEsc ?? true,
		showCloseButton: binding?.showCloseButton ?? true,
		zIndex: binding?.zIndex,
		class: binding?.class,
		enablePinchZoom: binding?.enablePinchZoom ?? true,
		enableDoubleTap: binding?.enableDoubleTap ?? true,
		enableSwipeClose: binding?.enableSwipeClose ?? true,
		showZoomIndicator: binding?.showZoomIndicator ?? true,
		minScale: binding?.minScale ?? DEFAULTS.minScale,
		maxScale: binding?.maxScale ?? DEFAULTS.maxScale,
		onOpen: binding?.onOpen,
		onClose: binding?.onClose,
	}
}

// ============================================================================
// Directive
// ============================================================================

/**
 * v-image-preview directive
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Simple usage -->
 *   <img v-image-preview src="thumbnail.jpg" data-preview="full.jpg" />
 *
 *   <!-- With options -->
 *   <img v-image-preview="{ src: 'thumbnail.jpg', previewSrc: 'full.jpg' }" />
 *
 *   <!-- On non-img element -->
 *   <div v-image-preview="{ src: 'image.jpg' }">Click to preview</div>
 * </template>
 * ```
 */
export const vImagePreview = defineDirective<ImagePreviewBinding, HTMLElement>({
	name: 'image-preview',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value, el)

		const state: PreviewState = {
			options,
			overlay: null,
			imageContainer: null,
			image: null,
			isOpen: false,
			transform: { scale: 1, translateX: 0, translateY: 0 },
			gesture: {
				isDragging: false,
				startX: 0,
				startY: 0,
				startDistance: 0,
				startScale: 1,
				lastTapTime: 0,
				swipeStartY: 0,
			},
			handlers: {
				click: () => {},
				esc: null,
				touchStart: null,
				touchMove: null,
				touchEnd: null,
				mouseDown: null,
				mouseMove: null,
				mouseUp: null,
				wheel: null,
			},
		}

		;(el as any).__imagePreview = state

		if (options.disabled) return
		el.style.cursor = 'zoom-in'

		// Transform manager
		const transformManager = createTransformManager(state)

		// Close preview
		const closePreview = (): void => {
			if (!state.isOpen || !state.overlay) return

			state.overlay.style.opacity = '0'

			setTimeout(() => {
				if (!state.overlay) return

				state.overlay.remove()
				state.overlay = null
				state.imageContainer = null
				state.image = null
				state.isOpen = false
				state.transform = { scale: 1, translateX: 0, translateY: 0 }
				document.body.style.overflow = ''

				// Cleanup handlers
				const { handlers } = state
				if (handlers.esc) document.removeEventListener('keydown', handlers.esc)
				if (handlers.touchStart) document.removeEventListener('touchstart', handlers.touchStart)
				if (handlers.touchMove) document.removeEventListener('touchmove', handlers.touchMove)
				if (handlers.touchEnd) document.removeEventListener('touchend', handlers.touchEnd)
				if (handlers.mouseDown) document.removeEventListener('mousedown', handlers.mouseDown)
				if (handlers.mouseMove) document.removeEventListener('mousemove', handlers.mouseMove)
				if (handlers.mouseUp) document.removeEventListener('mouseup', handlers.mouseUp)
				if (handlers.wheel) document.removeEventListener('wheel', handlers.wheel)

				state.options.onClose?.()
			}, DEFAULTS.animationDuration)
		}

		// Gesture handlers
		const gestureHandlers = createGestureHandlers(state, transformManager, closePreview)

		// Open preview
		const openPreview = (): void => {
			if (state.isOpen || state.options.disabled) return

			const { overlay, imageContainer, image } = createOverlay(state.options)
			state.overlay = overlay
			state.imageContainer = imageContainer
			state.image = image
			state.isOpen = true

			document.body.appendChild(overlay)
			document.body.style.overflow = 'hidden'

			requestAnimationFrame(() => (overlay.style.opacity = '1'))

			// Store handlers
			state.handlers.touchStart = gestureHandlers.handleTouchStart
			state.handlers.touchMove = gestureHandlers.handleTouchMove
			state.handlers.touchEnd = gestureHandlers.handleTouchEnd
			state.handlers.mouseDown = gestureHandlers.handleMouseDown
			state.handlers.mouseMove = gestureHandlers.handleMouseMove
			state.handlers.mouseUp = gestureHandlers.handleMouseUp
			state.handlers.wheel = gestureHandlers.handleWheel

			// Touch events
			overlay.addEventListener('touchstart', gestureHandlers.handleTouchStart, { passive: false })
			overlay.addEventListener('touchmove', gestureHandlers.handleTouchMove, { passive: false })
			overlay.addEventListener('touchend', gestureHandlers.handleTouchEnd, { passive: true })

			// Mouse events
			image.addEventListener('mousedown', gestureHandlers.handleMouseDown)
			document.addEventListener('mousemove', gestureHandlers.handleMouseMove)
			document.addEventListener('mouseup', gestureHandlers.handleMouseUp)

			// Wheel zoom
			overlay.addEventListener('wheel', gestureHandlers.handleWheel, { passive: false })

			// Close button
			overlay.querySelector('.v-image-preview-close')?.addEventListener('click', e => {
				e.stopPropagation()
				closePreview()
			})

			// Click outside
			if (state.options.closeOnClickOutside !== false) {
				overlay.addEventListener('click', () => {
					if (state.transform.scale <= 1) {
						closePreview()
					} else {
						transformManager.resetTransform()
					}
				})
			}

			// Escape key
			if (state.options.closeOnEsc !== false) {
				state.handlers.esc = e => {
					if (e.key === 'Escape') {
						state.transform.scale > 1 ? transformManager.resetTransform() : closePreview()
					}
				}
				document.addEventListener('keydown', state.handlers.esc)
			}

			state.options.onOpen?.()
		}

		state.handlers.click = openPreview
		el.addEventListener('click', openPreview)
	},

	updated(el, binding) {
		const state = (el as any).__imagePreview as PreviewState | undefined
		if (!state) return

		state.options = normalizeOptions(binding.value, el)
		el.style.cursor = state.options.disabled ? '' : 'zoom-in'
	},

	unmounted(el) {
		const state = (el as any).__imagePreview as PreviewState | undefined
		if (!state) return

		el.removeEventListener('click', state.handlers.click)

		if (state.isOpen && state.overlay) {
			state.overlay.remove()
			document.body.style.overflow = ''
		}

		if (state.handlers.esc) document.removeEventListener('keydown', state.handlers.esc)
		if (state.handlers.touchStart) document.removeEventListener('touchstart', state.handlers.touchStart)
		if (state.handlers.touchMove) document.removeEventListener('touchmove', state.handlers.touchMove)
		if (state.handlers.touchEnd) document.removeEventListener('touchend', state.handlers.touchEnd)
		if (state.handlers.mouseDown) document.removeEventListener('mousedown', state.handlers.mouseDown)
		if (state.handlers.mouseMove) document.removeEventListener('mousemove', state.handlers.mouseMove)
		if (state.handlers.mouseUp) document.removeEventListener('mouseup', state.handlers.mouseUp)
		if (state.handlers.wheel) document.removeEventListener('wheel', state.handlers.wheel)

		delete (el as any).__imagePreview
	},
})

export default vImagePreview
