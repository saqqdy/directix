import { isBrowser } from '@directix/core'
import { onUnmounted, readonly, ref, type Ref, unref } from 'vue'

/**
 * Tooltip placement
 */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

/**
 * Tooltip trigger
 */
export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual'

/**
 * Options for useTooltip composable
 */
export interface UseTooltipOptions {
	/**
	 * Tooltip content
	 */
	content?: string | Ref<string>

	/**
	 * Tooltip placement
	 * @default 'top'
	 */
	placement?: TooltipPlacement

	/**
	 * Trigger type
	 * @default 'hover'
	 */
	trigger?: TooltipTrigger

	/**
	 * Show delay in milliseconds
	 * @default 0
	 */
	delay?: number

	/**
	 * Hide delay in milliseconds
	 * @default 0
	 */
	hideDelay?: number

	/**
	 * Whether to show arrow
	 * @default true
	 */
	arrow?: boolean

	/**
	 * Custom class for tooltip
	 */
	class?: string

	/**
	 * Callback when tooltip shows
	 */
	onShow?: () => void

	/**
	 * Callback when tooltip hides
	 */
	onHide?: () => void

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>
}

/**
 * Return type for useTooltip composable
 */
export interface UseTooltipReturn {
	/** Whether the tooltip is visible */
	isVisible: Readonly<Ref<boolean>>

	/** Show the tooltip */
	show: () => void

	/** Hide the tooltip */
	hide: () => void

	/** Toggle the tooltip */
	toggle: () => void

	/** Bind tooltip to an element */
	bind: (element: HTMLElement) => () => void
}

/**
 * Composable for tooltip functionality
 *
 * @param options - Configuration options
 * @returns Tooltip utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useTooltip } from 'directix'
 *
 * const buttonRef = ref(null)
 * const { isVisible, bind } = useTooltip({
 *   content: 'Tooltip text',
 *   placement: 'top'
 * })
 *
 * onMounted(() => bind(buttonRef.value))
 * </script>
 *
 * <template>
 *   <button ref="buttonRef">Hover me</button>
 * </template>
 * ```
 */
export function useTooltip(options: UseTooltipOptions = {}): UseTooltipReturn {
	const {
		content,
		placement = 'top',
		trigger = 'hover',
		delay = 0,
		hideDelay = 0,
		arrow = true,
		class: customClass,
		onShow,
		onHide,
		disabled = false,
	} = options

	const isVisible = ref(false)

	let currentElement: HTMLElement | null = null,
		tooltipEl: HTMLDivElement | null = null,
		showTimeout: ReturnType<typeof setTimeout> | null = null,
		hideTimeout: ReturnType<typeof setTimeout> | null = null

	const eventHandlers: Record<string, () => void> = {}

	function createTooltip(): HTMLDivElement {
		const tooltip = document.createElement('div')

		tooltip.className = `v-tooltip v-tooltip--${placement}${customClass ? ` ${customClass}` : ''}${arrow ? ' v-tooltip--arrow' : ''}`
		tooltip.style.cssText = `
      position: absolute;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
    `

		return tooltip
	}

	function positionTooltip(): void {
		if (!tooltipEl || !currentElement) return

		const elementRect = currentElement.getBoundingClientRect()
		const tooltipRect = tooltipEl.getBoundingClientRect()

		let top = 0,
			left = 0

		switch (placement) {
			case 'top':
				top = elementRect.top - tooltipRect.height - 8
				left = elementRect.left + (elementRect.width - tooltipRect.width) / 2
				break
			case 'bottom':
				top = elementRect.bottom + 8
				left = elementRect.left + (elementRect.width - tooltipRect.width) / 2
				break
			case 'left':
				top = elementRect.top + (elementRect.height - tooltipRect.height) / 2
				left = elementRect.left - tooltipRect.width - 8
				break
			case 'right':
				top = elementRect.top + (elementRect.height - tooltipRect.height) / 2
				left = elementRect.right + 8
				break
		}

		// Boundary check
		if (left < 0) left = 8
		if (left + tooltipRect.width > window.innerWidth) left = window.innerWidth - tooltipRect.width - 8
		if (top < 0) top = 8
		if (top + tooltipRect.height > window.innerHeight) top = window.innerHeight - tooltipRect.height - 8

		tooltipEl.style.top = `${top + window.scrollY}px`
		tooltipEl.style.left = `${left + window.scrollX}px`
	}

	function show(): void {
		if (unref(disabled) || !content) return

		// Clear hide timeout
		if (hideTimeout) {
			clearTimeout(hideTimeout)
			hideTimeout = null
		}

		if (delay > 0) {
			showTimeout = setTimeout(doShow, delay)
		} else {
			doShow()
		}
	}

	function doShow(): void {
		if (!currentElement) return

		// Create tooltip if not exists
		if (!tooltipEl) {
			tooltipEl = createTooltip()
			document.body.appendChild(tooltipEl)
		}

		// Set content
		tooltipEl.textContent = unref(content) ?? null

		// Position tooltip
		positionTooltip()

		// Show
		tooltipEl.style.opacity = '1'
		isVisible.value = true
		onShow?.()
	}

	function hide(): void {
		// Clear show timeout
		if (showTimeout) {
			clearTimeout(showTimeout)
			showTimeout = null
		}

		if (hideDelay > 0) {
			hideTimeout = setTimeout(doHide, hideDelay)
		} else {
			doHide()
		}
	}

	function doHide(): void {
		if (tooltipEl) {
			tooltipEl.style.opacity = '0'
		}
		isVisible.value = false
		onHide?.()
	}

	function toggle(): void {
		if (isVisible.value) {
			hide()
		} else {
			show()
		}
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		// Cleanup previous
		unbind()

		currentElement = element

		// Set up event handlers based on trigger
		if (trigger === 'hover') {
			eventHandlers.mouseenter = show
			eventHandlers.mouseleave = hide
			element.addEventListener('mouseenter', eventHandlers.mouseenter)
			element.addEventListener('mouseleave', eventHandlers.mouseleave)
		} else if (trigger === 'click') {
			eventHandlers.click = toggle
			element.addEventListener('click', eventHandlers.click)
		} else if (trigger === 'focus') {
			eventHandlers.focus = show
			eventHandlers.blur = hide
			element.addEventListener('focus', eventHandlers.focus)
			element.addEventListener('blur', eventHandlers.blur)
		}

		return unbind
	}

	function unbind(): void {
		// Remove event handlers
		if (currentElement) {
			Object.entries(eventHandlers).forEach(([event, handler]) => {
				currentElement!.removeEventListener(event, handler)
			})
		}

		// Remove tooltip
		if (tooltipEl) {
			tooltipEl.remove()
			tooltipEl = null
		}

		// Clear timeouts
		if (showTimeout) {
			clearTimeout(showTimeout)
			showTimeout = null
		}
		if (hideTimeout) {
			clearTimeout(hideTimeout)
			hideTimeout = null
		}

		currentElement = null
		isVisible.value = false
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		isVisible: readonly(isVisible),
		show,
		hide,
		toggle,
		bind,
	}
}
