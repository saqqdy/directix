import { defineDirective } from '@directix/core'

/**
 * Watermark options
 */
export interface WatermarkOptions {
	/**
	 * Watermark text content
	 * @required
	 */
	content: string | string[]

	/**
	 * Width of watermark canvas
	 * @default 300
	 */
	width?: number

	/**
	 * Height of watermark canvas
	 * @default 200
	 */
	height?: number

	/**
	 * Rotation angle in degrees
	 * @default -22
	 */
	rotate?: number

	/**
	 * Font size in pixels
	 * @default 16
	 */
	fontSize?: number

	/**
	 * Font family
	 * @default 'sans-serif'
	 */
	fontFamily?: string

	/**
	 * Font weight
	 * @default 'normal'
	 */
	fontWeight?: string | number

	/**
	 * Font color
	 * @default 'rgba(128, 128, 128, 0.15)'
	 */
	color?: string

	/**
	 * Gap between watermarks in pixels
	 * @default [100, 100]
	 */
	gap?: [number, number] | number

	/**
	 * Z-index of watermark layer
	 * @default 9999
	 */
	zIndex?: number

	/**
	 * Whether to disable watermark (for dynamic control)
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Whether to prevent removal attempts
	 * @default true
	 */
	protect?: boolean
}

/**
 * Directive binding value type
 */
export type WatermarkBinding = string | WatermarkOptions

/**
 * Element state storage
 */
interface WatermarkState {
	options: WatermarkOptions
	watermarkEl: HTMLDivElement | null
	observer: MutationObserver | null
	canvas: HTMLCanvasElement | null
}

/**
 * Create watermark canvas
 */
function createWatermarkCanvas(options: WatermarkOptions): HTMLCanvasElement {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')

	if (!ctx) {
		throw new Error('[Directix] v-watermark: Could not get canvas context')
	}

	const width = options.width || 300
	const height = options.height || 200
	const fontSize = options.fontSize || 16
	const fontFamily = options.fontFamily || 'sans-serif'
	const fontWeight = options.fontWeight || 'normal'
	const color = options.color || 'rgba(128, 128, 128, 0.15)'
	const rotate = options.rotate ?? -22

	canvas.width = width
	canvas.height = height

	ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
	ctx.fillStyle = color
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'

	// Rotate canvas
	ctx.translate(width / 2, height / 2)
	ctx.rotate((rotate * Math.PI) / 180)

	// Draw text
	const content = Array.isArray(options.content) ? options.content : [options.content]
	const lineHeight = fontSize * 1.5
	const startY = -((content.length - 1) * lineHeight) / 2

	content.forEach((text, index) => {
		ctx.fillText(text, 0, startY + index * lineHeight)
	})

	return canvas
}

/**
 * Create watermark element
 */
function createWatermarkElement(canvas: HTMLCanvasElement, options: WatermarkOptions): HTMLDivElement {
	const gap = Array.isArray(options.gap) ? options.gap : [options.gap || 100, options.gap || 100]
	const zIndex = options.zIndex ?? 9999

	const el = document.createElement('div')
	el.className = 'v-watermark'
	el.style.cssText = `
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: ${zIndex};
		background-image: url("${canvas.toDataURL()}");
		background-repeat: repeat;
		background-position: ${gap[0] / 2}px ${gap[1] / 2}px;
		background-size: ${canvas.width + gap[0]}px ${canvas.height + gap[1]}px;
	`

	return el
}

/**
 * Normalize options
 */
function normalizeOptions(binding: WatermarkBinding): WatermarkOptions {
	if (typeof binding === 'string') {
		return { content: binding }
	}

	return {
		content: binding.content,
		width: binding.width ?? 300,
		height: binding.height ?? 200,
		rotate: binding.rotate ?? -22,
		fontSize: binding.fontSize ?? 16,
		fontFamily: binding.fontFamily ?? 'sans-serif',
		fontWeight: binding.fontWeight ?? 'normal',
		color: binding.color ?? 'rgba(128, 128, 128, 0.15)',
		gap: binding.gap ?? [100, 100],
		zIndex: binding.zIndex ?? 9999,
		disabled: binding.disabled ?? false,
		protect: binding.protect ?? true,
	}
}

/**
 * v-watermark directive
 *
 * Adds a watermark layer to an element.
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Simple watermark -->
 *   <div v-watermark="'Confidential'">Protected content</div>
 *
 *   <!-- Multi-line watermark -->
 *   <div v-watermark="{ content: ['Company Name', 'User: John'] }">
 *     Protected content
 *   </div>
 *
 *   <!-- Customized watermark -->
 *   <div v-watermark="{
 *     content: 'DRAFT',
 *     fontSize: 24,
 *     color: 'rgba(255, 0, 0, 0.2)',
 *     rotate: -30,
 *     gap: 50
 *   }">
 *     Draft document
 *   </div>
 * </template>
 * ```
 */
export const vWatermark = defineDirective<WatermarkBinding, HTMLElement>({
	name: 'watermark',
	ssr: true,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		// Make sure element has position
		const computedStyle = getComputedStyle(el)
		if (computedStyle.position === 'static') {
			el.style.position = 'relative'
		}

		const state: WatermarkState = {
			options,
			watermarkEl: null,
			observer: null,
			canvas: null,
		}

		;(el as any).__watermark = state

		if (!options.disabled) {
			applyWatermark(el, state)
		}
	},

	updated(el, binding) {
		const state: WatermarkState = (el as any).__watermark

		if (!state) return

		const newOptions = normalizeOptions(binding.value)

		// Check if disabled state changed
		if (newOptions.disabled && !state.options.disabled) {
			// Disable: remove watermark
			removeWatermark(state)
		} else if (!newOptions.disabled && state.options.disabled) {
			// Enable: add watermark
			state.options = newOptions
			applyWatermark(el, state)
		} else if (!newOptions.disabled) {
			// Update watermark
			state.options = newOptions
			removeWatermark(state)
			applyWatermark(el, state)
		}

		state.options = newOptions
	},

	unmounted(el) {
		const state: WatermarkState | undefined = (el as any).__watermark

		if (!state) return

		removeWatermark(state)

		delete (el as any).__watermark
	},
})

/**
 * Apply watermark to element
 */
function applyWatermark(el: HTMLElement, state: WatermarkState): void {
	const options = state.options

	// Create canvas
	state.canvas = createWatermarkCanvas(options)

	// Create watermark element
	state.watermarkEl = createWatermarkElement(state.canvas, options)

	// Append to element
	el.appendChild(state.watermarkEl)

	// Set up protection observer if enabled
	if (options.protect) {
		setupProtection(el, state)
	}
}

/**
 * Remove watermark
 */
function removeWatermark(state: WatermarkState): void {
	// Disconnect observer
	if (state.observer) {
		state.observer.disconnect()
		state.observer = null
	}

	// Remove watermark element
	if (state.watermarkEl && state.watermarkEl.parentNode) {
		state.watermarkEl.parentNode.removeChild(state.watermarkEl)
	}

	state.watermarkEl = null
	state.canvas = null
}

/**
 * Set up protection against removal
 */
function setupProtection(el: HTMLElement, state: WatermarkState): void {
	if (typeof MutationObserver === 'undefined') return

	state.observer = new MutationObserver(mutations => {
		// Check if watermark was removed
		if (!state.watermarkEl || !el.contains(state.watermarkEl)) {
			// Re-add watermark
			if (!state.options.disabled) {
				state.canvas = createWatermarkCanvas(state.options)
				state.watermarkEl = createWatermarkElement(state.canvas, state.options)
				el.appendChild(state.watermarkEl)
			}
		}

		// Check if watermark styles were modified
		for (const mutation of mutations) {
			if (mutation.type === 'attributes' && mutation.target === state.watermarkEl) {
				// Restore styles
				const gap = Array.isArray(state.options.gap) ? state.options.gap : [state.options.gap || 100, state.options.gap || 100]

				state.watermarkEl.style.display = 'block'
				state.watermarkEl.style.visibility = 'visible'
				state.watermarkEl.style.opacity = '1'
				if (state.canvas) {
					state.watermarkEl.style.backgroundImage = `url("${state.canvas.toDataURL()}")`
				}
				state.watermarkEl.style.backgroundSize = `${state.canvas!.width + gap[0]}px ${state.canvas!.height + gap[1]}px`
			}
		}
	})

	state.observer.observe(el, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['style', 'class', 'hidden'],
	})
}

export default vWatermark
