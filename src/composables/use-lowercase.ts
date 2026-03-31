import { ref, type Ref, unref, watch } from 'vue'

/**
 * Options for useLowercase composable
 */
export interface UseLowercaseOptions {
	/**
	 * The text to transform
	 */
	text: string | Ref<string>

	/**
	 * Transform only the first character
	 * @default false
	 */
	first?: boolean | Ref<boolean>
}

/**
 * Return type for useLowercase composable
 */
export interface UseLowercaseReturn {
	/**
	 * The transformed text
	 */
	transformed: Ref<string>

	/**
	 * Original text
	 */
	original: Ref<string>
}

/**
 * Transform text to lowercase
 */
function lowercaseText(text: string, firstOnly = false): string {
	if (!text) return text

	if (firstOnly) {
		return text.charAt(0).toLowerCase() + text.slice(1)
	}

	return text.toLowerCase()
}

/**
 * Composable for transforming text to lowercase
 *
 * @param options - Configuration options
 * @returns Lowercase text utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useLowercase } from 'directix'
 *
 * const text = ref('HELLO WORLD')
 *
 * const { transformed } = useLowercase({ text })
 * // transformed.value = 'hello world'
 * </script>
 *
 * <template>
 *   <p>{{ transformed }}</p>
 * </template>
 * ```
 */
export function useLowercase(options: UseLowercaseOptions): UseLowercaseReturn {
	const {
		text,
		first = false,
	} = options

	// State
	const original = ref(unref(text))
	const transformed = ref('')

	/**
	 * Calculate transformed text
	 */
	function calculate(): void {
		const textValue = unref(text)
		const firstValue = unref(first)

		original.value = textValue
		transformed.value = lowercaseText(textValue, firstValue)
	}

	// Watch for changes
	watch(
		() => [unref(text), unref(first)],
		() => calculate(),
		{ immediate: true },
	)

	return {
		transformed,
		original,
	}
}

/**
 * Utility function to transform text to lowercase
 *
 * @param text - Text to transform
 * @param first - Whether to transform only the first character
 * @returns Lowercase text
 *
 * @example
 * ```ts
 * import { lowercaseText } from 'directix'
 *
 * lowercaseText('HELLO WORLD') // 'hello world'
 * lowercaseText('HELLO WORLD', true) // 'hELLO WORLD'
 * ```
 */
export { lowercaseText }

/**
 * Create a lowercase transformation function
 *
 * @param first - Whether to transform only the first character
 * @returns Lowercase transformation function
 *
 * @example
 * ```ts
 * import { createLowercaser } from 'directix'
 *
 * const toLower = createLowercaser()
 * toLower('HELLO') // 'hello'
 *
 * const firstToLower = createLowercaser(true)
 * firstToLower('HELLO') // 'hELLO'
 * ```
 */
export function createLowercaser(first = false): (text: string) => string {
	return (text: string) => lowercaseText(text, first)
}
