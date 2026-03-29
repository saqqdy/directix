import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { vTrim } from '../../src/directives/trim'

describe('v-trim', () => {
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
			expect((input.element as HTMLInputElement).value).toBe('  hello world  ')

			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('hello world')
		})
	})

	describe('position option', () => {
		it('should trim from start only', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim="{ position: 'start' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '  hello world  '
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('hello world  ')
		})

		it('should trim from end only', async () => {
			const TestComponent = defineComponent({
				directives: { trim: vTrim },
				template: `<input v-trim="{ position: 'end' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			;(input.element as HTMLInputElement).value = '  hello world  '
			await input.trigger('input')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('  hello world')
		})

		it('should trim from both (default)', async () => {
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
