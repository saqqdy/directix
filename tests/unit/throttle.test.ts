import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { vThrottle } from '../../src/directives/throttle'

describe('v-throttle', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should throttle the handler', async () => {
		const handler = vi.fn()

		const TestComponent = defineComponent({
			directives: { throttle: vThrottle },
			template: `<button v-throttle="handler">Click</button>`,
			data() {
				return { handler }
			},
		})

		const wrapper = mount(TestComponent)
		const button = wrapper.find('button')

		// 第一次点击应该立即触发
		await button.trigger('click')
		expect(handler).toHaveBeenCalledTimes(1)

		// 在节流时间内再次点击，不会触发
		await button.trigger('click')
		await button.trigger('click')
		expect(handler).toHaveBeenCalledTimes(1)

		// 快进 300ms
		vi.advanceTimersByTime(300)

		// 现在可以再次触发
		await button.trigger('click')
		expect(handler).toHaveBeenCalledTimes(2)
	})

	it('should respect wait time from arg', async () => {
		const handler = vi.fn()

		const TestComponent = defineComponent({
			directives: { throttle: vThrottle },
			template: `<button v-throttle:500="handler">Click</button>`,
			data() {
				return { handler }
			},
		})

		const wrapper = mount(TestComponent)

		await wrapper.find('button').trigger('click')

		expect(handler).toHaveBeenCalledTimes(1)

		vi.advanceTimersByTime(300)
		await wrapper.find('button').trigger('click')
		expect(handler).toHaveBeenCalledTimes(1) // 还在节流时间内

		vi.advanceTimersByTime(200)
		await wrapper.find('button').trigger('click')
		expect(handler).toHaveBeenCalledTimes(2)
	})

	it('should use scroll event modifier', async () => {
		const handler = vi.fn()

		const TestComponent = defineComponent({
			directives: { throttle: vThrottle },
			template: `<div v-throttle:100.scroll="handler" style="height: 100px; overflow: auto;"><div style="height: 500px;"></div></div>`,
			data() {
				return { handler }
			},
		})

		const wrapper = mount(TestComponent)
		const div = wrapper.find('div')

		// 触发 scroll 事件
		await div.trigger('scroll')
		expect(handler).toHaveBeenCalledTimes(1)

		// 在节流时间内再次滚动，不会触发
		await div.trigger('scroll')
		await div.trigger('scroll')
		expect(handler).toHaveBeenCalledTimes(1)

		// 快进 100ms
		vi.advanceTimersByTime(100)

		// 现在可以再次触发
		await div.trigger('scroll')
		expect(handler).toHaveBeenCalledTimes(2)
	})
})
