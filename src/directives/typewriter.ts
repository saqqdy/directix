import { defineDirective, isBrowser } from '@directix/core'

/**
 * Typewriter directive options
 */
export interface TypewriterOptions {
	/**
	 * Text to type
	 */
	text: string

	/**
	 * Typing speed in milliseconds
	 * @default 50
	 */
	speed?: number

	/**
	 * Delay before starting in milliseconds
	 * @default 0
	 */
	delay?: number

	/**
	 * Whether to loop the animation
	 * @default false
	 */
	loop?: boolean

	/**
	 * Delay before deleting (when looping)
	 * @default 1500
	 */
	deleteDelay?: number

	/**
	 * Deleting speed in milliseconds
	 * @default 30
	 */
	deleteSpeed?: number

	/**
	 * Cursor character
	 * @default '|'
	 */
	cursor?: string | false

	/**
	 * Cursor blink animation
	 * @default true
	 */
	cursorBlink?: boolean

	/**
	 * Callback when typing starts
	 */
	onStart?: () => void

	/**
	 * Callback for each character typed
	 */
	onType?: (char: string, index: number) => void

	/**
	 * Callback when typing completes
	 */
	onComplete?: () => void

	/**
	 * Callback when deleting starts (for loop)
	 */
	onDeleteStart?: () => void

	/**
	 * Callback when deleting completes (for loop)
	 */
	onDeleteComplete?: () => void
}

/**
 * Directive binding value type
 */
export type TypewriterBinding = string | TypewriterOptions

/**
 * Element state storage
 */
interface TypewriterState {
	options: TypewriterOptions
	originalContent: string
	currentText: string
	timeoutId: ReturnType<typeof setTimeout> | null
	animationFrameId: number | null
	isTyping: boolean
	isDeleting: boolean
	cursorElement: HTMLSpanElement | null
}

/**
 * Normalize options
 */
function normalizeOptions(binding: TypewriterBinding): TypewriterOptions {
	if (typeof binding === 'string') {
		return { text: binding }
	}

	return {
		speed: 50,
		delay: 0,
		loop: false,
		deleteDelay: 1500,
		deleteSpeed: 30,
		cursor: '|',
		cursorBlink: true,
		...binding,
		text: typeof binding === 'string' ? binding : binding.text || '',
	}
}

/**
 * Create cursor element
 */
function createCursor(options: TypewriterOptions): HTMLSpanElement | null {
	if (options.cursor === false) return null

	const cursor = document.createElement('span')
	cursor.className = 'v-typewriter__cursor'
	cursor.textContent = options.cursor || '|'

	if (options.cursorBlink !== false) {
		cursor.style.animation = 'v-typewriter-blink 0.7s infinite'
	}

	return cursor
}

/**
 * Ensure global styles
 */
function ensureStyles(): void {
	if (!isBrowser()) return

	const styleId = 'v-typewriter-styles'
	if (document.getElementById(styleId)) return

	const style = document.createElement('style')
	style.id = styleId
	style.textContent = `
    @keyframes v-typewriter-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .v-typewriter__cursor {
      display: inline-block;
      margin-left: 1px;
    }
  `

	document.head.appendChild(style)
}

/**
 * v-typewriter directive
 * Typewriter animation effect
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Simple usage -->
 *   <span v-typewriter="'Hello, World!'"></span>
 *
 *   <!-- With options -->
 *   <span v-typewriter="{
 *     text: 'Typing animation',
 *     speed: 100,
 *     cursor: '_',
 *     onComplete: () => console.log('Done!')
 *   }"></span>
 *
 *   <!-- Loop mode -->
 *   <span v-typewriter="{
 *     text: 'Loop animation',
 *     loop: true,
 *     deleteDelay: 1000
 *   }"></span>
 * </template>
 * ```
 */
export const vTypewriter = defineDirective<TypewriterBinding, HTMLElement>({
	name: 'typewriter',
	ssr: true,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (!options.text) return

		if (isBrowser()) {
			ensureStyles()
		}

		const state: TypewriterState = {
			options,
			originalContent: el.textContent || '',
			currentText: '',
			timeoutId: null,
			animationFrameId: null,
			isTyping: false,
			isDeleting: false,
			cursorElement: null,
		}

		;(el as any).__typewriter = state

		// Clear initial content
		el.textContent = ''

		// Add cursor
		state.cursorElement = createCursor(options)
		if (state.cursorElement) {
			el.appendChild(state.cursorElement)
		}

		el.classList.add('v-typewriter')

		// Start typing after delay
		if (isBrowser()) {
			state.timeoutId = setTimeout(() => {
				startTyping(el, state)
			}, options.delay || 0)
		}
	},

	updated(el, binding) {
		const state: TypewriterState = (el as any).__typewriter

		if (!state) return

		const newOptions = normalizeOptions(binding.value)

		// Check if text changed
		if (newOptions.text !== state.options.text) {
			// Cancel current animation
			cancelAnimation(state)

			// Reset state
			state.options = newOptions
			state.currentText = ''
			state.isTyping = false
			state.isDeleting = false

			// Clear content
			el.textContent = ''

			// Re-add cursor
			state.cursorElement = createCursor(newOptions)
			if (state.cursorElement) {
				el.appendChild(state.cursorElement)
			}

			// Start new animation
			if (isBrowser()) {
				state.timeoutId = setTimeout(() => {
					startTyping(el, state)
				}, newOptions.delay || 0)
			}
		} else {
			state.options = newOptions
		}
	},

	unmounted(el) {
		const state: TypewriterState = (el as any).__typewriter

		if (!state) return

		cancelAnimation(state)
		el.classList.remove('v-typewriter')

		delete (el as any).__typewriter
	},
})

/**
 * Start typing animation
 */
function startTyping(el: HTMLElement, state: TypewriterState): void {
	const { options, cursorElement } = state

	state.isTyping = true
	options.onStart?.()

	const text = options.text

	function typeNextChar(index: number): void {
		if (index >= text.length) {
			state.isTyping = false
			options.onComplete?.()

			// Start deleting if looping
			if (options.loop) {
				state.timeoutId = setTimeout(() => {
					startDeleting(el, state)
				}, options.deleteDelay)
			}
			return
		}

		const char = text[index]
		state.currentText += char

		// Update element
		el.textContent = state.currentText
		if (cursorElement) {
			el.appendChild(cursorElement)
		}

		options.onType?.(char, index)

		// Schedule next character
		state.timeoutId = setTimeout(() => {
			typeNextChar(index + 1)
		}, options.speed || 50)
	}

	typeNextChar(0)
}

/**
 * Start deleting animation
 */
function startDeleting(el: HTMLElement, state: TypewriterState): void {
	const { options, cursorElement } = state

	state.isDeleting = true
	options.onDeleteStart?.()

	function deleteNextChar(): void {
		if (state.currentText.length === 0) {
			state.isDeleting = false
			options.onDeleteComplete?.()

			// Restart typing if looping
			if (options.loop) {
				state.timeoutId = setTimeout(() => {
					startTyping(el, state)
				}, options.delay || 0)
			}
			return
		}

		state.currentText = state.currentText.slice(0, -1)

		// Update element
		el.textContent = state.currentText
		if (cursorElement) {
			el.appendChild(cursorElement)
		}

		// Schedule next deletion
		state.timeoutId = setTimeout(() => {
			deleteNextChar()
		}, options.deleteSpeed || 30)
	}

	deleteNextChar()
}

/**
 * Cancel ongoing animation
 */
function cancelAnimation(state: TypewriterState): void {
	if (state.timeoutId) {
		clearTimeout(state.timeoutId)
		state.timeoutId = null
	}

	if (state.animationFrameId) {
		cancelAnimationFrame(state.animationFrameId)
		state.animationFrameId = null
	}

	state.isTyping = false
	state.isDeleting = false
}

export default vTypewriter
