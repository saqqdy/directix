import * as vscode from 'vscode'

interface PerfEntry {
	directive: string
	file: string
	line: number
	mountTime?: number
	updateTime?: number
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
		} else {
			this.perfData.push({ ...entry })
		}
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
}
