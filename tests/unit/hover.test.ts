import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vHover } from '../../src/directives/hover'

describe('v-hover', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('basic functionality', () => {
		it('should add hover class on mouseenter', async () => {
			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover>Hover me</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))

			expect(div.classList.contains('v-hover')).toBe(true)

			wrapper.unmount()
		})

		it('should remove hover class on mouseleave', async () => {
			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover>Hover me</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			expect(div.classList.contains('v-hover')).toBe(true)

			div.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
			expect(div.classList.contains('v-hover')).toBe(false)

			wrapper.unmount()
		})

		it('should accept handler function', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover="handler">Hover me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			expect(handler).toHaveBeenCalledWith(true, expect.any(MouseEvent))

			div.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
			expect(handler).toHaveBeenCalledWith(false, expect.any(MouseEvent))

			wrapper.unmount()
		})

		it('should accept options object', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover="{ handler }">Hover me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			expect(handler).toHaveBeenCalledWith(true, expect.any(MouseEvent))

			wrapper.unmount()
		})
	})

	describe('callbacks', () => {
		it('should call onEnter callback', async () => {
			const onEnter = vi.fn()

			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover="{ onEnter }">Hover me</div>`,
				data() {
					return { onEnter }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			expect(onEnter).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should call onLeave callback', async () => {
			const onLeave = vi.fn()

			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover="{ onLeave }">Hover me</div>`,
				data() {
					return { onLeave }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			div.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
			expect(onLeave).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('custom class', () => {
		it('should use custom class name', async () => {
			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover="{ class: 'is-hovering' }">Hover me</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			expect(div.classList.contains('is-hovering')).toBe(true)
			expect(div.classList.contains('v-hover')).toBe(false)

			wrapper.unmount()
		})
	})

	describe('delay options', () => {
		it('should delay enter with enterDelay', async () => {
			const onEnter = vi.fn()

			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover="{ onEnter, enterDelay: 200 }">Hover me</div>`,
				data() {
					return { onEnter }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))

			// Not yet triggered
			vi.advanceTimersByTime(100)
			expect(onEnter).not.toHaveBeenCalled()
			expect(div.classList.contains('v-hover')).toBe(false)

			// Triggered after delay
			vi.advanceTimersByTime(100)
			expect(onEnter).toHaveBeenCalledTimes(1)
			expect(div.classList.contains('v-hover')).toBe(true)

			wrapper.unmount()
		})

		it('should delay leave with leaveDelay', async () => {
			const onLeave = vi.fn()

			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover="{ onLeave, leaveDelay: 200 }">Hover me</div>`,
				data() {
					return { onLeave }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			div.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))

			// Not yet triggered
			vi.advanceTimersByTime(100)
			expect(onLeave).not.toHaveBeenCalled()
			expect(div.classList.contains('v-hover')).toBe(true)

			// Triggered after delay
			vi.advanceTimersByTime(100)
			expect(onLeave).toHaveBeenCalledTimes(1)
			expect(div.classList.contains('v-hover')).toBe(false)

			wrapper.unmount()
		})

		it('should cancel enter delay if mouseleave before delay', async () => {
			const onEnter = vi.fn()

			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover="{ onEnter, enterDelay: 200 }">Hover me</div>`,
				data() {
					return { onEnter }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			vi.advanceTimersByTime(100)
			div.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
			vi.advanceTimersByTime(100)

			expect(onEnter).not.toHaveBeenCalled()

			wrapper.unmount()
		})
	})

	describe('disabled option', () => {
		it('should not respond when disabled', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover="{ handler, disabled: true }">Hover me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			expect(handler).not.toHaveBeenCalled()
			expect(div.classList.contains('v-hover')).toBe(false)

			wrapper.unmount()
		})

		it('should handle disabled state change on update', async () => {
			const handler = vi.fn()

			// Start with enabled, then disable
			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover="options">Hover me</div>`,
				data() {
					return {
						options: {
							handler,
							disabled: false,
						},
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			// Initially enabled - hover should work
			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			expect(handler).toHaveBeenCalledWith(true, expect.any(MouseEvent))
			expect(div.classList.contains('v-hover')).toBe(true)

			// Disable by updating options
			await wrapper.setData({
				options: {
					handler,
					disabled: true,
				},
			})
			await nextTick()

			// Class should be removed when disabled
			expect(div.classList.contains('v-hover')).toBe(false)

			wrapper.unmount()
		})
	})

	describe('custom events', () => {
		it('should dispatch hover:enter event', async () => {
			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover>Hover me</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			const eventHandler = vi.fn()
			div.addEventListener('hover:enter', eventHandler)

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			expect(eventHandler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should dispatch hover:leave event', async () => {
			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-hover>Hover me</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			const eventHandler = vi.fn()
			div.addEventListener('hover:leave', eventHandler)

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			div.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
			expect(eventHandler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('cleanup', () => {
		it('should cleanup on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-if="show" v-hover>Hover me</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			expect(div.classList.contains('v-hover')).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)

			wrapper.unmount()
		})

		it('should remove hover class on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { hover: vHover },
				template: `<div v-if="show" v-hover>Hover me</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
			expect(div.classList.contains('v-hover')).toBe(true)

			// Unmount while hovering
			await wrapper.setData({ show: false })
			await nextTick()

			// Element should be removed
			expect(wrapper.find('div').exists()).toBe(false)

			wrapper.unmount()
		})
	})
})
