import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useSticky } from '../../src/composables/use-sticky'

describe('useSticky', () => {
	let element: HTMLElement

	beforeEach(() => {
		element = document.createElement('div')
		document.body.appendChild(element)
	})

	afterEach(() => {
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with isSticky false', () => {
			const { isSticky } = useSticky()

			expect(isSticky.value).toBe(false)
		})

		it('should add sticky class on bind', () => {
			const { bind } = useSticky()

			bind(element)

			expect(element.classList.contains('v-sticky')).toBe(true)
		})

		it('should return unbind function', () => {
			const { bind } = useSticky()

			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
		})
	})

	describe('options', () => {
		it('should use custom offsetTop', () => {
			const { bind } = useSticky({ offsetTop: 100 })

			bind(element)

			// Element should be bound
			expect(element.classList.contains('v-sticky')).toBe(true)
		})

		it('should support reactive offsetTop', () => {
			const offsetTop = ref(50)
			const { bind } = useSticky({ offsetTop })

			bind(element)

			expect(element.classList.contains('v-sticky')).toBe(true)
		})
	})

	describe('disabled option', () => {
		it('should not apply sticky when disabled', () => {
			const disabled = ref(true)
			const { bind, isSticky } = useSticky({ disabled })

			bind(element)

			expect(isSticky.value).toBe(false)
		})
	})

	describe('stop', () => {
		it('should stop observing', () => {
			const { bind, stop } = useSticky()

			bind(element)
			stop()

			expect(element.classList.contains('v-sticky')).toBe(false)
		})
	})
})
