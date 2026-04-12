import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vSkeleton } from '../../src/directives'

describe('v-skeleton', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('basic functionality', () => {
		it('should add v-skeleton-container class on mount', () => {
			const TestComponent = defineComponent({
				directives: { skeleton: vSkeleton },
				template: `<div v-skeleton>Content</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').classes()).toContain('v-skeleton-container')
		})

		it('should hide content when loading is true', () => {
			const TestComponent = defineComponent({
				directives: { skeleton: vSkeleton },
				template: `<div v-skeleton="true">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div').element

			expect(div.style.display).toBe('none')
		})

		it('should show content when loading is false', () => {
			const TestComponent = defineComponent({
				directives: { skeleton: vSkeleton },
				template: `<div v-skeleton="false">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div').element

			expect(div.style.display).not.toBe('none')
		})

		it('should accept options object', () => {
			const TestComponent = defineComponent({
				directives: { skeleton: vSkeleton },
				template: `<div v-skeleton="{ loading: true }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').classes()).toContain('v-skeleton-container')
		})
	})

	describe('dynamic loading', () => {
		it('should hide content when loading changes to true', async () => {
			const TestComponent = defineComponent({
				directives: { skeleton: vSkeleton },
				template: `<div v-skeleton="loading">Content</div>`,
				data() {
					return { loading: false }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div').element

			expect(div.style.display).not.toBe('none')

			await wrapper.setData({ loading: true })
			await nextTick()

			expect(div.style.display).toBe('none')
		})

		it('should show content when loading changes to false', async () => {
			const TestComponent = defineComponent({
				directives: { skeleton: vSkeleton },
				template: `<div v-skeleton="loading">Content</div>`,
				data() {
					return { loading: true }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div').element

			expect(div.style.display).toBe('none')

			await wrapper.setData({ loading: false })
			await nextTick()

			expect(div.style.display).not.toBe('none')
		})
	})

	describe('cleanup', () => {
		it('should remove class on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { skeleton: vSkeleton },
				template: `<div v-if="show" v-skeleton="true">Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').classes()).toContain('v-skeleton-container')

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)
		})
	})

	describe('animation options', () => {
		it('should handle wave animation without error', () => {
			const TestComponent = defineComponent({
				directives: { skeleton: vSkeleton },
				template: `<div v-skeleton="{ loading: true, animation: 'wave' }">Content</div>`,
			})

			// Should mount without errors
			expect(() => mount(TestComponent)).not.toThrow()
		})

		it('should handle pulse animation without error', () => {
			const TestComponent = defineComponent({
				directives: { skeleton: vSkeleton },
				template: `<div v-skeleton="{ loading: true, animation: 'pulse' }">Content</div>`,
			})

			// Should mount without errors
			expect(() => mount(TestComponent)).not.toThrow()
		})

		it('should handle none animation without error', () => {
			const TestComponent = defineComponent({
				directives: { skeleton: vSkeleton },
				template: `<div v-skeleton="{ loading: true, animation: 'none' }">Content</div>`,
			})

			// Should mount without errors
			expect(() => mount(TestComponent)).not.toThrow()
		})

		it('should handle false animation (no animation) without error', () => {
			const TestComponent = defineComponent({
				directives: { skeleton: vSkeleton },
				template: `<div v-skeleton="{ loading: true, animation: false }">Content</div>`,
			})

			// Should mount without errors
			expect(() => mount(TestComponent)).not.toThrow()
		})
	})
})
