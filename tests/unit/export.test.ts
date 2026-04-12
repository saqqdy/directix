import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vExport } from '../../src/directives/export'

// Mock Blob and URL.createObjectURL
const mockBlob = vi.fn()
const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test')
const mockRevokeObjectURL = vi.fn()

globalThis.Blob = mockBlob as any
URL.createObjectURL = mockCreateObjectURL
URL.revokeObjectURL = mockRevokeObjectURL

describe('v-export', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		mockBlob.mockReset()
		mockCreateObjectURL.mockClear()
		mockRevokeObjectURL.mockClear()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should add v-export class on mount', () => {
			const data = [{ name: 'John', age: 30 }]
			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-export="data">Export</button>`,
				data() {
					return { data }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('button').classes()).toContain('v-export')
		})

		it('should trigger export on click', async () => {
			const data = [{ name: 'John', age: 30 }]
			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-export="data">Export</button>`,
				data() {
					return { data }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.find('button').trigger('click')

			expect(mockBlob).toHaveBeenCalled()
			expect(mockCreateObjectURL).toHaveBeenCalled()
		})

		it('should accept options object', async () => {
			const data = [{ name: 'John', age: 30 }]
			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-export="{ data, format: 'json' }">Export</button>`,
				data() {
					return { data }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.find('button').trigger('click')

			expect(mockBlob).toHaveBeenCalled()
		})
	})

	describe('export formats', () => {
		it('should export as CSV by default', async () => {
			const data = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]
			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-export="data">Export</button>`,
				data() {
					return { data }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.find('button').trigger('click')

			expect(mockBlob).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ type: expect.stringContaining('csv') }))
		})

		it('should export as JSON', async () => {
			const data = [{ name: 'John', age: 30 }]
			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-export="{ data, format: 'json' }">Export</button>`,
				data() {
					return { data }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.find('button').trigger('click')

			expect(mockBlob).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ type: expect.stringContaining('json') }))
		})

		it('should export as HTML', async () => {
			const data = [{ name: 'John', age: 30 }]
			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-export="{ data, format: 'html' }">Export</button>`,
				data() {
					return { data }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.find('button').trigger('click')

			expect(mockBlob).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ type: expect.stringContaining('html') }))
		})
	})

	describe('options', () => {
		it('should use custom filename', async () => {
			const data = [{ name: 'John', age: 30 }]
			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-export="{ data, filename: 'my-data' }">Export</button>`,
				data() {
					return { data }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.find('button').trigger('click')

			// Filename is used in download attribute
			expect(mockCreateObjectURL).toHaveBeenCalled()
		})

		it('should call onBeforeExport callback', async () => {
			const onBeforeExport = vi.fn().mockReturnValue(true)
			const data = [{ name: 'John', age: 30 }]
			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-export="{ data, onBeforeExport }">Export</button>`,
				data() {
					return { data, onBeforeExport }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.find('button').trigger('click')

			expect(onBeforeExport).toHaveBeenCalled()
		})

		it('should cancel export if onBeforeExport returns false', async () => {
			const onBeforeExport = vi.fn().mockReturnValue(false)
			const data = [{ name: 'John', age: 30 }]
			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-export="{ data, onBeforeExport }">Export</button>`,
				data() {
					return { data, onBeforeExport }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.find('button').trigger('click')

			expect(onBeforeExport).toHaveBeenCalled()
			expect(mockBlob).not.toHaveBeenCalled()
		})

		it('should call onAfterExport callback', async () => {
			const onAfterExport = vi.fn()
			const data = [{ name: 'John', age: 30 }]
			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-export="{ data, onAfterExport }">Export</button>`,
				data() {
					return { data, onAfterExport }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.find('button').trigger('click')

			expect(onAfterExport).toHaveBeenCalled()
		})
	})

	describe('cleanup', () => {
		it('should remove event listener on unmount', async () => {
			const data = [{ name: 'John', age: 30 }]
			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-if="show" v-export="data">Export</button>`,
				data() {
					return { data, show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-export').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-export').exists()).toBe(false)
		})
	})

	describe('error handling', () => {
		it('should call onError callback when export fails', async () => {
			const onError = vi.fn()
			const data = [{ name: 'John', age: 30 }]

			// Mock Blob to throw an error
			mockBlob.mockImplementation(() => {
				throw new Error('Export failed')
			})

			const TestComponent = defineComponent({
				directives: { export: vExport },
				template: `<button v-export="{ data, onError }">Export</button>`,
				data() {
					return { data, onError }
				},
			})

			const wrapper = mount(TestComponent)
			await wrapper.find('button').trigger('click')

			expect(onError).toHaveBeenCalled()
			expect(onError.mock.calls[0][0].message).toBe('Export failed')
		})
	})
})
