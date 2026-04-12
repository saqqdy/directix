import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { createMoneyFormatter, formatMoney, parseMoney, useMoney } from '../../src/composables/use-money'

describe('useMoney', () => {
	describe('basic functionality', () => {
		it('should format value as money', () => {
			const { formatted } = useMoney({ value: 1234.56 })

			expect(formatted.value).toBe('$1,234.56')
		})

		it('should handle zero', () => {
			const { formatted } = useMoney({ value: 0 })

			expect(formatted.value).toBe('$0.00')
		})

		it('should handle negative values', () => {
			const { formatted } = useMoney({ value: -1234.56 })

			expect(formatted.value).toBe('$-1,234.56')
		})

		it('should handle large numbers', () => {
			const { formatted } = useMoney({ value: 1234567890.12 })

			expect(formatted.value).toBe('$1,234,567,890.12')
		})
	})

	describe('symbol option', () => {
		it('should use custom symbol', () => {
			const { formatted } = useMoney({ value: 1234.56, symbol: '€' })

			expect(formatted.value).toBe('€1,234.56')
		})

		it('should support symbol position after', () => {
			const { formatted } = useMoney({
				value: 1234.56,
				symbol: '€',
				symbolPosition: 'after',
			})

			expect(formatted.value).toBe('1,234.56€')
		})
	})

	describe('precision option', () => {
		it('should use custom precision', () => {
			const { formatted } = useMoney({ value: 1234.567, precision: 3 })

			expect(formatted.value).toBe('$1,234.567')
		})

		it('should handle zero precision', () => {
			const { formatted } = useMoney({ value: 1234.56, precision: 0 })

			expect(formatted.value).toBe('$1,235')
		})
	})

	describe('separator options', () => {
		it('should use custom thousands separator', () => {
			const { formatted } = useMoney({ value: 1234.56, separator: '.' })

			expect(formatted.value).toBe('$1.234.56')
		})

		it('should use custom decimal separator', () => {
			const { formatted } = useMoney({
				value: 1234.56,
				decimal: ',',
				separator: '.',
			})

			expect(formatted.value).toBe('$1.234,56')
		})
	})

	describe('reactive value', () => {
		it('should work with reactive value', () => {
			const value = ref(1234.56)
			const { formatted } = useMoney({ value })

			expect(formatted.value).toBe('$1,234.56')
		})
	})

	describe('parse', () => {
		it('should parse formatted string to number', () => {
			const { parse } = useMoney({ value: 0 })

			expect(parse('$1,234.56')).toBe(1234.56)
		})
	})
})

describe('formatMoney', () => {
	it('should format money with defaults', () => {
		expect(formatMoney(1234.56)).toBe('$1,234.56')
	})

	it('should format with custom symbol', () => {
		expect(formatMoney(1234.56, { symbol: '€' })).toBe('€1,234.56')
	})

	it('should format with symbol after', () => {
		expect(formatMoney(1234.56, { symbol: '€', symbolPosition: 'after' })).toBe('1,234.56€')
	})

	it('should format with custom precision', () => {
		expect(formatMoney(1234.567, { precision: 3 })).toBe('$1,234.567')
	})
})

describe('parseMoney', () => {
	it('should parse formatted string', () => {
		expect(parseMoney('$1,234.56')).toBe(1234.56)
	})

	it('should parse with custom symbol', () => {
		expect(parseMoney('€1,234.56', { symbol: '€' })).toBe(1234.56)
	})

	it('should handle empty string', () => {
		expect(parseMoney('')).toBe(0)
	})
})

describe('createMoneyFormatter', () => {
	it('should create a formatter with preset options', () => {
		const formatEuro = createMoneyFormatter({ symbol: '€', symbolPosition: 'after' })

		expect(formatEuro(1234.56)).toBe('1,234.56€')
	})

	it('should create a formatter with custom precision', () => {
		const formatYen = createMoneyFormatter({ symbol: '¥', precision: 0 })

		expect(formatYen(1234.56)).toBe('¥1,235')
	})
})
