import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useImagePreview } from '../../src/composables/use-image-preview'

describe('useImagePreview', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { isOpen, currentSrc, open, close, bind } = useImagePreview()

			expect(isOpen.value).toBe(false)
			expect(currentSrc.value).toBe('')
			expect(open).toBeDefined()
			expect(close).toBeDefined()
			expect(bind).toBeDefined()
		})

		it('should bind to image element', () => {
			const element = document.createElement('img')
			element.src = 'test.jpg'
			const { bind } = useImagePreview()

			const unbind = bind(element)

			expect(element.style.cursor).toBe('zoom-in')

			unbind()
			expect(element.style.cursor).toBe('')
		})

		it('should open preview on image click', () => {
			const element = document.createElement('img')
			element.src = 'test.jpg'
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0, top: 0, width: 100, height: 100,
			})
			const { bind, isOpen } = useImagePreview()

			bind(element)

			element.click()

			expect(isOpen.value).toBe(true)
			expect(document.querySelector('.v-image-preview')).not.toBeNull()
		})
	})

	describe('open', () => {
		it('should open preview with custom src', () => {
			const { open, isOpen, currentSrc } = useImagePreview()

			open('custom.jpg')

			expect(isOpen.value).toBe(true)
			expect(currentSrc.value).toBe('custom.jpg')
		})

		it('should open preview with initial src', () => {
			const { open, isOpen, currentSrc } = useImagePreview({ src: 'initial.jpg' })

			open()

			expect(isOpen.value).toBe(true)
			expect(currentSrc.value).toBe('initial.jpg')
		})

		it('should create overlay with image', () => {
			const { open } = useImagePreview()

			open('test.jpg')

			const overlay = document.querySelector('.v-image-preview')
			expect(overlay).not.toBeNull()

			const img = overlay?.querySelector('img')
			expect(img?.src).toContain('test.jpg')
		})

		it('should create close button', () => {
			const { open } = useImagePreview()

			open('test.jpg')

			expect(document.querySelector('.v-image-preview__close')).not.toBeNull()
		})

		it('should not create close button when showCloseButton is false', () => {
			const { open } = useImagePreview({ showCloseButton: false })

			open('test.jpg')

			expect(document.querySelector('.v-image-preview__close')).toBeNull()
		})
	})

	describe('close', () => {
		it('should close preview', () => {
			const { open, close, isOpen } = useImagePreview()

			open('test.jpg')
			expect(isOpen.value).toBe(true)

			close()
			expect(isOpen.value).toBe(false)
			expect(document.querySelector('.v-image-preview')).toBeNull()
		})

		it('should close on overlay click', () => {
			const { open, isOpen } = useImagePreview({ closeOnClickOutside: true })

			open('test.jpg')

			const overlay = document.querySelector('.v-image-preview') as HTMLElement
			overlay?.click()

			expect(isOpen.value).toBe(false)
		})

		it('should close on escape key', () => {
			const { open, isOpen } = useImagePreview({ closeOnEsc: true })

			open('test.jpg')

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

			expect(isOpen.value).toBe(false)
		})

		it('should not close on escape when closeOnEsc is false', () => {
			const { open, isOpen } = useImagePreview({ closeOnEsc: false })

			open('test.jpg')

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

			expect(isOpen.value).toBe(true)
		})
	})

	describe('options', () => {
		it('should call onOpen callback', () => {
			const onOpen = vi.fn()
			const { open } = useImagePreview({ onOpen })

			open('test.jpg')

			expect(onOpen).toHaveBeenCalled()
		})

		it('should call onClose callback', () => {
			const onClose = vi.fn()
			const { open, close } = useImagePreview({ onClose })

			open('test.jpg')
			close()

			expect(onClose).toHaveBeenCalled()
		})
	})

	describe('reactive options', () => {
		it('should support reactive src', () => {
			const src = ref('initial.jpg')
			const { open, currentSrc } = useImagePreview({ src })

			open()

			expect(currentSrc.value).toBe('initial.jpg')
		})
	})
})