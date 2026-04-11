import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useClickWave } from '../../src/composables/use-click-wave'

describe('useClickWave', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { bind, trigger } = useClickWave()

			expect(bind).toBeDefined()
			expect(trigger).toBeDefined()
		})

		it('should bind to element', () => {
			const element = document.createElement('button')
			const { bind } = useClickWave()

			const unbind = bind(element)

			expect(element.classList.contains('v-click-wave')).toBe(true)

			unbind()
			expect(element.classList.contains('v-click-wave')).toBe(false)
		})

		it('should not modify position if already positioned', () => {
			const element = document.createElement('div')
			element.style.position = 'absolute'
			const { bind } = useClickWave()

			bind(element)

			expect(element.style.position).toBe('absolute')
		})

		it('should trigger wave on click', () => {
			const element = document.createElement('button')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
			})
			const { bind } = useClickWave()

			bind(element)

			// Simulate click
			const clickEvent = new MouseEvent('click', {
				clientX: 50,
				clientY: 25,
			})
			element.dispatchEvent(clickEvent)

			expect(element.querySelector('.v-click-wave__effect')).not.toBeNull()
		})
	})

	describe('options', () => {
		it('should support custom color', () => {
			const element = document.createElement('button')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
			})
			const { bind } = useClickWave({ color: '#ff0000' })

			bind(element)

			const clickEvent = new MouseEvent('click', {
				clientX: 50,
				clientY: 25,
			})
			element.dispatchEvent(clickEvent)

			const wave = element.querySelector('.v-click-wave__effect') as HTMLElement
			// Color can be converted to rgb format by the browser
			expect(wave?.style.backgroundColor).toMatch(/#ff0000|rgb\(255, 0, 0\)/)
		})

		it('should support custom duration', () => {
			const element = document.createElement('button')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
			})
			const { bind } = useClickWave({ duration: 300 })

			bind(element)

			expect(element.classList.contains('v-click-wave')).toBe(true)
		})

		it('should support disabled option', () => {
			const element = document.createElement('button')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
			})
			const { bind } = useClickWave({ disabled: true })

			bind(element)

			const clickEvent = new MouseEvent('click', {
				clientX: 50,
				clientY: 25,
			})
			element.dispatchEvent(clickEvent)

			expect(element.querySelector('.v-click-wave__effect')).toBeNull()
		})

		it('should support custom size ratio', () => {
			const element = document.createElement('button')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
			})
			const { bind } = useClickWave({ sizeRatio: 2 })

			bind(element)

			expect(element.classList.contains('v-click-wave')).toBe(true)
		})
	})

	describe('trigger', () => {
		it('should trigger wave manually', () => {
			const element = document.createElement('button')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
			})
			const { bind, trigger } = useClickWave()

			bind(element)
			trigger({ x: 50, y: 25 })

			expect(element.querySelector('.v-click-wave__effect')).not.toBeNull()
		})

		it('should trigger wave at center if no position specified', () => {
			const element = document.createElement('button')
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
			})
			const { bind, trigger } = useClickWave()

			bind(element)
			trigger()

			expect(element.querySelector('.v-click-wave__effect')).not.toBeNull()
		})

		it('should not trigger when disabled', () => {
			const element = document.createElement('button')
			const { bind, trigger } = useClickWave({ disabled: true })

			bind(element)
			trigger()

			expect(element.querySelector('.v-click-wave__effect')).toBeNull()
		})
	})

	describe('reactive options', () => {
		it('should support reactive color', () => {
			const color = ref('#ff0000')
			const element = document.createElement('button')
			const { bind } = useClickWave({ color })

			bind(element)

			expect(element.classList.contains('v-click-wave')).toBe(true)
		})

		it('should support reactive disabled', () => {
			const disabled = ref(false)
			const element = document.createElement('button')
			const { bind } = useClickWave({ disabled })

			bind(element)

			expect(element.classList.contains('v-click-wave')).toBe(true)
		})
	})

	describe('unbind', () => {
		it('should clean up properly', () => {
			const element = document.createElement('button')
			const { bind } = useClickWave()

			const unbind = bind(element)
			unbind()

			expect(element.classList.contains('v-click-wave')).toBe(false)
		})
	})
})
