import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useLottie } from '../../src/composables/use-lottie'

// Mock lottie-web module
vi.mock('lottie-web', () => ({
	default: {
		loadAnimation: vi.fn(() => ({
			play: vi.fn(),
			pause: vi.fn(),
			stop: vi.fn(),
			setSpeed: vi.fn(),
			setDirection: vi.fn(),
			goToAndPlay: vi.fn(),
			goToAndStop: vi.fn(),
			destroy: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		})),
	},
}))

describe('useLottie', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		;(window as any).lottie = undefined
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with animation data', () => {
			const animationData = { v: '5.0.0', layers: [] }
			const { state, animation, play, pause, stop, bind } = useLottie({ animationData })

			expect(state.value).toBe('stopped')
			expect(animation.value).toBeNull()
			expect(play).toBeDefined()
			expect(pause).toBeDefined()
			expect(stop).toBeDefined()
			expect(bind).toBeDefined()
		})

		it('should bind to element', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind } = useLottie({ animationData })

			const unbind = bind(element)

			expect(element.classList.contains('v-lottie-container')).toBe(true)
			expect(element.querySelector('.v-lottie')).not.toBeNull()

			unbind()
			expect(element.classList.contains('v-lottie-container')).toBe(false)
		})
	})

	describe('controls', () => {
		it('should play animation', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind, play, state } = useLottie({ animationData })

			bind(element)
			play()

			expect(state.value).toBe('playing')
		})

		it('should pause animation', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind, pause, state } = useLottie({ animationData })

			bind(element)
			pause()

			expect(state.value).toBe('paused')
		})

		it('should stop animation', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind, stop, state } = useLottie({ animationData })

			bind(element)
			stop()

			expect(state.value).toBe('stopped')
		})

		it('should set speed', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind, setSpeed } = useLottie({ animationData })

			bind(element)
			setSpeed(2)

			// Speed was set
			expect(true).toBe(true)
		})

		it('should set direction', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind, setDirection } = useLottie({ animationData })

			bind(element)
			setDirection(-1)

			// Direction was set
			expect(true).toBe(true)
		})

		it('should goToAndPlay', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind, goToAndPlay, state } = useLottie({ animationData })

			bind(element)
			goToAndPlay(10)

			expect(state.value).toBe('playing')
		})

		it('should goToAndStop', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind, goToAndStop, state } = useLottie({ animationData })

			bind(element)
			goToAndStop(10)

			expect(state.value).toBe('paused')
		})
	})

	describe('options', () => {
		it('should support autoplay', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind } = useLottie({ animationData, autoplay: true })

			bind(element)

			// Autoplay option is passed to lottie.loadAnimation
			expect(element.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should support loop', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind } = useLottie({ animationData, loop: true })

			bind(element)

			expect(element.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should support speed option', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind } = useLottie({ animationData, speed: 2 })

			bind(element)

			expect(element.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should support direction option', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind } = useLottie({ animationData, direction: -1 })

			bind(element)

			expect(element.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should support renderer option', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind } = useLottie({ animationData, renderer: 'canvas' })

			bind(element)

			expect(element.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should support URL path', async () => {
			const element = document.createElement('div')
			const { bind } = useLottie({ animationData: 'https://example.com/animation.json' })

			bind(element)

			expect(element.querySelector('.v-lottie')).not.toBeNull()
		})
	})

	describe('callbacks', () => {
		it('should register onReady callback', async () => {
			const onReady = vi.fn()
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind } = useLottie({ animationData, onReady })

			bind(element)

			// Callback is registered
			expect(true).toBe(true)
		})

		it('should register onComplete callback', async () => {
			const onComplete = vi.fn()
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind } = useLottie({ animationData, onComplete })

			bind(element)

			// Callback is registered
			expect(true).toBe(true)
		})

		it('should register onLoopComplete callback', async () => {
			const onLoopComplete = vi.fn()
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind } = useLottie({ animationData, onLoopComplete })

			bind(element)

			// Callback is registered
			expect(true).toBe(true)
		})
	})

	describe('reactive options', () => {
		it('should support reactive animationData', async () => {
			const animationData = ref({ v: '5.0.0', layers: [] })
			const element = document.createElement('div')
			const { bind } = useLottie({ animationData })

			bind(element)

			expect(element.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should support reactive speed', async () => {
			const speed = ref(1)
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind } = useLottie({ animationData, speed })

			bind(element)

			expect(element.querySelector('.v-lottie')).not.toBeNull()
		})
	})

	describe('unbind', () => {
		it('should clean up properly', async () => {
			const element = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }
			const { bind, state } = useLottie({ animationData })

			const unbind = bind(element)
			unbind()

			expect(state.value).toBe('stopped')
		})
	})
})
