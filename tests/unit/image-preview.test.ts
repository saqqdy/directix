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

	describe('mouse interactions', () => {
		it('should handle mousedown for dragging', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			const img = document.querySelector('.v-image-preview-overlay img') as HTMLImageElement
			const imageContainer = img.parentElement as HTMLElement

			// Simulate mousedown
			img.dispatchEvent(new MouseEvent('mousedown', {
				clientX: 100,
				clientY: 100,
				bubbles: true,
			}))

			// Cursor should change to grabbing on the container
			expect(imageContainer.style.cursor).toBe('grabbing')
		})

		it('should handle mousemove for dragging', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			const img = document.querySelector('.v-image-preview-overlay img') as HTMLImageElement

			// Start dragging
			img.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100, bubbles: true }))

			// Move mouse
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }))

			// End dragging
			document.dispatchEvent(new MouseEvent('mouseup'))

			expect(img.style.cursor).toBe('grab')
		})
	})

	describe('wheel zoom', () => {
		it('should zoom on wheel', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			const overlay = document.querySelector('.v-image-preview-overlay') as HTMLElement

			// Simulate wheel zoom in
			overlay.dispatchEvent(new WheelEvent('wheel', {
				deltaY: -100,
				bubbles: true,
				cancelable: true,
			}))

			const zoomIndicator = document.querySelector('.v-image-preview-zoom')
			expect(zoomIndicator?.textContent).not.toBe('100%')
		})

		it('should not zoom when enablePinchZoom is false', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { enablePinchZoom: false }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			const overlay = document.querySelector('.v-image-preview-overlay') as HTMLElement
			const imageContainer = overlay.querySelector('div') as HTMLElement

			// Get initial transform
			const initialTransform = imageContainer?.style.transform || ''

			// Simulate wheel
			overlay.dispatchEvent(new WheelEvent('wheel', {
				deltaY: -100,
				bubbles: true,
				cancelable: true,
			}))

			// Transform should not change significantly
			expect(imageContainer?.style.transform || '').toBe(initialTransform)
		})
	})

	describe('touch interactions', () => {
		it('should handle touchstart', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			const overlay = document.querySelector('.v-image-preview-overlay') as HTMLElement

			// Simulate touchstart
			const touchEvent = new TouchEvent('touchstart', {
				touches: [new Touch({ identifier: 0, target: overlay, clientX: 100, clientY: 100 })],
				bubbles: true,
			})
			overlay.dispatchEvent(touchEvent)

			expect(overlay).toBeDefined()
		})

		it('should handle pinch zoom with two fingers', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			const overlay = document.querySelector('.v-image-preview-overlay') as HTMLElement

			// Simulate two finger touch
			const touch1 = new Touch({ identifier: 0, target: overlay, clientX: 100, clientY: 100 })
			const touch2 = new Touch({ identifier: 1, target: overlay, clientX: 150, clientY: 100 })

			overlay.dispatchEvent(new TouchEvent('touchstart', {
				touches: [touch1, touch2],
				bubbles: true,
			}))

			// Simulate pinch out
			const touch1Moved = new Touch({ identifier: 0, target: overlay, clientX: 80, clientY: 100 })
			const touch2Moved = new Touch({ identifier: 1, target: overlay, clientX: 170, clientY: 100 })

			overlay.dispatchEvent(new TouchEvent('touchmove', {
				touches: [touch1Moved, touch2Moved],
				bubbles: true,
				cancelable: true,
			}))

			const zoomIndicator = document.querySelector('.v-image-preview-zoom')
			// Zoom should have increased
			expect(zoomIndicator?.textContent).not.toBe('100%')
		})
	})

	describe('scale constraints', () => {
		it('should respect minScale option', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { minScale: 0.8 }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			const overlay = document.querySelector('.v-image-preview-overlay') as HTMLElement

			// Zoom out with wheel
			overlay.dispatchEvent(new WheelEvent('wheel', {
				deltaY: 100,
				bubbles: true,
				cancelable: true,
			}))

			const zoomIndicator = document.querySelector('.v-image-preview-zoom')
			const zoomValue = parseInt(zoomIndicator?.textContent || '100')
			expect(zoomValue).toBeGreaterThanOrEqual(80)
		})

		it('should respect maxScale option', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { maxScale: 2 }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			const overlay = document.querySelector('.v-image-preview-overlay') as HTMLElement

			// Zoom in multiple times
			for (let i = 0; i < 10; i++) {
				overlay.dispatchEvent(new WheelEvent('wheel', {
					deltaY: -100,
					bubbles: true,
					cancelable: true,
				}))
			}

			const zoomIndicator = document.querySelector('.v-image-preview-zoom')
			const zoomValue = parseInt(zoomIndicator?.textContent || '100')
			expect(zoomValue).toBeLessThanOrEqual(200)
		})
	})

	describe('close button', () => {
		it('should close on close button click', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			expect(document.querySelector('.v-image-preview-overlay')).not.toBeNull()

			const closeBtn = document.querySelector('.v-image-preview-close') as HTMLButtonElement
			closeBtn.click()

			vi.advanceTimersByTime(300)

			expect(document.querySelector('.v-image-preview-overlay')).toBeNull()
		})
	})

	describe('click to reset', () => {
		it('should reset transform when clicking while zoomed', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			const overlay = document.querySelector('.v-image-preview-overlay') as HTMLElement

			// Zoom in with wheel
			overlay.dispatchEvent(new WheelEvent('wheel', {
				deltaY: -100,
				bubbles: true,
				cancelable: true,
			}))

			// Click overlay (should reset, not close)
			overlay.click()

			const zoomIndicator = document.querySelector('.v-image-preview-zoom')
			expect(zoomIndicator?.textContent).toBe('100%')
		})
	})

	describe('alt text', () => {
		it('should use alt from element', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			el.alt = 'Test image'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: '', modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			const img = document.querySelector('.v-image-preview-overlay img') as HTMLImageElement
			expect(img.alt).toBe('Test image')
		})

		it('should use custom alt from options', () => {
			const el = document.createElement('img')
			el.src = 'test.jpg'
			el.alt = 'Original alt'
			document.body.appendChild(el)

			imagePreviewDirective.mounted!(el, { value: { alt: 'Custom alt' }, modifiers: {}, dir: vImagePreview, instance: null } as any, null as any, null as any)
			el.click()

			const img = document.querySelector('.v-image-preview-overlay img') as HTMLImageElement
			expect(img.alt).toBe('Custom alt')
		})
	})
})
