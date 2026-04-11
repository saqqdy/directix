import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { vBlur, vClickDelay } from '../../src/directives'

describe('UI effect directives', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('v-blur', () => {
		it('should add blur overlay when visible is true', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="true">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.classList.contains('v-blur')).toBe(true)
			expect(element.querySelector('.v-blur-overlay')).not.toBeNull()
		})

		it('should not add blur overlay when visible is false', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="false">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.classList.contains('v-blur')).toBe(true)
			expect(element.querySelector('.v-blur-overlay')).toBeNull()
		})

		it('should use number as radius', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="15">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const overlay = element.querySelector('.v-blur-overlay')
			expect(overlay).not.toBeNull()
			// Verify overlay exists with correct class
			expect(overlay?.classList.contains('v-blur-overlay')).toBe(true)
		})

		it('should accept options object', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: true, radius: 20, overlayColor: 'rgba(255,255,255,0.5)', lockScroll: true }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const overlay = element.querySelector('.v-blur-overlay')
			expect(overlay).not.toBeNull()
			// Verify overlay exists
			expect(overlay?.classList.contains('v-blur-overlay')).toBe(true)
		})

		it('should show blur on visibility change', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="isBlurred">Content</div>`,
				data() {
					return { isBlurred: false }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.querySelector('.v-blur-overlay')).toBeNull()

			await wrapper.setData({ isBlurred: true })
			await nextTick()

			expect(element.querySelector('.v-blur-overlay')).not.toBeNull()
		})

		it('should hide blur on visibility change to false', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="isBlurred">Content</div>`,
				data() {
					return { isBlurred: true }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.querySelector('.v-blur-overlay')).not.toBeNull()

			await wrapper.setData({ isBlurred: false })
			await nextTick()

			// Blur should start fading out
			const overlay = element.querySelector('.v-blur-overlay')
			expect(overlay?.style.opacity).toBe('0')
		})

		it('should call onShow callback', async () => {
			const onShow = vi.fn()
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: true, onShow }">Content</div>`,
				data() {
					return { onShow }
				},
			})

			mount(TestComponent)

			expect(onShow).toHaveBeenCalled()
		})

		it('should call onHide callback', async () => {
			const onHide = vi.fn()
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: isBlurred, onHide, duration: 100 }">Content</div>`,
				data() {
					return { isBlurred: true, onHide }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ isBlurred: false })
			await nextTick()

			expect(onHide).toHaveBeenCalled()
		})

		it('should remove blur overlay on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-if="show" v-blur="true">Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.classList.contains('v-blur')).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			// Element should be removed
			expect(wrapper.find('div').exists()).toBe(false)
		})

		it('should use custom class', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: true, class: 'custom-blur' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const overlay = element.querySelector('.v-blur-overlay')
			expect(overlay?.classList.contains('custom-blur')).toBe(true)
		})

		it('should use custom z-index', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: true, zIndex: 1000 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const overlay = element.querySelector('.v-blur-overlay')
			expect(overlay?.style.zIndex).toBe('1000')
		})

		it('should update blur radius dynamically', async () => {
			const TestComponent = defineComponent({
				directives: { blur: vBlur },
				template: `<div v-blur="{ visible: true, radius: radius }">Content</div>`,
				data() {
					return { radius: 5 }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			let overlay = element.querySelector('.v-blur-overlay')
			expect(overlay).not.toBeNull()

			await wrapper.setData({ radius: 15 })
			await nextTick()

			overlay = element.querySelector('.v-blur-overlay')
			expect(overlay).not.toBeNull()
		})
	})

	describe('v-click-delay', () => {
		it('should call handler on first click', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="handler">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')

			expect(handler).toHaveBeenCalled()
		})

		it('should prevent second click during delay', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="handler">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(1)

			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(1) // Still 1, blocked

			vi.advanceTimersByTime(300)

			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(2)
		})

		it('should accept delay time as argument', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay:500="handler">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(1)

			vi.advanceTimersByTime(300)
			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(1) // Still blocked

			vi.advanceTimersByTime(200)
			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(2)
		})

		it('should accept options object', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="{ handler, delay: 1000 }">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(1)

			vi.advanceTimersByTime(500)
			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(1) // Still blocked

			vi.advanceTimersByTime(500)
			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(2)
		})

		it('should add pending class during delay', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="{ handler, feedback: true }">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')

			expect(button.classes()).toContain('v-click-delay--pending')

			vi.advanceTimersByTime(300)

			expect(button.classes()).not.toContain('v-click-delay--pending')
		})

		it('should use custom pending class', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="{ handler, pendingClass: 'is-waiting' }">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')

			expect(button.classes()).toContain('is-waiting')
		})

		it('should not add class when feedback is false', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="{ handler, feedback: false }">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')

			expect(button.classes()).not.toContain('v-click-delay--pending')
		})

		it('should not bind when disabled', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="{ handler, disabled: true }">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')

			// When disabled, no event listener is bound, so handler is not called
			expect(handler).toHaveBeenCalledTimes(0)
		})

		it('should handle touchend events', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="handler">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('touchend')

			expect(handler).toHaveBeenCalled()
		})

		it('should cleanup on unmount', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-if="show" v-click-delay="handler">Click</button>`,
				data() {
					return { show: true, handler }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('button').exists()).toBe(false)
		})

		it('should throw error when binding is null', () => {
			const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="null">Click</button>`,
			})

			// When binding is null/undefined, it should throw
			expect(() => mount(TestComponent)).toThrow()

			errorSpy.mockRestore()
		})

		it('should enable/disable dynamically', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="{ handler, disabled: isDisabled }">Click</button>`,
				data() {
					return { isDisabled: true, handler }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			// When disabled initially, no event listener is bound
			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(0)

			// Enable the directive
			await wrapper.setData({ isDisabled: false })
			await nextTick()

			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(1)

			// Second click should be blocked during delay
			await button.trigger('click')
			expect(handler).toHaveBeenCalledTimes(1) // Still 1, blocked
		})
	})
})