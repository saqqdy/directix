import { isBrowser, supportsPassive } from '@directix/core'

export interface EventOptions {
	capture?: boolean
	passive?: boolean
	once?: boolean
}

/**
 * 添加事件监听
 */
export function on(
	target: EventTarget,
	event: string,
	handler: (event: Event) => void,
	options: boolean | EventOptions = false,
): void {
	if (!isBrowser()) return
	const opts = normalizeOptions(options)

	target.addEventListener(event, handler, opts)
}

/**
 * 移除事件监听
 */
export function off(
	target: EventTarget,
	event: string,
	handler: (event: Event) => void,
	options: boolean | EventOptions = false,
): void {
	if (!isBrowser()) return
	const opts = normalizeOptions(options)

	target.removeEventListener(event, handler, opts)
}

/**
 * 触发自定义事件
 */
export function emit(target: EventTarget, event: string, detail?: any): boolean {
	if (!isBrowser()) return false

	return target.dispatchEvent(new CustomEvent(event, { detail }))
}

/**
 * 标准化事件选项
 */
function normalizeOptions(options: boolean | EventOptions): boolean | { capture: boolean; passive: boolean; once: boolean } {
	if (typeof options === 'boolean') {
		return options
	}

	const { capture = false, passive = false, once = false } = options

	if (supportsPassive()) {
		return { capture, passive, once }
	}

	return capture
}

/**
 * 创建事件委托
 */
export function delegate(
	container: Element,
	selector: string,
	event: string,
	handler: (el: Element, e: Event) => void,
	options?: EventOptions,
): () => void {
	const listener = (e: Event): void => {
		const target = e.target as Element
		const matched = target.closest(selector)

		if (matched && container.contains(matched)) {
			handler(matched, e)
		}
	}

	on(container, event, listener, options)

	return () => off(container, event, listener, options)
}

/**
 * 阻止事件冒泡
 */
export function stopPropagation(e: Event): void {
	e.stopPropagation()
}

/**
 * 阻止默认行为
 */
export function preventDefault(e: Event): void {
	e.preventDefault()
}

/**
 * 停止事件传播并阻止默认行为
 */
export function stopEvent(e: Event): void {
	stopPropagation(e)
	preventDefault(e)
}

/**
 * 获取事件目标
 */
export function getEventTarget<T extends EventTarget = EventTarget>(e: Event): T | null {
	return e.target as T | null
}

/**
 * 获取当前事件目标
 */
export function getCurrentTarget<T extends EventTarget = EventTarget>(e: Event): T | null {
	return e.currentTarget as T | null
}

/**
 * 获取鼠标/触摸位置
 */
export function getEventPosition(
	e: MouseEvent | TouchEvent,
): { x: number; y: number; clientX: number; clientY: number } {
	let clientX = 0,
		clientY = 0

	if ('touches' in e && e.touches.length > 0) {
		clientX = e.touches[0].clientX
		clientY = e.touches[0].clientY
	} else if ('clientX' in e) {
		clientX = e.clientX
		clientY = e.clientY
	}

	return {
		x: clientX,
		y: clientY,
		clientX,
		clientY,
	}
}
