import { defineDirective, isBrowser, supportsIntersectionObserver } from '@directix/core'

/**
 * Intersect event handler
 */
export type IntersectHandler = (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void

/**
 * Intersect directive options
 */
export interface IntersectOptions {
	/** Callback when element intersects */
	handler?: IntersectHandler
	/** Callback when element enters viewport */
	onEnter?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void
	/** Callback when element leaves viewport */
	onLeave?: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void
	/** Callback when element changes intersection */
	onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void
	/** Root element for intersection @default null (viewport) */
	root?: Element | null
	/** Margin around the root @default '0px' */
	rootMargin?: string
	/** Threshold(s) at which to trigger callback @default 0 */
	threshold?: number | number[]
	/** Whether to disable @default false */
	disabled?: boolean
	/** Whether to trigger only once @default false */
	once?: boolean
}

/**
 * Directive binding value type
 */
export type IntersectBinding = IntersectHandler | IntersectOptions

/**
 * Element state storage
 */
interface IntersectState {
	options: IntersectOptions
	observer: IntersectionObserver | null
	hasTriggeredOnce: boolean
}

const STATE_KEY = '__intersect'

/**
 * Normalize options
 */
function normalizeOptions(binding: IntersectBinding | undefined): IntersectOptions {
	const options: IntersectOptions = typeof binding === 'function' ? { handler: binding } : { ...binding }

	// Unref root if it's a ref object (for Vue Composition API)
	if (options.root !== null && typeof options.root === 'object' && 'value' in options.root) {
		options.root = (options.root as { value: Element | null }).value
	}

	return options
}

/**
 * Create observer callback
 */
function createObserverCallback(
	el: HTMLElement,
	state: IntersectState,
	options: IntersectOptions,
): (entries: IntersectionObserverEntry[]) => void {
	return entries => {
		for (const entry of entries) {
			if (options.once && state.hasTriggeredOnce) continue

			const { isIntersecting } = entry

			options.handler?.(entry, state.observer!)
			options.onChange?.(isIntersecting, entry)

			if (isIntersecting) {
				options.onEnter?.(entry, state.observer!)
				if (options.once) state.hasTriggeredOnce = true
			} else {
				options.onLeave?.(entry, state.observer!)
			}

			el.dispatchEvent(new CustomEvent('intersect', { detail: { isIntersecting, entry } }))
		}
	}
}

/**
 * Create IntersectionObserver
 */
function createObserver(
	el: HTMLElement,
	state: IntersectState,
	options: IntersectOptions,
): IntersectionObserver {
	return new IntersectionObserver(createObserverCallback(el, state, options), {
		root: options.root,
		rootMargin: options.rootMargin,
		threshold: options.threshold,
	})
}

/**
 * v-intersect directive
 *
 * @example
 * ```vue
 * <div v-intersect="handleIntersect">Observe me</div>
 * <div v-intersect="{ onEnter: handleEnter, onLeave: handleLeave }">Track visibility</div>
 * <div v-intersect="{ threshold: 0.5, once: true }">Trigger once at 50%</div>
 * ```
 */
export const vIntersect = defineDirective<IntersectBinding, HTMLElement>({
	name: 'intersect',
	ssr: false,
	defaults: {
		disabled: false,
		once: false,
		rootMargin: '0px',
		threshold: 0,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser() || !supportsIntersectionObserver()) {
			if (!supportsIntersectionObserver()) {
				console.warn('[Directix] v-intersect: IntersectionObserver not supported')
			}

			return
		}

		const state: IntersectState = {
			options,
			observer: null,
			hasTriggeredOnce: false,
		}

		state.observer = createObserver(el, state, options)
		;(el as any)[STATE_KEY] = state
		state.observer.observe(el)
	},

	updated(el, binding) {
		const state: IntersectState | undefined = (el as any)[STATE_KEY]

		if (!state) return

		const newOptions = normalizeOptions(binding.value)
		const observerOptionsChanged =
			newOptions.root !== state.options.root ||
			newOptions.rootMargin !== state.options.rootMargin ||
			newOptions.threshold !== state.options.threshold

		// Handle disabled state change
		if (newOptions.disabled !== state.options.disabled) {
			if (newOptions.disabled) {
				state.observer?.disconnect()
			} else {
				state.observer?.observe(el)
			}
		}

		// Recreate observer if options changed
		if (observerOptionsChanged) {
			state.observer?.disconnect()
			state.observer = createObserver(el, state, newOptions)
			state.observer.observe(el)
		}

		state.options = newOptions
	},

	unmounted(el) {
		const state: IntersectState | undefined = (el as any)[STATE_KEY]

		if (!state) return

		state.observer?.disconnect()
		delete (el as any)[STATE_KEY]
	},
})

export default vIntersect
