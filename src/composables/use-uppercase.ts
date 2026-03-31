import { ref, type Ref, unref, watch } from 'vue'

/**
 * Options for useUppercase composable
 */
export interface UseUppercaseOptions {
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
 * Return type for useUppercase composable
 */
export interface UseUppercaseReturn {
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
 * Transform text to uppercase
 */
function uppercaseText(text: string, firstOnly = false): string {
	if (!text) return text

	if (firstOnly) {
		return text.charAt(0).toUpperCase() + text.slice(1)
	}

	return text.toUpperCase()
}

/**
 * Composable for transforming text to uppercase
 *
 * @param options - Configuration options
 * @returns Uppercase text utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useUppercase } from 'directix'
 *
 * const text = ref('hello world')
 *
 * const { transformed } = useUppercase({ text })
 * // transformed.value = 'HELLO WORLD'
 * </script>
 *
 * <template>
 *   <p>{{ transformed }}</p>
 * </template>
 * ```
 */
export function useUppercase(options: UseUppercaseOptions): UseUppercaseReturn {
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
		transformed.value = uppercaseText(textValue, firstValue)
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
 * Utility function to transform text to uppercase
 *
 * @param text - Text to transform
 * @param first - Whether to transform only the first character
 * @returns Uppercase text
 *
 * @example
 * ```ts
 * import { uppercaseText } from 'directix'
 *
 * uppercaseText('hello world') // 'HELLO WORLD'
 * uppercaseText('hello world', true) // 'Hello world'
 * ```
 */
export { uppercaseText }

/**
 * Create an uppercase transformation function
 *
 * @param first - Whether to transform only the first character
 * @returns Uppercase transformation function
 *
 * @example
 * ```ts
 * import { createUppercaser } from 'directix'
 *
 * const toUpper = createUppercaser()
 * toUpper('hello') // 'HELLO'
 *
 * const firstToUpper = createUppercaser(true)
 * firstToUpper('hello') // 'Hello'
 * ```
 */
export function createUppercaser(first = false): (text: string) => string {
	return (text: string) => uppercaseText(text, first)
}
