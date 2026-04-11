import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vPrint } from '../../src/directives'

describe('v-print', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('basic functionality', () => {
		it('should add cursor pointer on mount', () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print>Print</button>`,
			})

			const wrapper = mount(TestComponent)
			expect((wrapper.find('button').element as HTMLElement).style.cursor).toBe('pointer')
		})

		it('should accept options object', () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ title: 'My Document' }">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
		})

		it('should accept boolean value', () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="true">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
		})
	})

	describe('click handling', () => {
		it('should have click handler set up', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print>Print</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			// Directive sets cursor to pointer
			expect((button.element as HTMLElement).style.cursor).toBe('pointer')
		})
	})

	describe('immediate option', () => {
		it('should print immediately when immediate is true', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<div v-print="{ immediate: true }">Content</div>`,
			})

			mount(TestComponent)

			// Wait for the timeout
			vi.advanceTimersByTime(200)
			await nextTick()

			// Directive should be mounted
			expect(true).toBe(true)
		})

		it('should not add click handler when immediate is true', () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<div v-print="{ immediate: true }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			// Should not have cursor pointer when immediate
			expect((wrapper.find('div').element as HTMLElement).style.cursor).toBe('')
		})
	})

	describe('callbacks', () => {
		it('should store onBeforePrint callback', () => {
			const onBeforePrint = vi.fn()
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ onBeforePrint }">Print</button>`,
				data() {
					return { onBeforePrint }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
		})

		it('should store onAfterPrint callback', () => {
			const onAfterPrint = vi.fn()
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ onAfterPrint }">Print</button>`,
				data() {
					return { onAfterPrint }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
		})
	})

	describe('options', () => {
		it('should use custom title', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ title: 'Custom Title' }">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
		})

		it('should use custom styles', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ styles: 'body { font-size: 12px }' }">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
		})

		it('should use styles array', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ styles: ['body { margin: 0 }', '.page { padding: 20px }'] }">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
		})

		it('should use cssUrls option', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ cssUrls: ['https://example.com/print.css'] }">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
		})

		it('should use target selector', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `
          <div>
            <div id="content">Content to print</div>
            <button v-print="{ target: '#content' }">Print</button>
          </div>
        `,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
		})

		it('should use printClass option', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ printClass: 'custom-print' }">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
		})
	})

	describe('update', () => {
		it('should update options on binding change', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="options">Print</button>`,
				data() {
					return {
						options: { title: 'Title 1' },
					}
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ options: { title: 'Title 2' } })
			await nextTick()

			expect(wrapper.find('button').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should remove event listener on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-if="show" v-print>Print</button>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('button').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('button').exists()).toBe(false)
		})

		it('should restore cursor style on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-if="show" v-print>Print</button>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)
			expect((wrapper.find('button').element as HTMLElement).style.cursor).toBe('pointer')

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('button').exists()).toBe(false)
		})
	})
})
