import { isBrowser } from '@directix/core'

/**
 * 检查是否为元素
 */
export function isElement(value: unknown): value is Element {
	return value instanceof Element
}

/**
 * 检查是否为 HTML 元素
 */
export function isHTMLElement(value: unknown): value is HTMLElement {
	return value instanceof HTMLElement
}

/**
 * 获取元素
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
 * 获取所有匹配元素
 */
export function getAllElements(target: string): Element[] {
	if (!isBrowser()) return []

	return Array.from(document.querySelectorAll(target))
}

/**
 * 添加类名
 */
export function addClass(el: Element, ...classes: string[]): void {
	el.classList.add(...classes)
}

/**
 * 移除类名
 */
export function removeClass(el: Element, ...classes: string[]): void {
	el.classList.remove(...classes)
}

/**
 * 切换类名
 */
export function toggleClass(el: Element, className: string, force?: boolean): void {
	el.classList.toggle(className, force)
}

/**
 * 检查是否有类名
 */
export function hasClass(el: Element, className: string): boolean {
	return el.classList.contains(className)
}

/**
 * 获取元素样式
 */
export function getStyle(el: Element, property: string): string {
	if (!isBrowser()) return ''

	return getComputedStyle(el).getPropertyValue(property)
}

/**
 * 设置元素样式
 */
export function setStyle(el: HTMLElement, property: string, value: string | number): void {
	el.style.setProperty(property, typeof value === 'number' ? `${value}px` : value)
}

/**
 * 批量设置样式
 */
export function setStyles(el: HTMLElement, styles: Record<string, string | number>): void {
	Object.entries(styles).forEach(([property, value]) => {
		setStyle(el, property, value)
	})
}

/**
 * 获取元素位置
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
 * 获取元素尺寸
 */
export function getSize(el: Element): { width: number; height: number } {
	const rect = el.getBoundingClientRect()

	return {
		width: rect.width,
		height: rect.height,
	}
}

/**
 * 检查元素是否在视口内
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
 * 获取最近的滚动父元素
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
 * 检查元素是否匹配选择器
 */
export function matches(el: Element, selector: string): boolean {
	return el.matches(selector)
}

/**
 * 获取最近的匹配祖先元素
 */
export function closest(el: Element, selector: string): Element | null {
	return el.closest(selector)
}
