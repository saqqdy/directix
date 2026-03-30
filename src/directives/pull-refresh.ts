import { defineDirective } from '@directix/core'

export type PullRefreshHandler = () => Promise<void> | void

export type PullRefreshState = 'idle' | 'pulling' | 'ready' | 'loading' | 'success' | 'error'

export interface PullRefreshOptions {
	handler: PullRefreshHandler
	distance?: number
	maxDistance?: number
	disabled?: boolean
	indicator?: {
		idle?: string
		pulling?: string
		ready?: string
		loading?: string
		success?: string
		error?: string
	}
	successDuration?: number
	errorDuration?: number
	onStateChange?: (state: PullRefreshState) => void
}

export type PullRefreshBinding = PullRefreshHandler | PullRefreshOptions

interface PullRefreshInternalState {
	options: PullRefreshOptions
	state: PullRefreshState
	startY: number
	currentY: number
	pulling: boolean
	indicatorEl: HTMLDivElement
	contentEl: HTMLElement
	handlers: {
		touchStart: (e: TouchEvent) => void
		touchMove: (e: TouchEvent) => void
		touchEnd: () => void
	}
}

const DEFAULT_DISTANCE = 60
const DEFAULT_MAX_DISTANCE = 100
const DEFAULT_SUCCESS_DURATION = 500
const DEFAULT_ERROR_DURATION = 1000

const DEFAULT_INDICATORS: Record<PullRefreshState, string> = {
	idle: '↓',
	pulling: '↓ Pull',
	ready: '↓ Release',
	loading: '⟳ Loading...',
	success: '✓ Done',
	error: '✗ Failed',
}

function normalizeOptions(binding: PullRefreshBinding): PullRefreshOptions {
	if (typeof binding === 'function') return { handler: binding }

	return {
		handler: binding.handler,
		distance: binding.distance ?? DEFAULT_DISTANCE,
		maxDistance: binding.maxDistance ?? DEFAULT_MAX_DISTANCE,
		disabled: binding.disabled ?? false,
		indicator: binding.indicator,
		successDuration: binding.successDuration ?? DEFAULT_SUCCESS_DURATION,
		errorDuration: binding.errorDuration ?? DEFAULT_ERROR_DURATION,
		onStateChange: binding.onStateChange,
	}
}

function createIndicator(): HTMLDivElement {
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
		background: #f5f5f5;
		font-size: 14px;
		color: #666;
		z-index: 10;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s ease;
	`
	return el
}

function updateIndicator(el: HTMLDivElement, state: PullRefreshState, options: PullRefreshOptions): void {
	const customIndicator = options.indicator?.[state]
	el.textContent = customIndicator || DEFAULT_INDICATORS[state]
}

function setState(internal: PullRefreshInternalState, newState: PullRefreshState): void {
	if (internal.state === newState) return

	internal.state = newState
	updateIndicator(internal.indicatorEl, newState, internal.options)
	internal.options.onStateChange?.(newState)
}

function applyTransform(internal: PullRefreshInternalState, distance: number, showIndicator: boolean): void {
	internal.contentEl.style.transform = `translateY(${distance}px)`
	internal.indicatorEl.style.opacity = showIndicator ? '1' : '0'
	internal.indicatorEl.style.transform = `translateY(${distance}px)`
}

function resetPosition(internal: PullRefreshInternalState): void {
	internal.contentEl.style.transform = ''
	internal.indicatorEl.style.opacity = '0'
	setState(internal, 'idle')
}

async function triggerRefresh(internal: PullRefreshInternalState): Promise<void> {
	setState(internal, 'loading')

	const distance = internal.options.distance!
	applyTransform(internal, distance, true)

	try {
		await internal.options.handler()
		setState(internal, 'success')
		await sleep(internal.options.successDuration!)
	} catch {
		setState(internal, 'error')
		await sleep(internal.options.errorDuration!)
	} finally {
		resetPosition(internal)
	}
}

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function createHandlers(internal: PullRefreshInternalState): PullRefreshInternalState['handlers'] {
	const { contentEl, options } = internal

	return {
		touchStart: (e: TouchEvent) => {
			if (options.disabled || internal.state === 'loading') return
			if (contentEl.scrollTop > 0) return

			internal.pulling = true
			internal.startY = e.touches[0].clientY
			internal.currentY = internal.startY
			setState(internal, 'idle')
		},

		touchMove: (e: TouchEvent) => {
			if (!internal.pulling || options.disabled || internal.state === 'loading') return

			internal.currentY = e.touches[0].clientY
			const diff = internal.currentY - internal.startY

			// Handle upward swipe - reset
			if (diff <= 0) {
				if (contentEl.style.transform) {
					contentEl.style.transition = ''
					resetPosition(internal)
				}
				return
			}

			// Prevent page scroll
			e.preventDefault()

			const distance = Math.min(diff * 0.5, options.maxDistance!)
			const progress = distance / options.distance!

			contentEl.style.transition = 'none'
			applyTransform(internal, distance, true)
			setState(internal, progress >= 1 ? 'ready' : 'pulling')
		},

		touchEnd: () => {
			if (!internal.pulling || options.disabled) return

			internal.pulling = false
			const diff = internal.currentY - internal.startY
			const distance = Math.min(diff * 0.5, options.maxDistance!)

			contentEl.style.transition = ''

			if (internal.state === 'ready' && distance >= options.distance!) {
				triggerRefresh(internal)
			} else {
				resetPosition(internal)
			}
		},
	}
}

function bindEvents(el: HTMLElement, handlers: PullRefreshInternalState['handlers']): void {
	el.addEventListener('touchstart', handlers.touchStart, { passive: false })
	el.addEventListener('touchmove', handlers.touchMove, { passive: false })
	el.addEventListener('touchend', handlers.touchEnd, { passive: true })
}

function unbindEvents(el: HTMLElement, handlers: PullRefreshInternalState['handlers']): void {
	el.removeEventListener('touchstart', handlers.touchStart)
	el.removeEventListener('touchmove', handlers.touchMove)
	el.removeEventListener('touchend', handlers.touchEnd)
}

export const vPullRefresh = defineDirective<PullRefreshBinding, HTMLElement>({
	name: 'pull-refresh',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		// Setup container
		el.style.position = 'relative'
		el.style.overflow = 'hidden'
		el.classList.add('v-pull-refresh')

		// Create content wrapper
		const contentEl = document.createElement('div')
		contentEl.className = 'v-pull-refresh__content'
		contentEl.style.cssText = 'position: relative; height: 100%; overflow-y: auto;'

		// Move children to wrapper
		while (el.firstChild) {
			contentEl.appendChild(el.firstChild)
		}
		el.appendChild(contentEl)

		// Create indicator
		const indicatorEl = createIndicator()
		el.insertBefore(indicatorEl, contentEl)

		// Initialize state
		const internal: PullRefreshInternalState = {
			options,
			state: 'idle',
			startY: 0,
			currentY: 0,
			pulling: false,
			indicatorEl,
			contentEl,
			handlers: null as any,
		}

		internal.handlers = createHandlers(internal)
		;(el as any).__pullRefresh = internal

		if (!options.disabled) {
			bindEvents(el, internal.handlers)
		}

		updateIndicator(indicatorEl, 'idle', options)
	},

	updated(el, binding) {
		const internal: PullRefreshInternalState = (el as any).__pullRefresh
		if (!internal) return

		const wasDisabled = internal.options.disabled
		internal.options = normalizeOptions(binding.value)

		updateIndicator(internal.indicatorEl, internal.state, internal.options)

		if (internal.options.disabled && !wasDisabled) {
			unbindEvents(el, internal.handlers)
		} else if (!internal.options.disabled && wasDisabled) {
			bindEvents(el, internal.handlers)
		}
	},

	unmounted(el) {
		const internal: PullRefreshInternalState = (el as any).__pullRefresh
		if (!internal) return

		unbindEvents(el, internal.handlers)
		delete (el as any).__pullRefresh
	},
})

export default vPullRefresh
