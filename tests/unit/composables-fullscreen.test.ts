import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFullscreen } from '../../src/composables/use-fullscreen'

describe('useFullscreen', () => {
	beforeEach(() => {
		// Mock fullscreen APIs using Object.defineProperty
		Object.defineProperty(document, 'fullscreenEnabled', {
			value: true,
			writable: true,
			configurable: true,
		})
		Object.defineProperty(document, 'fullscreenElement', {
			value: null,
			writable: true,
			configurable: true,
		})
		Object.defineProperty(document, 'exitFullscreen', {
			value: vi.fn().mockResolvedValue(undefined),
			writable: true,
			configurable: true,
		})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { isFullscreen, enter, exit, toggle, bind } = useFullscreen()

			expect(isFullscreen.value).toBe(false)
			expect(enter).toBeDefined()
			expect(exit).toBeDefined()
			expect(toggle).toBeDefined()
			expect(bind).toBeDefined()
		})

		it('should bind to element', () => {
			const element = document.createElement('div')
			element.requestFullscreen = vi.fn().mockResolvedValue(undefined)
			const { bind } = useFullscreen()

			const unbind = bind(element)

			expect(element.classList.contains('v-fullscreen')).toBe(true)

			unbind()
			expect(element.classList.contains('v-fullscreen')).toBe(false)
		})

		it('should not bind if fullscreen not supported', () => {
			Object.defineProperty(document, 'fullscreenEnabled', {
				value: false,
				writable: true,
				configurable: true,
			})

			const element = document.createElement('div')
			const { bind } = useFullscreen()

			bind(element)

			expect(element.classList.contains('v-fullscreen')).toBe(false)
		})
	})

	describe('enter', () => {
		it('should request fullscreen', async () => {
			const element = document.createElement('div')
			const requestFullscreenSpy = vi.fn().mockResolvedValue(undefined)
			element.requestFullscreen = requestFullscreenSpy

			const { bind, enter, isFullscreen } = useFullscreen()
			bind(element)

			await enter()

			expect(requestFullscreenSpy).toHaveBeenCalled()
		})

		it('should not enter if already fullscreen', async () => {
			const element = document.createElement('div')
			const requestFullscreenSpy = vi.fn().mockResolvedValue(undefined)
			element.requestFullscreen = requestFullscreenSpy

			const { bind, enter, isFullscreen } = useFullscreen()
			bind(element)

			// Set already fullscreen
			isFullscreen.value = true

			await enter()

			expect(requestFullscreenSpy).not.toHaveBeenCalled()
		})
	})

	describe('exit', () => {
		it('should exit fullscreen', async () => {
			const element = document.createElement('div')
			element.requestFullscreen = vi.fn().mockResolvedValue(undefined)
			const exitFullscreenSpy = vi.fn().mockResolvedValue(undefined)
			document.exitFullscreen = exitFullscreenSpy

			const { bind, exit, isFullscreen } = useFullscreen()
			bind(element)

			// Set fullscreen state
			isFullscreen.value = true

			await exit()

			expect(exitFullscreenSpy).toHaveBeenCalled()
		})

		it('should not exit if not fullscreen', async () => {
			const exitFullscreenSpy = vi.fn().mockResolvedValue(undefined)
			document.exitFullscreen = exitFullscreenSpy

			const { exit } = useFullscreen()

			await exit()

			expect(exitFullscreenSpy).not.toHaveBeenCalled()
		})
	})

	describe('toggle', () => {
		it('should toggle fullscreen', async () => {
			const element = document.createElement('div')
			const requestFullscreenSpy = vi.fn().mockResolvedValue(undefined)
			element.requestFullscreen = requestFullscreenSpy

			const { bind, toggle, isFullscreen } = useFullscreen()
			bind(element)

			await toggle()

			expect(requestFullscreenSpy).toHaveBeenCalled()
		})
	})

	describe('options', () => {
		it('should support custom fullscreen class', () => {
			const element = document.createElement('div')
			element.requestFullscreen = vi.fn().mockResolvedValue(undefined)
			const { bind } = useFullscreen({ fullscreenClass: 'custom-fullscreen' })

			bind(element)

			expect(element.classList.contains('v-fullscreen')).toBe(true)
		})

		it('should call onEnter callback', async () => {
			const onEnter = vi.fn()
			const element = document.createElement('div')
			element.requestFullscreen = vi.fn().mockResolvedValue(undefined)

			const { bind } = useFullscreen({ onEnter })
			bind(element)

			// Simulate fullscreen change event
			Object.defineProperty(document, 'fullscreenElement', {
				value: element,
				writable: true,
				configurable: true,
			})
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(onEnter).toHaveBeenCalled()
		})

		it('should call onExit callback', async () => {
			const onExit = vi.fn()
			const element = document.createElement('div')
			element.requestFullscreen = vi.fn().mockResolvedValue(undefined)

			const { bind, isFullscreen } = useFullscreen({ onExit })
			bind(element)
			isFullscreen.value = true

			// Simulate fullscreen change event
			Object.defineProperty(document, 'fullscreenElement', {
				value: null,
				writable: true,
				configurable: true,
			})
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(onExit).toHaveBeenCalled()
		})

		it('should call onChange callback', async () => {
			const onChange = vi.fn()
			const element = document.createElement('div')
			element.requestFullscreen = vi.fn().mockResolvedValue(undefined)

			const { bind } = useFullscreen({ onChange })
			bind(element)

			// Simulate entering fullscreen
			Object.defineProperty(document, 'fullscreenElement', {
				value: element,
				writable: true,
				configurable: true,
			})
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(onChange).toHaveBeenCalled()
		})
	})

	describe('fullscreen change handling', () => {
		it('should add fullscreen class when entering', async () => {
			const element = document.createElement('div')
			element.requestFullscreen = vi.fn().mockResolvedValue(undefined)

			const { bind } = useFullscreen({ fullscreenClass: 'custom-class' })
			bind(element)

			// Simulate entering fullscreen
			Object.defineProperty(document, 'fullscreenElement', {
				value: element,
				writable: true,
				configurable: true,
			})
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(element.classList.contains('custom-class')).toBe(true)
		})

		it('should remove fullscreen class when exiting', async () => {
			const element = document.createElement('div')
			element.requestFullscreen = vi.fn().mockResolvedValue(undefined)

			const { bind, isFullscreen } = useFullscreen({ fullscreenClass: 'custom-class' })
			bind(element)
			isFullscreen.value = true
			element.classList.add('custom-class')

			// Simulate exiting fullscreen
			Object.defineProperty(document, 'fullscreenElement', {
				value: null,
				writable: true,
				configurable: true,
			})
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(element.classList.contains('custom-class')).toBe(false)
		})
	})

	describe('browser prefixes', () => {
		it('should use webkit prefix if needed', async () => {
			const element = document.createElement('div')
			;(element as any).webkitRequestFullscreen = vi.fn().mockResolvedValue(undefined)
			element.requestFullscreen = undefined as any

			const { bind, enter } = useFullscreen()
			bind(element)

			await enter()

			expect((element as any).webkitRequestFullscreen).toHaveBeenCalled()
		})

		it('should use moz prefix if needed', async () => {
			const element = document.createElement('div')
			;(element as any).mozRequestFullScreen = vi.fn().mockResolvedValue(undefined)
			element.requestFullscreen = undefined as any

			const { bind, enter } = useFullscreen()
			bind(element)

			await enter()

			expect((element as any).mozRequestFullScreen).toHaveBeenCalled()
		})
	})
})
