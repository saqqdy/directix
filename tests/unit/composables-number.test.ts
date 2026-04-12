import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { createNumberFormatter, formatNumber, parseNumber, useNumber } from '../../src/composables/use-number'

describe('useNumber', () => {
	describe('basic functionality', () => {
		it('should format value as number', () => {
			const { formatted } = useNumber({ value: 1234567 })

			expect(formatted.value).toBe('1,234,567')
		})

		it('should handle zero', () => {
			const { formatted } = useNumber({ value: 0 })

			expect(formatted.value).toBe('0')
		})

		it('should handle negative values', () => {
			const { formatted } = useNumber({ value: -1234567 })

			expect(formatted.value).toBe('-1,234,567')
		})
	})

	describe('precision option', () => {
		it('should use custom precision', () => {
			const { formatted } = useNumber({ value: 1234.567, precision: 2 })

			expect(formatted.value).toBe('1,234.57')
		})

		it('should handle zero precision', () => {
			const { formatted } = useNumber({ value: 1234.56, precision: 0 })

			expect(formatted.value).toBe('1,235')
		})
	})

	describe('separator options', () => {
		it('should use custom thousands separator', () => {
			const { formatted } = useNumber({ value: 1234, separator: '.' })

			expect(formatted.value).toBe('1.234')
		})

		it('should use custom decimal separator', () => {
			const { formatted } = useNumber({
				value: 1234.56,
				precision: 2,
				decimal: ',',
				separator: '.',
			})

			expect(formatted.value).toBe('1.234,56')
		})
	})

	describe('prefix and suffix', () => {
		it('should add prefix', () => {
			const { formatted } = useNumber({ value: 100, prefix: '$' })

			expect(formatted.value).toBe('$100')
		})

		it('should add suffix', () => {
			const { formatted } = useNumber({ value: 85, suffix: '%' })

			expect(formatted.value).toBe('85%')
		})

		it('should add both prefix and suffix', () => {
			const { formatted } = useNumber({ value: 100, prefix: '$', suffix: ' USD' })

			expect(formatted.value).toBe('$100 USD')
		})
	})

	describe('reactive value', () => {
		it('should work with reactive value', () => {
			const value = ref(1234)
			const { formatted } = useNumber({ value })

			expect(formatted.value).toBe('1,234')
		})
	})

	describe('parse', () => {
		it('should parse formatted string to number', () => {
			const { parse } = useNumber({ value: 0 })

			expect(parse('1,234.56')).toBe(1234.56)
		})

		it('should parse with prefix and suffix', () => {
			const { parse } = useNumber({ value: 0, prefix: '$', suffix: ' USD' })

			expect(parse('$1,234 USD')).toBe(1234)
		})
	})
})

describe('formatNumber', () => {
	it('should format number with defaults', () => {
		expect(formatNumber(1234567)).toBe('1,234,567')
	})

	it('should format with precision', () => {
		expect(formatNumber(1234.567, { precision: 2 })).toBe('1,234.57')
	})

	it('should format with prefix', () => {
		expect(formatNumber(100, { prefix: '$' })).toBe('$100')
	})

	it('should format with suffix', () => {
		expect(formatNumber(85, { suffix: '%' })).toBe('85%')
	})
})

describe('parseNumber', () => {
	it('should parse formatted string', () => {
		expect(parseNumber('1,234.56')).toBe(1234.56)
	})

	it('should parse with prefix and suffix', () => {
		expect(parseNumber('$1,234 USD', { prefix: '$', suffix: ' USD' })).toBe(1234)
	})

	it('should handle empty string', () => {
		expect(parseNumber('')).toBe(0)
	})
})

describe('createNumberFormatter', () => {
	it('should create a formatter with preset options', () => {
		const formatPercent = createNumberFormatter({ suffix: '%', precision: 1 })

		// 85.55 rounded to 1 decimal is 85.5 or 85.6 depending on rounding
		const result = formatPercent(85.55)
		expect(result).toMatch(/85\.[56]%/)
	})

	it('should create a formatter with prefix', () => {
		const formatDollar = createNumberFormatter({ prefix: '$', precision: 2 })

		expect(formatDollar(1234.5)).toBe('$1,234.50')
	})
})
