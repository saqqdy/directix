<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useInfiniteScroll } from 'directix'

export default defineComponent({
	name: 'InfiniteScrollDemo',
	setup() {
		// Directive demos
		const items1 = ref(Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`))
		const loading1 = ref(false)
		const loadMore1 = async () => {
			loading1.value = true
			await new Promise(resolve => setTimeout(resolve, 1000))
			const newItems = Array.from({ length: 5 }, (_, i) => `Item ${items1.value.length + i + 1}`)
			items1.value.push(...newItems)
			loading1.value = false
		}

		const items2 = ref(Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`))
		const loading2 = ref(false)
		const loadMore2 = async () => {
			loading2.value = true
			await new Promise(resolve => setTimeout(resolve, 800))
			const newItems = Array.from({ length: 5 }, (_, i) => `Item ${items2.value.length + i + 1}`)
			items2.value.push(...newItems)
			loading2.value = false
		}

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

		// Composable API
		const containerRef = ref<HTMLElement | null>(null)
		const composableItems = ref<string[]>(Array.from({ length: 10 }, (_, i) => `Composable Item ${i + 1}`))

		const { loading: composableLoading, finished, bind } = useInfiniteScroll({
			onLoad: async () => {
				await new Promise(resolve => setTimeout(resolve, 1000))
				const newItems = Array.from({ length: 5 }, (_, i) => `Composable Item ${composableItems.value.length + i + 1}`)
				composableItems.value.push(...newItems)
				if (composableItems.value.length >= 30) {
					;(finished as any).value = true
				}
			},
		})

		onMounted(() => {
			if (containerRef.value) {
				bind(containerRef.value)
			}
		})

		const basicCode = `<div v-infinite-scroll="loadMore" class="scroll-container">
  <div v-for="item in items" :key="item">
    {{ item }}
  </div>
</div>`

		const distanceCode = `<div v-infinite-scroll="{ handler: loadMore, distance: 100 }">
  Load more when 100px from bottom
</div>`

		const composableCode = `<script lang="ts">
import { ref, onMounted } from 'vue'
import { useInfiniteScroll } from 'directix'

const containerRef = ref<HTMLElement | null>(null)
const items = ref([])
const { loading, finished, bind } = useInfiniteScroll({
  onLoad: async () => {
    const newItems = await fetchItems()
    items.value.push(...newItems)
    if (newItems.length === 0) {
      finished.value = true
    }
  }
})

onMounted(() => {
  if (containerRef.value) {
    bind(containerRef.value)
  }
})
</script>

<template>
  <div ref="containerRef" class="scroll-container">
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
    <div v-if="loading">Loading...</div>
    <div v-if="finished">All loaded!</div>
  </div>
</template>`

		return {
			items1,
			loading1,
			loadMore1,
			items2,
			loading2,
			loadMore2,
			items3,
			loading3,
			disabled3,
			loadMore3,
			basicCode,
			distanceCode,
			// Composable API
			containerRef,
			composableItems,
			composableLoading,
			finished,
			composableCode,
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-infinite-scroll</h1>
		<p class="intro">
			A directive that triggers loading when the user scrolls near the bottom. Perfect for pagination and endless lists.
		</p>

		<!-- Scenario 1: Basic infinite scroll -->
		<div class="demo-section">
			<h2>Basic Usage</h2>
			<p class="description">Load more items when scrolling to bottom</p>
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
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: With distance -->
		<div class="demo-section">
			<h2>Preload Distance</h2>
			<p class="description">Start loading before reaching the bottom</p>
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
			<div class="code-block">
				<pre><code>{{ distanceCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 3: Disabled state -->
		<div class="demo-section">
			<h2>Disable When Complete</h2>
			<p class="description">Stop loading when all items are loaded</p>
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
		</div>

		<!-- Composable API -->
		<div class="demo-section">
			<h2>Composable API</h2>
			<p class="description">Use the composable for programmatic control</p>
			<div class="demo-box">
				<div ref="containerRef" class="scroll-container">
					<div v-for="item in composableItems" :key="item" class="list-item">
						{{ item }}
					</div>
					<div v-if="composableLoading" class="loading-indicator">
						Loading via composable...
					</div>
					<div v-if="finished" class="complete-indicator">
						All composable items loaded!
					</div>
				</div>
				<p class="hint">This list uses the useInfiniteScroll composable</p>
			</div>
			<div class="code-block">
				<pre><code>{{ composableCode }}</code></pre>
			</div>
		</div>

		<!-- API Reference -->
		<div class="demo-section">
			<h2>API</h2>
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
				</tbody>
			</table>
		</div>
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

.demo-section {
	margin-bottom: 32px;
}

.demo-section h2 {
	margin-bottom: 8px;
	font-size: 18px;
}

.description {
	color: #666;
	margin-bottom: 16px;
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
	color: #42b883;
	font-weight: 500;
}

.complete-indicator {
	padding: 20px;
	text-align: center;
	color: #48bb78;
	font-weight: 500;
	background: #f0fff4;
}

.code-block {
	background: #f4f4f5;
	border-radius: 8px;
	padding: 16px;
	overflow-x: auto;
}

.code-block pre {
	margin: 0;
}

.code-block code {
	font-family: 'Monaco', 'Menlo', monospace;
	font-size: 13px;
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
