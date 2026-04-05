import { defineDirective, isBrowser } from '@directix/core'

/**
 * Lottie animation state type
 */
export type LottieAnimationState = 'playing' | 'paused' | 'stopped'

/**
 * Lottie directive options
 */
export interface LottieOptions {
	/**
	 * Animation data (JSON) or URL to animation file
	 */
	animationData: object | string

	/**
	 * Whether to autoplay
	 * @default true
	 */
	autoplay?: boolean

	/**
	 * Whether to loop
	 * @default true
	 */
	loop?: boolean

	/**
	 * Animation speed (0.1 to 3)
	 * @default 1
	 */
	speed?: number

	/**
	 * Animation direction (1 for forward, -1 for reverse)
	 * @default 1
	 */
	direction?: 1 | -1

	/**
	 * Animation segments to play [startFrame, endFrame]
	 */
	segments?: [number, number]

	/**
	 * Renderer type
	 * @default 'svg'
	 */
	renderer?: 'svg' | 'canvas' | 'html'

	/**
	 * Whether to preserve aspect ratio
	 * @default true
	 */
	preserveAspectRatio?: boolean

	/**
	 * Custom class for container
	 */
	class?: string

	/**
	 * Callback when animation is ready
	 */
	onReady?: (animation: any) => void

	/**
	 * Callback when animation completes
	 */
	onComplete?: () => void

	/**
	 * Callback when animation loops
	 */
	onLoopComplete?: () => void

	/**
	 * Callback on frame update
	 */
	onEnterFrame?: (frame: number) => void
}

/**
 * Directive binding value type
 */
export type LottieBinding = string | object | LottieOptions

/**
 * Element state storage
 */
interface LottieState {
	options: LottieOptions
	animation: any
	container: HTMLDivElement
}

/**
 * Normalize options
 */
function normalizeOptions(binding: LottieBinding): LottieOptions {
	if (typeof binding === 'string') {
		return { animationData: binding }
	}

	if (binding && typeof binding === 'object' && !('animationData' in binding)) {
		return { animationData: binding }
	}

	return {
		autoplay: true,
		loop: true,
		speed: 1,
		direction: 1,
		renderer: 'svg',
		preserveAspectRatio: true,
		...(binding as LottieOptions),
	}
}

/**
 * Dynamically load Lottie library
 */
async function loadLottie(): Promise<any> {
	if ((window as any).lottie) {
		return (window as any).lottie
	}

	// Dynamic import
	try {
		const lottie = await import('lottie-web')
		;(window as any).lottie = lottie.default || lottie
		return lottie.default || lottie
	} catch {
		console.warn('[Directix] v-lottie: lottie-web not found. Please install it: npm install lottie-web')
		return null
	}
}

/**
 * v-lottie directive
 * Lottie animation player
 *
 * @example
 * ```vue
 * <template>
 *   <!-- With URL -->
 *   <div v-lottie="'https://assets.example.com/animation.json'"></div>
 *
 *   <!-- With animation data -->
 *   <div v-lottie="animationData"></div>
 *
 *   <!-- With options -->
 *   <div v-lottie="{
 *     animationData: animationData,
 *     autoplay: true,
 *     loop: true,
 *     speed: 1.5,
 *     onComplete: () => console.log('Done')
 *   }"></div>
 * </template>
 *
 * <script setup>
 * import animationData from './animation.json'
 * </script>
 * ```
 */
export const vLottie = defineDirective<LottieBinding, HTMLElement>({
	name: 'lottie',
	ssr: false,

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)

		const container = document.createElement('div')
		container.className = `v-lottie ${options.class || ''}`
		container.style.cssText = `
      width: 100%;
      height: 100%;
      ${options.preserveAspectRatio !== false ? 'display: flex; align-items: center; justify-content: center;' : ''}
    `

		el.appendChild(container)

		const state: LottieState = {
			options,
			animation: null,
			container,
		}

		;(el as any).__lottie = state

		// Load and initialize animation
		initAnimation(state)

		el.classList.add('v-lottie-container')
	},

	updated(el, binding) {
		const state: LottieState = (el as any).__lottie

		if (!state) return

		const newOptions = normalizeOptions(binding.value)
		const oldData = state.options.animationData
		const newData = newOptions.animationData

		// Check if animation data changed
		if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
			// Destroy old animation
			if (state.animation) {
				state.animation.destroy()
			}

			state.options = newOptions
			initAnimation(state)
		} else {
			// Update options
			state.options = newOptions

			if (state.animation) {
				// Update speed
				if (newOptions.speed !== undefined) {
					state.animation.setSpeed(newOptions.speed)
				}

				// Update direction
				if (newOptions.direction !== undefined) {
					state.animation.setDirection(newOptions.direction)
				}

				// Update loop
				if (newOptions.loop !== undefined) {
					state.animation.loop = newOptions.loop
				}
			}
		}
	},

	unmounted(el) {
		const state: LottieState = (el as any).__lottie

		if (!state) return

		if (state.animation) {
			state.animation.destroy()
		}

		el.removeChild(state.container)
		el.classList.remove('v-lottie-container')

		delete (el as any).__lottie
	},
})

/**
 * Initialize animation
 */
async function initAnimation(state: LottieState): Promise<void> {
	const lottie = await loadLottie()

	if (!lottie) return

	const options = state.options

	const animationConfig: any = {
		container: state.container,
		renderer: options.renderer || 'svg',
		loop: options.loop !== false,
		autoplay: options.autoplay !== false,
	}

	// Set animation source
	if (typeof options.animationData === 'string' && options.animationData.startsWith('http')) {
		animationConfig.path = options.animationData
	} else {
		animationConfig.animationData = options.animationData
	}

	state.animation = lottie.loadAnimation(animationConfig)

	// Set speed
	if (options.speed !== undefined) {
		state.animation.setSpeed(options.speed)
	}

	// Set direction
	if (options.direction !== undefined) {
		state.animation.setDirection(options.direction)
	}

	// Play segments if specified
	if (options.segments) {
		state.animation.playSegments(options.segments, true)
	}

	// Event listeners
	if (options.onReady) {
		state.animation.addEventListener('DOMLoaded', () => {
			options.onReady!(state.animation)
		})
	}

	if (options.onComplete) {
		state.animation.addEventListener('complete', options.onComplete)
	}

	if (options.onLoopComplete) {
		state.animation.addEventListener('loopComplete', options.onLoopComplete)
	}

	if (options.onEnterFrame) {
		state.animation.addEventListener('enterFrame', (e: any) => {
			options.onEnterFrame!(e.currentTime)
		})
	}

	// Expose animation methods on element
	const el = state.container.parentElement
	if (el) {
		;(el as any).lottiePlay = () => state.animation?.play()
		;(el as any).lottiePause = () => state.animation?.pause()
		;(el as any).lottieStop = () => state.animation?.stop()
		;(el as any).lottieSetSpeed = (speed: number) => state.animation?.setSpeed(speed)
		;(el as any).lottieSetDirection = (direction: 1 | -1) => state.animation?.setDirection(direction)
		;(el as any).lottieGoToAndPlay = (frame: number, isFrame: boolean = true) => state.animation?.goToAndPlay(frame, isFrame)
		;(el as any).lottieGoToAndStop = (frame: number, isFrame: boolean = true) => state.animation?.goToAndStop(frame, isFrame)
	}
}

export default vLottie
