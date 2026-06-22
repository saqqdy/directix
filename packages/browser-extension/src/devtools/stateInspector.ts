/**
 * State inspector for Directix directives.
 * Inspects DOM elements for directive state and detects potential issues.
 */

interface DirectiveState {
	name: string
	element: { tagName: string, id: string, className: string }
	value: string | null
	modifiers: string[]
	state: { mounted: boolean, active: boolean, hasCleanup: boolean }
	performance: { mountTime: number, lastUpdateTime: number, updateCount: number }
	issues: string[]
}

export class StateInspector {
	static inspectElement(element: Element): DirectiveState[] {
		const states: DirectiveState[] = []
		for (const attr of element.getAttributeNames()) {
			if (attr.startsWith('v-')) {
				const state = this.inspectDirective(element, attr)
				if (state) states.push(state)
			}
		}
		return states
	}

	private static inspectDirective(element: Element, directiveAttr: string): DirectiveState | null {
		const directiveName = directiveAttr.substring(2)
		const instance = (element as any)[`__directix_${directiveName}`]

		return {
			name: directiveName,
			value: element.getAttribute(directiveAttr),
			element: { id: element.id, tagName: element.tagName, className: element.className },
			modifiers: directiveAttr.split('.').slice(1),
			state: { mounted: instance?._mounted ?? false, active: instance?._active ?? false, hasCleanup: !!instance?._cleanup },
			performance: { mountTime: instance?._mountTime ?? 0, lastUpdateTime: instance?._lastUpdateTime ?? 0, updateCount: instance?._updateCount ?? 0 },
			issues: this.detectIssues(instance),
		}
	}

	private static detectIssues(instance: any): string[] {
		const issues: string[] = []
		if (instance?._mounted && !instance?._cleanup) issues.push('⚠️ No cleanup — potential memory leak')
		if (instance?._updateCount > 100 && instance?._lastUpdateTime < 1000) issues.push('⚠️ Excessive updates — consider debounce/throttle')
		if (instance?._mountTime > 50) issues.push(`⚠️ Slow mount (${instance._mountTime}ms)`)
		return issues
	}
}
