import type { ObjectDirective } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vTrim } from '../../src/directives/trim'

describe('v-trim', () => {
	describe('directive definition', () => {
		it('should be defined', () => {
			expect(vTrim).toBeDefined()
		})

		it('should have mounted hook', () => {
			expect((vTrim as ObjectDirective).mounted).toBeDefined()
		})

		it('should have updated hook', () => {
			expect((vTrim as ObjectDirective).updated).toBeDefined()
		})

		it('should have unmounted hook', () => {
			expect((vTrim as ObjectDirective).unmounted).toBeDefined()
		})
	})

	describe('basic functionality', () => {
		it('should trim whitespace on blur by default', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			// Set value directly to simulate user input
			;(input.element as HTMLInputElement).value = '  hello world  '
			await input.trigger('input')
			// After input, trailing spaces are trimmed (onInput behavior)
			expect((input.element as HTMLInputElement).value).toBe('  hello world')

			await input.trigger('blur')
			// After blur, both sides are trimmed
			expect((input.element as HTMLInputElement).value).toBe('hello world')
		})
	})

	describe('whitespace types', () => {
		it('should trim tabs', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '\thello\t'
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('hello')
		})

		it('should trim newlines', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '\nhello\n'
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('hello')
		})
	})

	describe('edge cases', () => {
		it('should handle empty string', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = ''
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('')
		})

		it('should handle whitespace only string', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '   '
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('')
		})
	})

	describe('position options', () => {
		it('should trim only start when position is "start"', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim="{ position: 'start', onInput: false }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '  hello world  '
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('hello world  ')
		})

		it('should trim only end when position is "end"', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim="'end'" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '  hello world  '
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('  hello world')
		})

		it('should trim both sides when position is "both"', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim="{ position: 'both' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '  hello world  '
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('hello world')
		})
	})

	describe('onInput option', () => {
		it('should not trim on input when onInput is false', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim="{ onInput: false }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '  hello world  '
			await input.trigger('input')
			// Should not change on input
			expect((input.element as HTMLInputElement).value).toBe('  hello world  ')
		})
	})

	describe('onBlur option', () => {
		it('should not trim on blur when onBlur is false', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim="{ onBlur: false }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '  hello world  '
			await input.trigger('input')
			await input.trigger('blur')
			// Should only have trimmed end on input
			expect((input.element as HTMLInputElement).value).toBe('  hello world')
		})
	})

	describe('custom chars option', () => {
		it('should trim custom characters', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim="{ chars: '-' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '--hello world--'
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('hello world')
		})

		it('should trim both whitespace and custom characters', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim="{ chars: '-' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = ' -hello world- '
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('hello world')
		})
	})

	describe('non-input elements', () => {
		it('should trim text content of non-input elements', () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<span v-trim>  hello world  </span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').text()).toBe('hello world')
		})

		it('should handle non-input elements with no text', () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<span v-trim></span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').text()).toBe('')
		})

		it('should work with div elements', () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<div v-trim>  test  </div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').text()).toBe('test')
		})
	})

	describe('boolean binding', () => {
		it('should trim when bound to true', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim="true" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '  hello  '
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('hello')
		})

		it('should not trim when bound to false', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim="false" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '  hello  '
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('  hello  ')
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-if="show" v-trim />`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('input').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('input').exists()).toBe(false)
		})
	})

	describe('initial value', () => {
		it('should trim initial value on mount', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim value="  hello  " />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			// Initial value should be trimmed
			expect((input.element as HTMLInputElement).value).toBe('hello')
		})
	})

	describe('textarea support', () => {
		it('should work with textarea elements', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<textarea v-trim></textarea>`,
			})

			const wrapper = mount(TestComponent)
			const textarea = wrapper.find('textarea')

			;(textarea.element as HTMLTextAreaElement).value = '  hello world  '
			await textarea.trigger('input')
			await textarea.trigger('blur')
			expect((textarea.element as HTMLTextAreaElement).value).toBe('hello world')
		})
	})
})
