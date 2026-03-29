import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vCopy } from '../../src/directives/copy'

describe('v-copy', () => {
	let clipboardWriteText: Mock

	beforeEach(() => {
		clipboardWriteText = vi.fn().mockResolvedValue(undefined)
		vi.stubGlobal('navigator', {
			clipboard: {
				writeText: clipboardWriteText,
				readText: vi.fn().mockResolvedValue(''),
			},
		})
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	describe('basic functionality', () => {
		it('should copy text when clicked', async () => {
			const text = 'Hello, World!'

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="text">Copy</button>`,
				data() {
					return { text }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			await nextTick()

			expect(clipboardWriteText).toHaveBeenCalledWith(text)
		})

		it('should copy text from options object', async () => {
			const text = 'Test text'

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="{ value: text }">Copy</button>`,
				data() {
					return { text }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			await nextTick()

			expect(clipboardWriteText).toHaveBeenCalledWith(text)
		})
	})

	describe('callbacks', () => {
		it('should call onSuccess callback', async () => {
			const text = 'Test text'
			const onSuccess = vi.fn()

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="{ value: text, onSuccess }">Copy</button>`,
				data() {
					return { text, onSuccess }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			await nextTick()

			expect(onSuccess).toHaveBeenCalledWith(text)
		})

		it('should dispatch copy:success event', async () => {
			const text = 'Test text'

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="text">Copy</button>`,
				data() {
					return { text }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			const eventHandler = vi.fn()

			button.element.addEventListener('copy:success', eventHandler)

			await button.trigger('click')
			await nextTick()

			expect(eventHandler).toHaveBeenCalled()
			expect(eventHandler.mock.calls[0][0].detail).toEqual({ text })
		})

		it('should call onError callback when copy fails', async () => {
			const text = 'Test text'
			const onError = vi.fn()

			// Make clipboard fail
			clipboardWriteText.mockRejectedValue(new Error('Clipboard error'))

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="{ value: text, onError }">Copy</button>`,
				data() {
					return { text, onError }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			await nextTick()

			expect(onError).toHaveBeenCalled()
			expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
		})

		it('should dispatch copy:error event when copy fails', async () => {
			const text = 'Test text'

			// Make clipboard fail
			clipboardWriteText.mockRejectedValue(new Error('Clipboard error'))

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="text">Copy</button>`,
				data() {
					return { text }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			const eventHandler = vi.fn()

			button.element.addEventListener('copy:error', eventHandler)

			await button.trigger('click')
			await nextTick()

			expect(eventHandler).toHaveBeenCalled()
			expect(eventHandler.mock.calls[0][0].detail.error).toBeInstanceOf(Error)
		})
	})

	describe('clipboard fallback', () => {
		it('should fallback to execCommand when clipboard API fails', async () => {
			const text = 'Test text'

			// Make clipboard API fail
			clipboardWriteText.mockRejectedValue(new Error('Clipboard API failed'))

			// Mock execCommand
			const originalExecCommand = document.execCommand

			document.execCommand = vi.fn().mockReturnValue(true)

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="text">Copy</button>`,
				data() {
					return { text }
				},
			})

			const wrapper = mount(TestComponent)
			const warnSpy = vi.spyOn(console, 'warn')

			await wrapper.find('button').trigger('click')
			await nextTick()

			expect(warnSpy).toHaveBeenCalledWith('[Directix] Clipboard API failed, falling back to execCommand')
			expect(document.execCommand).toHaveBeenCalledWith('copy')

			document.execCommand = originalExecCommand
			warnSpy.mockRestore()
		})

		it('should use execCommand when clipboard API is not supported', async () => {
			const text = 'Test text'

			// Remove clipboard API
			vi.stubGlobal('navigator', {})

			// Mock execCommand
			const originalExecCommand = document.execCommand

			document.execCommand = vi.fn().mockReturnValue(true)

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="text">Copy</button>`,
				data() {
					return { text }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			await nextTick()

			expect(document.execCommand).toHaveBeenCalledWith('copy')

			document.execCommand = originalExecCommand
		})
	})

	describe('disabled option', () => {
		it('should not bind click event when disabled', async () => {
			const text = 'Test text'

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="{ value: text, disabled: true }">Copy</button>`,
				data() {
					return { text }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			await nextTick()

			expect(clipboardWriteText).not.toHaveBeenCalled()
		})
	})

	describe('title option', () => {
		it('should set title attribute', async () => {
			const text = 'Test text'
			const title = 'Click to copy'

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="{ value: text, title }">Copy</button>`,
				data() {
					return { text, title }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('button').element.getAttribute('title')).toBe(title)
		})

		it('should update title on update', async () => {
			const text = 'Test text'

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="{ value: text, title }">Copy</button>`,
				data() {
					return { text, title: 'Click to copy' }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('button').element.getAttribute('title')).toBe('Click to copy')

			await wrapper.setData({ title: 'Copy this!' })
			await nextTick()

			expect(wrapper.find('button').element.getAttribute('title')).toBe('Copy this!')
		})
	})

	describe('empty text handling', () => {
		it('should warn when text is empty', async () => {
			const warnSpy = vi.spyOn(console, 'warn')

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="emptyText">Copy</button>`,
				data() {
					return {
						emptyText: '',
					}
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			await nextTick()

			expect(warnSpy).toHaveBeenCalledWith('[Directix] v-copy: No text to copy')

			warnSpy.mockRestore()
		})
	})

	describe('cleanup', () => {
		it('should remove click event listener on unmount', async () => {
			const text = 'Test text'

			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-if="show" v-copy="text">Copy</button>`,
				data() {
					return { show: true, text }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			await nextTick()
			expect(clipboardWriteText).toHaveBeenCalledTimes(1)

			// Unmount
			await wrapper.setData({ show: false })
			await nextTick()

			// Button is removed, no more calls
			clipboardWriteText.mockClear()
			expect(clipboardWriteText).not.toHaveBeenCalled()

			wrapper.unmount()
		})
	})

	describe('update handling', () => {
		it('should update text value on update', async () => {
			const TestComponent = defineComponent({
				directives: { copy: vCopy },
				template: `<button v-copy="text">Copy</button>`,
				data() {
					return { text: 'Initial text' }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('button').trigger('click')
			await nextTick()
			expect(clipboardWriteText).toHaveBeenCalledWith('Initial text')

			await wrapper.setData({ text: 'Updated text' })
			await nextTick()

			clipboardWriteText.mockClear()
			await wrapper.find('button').trigger('click')
			await nextTick()
			expect(clipboardWriteText).toHaveBeenCalledWith('Updated text')
		})
	})
})
