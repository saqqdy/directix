<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useVirtualList } from 'directix'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'VirtualListDemo',
	components: { DemoSection, CodeBlock },
	setup() {
		// Composable API
		const composableItems = Array.from({ length: 1000 }, (_, i) => ({
			id: i,
			name: `Item ${i + 1}`,
			value: Math.floor(Math.random() * 1000)
		}))

		const { list, containerProps, wrapperProps } = useVirtualList(
			composableItems,
			{ itemHeight: 50 }
		)

		const composableCode = `import { useVirtualList } from 'directix'

const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: \`Item \${i + 1}\`
}))

const { list, containerProps, wrapperProps } = useVirtualList(
  items,
  { itemHeight: 50 }
)

// In template:
// <div v-bind="containerProps" style="height: 400px">
//   <div v-bind="wrapperProps">
//     <div v-for="{ data, index } in list" :key="index">
//       {{ data.name }}
//     </div>
//   </div>
// </div>`

		return {
			composableList: list,
			containerProps,
			wrapperProps,
			composableCode
		}
	},
	data() {
		return {
			visibleRange: { start: 0, end: 0 },
			basicCode: `<div
  v-virtual-list="{ items: largeArray, itemSize: 50 }"
  style="height: 400px"
></div>`,
			customCode: `<div v-virtual-list="{
  items: largeArray,
  itemSize: 60,
  height: 500,
  overscan: 5
}"></div>`,
			variableCode: `<div v-virtual-list="{
  items: largeArray,
  itemSize: (index) => index % 10 === 0 ? 80 : 50
}"></div>`
		}
	},
	computed: {
		items(): Array<{ id: number; name: string; value: number }> {
			return Array.from({ length: 10000 }, (_, i) => ({
				id: i,
				name: `Item ${i + 1}`,
				value: Math.floor(Math.random() * 1000)
			}))
		}
	},
	methods: {
		handleVisibleChange(start: number, end: number) {
			this.visibleRange = { start, end }
		},
		renderCustomItem(item: { name: string; value: number }) {
			return `<div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;"><strong>${item.name}</strong><span style="color: #42b883;">${item.value}</span></div>`
		},
		renderVariableItem(item: { name: string }, index: number) {
			const isHeader = index % 10 === 0
			const bg = isHeader ? '#f0fff4' : '#fff'
			const headerHtml = isHeader ? '<strong>Header Item</strong><br>' : ''
			return `<div style="padding: 10px; background: ${bg}; border-bottom: 1px solid #eee;">${headerHtml}${item.name}</div>`
		}
	}
})
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
						onVisibleChange: handleVisibleChange
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
						render: renderCustomItem
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
						render: renderVariableItem
					}"
					class="virtual-list"
				></div>
				<p class="hint">Every 10th item has larger height (80px vs 50px)</p>
			</div>
			<CodeBlock :code="variableCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API" description="Use useVirtualList for programmatic virtual lists">
			<div class="demo-box">
				<div v-bind="containerProps" class="virtual-list" style="height: 300px">
					<div v-bind="wrapperProps">
						<div v-for="{ data, index } in composableList" :key="index" class="virtual-item">
							<strong>{{ data.name }}</strong>
							<span style="color: #42b883;">{{ data.value }}</span>
						</div>
					</div>
				</div>
				<p class="hint">Using useVirtualList composable for programmatic virtualization</p>
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
	background: linear-gradient(135deg, #f8f9fa 0%, #f0f1f3 100%);
	border-radius: 12px;
	margin-bottom: 12px;
}

.virtual-list {
	border: 2px solid #e8e8e8;
	border-radius: 12px;
	background: white;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	overflow: hidden;
}

.virtual-list.custom {
	border-color: #42b883;
	box-shadow: 0 4px 12px rgba(66, 184, 131, 0.15);
}

.virtual-item {
	padding: 10px 14px;
	border-bottom: 1px solid #f0f0f0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.info {
	margin-top: 16px;
	font-size: 14px;
	color: #666;
	padding: 10px 16px;
	background: white;
	border-radius: 8px;
	border-left: 3px solid #42b883;
	display: inline-block;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 16px;
	padding: 10px 16px;
	background: white;
	border-radius: 8px;
	display: inline-block;
}

.api-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
	background: white;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.api-table th,
.api-table td {
	padding: 14px 16px;
	text-align: left;
	border-bottom: 1px solid #f0f0f0;
}

.api-table th {
	background: linear-gradient(135deg, #f8f9fa 0%, #f0f1f3 100%);
	font-weight: 600;
	color: #333;
}

.api-table tr:last-child td {
	border-bottom: none;
}

.api-table tr:hover td {
	background: #fafafa;
}
</style>
