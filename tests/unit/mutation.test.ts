import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vMutation } from '../../src/directives/mutation'
import { setupMutationObserver } from '../utils'

describe('v-mutation', () => {
	let observer: ReturnType<typeof setupMutationObserver>

	beforeEach(() => {
		observer = setupMutationObserver()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should create MutationObserver on mount', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { mutation: vMutation },
				template: `<div v-mutation="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.MockMutationObserver).toHaveBeenCalled()
			expect(observer.observe).toHaveBeenCalled()
		})

		it('should call handler when mutations occur', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { mutation: vMutation },
				template: `<div v-mutation="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			// Trigger mutation
			observer.triggerMutation({ type: 'childList' })

			expect(handler).toHaveBeenCalled()
		})

		it('should accept options object', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { mutation: vMutation },
				template: `<div v-mutation="{ handler, attributes: true }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.observe).toHaveBeenCalledWith(
				expect.any(HTMLElement),
				expect.objectContaining({ attributes: true }),
			)
		})
	})

	describe('observer options', () => {
		it('should pass childList option', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { mutation: vMutation },
				template: `<div v-mutation="{ handler, childList: false }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.observe).toHaveBeenCalledWith(
				expect.any(HTMLElement),
				expect.objectContaining({ childList: false }),
			)
		})

		it('should pass subtree option', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { mutation: vMutation },
				template: `<div v-mutation="{ handler, subtree: true }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.observe).toHaveBeenCalledWith(
				expect.any(HTMLElement),
				expect.objectContaining({ subtree: true }),
			)
		})

		it('should pass attributeFilter option', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { mutation: vMutation },
				template: `<div v-mutation="{ handler, attributes: true, attributeFilter: ['class'] }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.observe).toHaveBeenCalledWith(
				expect.any(HTMLElement),
				expect.objectContaining({ attributeFilter: ['class'] }),
			)
		})

		it('should pass characterData option', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { mutation: vMutation },
				template: `<div v-mutation="{ handler, characterData: true }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.observe).toHaveBeenCalledWith(
				expect.any(HTMLElement),
				expect.objectContaining({ characterData: true }),
			)
		})
	})

	describe('disabled option', () => {
		it('should not observe when disabled is true', () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { mutation: vMutation },
				template: `<div v-mutation="{ handler, disabled: true }">Content</div>`,
				data() {
					return { handler }
				},
			})

			mount(TestComponent)

			expect(observer.observe).not.toHaveBeenCalled()
		})

		it('should disconnect observer when disabled changes to true', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { mutation: vMutation },
				template: `<div v-mutation="{ handler, disabled }">Content</div>`,
				data() {
					return { handler, disabled: false }
				},
			})

			const wrapper = mount(TestComponent)

			expect(observer.observe).toHaveBeenCalled()

			await wrapper.setData({ disabled: true })
			await nextTick()

			expect(observer.disconnect).toHaveBeenCalled()
		})
	})

	describe('cleanup', () => {
		it('should disconnect observer on unmount', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { mutation: vMutation },
				template: `<div v-if="show" v-mutation="handler">Content</div>`,
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

	describe('error handling', () => {
		it('should throw error if handler is missing', () => {
			const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const TestComponent = defineComponent({
				directives: { mutation: vMutation },
				template: `<div v-mutation="{}">Content</div>`,
			})

			expect(() => mount(TestComponent)).toThrow()

			errorSpy.mockRestore()
		})
	})
})
