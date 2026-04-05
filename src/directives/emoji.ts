import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

/**
 * Emoji directive options
 */
export interface EmojiOptions {
	/**
	 * Whether to strip emoji from input
	 * @default true
	 */
	strip?: boolean

	/**
	 * Whether to allow specific emojis (array of emoji strings)
	 */
	allowList?: string[]

	/**
	 * Whether to block specific emojis (array of emoji strings)
	 */
	blockList?: string[]

	/**
	 * Custom emoji pattern (regex string)
	 */
	pattern?: string

	/**
	 * Replacement character for stripped emojis
	 * @default ''
	 */
	replacement?: string

	/**
	 * Callback when emoji is detected
	 */
	onEmoji?: (emoji: string, position: number) => void

	/**
	 * Callback when emoji is stripped
	 */
	onStrip?: (original: string, cleaned: string) => void
}

/**
 * Directive binding value type
 */
export type EmojiBinding = boolean | EmojiOptions

/**
 * Element state storage
 */
interface EmojiState {
	options: EmojiOptions
	inputHandler: (e: Event) => void
	pasteHandler: (e: ClipboardEvent) => void
}

/**
 * Common emoji pattern
 */
const EMOJI_PATTERN = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu

/**
 * Normalize options
 */
function normalizeOptions(binding: EmojiBinding | undefined): EmojiOptions {
	if (binding === false) {
		return { strip: false }
	}

	if (binding === true || binding === undefined) {
		return { strip: true }
	}

	return {
		strip: true,
		replacement: '',
		...binding,
	}
}

/**
 * Get emoji pattern based on options
 */
function getEmojiPattern(options: EmojiOptions): RegExp {
	if (options.pattern) {
		return new RegExp(options.pattern, 'gu')
	}

	if (options.blockList && options.blockList.length > 0) {
		// Build pattern for specific blocked emojis
		const escaped = options.blockList.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
		return new RegExp(escaped, 'gu')
	}

	if (options.allowList && options.allowList.length > 0) {
		// Build negative pattern for allowed emojis
		// This is more complex - we strip all emojis except those in allowList
		return EMOJI_PATTERN
	}

	return EMOJI_PATTERN
}

/**
 * Check if emoji is in allow list
 */
function isAllowed(char: string, allowList?: string[]): boolean {
	if (!allowList || allowList.length === 0) {
		return false
	}
	return allowList.includes(char)
}

/**
 * Strip emojis from text
 */
function stripEmojis(text: string, options: EmojiOptions): string {
	const pattern = getEmojiPattern(options)
	const replacement = options.replacement || ''
	let result = text

	// If we have an allow list, we need to process differently
	if (options.allowList && options.allowList.length > 0) {
		result = text.replace(pattern, match => {
			if (isAllowed(match, options.allowList)) {
				return match
			}
			options.onEmoji?.(match, text.indexOf(match))
			return replacement
		})
	} else {
		const matches = text.match(pattern)
		if (matches) {
			matches.forEach(match => {
				options.onEmoji?.(match, text.indexOf(match))
			})
		}
		result = text.replace(pattern, replacement)
	}

	if (result !== text) {
		options.onStrip?.(text, result)
	}

	return result
}

/**
 * v-emoji directive
 * Restrict or filter emoji input
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Strip all emojis -->
 *   <input v-emoji type="text" />
 *
 *   <!-- Strip emojis with replacement -->
 *   <input v-emoji="{ strip: true, replacement: '*' }" type="text" />
 *
 *   <!-- Allow specific emojis -->
 *   <input v-emoji="{ allowList: ['😊', '👍'] }" type="text" />
 *
 *   <!-- Block specific emojis -->
 *   <input v-emoji="{ blockList: ['🚫', '❌'] }" type="text" />
 * </template>
 * ```
 */
export const vEmoji = defineDirective<EmojiBinding, HTMLInputElement | HTMLTextAreaElement>({
	name: 'emoji',
	ssr: false,

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)

		if (!options.strip && !options.blockList?.length) return

		const state: EmojiState = {
			options,
			inputHandler: (e: Event) => {
				const target = e.target as HTMLInputElement | HTMLTextAreaElement
				const original = target.value
				const cleaned = stripEmojis(original, state.options)

				if (cleaned !== original) {
					// Preserve cursor position
					const start = target.selectionStart || 0
					const end = target.selectionEnd || 0

					target.value = cleaned

					// Adjust cursor position if emojis were stripped
					const diff = original.length - cleaned.length
					target.setSelectionRange(Math.max(0, start - diff), Math.max(0, end - diff))

					// Trigger input event for v-model
					target.dispatchEvent(new Event('input', { bubbles: true }))
				}
			},
			pasteHandler: (e: ClipboardEvent) => {
				if (!state.options.strip) return

				const pastedText = e.clipboardData?.getData('text')
				if (pastedText && EMOJI_PATTERN.test(pastedText)) {
					e.preventDefault()

					const cleaned = stripEmojis(pastedText, state.options)
					const target = e.target as HTMLInputElement | HTMLTextAreaElement

					// Insert cleaned text
					const start = target.selectionStart || 0
					const end = target.selectionEnd || 0
					const value = target.value

					target.value = value.substring(0, start) + cleaned + value.substring(end)
					target.setSelectionRange(start + cleaned.length, start + cleaned.length)

					// Trigger input event for v-model
					target.dispatchEvent(new Event('input', { bubbles: true }))
				}
			},
		}

		;(el as any).__emoji = state

		on(el, 'input', state.inputHandler)
		on(el, 'paste', state.pasteHandler as (e: Event) => void)

		// Process initial value
		if (el.value) {
			const cleaned = stripEmojis(el.value, state.options)
			if (cleaned !== el.value) {
				el.value = cleaned
			}
		}

		el.classList.add('v-emoji')
	},

	updated(el, binding) {
		const state: EmojiState = (el as any).__emoji

		if (!state) return

		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: EmojiState = (el as any).__emoji

		if (!state) return

		off(el, 'input', state.inputHandler)
		off(el, 'paste', state.pasteHandler as (e: Event) => void)
		el.classList.remove('v-emoji')

		delete (el as any).__emoji
	},
})

export default vEmoji
