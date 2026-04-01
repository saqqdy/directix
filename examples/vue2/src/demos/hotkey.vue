<script lang="ts">
import { defineComponent, ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useHotkey } from 'directix'

export default defineComponent({
	name: 'HotkeyDemo',
	components: { DemoSection, CodeBlock },
	setup() {
		// Composable API demo
		const composableLog = ref<string[]>([])
		const composableEnabled = ref(true)

		const { enabled, enable, disable, toggle } = useHotkey({
			hotkeys: [
				{ key: 'ctrl+shift+z', handler: () => {
					composableLog.value.unshift('Undo (Ctrl+Shift+Z)')
					if (composableLog.value.length > 5) composableLog.value.pop()
				}},
				{ key: 'ctrl+shift+y', handler: () => {
					composableLog.value.unshift('Redo (Ctrl+Shift+Y)')
					if (composableLog.value.length > 5) composableLog.value.pop()
				}}
			],
			enabled: composableEnabled
		})

		const composableCode = `<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useHotkey } from 'directix'

export default defineComponent({
  setup() {
    const log = ref<string[]>([])

    const { enabled, enable, disable, add, remove } = useHotkey({
      hotkeys: [
        { key: 'ctrl+s', handler: () => save() },
        { key: 'ctrl+z', handler: () => undo() }
      ]
    })

    // Add dynamic hotkey
    add({ key: 'esc', handler: () => closeModal() })

    return { log, enabled, enable, disable }
  }
})
<\/script>`

		return {
			composableLog,
			composableEnabled,
			enabled,
			enable,
			disable,
			toggle,
			composableCode
		}
	},
	data() {
		return {
			escapeCount: 0,
			saveCount: 0,
			hotkeyLog: [] as string[],
			actionLog: [] as string[],
			searchText: '',
			searchResults: [] as string[],
			hotkeysDisabled: false,
			disabledCount: 0,
			basicCode: `<div v-hotkey:escape="handleEscape">
  Press Escape to trigger
</div>`,
			modifierCode: `<!-- Ctrl + S -->
<div v-hotkey:ctrl.s="handleSave">
  Press Ctrl+S to save
</div>

<!-- Ctrl + Shift + S -->
<div v-hotkey:ctrl.shift.s="handleSaveAs">
  Press Ctrl+Shift+S to save as
</div>`,
			multipleCode: `<!-- Using array syntax -->
<div v-hotkey="[
  { key: 'z', modifiers: ['ctrl'], handler: handleUndo },
  { key: 'y', modifiers: ['ctrl'], handler: handleRedo },
  { key: 'b', modifiers: ['ctrl'], handler: handleBold },
  { key: 'i', modifiers: ['ctrl'], handler: handleItalic }
]">
  Editor with multiple shortcuts
</div>`,
			objectCode: `<!-- Using object syntax -->
<div v-hotkey="{
  'ctrl+z': handleUndo,
  'ctrl+y': handleRedo,
  'ctrl+b': handleBold
}">
  Press Ctrl+Z, Ctrl+Y, or Ctrl+B
</div>`,
			inputCode: `<input
  v-hotkey="{
    enter: handleSearch,
    escape: handleClear
  }"
  v-model="searchText"
  placeholder="Press Enter to search, Escape to clear"
/>`
		}
	},
	methods: {
		handleEscape() {
			this.escapeCount++
		},
		handleSave() {
			this.saveCount++
		},
		handleUndo() {
			this.hotkeyLog.unshift('Undo (Ctrl+Z)')
			if (this.hotkeyLog.length > 5) this.hotkeyLog.pop()
		},
		handleRedo() {
			this.hotkeyLog.unshift('Redo (Ctrl+Y)')
			if (this.hotkeyLog.length > 5) this.hotkeyLog.pop()
		},
		handleBold() {
			this.hotkeyLog.unshift('Bold (Ctrl+B)')
			if (this.hotkeyLog.length > 5) this.hotkeyLog.pop()
		},
		handleItalic() {
			this.hotkeyLog.unshift('Italic (Ctrl+I)')
			if (this.hotkeyLog.length > 5) this.hotkeyLog.pop()
		},
		handleAction(action: string) {
			this.actionLog.unshift(action)
			if (this.actionLog.length > 5) this.actionLog.pop()
		},
		handleSearch() {
			if (this.searchText) {
				this.searchResults = [`Result for: ${this.searchText}`, `Another result for: ${this.searchText}`]
			}
		},
		handleClear() {
			this.searchText = ''
			this.searchResults = []
		},
		handleDisabledHotkey() {
			this.disabledCount++
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-hotkey</h1>
		<p class="intro">
			A directive that binds keyboard shortcuts to elements. Supports modifier keys (Ctrl, Alt, Shift, Meta) and multiple hotkey configurations.
		</p>

		<!-- Scenario 1: Basic usage -->
		<DemoSection title="Basic Usage - Single Key" description="Bind a single key to trigger an action">
			<div class="demo-box">
				<div
					v-hotkey:escape="handleEscape"
					class="hotkey-box"
				>
					<span class="key">Escape</span>
					<p>Press <kbd>Esc</kbd> anywhere on this page</p>
					<p class="result">Pressed: <strong>{{ escapeCount }}</strong> times</p>
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Modifier keys -->
		<DemoSection title="Modifier Keys" description="Combine with Ctrl, Alt, Shift, or Meta">
			<div class="demo-box">
				<div
					v-hotkey:ctrl.s="handleSave"
					class="hotkey-box"
					tabindex="0"
				>
					<span class="key">Ctrl + S</span>
					<p>Click here to focus, then press <kbd>Ctrl+S</kbd></p>
					<p class="result">Saved: <strong>{{ saveCount }}</strong> times</p>
				</div>
				<p class="hint">Click the box first to focus, then press Ctrl+S</p>
			</div>
			<CodeBlock :code="modifierCode" />
		</DemoSection>

		<!-- Scenario 3: Multiple hotkeys -->
		<DemoSection title="Multiple Hotkeys - Array Syntax" description="Define multiple shortcuts using array syntax">
			<div class="demo-box">
				<div
					v-hotkey="[
						{ key: 'z', modifiers: ['ctrl'], handler: handleUndo },
						{ key: 'y', modifiers: ['ctrl'], handler: handleRedo },
						{ key: 'b', modifiers: ['ctrl'], handler: handleBold },
						{ key: 'i', modifiers: ['ctrl'], handler: handleItalic }
					]"
					class="hotkey-box editor-box"
				>
					<div class="key-row">
						<span class="key">Ctrl+Z</span>
						<span class="key">Ctrl+Y</span>
						<span class="key">Ctrl+B</span>
						<span class="key">Ctrl+I</span>
					</div>
					<p>Press shortcuts anywhere on this page</p>
					<div class="log">
						<div v-for="(log, i) in hotkeyLog" :key="i" class="log-item">
							{{ log }}
						</div>
						<div v-if="hotkeyLog.length === 0" class="log-empty">
							No actions yet
						</div>
					</div>
				</div>
			</div>
			<CodeBlock :code="multipleCode" />
		</DemoSection>

		<!-- Scenario 4: Object syntax -->
		<DemoSection title="Object Syntax" description="Define hotkeys using object syntax for cleaner code">
			<div class="demo-box">
				<div
					v-hotkey="{
						'ctrl+n': () => handleAction('New File'),
						'ctrl+o': () => handleAction('Open File'),
						'ctrl+s': () => handleAction('Save File'),
						'ctrl+shift+s': () => handleAction('Save As...')
					}"
					class="hotkey-box"
				>
					<div class="key-row">
						<span class="key">Ctrl+N</span>
						<span class="key">Ctrl+O</span>
						<span class="key">Ctrl+S</span>
						<span class="key">Ctrl+Shift+S</span>
					</div>
					<p>File operations shortcuts (press anywhere)</p>
					<div class="log">
						<div v-for="(log, i) in actionLog" :key="i" class="log-item">
							{{ log }}
						</div>
						<div v-if="actionLog.length === 0" class="log-empty">
							No actions yet
						</div>
					</div>
				</div>
			</div>
			<CodeBlock :code="objectCode" />
		</DemoSection>

		<!-- Scenario 5: Input focused hotkeys -->
		<DemoSection title="Input Field Hotkeys" description="Hotkeys bound to input fields">
			<div class="demo-box">
				<input
					v-hotkey="{
						enter: handleSearch,
						escape: handleClear
					}"
					v-model="searchText"
					class="search-input"
					placeholder="Press Enter to search, Escape to clear"
				/>
				<div v-if="searchResults.length" class="results">
					<div v-for="(result, i) in searchResults" :key="i" class="result-item">
						{{ result }}
					</div>
				</div>
				<p class="hint">Focus the input and use Enter/Escape</p>
			</div>
			<CodeBlock :code="inputCode" />
		</DemoSection>

		<!-- Scenario 6: Disabled hotkey -->
		<DemoSection title="Disabled State" description="Dynamically enable/disable hotkeys">
			<div class="demo-box">
				<div
					v-hotkey="[
						{ key: 's', modifiers: ['ctrl'], handler: handleDisabledHotkey, disabled: hotkeysDisabled }
					]"
					class="hotkey-box"
					:class="{ 'is-disabled': hotkeysDisabled }"
				>
					<span class="key">Ctrl + S</span>
					<p class="result">Triggered: <strong>{{ disabledCount }}</strong> times</p>
				</div>
				<label class="checkbox">
					<input type="checkbox" v-model="hotkeysDisabled" />
					<span>Disable hotkeys</span>
				</label>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useHotkey" description="Programmatically handle keyboard shortcuts using the composable">
			<div class="demo-box">
				<div class="key-row">
					<span class="key">Ctrl+Shift+Z</span>
					<span class="key">Ctrl+Shift+Y</span>
				</div>
				<p>Press shortcuts anywhere on this page (composable)</p>
				<div class="log">
					<div v-for="(log, i) in composableLog" :key="i" class="log-item">
						{{ log }}
					</div>
					<div v-if="composableLog.length === 0" class="log-empty">
						No actions yet
					</div>
				</div>
				<div class="controls-row">
					<label class="checkbox">
						<input type="checkbox" :checked="enabled" @change="toggle" />
						<span>Hotkeys enabled: {{ enabled ? 'Yes' : 'No' }}</span>
					</label>
				</div>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>

		<!-- API Reference -->
		<DemoSection title="API">
			<h4>HotkeyOptions</h4>
			<table class="api-table">
				<thead>
					<tr>
						<th>Parameter</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>key</td>
						<td>String</td>
						<td>-</td>
						<td>Key to listen for (e.g., 's', 'enter', 'escape')</td>
					</tr>
					<tr>
						<td>modifiers</td>
						<td>Array</td>
						<td>[]</td>
						<td>Modifier keys: 'ctrl', 'alt', 'shift', 'meta'</td>
					</tr>
					<tr>
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>Handler function (required)</td>
					</tr>
					<tr>
						<td>prevent</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Prevent default browser behavior</td>
					</tr>
					<tr>
						<td>stop</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Stop event propagation</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Whether to disable this hotkey</td>
					</tr>
				</tbody>
			</table>

			<h4 style="margin-top: 20px;">Key Aliases</h4>
			<ul class="arg-list">
				<li><code>esc</code> / <code>escape</code> - Escape key</li>
				<li><code>enter</code> - Enter key</li>
				<li><code>space</code> - Space bar</li>
				<li><code>up</code> / <code>down</code> / <code>left</code> / <code>right</code> - Arrow keys</li>
				<li><code>tab</code> - Tab key</li>
				<li><code>delete</code> / <code>backspace</code> - Delete keys</li>
				<li><code>f1</code> - <code>f12</code> - Function keys</li>
			</ul>
		</DemoSection>
	</div>
</template>

<style scoped>
.demo-page {
	max-width: 900px;
}

h1 {
	margin-bottom: 8px;
}

.intro {
	color: #666;
	margin-bottom: 24px;
}

.demo-box {
	padding: 20px;
	background: #f8f9fa;
	border-radius: 8px;
	margin-bottom: 12px;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
}

.hotkey-box {
	padding: 20px;
	background: white;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	text-align: center;
	cursor: pointer;
	transition: all 0.2s;
}

.hotkey-box:focus {
	border-color: #42b883;
	outline: none;
	box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

.hotkey-box.is-disabled {
	opacity: 0.5;
	border-style: dashed;
}

.key {
	display: inline-block;
	padding: 6px 12px;
	background: #42b883;
	color: white;
	border-radius: 4px;
	font-size: 13px;
	font-weight: 600;
	margin: 0 4px;
}

.key-row {
	display: flex;
	justify-content: center;
	gap: 8px;
	margin-bottom: 12px;
}

.result {
	margin-top: 12px;
	font-size: 14px;
}

.result strong {
	color: #42b883;
	font-size: 18px;
}

kbd {
	padding: 2px 6px;
	background: #f0f0f0;
	border: 1px solid #ccc;
	border-radius: 3px;
	font-size: 12px;
}

.editor-box {
	min-height: 150px;
}

.log {
	margin-top: 12px;
	text-align: left;
	max-height: 120px;
	overflow-y: auto;
}

.log-item {
	padding: 6px 10px;
	background: #f0fff4;
	border-left: 3px solid #42b883;
	margin-bottom: 4px;
	font-size: 13px;
}

.log-empty {
	color: #999;
	font-size: 13px;
}

.search-input {
	width: 100%;
	padding: 12px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 14px;
}

.search-input:focus {
	border-color: #42b883;
	outline: none;
}

.results {
	margin-top: 12px;
}

.result-item {
	padding: 8px 12px;
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 4px;
	margin-bottom: 4px;
}

.checkbox {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 12px;
	cursor: pointer;
}

.checkbox input {
	width: 16px;
	height: 16px;
}

.controls-row {
	margin-top: 12px;
	padding-top: 12px;
	border-top: 1px solid #e0e0e0;
}

.api-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
}

.api-table th,
.api-table td {
	padding: 12px;
	text-align: left;
	border-bottom: 1px solid #eee;
}

.api-table th {
	background: #f8f9fa;
	font-weight: 600;
}

.api-table code {
	background: #f0f0f0;
	padding: 2px 6px;
	border-radius: 4px;
	font-size: 13px;
}

.arg-list {
	margin-top: 8px;
	padding-left: 20px;
}

.arg-list li {
	margin: 4px 0;
}

.arg-list code {
	background: #f0f0f0;
	padding: 2px 6px;
	border-radius: 4px;
}
</style>
