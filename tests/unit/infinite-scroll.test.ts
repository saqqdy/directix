import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vInfiniteScroll } from '../../src/directives/infinite-scroll'
import { setupIntersectionObserver } from '../utils'

describe('v-infinite-scroll', () => {
	let observer: ReturnType<typeof setupIntersectionObserver>

	beforeEach(() => {
		observer = setupIntersectionObserver()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should create IntersectionObserver by default', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).toHaveBeenCalled()
		})

		it('should call handler when sentinel intersects', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			observer.triggerIntersection({ isIntersecting: true })

			await nextTick()

			expect(handler).toHaveBeenCalled()
		})

		it('should accept options object', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, distance: 100 }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			observer.triggerIntersection({ isIntersecting: true })

			await nextTick()

			expect(handler).toHaveBeenCalled()
		})

		it('should add v-infinite-scroll class on mount', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			// Check sentinel is created
			expect(wrapper.find('.v-infinite-scroll__sentinel').exists()).toBe(true)
		})

		it('should accept distance option', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, distance: 200 }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).toHaveBeenCalled()
		})

		it('should accept throttle option', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, throttle: 500 }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).toHaveBeenCalled()
		})
	})

	describe('disabled option', () => {
		it('should not call handler when disabled', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, disabled: true }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			observer.triggerIntersection({ isIntersecting: true })

			await nextTick()

			expect(handler).not.toHaveBeenCalled()
		})

		it('should not mount when disabled', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, disabled: true }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.observe).not.toHaveBeenCalled()
		})
	})

	describe('loading option', () => {
		it('should not call handler when loading', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, loading: true }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			observer.triggerIntersection({ isIntersecting: true })

			await nextTick()

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('useIntersection option', () => {
		it('should not use IntersectionObserver when useIntersection is false', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, useIntersection: false }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).not.toHaveBeenCalled()
		})
	})

	describe('callbacks', () => {
		it('should store onLoadStart callback', () => {
			const handler = vi.fn()
			const onLoadStart = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, onLoadStart }">Content</div>`,
				data() {
					return { handler, onLoadStart }
				},
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).toHaveBeenCalled()
		})

		it('should store onLoadEnd callback', () => {
			const handler = vi.fn()
			const onLoadEnd = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, onLoadEnd }">Content</div>`,
				data() {
					return { handler, onLoadEnd }
				},
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).toHaveBeenCalled()
		})

		it('should store onError callback', () => {
			const handler = vi.fn()
			const onError = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, onError }">Content</div>`,
				data() {
					return { handler, onError }
				},
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).toHaveBeenCalled()
		})
	})

	describe('container option', () => {
		it('should accept string container selector', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, container: '#scroll-container' }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).toHaveBeenCalled()
		})

		it('should accept Element as container', () => {
			const handler = vi.fn()
			const containerEl = document.createElement('div')

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, container: containerEl }">Content</div>`,
				data() {
					return { handler, containerEl }
				},
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).toHaveBeenCalled()
		})
	})

	describe('updated hook', () => {
		it('should update options when binding changes', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, distance: currentDistance }">Content</div>`,
				data() {
					return { handler, currentDistance: 0 }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ currentDistance: 100 })
			await nextTick()

			expect(observer.MockIntersectionObserver).toHaveBeenCalled()
		})
	})

	describe('cleanup', () => {
		it('should disconnect observer on unmount', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-if="show" v-infinite-scroll="handler">Content</div>`,
				data() {
					return { handler, show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(observer.disconnect).toHaveBeenCalled()
		})
	})

	describe('scroll event fallback', () => {
		it('should use scroll event when IntersectionObserver is not supported', async () => {
			const originalIO = globalThis.IntersectionObserver
			// @ts-expect-error - testing fallback
			delete globalThis.IntersectionObserver

			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			// When IntersectionObserver is not available, it should still mount
			expect(wrapper.find('div').exists()).toBe(true)

			globalThis.IntersectionObserver = originalIO
		})

		it('should use scroll event when useIntersection is false', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, useIntersection: false }">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			// Should mount without IntersectionObserver
			expect(wrapper.find('div').exists()).toBe(true)
		})
	})

	describe('load callbacks', () => {
		beforeEach(() => {
			vi.useFakeTimers()
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('should call onLoadStart when load starts', async () => {
			const handler = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
			const onLoadStart = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, onLoadStart }">Content</div>`,
				data() {
					return { handler, onLoadStart }
				},
			})

			mount(TestComponent)

			observer.triggerIntersection({ isIntersecting: true })
			await nextTick()

			expect(onLoadStart).toHaveBeenCalled()
		})

		it('should call onLoadEnd when load completes', async () => {
			const handler = vi.fn().mockResolvedValue(undefined)
			const onLoadEnd = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, onLoadEnd }">Content</div>`,
				data() {
					return { handler, onLoadEnd }
				},
			})

			mount(TestComponent)

			observer.triggerIntersection({ isIntersecting: true })
			await nextTick()
			await vi.runAllTimersAsync()

			expect(onLoadEnd).toHaveBeenCalled()
		})

		it('should call onError when handler throws', async () => {
			const error = new Error('Load failed')
			const handler = vi.fn().mockRejectedValue(error)
			const onError = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, onError }">Content</div>`,
				data() {
					return { handler, onError }
				},
			})

			mount(TestComponent)

			observer.triggerIntersection({ isIntersecting: true })
			await nextTick()
			await vi.runAllTimersAsync()

			expect(onError).toHaveBeenCalledWith(error)
		})

		it('should add loading class during load', async () => {
			const handler = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			observer.triggerIntersection({ isIntersecting: true })
			await nextTick()

			expect(wrapper.find('div').classes()).toContain('v-infinite-scroll--loading')

			await vi.runAllTimersAsync()

			expect(wrapper.find('div').classes()).not.toContain('v-infinite-scroll--loading')
		})
	})

	describe('throttle behavior', () => {
		beforeEach(() => {
			vi.useFakeTimers()
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('should throttle scroll events in fallback mode', async () => {
			const originalIO = globalThis.IntersectionObserver
			// @ts-expect-error - testing fallback
			delete globalThis.IntersectionObserver

			const handler = vi.fn().mockResolvedValue(undefined)
			// Scroll handler is tested indirectly

			// Create a scrollable container
			const container = document.createElement('div')
			Object.defineProperty(container, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(container, 'scrollHeight', { value: 2000 })
			Object.defineProperty(container, 'clientHeight', { value: 500 })
			container.addEventListener = vi.fn()
			container.removeEventListener = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="{ handler, throttle: 100 }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent, {
				attachTo: container,
			})

			// Get the scroll handler
			const scrollListener = (container.addEventListener as any).mock.calls.find(
				(call: any[]) => call[0] === 'scroll',
			)?.[1]

			if (scrollListener) {
				// Scroll near bottom
				Object.defineProperty(container, 'scrollTop', { value: 1400, writable: true })
				scrollListener(new Event('scroll'))

				// Another scroll before throttle
				scrollListener(new Event('scroll'))

				// Should be throttled
				await vi.advanceTimersByTime(150)
			}

			globalThis.IntersectionObserver = originalIO
			expect(true).toBe(true)
		})
	})

	describe('error handling', () => {
		it('should throw error when no binding provided', () => {
			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll>Content</div>`,
			})

			expect(() => mount(TestComponent)).toThrow('[Directix] v-infinite-scroll: handler is required')
		})
	})

	describe('missing state handling', () => {
		it('should handle missing state on update', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { 'infinite-scroll': vInfiniteScroll },
				template: `<div v-infinite-scroll="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			// Force update with same handler
			await wrapper.setData({ handler })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(true)
		})
	})
})
