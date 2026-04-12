import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { createLowercaser, lowercaseText, useLowercase } from '../../src/composables/use-lowercase'

describe('useLowercase', () => {
	describe('basic functionality', () => {
		it('should transform text to lowercase', () => {
			const { transformed } = useLowercase({
				text: 'HELLO WORLD',
			})

			expect(transformed.value).toBe('hello world')
		})

		it('should return original text', () => {
			const { original } = useLowercase({
				text: 'HELLO WORLD',
			})

			expect(original.value).toBe('HELLO WORLD')
		})

		it('should handle empty string', () => {
			const { transformed } = useLowercase({
				text: '',
			})

			expect(transformed.value).toBe('')
		})

		it('should handle already lowercase text', () => {
			const { transformed } = useLowercase({
				text: 'hello world',
			})

			expect(transformed.value).toBe('hello world')
		})
	})

	describe('first option', () => {
		it('should transform only first character when first is true', () => {
			const { transformed } = useLowercase({
				text: 'HELLO WORLD',
				first: true,
			})

			expect(transformed.value).toBe('hELLO WORLD')
		})

		it('should transform all characters when first is false', () => {
			const { transformed } = useLowercase({
				text: 'HELLO WORLD',
				first: false,
			})

			expect(transformed.value).toBe('hello world')
		})
	})

	describe('reactive text', () => {
		it('should work with reactive text', () => {
			const text = ref('HELLO')
			const { transformed } = useLowercase({ text })

			expect(transformed.value).toBe('hello')
		})
	})
})

describe('lowercaseText', () => {
	it('should transform text to lowercase', () => {
		expect(lowercaseText('HELLO WORLD')).toBe('hello world')
	})

	it('should transform only first character when firstOnly is true', () => {
		expect(lowercaseText('HELLO WORLD', true)).toBe('hELLO WORLD')
	})

	it('should handle empty string', () => {
		expect(lowercaseText('')).toBe('')
	})

	it('should handle mixed case', () => {
		expect(lowercaseText('HeLLo WoRLd')).toBe('hello world')
	})

	it('should handle numbers and special characters', () => {
		expect(lowercaseText('HELLO123!@#')).toBe('hello123!@#')
	})
})

describe('createLowercaser', () => {
	it('should create a lowercase function', () => {
		const lowercaser = createLowercaser()

		expect(lowercaser('HELLO')).toBe('hello')
	})

	it('should create first-only lowercaser', () => {
		const lowercaser = createLowercaser(true)

		expect(lowercaser('HELLO')).toBe('hELLO')
	})

	it('should create full lowercaser when first is false', () => {
		const lowercaser = createLowercaser(false)

		expect(lowercaser('HELLO')).toBe('hello')
	})
})
