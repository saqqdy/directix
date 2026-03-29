import type { ObjectDirective } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { vLowercase } from '../../src/directives/lowercase'

describe('v-lowercase', () => {
	describe('directive definition', () => {
		it('should be defined', () => {
			expect(vLowercase).toBeDefined()
		})

		it('should have mounted hook', () => {
			expect((vLowercase as ObjectDirective).mounted).toBeDefined()
		})

		it('should have updated hook', () => {
			expect((vLowercase as ObjectDirective).updated).toBeDefined()
		})

		it('should have unmounted hook', () => {
			expect((vLowercase as ObjectDirective).unmounted).toBeDefined()
		})
	})

	describe('input elements', () => {
		it('should transform input value on input', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<input v-lowercase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('HELLO')
			expect((input.element as HTMLInputElement).value).toBe('hello')
		})

		it('should transform on subsequent input', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<input v-lowercase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('HELLO')
			expect((input.element as HTMLInputElement).value).toBe('hello')

			await input.setValue('WORLD')
			expect((input.element as HTMLInputElement).value).toBe('world')
		})
	})

	describe('first option', () => {
		it('should only lowercase first character when first is true', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<input v-lowercase="{ first: true }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('HELLO WORLD')
			expect((input.element as HTMLInputElement).value).toBe('hELLO WORLD')
		})
	})

	describe('edge cases', () => {
		it('should handle empty string in input', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<input v-lowercase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('')
			expect((input.element as HTMLInputElement).value).toBe('')
		})

		it('should handle numbers in string', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<input v-lowercase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('HELLO123WORLD')
			expect((input.element as HTMLInputElement).value).toBe('hello123world')
		})

		it('should handle already lowercase text', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<input v-lowercase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello world')
			expect((input.element as HTMLInputElement).value).toBe('hello world')
		})
	})
})
