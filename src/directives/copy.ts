import { defineDirective, supportsClipboard } from '@directix/core'

/**
 * Copy success callback
 */
export type CopySuccessCallback = (text: string) => void

/**
 * Copy error callback
 */
export type CopyErrorCallback = (error: Error) => void

/**
 * Copy directive options
 */
export interface CopyOptions {
	/**
   * Text to copy
   * @required
   */
	value: string

	/**
   * Callback on copy success
   */
	onSuccess?: CopySuccessCallback

	/**
   * Callback on copy error
   */
	onError?: CopyErrorCallback

	/**
   * Tooltip text for the copy button
   */
	title?: string

	/**
   * Whether to disable
   * @default false
   */
	disabled?: boolean
}

/**
 * Directive binding value type
 */
export type CopyBinding = string | CopyOptions

/**
 * Element state storage
 */
interface CopyState {
	handler: () => void
	options: CopyOptions
}

/**
 * Copy text to clipboard
 * Prefer Clipboard API, fallback to execCommand
 */
async function copyToClipboard(text: string): Promise<boolean> {
	// Method 1: Use Clipboard API
	if (supportsClipboard()) {
		try {
			await navigator.clipboard.writeText(text)

			return true
		} catch {
			// Permission denied or other error, fallback
			console.warn('[Directix] Clipboard API failed, falling back to execCommand')
		}
	}

	// Method 2: Use execCommand (deprecated but has good compatibility)
	return copyWithExecCommand(text)
}

/**
 * Copy using execCommand
 */
function copyWithExecCommand(text: string): boolean {
	// Create temporary textarea
	const textarea = document.createElement('textarea')

	textarea.value = text

	// Set styles to make it invisible
	textarea.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    opacity: 0;
    pointer-events: none;
  `

	document.body.appendChild(textarea)

	try {
		// Select and copy
		textarea.select()
		textarea.setSelectionRange(0, textarea.value.length)

		return document.execCommand('copy')
	} catch {
		return false
	} finally {
		// Cleanup
		document.body.removeChild(textarea)
	}
}

/**
 * v-copy directive
 *
 * @example
 * ```vue
 * <template>
 *   <button v-copy="textToCopy">Copy Text</button>
 * </template>
 * ```
 */
export const vCopy = defineDirective<CopyBinding, HTMLElement>({
	name: 'copy',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled) return

		// Set tooltip
		if (options.title) {
			el.setAttribute('title', options.title)
		}

		// State storage - handler reads latest value from here
		const state: CopyState = {
			handler: null as any,
			options,
		}

		// Add click event - read latest options from state
		state.handler = async () => {
			const text = state.options.value

			if (!text) {
				console.warn('[Directix] v-copy: No text to copy')

				return
			}

			try {
				const success = await copyToClipboard(text)

				if (success) {
					state.options.onSuccess?.(text)
					el.dispatchEvent(new CustomEvent('copy:success', { detail: { text } }))
				} else {
					throw new Error('Copy failed')
				}
			} catch (err) {
				const error = err as Error

				state.options.onError?.(error)
				el.dispatchEvent(new CustomEvent('copy:error', { detail: { error } }))
			}
		}

		el.addEventListener('click', state.handler)
		;(el as any).__copy = state
	},

	updated(el, binding) {
		const state: CopyState = (el as any).__copy

		if (!state) return

		state.options = normalizeOptions(binding.value)

		if (state.options.title) {
			el.setAttribute('title', state.options.title)
		}
	},

	unmounted(el) {
		const state: CopyState = (el as any).__copy

		if (!state) return

		el.removeEventListener('click', state.handler)
		delete (el as any).__copy
	},
})

/**
 * Normalize options
 */
function normalizeOptions(binding: CopyBinding): CopyOptions {
	if (typeof binding === 'string') {
		return { value: binding }
	}

	return binding
}

export default vCopy
