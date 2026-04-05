import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, ref, unref, watch } from 'vue'

/**
 * Options for useTypewriter composable
 */
export interface UseTypewriterOptions {
	/** Text to type */
	text: string | Ref<string>

	/** Typing speed */
	speed?: number

	/** Delay before start */
	delay?: number

	/** Loop animation */
	loop?: boolean

	/** Delay before deleting */
	deleteDelay?: number

	/** Delete speed */
	deleteSpeed?: number

	/** Cursor character */
	cursor?: string | false

	/** Cursor blink */
	cursorBlink?: boolean

	/** Callback on start */
	onStart?: () => void

	/** Callback on complete */
	onComplete?: () => void

	/** Callback on each character */
	onType?: (char: string, index: number) => void
}

/**
 * Return type for useTypewriter composable
 */
export interface UseTypewriterReturn {
	/** Current displayed text */
	displayedText: Ref<string>

	/** Whether typing is in progress */
	isTyping: Ref<boolean>

	/** Whether deleting is in progress */
	isDeleting: Ref<boolean>

	/** Start typing */
	start: () => void

	/** Stop typing */
	stop: () => void

	/** Reset to empty */
	reset: () => void

	/** Bind typewriter to an element */
	bind: (element: HTMLElement) => () => void
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
 * Composable for typewriter effect
 *
 * @param options - Configuration options
 * @returns Typewriter utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useTypewriter } from 'directix'
 *
 * const containerRef = ref(null)
 * const { displayedText, isTyping, bind } = useTypewriter({
 *   text: 'Hello, World!',
 *   speed: 100
 * })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <span ref="containerRef"></span>
 * </template>
 * ```
 */
export function useTypewriter(options: UseTypewriterOptions): UseTypewriterReturn {
	const displayedText = ref('')
	const isTyping = ref(false)
	const isDeleting = ref(false)

	let currentElement: HTMLElement | null = null,
		cursorElement: HTMLSpanElement | null = null,
		timeoutId: ReturnType<typeof setTimeout> | null = null,
		currentIndex = 0

	function createCursor(): HTMLSpanElement | null {
		if (options.cursor === false) return null

		const cursor = document.createElement('span')
		cursor.className = 'v-typewriter__cursor'
		cursor.textContent = options.cursor || '|'

		if (options.cursorBlink !== false) {
			cursor.style.animation = 'v-typewriter-blink 0.7s infinite'
		}

		return cursor
	}

	function updateElement(): void {
		if (!currentElement) return

		currentElement.textContent = displayedText.value
		if (cursorElement) {
			currentElement.appendChild(cursorElement)
		}
	}

	function typeCharacter(): void {
		const text = unref(options.text)

		if (currentIndex >= text.length) {
			isTyping.value = false
			options.onComplete?.()

			if (options.loop) {
				timeoutId = setTimeout(() => {
					startDeleting()
				}, options.deleteDelay || 1500)
			}
			return
		}

		const char = text[currentIndex]
		displayedText.value += char
		currentIndex++

		updateElement()
		options.onType?.(char, currentIndex - 1)

		timeoutId = setTimeout(typeCharacter, options.speed || 50)
	}

	function startTyping(): void {
		if (isTyping.value || isDeleting.value) return

		isTyping.value = true
		currentIndex = 0
		displayedText.value = ''

		options.onStart?.()

		timeoutId = setTimeout(typeCharacter, options.delay || 0)
	}

	function startDeleting(): void {
		isDeleting.value = true

		function deleteCharacter(): void {
			if (displayedText.value.length === 0) {
				isDeleting.value = false

				if (options.loop) {
					timeoutId = setTimeout(startTyping, options.delay || 0)
				}
				return
			}

			displayedText.value = displayedText.value.slice(0, -1)
			updateElement()

			timeoutId = setTimeout(deleteCharacter, options.deleteSpeed || 30)
		}

		deleteCharacter()
	}

	function stop(): void {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
		isTyping.value = false
		isDeleting.value = false
	}

	function reset(): void {
		stop()
		displayedText.value = ''
		currentIndex = 0
		updateElement()
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		ensureStyles()

		unbind()

		currentElement = element
		cursorElement = createCursor()

		element.classList.add('v-typewriter')

		// Watch for text changes
		if (typeof options.text !== 'string') {
			watch(options.text, () => {
				reset()
				startTyping()
			})
		}

		// Start typing
		startTyping()

		return unbind
	}

	function unbind(): void {
		stop()
		if (currentElement) {
			currentElement.classList.remove('v-typewriter')
		}
		currentElement = null
		cursorElement = null
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		displayedText,
		isTyping,
		isDeleting,
		start: startTyping,
		stop,
		reset,
		bind,
	}
}
