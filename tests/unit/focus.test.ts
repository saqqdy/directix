import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { vFocus } from '../../src/directives/focus'

describe('v-focus', () => {
	it('should focus the element on mount', async () => {
		const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')

		const TestComponent = defineComponent({
			directives: { focus: vFocus },
			template: `<input v-focus />`,
		})

		mount(TestComponent, { attachTo: document.body })

		await nextTick()

		expect(focusSpy).toHaveBeenCalled()

		focusSpy.mockRestore()
	})

	it('should not focus when disabled', async () => {
		const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')

		const TestComponent = defineComponent({
			directives: { focus: vFocus },
			template: `<input v-focus="false" />`,
		})

		mount(TestComponent, { attachTo: document.body })

		await nextTick()

		expect(focusSpy).not.toHaveBeenCalled()

		focusSpy.mockRestore()
	})

	it('should call onFocus callback', async () => {
		const onFocus = vi.fn()

		const TestComponent = defineComponent({
			directives: { focus: vFocus },
			template: `<input v-focus="{ onFocus }" />`,
			data() {
				return { onFocus }
			},
		})

		mount(TestComponent, { attachTo: document.body })

		await nextTick()

		expect(onFocus).toHaveBeenCalled()
	})
})
