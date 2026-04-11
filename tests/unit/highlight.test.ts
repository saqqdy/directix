import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vHighlight } from '../../src/directives'

describe('v-highlight', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('basic functionality', () => {
		it('should highlight single keyword', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="'important'">This is an important message.</p>`,
			})

			const wrapper = mount(TestComponent)
			const marks = wrapper.findAll('mark')

			expect(marks.length).toBe(1)
			expect(marks[0].text()).toBe('important')
		})

		it('should highlight multiple occurrences', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="'test'">test test test</p>`,
			})

			const wrapper = mount(TestComponent)
			const marks = wrapper.findAll('mark')

			expect(marks.length).toBe(3)
		})

		it('should accept string as binding', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="'word'">Find the word here</p>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('mark').exists()).toBe(true)
		})

		it('should accept array of keywords', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="['Vue', 'React']">Vue and React are frameworks</p>`,
			})

			const wrapper = mount(TestComponent)
			const marks = wrapper.findAll('mark')

			expect(marks.length).toBe(2)
		})

		it('should accept options object', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="{ keywords: 'test' }">This is a test</p>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('mark').exists()).toBe(true)
		})
	})

	describe('className option', () => {
		it('should use custom class name', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="{ keywords: 'test', className: 'my-highlight' }">This is a test</p>`,
			})

			const wrapper = mount(TestComponent)
			const mark = wrapper.find('mark')

			expect(mark.classes()).toContain('my-highlight')
		})

		it('should use default class name', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="'test'">This is a test</p>`,
			})

			const wrapper = mount(TestComponent)
			const mark = wrapper.find('mark')

			expect(mark.classes()).toContain('v-highlight')
		})
	})

	describe('style option', () => {
		it('should apply inline style', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="{ keywords: 'test', style: 'background: yellow; color: black;' }">This is a test</p>`,
			})

			const wrapper = mount(TestComponent)
			const mark = wrapper.find('mark')

			expect((mark.element as HTMLElement).style.background).toBe('yellow')
			expect((mark.element as HTMLElement).style.color).toBe('black')
		})
	})

	describe('caseSensitive option', () => {
		it('should be case insensitive by default', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="'test'">Test TEST test</p>`,
			})

			const wrapper = mount(TestComponent)
			const marks = wrapper.findAll('mark')

			expect(marks.length).toBe(3)
		})

		it('should be case sensitive when enabled', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="{ keywords: 'Test', caseSensitive: true }">Test test TEST</p>`,
			})

			const wrapper = mount(TestComponent)
			const marks = wrapper.findAll('mark')

			expect(marks.length).toBe(1)
			expect(marks[0].text()).toBe('Test')
		})
	})

	describe('wholeWord option', () => {
		it('should match whole words only when enabled', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="{ keywords: 'test', wholeWord: true }">testing test tested</p>`,
			})

			const wrapper = mount(TestComponent)
			const marks = wrapper.findAll('mark')

			expect(marks.length).toBe(1)
			expect(marks[0].text()).toBe('test')
		})

		it('should match partial words by default', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="'test'">testing test tested</p>`,
			})

			const wrapper = mount(TestComponent)
			const marks = wrapper.findAll('mark')

			expect(marks.length).toBe(3)
		})
	})

	describe('tag option', () => {
		it('should use custom tag', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="{ keywords: 'test', tag: 'span' }">This is a test</p>`,
			})

			const wrapper = mount(TestComponent)
			const spans = wrapper.findAll('span.v-highlight')

			expect(spans.length).toBe(1)
		})

		it('should use mark tag by default', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="'test'">This is a test</p>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('mark').exists()).toBe(true)
		})
	})

	describe('onHighlight callback', () => {
		it('should call onHighlight with count', () => {
			const onHighlight = vi.fn()
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="{ keywords: 'test', onHighlight }">test test test</p>`,
				data() {
					return { onHighlight }
				},
			})

			mount(TestComponent)

			expect(onHighlight).toHaveBeenCalledWith(3)
		})
	})

	describe('special characters', () => {
		it('should escape regex special characters', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="'(test)'">This is (test) here</p>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('mark').exists()).toBe(true)
		})

		it('should handle special regex chars in keywords', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="'$100'">Price is $100</p>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('mark').exists()).toBe(true)
		})
	})

	describe('empty keywords', () => {
		it('should not highlight when keywords is empty string', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="''">This is a test</p>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('mark').exists()).toBe(false)
		})

		it('should not highlight when keywords is empty array', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="[]">This is a test</p>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('mark').exists()).toBe(false)
		})
	})

	describe('update', () => {
		it('should update highlights when keywords change', async () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="keyword">Find the word here</p>`,
				data() {
					return { keyword: 'Find' }
				},
			})

			const wrapper = mount(TestComponent)
			let marks = wrapper.findAll('mark')

			expect(marks.length).toBe(1)
			expect(marks[0].text()).toBe('Find')

			await wrapper.setData({ keyword: 'word' })
			await nextTick()

			marks = wrapper.findAll('mark')
			expect(marks.length).toBe(1)
			expect(marks[0].text()).toBe('word')
		})

		it('should restore original content before re-highlighting', async () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-highlight="keyword">Find the word</p>`,
				data() {
					return { keyword: 'Find' }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ keyword: 'word' })
			await nextTick()

			// Should only have one highlight (word), not two
			const marks = wrapper.findAll('mark')
			expect(marks.length).toBe(1)
		})
	})

	describe('cleanup', () => {
		it('should restore original content on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<p v-if="show" v-highlight="'test'">This is a test</p>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('mark').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('p').exists()).toBe(false)
		})
	})

	describe('nested elements', () => {
		it('should handle text in nested elements', () => {
			const TestComponent = defineComponent({
				directives: { highlight: vHighlight },
				template: `<div v-highlight="'test'"><span>test</span> another test</div>`,
			})

			const wrapper = mount(TestComponent)
			const marks = wrapper.findAll('mark')

			expect(marks.length).toBe(2)
		})
	})
})
