import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vHotkey } from '../../src/directives/hotkey'

describe('v-hotkey', () => {
	describe('argument syntax', () => {
		it('should bind hotkey with arg syntax (v-hotkey:escape)', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey:escape="handler" tabindex="0"></div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			// Focus the element
			div.focus()

			// Simulate escape key
			div.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should bind hotkey with modifier (v-hotkey:ctrl.s)', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey:ctrl.s="handler" tabindex="0"></div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			// Simulate ctrl+s without ctrl key - should not trigger
			div.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
			expect(handler).not.toHaveBeenCalled()

			// Simulate ctrl+s with ctrl key
			div.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should support multiple modifiers', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey:ctrl.alt.s="handler" tabindex="0"></div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			// Only ctrl+s
			div.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true }))
			expect(handler).not.toHaveBeenCalled()

			// ctrl+alt+s
			div.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, altKey: true, bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('object syntax', () => {
		it('should bind hotkey with object syntax', async () => {
			const saveHandler = vi.fn()
			const cancelHandler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey="hotkeys" tabindex="0"></div>`,
				data() {
					return {
						hotkeys: {
							'ctrl+s': saveHandler,
							escape: cancelHandler,
						},
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			// Trigger ctrl+s
			div.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true }))
			expect(saveHandler).toHaveBeenCalledTimes(1)

			// Trigger escape
			div.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
			expect(cancelHandler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should support definition objects in record syntax', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey="hotkeys" tabindex="0"></div>`,
				data() {
					return {
						hotkeys: {
							'ctrl+s': {
								handler,
								prevent: true,
							},
						},
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true, cancelable: true })
			const preventSpy = vi.spyOn(event, 'preventDefault')

			div.dispatchEvent(event)

			expect(handler).toHaveBeenCalledTimes(1)
			expect(preventSpy).toHaveBeenCalled()

			wrapper.unmount()
		})
	})

	describe('array syntax', () => {
		it('should bind multiple hotkeys with array syntax', async () => {
			const handler1 = vi.fn()
			const handler2 = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey="hotkeys" tabindex="0"></div>`,
				data() {
					return {
						hotkeys: [
							{ key: 's', modifiers: ['ctrl'], handler: handler1 },
							{ key: 'c', modifiers: ['ctrl'], handler: handler2 },
						],
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			div.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true }))
			expect(handler1).toHaveBeenCalledTimes(1)

			div.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true }))
			expect(handler2).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('single definition syntax', () => {
		it('should accept single HotkeyDefinition object', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey="hotkey" tabindex="0"></div>`,
				data() {
					return {
						hotkey: {
							key: 's',
							modifiers: ['ctrl'],
							handler,
						},
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			div.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('key aliases', () => {
		it('should recognize key aliases', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey:esc="handler" tabindex="0"></div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			div.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should recognize arrow key aliases', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey:up="handler" tabindex="0"></div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			div.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('prevent and stop options', () => {
		it('should prevent default by default', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey:escape="handler" tabindex="0"></div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
			const preventSpy = vi.spyOn(event, 'preventDefault')

			div.dispatchEvent(event)

			expect(preventSpy).toHaveBeenCalled()

			wrapper.unmount()
		})

		it('should not prevent when prevent is false', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey="{ key: 'escape', handler, prevent: false }" tabindex="0"></div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
			const preventSpy = vi.spyOn(event, 'preventDefault')

			div.dispatchEvent(event)

			expect(preventSpy).not.toHaveBeenCalled()

			wrapper.unmount()
		})

		it('should stop propagation when stop is true', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey="{ key: 'escape', handler, stop: true }" tabindex="0"></div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
			const stopSpy = vi.spyOn(event, 'stopPropagation')

			div.dispatchEvent(event)

			expect(stopSpy).toHaveBeenCalled()

			wrapper.unmount()
		})
	})

	describe('disabled option', () => {
		it('should not trigger handler when disabled', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey="{ key: 'escape', handler, disabled: true }" tabindex="0"></div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			div.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
			expect(handler).not.toHaveBeenCalled()

			wrapper.unmount()
		})
	})

	describe('warning for invalid usage', () => {
		it('should warn when function is passed without arg', () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey="handler" tabindex="0"></div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(warnSpy).toHaveBeenCalledWith(
				'[Directix] v-hotkey: hotkey definition required (use v-hotkey:ctrl.s="handler")',
			)

			warnSpy.mockRestore()
			wrapper.unmount()
		})
	})

	describe('cleanup', () => {
		it('should remove event listener on unmount', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-if="show" v-hotkey:escape="handler" tabindex="0"></div>`,
				data() {
					return { show: true, handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()
			div.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			// Unmount
			await wrapper.setData({ show: false })
			await nextTick()

			// Handler should not be called after unmount
			handler.mockClear()

			wrapper.unmount()
		})
	})

	describe('updated hook', () => {
		it('should update hotkeys on binding change', async () => {
			const handler1 = vi.fn()
			const handler2 = vi.fn()

			const TestComponent = defineComponent({
				directives: { hotkey: vHotkey },
				template: `<div v-hotkey="hotkeys" tabindex="0"></div>`,
				data() {
					return {
						hotkeys: { s: handler1 },
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			div.focus()

			div.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
			expect(handler1).toHaveBeenCalledTimes(1)

			// Update hotkeys
			await wrapper.setData({ hotkeys: { s: handler2 } })
			await nextTick()

			div.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
			expect(handler2).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})
})
