/**
 * Shared utilities for text transformation directives
 * (uppercase, lowercase, capitalcase, trim)
 */

/**
 * Base options for text transform directives
 */
export interface TextTransformOptions {
	/**
	 * Whether to transform on input event (for input elements)
	 * @default true
	 */
	onInput?: boolean
}

/**
 * Setup an input element with text transformation
 * Returns cleanup function
 */
export function setupTextTransformInput(
	el: HTMLInputElement | HTMLTextAreaElement,
	options: TextTransformOptions,
	transformFn: (text: string) => string,
): () => void {
	if (!options.onInput) {
		return () => {}
	}

	const handler = (): void => {
		const start = el.selectionStart
		const end = el.selectionEnd
		const originalValue = el.value
		const transformed = transformFn(originalValue)

		if (originalValue !== transformed) {
			el.value = transformed
			// Restore cursor position
			if (start !== null && end !== null) {
				el.setSelectionRange(start, end)
			}
			// Trigger input event for v-model
			el.dispatchEvent(new Event('input', { bubbles: true }))
		}
	}

	el.addEventListener('input', handler)

	// Initial transform
	el.value = transformFn(el.value)

	return () => {
		el.removeEventListener('input', handler)
	}
}

/**
 * Transform text content of a non-input element
 */
export function transformTextContent(el: HTMLElement, transformFn: (text: string) => string): void {
	const text = el.textContent || ''

	el.textContent = transformFn(text)
}

/**
 * Check if element is an input or textarea
 */
export function isInputElement(el: HTMLElement): el is HTMLInputElement | HTMLTextAreaElement {
	return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
}
