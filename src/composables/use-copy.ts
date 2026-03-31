import { isBrowser, supportsClipboard } from '@directix/core'
import { readonly, ref, type Ref, unref } from 'vue'

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
	if (!isBrowser()) return false

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
 * Options for useCopy composable
 */
export interface UseCopyOptions {
	/**
	 * Source text to copy (can be reactive)
	 */
	source?: string | Ref<string>

	/**
	 * Callback on copy success
	 */
	onSuccess?: (text: string) => void

	/**
	 * Callback on copy error
	 */
	onError?: (error: Error) => void

	/**
	 * Time in ms to reset copied state
	 * @default 1500
	 */
	copiedTimeout?: number
}

/**
 * Return type for useCopy composable
 */
export interface UseCopyReturn {
	/**
	 * Copy function
	 * @param text - Optional text to copy (overrides source)
	 */
	copy: (text?: string) => Promise<boolean>

	/**
	 * Whether the last copy was successful
	 */
	copied: Readonly<Ref<boolean>>

	/**
	 * Error from the last copy attempt
	 */
	error: Readonly<Ref<Error | null>>

	/**
	 * Whether clipboard API is supported
	 */
	isSupported: boolean
}

/**
 * Composable for copying text to clipboard
 *
 * @param options - Configuration options
 * @returns Copy utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { useCopy } from 'directix'
 *
 * const text = ref('Hello World')
 * const { copy, copied, isSupported } = useCopy({ source: text })
 *
 * // Or use with inline text
 * const { copy } = useCopy()
 *
 * async function handleCopy() {
 *   await copy('Custom text')
 * }
 * </script>
 *
 * <template>
 *   <button @click="copy()" :disabled="!isSupported">
 *     {{ copied ? 'Copied!' : 'Copy' }}
 *   </button>
 * </template>
 * ```
 */
export function useCopy(options: UseCopyOptions = {}): UseCopyReturn {
	const {
		source,
		onSuccess,
		onError,
		copiedTimeout = 1500,
	} = options

	const copied = ref(false)
	const error = ref<Error | null>(null)
	const isSupported = supportsClipboard() || isBrowser()

	let timeoutId: ReturnType<typeof setTimeout> | null = null

	async function copy(text?: string): Promise<boolean> {
		// Get the value to copy
		const value = text ?? unref(source)

		if (!value) {
			console.warn('[Directix] useCopy: No text to copy')
			return false
		}

		// Clear previous timeout
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}

		error.value = null

		try {
			const success = await copyToClipboard(value)

			if (success) {
				copied.value = true
				onSuccess?.(value)

				// Auto-reset copied state
				timeoutId = setTimeout(() => {
					copied.value = false
					timeoutId = null
				}, copiedTimeout)

				return true
			} else {
				throw new Error('Copy failed')
			}
		} catch (err) {
			const copyError = err as Error
			error.value = copyError
			copied.value = false
			onError?.(copyError)
			return false
		}
	}

	return {
		copy,
		copied: readonly(copied),
		error: readonly(error),
		isSupported,
	}
}
