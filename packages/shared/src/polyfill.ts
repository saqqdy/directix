/**
 * Polyfill and fallback strategies for Directix
 * Provides fallback implementations for browsers that don't support modern APIs
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Polyfill status
 */
export interface PolyfillStatus {
	name: string
	available: boolean
	native: boolean
	polyfilled: boolean
}

/**
 * Fallback options for specific features
 */
export interface FallbackOptions {
	debounce?: number
	throttle?: number
	threshold?: number
	rootMargin?: string
}

// ============================================================================
// IntersectionObserver Fallback
// ============================================================================

/**
 * Simple scroll-based fallback for IntersectionObserver
 * Used when IntersectionObserver is not available
 */
export class IntersectionObserverFallback {
	private elements: Map<Element, { callback: IntersectionObserverCallback, options?: IntersectionObserverInit }> = new Map()
	private scrollHandler: () => void
	private resizeHandler: () => void
	private ticking: boolean = false
	private debounceTimer: number | null = null
	private options: FallbackOptions

	constructor(options: FallbackOptions = {}) {
		this.options = {
			debounce: options.debounce ?? 100,
			threshold: options.threshold ?? 0,
			rootMargin: options.rootMargin ?? '0px',
		}

		this.scrollHandler = this.handleScroll.bind(this)
		this.resizeHandler = this.handleResize.bind(this)

		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', this.scrollHandler, { passive: true })
			window.addEventListener('resize', this.resizeHandler, { passive: true })
		}
	}

	observe(element: Element, callback: IntersectionObserverCallback, options?: IntersectionObserverInit): void {
		this.elements.set(element, { callback, options })
		// Initial check
		this.checkElement(element)
	}

	unobserve(element: Element): void {
		this.elements.delete(element)
	}

	disconnect(): void {
		this.elements.clear()
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', this.scrollHandler)
			window.removeEventListener('resize', this.resizeHandler)
		}
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer)
		}
	}

	private handleScroll(): void {
		if (this.ticking) return
		this.ticking = true

		// Debounce check
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer)
		}

		this.debounceTimer = window.setTimeout(() => {
			this.checkAllElements()
			this.ticking = false
		}, this.options.debounce!)
	}

	private handleResize(): void {
		this.checkAllElements()
	}

	private checkAllElements(): void {
		this.elements.forEach((data, element) => {
			this.checkElement(element, data.callback, data.options)
		})
	}

	private checkElement(
		element: Element,
		callback?: IntersectionObserverCallback,
		options?: IntersectionObserverInit,
	): void {
		if (!callback) return

		const rect = element.getBoundingClientRect()
		const windowHeight = window.innerHeight
		const windowWidth = window.innerWidth

		const threshold = options?.threshold ?? this.options.threshold ?? 0
		const rootMargin = this.parseRootMargin(options?.rootMargin ?? this.options.rootMargin)

		const isVisible
			= rect.top >= -rootMargin.top
				&& rect.left >= -rootMargin.left
				&& rect.bottom <= windowHeight + rootMargin.bottom
				&& rect.right <= windowWidth + rootMargin.right

		// Calculate intersection ratio
		const intersectionRatio = this.calculateIntersectionRatio(rect, windowHeight, windowWidth)

		// Handle threshold as number or array
		const thresholdValue = Array.isArray(threshold) ? threshold[0] ?? 0 : threshold

		if (isVisible && intersectionRatio >= thresholdValue) {
			const entry: IntersectionObserverEntry = {
				boundingClientRect: rect,
				intersectionRatio,
				intersectionRect: rect,
				isIntersecting: true,
				rootBounds: {
					top: -rootMargin.top,
					left: -rootMargin.left,
					bottom: windowHeight + rootMargin.bottom,
					right: windowWidth + rootMargin.right,
					width: windowWidth + rootMargin.left + rootMargin.right,
					height: windowHeight + rootMargin.top + rootMargin.bottom,
					x: -rootMargin.left,
					y: -rootMargin.top,
					toJSON: () => {},
				},
				target: element as HTMLElement,
				time: performance.now(),
			}

			callback([entry], this as any)
		}
	}

	private parseRootMargin(margin: string | undefined): { top: number, left: number, bottom: number, right: number } {
		if (!margin) return { top: 0, left: 0, bottom: 0, right: 0 }

		const parts = margin.split(' ').map(p => parseInt(p, 10) || 0)

		if (parts.length === 1) {
			return { top: parts[0], left: parts[0], bottom: parts[0], right: parts[0] }
		}
		if (parts.length === 2) {
			return { top: parts[0], left: parts[1], bottom: parts[0], right: parts[1] }
		}
		if (parts.length === 3) {
			return { top: parts[0], left: parts[1], bottom: parts[2], right: parts[1] }
		}
		return { top: parts[0], left: parts[1], bottom: parts[2], right: parts[3] }
	}

	private calculateIntersectionRatio(
		rect: DOMRect,
		windowHeight: number,
		windowWidth: number,
	): number {
		const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0))
		const visibleWidth = Math.max(0, Math.min(rect.right, windowWidth) - Math.max(rect.left, 0))
		const visibleArea = visibleHeight * visibleWidth
		const totalArea = rect.height * rect.width

		return totalArea > 0 ? visibleArea / totalArea : 0
	}
}

// ============================================================================
// ResizeObserver Fallback
// ============================================================================

/**
 * Fallback for ResizeObserver using polling
 */
export class ResizeObserverFallback {
	private elements: Map<Element, ResizeObserverCallback> = new Map()
	private pollInterval: number
	private pollTimer: number | null = null
	private lastSizes: Map<Element, { width: number, height: number }> = new Map()

	constructor(options: FallbackOptions = {}) {
		this.pollInterval = options.debounce ?? 200
		this.startPolling()
	}

	observe(element: Element, callback: ResizeObserverCallback): void {
		this.elements.set(element, callback)
		this.lastSizes.set(element, {
			width: element.clientWidth,
			height: element.clientHeight,
		})
	}

	unobserve(element: Element): void {
		this.elements.delete(element)
		this.lastSizes.delete(element)
	}

	disconnect(): void {
		this.elements.clear()
		this.lastSizes.clear()
		this.stopPolling()
	}

	private startPolling(): void {
		if (typeof window === 'undefined') return
		this.pollTimer = window.setInterval(() => this.checkAllElements(), this.pollInterval)
	}

	private stopPolling(): void {
		if (this.pollTimer) {
			clearInterval(this.pollTimer)
			this.pollTimer = null
		}
	}

	private checkAllElements(): void {
		this.elements.forEach((callback, element) => {
			const lastSize = this.lastSizes.get(element)
			const currentWidth = element.clientWidth
			const currentHeight = element.clientHeight

			if (lastSize && (lastSize.width !== currentWidth || lastSize.height !== currentHeight)) {
				this.lastSizes.set(element, { width: currentWidth, height: currentHeight })

				const entry: ResizeObserverEntry = {
					target: element as HTMLElement,
					contentRect: {
						width: currentWidth,
						height: currentHeight,
						top: 0,
						left: 0,
						bottom: currentHeight,
						right: currentWidth,
						x: 0,
						y: 0,
						toJSON: () => {},
					},
					borderBoxSize: [
						{
							inlineSize: currentWidth,
							blockSize: currentHeight,
							toJSON: () => {},
						},
					] as any,
					contentBoxSize: [
						{
							inlineSize: currentWidth,
							blockSize: currentHeight,
							toJSON: () => {},
						},
					] as any,
					devicePixelContentBoxSize: [
						{
							inlineSize: currentWidth,
							blockSize: currentHeight,
							toJSON: () => {},
						},
					] as any,
				}

				callback([entry], this as any)
			}
		})
	}
}

// ============================================================================
// Clipboard Fallback
// ============================================================================

/**
 * Fallback for Clipboard API using execCommand
 */
export class ClipboardFallback {
	private textarea: HTMLTextAreaElement | null = null

	async writeText(text: string): Promise<void> {
		// Try execCommand method
		const success = this.execCommandCopy(text)
		if (success) return

		// Fallback to prompt for older browsers
		throw new Error('Unable to copy text. Please copy manually.')
	}

	async readText(): Promise<string> {
		// Try execCommand method
		const text = this.execCommandPaste()
		if (text) return text

		throw new Error('Unable to read from clipboard. Please paste manually.')
	}

	private execCommandCopy(text: string): boolean {
		if (typeof document === 'undefined') return false

		// Create temporary textarea
		this.textarea = document.createElement('textarea')
		this.textarea.value = text
		this.textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;'
		document.body.appendChild(this.textarea)

		// Select and copy
		this.textarea.focus()
		this.textarea.select()

		try {
			const success = document.execCommand('copy')
			this.cleanup()
			return success
		} catch {
			this.cleanup()
			return false
		}
	}

	private execCommandPaste(): string | null {
		if (typeof document === 'undefined') return null

		this.textarea = document.createElement('textarea')
		this.textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;'
		document.body.appendChild(this.textarea)

		this.textarea.focus()

		try {
			const success = document.execCommand('paste')
			const text = this.textarea.value
			this.cleanup()
			return success ? text : null
		} catch {
			this.cleanup()
			return null
		}
	}

	private cleanup(): void {
		if (this.textarea) {
			document.body.removeChild(this.textarea)
			this.textarea = null
		}
	}
}

// ============================================================================
// MutationObserver Fallback (Minimal)
// ============================================================================

/**
 * Minimal fallback for MutationObserver using polling
 * Note: This is a simplified implementation for basic use cases
 */
export class MutationObserverFallback {
	private target: Element | null = null
	private callback: MutationCallback | null = null
	private options: MutationObserverInit = {}
	private pollTimer: number | null = null
	private pollInterval: number
	private lastSnapshot: string = ''

	constructor(options: FallbackOptions = {}) {
		this.pollInterval = options.debounce ?? 500
	}

	observe(target: Element, callback: MutationCallback, options?: MutationObserverInit): void {
		this.target = target
		this.callback = callback
		this.options = options ?? {}
		this.lastSnapshot = this.getSnapshot()
		this.startPolling()
	}

	disconnect(): void {
		this.stopPolling()
		this.target = null
		this.callback = null
	}

	private startPolling(): void {
		if (typeof window === 'undefined') return
		this.pollTimer = window.setInterval(() => this.checkChanges(), this.pollInterval)
	}

	private stopPolling(): void {
		if (this.pollTimer) {
			clearInterval(this.pollTimer)
			this.pollTimer = null
		}
	}

	private getSnapshot(): string {
		if (!this.target) return ''
		if (this.options.childList) {
			return this.target.innerHTML
		}
		if (this.options.attributes) {
			return this.target.getAttribute('class') || ''
		}
		return ''
	}

	private checkChanges(): void {
		if (!this.target || !this.callback) return

		const currentSnapshot = this.getSnapshot()
		if (currentSnapshot !== this.lastSnapshot) {
			this.lastSnapshot = currentSnapshot

			const mutations: MutationRecord[] = [
				{
					type: this.options.childList ? 'childList' : 'attributes',
					target: this.target,
					addedNodes: [] as any,
					removedNodes: [] as any,
					attributeName: null,
					attributeNamespace: null,
					oldValue: null,
					nextSibling: null,
					previousSibling: null,
				},
			]

			this.callback(mutations, this as any)
		}
	}
}

// ============================================================================
// Pointer Events Fallback
// ============================================================================

/**
 * Fallback for Pointer Events using mouse/touch events
 */
export class PointerEventsFallback {
	private handlers: Map<string, EventListener> = new Map()
	private isTouchDevice: boolean

	constructor() {
		this.isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window
	}

	addPointerListener(element: HTMLElement, type: string, handler: EventListener): void {
		const wrappedHandler = this.wrapPointerHandler(type, handler)
		this.handlers.set(type, wrappedHandler)

		// Map pointer events to mouse/touch
		if (this.isTouchDevice) {
			element.addEventListener(this.mapToTouchEvent(type), wrappedHandler, { passive: true })
		} else {
			element.addEventListener(this.mapToMouseEvent(type), wrappedHandler, { passive: true })
		}
	}

	removePointerListener(element: HTMLElement, type: string): void {
		const handler = this.handlers.get(type)
		if (handler) {
			if (this.isTouchDevice) {
				element.removeEventListener(this.mapToTouchEvent(type), handler)
			} else {
				element.removeEventListener(this.mapToMouseEvent(type), handler)
			}
			this.handlers.delete(type)
		}
	}

	private mapToTouchEvent(pointerType: string): string {
		const map: Record<string, string> = {
			pointerdown: 'touchstart',
			pointermove: 'touchmove',
			pointerup: 'touchend',
			pointercancel: 'touchcancel',
			pointerenter: 'touchstart',
			pointerleave: 'touchend',
		}
		return map[pointerType] || pointerType
	}

	private mapToMouseEvent(pointerType: string): string {
		const map: Record<string, string> = {
			pointerdown: 'mousedown',
			pointermove: 'mousemove',
			pointerup: 'mouseup',
			pointercancel: 'mouseleave',
			pointerenter: 'mouseenter',
			pointerleave: 'mouseleave',
		}
		return map[pointerType] || pointerType
	}

	private wrapPointerHandler(type: string, handler: EventListener): EventListener {
		return (event: Event) => {
			const pointerEvent = this.createPointerEvent(event, type)
			handler(pointerEvent)
		}
	}

	private createPointerEvent(event: Event, type: string): PointerEvent {
		const original = event as MouseEvent | TouchEvent

		let clientX = 0,
			clientY = 0,
			pressure = 0,
			pointerType = 'mouse'

		if (this.isTouchDevice && 'touches' in original) {
			const touch = original.touches[0] || original.changedTouches[0]
			if (touch) {
				clientX = touch.clientX
				clientY = touch.clientY
				pressure = touch.force || 0
				pointerType = 'touch'
			}
		} else if ('clientX' in original) {
			clientX = original.clientX
			clientY = original.clientY
			pressure = 0.5 // Default pressure for mouse
			pointerType = 'mouse'
		}

		return new PointerEvent(type, {
			bubbles: true,
			cancelable: true,
			clientX,
			clientY,
			pressure,
			pointerType,
			isPrimary: true,
		})
	}
}

// ============================================================================
// Polyfill Registry
// ============================================================================

const polyfillRegistry = new Map<string, PolyfillStatus>()

/**
 * Register a polyfill status
 */
export function registerPolyfillStatus(name: string, native: boolean): void {
	polyfillRegistry.set(name, {
		name,
		available: true,
		native,
		polyfilled: !native,
	})
}

/**
 * Get polyfill status
 */
export function getPolyfillStatus(name: string): PolyfillStatus | undefined {
	return polyfillRegistry.get(name)
}

/**
 * Check if native API is available
 */
export function hasNativeAPI(apiName: string): boolean {
	if (typeof window === 'undefined') return false

	const apis: Record<string, () => boolean> = {
		IntersectionObserver: () => 'IntersectionObserver' in window,
		ResizeObserver: () => 'ResizeObserver' in window,
		ClipboardAPI: () => 'clipboard' in navigator,
		MutationObserver: () => 'MutationObserver' in window,
		PointerEvents: () => 'PointerEvent' in window,
	}

	return apis[apiName]?.() ?? false
}

/**
 * Get the appropriate observer instance
 */
export function getIntersectionObserver(
	callback: IntersectionObserverCallback,
	options?: IntersectionObserverInit,
	fallbackOptions?: FallbackOptions,
): IntersectionObserver | IntersectionObserverFallback {
	if (hasNativeAPI('IntersectionObserver')) {
		return new IntersectionObserver(callback, options)
	}

	const fallback = new IntersectionObserverFallback(fallbackOptions)
	return fallback as any
}

/**
 * Get the appropriate resize observer instance
 */
export function getResizeObserver(
	callback: ResizeObserverCallback,
	fallbackOptions?: FallbackOptions,
): ResizeObserver | ResizeObserverFallback {
	if (hasNativeAPI('ResizeObserver')) {
		return new ResizeObserver(callback)
	}

	const fallback = new ResizeObserverFallback(fallbackOptions)
	return fallback as any
}

/**
 * Get clipboard instance
 */
export function getClipboard(): Clipboard | ClipboardFallback {
	if (hasNativeAPI('ClipboardAPI')) {
		return navigator.clipboard
	}

	return new ClipboardFallback() as any
}

/**
 * Get mutation observer instance
 */
export function getMutationObserver(
	callback: MutationCallback,
	fallbackOptions?: FallbackOptions,
): MutationObserver | MutationObserverFallback {
	if (hasNativeAPI('MutationObserver')) {
		return new MutationObserver(callback)
	}

	const fallback = new MutationObserverFallback(fallbackOptions)
	return fallback as any
}
