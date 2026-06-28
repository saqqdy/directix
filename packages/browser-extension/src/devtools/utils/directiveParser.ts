/**
 * Directive Parser Utility
 * Parses and normalizes directive information from DOM elements
 */

import type { DirectiveInstance, DirectiveState } from '../../shared/types'

/**
 * Known Directix directives
 */
export const KNOWN_DIRECTIVES = [
	'v-debounce', 'v-throttle', 'v-click-outside', 'v-copy', 'v-lazy',
	'v-permission', 'v-long-press', 'v-hover', 'v-focus', 'v-ripple',
	'v-scroll', 'v-resize', 'v-intersect', 'v-loading', 'v-visible',
	'v-mask', 'v-sanitize', 'v-tooltip', 'v-draggable', 'v-watermark',
	'v-hotkey', 'v-click-delay', 'v-ellipsis', 'v-countdown', 'v-print',
	'v-infinite-scroll', 'v-sticky', 'v-mutation', 'v-truncate', 'v-uppercase',
	'v-lowercase', 'v-capitalcase', 'v-number', 'v-money', 'v-trim',
	'v-touch', 'v-image-preview', 'v-swipe', 'v-virtual-list', 'v-pull-refresh',
	'v-click-wave', 'v-context-menu', 'v-fullscreen', 'v-skeleton', 'v-export',
	'v-highlight', 'v-emoji', 'v-pan', 'v-pinch', 'v-rotate-gesture',
	'v-blur', 'v-fade', 'v-parallax', 'v-lottie', 'v-typewriter',
	'v-progress', 'v-counter',
]

/**
 * Parse directive information from a DOM element
 */
export function parseDirective(element: Element, attr: string): DirectiveInstance {
	const parts = attr.split('.')
	const name = parts[0]
	const modifiers = parts.slice(1)
	const value = element.getAttribute(attr)

	return {
		id: generateDirectiveId(element, attr),
		name,
		value,
		element: `<${element.tagName.toLowerCase()}>`,
		attrs: getAllDirectiveAttrs(element),
		modifiers,
		timestamp: Date.now(),
		binding: {
			value: parseDirectiveValue(value),
			oldValue: null,
			arg: parseArg(attr),
			modifiers: modifiers.reduce((acc, mod) => {
				acc[mod] = true
				return acc
			}, {} as Record<string, boolean>),
		},
		state: getDirectiveState(element, name),
	}
}

/**
 * Scan all directives in a DOM tree
 */
export function scanAllDirectives(root: Element = document.body): DirectiveInstance[] {
	const results: DirectiveInstance[] = []
	const seen = new Set<Element>()

	for (const directive of KNOWN_DIRECTIVES) {
		const elements = root.querySelectorAll(`[${directive}]`)
		for (const el of elements) {
			if (seen.has(el)) continue
			seen.add(el)

			// Parse all directives on this element
			for (const attr of el.getAttributeNames()) {
				if (attr.startsWith('v-') && KNOWN_DIRECTIVES.includes(attr.split('.')[0])) {
					results.push(parseDirective(el, attr))
				}
			}
		}
	}

	return results
}

/**
 * Get all directive attributes from an element
 */
function getAllDirectiveAttrs(element: Element): string[] {
	return element.getAttributeNames().filter(attr =>
		attr.startsWith('v-') && KNOWN_DIRECTIVES.includes(attr.split('.')[0]),
	)
}

/**
 * Generate unique ID for directive instance
 */
function generateDirectiveId(element: Element, attr: string): string {
	return `${element.tagName.toLowerCase()}-${attr}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Parse directive value
 */
function parseDirectiveValue(value: string | null): any {
	if (!value) return null

	// Try to parse as JSON
	try {
		return JSON.parse(value)
	} catch {
		// Return as string if not valid JSON
		return value
	}
}

/**
 * Parse directive argument (e.g., v-click-outside:exclude)
 */
function parseArg(attr: string): string | undefined {
	const match = attr.match(/v-[\w-]+:([\w-]+)/)
	return match ? match[1] : undefined
}

/**
 * Get directive state from element
 */
function getDirectiveState(element: Element, directiveName: string): DirectiveState {
	const stateKey = `__${directiveName.replace(/-/g, '_')}_state__`
	const elementState = (element as any)[stateKey]

	return {
		mounted: !!elementState,
		updatedCount: elementState?.updatedCount || 0,
		error: elementState?.error,
		warnings: elementState?.warnings,
	}
}

/**
 * Group directives by name
 */
export function groupDirectivesByName(directives: DirectiveInstance[]): Map<string, DirectiveInstance[]> {
	const groups = new Map<string, DirectiveInstance[]>()

	for (const directive of directives) {
		const existing = groups.get(directive.name) || []
		existing.push(directive)
		groups.set(directive.name, existing)
	}

	return groups
}

/**
 * Filter directives by search query
 */
export function filterDirectives(directives: DirectiveInstance[], query: string): DirectiveInstance[] {
	if (!query) return directives

	const lowerQuery = query.toLowerCase()
	return directives.filter(d =>
		d.name.toLowerCase().includes(lowerQuery)
		|| d.element.toLowerCase().includes(lowerQuery)
		|| d.value?.toLowerCase().includes(lowerQuery)
		|| d.modifiers.some(m => m.toLowerCase().includes(lowerQuery)),
	)
}

/**
 * Sort directives by timestamp (newest first)
 */
export function sortDirectivesByTime(directives: DirectiveInstance[]): DirectiveInstance[] {
	return [...directives].sort((a, b) => b.timestamp - a.timestamp)
}
