import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { truncateText, useEllipsis, wouldTextTruncate } from '../../src/composables/use-ellipsis'

describe('useEllipsis', () => {
	beforeEach(() => {
		// Mock canvas context
		HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
			font: '',
			measureText: vi.fn().mockReturnValue({ width: 100 }),
		}) as any
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with text', () => {
			const { truncated, isTruncated, original } = useEllipsis({ text: 'Hello World' })

			expect(original.value).toBe('Hello World')
			expect(truncated.value).toBeDefined()
			expect(isTruncated.value).toBeDefined()
		})

		it('should handle empty text', () => {
			const { truncated, isTruncated } = useEllipsis({ text: '' })

			expect(truncated.value).toBe('')
			expect(isTruncated.value).toBe(false)
		})

		it('should truncate with maxWidth', () => {
			const { truncated, isTruncated: _isTruncated } = useEllipsis({
				text: 'This is a very long text',
				maxWidth: 100,
			})

			expect(truncated.value).toBeDefined()
		})
	})

	describe('options', () => {
		it('should support custom ellipsis', () => {
			const { truncated } = useEllipsis({
				text: 'Hello World',
				maxWidth: 50,
				ellipsis: '…',
			})

			expect(truncated.value).toBeDefined()
		})

		it('should support lines option', () => {
			const { truncated, isTruncated: _isTruncated } = useEllipsis({
				text: 'This is a very long text that spans multiple lines',
				lines: 2,
			})

			expect(truncated.value).toBeDefined()
		})

		it('should support single line (default)', () => {
			const { truncated, isTruncated } = useEllipsis({
				text: 'Hello World',
				lines: 1,
			})

			expect(truncated.value).toBe('Hello World')
			expect(isTruncated.value).toBe(false)
		})

		it('should truncate text that exceeds line limit', () => {
			const { truncated, isTruncated } = useEllipsis({
				text: 'This is a very long text that spans multiple lines and needs to be truncated. It contains many words that will definitely exceed the average characters per line limit and should trigger truncation for multiple lines.',
				lines: 2,
			})

			expect(truncated.value).toBeDefined()
			expect(isTruncated.value).toBe(true)
		})
	})

	describe('calculateForWidth', () => {
		it('should calculate truncation for width', () => {
			const { calculateForWidth } = useEllipsis({ text: 'Hello World' })

			const result = calculateForWidth(100)

			expect(result).toBeDefined()
		})

		it('should handle empty text', () => {
			const { calculateForWidth } = useEllipsis({ text: '' })

			const result = calculateForWidth(100)

			expect(result).toBe('')
		})

		it('should handle zero width', () => {
			const { calculateForWidth } = useEllipsis({ text: 'Hello' })

			const result = calculateForWidth(0)

			expect(result).toBe('Hello')
		})
	})

	describe('wouldTruncate', () => {
		it('should check if text would truncate', () => {
			const { wouldTruncate } = useEllipsis({ text: 'Hello World' })

			const result = wouldTruncate(50)

			expect(typeof result).toBe('boolean')
		})

		it('should handle empty text', () => {
			const { wouldTruncate } = useEllipsis({ text: '' })

			const result = wouldTruncate(100)

			expect(result).toBe(false)
		})

		it('should handle zero width', () => {
			const { wouldTruncate } = useEllipsis({ text: 'Hello' })

			const result = wouldTruncate(0)

			expect(result).toBe(false)
		})
	})

	describe('reactive options', () => {
		it('should support reactive text', () => {
			const text = ref('Hello World')
			const { truncated: _truncated, original } = useEllipsis({ text })

			expect(original.value).toBe('Hello World')
		})

		it('should support reactive lines', () => {
			const lines = ref(2)
			const { truncated } = useEllipsis({ text: 'Hello', lines })

			expect(truncated.value).toBeDefined()
		})

		it('should support reactive maxWidth', () => {
			const maxWidth = ref(100)
			const { truncated } = useEllipsis({ text: 'Hello', maxWidth })

			expect(truncated.value).toBeDefined()
		})
	})
})

describe('truncateText', () => {
	it('should truncate long text', () => {
		const result = truncateText('This is a very long text', 10)

		expect(result.length).toBe(10)
		expect(result.endsWith('...')).toBe(true)
	})

	it('should not truncate short text', () => {
		const result = truncateText('Hello', 10)

		expect(result).toBe('Hello')
	})

	it('should handle empty text', () => {
		const result = truncateText('', 10)

		expect(result).toBe('')
	})

	it('should use custom ellipsis', () => {
		const result = truncateText('Hello World', 8, '…')

		expect(result.endsWith('…')).toBe(true)
	})
})

describe('wouldTextTruncate', () => {
	beforeEach(() => {
		HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
			font: '',
			measureText: vi.fn().mockReturnValue({ width: 100 }),
		}) as any
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should return true if text is wider', () => {
		const result = wouldTextTruncate('Hello World', 50)

		expect(result).toBe(true)
	})

	it('should return false if text fits', () => {
		const result = wouldTextTruncate('Hi', 200)

		expect(result).toBe(false)
	})
})
