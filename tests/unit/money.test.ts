import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { vMoney } from '../../src/directives/money'

describe('v-money', () => {
	describe('basic functionality', () => {
		it('should format currency with default symbol', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234.56')
			expect((input.element as HTMLInputElement).value).toContain('1,234.56')
		})

		it('should format with custom symbol', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money="{ symbol: '¥' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234')
			expect((input.element as HTMLInputElement).value).toContain('¥')
			expect((input.element as HTMLInputElement).value).toContain('1,234')
		})
	})

	describe('symbol position', () => {
		it('should place symbol before value (default)', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money="{ symbol: '$' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('100')
			expect((input.element as HTMLInputElement).value).toMatch(/^\$/)
		})

		it('should place symbol after value', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money="{ symbol: '€', symbolPosition: 'after' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('100')
			expect((input.element as HTMLInputElement).value).toMatch(/€$/)
		})
	})

	describe('precision', () => {
		it('should respect precision option', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money="{ precision: 0 }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234.56')
			expect((input.element as HTMLInputElement).value).not.toContain('.')
		})
	})

	describe('edge cases', () => {
		it('should handle empty string', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('')
			expect((input.element as HTMLInputElement).value).toBe('')
		})

		it('should handle zero value', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('0')
			expect((input.element as HTMLInputElement).value).toContain('0')
		})

		it('should handle large numbers', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234567890.12')
			expect((input.element as HTMLInputElement).value).toContain('1,234,567,890')
		})
	})
})
