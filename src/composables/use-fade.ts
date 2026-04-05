import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, ref, unref, watch } from 'vue'

/**
 * Options for useFade composable
 */
export interface UseFadeOptions {
	/** Whether element is visible */
	visible?: boolean | Ref<boolean>

	/** Animation duration */
	duration?: number

	/** Animation delay */
	delay?: number

	/** Easing function */
	easing?: string

	/** Minimum opacity */
	minOpacity?: number

	/** Maximum opacity */
	maxOpacity?: number

	/** Callback on start */
	onStart?: (direction: 'in' | 'out') => void

	/** Callback on complete */
	onComplete?: (direction: 'in' | 'out') => void
}

/**
 * Return type for useFade composable
 */
export interface UseFadeReturn {
	/** Whether element is visible */
	isVisible: Ref<boolean>

	/** Fade in */
	fadeIn: () => void

	/** Fade out */
	fadeOut: () => void

	/** Toggle fade */
	toggle: () => void

	/** Bind fade to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Composable for fade transitions
 *
 * @param options - Configuration options
 * @returns Fade utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useFade } from 'directix'
 *
 * const containerRef = ref(null)
 * const { isVisible, fadeIn, fadeOut, bind } = useFade({ duration: 500 })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef">
 *     <button @click="toggle">Toggle</button>
 *   </div>
 * </template>
 * ```
 */
export function useFade(options: UseFadeOptions = {}): UseFadeReturn {
	const isVisible = ref(unref(options.visible) ?? true)

	let currentElement: HTMLElement | null = null,
		isAnimating = false

	function fadeIn(): void {
		if (!currentElement || isAnimating) return

		isAnimating = true
		options.onStart?.('in')

		currentElement.style.display = ''
		currentElement.style.opacity = String(options.minOpacity || 0)

		// Force reflow
		String(currentElement.offsetHeight)

		requestAnimationFrame(() => {
			if (currentElement) {
				currentElement.style.transition = `opacity ${options.duration || 300}ms ${options.easing || 'ease'} ${options.delay || 0}ms`
				currentElement.style.opacity = String(options.maxOpacity || 1)

				setTimeout(() => {
					isAnimating = false
					isVisible.value = true
					options.onComplete?.('in')
				}, (options.duration || 300) + (options.delay || 0))
			}
		})
	}

	function fadeOut(): void {
		if (!currentElement || isAnimating) return

		isAnimating = true
		options.onStart?.('out')

		currentElement.style.transition = `opacity ${options.duration || 300}ms ${options.easing || 'ease'} ${options.delay || 0}ms`
		currentElement.style.opacity = String(options.minOpacity || 0)

		setTimeout(() => {
			if (currentElement) {
				currentElement.style.display = 'none'
				isAnimating = false
				isVisible.value = false
				options.onComplete?.('out')
			}
		}, (options.duration || 300) + (options.delay || 0))
	}

	function toggle(): void {
		if (isVisible.value) {
			fadeOut()
		} else {
			fadeIn()
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element
		element.classList.add('v-fade')

		// Set initial state
		element.style.transition = `opacity ${options.duration || 300}ms ${options.easing || 'ease'} ${options.delay || 0}ms`
		element.style.opacity = isVisible.value ? String(options.maxOpacity || 1) : String(options.minOpacity || 0)

		if (!isVisible.value) {
			element.style.display = 'none'
		}

		// Watch for visibility changes
		if (typeof options.visible !== 'boolean' && options.visible) {
			watch(options.visible, newVal => {
				if (newVal !== isVisible.value) {
					toggle()
				}
			})
		}

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			currentElement.classList.remove('v-fade')
		}
		currentElement = null
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		isVisible,
		fadeIn,
		fadeOut,
		toggle,
		bind,
	}
}
