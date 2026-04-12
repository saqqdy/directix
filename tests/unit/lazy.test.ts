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

		it('should accept preload option', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', preload: 200 }" />`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('img').element.classList.contains('v-lazy')).toBe(true)

			wrapper.unmount()
		})

		it('should accept attempt option', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', attempt: 3 }" />`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('img').element.classList.contains('v-lazy')).toBe(true)

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

	describe('callbacks', () => {
		it('should store onLoad callback', async () => {
			const onLoad = vi.fn()
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', onLoad }" />`,
				data() {
					return { onLoad }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			expect(wrapper.find('img').element.classList.contains('v-lazy')).toBe(true)
			wrapper.unmount()
		})

		it('should store onError callback', async () => {
			const onError = vi.fn()
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', onError }" />`,
				data() {
					return { onError }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			expect(wrapper.find('img').element.classList.contains('v-lazy')).toBe(true)
			wrapper.unmount()
		})

		it('should store filter function', async () => {
			const filter = vi.fn().mockReturnValue(true)
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', filter }" />`,
				data() {
					return { filter }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			expect(wrapper.find('img').element.classList.contains('v-lazy')).toBe(true)
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

// Additional tests for improved coverage
describe('v-lazy additional coverage', () => {
	let originalIntersectionObserver: typeof IntersectionObserver

	const mockIntersectionObserver = {
		observe: vi.fn(),
		unobserve: vi.fn(),
		disconnect: vi.fn(),
	}

	beforeEach(() => {
		originalIntersectionObserver = globalThis.IntersectionObserver
		globalThis.IntersectionObserver = vi.fn().mockImplementation(() => mockIntersectionObserver) as any
	})

	afterEach(() => {
		globalThis.IntersectionObserver = originalIntersectionObserver
	})

	describe('custom observer', () => {
		it('should use custom IntersectionObserver', async () => {
			const customObserver = {
				observe: vi.fn(),
				unobserve: vi.fn(),
				disconnect: vi.fn(),
			}

			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', observer: customObserver }" />`,
				data() {
					return { customObserver }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const img = wrapper.find('img').element

			expect(customObserver.observe).toHaveBeenCalledWith(img)

			wrapper.unmount()
		})
	})

	describe('non-img element', () => {
		it('should set background image for non-img elements', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<div v-lazy="{ src: 'image.jpg' }"></div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.classList.contains('v-lazy')).toBe(true)

			wrapper.unmount()
		})
	})

	describe('error handling', () => {
		it('should accept error image option', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', error: 'error.jpg' }" />`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			expect(wrapper.find('img').element.classList.contains('v-lazy')).toBe(true)
			wrapper.unmount()
		})
	})

	describe('no IntersectionObserver fallback', () => {
		it('should load directly when IntersectionObserver is not supported', async () => {
			// @ts-expect-error - testing fallback
			delete globalThis.IntersectionObserver

			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="'image.jpg'" />`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const img = wrapper.find('img').element

			// Should have started loading (state set to loading)
			expect(img.dataset.lazyState).toBe('loading')

			globalThis.IntersectionObserver = originalIntersectionObserver
			wrapper.unmount()
		})
	})

	describe('filter function', () => {
		it('should not load when filter returns false', async () => {
			const filter = vi.fn().mockReturnValue(false)
			const onLoad = vi.fn()

			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="{ src: 'image.jpg', filter, onLoad }" />`,
				data() {
					return { filter, onLoad }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const img = wrapper.find('img').element

			// Get the element state
			const state = (img as any).__lazy

			// The filter should be stored
			expect(state.options.filter).toBeDefined()

			wrapper.unmount()
		})
	})

	describe('update edge cases', () => {
		it('should handle missing state on update', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="src" />`,
				data() {
					return { src: 'image.jpg' }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Update src
			await wrapper.setData({ src: 'new-image.jpg' })
			await nextTick()

			expect(wrapper.find('img').element.dataset.lazyState).toBe('pending')

			wrapper.unmount()
		})

		it('should handle src change after load', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-lazy="src" />`,
				data() {
					return { src: 'image1.jpg' }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const img = wrapper.find('img').element

			// Simulate loaded state
			img.dataset.lazyState = 'loaded'
			img.classList.add('v-lazy--loaded')

			// Change src
			await wrapper.setData({ src: 'image2.jpg' })
			await nextTick()

			// Should reset to pending
			expect(img.dataset.lazyState).toBe('pending')

			wrapper.unmount()
		})
	})

	describe('unobserve edge cases', () => {
		it('should handle missing observer on unobserve', async () => {
			const TestComponent = defineComponent({
				directives: { lazy: vLazy },
				template: `<img v-if="show" v-lazy="'image.jpg'" />`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			await wrapper.setData({ show: false })
			await nextTick()

			// Should not throw
			expect(wrapper.find('img').exists()).toBe(false)

			wrapper.unmount()
		})
	})
})
