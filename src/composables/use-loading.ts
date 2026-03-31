import { isBrowser } from '@directix/core'
import { onUnmounted, ref, type Ref, unref, watch } from 'vue'

/**
 * Options for useLoading composable
 */
export interface UseLoadingOptions {
	/**
	 * Initial loading state
	 * @default false
	 */
	initial?: boolean | Ref<boolean>

	/**
	 * Loading text to display
	 */
	text?: string | Ref<string>

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
}

/**
 * Return type for useLoading composable
 */
export interface UseLoadingReturn {
	/** Current loading state */
	loading: Ref<boolean>

	/** Start loading */
	start: () => void

	/** Stop loading */
	stop: () => void

	/** Toggle loading state */
	toggle: () => void

	/** Bind loading to an element */
	bind: (element: HTMLElement) => () => void
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
function createLoadingOverlay(
	options: {
		text?: string
		loadingClass?: string
		spinnerClass?: string
		textClass?: string
		spinner?: string
		background?: string
	},
): HTMLDivElement {
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
 * Composable for managing loading state
 *
 * @param options - Configuration options
 * @returns Loading utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useLoading } from 'directix'
 *
 * const containerRef = ref(null)
 * const { loading, start, stop, bind } = useLoading({
 *   text: 'Loading...',
 *   lock: true
 * })
 *
 * onMounted(() => bind(containerRef.value))
 *
 * async function fetchData() {
 *   start()
 *   await api.getData()
 *   stop()
 * }
 * </script>
 *
 * <template>
 *   <div ref="containerRef">
 *     <button @click="fetchData">Fetch Data</button>
 *   </div>
 * </template>
 * ```
 */
export function useLoading(options: UseLoadingOptions = {}): UseLoadingReturn {
	const {
		initial = false,
		text,
		loadingClass = 'v-loading',
		spinnerClass = 'v-loading__spinner',
		textClass = 'v-loading__text',
		spinner,
		background = 'rgba(255, 255, 255, 0.9)',
		lock = false,
	} = options

	const loading = ref(unref(initial))

	let currentElement: HTMLElement | null = null,
		loadingOverlay: HTMLDivElement | null = null,
		originalPosition = '',
		originalOverflow = ''

	function showLoading(): void {
		if (!currentElement || loadingOverlay) return

		// Create and append overlay
		loadingOverlay = createLoadingOverlay({
			text: unref(text),
			loadingClass,
			spinnerClass,
			textClass,
			spinner,
			background,
		})
		currentElement.appendChild(loadingOverlay)

		// Lock scroll if needed
		if (lock) {
			currentElement.style.overflow = 'hidden'
		}

		// Add class
		currentElement.classList.add('v-loading--active')
	}

	function hideLoading(): void {
		if (!currentElement || !loadingOverlay) return

		// Remove overlay
		loadingOverlay.remove()
		loadingOverlay = null

		// Restore scroll
		if (lock) {
			currentElement.style.overflow = originalOverflow
		}

		// Remove class
		currentElement.classList.remove('v-loading--active')
	}

	function start(): void {
		loading.value = true
	}

	function stop(): void {
		loading.value = false
	}

	function toggle(): void {
		loading.value = !loading.value
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		unbind()

		currentElement = element

		// Store original styles
		originalPosition = element.style.position
		originalOverflow = element.style.overflow

		// Ensure element has relative positioning
		const computedStyle = getComputedStyle(element)
		if (computedStyle.position === 'static') {
			element.style.position = 'relative'
		}

		// Show loading if initial state is true
		if (loading.value) {
			showLoading()
		}

		return unbind
	}

	function unbind(): void {
		hideLoading()
		if (currentElement) {
			currentElement.style.position = originalPosition
			currentElement.style.overflow = originalOverflow
		}
		currentElement = null
	}

	// Watch for loading state changes
	watch(loading, newValue => {
		if (newValue) {
			showLoading()
		} else {
			hideLoading()
		}
	})

	// Watch for text changes
	if (typeof text === 'object' && 'value' in text) {
		watch(text, newText => {
			if (loadingOverlay) {
				const textEl = loadingOverlay.querySelector(`.${textClass}`)
				if (textEl) {
					textEl.textContent = newText || ''
				}
			}
		})
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		loading,
		start,
		stop,
		toggle,
		bind,
	}
}
