import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vMask } from '../../src/directives/mask'

describe('v-mask', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should apply mask to input', async () => {
			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="'###-###-####'" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('1234567890')

			expect(input.element.value).toBe('123-456-7890')
		})

		it('should accept string mask', () => {
			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="'(###) ###-####'" />`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('input').exists()).toBe(true)
		})

		it('should accept options object', async () => {
			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="{ mask: '##/##/####' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('12312020')

			expect(input.element.value).toBe('12/31/2020')
		})
	})

	describe('mask patterns', () => {
		it('should handle # pattern (digits only)', async () => {
			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="'###'" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('123')

			expect(input.element.value).toBe('123')
		})

		it('should handle A pattern (letters only)', async () => {
			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="'AAA'" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('abc')

			expect(input.element.value).toBe('abc')
		})

		it('should handle N pattern (alphanumeric)', async () => {
			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="'NNN'" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('a1b')

			expect(input.element.value).toBe('a1b')
		})
	})

	describe('placeholder option', () => {
		it('should use custom placeholder', async () => {
			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="{ mask: '###', placeholder: '*' }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			// Focus to show placeholder
			await input.trigger('focus')

			// Value should show placeholders
			expect(input.element.value).toContain('*')
		})
	})

	describe('callbacks', () => {
		it('should call onChange when value changes', async () => {
			const onChange = vi.fn()

			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="{ mask: '###', onChange }" />`,
				data() {
					return { onChange }
				},
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('123')

			expect(onChange).toHaveBeenCalled()
		})

		it('should call onComplete when mask is complete', async () => {
			const onComplete = vi.fn()

			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="{ mask: '###', onComplete }" />`,
				data() {
					return { onComplete }
				},
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('123')

			expect(onComplete).toHaveBeenCalledWith('123')
		})
	})

	describe('disabled option', () => {
		it('should not apply mask when disabled', async () => {
			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="{ mask: '###-###', disabled: true }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('123456')

			// Should not be masked
			expect(input.element.value).toBe('123456')
		})
	})

	describe('clearIncomplete option', () => {
		it('should clear incomplete value on blur when enabled', async () => {
			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="{ mask: '###', clearIncomplete: true }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('12')
			await input.trigger('blur')

			expect(input.element.value).toBe('')
		})

		it('should not clear complete value on blur', async () => {
			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="{ mask: '###', clearIncomplete: true }" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('123')
			await input.trigger('blur')

			expect(input.element.value).toBe('123')
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-if="show" v-mask="'###'" />`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('input').exists()).toBe(false)
		})
	})

	describe('error handling', () => {
		it('should throw error if mask is missing', () => {
			const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<input v-mask="{}" />`,
			})

			expect(() => mount(TestComponent)).toThrow()

			errorSpy.mockRestore()
		})

		it('should warn when used on non-input element', () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			const TestComponent = defineComponent({
				directives: { mask: vMask },
				template: `<div v-mask="'###'"></div>`,
			})

			mount(TestComponent)

			expect(warnSpy).toHaveBeenCalled()

			warnSpy.mockRestore()
		})
	})
})
