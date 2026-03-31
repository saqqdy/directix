import { isBrowser } from '@directix/core'
import { onUnmounted } from 'vue'

/**
 * Options for useSanitize composable
 */
export interface UseSanitizeOptions {
	/**
	 * Tags to allow (whitelist)
	 * @default ['b', 'i', 'u', 'strong', 'em', 'br', 'p', 'span', 'div']
	 */
	allowedTags?: string[]

	/**
	 * Attributes to allow (whitelist)
	 * @default ['title', 'alt', 'href', 'src']
	 */
	allowedAttributes?: string[]

	/**
	 * Whether to allow data URLs
	 * @default false
	 */
	allowDataUrls?: boolean

	/**
	 * Whether to allow inline styles
	 * @default false
	 */
	allowStyles?: boolean

	/**
	 * Whether to allow class attribute
	 * @default false
	 */
	allowClass?: boolean

	/**
	 * Whether to allow id attribute
	 * @default false
	 */
	allowId?: boolean

	/**
	 * Custom sanitize function
	 */
	handler?: (html: string) => string
}

/**
 * Return type for useSanitize composable
 */
export interface UseSanitizeReturn {
	/** Sanitize HTML string */
	sanitize: (html: string) => string

	/** Sanitize and set to element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Default allowed tags (safe subset)
 */
const DEFAULT_ALLOWED_TAGS = ['b', 'i', 'u', 'strong', 'em', 'br', 'p', 'span', 'div']

/**
 * Default allowed attributes
 */
const DEFAULT_ALLOWED_ATTRIBUTES = ['title', 'alt', 'href', 'src']

/**
 * Dangerous tags that should always be removed
 */
const DANGEROUS_TAGS = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'style', 'link', 'meta', 'base']

/**
 * Dangerous attributes that should always be removed
 */
const DANGEROUS_ATTRIBUTES = ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit']

/**
 * Composable for HTML sanitization
 *
 * @param options - Configuration options
 * @returns Sanitization utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useSanitize } from 'directix'
 *
 * const { sanitize } = useSanitize({
 *   allowedTags: ['b', 'i', 'p'],
 *   allowedAttributes: []
 * })
 *
 * const safeHtml = sanitize(userInput)
 * </script>
 * ```
 */
export function useSanitize(options: UseSanitizeOptions = {}): UseSanitizeReturn {
	const {
		allowedTags = DEFAULT_ALLOWED_TAGS,
		allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
		allowDataUrls = false,
		allowStyles = false,
		allowClass = false,
		allowId = false,
		handler,
	} = options

	function sanitizeHtml(html: string): string {
		// Use custom handler if provided
		if (handler) {
			return handler(html)
		}

		if (!isBrowser()) return html

		// Create a temporary element for parsing
		const temp = document.createElement('div')
		temp.innerHTML = html

		// Remove dangerous tags
		for (const tag of DANGEROUS_TAGS) {
			const elements = temp.getElementsByTagName(tag)
			while (elements.length > 0) {
				elements[0].parentNode?.removeChild(elements[0])
			}
		}

		// Process all elements
		const processElement = (el: Element): void => {
			const tagName = el.tagName.toLowerCase()

			if (!allowedTags.includes(tagName)) {
				const text = document.createTextNode(el.textContent || '')
				el.parentNode?.replaceChild(text, el)
				return
			}

			// Remove dangerous attributes
			for (const attr of DANGEROUS_ATTRIBUTES) {
				el.removeAttribute(attr)
			}

			// Remove javascript: URLs
			const href = el.getAttribute('href')
			if (href && href.toLowerCase().startsWith('javascript:')) {
				el.removeAttribute('href')
			}

			// Remove data: URLs if not allowed
			if (!allowDataUrls) {
				const src = el.getAttribute('src')
				if (src && src.toLowerCase().startsWith('data:')) {
					el.removeAttribute('src')
				}
			}

			// Filter attributes
			const attrs = Array.from(el.attributes)
			for (const attr of attrs) {
				const isAllowed = allowedAttributes.includes(attr.name.toLowerCase())
				const isClass = attr.name === 'class' && allowClass
				const isId = attr.name === 'id' && allowId
				const isStyle = attr.name === 'style' && allowStyles

				if (!isAllowed && !isClass && !isId && !isStyle) {
					el.removeAttribute(attr.name)
				}
			}

			// Process children
			for (const child of Array.from(el.children)) {
				processElement(child)
			}
		}

		// Process all child elements
		for (const child of Array.from(temp.children)) {
			processElement(child)
		}

		return temp.innerHTML
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Sanitize initial content
		const content = element.innerHTML
		if (content) {
			element.innerHTML = sanitizeHtml(content)
		}

		return () => {
		}
	}

	// Cleanup on unmount
	onUnmounted(() => {
	})

	return {
		sanitize: sanitizeHtml,
		bind,
	}
}
