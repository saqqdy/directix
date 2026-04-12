import { defineDirective, isBrowser } from '@directix/core'

/**
 * Sanitize handler
 */
export type SanitizeHandler = (value: string) => string

/**
 * Sanitize directive options
 */
export interface SanitizeOptions {
	/**
	 * Tags to allow (whitelist)
	 * @default []
	 */
	allowedTags?: string[]

	/**
	 * Attributes to allow (whitelist)
	 * @default []
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
	handler?: SanitizeHandler

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Whether to sanitize on update
	 * @default true
	 */
	sanitizeOnUpdate?: boolean
}

/**
 * Directive binding value type
 */
export type SanitizeBinding = boolean | SanitizeOptions

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
 * Normalize options
 */
function normalizeOptions(binding: SanitizeBinding | undefined): SanitizeOptions {
	if (binding === false) {
		return { disabled: true }
	}

	if (binding === true) {
		return {
			allowedTags: DEFAULT_ALLOWED_TAGS,
			allowedAttributes: DEFAULT_ALLOWED_ATTRIBUTES,
		}
	}

	return {
		allowedTags: DEFAULT_ALLOWED_TAGS,
		allowedAttributes: DEFAULT_ALLOWED_ATTRIBUTES,
		allowDataUrls: false,
		allowStyles: false,
		allowClass: false,
		allowId: false,
		disabled: false,
		sanitizeOnUpdate: true,
		...binding,
	}
}

/**
 * Basic HTML sanitizer
 */
function sanitizeHtml(html: string, options: SanitizeOptions): string {
	// Use custom handler if provided
	if (options.handler) {
		return options.handler(html)
	}

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
		// Check if tag is allowed
		const tagName = el.tagName.toLowerCase()

		if (options.allowedTags && !options.allowedTags.includes(tagName)) {
			// Replace with text content
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
		if (!options.allowDataUrls) {
			const src = el.getAttribute('src')

			if (src && src.toLowerCase().startsWith('data:')) {
				el.removeAttribute('src')
			}
		}

		// Filter attributes
		if (options.allowedAttributes) {
			const attrs = Array.from(el.attributes)

			for (const attr of attrs) {
				const isAllowed = options.allowedAttributes.includes(attr.name.toLowerCase())
				const isClass = attr.name === 'class' && options.allowClass
				const isId = attr.name === 'id' && options.allowId
				const isStyle = attr.name === 'style' && options.allowStyles

				if (!isAllowed && !isClass && !isId && !isStyle) {
					el.removeAttribute(attr.name)
				}
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

/**
 * v-sanitize directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-sanitize v-html="userContent"></div>
 *   <div v-sanitize="{ allowedTags: ['b', 'i', 'p'] }" v-html="userContent"></div>
 *   <div v-sanitize="{ handler: customSanitizer }" v-html="userContent"></div>
 * </template>
 * ```
 */
export const vSanitize = defineDirective<SanitizeBinding, HTMLElement>({
	name: 'sanitize',
	ssr: true,
	defaults: {
		allowedTags: DEFAULT_ALLOWED_TAGS,
		allowedAttributes: DEFAULT_ALLOWED_ATTRIBUTES,
		allowDataUrls: false,
		allowStyles: false,
		allowClass: false,
		allowId: false,
		disabled: false,
		sanitizeOnUpdate: true,
	},

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)

		// Store options even when disabled so updated hook can work
		;(el as any).__sanitize = { options }

		if (options.disabled) return

		// Sanitize initial content
		const content = el.innerHTML

		if (content) {
			el.innerHTML = sanitizeHtml(content, options)
		}
	},

	updated(el, binding) {
		const state = (el as any).__sanitize

		if (!state) return

		const prevDisabled = state.options.disabled
		state.options = normalizeOptions(binding.value)

		if (state.options.disabled || !state.options.sanitizeOnUpdate) {
			// If was previously disabled and now enabled, sanitize
			if (prevDisabled && !state.options.disabled) {
				const content = el.innerHTML
				if (content) {
					el.innerHTML = sanitizeHtml(content, state.options)
				}
			}
			return
		}

		// Sanitize updated content
		const content = el.innerHTML

		if (content) {
			el.innerHTML = sanitizeHtml(content, state.options)
		}
	},

	unmounted(el) {
		delete (el as any).__sanitize
	},
})

export default vSanitize
