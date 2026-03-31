import { ref, type Ref, unref, watch } from 'vue'

/**
 * Trim position
 */
export type TrimPosition = 'start' | 'end' | 'both'

/**
 * Options for useTrim composable
 */
export interface UseTrimOptions {
	/**
	 * The text to trim
	 */
	text: string | Ref<string>

	/**
	 * Trim position
	 * @default 'both'
	 */
	position?: TrimPosition | Ref<TrimPosition>

	/**
	 * Custom characters to trim (in addition to whitespace)
	 */
	chars?: string | Ref<string>
}

/**
 * Return type for useTrim composable
 */
export interface UseTrimReturn {
	/**
	 * The trimmed text
	 */
	trimmed: Ref<string>

	/**
	 * Original text
	 */
	original: Ref<string>

	/**
	 * Whether the text was trimmed
	 */
	wasTrimmed: Ref<boolean>
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Trim text based on options
 */
function trimText(
	text: string,
	position: TrimPosition = 'both',
	chars?: string,
): string {
	// Build regex pattern for custom chars
	const charPattern = chars ? `[\\s${escapeRegex(chars)}]` : '\\s'

	switch (position) {
		case 'start':
			return text.replace(new RegExp(`^${charPattern}+`, 'g'), '')

		case 'end':
			return text.replace(new RegExp(`${charPattern}+$`, 'g'), '')

		case 'both':
		default:
			return text.replace(new RegExp(`^${charPattern}+|${charPattern}+$`, 'g'), '')
	}
}

/**
 * Composable for trimming text
 *
 * @param options - Configuration options
 * @returns Trimmed text utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useTrim } from 'directix'
 *
 * const text = ref('  hello world  ')
 *
 * const { trimmed, wasTrimmed } = useTrim({ text })
 * // trimmed.value = 'hello world'
 * // wasTrimmed.value = true
 * </script>
 *
 * <template>
 *   <p>{{ trimmed }}</p>
 * </template>
 * ```
 */
export function useTrim(options: UseTrimOptions): UseTrimReturn {
	const {
		text,
		position = 'both',
		chars,
	} = options

	// State
	const original = ref(unref(text))
	const trimmed = ref('')
	const wasTrimmed = ref(false)

	/**
	 * Calculate trimmed text
	 */
	function calculate(): void {
		const textValue = unref(text)
		const positionValue = unref(position)
		const charsValue = unref(chars)

		original.value = textValue
		trimmed.value = trimText(textValue, positionValue, charsValue)
		wasTrimmed.value = trimmed.value !== textValue
	}

	// Watch for changes
	watch(
		() => [unref(text), unref(position), unref(chars)],
		() => calculate(),
		{ immediate: true },
	)

	return {
		trimmed,
		original,
		wasTrimmed,
	}
}

/**
 * Utility function to trim text
 *
 * @param text - Text to trim
 * @param position - Trim position
 * @param chars - Custom characters to trim
 * @returns Trimmed text
 *
 * @example
 * ```ts
 * import { trimText } from 'directix'
 *
 * trimText('  hello  ') // 'hello'
 * trimText('  hello  ', 'start') // 'hello  '
 * trimText('**hello**', 'both', '*') // 'hello'
 * ```
 */
export { trimText }

/**
 * Create a trim function with preset options
 *
 * @param position - Trim position
 * @param chars - Custom characters to trim
 * @returns Trim function
 *
 * @example
 * ```ts
 * import { createTrimmer } from 'directix'
 *
 * const trimStart = createTrimmer('start')
 * trimStart('  hello  ') // 'hello  '
 *
 * const trimAsterisks = createTrimmer('both', '*')
 * trimAsterisks('**hello**') // 'hello'
 * ```
 */
export function createTrimmer(
	position: TrimPosition = 'both',
	chars?: string,
): (text: string) => string {
	return (text: string) => trimText(text, position, chars)
}
