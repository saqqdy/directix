import { defineDirective, isBrowser } from '@directix/core'

/**
 * Skeleton animation type
 */
export type SkeletonAnimation = 'wave' | 'pulse' | 'none'

/**
 * Skeleton directive options
 */
export interface SkeletonOptions {
	/**
	 * Whether to show skeleton loading state
	 * @default true
	 */
	loading?: boolean

	/**
	 * Animation type
	 * @default 'wave'
	 */
	animation?: SkeletonAnimation

	/**
	 * Skeleton width
	 * @default '100%'
	 */
	width?: string | number

	/**
	 * Skeleton height
	 * @default '1em'
	 */
	height?: string | number

	/**
	 * Border radius
	 * @default '4px'
	 */
	radius?: string | number

	/**
	 * Skeleton color
	 * @default '#e8e8e8'
	 */
	color?: string

	/**
	 * Animation color (for wave effect)
	 * @default '#f0f0f0'
	 */
	animationColor?: string

	/**
	 * Custom class for skeleton element
	 */
	class?: string

	/**
	 * Whether to preserve the original content dimensions
	 * @default true
	 */
	preserveDimensions?: boolean
}

/**
 * Directive binding value type
 */
export type SkeletonBinding = boolean | SkeletonOptions

/**
 * Element state storage
 */
interface SkeletonState {
	options: SkeletonOptions
	originalDisplay: string
	originalWidth: string
	originalHeight: string
	skeletonEl: HTMLDivElement | null
}

/**
 * Default skeleton options
 */
const defaultOptions: SkeletonOptions = {
	loading: true,
	animation: 'wave',
	width: '100%',
	height: '1em',
	radius: '4px',
	color: '#e8e8e8',
	animationColor: '#f0f0f0',
	preserveDimensions: true,
}

/**
 * Normalize options
 */
function normalizeOptions(binding: SkeletonBinding | undefined): SkeletonOptions {
	if (typeof binding === 'boolean') {
		return { ...defaultOptions, loading: binding }
	}

	return { ...defaultOptions, ...binding }
}

/**
 * Create skeleton element
 */
function createSkeleton(options: SkeletonOptions): HTMLDivElement {
	const skeleton = document.createElement('div')
	skeleton.className = `v-skeleton ${options.class || ''}`

	const width = typeof options.width === 'number' ? `${options.width}px` : options.width
	const height = typeof options.height === 'number' ? `${options.height}px` : options.height
	const radius = typeof options.radius === 'number' ? `${options.radius}px` : options.radius

	let animationStyle = ''

	if (options.animation === 'wave') {
		animationStyle = `
      background: linear-gradient(90deg, ${options.color} 25%, ${options.animationColor} 50%, ${options.color} 75%);
      background-size: 200% 100%;
      animation: skeleton-wave 1.5s ease-in-out infinite;
    `
	} else if (options.animation === 'pulse') {
		animationStyle = `
      background: ${options.color};
      animation: skeleton-pulse 1.5s ease-in-out infinite;
    `
	} else {
		animationStyle = `background: ${options.color};`
	}

	skeleton.style.cssText = `
    width: ${width};
    height: ${height};
    border-radius: ${radius};
    ${animationStyle}
  `

	return skeleton
}

/**
 * Add global styles if not present
 */
function ensureStyles(): void {
	if (!isBrowser()) return

	const styleId = 'v-skeleton-styles'

	if (document.getElementById(styleId)) return

	const style = document.createElement('style')
	style.id = styleId
	style.textContent = `
    @keyframes skeleton-wave {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `

	document.head.appendChild(style)
}

/**
 * v-skeleton directive
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Basic usage -->
 *   <div v-skeleton="isLoading">Content here</div>
 *
 *   <!-- With options -->
 *   <div v-skeleton="{ loading: isLoading, animation: 'pulse', width: 200, height: 20 }">
 *     Content here
 *   </div>
 *
 *   <!-- Multiple skeleton lines -->
 *   <div v-skeleton="{ loading: isLoading, height: '1em' }">Line 1</div>
 *   <div v-skeleton="{ loading: isLoading, height: '1em' }">Line 2</div>
 * </template>
 * ```
 */
export const vSkeleton = defineDirective<SkeletonBinding, HTMLElement>({
	name: 'skeleton',
	ssr: true,

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)

		ensureStyles()

		const state: SkeletonState = {
			options,
			originalDisplay: getComputedStyle(el).display,
			originalWidth: el.style.width,
			originalHeight: el.style.height,
			skeletonEl: null,
		}

		;(el as any).__skeleton = state

		if (options.loading) {
			showSkeleton(el, state)
		}

		el.classList.add('v-skeleton-container')
	},

	updated(el, binding) {
		const state: SkeletonState = (el as any).__skeleton

		if (!state) return

		const newOptions = normalizeOptions(binding.value)
		const wasLoading = state.options.loading

		state.options = newOptions

		if (newOptions.loading && !wasLoading) {
			showSkeleton(el, state)
		} else if (!newOptions.loading && wasLoading) {
			hideSkeleton(el, state)
		}
	},

	unmounted(el) {
		const state: SkeletonState = (el as any).__skeleton

		if (!state) return

		// Remove skeleton element
		if (state.skeletonEl && state.skeletonEl.parentNode) {
			state.skeletonEl.parentNode.removeChild(state.skeletonEl)
		}

		el.classList.remove('v-skeleton-container')
		el.style.display = state.originalDisplay
		el.style.width = state.originalWidth
		el.style.height = state.originalHeight

		delete (el as any).__skeleton
	},
})

/**
 * Show skeleton
 */
function showSkeleton(el: HTMLElement, state: SkeletonState): void {
	const options = state.options

	// Store original styles
	state.originalDisplay = el.style.display || getComputedStyle(el).display

	if (options.preserveDimensions) {
		const computedStyle = getComputedStyle(el)
		if (!state.originalWidth) {
			state.originalWidth = el.style.width
		}
		if (!state.originalHeight) {
			state.originalHeight = el.style.height
		}
		options.width = computedStyle.width
		options.height = computedStyle.height
	}

	// Hide original content
	el.style.display = 'none'

	// Create and insert skeleton
	state.skeletonEl = createSkeleton(options)
	el.parentNode?.insertBefore(state.skeletonEl, el.nextSibling)
}

/**
 * Hide skeleton
 */
function hideSkeleton(el: HTMLElement, state: SkeletonState): void {
	// Remove skeleton element
	if (state.skeletonEl && state.skeletonEl.parentNode) {
		state.skeletonEl.parentNode.removeChild(state.skeletonEl)
		state.skeletonEl = null
	}

	// Restore original content
	el.style.display = state.originalDisplay
	el.style.width = state.originalWidth
	el.style.height = state.originalHeight
}

export default vSkeleton
