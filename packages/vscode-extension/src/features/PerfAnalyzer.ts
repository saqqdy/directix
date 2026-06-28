import * as vscode from 'vscode'

interface PerfEntry {
	directive: string
	file: string
	line: number
	mountTime?: number
	updateTime?: number
	updateCount?: number
	unmountTime?: number
	memoryUsage?: number
}

interface BottleneckWarning {
	directive: string
	file: string
	line: number
	type: 'slow-mount' | 'slow-update' | 'excessive-updates' | 'memory-leak'
	severity: 'high' | 'medium' | 'low'
	message: string
	suggestion: string
}

// Performance thresholds (ms)
const THRESHOLDS = {
	excessiveUpdates: 100, // > 100 updates is excessive
	memoryThreshold: 1000, // > 1KB per directive instance
	slowMount: 50, // Mount > 50ms is slow
	slowUpdate: 16, // Update > 16ms causes frame drop
}

export class PerformanceAnalyzer {
	private outputChannel: vscode.OutputChannel
	private perfData: PerfEntry[] = []

	constructor() {
		this.outputChannel = vscode.window.createOutputChannel('Directix Performance')
	}

	activate(subscriptions: vscode.Disposable[]): void {
		subscriptions.push(this.outputChannel)

		subscriptions.push(
			vscode.commands.registerCommand('directix.showPerfReport', () => {
				this.showReport()
			}),
		)

		subscriptions.push(
			vscode.commands.registerCommand('directix.clearPerfData', () => {
				this.perfData = []
				vscode.window.showInformationMessage('[Directix] Performance data cleared.')
			}),
		)

		subscriptions.push(
			vscode.commands.registerCommand('directix.showBottlenecks', () => {
				this.showBottlenecks()
			}),
		)
	}

	dispose(): void {
		this.outputChannel.dispose()
	}

	/** Record a perf metric for a directive */
	record(entry: PerfEntry): void {
		const existing = this.perfData.find(
			d => d.directive === entry.directive && d.file === entry.file && d.line === entry.line,
		)
		if (existing) {
			if (entry.mountTime !== undefined) existing.mountTime = entry.mountTime
			if (entry.updateTime !== undefined) existing.updateTime = entry.updateTime
			if (entry.updateCount !== undefined) existing.updateCount = entry.updateCount
			if (entry.unmountTime !== undefined) existing.unmountTime = entry.unmountTime
			if (entry.memoryUsage !== undefined) existing.memoryUsage = entry.memoryUsage
		} else {
			this.perfData.push({ ...entry })
		}
	}

	/** Detect performance bottlenecks */
	detectBottlenecks(): BottleneckWarning[] {
		const warnings: BottleneckWarning[] = []

		for (const entry of this.perfData) {
			// Slow mount detection
			if (entry.mountTime !== undefined && entry.mountTime > THRESHOLDS.slowMount) {
				warnings.push({
					type: 'slow-mount',
					directive: entry.directive,
					file: entry.file,
					line: entry.line,
					severity: entry.mountTime > 100 ? 'high' : 'medium',
					message: `Slow mount: ${entry.mountTime.toFixed(2)}ms (threshold: ${THRESHOLDS.slowMount}ms)`,
					suggestion: this.getMountSuggestion(entry.directive),
				})
			}

			// Slow update detection
			if (entry.updateTime !== undefined && entry.updateTime > THRESHOLDS.slowUpdate) {
				warnings.push({
					type: 'slow-update',
					directive: entry.directive,
					file: entry.file,
					line: entry.line,
					severity: entry.updateTime > 50 ? 'high' : 'medium',
					message: `Slow update: ${entry.updateTime.toFixed(2)}ms (threshold: ${THRESHOLDS.slowUpdate}ms)`,
					suggestion: 'Consider using v-debounce or v-throttle to reduce update frequency.',
				})
			}

			// Excessive updates detection
			if (entry.updateCount !== undefined && entry.updateCount > THRESHOLDS.excessiveUpdates) {
				warnings.push({
					type: 'excessive-updates',
					directive: entry.directive,
					file: entry.file,
					line: entry.line,
					severity: entry.updateCount > 500 ? 'high' : 'medium',
					message: `Excessive updates: ${entry.updateCount} times (threshold: ${THRESHOLDS.excessiveUpdates})`,
					suggestion: 'Use v-debounce for input handlers or v-throttle for scroll/resize events.',
				})
			}

			// Memory leak detection
			if (entry.memoryUsage !== undefined && entry.memoryUsage > THRESHOLDS.memoryThreshold) {
				warnings.push({
					type: 'memory-leak',
					directive: entry.directive,
					file: entry.file,
					line: entry.line,
					severity: entry.memoryUsage > 5000 ? 'high' : 'low',
					message: `High memory usage: ${(entry.memoryUsage / 1024).toFixed(2)}KB per instance`,
					suggestion: 'Check cleanup logic in unmounted hook. Ensure event listeners are removed.',
				})
			}
		}

		return warnings.sort((a, b) => {
			const sevOrder = { high: 0, low: 2, medium: 1 }
			return sevOrder[a.severity] - sevOrder[b.severity]
		})
	}

	/** Get optimization suggestion for slow mount */
	private getMountSuggestion(directive: string): string {
		const suggestions: Record<string, string> = {
			'v-draggable': 'Use transform instead of left/top for smoother performance.',
			'v-infinite-scroll': 'Increase distance threshold. Use v-virtual-list for better performance.',
			'v-intersect': 'Use rootMargin to preload elements earlier, or use v-intersect.once for one-time detection.',
			'v-lazy': 'Use preload threshold or placeholder images. Consider v-virtual-list for large lists.',
			'v-mutation': 'Set subtree: false to observe only the element, not its descendants.',
			'v-resize': 'Use debounce option. Consider observing only width or height changes.',
			'v-tooltip': 'Lazy initialize tooltip on first interaction instead of on mount.',
		}
		return suggestions[directive] || 'Review the directive initialization logic for optimization opportunities.'
	}

	/** Analyze current file for directive usage */
	analyzeDocument(document: vscode.TextDocument): void {
		if (document.languageId !== 'vue' && document.languageId !== 'html') return

		const text = document.getText()
		const directivePattern = /v-([\w-]+)/g

		let match: RegExpExecArray | null = directivePattern.exec(text)
		while (match !== null) {
			const pos = document.positionAt(match.index)
			this.record({
				directive: `v-${match[1]}`,
				file: document.fileName,
				line: pos.line + 1,
			})

			match = directivePattern.exec(text)
		}
	}

	private showReport(): void {
		if (this.perfData.length === 0) {
			vscode.window.showInformationMessage('[Directix] No performance data recorded yet.')
			return
		}

		this.outputChannel.clear()

		const lines: string[] = [
			'╔══════════════════════════════════════════════════════════════╗',
			'║              Directix Performance Report                    ║',
			'╚══════════════════════════════════════════════════════════════╝',
			'',
			`Total directive instances: ${this.perfData.length}`,
			'',
			'─'.repeat(60),
			'',
		]

		const grouped = new Map<string, PerfEntry[]>()
		for (const entry of this.perfData) {
			const list = grouped.get(entry.directive) || []
			list.push(entry)
			grouped.set(entry.directive, list)
		}

		for (const [directive, entries] of grouped) {
			lines.push(`■ ${directive} (${entries.length} instances)`)
			for (const entry of entries) {
				const mountStr = entry.mountTime !== undefined ? `${entry.mountTime.toFixed(2)}ms` : 'N/A'
				const updateStr = entry.updateTime !== undefined ? `${entry.updateTime.toFixed(2)}ms` : 'N/A'
				lines.push(`  L${entry.line}: mount=${mountStr}, update=${updateStr}`)
			}
			lines.push('')
		}

		lines.push('─'.repeat(60))
		lines.push('')
		lines.push('💡 Performance Tips:')
		lines.push('  • Use v-debounce instead of manual setTimeout for input handling')
		lines.push('  • Use v-intersect.once for one-time visibility checks')
		lines.push('  • Use v-virtual-list for lists with >100 items')
		lines.push('  • Avoid v-mutation on large subtrees (use subtree: false)')
		lines.push('  • Prefer v-throttle over v-debounce for scroll/resize events')

		this.outputChannel.appendLine(lines.join('\n'))
		this.outputChannel.show(true)
	}

	/** Show bottleneck warnings in a quick pick */
	showBottlenecks(): void {
		const warnings = this.detectBottlenecks()

		if (warnings.length === 0) {
			vscode.window.showInformationMessage('[Directix] No performance bottlenecks detected.')
			return
		}

		interface BottleneckItem extends vscode.QuickPickItem {
			warning: BottleneckWarning
		}

		const items: BottleneckItem[] = warnings.map(w => ({
			description: `${w.directive} @ ${w.file}:${w.line}`,
			detail: w.suggestion,
			label: `${w.severity.toUpperCase()}: ${w.message}`,
			warning: w,
		}))

		vscode.window.showQuickPick(items, {
			placeHolder: `${warnings.length} issues found. Select to view details.`,
			title: '⚠️ Directix Performance Bottlenecks',
		}).then(selected => {
			if (selected) {
				vscode.window.showInformationMessage(`💡 Suggestion: ${selected.warning.suggestion}`)
			}
		})

		// Also output to channel
		this.outputChannel.clear()
		this.outputChannel.appendLine('⚠️ Performance Bottleneck Report')
		this.outputChannel.appendLine('─'.repeat(60))
		for (const w of warnings) {
			this.outputChannel.appendLine(`[${w.severity.toUpperCase()}] ${w.directive} @ ${w.file}:${w.line}`)
			this.outputChannel.appendLine(`  Type: ${w.type}`)
			this.outputChannel.appendLine(`  Issue: ${w.message}`)
			this.outputChannel.appendLine(`  💡 Fix: ${w.suggestion}`)
			this.outputChannel.appendLine('')
		}
		this.outputChannel.show(true)
	}
}
