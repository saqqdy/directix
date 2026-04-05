import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, ref, unref, watch } from 'vue'

/**
 * Options for useHighlight composable
 */
export interface UseHighlightOptions {
	/** Keywords to highlight */
	keywords: string | string[] | Ref<string | string[]>

	/** Highlight class name */
	className?: string

	/** Inline style */
	style?: string

	/** Case sensitive */
	caseSensitive?: boolean

	/** Whole word only */
	wholeWord?: boolean

	/** Tag name for highlight */
	tag?: string
}

/**
 * Return type for useHighlight composable
 */
export interface UseHighlightReturn {
	/** Highlight count */
	count: Ref<number>

	/** Update keywords */
	updateKeywords: (keywords: string | string[]) => void

	/** Bind highlight to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Escape regex characters
 */
function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Highlight keywords in text
 */
function highlightText(text: string, options: UseHighlightOptions): { html: string, count: number } {
	const keywords = unref(options.keywords)
	const keywordArray = Array.isArray(keywords) ? keywords : [keywords]

	if (keywordArray.length === 0 || !text) {
		return { html: text, count: 0 }
	}

	const caseSensitive = options.caseSensitive || false
	const wholeWord = options.wholeWord || false
	const tag = options.tag || 'mark'
	const className = options.className || 'v-highlight'
	const style = options.style ? ` style="${options.style}"` : ''

	// Sort by length (longest first)
	keywordArray.sort((a, b) => b.length - a.length)

	let result = text,
		count = 0

	for (const keyword of keywordArray) {
		if (!keyword) continue

		const escapedKeyword = escapeRegex(keyword)
		const wordBoundary = wholeWord ? '\\b' : ''
		const flags = caseSensitive ? 'g' : 'gi'
		const pattern = new RegExp(`${wordBoundary}${escapedKeyword}${wordBoundary}`, flags)

		result = result.replace(pattern, match => {
			count++
			return `<${tag} class="${className}"${style}>${match}</${tag}>`
		})
	}

	return { html: result, count }
}

/**
 * Composable for highlighting keywords
 *
 * @param options - Configuration options
 * @returns Highlight utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useHighlight } from 'directix'
 *
 * const containerRef = ref(null)
 * const { count, bind } = useHighlight({
 *   keywords: ['Vue', 'React'],
 *   className: 'my-highlight'
 * })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <p ref="containerRef">Vue and React are popular frameworks.</p>
 * </template>
 * ```
 */
export function useHighlight(options: UseHighlightOptions): UseHighlightReturn {
	const count = ref(0)

	let currentElement: HTMLElement | null = null,
		originalContent = ''

	function updateKeywords(keywords: string | string[]): void {
		options.keywords = keywords
		applyHighlight()
	}

	function applyHighlight(): void {
		if (!currentElement) return

		// Restore original content
		currentElement.innerHTML = originalContent

		// Apply highlight
		const { html, count: highlightCount } = highlightText(originalContent, options)
		currentElement.innerHTML = html
		count.value = highlightCount
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element
		originalContent = element.innerHTML

		// Watch for keyword changes
		if (typeof options.keywords !== 'string' && !Array.isArray(options.keywords)) {
			watch(options.keywords, () => {
				applyHighlight()
			})
		}

		applyHighlight()

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			currentElement.innerHTML = originalContent
		}
		currentElement = null
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		count,
		updateKeywords,
		bind,
	}
}
