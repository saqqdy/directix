import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vFade } from '../../src/directives/fade'

describe('v-fade', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		// Mock requestAnimationFrame
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
			cb(0)
			return 0
		})
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should apply fade class on mount', () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade>Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-fade')
		})

		it('should be visible when initially true', () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="true">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.style.opacity).toBe('1')
		})

		it('should be hidden when initially false', () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="false">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.style.display).toBe('none')
		})
	})

	describe('fade direction', () => {
		it('should fade in when direction is "in"', async () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="'in'">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.style.opacity).toBe('1')
		})

		it('should fade out when direction is "out"', async () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="'out'">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			// Should start fading out
			expect(element.style.opacity).toBe('0')
		})

		it('should set display none after fade out completes', async () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="'out'">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.style.opacity).toBe('0')

			// Advance past duration to complete fade out
			vi.advanceTimersByTime(300)
			await nextTick()

			expect(element.style.display).toBe('none')
		})
	})

	describe('visibility toggle', () => {
		it('should fade in when visible changes to true', async () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="isVisible">Content</div>`,
				data() {
					return { isVisible: false }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.style.display).toBe('none')

			await wrapper.setData({ isVisible: true })
			await nextTick()

			expect(element.style.display).toBe('')
			expect(element.style.opacity).toBe('1')
		})

		it('should fade out when visible changes to false', async () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="isVisible">Content</div>`,
				data() {
					return { isVisible: true }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.style.opacity).toBe('1')

			await wrapper.setData({ isVisible: false })
			await nextTick()

			// Should start fading out
			expect(element.style.opacity).toBe('0')

			// Advance past duration
			vi.advanceTimersByTime(300)
			await nextTick()

			expect(element.style.display).toBe('none')
		})
	})

	describe('options', () => {
		it('should use custom duration', () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="{ visible: true, duration: 500 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.style.transition).toContain('500ms')
		})

		it('should use custom easing', () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="{ visible: true, easing: 'ease-in-out' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.style.transition).toContain('ease-in-out')
		})

		it('should use custom delay', () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="{ visible: true, delay: 100 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.style.transition).toContain('100ms')
		})
	})

	describe('callbacks', () => {
		it('should call onComplete when fade completes', async () => {
			const onComplete = vi.fn()
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="{ visible: isVisible, onComplete }">Content</div>`,
				data() {
					return { isVisible: false, onComplete }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ isVisible: true })
			await nextTick()

			// Advance past duration
			vi.advanceTimersByTime(300)
			await nextTick()

			expect(onComplete).toHaveBeenCalled()
		})

		it('should call onComplete when fade out completes', async () => {
			const onComplete = vi.fn()
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="{ visible: isVisible, onComplete }">Content</div>`,
				data() {
					return { isVisible: true, onComplete }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ isVisible: false })
			await nextTick()

			// Advance past duration
			vi.advanceTimersByTime(300)
			await nextTick()

			expect(onComplete).toHaveBeenCalled()
		})

		it('should call onStart when fade begins', async () => {
			const onStart = vi.fn()
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="{ visible: isVisible, onStart }">Content</div>`,
				data() {
					return { isVisible: false, onStart }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ isVisible: true })
			await nextTick()

			expect(onStart).toHaveBeenCalledWith('in')
		})

		it('should call onStart when fade out begins', async () => {
			const onStart = vi.fn()
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-fade="{ visible: isVisible, onStart }">Content</div>`,
				data() {
					return { isVisible: true, onStart }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ isVisible: false })
			await nextTick()

			expect(onStart).toHaveBeenCalledWith('out')
		})
	})

	describe('cleanup', () => {
		it('should remove fade class on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-if="show" v-fade>Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-fade').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-fade').exists()).toBe(false)
		})

		it('should cancel animation frame on unmount', async () => {
			// Use a different mock that doesn't execute callback immediately
			vi.spyOn(window, 'requestAnimationFrame').mockImplementation((_cb: FrameRequestCallback) => {
				return 123 // Return a non-zero frame ID
			})
			const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame')

			const TestComponent = defineComponent({
				directives: { fade: vFade },
				template: `<div v-if="show" v-fade="'in'">Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			// Unmount while animation frame is pending
			await wrapper.setData({ show: false })
			await nextTick()

			// cancelAnimationFrame should be called with the frame ID
			expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(123)

			cancelAnimationFrameSpy.mockRestore()
		})
	})
})
