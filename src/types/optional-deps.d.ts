/**
 * Type declarations for optional peer dependencies
 * These modules are optional and will be dynamically imported when needed
 */

declare module 'chart.js/auto' {
	interface ChartConfiguration {
		type: string
		data: {
			labels?: string[]
			datasets: Array<{
				label?: string
				data: number[]
				backgroundColor?: string | string[]
				borderColor?: string | string[]
				borderWidth?: number
				[key: string]: unknown
			}>
		}
		options?: Record<string, unknown>
		[key: string]: unknown
	}

	interface ChartInstance {
		data: ChartConfiguration['data']
		options: ChartConfiguration['options']
		update: (mode?: string) => void
		destroy: () => void
		resize: () => void
		[key: string]: unknown
	}

	interface ChartConstructor {
		new (ctx: CanvasRenderingContext2D, config: ChartConfiguration): ChartInstance
		(ctx: CanvasRenderingContext2D, config: ChartConfiguration): ChartInstance
	}

	const Chart: ChartConstructor
	export default Chart
}

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
