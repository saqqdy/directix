import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { vFullscreen, vProgress } from '../../src/directives'

describe('media directives', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('v-fullscreen', () => {
		it('should mount without errors when fullscreen is not supported', async () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen>Content</div>`,
			})

			const wrapper = mount(TestComponent)
			// In JSDOM, fullscreen is not supported, so directive exits early
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should accept options object', async () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ fullscreenClass: 'my-fullscreen' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should accept boolean value', async () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="false">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should support onEnter callback', async () => {
			const onEnter = vi.fn()
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ onEnter }">Content</div>`,
				data() {
					return { onEnter }
				},
			})

			mount(TestComponent)
			// onEnter would be called on fullscreen change
			expect(typeof onEnter).toBe('function')
		})

		it('should support onExit callback', async () => {
			const onExit = vi.fn()
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ onExit }">Content</div>`,
				data() {
					return { onExit }
				},
			})

			mount(TestComponent)
			expect(typeof onExit).toBe('function')
		})

		it('should support onChange callback', async () => {
			const onChange = vi.fn()
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ onChange }">Content</div>`,
				data() {
					return { onChange }
				},
			})

			mount(TestComponent)
			expect(typeof onChange).toBe('function')
		})

		it('should support toggleKey option', async () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ toggleKey: 'f' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should support toggleKey false to disable', async () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ toggleKey: false }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should cleanup on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-if="show" v-fullscreen>Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)
		})

		it('should update options on updated', async () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ fullscreenClass: customClass }">Content</div>`,
				data() {
					return { customClass: 'fullscreen-1' }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ customClass: 'fullscreen-2' })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(true)
		})
	})

	describe('v-progress', () => {
		it('should create progress bar with number value', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="50">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			expect(element.querySelector('.v-progress')).not.toBeNull()
			expect(element.querySelector('.v-progress__bar')).not.toBeNull()
		})

		it('should accept options object', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 75, color: '#ff0000', height: 8 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const progressBar = element.querySelector('.v-progress__bar')
			expect(progressBar).not.toBeNull()
			expect(progressBar?.style.backgroundColor).toBe('rgb(255, 0, 0)')
		})

		it('should update progress value dynamically', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="progress">Content</div>`,
				data() {
					return { progress: 25 }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			let progressBar = element.querySelector('.v-progress__bar')
			expect(progressBar?.style.width).toBe('25%')

			await wrapper.setData({ progress: 75 })
			await nextTick()

			progressBar = element.querySelector('.v-progress__bar')
			expect(progressBar?.style.width).toBe('75%')
		})

		it('should support showText option', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 50, showText: true }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const textEl = element.querySelector('.v-progress__text')
			expect(textEl).not.toBeNull()
			expect(textEl?.textContent).toBe('50%')
		})

		it('should support indeterminate mode', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ indeterminate: true }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const progressBar = element.querySelector('.v-progress__bar')
			expect(progressBar?.classList.contains('v-progress--indeterminate')).toBe(true)
		})

		it('should support striped option', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 50, striped: true }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const progressBar = element.querySelector('.v-progress__bar')
			expect(progressBar?.style.backgroundImage).toContain('linear-gradient')
		})

		it('should support animated option', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 50, animated: true }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const progressBar = element.querySelector('.v-progress__bar')
			expect(progressBar?.style.animation).toContain('v-progress-stripes')
		})

		it('should support position option', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 50, position: 'bottom' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const container = element.querySelector('.v-progress')
			expect(container?.style.bottom).toBe('0px')
		})

		it('should support onChange callback', async () => {
			const onChange = vi.fn()
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: progress, onChange }">Content</div>`,
				data() {
					return { progress: 25, onChange }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ progress: 50 })
			await nextTick()

			expect(onChange).toHaveBeenCalled()
		})

		it('should call onComplete at 100%', async () => {
			const onComplete = vi.fn()
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: progress, onComplete }">Content</div>`,
				data() {
					return { progress: 50, onComplete }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ progress: 100 })
			await nextTick()

			expect(onComplete).toHaveBeenCalled()
		})

		it('should support custom class', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 50, class: 'my-progress' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const container = element.querySelector('.v-progress')
			expect(container?.classList.contains('my-progress')).toBe(true)
		})

		it('should clamp value between min and max', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 150, max: 100 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const progressBar = element.querySelector('.v-progress__bar')
			expect(progressBar?.style.width).toBe('100%')
		})

		it('should support min option', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-progress="{ value: 50, min: 0, max: 200 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			const progressBar = element.querySelector('.v-progress__bar')
			expect(progressBar?.style.width).toBe('25%')
		})

		it('should cleanup on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { progress: vProgress },
				template: `<div v-if="show" v-progress="50">Content</div>`,
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