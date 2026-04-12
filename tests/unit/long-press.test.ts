import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vLongPress } from '../../src/directives/long-press'

describe('v-long-press', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('basic functionality', () => {
		it('should trigger handler after default duration (500ms)', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="handler">Press</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			// Trigger mousedown
			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

			// Advance time by 400ms - should not trigger yet
			vi.advanceTimersByTime(400)
			expect(handler).not.toHaveBeenCalled()

			// Advance time by 500ms - should trigger
			vi.advanceTimersByTime(100)
			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should accept options object with custom duration', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler, duration: 1000 }">Press</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

			// Not triggered after 500ms
			vi.advanceTimersByTime(500)
			expect(handler).not.toHaveBeenCalled()

			// Triggered after 1000ms
			vi.advanceTimersByTime(500)
			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should cancel on mouseup before duration', async () => {
			const handler = vi.fn()
			const onCancel = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler, onCancel }">Press</button>`,
				data() {
					return { handler, onCancel }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

			// Release before duration
			vi.advanceTimersByTime(200)
			button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

			// Advance past the duration
			vi.advanceTimersByTime(300)

			expect(handler).not.toHaveBeenCalled()
			expect(onCancel).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should cancel on mouseleave', async () => {
			const handler = vi.fn()
			const onCancel = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler, onCancel }">Press</button>`,
				data() {
					return { handler, onCancel }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
			vi.advanceTimersByTime(200)

			button.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))

			vi.advanceTimersByTime(300)

			expect(handler).not.toHaveBeenCalled()
			expect(onCancel).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('callbacks', () => {
		it('should call onStart when press starts', async () => {
			const handler = vi.fn()
			const onStart = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler, onStart }">Press</button>`,
				data() {
					return { handler, onStart }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

			expect(onStart).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should call onTick during long press', async () => {
			const handler = vi.fn()
			const onTick = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler, onTick, duration: 500, tickInterval: 100 }">Press</button>`,
				data() {
					return { handler, onTick }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

			// Should tick at 100ms intervals
			vi.advanceTimersByTime(100)
			expect(onTick).toHaveBeenCalledTimes(1)

			vi.advanceTimersByTime(100)
			expect(onTick).toHaveBeenCalledTimes(2)

			// Complete the long press
			vi.advanceTimersByTime(300)
			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('distance option', () => {
		it('should cancel if moved beyond distance threshold', async () => {
			const handler = vi.fn()
			const onCancel = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler, onCancel, distance: 10 }">Press</button>`,
				data() {
					return { handler, onCancel }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0, clientY: 0 }))
			vi.advanceTimersByTime(200)

			// Move beyond threshold (more than 10px)
			button.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 20, clientY: 20 }))

			vi.advanceTimersByTime(300)

			expect(handler).not.toHaveBeenCalled()
			expect(onCancel).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should not cancel if moved within distance threshold', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler, distance: 10 }">Press</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0, clientY: 0 }))

			vi.advanceTimersByTime(200)

			// Move within threshold
			button.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 5, clientY: 5 }))

			vi.advanceTimersByTime(300)

			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('prevent and stop options', () => {
		it('should prevent default when prevent option is true', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler, prevent: true }">Press</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
			const preventSpy = vi.spyOn(event, 'preventDefault')

			button.dispatchEvent(event)

			expect(preventSpy).toHaveBeenCalled()

			wrapper.unmount()
		})

		it('should stop propagation when stop option is true', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler, stop: true }">Press</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			const event = new MouseEvent('mousedown', { bubbles: true })
			const stopSpy = vi.spyOn(event, 'stopPropagation')

			button.dispatchEvent(event)

			expect(stopSpy).toHaveBeenCalled()

			wrapper.unmount()
		})
	})

	describe('disabled option', () => {
		it('should not trigger when disabled', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler, disabled: true }">Press</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
			vi.advanceTimersByTime(500)

			expect(handler).not.toHaveBeenCalled()

			wrapper.unmount()
		})
	})

	describe('touch events', () => {
		it('should work with touch events', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="handler">Press</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }))
			vi.advanceTimersByTime(500)

			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should cancel on touchend', async () => {
			const handler = vi.fn()
			const onCancel = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler, onCancel }">Press</button>`,
				data() {
					return { handler, onCancel }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }))
			vi.advanceTimersByTime(200)
			button.dispatchEvent(new TouchEvent('touchend', { bubbles: true }))
			vi.advanceTimersByTime(300)

			expect(handler).not.toHaveBeenCalled()
			expect(onCancel).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('error handling', () => {
		it('should throw error when binding is null', () => {
			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="nullValue">Press</button>`,
				data() {
					return { nullValue: null as any }
				},
			})

			expect(() => mount(TestComponent, { attachTo: document.body })).toThrow('[Directix] v-long-press: handler is required')
		})

		it('should work when handler is provided in options', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-long-press="{ handler }">Press</button>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
			vi.advanceTimersByTime(500)

			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('cleanup', () => {
		it('should clear timers on unmount', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-if="show" v-long-press="handler">Press</button>`,
				data() {
					return { show: true, handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

			// Unmount before timer completes
			await wrapper.setData({ show: false })
			await nextTick()

			// Advance timer past duration
			vi.advanceTimersByTime(500)

			// Handler should not be called after unmount
			expect(handler).not.toHaveBeenCalled()

			wrapper.unmount()
		})

		it('should clear tick timer on unmount', async () => {
			const handler = vi.fn()
			const onTick = vi.fn()

			const TestComponent = defineComponent({
				directives: { longPress: vLongPress },
				template: `<button v-if="show" v-long-press="{ handler, onTick, duration: 1000, tickInterval: 100 }">Press</button>`,
				data() {
					return { show: true, handler, onTick }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button').element

			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

			// Let some ticks happen
			vi.advanceTimersByTime(200)
			expect(onTick).toHaveBeenCalled()

			// Unmount before timer completes
			await wrapper.setData({ show: false })
			await nextTick()

			// Clear previous calls
			onTick.mockClear()

			// Advance timer - should not tick anymore
			vi.advanceTimersByTime(300)
			expect(onTick).not.toHaveBeenCalled()

			wrapper.unmount()
		})
	})
})
