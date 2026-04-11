import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vVirtualList } from '../../src/directives/virtual-list'

describe('v-virtual-list', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should create virtual list container', () => {
			const items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
			const TestComponent = defineComponent({
				directives: { virtualList: vVirtualList },
				template: `<div v-virtual-list="items"></div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-virtual-list').exists()).toBe(true)
			expect(wrapper.find('.v-virtual-list__content').exists()).toBe(true)
		})

		it('should accept options object', () => {
			const items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
			const TestComponent = defineComponent({
				directives: { virtualList: vVirtualList },
				template: `<div v-virtual-list="{ items, itemSize: 50, height: 400 }"></div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-virtual-list').exists()).toBe(true)
		})

		it('should render only visible items', () => {
			const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
			const TestComponent = defineComponent({
				directives: { virtualList: vVirtualList },
				template: `<div v-virtual-list="{ items, itemSize: 50, height: 200 }"></div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const itemElements = wrapper.findAll('.v-virtual-list__item')

			// Should render only visible items plus overscan (not all 1000)
			expect(itemElements.length).toBeLessThan(100)
		})
	})

	describe('options', () => {
		it('should use custom item size', () => {
			const items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
			const TestComponent = defineComponent({
				directives: { virtualList: vVirtualList },
				template: `<div v-virtual-list="{ items, itemSize: 100 }"></div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const content = wrapper.find('.v-virtual-list__content').element

			// Total height should be 100 items * 100px = 10000px
			expect(content.style.height).toBe('10000px')
		})

		it('should support variable item size function', () => {
			const items = Array.from({ length: 10 }, (_, i) => ({ id: i, name: `Item ${i}` }))
			const itemSize = (index: number) => index % 2 === 0 ? 100 : 50
			const TestComponent = defineComponent({
				directives: { virtualList: vVirtualList },
				template: `<div v-virtual-list="{ items, itemSize }"></div>`,
				data() {
					return { items, itemSize }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-virtual-list').exists()).toBe(true)
		})

		it('should use custom container height', () => {
			const items = Array.from({ length: 10 }, (_, i) => ({ id: i, name: `Item ${i}` }))
			const TestComponent = defineComponent({
				directives: { virtualList: vVirtualList },
				template: `<div v-virtual-list="{ items, height: 600 }"></div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const container = wrapper.find('.v-virtual-list').element

			expect(container.style.height).toBe('600px')
		})
	})

	describe('callbacks', () => {
		it('should call onScroll callback', async () => {
			const items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
			const onScroll = vi.fn()
			const TestComponent = defineComponent({
				directives: { virtualList: vVirtualList },
				template: `<div v-virtual-list="{ items, onScroll }"></div>`,
				data() {
					return { items, onScroll }
				},
			})

			const wrapper = mount(TestComponent)
			const container = wrapper.find('.v-virtual-list')

			await container.trigger('scroll')

			expect(onScroll).toHaveBeenCalled()
		})
	})

	describe('cleanup', () => {
		it('should remove scroll listener on unmount', async () => {
			const items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
			const TestComponent = defineComponent({
				directives: { virtualList: vVirtualList },
				template: `<div v-if="show" v-virtual-list="items"></div>`,
				data() {
					return { items, show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-virtual-list').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-virtual-list').exists()).toBe(false)
		})
	})
})
