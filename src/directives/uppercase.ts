import { defineDirective } from '@directix/core'
import { isInputElement, setupTextTransformInput, transformTextContent } from '../utils/text-transform'

/**
 * Uppercase directive options
 */
export interface UppercaseOptions {
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
export type UppercaseBinding = boolean | UppercaseOptions

/**
 * Transform text to uppercase
 */
function transformText(text: string, options: UppercaseOptions): string {
	if (!text) return text

	if (options.first) {
		return text.charAt(0).toUpperCase() + text.slice(1)
	}

	return text.toUpperCase()
}

/**
 * Normalize options
 */
function normalizeOptions(binding: UppercaseBinding | undefined): UppercaseOptions {
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
 * v-uppercase directive
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Transform all characters to uppercase -->
 *   <input v-uppercase v-model="text" />
 *
 *   <!-- Transform only first character -->
 *   <span v-uppercase="{ first: true }">{{ text }}</span>
 * </template>
 * ```
 */
export const vUppercase = defineDirective<UppercaseBinding, HTMLElement>({
	name: 'uppercase',
	ssr: true,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (isInputElement(el)) {
			const cleanup = setupTextTransformInput(el, options, text => transformText(text, options))

			;(el as any).__uppercaseCleanup = cleanup
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
		const cleanup: (() => void) | undefined = (el as any).__uppercaseCleanup

		cleanup?.()
		delete (el as any).__uppercaseCleanup
	},
})

export default vUppercase
