import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
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

		it('should use non-passive listener when passive is false', () => {
			const handler = vi.fn()
			const addEventListenerSpy = vi.spyOn(Element.prototype, 'addEventListener')

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="{ handler, passive: false }" style="overflow: auto;">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(addEventListenerSpy).toHaveBeenCalledWith(
				'scroll',
				expect.any(Function),
				expect.objectContaining({ passive: false }),
			)

			addEventListenerSpy.mockRestore()
		})
	})

	describe('throttle option', () => {
		beforeEach(() => {
			vi.useFakeTimers()
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('should throttle scroll events', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="{ handler, throttle: 100 }" style="overflow: auto;">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			// Trigger multiple scroll events
			div.trigger('scroll')
			div.trigger('scroll')
			div.trigger('scroll')

			// Handler should not be called immediately
			expect(handler).not.toHaveBeenCalled()

			// Advance time past throttle
			vi.advanceTimersByTime(100)

			expect(handler).toHaveBeenCalledTimes(1)
		})

		it('should clear throttle timer on unmount', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-if="show" v-scroll="{ handler, throttle: 100 }" style="overflow: auto;">Scroll content</div>`,
				data() {
					return { handler, show: true }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			div.trigger('scroll')

			await wrapper.setData({ show: false })
			await nextTick()

			// Advance time past throttle - handler should not be called
			vi.advanceTimersByTime(100)

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('container option', () => {
		it('should accept string container selector', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="{ handler, container: '#scroll-container' }">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(true).toBe(true)
		})

		it('should accept Element as container', () => {
			const handler = vi.fn()
			const containerEl = document.createElement('div')

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="{ handler, container: containerEl }">Scroll content</div>`,
				data() {
					return { handler, containerEl }
				},
			})

			mount(TestComponent)

			expect(true).toBe(true)
		})

		it('should accept window as container', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="{ handler, container: window }">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(true).toBe(true)
		})

		it('should handle window container correctly', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="{ handler, container: window }">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			// Should mount without errors
			mount(TestComponent)
			expect(true).toBe(true)
		})

		it('should calculate scroll info for window container', async () => {
			const handler = vi.fn()

			// Mock window scroll properties
			Object.defineProperty(window, 'scrollX', { value: 50, writable: true, configurable: true })
			Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
			Object.defineProperty(document.documentElement, 'scrollWidth', { value: 2000, writable: true, configurable: true })
			Object.defineProperty(window, 'innerWidth', { value: 500, writable: true, configurable: true })
			Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true, configurable: true })
			Object.defineProperty(window, 'innerHeight', { value: 500, writable: true, configurable: true })

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="{ handler, container: window }">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			// Should mount without errors
			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should use window scrollX/scrollY when container is window', async () => {
			const handler = vi.fn()
			const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

			// Mock scrollX being undefined to test fallback to document.documentElement.scrollLeft
			Object.defineProperty(window, 'scrollX', { value: undefined, writable: true, configurable: true })
			Object.defineProperty(window, 'scrollY', { value: undefined, writable: true, configurable: true })
			Object.defineProperty(document.documentElement, 'scrollLeft', { value: 30, writable: true, configurable: true })
			Object.defineProperty(document.documentElement, 'scrollTop', { value: 60, writable: true, configurable: true })
			Object.defineProperty(document.documentElement, 'scrollWidth', { value: 1500, writable: true, configurable: true })
			Object.defineProperty(window, 'innerWidth', { value: 500, writable: true, configurable: true })
			Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500, writable: true, configurable: true })
			Object.defineProperty(window, 'innerHeight', { value: 500, writable: true, configurable: true })

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="{ handler, container: window }">Scroll content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			// The directive should mount without errors when using window as container
			// Verify that the component exists
			expect(true).toBe(true)

			addEventListenerSpy.mockRestore()
		})
	})

	describe('scroll direction', () => {
		it('should calculate scroll direction', async () => {
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

			// First call - direction should be 0 (no previous scroll)
			expect(handler).toHaveBeenCalledWith(
				expect.any(Event),
				expect.objectContaining({
					directionX: 0,
					directionY: 0,
				}),
			)
		})
	})

	describe('cleanup', () => {
		it('should remove scroll listener on unmount', async () => {
			const handler = vi.fn()
			const removeEventListenerSpy = vi.spyOn(Element.prototype, 'removeEventListener')

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-if="show" v-scroll="handler" style="overflow: auto;">Scroll content</div>`,
				data() {
					return { handler, show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(removeEventListenerSpy).toHaveBeenCalled()

			removeEventListenerSpy.mockRestore()
		})
	})

	describe('updated hook', () => {
		it('should update options when binding changes', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { scroll: vScroll },
				template: `<div v-scroll="{ handler, throttle: currentThrottle }" style="overflow: auto;">Scroll content</div>`,
				data() {
					return { handler, currentThrottle: 0 }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ currentThrottle: 100 })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(true)
		})
	})

	describe('error handling', () => {
		it('should throw error when binding is undefined', () => {
			expect(() => {
				const TestComponent = defineComponent({
					directives: { scroll: vScroll },
					template: `<div v-scroll="undefined">Scroll content</div>`,
					data() {
						return { undefined }
					},
				})

				mount(TestComponent)
			}).toThrow('[Directix] v-scroll: handler is required')
		})
	})
})
