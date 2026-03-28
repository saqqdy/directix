import { defineDirective, isBrowser, supportsMutationObserver } from '@directix/core'

/**
 * Mutation change handler
 */
export type MutationHandler = (mutations: MutationRecord[], observer: MutationObserver) => void

/**
 * Mutation directive options
 */
export interface MutationOptions {
	/**
	 * Callback when mutations occur
	 * @required
	 */
	handler: MutationHandler

	/**
	 * Whether to observe attribute changes
	 * @default false
	 */
	attributes?: boolean

	/**
	 * Specific attributes to observe
	 */
	attributeFilter?: string[]

	/**
	 * Whether to observe child node additions/removals
	 * @default true
	 */
	childList?: boolean

	/**
	 * Whether to observe all descendants, not just direct children
	 * @default false
	 */
	subtree?: boolean

	/**
	 * Whether to observe character data changes
	 * @default false
	 */
	characterData?: boolean

	/**
	 * Whether to record old attribute values
	 * @default false
	 */
	attributeOldValue?: boolean

	/**
	 * Whether to record old character data
	 * @default false
	 */
	characterDataOldValue?: boolean

	/**
	 * Whether to disable
	 * @default false
	 */
	disabled?: boolean
}

/**
 * Directive binding value type
 */
export type MutationBinding = MutationHandler | MutationOptions

/**
 * Element state storage
 */
interface MutationState {
	options: MutationOptions
	observer: MutationObserver | null
}

/**
 * Normalize options
 */
function normalizeOptions(binding: MutationBinding | undefined): MutationOptions {
	if (typeof binding === 'function') {
		return { handler: binding, childList: true }
	}

	if (!binding || !binding.handler) {
		throw new Error('[Directix] v-mutation: handler is required')
	}

	return {
		attributes: false,
		childList: true,
		subtree: false,
		characterData: false,
		attributeOldValue: false,
		characterDataOldValue: false,
		disabled: false,
		...binding,
	}
}

/**
 * v-mutation directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-mutation="handleMutation">Observe my changes</div>
 *   <div v-mutation="{ handler: handleMutation, attributes: true, subtree: true }">
 *     Observe attributes and subtree
 *   </div>
 * </template>
 *
 * <script setup>
 * function handleMutation(mutations: MutationRecord[], observer: MutationObserver) {
 *   mutations.forEach(mutation => {
 *     console.log('Type:', mutation.type)
 *     console.log('Target:', mutation.target)
 *   })
 * }
 * </script>
 * ```
 */
export const vMutation = defineDirective<MutationBinding, HTMLElement>({
	name: 'mutation',
	ssr: false,
	defaults: {
		attributes: false,
		childList: true,
		subtree: false,
		characterData: false,
		attributeOldValue: false,
		characterDataOldValue: false,
		disabled: false,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		// Check MutationObserver support
		if (!supportsMutationObserver()) {
			console.warn('[Directix] v-mutation: MutationObserver not supported')

			return
		}

		const state: MutationState = {
			options,
			observer: null,
		}

		// Create observer
		state.observer = new MutationObserver((mutations, observer) => {
			options.handler(mutations, observer)
		})

		// Start observing
		state.observer.observe(el, {
			attributes: options.attributes,
			attributeFilter: options.attributeFilter,
			childList: options.childList,
			subtree: options.subtree,
			characterData: options.characterData,
			attributeOldValue: options.attributeOldValue,
			characterDataOldValue: options.characterDataOldValue,
		})

		// Store state
		;(el as any).__mutation = state
	},

	updated(el, binding) {
		const state: MutationState = (el as any).__mutation

		if (!state) return

		const newOptions = normalizeOptions(binding.value)

		// Handle disabled state change
		if (newOptions.disabled && !state.options.disabled) {
			// Disconnect if was enabled
			if (state.observer) {
				state.observer.disconnect()
			}
		} else if (!newOptions.disabled && state.options.disabled) {
			// Re-observe if was disabled
			if (state.observer) {
				state.observer.observe(el, {
					attributes: newOptions.attributes,
					attributeFilter: newOptions.attributeFilter,
					childList: newOptions.childList,
					subtree: newOptions.subtree,
					characterData: newOptions.characterData,
					attributeOldValue: newOptions.attributeOldValue,
					characterDataOldValue: newOptions.characterDataOldValue,
				})
			}
		} else if (!newOptions.disabled) {
			// If options changed, reconnect with new options
			if (
				newOptions.attributes !== state.options.attributes ||
				newOptions.childList !== state.options.childList ||
				newOptions.subtree !== state.options.subtree ||
				newOptions.characterData !== state.options.characterData
			) {
				if (state.observer) {
					state.observer.disconnect()
					state.observer.observe(el, {
						attributes: newOptions.attributes,
						attributeFilter: newOptions.attributeFilter,
						childList: newOptions.childList,
						subtree: newOptions.subtree,
						characterData: newOptions.characterData,
						attributeOldValue: newOptions.attributeOldValue,
						characterDataOldValue: newOptions.characterDataOldValue,
					})
				}
			}
		}

		state.options = newOptions
	},

	unmounted(el) {
		const state: MutationState = (el as any).__mutation

		if (!state) return

		// Disconnect observer
		if (state.observer) {
			state.observer.disconnect()
		}

		delete (el as any).__mutation
	},
})

export default vMutation
