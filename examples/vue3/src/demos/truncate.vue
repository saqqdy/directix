<script setup lang="ts">
import { ref, computed } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useTruncate } from 'directix'

const customLength = ref(30)
const customPosition = ref<'start' | 'middle' | 'end'>('end')
const customEllipsis = ref('...')

const sampleText = 'The quick brown fox jumps over the lazy dog. This is a sample text that demonstrates the truncate directive in action with various options and configurations.'
const longParagraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'

const truncatedText = computed(() => {
	const text = sampleText
	const length = customLength.value
	const position = customPosition.value
	const ellipsis = customEllipsis.value || '...'

	if (text.length <= length) return text

	switch (position) {
		case 'start':
			return ellipsis + text.slice(-(length - ellipsis.length))
		case 'middle':
			const startLen = Math.ceil((length - ellipsis.length) / 2)
			const endLen = Math.floor((length - ellipsis.length) / 2)
			return text.slice(0, startLen) + ellipsis + text.slice(-endLen)
		case 'end':
		default:
			return text.slice(0, length - ellipsis.length) + ellipsis
	}
})

// Composable API demo
const composableText = ref('The quick brown fox jumps over the lazy dog. This is a long text.')
const composableLength = ref(40)
const composableTruncatePosition = ref<'start' | 'middle' | 'end'>('end')
const { truncated, isTruncated, originalLength } = useTruncate({
	text: composableText,
	length: composableLength,
	position: composableTruncatePosition,
})

const composableCode = `import { ref } from 'vue'
import { useTruncate } from 'directix'

const text = ref('This is a very long text that needs to be truncated')
const { truncated, isTruncated, originalLength } = useTruncate({
	text,
	length: 20,
	position: 'end',
})
// truncated.value = 'This is a very lo...'

// Truncate from middle
const { truncated: middleTruncated } = useTruncate({
	text,
	length: 20,
	position: 'middle',
})
// middleTruncated.value = 'This is a ...truncated'

// Truncate from start
const { truncated: startTruncated } = useTruncate({
	text,
	length: 20,
	position: 'start',
})
// startTruncated.value = '...eds to be truncated'`
</script>

<template>
	<div>
		<h2>v-truncate</h2>
		<p class="desc">
			The v-truncate directive truncates text to a specified length with various options for position, ellipsis style, and CSS-based truncation.
		</p>

		<!-- Interactive Demo -->
		<h3>Interactive Demo</h3>
		<div class="interactive-demo">
			<div class="controls">
				<div class="control-group">
					<label>Length: {{ customLength }}</label>
					<input type="range" v-model.number="customLength" min="10" max="100" step="5" />
				</div>
				<div class="control-group">
					<label>Position:</label>
					<div class="btn-group">
						<button
							v-for="pos in ['start', 'middle', 'end'] as const"
							:key="pos"
							:class="{ active: customPosition === pos }"
							@click="customPosition = pos"
						>
							{{ pos }}
						</button>
					</div>
				</div>
				<div class="control-group">
					<label>Ellipsis:</label>
					<input type="text" v-model="customEllipsis" placeholder="..." class="text-input" />
				</div>
			</div>
			<div class="preview-box">
				<div class="preview-label">Preview:</div>
				<div class="preview-text" v-truncate="{ length: customLength, position: customPosition, ellipsis: customEllipsis || '...' }">
					{{ sampleText }}
				</div>
				<div class="preview-info">
					<span>Original: {{ sampleText.length }} chars</span>
					<span>Truncated: {{ truncatedText.length }} chars</span>
				</div>
			</div>
		</div>

		<!-- Position Comparison -->
		<h3>Truncation Position Comparison</h3>
		<div class="comparison-grid">
			<div class="comparison-item">
				<div class="position-badge end">end</div>
				<div class="text-box" v-truncate="{ length: 50, position: 'end' }">
					{{ longParagraph }}
				</div>
				<div class="description">Text is truncated at the end, keeping the beginning visible. Best for previews and summaries.</div>
			</div>
			<div class="comparison-item">
				<div class="position-badge start">start</div>
				<div class="text-box" v-truncate="{ length: 50, position: 'start' }">
					{{ longParagraph }}
				</div>
				<div class="description">Text is truncated at the start, showing the end. Useful for file paths or URLs.</div>
			</div>
			<div class="comparison-item">
				<div class="position-badge middle">middle</div>
				<div class="text-box" v-truncate="{ length: 50, position: 'middle' }">
					{{ longParagraph }}
				</div>
				<div class="description">Text is truncated in the middle. Perfect for showing both context and endings.</div>
			</div>
		</div>

		<!-- Custom Ellipsis -->
		<h3>Custom Ellipsis Styles</h3>
		<div class="ellipsis-grid">
			<div class="ellipsis-item">
				<span class="ellipsis-preview">...</span>
				<span class="ellipsis-label">Default</span>
				<div class="ellipsis-text" v-truncate="{ length: 40 }">{{ sampleText }}</div>
			</div>
			<div class="ellipsis-item">
				<span class="ellipsis-preview">~~~</span>
				<span class="ellipsis-label">Wave</span>
				<div class="ellipsis-text" v-truncate="{ length: 40, ellipsis: '~~~' }">{{ sampleText }}</div>
			</div>
			<div class="ellipsis-item">
				<span class="ellipsis-preview">[...]</span>
				<span class="ellipsis-label">Bracketed</span>
				<div class="ellipsis-text" v-truncate="{ length: 40, ellipsis: '[...]' }">{{ sampleText }}</div>
			</div>
			<div class="ellipsis-item">
				<span class="ellipsis-preview">-></span>
				<span class="ellipsis-label">Arrow</span>
				<div class="ellipsis-text" v-truncate="{ length: 40, ellipsis: ' ->' }">{{ sampleText }}</div>
			</div>
			<div class="ellipsis-item">
				<span class="ellipsis-preview">...</span>
				<span class="ellipsis-label">Read More</span>
				<div class="ellipsis-text" v-truncate="{ length: 40, ellipsis: '...' }">{{ sampleText }}</div>
			</div>
		</div>

		<!-- CSS vs JS Truncation -->
		<h3>CSS vs JavaScript Truncation</h3>
		<div class="comparison-row">
			<div class="method-card">
				<div class="method-header">
					<span class="method-title">CSS Truncation</span>
					<span class="method-badge">useCss: true</span>
				</div>
				<div class="method-content css-truncate" v-truncate="{ useCss: true }">
					{{ sampleText }} This text will be truncated based on container width using CSS text-overflow property.
				</div>
				<ul class="method-features">
					<li>Responsive to container width</li>
					<li>Better performance</li>
					<li>No position options</li>
				</ul>
			</div>
			<div class="method-card">
				<div class="method-header">
					<span class="method-title">JavaScript Truncation</span>
					<span class="method-badge">default</span>
				</div>
				<div class="method-content" v-truncate="{ length: 80, position: 'middle' }">
					{{ sampleText }} This text will be truncated using JavaScript with precise character control.
				</div>
				<ul class="method-features">
					<li>Precise character control</li>
					<li>Position options (start/middle/end)</li>
					<li>Custom ellipsis</li>
				</ul>
			</div>
		</div>

		<!-- Hover Tooltip Feature -->
		<h3>Hover to Show Full Text</h3>
		<div class="hover-demo">
			<div class="hover-item">
				<div class="hover-label">showTitle: true (hover me)</div>
				<div class="hover-text" v-truncate="{ length: 60, showTitle: true }">
					{{ longParagraph }}
				</div>
			</div>
			<div class="hover-item">
				<div class="hover-label">showTitle: false</div>
				<div class="hover-text" v-truncate="{ length: 60, showTitle: false }">
					{{ longParagraph }}
				</div>
			</div>
		</div>

		<!-- Code Example -->
		<h3>Code Example</h3>
		<pre class="code"><code>&lt;!-- Basic usage: truncate to 30 characters --&gt;
&lt;p v-truncate="30"&gt;Long text here...&lt;/p&gt;

&lt;!-- With options --&gt;
&lt;p v-truncate="{
  length: 50,
  position: 'middle',
  ellipsis: '~~~'
}"&gt;Long text here...&lt;/p&gt;

&lt;!-- CSS-based responsive truncation --&gt;
&lt;p v-truncate="{ useCss: true }"&gt;Responsive text...&lt;/p&gt;

&lt;!-- Show full text on hover --&gt;
&lt;p v-truncate="{ length: 40, showTitle: true }"&gt;Hover to see more...&lt;/p&gt;</code></pre>

		<!-- Composable API -->
		<DemoSection title="Composable API - useTruncate" description="Using useTruncate composable for programmatic text truncation">
			<div class="interactive-demo">
				<div class="controls">
					<div class="control-group">
						<label>Length: {{ composableLength }}</label>
						<input type="range" v-model.number="composableLength" min="10" max="100" step="5" />
					</div>
					<div class="control-group">
						<label>Position:</label>
						<div class="btn-group">
							<button
								v-for="pos in ['start', 'middle', 'end'] as const"
								:key="pos"
								:class="{ active: composableTruncatePosition === pos }"
								@click="composableTruncatePosition = pos"
							>
								{{ pos }}
							</button>
						</div>
					</div>
				</div>
				<div class="preview-box">
					<div class="preview-label">Preview:</div>
					<div class="preview-text">{{ truncated }}</div>
					<div class="preview-info">
						<span>Original: {{ originalLength }} chars</span>
						<span>Truncated: {{ truncated.length }} chars</span>
						<span>Is truncated: {{ isTruncated }}</span>
					</div>
				</div>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>
	</div>
</template>

<style scoped>
h3 {
	margin-top: 28px;
	margin-bottom: 16px;
	color: #333;
	font-size: 18px;
}

.desc {
	color: #666;
	margin-bottom: 24px;
	line-height: 1.6;
}

/* Interactive Demo */
.interactive-demo {
	background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
	border: 1px solid #667eea22;
	border-radius: 12px;
	padding: 20px;
	margin-bottom: 24px;
}

.controls {
	display: flex;
	gap: 24px;
	flex-wrap: wrap;
	margin-bottom: 20px;
}

.control-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.control-group label {
	font-size: 13px;
	font-weight: 600;
	color: #555;
}

.control-group input[type="range"] {
	width: 200px;
	accent-color: #667eea;
}

.control-group input[type="text"].text-input {
	padding: 6px 12px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
	width: 100px;
}

.btn-group {
	display: flex;
	gap: 4px;
}

.btn-group button {
	padding: 6px 14px;
	border: 1px solid #ddd;
	background: white;
	cursor: pointer;
	font-size: 13px;
	transition: all 0.2s;
	border-radius: 6px;
}

.btn-group button:first-child {
	border-radius: 6px 0 0 6px;
}

.btn-group button:last-child {
	border-radius: 0 6px 6px 0;
}

.btn-group button.active {
	background: #667eea;
	border-color: #667eea;
	color: white;
}

.preview-box {
	background: white;
	border-radius: 8px;
	padding: 16px;
	border: 1px solid #e2e8f0;
}

.preview-label {
	font-size: 12px;
	color: #888;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.preview-text {
	font-size: 15px;
	line-height: 1.6;
	color: #333;
	padding: 12px;
	background: #f8f9fa;
	border-radius: 6px;
	min-height: 50px;
}

.preview-info {
	margin-top: 12px;
	display: flex;
	gap: 16px;
	font-size: 12px;
	color: #666;
	font-family: monospace;
}

/* Position Comparison */
.comparison-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 20px;
	margin-bottom: 24px;
}

.comparison-item {
	background: white;
	border-radius: 12px;
	padding: 20px;
	border: 1px solid #e2e8f0;
	transition: box-shadow 0.2s;
}

.comparison-item:hover {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.position-badge {
	display: inline-block;
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 600;
	margin-bottom: 12px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.position-badge.start {
	background: #fef3c7;
	color: #92400e;
}

.position-badge.middle {
	background: #dbeafe;
	color: #1e40af;
}

.position-badge.end {
	background: #dcfce7;
	color: #166534;
}

.text-box {
	font-size: 14px;
	line-height: 1.5;
	color: #444;
	padding: 12px;
	background: #f8f9fa;
	border-radius: 6px;
	margin-bottom: 12px;
	min-height: 48px;
}

.description {
	font-size: 13px;
	color: #666;
	line-height: 1.5;
}

/* Ellipsis Grid */
.ellipsis-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 16px;
	margin-bottom: 24px;
}

.ellipsis-item {
	background: white;
	border: 1px solid #e2e8f0;
	border-radius: 10px;
	padding: 16px;
	text-align: center;
	transition: transform 0.2s, box-shadow 0.2s;
}

.ellipsis-item:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.ellipsis-preview {
	display: block;
	font-size: 24px;
	font-weight: bold;
	color: #667eea;
	margin-bottom: 4px;
}

.ellipsis-label {
	display: block;
	font-size: 12px;
	color: #888;
	margin-bottom: 12px;
}

.ellipsis-text {
	font-size: 13px;
	color: #555;
	background: #f8f9fa;
	padding: 10px;
	border-radius: 6px;
	text-align: left;
	min-height: 44px;
}

/* Method Comparison */
.comparison-row {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 20px;
	margin-bottom: 24px;
}

.method-card {
	background: white;
	border: 1px solid #e2e8f0;
	border-radius: 12px;
	overflow: hidden;
}

.method-header {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 14px 16px;
	background: #f8f9fa;
	border-bottom: 1px solid #e2e8f0;
}

.method-title {
	font-weight: 600;
	flex: 1;
}

.method-badge {
	font-size: 11px;
	padding: 3px 8px;
	background: #667eea;
	color: white;
	border-radius: 4px;
	font-family: monospace;
}

.method-content {
	padding: 16px;
	font-size: 14px;
	line-height: 1.6;
	color: #444;
	min-height: 60px;
}

.css-truncate {
	white-space: nowrap;
	overflow: hidden;
}

.method-features {
	padding: 12px 16px;
	margin: 0;
	list-style: none;
	font-size: 13px;
	color: #666;
	background: #fafafa;
}

.method-features li {
	padding: 4px 0;
}

/* Hover Demo */
.hover-demo {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 20px;
	margin-bottom: 24px;
}

.hover-item {
	background: white;
	border: 1px solid #e2e8f0;
	border-radius: 10px;
	padding: 16px;
}

.hover-label {
	font-size: 12px;
	color: #888;
	margin-bottom: 10px;
	font-weight: 500;
}

.hover-text {
	font-size: 14px;
	color: #444;
	padding: 12px;
	background: #f0f9ff;
	border-radius: 6px;
	cursor: help;
}

/* Code */
.code {
	background: #1e293b;
	color: #e2e8f0;
	padding: 20px;
	border-radius: 10px;
	overflow-x: auto;
	font-size: 13px;
	line-height: 1.7;
	font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}
</style>
