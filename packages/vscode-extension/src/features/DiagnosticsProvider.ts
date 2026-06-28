import type { directives } from '../data/directives'
import * as vscode from 'vscode'
import { getDirective } from '../data/directives'

export class DiagnosticsProvider {
	private diagnosticCollection: vscode.DiagnosticCollection
	private debounceTimer: ReturnType<typeof setTimeout> | undefined

	constructor() {
		this.diagnosticCollection = vscode.languages.createDiagnosticCollection('directix')
	}

	activate(subscriptions: vscode.Disposable[]): void {
		subscriptions.push(this.diagnosticCollection)

		subscriptions.push(
			vscode.workspace.onDidChangeTextDocument(e => {
				this.debounce(() => this.analyzeDocument(e.document))
			}),
		)

		subscriptions.push(
			vscode.workspace.onDidOpenTextDocument(doc => {
				this.analyzeDocument(doc)
			}),
		)

		vscode.workspace.textDocuments.forEach(doc => this.analyzeDocument(doc))
	}

	dispose(): void {
		this.diagnosticCollection.dispose()
	}

	private debounce(fn: () => void): void {
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer)
		}
		this.debounceTimer = setTimeout(fn, 500)
	}

	private analyzeDocument(document: vscode.TextDocument): void {
		if (document.languageId !== 'vue' && document.languageId !== 'html') {
			this.diagnosticCollection.delete(document.uri)
			return
		}

		const diagnostics: vscode.Diagnostic[] = []
		const text = document.getText()
		const directivePattern = /v-([\w-]+)/g

		/** Track per-element directive usage for conflict/duplicate detection */
		const elementDirectives = new Map<string, { name: string, offset: number }[]>()

		let match: RegExpExecArray | null = directivePattern.exec(text)
		while (match !== null) {
			const offset = match.index
			const pos = document.positionAt(offset)

			const meta = getDirective(match[1])
			if (!meta) continue

			const line = document.lineAt(pos.line).text
			const directiveName = `v-${match[1]}`

			diagnostics.push(...this.checkMissingValue(meta, line, pos, directiveName))

			if (!meta.ssr && this.isInSSRContext(text)) {
				const range = new vscode.Range(pos, pos.translate(0, directiveName.length))
				diagnostics.push(
					new vscode.Diagnostic(
						range,
						`[Directix] ${directiveName} is not compatible with SSR. It will be a no-op on the server side.`,
						vscode.DiagnosticSeverity.Warning,
					),
				)
			}

			diagnostics.push(...this.checkDeprecatedPatterns(line, pos, directiveName))

			// Call new enhanced diagnostics methods
			diagnostics.push(...this.checkModifierCombos(meta, line, pos, directiveName))
			diagnostics.push(...this.checkMemoryLeaks(line, pos, directiveName))
			diagnostics.push(...this.checkSSRHydration(pos, directiveName))
			diagnostics.push(...this.checkAccessibility(line, pos, directiveName))

			// Track directive per element for conflict/duplicate checks
			const elementKey = this.getElementKey(text, offset)
			if (elementKey) {
				const list = elementDirectives.get(elementKey) || []
				list.push({ name: directiveName, offset })
				elementDirectives.set(elementKey, list)
			}

			match = directivePattern.exec(text)
		}

		// Check for duplicate and conflicting directives on the same element
		for (const [, entries] of elementDirectives) {
			diagnostics.push(...this.checkDuplicateDirectives(document, entries))
			diagnostics.push(...this.checkConflictingDirectives(document, entries))
		}

		this.diagnosticCollection.set(document.uri, diagnostics)
	}

	private checkMissingValue(
		meta: (typeof directives)[number],
		line: string,
		pos: vscode.Position,
		directiveName: string,
	): vscode.Diagnostic[] {
		const diagnostics: vscode.Diagnostic[] = []
		const requiredParams = meta.params.filter(p => !p.optional)
		if (requiredParams.length === 0) return diagnostics

		const directiveIdx = line.indexOf(directiveName, pos.character)
		if (directiveIdx === -1) return diagnostics

		const afterDirective = line.substring(directiveIdx + directiveName.length).trimStart()
		if (!afterDirective.startsWith('=') && !afterDirective.startsWith(':')) {
			const range = new vscode.Range(pos, pos.translate(0, directiveName.length))
			diagnostics.push(
				new vscode.Diagnostic(
					range,
					`[Directix] ${directiveName} requires a value. Required params: ${requiredParams.map(p => p.name).join(', ')}`,
					vscode.DiagnosticSeverity.Error,
				),
			)
		}

		return diagnostics
	}

	private isInSSRContext(text: string): boolean {
		return text.includes('createSSRApp') || text.includes('onServerPrefetch') || text.includes('__ssr__')
	}

	private checkDeprecatedPatterns(
		line: string,
		pos: vscode.Position,
		directiveName: string,
	): vscode.Diagnostic[] {
		const diagnostics: vscode.Diagnostic[] = []

		if (line.includes(`${directiveName}.native`)) {
			const range = new vscode.Range(pos, pos.translate(0, directiveName.length + 7))
			diagnostics.push(
				new vscode.Diagnostic(
					range,
					`[Directix] The .native modifier is deprecated in Vue 3. Non-custom listeners are always native.`,
					vscode.DiagnosticSeverity.Information,
				),
			)
		}

		return diagnostics
	}

	/** Extract a stable key for the element containing the given offset */
	private getElementKey(text: string, offset: number): string | undefined {
		// Walk backwards from offset to find '<' of the opening tag
		const before = text.substring(0, offset)
		const tagStart = before.lastIndexOf('<')
		if (tagStart === -1) return undefined
		// Find the end of the tag name (first whitespace or '>')
		const afterTagStart = text.substring(tagStart)
		const tagEnd = afterTagStart.search(/[\s>]/)
		if (tagEnd === -1) return undefined
		return `${tagStart}:${afterTagStart.substring(0, tagEnd)}`
	}

	/** Detect duplicate directive usage on the same element */
	private checkDuplicateDirectives(
		document: vscode.TextDocument,
		entries: { name: string, offset: number }[],
	): vscode.Diagnostic[] {
		const diagnostics: vscode.Diagnostic[] = []
		const seen = new Map<string, number>()

		for (const entry of entries) {
			const prev = seen.get(entry.name)
			if (prev !== undefined) {
				const pos = document.positionAt(entry.offset)
				const range = new vscode.Range(pos, pos.translate(0, entry.name.length))
				diagnostics.push(
					new vscode.Diagnostic(
						range,
						`[Directix] Duplicate directive ${entry.name} on the same element.`,
						vscode.DiagnosticSeverity.Warning,
					),
				)
			} else {
				seen.set(entry.name, entry.offset)
			}
		}

		return diagnostics
	}

	/** Detect conflicting directive pairs on the same element */
	private checkConflictingDirectives(
		document: vscode.TextDocument,
		entries: { name: string, offset: number }[],
	): vscode.Diagnostic[] {
		const diagnostics: vscode.Diagnostic[] = []
		const conflicts: [string, string, string][] = [
			['v-debounce', 'v-throttle', 'Use either debounce or throttle, not both'],
			['v-visible', 'v-if', 'v-visible and v-if on the same element may cause unexpected behavior'],
			['v-visible', 'v-show', 'v-visible and v-show serve similar purposes'],
			['v-loading', 'v-skeleton', 'Use either loading or skeleton, not both'],
			['v-ripple', 'v-click-wave', 'v-ripple and v-click-wave are similar effects'],
		]

		const names = new Set(entries.map(e => e.name))

		for (const [a, b, msg] of conflicts) {
			if (names.has(a) && names.has(b)) {
				const entry = entries.find(e => e.name === a)!
				const pos = document.positionAt(entry.offset)
				const range = new vscode.Range(pos, pos.translate(0, a.length))
				diagnostics.push(
					new vscode.Diagnostic(
						range,
						`[Directix] ${a} + ${b}: ${msg}.`,
						vscode.DiagnosticSeverity.Information,
					),
				)
			}
		}

		return diagnostics
	}

	/** Check for incorrect modifier combinations */
	private checkModifierCombos(
		meta: (typeof directives)[number],
		line: string,
		pos: vscode.Position,
		directiveName: string,
	): vscode.Diagnostic[] {
		const diagnostics: vscode.Diagnostic[] = []
		const modifiers = this.extractModifiers(line, directiveName)

		// Check for invalid modifier combinations
		const invalidCombos: Record<string, string[]> = {
			'v-debounce': ['immediate', 'lazy'],
			'v-throttle': ['leading', 'trailing'],
			'v-lazy': ['once', 'preload'],
			'v-intersect': ['once', 'repeat'],
		}

		if (invalidCombos[directiveName]) {
			const forbidden = invalidCombos[directiveName]
			if (modifiers.some(m => forbidden.includes(m))) {
				const range = new vscode.Range(pos, pos.translate(0, directiveName.length + modifiers.map(m => `.${m}`).join('').length))
				diagnostics.push(
					new vscode.Diagnostic(
						range,
						`[Directix] ${directiveName}: Modifier combination may cause unexpected behavior.`,
						vscode.DiagnosticSeverity.Warning,
					),
				)
			}
		}

		// Check for unsupported modifiers
		if (meta.modifiers.length > 0 && modifiers.length > 0) {
			const supported = meta.modifiers.map(m => m.name)
			for (const mod of modifiers) {
				if (!supported.includes(mod) && !['stop', 'prevent', 'capture', 'once', 'passive', 'self'].includes(mod)) {
					const modStart = line.indexOf(`.${mod}`, pos.character)
					if (modStart !== -1) {
						const modPos = new vscode.Position(pos.line, modStart)
						const range = new vscode.Range(modPos, modPos.translate(0, mod.length + 1))
						diagnostics.push(
							new vscode.Diagnostic(
								range,
								`[Directix] ${directiveName}.${mod}: Modifier "${mod}" is not supported by this directive.`,
								vscode.DiagnosticSeverity.Information,
							),
						)
					}
				}
			}
		}

		return diagnostics
	}

	/** Extract modifiers from directive attribute */
	private extractModifiers(line: string, directiveName: string): string[] {
		const match = line.match(new RegExp(`${directiveName}\\.([\\w-]+(?:\\.([\\w-]+))*)`))
		if (!match) return []
		return match[1].split('.')
	}

	/** Check for potential memory leak patterns */
	private checkMemoryLeaks(
		line: string,
		pos: vscode.Position,
		directiveName: string,
	): vscode.Diagnostic[] {
		const diagnostics: vscode.Diagnostic[] = []

		// Directives that commonly leak if cleanup is missing
		const leakRiskDirectives = ['v-click-outside', 'v-scroll', 'v-resize', 'v-intersect', 'v-mutation', 'v-draggable', 'v-touch']

		if (leakRiskDirectives.includes(directiveName)) {
			const valueMatch = line.match(new RegExp(`${directiveName}="([^"]*)"|${directiveName}:([\\w-]+)="([^"]*)"`))
			if (valueMatch) {
				const value = valueMatch[1] || valueMatch[3]
				if (value && !value.includes('cleanup') && !value.includes('destroy') && !value.includes('disconnect')) {
					const range = new vscode.Range(pos, pos.translate(0, directiveName.length))
					diagnostics.push(
						new vscode.Diagnostic(
							range,
							`[Directix] ${directiveName}: Ensure cleanup logic is provided to prevent memory leaks.`,
							vscode.DiagnosticSeverity.Information,
						),
					)
				}
			}
		}

		return diagnostics
	}

	/** Check for SSR hydration issues */
	private checkSSRHydration(
		pos: vscode.Position,
		directiveName: string,
	): vscode.Diagnostic[] {
		const diagnostics: vscode.Diagnostic[] = []

		// Directives that modify DOM structure - risky for SSR
		const domStructureDirectives = ['v-ripple', 'v-tooltip', 'v-watermark', 'v-skeleton', 'v-draggable']

		if (domStructureDirectives.includes(directiveName)) {
			const range = new vscode.Range(pos, pos.translate(0, directiveName.length))
			diagnostics.push(
				new vscode.Diagnostic(
					range,
					`[Directix] ${directiveName}: This directive modifies DOM structure. Ensure proper SSR hydration handling.`,
					vscode.DiagnosticSeverity.Information,
				),
			)
		}

		return diagnostics
	}

	/** Check for accessibility concerns */
	private checkAccessibility(
		line: string,
		pos: vscode.Position,
		directiveName: string,
	): vscode.Diagnostic[] {
		const diagnostics: vscode.Diagnostic[] = []

		// v-hover on interactive elements should have focus styles
		if (directiveName === 'v-hover') {
			const isInteractive = line.includes('button') || line.includes('a href') || line.includes('@click')
			if (isInteractive) {
				const range = new vscode.Range(pos, pos.translate(0, directiveName.length))
				diagnostics.push(
					new vscode.Diagnostic(
						range,
						`[Directix] v-hover: Consider also implementing focus styles for keyboard accessibility.`,
						vscode.DiagnosticSeverity.Information,
					),
				)
			}
		}

		// v-long-press should have alternative trigger
		if (directiveName === 'v-long-press') {
			const range = new vscode.Range(pos, pos.translate(0, directiveName.length))
			diagnostics.push(
				new vscode.Diagnostic(
					range,
					`[Directix] v-long-press: Provide an alternative interaction method for accessibility.`,
					vscode.DiagnosticSeverity.Information,
				),
			)
		}

		return diagnostics
	}
}
