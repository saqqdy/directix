import { defineDirective, isBrowser } from '@directix/core'

/**
 * Progress bar position
 */
export type ProgressPosition = 'top' | 'bottom'

/**
 * Progress directive options
 */
export interface ProgressOptions {
	/**
	 * Current progress value (0-100)
	 */
	value: number

	/**
	 * Maximum value
	 * @default 100
	 */
	max?: number

	/**
	 * Minimum value
	 * @default 0
	 */
	min?: number

	/**
	 * Progress bar height
	 * @default 4
	 */
	height?: number

	/**
	 * Progress bar color
	 * @default '#42b883'
	 */
	color?: string

	/**
	 * Background color
	 * @default 'rgba(0, 0, 0, 0.1)'
	 */
	backgroundColor?: string

	/**
	 * Transition duration in milliseconds
	 * @default 300
	 */
	duration?: number

	/**
	 * Whether to show percentage text
	 * @default false
	 */
	showText?: boolean

	/**
	 * Whether to animate on mount
	 * @default true
	 */
	animate?: boolean

	/**
	 * Indeterminate mode
	 * @default false
	 */
	indeterminate?: boolean

	/**
	 * Stripe pattern
	 * @default false
	 */
	striped?: boolean

	/**
	 * Animate stripes
	 * @default false
	 */
	animated?: boolean

	/**
	 * Position (top or bottom of container)
	 * @default 'top'
	 */
	position?: ProgressPosition

	/**
	 * Custom class
	 */
	class?: string

	/**
	 * Callback when progress changes
	 */
	onChange?: (value: number, percent: number) => void

	/**
	 * Callback when animation completes
	 */
	onComplete?: () => void
}

/**
 * Directive binding value type
 */
export type ProgressBinding = number | ProgressOptions

/**
 * Element state storage
 */
interface ProgressState {
	options: ProgressOptions
	progressBar: HTMLDivElement | null
	container: HTMLDivElement | null
	currentValue: number
}

/**
 * Normalize options
 */
function normalizeOptions(binding: ProgressBinding | undefined): ProgressOptions {
	if (typeof binding === 'number') {
		return { value: binding }
	}

	return {
		value: 0,
		max: 100,
		min: 0,
		height: 4,
		color: '#42b883',
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		duration: 300,
		showText: false,
		animate: true,
		indeterminate: false,
		striped: false,
		animated: false,
		position: 'top',
		...(binding || {}),
	}
}

/**
 * Create progress bar container
 */
function createProgressContainer(options: ProgressOptions): { container: HTMLDivElement, progressBar: HTMLDivElement } {
	const container = document.createElement('div')
	container.className = `v-progress ${options.class || ''}`

	container.style.cssText = `
    position: absolute;
    ${options.position === 'bottom' ? 'bottom' : 'top'}: 0;
    left: 0;
    right: 0;
    height: ${options.height}px;
    background: ${options.backgroundColor};
    overflow: hidden;
    z-index: 1000;
  `

	const progressBar = document.createElement('div')
	progressBar.className = 'v-progress__bar'

	let barStyle = `
    height: 100%;
    background-color: ${options.color};
    transition: ${options.animate !== false ? `width ${options.duration}ms ease` : 'none'};
    width: 0%;
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

	// Add animation for indeterminate or animated stripes
	if (options.indeterminate) {
		progressBar.classList.add('v-progress--indeterminate')
		progressBar.style.width = '30%'
		progressBar.style.animation = 'v-progress-indeterminate 1.5s infinite linear'
	} else if (options.animated) {
		progressBar.style.animation = 'v-progress-stripes 1s linear infinite'
	}

	container.appendChild(progressBar)

	// Add text if enabled
	if (options.showText) {
		const textEl = document.createElement('span')
		textEl.className = 'v-progress__text'
		textEl.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: ${Math.max((options.height || 4) - 2, 10)}px;
      color: #fff;
      text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    `
		container.appendChild(textEl)
	}

	return { container, progressBar }
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
 * v-progress directive
 * Progress bar animation
 *
 * @example
 * ```vue
 * <template>
 *   <div v-progress="50">Progress at 50%</div>
 *
 *   <div v-progress="{
 *     value: progressValue,
 *     color: '#42b883',
 *     height: 8,
 *     showText: true
 *   }">
 *     Content
 *   </div>
 *
 *   <div v-progress="{ indeterminate: true }">
 *     Loading...
 *   </div>
 * </template>
 * ```
 */
export const vProgress = defineDirective<ProgressBinding, HTMLElement>({
	name: 'progress',
	ssr: false,

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)

		ensureStyles()

		// Ensure parent has position
		const computedStyle = getComputedStyle(el)
		if (computedStyle.position === 'static') {
			el.style.position = 'relative'
		}

		const { container, progressBar } = createProgressContainer(options)

		const state: ProgressState = {
			options,
			progressBar,
			container,
			currentValue: 0,
		}

		;(el as any).__progress = state

		el.appendChild(container)

		// Set initial progress
		if (!options.indeterminate) {
			setProgress(state, options.value)
		}

		el.classList.add('v-progress-container')
	},

	updated(el, binding) {
		const state: ProgressState = (el as any).__progress

		if (!state) return

		const oldOptions = state.options
		const newOptions = normalizeOptions(binding.value)

		state.options = newOptions

		// Update styles
		if (state.container) {
			state.container.style.height = `${newOptions.height}px`
			state.container.style.background = newOptions.backgroundColor || 'rgba(0, 0, 0, 0.1)'
		}

		if (state.progressBar) {
			state.progressBar.style.backgroundColor = newOptions.color || '#42b883'
		}

		// Handle indeterminate state change
		if (oldOptions.indeterminate !== newOptions.indeterminate && state.progressBar) {
			if (newOptions.indeterminate) {
				// Start indeterminate animation
				state.progressBar.classList.add('v-progress--indeterminate')
				state.progressBar.style.width = '30%'
				state.progressBar.style.animation = 'v-progress-indeterminate 1.5s infinite linear'
			} else {
				// Stop indeterminate animation
				state.progressBar.classList.remove('v-progress--indeterminate')
				state.progressBar.style.animation = ''
				// Set to current value
				setProgress(state, newOptions.value)
			}
		} else if (!newOptions.indeterminate && newOptions.value !== oldOptions.value) {
			// Update progress value
			setProgress(state, newOptions.value)
		}
	},

	unmounted(el) {
		const state: ProgressState = (el as any).__progress

		if (!state) return

		if (state.container && state.container.parentNode) {
			state.container.parentNode.removeChild(state.container)
		}

		el.classList.remove('v-progress-container')
		delete (el as any).__progress
	},
})

/**
 * Set progress value
 */
function setProgress(state: ProgressState, value: number): void {
	const { options, progressBar, container } = state

	if (!progressBar || !container) return

	const min = options.min || 0
	const max = options.max || 100
	const clampedValue = Math.max(min, Math.min(max, value))
	const percent = ((clampedValue - min) / (max - min)) * 100

	progressBar.style.width = `${percent}%`

	// Update text
	if (options.showText) {
		const textEl = container.querySelector('.v-progress__text') as HTMLSpanElement
		if (textEl) {
			textEl.textContent = `${Math.round(percent)}%`
		}
	}

	state.currentValue = clampedValue
	options.onChange?.(clampedValue, percent)

	// Check for completion
	if (percent >= 100) {
		options.onComplete?.()
	}
}

export default vProgress
