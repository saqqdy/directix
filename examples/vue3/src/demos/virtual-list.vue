<script setup lang="ts">
import { ref, computed } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useVirtualList } from 'directix'

// ==================== Composable API ====================
// Generate large dataset for composable
const composableItems = computed(() =>
	Array.from({ length: 10000 }, (_, i) => ({
		id: i,
		name: `Composable Item ${i + 1}`,
		value: Math.floor(Math.random() * 1000)
	}))
)

// useVirtualList composable
const {
	visibleItems: composableVisibleItems,
	totalHeight: composableTotalHeight,
	containerRef: composableContainerRef,
	listStyle: composableListStyle,
	startIndex: composableStartIndex,
	endIndex: composableEndIndex,
	scrollToIndex
} = useVirtualList({
	items: composableItems,
	itemSize: 50,
	height: 400,
	overscan: 3
})

const composableCode = `<script setup>
import { ref, computed } from 'vue'
import { useVirtualList } from 'directix'

const items = computed(() =>
  Array.from({ length: 10000 }, (_, i) => ({ id: i, name: \`Item \${i + 1}\` }))
)

const {
  visibleItems,
  totalHeight,
  containerRef,
  listStyle,
  startIndex,
  endIndex,
  scrollToIndex
} = useVirtualList({
  items,
  itemSize: 50,
  height: 600,
  overscan: 5
})
<\/script>

<template>
  <div ref="containerRef" :style="listStyle">
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <div
        v-for="{ item, index, style } in visibleItems"
        :key="item.id"
        :style="style"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>`

// ==================== Directive API ====================
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
  render: (item, index) => \`<div class="custom-item">
    <strong>\${item.name}</strong>
    <span>\${item.value}</span>
  </div>\`
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

		<!-- Composable API Demo -->
		<DemoSection title="Composable API" description="Using useVirtualList for programmatic virtual list">
			<div class="demo-box">
				<div ref="composableContainerRef" :style="composableListStyle" class="virtual-list composable">
					<div :style="{ height: composableTotalHeight + 'px', position: 'relative' }">
						<div
							v-for="{ item, index, style } in composableVisibleItems"
							:key="item.id"
							:style="style"
							class="virtual-item"
						>
							<span class="item-index">{{ index }}</span>
							<span class="item-name">{{ item.name }}</span>
							<span class="item-value">{{ item.value }}</span>
						</div>
					</div>
				</div>
				<div class="composable-info">
					<p class="info">
						Showing items: {{ composableStartIndex }} - {{ composableEndIndex }} of {{ composableItems.length }}
					</p>
					<div class="scroll-controls">
						<button @click="scrollToIndex(0)">Scroll to Top</button>
						<button @click="scrollToIndex(5000)">Scroll to 5000</button>
						<button @click="scrollToIndex(9999)">Scroll to End</button>
					</div>
				</div>
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
	border-color: #667eea;
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.virtual-list.composable {
	border-color: #8b5cf6;
	box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}

.virtual-item {
	display: flex;
	align-items: center;
	padding: 0 16px;
	border-bottom: 1px solid #f0f0f0;
	box-sizing: border-box;
}

.item-index {
	width: 60px;
	color: #888;
	font-size: 12px;
	font-family: monospace;
}

.item-name {
	flex: 1;
	font-weight: 500;
}

.item-value {
	color: #8b5cf6;
	font-weight: 600;
}

.info {
	margin-top: 16px;
	font-size: 14px;
	color: #666;
	padding: 10px 16px;
	background: white;
	border-radius: 8px;
	border-left: 3px solid #667eea;
	display: inline-block;
}

.composable-info {
	margin-top: 16px;
}

.composable-info .info {
	border-left-color: #8b5cf6;
}

.scroll-controls {
	display: flex;
	gap: 8px;
	margin-top: 12px;
}

.scroll-controls button {
	padding: 8px 16px;
	background: #8b5cf6;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 13px;
	transition: background 0.2s;
}

.scroll-controls button:hover {
	background: #7c3aed;
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
