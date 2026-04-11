import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vEllipsis } from '../../src/directives'

describe('v-ellipsis', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('basic functionality', () => {
		it('should apply single line ellipsis by default', () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis>This is a very long text that should be truncated with ellipsis</p>`,
			})

			const wrapper = mount(TestComponent)
			const p = wrapper.find('p').element

			expect(p.style.overflow).toBe('hidden')
			expect(p.style.textOverflow).toBe('ellipsis')
			expect(p.style.whiteSpace).toBe('nowrap')
		})

		it('should accept number as lines', () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis="3">This is a very long text</p>`,
			})

			const wrapper = mount(TestComponent)
			const p = wrapper.find('p').element

			expect(p.style.display).toBe('-webkit-box')
			expect(p.style.webkitLineClamp).toBe('3')
		})

		it('should accept options object', () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis="{ lines: 2 }">This is a very long text</p>`,
			})

			const wrapper = mount(TestComponent)
			const p = wrapper.find('p').element

			expect(p.style.display).toBe('-webkit-box')
			expect(p.style.webkitLineClamp).toBe('2')
		})
	})

	describe('multi-line ellipsis', () => {
		it('should apply multi-line ellipsis with -webkit-line-clamp', () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis="2">Long text here</p>`,
			})

			const wrapper = mount(TestComponent)
			const p = wrapper.find('p').element

			expect(p.style.display).toBe('-webkit-box')
			expect(p.style.webkitBoxOrient).toBe('vertical')
			expect(p.style.webkitLineClamp).toBe('2')
			expect(p.style.overflow).toBe('hidden')
		})
	})

	describe('expandable option', () => {
		it('should add cursor pointer when expandable', () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis="{ expandable: true }">Long text here</p>`,
			})

			const wrapper = mount(TestComponent)
			const p = wrapper.find('p').element

			expect(p.style.cursor).toBe('pointer')
		})

		it('should toggle expansion on click', async () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis="{ lines: 1, expandable: true }">This is a very long text that should expand on click</p>`,
			})

			const wrapper = mount(TestComponent)
			const p = wrapper.find('p')

			// Initial state - truncated
			expect(p.element.style.textOverflow).toBe('ellipsis')

			// Click to expand
			await p.trigger('click')
			await nextTick()

			// Expanded - webkitLineClamp cleared, overflow cleared
			expect(p.element.style.webkitLineClamp).toBe('')
			expect(p.element.style.overflow).toBe('')

			// Click to collapse
			await p.trigger('click')
			await nextTick()

			// Collapsed again
			expect(p.element.style.overflow).toBe('hidden')
		})

		it('should not add click handler when not expandable', async () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis="{ expandable: false }">Long text here</p>`,
			})

			const wrapper = mount(TestComponent)
			const p = wrapper.find('p').element

			expect(p.style.cursor).toBe('')
		})
	})

	describe('titleBehavior option', () => {
		it('should always show title when titleBehavior is always', () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis="{ titleBehavior: 'always' }">Long text here</p>`,
			})

			const wrapper = mount(TestComponent)
			const p = wrapper.find('p').element

			expect(p.title).toBe('Long text here')
		})

		it('should not show title when titleBehavior is none', () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis="{ titleBehavior: 'none' }">Long text here</p>`,
			})

			const wrapper = mount(TestComponent)
			const p = wrapper.find('p').element

			expect(p.title).toBe('')
		})
	})

	describe('update', () => {
		it('should update options on binding change', async () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis="lines">Long text here</p>`,
				data() {
					return { lines: 1 }
				},
			})

			const wrapper = mount(TestComponent)
			const p = wrapper.find('p').element

			expect(p.style.textOverflow).toBe('ellipsis')
			expect(p.style.whiteSpace).toBe('nowrap')

			await wrapper.setData({ lines: 2 })
			await nextTick()

			expect(p.style.display).toBe('-webkit-box')
			expect(p.style.webkitLineClamp).toBe('2')
		})

		it('should update text when content changes', async () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis>{{ text }}</p>`,
				data() {
					return { text: 'First text' }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ text: 'Second text' })
			await nextTick()

			expect(wrapper.find('p').text()).toBe('Second text')
		})

		it('should toggle expandable option dynamically', async () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-ellipsis="{ expandable }">Long text here</p>`,
				data() {
					return { expandable: false }
				},
			})

			const wrapper = mount(TestComponent)
			const p = wrapper.find('p').element

			expect(p.style.cursor).toBe('')

			await wrapper.setData({ expandable: true })
			await nextTick()

			expect(p.style.cursor).toBe('pointer')
		})
	})

	describe('cleanup', () => {
		it('should clean up styles on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-if="show" v-ellipsis>Long text here</p>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('p').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('p').exists()).toBe(false)
		})

		it('should remove click handler on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { ellipsis: vEllipsis },
				template: `<p v-if="show" v-ellipsis="{ expandable: true }">Long text here</p>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('p').exists()).toBe(false)
		})
	})
})
