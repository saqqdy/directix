import { defineDirective, isBrowser } from '@directix/core'

/**
 * Blur directive options
 */
export interface BlurOptions {
	/**
	 * Blur radius in pixels
	 * @default 10
	 */
	radius?: number

	/**
	 * Whether to show blur effect
	 * @default true
	 */
	visible?: boolean

	/**
	 * Transition duration in milliseconds
	 * @default 300
	 */
	duration?: number

	/**
	 * Overlay color
	 * @default 'rgba(0, 0, 0, 0.5)'
	 */
	overlayColor?: string

	/**
	 * Z-index for the blur overlay
	 * @default 999
	 */
	zIndex?: number

	/**
	 * Whether to lock scroll when blur is active
	 * @default true
	 */
	lockScroll?: boolean

	/**
	 * Custom class for blur container
	 */
	class?: string

	/**
	 * Callback when blur is shown
	 */
	onShow?: () => void

	/**
	 * Callback when blur is hidden
	 */
	onHide?: () => void
}

/**
 * Directive binding value type
 */
export type BlurBinding = boolean | number | BlurOptions

/**
 * Element state storage
 */
interface BlurState {
	options: BlurOptions
	blurContainer: HTMLDivElement | null
	originalOverflow: string
}

/**
 * Normalize options
 */
function normalizeOptions(binding: BlurBinding | undefined): BlurOptions {
	if (typeof binding === 'boolean') {
		return { visible: binding }
	}

	if (typeof binding === 'number') {
		return { radius: binding }
	}

	return {
		radius: 10,
		visible: true,
		duration: 300,
		overlayColor: 'rgba(0, 0, 0, 0.5)',
		zIndex: 999,
		lockScroll: true,
		...binding,
	}
}

/**
 * Create blur overlay element
 */
function createBlurOverlay(options: BlurOptions): HTMLDivElement {
	const overlay = document.createElement('div')
	overlay.className = `v-blur-overlay ${options.class || ''}`

	overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(${options.radius}px);
    -webkit-backdrop-filter: blur(${options.radius}px);
    background: ${options.overlayColor};
    z-index: ${options.zIndex};
    opacity: 0;
    transition: opacity ${options.duration}ms ease;
    pointer-events: auto;
  `

	return overlay
}

/**
 * v-blur directive
 * Background blur overlay effect
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Simple blur -->
 *   <div v-blur="isBlurred">Content behind blur</div>
 *
 *   <!-- With radius -->
 *   <div v-blur="15">Blur with 15px radius</div>
 *
 *   <!-- With options -->
 *   <div v-blur="{
 *     visible: isBlurred,
 *     radius: 20,
 *     overlayColor: 'rgba(255, 255, 255, 0.3)',
 *     lockScroll: true
 *   }">
 *     Content
 *   </div>
 * </template>
 * ```
 */
export const vBlur = defineDirective<BlurBinding, HTMLElement>({
	name: 'blur',
	ssr: false,

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)

		const state: BlurState = {
			options,
			blurContainer: null,
			originalOverflow: '',
		}

		;(el as any).__blur = state

		if (options.visible) {
			showBlur(el, state)
		}

		el.classList.add('v-blur')
	},

	updated(el, binding) {
		const state: BlurState = (el as any).__blur

		if (!state) return

		const newOptions = normalizeOptions(binding.value)
		const wasVisible = state.options.visible

		state.options = newOptions

		if (newOptions.visible && !wasVisible) {
			showBlur(el, state)
		} else if (!newOptions.visible && wasVisible) {
			hideBlur(el, state)
		} else if (newOptions.visible && wasVisible) {
			// Update blur effect
			if (state.blurContainer) {
				state.blurContainer.style.backdropFilter = `blur(${newOptions.radius}px)`
				;(state.blurContainer.style as any).webkitBackdropFilter = `blur(${newOptions.radius}px)`
				state.blurContainer.style.background = newOptions.overlayColor || 'rgba(0, 0, 0, 0.5)'
			}
		}
	},

	unmounted(el) {
		const state: BlurState = (el as any).__blur

		if (!state) return

		hideBlur(el, state)
		el.classList.remove('v-blur')

		delete (el as any).__blur
	},
})

/**
 * Show blur effect
 */
function showBlur(_el: HTMLElement, state: BlurState): void {
	const options = state.options

	// Create blur overlay
	state.blurContainer = createBlurOverlay(options)

	// Insert overlay
	document.body.appendChild(state.blurContainer)

	// Trigger reflow for transition
	String(state.blurContainer.offsetHeight)

	// Fade in
	state.blurContainer.style.opacity = '1'

	// Lock scroll
	if (options.lockScroll) {
		state.originalOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
	}

	options.onShow?.()
}

/**
 * Hide blur effect
 */
function hideBlur(_el: HTMLElement, state: BlurState): void {
	if (!state.blurContainer) return

	const options = state.options

	// Fade out
	state.blurContainer.style.opacity = '0'

	// Restore scroll
	if (options.lockScroll) {
		document.body.style.overflow = state.originalOverflow
	}

	// Remove after transition
	setTimeout(() => {
		if (state.blurContainer && state.blurContainer.parentNode) {
			state.blurContainer.parentNode.removeChild(state.blurContainer)
		}
		state.blurContainer = null
	}, options.duration)

	options.onHide?.()
}

export default vBlur
