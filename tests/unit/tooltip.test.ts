import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vTooltip } from '../../src/directives/tooltip'

describe('v-tooltip', () => {
	let tooltipContainer: HTMLElement | null = null

	beforeEach(() => {
		vi.useFakeTimers()
		// Mock requestAnimationFrame to execute synchronously
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
			cb(0)
			return 0
		})
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		// Clean up tooltip container
		tooltipContainer = document.getElementById('directix-tooltip-container')
		if (tooltipContainer) {
			tooltipContainer.remove()
		}
	})

	describe('basic functionality', () => {
		it('should set aria-describedby on mount', () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="'Tooltip text'">Hover me</button>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('button').attributes('aria-describedby')).toBe('v-tooltip')
		})

		it('should accept string content', () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="'Simple tooltip'">Hover me</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').attributes('aria-describedby')).toBe('v-tooltip')
		})

		it('should accept options object', () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', placement: 'bottom' }">Hover me</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').attributes('aria-describedby')).toBe('v-tooltip')
		})
	})

	describe('disabled option', () => {
		it('should not show tooltip when disabled', () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', disabled: true }">Hover me</button>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('button').attributes('aria-describedby')).toBeFalsy()
		})

		it('should enable tooltip when disabled changes to false', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', disabled: isDisabled }">Hover me</button>`,
				data() {
					return { isDisabled: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('button').attributes('aria-describedby')).toBeFalsy()

			await wrapper.setData({ isDisabled: false })
			await nextTick()

			expect(wrapper.find('button').attributes('aria-describedby')).toBe('v-tooltip')
		})
	})

	describe('empty content', () => {
		it('should not create tooltip for empty content', () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="''">Hover me</button>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('button').attributes('aria-describedby')).toBeFalsy()
		})
	})

	describe('hover trigger', () => {
		it('should show tooltip on mouseenter', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="'Tooltip text'">Hover me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			expect(container).not.toBeNull()
			expect(container?.querySelector('.v-tooltip') as HTMLElement | null).not.toBeNull()
		})

		it('should hide tooltip on mouseleave', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="'Tooltip text'">Hover me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			// Show tooltip first
			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			expect(container?.querySelector('.v-tooltip') as HTMLElement | null).not.toBeNull()

			// Hide tooltip
			await button.trigger('mouseleave')
			await nextTick()

			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null
			// After mouseleave, tooltip should have opacity 0
			expect(tooltip?.style.opacity).toBe('0')
		})
	})

	describe('click trigger', () => {
		it('should toggle tooltip on click', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip text', trigger: 'click' }">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			expect(container?.querySelector('.v-tooltip') as HTMLElement | null).not.toBeNull()
		})

		it('should hide tooltip on second click', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip text', trigger: 'click' }">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			// First click - show
			await button.trigger('click')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			expect(container?.querySelector('.v-tooltip') as HTMLElement | null).not.toBeNull()

			// Second click - hide
			await button.trigger('click')
			await nextTick()

			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null
			expect(tooltip?.style.opacity).toBe('0')
		})
	})

	describe('focus trigger', () => {
		it('should show tooltip on focus', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip text', trigger: 'focus' }">Focus me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('focus')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			expect(container?.querySelector('.v-tooltip') as HTMLElement | null).not.toBeNull()
		})

		it('should hide tooltip on blur', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip text', trigger: 'focus' }">Focus me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			// Show tooltip
			await button.trigger('focus')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			expect(container?.querySelector('.v-tooltip') as HTMLElement | null).not.toBeNull()

			// Hide tooltip
			await button.trigger('blur')
			await nextTick()

			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null
			expect(tooltip?.style.opacity).toBe('0')
		})
	})

	describe('manual trigger', () => {
		it('should show tooltip on mount with manual trigger', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip text', trigger: 'manual' }">Button</button>`,
			})

			mount(TestComponent)
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			expect(container?.querySelector('.v-tooltip') as HTMLElement | null).not.toBeNull()
		})
	})

	describe('delay options', () => {
		it('should respect show delay', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip text', delay: 200 }">Hover me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')

			// Tooltip should not appear immediately (container might not exist yet)
			let container = document.getElementById('directix-tooltip-container')
			expect(container?.querySelector('.v-tooltip') as HTMLElement | null ?? null).toBeNull()

			// Advance past delay
			vi.advanceTimersByTime(200)
			await nextTick()

			container = document.getElementById('directix-tooltip-container')
			expect(container?.querySelector('.v-tooltip') as HTMLElement | null).not.toBeNull()
		})

		it('should respect hide delay', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip text', hideDelay: 200 }">Hover me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			// Show tooltip
			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			expect(container?.querySelector('.v-tooltip') as HTMLElement | null).not.toBeNull()

			// Trigger hide
			await button.trigger('mouseleave')

			// Tooltip should still be visible
			expect(container?.querySelector('.v-tooltip') as HTMLElement | null).not.toBeNull()

			// Advance past hide delay
			vi.advanceTimersByTime(200)
			await nextTick()

			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null
			expect(tooltip?.style.opacity).toBe('0')
		})
	})

	describe('placement options', () => {
		it('should support top placement', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', placement: 'top' }">Hover</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null
			expect(tooltip?.classList.contains('v-tooltip--top')).toBe(true)
		})

		it('should support bottom placement', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', placement: 'bottom' }">Hover</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null
			expect(tooltip?.classList.contains('v-tooltip--bottom')).toBe(true)
		})

		it('should support left placement', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', placement: 'left' }">Hover</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null
			expect(tooltip?.classList.contains('v-tooltip--left')).toBe(true)
		})

		it('should support right placement', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', placement: 'right' }">Hover</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null
			expect(tooltip?.classList.contains('v-tooltip--right')).toBe(true)
		})
	})

	describe('styling options', () => {
		it('should use custom class', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', class: 'custom-tooltip' }">Hover</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null
			expect(tooltip?.classList.contains('custom-tooltip')).toBe(true)
		})

		it('should use custom z-index', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', zIndex: 5000 }">Hover</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null as HTMLElement
			expect(tooltip?.style.zIndex).toBe('5000')
		})

		it('should hide arrow when arrow is false', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', arrow: false }">Hover</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			const arrow = container?.querySelector('.v-tooltip__arrow')
			expect(arrow).toBeNull()
		})

		it('should use custom max-width as number', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', maxWidth: 200 }">Hover</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null as HTMLElement
			expect(tooltip?.style.maxWidth).toBe('200px')
		})

		it('should use custom max-width as string', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', maxWidth: '50%' }">Hover</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			const container = document.getElementById('directix-tooltip-container')
			const tooltip = container?.querySelector('.v-tooltip') as HTMLElement | null as HTMLElement
			expect(tooltip?.style.maxWidth).toBe('50%')
		})
	})

	describe('callbacks', () => {
		it('should call onShow callback', async () => {
			const onShow = vi.fn()
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', onShow }">Hover</button>`,
				data() {
					return { onShow }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			expect(onShow).toHaveBeenCalled()
		})

		it('should call onHide callback', async () => {
			const onHide = vi.fn()
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="{ content: 'Tooltip', onHide }">Hover</button>`,
				data() {
					return { onHide }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			await button.trigger('mouseleave')
			await nextTick()

			expect(onHide).toHaveBeenCalled()
		})
	})

	describe('update', () => {
		it('should update tooltip content dynamically', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-tooltip="content">Hover</button>`,
				data() {
					return { content: 'Initial' }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('mouseenter')
			await nextTick()

			let container = document.getElementById('directix-tooltip-container'),
				content = container?.querySelector('.v-tooltip__content')
			expect(content?.textContent).toBe('Initial')

			await wrapper.setData({ content: 'Updated' })
			await nextTick()

			container = document.getElementById('directix-tooltip-container')
			content = container?.querySelector('.v-tooltip__content')
			expect(content?.textContent).toBe('Updated')
		})
	})

	describe('cleanup', () => {
		it('should remove tooltip on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { tooltip: vTooltip },
				template: `<button v-if="show" v-tooltip="'Tooltip'">Hover</button>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('button').exists()).toBe(false)
		})
	})
})
