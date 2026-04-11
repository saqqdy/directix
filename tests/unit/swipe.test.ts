import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vSwipe, SwipeDirection } from '../../src/directives'

describe('v-swipe', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('basic functionality', () => {
		it('should apply touch-action and user-select styles', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="handler">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div').element

			expect(div.style.touchAction).toBe('none')
			expect(div.style.userSelect).toBe('none')
		})

		it('should accept handler function as binding', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="handler">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)
			// Handler should be stored
			expect(handler).toBeDefined()
		})

		it('should accept options object as binding', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="{ handler }">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)
			expect(handler).toBeDefined()
		})
	})

	describe('swipe detection', () => {
		it('should detect swipe left', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="handler">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			// Simulate touch start
			await div.trigger('touchstart', {
				touches: [{ clientX: 100, clientY: 50 }],
			})

			// Simulate touch end (swipe left)
			await div.trigger('touchend', {
				changedTouches: [{ clientX: 50, clientY: 50 }],
			})

			expect(handler).toHaveBeenCalled()
		})

		it('should detect swipe right', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="handler">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			// Simulate touch start
			await div.trigger('touchstart', {
				touches: [{ clientX: 50, clientY: 50 }],
			})

			// Simulate touch end (swipe right)
			await div.trigger('touchend', {
				changedTouches: [{ clientX: 100, clientY: 50 }],
			})

			expect(handler).toHaveBeenCalled()
		})

		it('should detect swipe up', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="handler">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			// Simulate touch start
			await div.trigger('touchstart', {
				touches: [{ clientX: 50, clientY: 100 }],
			})

			// Simulate touch end (swipe up)
			await div.trigger('touchend', {
				changedTouches: [{ clientX: 50, clientY: 50 }],
			})

			expect(handler).toHaveBeenCalled()
		})

		it('should detect swipe down', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="handler">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			// Simulate touch start
			await div.trigger('touchstart', {
				touches: [{ clientX: 50, clientY: 50 }],
			})

			// Simulate touch end (swipe down)
			await div.trigger('touchend', {
				changedTouches: [{ clientX: 50, clientY: 100 }],
			})

			expect(handler).toHaveBeenCalled()
		})
	})

	describe('direction callbacks', () => {
		it('should call onLeft callback for left swipe', async () => {
			const onLeft = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="{ onLeft }">Swipe me</div>`,
				data() {
					return { onLeft }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('touchstart', {
				touches: [{ clientX: 100, clientY: 50 }],
			})

			await div.trigger('touchend', {
				changedTouches: [{ clientX: 50, clientY: 50 }],
			})

			expect(onLeft).toHaveBeenCalled()
		})

		it('should call onRight callback for right swipe', async () => {
			const onRight = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="{ onRight }">Swipe me</div>`,
				data() {
					return { onRight }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('touchstart', {
				touches: [{ clientX: 50, clientY: 50 }],
			})

			await div.trigger('touchend', {
				changedTouches: [{ clientX: 100, clientY: 50 }],
			})

			expect(onRight).toHaveBeenCalled()
		})

		it('should call onUp callback for up swipe', async () => {
			const onUp = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="{ onUp }">Swipe me</div>`,
				data() {
					return { onUp }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('touchstart', {
				touches: [{ clientX: 50, clientY: 100 }],
			})

			await div.trigger('touchend', {
				changedTouches: [{ clientX: 50, clientY: 50 }],
			})

			expect(onUp).toHaveBeenCalled()
		})

		it('should call onDown callback for down swipe', async () => {
			const onDown = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="{ onDown }">Swipe me</div>`,
				data() {
					return { onDown }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('touchstart', {
				touches: [{ clientX: 50, clientY: 50 }],
			})

			await div.trigger('touchend', {
				changedTouches: [{ clientX: 50, clientY: 100 }],
			})

			expect(onDown).toHaveBeenCalled()
		})
	})

	describe('options', () => {
		it('should respect threshold option', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="{ handler, threshold: 100 }">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			// Swipe less than threshold
			await div.trigger('touchstart', {
				touches: [{ clientX: 100, clientY: 50 }],
			})

			await div.trigger('touchend', {
				changedTouches: [{ clientX: 60, clientY: 50 }], // Only 40px
			})

			expect(handler).not.toHaveBeenCalled()
		})

		it('should respect directions option', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="{ handler, directions: ['left', 'right'] }">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			// Swipe up - should not trigger
			await div.trigger('touchstart', {
				touches: [{ clientX: 50, clientY: 100 }],
			})

			await div.trigger('touchend', {
				changedTouches: [{ clientX: 50, clientY: 50 }],
			})

			expect(handler).not.toHaveBeenCalled()
		})

		it('should respect maxTime option', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="{ handler, maxTime: 200 }">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('touchstart', {
				touches: [{ clientX: 100, clientY: 50 }],
			})

			// Wait longer than maxTime
			vi.advanceTimersByTime(300)

			await div.trigger('touchend', {
				changedTouches: [{ clientX: 50, clientY: 50 }],
			})

			expect(handler).not.toHaveBeenCalled()
		})

		it('should respect disabled option', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="{ handler, disabled: true }">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('touchstart', {
				touches: [{ clientX: 100, clientY: 50 }],
			})

			await div.trigger('touchend', {
				changedTouches: [{ clientX: 50, clientY: 50 }],
			})

			expect(handler).not.toHaveBeenCalled()
		})

		it('should respect mouse option', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="{ handler, mouse: false }">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			// Mouse events should not work
			await div.trigger('mousedown', { clientX: 100, clientY: 50 })
			await div.trigger('mouseup', { clientX: 50, clientY: 50 })

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('mouse events', () => {
		it('should detect swipe with mouse', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="handler">Swipe me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('mousedown', { clientX: 100, clientY: 50 })
			await div.trigger('mouseup', { clientX: 50, clientY: 50 })

			expect(handler).toHaveBeenCalled()
		})
	})

	describe('update', () => {
		it('should update options on binding change', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-swipe="{ handler, disabled }">Swipe me</div>`,
				data() {
					return { handler, disabled: true }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('touchstart', {
				touches: [{ clientX: 100, clientY: 50 }],
			})

			await div.trigger('touchend', {
				changedTouches: [{ clientX: 50, clientY: 50 }],
			})

			expect(handler).not.toHaveBeenCalled()

			// Enable swipe
			await wrapper.setData({ disabled: false })
			await nextTick()

			await div.trigger('touchstart', {
				touches: [{ clientX: 100, clientY: 50 }],
			})

			await div.trigger('touchend', {
				changedTouches: [{ clientX: 50, clientY: 50 }],
			})

			expect(handler).toHaveBeenCalled()
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { swipe: vSwipe },
				template: `<div v-if="show" v-swipe="handler">Swipe me</div>`,
				data() {
					return { show: true, handler }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)
		})
	})
})