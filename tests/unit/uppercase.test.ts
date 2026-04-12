import type { ObjectDirective } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { vUppercase } from '../../src/directives/uppercase'

describe('v-uppercase', () => {
	describe('directive definition', () => {
		it('should be defined', () => {
			expect(vUppercase).toBeDefined()
		})

		it('should have mounted hook', () => {
			expect((vUppercase as ObjectDirective).mounted).toBeDefined()
		})

		it('should have updated hook', () => {
			expect((vUppercase as ObjectDirective).updated).toBeDefined()
		})

		it('should have unmounted hook', () => {
			expect((vUppercase as ObjectDirective).unmounted).toBeDefined()
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

// Additional tests for improved coverage
describe('v-uppercase additional coverage', () => {
	describe('non-input elements', () => {
		it('should transform text content in non-input elements', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<span v-uppercase>hello world</span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').text()).toBe('HELLO WORLD')
		})

		it('should transform only first character in non-input elements when first is true', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<span v-uppercase="{ first: true }">hello world</span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').text()).toBe('Hello world')
		})
	})

	describe('binding values', () => {
		it('should work with binding value true', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<input v-uppercase="true" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello')
			expect((input.element as HTMLInputElement).value).toBe('HELLO')
		})

		it('should not transform when binding value is false', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<input v-uppercase="false" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello')
			expect((input.element as HTMLInputElement).value).toBe('hello')
		})

		it('should update when options change', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<span v-uppercase="options">{{ text }}</span>`,
				data() {
					return {
						text: 'hello',
						options: { first: true },
					}
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').text()).toBe('Hello')

			// Change options to transform all characters
			await wrapper.setData({ options: { first: false } })
			expect(wrapper.find('span').text()).toBe('HELLO')
		})
	})

	describe('cleanup', () => {
		it('should cleanup on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { uppercase: vUppercase },
				template: `<input v-if="show" v-uppercase />`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('input').exists()).toBe(true)

			await wrapper.setData({ show: false })
			expect(wrapper.find('input').exists()).toBe(false)
		})
	})
})
