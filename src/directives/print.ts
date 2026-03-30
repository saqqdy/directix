import { defineDirective } from '@directix/core'

/**
 * Print complete callback
 */
export type PrintCompleteCallback = () => void

/**
 * Print before callback
 */
export type PrintBeforeCallback = () => boolean | void

/**
 * Print directive options
 */
export interface PrintOptions {
	/**
	 * Title for the printed document
	 */
	title?: string

	/**
	 * Additional CSS styles to inject
	 */
	styles?: string | string[]

	/**
	 * Additional CSS URLs to include
	 */
	cssUrls?: string[]

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
	 * Whether to print immediately on mount
	 * @default false
	 */
	immediate?: boolean

	/**
	 * Print target selector
	 * If not specified, prints the element itself
	 */
	target?: string

	/**
	 * Whether to print in a new window
	 * @default false
	 */
	newWindow?: boolean

	/**
	 * Custom class for print container
	 */
	printClass?: string
}

/**
 * Directive binding value type
 */
export type PrintBinding = PrintOptions | boolean

/**
 * Element state storage
 */
interface PrintState {
	options: PrintOptions
	clickHandler: (() => void) | null
}

/**
 * v-print directive
 *
 * Prints the element content when clicked or immediately.
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Print on click -->
 *   <button v-print>Print Page</button>
 *
 *   <!-- Print specific element -->
 *   <button v-print="{ target: '#content' }">Print Content</button>
 *
 *   <!-- Print with custom title -->
 *   <button v-print="{ title: 'My Document', styles: 'body { font-size: 12px }' }">
 *     Print
 *   </button>
 *
 *   <!-- Print immediately on mount -->
 *   <div v-print="{ immediate: true }">Auto print</div>
 * </template>
 * ```
 */
export const vPrint = defineDirective<PrintBinding, HTMLElement>({
	name: 'print',
	ssr: true,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		const state: PrintState = {
			options,
			clickHandler: null,
		}

		;(el as any).__print = state

		// Print immediately if specified
		if (options.immediate) {
			setTimeout(() => printElement(el, options), 100)
			return
		}

		// Add click handler
		const clickHandler = () => {
			printElement(el, state.options)
		}

		el.addEventListener('click', clickHandler)
		state.clickHandler = clickHandler

		// Add cursor style
		el.style.cursor = 'pointer'
	},

	updated(el, binding) {
		const state: PrintState = (el as any).__print

		if (!state) return

		const newOptions = normalizeOptions(binding.value)
		state.options = newOptions
	},

	unmounted(el) {
		const state: PrintState | undefined = (el as any).__print

		if (!state) return

		if (state.clickHandler) {
			el.removeEventListener('click', state.clickHandler)
		}

		el.style.cursor = ''

		delete (el as any).__print
	},
})

/**
 * Normalize options
 */
function normalizeOptions(binding: PrintBinding | undefined): PrintOptions {
	if (binding === true) {
		return { immediate: true }
	}

	if (binding === false) {
		return {}
	}

	return binding || {}
}

/**
 * Print element
 */
async function printElement(triggerEl: HTMLElement, options: PrintOptions): Promise<void> {
	// Call before callback
	if (options.onBeforePrint) {
		const result = options.onBeforePrint()
		if (result === false) return
	}

	// Get target element
	const targetEl = options.target
		? document.querySelector(options.target)
		: triggerEl

	if (!targetEl) {
		console.warn('[Directix] v-print: Target element not found')
		return
	}

	// Create print window/iframe
	if (options.newWindow) {
		await printInNewWindow(targetEl as HTMLElement, options)
	} else {
		await printInIframe(targetEl as HTMLElement, options)
	}

	// Call after callback
	if (options.onAfterPrint) {
		options.onAfterPrint()
	}
}

/**
 * Print using iframe
 */
async function printInIframe(el: HTMLElement, options: PrintOptions): Promise<void> {
	// Create iframe
	const iframe = document.createElement('iframe')
	iframe.style.cssText = 'position: absolute; top: -10000px; left: -10000px; width: 0; height: 0; border: none;'
	document.body.appendChild(iframe)

	const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

	if (!iframeDoc) {
		console.warn('[Directix] v-print: Could not access iframe document')
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
		console.error('[Directix] v-print: Print failed', err)
	}

	// Cleanup after print
	setTimeout(() => {
		document.body.removeChild(iframe)
	}, 1000)
}

/**
 * Print in new window
 */
async function printInNewWindow(el: HTMLElement, options: PrintOptions): Promise<void> {
	const printWindow = window.open('', '_blank')

	if (!printWindow) {
		console.warn('[Directix] v-print: Could not open print window')
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
 * Build print content HTML
 */
function buildPrintContent(el: HTMLElement, options: PrintOptions): string {
	// Get all stylesheets
	let styles = ''

	// Include existing stylesheets
	document.querySelectorAll('style, link[rel="stylesheet"]').forEach(styleEl => {
		if (styleEl.tagName === 'STYLE') {
			styles += `<style>${styleEl.textContent}</style>`
		} else if (styleEl.tagName === 'LINK') {
			const href = (styleEl as HTMLLinkElement).href
			styles += `<link rel="stylesheet" href="${href}">`
		}
	})

	// Add custom CSS URLs
	if (options.cssUrls) {
		options.cssUrls.forEach(url => {
			styles += `<link rel="stylesheet" href="${url}">`
		})
	}

	// Add custom styles
	if (options.styles) {
		const customStyles = Array.isArray(options.styles)
			? options.styles.join('\n')
			: options.styles
		styles += `<style>${customStyles}</style>`
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
	const title = options.title || document.title || 'Print'
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

export default vPrint
