import { isBrowser } from '@directix/core'
import { onUnmounted, ref, type Ref, unref } from 'vue'

/**
 * Options for useHover composable
 */
export interface UseHoverOptions {
	/**
	 * Callback when mouse enters
	 */
	onEnter?: (event: MouseEvent) => void

	/**
	 * Callback when mouse leaves
	 */
	onLeave?: (event: MouseEvent) => void

	/**
	 * CSS class to add when hovering
	 */
	class?: string

	/**
	 * Delay in milliseconds before triggering enter
	 * @default 0
	 */
	enterDelay?: number | Ref<number>

	/**
	 * Delay in milliseconds before triggering leave
	 * @default 0
	 */
	leaveDelay?: number | Ref<number>
}

/**
 * Return type for useHover composable
 */
export interface UseHoverReturn {
	/**
	 * Whether the element is currently being hovered
	 */
	isHovering: Readonly<Ref<boolean>>

	/**
	 * Bind events to an element
	 */
	bind: (element: HTMLElement) => () => void
}

/**
 * Composable for tracking hover state
 *
 * @param options - Configuration options
 * @returns Hover utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useHover } from 'directix'
 *
 * const buttonRef = ref()
 * const { isHovering, bind } = useHover({
 *   onEnter: () => console.log('Mouse entered'),
 *   onLeave: () => console.log('Mouse left'),
 *   enterDelay: 100
 * })
 *
 * onMounted(() => {
 *   const unbind = bind(buttonRef.value)
 *   onUnmounted(unbind)
 * })
 * </script>
 *
 * <template>
 *   <button ref="buttonRef" :class="{ 'is-hovering': isHovering }">
 *     Hover Me
 *   </button>
 * </template>
 * ```
 */
export function useHover(options: UseHoverOptions = {}): UseHoverReturn {
	const {
		onEnter,
		onLeave,
		class: hoverClass,
		enterDelay = 0,
		leaveDelay = 0,
	} = options

	const isHovering = ref(false)

	let enterTimerId: ReturnType<typeof setTimeout> | null = null,
		leaveTimerId: ReturnType<typeof setTimeout> | null = null,
		currentElement: HTMLElement | null = null

	function clearTimers(): void {
		if (enterTimerId) {
			clearTimeout(enterTimerId)
			enterTimerId = null
		}
		if (leaveTimerId) {
			clearTimeout(leaveTimerId)
			leaveTimerId = null
		}
	}

	function handleMouseEnter(event: MouseEvent): void {
		// Clear leave timer if exists
		if (leaveTimerId) {
			clearTimeout(leaveTimerId)
			leaveTimerId = null
		}

		// If already hovering, do nothing
		if (isHovering.value) return

		// Handle enter delay
		const delay = unref(enterDelay)
		if (delay && delay > 0) {
			enterTimerId = setTimeout(() => {
				isHovering.value = true
				applyHoverState()
				onEnter?.(event)
				enterTimerId = null
			}, delay)
		} else {
			isHovering.value = true
			applyHoverState()
			onEnter?.(event)
		}
	}

	function handleMouseLeave(event: MouseEvent): void {
		// Clear enter timer if exists
		if (enterTimerId) {
			clearTimeout(enterTimerId)
			enterTimerId = null
		}

		// If not hovering, do nothing
		if (!isHovering.value) return

		// Handle leave delay
		const delay = unref(leaveDelay)
		if (delay && delay > 0) {
			leaveTimerId = setTimeout(() => {
				isHovering.value = false
				removeHoverState()
				onLeave?.(event)
				leaveTimerId = null
			}, delay)
		} else {
			isHovering.value = false
			removeHoverState()
			onLeave?.(event)
		}
	}

	function applyHoverState(): void {
		if (currentElement && hoverClass) {
			currentElement.classList.add(hoverClass)
		}
	}

	function removeHoverState(): void {
		if (currentElement && hoverClass) {
			currentElement.classList.remove(hoverClass)
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		currentElement = element

		element.addEventListener('mouseenter', handleMouseEnter)
		element.addEventListener('mouseleave', handleMouseLeave)

		// Return unbind function
		return () => {
			element.removeEventListener('mouseenter', handleMouseEnter)
			element.removeEventListener('mouseleave', handleMouseLeave)
			clearTimers()
			removeHoverState()
			currentElement = null
		}
	}

	// Cleanup on unmount
	onUnmounted(() => {
		clearTimers()
		removeHoverState()
	})

	return {
		isHovering,
		bind,
	}
}
