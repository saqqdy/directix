import { defineDirective, isBrowser } from '@directix/core'

/**
 * Highlight directive options
 */
export interface HighlightOptions {
	/**
	 * Keywords to highlight (string or array of strings)
	 */
	keywords: string | string[]

	/**
	 * Highlight style class name
	 * @default 'v-highlight'
	 */
	className?: string

	/**
	 * Inline style for highlighted text
	 */
	style?: string

	/**
	 * Whether to match case
	 * @default false
	 */
	caseSensitive?: boolean

	/**
	 * Whether to match whole words only
	 * @default false
	 */
	wholeWord?: boolean

	/**
	 * Tag name for highlight wrapper
	 * @default 'mark'
	 */
	tag?: string

	/**
	 * Callback when highlight is applied
	 */
	onHighlight?: (count: number) => void
}

/**
 * Directive binding value type
 */
export type HighlightBinding = string | string[] | HighlightOptions

/**
 * Element state storage
 */
interface HighlightState {
	options: HighlightOptions
	originalContent: string
}

/**
 * Normalize options
 */
function normalizeOptions(binding: HighlightBinding): HighlightOptions {
	if (typeof binding === 'string') {
		return { keywords: binding }
	}

	if (Array.isArray(binding)) {
		return { keywords: binding }
	}

	return {
		className: 'v-highlight',
		caseSensitive: false,
		wholeWord: false,
		tag: 'mark',
		...binding,
	}
}

/**
 * Escape regex special characters
 */
function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Highlight keywords in text
 */
function highlightKeywords(text: string, options: HighlightOptions): string {
	const keywords = Array.isArray(options.keywords) ? options.keywords : [options.keywords]

	if (keywords.length === 0 || !text) {
		return text
	}

	const caseSensitive = options.caseSensitive || false
	const wholeWord = options.wholeWord || false
	const tag = options.tag || 'mark'
	const className = options.className || 'v-highlight'
	const style = options.style ? ` style="${options.style}"` : ''

	// Sort keywords by length (longer first) to avoid nested highlights
	keywords.sort((a, b) => b.length - a.length)

	let result = text

	for (const keyword of keywords) {
		if (!keyword) continue

		const escapedKeyword = escapeRegex(keyword)
		const wordBoundary = wholeWord ? '\\b' : ''
		const flags = caseSensitive ? 'g' : 'gi'
		const pattern = new RegExp(`${wordBoundary}${escapedKeyword}${wordBoundary}`, flags)

		result = result.replace(pattern, `<${tag} class="${className}"${style}>$&</${tag}>`)
	}

	return result
}

/**
 * Check if element contains only text (no nested elements)
 */
function isTextNodeOnly(element: HTMLElement): boolean {
	for (const child of element.childNodes) {
		if (child.nodeType === Node.ELEMENT_NODE) {
			return false
		}
	}
	return true
}

/**
 * v-highlight directive
 *
 * @example
 * ```vue
 * <template>
 *   <p v-highlight="'important'">This is an important message.</p>
 *
 *   <p v-highlight="['Vue', 'React']">Vue and React are popular frameworks.</p>
 *
 *   <p v-highlight="{
 *     keywords: 'highlight',
 *     className: 'my-highlight',
 *     style: 'background: yellow; color: black;',
 *     caseSensitive: true
 *   }">
 *     This will highlight the word.
 *   </p>
 * </template>
 * ```
 */
export const vHighlight = defineDirective<HighlightBinding, HTMLElement>({
	name: 'highlight',
	ssr: true,

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)

		if (!options.keywords || (Array.isArray(options.keywords) && options.keywords.length === 0)) {
			return
		}

		// Store original content
		const state: HighlightState = {
			options,
			originalContent: el.innerHTML,
		}

		;(el as any).__highlight = state

		// Apply highlight
		applyHighlight(el, state)
	},

	updated(el, binding) {
		const state: HighlightState = (el as any).__highlight

		if (!state) {
			// New highlight
			const options = normalizeOptions(binding.value)
			if (options.keywords) {
				const newState: HighlightState = {
					options,
					originalContent: el.innerHTML,
				}
				;(el as any).__highlight = newState
				applyHighlight(el, newState)
			}
			return
		}

		const newOptions = normalizeOptions(binding.value)

		// Check if keywords changed
		const oldKeywords = Array.isArray(state.options.keywords) ? state.options.keywords.join(',') : state.options.keywords
		const newKeywords = Array.isArray(newOptions.keywords) ? newOptions.keywords.join(',') : newOptions.keywords

		if (oldKeywords !== newKeywords || JSON.stringify(state.options) !== JSON.stringify(newOptions)) {
			// Restore original content first
			el.innerHTML = state.originalContent
			state.options = newOptions
			state.originalContent = el.innerHTML
			applyHighlight(el, state)
		}
	},

	unmounted(el) {
		const state: HighlightState = (el as any).__highlight

		if (!state) return

		// Restore original content
		el.innerHTML = state.originalContent

		delete (el as any).__highlight
	},
})

/**
 * Apply highlight to element
 */
function applyHighlight(el: HTMLElement, state: HighlightState): void {
	// For text-only elements, we can use innerHTML
	if (isTextNodeOnly(el)) {
		const highlighted = highlightKeywords(state.originalContent, state.options)
		el.innerHTML = highlighted

		// Count highlights
		const count = el.querySelectorAll(state.options.tag || 'mark').length
		state.options.onHighlight?.(count)
	} else {
		// For elements with nested elements, we need to process text nodes
		processTextNodes(el, state)
	}
}

/**
 * Process text nodes in element tree
 */
function processTextNodes(element: HTMLElement, state: HighlightState): void {
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null)

	// Collect all text nodes
	const textNodes: Text[] = []
	let node = walker.nextNode() as Text | null,
		highlightCount = 0

	while (node) {
		// Skip text nodes inside our highlight tags
		if ((node.parentNode as Element)?.tagName?.toLowerCase() === (state.options.tag || 'mark').toLowerCase()) {
			node = walker.nextNode() as Text | null
			continue
		}
		textNodes.push(node)
		node = walker.nextNode() as Text | null
	}

	// Process each text node
	for (const textNode of textNodes) {
		const text = textNode.textContent || ''
		const highlighted = highlightKeywords(text, state.options)

		if (highlighted !== text) {
			// Create a temporary container to parse the HTML
			const temp = document.createElement('span')
			temp.innerHTML = highlighted

			// Replace text node with highlighted content
			const parent = textNode.parentNode
			if (parent) {
				parent.insertBefore(temp, textNode)
				parent.removeChild(textNode)

				// Unwrap the span if it's a direct child
				while (temp.firstChild) {
					parent.insertBefore(temp.firstChild, temp)
				}
				parent.removeChild(temp)
			}

			highlightCount += element.querySelectorAll(state.options.tag || 'mark').length
		}
	}

	state.options.onHighlight?.(highlightCount)
}

export default vHighlight
