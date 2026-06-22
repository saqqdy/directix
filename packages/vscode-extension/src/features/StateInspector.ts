import * as vscode from 'vscode'
import { directives } from '../data/directives'

export class StateInspector {
	private panel: vscode.WebviewPanel | undefined

	activate(subscriptions: vscode.Disposable[]): void {
		subscriptions.push(
			vscode.commands.registerCommand('directix.inspectState', () => {
				this.showInspector()
			}),
		)
	}

	dispose(): void {
		this.panel?.dispose()
	}

	private showInspector(): void {
		if (this.panel) {
			this.panel.reveal(vscode.ViewColumn.Two)
			return
		}

		this.panel = vscode.window.createWebviewPanel('directixState', 'Directix State Inspector', vscode.ViewColumn.Two, {
			enableScripts: true,
			retainContextWhenHidden: true,
		})

		this.panel.webview.html = this.getWebviewContent()

		this.panel.onDidDispose(() => {
			this.panel = undefined
		})
	}

	private getWebviewContent(): string {
		const nonce = this.getNonce()
		const categories = [...new Set(directives.map(d => d.category))]

		const categorySections = categories
			.map(cat => {
				const catDirectives = directives.filter(d => d.category === cat)
				const items = catDirectives
					.map(
						d => `
					<div class="directive-item">
						<div class="directive-name">${d.name}</div>
						<div class="directive-desc">${d.description}</div>
						<div class="directive-meta">
							<span class="tag ${d.ssr ? 'ssr-yes' : 'ssr-no'}">SSR: ${d.ssr ? '✅' : '❌'}</span>
							<span class="tag">Since: ${d.since}</span>
							<span class="tag priority-${d.priority}">${d.priority}</span>
						</div>
						<div class="directive-params">
							${d.params.length > 0 ? d.params.map(p => `<span class="param ${p.optional ? 'optional' : 'required'}">${p.name}${p.optional ? '?' : ''}: ${p.type}</span>`).join('') : '<span class="no-params">No params (boolean directive)</span>'}
						</div>
					</div>`,
					)
					.join('')

				return `
				<div class="category">
					<h2 class="category-title" onclick="toggleCategory(this)">${cat} (${catDirectives.length})</h2>
					<div class="category-items">${items}</div>
				</div>`
			})
			.join('')

		return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <title>Directix State Inspector</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, sans-serif); font-size: 13px; padding: 12px; color: var(--vscode-foreground); background: var(--vscode-editor-background); }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .subtitle { font-size: 11px; color: var(--vscode-descriptionForeground); margin-bottom: 16px; }
    .search { width: 100%; padding: 6px 10px; border-radius: 4px; border: 1px solid var(--vscode-input-border); background: var(--vscode-input-background); color: var(--vscode-input-foreground); font-size: 13px; margin-bottom: 12px; outline: none; }
    .search:focus { border-color: var(--vscode-focusBorder); }
    .stats { display: flex; gap: 16px; margin-bottom: 16px; font-size: 12px; color: var(--vscode-descriptionForeground); }
    .stats strong { color: var(--vscode-foreground); }
    .category { margin-bottom: 12px; }
    .category-title { font-size: 13px; font-weight: 600; cursor: pointer; padding: 6px 8px; border-radius: 4px; background: var(--vscode-list-hoverBackground); margin-bottom: 4px; user-select: none; }
    .category-title:hover { background: var(--vscode-list-activeSelectionBackground); }
    .category-items { margin-left: 8px; }
    .category.collapsed .category-items { display: none; }
    .directive-item { padding: 8px; margin: 4px 0; border-radius: 4px; border-left: 3px solid var(--vscode-button-background); background: var(--vscode-editorWidget-background); }
    .directive-name { font-weight: 600; color: var(--vscode-button-background); font-family: var(--vscode-editor-font-family, monospace); }
    .directive-desc { font-size: 12px; margin-top: 2px; }
    .directive-meta { margin-top: 4px; display: flex; gap: 8px; flex-wrap: wrap; }
    .tag { font-size: 10px; padding: 1px 6px; border-radius: 3px; background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); }
    .priority-high { border-left-color: #4caf50; }
    .priority-medium { border-left-color: #ff9800; }
    .priority-low { border-left-color: #9e9e9e; }
    .ssr-yes { color: #4caf50; }
    .ssr-no { color: #f44336; }
    .directive-params { margin-top: 4px; display: flex; gap: 4px; flex-wrap: wrap; }
    .param { font-size: 10px; font-family: monospace; padding: 1px 4px; border-radius: 2px; background: var(--vscode-textBlockQuote-background); }
    .param.required { border-left: 2px solid var(--vscode-errorForeground); }
    .param.optional { border-left: 2px solid var(--vscode-descriptionForeground); }
    .no-params { font-size: 10px; color: var(--vscode-descriptionForeground); font-style: italic; }
  </style>
</head>
<body>
  <h1>🎯 Directix State Inspector</h1>
  <p class="subtitle">Inspect all ${directives.length} available directives and their configurations</p>
  <input class="search" type="text" placeholder="Search directives..." id="search" oninput="filterDirectives(this.value)">
  <div class="stats">
    <span>Total: <strong>${directives.length}</strong></span>
    <span>Categories: <strong>${categories.length}</strong></span>
    <span>SSR Compatible: <strong>${directives.filter(d => d.ssr).length}</strong></span>
  </div>
  <div id="categories">${categorySections}</div>
  <script nonce="${nonce}">
    function toggleCategory(el) {
      el.parentElement.classList.toggle('collapsed')
    }
    function filterDirectives(query) {
      var q = query.toLowerCase()
      document.querySelectorAll('.directive-item').forEach(function(item) {
        var text = item.textContent.toLowerCase()
        item.style.display = text.includes(q) ? '' : 'none'
      })
    }
  </script>
</body>
</html>`
	}

	private getNonce(): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let result = ''
		for (let i = 0; i < 32; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length))
		}
		return result
	}
}
