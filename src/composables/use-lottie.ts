import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, ref, shallowRef, unref, watch } from 'vue'

/**
 * Lottie animation state
 */
export type LottieAnimationState = 'playing' | 'paused' | 'stopped'

/**
 * Options for useLottie composable
 */
export interface UseLottieOptions {
	/** Animation data or URL */
	animationData: object | string | Ref<object | string>

	/** Autoplay */
	autoplay?: boolean

	/** Loop */
	loop?: boolean

	/** Speed */
	speed?: number | Ref<number>

	/** Direction */
	direction?: 1 | -1

	/** Renderer */
	renderer?: 'svg' | 'canvas' | 'html'

	/** Callback on ready */
	onReady?: (animation: any) => void

	/** Callback on complete */
	onComplete?: () => void

	/** Callback on loop */
	onLoopComplete?: () => void
}

/**
 * Return type for useLottie composable
 */
export interface UseLottieReturn {
	/** Animation state */
	state: Ref<LottieAnimationState>

	/** Animation instance */
	animation: Ref<any>

	/** Play animation */
	play: () => void

	/** Pause animation */
	pause: () => void

	/** Stop animation */
	stop: () => void

	/** Set speed */
	setSpeed: (speed: number) => void

	/** Set direction */
	setDirection: (direction: 1 | -1) => void

	/** Go to frame */
	goToAndPlay: (frame: number, isFrame?: boolean) => void

	/** Go to frame and stop */
	goToAndStop: (frame: number, isFrame?: boolean) => void

	/** Bind lottie to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Load lottie library
 */
async function loadLottie(): Promise<any> {
	if ((window as any).lottie) {
		return (window as any).lottie
	}

	try {
		const lottie = await import('lottie-web')
		;(window as any).lottie = lottie.default || lottie
		return lottie.default || lottie
	} catch {
		console.warn('[Directix] useLottie: lottie-web not found. Install: npm install lottie-web')
		return null
	}
}

/**
 * Composable for Lottie animations
 *
 * @param options - Configuration options
 * @returns Lottie utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useLottie } from 'directix'
 * import animationData from './animation.json'
 *
 * const containerRef = ref(null)
 * const { play, pause, bind } = useLottie({
 *   animationData,
 *   autoplay: true,
 *   loop: true
 * })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef"></div>
 *   <button @click="play">Play</button>
 *   <button @click="pause">Pause</button>
 * </template>
 * ```
 */
export function useLottie(options: UseLottieOptions): UseLottieReturn {
	const state = ref<LottieAnimationState>('stopped')
	const animation = shallowRef<any>(null)

	let currentElement: HTMLElement | null = null,
		container: HTMLDivElement | null = null

	async function initAnimation(): Promise<void> {
		const lottie = await loadLottie()
		if (!lottie || !container) return

		const data = unref(options.animationData)

		const config: any = {
			container,
			renderer: options.renderer || 'svg',
			loop: options.loop !== false,
			autoplay: options.autoplay !== false,
		}

		if (typeof data === 'string' && data.startsWith('http')) {
			config.path = data
		} else {
			config.animationData = data
		}

		animation.value = lottie.loadAnimation(config)

		if (options.speed !== undefined) {
			animation.value.setSpeed(unref(options.speed))
		}

		if (options.direction !== undefined) {
			animation.value.setDirection(options.direction)
		}

		state.value = options.autoplay !== false ? 'playing' : 'stopped'

		// Event handlers
		animation.value.addEventListener('DOMLoaded', () => {
			options.onReady?.(animation.value)
		})

		animation.value.addEventListener('complete', () => {
			state.value = 'stopped'
			options.onComplete?.()
		})

		animation.value.addEventListener('loopComplete', () => {
			options.onLoopComplete?.()
		})
	}

	function play(): void {
		animation.value?.play()
		state.value = 'playing'
	}

	function pause(): void {
		animation.value?.pause()
		state.value = 'paused'
	}

	function stop(): void {
		animation.value?.stop()
		state.value = 'stopped'
	}

	function setSpeed(speed: number): void {
		animation.value?.setSpeed(speed)
	}

	function setDirection(direction: 1 | -1): void {
		animation.value?.setDirection(direction)
	}

	function goToAndPlay(frame: number, isFrame: boolean = true): void {
		animation.value?.goToAndPlay(frame, isFrame)
		state.value = 'playing'
	}

	function goToAndStop(frame: number, isFrame: boolean = true): void {
		animation.value?.goToAndStop(frame, isFrame)
		state.value = 'paused'
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element

		// Create container
		container = document.createElement('div')
		container.className = 'v-lottie'
		container.style.cssText = 'width: 100%; height: 100%;'
		element.appendChild(container)

		element.classList.add('v-lottie-container')

		// Initialize animation
		initAnimation()

		// Watch for speed changes
		if (typeof options.speed !== 'number' && options.speed) {
			watch(options.speed, newSpeed => {
				animation.value?.setSpeed(newSpeed)
			})
		}

		return unbind
	}

	function unbind(): void {
		if (animation.value) {
			animation.value.destroy()
			animation.value = null
		}

		if (container && container.parentNode) {
			container.parentNode.removeChild(container)
		}

		if (currentElement) {
			currentElement.classList.remove('v-lottie-container')
		}

		container = null
		currentElement = null
		state.value = 'stopped'
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		state,
		animation,
		play,
		pause,
		stop,
		setSpeed,
		setDirection,
		goToAndPlay,
		goToAndStop,
		bind,
	}
}
