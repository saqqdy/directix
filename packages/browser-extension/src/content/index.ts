/**
 * Content script injected into pages.
 * Scans the DOM for Directix directive usage, monitors changes via MutationObserver,
 * and communicates with the DevTools panel via the background service worker.
 */

/// <reference types="chrome" />

import type { DirectiveInstance, Issue, MessagePayload, PerformanceMetric } from '../shared/types'
import { filterDirectives, scanAllDirectives, sortDirectivesByTime } from '../devtools/utils/directiveParser'

// ─── State ───────────────────────────────────────────────

let cachedDirectives: DirectiveInstance[] = [],
	performanceMetrics: PerformanceMetric[] = [],
	issues: Issue[] = [],
	port: chrome.runtime.Port | null = null

// ─── Initialization ──────────────────────────────────────

function init(): void {
	connectToBackground()
	scanAndReport()
	startMutationObserver()
	startPerformanceCollection()
	console.info('[Directix DevTools] Content script injected')
}

// ─── Background Connection ───────────────────────────────

function connectToBackground(): void {
	port = chrome.runtime.connect({ name: 'directix-content' })

	port.onMessage.addListener((message: MessagePayload) => {
		switch (message.type) {
			case 'scan':
				scanAndReport()
				break
			case 'filter':
				handleFilter(message.payload)
				break
			case 'export':
				handleExport(message.payload)
				break
		}
	})

	port.onDisconnect.addListener(() => {
		port = null
		// Reconnect after delay
		setTimeout(connectToBackground, 2000)
	})

	port.postMessage({ type: 'content-ready' })
}

// ─── Directive Scanning ──────────────────────────────────

function scanAndReport(): void {
	cachedDirectives = scanAllDirectives()
	detectIssues()
	sendMessage({
		type: 'directives-update',
		payload: {
			directives: cachedDirectives,
			issues,
			timestamp: Date.now(),
		},
	})
}

function handleFilter(payload: { search: string, types: string[] }): void {
	let filtered = filterDirectives(cachedDirectives, payload.search)
	if (payload.types.length > 0) {
		filtered = filtered.filter(d => payload.types.includes(d.name))
	}
	sendMessage({
		type: 'directives-filtered',
		payload: sortDirectivesByTime(filtered),
	})
}

// ─── Real-time Monitoring (MutationObserver) ─────────────

function startMutationObserver(): void {
	const observer = new MutationObserver(mutations => {
		let hasDirectiveChange = false

		for (const mutation of mutations) {
			// Check added nodes for directive attributes
			for (const node of mutation.addedNodes) {
				if (node instanceof Element && hasDirectiveAttrs(node)) {
					hasDirectiveChange = true
					break
				}
			}
			if (hasDirectiveChange) break

			// Check removed nodes
			for (const node of mutation.removedNodes) {
				if (node instanceof Element && hasDirectiveAttrs(node)) {
					hasDirectiveChange = true
					break
				}
			}
			if (hasDirectiveChange) break

			// Check attribute changes
			if (mutation.type === 'attributes' && mutation.attributeName?.startsWith('v-')) {
				hasDirectiveChange = true
				break
			}
		}

		if (hasDirectiveChange) {
			scanAndReport()
		}
	})

	observer.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: getDirectiveAttrFilter(),
	})
}

function hasDirectiveAttrs(el: Element): boolean {
	return el.getAttributeNames().some(attr => attr.startsWith('v-'))
}

function getDirectiveAttrFilter(): string[] {
	return [
		'v-debounce', 'v-throttle', 'v-click-outside', 'v-copy', 'v-lazy',
		'v-permission', 'v-long-press', 'v-hover', 'v-focus', 'v-ripple',
		'v-scroll', 'v-resize', 'v-intersect', 'v-loading', 'v-visible',
		'v-mask', 'v-sanitize', 'v-tooltip', 'v-draggable', 'v-watermark',
		'v-hotkey', 'v-click-delay', 'v-ellipsis', 'v-countdown', 'v-print',
	]
}

// ─── Performance Collection ──────────────────────────────

function startPerformanceCollection(): void {
	// Collect performance metrics periodically
	setInterval(() => {
		const entries = performance.getEntriesByType('measure').filter(
			e => e.name.startsWith('directix:'),
		)

		const newMetrics: PerformanceMetric[] = entries.map(e => ({
			id: `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			type: (e.name.includes(':mount:') ? 'mount' : e.name.includes(':update:') ? 'update' : 'unmount') as PerformanceMetric['type'],
			directiveName: e.name.replace('directix:', '').split(':')[0],
			duration: e.duration,
			startTime: e.startTime,
			endTime: e.startTime + e.duration,
			timestamp: Date.now(),
		}))

		if (newMetrics.length > 0) {
			performanceMetrics = newMetrics
			sendMessage({
				type: 'performance-update',
				payload: performanceMetrics,
			})
		}
	}, 2000)
}

// ─── Issue Detection ─────────────────────────────────────

function detectIssues(): void {
	issues = []

	for (const d of cachedDirectives) {
		// Check for missing value
		if (!d.value && !d.modifiers.length) {
			issues.push({
				id: `issue-${d.id}`,
				type: 'warning',
				directiveName: d.name,
				element: d.element,
				message: 'Directive has no value or modifiers',
				description: `${d.name} on ${d.element} appears to be unused — no binding value provided.`,
				suggestion: 'Add a binding value or remove the directive.',
				severity: 'medium',
				timestamp: Date.now(),
			})
		}

		// Check state for errors
		if (d.state.error) {
			issues.push({
				id: `issue-err-${d.id}`,
				type: 'error',
				directiveName: d.name,
				element: d.element,
				message: d.state.error,
				description: `${d.name} on ${d.element} encountered an error: ${d.state.error}`,
				severity: 'high',
				timestamp: Date.now(),
			})
		}

		// Check for excessive updates
		if (d.state.updatedCount > 100) {
			issues.push({
				id: `issue-upd-${d.id}`,
				type: 'warning',
				directiveName: d.name,
				element: d.element,
				message: `Excessive updates (${d.state.updatedCount})`,
				description: `${d.name} has been updated ${d.state.updatedCount} times. Consider using v-debounce or v-throttle.`,
				suggestion: 'Wrap the handler with v-debounce or v-throttle.',
				severity: 'medium',
				timestamp: Date.now(),
			})
		}

		// Check for duplicate directives on same element
		if (d.attrs.filter(a => a === d.name).length > 1) {
			issues.push({
				id: `issue-dup-${d.id}`,
				type: 'warning',
				directiveName: d.name,
				element: d.element,
				message: 'Duplicate directive on same element',
				description: `${d.name} appears multiple times on ${d.element}.`,
				suggestion: 'Remove duplicate directive bindings.',
				severity: 'low',
				timestamp: Date.now(),
			})
		}

		// Propagate state warnings
		if (d.state.warnings) {
			for (const w of d.state.warnings) {
				issues.push({
					id: `issue-warn-${d.id}-${w}`,
					type: 'info',
					directiveName: d.name,
					element: d.element,
					message: w,
					description: w,
					severity: 'low',
					timestamp: Date.now(),
				})
			}
		}
	}
}

// ─── Export ──────────────────────────────────────────────

function handleExport(format: { type: 'json' | 'csv' | 'html', includeTimestamps: boolean, includePerformance: boolean, includeIssues: boolean }): void {
	const data: Record<string, any> = { directives: cachedDirectives }

	if (format.includeTimestamps) {
		data.exportedAt = new Date().toISOString()
	}
	if (format.includePerformance) {
		data.performance = performanceMetrics
	}
	if (format.includeIssues) {
		data.issues = issues
	}

	let content: string,
		mimeType: string,
		extension: string

	switch (format.type) {
		case 'json':
			content = JSON.stringify(data, null, 2)
			mimeType = 'application/json'
			extension = 'json'
			break
		case 'csv':
			content = toCSV(data)
			mimeType = 'text/csv'
			extension = 'csv'
			break
		case 'html':
			content = toHTML(data)
			mimeType = 'text/html'
			extension = 'html'
			break
	}

	sendMessage({
		type: 'export-result',
		payload: { content, mimeType, extension },
	})
}

function toCSV(data: Record<string, any>): string {
	const rows = [['Name', 'Element', 'Value', 'Modifiers', 'Mounted', 'Update Count', 'Error']]
	for (const d of (data.directives as DirectiveInstance[])) {
		rows.push([d.name, d.element, d.value || '', d.modifiers.join(';'), String(d.state.mounted), String(d.state.updatedCount), d.state.error || ''])
	}
	return rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
}

function toHTML(data: Record<string, any>): string {
	const directives = data.directives as DirectiveInstance[]
	const issues = (data.issues || []) as Issue[]
	return `<!DOCTYPE html><html><head><title>Directix Report</title>
<style>body{font-family:system-ui;padding:24px;background:#1e1e1e;color:#e0e0e0}
table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #333}
th{color:#42b883;font-weight:600}.error{color:#f44}.warning{color:#fa0}.info{color:#4af}</style>
</head><body><h1>🎯 Directix Diagnostic Report</h1>
<p>Exported: ${data.exportedAt || new Date().toISOString()}</p>
<h2>Directives (${directives.length})</h2>
<table><tr><th>Name</th><th>Element</th><th>Value</th><th>Modifiers</th><th>State</th></tr>
${directives.map(d => `<tr><td>${d.name}</td><td>${d.element}</td><td>${d.value || '-'}</td><td>${d.modifiers.join(', ') || '-'}</td><td>${d.state.mounted ? '✅' : '❌'}</td></tr>`).join('')}
</table>
${issues.length ? `<h2>Issues (${issues.length})</h2><table><tr><th>Severity</th><th>Directive</th><th>Message</th><th>Suggestion</th></tr>
${issues.map(i => `<tr><td class="${i.type}">${i.severity}</td><td>${i.directiveName}</td><td>${i.message}</td><td>${i.suggestion || '-'}</td></tr>`).join('')}</table>` : ''}
</body></html>`
}

// ─── Message Helpers ─────────────────────────────────────

function sendMessage(message: MessagePayload): void {
	try {
		port?.postMessage(message)
	} catch {
		// Port disconnected, will reconnect
	}
}

// ─── Start ───────────────────────────────────────────────

init()
