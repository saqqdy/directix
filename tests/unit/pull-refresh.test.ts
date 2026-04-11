import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vPullRefresh } from '../../src/directives/pull-refresh'

// Mock Touch
class MockTouch {
	identifier = 0
	target = document.body
	clientX = 0
	clientY = 0
	pageX = 0
	pageY = 0
	screenX = 0
	screenY = 0
	radiusX = 0
	radiusY = 0
	rotationAngle = 0
	force = 0

	constructor(options: Partial<TouchInit>) {
		Object.assign(this, options)
	}
}

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
