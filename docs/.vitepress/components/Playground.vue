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
	<div class="playground-widget">
		<div class="playground-toolbar">
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
					class="toggle-btn" :class="[{ active: vueVersion === 'vue2' }]"
					@click="vueVersion = 'vue2'"
				>
					Vue 2
				</button>
				<button
					class="toggle-btn" :class="[{ active: vueVersion === 'vue3' }]"
					@click="vueVersion = 'vue3'"
				>
					Vue 3
				</button>
			</div>

			<div class="toolbar-group">
				<button
					class="toggle-btn" :class="[{ active: activeTab === 'template' }]"
					@click="activeTab = 'template'"
				>
					Template
				</button>
				<button
					class="toggle-btn" :class="[{ active: activeTab === 'composable' }]"
					@click="activeTab = 'composable'"
				>
					Composable
				</button>
			</div>
		</div>

		<div class="playground-description" v-if="currentDirective">
			<strong>v-{{ currentDirective.name }}</strong> - {{ currentDirective.description }}
		</div>

		<div class="playground-code">
			<div class="code-header">
				<span class="code-filename">
					{{ activeTab === 'composable' ? 'composable.ts' : 'Component.vue' }}
				</span>
				<button class="copy-button" @click="copyCode">
					{{ copied ? '✓ Copied' : 'Copy' }}
				</button>
			</div>
			<pre class="code-content"><code>{{ generatedCode }}</code></pre>
		</div>
	</div>
</template>

<style scoped>
.playground-widget {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.playground-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.directive-select {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  font-size: 14px;
  cursor: pointer;
}

.toolbar-group {
  display: flex;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}

.toggle-btn {
  padding: 8px 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: var(--vp-c-bg-soft);
}

.toggle-btn.active {
  background: var(--vp-c-brand-1);
  color: white;
}

.playground-description {
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 14px;
}

.playground-code {
  position: relative;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--vp-code-block-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.code-filename {
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-family: monospace;
}

.copy-button {
  padding: 4px 12px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s;
}

.copy-button:hover {
  background: var(--vp-c-bg-soft);
}

.code-content {
  margin: 0;
  padding: 16px;
  background: var(--vp-code-block-bg);
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.6;
}

.code-content code {
  color: var(--vp-c-text-1);
}
</style>
