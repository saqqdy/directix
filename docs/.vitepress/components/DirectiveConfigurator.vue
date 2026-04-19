<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
	name: string
	description?: string
}

const props = defineProps<Props>()

// Default parameters based on directive
const directiveDefaults: Record<string, Record<string, any>> = {
	// Event
	'click-outside': { handler: 'handleClickOutside', capture: false, disabled: false },
	'debounce': { handler: 'handleInput', wait: 300, leading: false, trailing: true },
	'throttle': { handler: 'handleScroll', wait: 300, leading: true, trailing: true },
	'long-press': { handler: 'handleLongPress', duration: 500, disabled: false },
	'hover': { onEnter: 'handleEnter', onLeave: 'handleLeave', delay: 0 },
	'hotkey': { key: 'ctrl+s', handler: 'handleSave', prevent: true },
	'click-delay': { delay: 300, disabled: false },
	'click-wave': { color: 'rgba(0, 0, 0, 0.1)', duration: 600 },
	'context-menu': { items: 'menuItems', disabled: false },
	'copy': { value: 'Text to copy', handler: 'onCopy' },
	// Visibility
	'lazy': { src: 'image.jpg', threshold: 0.1, rootMargin: '0px' },
	'intersect': { handler: 'handleIntersect', threshold: 0.5, rootMargin: '0px' },
	'visible': { value: true, transition: 'fade' },
	'loading': { value: true, text: 'Loading...', background: 'rgba(255,255,255,0.8)' },
	'blur': { value: true, amount: 10 },
	'skeleton': { loading: true, animation: 'wave', rows: 3 },
	// Scroll
	'scroll': { handler: 'handleScroll', throttle: 100, passive: true },
	'infinite-scroll': { handler: 'loadMore', distance: 100, disabled: false },
	'sticky': { top: 0, zIndex: 100 },
	'parallax': { speed: 0.5, direction: 'vertical' },
	'progress': { height: 4, color: '#42b883', position: 'top' },
	// Interaction
	'ripple': { color: 'currentColor', duration: 600, disabled: false },
	// Format
	'truncate': { length: 100, suffix: '...' },
	'ellipsis': { lines: 2, suffix: '...' },
	'uppercase': {},
	'lowercase': {},
	'capitalcase': {},
	'number': { decimals: 0, separator: ',', prefix: '' },
	'money': { currency: '¥', decimals: 2, separator: ',' },
	'trim': { position: 'both' },
	// UI
	'tooltip': { content: 'Tooltip text', placement: 'top', delay: 0 },
	'draggable': { axis: 'both', constrain: false, handle: '' },
	'image-preview': { src: 'image.jpg', list: 'imageList' },
	'countdown': { time: 3600, format: 'mm:ss', onEnd: 'handleEnd' },
	'watermark': { content: 'Confidential', fontSize: 16, color: 'rgba(0,0,0,0.1)' },
	'print': { title: 'Document', onBefore: 'beforePrint', onAfter: 'afterPrint' },
	// Form
	'focus': { delay: 0, disabled: false },
	'mask': { mask: '####-####-####', placeholder: '_' },
	// Security
	'permission': { value: 'admin', action: 'remove' },
	'sanitize': { allowedTags: ['b', 'i', 'a', 'p'] },
	// Observer
	'resize': { handler: 'handleResize', debounce: 100 },
	'mutation': { handler: 'handleMutation', attributes: true, childList: true },
	// Performance
	'virtual-list': { items: 'listItems', itemSize: 40, buffer: 5 },
	// Mobile
	'touch': { onTouch: 'handleTouch', swipeThreshold: 50 },
	'swipe': { onSwipe: 'handleSwipe', threshold: 50 },
	'pan': { onPan: 'handlePan', direction: 'all' },
	'pinch': { onPinch: 'handlePinch', minScale: 0.5, maxScale: 3 },
	'rotate-gesture': { onRotate: 'handleRotate' },
	'pull-refresh': { onRefresh: 'handleRefresh', distance: 80 },
	// Animation
	'fade': { value: true, duration: 300, delay: 0 },
	'typewriter': { speed: 50, delay: 0, cursor: true },
	'counter': { value: 1000, duration: 2000, decimals: 0 },
	'lottie': { path: 'animation.json', loop: true, autoplay: true },
	// Data
	'export': { type: 'csv', filename: 'export', data: 'exportData' },
	'highlight': { keyword: 'important', color: '#ffff00', className: 'highlight' },
	// Media
	'fullscreen': { value: false, onChange: 'handleChange' },
	// Input
	'emoji': { mode: 'filter', replacement: '' },
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

function formatOptions(options: Record<string, any>): string {
	return Object.entries(options)
		.filter(([, v]) => v !== undefined && v !== '')
		.map(([k, v]) => {
			if (typeof v === 'string') return `${k}: '${v}'`
			if (Array.isArray(v)) return `${k}: ${JSON.stringify(v)}`
			if (typeof v === 'object') return `${k}: ${JSON.stringify(v)}`
			return `${k}: ${v}`
		})
		.join(', ')
}

function generateTemplate(name: string, options: Record<string, any>, version: 'vue2' | 'vue3'): string {
	const bindingStr = formatOptions(options)
	const binding = bindingStr ? `{\n    ${bindingStr}\n  }` : ''

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

${binding ? `// Configure your options here
const options = {
  ${bindingStr}
}` : '// No configuration needed'}
${scriptClose}`
	}

	return `<template>
  <div v-${name}${binding ? `="options"` : ''}>
    <!-- ${props.description || props.name} directive -->
  </div>
</template>

${scriptOpen}
export default {
  data() {
    return {
      ${binding ? `options: {
        ${bindingStr}
      }` : '// No configuration needed'}
    }
  }
}
${scriptClose}`
}

function generateComposable(name: string, options: Record<string, any>): string {
	const composableName = 'use' + name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')

	const paramsStr = formatOptions(options)

	return `import { ${composableName} } from 'directix'

${paramsStr ? `const result = ${composableName}({
  ${paramsStr}
})` : `const result = ${composableName}()`}

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
					Directive
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
