import { defineDirective } from '@directix/core'

/**
 * Tooltip placement
 */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

/**
 * Tooltip trigger
 */
export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual'

/**
 * Tooltip directive options
 */
export interface TooltipOptions {
	/** Tooltip content */
	content: string
	/** Tooltip placement @default 'top' */
	placement?: TooltipPlacement
	/** Trigger type @default 'hover' */
	trigger?: TooltipTrigger
	/** Show delay in milliseconds @default 0 */
	delay?: number
	/** Hide delay in milliseconds @default 0 */
	hideDelay?: number
	/** Offset from the element in pixels @default 8 */
	offset?: number
	/** Custom class for the tooltip */
	class?: string
	/** Whether to show arrow @default true */
	arrow?: boolean
	/** Whether the tooltip is disabled @default false */
	disabled?: boolean
	/** Maximum width of the tooltip */
	maxWidth?: number | string
	/** Z-index of the tooltip @default 9999 */
	zIndex?: number
	/** Callback when tooltip is shown */
	onShow?: () => void
	/** Callback when tooltip is hidden */
	onHide?: () => void
}

export type TooltipBinding = string | TooltipOptions

interface TooltipState {
	options: TooltipOptions
	tooltip: HTMLElement | null
	showTimeout: ReturnType<typeof setTimeout> | null
	hideTimeout: ReturnType<typeof setTimeout> | null
	isVisible: boolean
	handlers: {
		show?: () => void
		hide?: () => void
		toggle?: () => void
	}
}

// Default tooltip styles
const TOOLTIP_STYLES = {
	padding: '8px 12px',
	background: '#333',
	color: '#fff',
	borderRadius: '6px',
	fontSize: '14px',
	lineHeight: '1.5',
	minWidth: '96px',
	maxWidth: '320px',
	boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}

// Global tooltip container
let tooltipContainer: HTMLElement | null = null

function getTooltipContainer(): HTMLElement {
	if (!tooltipContainer && typeof document !== 'undefined') {
		tooltipContainer = document.createElement('div')
		tooltipContainer.id = 'directix-tooltip-container'
		tooltipContainer.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;'
		document.body.appendChild(tooltipContainer)
	}

	return tooltipContainer!
}

function createTooltip(options: TooltipOptions): HTMLElement {
	const tooltip = document.createElement('div')

	tooltip.className = `v-tooltip v-tooltip--${options.placement || 'top'}`
	if (options.class) tooltip.classList.add(options.class)

	const maxWidth = options.maxWidth ? typeof options.maxWidth === 'number' ? `${options.maxWidth}px` : options.maxWidth : TOOLTIP_STYLES.maxWidth

	tooltip.style.cssText = [
		'position: absolute',
		`padding: ${TOOLTIP_STYLES.padding}`,
		`background: ${TOOLTIP_STYLES.background}`,
		`color: ${TOOLTIP_STYLES.color}`,
		`border-radius: ${TOOLTIP_STYLES.borderRadius}`,
		`font-size: ${TOOLTIP_STYLES.fontSize}`,
		`line-height: ${TOOLTIP_STYLES.lineHeight}`,
		`min-width: ${TOOLTIP_STYLES.minWidth}`,
		`max-width: ${maxWidth}`,
		'word-wrap: break-word',
		`box-shadow: ${TOOLTIP_STYLES.boxShadow}`,
		'pointer-events: none',
		'opacity: 0',
		'transition: opacity 0.2s ease',
		`z-index: ${options.zIndex || 9999}`,
	].join(';')

	// Add arrow
	if (options.arrow !== false) {
		const arrow = document.createElement('div')

		arrow.className = 'v-tooltip__arrow'
		arrow.style.cssText = 'position: absolute; width: 8px; height: 8px; background: #333; transform: rotate(45deg);'
		tooltip.appendChild(arrow)
	}

	// Add content
	const content = document.createElement('div')

	content.className = 'v-tooltip__content'
	content.textContent = options.content
	tooltip.appendChild(content)

	return tooltip
}

function positionTooltip(
	tooltip: HTMLElement,
	el: HTMLElement,
	placement: TooltipPlacement,
	offset: number,
): void {
	const elRect = el.getBoundingClientRect()
	const tooltipRect = tooltip.getBoundingClientRect()

	let top = 0,
		left = 0

	switch (placement) {
		case 'top':
			top = elRect.top - tooltipRect.height - offset
			left = elRect.left + (elRect.width - tooltipRect.width) / 2
			break
		case 'bottom':
			top = elRect.bottom + offset
			left = elRect.left + (elRect.width - tooltipRect.width) / 2
			break
		case 'left':
			top = elRect.top + (elRect.height - tooltipRect.height) / 2
			left = elRect.left - tooltipRect.width - offset
			break
		case 'right':
			top = elRect.top + (elRect.height - tooltipRect.height) / 2
			left = elRect.right + offset
			break
	}

	// Keep within viewport
	const viewportWidth = window.innerWidth
	const viewportHeight = window.innerHeight

	if (left < 0) left = 8
	if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width - 8
	if (top < 0) top = 8
	if (top + tooltipRect.height > viewportHeight) top = viewportHeight - tooltipRect.height - 8

	tooltip.style.top = `${top}px`
	tooltip.style.left = `${left}px`

	// Position arrow
	const arrow = tooltip.querySelector('.v-tooltip__arrow') as HTMLElement

	if (arrow) {
		const halfArrow = 4

		switch (placement) {
			case 'top':
				Object.assign(arrow.style, { bottom: `-${halfArrow}px`, left: '50%', transform: 'translateX(-50%) rotate(45deg)' })
				break
			case 'bottom':
				Object.assign(arrow.style, { top: `-${halfArrow}px`, left: '50%', transform: 'translateX(-50%) rotate(45deg)' })
				break
			case 'left':
				Object.assign(arrow.style, { right: `-${halfArrow}px`, top: '50%', transform: 'translateY(-50%) rotate(45deg)' })
				break
			case 'right':
				Object.assign(arrow.style, { left: `-${halfArrow}px`, top: '50%', transform: 'translateY(-50%) rotate(45deg)' })
				break
		}
	}
}

function showTooltip(el: HTMLElement, state: TooltipState): void {
	if (state.isVisible || state.options.disabled) return

	if (state.hideTimeout) {
		clearTimeout(state.hideTimeout)
		state.hideTimeout = null
	}

	const doShow = (): void => {
		const tooltip = createTooltip(state.options)

		state.tooltip = tooltip
		getTooltipContainer().appendChild(tooltip)

		requestAnimationFrame(() => {
			positionTooltip(tooltip, el, state.options.placement || 'top', state.options.offset || 8)
			requestAnimationFrame(() => {
				tooltip.style.opacity = '1'
			})
		})

		state.isVisible = true
		state.options.onShow?.()
	}

	if (state.options.delay && state.options.delay > 0) {
		state.showTimeout = setTimeout(doShow, state.options.delay)
	} else {
		doShow()
	}
}

function hideTooltip(state: TooltipState): void {
	if (!state.isVisible) return

	if (state.showTimeout) {
		clearTimeout(state.showTimeout)
		state.showTimeout = null
	}

	const doHide = (): void => {
		if (state.tooltip) {
			state.tooltip.style.opacity = '0'
			setTimeout(() => {
				state.tooltip?.remove()
				state.tooltip = null
			}, 200)
		}

		state.isVisible = false
		state.options.onHide?.()
	}

	if (state.options.hideDelay && state.options.hideDelay > 0) {
		state.hideTimeout = setTimeout(doHide, state.options.hideDelay)
	} else {
		doHide()
	}
}

function setupTriggerHandlers(el: HTMLElement, state: TooltipState): void {
	const { trigger = 'hover' } = state.options

	const show = (): void => showTooltip(el, state)
	const hide = (): void => hideTooltip(state)
	const toggle = (): void => (state.isVisible ? hide() : show())

	state.handlers = { show, hide, toggle }

	switch (trigger) {
		case 'hover':
			el.addEventListener('mouseenter', show)
			el.addEventListener('mouseleave', hide)
			break
		case 'click':
			el.addEventListener('click', toggle)
			document.addEventListener('click', state.handlers.docHide = (e: Event) => {
				if (state.isVisible && !el.contains(e.target as Node)) hide()
			})
			break
		case 'focus':
			el.addEventListener('focus', show)
			el.addEventListener('blur', hide)
			break
		// 'manual' - no automatic handlers
	}
}

function removeTriggerHandlers(el: HTMLElement, state: TooltipState): void {
	const { show, hide, toggle, docHide } = state.handlers

	if (show) {
		el.removeEventListener('mouseenter', show)
		el.removeEventListener('focus', show)
	}
	if (hide) {
		el.removeEventListener('mouseleave', hide)
		el.removeEventListener('blur', hide)
	}
	if (toggle) {
		el.removeEventListener('click', toggle)
	}
	if (docHide) {
		document.removeEventListener('click', docHide)
	}
}

function normalizeOptions(binding: TooltipBinding | undefined): TooltipOptions {
	if (typeof binding === 'string') {
		return { content: binding, placement: 'top', trigger: 'hover' }
	}

	if (!binding) {
		return { content: '', placement: 'top', trigger: 'hover' }
	}

	return {
		content: binding.content,
		placement: binding.placement ?? 'top',
		trigger: binding.trigger ?? 'hover',
		delay: binding.delay ?? 0,
		hideDelay: binding.hideDelay ?? 0,
		offset: binding.offset ?? 8,
		class: binding.class,
		arrow: binding.arrow ?? true,
		disabled: binding.disabled ?? false,
		maxWidth: binding.maxWidth,
		zIndex: binding.zIndex ?? 9999,
		onShow: binding.onShow,
		onHide: binding.onHide,
	}
}

function createState(options: TooltipOptions): TooltipState {
	return {
		options,
		tooltip: null,
		showTimeout: null,
		hideTimeout: null,
		isVisible: false,
		handlers: {},
	}
}

export const vTooltip = defineDirective<TooltipBinding, HTMLElement>({
	name: 'tooltip',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !options.content) return

		const state = createState(options)

		;(el as any).__tooltip = state
		setupTriggerHandlers(el, state)
		el.setAttribute('aria-describedby', 'v-tooltip')
	},

	updated(el, binding) {
		const state: TooltipState | undefined = (el as any).__tooltip
		const newOptions = normalizeOptions(binding.value)

		// No state exists - create if needed
		if (!state) {
			if (!newOptions.disabled && newOptions.content) {
				const newState = createState(newOptions)

				;(el as any).__tooltip = newState
				setupTriggerHandlers(el, newState)

				if (newOptions.trigger === 'manual') {
					showTooltip(el, newState)
				}
			}

			return
		}

		// Handle manual trigger
		if (newOptions.trigger === 'manual') {
			const oldDisabled = state.options.disabled

			state.options = newOptions

			if (newOptions.disabled && !oldDisabled) {
				hideTooltip(state)
			} else if (!newOptions.disabled && oldDisabled) {
				showTooltip(el, state)
			}

			return
		}

		// Update visible tooltip content
		if (state.tooltip && state.isVisible) {
			const content = state.tooltip.querySelector('.v-tooltip__content')

			if (content) content.textContent = newOptions.content
		}

		state.options = newOptions
	},

	unmounted(el) {
		const state: TooltipState | undefined = (el as any).__tooltip

		if (!state) return

		if (state.showTimeout) clearTimeout(state.showTimeout)
		if (state.hideTimeout) clearTimeout(state.hideTimeout)
		state.tooltip?.remove()
		removeTriggerHandlers(el, state)
		delete (el as any).__tooltip
	},
})

export default vTooltip
