import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, ref, unref, watch } from 'vue'

/**
 * Options for useEmoji composable
 */
export interface UseEmojiOptions {
	/** Whether to strip emoji */
	strip?: boolean | Ref<boolean>

	/** Allowed emojis */
	allowList?: string[]

	/** Blocked emojis */
	blockList?: string[]

	/** Replacement character */
	replacement?: string

	/** Callback when emoji is detected */
	onEmoji?: (emoji: string, position: number) => void
}

/**
 * Return type for useEmoji composable
 */
export interface UseEmojiReturn {
	/** Current input value */
	value: Ref<string>

	/** Strip emojis from text */
	stripEmojis: (text: string) => string

	/** Check if text contains emoji */
	hasEmoji: (text: string) => boolean

	/** Bind emoji filter to an input element */
	bind: (element: HTMLInputElement | HTMLTextAreaElement) => () => void
}

/**
 * Emoji pattern
 */
const EMOJI_PATTERN = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu

/**
 * Composable for emoji filtering
 *
 * @param options - Configuration options
 * @returns Emoji utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useEmoji } from 'directix'
 *
 * const inputRef = ref(null)
 * const { bind, stripEmojis } = useEmoji({ strip: true })
 *
 * onMounted(() => bind(inputRef.value))
 * </script>
 *
 * <template>
 *   <input ref="inputRef" type="text" />
 * </template>
 * ```
 */
export function useEmoji(options: UseEmojiOptions = {}): UseEmojiReturn {
	const { strip = true, allowList, blockList, replacement = '', onEmoji } = options

	const value = ref('')

	let currentElement: HTMLInputElement | HTMLTextAreaElement | null = null,
		inputHandler: ((e: Event) => void) | null = null,
		pasteHandler: ((e: ClipboardEvent) => void) | null = null

	function stripEmojisFromText(text: string): string {
		if (!unref(strip)) return text

		let result = text

		if (blockList && blockList.length > 0) {
			const escaped = blockList.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
			const pattern = new RegExp(escaped, 'gu')
			result = text.replace(pattern, replacement)
		} else if (allowList && allowList.length > 0) {
			result = text.replace(EMOJI_PATTERN, match => {
				if (allowList.includes(match)) return match
				onEmoji?.(match, text.indexOf(match))
				return replacement
			})
		} else {
			const matches = text.match(EMOJI_PATTERN)
			if (matches) {
				matches.forEach(match => onEmoji?.(match, text.indexOf(match)))
			}
			result = text.replace(EMOJI_PATTERN, replacement)
		}

		return result
	}

	function hasEmoji(text: string): boolean {
		return EMOJI_PATTERN.test(text)
	}

	function handleInput(e: Event): void {
		const target = e.target as HTMLInputElement | HTMLTextAreaElement
		const original = target.value
		const cleaned = stripEmojisFromText(original)

		if (cleaned !== original) {
			const start = target.selectionStart || 0
			const end = target.selectionEnd || 0

			target.value = cleaned
			value.value = cleaned

			const diff = original.length - cleaned.length
			target.setSelectionRange(Math.max(0, start - diff), Math.max(0, end - diff))

			target.dispatchEvent(new Event('input', { bubbles: true }))
		}
	}

	function handlePaste(e: ClipboardEvent): void {
		if (!unref(strip)) return

		const pastedText = e.clipboardData?.getData('text')
		if (pastedText && hasEmoji(pastedText)) {
			e.preventDefault()

			const cleaned = stripEmojisFromText(pastedText)
			const target = e.target as HTMLInputElement | HTMLTextAreaElement

			const start = target.selectionStart || 0
			const end = target.selectionEnd || 0
			const val = target.value

			target.value = val.substring(0, start) + cleaned + val.substring(end)
			value.value = target.value

			target.setSelectionRange(start + cleaned.length, start + cleaned.length)
			target.dispatchEvent(new Event('input', { bubbles: true }))
		}
	}

	function bind(element: HTMLInputElement | HTMLTextAreaElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element
		value.value = element.value

		inputHandler = handleInput
		pasteHandler = handlePaste

		element.addEventListener('input', inputHandler)
		element.addEventListener('paste', pasteHandler as (e: Event) => void)
		element.classList.add('v-emoji')

		// Process initial value
		if (element.value && unref(strip)) {
			const cleaned = stripEmojisFromText(element.value)
			if (cleaned !== element.value) {
				element.value = cleaned
				value.value = cleaned
			}
		}

		// Watch strip option
		if (typeof strip !== 'boolean') {
			watch(strip, () => {
				if (unref(strip) && currentElement) {
					const cleaned = stripEmojisFromText(currentElement.value)
					if (cleaned !== currentElement.value) {
						currentElement.value = cleaned
						value.value = cleaned
					}
				}
			})
		}

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			if (inputHandler) {
				currentElement.removeEventListener('input', inputHandler)
			}
			if (pasteHandler) {
				currentElement.removeEventListener('paste', pasteHandler as (e: Event) => void)
			}
			currentElement.classList.remove('v-emoji')
		}
		currentElement = null
		inputHandler = null
		pasteHandler = null
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		value,
		stripEmojis: stripEmojisFromText,
		hasEmoji,
		bind,
	}
}
