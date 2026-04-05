import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, unref } from 'vue'

/**
 * Options for useClickWave composable
 */
export interface UseClickWaveOptions {
	/**
	 * Wave color
	 * @default 'currentColor'
	 */
	color?: string | Ref<string>

	/**
	 * Wave duration in milliseconds
	 * @default 500
	 */
	duration?: number | Ref<number>

	/**
	 * Whether to disable wave
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>

	/**
	 * Wave size ratio
	 * @default 1.5
	 */
	sizeRatio?: number
}

/**
 * Return type for useClickWave composable
 */
export interface UseClickWaveReturn {
	/** Bind wave effect to an element */
	bind: (element: HTMLElement) => () => void

	/** Trigger wave effect manually */
	trigger: (event?: { x?: number, y?: number }) => void
}

/**
 * Create wave element
 */
function createWaveElement(
	x: number,
	y: number,
	el: HTMLElement,
	color: string,
	duration: number,
	sizeRatio: number,
): HTMLSpanElement {
	const rect = el.getBoundingClientRect()
	const size = Math.min(rect.width, rect.height) * sizeRatio

	const wave = document.createElement('span')
	wave.className = 'v-click-wave__effect'
	wave.style.cssText = `
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    background-color: ${color};
    width: ${size}px;
    height: ${size}px;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
    transform: scale(0);
    opacity: 0.5;
    z-index: 0;
  `

	if (typeof wave.animate === 'function') {
		wave.animate(
			[
				{ transform: 'scale(0)', opacity: 0.5 },
				{ transform: 'scale(1)', opacity: 0 },
			],
			{
				duration,
				easing: 'ease-out',
				fill: 'forwards',
			},
		).onfinish = () => {
			wave.remove()
		}
	} else {
		wave.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`
		String(wave.offsetHeight)
		wave.style.transform = 'scale(1)'
		wave.style.opacity = '0'
		setTimeout(() => wave.remove(), duration)
	}

	return wave
}

/**
 * Composable for creating click wave effects (simplified ripple)
 *
 * @param options - Configuration options
 * @returns Wave utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useClickWave } from 'directix'
 *
 * const buttonRef = ref(null)
 * const { bind } = useClickWave({ color: 'rgba(255, 255, 255, 0.3)' })
 *
 * onMounted(() => bind(buttonRef.value))
 * </script>
 *
 * <template>
 *   <button ref="buttonRef">Click for wave</button>
 * </template>
 * ```
 */
export function useClickWave(options: UseClickWaveOptions = {}): UseClickWaveReturn {
	const { color = 'currentColor', duration = 500, disabled = false, sizeRatio = 1.5 } = options

	let currentElement: HTMLElement | null = null,
		clickHandler: ((e: MouseEvent) => void) | null = null

	function handleClick(event: MouseEvent): void {
		if (unref(disabled)) return

		const rect = currentElement!.getBoundingClientRect()
		const wave = createWaveElement(
			event.clientX - rect.left,
			event.clientY - rect.top,
			currentElement!,
			unref(color),
			unref(duration),
			sizeRatio,
		)
		currentElement!.appendChild(wave)
	}

	function trigger(event?: { x?: number, y?: number }): void {
		if (!currentElement || unref(disabled)) return

		const rect = currentElement.getBoundingClientRect()
		const x = event?.x ?? rect.width / 2
		const y = event?.y ?? rect.height / 2

		const wave = createWaveElement(x, y, currentElement, unref(color), unref(duration), sizeRatio)
		currentElement.appendChild(wave)
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element

		const computedStyle = getComputedStyle(element)
		if (computedStyle.position === 'static') {
			element.style.position = 'relative'
		}
		if (computedStyle.overflow === 'visible') {
			element.style.overflow = 'hidden'
		}

		element.classList.add('v-click-wave')

		clickHandler = handleClick
		element.addEventListener('click', clickHandler)

		return unbind
	}

	function unbind(): void {
		if (currentElement && clickHandler) {
			currentElement.removeEventListener('click', clickHandler)
			currentElement.classList.remove('v-click-wave')
		}
		currentElement = null
		clickHandler = null
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		bind,
		trigger,
	}
}
