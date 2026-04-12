import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useVisible } from '../../src/composables/use-visible'

describe('useVisible', () => {
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
		it('should initialize with default visible state', () => {
			const { visible } = useVisible()

			expect(visible.value).toBe(true)
		})

		it('should initialize with custom initial state', () => {
			const { visible } = useVisible({ initial: false })

			expect(visible.value).toBe(false)
		})

		it('should show element', () => {
			const { visible, show } = useVisible({ initial: false })

			show()

			expect(visible.value).toBe(true)
		})

		it('should hide element', () => {
			const { visible, hide } = useVisible({ initial: true })

			hide()

			expect(visible.value).toBe(false)
		})

		it('should toggle visibility', () => {
			const { visible, toggle } = useVisible({ initial: false })

			toggle()
			expect(visible.value).toBe(true)

			toggle()
			expect(visible.value).toBe(false)
		})
	})

	describe('bind', () => {
		it('should apply visibility on bind when hidden', () => {
			const { bind } = useVisible({ initial: false })

			bind(element)

			expect(element.classList.contains('v-hidden')).toBe(true)
		})

		it('should apply visibility on bind when visible', () => {
			const { bind } = useVisible({ initial: true })

			bind(element)

			expect(element.classList.contains('v-visible')).toBe(true)
		})

		it('should return unbind function', () => {
			const { bind } = useVisible({ initial: false })

			const unbind = bind(element)
			expect(typeof unbind).toBe('function')
		})

		it('should cleanup on unbind', () => {
			const { bind } = useVisible({ initial: false })

			const unbind = bind(element)
			unbind()

			expect(element.classList.contains('v-hidden')).toBe(false)
			expect(element.classList.contains('v-visible')).toBe(false)
		})
	})

	describe('useHidden option', () => {
		it('should use visibility: hidden when useHidden is true', () => {
			const { bind } = useVisible({ initial: false, useHidden: true })

			bind(element)

			expect(element.style.visibility).toBe('hidden')
		})

		it('should show with visibility when useHidden is true', async () => {
			const { bind, show } = useVisible({ initial: false, useHidden: true })

			bind(element)
			expect(element.style.visibility).toBe('hidden')

			show()
			await nextTick()

			expect(element.style.visibility).toBe('visible')
		})
	})

	describe('onChange callback', () => {
		it('should call onChange when visibility changes from show', async () => {
			const onChange = vi.fn()
			const { show, bind } = useVisible({ initial: false, onChange })

			bind(element)
			show()
			await nextTick()

			expect(onChange).toHaveBeenCalledWith(true)
		})

		it('should call onChange when visibility changes from hide', async () => {
			const onChange = vi.fn()
			const { hide, bind } = useVisible({ initial: true, onChange })

			bind(element)
			hide()
			await nextTick()

			expect(onChange).toHaveBeenCalledWith(false)
		})

		it('should call onChange on toggle', async () => {
			const onChange = vi.fn()
			const { toggle, bind } = useVisible({ initial: false, onChange })

			bind(element)
			toggle()
			await nextTick()

			expect(onChange).toHaveBeenCalledWith(true)
		})
	})

	describe('reactive initial', () => {
		it('should support reactive initial state', async () => {
			const initial = ref(false)
			const { visible } = useVisible({ initial })

			expect(visible.value).toBe(false)

			initial.value = true
			await nextTick()

			expect(visible.value).toBe(true)
		})
	})

	describe('element visibility', () => {
		it('should hide element with display: none', async () => {
			const { bind, hide } = useVisible({ initial: true })

			bind(element)
			hide()
			await nextTick()

			expect(element.style.display).toBe('none')
		})

		it('should show element', async () => {
			const { bind, show } = useVisible({ initial: false })

			bind(element)
			show()
			await nextTick()

			expect(element.classList.contains('v-visible')).toBe(true)
		})

		it('should preserve original display on unbind', () => {
			element.style.display = 'flex'

			const { bind } = useVisible({ initial: true })

			const unbind = bind(element)
			unbind()

			expect(element.style.display).toBe('flex')
		})
	})
})
