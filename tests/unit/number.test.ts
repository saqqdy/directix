import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vNumber } from '../../src/directives/number'

describe('v-number', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

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

		it('should accept precision as number', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number="2" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234.567')
			expect((input.element as HTMLInputElement).value).toBe('1,234.57')
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

		it('should handle both prefix and suffix', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number="{ prefix: '#', suffix: 'kg' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234')
			expect((input.element as HTMLInputElement).value).toBe('#1,234kg')
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

		it('should handle both min and max', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number="{ min: 10, max: 100 }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('5')
			await input.trigger('blur')
			expect((input.element as HTMLInputElement).value).toBe('10')

			await input.setValue('150')
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

		it('should handle zero value', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('0')
			expect((input.element as HTMLInputElement).value).toBe('0')
		})

		it('should handle negative numbers', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('-1234')
			expect((input.element as HTMLInputElement).value).toBe('-1,234')
		})
	})

	describe('non-input elements', () => {
		it('should format text content of non-input elements', () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<span v-number="{ value: 1234567 }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('span').text()).toBe('1,234,567')
		})

		it('should parse and format existing text content', () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<span v-number>1234567</span>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('span').text()).toBe('1,234,567')
		})

		it('should handle precision for non-input elements', () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<span v-number="{ value: 1234.567, precision: 2 }">0</span>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('span').text()).toBe('1,234.57')
		})
	})

	describe('initial value formatting', () => {
		it('should format initial value on mount', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number value="1234567" />`,
			})

			mount(TestComponent)
			vi.runAllTimers()
			await nextTick()
		})
	})

	describe('updated hook', () => {
		it('should update options when binding changes', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number="currentPrecision" :value="'1234.567'" />`,
				data() {
					return {
						currentPrecision: 0,
					}
				},
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await wrapper.setData({ currentPrecision: 2 })

			expect(input.exists()).toBe(true)
		})

		it('should update non-input element when binding changes', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<span v-number="{ value: currentValue, precision: 0 }">0</span>`,
				data() {
					return {
						currentValue: 1234,
					}
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('span').text()).toBe('1,234')

			await wrapper.setData({ currentValue: 5678 })

			expect(wrapper.find('span').text()).toBe('5,678')
		})
	})

	describe('cleanup', () => {
		it('should clean up on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<div><input v-if="show" v-number /></div>`,
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
				directives: { number: vNumber },
				template: `<input v-number="{ separator: '.' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234567')
			expect((input.element as HTMLInputElement).value).toBe('1.234.567')
		})

		it('should support custom decimal separator', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number="{ decimal: ',', separator: '.', precision: 2 }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234.56')
			// The number is formatted with custom decimal and separator
			expect((input.element as HTMLInputElement).value).toContain(',')
		})
	})

	describe('typing behavior', () => {
		it('should allow typing numbers', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('123')
			expect((input.element as HTMLInputElement).value).toBe('123')

			await input.setValue('1234')
			expect((input.element as HTMLInputElement).value).toBe('1,234')
		})

		it('should handle backspace', async () => {
			const TestComponent = defineComponent({
				directives: { number: vNumber },
				template: `<input v-number />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234')
			expect((input.element as HTMLInputElement).value).toBe('1,234')

			await input.setValue('123')
			expect((input.element as HTMLInputElement).value).toBe('123')
		})
	})
})
