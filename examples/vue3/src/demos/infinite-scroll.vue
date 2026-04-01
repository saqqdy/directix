<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useInfiniteScroll } from 'directix'

// ==================== Composable API ====================
// Composable infinite scroll refs
const composableContainerRef = ref<HTMLElement | null>(null)
const composableItems = ref<string[]>(Array.from({ length: 10 }, (_, i) => `Composable Item ${i + 1}`))
const composablePage = ref(1)

// useInfiniteScroll composable
const { bind: bindInfiniteScroll, loading: composableLoading, finished: composableFinished } = useInfiniteScroll({
	onLoad: async () => {
		await new Promise(resolve => setTimeout(resolve, 800))
		const newItems = Array.from({ length: 5 }, (_, i) => `Composable Item ${composableItems.value.length + i + 1}`)
		composableItems.value.push(...newItems)
		composablePage.value++
		if (composableItems.value.length >= 30) {
			composableFinished.value = true
		}
	},
	distance: 50,
})

onMounted(() => {
	if (composableContainerRef.value) {
		bindInfiniteScroll(composableContainerRef.value)
	}
})

const composableCode = `<script setup>
import { ref, onMounted } from 'vue'
import { useInfiniteScroll } from 'directix'

const containerRef = ref(null)
const items = ref([])
const page = ref(1)

const { bind, loading, finished } = useInfiniteScroll({
  onLoad: async () => {
    const newItems = await fetchItems(page.value++)
    items.value.push(...newItems)
    if (newItems.length === 0) finished.value = true
  },
  distance: 100,
})

onMounted(() => bind(containerRef.value))
<\/script>

<template>
  <div ref="containerRef" class="scroll-container">
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
    <div v-if="loading">Loading...</div>
    <div v-if="finished">No more items</div>
  </div>
</template>`

// ==================== Directive API ====================
// Scenario 1: Basic infinite scroll
const items1 = ref(Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`))
const loading1 = ref(false)
const loadMore1 = async () => {
	loading1.value = true
	await new Promise(resolve => setTimeout(resolve, 1000))
	const newItems = Array.from({ length: 5 }, (_, i) => `Item ${items1.value.length + i + 1}`)
	items1.value.push(...newItems)
	loading1.value = false
}

// Scenario 2: With distance
const items2 = ref(Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`))
const loading2 = ref(false)
const loadMore2 = async () => {
	loading2.value = true
	await new Promise(resolve => setTimeout(resolve, 800))
	const newItems = Array.from({ length: 5 }, (_, i) => `Item ${items2.value.length + i + 1}`)
	items2.value.push(...newItems)
	loading2.value = false
}

// Scenario 3: Disabled state
const items3 = ref(Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`))
const loading3 = ref(false)
const disabled3 = ref(false)
const loadMore3 = async () => {
	loading3.value = true
	await new Promise(resolve => setTimeout(resolve, 600))
	const newItems = Array.from({ length: 5 }, (_, i) => `Item ${items3.value.length + i + 1}`)
	items3.value.push(...newItems)
	loading3.value = false
	if (items3.value.length >= 30) {
		disabled3.value = true
	}
}

const basicCode = `<div v-infinite-scroll="loadMore" class="scroll-container">
  <div v-for="item in items" :key="item">
    {{ item }}
  </div>
</div>`

const distanceCode = `<div v-infinite-scroll="{ handler: loadMore, distance: 100 }">
  Load more when 100px from bottom
</div>`

const disabledCode = `<div v-infinite-scroll="{ handler: loadMore, disabled: isComplete }">
  <div v-for="item in items" :key="item">{{ item }}</div>
  <p v-if="isComplete">All items loaded</p>
</div>`
</script>

<template>
	<div class="demo-page">
		<h1>v-infinite-scroll</h1>
		<p class="intro">
			A directive that triggers loading when the user scrolls near the bottom. Perfect for pagination and endless lists.
		</p>

		<!-- Scenario 1: Basic infinite scroll -->
		<DemoSection title="Basic Usage" description="Load more items when scrolling to bottom">
			<div class="demo-box">
				<div v-infinite-scroll="loadMore1" class="scroll-container">
					<div v-for="item in items1" :key="item" class="list-item">
						{{ item }}
					</div>
					<div v-if="loading1" class="loading-indicator">
						Loading more...
					</div>
				</div>
				<p class="hint">Scroll to the bottom to load more items</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With distance -->
		<DemoSection title="Preload Distance" description="Start loading before reaching the bottom">
			<div class="demo-box">
				<div v-infinite-scroll="{ handler: loadMore2, distance: 100 }" class="scroll-container">
					<div v-for="item in items2" :key="item" class="list-item">
						{{ item }}
					</div>
					<div v-if="loading2" class="loading-indicator">
						Preloading...
					</div>
				</div>
				<p class="hint">Loads when 100px from bottom</p>
			</div>
			<CodeBlock :code="distanceCode" />
		</DemoSection>

		<!-- Scenario 3: Disabled state -->
		<DemoSection title="Disable When Complete" description="Stop loading when all items are loaded">
			<div class="demo-box">
				<div v-infinite-scroll="{ handler: loadMore3, disabled: disabled3 }" class="scroll-container">
					<div v-for="item in items3" :key="item" class="list-item">
						{{ item }}
					</div>
					<div v-if="loading3" class="loading-indicator">
						Loading...
					</div>
					<div v-if="disabled3" class="complete-indicator">
						All items loaded! ({{ items3.length }} items)
					</div>
				</div>
				<p class="hint">Stops loading after 30 items</p>
			</div>
			<CodeBlock :code="disabledCode" />
		</DemoSection>

		<!-- Composable API Demo -->
		<DemoSection title="Composable API" description="Using useInfiniteScroll for programmatic infinite scroll">
			<div class="demo-box">
				<div ref="composableContainerRef" class="scroll-container composable-scroll">
					<div v-for="item in composableItems" :key="item" class="list-item">
						{{ item }}
					</div>
					<div v-if="composableLoading" class="loading-indicator">
						Loading via composable...
					</div>
					<div v-if="composableFinished" class="complete-indicator">
						All items loaded! ({{ composableItems.length }} items)
					</div>
				</div>
				<p class="hint">Using useInfiniteScroll composable - stops after 30 items</p>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>

		<!-- API Reference -->
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
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>Function to call when scrolling to bottom (required)</td>
					</tr>
					<tr>
						<td>distance</td>
						<td>Number</td>
						<td>0</td>
						<td>Distance from bottom to trigger load (px)</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable infinite scroll</td>
					</tr>
					<tr>
						<td>loading</td>
						<td>Boolean</td>
						<td>false</td>
						<td>External loading state</td>
					</tr>
					<tr>
						<td>throttle</td>
						<td>Number</td>
						<td>200</td>
						<td>Throttle time in ms</td>
					</tr>
					<tr>
						<td>useIntersection</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Use IntersectionObserver</td>
					</tr>
					<tr>
						<td>container</td>
						<td>String/Element</td>
						<td>-</td>
						<td>Custom scroll container</td>
					</tr>
					<tr>
						<td>onLoadStart</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when load starts</td>
					</tr>
					<tr>
						<td>onLoadEnd</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when load ends</td>
					</tr>
					<tr>
						<td>onError</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback on error</td>
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

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
}

.scroll-container {
	height: 250px;
	overflow-y: auto;
	background: white;
	border-radius: 8px;
	border: 2px solid #e0e0e0;
}

.composable-scroll {
	border-color: #667eea;
}

.list-item {
	padding: 16px 20px;
	border-bottom: 1px solid #f0f0f0;
}

.list-item:last-child {
	border-bottom: none;
}

.loading-indicator {
	padding: 20px;
	text-align: center;
	color: #667eea;
	font-weight: 500;
}

.complete-indicator {
	padding: 20px;
	text-align: center;
	color: #48bb78;
	font-weight: 500;
	background: #f0fff4;
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

.api-table code {
	background: #f0f0f0;
	padding: 2px 6px;
	border-radius: 4px;
	font-size: 13px;
}
</style>
