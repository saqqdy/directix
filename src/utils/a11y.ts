import { isBrowser } from '@directix/core'
import { onUnmounted, readonly, ref, type Ref } from 'vue'

/**
 * A11y (Accessibility) Utilities for Directix
 *
 * Provides comprehensive accessibility support including:
 * - ARIA attribute management
 * - Keyboard navigation
 * - Screen reader announcements
 * - Focus management
 */

/**
 * ARIA role types
 */
export type ARIARole
	= | 'alert'
		| 'alertdialog'
		| 'application'
		| 'article'
		| 'banner'
		| 'button'
		| 'cell'
		| 'checkbox'
		| 'columnheader'
		| 'combobox'
		| 'complementary'
		| 'contentinfo'
		| 'definition'
		| 'dialog'
		| 'directory'
		| 'document'
		| 'feed'
		| 'figure'
		| 'form'
		| 'grid'
		| 'gridcell'
		| 'group'
		| 'heading'
		| 'img'
		| 'link'
		| 'list'
		| 'listbox'
		| 'listitem'
		| 'log'
		| 'main'
		| 'marquee'
		| 'math'
		| 'menu'
		| 'menubar'
		| 'menuitem'
		| 'menuitemcheckbox'
		| 'menuitemradio'
		| 'navigation'
		| 'none'
		| 'note'
		| 'option'
		| 'presentation'
		| 'progressbar'
		| 'radio'
		| 'radiogroup'
		| 'region'
		| 'row'
		| 'rowgroup'
		| 'rowheader'
		| 'scrollbar'
		| 'search'
		| 'searchbox'
		| 'separator'
		| 'slider'
		| 'spinbutton'
		| 'status'
		| 'switch'
		| 'tab'
		| 'table'
		| 'tablist'
		| 'tabpanel'
		| 'term'
		| 'textbox'
		| 'timer'
		| 'toolbar'
		| 'tooltip'
		| 'tree'
		| 'treegrid'
		| 'treeitem'

/**
 * ARIA live region priority
 */
export type ARIALivePriority = 'off' | 'polite' | 'assertive'

/**
 * ARIA popup type
 */
export type ARIAPopupType = 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'tooltip'

/**
 * ARIA attribute configuration
 */
export interface ARIAConfig {
	/** Role */
	role?: ARIARole

	/** State attributes */
	ariaExpanded?: boolean
	ariaSelected?: boolean
	ariaChecked?: boolean
	ariaDisabled?: boolean
	ariaHidden?: boolean
	ariaBusy?: boolean
	ariaPressed?: boolean
	ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean

	/** Property attributes */
	ariaLabel?: string
	ariaLabelledBy?: string
	ariaDescribedBy?: string
	ariaControls?: string
	ariaOwns?: string
	ariaHasPopup?: ARIAPopupType | boolean
	ariaAutoComplete?: 'inline' | 'list' | 'both' | 'none'

	/** Live region attributes */
	ariaLive?: ARIALivePriority
	ariaAtomic?: boolean
	ariaRelevant?: 'additions' | 'removals' | 'text' | 'all'

	/** Other attributes */
	ariaValueNow?: number
	ariaValueMin?: number
	ariaValueMax?: number
	ariaValueText?: string
	ariaPlaceholder?: string
	ariaRequired?: boolean
	ariaReadonly?: boolean
	ariaModal?: boolean

	/** Tab index */
	tabIndex?: number
}

/**
 * Apply ARIA attributes to an element
 */
export function applyAriaAttributes(el: HTMLElement, config: ARIAConfig): void {
	// Clear previous ARIA attributes
	clearAriaAttributes(el)

	// Set role
	if (config.role) {
		el.setAttribute('role', config.role)
	}

	// Set state attributes
	if (config.ariaExpanded !== undefined) {
		el.setAttribute('aria-expanded', String(config.ariaExpanded))
	}
	if (config.ariaSelected !== undefined) {
		el.setAttribute('aria-selected', String(config.ariaSelected))
	}
	if (config.ariaChecked !== undefined) {
		el.setAttribute('aria-checked', String(config.ariaChecked))
	}
	if (config.ariaDisabled !== undefined) {
		el.setAttribute('aria-disabled', String(config.ariaDisabled))
		if (config.ariaDisabled) {
			el.setAttribute('tabindex', '-1')
		}
	}
	if (config.ariaHidden !== undefined) {
		el.setAttribute('aria-hidden', String(config.ariaHidden))
	}
	if (config.ariaBusy !== undefined) {
		el.setAttribute('aria-busy', String(config.ariaBusy))
	}
	if (config.ariaPressed !== undefined) {
		el.setAttribute('aria-pressed', String(config.ariaPressed))
	}
	if (config.ariaCurrent !== undefined) {
		el.setAttribute('aria-current', typeof config.ariaCurrent === 'boolean' ? String(config.ariaCurrent) : config.ariaCurrent)
	}

	// Set property attributes
	if (config.ariaLabel) {
		el.setAttribute('aria-label', config.ariaLabel)
	}
	if (config.ariaLabelledBy) {
		el.setAttribute('aria-labelledby', config.ariaLabelledBy)
	}
	if (config.ariaDescribedBy) {
		el.setAttribute('aria-describedby', config.ariaDescribedBy)
	}
	if (config.ariaControls) {
		el.setAttribute('aria-controls', config.ariaControls)
	}
	if (config.ariaOwns) {
		el.setAttribute('aria-owns', config.ariaOwns)
	}
	if (config.ariaHasPopup !== undefined) {
		const value = typeof config.ariaHasPopup === 'boolean' ? 'true' : config.ariaHasPopup
		el.setAttribute('aria-haspopup', value)
	}
	if (config.ariaAutoComplete) {
		el.setAttribute('aria-autocomplete', config.ariaAutoComplete)
	}

	// Set live region attributes
	if (config.ariaLive) {
		el.setAttribute('aria-live', config.ariaLive)
	}
	if (config.ariaAtomic !== undefined) {
		el.setAttribute('aria-atomic', String(config.ariaAtomic))
	}
	if (config.ariaRelevant) {
		el.setAttribute('aria-relevant', config.ariaRelevant)
	}

	// Set value attributes
	if (config.ariaValueNow !== undefined) {
		el.setAttribute('aria-valuenow', String(config.ariaValueNow))
	}
	if (config.ariaValueMin !== undefined) {
		el.setAttribute('aria-valuemin', String(config.ariaValueMin))
	}
	if (config.ariaValueMax !== undefined) {
		el.setAttribute('aria-valuemax', String(config.ariaValueMax))
	}
	if (config.ariaValueText) {
		el.setAttribute('aria-valuetext', config.ariaValueText)
	}

	// Set other attributes
	if (config.ariaPlaceholder) {
		el.setAttribute('aria-placeholder', config.ariaPlaceholder)
	}
	if (config.ariaRequired !== undefined) {
		el.setAttribute('aria-required', String(config.ariaRequired))
	}
	if (config.ariaReadonly !== undefined) {
		el.setAttribute('aria-readonly', String(config.ariaReadonly))
	}
	if (config.ariaModal !== undefined) {
		el.setAttribute('aria-modal', String(config.ariaModal))
	}

	// Set tabindex
	if (config.tabIndex !== undefined) {
		el.setAttribute('tabindex', String(config.tabIndex))
	}
}

/**
 * Clear all ARIA attributes from an element
 */
export function clearAriaAttributes(el: HTMLElement): void {
	const ariaAttrs = Array.from(el.attributes)
		.filter(attr => attr.name.startsWith('aria-') || attr.name === 'role')

	ariaAttrs.forEach(attr => el.removeAttribute(attr.name))
}

/**
 * Generate unique ID for ARIA references
 */
export function generateAriaId(prefix = 'directix-aria'): string {
	return `${prefix}-${Math.random().toString(36).substring(2, 10)}`
}

/**
 * Create screen reader announcer element
 */
let announcerElement: HTMLDivElement | null = null,
	announcerId: string | null = null

function ensureAnnouncer(): HTMLDivElement {
	if (announcerElement && document.getElementById(announcerId || '')) {
		return announcerElement
	}

	announcerId = 'directix-sr-announcer'
	announcerElement = document.createElement('div')
	announcerElement.id = announcerId
	announcerElement.setAttribute('aria-live', 'polite')
	announcerElement.setAttribute('aria-atomic', 'true')
	announcerElement.setAttribute(
		'style',
		'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;',
	)
	document.body.appendChild(announcerElement)

	return announcerElement
}

/**
 * Announce message to screen readers
 */
export interface AnnounceOptions {
	/** Priority level */
	priority?: ARIALivePriority
	/** Time before clearing message */
	timeout?: number
	/** Whether to clear queue */
	clear?: boolean
}

/**
 * Announce a message to screen readers
 */
export function announce(message: string, options: AnnounceOptions = {}): void {
	if (!isBrowser()) return

	const { priority = 'polite', timeout = 1000, clear = true } = options

	const announcer = ensureAnnouncer()
	announcer.setAttribute('aria-live', priority)

	// Clear existing content first
	announcer.textContent = ''

	// Set message in next tick for screen readers to announce
	requestAnimationFrame(() => {
		announcer.textContent = message

		if (clear) {
			setTimeout(() => {
				if (announcer.textContent === message) {
					announcer.textContent = ''
				}
			}, timeout)
		}
	})
}

/**
 * Clear the announcer
 */
export function clearAnnouncer(): void {
	if (announcerElement) {
		announcerElement.textContent = ''
	}
}

/**
 * Keyboard navigation configuration
 */
export interface KeyboardNavigationConfig {
	/** Keys for next item */
	nextKeys?: string[]
	/** Keys for previous item */
	prevKeys?: string[]
	/** Keys for selection */
	selectKeys?: string[]
	/** Keys for closing */
	closeKeys?: string[]
	/** Keys for home */
	homeKeys?: string[]
	/** Keys for end */
	endKeys?: string[]
	/** Focus trap enabled */
	focusTrap?: boolean
	/** Whether element should receive initial focus */
	initialFocus?: string | HTMLElement | (() => HTMLElement | null)
	/** Return focus on close */
	returnFocus?: boolean
	/** Navigation mode */
	mode?: 'linear' | 'grid' | 'tree'
	/** Loop navigation */
	loop?: boolean
	/** Roving tabindex enabled */
	rovingTabindex?: boolean
}

const DEFAULT_NEXT_KEYS = ['ArrowDown', 'ArrowRight']
const DEFAULT_PREV_KEYS = ['ArrowUp', 'ArrowLeft']
const DEFAULT_SELECT_KEYS = ['Enter', ' ']
const DEFAULT_CLOSE_KEYS = ['Escape']
const DEFAULT_HOME_KEYS = ['Home']
const DEFAULT_END_KEYS = ['End']

/**
 * Return type for useKeyboardNavigation
 */
export interface UseKeyboardNavigationReturn {
	/** Current focused index */
	focusedIndex: Readonly<Ref<number>>
	/** Bind keyboard navigation to container */
	bind: (container: HTMLElement, items: HTMLElement[]) => () => void
	/** Focus item at index */
	focusIndex: (index: number) => void
	/** Focus next item */
	focusNext: () => void
	/** Focus previous item */
	focusPrev: () => void
	/** Focus first item */
	focusFirst: () => void
	/** Focus last item */
	focusLast: () => void
}

/**
 * Composable for keyboard navigation
 */
export function useKeyboardNavigation(options: KeyboardNavigationConfig = {}): UseKeyboardNavigationReturn {
	const {
		nextKeys = DEFAULT_NEXT_KEYS,
		prevKeys = DEFAULT_PREV_KEYS,
		selectKeys = DEFAULT_SELECT_KEYS,
		closeKeys = DEFAULT_CLOSE_KEYS,
		homeKeys = DEFAULT_HOME_KEYS,
		endKeys = DEFAULT_END_KEYS,
		focusTrap = false,
		returnFocus = true,
		mode: _mode = 'linear',
		loop = true,
		rovingTabindex = false,
	} = options

	const focusedIndex = ref(0)

	let items: HTMLElement[] = [],
		triggerElement: HTMLElement | null = null,
		cleanup: (() => void) | null = null

	function getFocusables(): HTMLElement[] {
		return items.filter(item => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true')
	}

	function focusIndex(index: number): void {
		const focusables = getFocusables()
		if (focusables.length === 0) return

		let newIndex = index
		if (newIndex < 0) {
			newIndex = loop ? focusables.length - 1 : 0
		} else if (newIndex >= focusables.length) {
			newIndex = loop ? 0 : focusables.length - 1
		}

		const target = focusables[newIndex]
		if (target) {
			target.focus()

			// Update roving tabindex
			if (rovingTabindex) {
				focusables.forEach((item, i) => {
					item.setAttribute('tabindex', i === newIndex ? '0' : '-1')
				})
			}

			focusedIndex.value = newIndex
		}
	}

	function focusNext(): void {
		focusIndex(focusedIndex.value + 1)
	}

	function focusPrev(): void {
		focusIndex(focusedIndex.value - 1)
	}

	function focusFirst(): void {
		focusIndex(0)
	}

	function focusLast(): void {
		focusIndex(getFocusables().length - 1)
	}

	function handleKeyDown(e: KeyboardEvent): void {
		// Check for modifiers
		const isModified = e.altKey || e.ctrlKey || e.metaKey

		if (isModified) return

		// Handle focus trap
		if (focusTrap && e.key === 'Tab') {
			const focusables = getFocusables()
			if (focusables.length === 0) return

			e.preventDefault()
			if (e.shiftKey) {
				focusPrev()
			} else {
				focusNext()
			}
			return
		}

		// Navigation keys
		if (nextKeys.includes(e.key)) {
			e.preventDefault()
			focusNext()
		} else if (prevKeys.includes(e.key)) {
			e.preventDefault()
			focusPrev()
		} else if (homeKeys.includes(e.key)) {
			e.preventDefault()
			focusFirst()
		} else if (endKeys.includes(e.key)) {
			e.preventDefault()
			focusLast()
		} else if (selectKeys.includes(e.key)) {
			e.preventDefault()
			items[focusedIndex.value]?.click()
		} else if (closeKeys.includes(e.key)) {
			e.preventDefault()
			// Return focus
			if (returnFocus && triggerElement) {
				triggerElement.focus()
			}
		}
	}

	function bind(el: HTMLElement, itemElements: HTMLElement[]): () => void {
		// Cleanup previous
		cleanup?.()

		items = itemElements
		triggerElement = document.activeElement as HTMLElement

		// Set up event listeners
		el.addEventListener('keydown', handleKeyDown)

		// Update roving tabindex
		if (rovingTabindex && items.length > 0) {
			items.forEach((item, i) => {
				item.setAttribute('tabindex', i === 0 ? '0' : '-1')
			})
		}

		// Set initial focus
		if (items.length > 0) {
			focusIndex(0)
		}

		cleanup = () => {
			el.removeEventListener('keydown', handleKeyDown)
			items = []
		}

		return cleanup
	}

	onUnmounted(() => {
		cleanup?.()
	})

	return {
		focusedIndex: readonly(focusedIndex),
		bind,
		focusIndex,
		focusNext,
		focusPrev,
		focusFirst,
		focusLast,
	}
}

/**
 * Focus trap options
 */
export interface FocusTrapOptions {
	/** Initial focus element */
	initialFocus?: HTMLElement | string | (() => HTMLElement | null)
	/** Elements to allow focus escape */
	allowOutsideClick?: boolean | ((event: MouseEvent | TouchEvent) => boolean)
	/** Enable escape key */
	escapeDeactivates?: boolean
	/** Callback on activate */
	onActivate?: () => void
	/** Callback on deactivate */
	onDeactivate?: () => void
}

/**
 * Return type for useFocusTrap
 */
export interface UseFocusTrapReturn {
	/** Activate focus trap */
	activate: () => void
	/** Deactivate focus trap */
	deactivate: () => void
	/** Whether active */
	isActive: Readonly<Ref<boolean>>
}

/**
 * Composable for focus trap
 */
export function useFocusTrap(container: Ref<HTMLElement | null>, options: FocusTrapOptions = {}): UseFocusTrapReturn {
	const {
		initialFocus,
		allowOutsideClick = false,
		escapeDeactivates = true,
		onActivate,
		onDeactivate,
	} = options

	const isActive = ref(false)

	let lastFocusedElement: HTMLElement | null = null

	function getFocusableElements(): HTMLElement[] {
		const el = container.value
		if (!el) return []

		const selector = [
			'a[href]',
			'button:not([disabled])',
			'textarea:not([disabled])',
			'input:not([disabled])',
			'select:not([disabled])',
			'[tabindex]:not([tabindex="-1"])',
		].join(', ')

		return Array.from(el.querySelectorAll<HTMLElement>(selector))
			.filter(item => !item.hasAttribute('aria-hidden'))
	}

	function handleKeyDown(e: KeyboardEvent): void {
		if (!isActive.value) return

		if (escapeDeactivates && e.key === 'Escape') {
			e.preventDefault()
			deactivate()
			return
		}

		if (e.key !== 'Tab') return

		const el = container.value
		if (!el) return

		const focusables = getFocusableElements()
		if (focusables.length === 0) return

		const firstFocusable = focusables[0]
		const lastFocusable = focusables[focusables.length - 1]
		const currentElement = document.activeElement as HTMLElement

		if (e.shiftKey) {
			if (currentElement === firstFocusable || !el.contains(currentElement)) {
				e.preventDefault()
				lastFocusable.focus()
			}
		} else {
			if (currentElement === lastFocusable || !el.contains(currentElement)) {
				e.preventDefault()
				firstFocusable.focus()
			}
		}
	}

	function handleOutsideClick(event: MouseEvent | TouchEvent): void {
		if (!isActive.value) return
		if (!container.value) return

		if (typeof allowOutsideClick === 'boolean' && !allowOutsideClick) {
			event.preventDefault()
			return
		}

		if (typeof allowOutsideClick === 'function' && !allowOutsideClick(event)) {
			event.preventDefault()
		}
	}

	function activate(): void {
		if (isActive.value) return

		lastFocusedElement = document.activeElement as HTMLElement

		// Set initial focus
		if (initialFocus) {
			let initialEl: HTMLElement | null = null
			if (typeof initialFocus === 'function') {
				initialEl = initialFocus()
			} else if (typeof initialFocus === 'string') {
				initialEl = container.value?.querySelector(initialFocus) || null
			} else {
				initialEl = initialFocus
			}

			initialEl?.focus()
		} else {
			const focusables = getFocusableElements()
			if (focusables.length > 0) {
				focusables[0].focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		document.addEventListener('mousedown', handleOutsideClick)
		document.addEventListener('touchstart', handleOutsideClick)

		isActive.value = true
		onActivate?.()
	}

	function deactivate(): void {
		if (!isActive.value) return

		document.removeEventListener('keydown', handleKeyDown)
		document.removeEventListener('mousedown', handleOutsideClick)
		document.removeEventListener('touchstart', handleOutsideClick)

		// Return focus
		if (lastFocusedElement && lastFocusedElement.focus) {
			lastFocusedElement.focus()
		}

		isActive.value = false
		onDeactivate?.()
	}

	onUnmounted(() => {
		deactivate()
	})

	return {
		activate,
		deactivate,
		isActive: readonly(isActive),
	}
}

/**
 * Auto-generate ARIA attributes based on directive type
 */
export interface AutoAriaOptions {
	/** Directive type */
	type: 'tooltip' | 'menu' | 'dialog' | 'popover' | 'dropdown' | 'modal' | 'alert' | 'region'
	/** Label for the element */
	label?: string
	/** Whether element is expanded */
	expanded?: boolean
	/** Whether element is disabled */
	disabled?: boolean
	/** Related element ID */
	relatedId?: string
}

/**
 * Get default ARIA config for directive type
 */
export function getAutoAriaConfig(options: AutoAriaOptions): ARIAConfig {
	const { type, label, expanded, disabled, relatedId } = options

	const configs: Record<string, ARIAConfig> = {
		tooltip: {
			role: 'tooltip',
			ariaHidden: expanded === undefined ? true : !expanded,
		},
		menu: {
			role: 'menu',
			ariaLabel: label,
			ariaExpanded: expanded,
			ariaDisabled: disabled,
		},
		dialog: {
			role: 'dialog',
			ariaLabel: label,
			ariaModal: true,
		},
		popover: {
			role: 'region',
			ariaLabel: label,
			ariaExpanded: expanded,
		},
		dropdown: {
			role: 'listbox',
			ariaLabel: label,
			ariaExpanded: expanded,
		},
		modal: {
			role: 'dialog',
			ariaModal: true,
			ariaLabel: label,
		},
		alert: {
			role: 'alert',
			ariaLive: 'assertive',
			ariaAtomic: true,
		},
		region: {
			role: 'region',
			ariaLabel: label,
		},
	}

	const config = { ...configs[type] || {} }

	if (relatedId) {
		if (type === 'tooltip') {
			config.ariaDescribedBy = relatedId
		} else {
			config.ariaControls = relatedId
		}
	}

	return config
}
