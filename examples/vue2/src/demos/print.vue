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
  target: '#styled-content',
  title: 'Invoice',
  styles: \`
    body { font-size: 12px; color: #333 }
    .invoice { max-width: 600px; margin: 0 auto }
    .invoice-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 16px }
    .invoice-title { color: #1a1a1a; margin: 0 }
    .invoice-table { width: 100%; border-collapse: collapse; margin-top: 16px }
    .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 8px; text-align: left }
    .invoice-table th { background: #f5f5f5 }
    .invoice-total { text-align: right; margin-top: 16px; font-size: 16px; font-weight: bold }
  \`
}">
  Print Invoice
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
						target: '#styled-content',
						title: 'Invoice',
						styles: `
							body { font-size: 12px; color: #333 }
							.invoice { max-width: 600px; margin: 0 auto }
							.invoice-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 16px }
							.invoice-title { color: #1a1a1a; margin: 0 }
							.invoice-table { width: 100%; border-collapse: collapse; margin-top: 16px }
							.invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 8px; text-align: left }
							.invoice-table th { background: #f5f5f5 }
							.invoice-total { text-align: right; margin-top: 16px; font-size: 16px; font-weight: bold }
						`
					}"
					class="print-btn"
				>
					Print Invoice
				</button>
				<div id="styled-content" class="invoice">
					<div class="invoice-header">
						<h2 class="invoice-title">INVOICE</h2>
						<p>#INV-2024-001</p>
						<p>Date: 2024-01-15</p>
					</div>
					<table class="invoice-table">
						<thead>
							<tr>
								<th>Description</th>
								<th>Qty</th>
								<th>Price</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Web Development</td>
								<td>1</td>
								<td>$1,200.00</td>
								<td>$1,200.00</td>
							</tr>
							<tr>
								<td>UI Design</td>
								<td>1</td>
								<td>$800.00</td>
								<td>$800.00</td>
							</tr>
							<tr>
								<td>Hosting (1 year)</td>
								<td>1</td>
								<td>$120.00</td>
								<td>$120.00</td>
							</tr>
						</tbody>
					</table>
					<p class="invoice-total">Total: $2,120.00</p>
				</div>
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

/* Invoice styles */
.invoice {
	margin-top: 16px;
	padding: 24px;
	background: white;
	border: 2px dashed #667eea;
	border-radius: 8px;
}

.invoice-header {
	text-align: center;
	border-bottom: 2px solid #667eea;
	padding-bottom: 16px;
	margin-bottom: 16px;
}

.invoice-title {
	color: #667eea;
	margin: 0 0 8px 0;
}

.invoice-header p {
	margin: 4px 0;
	color: #666;
	font-size: 14px;
}

.invoice-table {
	width: 100%;
	border-collapse: collapse;
	margin-top: 16px;
}

.invoice-table th,
.invoice-table td {
	border: 1px solid #e0e0e0;
	padding: 10px 12px;
	text-align: left;
}

.invoice-table th {
	background: #f5f5f5;
	font-weight: 600;
}

.invoice-total {
	text-align: right;
	margin-top: 16px;
	font-size: 18px;
	font-weight: bold;
	color: #42b883;
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
