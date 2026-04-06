/**
 * Type declarations for optional peer dependencies
 * These modules are optional and will be dynamically imported when needed
 */

declare module 'lottie-web' {
	interface LottieConfig {
		container: Element
		loop?: boolean
		autoplay?: boolean
		animationData?: unknown
		path?: string
		renderer?: 'svg' | 'canvas' | 'html'
		[key: string]: unknown
	}

	interface AnimationItem {
		play: () => void
		stop: () => void
		pause: () => void
		setSpeed: (speed: number) => void
		goToAndPlay: (value: number, isFrame?: boolean) => void
		goToAndStop: (value: number, isFrame?: boolean) => void
		setDirection: (direction: number) => void
		destroy: () => void
		getDuration: (inFrames?: boolean) => number
		currentFrame: number
		totalFrames: number
		frameRate: number
		playSpeed: number
		playDirection: number
		isPaused: boolean
		addEventListener: (event: string, callback: (args: unknown) => void) => void
		removeEventListener: (event: string, callback?: (args: unknown) => void) => void
	}

	interface Lottie {
		loadAnimation: (config: LottieConfig) => AnimationItem
		destroy: () => void
	}

	const lottie: Lottie
	export default lottie
}
