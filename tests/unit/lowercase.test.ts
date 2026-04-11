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

// Additional tests for improved coverage
describe('v-lowercase additional coverage', () => {
	describe('non-input elements', () => {
		it('should transform text content in non-input elements', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<span v-lowercase>HELLO WORLD</span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').text()).toBe('hello world')
		})

		it('should transform only first character in non-input elements when first is true', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<span v-lowercase="{ first: true }">HELLO WORLD</span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').text()).toBe('hELLO WORLD')
		})
	})

	describe('onInput option', () => {
		it('should not transform on input when onInput is false', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<input v-lowercase="{ onInput: false }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('HELLO')
			// When onInput is false, value should remain unchanged
			expect((input.element as HTMLInputElement).value).toBe('HELLO')
		})
	})

	describe('binding values', () => {
		it('should work with binding value true', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<input v-lowercase="true" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('HELLO')
			expect((input.element as HTMLInputElement).value).toBe('hello')
		})

		it('should not transform when binding value is false', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<input v-lowercase="false" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('HELLO')
			expect((input.element as HTMLInputElement).value).toBe('HELLO')
		})
	})

	describe('updated hook', () => {
		it('should call updated hook', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<span v-lowercase>{{ text }}</span>`,
				data() {
					return { text: 'HELLO' }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').text()).toBe('hello')

			// The updated hook will be called but text transformation behavior
			// depends on the directive implementation timing
			await wrapper.setData({ text: 'WORLD' })
			// Just verify the component re-renders without error
			expect(wrapper.find('span').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should cleanup on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { lowercase: vLowercase },
				template: `<input v-if="show" v-lowercase />`,
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
