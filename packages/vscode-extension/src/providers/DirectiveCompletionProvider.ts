import * as vscode from 'vscode'
import { type DirectiveMeta, directives } from '../data/directives'

export class DirectiveCompletionProvider implements vscode.CompletionItemProvider {
	provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
	): vscode.ProviderResult<vscode.CompletionItem[]> {
		const line = document.lineAt(position.line)
		const textBeforeCursor = line.text.substring(0, position.character)

		if (!this.isInAttributePosition(textBeforeCursor)) {
			return undefined
		}

		const existingDirectives = this.extractExistingDirectives(line.text)

		return directives
			.filter(d => !existingDirectives.includes(d.name))
			.map(d => this.createCompletionItem(d))
	}

	private isInAttributePosition(text: string): boolean {
		const patterns = [
			/<\w+\s+$/,
			/<\w+[^>]*\s+$/,
			/<\w+[^>]*\s+v-[\w-]+="[^"]*"\s+$/,
			/<\w+[^>]*\s+v-[\w-]+='[^']*'\s+$/,
		]
		return patterns.some(p => p.test(text))
	}

	private extractExistingDirectives(lineText: string): string[] {
		const regex = /v-([\w-]+)/g
		const result: string[] = []
		let match: RegExpExecArray | null
		// eslint-disable-next-line no-cond-assign
		while (((match = regex.exec(lineText))) !== null) {
			result.push(`v-${match[1]}`)
		}
		return result
	}

	private createCompletionItem(directive: DirectiveMeta): vscode.CompletionItem {
		const item = new vscode.CompletionItem(directive.name, vscode.CompletionItemKind.Property)

		item.insertText = new vscode.SnippetString(this.generateSnippet(directive))
		item.documentation = this.generateDocumentation(directive)
		item.detail = `Directix: ${directive.category}`
		item.sortText = this.getSortText(directive.priority)

		return item
	}

	private generateSnippet(directive: DirectiveMeta): string {
		const requiredParams = directive.params.filter(p => !p.optional)
		const optionalParams = directive.params.filter(p => p.optional)

		if (requiredParams.length === 0 && optionalParams.length === 0) {
			return directive.name
		}

		if (requiredParams.length === 1 && optionalParams.length === 0) {
			return `${directive.name}="\${1}"`
		}

		// Complex directive with options object
		const entries: string[] = []
		let tabIndex = 1

		for (const param of requiredParams) {
			entries.push(`${param.name}: \${${tabIndex++}}`)
		}

		for (const param of optionalParams.slice(0, 2)) {
			const defaultVal = param.default ? param.default.replace(/'/g, '') : ''
			entries.push(`${param.name}: \${${tabIndex++}:${defaultVal}}`)
		}

		return `${directive.name}="{ ${entries.join(', ')} }"`
	}

	private generateDocumentation(directive: DirectiveMeta): vscode.MarkdownString {
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
		return md
	}

	private getSortText(priority: 'high' | 'medium' | 'low'): string {
		return priority === 'high' ? '0' : priority === 'medium' ? '1' : '2'
	}
}
