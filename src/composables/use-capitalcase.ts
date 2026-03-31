import { ref, type Ref, unref, watch } from 'vue'

/**
 * Options for useCapitalcase composable
 */
export interface UseCapitalcaseOptions {
	/**
	 * The text to capitalize
	 */
	text: string | Ref<string>

	/**
	 * Whether to capitalize each word or just the first word
	 * @default true
	 */
	every?: boolean | Ref<boolean>

	/**
	 * Words to keep lowercase (articles, prepositions, etc.)
	 * @default ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by']
	 */
	keepLower?: string[] | Ref<string[]>
}

/**
 * Return type for useCapitalcase composable
 */
export interface UseCapitalcaseReturn {
	/**
	 * The capitalized text
	 */
	capitalized: Ref<string>

	/**
	 * Original text
	 */
	original: Ref<string>
}

/**
 * Default words to keep lowercase
 */
const DEFAULT_KEEP_LOWER = [
	'a', 'an', 'the',
	'and', 'but', 'or', 'for', 'nor',
	'on', 'at', 'to', 'from', 'by',
	'in', 'of', 'with', 'as',
]

/**
 * Capitalize a single word
 */
function capitalizeWord(word: string): string {
	if (!word) return word

	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

/**
 * Capitalize text based on options
 */
function capitalizeText(
	text: string,
	options: { every?: boolean, keepLower?: string[] } = {},
): string {
	if (!text) return text

	const { every = true, keepLower = DEFAULT_KEEP_LOWER } = options

	if (every) {
		// Capitalize each word
		const words = text.toLowerCase().split(/\s+/)

		return words
			.map((word, index) => {
				// Always capitalize first word
				if (index === 0) {
					return capitalizeWord(word)
				}
				// Keep certain words lowercase
				if (keepLower.includes(word.toLowerCase())) {
					return word.toLowerCase()
				}

				return capitalizeWord(word)
			})
			.join(' ')
	} else {
		// Capitalize only the first word
		return capitalizeWord(text)
	}
}

/**
 * Composable for capitalizing text
 *
 * @param options - Configuration options
 * @returns Capitalized text utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useCapitalcase } from 'directix'
 *
 * const title = ref('the quick brown fox')
 *
 * const { capitalized } = useCapitalcase({
 *   text: title,
 *   every: true
 * })
 * // capitalized.value = 'The Quick Brown Fox'
 * </script>
 *
 * <template>
 *   <h1>{{ capitalized }}</h1>
 * </template>
 * ```
 */
export function useCapitalcase(options: UseCapitalcaseOptions): UseCapitalcaseReturn {
	const {
		text,
		every = true,
		keepLower = DEFAULT_KEEP_LOWER,
	} = options

	// State
	const original = ref(unref(text))
	const capitalized = ref('')

	/**
	 * Calculate capitalized text
	 */
	function calculate(): void {
		const textValue = unref(text)
		const everyValue = unref(every)
		const keepLowerValue = unref(keepLower)

		original.value = textValue
		capitalized.value = capitalizeText(textValue, {
			every: everyValue,
			keepLower: keepLowerValue,
		})
	}

	// Watch for changes
	watch(
		() => [unref(text), unref(every), unref(keepLower)],
		() => calculate(),
		{ immediate: true },
	)

	return {
		capitalized,
		original,
	}
}

/**
 * Utility function to capitalize text
 *
 * @param text - Text to capitalize
 * @param every - Whether to capitalize each word
 * @param keepLower - Words to keep lowercase
 * @returns Capitalized text
 *
 * @example
 * ```ts
 * import { capitalizeText } from 'directix'
 *
 * const title = capitalizeText('the quick brown fox')
 * // 'The Quick Brown Fox'
 *
 * const sentence = capitalizeText('the quick brown fox', false)
 * // 'The quick brown fox'
 * ```
 */
export { capitalizeText, capitalizeWord }

/**
 * Create a capitalizing function with preset options
 *
 * @param options - Capitalization options
 * @returns Capitalization function
 *
 * @example
 * ```ts
 * import { createCapitalizer } from 'directix'
 *
 * const titleCase = createCapitalizer({ every: true })
 * const sentenceCase = createCapitalizer({ every: false })
 *
 * titleCase('the quick brown fox') // 'The Quick Brown Fox'
 * sentenceCase('the quick brown fox') // 'The quick brown fox'
 * ```
 */
export function createCapitalizer(
	options: { every?: boolean, keepLower?: string[] } = {},
): (text: string) => string {
	return (text: string) => capitalizeText(text, options)
}
