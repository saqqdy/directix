<script setup lang="ts">
import { ref, computed, watch, shallowRef, onMounted, onUnmounted } from 'vue'
import { generateCode } from '../utils/code-generator'
import type { DirectiveConfig, GeneratedCode } from '../types'

const props = defineProps<{
  directive: DirectiveConfig
  values: Record<string, any>
  vueVersion: 'vue2' | 'vue3'
}>()

const activeTab = ref<'code' | 'preview'>('code')
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
  return code
    .replace(/\b(import|from|export|const|let|var|function|return|if|else|async|await)\b/g, '<span class="token-keyword">$1</span>')
    .replace(/'([^']*)'/g, '<span class="token-string">\'$1\'</span>')
    .replace(/"([^"]*)"/g, '<span class="token-string">"$1"</span>')
    .replace(/(\/\/.*$)/gm, '<span class="token-comment">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>')
    .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="token-tag">$2</span>')
    .replace(/\b(v-[\w-]+|@[\w-]+|:[\w-]+)\b/g, '<span class="token-attr-name">$1</span>')
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
		<!-- Mode Tabs -->
		<div class="mode-tabs">
			<button class="mode-tab" :class="[{ active: activeTab === 'code' }]" @click="activeTab = 'code'">
				Code
			</button>
			<button class="mode-tab" :class="[{ active: activeTab === 'preview' }]" @click="activeTab = 'preview'">
				Preview
			</button>
		</div>

		<!-- Code View -->
		<div v-show="activeTab === 'code'" class="code-view">
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
					{{ copied ? 'Copied!' : 'Copy' }}
				</button>
				<button class="copy-btn" @click="downloadCode">Download</button>
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
		<div v-show="activeTab === 'preview'" class="preview-view">
			<div class="preview-toolbar">
				<span class="preview-info">Live Preview</span>
				<button class="copy-btn" @click="refreshPreview">Refresh</button>
			</div>
			<iframe
				:key="iframeKey"
				:srcdoc="previewHtml"
				class="preview-frame"
				sandbox="allow-scripts"
			></iframe>
		</div>
	</div>
</template>

<style scoped>
.code-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mode-tabs {
  display: flex;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.mode-tab {
  padding: 10px 20px;
  background: transparent;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.mode-tab:hover {
  color: var(--text-color);
}

.mode-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
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
  padding: 4px 12px;
  font-size: 12px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: var(--bg-secondary);
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
</style>
