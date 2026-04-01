<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { usePullRefresh } from 'directix'

// Basic Usage
const basicItems = ref(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8'])
const basicState = ref('')
let basicCounter = 8

const handleBasicRefresh = async () => {
	basicState.value = 'Refreshing...'
	await new Promise(resolve => setTimeout(resolve, 1500))
	basicCounter++
	basicItems.value.unshift(`Item ${basicCounter}`)
	basicItems.value.pop()
	basicState.value = 'Done!'
	setTimeout(() => {
		basicState.value = ''
	}, 1000)
}

// Custom Options
const customItems = ref(['Item A', 'Item B', 'Item C', 'Item D', 'Item E', 'Item F', 'Item G', 'Item H'])
const customState = ref('')
let customCounter = 8

const handleCustomRefresh = async () => {
	customState.value = 'Refreshing...'
	await new Promise(resolve => setTimeout(resolve, 1500))
	customCounter++
	customItems.value.unshift(`Item ${String.fromCharCode(64 + customCounter)}`)
	customItems.value.pop()
	customState.value = 'Done!'
	setTimeout(() => {
		customState.value = ''
	}, 1000)
}

// Composable API demo
const composableItems = ref(['Composable 1', 'Composable 2', 'Composable 3', 'Composable 4', 'Composable 5'])
let composableCounter = 5

const composablePullRefresh = usePullRefresh({
	handler: async () => {
		await new Promise(resolve => setTimeout(resolve, 1500))
		composableCounter++
		composableItems.value.unshift(`Composable ${composableCounter}`)
		composableItems.value.pop()
	},
	distance: 60,
	maxDistance: 100,
})

const basicCode = `<div v-pull-refresh="handleRefresh" class="container">
  <div v-for="item in items" :key="item" class="item">
    {{ item }}
  </div>
</div>`

const optionsCode = `<div v-pull-refresh="{
  handler: handleRefresh,
  distance: 80,
  indicator: {
    pulling: 'Pull to refresh',
    ready: 'Release to refresh',
    loading: 'Refreshing...',
    success: 'Done!',
    error: 'Failed'
  }
}">
  Content here
</div>`

const composableCode = `import { ref } from 'vue'
import { usePullRefresh } from 'directix'

const items = ref(['Item 1', 'Item 2', 'Item 3'])

const { state, distance, events, containerRef, refresh } = usePullRefresh({
  handler: async () => {
    await fetchData()
  },
  distance: 60,
  maxDistance: 100
})

// In template:
// <div
//   ref="containerRef"
//   @touchstart="events.touchstart"
//   @touchmove="events.touchmove"
//   @touchend="events.touchend"
// >`
</script>

<template>
	<div class="demo-page">
		<h1>v-pull-refresh</h1>
		<p class="intro">
			Enables pull-to-refresh functionality on mobile devices. Triggers a refresh action when the user pulls down.
		</p>

		<DemoSection title="Basic Usage" description="Pull down to trigger refresh">
			<div class="demo-box">
				<div
					v-pull-refresh="handleBasicRefresh"
					class="refresh-container"
				>
					<p v-for="(item, index) in basicItems" :key="index" class="list-item">
						{{ item }}
					</p>
				</div>
				<p class="status" v-if="basicState">{{ basicState }}</p>
				<p class="hint">Pull down on touch device to refresh (scroll to top first)</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<DemoSection title="Custom Options" description="Customize distance and indicators">
			<div class="demo-box">
				<div
					v-pull-refresh="{
						handler: handleCustomRefresh,
						distance: 80,
						successDuration: 800
					}"
					class="refresh-container"
				>
					<p v-for="(item, index) in customItems" :key="index" class="list-item">
						{{ item }}
					</p>
				</div>
				<p class="status" v-if="customState">{{ customState }}</p>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<DemoSection title="Composable API - usePullRefresh" description="Using usePullRefresh composable for programmatic control">
			<div class="demo-box">
				<div
					ref="composablePullRefresh.containerRef"
					class="refresh-container"
					@touchstart="composablePullRefresh.events.touchstart"
					@touchmove="composablePullRefresh.events.touchmove"
					@touchend="composablePullRefresh.events.touchend"
				>
					<p v-for="(item, index) in composableItems" :key="index" class="list-item">
						{{ item }}
					</p>
				</div>
				<p class="status">State: {{ composablePullRefresh.state.value }}</p>
				<p class="hint">This uses the usePullRefresh composable with manual event binding</p>
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
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>Refresh handler (required, async supported)</td>
					</tr>
					<tr>
						<td>distance</td>
						<td>Number</td>
						<td>60</td>
						<td>Distance to trigger refresh (px)</td>
					</tr>
					<tr>
						<td>maxDistance</td>
						<td>Number</td>
						<td>100</td>
						<td>Maximum pull distance (px)</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable pull-to-refresh</td>
					</tr>
					<tr>
						<td>indicator</td>
						<td>Object</td>
						<td>-</td>
						<td>Custom indicator text per state</td>
					</tr>
					<tr>
						<td>successDuration</td>
						<td>Number</td>
						<td>500</td>
						<td>Duration to show success (ms)</td>
					</tr>
					<tr>
						<td>errorDuration</td>
						<td>Number</td>
						<td>1000</td>
						<td>Duration to show error (ms)</td>
					</tr>
					<tr>
						<td>onStateChange</td>
						<td>Function</td>
						<td>-</td>
						<td>State change callback</td>
					</tr>
				</tbody>
			</table>

			<h4 style="margin-top: 20px;">Indicator States</h4>
			<ul class="arg-list">
				<li><code>pulling</code> - While pulling down</li>
				<li><code>ready</code> - Ready to trigger</li>
				<li><code>loading</code> - Refresh in progress</li>
				<li><code>success</code> - Refresh completed</li>
				<li><code>error</code> - Refresh failed</li>
			</ul>
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

.refresh-container {
	height: 300px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	background: white;
}

.list-item {
	padding: 12px 16px;
	background: #f8f9fa;
	border-bottom: 1px solid #e0e0e0;
}

.list-item:last-child {
	border-bottom: none;
}

.status {
	margin-top: 12px;
	font-size: 14px;
	color: #667eea;
	font-weight: 600;
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

.arg-list {
	margin-top: 8px;
	padding-left: 20px;
}

.arg-list li {
	margin: 4px 0;
}

.arg-list code {
	background: #f0f0f0;
	padding: 2px 6px;
	border-radius: 4px;
}
</style>
