import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { vScroll } from '../../src/directives/scroll'

describe('v-scroll', () => {
	beforeEach(() => {
		vi.spyOn(window, 'getComputedStyle').mockReturnValue({
			overflow: 'auto',
			overflowX: 'auto',
			overflowY: 'auto',
		} as CSSStyleDeclaration)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should bind scroll event on mount', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="handler" style="overflow: auto;">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			div.trigger('scroll')

			expect(handler).toHaveBeenCalled()
		})

		it('should pass scroll info to handler', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="handler" style="overflow: auto;">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			div.trigger('scroll')

			expect(handler).toHaveBeenCalledWith(
				expect.any(Event),
				expect.objectContaining({
					scrollLeft: expect.any(Number),
					scrollTop: expect.any(Number),
					progressX: expect.any(Number),
					progressY: expect.any(Number),
				}),
			)
		})

		it('should accept options object', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="{ handler }" style="overflow: auto;">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			wrapper.find('div').trigger('scroll')

			expect(handler).toHaveBeenCalled()
		})
	})

	describe('disabled option', () => {
		it('should not bind scroll event when disabled', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="{ handler, disabled: true }">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			wrapper.find('div').trigger('scroll')

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('passive option', () => {
		it('should use passive listener by default', () => {
			const handler = vi.fn()
			const addEventListenerSpy = vi.spyOn(Element.prototype, 'addEventListener')

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="handler" style="overflow: auto;">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(addEventListenerSpy).toHaveBeenCalledWith(
				'scroll',
				expect.any(Function),
				expect.objectContaining({ passive: true }),
			)

			addEventListenerSpy.mockRestore()
		})
	})
})
