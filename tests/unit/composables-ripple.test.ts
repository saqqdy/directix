import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useRipple } from '../../src/composables/use-ripple'

describe('useRipple', () => {
	let element: HTMLElement

	beforeEach(() => {
		element = document.createElement('button')
		// Set initial styles to avoid changes
		element.style.position = 'absolute'
		element.style.overflow = 'hidden'
		document.body.appendChild(element)
	})

	afterEach(() => {
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should add ripple class on bind', () => {
			const { bind } = useRipple()

			bind(element)

			expect(element.classList.contains('v-ripple')).toBe(true)
		})

		it('should not change position if already positioned', () => {
			element.style.position = 'fixed'
			const { bind } = useRipple()

			bind(element)

			expect(element.style.position).toBe('fixed')
		})
	})

	describe('trigger', () => {
		it('should trigger ripple manually', () => {
			const { bind, trigger } = useRipple()

			bind(element)

			element.getBoundingClientRect = vi.fn(() => ({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
				right: 100,
				bottom: 50,
				x: 0,
				y: 0,
				toJSON: () => {},
			}))

			trigger({ x: 50, y: 25 })

			const ripple = element.querySelector('.v-ripple__wave')
			expect(ripple).not.toBeNull()
		})
	})

	describe('options', () => {
		it('should use custom color', () => {
			const { bind, trigger } = useRipple({ color: 'red' })

			bind(element)

			element.getBoundingClientRect = vi.fn(() => ({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
				right: 100,
				bottom: 50,
				x: 0,
				y: 0,
				toJSON: () => {},
			}))

			trigger()

			const ripple = element.querySelector('.v-ripple__wave') as HTMLElement
			expect(ripple.style.backgroundColor).toBe('red')
		})

		it('should not trigger when disabled', () => {
			const disabled = ref(true)
			const { bind, trigger } = useRipple({ disabled })

			bind(element)

			element.getBoundingClientRect = vi.fn(() => ({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
				right: 100,
				bottom: 50,
				x: 0,
				y: 0,
				toJSON: () => {},
			}))

			trigger()

			const ripple = element.querySelector('.v-ripple__wave')
			expect(ripple).toBeNull()
		})
	})

	describe('unbind', () => {
		it('should remove event listener on unbind', () => {
			const { bind } = useRipple()

			const unbind = bind(element)

			unbind()

			expect(element.classList.contains('v-ripple')).toBe(false)
		})
	})
})
