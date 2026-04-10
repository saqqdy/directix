<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

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
let editor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(async () => {
  if (!container.value) return

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
})

watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue)
  }
})

watch(() => props.language, (newLang) => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel()!, newLang || 'vue')
  }
})

watch(() => props.theme, (newTheme) => {
  if (editor) {
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
	<div ref="container" class="monaco-editor-container"></div>
</template>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style>
