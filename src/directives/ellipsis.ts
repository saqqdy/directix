import { defineDirective } from '@directix/core'

/**
 * Ellipsis directive options
 */
export interface EllipsisOptions {
	/**
	 * Number of lines to show before truncating
	 * @default 1
	 */
	lines?: number

	/**
	 * Custom ellipsis string
	 * @default '...'
	 */
	ellipsis?: string

	/**
	 * Whether to expand on click
	 * @default false
	 */
	expandable?: boolean

	/**
	 * Title attribute behavior
	 * - 'auto': Show full text as title only when truncated
	 * - 'always': Always show full text as title
	 * - 'none': Don't show title
	 * @default 'auto'
	 */
	titleBehavior?: 'auto' | 'always' | 'none'
}

/**
 * Directive binding value type
 */
export type EllipsisBinding = number | EllipsisOptions

/**
 * Element state storage
 */
interface EllipsisState {
	options: EllipsisOptions
	originalText: string
	clickHandler: (() => void) | null
	expanded: boolean
}

/**
 * v-ellipsis directive
 *
 * Truncates text with ellipsis, supports single and multi-line truncation.
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Single line ellipsis -->
 *   <p v-ellipsis>Long text here...</p>
 *
 *   <!-- Multi-line ellipsis (3 lines) -->
 *   <p v-ellipsis="3">Long text here...</p>
 *
 *   <!-- With options -->
 *   <p v-ellipsis="{ lines: 2, expandable: true }">
 *     Click to expand long text...
 *   </p>
 * </template>
 * ```
 */
export const vEllipsis = defineDirective<EllipsisBinding, HTMLElement>({
	name: 'ellipsis',
	ssr: true,
	defaults: {
		lines: 1,
		ellipsis: '...',
		expandable: false,
		titleBehavior: 'auto',
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		applyEllipsis(el, options)

		const state: EllipsisState = {
			options,
			originalText: el.textContent || '',
			clickHandler: null,
			expanded: false,
		}

		// Handle expandable
		if (options.expandable) {
			const handler = (): void => {
				if (state.expanded) {
					// Collapse
					applyEllipsis(el, options)
					state.expanded = false
				} else {
					// Expand
					el.textContent = state.originalText
					el.style.webkitLineClamp = ''
					el.style.display = ''
					el.style.overflow = ''
					el.style.cursor = ''
					state.expanded = true
				}
			}

			el.addEventListener('click', handler)
			el.style.cursor = 'pointer'
			state.clickHandler = handler
		}

		// Handle title
		if (options.titleBehavior === 'always') {
			el.title = state.originalText
		} else if (options.titleBehavior === 'auto') {
			// Check if text is actually truncated
			if (isTextTruncated(el)) {
				el.title = state.originalText
			}
		}

		;(el as any).__ellipsis = state
	},

	updated(el, binding) {
		const state: EllipsisState = (el as any).__ellipsis

		if (!state) {
			const options = normalizeOptions(binding.value)
			applyEllipsis(el, options)
			return
		}

		const newOptions = normalizeOptions(binding.value)
		const textChanged = el.textContent !== state.originalText

		if (textChanged) {
			state.originalText = el.textContent || ''
			state.expanded = false
		}

		// Update click handler if expandable changed
		if (state.options.expandable !== newOptions.expandable) {
			if (state.clickHandler) {
				el.removeEventListener('click', state.clickHandler)
				state.clickHandler = null
			}

			if (newOptions.expandable) {
				const handler = (): void => {
					if (state.expanded) {
						applyEllipsis(el, newOptions)
						state.expanded = false
					} else {
						el.textContent = state.originalText
						el.style.webkitLineClamp = ''
						el.style.display = ''
						el.style.overflow = ''
						state.expanded = true
					}
				}

				el.addEventListener('click', handler)
				el.style.cursor = 'pointer'
				state.clickHandler = handler
			} else {
				el.style.cursor = ''
			}
		}

		state.options = newOptions

		// Reapply ellipsis if not expanded
		if (!state.expanded) {
			applyEllipsis(el, newOptions)
		}

		// Update title
		if (newOptions.titleBehavior === 'always') {
			el.title = state.originalText
		} else if (newOptions.titleBehavior === 'auto') {
			el.title = isTextTruncated(el) ? state.originalText : ''
		} else {
			el.removeAttribute('title')
		}
	},

	unmounted(el) {
		const state: EllipsisState | undefined = (el as any).__ellipsis

		if (!state) return

		if (state.clickHandler) {
			el.removeEventListener('click', state.clickHandler)
		}

		// Clean up styles
		el.style.removeProperty('-webkit-line-clamp')
		el.style.removeProperty('-webkit-box-orient')
		el.style.removeProperty('display')
		el.style.removeProperty('overflow')
		el.style.removeProperty('text-overflow')
		el.style.removeProperty('white-space')
		el.style.removeProperty('cursor')

		delete (el as any).__ellipsis
	},
})

/**
 * Apply ellipsis styles to element
 */
function applyEllipsis(el: HTMLElement, options: EllipsisOptions): void {
	const lines = options.lines || 1

	if (lines === 1) {
		// Single line ellipsis
		el.style.overflow = 'hidden'
		el.style.textOverflow = 'ellipsis'
		el.style.whiteSpace = 'nowrap'
	} else {
		// Multi-line ellipsis
		el.style.display = '-webkit-box'
		el.style.overflow = 'hidden'
		el.style.webkitBoxOrient = 'vertical'
		el.style.webkitLineClamp = String(lines)
	}
}

/**
 * Check if text is truncated
 */
function isTextTruncated(el: HTMLElement): boolean {
	return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight
}

/**
 * Normalize options
 */
function normalizeOptions(binding: EllipsisBinding | undefined): EllipsisOptions {
	if (typeof binding === 'number') {
		return {
			lines: binding,
			ellipsis: '...',
			expandable: false,
			titleBehavior: 'auto',
		}
	}

	return {
		lines: binding?.lines ?? 1,
		ellipsis: binding?.ellipsis ?? '...',
		expandable: binding?.expandable ?? false,
		titleBehavior: binding?.titleBehavior ?? 'auto',
	}
}

export default vEllipsis
