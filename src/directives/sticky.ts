import { defineDirective, isBrowser } from '@directix/core'
import { getScrollParent, off, on } from '@directix/shared'

const STATE_KEY = '__sticky' as const

/**
 * Sticky directive options
 */
export interface StickyOptions {
	/** Top offset when sticky @default 0 */
	top?: number | string
	/** Bottom offset when sticky */
	bottom?: number | string
	/** Z-index when sticky @default 100 */
	zIndex?: number
	/** CSS class to add when sticky @default 'v-sticky--fixed' */
	stickyClass?: string
	/** Whether to disable @default false */
	disabled?: boolean
	/** Callback when sticky state changes */
	onChange?: (isSticky: boolean) => void
	/** Custom scroll container */
	container?: string | Element | null
}

export type StickyBinding = boolean | number | StickyOptions

interface StickyState {
	options: StickyOptions
	placeholder: HTMLDivElement | null
	originalStyles: { position: string; top: string; bottom: string; zIndex: string; width: string }
	isSticky: boolean
	scrollHandler: () => void
	resizeHandler: () => void
	container: Element | Window
}

/**
 * Normalize options
 */
function normalizeOptions(binding: StickyBinding | undefined): StickyOptions {
	if (binding === false) return { disabled: true, top: 0, zIndex: 100 }
	if (typeof binding === 'number') return { top: binding, zIndex: 100 }

	return {
		top: 0,
		zIndex: 100,
		stickyClass: 'v-sticky--fixed',
		disabled: false,
		...(binding && typeof binding === 'object' ? binding : {}),
	}
}

/**
 * Parse offset value to CSS string
 */
function parseOffset(value: number | string | undefined): string {
	if (value === undefined) return '0'

	return typeof value === 'number' ? `${value}px` : value
}

/**
 * Get scroll container for element
 */
function getScrollContainer(el: HTMLElement, customContainer?: string | Element | null): Element | Window {
	if (customContainer) {
		if (typeof customContainer === 'string') {
			return document.querySelector(customContainer) || getScrollParent(el)
		}

		return customContainer
	}

	// Check if parent element is scrollable
	const parent = el.parentElement

	if (parent) {
		const { overflow, overflowX, overflowY } = getComputedStyle(parent)

		if (/(auto|scroll)/.test(overflow + overflowX + overflowY)) {
			return parent
		}
	}

	return getScrollParent(el)
}

/**
 * Check and update sticky state
 */
function checkSticky(el: HTMLElement, state: StickyState): void {
	if (state.options.disabled) {
		unsetSticky(el, state)

		return
	}

	const topOffset = Number.parseFloat(parseOffset(state.options.top))
	const containerRect = state.container === window ? { top: 0 } : (state.container as Element).getBoundingClientRect()

	// Use placeholder position when sticky, otherwise use element position
	const referenceEl = state.placeholder || el
	const rect = referenceEl.getBoundingClientRect()
	const elementTopRelativeToContainer = rect.top - containerRect.top

	const shouldSticky = elementTopRelativeToContainer <= topOffset

	if (shouldSticky && !state.isSticky) {
		setSticky(el, state, topOffset, containerRect.top)
	} else if (!shouldSticky && state.isSticky) {
		unsetSticky(el, state)
	}
}

/**
 * Set element as sticky
 */
function setSticky(el: HTMLElement, state: StickyState, topOffset: number, containerTop: number): void {
	state.isSticky = true

	// Create placeholder to maintain layout
	const placeholder = document.createElement('div')

	placeholder.style.cssText = `width:${el.offsetWidth}px;height:${el.offsetHeight}px`
	el.parentNode?.insertBefore(placeholder, el)
	state.placeholder = placeholder

	// Calculate fixed top position relative to viewport
	const fixedTop = state.container === window ? topOffset : containerTop + topOffset

	// Apply sticky styles
	el.style.position = 'fixed'
	el.style.top = `${fixedTop}px`
	el.style.zIndex = String(state.options.zIndex || 100)
	el.style.width = `${el.offsetWidth}px`

	if (state.options.bottom !== undefined) {
		el.style.bottom = parseOffset(state.options.bottom)
	}

	state.options.stickyClass && el.classList.add(state.options.stickyClass)
	el.dispatchEvent(new CustomEvent('sticky:change', { detail: { isSticky: true } }))
	state.options.onChange?.(true)
}

/**
 * Unset element as sticky
 */
function unsetSticky(el: HTMLElement, state: StickyState): void {
	if (!state.isSticky) return

	state.isSticky = false

	// Remove placeholder
	state.placeholder?.parentNode?.removeChild(state.placeholder)
	state.placeholder = null

	// Restore original styles
	Object.assign(el.style, state.originalStyles)

	state.options.stickyClass && el.classList.remove(state.options.stickyClass)
	el.dispatchEvent(new CustomEvent('sticky:change', { detail: { isSticky: false } }))
	state.options.onChange?.(false)
}

/**
 * v-sticky directive
 *
 * @example
 * ```vue
 * <div v-sticky>Sticky header</div>
 * <div v-sticky="50">Sticky with 50px top offset</div>
 * <div v-sticky="{ top: 60, zIndex: 1000 }">Custom sticky</div>
 * ```
 */
export const vSticky = defineDirective<StickyBinding, HTMLElement>({
	name: 'sticky',
	ssr: false,
	defaults: { top: 0, zIndex: 100, stickyClass: 'v-sticky--fixed', disabled: false },

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		const container = getScrollContainer(el, options.container)

		const state: StickyState = {
			options,
			placeholder: null,
			originalStyles: {
				position: el.style.position,
				top: el.style.top,
				bottom: el.style.bottom,
				zIndex: el.style.zIndex,
				width: el.style.width,
			},
			isSticky: false,
			container,
			scrollHandler: () => checkSticky(el, state),
			resizeHandler: () => checkSticky(el, state),
		}

		el.classList.add('v-sticky')
		;(el as any)[STATE_KEY] = state

		on(container, 'scroll', state.scrollHandler, { passive: true })
		on(window, 'resize', state.resizeHandler, { passive: true })
		checkSticky(el, state)
	},

	updated(el, binding) {
		const state: StickyState = (el as any)[STATE_KEY]

		if (!state) return
		state.options = normalizeOptions(binding.value)
		checkSticky(el, state)
	},

	unmounted(el) {
		const state: StickyState = (el as any)[STATE_KEY]

		if (!state) return

		state.placeholder?.parentNode?.removeChild(state.placeholder)

		Object.assign(el.style, state.originalStyles)
		el.classList.remove('v-sticky', state.options.stickyClass || 'v-sticky--fixed')

		off(state.container, 'scroll', state.scrollHandler)
		off(window, 'resize', state.resizeHandler)

		delete (el as any)[STATE_KEY]
	},
})

export default vSticky
