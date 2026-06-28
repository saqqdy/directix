<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
	directive?: string
	showPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	directive: '',
	showPreview: true,
})

// Available directives with detailed options
const directives = [
	// Event
	{ name: 'click-outside', category: 'Event', description: 'Detect clicks outside an element', options: { handler: 'handleClickOutside', capture: false, disabled: false } },
	{ name: 'debounce', category: 'Event', description: 'Debounce function execution', options: { handler: 'handleInput', wait: 300, leading: false, trailing: true } },
	{ name: 'throttle', category: 'Event', description: 'Throttle function execution', options: { handler: 'handleScroll', wait: 300, leading: true, trailing: true } },
	{ name: 'long-press', category: 'Event', description: 'Detect long press gestures', options: { handler: 'handleLongPress', duration: 500, disabled: false } },
	{ name: 'hover', category: 'Event', description: 'Track hover state', options: { onEnter: 'handleEnter', onLeave: 'handleLeave', delay: 0 } },
	{ name: 'hotkey', category: 'Event', description: 'Bind keyboard shortcuts', options: { key: 'ctrl+s', handler: 'handleSave', prevent: true } },
	{ name: 'click-delay', category: 'Event', description: 'Prevent rapid clicks', options: { delay: 300, disabled: false } },
	{ name: 'click-wave', category: 'Event', description: 'Click wave animation', options: { color: 'rgba(0, 0, 0, 0.1)', duration: 600 } },
	{ name: 'context-menu', category: 'Event', description: 'Custom context menu', options: { items: 'menuItems', disabled: false } },
	{ name: 'copy', category: 'Event', description: 'Copy text to clipboard', options: { value: 'Text to copy', handler: 'onCopy' } },

	// Visibility
	{ name: 'lazy', category: 'Visibility', description: 'Lazy load images', options: { src: 'image.jpg', threshold: 0.1, rootMargin: '0px' } },
	{ name: 'intersect', category: 'Visibility', description: 'Intersection observer', options: { handler: 'handleIntersect', threshold: 0.5, rootMargin: '0px' } },
	{ name: 'visible', category: 'Visibility', description: 'Control visibility', options: { value: true, transition: 'fade' } },
	{ name: 'loading', category: 'Visibility', description: 'Loading state overlay', options: { value: true, text: 'Loading...', background: 'rgba(255,255,255,0.8)' } },
	{ name: 'blur', category: 'Visibility', description: 'Blur effect overlay', options: { value: true, amount: 10 } },
	{ name: 'skeleton', category: 'Visibility', description: 'Skeleton loading', options: { loading: true, animation: 'wave', rows: 3 } },

	// Scroll
	{ name: 'scroll', category: 'Scroll', description: 'Scroll position tracking', options: { handler: 'handleScroll', throttle: 100, passive: true } },
	{ name: 'infinite-scroll', category: 'Scroll', description: 'Infinite scrolling', options: { handler: 'loadMore', distance: 100, disabled: false } },
	{ name: 'sticky', category: 'Scroll', description: 'Sticky positioning', options: { top: 0, zIndex: 100 } },
	{ name: 'parallax', category: 'Scroll', description: 'Parallax scrolling effect', options: { speed: 0.5, direction: 'vertical' } },
	{ name: 'progress', category: 'Scroll', description: 'Scroll progress bar', options: { height: 4, color: '#42b883', position: 'top' } },

	// Interaction
	{ name: 'ripple', category: 'Interaction', description: 'Material ripple effect', options: { color: 'currentColor', duration: 600, disabled: false } },

	// Format
	{ name: 'truncate', category: 'Format', description: 'Truncate text', options: { length: 100, suffix: '...' } },
	{ name: 'ellipsis', category: 'Format', description: 'Multi-line ellipsis', options: { lines: 2, suffix: '...' } },
	{ name: 'uppercase', category: 'Format', description: 'Convert to uppercase', options: {} },
	{ name: 'lowercase', category: 'Format', description: 'Convert to lowercase', options: {} },
	{ name: 'capitalcase', category: 'Format', description: 'Capitalize words', options: {} },
	{ name: 'number', category: 'Format', description: 'Format numbers', options: { decimals: 0, separator: ',', prefix: '' } },
	{ name: 'money', category: 'Format', description: 'Format currency', options: { currency: '¥', decimals: 2, separator: ',' } },
	{ name: 'trim', category: 'Format', description: 'Trim whitespace', options: { position: 'both' } },

	// UI
	{ name: 'tooltip', category: 'UI', description: 'Tooltip display', options: { content: 'Tooltip text', placement: 'top', delay: 0 } },
	{ name: 'draggable', category: 'UI', description: 'Make elements draggable', options: { axis: 'both', constrain: false, handle: '' } },
	{ name: 'image-preview', category: 'UI', description: 'Image preview modal', options: { src: 'image.jpg', list: 'imageList' } },
	{ name: 'countdown', category: 'UI', description: 'Countdown timer', options: { time: 3600, format: 'mm:ss', onEnd: 'handleEnd' } },
	{ name: 'watermark', category: 'UI', description: 'Add watermark', options: { content: 'Confidential', fontSize: 16, color: 'rgba(0,0,0,0.1)' } },
	{ name: 'print', category: 'UI', description: 'Print content', options: { title: 'Document', onBefore: 'beforePrint', onAfter: 'afterPrint' } },

	// Form
	{ name: 'focus', category: 'Form', description: 'Auto-focus element', options: { delay: 0, disabled: false } },
	{ name: 'mask', category: 'Form', description: 'Input masking', options: { mask: '####-####-####', placeholder: '_' } },

	// Security
	{ name: 'permission', category: 'Security', description: 'Permission control', options: { value: 'admin', action: 'remove' } },
	{ name: 'sanitize', category: 'Security', description: 'Sanitize HTML', options: { allowedTags: ['b', 'i', 'a', 'p'] } },

	// Observer
	{ name: 'resize', category: 'Observer', description: 'Resize observer', options: { handler: 'handleResize', debounce: 100 } },
	{ name: 'mutation', category: 'Observer', description: 'Mutation observer', options: { handler: 'handleMutation', attributes: true, childList: true } },

	// Performance
	{ name: 'virtual-list', category: 'Performance', description: 'Virtual list rendering', options: { items: 'listItems', itemSize: 40, buffer: 5 } },

	// Mobile
	{ name: 'touch', category: 'Mobile', description: 'Touch gesture detection', options: { onTouch: 'handleTouch', swipeThreshold: 50 } },
	{ name: 'swipe', category: 'Mobile', description: 'Swipe detection', options: { onSwipe: 'handleSwipe', threshold: 50 } },
	{ name: 'pan', category: 'Mobile', description: 'Pan gesture', options: { onPan: 'handlePan', direction: 'all' } },
	{ name: 'pinch', category: 'Mobile', description: 'Pinch to zoom', options: { onPinch: 'handlePinch', minScale: 0.5, maxScale: 3 } },
	{ name: 'rotate-gesture', category: 'Mobile', description: 'Rotation gesture', options: { onRotate: 'handleRotate' } },
	{ name: 'pull-refresh', category: 'Mobile', description: 'Pull to refresh', options: { onRefresh: 'handleRefresh', distance: 80 } },

	// Animation
	{ name: 'fade', category: 'Animation', description: 'Fade in/out', options: { value: true, duration: 300, delay: 0 } },
	{ name: 'typewriter', category: 'Animation', description: 'Typewriter effect', options: { speed: 50, delay: 0, cursor: true } },
	{ name: 'counter', category: 'Animation', description: 'Animated number counter', options: { value: 1000, duration: 2000, decimals: 0 } },
	{ name: 'lottie', category: 'Animation', description: 'Lottie animations', options: { path: 'animation.json', loop: true, autoplay: true } },

	// Data
	{ name: 'export', category: 'Data', description: 'Export data', options: { type: 'csv', filename: 'export', data: 'exportData' } },
	{ name: 'highlight', category: 'Data', description: 'Highlight keywords', options: { keyword: 'important', color: '#ffff00', className: 'highlight' } },

	// Media
	{ name: 'fullscreen', category: 'Media', description: 'Fullscreen toggle', options: { value: false, onChange: 'handleChange' } },

	// Input
	{ name: 'emoji', category: 'Input', description: 'Emoji filter', options: { mode: 'filter', replacement: '' } },
]

const categories = ['Event', 'Visibility', 'Scroll', 'Interaction', 'Format', 'UI', 'Form', 'Security', 'Observer', 'Performance', 'Mobile', 'Animation', 'Data', 'Media', 'Input']

const selectedDirective = ref(props.directive || 'debounce')
const vueVersion = ref<'vue2' | 'vue3'>('vue3')
const activeTab = ref<'template' | 'composable'>('template')
const copied = ref(false)

// Watch for prop changes
watch(() => props.directive, (newVal) => {
	if (newVal) {
		selectedDirective.value = newVal
	}
})

const currentDirective = computed(() =>
	directives.find(d => d.name === selectedDirective.value),
)

const currentOptions = computed(() => currentDirective.value?.options || {})

const generatedCode = computed(() => {
	const name = selectedDirective.value
	const version = vueVersion.value
	const options = currentOptions.value

	if (activeTab.value === 'composable') {
		return generateComposableCode(name, options)
	}

	return generateTemplateCode(name, version, options)
})

function formatOptions(options: Record<string, any>): string {
	return Object.entries(options)
		.filter(([, v]) => v !== undefined && v !== '')
		.map(([k, v]) => {
			if (typeof v === 'string') return k + ': ' + "'" + v + "'"
			if (Array.isArray(v)) return k + ': ' + JSON.stringify(v)
			if (typeof v === 'object') return k + ': ' + JSON.stringify(v)
			return k + ': ' + String(v)
		})
		.join(',\n    ')
}

function generateTemplateCode(name: string, version: 'vue2' | 'vue3', options: Record<string, any>): string {
	const directiveName = name
	const optionsStr = formatOptions(options)
	const hasOptions = Object.keys(options).length > 0
	const description = currentDirective.value?.description || name

	const scriptOpen = '<' + 'script' + (version === 'vue3' ? ' setup lang="ts"' : '') + '>'
	const scriptClose = '<' + '/' + 'script>'

	if (version === 'vue3') {
		let code = '<template>\n'
		code += '  <div v-' + directiveName
		if (hasOptions) {
			code += '="{\n    ' + optionsStr + '\n  }"'
		}
		code += '>\n'
		code += '    <!-- ' + description + ' -->\n'
		code += '  </div>\n'
		code += '</template>\n\n'
		code += scriptOpen + '\n'
		code += "import { ref } from 'vue'\n\n"
		if (hasOptions) {
			code += '// Directive options\n'
			code += 'const options = {\n'
			code += '  ' + optionsStr + '\n'
			code += '}\n'
		} else {
			code += '// No configuration needed\n'
		}
		code += scriptClose
		return code
	}

	let code = '<template>\n'
	code += '  <div v-' + directiveName
	if (hasOptions) {
		code += '="options"'
	}
	code += '>\n'
	code += '    <!-- ' + description + ' -->\n'
	code += '  </div>\n'
	code += '</template>\n\n'
	code += scriptOpen + '\n'
	code += 'export default {\n'
	code += '  data() {\n'
	code += '    return {\n'
	if (hasOptions) {
		code += '      options: {\n'
		code += '        ' + optionsStr + '\n'
		code += '      }\n'
	} else {
		code += '      // No configuration needed\n'
	}
	code += '    }\n'
	code += '  }\n'
	code += '}\n'
	code += scriptClose
	return code
}

function generateComposableCode(name: string, options: Record<string, any>): string {
	const parts = name.split('-')
	const composableName = 'use' + parts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
	const optionsStr = formatOptions(options)

	let code = "import { " + composableName + " } from 'directix'\n\n"
	if (Object.keys(options).length > 0) {
		code += 'const result = ' + composableName + '({\n'
		code += '  ' + optionsStr + '\n'
		code += '})\n'
	} else {
		code += 'const result = ' + composableName + '()\n'
	}
	code += '\n// Available properties depend on the directive\n'
	code += '// Common: enabled, disable, enable\n'
	code += 'console.log(result)\n'
	return code
}

function copyCode() {
	navigator.clipboard.writeText(generatedCode.value)
	copied.value = true
	setTimeout(() => {
		copied.value = false
	}, 2000)
}

function runInPlayground() {
	const encodedCode = encodeURIComponent(generatedCode.value)
	const playgroundUrl = `/playground.html?code=${encodedCode}&directive=${selectedDirective.value}`
	window.open(playgroundUrl, '_blank')
}
</script>

<template>
	<div class="playground">
		<div class="playground-header">
			<div class="header-left">
				<span class="playground-title">🎯 Code Generator</span>
				<span v-if="currentDirective" class="directive-badge">
					v-{{ currentDirective.name }}
				</span>
			</div>
			<span class="directive-desc">{{ currentDirective?.description }}</span>
		</div>

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
					Directive
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
				<span v-if="copied">✓ Copied!</span>
				<span v-else>📋 Copy</span>
			</button>

			<button class="run-btn" @click="runInPlayground">
				▶ Run
			</button>
		</div>

		<div class="code-output">
			<div class="code-header">
				<span class="code-lang">{{ activeTab === 'template' ? 'Vue' : 'TypeScript' }}</span>
			</div>
			<pre><code>{{ generatedCode }}</code></pre>
		</div>

		<div class="playground-footer">
			<span class="footer-hint">
				{{ currentDirective?.category }} · {{ currentDirective?.name }}
			</span>
			<a :href="`/api/${currentDirective?.name}.html`" class="footer-link">
				View API Docs →
			</a>
		</div>
	</div>
</template>

<style scoped>
.playground {
	margin: 24px 0;
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	overflow: hidden;
	background: var(--vp-c-bg-soft);
}

.playground-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 20px;
	background: var(--vp-c-bg);
	border-bottom: 1px solid var(--vp-c-divider);
}

.header-left {
	display: flex;
	align-items: center;
	gap: 12px;
}

.playground-title {
	font-size: 16px;
	font-weight: 600;
	color: var(--vp-c-text-1);
}

.directive-badge {
	padding: 4px 10px;
	background: var(--vp-c-brand-1);
	color: white;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 500;
	font-family: var(--vp-font-family-mono);
}

.directive-desc {
	font-size: 13px;
	color: var(--vp-c-text-2);
}

.playground-toolbar {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 20px;
	background: var(--vp-c-bg);
	border-bottom: 1px solid var(--vp-c-divider);
	flex-wrap: wrap;
}

.directive-select {
	padding: 8px 12px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
	background: var(--vp-c-bg);
	font-size: 13px;
	cursor: pointer;
	min-width: 160px;
}

.toolbar-group {
	display: flex;
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
	overflow: hidden;
}

.toolbar-btn {
	padding: 8px 14px;
	font-size: 13px;
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
	padding: 8px 16px;
	font-size: 13px;
	background: var(--vp-c-bg);
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
	cursor: pointer;
	margin-left: auto;
	transition: all 0.2s;
}

.copy-btn:hover {
	background: var(--vp-c-bg-soft);
	border-color: var(--vp-c-brand-1);
}

.run-btn {
	padding: 8px 16px;
	font-size: 13px;
	background: var(--vp-c-brand-1);
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	margin-left: 8px;
	transition: all 0.2s;
}

.run-btn:hover {
	background: var(--vp-c-brand-2);
}

.code-output {
	background: var(--vp-code-block-bg);
	border-bottom: 1px solid var(--vp-c-divider);
}

.code-header {
	padding: 8px 20px;
	background: rgba(0, 0, 0, 0.1);
	border-bottom: 1px solid var(--vp-c-divider);
}

.code-lang {
	font-size: 11px;
	font-weight: 500;
	color: var(--vp-c-text-2);
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.code-output pre {
	margin: 0;
	padding: 20px;
	overflow-x: auto;
}

.code-output code {
	font-family: var(--vp-font-family-mono);
	font-size: 13px;
	line-height: 1.7;
	color: var(--vp-c-text-1);
}

.playground-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 20px;
	background: var(--vp-c-bg);
}

.footer-hint {
	font-size: 12px;
	color: var(--vp-c-text-3);
}

.footer-link {
	font-size: 12px;
	color: var(--vp-c-brand-1);
	text-decoration: none;
}

.footer-link:hover {
	text-decoration: underline;
}
</style>
