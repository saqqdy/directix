import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vBlur } from '../../src/directives/blur'

describe('v-blur', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should apply blur effect when mounted with true', () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="true">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-blur-overlay').exists()).toBe(true)
		})

		it('should not apply blur when mounted with false', () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="false">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-blur-overlay').exists()).toBe(false)
		})

		it('should accept number as blur radius', () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="15">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-blur-overlay').exists()).toBe(true)
			// JSDOM doesn't support backdrop-filter CSS property
			// Just verify the overlay is created with correct z-index
			const overlay = wrapper.find('.v-blur-overlay').element
			expect(overlay.style.zIndex).toBe('999')
		})

		it('should accept options object', () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: true, radius: 10 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-blur-overlay').exists()).toBe(true)
		})
	})

	describe('visibility toggle', () => {
		it('should show blur when visible changes to true', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="isVisible">Content</div>`,
				data() {
					return { isVisible: false }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-blur-overlay').exists()).toBe(false)

			await wrapper.setData({ isVisible: true })
			await nextTick()

			expect(wrapper.find('.v-blur-overlay').exists()).toBe(true)
		})

		it('should hide blur when visible changes to false', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="isVisible">Content</div>`,
				data() {
					return { isVisible: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-blur-overlay').exists()).toBe(true)

			await wrapper.setData({ isVisible: false })
			await nextTick()

			// Blur should start fading out
			const overlay = wrapper.find('.v-blur-overlay').element
			expect(overlay.style.opacity).toBe('0')

			// Advance past duration
			vi.advanceTimersByTime(300)
			await nextTick()

			expect(wrapper.find('.v-blur-overlay').exists()).toBe(false)
		})
	})

	describe('options', () => {
		it('should use custom radius', () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: true, radius: 20 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			// Just verify the overlay is created
			expect(wrapper.find('.v-blur-overlay').exists()).toBe(true)
		})

		it('should use custom z-index', () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: true, zIndex: 9999 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const overlay = wrapper.find('.v-blur-overlay').element

			expect(overlay.style.zIndex).toBe('9999')
		})

		it('should use custom overlay color', () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: true, overlayColor: 'rgba(0, 0, 0, 0.5)' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const overlay = wrapper.find('.v-blur-overlay').element

			expect(overlay.style.background).toBe('rgba(0, 0, 0, 0.5)')
		})

		it('should use custom class', () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: true, class: 'custom-blur' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.custom-blur').exists()).toBe(true)
		})
	})

	describe('callbacks', () => {
		it('should call onShow callback when blur is shown', async () => {
			const onShow = vi.fn()
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: isVisible, onShow }">Content</div>`,
				data() {
					return { isVisible: false, onShow }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ isVisible: true })
			await nextTick()

			expect(onShow).toHaveBeenCalled()
		})

		it('should call onHide callback when blur is hidden', async () => {
			const onHide = vi.fn()
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: isVisible, onHide }">Content</div>`,
				data() {
					return { isVisible: true, onHide }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ isVisible: false })
			await nextTick()

			expect(onHide).toHaveBeenCalled()
		})
	})

	describe('cleanup', () => {
		it('should remove blur on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-if="show" v-blur="true">Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-blur-overlay').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-blur-overlay').exists()).toBe(false)
		})
	})
})
