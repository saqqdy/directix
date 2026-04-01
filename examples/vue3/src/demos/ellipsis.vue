<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useEllipsis } from 'directix'

const singleLineCode = `<p v-ellipsis style="width: 200px;">
  Long text that will be truncated with ellipsis...
</p>`

const multiLineCode = `<p v-ellipsis="3" style="width: 280px;">
  This is a very long text that will be truncated after 3 lines.
  The directive uses CSS line-clamp for multi-line truncation.
</p>`

const expandableCode = `<p v-ellipsis="{ lines: 2, expandable: true }" style="width: 300px;">
  Click to expand this text. It will show full content when clicked.
</p>`

const titleCode = `<p v-ellipsis="{ lines: 2, titleBehavior: 'always' }" style="width: 280px;">
  Hover to see full text as title.
</p>`

// Composable API demo
const composableText = ref('This is a very long text that will be truncated based on max width.')
const composableMaxWidth = ref(200)
const { truncated: ellipsisTruncated, isTruncated: ellipsisIsTruncated, original: ellipsisOriginal } = useEllipsis({
	text: composableText,
	maxWidth: composableMaxWidth,
})

const composableCode = `import { ref } from 'vue'
import { useEllipsis } from 'directix'

const text = ref('This is a very long text that needs to be truncated')
const { truncated, isTruncated, original } = useEllipsis({
	text,
	maxWidth: 200,
	ellipsis: '...',
})

// truncated.value = truncated text
// isTruncated.value = true if text was truncated

// Multi-line truncation
const { truncated: multiLineTruncated } = useEllipsis({
	text,
	lines: 2,
})`
</script>

<template>
	<div class="demo-page">
		<h1>v-ellipsis</h1>
		<p class="intro">
			Truncates text with ellipsis, supporting both single-line and multi-line truncation with optional expand functionality.
		</p>

		<DemoSection title="Single Line" description="Default single-line text truncation">
			<div class="demo-box">
				<div class="text-box">
					<p v-ellipsis style="width: 280px;">
						This is a very long text that will be truncated with ellipsis when it exceeds the container width. The text-overflow CSS property is used to show the overflow with an ellipsis. This is useful for displaying long titles or descriptions in limited space.
					</p>
				</div>
			</div>
			<CodeBlock :code="singleLineCode" />
		</DemoSection>

		<DemoSection title="Multi-Line" description="Truncate after specified number of lines">
			<div class="demo-box">
				<div class="text-box">
					<p v-ellipsis="3" style="width: 280px;">
						This is a very long text that will be truncated after 3 lines. The directive uses CSS -webkit-line-clamp for multi-line truncation. It works in all modern browsers and provides a clean way to limit text height. You can see how the text gracefully fades with ellipsis when the content exceeds the specified number of lines.
					</p>
				</div>
			</div>
			<CodeBlock :code="multiLineCode" />
		</DemoSection>

		<DemoSection title="Expandable" description="Click to expand/collapse full text">
			<div class="demo-box">
				<div class="text-box">
					<p v-ellipsis="{ lines: 2, expandable: true }" class="expandable" style="width: 320px;">
						Click to expand this text. It will show full content when clicked, and collapse back when clicked again. This is useful for showing truncated previews with the option to read more. The expand/collapse functionality allows users to see the complete content when needed.
					</p>
				</div>
				<p class="hint">Click the text above to toggle expansion</p>
			</div>
			<CodeBlock :code="expandableCode" />
		</DemoSection>

		<DemoSection title="Title Behavior" description="Control when full text appears as tooltip">
			<div class="demo-box">
				<div class="text-box">
					<p v-ellipsis="{ lines: 2, titleBehavior: 'always' }" style="width: 280px;">
						Hover to see full text as title. The titleBehavior option controls when the full text appears as a tooltip. This is helpful for accessibility and user experience.
					</p>
				</div>
				<p class="hint">Hover to see full text in tooltip</p>
			</div>
			<CodeBlock :code="titleCode" />
		</DemoSection>

		<DemoSection title="API">
			<table class="api-table">
				<thead>
					<tr>
						<th>Parameter</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>lines</td>
						<td>Number</td>
						<td>1</td>
						<td>Number of lines before truncating</td>
					</tr>
					<tr>
						<td>expandable</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Whether to expand on click</td>
					</tr>
					<tr>
						<td>titleBehavior</td>
						<td>'auto' | 'always' | 'none'</td>
						<td>'auto'</td>
						<td>When to show full text as title</td>
					</tr>
				</tbody>
			</table>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useEllipsis" description="Using useEllipsis composable for programmatic text truncation">
			<div class="demo-box">
				<div class="demo-row">
					<div class="demo-item">
						<p><strong>Input Text</strong></p>
						<input v-model="composableText" class="input" placeholder="Type something..." />
					</div>
					<div class="demo-item">
						<p><strong>Max Width: {{ composableMaxWidth }}px</strong></p>
						<input type="range" v-model.number="composableMaxWidth" min="100" max="400" step="20" />
					</div>
				</div>
				<div class="demo-row">
					<div class="demo-item">
						<p><strong>Original:</strong></p>
						<p class="text-demo">{{ ellipsisOriginal }}</p>
					</div>
					<div class="demo-item">
						<p><strong>Truncated:</strong></p>
						<p class="text-demo result">{{ ellipsisTruncated }}</p>
						<p class="hint">Is truncated: {{ ellipsisIsTruncated }}</p>
					</div>
				</div>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>
	</div>
</template>

<style scoped>
.demo-page {
	max-width: 900px;
}

h1 {
	margin-bottom: 8px;
}

.intro {
	color: #666;
	margin-bottom: 24px;
}

.demo-box {
	padding: 20px;
	background: #f8f9fa;
	border-radius: 8px;
	margin-bottom: 12px;
}

.text-box {
	background: white;
	padding: 12px;
	border-radius: 6px;
	border: 1px solid #e0e0e0;
}

.text-box p {
	margin: 0;
	line-height: 1.6;
}

.text-box .expandable {
	cursor: pointer;
	transition: all 0.2s;
}

.text-box .expandable:hover {
	color: #667eea;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
}

.api-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
}

.api-table th,
.api-table td {
	padding: 12px;
	text-align: left;
	border-bottom: 1px solid #eee;
}

.api-table th {
	background: #f8f9fa;
	font-weight: 600;
}

.demo-row {
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
	margin-bottom: 16px;
}

.demo-item {
	flex: 1;
	min-width: 200px;
}

.demo-item p {
	margin: 0 0 8px 0;
	color: #444;
}

.demo-item p strong {
	color: #667eea;
}

.input {
	width: 100%;
	padding: 10px 12px;
	border: 2px solid #e2e8f0;
	border-radius: 6px;
	font-size: 14px;
	transition: border-color 0.2s;
}

.input:focus {
	outline: none;
	border-color: #667eea;
}

.text-demo {
	font-size: 14px;
	line-height: 1.6;
	color: #333;
	padding: 12px;
	background: #fff;
	border-radius: 6px;
	border: 1px solid #e2e8f0;
	margin: 0;
}

.text-demo.result {
	color: #667eea;
	border-color: #667eea33;
	background: #667eea08;
}
</style>
