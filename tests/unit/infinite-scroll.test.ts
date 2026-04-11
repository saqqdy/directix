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
})
