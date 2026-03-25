import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { vCopy } from '../../src/directives/copy'

describe('v-copy', () => {
	it('should copy text when clicked', async () => {
		const text = 'Hello, World!'
		let copiedText = ''

		// Mock clipboard API
		vi.stubGlobal('navigator', {
			clipboard: {
				writeText: vi.fn().mockImplementation((t: string) => {
					copiedText = t

					return Promise.resolve()
				}),
			},
		})

		const TestComponent = defineComponent({
			directives: { copy: vCopy },
			template: `<button v-copy="text">Copy</button>`,
			data() {
				return { text }
			},
		})

		const wrapper = mount(TestComponent)

		await wrapper.find('button').trigger('click')

		expect(copiedText).toBe(text)

		vi.unstubAllGlobals()
	})

	it('should call onSuccess callback', async () => {
		const text = 'Test text'
		const onSuccess = vi.fn()

		vi.stubGlobal('navigator', {
			clipboard: {
				writeText: vi.fn().mockResolvedValue(undefined),
			},
		})

		const TestComponent = defineComponent({
			directives: { copy: vCopy },
			template: `<button v-copy="{ value: text, onSuccess }">Copy</button>`,
			data() {
				return { text, onSuccess }
			},
		})

		const wrapper = mount(TestComponent)

		await wrapper.find('button').trigger('click')

		// Wait for async operation
		await new Promise(resolve => setTimeout(resolve, 0))

		expect(onSuccess).toHaveBeenCalledWith(text)

		vi.unstubAllGlobals()
	})
})
