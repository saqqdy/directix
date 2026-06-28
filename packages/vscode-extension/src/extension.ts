import * as vscode from 'vscode'
import { directives } from './data/directives'
import { ConfigEditor } from './features/ConfigEditor'
import { DiagnosticsProvider } from './features/DiagnosticsProvider'
import { PerformanceAnalyzer } from './features/PerfAnalyzer'
import { StateInspector } from './features/StateInspector'
import { DirectiveCompletionProvider } from './providers/DirectiveCompletionProvider'

export function activate(context: vscode.ExtensionContext): void {
	// 1. Register DirectiveCompletionProvider (智能补全 + 悬浮提示)
	const completionProvider = new DirectiveCompletionProvider()
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			['vue', 'html'],
			completionProvider,
			'-',
		),
	)

	// 2. Register HoverProvider (悬浮提示 - from DirectiveCompletionProvider's data)
	context.subscriptions.push(
		vscode.languages.registerHoverProvider(['vue', 'html'], {
			provideHover(document: vscode.TextDocument, position: vscode.Position) {
				const range = document.getWordRangeAtPosition(position, /v-[a-z-]+/)
				if (!range) return undefined

				const word = document.getText(range)
				const directive = directives.find((d: any) => d.name === word)
				if (!directive) return undefined

				const md = new vscode.MarkdownString()
				md.appendMarkdown(`**${directive.name}** - ${directive.description}\n\n`)
				md.appendMarkdown(`Category: ${directive.category} | SSR: ${directive.ssr ? '✅' : '❌'} | Since: ${directive.since}\n\n`)

				if (directive.params.length > 0) {
					md.appendMarkdown('#### Parameters\n\n')
					for (const param of directive.params) {
						const optional = param.optional ? '_(optional)_' : '**(required)**'
						const defaultVal = param.default ? `, default: \`${param.default}\`` : ''
						md.appendMarkdown(`- **\`${param.name}\`** (\`${param.type}\`): ${param.description} ${optional}${defaultVal}\n`)
					}
					md.appendMarkdown('\n')
				}

				if (directive.modifiers.length > 0) {
					md.appendMarkdown('#### Modifiers\n\n')
					for (const mod of directive.modifiers) {
						md.appendMarkdown(`- \`.${mod.name}\` - ${mod.description}\n`)
					}
					md.appendMarkdown('\n')
				}

				md.appendMarkdown('#### Example\n\n')
				md.appendCodeblock(directive.example, 'vue')

				if (directive.exampleOptions) {
					md.appendMarkdown('\n#### Options Example\n\n')
					md.appendCodeblock(directive.exampleOptions, 'vue')
				}

				md.isTrusted = true
				return new vscode.Hover(md, range)
			},
		}),
	)

	// 3. Register DefinitionProvider (跳转到文档)
	context.subscriptions.push(
		vscode.languages.registerDefinitionProvider(['vue', 'html'], {
			provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
				const range = document.getWordRangeAtPosition(position, /v-[a-z-]+/)
				if (!range) return undefined

				const word = document.getText(range)
				const docUrl = `https://directix.saqqdy.com/directives/${word.replace('v-', '')}.html`
				vscode.env.openExternal(vscode.Uri.parse(docUrl))
				return undefined
			},
		}),
	)

	// 4. Register DiagnosticsProvider (实时诊断)
	const diagnosticsProvider = new DiagnosticsProvider()
	diagnosticsProvider.activate(context.subscriptions)

	// 5. Register PerformanceAnalyzer (性能分析)
	const perfAnalyzer = new PerformanceAnalyzer()
	perfAnalyzer.activate(context.subscriptions)

	// 6. Register StateInspector (状态检查)
	const stateInspector = new StateInspector()
	stateInspector.activate(context.subscriptions)

	// 7. Register ConfigEditor (配置可视化编辑)
	const configEditor = new ConfigEditor(context)

	// 8. Register commands
	context.subscriptions.push(
		vscode.commands.registerCommand('directix.openDocs', () => {
			vscode.env.openExternal(vscode.Uri.parse('https://directix.saqqdy.com'))
		}),
	)

	context.subscriptions.push(
		vscode.commands.registerCommand('directix.openConfigEditor', () => {
			configEditor.open()
		}),
	)

	// Additional commands for v2.5.0
	context.subscriptions.push(
		vscode.commands.registerCommand('directix.inspectState', () => {
			stateInspector.showQuickPick()
		}),
	)

	context.subscriptions.push(
		vscode.commands.registerCommand('directix.showBottlenecks', () => {
			perfAnalyzer.showBottlenecks()
		}),
	)

	context.subscriptions.push(
		vscode.commands.registerCommand('directix.openDirectiveDocs', () => {
			const activeEditor = vscode.window.activeTextEditor
			if (!activeEditor) return
			const position = activeEditor.selection.active
			const range = activeEditor.document.getWordRangeAtPosition(position, /v-[a-z-]+/)
			if (!range) {
				vscode.window.showInformationMessage('[Directix] No directive found at cursor position.')
				return
			}
			const word = activeEditor.document.getText(range)
			const docUrl = `https://directix.saqqdy.com/directives/${word.replace('v-', '')}.html`
			vscode.env.openExternal(vscode.Uri.parse(docUrl))
		}),
	)

	context.subscriptions.push(
		vscode.commands.registerCommand('directix.searchDocs', async () => {
			const query = await vscode.window.showInputBox({
				placeHolder: 'Enter directive name or keyword...',
				title: 'Search Directix Documentation',
			})
			if (query) {
				const docUrl = `https://directix.saqqdy.com/search.html?q=${encodeURIComponent(query)}`
				vscode.env.openExternal(vscode.Uri.parse(docUrl))
			}
		}),
	)

	context.subscriptions.push(
		vscode.commands.registerCommand('directix.insertDirective', async () => {
			const activeEditor = vscode.window.activeTextEditor

			interface DirectiveItem extends vscode.QuickPickItem {
				directive: { name: string, description: string, category: string, since: string }
			}

			const items: DirectiveItem[] = directives.map((d: any) => ({
				description: d.description,
				detail: `Category: ${d.category} | Since: ${d.since}`,
				directive: d,
				label: d.name,
			}))

			const selected = await vscode.window.showQuickPick(items, {
				placeHolder: 'Select a directive to insert...',
				title: 'Insert Directix Directive',
			})

			if (selected && activeEditor) {
				const snippet = new vscode.SnippetString(
					`${selected.directive.name}="${1}"`,
				)
				activeEditor.insertSnippet(snippet)
			}
		}),
	)

	// 9. Analyze already-open documents for perf tracking
	vscode.workspace.textDocuments.forEach(doc => {
		perfAnalyzer.analyzeDocument(doc)
	})
}

export function deactivate(): void {}
