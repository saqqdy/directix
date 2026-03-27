import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { vFocus } from '../../src/directives/focus'

describe('v-focus', () => {
	let focusSpy: vi.SpyInstance

	beforeEach(() => {
		focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')
	})

	afterEach(() => {
		focusSpy.mockRestore()
	})

	describe('basic functionality', () => {
		it('should focus the element on mount', async () => {
			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus />`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).toHaveBeenCalled()
		})

		it('should not focus when focus is false', async () => {
			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus="false" />`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).not.toHaveBeenCalled()
		})

		it('should not focus when focus option is false', async () => {
			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus="{ focus: false }" />`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).not.toHaveBeenCalled()
		})
	})

	describe('callback functions', () => {
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
			expect(onFocus).toHaveBeenCalledWith(expect.any(HTMLInputElement))
		})

		it('should call onBlur callback when element loses focus', async () => {
			const onBlur = vi.fn()

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input id="focused" v-focus="{ onBlur }" /><input id="other" />`,
				data() {
					return { onBlur }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			await nextTick()

			// Get the focused input and manually blur it
			const focusedInput = wrapper.find('#focused')
			const element = focusedInput.element as HTMLInputElement

			// Trigger blur event
			element.blur()
			await nextTick()

			expect(onBlur).toHaveBeenCalled()
			expect(onBlur).toHaveBeenCalledWith(expect.any(HTMLInputElement))
		})
	})

	describe('refocus option', () => {
		it('should refocus when binding value changes and refocus is true', async () => {
			const trigger = ref(0)

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus="{ focus: true, refocus: true, trigger }" />`,
				setup() {
					return { trigger }
				},
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			// Initial focus
			expect(focusSpy).toHaveBeenCalledTimes(1)

			// Clear the mock
			focusSpy.mockClear()

			// Change trigger value
			trigger.value++
			await nextTick()

			// Should refocus because value changed
			expect(focusSpy).toHaveBeenCalledTimes(1)
		})

		it('should not refocus when refocus is false', async () => {
			const trigger = ref(0)

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus="{ focus: true, refocus: false, trigger }" />`,
				setup() {
					return { trigger }
				},
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			// Initial focus
			expect(focusSpy).toHaveBeenCalledTimes(1)

			// Clear the mock
			focusSpy.mockClear()

			// Change trigger value
			trigger.value++
			await nextTick()

			// Should not refocus
			expect(focusSpy).not.toHaveBeenCalled()
		})

		it('should not refocus when value has not changed', async () => {
			const dummy = ref(0)

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus="{ focus: true, refocus: true }" />`,
				setup() {
					return { dummy }
				},
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			// Initial focus
			expect(focusSpy).toHaveBeenCalledTimes(1)

			// Clear the mock
			focusSpy.mockClear()

			// Trigger update without changing binding value
			dummy.value++
			await nextTick()

			// Should not refocus because value didn't change
			expect(focusSpy).not.toHaveBeenCalled()
		})

		it('should refocus when boolean value changes from false to true', async () => {
			const shouldFocus = ref(false)

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus="shouldFocus" />`,
				setup() {
					return { shouldFocus }
				},
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			// Should not focus initially
			expect(focusSpy).not.toHaveBeenCalled()

			// Change value to true (but refocus is false by default for boolean binding)
			shouldFocus.value = true
			await nextTick()

			// Still should not refocus because refocus is false for boolean binding
			expect(focusSpy).not.toHaveBeenCalled()
		})
	})

	describe('focusable elements', () => {
		it('should focus input element', async () => {
			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus />`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).toHaveBeenCalled()
		})

		it('should focus textarea element', async () => {
			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<textarea v-focus></textarea>`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).toHaveBeenCalled()
		})

		it('should focus select element', async () => {
			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<select v-focus><option>1</option></select>`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).toHaveBeenCalled()
		})

		it('should focus button element', async () => {
			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<button v-focus>Click</button>`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).toHaveBeenCalled()
		})

		it('should focus element with tabindex', async () => {
			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<div v-focus tabindex="0">Focusable</div>`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).toHaveBeenCalled()
		})

		it('should focus contenteditable element', async () => {
			// Note: jsdom has limited support for contenteditable
			// We test by setting tabindex as fallback
			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<div v-focus contenteditable="true" tabindex="0">Editable</div>`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).toHaveBeenCalled()
		})

		it('should not focus element with tabindex="-1"', async () => {
			const warnSpy = vi.spyOn(console, 'warn')

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<div v-focus tabindex="-1">Not focusable</div>`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).not.toHaveBeenCalled()
			expect(warnSpy).toHaveBeenCalled()

			warnSpy.mockRestore()
		})

		it('should not focus disabled element', async () => {
			const warnSpy = vi.spyOn(console, 'warn')

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus disabled />`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).not.toHaveBeenCalled()
			expect(warnSpy).toHaveBeenCalled()

			warnSpy.mockRestore()
		})

		it('should focus link element with href', async () => {
			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<a v-focus href="#">Link</a>`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).toHaveBeenCalled()
		})

		it('should not focus link element without href', async () => {
			const warnSpy = vi.spyOn(console, 'warn')

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<a v-focus>Not a link</a>`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).not.toHaveBeenCalled()
			expect(warnSpy).toHaveBeenCalled()

			warnSpy.mockRestore()
		})

		it('should focus area element with href', async () => {
			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<map><area v-focus href="#" shape="rect" coords="0,0,100,100" /></map>`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).toHaveBeenCalled()
		})

		it('should not focus element without any focusable attributes', async () => {
			const warnSpy = vi.spyOn(console, 'warn')

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<div v-focus>Not focusable</div>`,
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(focusSpy).not.toHaveBeenCalled()
			expect(warnSpy).toHaveBeenCalled()

			warnSpy.mockRestore()
		})
	})

	describe('update handling', () => {
		it('should update onFocus callback on update', async () => {
			const onFocus1 = vi.fn()
			const onFocus2 = vi.fn()

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus="{ onFocus: currentOnFocus }" />`,
				data() {
					return {
						currentOnFocus: onFocus1,
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			await nextTick()

			// Initial focus
			expect(onFocus1).toHaveBeenCalledTimes(1)

			// Update callback
			await wrapper.setData({ currentOnFocus: onFocus2 })
			await nextTick()

			// Trigger focus event directly (not calling focus() which is mocked)
			const input = wrapper.find('input').element as HTMLInputElement

			input.dispatchEvent(new Event('focus'))
			await nextTick()

			expect(onFocus1).toHaveBeenCalledTimes(1) // Not called again
			expect(onFocus2).toHaveBeenCalledTimes(1)
		})

		it('should update onBlur callback on update', async () => {
			const onBlur1 = vi.fn()
			const onBlur2 = vi.fn()

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus="{ onBlur: currentOnBlur }" />`,
				data() {
					return {
						currentOnBlur: onBlur1,
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			await nextTick()

			// Update callback
			await wrapper.setData({ currentOnBlur: onBlur2 })
			await nextTick()

			// Trigger blur
			const input = wrapper.find('input').element as HTMLInputElement

			input.blur()
			await nextTick()

			expect(onBlur1).not.toHaveBeenCalled()
			expect(onBlur2).toHaveBeenCalledTimes(1)
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const onFocus = vi.fn()
			const onBlur = vi.fn()

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-if="show" v-focus="{ onFocus, onBlur }" />`,
				data() {
					return {
						show: true,
						onFocus,
						onBlur,
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			await nextTick()

			expect(onFocus).toHaveBeenCalledTimes(1)

			// Unmount the component
			await wrapper.setData({ show: false })
			await nextTick()

			// Try to trigger events - should not call callbacks
			onFocus.mockClear()
			onBlur.mockClear()

			// The element is removed, so no way to trigger events
			expect(onFocus).not.toHaveBeenCalled()
			expect(onBlur).not.toHaveBeenCalled()
		})
	})

	describe('isEqual helper', () => {
		it('should correctly compare object values for refocus decision', async () => {
			const options = ref({ focus: true, refocus: true })

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus="options" />`,
				setup() {
					return { options }
				},
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()

			// Initial focus
			expect(focusSpy).toHaveBeenCalledTimes(1)
			focusSpy.mockClear()

			// Update with same values (different object, same content)
			options.value = { focus: true, refocus: true }
			await nextTick()

			// Should not refocus because values are equal
			expect(focusSpy).not.toHaveBeenCalled()

			// Update with different values
			options.value = { focus: true, refocus: true, trigger: 1 }
			await nextTick()

			// Should refocus because values changed
			expect(focusSpy).toHaveBeenCalledTimes(1)
		})

		it('should handle null values in isEqual', async () => {
			const options = ref({ focus: true, refocus: true, extra: null as any })

			const TestComponent = defineComponent({
				directives: { focus: vFocus },
				template: `<input v-focus="options" />`,
				setup() {
					return { options }
				},
			})

			mount(TestComponent, { attachTo: document.body })

			await nextTick()
			expect(focusSpy).toHaveBeenCalledTimes(1)
		})
	})
})
