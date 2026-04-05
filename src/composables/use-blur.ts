import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, ref, unref, watch } from 'vue'

/**
 * Options for useBlur composable
 */
export interface UseBlurOptions {
	/** Blur radius in pixels */
	radius?: number | Ref<number>

	/** Whether blur is visible */
	visible?: boolean | Ref<boolean>

	/** Transition duration */
	duration?: number

	/** Overlay color */
	overlayColor?: string

	/** Z-index */
	zIndex?: number

	/** Lock scroll */
	lockScroll?: boolean

	/** Custom class */
	class?: string

	/** Callback on show */
	onShow?: () => void

	/** Callback on hide */
	onHide?: () => void
}

/**
 * Return type for useBlur composable
 */
export interface UseBlurReturn {
	/** Whether blur is visible */
	isVisible: Ref<boolean>

	/** Show blur */
	show: () => void

	/** Hide blur */
	hide: () => void

	/** Toggle blur */
	toggle: () => void

	/** Bind blur to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Create blur overlay
 */
function createBlurOverlay(options: UseBlurOptions): HTMLDivElement {
	const overlay = document.createElement('div')
	overlay.className = `v-blur-overlay ${options.class || ''}`

	overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(${options.radius || 5}px);
    -webkit-backdrop-filter: blur(${options.radius || 5}px);
    background: ${options.overlayColor || 'transparent'};
    z-index: ${options.zIndex || 999};
    opacity: 0;
    transition: opacity ${options.duration || 300}ms ease;
    pointer-events: auto;
  `

	return overlay
}

/**
 * Composable for blur overlay
 *
 * @param options - Configuration options
 * @returns Blur utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useBlur } from 'directix'
 *
 * const { isVisible, show, hide, toggle } = useBlur({ radius: 15 })
 * </script>
 *
 * <template>
 *   <button @click="toggle">Toggle Blur</button>
 * </template>
 * ```
 */
export function useBlur(options: UseBlurOptions = {}): UseBlurReturn {
	const isVisible = ref(unref(options.visible) ?? false)

	let overlayElement: HTMLDivElement | null = null,
		originalOverflow = ''

	function show(): void {
		if (overlayElement || !isBrowser()) return

		isVisible.value = true

		overlayElement = createBlurOverlay({
			...options,
			radius: unref(options.radius) ?? 5,
		})

		document.body.appendChild(overlayElement)

		// Force reflow
		String(overlayElement.offsetHeight)

		overlayElement.style.opacity = '1'

		if (options.lockScroll) {
			originalOverflow = document.body.style.overflow
			document.body.style.overflow = 'hidden'
		}

		options.onShow?.()
	}

	function hide(): void {
		if (!overlayElement) return

		isVisible.value = false

		overlayElement.style.opacity = '0'

		if (options.lockScroll) {
			document.body.style.overflow = originalOverflow
		}

		setTimeout(() => {
			if (overlayElement) {
				overlayElement.remove()
				overlayElement = null
			}
		}, options.duration || 300)

		options.onHide?.()
	}

	function toggle(): void {
		if (isVisible.value) {
			hide()
		} else {
			show()
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		element.classList.add('v-blur')

		// Watch for visibility changes
		if (typeof options.visible !== 'boolean' && options.visible) {
			watch(options.visible, newVal => {
				if (newVal !== isVisible.value) {
					toggle()
				}
			})
		}

		if (isVisible.value) {
			show()
		}

		return () => {
			if (overlayElement) {
				hide()
			}
			element.classList.remove('v-blur')
		}
	}

	onUnmounted(() => {
		if (overlayElement) {
			hide()
		}
	})

	return {
		isVisible,
		show,
		hide,
		toggle,
		bind,
	}
}
