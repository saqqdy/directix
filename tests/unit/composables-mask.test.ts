import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useMask } from '../../src/composables/use-mask'

describe('useMask', () => {
	let element: HTMLInputElement

	beforeEach(() => {
		element = document.createElement('input')
		document.body.appendChild(element)
	})

	afterEach(() => {
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('getFormattedValue', () => {
		it('should format value according to mask', () => {
			const { getFormattedValue } = useMask({ mask: '###-##-####' })

			expect(getFormattedValue('123456789')).toBe('123-45-6789')
		})

		it('should handle partial values', () => {
			const { getFormattedValue } = useMask({ mask: '###-##-####' })

			const result = getFormattedValue('12345')
			// Should contain the formatted part and placeholder
			expect(result).toContain('123-45')
		})

		it('should handle literal characters in mask', () => {
			const { getFormattedValue } = useMask({ mask: '(###) ###-####' })

			expect(getFormattedValue('1234567890')).toBe('(123) 456-7890')
		})

		it('should use custom placeholder', () => {
			const { getFormattedValue } = useMask({ mask: '###-##-####', placeholder: '*' })

			const result = getFormattedValue('12345')
			expect(result).toContain('123-45')
		})
	})

	describe('getRawValue', () => {
		it('should extract raw value from formatted string', () => {
			const { getRawValue } = useMask({ mask: '###-##-####' })

			expect(getRawValue('123-45-6789')).toBe('123456789')
		})

		it('should handle partial values', () => {
			const { getRawValue } = useMask({ mask: '###-##-####' })

			expect(getRawValue('123-45-____')).toBe('12345')
		})
	})

	describe('isComplete', () => {
		it('should return true for complete mask', () => {
			const { isComplete } = useMask({ mask: '###-##-####' })

			expect(isComplete('123-45-6789')).toBe(true)
		})

		it('should return false for incomplete mask', () => {
			const { isComplete } = useMask({ mask: '###-##-####' })

			expect(isComplete('123-45-____')).toBe(false)
		})
	})

	describe('bind', () => {
		it('should bind to input element', () => {
			const { bind } = useMask({ mask: '###-##-####' })

			bind(element)

			element.value = '123456789'
			element.dispatchEvent(new Event('input'))

			expect(element.value).toBe('123-45-6789')
		})

		it('should return unbind function', () => {
			const { bind } = useMask({ mask: '###-##-####' })

			const unbind = bind(element)

			element.value = '123456789'
			element.dispatchEvent(new Event('input'))
			expect(element.value).toBe('123-45-6789')

			unbind()

			element.value = '987654321'
			element.dispatchEvent(new Event('input'))
			expect(element.value).toBe('987654321')
		})

		it('should format initial value', () => {
			element.value = '123456789'

			const { bind } = useMask({ mask: '###-##-####' })
			bind(element)

			expect(element.value).toBe('123-45-6789')
		})

		it('should show placeholder on focus', () => {
			const { bind } = useMask({ mask: '###-##-####', showPlaceholder: true })

			bind(element)

			element.dispatchEvent(new Event('focus'))

			// Should have placeholder format
			expect(element.value).toMatch(/\d{3}-\d{2}-\d{4}|___-__-_{4}/)
		})
	})

	describe('callbacks', () => {
		it('should call onChange callback', () => {
			const onChange = vi.fn()
			const { bind } = useMask({ mask: '###-##-####', onChange })

			bind(element)

			element.value = '123456789'
			element.dispatchEvent(new Event('input'))

			expect(onChange).toHaveBeenCalledWith('123-45-6789', '123456789')
		})

		it('should call onComplete callback', () => {
			const onComplete = vi.fn()
			const { bind } = useMask({ mask: '###-##-####', onComplete })

			bind(element)

			element.value = '123456789'
			element.dispatchEvent(new Event('input'))

			expect(onComplete).toHaveBeenCalledWith('123-45-6789')
		})
	})

	describe('reactive mask', () => {
		it('should support reactive mask', () => {
			const mask = ref('###-##-####')
			const { getFormattedValue } = useMask({ mask })

			expect(getFormattedValue('123456789')).toBe('123-45-6789')

			mask.value = '(###) ###-####'

			expect(getFormattedValue('1234567890')).toBe('(123) 456-7890')
		})
	})
})
