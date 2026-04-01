<script lang="ts">
import { defineComponent, ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useEllipsis } from 'directix'

export default defineComponent({
	name: 'EllipsisDemo',
	components: { DemoSection, CodeBlock },
	setup() {
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
		const longText = ref('This is a very long text that will be truncated using the useEllipsis composable. It demonstrates how you can programmatically control text truncation in your Vue components.')
		const { truncated, isTruncated, original } = useEllipsis({
			text: longText,
			maxWidth: 300
		})

		const composableCode = `<script setup>
import { ref } from 'vue'
import { useEllipsis } from 'directix'

const longText = ref('This is a very long text...')
const { truncated, isTruncated } = useEllipsis({
  text: longText,
  maxWidth: 200,
  lines: 1
})
<\/script>

<template>
  <span :title="isTruncated ? longText : ''">
    {{ truncated }}
  </span>
</template>`

		return {
			singleLineCode,
			multiLineCode,
			expandableCode,
			titleCode,
			// Composable API
			longText,
			truncated,
			isTruncated,
			original,
			composableCode
		}
	}
})
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

		<DemoSection title="Composable API" description="Use useEllipsis for programmatic text truncation">
			<div class="demo-box">
				<div class="text-box">
					<div class="composable-demo">
						<p class="composable-label">Original ({{ original.length }} chars):</p>
						<p class="composable-text">{{ longText }}</p>
					</div>
					<div class="composable-demo">
						<p class="composable-label">Truncated (maxWidth: 300px):</p>
						<p class="composable-text" :title="isTruncated ? longText : ''">{{ truncated }}</p>
					</div>
					<p class="composable-status" v-if="isTruncated">Text was truncated</p>
				</div>
				<p class="hint">The composable API provides reactive truncation with isTruncated state</p>
			</div>
			<CodeBlock :code="composableCode" />
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
						<td>String</td>
						<td>'auto'</td>
						<td>'auto' | 'always' | 'none'</td>
					</tr>
				</tbody>
			</table>
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
	color: #42b883;
}

.composable-demo {
	margin-bottom: 12px;
	padding: 12px;
	background: #f8f9fa;
	border-radius: 6px;
}

.composable-label {
	font-size: 12px;
	color: #666;
	margin-bottom: 4px;
	font-weight: 600;
}

.composable-text {
	margin: 0;
	line-height: 1.6;
}

.composable-status {
	margin-top: 8px;
	font-size: 12px;
	color: #42b883;
	font-weight: 500;
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
</style>
