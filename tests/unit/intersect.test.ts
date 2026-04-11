import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vIntersect } from '../../src/directives/intersect'
import { setupIntersectionObserver } from '../utils'

describe('v-intersect', () => {
	let observer: ReturnType<typeof setupIntersectionObserver>

	beforeEach(() => {
		observer = setupIntersectionObserver()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should create IntersectionObserver on mount', () => {
			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-intersect>Observe me</div>`,
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).toHaveBeenCalled()
			expect(observer.observe).toHaveBeenCalled()
		})

		it('should call handler when intersecting', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-intersect="handler">Observe me</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			// Trigger intersection
			observer.triggerIntersection({ isIntersecting: true })

			expect(handler).toHaveBeenCalled()
		})

		it('should call onEnter when element enters viewport', () => {
			const onEnter = vi.fn()

			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-intersect="{ onEnter }">Observe me</div>`,
				data() {
					return { onEnter }
				},
			})

			mount(TestComponent)

			observer.triggerIntersection({ isIntersecting: true })

			expect(onEnter).toHaveBeenCalled()
		})

		it('should call onLeave when element leaves viewport', () => {
			const onLeave = vi.fn()

			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-intersect="{ onLeave }">Observe me</div>`,
				data() {
					return { onLeave }
				},
			})

			mount(TestComponent)

			observer.triggerIntersection({ isIntersecting: false })

			expect(onLeave).toHaveBeenCalled()
		})

		it('should call onChange with isIntersecting value', () => {
			const onChange = vi.fn()

			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-intersect="{ onChange }">Observe me</div>`,
				data() {
					return { onChange }
				},
			})

			mount(TestComponent)

			observer.triggerIntersection({ isIntersecting: true })

			expect(onChange).toHaveBeenCalledWith(true, expect.any(Object))
		})
	})

	describe('once option', () => {
		it('should only trigger once when once is true', () => {
			const onEnter = vi.fn()

			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-intersect="{ onEnter, once: true }">Observe me</div>`,
				data() {
					return { onEnter }
				},
			})

			mount(TestComponent)

			// First trigger
			observer.triggerIntersection({ isIntersecting: true })
			expect(onEnter).toHaveBeenCalledTimes(1)

			// Second trigger should not call handler
			observer.triggerIntersection({ isIntersecting: true })
			expect(onEnter).toHaveBeenCalledTimes(1)
		})
	})

	describe('disabled option', () => {
		it('should not observe when disabled is true', () => {
			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-intersect="{ disabled: true }">Observe me</div>`,
			})

			mount(TestComponent)

			expect(observer.observe).not.toHaveBeenCalled()
		})

		it('should disconnect observer when disabled changes to true', async () => {
			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-intersect="{ disabled }">Observe me</div>`,
				data() {
					return { disabled: false }
				},
			})

			const wrapper = mount(TestComponent)

			expect(observer.observe).toHaveBeenCalled()

			await wrapper.setData({ disabled: true })
			await nextTick()

			expect(observer.disconnect).toHaveBeenCalled()
		})
	})

	describe('threshold option', () => {
		it('should pass threshold to IntersectionObserver', () => {
			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-intersect="{ threshold: 0.5 }">Observe me</div>`,
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ threshold: 0.5 }),
			)
		})
	})

	describe('rootMargin option', () => {
		it('should pass rootMargin to IntersectionObserver', () => {
			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-intersect="{ rootMargin: '50px' }">Observe me</div>`,
			})

			mount(TestComponent)

			expect(observer.MockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ rootMargin: '50px' }),
			)
		})
	})

	describe('custom event', () => {
		it('should dispatch intersect event', () => {
			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-intersect>Observe me</div>`,
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			const eventHandler = vi.fn()
			div.element.addEventListener('intersect', eventHandler)

			observer.triggerIntersection({ isIntersecting: true })

			expect(eventHandler).toHaveBeenCalled()
			expect(eventHandler.mock.calls[0][0].detail).toHaveProperty('isIntersecting')
		})
	})

	describe('cleanup', () => {
		it('should disconnect observer on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { intersect: vIntersect },
				template: `<div v-if="show" v-intersect>Observe me</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(observer.disconnect).toHaveBeenCalled()
		})
	})
})
