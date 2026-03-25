import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { vClickOutside } from '../../src/directives/click-outside'

describe('v-click-outside', () => {
	it('should call handler when clicking outside', async () => {
		const handler = vi.fn()

		const TestComponent = defineComponent({
			directives: { clickOutside: vClickOutside },
			template: `
        <div>
          <div id="target" v-click-outside="handler">Target</div>
          <div id="outside">Outside</div>
        </div>
      `,
			data() {
				return { handler }
			},
		})

		const wrapper = mount(TestComponent, { attachTo: document.body })

		// 点击外部元素
		const outsideEl = wrapper.find('#outside').element

		outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }))

		expect(handler).toHaveBeenCalledTimes(1)

		wrapper.unmount()
	})

	it('should not call handler when clicking inside', async () => {
		const handler = vi.fn()

		const TestComponent = defineComponent({
			directives: { clickOutside: vClickOutside },
			template: `
        <div id="target" v-click-outside="handler">Target</div>
      `,
			data() {
				return { handler }
			},
		})

		const wrapper = mount(TestComponent, { attachTo: document.body })

		// 点击目标元素
		const targetEl = wrapper.find('#target').element

		targetEl.dispatchEvent(new MouseEvent('click', { bubbles: true }))

		expect(handler).not.toHaveBeenCalled()

		wrapper.unmount()
	})

	it('should respect disabled option', async () => {
		const handler = vi.fn()

		const TestComponent = defineComponent({
			directives: { clickOutside: vClickOutside },
			template: `
        <div v-click-outside="{ handler, disabled: true }">Target</div>
      `,
			data() {
				return { handler }
			},
		})

		const wrapper = mount(TestComponent, { attachTo: document.body })

		document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

		expect(handler).not.toHaveBeenCalled()

		wrapper.unmount()
	})
})
