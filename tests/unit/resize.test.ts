import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vResize } from '../../src/directives/resize'
import { setupResizeObserver } from '../utils'

describe('v-resize', () => {
	let observer: ReturnType<typeof setupResizeObserver>
	let originalResizeObserver: typeof ResizeObserver

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
})
