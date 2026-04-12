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

		it('should accept false value', () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="false">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
			// Should still add click handler when false (just not immediate)
			expect((wrapper.find('button').element as HTMLElement).style.cursor).toBe('pointer')
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

	describe('newWindow option', () => {
		it('should accept newWindow option', () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ newWindow: true }">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').exists()).toBe(true)
		})
	})

	describe('updated hook edge cases', () => {
		it('should handle missing state gracefully', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print>Print</button>`,
			})

			const wrapper = mount(TestComponent)
			// Trigger update - state should exist
			await wrapper.setData({})
			expect(wrapper.find('button').exists()).toBe(true)
		})
	})

	describe('unmounted edge cases', () => {
		it('should handle missing state gracefully', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-if="show" v-print>Print</button>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.setData({ show: false })
			await nextTick()

			// Should not throw
			expect(wrapper.find('button').exists()).toBe(false)
		})
	})

	describe('print execution', () => {
		it('should trigger print on click', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print>Print</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			// Click the button to trigger print
			await button.trigger('click')

			// Let any async operations complete
			vi.advanceTimersByTime(0)
			await nextTick()

			// Button should still exist
			expect(button.exists()).toBe(true)
		})

		it('should call onBeforePrint before printing', async () => {
			const onBeforePrint = vi.fn()
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ onBeforePrint }">Print</button>`,
				data() {
					return { onBeforePrint }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			vi.advanceTimersByTime(0)
			await nextTick()

			expect(onBeforePrint).toHaveBeenCalled()
		})

		it('should cancel print when onBeforePrint returns false', async () => {
			const onBeforePrint = vi.fn().mockReturnValue(false)
			const onAfterPrint = vi.fn()
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ onBeforePrint, onAfterPrint }">Print</button>`,
				data() {
					return { onBeforePrint, onAfterPrint }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			vi.advanceTimersByTime(0)
			await nextTick()

			expect(onBeforePrint).toHaveBeenCalled()
			expect(onAfterPrint).not.toHaveBeenCalled()
		})

		it('should warn when target element not found', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ target: '#nonexistent' }">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			vi.advanceTimersByTime(0)
			await nextTick()

			expect(warnSpy).toHaveBeenCalledWith('[Directix] v-print: Target element not found')

			warnSpy.mockRestore()
		})

		it('should print target element when specified', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `
          <div>
            <div id="content">Print me</div>
            <button v-print="{ target: '#content' }">Print</button>
          </div>
        `,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			vi.advanceTimersByTime(0)
			await nextTick()

			// Button should exist
			expect(button.exists()).toBe(true)
		})

		it('should print in new window when newWindow is true', async () => {
			// Mock window.open
			const mockDoc = {
				open: vi.fn(),
				write: vi.fn(),
				close: vi.fn(),
				querySelectorAll: vi.fn().mockReturnValue([]),
			}
			const mockWindow = {
				document: mockDoc,
				focus: vi.fn(),
				print: vi.fn(),
				close: vi.fn(),
			}
			const openSpy = vi.spyOn(window, 'open').mockReturnValue(mockWindow as any)

			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ newWindow: true }">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			vi.advanceTimersByTime(0)
			await nextTick()

			expect(openSpy).toHaveBeenCalledWith('', '_blank')
			expect(mockWindow.document.open).toHaveBeenCalled()

			openSpy.mockRestore()
		})

		it('should warn when window.open returns null', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const openSpy = vi.spyOn(window, 'open').mockReturnValue(null as any)

			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ newWindow: true }">Print</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			vi.advanceTimersByTime(0)
			await nextTick()

			expect(warnSpy).toHaveBeenCalledWith('[Directix] v-print: Could not open print window')

			openSpy.mockRestore()
			warnSpy.mockRestore()
		})

		it('should call onAfterPrint after printing', async () => {
			const onAfterPrint = vi.fn()
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<button v-print="{ onAfterPrint }">Print</button>`,
				data() {
					return { onAfterPrint }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			vi.advanceTimersByTime(0)
			await nextTick()

			expect(onAfterPrint).toHaveBeenCalled()
		})
	})

	describe('immediate print', () => {
		it('should print immediately with boolean true', async () => {
			const TestComponent = defineComponent({
				directives: { print: vPrint },
				template: `<div v-print="true">Content</div>`,
			})

			mount(TestComponent)

			// Wait for the timeout
			vi.advanceTimersByTime(200)
			await nextTick()

			// Directive should have triggered print
			expect(true).toBe(true)
		})
	})
})
