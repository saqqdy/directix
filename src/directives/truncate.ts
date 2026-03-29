import { defineDirective } from '@directix/core'

/**
 * Truncate position
 */
export type TruncatePosition = 'start' | 'middle' | 'end'

/**
 * Truncate directive options
 */
export interface TruncateOptions {
	/**
	 * Maximum length of text
	 * @default 100
	 */
	length?: number

	/**
	 * Truncation position
	 * @default 'end'
	 */
	position?: TruncatePosition

	/**
	 * Ellipsis string
	 * @default '...'
	 */
	ellipsis?: string

	/**
	 * Whether to use CSS truncation (use text-overflow: ellipsis)
	 * When true, length and position options are ignored
	 * @default false
	 */
	useCss?: boolean

	/**
	 * Show full text on hover (as title attribute)
	 * @default true
	 */
	showTitle?: boolean
}

/**
 * Directive binding value type
 */
export type TruncateBinding = number | TruncateOptions

/**
 * Element state storage
 */
interface TruncateState {
	originalText: string
	options: TruncateOptions
}

/**
 * Truncate text based on options
 */
function truncateText(text: string, options: TruncateOptions): string {
	const { length = 100, position = 'end', ellipsis = '...' } = options

	if (text.length <= length) {
		return text
	}

	switch (position) {
		case 'start':
			return ellipsis + text.slice(-(length - ellipsis.length))

		case 'middle': {
			const startLen = Math.ceil((length - ellipsis.length) / 2)
			const endLen = Math.floor((length - ellipsis.length) / 2)

			return text.slice(0, startLen) + ellipsis + text.slice(-endLen)
		}

		case 'end':
		default:
			return text.slice(0, length - ellipsis.length) + ellipsis
	}
}

/**
 * v-truncate directive
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Simple usage: truncate to 50 characters -->
 *   <p v-truncate="50">Long text here...</p>
 *
 *   <!-- With options -->
 *   <p v-truncate="{ length: 100, position: 'middle' }">Long text here...</p>
 *
 *   <!-- CSS truncation -->
 *   <p v-truncate="{ useCss: true }">Long text here...</p>
 * </template>
 * ```
 */
export const vTruncate = defineDirective<TruncateBinding, HTMLElement>({
	name: 'truncate',
	ssr: true,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)
		const text = el.textContent || ''

		// Store original text
		const state: TruncateState = {
			originalText: text,
			options,
		}

		;(el as any).__truncate = state

		applyTruncation(el, text, options)
	},

	updated(el, binding) {
		const state: TruncateState | undefined = (el as any).__truncate
		const newOptions = normalizeOptions(binding.value)

		if (state) {
			// Always use original text for re-truncation
			const originalText = state.originalText

			// Check if options changed
			if (JSON.stringify(newOptions) !== JSON.stringify(state.options)) {
				state.options = newOptions
				applyTruncation(el, originalText, newOptions)
			}
		} else {
			const text = el.textContent || ''

			;(el as any).__truncate = {
				originalText: text,
				options: newOptions,
			}
			applyTruncation(el, text, newOptions)
		}
	},

	unmounted(el) {
		delete (el as any).__truncate
	},
})

/**
 * Apply truncation to element
 */
function applyTruncation(el: HTMLElement, text: string, options: TruncateOptions): void {
	const { useCss, showTitle = true } = options

	if (useCss) {
		// Use CSS truncation
		el.style.overflow = 'hidden'
		el.style.textOverflow = 'ellipsis'
		el.style.whiteSpace = 'nowrap'

		if (showTitle && text) {
			el.setAttribute('title', text)
		}
	} else {
		// Use JavaScript truncation
		const truncated = truncateText(text, options)

		el.textContent = truncated

		if (showTitle && text && text !== truncated) {
			el.setAttribute('title', text)
		}
	}
}

/**
 * Normalize options
 */
function normalizeOptions(binding: TruncateBinding | undefined): TruncateOptions {
	if (typeof binding === 'number') {
		return {
			length: binding,
			position: 'end',
			ellipsis: '...',
			useCss: false,
			showTitle: true,
		}
	}

	return {
		length: binding?.length ?? 100,
		position: binding?.position ?? 'end',
		ellipsis: binding?.ellipsis ?? '...',
		useCss: binding?.useCss ?? false,
		showTitle: binding?.showTitle ?? true,
	}
}

export default vTruncate
