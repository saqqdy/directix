import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { capitalizeText, capitalizeWord, createCapitalizer, useCapitalcase } from '../../src/composables/use-capitalcase'

describe('useCapitalcase', () => {
	describe('basic functionality', () => {
		it('should capitalize text', () => {
			const { capitalized } = useCapitalcase({
				text: 'hello world',
			})

			expect(capitalized.value).toBe('Hello World')
		})

		it('should return original text', () => {
			const { original } = useCapitalcase({
				text: 'hello world',
			})

			expect(original.value).toBe('hello world')
		})

		it('should handle empty string', () => {
			const { capitalized } = useCapitalcase({
				text: '',
			})

			expect(capitalized.value).toBe('')
		})
	})

	describe('every option', () => {
		it('should capitalize each word when every is true', () => {
			const { capitalized } = useCapitalcase({
				text: 'the quick brown fox',
				every: true,
			})

			expect(capitalized.value).toBe('The Quick Brown Fox')
		})

		it('should capitalize only first word when every is false', () => {
			const { capitalized } = useCapitalcase({
				text: 'the quick brown fox',
				every: false,
			})

			expect(capitalized.value).toBe('The quick brown fox')
		})
	})

	describe('keepLower option', () => {
		it('should keep specified words lowercase', () => {
			const { capitalized } = useCapitalcase({
				text: 'the cat and the mouse',
				every: true,
				keepLower: ['the', 'and'],
			})

			expect(capitalized.value).toBe('The Cat and the Mouse')
		})

		it('should always capitalize first word regardless of keepLower', () => {
			const { capitalized } = useCapitalcase({
				text: 'the quick brown fox',
				every: true,
				keepLower: ['the'],
			})

			expect(capitalized.value).toBe('The Quick Brown Fox')
		})
	})

	describe('reactive text', () => {
		it('should work with reactive text', () => {
			const text = ref('hello world')
			const { capitalized } = useCapitalcase({ text })

			expect(capitalized.value).toBe('Hello World')
		})
	})
})

describe('capitalizeWord', () => {
	it('should capitalize a single word', () => {
		expect(capitalizeWord('hello')).toBe('Hello')
	})

	it('should handle already capitalized word', () => {
		expect(capitalizeWord('Hello')).toBe('Hello')
	})

	it('should lowercase rest of the word', () => {
		expect(capitalizeWord('hELLO')).toBe('Hello')
	})

	it('should handle empty string', () => {
		expect(capitalizeWord('')).toBe('')
	})
})

describe('capitalizeText', () => {
	it('should capitalize each word by default', () => {
		expect(capitalizeText('hello world')).toBe('Hello World')
	})

	it('should capitalize only first word when every is false', () => {
		expect(capitalizeText('hello world', { every: false })).toBe('Hello world')
	})

	it('should handle special characters', () => {
		expect(capitalizeText('hello-world')).toBe('Hello-world')
	})
})

describe('createCapitalizer', () => {
	it('should create a capitalizer function', () => {
		const capitalizer = createCapitalizer({ every: true })

		expect(capitalizer('hello world')).toBe('Hello World')
	})

	it('should create a sentence capitalizer', () => {
		const capitalizer = createCapitalizer({ every: false })

		expect(capitalizer('hello world')).toBe('Hello world')
	})

	it('should respect keepLower option', () => {
		const capitalizer = createCapitalizer({
			every: true,
			keepLower: ['and', 'or'],
		})

		expect(capitalizer('cats and dogs or birds')).toBe('Cats and Dogs or Birds')
	})
})
