import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vCounter } from '../../src/directives'

describe('v-counter', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('basic functionality', () => {
		it('should add v-counter class on mount', () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="100">0</span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').classes()).toContain('v-counter')
		})

		it('should set initial text content', () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100, startValue: 0 }">0</span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').text()).toBe('0')
		})

		it('should accept number as binding value', () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="100">0</span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').classes()).toContain('v-counter')
		})

		it('should accept options object as binding value', () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100 }">0</span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').classes()).toContain('v-counter')
		})
	})

	describe('animation', () => {
		it('should animate from startValue to target value', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100, startValue: 0, duration: 1000 }">0</span>`,
			})

			const wrapper = mount(TestComponent)
			const span = wrapper.find('span')

			// Initial value
			expect(span.text()).toBe('0')

			// Advance time to complete animation
			vi.advanceTimersByTime(1000)
			await nextTick()

			// Final value
			expect(span.text()).toBe('100')
		})

		it('should use custom duration', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 50, duration: 500 }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			vi.advanceTimersByTime(500)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('50')
		})

		it('should respect delay option', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100, delay: 200, duration: 500 }">0</span>`,
			})

			const wrapper = mount(TestComponent)
			const span = wrapper.find('span')

			// Should still be at start after delay period
			expect(span.text()).toBe('0')

			// Advance past delay
			vi.advanceTimersByTime(200)
			await nextTick()

			// Now animation should start

			// Complete animation
			vi.advanceTimersByTime(500)
			await nextTick()

			expect(span.text()).toBe('100')
		})

		it('should not animate when value equals startValue', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100, startValue: 100 }">100</span>`,
			})

			const wrapper = mount(TestComponent)
			const span = wrapper.find('span')

			// Should remain at the value
			expect(span.text()).toBe('100')

			// Advance time - should still be same
			vi.advanceTimersByTime(1000)
			await nextTick()

			expect(span.text()).toBe('100')
		})
	})

	describe('decimals option', () => {
		it('should respect decimals option', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100.5, decimals: 1 }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			vi.advanceTimersByTime(2500)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('100.5')
		})

		it('should format with multiple decimals', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100.123, decimals: 3 }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			vi.advanceTimersByTime(2500)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('100.123')
		})
	})

	describe('useGrouping option', () => {
		it('should use thousands separator when enabled', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 10000, useGrouping: true }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			vi.advanceTimersByTime(2500)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('10,000')
		})

		it('should not use thousands separator when disabled', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 10000, useGrouping: false }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			vi.advanceTimersByTime(2500)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('10000')
		})
	})

	describe('locale option', () => {
		it('should use specified locale', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 10000, useGrouping: true, locale: 'de-DE' }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			vi.advanceTimersByTime(2500)
			await nextTick()

			// German locale uses dots for thousands
			expect(wrapper.find('span').text()).toMatch(/10[.,]000/)
		})
	})

	describe('formatter option', () => {
		it('should use custom formatter', async () => {
			const formatter = (value: number) => `$${value.toFixed(2)}`
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100, formatter }">0</span>`,
				data() {
					return { formatter }
				},
			})

			const wrapper = mount(TestComponent)

			vi.advanceTimersByTime(2500)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('$100.00')
		})
	})

	describe('easing options', () => {
		it('should support linear easing', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100, easing: 'linear', duration: 1000 }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			// Advance past the full animation duration + buffer
			vi.advanceTimersByTime(2500)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('100')
		})

		it('should support easeOut easing', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100, easing: 'easeOut', duration: 1000 }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			vi.advanceTimersByTime(2500)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('100')
		})

		it('should support custom easing function', async () => {
			const customEasing = (t: number) => t * t
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100, customEasing: fn, duration: 1000 }">0</span>`,
				data() {
					return { fn: customEasing }
				},
			})

			const wrapper = mount(TestComponent)

			vi.advanceTimersByTime(2500)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('100')
		})
	})

	describe('callbacks', () => {
		it('should call onStart callback', async () => {
			const onStart = vi.fn()
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100, onStart }">0</span>`,
				data() {
					return { onStart }
				},
			})

			mount(TestComponent)

			// Wait for delay + some animation time
			vi.advanceTimersByTime(100)
			await nextTick()

			expect(onStart).toHaveBeenCalled()
		})

		it('should call onComplete callback', async () => {
			const onComplete = vi.fn()
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100, onComplete, duration: 500 }">0</span>`,
				data() {
					return { onComplete }
				},
			})

			mount(TestComponent)

			vi.advanceTimersByTime(1000)
			await nextTick()

			expect(onComplete).toHaveBeenCalledWith(100)
		})

		it('should call onUpdate callback during animation', async () => {
			const onUpdate = vi.fn()
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: 100, onUpdate, duration: 500 }">0</span>`,
				data() {
					return { onUpdate }
				},
			})

			mount(TestComponent)

			vi.advanceTimersByTime(1000)
			await nextTick()

			expect(onUpdate).toHaveBeenCalled()
		})
	})

	describe('update', () => {
		it('should update target value dynamically', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: target, duration: 500 }">0</span>`,
				data() {
					return { target: 50 }
				},
			})

			const wrapper = mount(TestComponent)

			// Complete first animation
			vi.advanceTimersByTime(1000)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('50')

			// Update target
			await wrapper.setData({ target: 100 })
			await nextTick()

			// Complete second animation
			vi.advanceTimersByTime(1000)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('100')
		})

		it('should smoothly transition from current value', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-counter="{ value: target, duration: 500 }">0</span>`,
				data() {
					return { target: 50 }
				},
			})

			const wrapper = mount(TestComponent)

			// Half way through first animation
			vi.advanceTimersByTime(250)
			await nextTick()

			// Update target
			await wrapper.setData({ target: 100 })
			await nextTick()

			// Complete animation
			vi.advanceTimersByTime(1000)
			await nextTick()

			expect(wrapper.find('span').text()).toBe('100')
		})
	})

	describe('cleanup', () => {
		it('should clean up on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { counter: vCounter },
				template: `<span v-if="show" v-counter="100">0</span>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('span').classes()).toContain('v-counter')

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('span').exists()).toBe(false)
		})
	})
})