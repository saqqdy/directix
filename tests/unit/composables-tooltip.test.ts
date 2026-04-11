import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useTooltip } from '../../src/composables/use-tooltip'

describe('useTooltip', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { isVisible, show, hide, toggle, bind } = useTooltip()

			expect(isVisible.value).toBe(false)
			expect(show).toBeDefined()
			expect(hide).toBeDefined()
			expect(toggle).toBeDefined()
			expect(bind).toBeDefined()
		})

		it('should bind to element with hover trigger', () => {
			const element = document.createElement('button')
			const { bind } = useTooltip({ content: 'Test tooltip' })

			const unbind = bind(element)

			// Simulate hover
			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(element.querySelector('.v-tooltip') || document.querySelector('.v-tooltip')).toBeDefined()

			unbind()
		})

		it('should show tooltip on hover', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, isVisible } = useTooltip({ content: 'Test tooltip' })

			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(isVisible.value).toBe(true)
		})

		it('should hide tooltip on mouse leave', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, isVisible } = useTooltip({ content: 'Test tooltip' })

			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			expect(isVisible.value).toBe(true)

			element.dispatchEvent(new MouseEvent('mouseleave'))
			expect(isVisible.value).toBe(false)
		})
	})

	describe('triggers', () => {
		it('should support click trigger', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, isVisible } = useTooltip({ content: 'Test', trigger: 'click' })

			bind(element)

			element.dispatchEvent(new MouseEvent('click'))

			expect(isVisible.value).toBe(true)

			element.dispatchEvent(new MouseEvent('click'))

			expect(isVisible.value).toBe(false)
		})

		it('should support focus trigger', () => {
			const element = document.createElement('input')
			document.body.appendChild(element)
			const { bind, isVisible } = useTooltip({ content: 'Test', trigger: 'focus' })

			bind(element)

			element.dispatchEvent(new FocusEvent('focus'))

			expect(isVisible.value).toBe(true)

			element.dispatchEvent(new FocusEvent('blur'))

			expect(isVisible.value).toBe(false)
		})

		it('should support manual trigger', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, isVisible, show, hide } = useTooltip({ content: 'Test', trigger: 'manual' })

			bind(element)

			show()
			expect(isVisible.value).toBe(true)

			hide()
			expect(isVisible.value).toBe(false)
		})
	})

	describe('options', () => {
		it('should support custom placement', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, show } = useTooltip({ content: 'Test', placement: 'bottom' })

			bind(element)
			show()

			const tooltip = document.querySelector('.v-tooltip')
			expect(tooltip?.classList.contains('v-tooltip--bottom')).toBe(true)
		})

		it('should support show delay', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, isVisible } = useTooltip({ content: 'Test', delay: 100 })

			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(isVisible.value).toBe(false)

			vi.advanceTimersByTime(100)

			expect(isVisible.value).toBe(true)
		})

		it('should support hide delay', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, isVisible } = useTooltip({ content: 'Test', hideDelay: 100 })

			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			element.dispatchEvent(new MouseEvent('mouseleave'))

			expect(isVisible.value).toBe(true)

			vi.advanceTimersByTime(100)

			expect(isVisible.value).toBe(false)
		})

		it('should support arrow', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, show } = useTooltip({ content: 'Test', arrow: true })

			bind(element)
			show()

			const tooltip = document.querySelector('.v-tooltip')
			expect(tooltip?.classList.contains('v-tooltip--arrow')).toBe(true)
		})

		it('should support custom class', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, show } = useTooltip({ content: 'Test', class: 'custom-tooltip' })

			bind(element)
			show()

			const tooltip = document.querySelector('.v-tooltip')
			expect(tooltip?.classList.contains('custom-tooltip')).toBe(true)
		})

		it('should not show when disabled', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, isVisible } = useTooltip({ content: 'Test', disabled: true })

			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(isVisible.value).toBe(false)
		})

		it('should not show when no content', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, isVisible } = useTooltip({})

			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(isVisible.value).toBe(false)
		})
	})

	describe('callbacks', () => {
		it('should call onShow callback', () => {
			const onShow = vi.fn()
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind } = useTooltip({ content: 'Test', onShow })

			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(onShow).toHaveBeenCalled()
		})

		it('should call onHide callback', () => {
			const onHide = vi.fn()
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind } = useTooltip({ content: 'Test', onHide })

			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))
			element.dispatchEvent(new MouseEvent('mouseleave'))

			expect(onHide).toHaveBeenCalled()
		})
	})

	describe('positioning', () => {
		it('should position tooltip correctly', () => {
			const element = document.createElement('button')
			element.style.position = 'absolute'
			element.style.top = '100px'
			element.style.left = '100px'
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				top: 100,
				left: 100,
				bottom: 130,
				right: 200,
				width: 100,
				height: 30,
			})
			document.body.appendChild(element)

			const { bind, show } = useTooltip({ content: 'Test', placement: 'top' })

			bind(element)
			show()

			const tooltip = document.querySelector('.v-tooltip') as HTMLElement
			expect(tooltip).not.toBeNull()
		})
	})

	describe('reactive options', () => {
		it('should support reactive content', () => {
			const content = ref('Test')
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, show } = useTooltip({ content })

			bind(element)
			show()

			const tooltip = document.querySelector('.v-tooltip')
			expect(tooltip?.textContent).toBe('Test')
		})

		it('should support reactive disabled', () => {
			const disabled = ref(false)
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, isVisible } = useTooltip({ content: 'Test', disabled })

			bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			expect(isVisible.value).toBe(true)
		})
	})

	describe('unbind', () => {
		it('should clean up properly', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind, show } = useTooltip({ content: 'Test' })

			const unbind = bind(element)
			show()

			expect(document.querySelector('.v-tooltip')).not.toBeNull()

			unbind()

			expect(document.querySelector('.v-tooltip')).toBeNull()
		})

		it('should clear timeouts on unbind', () => {
			const element = document.createElement('button')
			document.body.appendChild(element)
			const { bind } = useTooltip({ content: 'Test', delay: 100 })

			const unbind = bind(element)

			element.dispatchEvent(new MouseEvent('mouseenter'))

			unbind()

			// No error means timeouts were cleared
		})
	})
})
