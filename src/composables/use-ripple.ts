import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, unref } from 'vue'

/**
 * Options for useRipple composable
 */
export interface UseRippleOptions {
	/**
	 * Ripple color
	 * @default 'currentColor'
	 */
	color?: string | Ref<string>

	/**
	 * Ripple duration in milliseconds
	 * @default 600
	 */
	duration?: number | Ref<number>

	/**
	 * Whether to disable ripple
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>

	/**
	 * Initial scale of ripple
	 * @default 0
	 */
	initialScale?: number

	/**
	 * Final scale of ripple
	 * @default 2
	 */
	finalScale?: number
}

/**
 * Return type for useRipple composable
 */
export interface UseRippleReturn {
	/** Bind ripple effect to an element */
	bind: (element: HTMLElement) => () => void

	/** Trigger ripple effect manually */
	trigger: (event?: { x?: number, y?: number }) => void
}

/**
 * Create ripple element
 */
function createRippleElement(
	x: number,
	y: number,
	el: HTMLElement,
	color: string,
	duration: number,
	initialScale: number,
	finalScale: number,
): HTMLSpanElement {
	// Get element dimensions
	const rect = el.getBoundingClientRect()

	// Calculate ripple size (use diagonal for full coverage)
	const size = Math.max(rect.width, rect.height) * 2

	// Create ripple element
	const ripple = document.createElement('span')

	ripple.className = 'v-ripple__wave'
	ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    background-color: ${color};
    width: ${size}px;
    height: ${size}px;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
    transform: scale(${initialScale});
    opacity: 0.3;
    z-index: 0;
  `

	// Animate
	if (typeof ripple.animate === 'function') {
		ripple.animate(
			[
				{ transform: `scale(${initialScale})`, opacity: 0.3 },
				{ transform: `scale(${finalScale})`, opacity: 0 },
			],
			{
				duration,
				easing: 'ease-out',
				fill: 'forwards',
			},
		).onfinish = () => {
			ripple.remove()
		}
	} else {
		// Fallback for older browsers
		ripple.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`
		// Force reflow
		String(ripple.offsetHeight)
		ripple.style.transform = `scale(${finalScale})`
		ripple.style.opacity = '0'
		setTimeout(() => ripple.remove(), duration)
	}

	return ripple
}

/**
 * Composable for creating ripple effects
 *
 * @param options - Configuration options
 * @returns Ripple utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useRipple } from 'directix'
 *
 * const buttonRef = ref(null)
 * const { bind, trigger } = useRipple({
 *   color: 'rgba(255, 255, 255, 0.3)',
 *   duration: 600
 * })
 *
 * onMounted(() => bind(buttonRef.value))
 * </script>
 *
 * <template>
 *   <button ref="buttonRef">Click for ripple</button>
 * </template>
 * ```
 */
export function useRipple(options: UseRippleOptions = {}): UseRippleReturn {
	const {
		color = 'currentColor',
		duration = 600,
		disabled = false,
		initialScale = 0,
		finalScale = 2,
	} = options

	let currentElement: HTMLElement | null = null,
		clickHandler: ((e: MouseEvent) => void) | null = null

	function handleClick(event: MouseEvent): void {
		if (unref(disabled)) return

		const currentColor = unref(color)
		const currentDuration = unref(duration)

		const ripple = createRippleElement(
			event.clientX - currentElement!.getBoundingClientRect().left,
			event.clientY - currentElement!.getBoundingClientRect().top,
			currentElement!,
			currentColor,
			currentDuration,
			initialScale,
			finalScale,
		)

		currentElement!.appendChild(ripple)
	}

	function trigger(event?: { x?: number, y?: number }): void {
		if (!currentElement || unref(disabled)) return

		const rect = currentElement.getBoundingClientRect()
		const x = event?.x ?? rect.width / 2
		const y = event?.y ?? rect.height / 2

		const ripple = createRippleElement(
			x,
			y,
			currentElement,
			unref(color),
			unref(duration),
			initialScale,
			finalScale,
		)

		currentElement.appendChild(ripple)
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		unbind()

		currentElement = element

		// Ensure element has proper positioning
		const computedStyle = getComputedStyle(element)
		if (computedStyle.position === 'static') {
			element.style.position = 'relative'
		}
		if (computedStyle.overflow === 'visible') {
			element.style.overflow = 'hidden'
		}

		// Add base class
		element.classList.add('v-ripple')

		// Bind click event
		clickHandler = handleClick
		element.addEventListener('click', clickHandler)

		return unbind
	}

	function unbind(): void {
		if (currentElement && clickHandler) {
			currentElement.removeEventListener('click', clickHandler)
			currentElement.classList.remove('v-ripple')
		}
		currentElement = null
		clickHandler = null
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		bind,
		trigger,
	}
}
