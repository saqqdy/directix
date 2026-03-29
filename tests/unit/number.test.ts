import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { vNumber } from '../../src/directives/number'

describe('v-number', () => {
	describe('basic functionality', () => {
		it('should format number with thousands separator', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234567')
			expect((input.element as HTMLInputElement).value).toBe('1,234,567')
		})

		it('should handle decimal numbers', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number="{ precision: 2 }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234.567')
			expect((input.element as HTMLInputElement).value).toBe('1,234.57')
		})
	})

	describe('precision option', () => {
		it('should respect precision option', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number="{ precision: 0 }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234.56')
			expect((input.element as HTMLInputElement).value).toBe('1,235')
		})
	})

	describe('prefix and suffix', () => {
		it('should add prefix', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number="{ prefix: '#' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234')
			expect((input.element as HTMLInputElement).value).toBe('#1,234')
		})

		it('should add suffix', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number="{ suffix: 'kg' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234')
			expect((input.element as HTMLInputElement).value).toBe('1,234kg')
		})
	})

	describe('min and max', () => {
		it('should enforce min value', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number="{ min: 0 }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('-100')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('0')
		})

		it('should enforce max value', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number="{ max: 100 }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('200')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('100')
		})
	})

	describe('edge cases', () => {
		it('should handle empty string', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('')
			expect((input.element as HTMLInputElement).value).toBe('')
		})

		it('should handle non-numeric input', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('abc')
			expect((input.element as HTMLInputElement).value).toBe('')
		})
	})
})
