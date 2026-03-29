import { defineDirective, isBrowser } from '@directix/core'

/**
 * Loading directive options
 */
export interface LoadingOptions {
	/**
	 * Loading state
	 * @default true
	 */
	value?: boolean

	/**
	 * Loading text to display
	 */
	text?: string

	/**
	 * CSS class for loading overlay
	 * @default 'v-loading'
	 */
	loadingClass?: string

	/**
	 * CSS class for loading spinner
	 * @default 'v-loading__spinner'
	 */
	spinnerClass?: string

	/**
	 * CSS class for loading text
	 * @default 'v-loading__text'
	 */
	textClass?: string

	/**
	 * Custom spinner HTML
	 */
	spinner?: string

	/**
	 * Background color
	 * @default 'rgba(255, 255, 255, 0.9)'
	 */
	background?: string

	/**
	 * Whether to lock scroll while loading
	 * @default false
	 */
	lock?: boolean

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean
}

/**
 * Directive binding value type
 */
export type LoadingBinding = boolean | LoadingOptions

/**
 * Element state storage
 */
interface LoadingState {
	options: LoadingOptions
	loadingOverlay: HTMLDivElement | null
	originalPosition: string
	originalOverflow: string
}

/**
 * Normalize options
 */
function normalizeOptions(binding: LoadingBinding | undefined): LoadingOptions {
	if (typeof binding === 'boolean') {
		return { value: binding }
	}

	return {
		value: true,
		loadingClass: 'v-loading',
		spinnerClass: 'v-loading__spinner',
		textClass: 'v-loading__text',
		background: 'rgba(255, 255, 255, 0.9)',
		lock: false,
		disabled: false,
		...binding,
	}
}

/**
 * Default spinner HTML
 */
const DEFAULT_SPINNER = `
<svg class="v-loading__circular" viewBox="25 25 50 50">
  <circle class="v-loading__path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
</svg>
`

/**
 * Create loading overlay element
 */
function createLoadingOverlay(options: LoadingOptions): HTMLDivElement {
	const overlay = document.createElement('div')

	overlay.className = options.loadingClass || 'v-loading'
	overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: ${options.background || 'rgba(255, 255, 255, 0.9)'};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `

	// Add spinner
	const spinnerHtml = options.spinner || DEFAULT_SPINNER
	const spinnerContainer = document.createElement('div')

	spinnerContainer.className = options.spinnerClass || 'v-loading__spinner'
	spinnerContainer.innerHTML = spinnerHtml
	overlay.appendChild(spinnerContainer)

	// Add text
	if (options.text) {
		const textEl = document.createElement('div')

		textEl.className = options.textClass || 'v-loading__text'
		textEl.textContent = options.text
		overlay.appendChild(textEl)
	}

	return overlay
}

/**
 * v-loading directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-loading="isLoading">Content</div>
 *   <div v-loading="{ value: isLoading, text: 'Loading...' }">Content</div>
 *   <div v-loading="{ value: isLoading, lock: true }">Locked scroll while loading</div>
 * </template>
 * ```
 */
export const vLoading = defineDirective<LoadingBinding, HTMLElement>({
	name: 'loading',
	ssr: true, // SSR safe - will skip DOM manipulation on server
	defaults: {
		value: true,
		loadingClass: 'v-loading',
		spinnerClass: 'v-loading__spinner',
		textClass: 'v-loading__text',
		background: 'rgba(255, 255, 255, 0.9)',
		lock: false,
		disabled: false,
	},

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)

		if (options.disabled) return

		// Ensure element has relative positioning
		const computedStyle = getComputedStyle(el)

		const originalPosition = el.style.position
		const originalOverflow = el.style.overflow

		const state: LoadingState = {
			options,
			loadingOverlay: null,
			originalPosition,
			originalOverflow,
		}

		// Store state
		;(el as any).__loading = state

		if (computedStyle.position === 'static') {
			el.style.position = 'relative'
		}

		// Show loading if value is true
		if (options.value) {
			showLoading(el, state)
		}
	},

	updated(el, binding) {
		const state: LoadingState = (el as any).__loading

		if (!state) return

		const newOptions = normalizeOptions(binding.value)

		if (newOptions.disabled) {
			hideLoading(el, state)

			return
		}

		// Handle loading state change
		if (newOptions.value && !state.options.value) {
			showLoading(el, state)
		} else if (!newOptions.value && state.options.value) {
			hideLoading(el, state)
		}

		// Update text if changed
		if (state.loadingOverlay && newOptions.text !== state.options.text) {
			const textEl = state.loadingOverlay.querySelector(`.${state.options.textClass}`)

			if (textEl) {
				textEl.textContent = newOptions.text || ''
			}
		}

		state.options = newOptions
	},

	unmounted(el) {
		const state: LoadingState = (el as any).__loading

		if (!state) return

		hideLoading(el, state)

		// Restore original styles
		el.style.position = state.originalPosition
		el.style.overflow = state.originalOverflow

		delete (el as any).__loading
	},
})

/**
 * Show loading overlay
 */
function showLoading(el: HTMLElement, state: LoadingState): void {
	if (state.loadingOverlay) return

	// Create and append overlay
	state.loadingOverlay = createLoadingOverlay(state.options)
	el.appendChild(state.loadingOverlay)

	// Lock scroll if needed
	if (state.options.lock) {
		el.style.overflow = 'hidden'
	}

	// Add class
	el.classList.add('v-loading--active')
}

/**
 * Hide loading overlay
 */
function hideLoading(el: HTMLElement, state: LoadingState): void {
	if (!state.loadingOverlay) return

	// Remove overlay
	state.loadingOverlay.remove()
	state.loadingOverlay = null

	// Restore scroll
	if (state.options.lock) {
		el.style.overflow = state.originalOverflow
	}

	// Remove class
	el.classList.remove('v-loading--active')
}

export default vLoading
