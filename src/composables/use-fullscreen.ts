import { isBrowser } from '@directix/core'
import { onUnmounted, ref, type Ref } from 'vue'

/**
 * Options for useFullscreen composable
 */
export interface UseFullscreenOptions {
	/** Custom class when in fullscreen mode */
	fullscreenClass?: string

	/** Callback when entering fullscreen */
	onEnter?: () => void

	/** Callback when exiting fullscreen */
	onExit?: () => void

	/** Callback when fullscreen state changes */
	onChange?: (isFullscreen: boolean) => void
}

/**
 * Return type for useFullscreen composable
 */
export interface UseFullscreenReturn {
	/** Whether currently in fullscreen mode */
	isFullscreen: Ref<boolean>

	/** Enter fullscreen mode */
	enter: () => Promise<void>

	/** Exit fullscreen mode */
	exit: () => Promise<void>

	/** Toggle fullscreen mode */
	toggle: () => Promise<void>

	/** Bind fullscreen to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Check if fullscreen is supported
 */
function isFullscreenSupported(): boolean {
	return !!(
		document.fullscreenEnabled
		|| (document as any).webkitFullscreenEnabled
		|| (document as any).mozFullScreenEnabled
		|| (document as any).msFullscreenEnabled
	)
}

/**
 * Get fullscreen element
 */
function getFullscreenElement(): Element | null {
	return (
		document.fullscreenElement
		|| (document as any).webkitFullscreenElement
		|| (document as any).mozFullScreenElement
		|| (document as any).msFullscreenElement
		|| null
	)
}

/**
 * Request fullscreen
 */
async function requestFullscreen(el: HTMLElement): Promise<void> {
	if (el.requestFullscreen) {
		await el.requestFullscreen()
	} else if ((el as any).webkitRequestFullscreen) {
		await (el as any).webkitRequestFullscreen()
	} else if ((el as any).mozRequestFullScreen) {
		await (el as any).mozRequestFullScreen()
	} else if ((el as any).msRequestFullscreen) {
		await (el as any).msRequestFullscreen()
	}
}

/**
 * Exit fullscreen
 */
async function exitFullscreen(): Promise<void> {
	if (document.exitFullscreen) {
		await document.exitFullscreen()
	} else if ((document as any).webkitExitFullscreen) {
		await (document as any).webkitExitFullscreen()
	} else if ((document as any).mozCancelFullScreen) {
		await (document as any).mozCancelFullScreen()
	} else if ((document as any).msExitFullscreen) {
		await (document as any).msExitFullscreen()
	}
}

/**
 * Composable for fullscreen functionality
 *
 * @param options - Configuration options
 * @returns Fullscreen utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useFullscreen } from 'directix'
 *
 * const containerRef = ref(null)
 * const { isFullscreen, toggle, bind } = useFullscreen({
 *   onEnter: () => console.log('Entered fullscreen'),
 *   onExit: () => console.log('Exited fullscreen')
 * })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef">
 *     <button @click="toggle">
 *       {{ isFullscreen ? 'Exit' : 'Enter' }} Fullscreen
 *     </button>
 *   </div>
 * </template>
 * ```
 */
export function useFullscreen(options: UseFullscreenOptions = {}): UseFullscreenReturn {
	const { fullscreenClass = 'v-fullscreen--active', onEnter, onExit, onChange } = options

	const isFullscreen = ref(false)
	let currentElement: HTMLElement | null = null,
		changeHandlers: (() => void)[] = []

	async function enter(): Promise<void> {
		if (currentElement && !isFullscreen.value) {
			await requestFullscreen(currentElement)
		}
	}

	async function exit(): Promise<void> {
		if (isFullscreen.value) {
			await exitFullscreen()
		}
	}

	async function toggle(): Promise<void> {
		if (isFullscreen.value) {
			await exit()
		} else {
			await enter()
		}
	}

	function handleFullscreenChange(): void {
		const wasFullscreen = isFullscreen.value
		isFullscreen.value = getFullscreenElement() === currentElement

		if (wasFullscreen !== isFullscreen.value) {
			if (isFullscreen.value) {
				currentElement?.classList.add(fullscreenClass)
				onEnter?.()
			} else {
				currentElement?.classList.remove(fullscreenClass)
				onExit?.()
			}
			onChange?.(isFullscreen.value)
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser() || !isFullscreenSupported()) return () => {}

		unbind()

		currentElement = element
		element.classList.add('v-fullscreen')

		// Add event listeners
		changeHandlers = [
			handleFullscreenChange,
			handleFullscreenChange,
			handleFullscreenChange,
			handleFullscreenChange,
		]

		document.addEventListener('fullscreenchange', changeHandlers[0])
		document.addEventListener('webkitfullscreenchange', changeHandlers[1])
		document.addEventListener('mozfullscreenchange', changeHandlers[2])
		document.addEventListener('MSFullscreenChange', changeHandlers[3])

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			currentElement.classList.remove('v-fullscreen')
			currentElement.classList.remove(fullscreenClass)
		}

		changeHandlers.forEach(handler => {
			document.removeEventListener('fullscreenchange', handler)
			document.removeEventListener('webkitfullscreenchange', handler)
			document.removeEventListener('mozfullscreenchange', handler)
			document.removeEventListener('MSFullscreenChange', handler)
		})

		currentElement = null
		changeHandlers = []
	}

	onUnmounted(() => {
		if (isFullscreen.value) {
			exit()
		}
		unbind()
	})

	return {
		isFullscreen,
		enter,
		exit,
		toggle,
		bind,
	}
}
