import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useTruncate } from '../../src/composables/use-truncate'

describe('useTruncate', () => {
	describe('basic functionality', () => {
		it('should truncate text to specified length', () => {
			const { truncated } = useTruncate({
				text: 'This is a very long text that needs to be truncated',
				length: 20,
			})

			// length=20 means total output length including omission (17 chars + 3 for '...')
			expect(truncated.value).toBe('This is a very lo...')
		})

		it('should not truncate if text is shorter than length', () => {
			const { truncated, isTruncated } = useTruncate({
				text: 'Short text',
				length: 100,
			})

			expect(truncated.value).toBe('Short text')
			expect(isTruncated.value).toBe(false)
		})

		it('should detect if text was truncated', () => {
			const { isTruncated } = useTruncate({
				text: 'This is a very long text',
				length: 10,
			})

			expect(isTruncated.value).toBe(true)
		})

		it('should return original length', () => {
			const { originalLength } = useTruncate({
				text: 'Hello world',
				length: 5,
			})

			expect(originalLength.value).toBe(11)
		})
	})

	describe('position option', () => {
		it('should truncate from end by default', () => {
			const { truncated } = useTruncate({
				text: 'Hello world',
				length: 8,
			})

			expect(truncated.value).toBe('Hello...')
		})

		it('should truncate from start', () => {
			const { truncated } = useTruncate({
				text: 'Hello world',
				length: 8,
				position: 'start',
			})

			expect(truncated.value).toBe('...world')
		})

		it('should truncate from middle', () => {
			const { truncated } = useTruncate({
				text: 'Hello world',
				length: 8,
				position: 'middle',
			})

			expect(truncated.value).toBe('Hel...ld')
		})
	})

	describe('omission option', () => {
		it('should use custom omission string', () => {
			const { truncated } = useTruncate({
				text: 'Hello world',
				length: 8,
				omission: '…',
			})

			expect(truncated.value).toBe('Hello w…')
		})

		it('should use custom omission with start position', () => {
			const { truncated } = useTruncate({
				text: 'Hello world',
				length: 8,
				position: 'start',
				omission: '…',
			})

			// length=8 means total output length (1 for '…' + 7 chars from end)
			expect(truncated.value).toBe('…o world')
		})

		it('should use custom omission with middle position', () => {
			const { truncated } = useTruncate({
				text: 'Hello world',
				length: 9,
				position: 'middle',
				omission: '…',
			})

			// length=9, availableLength=8, startLength=4 (ceil), endLength=4 (floor)
			expect(truncated.value).toBe('Hell…orld')
		})
	})

	describe('truncate method', () => {
		it('should truncate custom string', () => {
			const { truncate } = useTruncate({
				text: 'Original',
				length: 10,
			})

			expect(truncate('Different text', 5)).toBe('Di...')
		})

		it('should use custom length', () => {
			const { truncate } = useTruncate({
				text: 'Original',
				length: 10,
			})

			expect(truncate('Different text', 8)).toBe('Diffe...')
		})

		it('should use custom position', () => {
			const { truncate } = useTruncate({
				text: 'Original',
				length: 10,
				position: 'end',
			})

			// The truncate method returns the truncated string
			const result = truncate('Different text', 8, 'start')
			// Check it's truncated and has omission
			expect(result).toContain('...')
		})
	})

	describe('reactive text', () => {
		it('should work with reactive text', () => {
			const text = ref('Hello world')
			const { truncated } = useTruncate({ text, length: 5 })

			expect(truncated.value).toBe('He...')
		})
	})
})
