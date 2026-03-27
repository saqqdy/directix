import { isBrowser } from '@directix/core'

/**
 * Check if value is an Element
 */
export function isElement(value: unknown): value is Element {
	return value instanceof Element
}

/**
 * Check if value is an HTMLElement
 */
export function isHTMLElement(value: unknown): value is HTMLElement {
	return value instanceof HTMLElement
}

/**
 * Get element by selector or return element itself
 */
export function getElement(target: string | Element | null | undefined): Element | null {
	if (!target) return null

	if (typeof target === 'string') {
		if (!isBrowser()) return null

		return document.querySelector(target)
	}

	return isElement(target) ? target : null
}

/**
 * Get all elements matching selector
 */
export function getAllElements(target: string): Element[] {
	if (!isBrowser()) return []

	return Array.from(document.querySelectorAll(target))
}

/**
 * Add classes to element
 */
export function addClass(el: Element, ...classes: string[]): void {
	el.classList.add(...classes)
}

/**
 * Remove classes from element
 */
export function removeClass(el: Element, ...classes: string[]): void {
	el.classList.remove(...classes)
}

/**
 * Toggle class on element
 */
export function toggleClass(el: Element, className: string, force?: boolean): void {
	el.classList.toggle(className, force)
}

/**
 * Check if element has class
 */
export function hasClass(el: Element, className: string): boolean {
	return el.classList.contains(className)
}

/**
 * Get element style property
 */
export function getStyle(el: Element, property: string): string {
	if (!isBrowser()) return ''

	return getComputedStyle(el).getPropertyValue(property)
}

/**
 * Set element style property
 */
export function setStyle(el: HTMLElement, property: string, value: string | number): void {
	el.style.setProperty(property, typeof value === 'number' ? `${value}px` : value)
}

/**
 * Set multiple styles on element
 */
export function setStyles(el: HTMLElement, styles: Record<string, string | number>): void {
	Object.entries(styles).forEach(([property, value]) => {
		setStyle(el, property, value)
	})
}

/**
 * Get element offset position
 */
export function getOffset(el: Element): { top: number; left: number } {
	if (!isBrowser()) return { top: 0, left: 0 }
	const rect = el.getBoundingClientRect()

	return {
		top: rect.top + window.scrollY,
		left: rect.left + window.scrollX,
	}
}

/**
 * Get element size
 */
export function getSize(el: Element): { width: number; height: number } {
	const rect = el.getBoundingClientRect()

	return {
		width: rect.width,
		height: rect.height,
	}
}

/**
 * Check if element is in viewport
 */
export function isInViewport(el: Element): boolean {
	if (!isBrowser()) return false
	const rect = el.getBoundingClientRect()

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	)
}

/**
 * Get nearest scrollable parent element
 */
export function getScrollParent(el: Element): Element | Window {
	if (!isBrowser()) return window

	let parent: Element | null = el.parentElement

	while (parent) {
		const { overflow, overflowX, overflowY } = getComputedStyle(parent)

		if (/(auto|scroll)/.test(overflow + overflowX + overflowY)) {
			return parent
		}

		parent = parent.parentElement
	}

	return window
}

/**
 * Check if element matches selector
 */
export function matches(el: Element, selector: string): boolean {
	return el.matches(selector)
}

/**
 * Get nearest ancestor matching selector
 */
export function closest(el: Element, selector: string): Element | null {
	return el.closest(selector)
}
