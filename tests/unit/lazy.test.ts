import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vLazy } from '../../src/directives/lazy'

describe('v-lazy', () => {
	let originalIntersectionObserver: typeof IntersectionObserver,
		// observerCallback: IntersectionObserverCallback | null = null,
		observedElements: Element[] = []

	const mockIntersectionObserver = {
		observe: vi.fn((element: Element) => {
			observedElements.push(element)
		}),
		unobserve: vi.fn((element: Element) => {
			observedElements = observedElements.filter(el => el !== element)
		}),
		disconnect: vi.fn(() => {
			observedElements = []
		}),
	}

	beforeEach(() => {
		originalIntersectionObserver = globalThis.IntersectionObserver
		observedElements = []
		// observerCallback = null

		globalThis.IntersectionObserver = vi.fn().mockImplementation(_callback => {
			// observerCallback = _callback
			return mockIntersectionObserver
		}) as any
	})

	afterEach(() => {
		globalThis.IntersectionObserver = originalIntersectionObserver
	})

	describe('basic functionality', () => {
		it('should set initial state and class on mount', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="'test.jpg'" />`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const img = wrapper.find('img').element as HTMLImageElement

			expect(img.classList.contains('v-lazy')).toBe(true)
			expect(img.dataset.lazyState).toBe('pending')

			wrapper.unmount()
		})

		it('should accept string as src', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="'image.jpg'" />`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const img = wrapper.find('img').element as HTMLImageElement

			expect(img.classList.contains('v-lazy')).toBe(true)

			wrapper.unmount()
		})

		it('should accept options object', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', preload: 100 }" />`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('img').element.classList.contains('v-lazy')).toBe(true)

			wrapper.unmount()
		})

		it('should warn when no src provided', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{}" />`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(warnSpy).toHaveBeenCalledWith('[Directix] v-lazy: No source provided')

			warnSpy.mockRestore()
			wrapper.unmount()
		})

		it('should observe element on mount', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="'image.jpg'" />`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const img = wrapper.find('img').element

			expect(mockIntersectionObserver.observe).toHaveBeenCalledWith(img)

			wrapper.unmount()
		})
	})

	describe('placeholder', () => {
		it('should set placeholder image on mount', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', placeholder: 'placeholder.jpg' }" />`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const img = wrapper.find('img').element as HTMLImageElement

			expect(img.src).toContain('placeholder.jpg')

			wrapper.unmount()
		})

		it('should set placeholder as background image for non-img elements', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<div v-lazy="{ src: 'image.jpg', placeholder: 'placeholder.jpg' }"></div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.style.backgroundImage).toContain('placeholder.jpg')

			wrapper.unmount()
		})
	})

	describe('disabled option', () => {
		it('should not initialize when disabled is true', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', disabled: true }" />`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const img = wrapper.find('img').element

			expect(img.classList.contains('v-lazy')).toBe(false)

			wrapper.unmount()
		})
	})

	describe('updated hook', () => {
		it('should unobserve when disabled on update', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', disabled }" />`,
				data() {
					return { disabled: false }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const img = wrapper.find('img').element

			expect(img.classList.contains('v-lazy')).toBe(true)

			// Disable
			await wrapper.setData({ disabled: true })
			await nextTick()

			expect(mockIntersectionObserver.unobserve).toHaveBeenCalled()

			wrapper.unmount()
		})

		it('should handle src change', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="src" />`,
				data() {
					return { src: 'image1.jpg' }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const img = wrapper.find('img').element

			expect(img.dataset.lazyState).toBe('pending')

			// Change src
			await wrapper.setData({ src: 'image2.jpg' })
			await nextTick()

			// Should re-observe
			expect(img.dataset.lazyState).toBe('pending')

			wrapper.unmount()
		})
	})

	describe('cleanup', () => {
		it('should unobserve on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-if="show" v-lazy="'image.jpg'" />`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('img').element.classList.contains('v-lazy')).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(mockIntersectionObserver.unobserve).toHaveBeenCalled()

			wrapper.unmount()
		})
	})
})
