import { readonly, ref, type Ref, unref, watch } from 'vue'

/**
 * Truncate position
 */
export type TruncatePosition = 'start' | 'middle' | 'end'

/**
 * Options for useTruncate composable
 */
export interface UseTruncateOptions {
	/**
	 * Text to truncate
	 */
	text: string | Ref<string>

	/**
	 * Maximum length
	 * @default 100
	 */
	length?: number | Ref<number>

	/**
	 * Truncation position
	 * @default 'end'
	 */
	position?: TruncatePosition | Ref<TruncatePosition>

	/**
	 * Omission string
	 * @default '...'
	 */
	omission?: string
}

/**
 * Return type for useTruncate composable
 */
export interface UseTruncateReturn {
	/** Truncated text */
	truncated: Readonly<Ref<string>>

	/** Whether the text was truncated */
	isTruncated: Readonly<Ref<boolean>>

	/** Original text length */
	originalLength: Readonly<Ref<number>>

	/** Truncate a custom string */
	truncate: (text: string, length?: number, position?: TruncatePosition) => string
}

/**
 * Truncate text from the end
 */
function truncateEnd(text: string, length: number, omission: string): string {
	if (text.length <= length) return text
	return text.slice(0, length - omission.length) + omission
}

/**
 * Truncate text from the start
 */
function truncateStart(text: string, length: number, omission: string): string {
	if (text.length <= length) return text
	return omission + text.slice(-(length - omission.length))
}

/**
 * Truncate text from the middle
 */
function truncateMiddle(text: string, length: number, omission: string): string {
	if (text.length <= length) return text

	const availableLength = length - omission.length
	const startLength = Math.ceil(availableLength / 2)
	const endLength = Math.floor(availableLength / 2)

	return text.slice(0, startLength) + omission + text.slice(-endLength)
}

/**
 * Composable for text truncation
 *
 * @param options - Configuration options
 * @returns Truncation utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useTruncate } from 'directix'
 *
 * const longText = ref('This is a very long text that needs to be truncated')
 * const { truncated, isTruncated } = useTruncate({
 *   text: longText,
 *   length: 20,
 *   position: 'middle'
 * })
 * </script>
 *
 * <template>
 *   <span>{{ truncated }}</span>
 *   <span v-if="isTruncated" :title="longText">...</span>
 * </template>
 * ```
 */
export function useTruncate(options: UseTruncateOptions): UseTruncateReturn {
	const {
		text,
		length = 100,
		position = 'end',
		omission = '...',
	} = options

	const truncated = ref('')
	const isTruncated = ref(false)
	const originalLength = ref(0)

	function truncate(
		textValue: string,
		lengthValue?: number,
		positionValue?: TruncatePosition,
	): string {
		const maxLen = lengthValue ?? unref(length)
		const pos = positionValue ?? unref(position)

		if (textValue.length <= maxLen) {
			return textValue
		}

		switch (pos) {
			case 'start':
				return truncateStart(textValue, maxLen, omission)
			case 'middle':
				return truncateMiddle(textValue, maxLen, omission)
			case 'end':
			default:
				return truncateEnd(textValue, maxLen, omission)
		}
	}

	function update(): void {
		const textValue = unref(text)
		const lengthValue = unref(length)

		originalLength.value = textValue.length
		isTruncated.value = textValue.length > lengthValue
		truncated.value = truncate(textValue)
	}

	// Watch for changes
	watch(
		() => unref(text),
		update,
		{ immediate: true },
	)

	watch(
		() => unref(length),
		update,
	)

	watch(
		() => unref(position),
		update,
	)

	return {
		truncated: readonly(truncated),
		isTruncated: readonly(isTruncated),
		originalLength: readonly(originalLength),
		truncate,
	}
}
