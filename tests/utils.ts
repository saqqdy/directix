/**
 * Test utilities for Directix
 */
import { mount, type VueWrapper } from '@vue/test-utils'
import { vi } from 'vitest'
import { defineComponent, type Directive } from 'vue'

/**
 * Create a simple test component with a directive
 */
export function createTestComponent(
	template: string,
	directive: Directive,
	directiveName: string = 'test',
	data: Record<string, any> = {},
	methods: Record<string, (...args: any[]) => any> = {},
): ReturnType<typeof defineComponent> {
	return defineComponent({
		directives: { [directiveName]: directive },
		template,
		data: () => ({ ...data }),
		methods,
	})
}

/**
 * Mount a directive on an element
 */
export function mountDirective(
	template: string,
	directive: Directive,
	directiveName: string = 'test',
	data: Record<string, any> = {},
	options: Record<string, any> = {},
): VueWrapper {
	const TestComponent = createTestComponent(template, directive, directiveName, data)
	return mount(TestComponent, options)
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
	condition: () => boolean,
	timeout: number = 5000,
	interval: number = 50,
): Promise<void> {
	const start = Date.now()
	while (!condition()) {
		if (Date.now() - start > timeout) {
			throw new Error('Timeout waiting for condition')
		}
		await new Promise(resolve => setTimeout(resolve, interval))
	}
}

/**
 * Create a mock element for testing
 */
export function createMockElement(tagName: string = 'div'): HTMLElement {
	return document.createElement(tagName)
}

/**
 * Create a mock event
 */
export function createMockEvent(type: string, options: Record<string, any> = {}): Event {
	const event = new Event(type, { bubbles: true, cancelable: true, ...options })
	Object.assign(event, options)
	return event
}

/**
 * Create a mock keyboard event
 */
export function createMockKeyboardEvent(
	key: string,
	options: Partial<KeyboardEventInit> = {},
): KeyboardEvent {
	return new KeyboardEvent('keydown', {
		key,
		bubbles: true,
		cancelable: true,
		...options,
	})
}

/**
 * Create a mock mouse event
 */
export function createMockMouseEvent(
	type: string,
	options: Partial<MouseEventInit> = {},
): MouseEvent {
	return new MouseEvent(type, {
		bubbles: true,
		cancelable: true,
		clientX: 0,
		clientY: 0,
		...options,
	})
}

/**
 * Create a mock touch event
 */
export function createMockTouchEvent(
	type: string,
	touches: Array<{ clientX: number, clientY: number }> = [],
): TouchEvent {
	const touchList = touches.map(
		(touch, index) =>
			new Touch({
				identifier: index,
				target: document.body,
				clientX: touch.clientX,
				clientY: touch.clientY,
			}),
	)

	return new TouchEvent(type, {
		bubbles: true,
		cancelable: true,
		touches: touchList,
		targetTouches: touchList,
		changedTouches: touchList,
	})
}

/**
 * Setup mock IntersectionObserver
 */
export function setupIntersectionObserver(
	mock: Partial<IntersectionObserver> = {},
): {
	MockIntersectionObserver: ReturnType<typeof vi.fn>
	observe: ReturnType<typeof vi.fn>
	unobserve: ReturnType<typeof vi.fn>
	disconnect: ReturnType<typeof vi.fn>
	triggerIntersection: (entry: Partial<IntersectionObserverEntry>, index?: number) => void
} {
	const observe = vi.fn()
	const unobserve = vi.fn()
	const disconnect = vi.fn()

	const MockIntersectionObserver = vi.fn().mockImplementation(() => ({
		observe,
		unobserve,
		disconnect,
		...mock,
	}))

	vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

	return {
		MockIntersectionObserver,
		observe,
		unobserve,
		disconnect,
		// Helper to trigger intersection callback
		triggerIntersection: (entry: Partial<IntersectionObserverEntry>, index: number = 0) => {
			const callback = MockIntersectionObserver.mock.calls[index]?.[0]
			if (callback) {
				callback([
					{
						target: createMockElement(),
						isIntersecting: true,
						intersectionRatio: 1,
						boundingClientRect: {} as DOMRectReadOnly,
						intersectionRect: {} as DOMRectReadOnly,
						rootBounds: null,
						time: Date.now(),
						...entry,
					},
				])
			}
		},
	}
}

/**
 * Setup mock ResizeObserver
 */
export function setupResizeObserver(
	mock: Partial<ResizeObserver> = {},
): {
	MockResizeObserver: ReturnType<typeof vi.fn>
	observe: ReturnType<typeof vi.fn>
	unobserve: ReturnType<typeof vi.fn>
	disconnect: ReturnType<typeof vi.fn>
	triggerResize: (entry: Partial<ResizeObserverEntry>, index?: number) => void
} {
	const observe = vi.fn()
	const unobserve = vi.fn()
	const disconnect = vi.fn()

	const MockResizeObserver = vi.fn().mockImplementation(() => ({
		observe,
		unobserve,
		disconnect,
		...mock,
	}))

	vi.stubGlobal('ResizeObserver', MockResizeObserver)

	return {
		MockResizeObserver,
		observe,
		unobserve,
		disconnect,
		// Helper to trigger resize callback
		triggerResize: (entry: Partial<ResizeObserverEntry>, index: number = 0) => {
			const callback = MockResizeObserver.mock.calls[index]?.[0]
			if (callback) {
				callback([
					{
						target: createMockElement(),
						contentRect: {
							width: 100,
							height: 100,
							x: 0,
							y: 0,
							top: 0,
							left: 0,
							bottom: 100,
							right: 100,
							toJSON: () => ({}),
						},
						borderBoxSize: {} as ResizeObserverSize,
						contentBoxSize: {} as ResizeObserverSize,
						devicePixelContentBoxSize: {} as ResizeObserverSize,
						...entry,
					},
				])
			}
		},
	}
}

/**
 * Setup mock MutationObserver
 */
export function setupMutationObserver(
	mock: Partial<MutationObserver> = {},
): {
	MockMutationObserver: ReturnType<typeof vi.fn>
	observe: ReturnType<typeof vi.fn>
	unobserve: ReturnType<typeof vi.fn>
	disconnect: ReturnType<typeof vi.fn>
	triggerMutation: (entry: Partial<MutationRecord>, index?: number) => void
} {
	const observe = vi.fn()
	const unobserve = vi.fn()
	const disconnect = vi.fn()

	const MockMutationObserver = vi.fn().mockImplementation(() => ({
		observe,
		unobserve,
		disconnect,
		...mock,
	}))

	vi.stubGlobal('MutationObserver', MockMutationObserver)

	return {
		MockMutationObserver,
		observe,
		unobserve,
		disconnect,
		// Helper to trigger mutation callback
		triggerMutation: (entry: Partial<MutationRecord>, index: number = 0) => {
			const callback = MockMutationObserver.mock.calls[index]?.[0]
			if (callback) {
				callback([
					{
						type: 'attributes',
						target: createMockElement(),
						addedNodes: [] as unknown as NodeList,
						removedNodes: [] as unknown as NodeList,
						previousSibling: null,
						nextSibling: null,
						attributeName: null,
						attributeNamespace: null,
						oldValue: null,
						...entry,
					},
				])
			}
		},
	}
}

/**
 * Setup mock clipboard
 */
export function setupClipboard(): { writeText: ReturnType<typeof vi.fn>, readText: ReturnType<typeof vi.fn> } {
	const writeText = vi.fn().mockResolvedValue(undefined)
	const readText = vi.fn().mockResolvedValue('')

	vi.stubGlobal('navigator', {
		clipboard: {
			writeText,
			readText,
		},
	})

	return { writeText, readText }
}

/**
 * Mock requestAnimationFrame
 */
export function mockRAF(): {
	triggerRAF: (time?: number) => void
	triggerNextRAF: (time?: number) => void
} {
	let rafId = 0
	const callbacks = new Map<number, FrameRequestCallback>()

	vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
		const id = ++rafId
		callbacks.set(id, callback)
		return id
	})

	vi.stubGlobal('cancelAnimationFrame', (id: number) => {
		callbacks.delete(id)
	})

	return {
		triggerRAF: (time: number = 0) => {
			callbacks.forEach((callback, id) => {
				callback(time)
				callbacks.delete(id)
			})
		},
		triggerNextRAF: (time: number = 0) => {
			const [id, callback] = callbacks.entries().next().value || [undefined, undefined]
			if (callback) {
				callback(time)
				callbacks.delete(id)
			}
		},
	}
}

/**
 * Mock performance.now
 */
export function mockPerformanceNow(): {
	advanceTime: (ms: number) => void
	resetTime: () => void
} {
	let now = 0

	vi.stubGlobal('performance', {
		now: () => {
			now += 16.67 // Simulate ~60fps
			return now
		},
	})

	return {
		advanceTime: (ms: number) => {
			now += ms
		},
		resetTime: () => {
			now = 0
		},
	}
}

/**
 * Simulate async passage of time
 */
export function flushPromises(): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, 0))
}

/**
 * Suppress console warnings during tests
 */
export function suppressConsoleWarn(): {
	restore: () => void
	getCalls: () => any[][]
} {
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
	return {
		restore: () => warn.mockRestore(),
		getCalls: () => warn.mock.calls,
	}
}

/**
 * Suppress console errors during tests
 */
export function suppressConsoleError(): {
	restore: () => void
	getCalls: () => any[][]
} {
	const error = vi.spyOn(console, 'error').mockImplementation(() => {})
	return {
		restore: () => error.mockRestore(),
		getCalls: () => error.mock.calls,
	}
}
