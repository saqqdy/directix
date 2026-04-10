<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  language?: string
  readOnly?: boolean
  theme?: 'vs' | 'vs-dark' | 'hc-black'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const container = ref<HTMLDivElement>()
const loading = ref(true)
const error = ref<string | null>(null)

let editor: any = null
let monaco: any = null

// 动态加载 Monaco Editor (CDN)
async function loadMonaco(): Promise<any> {
  if ((window as any).monaco) {
    return (window as any).monaco
  }

  // 加载 Monaco Editor CDN
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js'

  return new Promise((resolve, reject) => {
    script.onload = () => {
      const loader = (window as any).require
      loader.config({
        paths: {
          vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
        }
      })

      loader(['vs/editor/editor.main'], (monaco: any) => {
        ;(window as any).monaco = monaco
        resolve(monaco)
      }, (err: any) => {
        reject(err)
      })
    }
    script.onerror = () => reject(new Error('Failed to load Monaco Editor'))
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  if (!container.value) return

  try {
    loading.value = true
    monaco = await loadMonaco()

    await nextTick()

    editor = monaco.editor.create(container.value, {
      value: props.modelValue,
      language: props.language || 'vue',
      theme: props.theme || 'vs',
      readOnly: props.readOnly || false,
      automaticLayout: true,
      fontSize: 13,
      fontFamily: "'SF Mono', Monaco, Consolas, 'Courier New', monospace",
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      renderLineHighlight: 'line',
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
      },
      padding: { top: 12, bottom: 12 }
    })

    editor.onDidChangeModelContent(() => {
      const value = editor?.getValue() || ''
      emit('update:modelValue', value)
      emit('change', value)
    })

    loading.value = false
  } catch (e: any) {
    console.error('Failed to initialize Monaco Editor:', e)
    error.value = e.message || 'Failed to load editor'
    loading.value = false
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue)
  }
})

watch(() => props.language, (newLang) => {
  if (editor && monaco) {
    monaco.editor.setModelLanguage(editor.getModel()!, newLang || 'vue')
  }
})

watch(() => props.theme, (newTheme) => {
  if (editor && monaco) {
    monaco.editor.setTheme(newTheme || 'vs')
  }
})

onUnmounted(() => {
  editor?.dispose()
})

function focus() {
  editor?.focus()
}

function getValue(): string {
  return editor?.getValue() || ''
}

function setValue(value: string) {
  editor?.setValue(value)
}

defineExpose({ focus, getValue, setValue })
</script>

<template>
	<div class="editor-wrapper">
		<div v-if="loading" class="editor-loading">
			<div class="loading-spinner"></div>
			<span>Loading editor...</span>
		</div>
		<div v-else-if="error" class="editor-error">
			<span>⚠️ {{ error }}</span>
		</div>
		<div ref="container" class="monaco-editor-container" :class="{ hidden: loading || error }"></div>
	</div>
</template>

<style scoped>
.editor-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.monaco-editor-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.monaco-editor-container.hidden {
  visibility: hidden;
}

.editor-loading,
.editor-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #666;
  gap: 12px;
}

.editor-error {
  color: #dc3545;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e0e0e0;
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
