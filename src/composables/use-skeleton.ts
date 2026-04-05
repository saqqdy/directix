import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, ref, unref, watch } from 'vue'

/**
 * Skeleton animation type
 */
export type SkeletonAnimation = 'wave' | 'pulse' | 'none'

/**
 * Options for useSkeleton composable
 */
export interface UseSkeletonOptions {
	/** Whether to show skeleton loading state */
	loading?: boolean | Ref<boolean>

	/** Animation type */
	animation?: SkeletonAnimation

	/** Skeleton width */
	width?: string | number

	/** Skeleton height */
	height?: string | number

	/** Border radius */
	radius?: string | number

	/** Skeleton color */
	color?: string

	/** Animation color */
	animationColor?: string

	/** Custom class */
	class?: string
}

/**
 * Return type for useSkeleton composable
 */
export interface UseSkeletonReturn {
	/** Whether skeleton is currently showing */
	isLoading: Ref<boolean>

	/** Show skeleton */
	show: () => void

	/** Hide skeleton */
	hide: () => void

	/** Toggle skeleton */
	toggle: () => void

	/** Bind skeleton to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Ensure global styles
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
 * Create skeleton element
 */
function createSkeletonElement(options: UseSkeletonOptions): HTMLDivElement {
	const skeleton = document.createElement('div')
	skeleton.className = `v-skeleton ${options.class || ''}`

	const width = typeof options.width === 'number' ? `${options.width}px` : options.width || '100%'
	const height = typeof options.height === 'number' ? `${options.height}px` : options.height || '1em'
	const radius = typeof options.radius === 'number' ? `${options.radius}px` : options.radius || '4px'

	let animationStyle = ''

	if (options.animation === 'wave') {
		animationStyle = `
      background: linear-gradient(90deg, ${options.color || '#e8e8e8'} 25%, ${options.animationColor || '#f0f0f0'} 50%, ${options.color || '#e8e8e8'} 75%);
      background-size: 200% 100%;
      animation: skeleton-wave 1.5s ease-in-out infinite;
    `
	} else if (options.animation === 'pulse') {
		animationStyle = `
      background: ${options.color || '#e8e8e8'};
      animation: skeleton-pulse 1.5s ease-in-out infinite;
    `
	} else {
		animationStyle = `background: ${options.color || '#e8e8e8'};`
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
 * Composable for skeleton loading states
 *
 * @param options - Configuration options
 * @returns Skeleton utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useSkeleton } from 'directix'
 *
 * const containerRef = ref(null)
 * const loading = ref(true)
 * const { isLoading, bind } = useSkeleton({ loading, animation: 'wave' })
 *
 * onMounted(() => bind(containerRef.value))
 *
 * // Later: loading.value = false
 * </script>
 *
 * <template>
 *   <div ref="containerRef">
 *     <p>Content here</p>
 *   </div>
 * </template>
 * ```
 */
export function useSkeleton(options: UseSkeletonOptions = {}): UseSkeletonReturn {
	const isLoading = ref(unref(options.loading) ?? true)

	let currentElement: HTMLElement | null = null,
		skeletonElement: HTMLDivElement | null = null,
		originalDisplay = ''

	function show(): void {
		isLoading.value = true
		updateSkeleton()
	}

	function hide(): void {
		isLoading.value = false
		updateSkeleton()
	}

	function toggle(): void {
		isLoading.value = !isLoading.value
		updateSkeleton()
	}

	function updateSkeleton(): void {
		if (!currentElement) return

		if (isLoading.value) {
			// Hide original content
			originalDisplay = currentElement.style.display || getComputedStyle(currentElement).display
			currentElement.style.display = 'none'

			// Create and insert skeleton
			if (!skeletonElement) {
				skeletonElement = createSkeletonElement({
					...options,
					width: options.width ?? currentElement.offsetWidth,
					height: options.height ?? currentElement.offsetHeight,
				})
			}
			if (!skeletonElement.parentNode) {
				currentElement.parentNode?.insertBefore(skeletonElement, currentElement.nextSibling)
			}
		} else {
			// Show original content
			currentElement.style.display = originalDisplay

			// Remove skeleton
			if (skeletonElement && skeletonElement.parentNode) {
				skeletonElement.parentNode.removeChild(skeletonElement)
			}
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		ensureStyles()

		unbind()

		currentElement = element
		element.classList.add('v-skeleton-container')

		if (isLoading.value) {
			updateSkeleton()
		}

		// Watch for loading changes
		if (options.loading && typeof options.loading !== 'boolean') {
			watch(options.loading, () => {
				isLoading.value = unref(options.loading) ?? false
				updateSkeleton()
			})
		}

		return unbind
	}

	function unbind(): void {
		if (skeletonElement && skeletonElement.parentNode) {
			skeletonElement.parentNode.removeChild(skeletonElement)
		}
		if (currentElement) {
			currentElement.style.display = originalDisplay
			currentElement.classList.remove('v-skeleton-container')
		}
		skeletonElement = null
		currentElement = null
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		isLoading,
		show,
		hide,
		toggle,
		bind,
	}
}
