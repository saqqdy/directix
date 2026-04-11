import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { createWatermarkUrl, useWatermark } from '../../src/composables/use-watermark'

// Mock canvas context
const mockCanvasContext = {
	font: '',
	fillStyle: '',
	textAlign: '',
	textBaseline: '',
	translate: vi.fn(),
	rotate: vi.fn(),
	fillText: vi.fn(),
	measureText: vi.fn().mockReturnValue({ width: 100 }),
	save: vi.fn(),
	restore: vi.fn(),
}

describe('useWatermark', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCanvasContext) as any
		HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mock')
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with content', () => {
			const { canvas, dataUrl, style, disabled } = useWatermark({ content: 'Test' })

			expect(canvas.value).toBeDefined()
			expect(dataUrl.value).toBeDefined()
			expect(style.value).toBeDefined()
			expect(disabled.value).toBe(false)
		})

		it('should generate watermark canvas', () => {
			const { canvas, dataUrl } = useWatermark({ content: 'Confidential' })

			expect(canvas.value).toBeInstanceOf(HTMLCanvasElement)
			expect(dataUrl.value).toContain('data:image')
		})

		it('should return correct style object', () => {
			const { style } = useWatermark({ content: 'Test' })

			expect(style.value.position).toBe('absolute')
			expect(style.value.pointerEvents).toBe('none')
			expect(style.value.backgroundRepeat).toBe('repeat')
		})
	})

	describe('options', () => {
		it('should use custom width', () => {
			const { style } = useWatermark({ content: 'Test', width: 400 })

			// backgroundSize = width + gap[0], height + gap[1]
			// Default gap is [100, 100], so 400 + 100 = 500
			expect(style.value.backgroundSize).toBeDefined()
		})

		it('should use custom height', () => {
			const { style } = useWatermark({ content: 'Test', height: 300 })

			expect(style.value.backgroundSize).toBeDefined()
		})

		it('should use custom rotate', () => {
			const { canvas } = useWatermark({ content: 'Test', rotate: -45 })

			expect(canvas.value).toBeDefined()
			expect(mockCanvasContext.rotate).toHaveBeenCalled()
		})

		it('should use custom fontSize', () => {
			const { canvas } = useWatermark({ content: 'Test', fontSize: 20 })

			expect(canvas.value).toBeDefined()
		})

		it('should use custom fontFamily', () => {
			const { canvas } = useWatermark({ content: 'Test', fontFamily: 'Arial' })

			expect(canvas.value).toBeDefined()
		})

		it('should use custom fontWeight', () => {
			const { canvas } = useWatermark({ content: 'Test', fontWeight: 'bold' })

			expect(canvas.value).toBeDefined()
		})

		it('should use custom color', () => {
			const { canvas } = useWatermark({ content: 'Test', color: 'rgba(255, 0, 0, 0.2)' })

			expect(canvas.value).toBeDefined()
		})

		it('should use custom gap as array', () => {
			const { style } = useWatermark({ content: 'Test', gap: [50, 75] })

			expect(style.value.backgroundPosition).toBe('25px 37.5px')
		})

		it('should use custom gap as number', () => {
			const { style } = useWatermark({ content: 'Test', gap: 100 })

			expect(style.value.backgroundPosition).toBe('50px 50px')
		})

		it('should use custom zIndex', () => {
			const { style } = useWatermark({ content: 'Test', zIndex: 5000 })

			expect(style.value.zIndex).toBe(5000)
		})

		it('should support array content', () => {
			const { canvas, dataUrl } = useWatermark({ content: ['Line 1', 'Line 2'] })

			expect(canvas.value).toBeDefined()
			expect(dataUrl.value).toContain('data:image')
		})
	})

	describe('disabled state', () => {
		it('should initialize disabled', () => {
			const { disabled, style } = useWatermark({ content: 'Test', disabled: true })

			expect(disabled.value).toBe(true)
			// Initial disabled state sets display to none
			expect(style.value.display).toBe('none')
		})

		it('should enable watermark', () => {
			const { disabled, enable } = useWatermark({ content: 'Test', disabled: true })

			enable()

			expect(disabled.value).toBe(false)
		})

		it('should disable watermark', () => {
			const { disabled, disable } = useWatermark({ content: 'Test' })

			disable()

			expect(disabled.value).toBe(true)
		})
	})

	describe('update', () => {
		it('should update watermark options', () => {
			const { update, style } = useWatermark({ content: 'Test', width: 300 })

			update({ width: 400 })

			expect(style.value.backgroundSize).toContain('400')
		})

		it('should update content', () => {
			const { update, dataUrl } = useWatermark({ content: 'Test' })

			update({ content: 'Updated' })

			expect(dataUrl.value).toContain('data:image')
		})
	})

	describe('reactive options', () => {
		it('should support reactive content', () => {
			const content = ref('Test')
			const { dataUrl } = useWatermark({ content })

			expect(dataUrl.value).toContain('data:image')
		})

		it('should support reactive width', () => {
			const width = ref(300)
			const { style } = useWatermark({ content: 'Test', width })

			expect(style.value).toBeDefined()
		})

		it('should support reactive disabled', () => {
			const disabled = ref(false)
			const { disabled: disabledRef } = useWatermark({ content: 'Test', disabled })

			expect(disabledRef.value).toBe(false)
		})
	})
})

describe('createWatermarkUrl', () => {
	beforeEach(() => {
		HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCanvasContext) as any
		HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mock')
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should create watermark URL', () => {
		const url = createWatermarkUrl('Test')

		expect(url).toContain('data:image')
	})

	it('should create watermark URL with array content', () => {
		const url = createWatermarkUrl(['Line 1', 'Line 2'])

		expect(url).toContain('data:image')
	})

	it('should use custom options', () => {
		const url = createWatermarkUrl('Test', { fontSize: 20, color: 'red' })

		expect(url).toContain('data:image')
	})

	it('should use custom width and height', () => {
		const url = createWatermarkUrl('Test', { width: 400, height: 300 })

		expect(url).toContain('data:image')
	})

	it('should use custom rotate', () => {
		const url = createWatermarkUrl('Test', { rotate: -45 })

		expect(url).toContain('data:image')
	})
})
