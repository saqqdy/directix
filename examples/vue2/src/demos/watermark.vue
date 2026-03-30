<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'WatermarkDemo',
	components: { DemoSection, CodeBlock },
	data() {
		return {
			disabled: false,
			basicCode: `<div v-watermark="'Confidential'" style="height: 200px">
  Protected content here
</div>`,
			multiLineCode: `<div v-watermark="{ content: ['Company Name', 'User: John'] }">
  Content with multi-line watermark
</div>`,
			customCode: `<div v-watermark="{
  content: 'DRAFT',
  fontSize: 24,
  color: 'rgba(255, 0, 0, 0.2)',
  rotate: -30
}">
  Draft document
</div>`
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-watermark</h1>
		<p class="intro">
			Adds a watermark overlay to an element. Supports single or multi-line text with customizable styling.
		</p>

		<DemoSection title="Basic Usage" description="Simple watermark text">
			<div class="demo-box">
				<div v-watermark="'Confidential'" class="watermark-container">
					<p>This content is protected by a watermark.</p>
					<p>The watermark text "Confidential" is displayed across the content.</p>
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<DemoSection title="Multi-Line" description="Multiple lines of watermark text">
			<div class="demo-box">
				<div v-watermark="{ content: ['ACME Corp', 'Internal Use Only'] }" class="watermark-container">
					<p>Content with company name and usage notice.</p>
					<p>Both lines appear in the watermark pattern.</p>
				</div>
			</div>
			<CodeBlock :code="multiLineCode" />
		</DemoSection>

		<DemoSection title="Custom Styling" description="Customize appearance">
			<div class="demo-box">
				<div
					v-watermark="{
						content: 'DRAFT',
						fontSize: 28,
						color: 'rgba(220, 53, 69, 0.2)',
						rotate: -30,
						gap: 60
					}"
					class="watermark-container"
				>
					<p>This is a draft document with a bold red watermark.</p>
					<p>Custom rotation and gap settings are applied.</p>
				</div>
			</div>
			<CodeBlock :code="customCode" />
		</DemoSection>

		<DemoSection title="Toggle Watermark" description="Dynamically enable/disable">
			<div class="demo-box">
				<div
					v-watermark="{ content: 'Sample', disabled: disabled }"
					class="watermark-container"
				>
					<p>Toggle the watermark using the checkbox below.</p>
					<p>When disabled, the watermark layer is removed.</p>
				</div>
				<label class="checkbox">
					<input type="checkbox" v-model="disabled" />
					<span>Disable watermark</span>
				</label>
			</div>
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
						<td>content</td>
						<td>String | String[]</td>
						<td>-</td>
						<td>Watermark text (required)</td>
					</tr>
					<tr>
						<td>fontSize</td>
						<td>Number</td>
						<td>16</td>
						<td>Font size in pixels</td>
					</tr>
					<tr>
						<td>color</td>
						<td>String</td>
						<td>'rgba(128, 128, 128, 0.15)'</td>
						<td>Text color</td>
					</tr>
					<tr>
						<td>rotate</td>
						<td>Number</td>
						<td>-22</td>
						<td>Rotation angle in degrees</td>
					</tr>
					<tr>
						<td>gap</td>
						<td>Number | [Number, Number]</td>
						<td>[100, 100]</td>
						<td>Gap between watermarks</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Whether to disable</td>
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

.watermark-container {
	height: 200px;
	background: white;
	border-radius: 8px;
	padding: 20px;
	border: 1px solid #e0e0e0;
}

.watermark-container p {
	margin-bottom: 8px;
}

.checkbox {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 12px;
	cursor: pointer;
}

.checkbox input {
	width: 16px;
	height: 16px;
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
