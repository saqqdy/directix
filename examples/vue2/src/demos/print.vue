<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'PrintDemo',
	components: { DemoSection, CodeBlock },
	data() {
		return {
			basicCode: `<button v-print>Print Page</button>`,
			targetCode: `<button v-print="{ target: '#print-content' }">
  Print Specific Element
</button>`,
			styledCode: `<button v-print="{
  title: 'My Document',
  styles: 'body { font-size: 12px }'
}">
  Print with Custom Styles
</button>`
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-print</h1>
		<p class="intro">
			Prints element content when clicked. Supports targeting specific elements and custom styling for print output.
		</p>

		<DemoSection title="Basic Usage" description="Print the entire page">
			<div class="demo-box">
				<button v-print class="print-btn">
					Print Page
				</button>
				<p class="hint">Click to open browser print dialog</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<DemoSection title="Print Specific Element" description="Target a specific element by selector">
			<div class="demo-box">
				<button v-print="{ target: '#print-target' }" class="print-btn">
					Print Content Below
				</button>
				<div id="print-target" class="print-content">
					<h3>Printable Content</h3>
					<p>This specific section will be printed.</p>
					<ul>
						<li>Only this content is printed</li>
						<li>The rest of the page is excluded</li>
						<li>Styles are preserved</li>
					</ul>
				</div>
			</div>
			<CodeBlock :code="targetCode" />
		</DemoSection>

		<DemoSection title="Custom Styles" description="Apply custom CSS for printing">
			<div class="demo-box">
				<button
					v-print="{
						title: 'Custom Document',
						styles: 'body { font-size: 14px; color: #333 } h3 { color: #42b883 }'
					}"
					class="print-btn"
				>
					Print with Custom Styles
				</button>
			</div>
			<CodeBlock :code="styledCode" />
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
						<td>target</td>
						<td>String</td>
						<td>-</td>
						<td>CSS selector for target element</td>
					</tr>
					<tr>
						<td>title</td>
						<td>String</td>
						<td>document.title</td>
						<td>Print document title</td>
					</tr>
					<tr>
						<td>styles</td>
						<td>String | String[]</td>
						<td>-</td>
						<td>Custom CSS styles</td>
					</tr>
					<tr>
						<td>immediate</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Print immediately on mount</td>
					</tr>
					<tr>
						<td>onBeforePrint</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback before printing</td>
					</tr>
					<tr>
						<td>onAfterPrint</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback after printing</td>
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

.print-btn {
	padding: 12px 24px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 600;
	transition: all 0.2s;
}

.print-btn:hover {
	background: #3aa876;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
}

.print-content {
	margin-top: 16px;
	padding: 20px;
	background: white;
	border: 2px dashed #42b883;
	border-radius: 8px;
}

.print-content h3 {
	color: #42b883;
	margin-bottom: 12px;
}

.print-content ul {
	margin-top: 12px;
	padding-left: 20px;
}

.print-content li {
	margin-bottom: 4px;
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
