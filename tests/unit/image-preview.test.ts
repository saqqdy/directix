import type { ObjectDirective } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { vImagePreview } from '../../src/directives/image-preview'

// Cast to ObjectDirective to access hooks
const imagePreviewDirective = vImagePreview as ObjectDirective

describe('vImagePreview', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('mounted', () => {
		it('should set cursor style on element', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			expect(el.style.cursor).toBe('zoom-in')
		})

		it('should not set cursor when disabled', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'

			imagePreviewDirective.mounted!(el, { value: { disabled: true }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			expect(el.style.cursor).toBe('')
		})

		it('should store state on element', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			expect((el as any).__imagePreview).toBeDefined()
		})
	})

	describe('click to open', () => {
		it('should open preview on click', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			expect(document.querySelector('.v-image-preview-overlay')).not.toBeNull()
		})

		it('should not open preview when disabled', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { disabled: true }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			expect(document.querySelector('.v-image-preview-overlay')).toBeNull()
		})

		it('should call onOpen callback', () => {
			const onOpen = vi.fn()
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { onOpen }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			expect(onOpen).toHaveBeenCalled()
		})
	})

	describe('preview content', () => {
		it('should show close button by default', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			expect(document.querySelector('.v-image-preview-close')).not.toBeNull()
		})

		it('should hide close button when showCloseButton is false', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { showCloseButton: false }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			expect(document.querySelector('.v-image-preview-close')).toBeNull()
		})

		it('should show zoom indicator by default', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			expect(document.querySelector('.v-image-preview-zoom')).not.toBeNull()
		})

		it('should hide zoom indicator when showZoomIndicator is false', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { showZoomIndicator: false }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			expect(document.querySelector('.v-image-preview-zoom')).toBeNull()
		})

		it('should show hint', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			expect(document.querySelector('.v-image-preview-hint')).not.toBeNull()
		})
	})

	describe('close preview', () => {
		it('should close on escape key', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()
			expect(document.querySelector('.v-image-preview-overlay')).not.toBeNull()

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
			vi.advanceTimersByTime(300)

			expect(document.querySelector('.v-image-preview-overlay')).toBeNull()
		})

		it('should close on click outside', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()
			expect(document.querySelector('.v-image-preview-overlay')).not.toBeNull()

			const overlay = document.querySelector('.v-image-preview-overlay') as HTMLElement
			overlay.click()
			vi.advanceTimersByTime(300)

			expect(document.querySelector('.v-image-preview-overlay')).toBeNull()
		})

		it('should call onClose callback', () => {
			const onClose = vi.fn()
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { onClose }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
			vi.advanceTimersByTime(300)

			expect(onClose).toHaveBeenCalled()
		})
	})

	describe('options', () => {
		it('should use custom z-index', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { zIndex: 10000 }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			const overlay = document.querySelector('.v-image-preview-overlay') as HTMLElement
			expect(overlay?.style.zIndex).toBe('10000')
		})

		it('should use custom class', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { class: 'custom-class' }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			const overlay = document.querySelector('.v-image-preview-overlay')
			expect(overlay?.classList.contains('custom-class')).toBe(true)
		})

		it('should use previewSrc', () => {
			const el = document.createElement('img')
			el.src = 'thumbnail.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { previewSrc: 'full.jpg' }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			const img = document.querySelector('.v-image-preview-overlay img') as HTMLImageElement
			expect(img?.src).toContain('full.jpg')
		})

		it('should use src from binding string', () => {
			const el = document.createElement('div')
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: 'image.jpg', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			el.click()

			const img = document.querySelector('.v-image-preview-overlay img') as HTMLImageElement
			expect(img?.src).toContain('image.jpg')
		})
	})

	describe('updated', () => {
		it('should update options', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			imagePreviewDirective.updated!(el, { value: { disabled: true }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			expect(el.style.cursor).toBe('')
		})
	})

	describe('unmounted', () => {
		it('should clean up', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			imagePreviewDirective.unmounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			expect((el as any).__imagePreview).toBeUndefined()
		})

		it('should remove open preview', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			expect(document.querySelector('.v-image-preview-overlay')).not.toBeNull()

			imagePreviewDirective.unmounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)

			expect(document.querySelector('.v-image-preview-overlay')).toBeNull()
		})
	})
})
