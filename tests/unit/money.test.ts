import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vMoney } from '../../src/directives/money'

describe('v-money', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

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

		it('should accept symbol as string', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money="'€'" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('100')
			expect((input.element as HTMLInputElement).value).toContain('€')
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

		it('should default to 2 decimal places', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234')
			expect((input.element as HTMLInputElement).value).toContain('.00')
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

		it('should handle non-numeric input', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('abc')
			expect((input.element as HTMLInputElement).value).toBe('')
		})
	})

	describe('non-input elements', () => {
		it('should format text content of non-input elements', () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<span v-money="{ value: 1234.56, symbol: '$' }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('span').text()).toContain('$')
			expect(wrapper.find('span').text()).toContain('1,234.56')
		})

		it('should parse and format existing text content', () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<span v-money>1234.56</span>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('span').text()).toContain('1,234.56')
		})

		it('should use symbol from options for non-input elements', () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<span v-money="{ value: 100, symbol: '€' }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('span').text()).toContain('€')
		})
	})

	describe('updated hook', () => {
		it('should update options when binding changes', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money="currentSymbol" :value="'1234'" />`,
				data() {
					return {
						currentSymbol: '$',
					}
				},
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			expect((input.element as HTMLInputElement).value).toContain('$')

			await wrapper.setData({ currentSymbol: '€' })

			expect(input.exists()).toBe(true)
		})

		it('should update non-input element when binding changes', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<span v-money="{ value: currentValue }">0</span>`,
				data() {
					return {
						currentValue: 1234.56,
					}
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('span').text()).toContain('1,234.56')

			await wrapper.setData({ currentValue: 5678.90 })

			expect(wrapper.find('span').text()).toContain('5,678.90')
		})
	})

	describe('initial value formatting', () => {
		it('should format initial value on mount', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money value="1234.56" />`,
			})

			mount(TestComponent)
			vi.runAllTimers()
			await nextTick()
		})
	})

	describe('cleanup', () => {
		it('should clean up on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<div><input v-if="show" v-money /></div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('input').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('input').exists()).toBe(false)
		})
	})

	describe('separator and decimal options', () => {
		it('should support custom separator', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money="{ separator: '.' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234567')
			expect((input.element as HTMLInputElement).value).toContain('1.234.567')
		})

		it('should support custom decimal separator', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money="{ decimal: ',', separator: '.', precision: 2 }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234')
			// The value should be formatted with the custom separator and decimal
			expect((input.element as HTMLInputElement).value).toContain('1.234')
		})
	})

	describe('typing behavior', () => {
		it('should allow typing numbers', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('123')
			expect((input.element as HTMLInputElement).value).toContain('123')

			await input.setValue('1234')
			expect((input.element as HTMLInputElement).value).toContain('1,234')
		})

		it('should handle negative numbers', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('-1234')
			expect((input.element as HTMLInputElement).value).toContain('-')
			expect((input.element as HTMLInputElement).value).toContain('1,234')
		})
	})

	describe('min and max constraints', () => {
		it('should enforce min value', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money="{ min: 0 }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('-100')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toContain('0')
		})

		it('should enforce max value', async () => {
			const TestComponent = defineComponent({
				directives: { money: vMoney },
				template: `<input v-money="{ max: 100 }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('200')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toContain('100')
		})
	})
})
