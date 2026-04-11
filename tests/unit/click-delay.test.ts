import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vClickDelay } from '../../src/directives/click-delay'

describe('v-click-delay', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should call handler on click', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="handler">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.find('button').trigger('click')

			expect(handler).toHaveBeenCalled()
		})

		it('should prevent rapid clicks', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="handler">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			expect(handler).toHaveBeenCalledTimes(1)

			// Rapid second click should be ignored
			await wrapper.find('button').trigger('click')
			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should allow click after delay', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="handler">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			expect(handler).toHaveBeenCalledTimes(1)

			// Advance past default delay (300ms)
			vi.advanceTimersByTime(300)

			await wrapper.find('button').trigger('click')
			expect(handler).toHaveBeenCalledTimes(2)
		})
	})

	describe('options', () => {
		it('should accept custom delay', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="{ handler, delay: 500 }">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			expect(handler).toHaveBeenCalledTimes(1)

			// 300ms should not be enough
			vi.advanceTimersByTime(300)
			await wrapper.find('button').trigger('click')
			expect(handler).toHaveBeenCalledTimes(1)

			// 500ms should be enough
			vi.advanceTimersByTime(200)
			await wrapper.find('button').trigger('click')
			expect(handler).toHaveBeenCalledTimes(2)
		})

		it('should accept delay via arg', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay:500="handler">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			expect(handler).toHaveBeenCalledTimes(1)

			// Advance past 500ms
			vi.advanceTimersByTime(500)
			await wrapper.find('button').trigger('click')
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

			await wrapper.find('button').trigger('click')

			expect(wrapper.find('button').classes()).toContain('v-click-delay--pending')

			vi.advanceTimersByTime(300)
			await nextTick()

			expect(wrapper.find('button').classes()).not.toContain('v-click-delay--pending')
		})

		it('should not add pending class when feedback is false', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="{ handler, feedback: false }">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')

			expect(wrapper.find('button').classes()).not.toContain('v-click-delay--pending')
		})
	})

	describe('disabled option', () => {
		it('should not bind events when disabled', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="{ handler, disabled: true }">Click</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			// Click should not be handled by directive
			wrapper.find('button').trigger('click')
			// The handler is not bound, so it won't be called
		})

		it('should enable when disabled changes to false', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-click-delay="{ handler, disabled: isDisabled }">Click</button>`,
				data() {
					return { handler, isDisabled: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ isDisabled: false })
			await nextTick()

			await wrapper.find('button').trigger('click')
			expect(handler).toHaveBeenCalled()
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { clickDelay: vClickDelay },
				template: `<button v-if="show" v-click-delay="handler">Click</button>`,
				data() {
					return { handler, show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			expect(handler).toHaveBeenCalledTimes(1)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('button').exists()).toBe(false)
		})
	})
})
