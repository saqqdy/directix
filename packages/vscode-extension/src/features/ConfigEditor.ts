import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import * as vscode from 'vscode'

interface DirectixConfig {
	prefix?: string
	ssr?: boolean
	lazy?: boolean
	cacheSize?: number
	directives?: string[]
}

const DEFAULT_CONFIG: DirectixConfig = {
	prefix: '',
	ssr: false,
	lazy: false,
	cacheSize: 100,
	directives: [],
}

/** All available directive names (without v- prefix) */
const ALL_DIRECTIVE_NAMES: string[] = [
	'click-outside', 'copy', 'debounce', 'throttle', 'focus', 'lazy',
	'permission', 'long-press', 'hover', 'ripple', 'scroll', 'resize',
	'intersect', 'infinite-scroll', 'sticky', 'mask', 'sanitize', 'loading',
	'visible', 'mutation', 'truncate', 'uppercase', 'lowercase', 'capitalcase',
	'number', 'money', 'trim', 'tooltip', 'draggable', 'touch', 'image-preview',
	'click-delay', 'hotkey', 'ellipsis', 'countdown', 'print', 'watermark',
	'pull-refresh', 'swipe', 'virtual-list', 'click-wave', 'context-menu',
	'fullscreen', 'skeleton', 'export', 'highlight', 'emoji', 'pan', 'pinch',
	'rotate-gesture', 'blur', 'fade', 'parallax', 'lottie', 'typewriter',
	'progress', 'counter',
]

export class ConfigEditor {
	private panel: vscode.WebviewPanel | undefined

	constructor(_context: vscode.ExtensionContext) {
		// Context available for future extension state needs
	}

	/**
	 * Open the configuration editor
	 */
	async open(configUri?: vscode.Uri): Promise<void> {
		if (this.panel) {
			this.panel.reveal(vscode.ViewColumn.One)
			return
		}

		// Find config file
		const workspaceFolders = vscode.workspace.workspaceFolders
		if (!workspaceFolders?.length) {
			vscode.window.showWarningMessage('Please open a workspace first.')
			return
		}

		const workspaceRoot = workspaceFolders[0].uri.fsPath
		const configPath = configUri?.fsPath || this.findConfigFile(workspaceRoot)

		this.panel = vscode.window.createWebviewPanel(
			'directixConfig',
			'Directix 配置编辑器',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
			},
		)

		// Load config
		const config = this.loadConfig(configPath, workspaceRoot)

		// Load Webview
		this.panel.webview.html = this.getWebviewContent(config)

		// Track config path
		let currentConfigPath = configPath

		// Listen for messages
		this.panel.webview.onDidReceiveMessage(async message => {
			switch (message.command) {
				case 'save': {
					if (!currentConfigPath) {
						currentConfigPath = join(workspaceRoot, 'directix.config.ts')
					}
					await this.saveConfig(currentConfigPath, message.config)
					vscode.window.showInformationMessage('✅ 配置已保存')
					break
				}

				case 'reset': {
					const resetConfig = { ...DEFAULT_CONFIG }
					this.panel!.webview.postMessage({
						command: 'update',
						config: resetConfig,
					})
					break
				}

				case 'validate': {
					const errors = this.validateConfig(message.config)
					this.panel!.webview.postMessage({
						command: 'validationResult',
						errors,
					})
					break
				}

				case 'selectConfigFile': {
					const uris = await vscode.window.showOpenDialog({
						defaultUri: vscode.Uri.file(workspaceRoot),
						filters: {
							'Config Files': ['ts', 'js', 'json'],
						},
						title: 'Select Directix Config File',
					})
					if (uris?.length) {
						currentConfigPath = uris[0].fsPath
						const newConfig = this.loadConfig(currentConfigPath, workspaceRoot)
						this.panel!.webview.postMessage({
							command: 'update',
							config: newConfig,
						})
					}
					break
				}
			}
		})

		this.panel.onDidDispose(() => {
			this.panel = undefined
		})
	}

	/**
	 * Find the config file in workspace
	 */
	private findConfigFile(workspaceRoot: string): string | undefined {
		const filenames = ['directix.config.ts', 'directix.config.js', 'directix.config.json']
		for (const filename of filenames) {
			const filePath = join(workspaceRoot, filename)
			if (existsSync(filePath)) {
				return filePath
			}
		}
		return undefined
	}

	/**
	 * Load config from file
	 */
	private loadConfig(configPath: string | undefined, _workspaceRoot: string): DirectixConfig {
		if (!configPath || !existsSync(configPath)) {
			return { ...DEFAULT_CONFIG }
		}

		try {
			const content = readFileSync(configPath, 'utf-8')
			const cleaned = content
				.replace(/export\s+default\s*/, '')
				.replace(/;\s*$/, '')
				.trim()

			if (configPath.endsWith('.json')) {
				return { ...DEFAULT_CONFIG, ...JSON.parse(cleaned) }
			}

			const objectMatch = cleaned.match(/\{[\s\S]*\}/)
			if (objectMatch) {
				try {
					const jsonLike = objectMatch[0]
						.replace(/(\w+)\s*:/g, '"$1":')
						.replace(/'/g, '"')
						.replace(/,\s*}/g, '}')
						.replace(/,\s*\]/g, ']')
					const parsed = JSON.parse(jsonLike)
					return { ...DEFAULT_CONFIG, ...parsed }
				} catch {
					// Fallback to default config
				}
			}

			return { ...DEFAULT_CONFIG }
		} catch {
			return { ...DEFAULT_CONFIG }
		}
	}

	/**
	 * Save config to file
	 */
	private async saveConfig(configPath: string, config: DirectixConfig): Promise<void> {
		const ext = basename(configPath).split('.').pop()

		let content: string
		if (ext === 'json') {
			content = JSON.stringify(config, null, 2)
		} else {
			content = `import type { DirectixConfig } from 'directix'

export default ${JSON.stringify(config, null, 2)} as DirectixConfig
`
		}

		writeFileSync(configPath, content, 'utf-8')
	}

	/**
	 * Validate configuration
	 */
	private validateConfig(config: DirectixConfig): string[] {
		const errors: string[] = []

		if (config.cacheSize !== undefined && (config.cacheSize < 0 || !Number.isInteger(config.cacheSize))) {
			errors.push('缓存大小必须为非负整数')
		}

		if (config.prefix !== undefined && typeof config.prefix !== 'string') {
			errors.push('前缀必须为字符串')
		}

		if (config.directives !== undefined && !Array.isArray(config.directives)) {
			errors.push('启用指令列表必须为数组')
		}

		return errors
	}

	/**
	 * Get Webview HTML
	 */
	private getWebviewContent(config: DirectixConfig): string {
		const nonce = this.getNonce()

		return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <title>Directix 配置编辑器</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif); font-size: 13px; padding: 16px; color: var(--vscode-foreground); background: var(--vscode-editor-background); }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
    .section { background: var(--vscode-editorWidget-background, var(--vscode-sideBar-background)); border-radius: 6px; padding: 14px; margin-bottom: 14px; border: 1px solid var(--vscode-widget-border, transparent); }
    .section h2 { font-size: 14px; margin-bottom: 10px; color: var(--vscode-foreground); }
    .form-group { margin-bottom: 10px; }
    .form-group label { display: block; margin-bottom: 3px; font-weight: 500; font-size: 12px; color: var(--vscode-descriptionForeground); }
    .form-group input, .form-group select { width: 100%; padding: 6px 10px; border-radius: 4px; border: 1px solid var(--vscode-input-border); background: var(--vscode-input-background); color: var(--vscode-input-foreground); font-size: 13px; font-family: inherit; }
    .form-group input:focus, .form-group select:focus { outline: 1px solid var(--vscode-focusBorder); }
    .toggle-group { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    .toggle-group label { margin-bottom: 0; }
    .toggle { position: relative; width: 36px; height: 18px; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle .slider { position: absolute; cursor: pointer; inset: 0; background: var(--vscode-input-background); border: 1px solid var(--vscode-input-border); border-radius: 9px; transition: 0.2s; }
    .toggle .slider:before { content: ""; position: absolute; width: 12px; height: 12px; left: 2px; bottom: 2px; background: var(--vscode-foreground); border-radius: 50%; transition: 0.2s; }
    .toggle input:checked + .slider { background: var(--vscode-button-background); border-color: var(--vscode-button-background); }
    .toggle input:checked + .slider:before { transform: translateX(18px); }
    .actions { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }
    button { padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; font-weight: 500; font-size: 13px; font-family: inherit; }
    .btn-primary { background: var(--vscode-button-background); color: var(--vscode-button-foreground); }
    .btn-primary:hover { background: var(--vscode-button-hoverBackground); }
    .btn-secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
    .btn-secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }
    .error { color: var(--vscode-errorForeground); font-size: 12px; margin-top: 3px; }
    .success { color: var(--vscode-testing-iconPassed); font-size: 12px; margin-top: 12px; }
t    .directive-toolbar { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; flex-wrap: wrap; }
t    .directive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 6px; max-height: 260px; overflow-y: auto; padding: 4px; }
t    .directive-checkbox { display: flex; align-items: center; gap: 4px; padding: 3px 6px; border-radius: 3px; background: var(--vscode-list-hoverBackground); cursor: pointer; font-size: 12px; font-family: var(--vscode-editor-font-family, monospace); }
t    .directive-checkbox input { margin: 0; }
t    .btn-sm { padding: 4px 10px; font-size: 11px; }
t    .search-directive { padding: 4px 8px; border-radius: 3px; border: 1px solid var(--vscode-input-border); background: var(--vscode-input-background); color: var(--vscode-input-foreground); font-size: 12px; outline: none; flex: 1; min-width: 120px; }
    .config-path { font-size: 11px; color: var(--vscode-descriptionForeground); margin-bottom: 16px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎯 Directix 配置编辑器</h1>
    <div class="config-path" id="config-path"></div>

    <div class="section">
      <h2>基础配置</h2>
      <div class="form-group">
        <label for="prefix">指令前缀</label>
        <input type="text" id="prefix" value="${config.prefix || ''}" placeholder="例如: my-">
      </div>
      <div class="form-group">
        <label for="cacheSize">缓存大小</label>
        <input type="number" id="cacheSize" value="${config.cacheSize ?? 100}" min="0">
      </div>
    </div>

    <div class="section">
      <h2>功能开关</h2>
      <div class="toggle-group">
        <label class="toggle">
          <input type="checkbox" id="ssr" ${config.ssr ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
        <label for="ssr">SSR 支持</label>
      </div>
      <div class="toggle-group">
        <label class="toggle">
          <input type="checkbox" id="lazy" ${config.lazy ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
        <label for="lazy">懒加载模式</label>
      </div>
    </div>

    <div class="section">
      <h2>指令选择（留空表示启用全部）</h2>
      <div class="directive-toolbar">
        <button class="btn-secondary btn-sm" onclick="selectAll()">全选</button>
        <button class="btn-secondary btn-sm" onclick="deselectAll()">全不选</button>
        <input class="search-directive" type="text" placeholder="搜索指令..." id="directiveSearch" oninput="filterDirectives(this.value)">
      </div>
      <div class="directive-grid" id="directiveGrid">${ALL_DIRECTIVE_NAMES.map(name => `<label class="directive-checkbox"><input type="checkbox" value="${name}" ${(config.directives || []).includes(name) ? 'checked' : ''}><span>v-${name}</span></label>`).join('')}</div>
    </div>

    <div class="actions">
      <button class="btn-primary" onclick="save()">💾 保存配置</button>
      <button class="btn-secondary" onclick="reset()">🔄 重置为默认</button>
      <button class="btn-secondary" onclick="validate()">✅ 验证配置</button>
      <button class="btn-secondary" onclick="selectFile()">📂 选择配置文件</button>
    </div>
    <div id="errors"></div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi()

    function getSelectedDirectives() {
      return Array.from(document.querySelectorAll('#directiveGrid input[type="checkbox"]:checked')).map(cb => cb.value)
    }

    function save() {
      const config = {
        prefix: document.getElementById('prefix').value,
        cacheSize: parseInt(document.getElementById('cacheSize').value) || 100,
        ssr: document.getElementById('ssr').checked,
        lazy: document.getElementById('lazy').checked,
        directives: getSelectedDirectives(),
      }
      vscode.postMessage({ command: 'save', config })
    }

    function reset() {
      vscode.postMessage({ command: 'reset' })
    }

    function validate() {
      const config = {
        prefix: document.getElementById('prefix').value,
        cacheSize: parseInt(document.getElementById('cacheSize').value) || 100,
        ssr: document.getElementById('ssr').checked,
        lazy: document.getElementById('lazy').checked,
        directives: getSelectedDirectives(),
      }
      vscode.postMessage({ command: 'validate', config })
    }

    function selectFile() {
      vscode.postMessage({ command: 'selectConfigFile' })
    }

    function selectAll() {
      document.querySelectorAll('#directiveGrid input[type="checkbox"]').forEach(cb => { cb.checked = true })
    }

    function deselectAll() {
      document.querySelectorAll('#directiveGrid input[type="checkbox"]').forEach(cb => { cb.checked = false })
    }

    function filterDirectives(query) {
      var q = query.toLowerCase()
      document.querySelectorAll('#directiveGrid .directive-checkbox').forEach(label => {
        var text = label.textContent.toLowerCase()
        label.style.display = text.includes(q) ? '' : 'none'
      })
    }

    window.addEventListener('message', event => {
      const message = event.data
      if (message.command === 'validationResult') {
        const errorsDiv = document.getElementById('errors')
        if (message.errors.length === 0) {
          errorsDiv.innerHTML = '<div class="success">✅ 配置验证通过</div>'
        } else {
          errorsDiv.innerHTML = message.errors.map(e =>
            '<div class="error">' + e + '</div>'
          ).join('')
        }
      } else if (message.command === 'update') {
        document.getElementById('prefix').value = message.config.prefix || ''
        document.getElementById('cacheSize').value = message.config.cacheSize ?? 100
        document.getElementById('ssr').checked = !!message.config.ssr
        document.getElementById('lazy').checked = !!message.config.lazy

t        var dirs = message.config.directives || []
t        document.querySelectorAll('#directiveGrid input[type="checkbox"]').forEach(function(cb) {
t          cb.checked = dirs.includes(cb.value)
t        })
      }
    })
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
