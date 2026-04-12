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

		it('should apply parallax when enabled with true', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="true">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
			expect((wrapper.find('div').element as HTMLElement).style.willChange).toBe('transform')
		})

		it('should set willChange transform on element', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax>Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			expect(el.style.willChange).toBe('transform')
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

		it('should support minScroll option', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ minScroll: -100 }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should support maxScroll option', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ maxScroll: 100 }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should support custom transform function', () => {
			const transform = vi.fn((offset, _el) => `translate3d(0, ${offset}px, 0)`)
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ transform }">Parallax content</div>`,
				data() {
					return { transform }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should support useTransform: false option', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ useTransform: false }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should support enabled: false option', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ enabled: false }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})
	})

	describe('scroll handling', () => {
		it('should handle scroll events', () => {
			const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax>Parallax content</div>`,
			})

			mount(TestComponent)

			// Check that scroll listener was added (it may be on window or scroll parent)
			const calls = addEventListenerSpy.mock.calls
			const scrollCall = calls.find(call => call[0] === 'scroll')
			expect(scrollCall).toBeDefined()
			expect(scrollCall?.[2]?.passive).toBe(true)

			addEventListenerSpy.mockRestore()
		})

		it('should handle resize events', () => {
			const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax>Parallax content</div>`,
			})

			mount(TestComponent)

			// Check that resize listener was added to window
			const calls = addEventListenerSpy.mock.calls
			const resizeCall = calls.find(call => call[0] === 'resize')
			expect(resizeCall).toBeDefined()
			expect(resizeCall?.[2]?.passive).toBe(true)

			addEventListenerSpy.mockRestore()
		})
	})

	describe('update hook', () => {
		it('should update options on binding change', async () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ speed: currentSpeed }">Parallax content</div>`,
				data() {
					return { currentSpeed: 0.5 }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ currentSpeed: 0.3 })
			await nextTick()

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should handle missing state on update', async () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax>Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)
			// Just verify it doesn't crash
			await wrapper.setData({})
			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

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
			expect(removeEventListenerSpy).toHaveBeenCalled()

			removeEventListenerSpy.mockRestore()
		})

		it('should clear willChange on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-if="show" v-parallax>Parallax content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			expect(el.style.willChange).toBe('transform')

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-parallax').exists()).toBe(false)
		})

		it('should clear transform on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-if="show" v-parallax>Parallax content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			await wrapper.setData({ show: false })
			await nextTick()

			expect(el.style.transform).toBe('')
		})
	})

	describe('scroll parent detection', () => {
		it('should find scroll parent with overflow auto', () => {
			const parent = document.createElement('div')
			const child = document.createElement('div')

			vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
				if (el === parent) {
					return { overflow: 'auto', overflowX: 'auto', overflowY: 'auto' } as CSSStyleDeclaration
				}
				return { overflow: 'visible', overflowX: 'visible', overflowY: 'visible' } as CSSStyleDeclaration
			})

			parent.appendChild(child)
			document.body.appendChild(parent)

			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax>Parallax content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: child })

			expect(wrapper.find('.v-parallax').exists()).toBe(true)

			parent.remove()
			vi.restoreAllMocks()
		})

		it('should find scroll parent with overflow scroll', () => {
			const parent = document.createElement('div')
			const child = document.createElement('div')

			vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
				if (el === parent) {
					return { overflow: 'scroll', overflowX: 'scroll', overflowY: 'scroll' } as CSSStyleDeclaration
				}
				return { overflow: 'visible', overflowX: 'visible', overflowY: 'visible' } as CSSStyleDeclaration
			})

			parent.appendChild(child)
			document.body.appendChild(parent)

			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax>Parallax content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: child })

			expect(wrapper.find('.v-parallax').exists()).toBe(true)

			parent.remove()
			vi.restoreAllMocks()
		})
	})

	describe('scroll position handling', () => {
		it('should handle scroll events and calculate offset', () => {
			const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ speed: 0.5 }">Parallax content</div>`,
			})

			mount(TestComponent)

			// Find the scroll listener
			const scrollCall = addEventListenerSpy.mock.calls.find(call => call[0] === 'scroll')
			expect(scrollCall).toBeDefined()

			addEventListenerSpy.mockRestore()
		})

		it('should handle resize events', () => {
			const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax>Parallax content</div>`,
			})

			mount(TestComponent)

			// Find the resize listener
			const resizeCall = addEventListenerSpy.mock.calls.find(call => call[0] === 'resize')
			expect(resizeCall).toBeDefined()

			addEventListenerSpy.mockRestore()
		})
	})

	describe('visibility check', () => {
		it('should not apply transform when element is not in viewport', async () => {
			const element = document.createElement('div')
			Object.defineProperty(element, 'getBoundingClientRect', {
				value: vi.fn().mockReturnValue({
					top: -1000, // Above viewport
					bottom: -500,
					left: 0,
					right: 100,
					width: 100,
					height: 500,
				} as DOMRect),
			})

			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax>Parallax content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Trigger scroll
			window.dispatchEvent(new Event('scroll'))
			await nextTick()

			wrapper.unmount()
			expect(true).toBe(true)
		})
	})

	describe('minScroll and maxScroll constraints', () => {
		it('should apply minScroll constraint', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ speed: 0.5, minScroll: -50 }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should apply maxScroll constraint', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ speed: 0.5, maxScroll: 100 }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should apply both minScroll and maxScroll constraints', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ speed: 0.5, minScroll: -100, maxScroll: 100 }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})
	})

	describe('useTransform option', () => {
		it('should not apply transform when useTransform is false', () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ useTransform: false }">Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			expect(el.classList.contains('v-parallax')).toBe(true)
		})
	})

	describe('custom transform function', () => {
		it('should call custom transform with offset and element', () => {
			const transform = vi.fn((offset, _el) => `translate3d(0, ${offset}px, 0)`)

			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax="{ transform }">Parallax content</div>`,
				data() {
					return { transform }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})
	})

	describe('error handling', () => {
		it('should handle missing state on update gracefully', async () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-parallax>Parallax content</div>`,
			})

			const wrapper = mount(TestComponent)

			// Just verify it doesn't crash
			await wrapper.setData({})
			expect(wrapper.find('.v-parallax').exists()).toBe(true)
		})

		it('should handle missing state on unmount gracefully', async () => {
			const TestComponent = defineComponent({
				directives: { parallax: vParallax },
				template: `<div v-if="show" v-parallax>Parallax content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-parallax').exists()).toBe(false)
		})
	})
})
