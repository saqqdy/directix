import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vVisible } from '../../src/directives/visible'

describe('v-visible', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should add v-visible class when visible is true', () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="true">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-visible')
		})

		it('should add v-hidden class when visible is false', () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="false">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-hidden')
		})

		it('should set display: none when visible is false', () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="false">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').element.style.display).toBe('none')
		})

		it('should update visibility on value change', async () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="isVisible">Content</div>`,
				data() {
					return { isVisible: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-visible')

			await wrapper.setData({ isVisible: false })
			await nextTick()

			expect(wrapper.find('div').classes()).toContain('v-hidden')
			expect(wrapper.find('div').element.style.display).toBe('none')
		})
	})

	describe('handler option', () => {
		it('should call handler when visibility changes', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="{ handler, initial: isVisible }">Content</div>`,
				data() {
					return { handler, isVisible: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ isVisible: false })
			await nextTick()

			expect(handler).toHaveBeenCalledWith(false)
		})

		it('should not call handler when visibility does not change', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="{ handler, initial: isVisible }">Content</div>`,
				data() {
					return { handler, isVisible: true }
				},
			})

			const wrapper = mount(TestComponent)

			// Set same value
			await wrapper.setData({ isVisible: true })
			await nextTick()

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('useHidden option', () => {
		it('should use visibility: hidden instead of display: none', async () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="{ useHidden: true, initial: false }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-hidden')
		})
	})

	describe('custom events', () => {
		it('should dispatch visible:change event', async () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="isVisible">Content</div>`,
				data() {
					return { isVisible: true }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			const eventHandler = vi.fn()
			div.element.addEventListener('visible:change', eventHandler)

			await wrapper.setData({ isVisible: false })
			await nextTick()

			expect(eventHandler).toHaveBeenCalled()
			expect(eventHandler.mock.calls[0][0].detail).toEqual({
				isVisible: false,
				previousVisibility: true,
			})
		})
	})

	describe('cleanup', () => {
		it('should restore original styles on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-if="show" v-visible="isVisible" style="display: flex;">Content</div>`,
				data() {
					return { show: true, isVisible: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)
		})
	})
})
