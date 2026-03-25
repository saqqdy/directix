import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { vDebounce } from '../../src/directives/debounce'

describe('v-debounce', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should debounce the handler', async () => {
		const handler = vi.fn()

		const TestComponent = defineComponent({
			directives: { debounce: vDebounce },
			template: `<input v-debounce="handler" />`,
			data() {
				return { handler }
			},
		})

		const wrapper = mount(TestComponent)
		const input = wrapper.find('input')

		// 触发多次事件
		await input.trigger('input')
		await input.trigger('input')
		await input.trigger('input')

		// 此时 handler 还没被调用
		expect(handler).not.toHaveBeenCalled()

		// 快进 300ms
		vi.advanceTimersByTime(300)

		// handler 应该被调用一次
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('should respect wait time from arg', async () => {
		const handler = vi.fn()

		const TestComponent = defineComponent({
			directives: { debounce: vDebounce },
			template: `<input v-debounce:500="handler" />`,
			data() {
				return { handler }
			},
		})

		const wrapper = mount(TestComponent)

		await wrapper.find('input').trigger('input')

		vi.advanceTimersByTime(300)
		expect(handler).not.toHaveBeenCalled()

		vi.advanceTimersByTime(200)
		expect(handler).toHaveBeenCalledTimes(1)
	})
})
