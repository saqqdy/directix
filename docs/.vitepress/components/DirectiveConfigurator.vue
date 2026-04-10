<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  name: string
  description?: string
}

const props = defineProps<Props>()

// Default parameters based on directive
const directiveDefaults: Record<string, Record<string, any>> = {
  'click-outside': { handler: 'handleClickOutside', capture: true, disabled: false },
  'debounce': { wait: 300, leading: false, trailing: true },
  'throttle': { wait: 300, leading: true, trailing: true },
  'long-press': { duration: 500, disabled: false },
  'hover': { enterDelay: 0, leaveDelay: 0 },
  'hotkey': { key: 'ctrl+s', prevent: true },
  'click-delay': { delay: 300 },
  'copy': { value: 'Text to copy' },
  'focus': { delay: 0, disabled: false },
  'mask': { pattern: '####-####-####' },
  'trim': { position: 'both' },
  'lazy': { src: 'image.jpg', preload: 100 },
  'intersect': { threshold: 0.5 },
  'visible': { value: true },
  'loading': { value: false, text: 'Loading...' },
  'scroll': { throttle: 100 },
  'infinite-scroll': { distance: 100, disabled: false },
  'sticky': { top: 0, zIndex: 100 },
  'permission': { value: 'admin', action: 'remove' },
  'sanitize': { allowedTags: ['b', 'i', 'a'] },
  'ripple': { color: 'currentColor', duration: 600 },
  'click-wave': { color: 'rgba(0, 0, 0, 0.1)' },
  'tooltip': { content: 'Tooltip text', placement: 'top' },
  'draggable': { axis: 'both' },
  'context-menu': { items: 'menuItems' },
  'fullscreen': { value: false },
  'skeleton': { loading: true, animation: 'wave' },
  'blur': { value: true, amount: 10 },
  'fade': { value: true, duration: 300 },
  'counter': { value: 1000, duration: 2000 },
  'progress': { value: 75 },
  'countdown': { time: 3600, format: 'mm:ss' },
  'watermark': { content: 'Confidential', fontSize: 16 },
  'print': {},
  'export': { format: 'csv', filename: 'export' },
  'highlight': { keyword: 'important', color: '#ffff00' },
  'uppercase': {},
  'lowercase': {},
  'capitalcase': {},
  'number': { decimals: 0, separator: ',' },
  'money': { currency: '$', decimals: 2 },
  'truncate': { length: 100, suffix: '...' },
  'ellipsis': { lines: 1 }
}

const vueVersion = ref<'vue2' | 'vue3'>('vue3')
const outputFormat = ref<'template' | 'composable'>('template')
const copied = ref(false)

const params = computed(() => {
  return directiveDefaults[props.name] || {}
})

const generatedCode = computed(() => {
  const name = props.name
  const p = params.value

  if (outputFormat.value === 'composable') {
    return generateComposable(name, p)
  }

  return generateTemplate(name, p, vueVersion.value)
})

function generateTemplate(name: string, params: Record<string, any>, version: 'vue2' | 'vue3'): string {
  const bindingStr = Object.entries(params)
    .filter(([k, v]) => v !== undefined)
    .map(([k, v]) => {
      if (typeof v === 'string') return `${k}: '${v}'`
      if (typeof v === 'boolean') return `${k}: ${v}`
      return `${k}: ${v}`
    })
    .join(', ')

  const binding = bindingStr ? `{ ${bindingStr} }` : ''

  const scriptOpen = '<' + 'script' + (version === 'vue3' ? ' setup lang="ts"' : '') + '>'
  const scriptClose = '<' + '/script>'

  if (version === 'vue3') {
    return `<template>
  <div v-${name}${binding ? `="${binding}"` : ''}>
    <!-- ${props.description || props.name} directive -->
  </div>
</template>

${scriptOpen}
import { ref } from 'vue'

// Configure your options here
const options = ${binding || '{}'}
${scriptClose}`
  }

  return `<template>
  <div v-${name}${binding ? `="${binding}"` : ''}>
    <!-- ${props.description || props.name} directive -->
  </div>
</template>

${scriptOpen}
export default {
  data() {
    return {
      options: ${binding || '{}'}
    }
  }
}
${scriptClose}`
}

function generateComposable(name: string, params: Record<string, any>): string {
  const composableName = 'use' + name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')

  const paramsStr = Object.entries(params)
    .filter(([k, v]) => v !== undefined)
    .map(([k, v]) => {
      if (typeof v === 'string') return `  ${k}: '${v}'`
      return `  ${k}: ${v}`
    })
    .join(',\n')

  return `import { ${composableName} } from 'directix'

const result = ${composableName}({
${paramsStr}
})

// Available methods depend on the directive
console.log(result)
`
}

function copyCode() {
  navigator.clipboard.writeText(generatedCode.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function openFullPlayground() {
  window.open('/playground?directive=' + props.name, '_blank')
}
</script>

<template>
	<div class="directive-configurator">
		<div class="config-header">
			<span class="config-title">Quick Code Generator</span>
			<div class="config-actions">
				<button class="config-btn" @click="openFullPlayground">
					Open in Playground
				</button>
			</div>
		</div>

		<div class="config-toolbar">
			<div class="toolbar-group">
				<button
					class="toolbar-btn" :class="[{ active: vueVersion === 'vue2' }]"
					@click="vueVersion = 'vue2'"
				>
					Vue 2
				</button>
				<button
					class="toolbar-btn" :class="[{ active: vueVersion === 'vue3' }]"
					@click="vueVersion = 'vue3'"
				>
					Vue 3
				</button>
			</div>

			<div class="toolbar-group">
				<button
					class="toolbar-btn" :class="[{ active: outputFormat === 'template' }]"
					@click="outputFormat = 'template'"
				>
					Template
				</button>
				<button
					class="toolbar-btn" :class="[{ active: outputFormat === 'composable' }]"
					@click="outputFormat = 'composable'"
				>
					Composable
				</button>
			</div>

			<button class="copy-btn" @click="copyCode">
				{{ copied ? '✓ Copied' : 'Copy Code' }}
			</button>
		</div>

		<div class="code-output">
			<pre><code>{{ generatedCode }}</code></pre>
		</div>
	</div>
</template>

<style scoped>
.directive-configurator {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.config-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.config-btn {
  padding: 6px 12px;
  font-size: 12px;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.config-btn:hover {
  opacity: 0.9;
}

.config-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  overflow: hidden;
}

.toolbar-btn {
  padding: 6px 10px;
  font-size: 12px;
  background: transparent;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: var(--vp-c-bg-soft);
}

.toolbar-btn.active {
  background: var(--vp-c-brand-1);
  color: white;
}

.copy-btn {
  padding: 6px 12px;
  font-size: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;
}

.copy-btn:hover {
  background: var(--vp-c-bg-soft);
}

.code-output {
  padding: 16px;
  background: var(--vp-code-block-bg);
  overflow-x: auto;
}

.code-output pre {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.6;
}

.code-output code {
  color: var(--vp-c-text-1);
}
</style>
