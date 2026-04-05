import { isBrowser } from '@directix/core'
import { computed, onUnmounted, type Ref, ref, unref, watch } from 'vue'

/**
 * Options for useProgress composable
 */
export interface UseProgressOptions {
	/** Current progress value */
	value?: number | Ref<number>

	/** Maximum value */
	max?: number

	/** Minimum value */
	min?: number

	/** Progress bar height */
	height?: number

	/** Progress bar color */
	color?: string

	/** Background color */
	backgroundColor?: string

	/** Transition duration */
	duration?: number

	/** Show percentage text */
	showText?: boolean

	/** Indeterminate mode */
	indeterminate?: boolean | Ref<boolean>

	/** Striped pattern */
	striped?: boolean

	/** Animate stripes */
	animated?: boolean

	/** Callback on change */
	onChange?: (value: number, percent: number) => void

	/** Callback on complete */
	onComplete?: () => void
}

/**
 * Return type for useProgress composable
 */
export interface UseProgressReturn {
	/** Current value */
	value: Ref<number>

	/** Current percentage */
	percent: Ref<number>

	/** Set progress value */
	setValue: (value: number) => void

	/** Increment progress */
	increment: (amount?: number) => void

	/** Decrement progress */
	decrement: (amount?: number) => void

	/** Reset to minimum */
	reset: () => void

	/** Bind progress to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Ensure global styles
 */
function ensureStyles(): void {
	if (!isBrowser()) return

	const styleId = 'v-progress-styles'
	if (document.getElementById(styleId)) return

	const style = document.createElement('style')
	style.id = styleId
	style.textContent = `
    @keyframes v-progress-stripes {
      from { background-position: 1rem 0; }
      to { background-position: 0 0; }
    }
    @keyframes v-progress-indeterminate {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(400%); }
    }
    .v-progress--indeterminate {
      position: absolute;
      width: 30% !important;
    }
  `

	document.head.appendChild(style)
}

/**
 * Composable for progress bar
 *
 * @param options - Configuration options
 * @returns Progress utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useProgress } from 'directix'
 *
 * const containerRef = ref(null)
 * const { value, percent, setValue, bind } = useProgress({ value: 50 })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef">
 *     <button @click="increment(10)">+10%</button>
 *   </div>
 * </template>
 * ```
 */
export function useProgress(options: UseProgressOptions = {}): UseProgressReturn {
	const value = ref(unref(options.value) ?? 0)
	const max = options.max ?? 100
	const min = options.min ?? 0

	const percent = computed(() => {
		const v = Math.max(min, Math.min(max, value.value))
		return ((v - min) / (max - min)) * 100
	})

	let currentElement: HTMLElement | null = null,
		container: HTMLDivElement | null = null,
		progressBar: HTMLDivElement | null = null,
		textEl: HTMLSpanElement | null = null

	function createProgressElement(): void {
		if (!currentElement) return

		ensureStyles()

		const height = options.height || 4
		const color = options.color || '#42b883'
		const bgColor = options.backgroundColor || 'rgba(0, 0, 0, 0.1)'
		const duration = options.duration || 300

		// Create container
		container = document.createElement('div')
		container.className = 'v-progress'
		container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: ${height}px;
      background: ${bgColor};
      overflow: hidden;
      z-index: 1000;
    `

		// Create progress bar
		progressBar = document.createElement('div')
		progressBar.className = 'v-progress__bar'

		let barStyle = `
      height: 100%;
      background: ${color};
      transition: width ${duration}ms ease;
      width: ${percent.value}%;
    `

		if (options.striped) {
			barStyle += `
        background-image: linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.15) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.15) 75%,
          transparent 75%,
          transparent
        );
        background-size: 1rem 1rem;
      `
		}

		progressBar.style.cssText = barStyle

		if (unref(options.indeterminate)) {
			progressBar.classList.add('v-progress--indeterminate')
			progressBar.style.width = '30%'
			progressBar.style.animation = 'v-progress-indeterminate 1.5s infinite linear'
		} else if (options.animated) {
			progressBar.style.animation = 'v-progress-stripes 1s linear infinite'
		}

		container.appendChild(progressBar)

		// Add text if enabled
		if (options.showText) {
			textEl = document.createElement('span')
			textEl.className = 'v-progress__text'
			textEl.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: ${Math.max(height - 2, 10)}px;
        color: #fff;
        text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
      `
			textEl.textContent = `${Math.round(percent.value)}%`
			container.appendChild(textEl)
		}

		currentElement.appendChild(container)
	}

	function updateProgress(): void {
		if (!progressBar) return

		if (!unref(options.indeterminate)) {
			progressBar.style.width = `${percent.value}%`

			if (textEl) {
				textEl.textContent = `${Math.round(percent.value)}%`
			}

			options.onChange?.(value.value, percent.value)

			if (percent.value >= 100) {
				options.onComplete?.()
			}
		}
	}

	function setValue(newValue: number): void {
		value.value = Math.max(min, Math.min(max, newValue))
		updateProgress()
	}

	function increment(amount: number = 1): void {
		setValue(value.value + amount)
	}

	function decrement(amount: number = 1): void {
		setValue(value.value - amount)
	}

	function reset(): void {
		setValue(min)
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element

		// Ensure parent has position
		const computedStyle = getComputedStyle(element)
		if (computedStyle.position === 'static') {
			element.style.position = 'relative'
		}

		createProgressElement()

		element.classList.add('v-progress-container')

		// Watch for indeterminate changes
		if (typeof options.indeterminate !== 'boolean' && options.indeterminate) {
			watch(options.indeterminate, newVal => {
				if (progressBar) {
					if (newVal) {
						progressBar.classList.add('v-progress--indeterminate')
						progressBar.style.width = '30%'
						progressBar.style.animation = 'v-progress-indeterminate 1.5s infinite linear'
					} else {
						progressBar.classList.remove('v-progress--indeterminate')
						progressBar.style.animation = options.animated ? 'v-progress-stripes 1s linear infinite' : ''
						updateProgress()
					}
				}
			})
		}

		return unbind
	}

	function unbind(): void {
		if (container && container.parentNode) {
			container.parentNode.removeChild(container)
		}
		if (currentElement) {
			currentElement.classList.remove('v-progress-container')
		}
		container = null
		progressBar = null
		textEl = null
		currentElement = null
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		value,
		percent,
		setValue,
		increment,
		decrement,
		reset,
		bind,
	}
}
