import { isBrowser } from '@directix/core'
import { onUnmounted, readonly, ref, type Ref } from 'vue'

/**
 * Options for useImagePreview composable
 */
export interface UseImagePreviewOptions {
	/**
	 * Initial image URL to preview
	 */
	src?: string | Ref<string>

	/**
	 * Close on click outside
	 * @default true
	 */
	closeOnClickOutside?: boolean

	/**
	 * Close on escape key
	 * @default true
	 */
	closeOnEsc?: boolean

	/**
	 * Show close button
	 * @default true
	 */
	showCloseButton?: boolean

	/**
	 * Callback when preview opens
	 */
	onOpen?: () => void

	/**
	 * Callback when preview closes
	 */
	onClose?: () => void
}

/**
 * Return type for useImagePreview composable
 */
export interface UseImagePreviewReturn {
	/** Whether the preview is open */
	isOpen: Readonly<Ref<boolean>>

	/** Current image URL */
	currentSrc: Readonly<Ref<string>>

	/** Open preview with an image */
	open: (src?: string) => void

	/** Close preview */
	close: () => void

	/** Bind click-to-preview to an image element */
	bind: (element: HTMLImageElement) => () => void
}

/**
 * Composable for image preview functionality
 *
 * @param options - Configuration options
 * @returns Image preview utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useImagePreview } from 'directix'
 *
 * const imageRef = ref(null)
 * const { isOpen, bind, open, close } = useImagePreview()
 *
 * onMounted(() => bind(imageRef.value))
 *
 * function openCustomImage() {
 *   open('https://example.com/high-res.jpg')
 * }
 * </script>
 *
 * <template>
 *   <img ref="imageRef" src="thumbnail.jpg" />
 * </template>
 * ```
 */
export function useImagePreview(options: UseImagePreviewOptions = {}): UseImagePreviewReturn {
	const {
		src: initialSrc,
		closeOnClickOutside = true,
		closeOnEsc = true,
		showCloseButton = true,
		onOpen,
		onClose,
	} = options

	const isOpen = ref(false)
	const currentSrc = ref('')

	let currentElement: HTMLImageElement | null = null,
		overlay: HTMLDivElement | null = null,
		clickHandler: (() => void) | null = null,
		keydownHandler: ((e: KeyboardEvent) => void) | null = null

	function createOverlay(): HTMLDivElement {
		const div = document.createElement('div')

		div.className = 'v-image-preview'
		div.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
    `

		return div
	}

	function open(src?: string): void {
		if (!isBrowser()) return

		const imageSrc = src || (initialSrc && typeof initialSrc === 'object' ? initialSrc.value : initialSrc)
		if (!imageSrc && !currentElement) return

		const finalSrc = imageSrc || currentElement!.src
		currentSrc.value = finalSrc

		// Create overlay
		overlay = createOverlay()

		// Create image
		const img = document.createElement('img')
		img.src = finalSrc
		img.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      cursor: default;
    `

		// Create close button
		if (showCloseButton) {
			const closeBtn = document.createElement('button')
			closeBtn.className = 'v-image-preview__close'
			closeBtn.innerHTML = '&times;'
			closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border: none;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        font-size: 24px;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      `
			closeBtn.addEventListener('click', e => {
				e.stopPropagation()
				close()
			})
			overlay.appendChild(closeBtn)
		}

		overlay.appendChild(img)
		document.body.appendChild(overlay)

		// Click outside to close
		if (closeOnClickOutside) {
			clickHandler = close
			overlay.addEventListener('click', clickHandler)
		}

		// Escape to close
		if (closeOnEsc) {
			keydownHandler = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					close()
				}
			}
			document.addEventListener('keydown', keydownHandler)
		}

		isOpen.value = true
		onOpen?.()
	}

	function close(): void {
		if (overlay) {
			overlay.remove()
			overlay = null
		}

		if (clickHandler) {
			document.removeEventListener('click', clickHandler)
			clickHandler = null
		}

		if (keydownHandler) {
			document.removeEventListener('keydown', keydownHandler)
			keydownHandler = null
		}

		isOpen.value = false
		currentSrc.value = ''
		onClose?.()
	}

	function handleElementClick(): void {
		if (currentElement) {
			open(currentElement.src)
		}
	}

	function bind(element: HTMLImageElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		unbind()

		currentElement = element
		element.style.cursor = 'zoom-in'
		element.addEventListener('click', handleElementClick)

		return unbind
	}

	function unbind(): void {
		if (currentElement) {
			currentElement.style.cursor = ''
			currentElement.removeEventListener('click', handleElementClick)
		}
		currentElement = null
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
		close()
	})

	return {
		isOpen: readonly(isOpen),
		currentSrc: readonly(currentSrc),
		open,
		close,
		bind,
	}
}
