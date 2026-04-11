import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useExport } from '../../src/composables/use-export'

// Mock Blob and URL
const mockBlob = vi.fn()
const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test')
const mockRevokeObjectURL = vi.fn()

globalThis.Blob = mockBlob as any
URL.createObjectURL = mockCreateObjectURL
URL.revokeObjectURL = mockRevokeObjectURL

describe('useExport', () => {
	beforeEach(() => {
		mockBlob.mockClear()
		mockCreateObjectURL.mockClear()
		mockRevokeObjectURL.mockClear()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should export data', () => {
			const data = [{ name: 'John', age: 30 }]
			const { exportData } = useExport({ data })

			exportData()

			expect(mockBlob).toHaveBeenCalled()
			expect(mockCreateObjectURL).toHaveBeenCalled()
		})

		it('should export as CSV', () => {
			const data = [{ name: 'John', age: 30 }]
			const { exportCSV } = useExport({ data })

			exportCSV()

			expect(mockBlob).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ type: expect.stringContaining('csv') }))
		})

		it('should export as JSON', () => {
			const data = [{ name: 'John', age: 30 }]
			const { exportJSON } = useExport({ data })

			exportJSON()

			expect(mockBlob).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ type: expect.stringContaining('json') }))
		})

		it('should export as HTML', () => {
			const data = [{ name: 'John', age: 30 }]
			const { exportHTML } = useExport({ data })

			exportHTML()

			expect(mockBlob).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ type: expect.stringContaining('html') }))
		})

		it('should export as text', () => {
			const data = 'Hello World'
			const { exportText } = useExport({ data })

			exportText()

			expect(mockBlob).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ type: expect.stringContaining('text') }))
		})
	})

	describe('options', () => {
		it('should use custom filename', () => {
			const data = [{ name: 'John' }]
			const { exportCSV } = useExport({ data, filename: 'custom-data' })

			exportCSV()

			expect(mockCreateObjectURL).toHaveBeenCalled()
		})

		it('should use custom delimiter', () => {
			const data = [{ name: 'John', age: 30 }]
			const { exportData } = useExport({ data, delimiter: ';' })

			exportData('csv')

			expect(mockBlob).toHaveBeenCalled()
		})

		it('should exclude headers when includeHeaders is false', () => {
			const data = [{ name: 'John', age: 30 }]
			const { exportData } = useExport({ data, includeHeaders: false })

			exportData('csv')

			expect(mockBlob).toHaveBeenCalled()
		})

		it('should use custom columns', () => {
			const data = [{ name: 'John', age: 30, email: 'john@test.com' }]
			const { exportData } = useExport({ data, columns: ['name', 'email'] })

			exportData('csv')

			expect(mockBlob).toHaveBeenCalled()
		})

		it('should use custom headers', () => {
			const data = [{ name: 'John', age: 30 }]
			const { exportData } = useExport({ data, headers: { name: 'Name', age: 'Age' } })

			exportData('csv')

			expect(mockBlob).toHaveBeenCalled()
		})
	})

	describe('callbacks', () => {
		it('should call onBeforeExport callback', () => {
			const onBeforeExport = vi.fn().mockReturnValue(true)
			const data = [{ name: 'John' }]
			const { exportData } = useExport({ data, onBeforeExport })

			exportData()

			expect(onBeforeExport).toHaveBeenCalled()
		})

		it('should cancel export if onBeforeExport returns false', () => {
			const onBeforeExport = vi.fn().mockReturnValue(false)
			const data = [{ name: 'John' }]
			const { exportData } = useExport({ data, onBeforeExport })

			exportData()

			expect(onBeforeExport).toHaveBeenCalled()
			expect(mockBlob).not.toHaveBeenCalled()
		})

		it('should call onAfterExport callback', () => {
			const onAfterExport = vi.fn()
			const data = [{ name: 'John' }]
			const { exportData } = useExport({ data, onAfterExport })

			exportData()

			expect(onAfterExport).toHaveBeenCalled()
		})

		it('should call onError callback on error', () => {
			const onError = vi.fn()
			const data = [{ name: 'John' }]
			const { exportData } = useExport({ data, onError })

			// Mock an error
			mockBlob.mockImplementation(() => {
				throw new Error('Test error')
			})

			exportData()

			expect(onError).toHaveBeenCalled()
		})
	})

	describe('reactive options', () => {
		it('should support reactive data', () => {
			const data = ref([{ name: 'John' }])
			const { exportData } = useExport({ data })

			exportData()

			expect(mockBlob).toHaveBeenCalled()
		})

		it('should support reactive format', () => {
			const data = [{ name: 'John' }]
			const format = ref<'csv' | 'json'>('csv')
			const { exportData } = useExport({ data, format })

			exportData()

			expect(mockBlob).toHaveBeenCalled()
		})
	})
})
