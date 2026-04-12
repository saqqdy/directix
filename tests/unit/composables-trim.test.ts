import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { createTrimmer, trimText, useTrim } from '../../src/composables/use-trim'

describe('useTrim', () => {
	describe('basic functionality', () => {
		it('should trim whitespace from both ends by default', () => {
			const { trimmed } = useTrim({
				text: '  hello world  ',
			})

			expect(trimmed.value).toBe('hello world')
		})

		it('should return original text', () => {
			const { original } = useTrim({
				text: '  hello world  ',
			})

			expect(original.value).toBe('  hello world  ')
		})

		it('should detect if text was trimmed', () => {
			const { wasTrimmed } = useTrim({
				text: '  hello  ',
			})

			expect(wasTrimmed.value).toBe(true)
		})

		it('should detect if text was not trimmed', () => {
			const { wasTrimmed } = useTrim({
				text: 'hello',
			})

			expect(wasTrimmed.value).toBe(false)
		})

		it('should handle empty string', () => {
			const { trimmed } = useTrim({
				text: '',
			})

			expect(trimmed.value).toBe('')
		})
	})

	describe('position option', () => {
		it('should trim from start only', () => {
			const { trimmed } = useTrim({
				text: '  hello world  ',
				position: 'start',
			})

			expect(trimmed.value).toBe('hello world  ')
		})

		it('should trim from end only', () => {
			const { trimmed } = useTrim({
				text: '  hello world  ',
				position: 'end',
			})

			expect(trimmed.value).toBe('  hello world')
		})

		it('should trim from both ends', () => {
			const { trimmed } = useTrim({
				text: '  hello world  ',
				position: 'both',
			})

			expect(trimmed.value).toBe('hello world')
		})
	})

	describe('chars option', () => {
		it('should trim custom characters', () => {
			const { trimmed } = useTrim({
				text: '**hello**',
				chars: '*',
			})

			expect(trimmed.value).toBe('hello')
		})

		it('should trim whitespace and custom characters', () => {
			const { trimmed } = useTrim({
				text: ' **hello** ',
				chars: '*',
			})

			expect(trimmed.value).toBe('hello')
		})

		it('should trim multiple custom characters', () => {
			const { trimmed } = useTrim({
				text: '##hello##',
				chars: '#',
			})

			expect(trimmed.value).toBe('hello')
		})
	})

	describe('reactive text', () => {
		it('should work with reactive text', () => {
			const text = ref('  hello  ')
			const { trimmed } = useTrim({ text })

			expect(trimmed.value).toBe('hello')
		})
	})
})

describe('trimText', () => {
	it('should trim from both ends by default', () => {
		expect(trimText('  hello  ')).toBe('hello')
	})

	it('should trim from start', () => {
		expect(trimText('  hello  ', 'start')).toBe('hello  ')
	})

	it('should trim from end', () => {
		expect(trimText('  hello  ', 'end')).toBe('  hello')
	})

	it('should trim custom characters', () => {
		expect(trimText('**hello**', 'both', '*')).toBe('hello')
	})

	it('should handle empty string', () => {
		expect(trimText('')).toBe('')
	})

	it('should handle string with no trimming needed', () => {
		expect(trimText('hello')).toBe('hello')
	})

	it('should handle special regex characters', () => {
		expect(trimText('.hello.', 'both', '.')).toBe('hello')
	})
})

describe('createTrimmer', () => {
	it('should create a trimmer function', () => {
		const trimmer = createTrimmer('both')

		expect(trimmer('  hello  ')).toBe('hello')
	})

	it('should create a start trimmer', () => {
		const trimmer = createTrimmer('start')

		expect(trimmer('  hello  ')).toBe('hello  ')
	})

	it('should create an end trimmer', () => {
		const trimmer = createTrimmer('end')

		expect(trimmer('  hello  ')).toBe('  hello')
	})

	it('should create trimmer with custom chars', () => {
		const trimmer = createTrimmer('both', '*')

		expect(trimmer('**hello**')).toBe('hello')
	})
})
