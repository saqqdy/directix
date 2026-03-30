<script setup lang="ts">
import { ref, computed } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

// Generate large dataset
const items = computed(() =>
	Array.from({ length: 10000 }, (_, i) => ({
		id: i,
		name: `Item ${i + 1}`,
		value: Math.floor(Math.random() * 1000)
	}))
)

const visibleRange = ref({ start: 0, end: 0 })

const basicCode = `<div
  v-virtual-list="{ items: largeArray, itemSize: 50 }"
  style="height: 400px"
></div>`

const customCode = `<div v-virtual-list="{
  items: largeArray,
  itemSize: 60,
  height: 500,
  overscan: 5,
  render: (item, index) => `
    <div class="custom-item">
      <strong>${item.name}</strong>
      <span>${item.value}</span>
    </div>
  `
}"></div>`

const variableCode = `<div v-virtual-list="{
  items: largeArray,
  itemSize: (index) => index % 10 === 0 ? 80 : 50
}"></div>`
</script>

<template>
	<div class="demo-page">
		<h1>v-virtual-list</h1>
		<p class="intro">
			Renders large lists efficiently using virtualization. Only visible items are rendered, enabling smooth scrolling with thousands of items.
		</p>

		<DemoSection title="Basic Usage" description="Virtualized list with 10,000 items">
			<div class="demo-box">
				<div
					v-virtual-list="{
						items: items,
						itemSize: 50,
						height: 400,
						onVisibleChange: (start, end) => {
							visibleRange = { start, end }
						}
					}"
					class="virtual-list"
				></div>
				<p class="info">
					Showing items: {{ visibleRange.start }} - {{ visibleRange.end }} of {{ items.length }}
				</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<DemoSection title="Custom Render" description="Custom item rendering">
			<div class="demo-box">
				<div
					v-virtual-list="{
						items: items.slice(0, 1000),
						itemSize: 60,
						height: 350,
						overscan: 5,
						render: (item) => `
							<div style='padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;'>
								<strong>${item.name}</strong>
								<span style='color: #667eea;'>${item.value}</span>
							</div>
						`
					}"
					class="virtual-list custom"
				></div>
			</div>
			<CodeBlock :code="customCode" />
		</DemoSection>

		<DemoSection title="Variable Item Height" description="Dynamic item sizes">
			<div class="demo-box">
				<div
					v-virtual-list="{
						items: items.slice(0, 500),
						itemSize: (index) => index % 10 === 0 ? 80 : 50,
						height: 300,
						render: (item, index) => `
							<div style='padding: 10px; background: ${index % 10 === 0 ? '#f0f4ff' : '#fff'}; border-bottom: 1px solid #eee;'>
								${index % 10 === 0 ? '<strong>Header Item</strong><br>' : ''}${item.name}
							</div>
						`
					}"
					class="virtual-list"
				></div>
				<p class="hint">Every 10th item has larger height (80px vs 50px)</p>
			</div>
			<CodeBlock :code="variableCode" />
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
						<td>items</td>
						<td>Array</td>
						<td>-</td>
						<td>Array of items to render (required)</td>
					</tr>
					<tr>
						<td>itemSize</td>
						<td>Number | Function</td>
						<td>50</td>
						<td>Item height in pixels or function</td>
					</tr>
					<tr>
						<td>height</td>
						<td>Number | String</td>
						<td>400</td>
						<td>Container height</td>
					</tr>
					<tr>
						<td>overscan</td>
						<td>Number</td>
						<td>3</td>
						<td>Extra items to render</td>
					</tr>
					<tr>
						<td>render</td>
						<td>Function</td>
						<td>-</td>
						<td>Custom render function</td>
					</tr>
					<tr>
						<td>keyField</td>
						<td>String</td>
						<td>'id'</td>
						<td>Key field for items</td>
					</tr>
					<tr>
						<td>onScroll</td>
						<td>Function</td>
						<td>-</td>
						<td>Scroll callback</td>
					</tr>
					<tr>
						<td>onVisibleChange</td>
						<td>Function</td>
						<td>-</td>
						<td>Visible range change callback</td>
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

.virtual-list {
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	background: white;
}

.virtual-list.custom {
	border-color: #667eea;
}

.info {
	margin-top: 12px;
	font-size: 14px;
	color: #666;
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
