import { onUnmounted, ref, type Ref, unref } from 'vue'

/**
 * Print complete callback
 */
export type PrintCompleteCallback = () => void

/**
 * Print before callback
 */
export type PrintBeforeCallback = () => boolean | void

/**
 * Options for usePrint composable
 */
export interface UsePrintOptions {
	/**
	 * Title for the printed document
	 */
	title?: string | Ref<string>

	/**
	 * Additional CSS styles to inject
	 */
	styles?: string | string[] | Ref<string | string[]>

	/**
	 * Additional CSS URLs to include
	 */
	cssUrls?: string[] | Ref<string[]>

	/**
	 * Callback before printing
	 * Return false to cancel printing
	 */
	onBeforePrint?: PrintBeforeCallback

	/**
	 * Callback after printing
	 */
	onAfterPrint?: PrintCompleteCallback

	/**
	 * Whether to print in a new window
	 * @default false
	 */
	newWindow?: boolean | Ref<boolean>

	/**
	 * Custom class for print container
	 */
	printClass?: string | Ref<string>
}

/**
 * Return type for usePrint composable
 */
export interface UsePrintReturn {
	/**
	 * Whether printing is in progress
	 */
	isPrinting: Ref<boolean>

	/**
	 * Print the specified element or selector
	 */
	print: (target?: string | HTMLElement) => Promise<void>

	/**
	 * Print the current page
	 */
	printPage: () => Promise<void>
}

/**
 * Wait for images to load
 */
function waitForImages(doc: Document): Promise<void[]> {
	const images = doc.querySelectorAll('img')
	const promises: Promise<void>[] = []

	images.forEach(img => {
		if (!img.complete) {
			promises.push(
				new Promise(resolve => {
					img.onload = () => resolve()
					img.onerror = () => resolve()
				}),
			)
		}
	})

	return Promise.all(promises)
}

/**
 * Build print content HTML
 */
function buildPrintContent(
	el: HTMLElement,
	options: {
		title: string
		styles: string
		cssUrls: string[]
		printClass?: string
	},
): string {
	// Get all stylesheets
	let styles = ''

	// Include existing stylesheets
	if (typeof document !== 'undefined') {
		document.querySelectorAll('style, link[rel="stylesheet"]').forEach(styleEl => {
			if (styleEl.tagName === 'STYLE') {
				styles += `<style>${styleEl.textContent}</style>`
			} else if (styleEl.tagName === 'LINK') {
				const href = (styleEl as HTMLLinkElement).href
				styles += `<link rel="stylesheet" href="${href}">`
			}
		})
	}

	// Add custom CSS URLs
	options.cssUrls.forEach(url => {
		styles += `<link rel="stylesheet" href="${url}">`
	})

	// Add custom styles
	if (options.styles) {
		styles += `<style>${options.styles}</style>`
	}

	// Add print-specific styles
	styles += `
		<style>
			@media print {
				body { margin: 0; padding: 20px; }
				${options.printClass ? `.${options.printClass} { page-break-inside: avoid; }` : ''}
			}
		</style>
	`

	// Build HTML
	const title = options.title || (typeof document !== 'undefined' ? document.title : 'Print')
	const content = el.outerHTML

	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>${title}</title>
	${styles}
</head>
<body>
	${content}
</body>
</html>`
}

/**
 * Print using iframe
 */
async function printInIframe(
	el: HTMLElement,
	options: {
		title: string
		styles: string
		cssUrls: string[]
		printClass?: string
	},
): Promise<void> {
	// Create iframe
	const iframe = document.createElement('iframe')
	iframe.style.cssText = 'position: absolute; top: -10000px; left: -10000px; width: 0; height: 0; border: none;'
	document.body.appendChild(iframe)

	const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

	if (!iframeDoc) {
		console.warn('[Directix] usePrint: Could not access iframe document')
		document.body.removeChild(iframe)
		return
	}

	// Build document content
	const content = buildPrintContent(el, options)

	iframeDoc.open()
	iframeDoc.write(content)
	iframeDoc.close()

	// Wait for images to load
	await waitForImages(iframeDoc)

	// Print
	try {
		iframe.contentWindow?.focus()
		iframe.contentWindow?.print()
	} catch (err) {
		console.error('[Directix] usePrint: Print failed', err)
	}

	// Cleanup after print
	setTimeout(() => {
		document.body.removeChild(iframe)
	}, 1000)
}

/**
 * Print in new window
 */
async function printInNewWindow(
	el: HTMLElement,
	options: {
		title: string
		styles: string
		cssUrls: string[]
		printClass?: string
	},
): Promise<void> {
	const printWindow = window.open('', '_blank')

	if (!printWindow) {
		console.warn('[Directix] usePrint: Could not open print window')
		return
	}

	const content = buildPrintContent(el, options)

	printWindow.document.open()
	printWindow.document.write(content)
	printWindow.document.close()

	// Wait for images to load
	await waitForImages(printWindow.document)

	// Print
	printWindow.focus()
	printWindow.print()

	// Close after print
	setTimeout(() => {
		printWindow.close()
	}, 1000)
}

/**
 * Composable for printing functionality
 *
 * @param options - Configuration options
 * @returns Print utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { usePrint } from 'directix'
 *
 * const { isPrinting, print } = usePrint({
 *   title: 'My Document',
 *   onBeforePrint: () => {
 *     console.log('About to print...')
 *     return true
 *   },
 *   onAfterPrint: () => {
 *     console.log('Print complete!')
 *   }
 * })
 *
 * async function handlePrint() {
 *   await print('#content')
 * }
 * </script>
 *
 * <template>
 *   <div>
 *     <button @click="handlePrint" :disabled="isPrinting">
 *       {{ isPrinting ? 'Printing...' : 'Print' }}
 *     </button>
 *     <div id="content">Content to print</div>
 *   </div>
 * </template>
 * ```
 */
export function usePrint(options: UsePrintOptions = {}): UsePrintReturn {
	const {
		title,
		styles,
		cssUrls = [],
		onBeforePrint,
		onAfterPrint,
		newWindow = false,
		printClass,
	} = options

	// State
	const isPrinting = ref(false)

	/**
	 * Print the specified element or selector
	 */
	async function print(target?: string | HTMLElement): Promise<void> {
		// Call before callback
		if (onBeforePrint) {
			const result = onBeforePrint()
			if (result === false) return
		}

		isPrinting.value = true

		try {
			// Get target element
			let targetEl: HTMLElement | null = null

			if (typeof target === 'string') {
				targetEl = document.querySelector(target)
			} else if (target instanceof HTMLElement) {
				targetEl = target
			} else {
				// Default to body
				targetEl = document.body
			}

			if (!targetEl) {
				console.warn('[Directix] usePrint: Target element not found')
				return
			}

			const printOptions = {
				title: unref(title) || '',
				styles: (Array.isArray(unref(styles)) ? (unref(styles) as string[]).join('\n') : (unref(styles) || '')) as string,
				cssUrls: unref(cssUrls) || [],
				printClass: unref(printClass),
			}

			// Create print window/iframe
			if (unref(newWindow)) {
				await printInNewWindow(targetEl, printOptions)
			} else {
				await printInIframe(targetEl, printOptions)
			}

			// Call after callback
			if (onAfterPrint) {
				onAfterPrint()
			}
		} finally {
			isPrinting.value = false
		}
	}

	/**
	 * Print the current page
	 */
	async function printPage(): Promise<void> {
		await print()
	}

	// Cleanup
	onUnmounted(() => {
		// Nothing to clean up
	})

	return {
		isPrinting,
		print,
		printPage,
	}
}

/**
 * Quick print function
 *
 * @param target - Element or selector to print
 * @param options - Print options
 *
 * @example
 * ```ts
 * import { quickPrint } from 'directix'
 *
 * // Print element by selector
 * quickPrint('#content', { title: 'My Document' })
 *
 * // Print element directly
 * const el = document.getElementById('content')
 * quickPrint(el)
 * ```
 */
export async function quickPrint(
	target: string | HTMLElement,
	options: UsePrintOptions = {},
): Promise<void> {
	const { print } = usePrint(options)
	await print(target)
}
