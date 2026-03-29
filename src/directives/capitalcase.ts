import { defineDirective } from '@directix/core'
import { isInputElement, setupTextTransformInput, transformTextContent } from '../utils/text-transform'

/**
 * Capitalcase directive options
 */
export interface CapitalcaseOptions {
	/**
	 * Whether to capitalize each word or just the first word
	 * @default true
	 */
	every?: boolean

	/**
	 * Words to keep lowercase (articles, prepositions, etc.)
	 * @default ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by']
	 */
	keepLower?: string[]

	/**
	 * Whether to transform on input (for input elements)
	 * @default true
	 */
	onInput?: boolean
}

/**
 * Directive binding value type
 */
export type CapitalcaseBinding = boolean | CapitalcaseOptions

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
 * Capitalize text based on options
 */
function capitalizeText(text: string, options: CapitalcaseOptions): string {
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
 * Capitalize a single word
 */
function capitalizeWord(word: string): string {
	if (!word) return word

	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

/**
 * Normalize options
 */
function normalizeOptions(binding: CapitalcaseBinding | undefined): CapitalcaseOptions {
	if (binding === undefined || binding === true) {
		return { every: true, onInput: true }
	}

	if (binding === false) {
		return { every: false, onInput: false }
	}

	return {
		every: binding.every ?? true,
		keepLower: binding.keepLower ?? DEFAULT_KEEP_LOWER,
		onInput: binding.onInput ?? true,
	}
}

/**
 * v-capitalcase directive
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Simple usage: capitalize each word -->
 *   <input v-capitalcase v-model="title" />
 *
 *   <!-- Capitalize only first word -->
 *   <span v-capitalcase="{ every: false }">{{ text }}</span>
 *
 *   <!-- With custom lowercase words -->
 *   <input v-capitalcase="{ keepLower: ['a', 'the'] }" v-model="title" />
 * </template>
 * ```
 */
export const vCapitalcase = defineDirective<CapitalcaseBinding, HTMLElement>({
	name: 'capitalcase',
	ssr: true,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (isInputElement(el)) {
			const cleanup = setupTextTransformInput(el, options, text => capitalizeText(text, options))

			;(el as any).__capitalcaseCleanup = cleanup
		} else {
			transformTextContent(el, text => capitalizeText(text, options))
		}
	},

	updated(el, binding) {
		const options = normalizeOptions(binding.value)

		if (isInputElement(el)) {
			if (options.onInput) {
				el.value = capitalizeText(el.value, options)
			}
		} else {
			transformTextContent(el, text => capitalizeText(text, options))
		}
	},

	unmounted(el) {
		const cleanup: (() => void) | undefined = (el as any).__capitalcaseCleanup

		cleanup?.()
		delete (el as any).__capitalcaseCleanup
	},
})

export default vCapitalcase
