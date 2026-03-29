import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { vTrim } from '../../src/directives/trim'

describe('v-trim', () => {
	describe('directive definition', () => {
		it('should be defined', () => {
			expect(vTrim).toBeDefined()
		})

		it('should have mounted hook', () => {
			expect(vTrim.mounted).toBeDefined()
		})

		it('should have updated hook', () => {
			expect(vTrim.updated).toBeDefined()
		})

		it('should have unmounted hook', () => {
			expect(vTrim.unmounted).toBeDefined()
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
})
