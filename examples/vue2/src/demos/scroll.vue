<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useScroll } from 'directix'

export default defineComponent({
	name: 'ScrollDemo',
	setup() {
		const scrollInfo = ref({
			scrollTop: 0,
			progressY: 0,
			directionY: 0 as -1 | 0 | 1,
		})
		const handleBasicScroll = (_e: Event, info: any) => {
			scrollInfo.value = {
				scrollTop: Math.round(info.scrollTop),
				progressY: Math.round(info.progressY * 100),
				directionY: info.directionY,
			}
		}

		const throttledScrollTop = ref(0)
		const handleThrottledScroll = (_e: Event, info: any) => {
			throttledScrollTop.value = Math.round(info.scrollTop)
		}

		const progressWidth = ref(0)
		const handleProgressScroll = (_e: Event, info: any) => {
			progressWidth.value = info.progressY * 100
		}

		// Composable API demo
		const composableRef = ref<HTMLElement>()
		const composableScrollTop = ref(0)
		const composableProgressY = ref(0)
		const composableDirectionY = ref< -1 | 0 | 1>(0)
		const { scrollTop, progressY, directionY, bind } = useScroll()
		onMounted(() => {
			if (composableRef.value) {
				bind(composableRef.value)
			}
		})

		const basicCode = `<div v-scroll="handleScroll" class="scroll-container">
  <div class="content">Scrollable content</div>
</div>`

		const throttledCode = `<div v-scroll="{ handler: handleScroll, throttle: 200 }">
  Throttled scroll events
</div>`

		const composableCode = `import { ref, onMounted } from 'vue'
import { useScroll } from 'directix'

const container = ref()
const { scrollTop, progressY, directionY, bind } = useScroll()

onMounted(() => {
  if (container.value) bind(container.value)
})`

		return {
			scrollInfo,
			handleBasicScroll,
			throttledScrollTop,
			handleThrottledScroll,
			progressWidth,
			handleProgressScroll,
			basicCode,
			throttledCode,
			// Composable API
			composableRef,
			composableScrollTop,
			composableProgressY,
			composableDirectionY,
			scrollTop,
			progressY,
			directionY,
			composableCode
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-scroll</h1>
		<p class="intro">
			A directive for handling scroll events with useful information like scroll position, progress, and direction.
		</p>

		<!-- Scenario 1: Basic scroll tracking -->
		<div class="demo-section">
			<h2>Basic Usage</h2>
			<p class="description">Track scroll position and direction</p>
			<div class="demo-box">
				<div class="info-panel">
					<div class="info-item">
						<span class="label">Scroll Top:</span>
						<span class="value">{{ scrollInfo.scrollTop }}px</span>
					</div>
					<div class="info-item">
						<span class="label">Progress:</span>
						<span class="value">{{ scrollInfo.progressY }}%</span>
					</div>
					<div class="info-item">
						<span class="label">Direction:</span>
						<span class="value">{{ scrollInfo.directionY === 1 ? '↓ Down' : scrollInfo.directionY === -1 ? '↑ Up' : '- None' }}</span>
					</div>
				</div>
				<div v-scroll="handleBasicScroll" class="scroll-container">
					<div class="scroll-content">
						<p v-for="i in 20" :key="i">Scroll line {{ i }}</p>
					</div>
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: Throttled scroll -->
		<div class="demo-section">
			<h2>Throttled Scroll</h2>
			<p class="description">Limit scroll event frequency for better performance</p>
			<div class="demo-box">
				<div class="info-panel">
					<div class="info-item">
						<span class="label">Throttled Position:</span>
						<span class="value">{{ throttledScrollTop }}px</span>
					</div>
				</div>
				<div
					v-scroll="{ handler: handleThrottledScroll, throttle: 200 }"
					class="scroll-container"
				>
					<div class="scroll-content">
						<p v-for="i in 20" :key="i">Line {{ i }} - Updates every 200ms max</p>
					</div>
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ throttledCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 3: Progress indicator -->
		<div class="demo-section">
			<h2>Progress Indicator</h2>
			<p class="description">Show scroll progress as a progress bar</p>
			<div class="demo-box">
				<div class="progress-bar-container">
					<div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
				</div>
				<div v-scroll="handleProgressScroll" class="scroll-container">
					<div class="scroll-content">
						<p v-for="i in 30" :key="i">Content line {{ i }}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Composable API -->
		<div class="demo-section">
			<h2>Composable API</h2>
			<p class="description">Using useScroll composable for programmatic scroll tracking</p>
			<div class="demo-box">
				<div class="info-panel">
					<div class="info-item composable">
						<span class="label">Scroll Top:</span>
						<span class="value">{{ Math.round(scrollTop) }}px</span>
					</div>
					<div class="info-item composable">
						<span class="label">Progress:</span>
						<span class="value">{{ Math.round(progressY * 100) }}%</span>
					</div>
					<div class="info-item composable">
						<span class="label">Direction:</span>
						<span class="value">{{ directionY === 1 ? '↓ Down' : directionY === -1 ? '↑ Up' : '- None' }}</span>
					</div>
				</div>
				<div ref="composableRef" class="scroll-container composable">
					<div class="scroll-content">
						<p v-for="i in 20" :key="i">Composable scroll line {{ i }}</p>
					</div>
				</div>
				<p class="hint">This container uses the useScroll composable instead of the directive</p>
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
						<td>Scroll event handler (required)</td>
					</tr>
					<tr>
						<td>throttle</td>
						<td>Number</td>
						<td>0</td>
						<td>Throttle time in ms</td>
					</tr>
					<tr>
						<td>passive</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Use passive event listener</td>
					</tr>
					<tr>
						<td>container</td>
						<td>String/Element</td>
						<td>-</td>
						<td>Custom scroll container</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable scroll tracking</td>
					</tr>
				</tbody>
			</table>
			<h4 style="margin-top: 20px; margin-bottom: 12px;">ScrollInfo Object</h4>
			<table class="api-table">
				<thead>
					<tr>
						<th>Property</th>
						<th>Type</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>scrollTop</td>
						<td>Number</td>
						<td>Current vertical scroll position</td>
					</tr>
					<tr>
						<td>scrollLeft</td>
						<td>Number</td>
						<td>Current horizontal scroll position</td>
					</tr>
					<tr>
						<td>progressY</td>
						<td>Number</td>
						<td>Vertical scroll progress (0-1)</td>
					</tr>
					<tr>
						<td>progressX</td>
						<td>Number</td>
						<td>Horizontal scroll progress (0-1)</td>
					</tr>
					<tr>
						<td>directionY</td>
						<td>-1 | 0 | 1</td>
						<td>Vertical scroll direction</td>
					</tr>
					<tr>
						<td>directionX</td>
						<td>-1 | 0 | 1</td>
						<td>Horizontal scroll direction</td>
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

.info-panel {
	display: flex;
	gap: 20px;
	margin-bottom: 16px;
	flex-wrap: wrap;
}

.info-item {
	background: white;
	padding: 12px 16px;
	border-radius: 6px;
	display: flex;
	gap: 8px;
	align-items: center;
}

.info-item .label {
	color: #666;
	font-size: 13px;
}

.info-item .value {
	font-weight: 600;
	color: #42b883;
}

.info-item.composable {
	border: 2px solid #f093fb;
}

.info-item.composable .value {
	color: #f5576c;
}

.scroll-container {
	height: 200px;
	overflow-y: auto;
	background: white;
	border-radius: 8px;
	border: 2px solid #e0e0e0;
}

.scroll-container.composable {
	border-color: #f093fb;
}

.scroll-content {
	padding: 20px;
}

.scroll-content p {
	padding: 12px;
	margin: 4px 0;
	background: #f8f9fa;
	border-radius: 4px;
}

.progress-bar-container {
	height: 6px;
	background: #e0e0e0;
	border-radius: 3px;
	margin-bottom: 16px;
	overflow: hidden;
}

.progress-bar {
	height: 100%;
	background: linear-gradient(90deg, #42b883, #35495e);
	border-radius: 3px;
	transition: width 0.1s;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
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
