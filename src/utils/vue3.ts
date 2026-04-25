import { computed, type ComputedRef, isRef, markRaw, reactive, readonly, type Ref, shallowRef, type ShallowRef, toRaw, watchEffect } from 'vue'

/**
 * Vue 3 Optimization Utilities for Directix
 *
 * These utilities leverage Vue 3 specific APIs for better performance
 * when running in Vue 3 environments.
 */

/**
 * Options for optimized lazy loading
 */
export interface OptimizedLazyOptions {
	/** Threshold for intersection observer */
	threshold?: number | number[]
	/** Root margin for intersection observer */
	rootMargin?: string
	/** Whether to disconnect after first load */
	once?: boolean
	/** Callback when element becomes visible */
	onLoad?: (entry: IntersectionObserverEntry) => void
}

/**
 * State for optimized lazy loading
 */
export interface OptimizedLazyState {
	/** Whether loading is in progress */
	loading: boolean
	/** Whether resource is loaded */
	loaded: boolean
	/** Error if loading failed */
	error: Error | null
	/** Whether element is visible */
	isVisible: boolean
}

/**
 * Return type for useLazyOptimized
 */
export interface UseLazyOptimizedReturn {
	/** Reactive state */
	state: Readonly<ShallowRef<OptimizedLazyState>>
	/** Start observing element */
	observe: (el: HTMLElement) => void
	/** Stop observing and cleanup */
	disconnect: () => void
	/** Manually trigger load */
	load: () => void
}

/**
 * Optimized lazy loading using Vue 3's shallowRef for performance
 * with large state objects
 */
export function useLazyOptimized(options: OptimizedLazyOptions = {}): UseLazyOptimizedReturn {
	const {
		threshold = 0,
		rootMargin = '0px',
		once = true,
		onLoad,
	} = options

	const state = shallowRef<OptimizedLazyState>({
		loading: false,
		loaded: false,
		error: null,
		isVisible: false,
	})

	let observer: IntersectionObserver | null = null

	function disconnect(): void {
		if (observer) {
			observer.disconnect()
			observer = null
		}
	}

	function observe(el: HTMLElement): void {
		disconnect()

		observer = new IntersectionObserver(
			entries => {
				const entry = entries[0]
				if (entry?.isIntersecting) {
					state.value = { ...state.value, isVisible: true }
					load()
					if (once) {
						disconnect()
					}
				}
			},
			{ threshold, rootMargin },
		)

		observer.observe(el)
	}

	function load(): void {
		if (state.value.loading || state.value.loaded) return

		state.value = { ...state.value, loading: true, error: null }

		try {
			onLoad?.({} as IntersectionObserverEntry)
			state.value = { ...state.value, loading: false, loaded: true }
		} catch (e) {
			state.value = { ...state.value, loading: false, error: e as Error }
		}
	}

	return {
		state: readonly(state),
		observe,
		disconnect,
		load,
	}
}

/**
 * Options for directive instance with Vue 3 reactivity
 */
export interface DirectiveInstanceOptions<T = any> {
	/** Initial state */
	initialState?: T
	/** Whether to use shallow reactive (better for large objects) */
	shallow?: boolean
}

/**
 * Return type for useDirectiveInstance
 */
export interface UseDirectiveInstanceReturn<T> {
	/** The element (marked raw for performance) */
	element: HTMLElement | null
	/** Reactive state */
	state: Readonly<T>
	/** Set element and initialize */
	setElement: (el: HTMLElement) => void
	/** Update state */
	setState: (updater: (prev: T) => T) => void
	/** Reset state */
	reset: () => void
}

/**
 * Create a directive instance with Vue 3 optimizations
 * Uses markRaw for DOM elements and reactive/shallowReactive for state
 */
export function useDirectiveInstance<T extends Record<string, any>>(
	options: DirectiveInstanceOptions<T> = {},
): UseDirectiveInstanceReturn<T> {
	const { initialState = {} as T, shallow = false } = options

	let element: HTMLElement | null = null
	const state = shallow ? (reactive(initialState) as T) : reactive(initialState) as T

	function setElement(el: HTMLElement): void {
		element = markRaw(el) as unknown as HTMLElement
	}

	function setState(updater: (prev: T) => T): void {
		const newState = updater(toRaw(state))
		Object.assign(state, newState)
	}

	function reset(): void {
		Object.assign(state, initialState)
	}

	return {
		get element() { return element },
		set element(el) { if (el) setElement(el) },
		state: readonly(state) as unknown as Readonly<T>,
		setElement,
		setState,
		reset,
	}
}

/**
 * Options for computed with cleanup
 */
export interface ComputedWithCleanupOptions<T> {
	/** Getter function */
	get: () => T
	/** Cleanup function called when dependencies change or on unmount */
	cleanup?: (value: T) => void
}

/**
 * Computed ref with automatic cleanup
 */
export function computedWithCleanup<T>(options: ComputedWithCleanupOptions<T>): ComputedRef<T> {
	const { get, cleanup } = options
	let oldValue: T | undefined

	return computed({
		get() {
			const newValue = get()
			if (oldValue !== undefined && oldValue !== newValue) {
				cleanup?.(oldValue)
			}
			oldValue = newValue
			return newValue
		},
		set() {
			// Read-only
		},
	})
}

/**
 * Options for watchEffect with element binding
 */
export interface WatchEffectBindingOptions {
	/** Binding value to watch */
	binding: Ref<any>
	/** Effect callback */
	effect: (value: any, oldValue: any, onCleanup: (fn: () => void) => void) => void
	/** Whether to run immediately */
	immediate?: boolean
}

/**
 * watchEffect that tracks directive bindings
 */
export function watchEffectBinding(options: WatchEffectBindingOptions): () => void {
	const { binding, effect } = options

	let cleanupFn: (() => void) | null = null,
		cleanup: (fn: () => void) => void = fn => {
			cleanupFn = fn
		}

	const stop = watchEffect(onCleanup => {
		cleanup = onCleanup

		if (cleanupFn) {
			cleanupFn()
			cleanupFn = null
		}

		if (isRef(binding)) {
			effect(binding.value, undefined, cleanup)
		} else {
			effect(binding, undefined, cleanup)
		}
	})

	return () => {
		if (cleanupFn) {
			cleanupFn()
		}
		stop()
	}
}

/**
 * Suspense-ready async directive state
 */
export interface SuspenseDirectiveState<T = any> {
	/** Loading state */
	loading: boolean
	/** Error state */
	error: Error | null
	/** Data */
	data: T | null
}

/**
 * Options for suspense directive
 */
export interface UseSuspenseDirectiveOptions<T> {
	/** Async loader function */
	loader: () => Promise<T>
	/** On success callback */
	onSuccess?: (data: T) => void
	/** On error callback */
	onError?: (error: Error) => void
}

/**
 * Return type for suspense directive
 */
export interface UseSuspenseDirectiveReturn<T> {
	/** Reactive state */
	state: Readonly<ShallowRef<SuspenseDirectiveState<T>>>
	/** Trigger load */
	load: () => Promise<void>
	/** Retry on error */
	retry: () => Promise<void>
}

/**
 * Suspense-ready composable for async directives
 */
export function useSuspenseDirective<T>(
	options: UseSuspenseDirectiveOptions<T>,
): UseSuspenseDirectiveReturn<T> {
	const { loader, onSuccess, onError } = options

	const state = shallowRef<SuspenseDirectiveState<T>>({
		loading: false,
		error: null,
		data: null,
	})

	async function load(): Promise<void> {
		if (state.value.loading) return

		state.value = { ...state.value, loading: true, error: null }

		try {
			const data = await loader()
			state.value = { loading: false, error: null, data }
			onSuccess?.(data)
		} catch (error) {
			state.value = { ...state.value, loading: false, error: error as Error }
			onError?.(error as Error)
		}
	}

	async function retry(): Promise<void> {
		state.value = { ...state.value, error: null }
		await load()
	}

	return {
		state: readonly(state) as unknown as Readonly<ShallowRef<SuspenseDirectiveState<T>>>,
		load,
		retry,
	}
}

/**
 * Teleport enhancement options
 */
export interface TeleportEnhanceOptions {
	/** Target selector or element */
	to: string | HTMLElement
	/** Whether to teleport content */
	disabled?: boolean
}

/**
 * Create teleport target if not exists
 */
export function ensureTeleportTarget(target: string): HTMLElement | null {
	if (typeof document === 'undefined') return null

	let el = document.querySelector<HTMLElement>(target)
	if (!el) {
		el = document.createElement('div')
		el.id = target.replace('#', '')
		document.body.appendChild(el)
	}
	return el
}

/**
 * Teleport content to target
 */
export function teleportContent(content: HTMLElement, options: TeleportEnhanceOptions): () => void {
	const { to, disabled = false } = options

	if (disabled || typeof document === 'undefined') {
		return () => {}
	}

	const targetEl = typeof to === 'string' ? ensureTeleportTarget(to) : to
	if (!targetEl) return () => {}

	const parent = content.parentNode
	const nextSibling = content.nextSibling

	targetEl.appendChild(content)

	return () => {
		if (parent && content.parentNode === targetEl) {
			parent.insertBefore(content, nextSibling)
		}
	}
}

export {
	markRaw,
	reactive,
	readonly,
	shallowRef,
	toRaw,
	watchEffect,
}
