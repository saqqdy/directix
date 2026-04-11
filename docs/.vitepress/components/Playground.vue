<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  directive?: string
  showPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  directive: '',
  showPreview: true
})

// Available directives
const directives = [
  { name: 'click-outside', category: 'Event', description: 'Detect clicks outside an element' },
  { name: 'debounce', category: 'Event', description: 'Debounce function execution' },
  { name: 'throttle', category: 'Event', description: 'Throttle function execution' },
  { name: 'long-press', category: 'Event', description: 'Detect long press gestures' },
  { name: 'hover', category: 'Event', description: 'Track hover state' },
  { name: 'hotkey', category: 'Event', description: 'Bind keyboard shortcuts' },
  { name: 'click-delay', category: 'Event', description: 'Prevent rapid clicks' },
  { name: 'copy', category: 'Form', description: 'Copy text to clipboard' },
  { name: 'focus', category: 'Form', description: 'Auto-focus element' },
  { name: 'mask', category: 'Form', description: 'Input masking' },
  { name: 'trim', category: 'Form', description: 'Trim whitespace' },
  { name: 'uppercase', category: 'Format', description: 'Convert to uppercase' },
  { name: 'lowercase', category: 'Format', description: 'Convert to lowercase' },
  { name: 'capitalcase', category: 'Format', description: 'Capitalize first letter' },
  { name: 'number', category: 'Format', description: 'Format numbers' },
  { name: 'money', category: 'Format', description: 'Format currency' },
  { name: 'truncate', category: 'Format', description: 'Truncate text' },
  { name: 'ellipsis', category: 'Format', description: 'Multi-line ellipsis' },
  { name: 'lazy', category: 'Visibility', description: 'Lazy load images' },
  { name: 'intersect', category: 'Visibility', description: 'Intersection observer' },
  { name: 'visible', category: 'Visibility', description: 'Control visibility' },
  { name: 'loading', category: 'Visibility', description: 'Loading state' },
  { name: 'scroll', category: 'Scroll', description: 'Scroll position tracking' },
  { name: 'infinite-scroll', category: 'Scroll', description: 'Infinite scrolling' },
  { name: 'sticky', category: 'Scroll', description: 'Sticky positioning' },
  { name: 'permission', category: 'Security', description: 'Permission control' },
  { name: 'sanitize', category: 'Security', description: 'Sanitize HTML' },
  { name: 'ripple', category: 'UI', description: 'Material ripple effect' },
  { name: 'click-wave', category: 'UI', description: 'Click wave animation' },
  { name: 'tooltip', category: 'UI', description: 'Tooltip display' },
  { name: 'draggable', category: 'UI', description: 'Make elements draggable' },
  { name: 'context-menu', category: 'UI', description: 'Custom context menu' },
  { name: 'fullscreen', category: 'UI', description: 'Fullscreen toggle' },
  { name: 'skeleton', category: 'UI', description: 'Skeleton loading' },
  { name: 'blur', category: 'UI', description: 'Blur effect' },
  { name: 'fade', category: 'UI', description: 'Fade transitions' },
  { name: 'counter', category: 'Data', description: 'Animated number counter' },
  { name: 'progress', category: 'Data', description: 'Progress bar' },
  { name: 'countdown', category: 'Data', description: 'Countdown timer' },
  { name: 'watermark', category: 'Utility', description: 'Add watermark' },
  { name: 'print', category: 'Utility', description: 'Print content' },
  { name: 'export', category: 'Utility', description: 'Export data' },
  { name: 'highlight', category: 'Utility', description: 'Highlight text' }
]

const categories = ['Event', 'Form', 'Format', 'Visibility', 'Scroll', 'Security', 'UI', 'Data', 'Utility']

const selectedDirective = ref(props.directive || 'debounce')
const vueVersion = ref<'vue2' | 'vue3'>('vue3')
const activeTab = ref<'template' | 'composable'>('template')
const copied = ref(false)

const currentDirective = computed(() =>
  directives.find(d => d.name === selectedDirective.value)
)

const generatedCode = computed(() => {
  const name = selectedDirective.value
  const version = vueVersion.value

  if (activeTab.value === 'composable') {
    return generateComposableCode(name)
  }

  return generateTemplateCode(name, version)
})

function generateTemplateCode(name: string, version: 'vue2' | 'vue3'): string {
  const directiveName = name
  const scriptOpen = '<' + 'script setup lang="ts">'
  const scriptOpenVue2 = '<' + 'script>';
  const scriptClose = '<' + '/script>';

  if (version === 'vue3') {
    return `<template>
  <div v-${directiveName}="options">
    <!-- Your content here -->
  </div>
</template>

${scriptOpen}
import { ref } from 'vue'

// Configure directive options
const options = {
  // Add your configuration here
}
${scriptClose}`
  }

  return `<template>
  <div v-${directiveName}="options">
    <!-- Your content here -->
  </div>
</template>

${scriptOpenVue2}
export default {
  data() {
    return {
      options: {
        // Add your configuration here
      }
    }
  }
}
${scriptClose}`
}

function generateComposableCode(name: string): string {
  const composableName = `use${name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`

  return `import { ${composableName} } from 'directix'

const result = ${composableName}({
  // Add your configuration here
})

// Available methods and state
console.log(result)`
}

function copyCode() {
  navigator.clipboard.writeText(generatedCode.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
	<div class="directive-configurator">
		<div class="config-header">
			<span class="config-title">Quick Code Generator</span>
			<span class="config-desc" v-if="currentDirective">v-{{ currentDirective.name }} - {{ currentDirective.description }}</span>
		</div>

		<div class="config-toolbar">
			<select v-model="selectedDirective" class="directive-select">
				<optgroup v-for="cat in categories" :key="cat" :label="cat">
					<option
						v-for="d in directives.filter(d => d.category === cat)"
						:key="d.name"
						:value="d.name"
					>
						v-{{ d.name }}
					</option>
				</optgroup>
			</select>

			<div class="toolbar-group">
				<button
					class="toolbar-btn"
					:class="{ active: vueVersion === 'vue2' }"
					@click="vueVersion = 'vue2'"
				>
					Vue 2
				</button>
				<button
					class="toolbar-btn"
					:class="{ active: vueVersion === 'vue3' }"
					@click="vueVersion = 'vue3'"
				>
					Vue 3
				</button>
			</div>

			<div class="toolbar-group">
				<button
					class="toolbar-btn"
					:class="{ active: activeTab === 'template' }"
					@click="activeTab = 'template'"
				>
					Template
				</button>
				<button
					class="toolbar-btn"
					:class="{ active: activeTab === 'composable' }"
					@click="activeTab = 'composable'"
				>
					Composable
				</button>
			</div>

			<button class="copy-btn" @click="copyCode">
				{{ copied ? 'Copied' : 'Copy Code' }}
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
  gap: 16px;
}

.config-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.config-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
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

.directive-select {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  font-size: 12px;
  cursor: pointer;
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