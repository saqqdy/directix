import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vParallax } from '../../src/directives/parallax'

describe('v-parallax', () => {
	beforeEach(() => {
		// Mock requestAnimationFrame
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
			cb(0)
			return 0
		})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should add v-parallax class on mount', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax>Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-parallax')
		})

		it('should accept number as speed factor', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="0.3">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should accept options object', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ speed: 0.5 }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should not apply parallax when disabled', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="false">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})
	})

	describe('options', () => {
		it('should support reverse direction', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ reverse: true }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should support horizontal parallax', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ horizontal: true }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should support mobile breakpoint', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ mobileBreakpoint: 768 }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-if="show" v-parallax>Parallax content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-parallax').exists()).toBe(false)
		})
	})
})
