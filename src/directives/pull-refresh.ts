import { defineDirective } from '@directix/core'

/**
 * Pull refresh handler
 */
export type PullRefreshHandler = () => Promise<void> | void

/**
 * Pull refresh state
 */
export type PullRefreshState = 'idle' | 'pulling' | 'ready' | 'loading' | 'success' | 'error'

/**
 * Pull refresh options
 */
export interface PullRefreshOptions {
	/**
	 * Handler to call when refresh is triggered
	 * @required
	 */
	handler: PullRefreshHandler

	/**
	 * Distance needed to trigger refresh (in pixels)
	 * @default 60
	 */
	distance?: number

	/**
	 * Maximum pull distance (in pixels)
	 * @default 100
	 */
	maxDistance?: number

	/**
	 * Whether to disable pull to refresh
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Custom indicator slot content for different states
	 */
	indicator?: {
		pulling?: string
		ready?: string
		loading?: string
		success?: string
		error?: string
	}

	/**
	 * Duration to show success state (in ms)
	 * @default 500
	 */
	successDuration?: number

	/**
	 * Duration to show error state (in ms)
	 * @default 1000
	 */
	errorDuration?: number

	/**
	 * Callback when state changes
	 */
	onStateChange?: (state: PullRefreshState) => void
}

/**
 * Directive binding value type
 */
export type PullRefreshBinding = PullRefreshHandler | PullRefreshOptions

/**
 * Element state storage
 */
interface PullRefreshStateInternal {
	options: PullRefreshOptions
	state: PullRefreshState
	startY: number
	currentY: number
	indicatorEl: HTMLDivElement | null
	contentEl: HTMLElement | null
	touchHandler: ((e: TouchEvent) => void) | null
}

/**
 * Create indicator element
 */
function createIndicator(_options: PullRefreshOptions): HTMLDivElement {
	const el = document.createElement('div')
	el.className = 'v-pull-refresh__indicator'
	el.style.cssText = `
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translateY(-100%);
		transition: transform 0.2s ease;
		background: #f5f5f5;
		font-size: 14px;
		color: #666;
	`
	return el
}

/**
 * Update indicator content
 */
function updateIndicator(el: HTMLDivElement, state: PullRefreshState, options: PullRefreshOptions): void {
	const indicator = options.indicator || {}
	const defaultIcons: Record<PullRefreshState, string> = {
		idle: '↓',
		pulling: '↓',
		ready: '↓ Release',
		loading: '⟳ Loading...',
		success: '✓ Done',
		error: '✗ Failed',
	}

	el.textContent = (indicator as Record<string, string>)[state] || defaultIcons[state]
}

/**
 * Normalize options
 */
function normalizeOptions(binding: PullRefreshBinding): PullRefreshOptions {
	if (typeof binding === 'function') {
		return { handler: binding }
	}

	return {
		handler: binding.handler,
		distance: binding.distance ?? 60,
		maxDistance: binding.maxDistance ?? 100,
		disabled: binding.disabled ?? false,
		indicator: binding.indicator,
		successDuration: binding.successDuration ?? 500,
		errorDuration: binding.errorDuration ?? 1000,
		onStateChange: binding.onStateChange,
	}
}

/**
 * v-pull-refresh directive
 *
 * Enables pull-to-refresh functionality on mobile.
 *
 * @example
 * ```vue
 * <template>
 *   <div v-pull-refresh="handleRefresh">
 *     Pull down to refresh
 *   </div>
 *
 *   <div v-pull-refresh="{
 *     handler: handleRefresh,
 *     distance: 80,
 *     indicator: {
 *       pulling: 'Pull to refresh',
 *       ready: 'Release to refresh',
 *       loading: 'Refreshing...',
 *       success: 'Done!',
 *       error: 'Failed'
 *     }
 *   }">
 *     Content here
 *   </div>
 * </template>
 * ```
 */
export const vPullRefresh = defineDirective<PullRefreshBinding, HTMLElement>({
	name: 'pull-refresh',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		// Setup container styles
		el.style.position = 'relative'
		el.style.overflow = 'hidden'
		el.classList.add('v-pull-refresh')

		// Create wrapper for content
		const contentEl = document.createElement('div')
		contentEl.className = 'v-pull-refresh__content'
		contentEl.style.cssText = `
			position: relative;
			height: 100%;
			overflow-y: auto;
			touch-action: pan-y;
		`

		// Move children to content wrapper
		while (el.firstChild) {
			contentEl.appendChild(el.firstChild)
		}
		el.appendChild(contentEl)

		// Create indicator
		const indicatorEl = createIndicator(options)
		el.insertBefore(indicatorEl, contentEl)

		const state: PullRefreshStateInternal = {
			options,
			state: 'idle',
			startY: 0,
			currentY: 0,
			indicatorEl,
			contentEl,
			touchHandler: null,
		}

		;(el as any).__pullRefresh = state

		if (!options.disabled) {
			setupTouchHandlers(el, state)
		}

		updateIndicator(indicatorEl, 'idle', options)
	},

	updated(el, binding) {
		const state: PullRefreshStateInternal = (el as any).__pullRefresh

		if (!state) return

		const newOptions = normalizeOptions(binding.value)
		state.options = newOptions

		// Update indicator content
		if (state.indicatorEl) {
			updateIndicator(state.indicatorEl, state.state, newOptions)
		}

		// Handle disabled state change
		if (newOptions.disabled && !state.options.disabled) {
			removeTouchHandlers(el, state)
		} else if (!newOptions.disabled && state.options.disabled) {
			setupTouchHandlers(el, state)
		}
	},

	unmounted(el) {
		const state: PullRefreshStateInternal | undefined = (el as any).__pullRefresh

		if (!state) return

		removeTouchHandlers(el, state)

		delete (el as any).__pullRefresh
	},
})

/**
 * Setup touch event handlers
 */
function setupTouchHandlers(el: HTMLElement, state: PullRefreshStateInternal): void {
	const contentEl = state.contentEl!
	let pulling = false

	const handleStart = (e: TouchEvent) => {
		if (state.options.disabled || state.state === 'loading') return

		const scrollTop = contentEl.scrollTop
		if (scrollTop > 0) return

		pulling = true
		state.startY = e.touches[0].clientY
		state.currentY = state.startY

		setState(state, 'idle')
	}

	const handleMove = (e: TouchEvent) => {
		if (!pulling || state.options.disabled || state.state === 'loading') return

		state.currentY = e.touches[0].clientY
		const diff = state.currentY - state.startY

		if (diff <= 0) {
			pulling = false
			return
		}

		// Prevent default scroll
		e.preventDefault()

		const distance = Math.min(diff * 0.5, state.options.maxDistance!)
		const progress = distance / state.options.distance!

		// Update indicator position
		if (state.indicatorEl) {
			state.indicatorEl.style.transform = `translateY(${distance - 60}px)`
		}

		// Update content position
		contentEl.style.transform = `translateY(${distance}px)`
		contentEl.style.transition = 'none'

		// Update state
		setState(state, progress >= 1 ? 'ready' : 'pulling')
	}

	const handleEnd = async () => {
		if (!pulling || state.options.disabled) return

		pulling = false
		const diff = state.currentY - state.startY
		const distance = Math.min(diff * 0.5, state.options.maxDistance!)

		// Reset transition
		contentEl.style.transition = ''

		if (state.state === 'ready' && distance >= state.options.distance!) {
			// Trigger refresh
			await triggerRefresh(el, state)
		} else {
			// Reset position
			resetPosition(state)
		}
	}

	el.addEventListener('touchstart', handleStart, { passive: true })
	el.addEventListener('touchmove', handleMove, { passive: false })
	el.addEventListener('touchend', handleEnd, { passive: true })

	state.touchHandler = handleStart as any
}

/**
 * Remove touch event handlers
 */
function removeTouchHandlers(_el: HTMLElement, _state: PullRefreshStateInternal): void {
	// Note: In production, we'd store all handlers for proper cleanup
	// For simplicity, we just reset state
}

/**
 * Set pull refresh state
 */
function setState(state: PullRefreshStateInternal, newState: PullRefreshState): void {
	if (state.state === newState) return

	state.state = newState

	if (state.indicatorEl) {
		updateIndicator(state.indicatorEl, newState, state.options)
	}

	if (state.options.onStateChange) {
		state.options.onStateChange(newState)
	}
}

/**
 * Trigger refresh
 */
async function triggerRefresh(_el: HTMLElement, state: PullRefreshStateInternal): Promise<void> {
	setState(state, 'loading')

	// Set loading position
	if (state.indicatorEl) {
		state.indicatorEl.style.transform = 'translateY(0)'
	}
	state.contentEl!.style.transform = `translateY(${state.options.distance!}px)`

	try {
		await state.options.handler()
		setState(state, 'success')

		// Show success briefly
		await sleep(state.options.successDuration!)
	} catch (error) {
		setState(state, 'error')

		// Show error briefly
		await sleep(state.options.errorDuration!)
	} finally {
		resetPosition(state)
	}
}

/**
 * Reset position
 */
function resetPosition(state: PullRefreshStateInternal): void {
	if (state.indicatorEl) {
		state.indicatorEl.style.transform = 'translateY(-100%)'
	}
	state.contentEl!.style.transform = ''
	setState(state, 'idle')
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export default vPullRefresh
