import { onUnmounted, ref, type Ref, unref, watch } from 'vue'

/**
 * Options for useEllipsis composable
 */
export interface UseEllipsisOptions {
	/**
	 * The text to potentially truncate
	 */
	text: string | Ref<string>

	/**
	 * Number of lines to show before truncating
	 * @default 1
	 */
	lines?: number | Ref<number>

	/**
	 * Custom ellipsis string
	 * @default '...'
	 */
	ellipsis?: string | Ref<string>

	/**
	 * Maximum width in pixels (0 = no limit)
	 * @default 0
	 */
	maxWidth?: number | Ref<number>
}

/**
 * Return type for useEllipsis composable
 */
export interface UseEllipsisReturn {
	/**
	 * The truncated text
	 */
	truncated: Ref<string>

	/**
	 * Whether the text is truncated
	 */
	isTruncated: Ref<boolean>

	/**
	 * Original text
	 */
	original: Ref<string>

	/**
	 * Calculate truncation for a given width
	 */
	calculateForWidth: (width: number) => string

	/**
	 * Check if text would be truncated at given width
	 */
	wouldTruncate: (width: number) => boolean
}

/**
 * Measure text width using canvas
 */
function measureTextWidth(text: string, fontSize: number = 14, fontFamily: string = 'sans-serif'): number {
	if (typeof document === 'undefined') return text.length * 8 // Fallback for SSR

	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')

	if (!ctx) return text.length * 8

	ctx.font = `${fontSize}px ${fontFamily}`
	return ctx.measureText(text).width
}

/**
 * Truncate text to fit within a given width
 */
function truncateToWidth(
	text: string,
	maxWidth: number,
	ellipsis: string = '...',
	fontSize: number = 14,
	fontFamily: string = 'sans-serif',
): string {
	if (maxWidth <= 0) return text

	const textWidth = measureTextWidth(text, fontSize, fontFamily)

	if (textWidth <= maxWidth) return text

	const ellipsisWidth = measureTextWidth(ellipsis, fontSize, fontFamily)
	const availableWidth = maxWidth - ellipsisWidth

	if (availableWidth <= 0) return ellipsis

	// Binary search for the right length
	let low = 0,
		high = text.length

	while (low < high) {
		const mid = Math.floor((low + high + 1) / 2)
		const truncatedText = text.slice(0, mid)
		const truncatedWidth = measureTextWidth(truncatedText, fontSize, fontFamily)

		if (truncatedWidth <= availableWidth) {
			low = mid
		} else {
			high = mid - 1
		}
	}

	return text.slice(0, low) + ellipsis
}

/**
 * Truncate text to specified number of lines
 * Note: This is an approximation; actual line breaks depend on container width
 */
function truncateToLines(
	text: string,
	lines: number,
	ellipsis: string = '...',
): string {
	if (lines <= 0) return ''

	// For multi-line truncation, we approximate by character count
	// In practice, this would need a DOM element for accurate measurement
	const avgCharsPerLine = 80 // Approximate
	const maxChars = lines * avgCharsPerLine

	if (text.length <= maxChars) return text

	return text.slice(0, maxChars - ellipsis.length) + ellipsis
}

/**
 * Composable for text truncation with ellipsis
 *
 * @param options - Configuration options
 * @returns Truncated text utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useEllipsis } from 'directix'
 *
 * const longText = ref('This is a very long text that needs to be truncated')
 *
 * const { truncated, isTruncated } = useEllipsis({
 *   text: longText,
 *   maxWidth: 200,
 *   lines: 1
 * })
 * </script>
 *
 * <template>
 *   <span :title="isTruncated ? longText : ''">
 *     {{ truncated }}
 *   </span>
 * </template>
 * ```
 */
export function useEllipsis(options: UseEllipsisOptions): UseEllipsisReturn {
	const {
		text,
		lines = 1,
		ellipsis = '...',
		maxWidth = 0,
	} = options

	// State
	const original = ref(unref(text))
	const truncated = ref('')
	const isTruncated = ref(false)

	/**
	 * Calculate truncation
	 */
	function calculate(): void {
		const textValue = unref(text)
		const linesValue = unref(lines)
		const ellipsisValue = unref(ellipsis)
		const maxWidthValue = unref(maxWidth)

		original.value = textValue

		if (!textValue) {
			truncated.value = ''
			isTruncated.value = false
			return
		}

		if (maxWidthValue > 0) {
			// Truncate by width
			const result = truncateToWidth(textValue, maxWidthValue, ellipsisValue)
			truncated.value = result
			isTruncated.value = result !== textValue
		} else if (linesValue > 1) {
			// Truncate by lines
			const result = truncateToLines(textValue, linesValue, ellipsisValue)
			truncated.value = result
			isTruncated.value = result !== textValue
		} else {
			// Single line truncation (CSS should handle this)
			truncated.value = textValue
			isTruncated.value = false
		}
	}

	/**
	 * Calculate truncation for a given width
	 */
	function calculateForWidth(width: number): string {
		const textValue = unref(text)
		const ellipsisValue = unref(ellipsis)

		if (!textValue || width <= 0) return textValue || ''

		return truncateToWidth(textValue, width, ellipsisValue)
	}

	/**
	 * Check if text would be truncated at given width
	 */
	function wouldTruncate(width: number): boolean {
		const textValue = unref(text)

		if (!textValue || width <= 0) return false

		const textWidth = measureTextWidth(textValue)
		return textWidth > width
	}

	// Watch for changes
	watch(
		() => [unref(text), unref(lines), unref(ellipsis), unref(maxWidth)],
		() => calculate(),
		{ immediate: true },
	)

	// Cleanup
	onUnmounted(() => {
		// Nothing to clean up
	})

	return {
		truncated,
		isTruncated,
		original,
		calculateForWidth,
		wouldTruncate,
	}
}

/**
 * Utility function to truncate text to a specified length
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param ellipsis - Ellipsis string
 * @returns Truncated text
 *
 * @example
 * ```ts
 * import { truncateText } from 'directix'
 *
 * const short = truncateText('Very long text here', 10)
 * // 'Very l...'
 * ```
 */
export function truncateText(
	text: string,
	maxLength: number,
	ellipsis: string = '...',
): string {
	if (!text || text.length <= maxLength) return text

	return text.slice(0, maxLength - ellipsis.length) + ellipsis
}

/**
 * Utility function to check if text would be truncated in a container
 *
 * @param text - Text to check
 * @param containerWidth - Container width in pixels
 * @param fontSize - Font size in pixels
 * @returns Whether text would be truncated
 */
export function wouldTextTruncate(
	text: string,
	containerWidth: number,
	fontSize: number = 14,
): boolean {
	return measureTextWidth(text, fontSize) > containerWidth
}
