import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { vUppercase } from '../../src/directives/uppercase'

describe('v-uppercase', () => {
	describe('directive definition', () => {
		it('should be defined', () => {
			expect(vUppercase).toBeDefined()
		})

		it('should have correct name', () => {
			expect(vUppercase.name).toBe('uppercase')
		})

		it('should support SSR', () => {
			expect(vUppercase.ssr).toBe(true)
		})
	})

	describe('input elements', () => {
		it('should transform input value on input', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<input v-uppercase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello')
			expect((input.element as HTMLInputElement).value).toBe('HELLO')
		})

		it('should transform on subsequent input', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<input v-uppercase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello')
			expect((input.element as HTMLInputElement).value).toBe('HELLO')

			await input.setValue('world')
			expect((input.element as HTMLInputElement).value).toBe('WORLD')
		})
	})

	describe('first option', () => {
		it('should only capitalize first character when first is true', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<input v-uppercase="{ first: true }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello world')
			expect((input.element as HTMLInputElement).value).toBe('Hello world')
		})
	})

	describe('edge cases', () => {
		it('should handle empty string in input', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<input v-uppercase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('')
			expect((input.element as HTMLInputElement).value).toBe('')
		})

		it('should handle numbers in string', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<input v-uppercase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello123world')
			expect((input.element as HTMLInputElement).value).toBe('HELLO123WORLD')
		})

		it('should handle special characters', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<input v-uppercase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello!@#world')
			expect((input.element as HTMLInputElement).value).toBe('HELLO!@#WORLD')
		})

		it('should handle already uppercase text', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<input v-uppercase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('HELLO WORLD')
			expect((input.element as HTMLInputElement).value).toBe('HELLO WORLD')
		})
	})

	describe('disabled option', () => {
		it('should not transform when onInput is false', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<input v-uppercase="{ onInput: false }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello')
			// When onInput is false, the value should not be transformed immediately
			expect((input.element as HTMLInputElement).value).toBe('hello')
		})
	})
})
