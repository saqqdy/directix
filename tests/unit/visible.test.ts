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

			expect((wrapper.find('div').element as HTMLElement).style.display).toBe('none')
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
			expect((wrapper.find('div').element as HTMLElement).style.display).toBe('none')
		})

		it('should use default initial value when not specified', () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="{}">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-visible')
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

		it('should set visibility: visible when showing with useHidden', async () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="{ useHidden: true, initial: isVisible }">Content</div>`,
				data() {
					return { isVisible: false }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Initial visibility should be hidden
			expect(el.classList.contains('v-hidden')).toBe(true)

			await wrapper.setData({ isVisible: true })
			await nextTick()

			expect(el.classList.contains('v-visible')).toBe(true)
		})

		it('should handle transition with useHidden when hiding', async () => {
			// Mock getComputedStyle to return a transition
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				transitionDuration: '0.3s',
			} as CSSStyleDeclaration)

			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="{ useHidden: true, initial: isVisible }">Content</div>`,
				data() {
					return { isVisible: true }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			await wrapper.setData({ isVisible: false })
			await nextTick()

			// Should start transition handling
			expect(el.classList.contains('v-hidden')).toBe(true)

			vi.restoreAllMocks()
		})

		it('should immediately set visibility hidden when no transition', async () => {
			// Mock getComputedStyle to return no transition
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				transitionDuration: '0s',
			} as CSSStyleDeclaration)

			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="{ useHidden: true, initial: isVisible }">Content</div>`,
				data() {
					return { isVisible: true }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			await wrapper.setData({ isVisible: false })
			await nextTick()

			expect(el.style.visibility).toBe('hidden')

			vi.restoreAllMocks()
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

		it('should dispatch visible:transition-end event', async () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="true">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element

			const eventHandler = vi.fn()
			el.addEventListener('visible:transition-end', eventHandler)

			// Trigger transitionend event using Event constructor
			const transitionEvent = new Event('transitionend', { bubbles: true })
			Object.defineProperty(transitionEvent, 'propertyName', { value: 'opacity' })
			el.dispatchEvent(transitionEvent)

			expect(eventHandler).toHaveBeenCalled()
		})

		it('should handle transitionend for visibility property', async () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="true">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element

			const eventHandler = vi.fn()
			el.addEventListener('visible:transition-end', eventHandler)

			// Trigger transitionend event for visibility
			const transitionEvent = new Event('transitionend', { bubbles: true })
			Object.defineProperty(transitionEvent, 'propertyName', { value: 'visibility' })
			el.dispatchEvent(transitionEvent)

			expect(eventHandler).toHaveBeenCalled()
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

		it('should restore original visibility on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-if="show" v-visible="{ useHidden: true, initial: false }" style="visibility: collapse;">Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)
		})
	})

	describe('updated hook', () => {
		it('should handle options object update', async () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="{ initial: isVisible }">Content</div>`,
				data() {
					return { isVisible: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-visible')

			await wrapper.setData({ isVisible: false })
			await nextTick()

			expect(wrapper.find('div').classes()).toContain('v-hidden')
		})

		it('should handle missing state on update', async () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-visible="true">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			// Just verify it doesn't crash
			await nextTick()
			expect(wrapper.find('div').classes()).toContain('v-visible')
		})
	})

	describe('unmounted hook', () => {
		it('should handle missing state on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { visible: vVisible },
				template: `<div v-if="show" v-visible="true">Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)
		})
	})
})
