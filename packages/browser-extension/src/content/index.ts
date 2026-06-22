/**
 * Content script injected into pages.
 * Inspects the page for Directix directive usage and reports to DevTools.
 */

/// <reference types="chrome" />

interface DirectiveInstance {
	name: string
	element: string
	attrs: string[]
	value: string | null
	modifiers: string[]
	timestamp: number
}

interface PerformanceMetric {
	name: string
	duration: number
	startTime: number
}

interface StateInfo {
	tag: string
	classes: string
	dataset: Record<string, string | undefined>
}

// Listen for messages from DevTools
chrome.runtime.onMessage.addListener((message: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
	if (message.target === 'content' && message.type === 'inspect') {
		const directives = scanDirectives()
		sendResponse({ type: 'directives', payload: directives })
	}
	if (message.target === 'content' && message.type === 'performance') {
		const perf = collectPerformance()
		sendResponse({ type: 'performance', payload: perf })
	}
	if (message.target === 'content' && message.type === 'state') {
		const state = collectState()
		sendResponse({ type: 'state', payload: state })
	}
	return true
})

/** Scan the DOM for all Directix directive instances */
function scanDirectives(): DirectiveInstance[] {
	const results: DirectiveInstance[] = []
	const seen = new Set<Element>()

	const directiveAttrs = [
		'v-debounce', 'v-throttle', 'v-click-outside', 'v-copy', 'v-lazy',
		'v-permission', 'v-long-press', 'v-hover', 'v-focus', 'v-ripple',
		'v-scroll', 'v-resize', 'v-intersect', 'v-loading', 'v-visible',
		'v-mask', 'v-sanitize', 'v-tooltip', 'v-draggable', 'v-watermark',
		'v-hotkey', 'v-click-delay', 'v-ellipsis', 'v-countdown', 'v-print',
	]

	for (const attr of directiveAttrs) {
		const elements = document.querySelectorAll(`[${attr}]`)
		for (const el of elements) {
			if (seen.has(el)) continue
			seen.add(el)
			results.push(extractDirectiveInfo(el, attr))
		}
	}

	return results
}

function extractDirectiveInfo(el: Element, attr: string): DirectiveInstance {
	const parts = attr.split('.')
	const name = parts[0]
	const modifiers = parts.slice(1)
	const value = el.getAttribute(attr)

	return {
		name,
		value,
		element: `<${el.tagName.toLowerCase()}>`,
		attrs: el.getAttributeNames().filter(a => a.startsWith('v-')),
		modifiers,
		timestamp: Date.now(),
	}
}

/** Collect performance metrics */
function collectPerformance(): PerformanceMetric[] {
	const entries = performance.getEntriesByType('measure').filter(
		e => e.name.startsWith('directix:'),
	)
	return entries.map(e => ({
		name: e.name,
		duration: e.duration,
		startTime: e.startTime,
	}))
}

/** Collect directive state info */
function collectState(): StateInfo[] {
	const stateElements = document.querySelectorAll('[class*="v-lazy"], [class*="v-loading"]')
	return Array.from(stateElements).map(el => ({
		tag: el.tagName.toLowerCase(),
		classes: el.className,
		dataset: { ...(el as HTMLElement).dataset },
	}))
}

// Notify background script that content script is ready
chrome.runtime.sendMessage({ type: 'init', target: 'background' })

console.info('[Directix DevTools] Content script injected')
