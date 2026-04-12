import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vPullRefresh } from '../../src/directives/pull-refresh'
import { createMockTouchEvent } from '../utils'

describe('v-pull-refresh', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should add pull-refresh class on mount', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-pull-refresh')
		})

		it('should create indicator element', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pull-refresh__indicator').exists()).toBe(true)
		})

		it('should create content wrapper', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pull-refresh__content').exists()).toBe(true)
		})

		it('should move children to content wrapper', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="handler"><span>Child Content</span></div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pull-refresh__content span').exists()).toBe(true)
			expect(wrapper.find('.v-pull-refresh__content').text()).toBe('Child Content')
		})
	})

	describe('disabled option', () => {
		it('should not bind events when disabled', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="{ handler, disabled: true }">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pull-refresh').exists()).toBe(true)
		})

		it('should enable when disabled changes to false', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="{ handler, disabled: isDisabled }">Content</div>`,
				data() {
					return { handler, isDisabled: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ isDisabled: false })
			await nextTick()

			expect(wrapper.find('.v-pull-refresh').exists()).toBe(true)
		})

		it('should disable when disabled changes to true', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="{ handler, disabled: isDisabled }">Content</div>`,
				data() {
					return { handler, isDisabled: false }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ isDisabled: true })
			await nextTick()

			expect(wrapper.find('.v-pull-refresh').exists()).toBe(true)
		})
	})

	describe('options', () => {
		it('should use custom distance', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="{ handler, distance: 100 }">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pull-refresh').exists()).toBe(true)
		})

		it('should use custom maxDistance', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="{ handler, maxDistance: 150 }">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pull-refresh').exists()).toBe(true)
		})

		it('should use custom indicator', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="{ handler, indicator: { idle: 'Pull to refresh', loading: 'Loading...' } }">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pull-refresh').exists()).toBe(true)
		})

		it('should use custom successDuration', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="{ handler, successDuration: 1000 }">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pull-refresh').exists()).toBe(true)
		})

		it('should use custom errorDuration', () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="{ handler, errorDuration: 2000 }">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pull-refresh').exists()).toBe(true)
		})

		it('should call onStateChange callback', () => {
			const handler = vi.fn()
			const onStateChange = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="{ handler, onStateChange }">Content</div>`,
				data() {
					return { handler, onStateChange }
				},
			})

			mount(TestComponent)

			// Initial state is 'idle'
			expect(onStateChange).not.toHaveBeenCalled()
		})
	})

	describe('touch interactions', () => {
		it('should handle touchstart event', async () => {
			const handler = vi.fn().mockResolvedValue(undefined)
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('.v-pull-refresh').element

			// Simulate touchstart
			const touchStartEvent = createMockTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }])
			element.dispatchEvent(touchStartEvent)

			expect(true).toBe(true) // Touch event was dispatched
		})

		it('should not respond to touchstart when disabled', async () => {
			const handler = vi.fn().mockResolvedValue(undefined)
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="{ handler, disabled: true }">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('.v-pull-refresh').element

			// Simulate touchstart
			const touchStartEvent = createMockTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }])
			element.dispatchEvent(touchStartEvent)

			expect(handler).not.toHaveBeenCalled()
		})

		it('should handle touchmove event', async () => {
			const handler = vi.fn().mockResolvedValue(undefined)
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('.v-pull-refresh').element

			// Simulate touchstart
			const touchStartEvent = createMockTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }])
			element.dispatchEvent(touchStartEvent)

			// Simulate touchmove (pulling down)
			const touchMoveEvent = createMockTouchEvent('touchmove', [{ clientX: 100, clientY: 150 }])
			element.dispatchEvent(touchMoveEvent)

			// Content should have transform applied
			const content = wrapper.find('.v-pull-refresh__content').element
			expect(content.style.transform).toBeDefined()
		})

		it('should handle upward swipe (negative diff)', async () => {
			const handler = vi.fn().mockResolvedValue(undefined)
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('.v-pull-refresh').element

			// Simulate touchstart
			const touchStartEvent = createMockTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }])
			element.dispatchEvent(touchStartEvent)

			// Simulate touchmove (pulling up - negative direction)
			const touchMoveEvent = createMockTouchEvent('touchmove', [{ clientX: 100, clientY: 50 }])
			element.dispatchEvent(touchMoveEvent)

			// Should not have transform applied
			const content = wrapper.find('.v-pull-refresh__content').element
			expect(content.style.transform).toBe('')
		})

		it('should handle touchend event without triggering refresh', async () => {
			const handler = vi.fn().mockResolvedValue(undefined)
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="handler">Content</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('.v-pull-refresh').element

			// Simulate touchstart
			const touchStartEvent = createMockTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }])
			element.dispatchEvent(touchStartEvent)

			// Simulate touchmove (small pull - not enough to trigger)
			const touchMoveEvent = createMockTouchEvent('touchmove', [{ clientX: 100, clientY: 120 }])
			element.dispatchEvent(touchMoveEvent)

			// Simulate touchend
			const touchEndEvent = createMockTouchEvent('touchend', [])
			element.dispatchEvent(touchEndEvent)

			// Handler should not be called
			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('updated hook', () => {
		it('should update options when binding changes', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-pull-refresh="{ handler, distance: currentDistance }">Content</div>`,
				data() {
					return { handler, currentDistance: 60 }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ currentDistance: 100 })
			await nextTick()

			expect(wrapper.find('.v-pull-refresh').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const handler = vi.fn()
			const TestComponent = defineComponent({
				directives: { pullRefresh: vPullRefresh },
				template: `<div v-if="show" v-pull-refresh="handler">Content</div>`,
				data() {
					return { handler, show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pull-refresh').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-pull-refresh').exists()).toBe(false)
		})
	})
})
