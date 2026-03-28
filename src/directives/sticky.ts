import { defineDirective, isBrowser } from '@directix/core'
import { getScrollParent, off, on } from '@directix/shared'

/**
 * Sticky directive options
 */
export interface StickyOptions {
	/**
	 * Top offset when sticky
	 * @default 0
	 */
	top?: number | string

	/**
	 * Bottom offset when sticky
	 */
	bottom?: number | string

	/**
	 * Z-index when sticky
	 * @default 100
	 */
	zIndex?: number

	/**
	 * CSS class to add when sticky
	 * @default 'v-sticky--fixed'
	 */
	stickyClass?: string

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Callback when sticky state changes
	 */
	onChange?: (isSticky: boolean) => void

	/**
	 * Custom scroll container
	 */
	container?: string | Element | null
}

/**
 * Directive binding value type
 */
export type StickyBinding = boolean | number | StickyOptions

/**
 * Element state storage
 */
interface StickyState {
	options: StickyOptions
	placeholder: HTMLDivElement | null
	originalStyles: {
		position: string
		top: string
		bottom: string
		zIndex: string
		width: string
	}
	isSticky: boolean
	scrollHandler: () => void
	resizeHandler: () => void
	container: Element | Window
}

/**
 * Normalize options
 */
function normalizeOptions(binding: StickyBinding | undefined): StickyOptions {
	if (binding === false) {
		return { disabled: true, top: 0, zIndex: 100 }
	}

	if (typeof binding === 'number') {
		return { top: binding, zIndex: 100 }
	}

	const base: StickyOptions = {
		top: 0,
		zIndex: 100,
		stickyClass: 'v-sticky--fixed',
		disabled: false,
	}

	return binding && typeof binding === 'object' ? { ...base, ...binding } : base
}

/**
 * Parse offset value
 */
function parseOffset(value: number | string | undefined): string {
	if (value === undefined) return '0'

	if (typeof value === 'number') {
		return `${value}px`
	}

	return value
}

/**
 * v-sticky directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-sticky>Sticky header</div>
 *   <div v-sticky="50">Sticky with 50px top offset</div>
 *   <div v-sticky="{ top: 60, zIndex: 1000, stickyClass: 'is-sticky' }">Custom sticky</div>
 * </template>
 * ```
 */
export const vSticky = defineDirective<StickyBinding, HTMLElement>({
	name: 'sticky',
	ssr: false,
	defaults: {
		top: 0,
		zIndex: 100,
		stickyClass: 'v-sticky--fixed',
		disabled: false,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		// Determine scroll container
		let container: Element | Window

		if (options.container) {
			if (typeof options.container === 'string') {
				const found = document.querySelector(options.container)

				container = found || getScrollParent(el)
			} else {
				container = options.container
			}
		} else {
			container = getScrollParent(el)
		}

		// Store original styles
		const originalStyles = {
			position: el.style.position,
			top: el.style.top,
			bottom: el.style.bottom,
			zIndex: el.style.zIndex,
			width: el.style.width,
		}

		const state: StickyState = {
			options,
			placeholder: null,
			originalStyles,
			isSticky: false,
			container,
			scrollHandler: () => checkSticky(el, state),
			resizeHandler: () => checkSticky(el, state),
		}

		// Add base class
		el.classList.add('v-sticky')

		// Store state
		;(el as any).__sticky = state

		// Bind events
		on(container, 'scroll', state.scrollHandler, { passive: true })
		on(window, 'resize', state.resizeHandler, { passive: true })

		// Initial check
		checkSticky(el, state)
	},

	updated(el, binding) {
		const state: StickyState = (el as any).__sticky

		if (!state) return

		state.options = normalizeOptions(binding.value)

		// Re-check sticky state
		checkSticky(el, state)
	},

	unmounted(el) {
		const state: StickyState = (el as any).__sticky

		if (!state) return

		// Remove placeholder
		if (state.placeholder && state.placeholder.parentNode) {
			state.placeholder.parentNode.removeChild(state.placeholder)
		}

		// Restore original styles
		el.style.position = state.originalStyles.position
		el.style.top = state.originalStyles.top
		el.style.bottom = state.originalStyles.bottom
		el.style.zIndex = state.originalStyles.zIndex
		el.style.width = state.originalStyles.width

		// Remove classes
		el.classList.remove('v-sticky')
		el.classList.remove(state.options.stickyClass || 'v-sticky--fixed')

		// Unbind events
		off(state.container, 'scroll', state.scrollHandler)
		off(window, 'resize', state.resizeHandler)

		delete (el as any).__sticky
	},
})

/**
 * Check and update sticky state
 */
function checkSticky(el: HTMLElement, state: StickyState): void {
	if (state.options.disabled) {
		unsetSticky(el, state)

		return
	}

	const rect = el.getBoundingClientRect()
	const topOffset = Number.parseFloat(parseOffset(state.options.top))
	const bottomOffset = state.options.bottom ? Number.parseFloat(parseOffset(state.options.bottom)) : 0

	// Check if element should be sticky
	const shouldSticky = rect.top <= topOffset

	if (shouldSticky && !state.isSticky) {
		setSticky(el, state, topOffset, bottomOffset)
	} else if (!shouldSticky && state.isSticky) {
		unsetSticky(el, state)
	}
}

/**
 * Set element as sticky
 */
function setSticky(
	el: HTMLElement,
	state: StickyState,
	_topOffset: number,
	_bottomOffset: number,
): void {
	state.isSticky = true

	// Create placeholder to maintain layout
	const placeholder = document.createElement('div')

	placeholder.style.cssText = `
    width: ${el.offsetWidth}px;
    height: ${el.offsetHeight}px;
    display: ${getComputedStyle(el).display};
  `

	el.parentNode?.insertBefore(placeholder, el)
	state.placeholder = placeholder

	// Apply sticky styles
	el.style.position = 'fixed'
	el.style.top = parseOffset(state.options.top)
	el.style.zIndex = String(state.options.zIndex || 100)
	el.style.width = `${el.offsetWidth}px`

	if (state.options.bottom !== undefined) {
		el.style.bottom = parseOffset(state.options.bottom)
	}

	// Add sticky class
	if (state.options.stickyClass) {
		el.classList.add(state.options.stickyClass)
	}

	// Dispatch custom event
	el.dispatchEvent(new CustomEvent('sticky:change', { detail: { isSticky: true } }))

	// Trigger callback
	state.options.onChange?.(true)
}

/**
 * Unset element as sticky
 */
function unsetSticky(el: HTMLElement, state: StickyState): void {
	if (!state.isSticky) return

	state.isSticky = false

	// Remove placeholder
	if (state.placeholder && state.placeholder.parentNode) {
		state.placeholder.parentNode.removeChild(state.placeholder)
		state.placeholder = null
	}

	// Restore original styles
	el.style.position = state.originalStyles.position
	el.style.top = state.originalStyles.top
	el.style.bottom = state.originalStyles.bottom
	el.style.zIndex = state.originalStyles.zIndex
	el.style.width = state.originalStyles.width

	// Remove sticky class
	if (state.options.stickyClass) {
		el.classList.remove(state.options.stickyClass)
	}

	// Dispatch custom event
	el.dispatchEvent(new CustomEvent('sticky:change', { detail: { isSticky: false } }))

	// Trigger callback
	state.options.onChange?.(false)
}

export default vSticky
