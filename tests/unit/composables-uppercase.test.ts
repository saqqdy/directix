import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { createUppercaser, uppercaseText, useUppercase } from '../../src/composables/use-uppercase'

describe('useUppercase', () => {
	describe('basic functionality', () => {
		it('should transform text to uppercase', () => {
			const { transformed } = useUppercase({
				text: 'hello world',
			})

			expect(transformed.value).toBe('HELLO WORLD')
		})

		it('should return original text', () => {
			const { original } = useUppercase({
				text: 'hello world',
			})

			expect(original.value).toBe('hello world')
		})

		it('should handle empty string', () => {
			const { transformed } = useUppercase({
				text: '',
			})

			expect(transformed.value).toBe('')
		})

		it('should handle already uppercase text', () => {
			const { transformed } = useUppercase({
				text: 'HELLO WORLD',
			})

			expect(transformed.value).toBe('HELLO WORLD')
		})
	})

	describe('first option', () => {
		it('should transform only first character when first is true', () => {
			const { transformed } = useUppercase({
				text: 'hello world',
				first: true,
			})

			expect(transformed.value).toBe('Hello world')
		})

		it('should transform all characters when first is false', () => {
			const { transformed } = useUppercase({
				text: 'hello world',
				first: false,
			})

			expect(transformed.value).toBe('HELLO WORLD')
		})
	})

	describe('reactive text', () => {
		it('should work with reactive text', () => {
			const text = ref('hello')
			const { transformed } = useUppercase({ text })

			expect(transformed.value).toBe('HELLO')
		})
	})
})

describe('uppercaseText', () => {
	it('should transform text to uppercase', () => {
		expect(uppercaseText('hello world')).toBe('HELLO WORLD')
	})

	it('should transform only first character when firstOnly is true', () => {
		expect(uppercaseText('hello world', true)).toBe('Hello world')
	})

	it('should handle empty string', () => {
		expect(uppercaseText('')).toBe('')
	})

	it('should handle mixed case', () => {
		expect(uppercaseText('HeLLo WoRLd')).toBe('HELLO WORLD')
	})

	it('should handle numbers and special characters', () => {
		expect(uppercaseText('hello123!@#')).toBe('HELLO123!@#')
	})
})

describe('createUppercaser', () => {
	it('should create an uppercase function', () => {
		const uppercaser = createUppercaser()

		expect(uppercaser('hello')).toBe('HELLO')
	})

	it('should create first-only uppercaser', () => {
		const uppercaser = createUppercaser(true)

		expect(uppercaser('hello')).toBe('Hello')
	})

	it('should create full uppercaser when first is false', () => {
		const uppercaser = createUppercaser(false)

		expect(uppercaser('hello')).toBe('HELLO')
	})
})
