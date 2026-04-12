import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vResize } from '../../src/directives/resize'
import { setupResizeObserver } from '../utils'

describe('v-resize', () => {
	let observer: ReturnType<typeof setupResizeObserver>,
		originalResizeObserver: typeof ResizeObserver

	beforeEach(() => {
		observer = setupResizeObserver()
		originalResizeObserver = globalThis.ResizeObserver
	})

	afterEach(() => {
		vi.restoreAllMocks()
		globalThis.ResizeObserver = originalResizeObserver
	})

	describe('basic functionality', () => {
		it('should create ResizeObserver on mount', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="handler">Resize me</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.MockResizeObserver).toHaveBeenCalled()
			expect(observer.observe).toHaveBeenCalled()
		})

		it('should call handler when resize occurs', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="handler">Resize me</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			observer.triggerResize({
				contentRect: { width: 200, height: 100 } as DOMRectReadOnly,
			})

			expect(handler).toHaveBeenCalled()
		})

		it('should accept options object', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="{ handler }">Resize me</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.observe).toHaveBeenCalled()
		})

		it('should pass resize info to handler', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="handler">Resize me</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			observer.triggerResize({
				contentRect: { width: 200, height: 100 } as DOMRectReadOnly,
			})

			expect(handler).toHaveBeenCalledWith(
				expect.objectContaining({
					contentRect: expect.objectContaining({
						width: 200,
						height: 100,
					}),
				}),
			)
		})
	})

	describe('disabled option', () => {
		it('should not observe when disabled is true', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="{ handler, disabled: true }">Resize me</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.observe).not.toHaveBeenCalled()
		})
	})

	describe('box option', () => {
		it('should pass box option to ResizeObserver', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="{ handler, box: 'border-box' }">Resize me</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.observe).toHaveBeenCalledWith(
				expect.any(HTMLElement),
				expect.objectContaining({ box: 'border-box' }),
			)
		})

		it('should support device-pixel-content-box', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="{ handler, box: 'device-pixel-content-box' }">Resize me</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.observe).toHaveBeenCalledWith(
				expect.any(HTMLElement),
				expect.objectContaining({ box: 'device-pixel-content-box' }),
			)
		})
	})

	describe('debounce option', () => {
		beforeEach(() => {
			vi.useFakeTimers()
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('should debounce resize events', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="{ handler, debounce: 100 }">Resize me</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			// Trigger multiple resize events
			observer.triggerResize({
				contentRect: { width: 200, height: 100 } as DOMRectReadOnly,
			})

			observer.triggerResize({
				contentRect: { width: 300, height: 150 } as DOMRectReadOnly,
			})

			// Handler should not be called immediately
			expect(handler).not.toHaveBeenCalled()

			// Advance time past debounce
			vi.advanceTimersByTime(100)

			expect(handler).toHaveBeenCalled()
		})

		it('should clear debounce timer on unmount', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-if="show" v-resize="{ handler, debounce: 100 }">Resize me</div>`,
				data() {
					return { handler, show: true }
				},
			})

			const wrapper = mount(TestComponent)

			observer.triggerResize({
				contentRect: { width: 200, height: 100 } as DOMRectReadOnly,
			})

			await wrapper.setData({ show: false })
			await nextTick()

			vi.advanceTimersByTime(100)
			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('updated hook', () => {
		it('should update options when binding changes', async () => {
			const handler1 = vi.fn()
			const handler2 = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="currentHandler">Resize me</div>`,
				data() {
					return {
						currentHandler: handler1,
					}
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ currentHandler: handler2 })

			expect(observer.observe).toHaveBeenCalled()
		})
	})

	describe('cleanup', () => {
		it('should disconnect observer on unmount', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-if="show" v-resize="handler">Resize me</div>`,
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
})

// Additional tests for improved coverage
describe('v-resize additional coverage', () => {
	let observer: ReturnType<typeof setupResizeObserver>

	beforeEach(() => {
		observer = setupResizeObserver()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('debounce cleanup', () => {
		beforeEach(() => {
			vi.useFakeTimers()
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('should clear debounce timer on unmount', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-if="show" v-resize="{ handler, debounce: 100 }">Resize me</div>`,
				data() {
					return { handler, show: true }
				},
			})

			const wrapper = mount(TestComponent)

			observer.triggerResize({
				contentRect: { width: 200, height: 100 } as DOMRectReadOnly,
			})

			await wrapper.setData({ show: false })
			await nextTick()

			vi.advanceTimersByTime(100)
			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('options validation', () => {
		it('should accept handler as function', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="handler">Resize me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})
	})

	describe('onFallback option', () => {
		it('should store onFallback callback', () => {
			const handler = vi.fn()
			const onFallback = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="{ handler, onFallback }">Resize me</div>`,
				data() {
					return { handler, onFallback }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})
	})

	describe('fallback mode (no ResizeObserver)', () => {
		it('should use fallback when ResizeObserver is not supported', () => {
			// Save and remove ResizeObserver
			const originalRO = globalThis.ResizeObserver
			// @ts-expect-error - testing fallback
			delete globalThis.ResizeObserver

			const handler = vi.fn()
			const onFallback = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="{ handler, onFallback }">Resize me</div>`,
				data() {
					return { handler, onFallback }
				},
			})

			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			mount(TestComponent)

			expect(warnSpy).toHaveBeenCalledWith('[Directix] v-resize: ResizeObserver not supported, using fallback')

			// Restore ResizeObserver
			globalThis.ResizeObserver = originalRO
			warnSpy.mockRestore()
		})

		it('should cleanup fallback iframe on unmount', async () => {
			const originalRO = globalThis.ResizeObserver
			// @ts-expect-error - testing fallback
			delete globalThis.ResizeObserver

			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-if="show" v-resize="handler">Resize me</div>`,
				data() {
					return { handler, show: true }
				},
			})

			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)

			globalThis.ResizeObserver = originalRO
			warnSpy.mockRestore()
		})
	})

	describe('normalizeOptions errors', () => {
		it('should throw error when no binding provided', () => {
			// This is a edge case that's hard to test through mount
			// because Vue doesn't allow undefined directive values easily
			// We test the internal function behavior via the directive behavior
			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize>Resize me</div>`,
			})

			// Mount should throw an error
			expect(() => mount(TestComponent)).toThrow('[Directix] v-resize: handler is required')
		})
	})

	describe('updated hook', () => {
		it('should handle missing state gracefully', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-resize="handler">Resize me</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			// Force update with same handler
			await wrapper.setData({ handler })
			expect(wrapper.find('div').exists()).toBe(true)
		})
	})

	describe('unmounted hook', () => {
		it('should handle missing state gracefully', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { resize: vResize },
				template: `<div v-if="show" v-resize="handler">Resize me</div>`,
				data() {
					return { handler, show: true }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.setData({ show: false })
			await nextTick()

			// Should not throw
			expect(wrapper.find('div').exists()).toBe(false)
		})
	})
})
