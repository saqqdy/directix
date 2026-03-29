import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { vCapitalcase } from '../../src/directives/capitalcase'

describe('v-capitalcase', () => {
	describe('directive definition', () => {
		it('should be defined', () => {
			expect(vCapitalcase).toBeDefined()
		})

		it('should have correct name', () => {
			expect(vCapitalcase.name).toBe('capitalcase')
		})

		it('should support SSR', () => {
			expect(vCapitalcase.ssr).toBe(true)
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
