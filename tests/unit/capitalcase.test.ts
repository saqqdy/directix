import type { ObjectDirective } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { vCapitalcase } from '../../src/directives/capitalcase'

describe('v-capitalcase', () => {
	describe('directive definition', () => {
		it('should be defined', () => {
			expect(vCapitalcase).toBeDefined()
		})

		it('should have mounted hook', () => {
			expect((vCapitalcase as ObjectDirective).mounted).toBeDefined()
		})

		it('should have updated hook', () => {
			expect((vCapitalcase as ObjectDirective).updated).toBeDefined()
		})

		it('should have unmounted hook', () => {
			expect((vCapitalcase as ObjectDirective).unmounted).toBeDefined()
		})
	})

	describe('input elements', () => {
		it('should transform input value on input', async () => {
			const TestComponent = defineComponent({
				directives: { capitalcase: vCapitalcase },
				template: `<input v-capitalcase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello world')
			expect((input.element as HTMLInputElement).value).toBe('Hello World')
		})
	})

	describe('edge cases', () => {
		it('should handle empty string', async () => {
			const TestComponent = defineComponent({
				directives: { capitalcase: vCapitalcase },
				template: `<input v-capitalcase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('')
			expect((input.element as HTMLInputElement).value).toBe('')
		})

		it('should handle single word', async () => {
			const TestComponent = defineComponent({
				directives: { capitalcase: vCapitalcase },
				template: `<input v-capitalcase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello')
			expect((input.element as HTMLInputElement).value).toBe('Hello')
		})

		it('should handle mixed case input', async () => {
			const TestComponent = defineComponent({
				directives: { capitalcase: vCapitalcase },
				template: `<input v-capitalcase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hELLO wORLD')
			expect((input.element as HTMLInputElement).value).toBe('Hello World')
		})
	})
})

// Additional tests for improved coverage
describe('v-capitalcase additional coverage', () => {
	describe('non-input elements', () => {
		it('should transform text content in non-input elements', async () => {
			const TestComponent = defineComponent({
				directives: { capitalcase: vCapitalcase },
				template: `<span v-capitalcase>hello world</span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').text()).toBe('Hello World')
		})
	})

	describe('binding values', () => {
		it('should work with binding value true', async () => {
			const TestComponent = defineComponent({
				directives: { capitalcase: vCapitalcase },
				template: `<input v-capitalcase="true" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello world')
			expect((input.element as HTMLInputElement).value).toBe('Hello World')
		})

		it('should not transform when binding value is false', async () => {
			const TestComponent = defineComponent({
				directives: { capitalcase: vCapitalcase },
				template: `<input v-capitalcase="false" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello world')
			expect((input.element as HTMLInputElement).value).toBe('hello world')
		})

		it('should not transform when onInput is false', async () => {
			const TestComponent = defineComponent({
				directives: { capitalcase: vCapitalcase },
				template: `<input v-capitalcase="{ onInput: false }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello world')
			expect((input.element as HTMLInputElement).value).toBe('hello world')
		})
	})

	describe('cleanup', () => {
		it('should cleanup on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { capitalcase: vCapitalcase },
				template: `<input v-if="show" v-capitalcase />`,
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

	describe('special cases', () => {
		it('should normalize multiple spaces', async () => {
			const TestComponent = defineComponent({
				directives: { capitalcase: vCapitalcase },
				template: `<input v-capitalcase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello   world')
			// Multiple spaces are normalized to single space
			expect((input.element as HTMLInputElement).value).toBe('Hello World')
		})

		it('should handle special characters', async () => {
			const TestComponent = defineComponent({
				directives: { capitalcase: vCapitalcase },
				template: `<input v-capitalcase />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('hello-world\'s test')
			expect((input.element as HTMLInputElement).value).toBe('Hello-world\'s Test')
		})
	})
})
