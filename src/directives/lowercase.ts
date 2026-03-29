import { defineDirective } from '@directix/core'
import { isInputElement, setupTextTransformInput, transformTextContent } from '../utils/text-transform'

/**
 * Lowercase directive options
 */
export interface LowercaseOptions {
	/**
	 * Transform only the first character
	 * @default false
	 */
	first?: boolean

	/**
	 * Transform on input event (for input elements)
	 * @default true
	 */
	onInput?: boolean
}

/**
 * Directive binding value type
 */
export type LowercaseBinding = boolean | LowercaseOptions

/**
 * Transform text to lowercase
 */
function transformText(text: string, options: LowercaseOptions): string {
	if (!text) return text

	if (options.first) {
		return text.charAt(0).toLowerCase() + text.slice(1)
	}

	return text.toLowerCase()
}

/**
 * Normalize options
 */
function normalizeOptions(binding: LowercaseBinding | undefined): LowercaseOptions {
	if (binding === undefined || binding === true) {
		return { first: false, onInput: true }
	}

	if (binding === false) {
		return { first: false, onInput: false }
	}

	return {
		first: binding.first ?? false,
		onInput: binding.onInput ?? true,
	}
}

/**
 * v-lowercase directive
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Transform all characters to lowercase -->
 *   <input v-lowercase v-model="text" />
 *
 *   <!-- Transform only first character -->
 *   <span v-lowercase="{ first: true }">{{ text }}</span>
 * </template>
 * ```
 */
export const vLowercase = defineDirective<LowercaseBinding, HTMLElement>({
	name: 'lowercase',
	ssr: true,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (isInputElement(el)) {
			const cleanup = setupTextTransformInput(el, options, text => transformText(text, options))

			;(el as any).__lowercaseCleanup = cleanup
		} else {
			transformTextContent(el, text => transformText(text, options))
		}
	},

	updated(el, binding) {
		const options = normalizeOptions(binding.value)

		if (isInputElement(el)) {
			if (options.onInput) {
				el.value = transformText(el.value, options)
			}
		} else {
			transformTextContent(el, text => transformText(text, options))
		}
	},

	unmounted(el) {
		const cleanup: (() => void) | undefined = (el as any).__lowercaseCleanup

		cleanup?.()
		delete (el as any).__lowercaseCleanup
	},
})

export default vLowercase
