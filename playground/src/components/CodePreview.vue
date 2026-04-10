<script setup lang="ts">
import { ref, computed, watch, shallowRef, onMounted, onUnmounted, nextTick } from 'vue'
import { generateCode } from '../utils/code-generator'
import type { DirectiveConfig, GeneratedCode } from '../types'

const props = withDefaults(defineProps<{
  directive: DirectiveConfig
  values: Record<string, any>
  vueVersion: 'vue2' | 'vue3'
  mode?: 'code' | 'preview' | 'docs'
}>(), {
  mode: 'code'
})

const codeTab = ref<'vue3' | 'vue2' | 'composable' | 'nuxt' | 'types'>('vue3')
const copied = ref(false)
const iframeKey = ref(0)
const useMonaco = ref(false)
const editorContainer = shallowRef<HTMLDivElement>()
const monacoEditor = shallowRef<any>(null)
const isEditorReady = ref(false)
const monacoLoading = ref(false)

const generatedCode = computed<GeneratedCode>(() => {
  return generateCode({
    directive: props.directive,
    values: props.values,
    vueVersion: props.vueVersion
  })
})

const currentCode = computed(() => {
  switch (codeTab.value) {
    case 'vue3':
      return generatedCode.value.vue3 || ''
    case 'vue2':
      return generatedCode.value.vue2 || ''
    case 'composable':
      return generatedCode.value.composable || ''
    case 'nuxt':
      return generatedCode.value.nuxt || ''
    case 'types':
      return generatedCode.value.types || ''
    default:
      return ''
  }
})

const previewCode = computed(() => {
  return generatedCode.value.vue3 || ''
})

const editorLanguage = computed(() => {
  switch (codeTab.value) {
    case 'composable':
    case 'types':
      return 'typescript'
    case 'nuxt':
      return 'typescript'
    default:
      return 'vue'
  }
})

const highlightedCode = computed(() => {
  return highlightSyntax(currentCode.value)
})

function highlightSyntax(code: string): string {
  if (!code) return ''

  // First, escape HTML special characters
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Apply syntax highlighting using unique markers first, then replace with span tags
  // This avoids regex conflicts with the HTML we're generating

  // 1. Comments
  result = result.replace(
    /(\/\/.*$)/gm,
    '[[COMMENT_START]]$&[[COMMENT_END]]'
  )

  // 2. Keywords
  result = result.replace(
    /\b(import|from|export|const|let|var|function|return|if|else|async|await|ref|computed|watch|onMounted|onUnmounted|defineComponent|setup)\b/g,
    '[[KEYWORD_START]]$&[[KEYWORD_END]]'
  )

  // 3. Single-quoted strings
  result = result.replace(
    /'([^']*)'/g,
    '[[STRING_START]]$&[[STRING_END]]'
  )

  // 4. Double-quoted strings
  result = result.replace(
    /"([^"]*)"/g,
    '[[STRING_START]]$&[[STRING_END]]'
  )

  // Now replace markers with actual span tags
  result = result
    .replace(/\[\[COMMENT_START\]\]/g, '<span class="token-comment">')
    .replace(/\[\[COMMENT_END\]\]/g, '</span>')
    .replace(/\[\[KEYWORD_START\]\]/g, '<span class="token-keyword">')
    .replace(/\[\[KEYWORD_END\]\]/g, '</span>')
    .replace(/\[\[STRING_START\]\]/g, '<span class="token-string">')
    .replace(/\[\[STRING_END\]\]/g, '</span>')

  // 5. Vue template tags
  result = result.replace(
    /(&lt;\/?)([\w-]+)/g,
    '$1<span class="token-tag">$2</span>'
  )

  // 6. Vue directives
  result = result.replace(
    /\b(v-[\w-]+)\b/g,
    '<span class="token-attr-name">$&</span>'
  )

  return result
}

// Monaco Editor CDN loader
let monacoLoaderPromise: Promise<any> | null = null

function loadMonacoFromCDN(): Promise<any> {
  if (monacoLoaderPromise) return monacoLoaderPromise

  monacoLoaderPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).monaco) {
      resolve((window as any).monaco)
      return
    }

    // Load loader script
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js'
    script.onload = () => {
      const loader = (window as any).require
      loader.config({
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }
      })
      loader(['vs/editor/editor.main'], () => {
        resolve((window as any).monaco)
      })
    }
    script.onerror = reject
    document.head.appendChild(script)
  })

  return monacoLoaderPromise
}

// Monaco Editor integration
async function initMonaco() {
  if (!editorContainer.value) return

  monacoLoading.value = true
  try {
    const monaco = await loadMonacoFromCDN()

    monacoEditor.value = monaco.editor.create(editorContainer.value, {
      value: currentCode.value,
      language: editorLanguage.value,
      theme: 'vs',
      automaticLayout: true,
      fontSize: 13,
      fontFamily: "'SF Mono', Monaco, Consolas, 'Courier New', monospace",
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      readOnly: true,
      folding: true,
      renderLineHighlight: 'line',
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
      },
      padding: { top: 12, bottom: 12 }
    })

    isEditorReady.value = true
  } catch (err) {
    console.warn('Monaco Editor failed to load from CDN, using simple editor:', err)
    useMonaco.value = false
  } finally {
    monacoLoading.value = false
  }
}

function disposeMonaco() {
  if (monacoEditor.value) {
    monacoEditor.value.dispose()
    monacoEditor.value = null
    isEditorReady.value = false
  }
}

// Watch for code changes and update Monaco
watch(currentCode, (newCode) => {
  if (monacoEditor.value && monacoEditor.value.getValue() !== newCode) {
    monacoEditor.value.setValue(newCode)
  }
})

watch(editorLanguage, async (newLang) => {
  if (monacoEditor.value) {
    const model = monacoEditor.value.getModel()
    if (model) {
      const monaco = await loadMonacoFromCDN()
      monaco.editor.setModelLanguage(model, newLang)
    }
  }
})

// Toggle Monaco Editor
watch(useMonaco, async (use) => {
  if (use) {
    await nextTick()
    await initMonaco()
  } else {
    disposeMonaco()
  }
})

onUnmounted(() => {
  disposeMonaco()
})

function copyCode() {
  navigator.clipboard.writeText(currentCode.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function downloadCode() {
  const filename = `${props.directive.name}.${codeTab.value === 'types' ? 'd.ts' : 'vue'}`
  const blob = new Blob([currentCode.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function refreshPreview() {
  iframeKey.value++
}

// Generate preview HTML
const previewHtml = computed(() => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"><\/script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; margin: 0; }
    .demo-container { padding: 20px; border: 1px dashed #ccc; border-radius: 8px; }
    button { padding: 8px 16px; background: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 4px; }
    button:hover { background: #3aa876; }
    input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; margin: 4px; }
    .info { background: #f0f9ff; padding: 12px; border-radius: 4px; margin: 8px 0; font-size: 14px; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    const { createApp, ref, onMounted } = Vue

    const app = createApp({
      template: \`
        <div class="demo-container">
          <h3>v-${props.directive.name} Demo</h3>
          <p class="info">${props.directive.description}</p>
          <div>
            <p><strong>Note:</strong> This is a visual preview. The directive code is shown in the Code tab.</p>
            <p>Copy the generated code and use it in your Vue project.</p>
          </div>
        </div>
      \`
    })

    app.mount('#app')
  <\/script>
</body>
</html>`
})
</script>

<template>
	<div class="code-preview">
		<!-- Code View -->
		<div v-show="mode === 'code'" class="code-view">
			<div class="code-output-header">
				<button
					v-if="directive.supportsVue3"
					class="code-output-tab" :class="[{ active: codeTab === 'vue3' }]"
					@click="codeTab = 'vue3'"
				>
					Vue 3
				</button>
				<button
					v-if="directive.supportsVue2"
					class="code-output-tab" :class="[{ active: codeTab === 'vue2' }]"
					@click="codeTab = 'vue2'"
				>
					Vue 2
				</button>
				<button
					v-if="directive.hasComposable"
					class="code-output-tab" :class="[{ active: codeTab === 'composable' }]"
					@click="codeTab = 'composable'"
				>
					Composable
				</button>
				<button
					class="code-output-tab" :class="[{ active: codeTab === 'nuxt' }]"
					@click="codeTab = 'nuxt'"
				>
					Nuxt
				</button>
				<button
					class="code-output-tab" :class="[{ active: codeTab === 'types' }]"
					@click="codeTab = 'types'"
				>
					Types
				</button>

				<div style="flex: 1"></div>

				<!-- Editor Toggle -->
				<label class="editor-toggle">
					<input type="checkbox" v-model="useMonaco" />
					<span>Monaco</span>
				</label>

				<button class="copy-btn" @click="copyCode">
					<svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
					</svg>
					<svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
					{{ copied ? 'Copied!' : 'Copy' }}
				</button>
				<button class="copy-btn" @click="downloadCode">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					Download
				</button>
			</div>

			<!-- Monaco Editor View -->
			<div v-if="useMonaco" class="code-editor-monaco" ref="editorContainer">
				<div v-if="monacoLoading" class="monaco-loading">
					<span>Loading Editor...</span>
				</div>
			</div>

			<!-- Simple Editor View -->
			<div v-else class="code-editor">
				<pre v-html="highlightedCode"></pre>
			</div>
		</div>

		<!-- Preview View -->
		<div v-show="mode === 'preview'" class="preview-view">
			<div class="preview-toolbar">
				<span class="preview-info">Live Preview</span>
				<button class="copy-btn" @click="refreshPreview">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="23 4 23 10 17 10"></polyline>
						<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
					</svg>
					Refresh
				</button>
			</div>
			<iframe
				:key="iframeKey"
				:srcdoc="previewHtml"
				class="preview-frame"
				sandbox="allow-scripts"
			></iframe>
		</div>

		<!-- Documentation View -->
		<div v-show="mode === 'docs'" class="docs-view">
			<div class="docs-content">
				<h2>v-{{ directive.name }}</h2>
				<p class="docs-description">{{ directive.description }}</p>

				<div v-if="directive.parameters.length > 0" class="docs-section">
					<h3>Parameters</h3>
					<ul class="docs-params">
						<li v-for="param in directive.parameters" :key="param.name">
							<code>{{ param.name }}</code>
							<span class="param-type">{{ param.type }}</span>
							<span v-if="param.required" class="param-required">required</span>
							<p v-if="param.description">{{ param.description }}</p>
							<p v-if="param.default !== undefined" class="param-default">
								Default: <code>{{ param.default }}</code>
							</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.code-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.code-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.code-output-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.code-output-tab {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  background: transparent;
  border: none;
  transition: all 0.2s;
}

.code-output-tab:hover {
  background: rgba(0, 0, 0, 0.04);
}

.code-output-tab.active {
  background: var(--primary-color);
  color: white;
}

.editor-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 12px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}

.editor-toggle input {
  cursor: pointer;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s;
  color: var(--text-color);
}

.copy-btn:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.code-editor {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: var(--code-bg);
}

.code-editor pre {
  font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

/* Syntax highlighting tokens for v-html content */
.code-editor :deep(.token-keyword) {
  color: #d73a49;
  font-weight: 500;
}

.code-editor :deep(.token-string) {
  color: #032f62;
}

.code-editor :deep(.token-comment) {
  color: #6a737d;
  font-style: italic;
}

.code-editor :deep(.token-tag) {
  color: #22863a;
}

.code-editor :deep(.token-attr-name) {
  color: #6f42c1;
}

.code-editor-monaco {
  flex: 1;
  min-height: 300px;
  position: relative;
}

.monaco-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--code-bg);
  z-index: 10;
}

.monaco-loading span {
  font-size: 14px;
  color: var(--text-secondary);
}

.preview-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.preview-info {
  font-size: 12px;
  color: var(--text-secondary);
}

.preview-frame {
  flex: 1;
  border: none;
  background: white;
}

.docs-view {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.docs-content h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
}

.docs-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.6;
}

.docs-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-color);
}

.docs-params {
  list-style: none;
  padding: 0;
}

.docs-params li {
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 8px;
}

.docs-params code {
  background: var(--code-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 13px;
  color: var(--primary-color);
}

.param-type {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  background: rgba(66, 184, 131, 0.1);
  color: var(--primary-color);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.param-required {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  background: rgba(207, 34, 46, 0.1);
  color: var(--error-color);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.docs-params li p {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.param-default {
  color: var(--text-secondary);
}

.param-default code {
  background: var(--bg-color);
  color: var(--text-color);
}
</style>