import { onUnmounted, ref, type Ref, unref, watch } from 'vue'

/**
 * Options for useWatermark composable
 */
export interface UseWatermarkOptions {
	/**
	 * Watermark text content
	 * @required
	 */
	content: string | string[] | Ref<string | string[]>

	/**
	 * Width of watermark canvas
	 * @default 300
	 */
	width?: number | Ref<number>

	/**
	 * Height of watermark canvas
	 * @default 200
	 */
	height?: number | Ref<number>

	/**
	 * Rotation angle in degrees
	 * @default -22
	 */
	rotate?: number | Ref<number>

	/**
	 * Font size in pixels
	 * @default 16
	 */
	fontSize?: number | Ref<number>

	/**
	 * Font family
	 * @default 'sans-serif'
	 */
	fontFamily?: string | Ref<string>

	/**
	 * Font weight
	 * @default 'normal'
	 */
	fontWeight?: string | number | Ref<string | number>

	/**
	 * Font color
	 * @default 'rgba(128, 128, 128, 0.15)'
	 */
	color?: string | Ref<string>

	/**
	 * Gap between watermarks in pixels
	 * @default [100, 100]
	 */
	gap?: [number, number] | number | Ref<[number, number] | number>

	/**
	 * Z-index of watermark layer
	 * @default 9999
	 */
	zIndex?: number | Ref<number>

	/**
	 * Whether to disable watermark
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>

	/**
	 * Whether to prevent removal attempts
	 * @default true
	 */
	protect?: boolean | Ref<boolean>
}

/**
 * Return type for useWatermark composable
 */
export interface UseWatermarkReturn {
	/**
	 * Watermark canvas element
	 */
	canvas: Ref<HTMLCanvasElement | null>

	/**
	 * Watermark data URL
	 */
	dataUrl: Ref<string>

	/**
	 * Watermark CSS style object
	 */
	style: Ref<{
		position: string
		top: string
		left: string
		width: string
		height: string
		pointerEvents: string
		zIndex: number
		backgroundImage: string
		backgroundRepeat: string
		backgroundPosition: string
		backgroundSize: string
		display?: string
	}>

	/**
	 * Whether watermark is disabled
	 */
	disabled: Ref<boolean>

	/**
	 * Update watermark options
	 */
	update: (options: Partial<UseWatermarkOptions>) => void

	/**
	 * Enable watermark
	 */
	enable: () => void

	/**
	 * Disable watermark
	 */
	disable: () => void
}

/**
 * Create watermark canvas
 */
function createWatermarkCanvas(options: {
	content: string | string[]
	width: number
	height: number
	fontSize: number
	fontFamily: string
	fontWeight: string | number
	color: string
	rotate: number
}): HTMLCanvasElement {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')

	if (!ctx) {
		throw new Error('[Directix] useWatermark: Could not get canvas context')
	}

	const {
		content,
		width,
		height,
		fontSize,
		fontFamily,
		fontWeight,
		color,
		rotate,
	} = options

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
	const contentArray = Array.isArray(content) ? content : [content]
	const lineHeight = fontSize * 1.5
	const startY = -((contentArray.length - 1) * lineHeight) / 2

	contentArray.forEach((text, index) => {
		ctx.fillText(text, 0, startY + index * lineHeight)
	})

	return canvas
}

/**
 * Composable for creating watermark overlays
 *
 * @param options - Configuration options
 * @returns Watermark utilities and state
 *
 * @example
 * ```vue
 * <script setup>
 * import { useWatermark } from 'directix'
 *
 * const { dataUrl, style, disable, enable } = useWatermark({
 *   content: 'Confidential',
 *   fontSize: 20,
 *   color: 'rgba(255, 0, 0, 0.2)'
 * })
 * </script>
 *
 * <template>
 *   <div class="container">
 *     <div :style="style"></div>
 *     <slot></slot>
 *   </div>
 * </template>
 * ```
 */
export function useWatermark(options: UseWatermarkOptions): UseWatermarkReturn {
	const {
		content,
		width = 300,
		height = 200,
		rotate = -22,
		fontSize = 16,
		fontFamily = 'sans-serif',
		fontWeight = 'normal',
		color = 'rgba(128, 128, 128, 0.15)',
		gap = [100, 100],
		zIndex = 9999,
		disabled = false,
		protect: _protect = true,
	} = options

	// State
	const canvas = ref<HTMLCanvasElement | null>(null)
	const dataUrl = ref('')
	const disabledRef = ref(unref(disabled))

	/**
	 * Generate watermark
	 */
	function generate(): void {
		const contentValue = unref(content)
		const widthValue = unref(width)
		const heightValue = unref(height)
		const rotateValue = unref(rotate)
		const fontSizeValue = unref(fontSize)
		const fontFamilyValue = unref(fontFamily)
		const fontWeightValue = unref(fontWeight)
		const colorValue = unref(color)

		canvas.value = createWatermarkCanvas({
			content: contentValue,
			width: widthValue,
			height: heightValue,
			fontSize: fontSizeValue,
			fontFamily: fontFamilyValue,
			fontWeight: fontWeightValue,
			color: colorValue,
			rotate: rotateValue,
		})

		dataUrl.value = canvas.value.toDataURL()
	}

	/**
	 * Get style object
	 */
	const style = ref<{
		position: string
		top: string
		left: string
		width: string
		height: string
		pointerEvents: string
		zIndex: number
		backgroundImage: string
		backgroundRepeat: string
		backgroundPosition: string
		backgroundSize: string
		display?: string
	}>({
		position: 'absolute',
		top: '0',
		left: '0',
		width: '100%',
		height: '100%',
		pointerEvents: 'none',
		zIndex: unref(zIndex),
		backgroundImage: '',
		backgroundRepeat: 'repeat',
		backgroundPosition: '0 0',
		backgroundSize: '',
	})

	/**
	 * Update style based on current options
	 */
	function updateStyle(): void {
		const gapValue = unref(gap)
		const zIndexValue = unref(zIndex)
		const gapArray = Array.isArray(gapValue) ? gapValue : [gapValue, gapValue]
		const widthValue = unref(width)
		const heightValue = unref(height)

		style.value = {
			...style.value,
			zIndex: zIndexValue,
			backgroundImage: `url("${dataUrl.value}")`,
			backgroundPosition: `${gapArray[0] / 2}px ${gapArray[1] / 2}px`,
			backgroundSize: `${widthValue + gapArray[0]}px ${heightValue + gapArray[1]}px`,
		}
	}

	/**
	 * Update watermark options
	 */
	function update(newOptions: Partial<UseWatermarkOptions>): void {
		Object.assign(options, newOptions)
		generate()
		updateStyle()
	}

	/**
	 * Enable watermark
	 */
	function enable(): void {
		disabledRef.value = false
	}

	/**
	 * Disable watermark
	 */
	function disable(): void {
		disabledRef.value = true
	}

	// Watch for changes
	watch(
		() => [
			unref(content),
			unref(width),
			unref(height),
			unref(rotate),
			unref(fontSize),
			unref(fontFamily),
			unref(fontWeight),
			unref(color),
			unref(gap),
			unref(zIndex),
		],
		() => {
			generate()
			updateStyle()
		},
		{ immediate: true },
	)

	// Watch disabled state
	watch(disabledRef, isDisabled => {
		style.value.display = isDisabled ? 'none' : 'block'
	})

	// Initial state
	if (unref(disabled)) {
		style.value.display = 'none'
	}

	// Cleanup
	onUnmounted(() => {
		// Observer cleanup if needed
	})

	return {
		canvas,
		dataUrl,
		style,
		disabled: disabledRef,
		update,
		enable,
		disable,
	}
}

/**
 * Create a simple watermark data URL
 *
 * @param content - Watermark text
 * @param options - Additional options
 * @returns Data URL string
 *
 * @example
 * ```ts
 * import { createWatermarkUrl } from 'directix'
 *
 * const url = createWatermarkUrl('Confidential', { fontSize: 20 })
 * // Use as background-image: url(dataUrl)
 * ```
 */
export function createWatermarkUrl(
	content: string | string[],
	options: {
		width?: number
		height?: number
		fontSize?: number
		color?: string
		rotate?: number
	} = {},
): string {
	const canvas = createWatermarkCanvas({
		content,
		width: options.width ?? 300,
		height: options.height ?? 200,
		fontSize: options.fontSize ?? 16,
		fontFamily: 'sans-serif',
		fontWeight: 'normal',
		color: options.color ?? 'rgba(128, 128, 128, 0.15)',
		rotate: options.rotate ?? -22,
	})

	return canvas.toDataURL()
}
