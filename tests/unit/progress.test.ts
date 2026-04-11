import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vProgress } from '../../src/directives/progress'

describe('v-progress', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
		// Remove any injected styles
		const style = document.getElementById('v-progress-styles')
		if (style) style.remove()
	})

	describe('basic functionality', () => {
		it('should create progress bar when mounted', () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="50">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-progress').exists()).toBe(true)
			expect(wrapper.find('.v-progress__bar').exists()).toBe(true)
		})

		it('should set progress width based on value', () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="50">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const progressBar = wrapper.find('.v-progress__bar').element as HTMLElement

			expect(progressBar.style.width).toBe('50%')
		})

		it('should accept options object', () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 75 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const progressBar = wrapper.find('.v-progress__bar').element as HTMLElement

			expect(progressBar.style.width).toBe('75%')
		})
	})

	describe('options', () => {
		it('should use custom color', () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 50, color: '#ff0000' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const progressBar = wrapper.find('.v-progress__bar').element as HTMLElement

			// JSDOM converts hex to rgb
			expect(progressBar.style.backgroundColor).toMatch(/#ff0000|rgb\(255, 0, 0\)/)
		})

		it('should use custom height', () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 50, height: 10 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const container = wrapper.find('.v-progress').element as HTMLElement

			expect(container.style.height).toBe('10px')
		})

		it('should show text when showText is true', () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 50, showText: true }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-progress__text').exists()).toBe(true)
			expect(wrapper.find('.v-progress__text').text()).toBe('50%')
		})

		it('should support indeterminate mode', () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ indeterminate: true }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const progressBar = wrapper.find('.v-progress__bar').element as HTMLElement

			expect(progressBar.classList.contains('v-progress--indeterminate')).toBe(true)
		})
	})

	describe('progress update', () => {
		it('should update progress when value changes', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="value">Content</div>`,
				data() {
					return { value: 30 }
				},
			})

			const wrapper = mount(TestComponent)
			let progressBar = wrapper.find('.v-progress__bar').element as HTMLElement

			expect(progressBar.style.width).toBe('30%')

			await wrapper.setData({ value: 70 })
			await nextTick()

			progressBar = wrapper.find('.v-progress__bar').element as HTMLElement
			expect(progressBar.style.width).toBe('70%')
		})

		it('should call onChange callback', async () => {
			const onChange = vi.fn()
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value, onChange }">Content</div>`,
				data() {
					return { value: 30, onChange }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ value: 70 })
			await nextTick()

			expect(onChange).toHaveBeenCalled()
		})

		it('should call onComplete when progress reaches 100%', async () => {
			const onComplete = vi.fn()
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value, onComplete }">Content</div>`,
				data() {
					return { value: 50, onComplete }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ value: 100 })
			await nextTick()

			expect(onComplete).toHaveBeenCalled()
		})
	})

	describe('cleanup', () => {
		it('should remove progress bar on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-if="show" v-progress="50">Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-progress').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-progress').exists()).toBe(false)
		})
	})
})
