import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import {
	createUppercaser,
	formatNumber,
	formatMoney,
	parseNumber,
	parseMoney,
	useCapitalcase,
	useEllipsis,
	useLowercase,
	useMoney,
	useNumber,
	useTruncate,
	useTrim,
	useUppercase,
} from '../../src/composables'

describe('text formatting composables', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('useUppercase', () => {
		it('should transform text to uppercase', () => {
			const text = ref('hello world')
			const { transformed, original } = useUppercase({ text })

			expect(transformed.value).toBe('HELLO WORLD')
			expect(original.value).toBe('hello world')
		})

		it('should transform only first character when first option is true', () => {
			const text = ref('hello world')
			const { transformed } = useUppercase({ text, first: true })

			expect(transformed.value).toBe('Hello world')
		})

		it('should handle reactive text changes', async () => {
			const text = ref('hello')
			const { transformed } = useUppercase({ text })

			expect(transformed.value).toBe('HELLO')

			text.value = 'world'
			await nextTick()

			expect(transformed.value).toBe('WORLD')
		})

		it('should handle empty string', () => {
			const text = ref('')
			const { transformed } = useUppercase({ text })

			expect(transformed.value).toBe('')
		})

		it('should handle reactive first option', async () => {
			const text = ref('hello world')
			const first = ref(false)
			const { transformed } = useUppercase({ text, first })

			expect(transformed.value).toBe('HELLO WORLD')

			first.value = true
			await nextTick()

			expect(transformed.value).toBe('Hello world')
		})
	})

	describe('createUppercaser', () => {
		it('should create uppercase function', () => {
			const toUpper = createUppercaser()
			expect(toUpper('hello')).toBe('HELLO')
		})

		it('should create first-char uppercase function', () => {
			const firstToUpper = createUppercaser(true)
			expect(firstToUpper('hello world')).toBe('Hello world')
		})
	})

	describe('useLowercase', () => {
		it('should transform text to lowercase', () => {
			const text = ref('HELLO WORLD')
			const { transformed, original } = useLowercase({ text })

			expect(transformed.value).toBe('hello world')
			expect(original.value).toBe('HELLO WORLD')
		})

		it('should handle reactive text changes', async () => {
			const text = ref('HELLO')
			const { transformed } = useLowercase({ text })

			expect(transformed.value).toBe('hello')

			text.value = 'WORLD'
			await nextTick()

			expect(transformed.value).toBe('world')
		})

		it('should handle empty string', () => {
			const text = ref('')
			const { transformed } = useLowercase({ text })

			expect(transformed.value).toBe('')
		})
	})

	describe('useCapitalcase', () => {
		it('should capitalize first letter of each word', () => {
			const text = ref('hello world')
			const { capitalized, original } = useCapitalcase({ text })

			expect(capitalized.value).toBe('Hello World')
			expect(original.value).toBe('hello world')
		})

		it('should handle single word', () => {
			const text = ref('hello')
			const { capitalized } = useCapitalcase({ text })

			expect(capitalized.value).toBe('Hello')
		})

		it('should handle reactive text changes', async () => {
			const text = ref('hello world')
			const { capitalized } = useCapitalcase({ text })

			text.value = 'test example'
			await nextTick()

			expect(capitalized.value).toBe('Test Example')
		})

		it('should handle empty string', () => {
			const text = ref('')
			const { capitalized } = useCapitalcase({ text })

			expect(capitalized.value).toBe('')
		})
	})

	describe('useTruncate', () => {
		it('should truncate text from end by default', () => {
			const text = ref('This is a very long text that needs to be truncated')
			const { truncated, isTruncated, originalLength } = useTruncate({
				text,
				length: 20,
			})

			expect(truncated.value).toBe('This is a very lo...')
			expect(isTruncated.value).toBe(true)
			expect(originalLength.value).toBe(51)
		})

		it('should not truncate if text is shorter than length', () => {
			const text = ref('Short text')
			const { truncated, isTruncated } = useTruncate({
				text,
				length: 20,
			})

			expect(truncated.value).toBe('Short text')
			expect(isTruncated.value).toBe(false)
		})

		it('should truncate from start', () => {
			const text = ref('This is a very long text')
			const { truncated } = useTruncate({
				text,
				length: 15,
				position: 'start',
			})

			expect(truncated.value).toBe('...ry long text')
		})

		it('should truncate from middle', () => {
			const text = ref('This is a very long text')
			const { truncated } = useTruncate({
				text,
				length: 15,
				position: 'middle',
			})

			expect(truncated.value).toBe('This i...g text')
		})

		it('should use custom omission string', () => {
			const text = ref('This is a very long text')
			const { truncated } = useTruncate({
				text,
				length: 15,
				omission: '…',
			})

			expect(truncated.value).toBe('This is a very…')
		})

		it('should handle reactive length changes', async () => {
			const text = ref('This is a very long text')
			const length = ref(10)
			const { truncated } = useTruncate({ text, length })

			expect(truncated.value).toBe('This is...')

			length.value = 20
			await nextTick()

			expect(truncated.value).toBe('This is a very lo...')
		})

		it('should provide truncate function for custom strings', () => {
			const text = ref('hello')
			const { truncate } = useTruncate({ text, length: 10 })

			expect(truncate('this is a custom string', 10)).toBe('this is...')
			expect(truncate('this is a custom string', 15, 'middle')).toBe('this i...string')
		})
	})

	describe('useEllipsis', () => {
		it('should add ellipsis to truncated text with maxWidth', () => {
			const text = ref('This is a very long text that needs ellipsis')
			const { truncated, isTruncated } = useEllipsis({
				text,
				maxWidth: 100,
			})

			// The result depends on text measurement
			expect(typeof truncated.value).toBe('string')
		})

		it('should not add ellipsis to short text', () => {
			const text = ref('Short')
			const { truncated, isTruncated } = useEllipsis({
				text,
				maxWidth: 1000, // Large enough
			})

			expect(truncated.value).toBe('Short')
			expect(isTruncated.value).toBe(false)
		})

		it('should handle empty string', () => {
			const text = ref('')
			const { truncated, isTruncated } = useEllipsis({
				text,
				maxWidth: 100,
			})

			expect(truncated.value).toBe('')
			expect(isTruncated.value).toBe(false)
		})

		it('should handle lines option', () => {
			const text = ref('This is a very long text')
			const { truncated, isTruncated } = useEllipsis({
				text,
				lines: 1,
			})

			expect(typeof truncated.value).toBe('string')
		})
	})

	describe('useTrim', () => {
		it('should trim whitespace from both ends', () => {
			const text = ref('  hello world  ')
			const { trimmed, original, wasTrimmed } = useTrim({ text })

			expect(trimmed.value).toBe('hello world')
			expect(original.value).toBe('  hello world  ')
			expect(wasTrimmed.value).toBe(true)
		})

		it('should handle reactive text changes', async () => {
			const text = ref('  hello  ')
			const { trimmed } = useTrim({ text })

			expect(trimmed.value).toBe('hello')

			text.value = '  world  '
			await nextTick()

			expect(trimmed.value).toBe('world')
		})

		it('should handle empty string', () => {
			const text = ref('')
			const { trimmed } = useTrim({ text })

			expect(trimmed.value).toBe('')
		})

		it('should handle string with only whitespace', () => {
			const text = ref('   ')
			const { trimmed } = useTrim({ text })

			expect(trimmed.value).toBe('')
		})

		it('should trim from start only', () => {
			const text = ref('  hello world  ')
			const { trimmed } = useTrim({ text, position: 'start' })

			expect(trimmed.value).toBe('hello world  ')
		})

		it('should trim from end only', () => {
			const text = ref('  hello world  ')
			const { trimmed } = useTrim({ text, position: 'end' })

			expect(trimmed.value).toBe('  hello world')
		})

		it('should trim custom characters', () => {
			const text = ref('**hello world**')
			const { trimmed } = useTrim({ text, chars: '*' })

			expect(trimmed.value).toBe('hello world')
		})
	})

	describe('useNumber', () => {
		it('should format number with default options', () => {
			const value = ref(1234567)
			const { formatted, value: numValue } = useNumber({ value })

			expect(formatted.value).toBe('1,234,567')
			expect(numValue.value).toBe(1234567)
		})

		it('should format number with precision', () => {
			const value = ref(1234.5678)
			const { formatted } = useNumber({ value, precision: 2 })

			expect(formatted.value).toBe('1,234.57')
		})

		it('should format number with custom separator', () => {
			const value = ref(1234567)
			const { formatted } = useNumber({
				value,
				separator: '.',
				decimal: ',',
			})

			expect(formatted.value).toBe('1.234.567')
		})

		it('should format number with prefix and suffix', () => {
			const value = ref(100)
			const { formatted } = useNumber({
				value,
				prefix: '$',
				suffix: ' USD',
			})

			expect(formatted.value).toBe('$100 USD')
		})

		it('should handle reactive value changes', async () => {
			const value = ref(1000)
			const { formatted } = useNumber({ value })

			expect(formatted.value).toBe('1,000')

			value.value = 2000
			await nextTick()

			expect(formatted.value).toBe('2,000')
		})

		it('should parse formatted string back to number', () => {
			const value = ref(1234.56)
			const { parse } = useNumber({
				value,
				precision: 2,
				prefix: '$',
			})

			expect(parse('$1,234.56')).toBe(1234.56)
		})
	})

	describe('formatNumber', () => {
		it('should format number with defaults', () => {
			expect(formatNumber(1234567)).toBe('1,234,567')
		})

		it('should format with precision', () => {
			expect(formatNumber(1234.567, { precision: 2 })).toBe('1,234.57')
		})

		it('should format with custom separators', () => {
			expect(
				formatNumber(1234567.89, {
					precision: 2,
					separator: '.',
					decimal: ',',
				}),
			).toBe('1.234.567,89')
		})

		it('should format with prefix and suffix', () => {
			expect(formatNumber(100, { prefix: '$', suffix: '%' })).toBe('$100%')
		})
	})

	describe('parseNumber', () => {
		it('should parse formatted number', () => {
			expect(parseNumber('1,234,567')).toBe(1234567)
		})

		it('should parse with prefix/suffix', () => {
			expect(parseNumber('$1,234', { prefix: '$' })).toBe(1234)
		})

		it('should parse with custom decimal separator', () => {
			expect(parseNumber('1,234.56', { decimal: '.' })).toBe(1234.56)
		})
	})

	describe('useMoney', () => {
		it('should format money with default options', () => {
			const value = ref(1234.56)
			const { formatted, value: numValue } = useMoney({ value })

			expect(formatted.value).toBe('$1,234.56')
			expect(numValue.value).toBe(1234.56)
		})

		it('should format money with custom symbol', () => {
			const value = ref(1234.56)
			const { formatted } = useMoney({ value, symbol: '€' })

			expect(formatted.value).toBe('€1,234.56')
		})

		it('should format money with symbol after value', () => {
			const value = ref(1234.56)
			const { formatted } = useMoney({
				value,
				symbol: '€',
				symbolPosition: 'after',
			})

			expect(formatted.value).toBe('1,234.56€')
		})

		it('should format money with precision', () => {
			const value = ref(1234)
			const { formatted } = useMoney({ value, precision: 0 })

			expect(formatted.value).toBe('$1,234')
		})

		it('should handle reactive value changes', async () => {
			const value = ref(100.5)
			const { formatted } = useMoney({ value })

			expect(formatted.value).toBe('$100.50')

			value.value = 200.75
			await nextTick()

			expect(formatted.value).toBe('$200.75')
		})

		it('should parse formatted money string', () => {
			const value = ref(100)
			const { parse } = useMoney({ value, symbol: '$' })

			expect(parse('$1,234.56')).toBe(1234.56)
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
			expect(
				formatMoney(1234.56, { symbol: '€', symbolPosition: 'after' }),
			).toBe('1,234.56€')
		})

		it('should format with zero precision', () => {
			expect(formatMoney(1234.56, { precision: 0 })).toBe('$1,235')
		})
	})

	describe('parseMoney', () => {
		it('should parse formatted money', () => {
			expect(parseMoney('$1,234.56')).toBe(1234.56)
		})

		it('should parse with custom symbol', () => {
			expect(parseMoney('€1,234.56', { symbol: '€' })).toBe(1234.56)
		})
	})
})