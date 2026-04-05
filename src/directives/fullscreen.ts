import { defineDirective, isBrowser } from '@directix/core'

/**
 * Fullscreen directive options
 */
export interface FullscreenOptions {
	/**
	 * Whether to enter fullscreen mode initially
	 * @default false
	 */
	initialState?: boolean

	/**
	 * Custom class when in fullscreen mode
	 */
	fullscreenClass?: string

	/**
	 * Callback when entering fullscreen
	 */
	onEnter?: () => void

	/**
	 * Callback when exiting fullscreen
	 */
	onExit?: () => void

	/**
	 * Callback when fullscreen state changes
	 */
	onChange?: (isFullscreen: boolean) => void

	/**
	 * Key to toggle fullscreen (e.g., 'Escape', 'f')
	 * Set to false to disable keyboard toggle
	 * @default 'Escape'
	 */
	toggleKey?: string | false
}

/**
 * Directive binding value type
 */
export type FullscreenBinding = boolean | FullscreenOptions

/**
 * Element state storage
 */
interface FullscreenState {
	options: FullscreenOptions
	clickHandler: () => void
	keydownHandler: (e: KeyboardEvent) => void
	changeHandler: () => void
	isFullscreen: boolean
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
 * Toggle fullscreen
 */
async function toggleFullscreen(el: HTMLElement, state: FullscreenState): Promise<void> {
	if (state.isFullscreen) {
		await exitFullscreen()
	} else {
		await requestFullscreen(el)
	}
}

/**
 * Normalize options
 */
function normalizeOptions(binding: FullscreenBinding | undefined): FullscreenOptions {
	if (typeof binding === 'boolean') {
		return { initialState: binding }
	}

	return {
		initialState: false,
		toggleKey: 'Escape',
		...binding,
	}
}

/**
 * v-fullscreen directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-fullscreen>
 *     Content to show in fullscreen
 *     <button @click="toggleFullscreen">Toggle</button>
 *   </div>
 *
 *   <div v-fullscreen="{ fullscreenClass: 'my-fullscreen' }">
 *     Custom fullscreen class
 *   </div>
 * </template>
 * ```
 */
export const vFullscreen = defineDirective<FullscreenBinding, HTMLElement>({
	name: 'fullscreen',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (!isBrowser() || !isFullscreenSupported()) return

		const state: FullscreenState = {
			options,
			clickHandler: () => toggleFullscreen(el, state),
			keydownHandler: (e: KeyboardEvent) => {
				if (state.options.toggleKey === false) return

				if (e.key === state.options.toggleKey && state.isFullscreen) {
					exitFullscreen()
				}
			},
			changeHandler: () => {
				const wasFullscreen = state.isFullscreen
				state.isFullscreen = getFullscreenElement() === el

				if (wasFullscreen !== state.isFullscreen) {
					if (state.isFullscreen) {
						el.classList.add(state.options.fullscreenClass || 'v-fullscreen--active')
						state.options.onEnter?.()
					} else {
						el.classList.remove(state.options.fullscreenClass || 'v-fullscreen--active')
						state.options.onExit?.()
					}
					state.options.onChange?.(state.isFullscreen)
				}
			},
			isFullscreen: false,
		}

		;(el as any).__fullscreen = state

		// Listen for fullscreen changes
		document.addEventListener('fullscreenchange', state.changeHandler)
		document.addEventListener('webkitfullscreenchange', state.changeHandler)
		document.addEventListener('mozfullscreenchange', state.changeHandler)
		document.addEventListener('MSFullscreenChange', state.changeHandler)

		// Add keyboard handler
		if (options.toggleKey !== false) {
			document.addEventListener('keydown', state.keydownHandler)
		}

		// Add toggle method to element
		;(el as any).toggleFullscreen = state.clickHandler

		// Enter fullscreen if initialState is true
		if (options.initialState) {
			requestFullscreen(el)
		}

		// Add base class
		el.classList.add('v-fullscreen')
	},

	updated(el, binding) {
		const state: FullscreenState = (el as any).__fullscreen

		if (!state) return

		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: FullscreenState = (el as any).__fullscreen

		if (!state) return

		// Exit fullscreen if currently active
		if (state.isFullscreen) {
			exitFullscreen()
		}

		// Remove event listeners
		document.removeEventListener('fullscreenchange', state.changeHandler)
		document.removeEventListener('webkitfullscreenchange', state.changeHandler)
		document.removeEventListener('mozfullscreenchange', state.changeHandler)
		document.removeEventListener('MSFullscreenChange', state.changeHandler)

		if (state.options.toggleKey !== false) {
			document.removeEventListener('keydown', state.keydownHandler)
		}

		el.classList.remove('v-fullscreen')
		el.classList.remove(state.options.fullscreenClass || 'v-fullscreen--active')

		delete (el as any).__fullscreen
		delete (el as any).toggleFullscreen
	},
})

export default vFullscreen
