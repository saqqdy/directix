import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

/**
 * Visible change handler
 */
export type VisibleHandler = (isVisible: boolean) => void

/**
 * Visible directive options
 */
export interface VisibleOptions {
	/**
	 * Callback when visibility changes
	 */
	handler?: VisibleHandler

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Whether to set visibility: hidden instead of display: none
	 * @default false
	 */
	useHidden?: boolean

	/**
	 * Initial visibility
	 * @default true
	 */
	initial?: boolean
}

/**
 * Directive binding value type
 */
export type VisibleBinding = boolean | VisibleOptions

/**
 * Element state storage
 */
interface VisibleState {
	options: VisibleOptions
	isVisible: boolean
	originalDisplay: string
	originalVisibility: string
	transitionEndHandler: (e: TransitionEvent) => void
}

/**
 * Normalize options
 */
function normalizeOptions(binding: VisibleBinding | undefined): VisibleOptions {
	if (typeof binding === 'boolean') {
		return { initial: binding }
	}

	return {
		initial: true,
		disabled: false,
		useHidden: false,
		...binding,
	}
}

/**
 * v-visible directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-visible="showElement">Show/Hide</div>
 *   <div v-visible="{ handler: onVisibleChange }">Track visibility</div>
 *   <div v-visible="{ useHidden: true, initial: false }">Uses visibility: hidden</div>
 * </template>
 * ```
 */
export const vVisible = defineDirective<VisibleBinding, HTMLElement>({
	name: 'visible',
	ssr: false,
	defaults: {
		initial: true,
		disabled: false,
		useHidden: false,
	},

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)

		// Store original styles
		const originalDisplay = el.style.display
		const originalVisibility = el.style.visibility

		const state: VisibleState = {
			options,
			isVisible: options.initial ?? true,
			originalDisplay,
			originalVisibility,
			transitionEndHandler: (e: TransitionEvent) => {
				// Handle transition end for animations
				if (e.propertyName === 'opacity' || e.propertyName === 'visibility') {
					el.dispatchEvent(new CustomEvent('visible:transition-end', {
						detail: { isVisible: state.isVisible },
					}))
				}
			},
		}

		// Store state
		;(el as any).__visible = state

		// Add transition listener
		on(el, 'transitionend', state.transitionEndHandler as (e: Event) => void)

		// Apply initial visibility
		applyVisibility(el, state, options.initial ?? true)
	},

	updated(el, binding) {
		const state: VisibleState = (el as any).__visible

		if (!state) return

		const newOptions = normalizeOptions(binding.value)

		// Determine new visibility
		let newVisibility: boolean

		if (typeof binding.value === 'boolean') {
			newVisibility = binding.value
		} else {
			newVisibility = newOptions.initial ?? true
		}

		// Update if changed
		if (state.isVisible !== newVisibility) {
			applyVisibility(el, state, newVisibility)
		}

		state.options = newOptions
	},

	unmounted(el) {
		const state: VisibleState = (el as any).__visible

		if (!state) return

		// Remove transition listener
		off(el, 'transitionend', state.transitionEndHandler as (e: Event) => void)

		// Restore original styles
		el.style.display = state.originalDisplay
		el.style.visibility = state.originalVisibility

		delete (el as any).__visible
	},
})

/**
 * Apply visibility to element
 */
function applyVisibility(el: HTMLElement, state: VisibleState, isVisible: boolean): void {
	const previousVisibility = state.isVisible

	state.isVisible = isVisible

	// Add/remove class first (for CSS transitions)
	if (isVisible) {
		el.classList.remove('v-hidden')
		el.classList.add('v-visible')
	} else {
		el.classList.remove('v-visible')
		el.classList.add('v-hidden')
	}

	if (state.options.useHidden) {
		// Use visibility: hidden with animation support
		if (isVisible) {
			// Show: set visibility first, then animate
			el.style.visibility = state.originalVisibility || 'visible'
		} else {
			// Hide: wait for transition, then set hidden
			const computedStyle = getComputedStyle(el)
			const hasTransition = computedStyle.transitionDuration !== '0s'

			if (hasTransition) {
				// Wait for transition to complete
				const handleTransitionEnd = (e: TransitionEvent) => {
					if (e.target === el && (e.propertyName === 'opacity' || e.propertyName === 'transform')) {
						if (!state.isVisible) {
							el.style.visibility = 'hidden'
						}
						el.removeEventListener('transitionend', handleTransitionEnd)
					}
				}

				el.addEventListener('transitionend', handleTransitionEnd)
			} else {
				el.style.visibility = 'hidden'
			}
		}
	} else {
		// Use display: none (no animation support)
		el.style.display = isVisible ? state.originalDisplay : 'none'
	}

	// Dispatch custom event
	el.dispatchEvent(new CustomEvent('visible:change', {
		detail: { isVisible, previousVisibility },
	}))

	// Trigger handler
	if (state.options.handler && previousVisibility !== isVisible) {
		state.options.handler(isVisible)
	}
}

export default vVisible
