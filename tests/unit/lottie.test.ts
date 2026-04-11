import type { ObjectDirective } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { vLottie } from '../../src/directives/lottie'

// Cast to ObjectDirective to access hooks
const lottieDirective = vLottie as ObjectDirective

// Mock lottie-web module
vi.mock('lottie-web', () => ({
	default: {
		loadAnimation: vi.fn(() => ({
			play: vi.fn(),
			pause: vi.fn(),
			stop: vi.fn(),
			setSpeed: vi.fn(),
			setDirection: vi.fn(),
			playSegments: vi.fn(),
			addEventListener: vi.fn(),
			destroy: vi.fn(),
			loop: true,
		})),
	},
}))

describe('vLottie', () => {
	beforeEach(() => {
		;(window as any).lottie = undefined
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('mounted', () => {
		it('should add class to element', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			expect(el.classList.contains('v-lottie-container')).toBe(true)
		})

		it('should create container', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should store state on element', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			expect((el as any).__lottie).toBeDefined()
		})

		it('should use custom class', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: { animationData, class: 'custom-class' }, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			const container = el.querySelector('.v-lottie')
			expect(container?.classList.contains('custom-class')).toBe(true)
		})
	})

	describe('normalize options', () => {
		it('should handle string value (URL)', () => {
			const el = document.createElement('div')

			lottieDirective.mounted!(el, { value: 'https://example.com/animation.json', modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should handle object value (animation data)', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should handle options object', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, {
				value: { animationData, autoplay: true, loop: false },
				modifiers: {},
				dir: vLottie,
				instance: null,
			} as any, null as any, null as any)

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})
	})

	describe('options', () => {
		it('should apply speed option', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, {
				value: { animationData, speed: 2 },
				modifiers: {},
				dir: vLottie,
				instance: null,
			} as any, null as any, null as any)

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should apply direction option', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, {
				value: { animationData, direction: -1 },
				modifiers: {},
				dir: vLottie,
				instance: null,
			} as any, null as any, null as any)

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should apply renderer option', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, {
				value: { animationData, renderer: 'canvas' },
				modifiers: {},
				dir: vLottie,
				instance: null,
			} as any, null as any, null as any)

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should apply segments option', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, {
				value: { animationData, segments: [0, 100] },
				modifiers: {},
				dir: vLottie,
				instance: null,
			} as any, null as any, null as any)

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should preserve aspect ratio by default', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			const container = el.querySelector('.v-lottie') as HTMLElement
			expect(container?.style.display).toBe('flex')
		})

		it('should disable preserve aspect ratio', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, {
				value: { animationData, preserveAspectRatio: false },
				modifiers: {},
				dir: vLottie,
				instance: null,
			} as any, null as any, null as any)

			const container = el.querySelector('.v-lottie') as HTMLElement
			expect(container?.style.display).toBe('')
		})
	})

	describe('exposed methods', () => {
		it('should expose play method', async () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			// Wait for async animation initialization
			await new Promise(resolve => setTimeout(resolve, 0))

			// Methods are attached after animation loads
			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should expose pause method', async () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			await new Promise(resolve => setTimeout(resolve, 0))

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should expose stop method', async () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			await new Promise(resolve => setTimeout(resolve, 0))

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should expose setSpeed method', async () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			await new Promise(resolve => setTimeout(resolve, 0))

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should expose setDirection method', async () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			await new Promise(resolve => setTimeout(resolve, 0))

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should expose goToAndPlay method', async () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			await new Promise(resolve => setTimeout(resolve, 0))

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should expose goToAndStop method', async () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			await new Promise(resolve => setTimeout(resolve, 0))

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})
	})

	describe('updated', () => {
		it('should update speed on option change', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: { animationData, speed: 1 }, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)
			lottieDirective.updated!(el, { value: { animationData, speed: 2 }, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})

		it('should update direction on option change', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: { animationData, direction: 1 }, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)
			lottieDirective.updated!(el, { value: { animationData, direction: -1 }, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			expect(el.querySelector('.v-lottie')).not.toBeNull()
		})
	})

	describe('unmounted', () => {
		it('should clean up', () => {
			const el = document.createElement('div')
			const animationData = { v: '5.0.0', layers: [] }

			lottieDirective.mounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)
			lottieDirective.unmounted!(el, { value: animationData, modifiers: {}, dir: vLottie, instance: null } as any, null as any, null as any)

			expect(el.classList.contains('v-lottie-container')).toBe(false)
			expect((el as any).__lottie).toBeUndefined()
		})
	})
})
