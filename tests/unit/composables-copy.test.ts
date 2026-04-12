import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useCopy } from '../../src/composables/use-copy'

// Mock clipboard API
const mockClipboard = {
	writeText: vi.fn(),
}

Object.defineProperty(navigator, 'clipboard', {
	value: mockClipboard,
	writable: true,
	configurable: true,
})

describe('useCopy', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		mockClipboard.writeText.mockReset()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should initialize with default state', () => {
			const { copied, error, isSupported } = useCopy()

			expect(copied.value).toBe(false)
			expect(error.value).toBe(null)
			expect(isSupported).toBe(true)
		})

		it('should copy text successfully', async () => {
			mockClipboard.writeText.mockResolvedValueOnce(undefined)

			const { copy, copied } = useCopy()

			const result = await copy('Hello World')

			expect(result).toBe(true)
			expect(copied.value).toBe(true)
			expect(mockClipboard.writeText).toHaveBeenCalledWith('Hello World')
		})

		it('should copy from source option', async () => {
			mockClipboard.writeText.mockResolvedValueOnce(undefined)

			const text = ref('Source text')
			const { copy, copied } = useCopy({ source: text })

			const result = await copy()

			expect(result).toBe(true)
			expect(copied.value).toBe(true)
			expect(mockClipboard.writeText).toHaveBeenCalledWith('Source text')
		})

		it('should override source with explicit text', async () => {
			mockClipboard.writeText.mockResolvedValueOnce(undefined)

			const text = ref('Source text')
			const { copy } = useCopy({ source: text })

			await copy('Override text')

			expect(mockClipboard.writeText).toHaveBeenCalledWith('Override text')
		})
	})

	describe('copied state timeout', () => {
		it('should reset copied state after timeout', async () => {
			mockClipboard.writeText.mockResolvedValueOnce(undefined)

			const { copy, copied } = useCopy({ copiedTimeout: 1000 })

			await copy('test')
			expect(copied.value).toBe(true)

			vi.advanceTimersByTime(1000)
			expect(copied.value).toBe(false)
		})

		it('should use custom timeout', async () => {
			mockClipboard.writeText.mockResolvedValueOnce(undefined)

			const { copy, copied } = useCopy({ copiedTimeout: 500 })

			await copy('test')
			expect(copied.value).toBe(true)

			vi.advanceTimersByTime(500)
			expect(copied.value).toBe(false)
		})
	})

	describe('callbacks', () => {
		it('should call onSuccess callback', async () => {
			mockClipboard.writeText.mockResolvedValueOnce(undefined)

			const onSuccess = vi.fn()
			const { copy } = useCopy({ onSuccess })

			await copy('test')

			expect(onSuccess).toHaveBeenCalledWith('test')
		})

		it('should call onError callback on failure', async () => {
			mockClipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'))

			const onError = vi.fn()
			const { copy } = useCopy({ onError })

			await copy('test')

			expect(onError).toHaveBeenCalled()
		})
	})

	describe('error handling', () => {
		it('should set error on failure', async () => {
			mockClipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'))

			const { copy, error, copied } = useCopy()

			const result = await copy('test')

			expect(result).toBe(false)
			expect(copied.value).toBe(false)
			expect(error.value).toBeInstanceOf(Error)
		})

		it('should return false when no text provided', async () => {
			const { copy } = useCopy()

			const result = await copy()

			expect(result).toBe(false)
		})

		it('should return false when source is empty', async () => {
			const text = ref('')
			const { copy } = useCopy({ source: text })

			const result = await copy()

			expect(result).toBe(false)
		})
	})
})
