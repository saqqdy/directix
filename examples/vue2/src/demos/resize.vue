<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useResize } from 'directix'

export default defineComponent({
	name: 'ResizeDemo',
	setup() {
		const dimensions = ref({ width: 0, height: 0 })
		const handleResize = (entry: ResizeObserverEntry) => {
			dimensions.value = {
				width: Math.round(entry.contentRect.width),
				height: Math.round(entry.contentRect.height)
			}
		}

		const debouncedDimensions = ref({ width: 0, height: 0 })
		const resizeCount = ref(0)
		const handleDebouncedResize = (entry: ResizeObserverEntry) => {
			debouncedDimensions.value = {
				width: Math.round(entry.contentRect.width),
				height: Math.round(entry.contentRect.height)
			}
			resizeCount.value++
		}

		const basicCode = `<div v-resize="handleResize" class="resizable">
  Content
<\/div>`

		const debounceCode = `<div v-resize="{ handler: handleResize, debounce: 200 }">
  Debounced resize
<\/div>`

		// Composable API demo
		const composableRef = ref<HTMLElement | null>(null)
		const { width: composableWidth, height: composableHeight, bind } = useResize({
			debounce: 100,
			onResize: (info) => {
				console.log('Composable resize:', info.width, info.height)
			}
		})

		onMounted(() => {
			if (composableRef.value) {
				bind(composableRef.value)
			}
		})

		const composableCode = `<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useResize } from 'directix'

export \default defineComponent({
  setup() {
    const targetRef = ref<HTMLElement | null>(null)
    const { width, height, bind } = useResize({
      debounce: 100,
      onResize: (info) => console.log('Resized:', info)
    })

    onMounted(() => bind(targetRef.value))

    return { targetRef, width, height }
  }
})
<\/script>

<template>
  <div ref="targetRef">
    Size: {{ width }} x {{ height }}
  <\/div>
<\/template>`

		return {
			dimensions,
			handleResize,
			debouncedDimensions,
			resizeCount,
			handleDebouncedResize,
			basicCode,
			debounceCode,
			// Composable API
			composableRef,
			composableWidth,
			composableHeight,
			composableCode
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-resize</h1>
		<p class="intro">
			A directive for observing element resize using ResizeObserver.
		</p>

		<!-- Scenario 1: Basic resize -->
		<div class="demo-section">
			<h2>Basic Usage</h2>
			<p class="description">Track element size changes</p>
			<div class="demo-box">
				<div class="info-panel">
					<div class="info-item">
						Width: <strong>{{ dimensions.width }}px</strong>
					</div>
					<div class="info-item">
						Height: <strong>{{ dimensions.height }}px</strong>
					</div>
				</div>
				<div v-resize="handleResize" class="resizable-box">
					<p>Resize the window or container to see changes</p>
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: With debounce -->
		<div class="demo-section">
			<h2>Debounced Resize</h2>
			<p class="description">Limit how often resize events fire</p>
			<div class="demo-box">
				<div class="info-panel">
					<div class="info-item">
						Width: <strong>{{ debouncedDimensions.width }}px</strong>
					</div>
					<div class="info-item">
						Height: <strong>{{ debouncedDimensions.height }}px</strong>
					</div>
					<div class="info-item">
						Updates: <strong>{{ resizeCount }}</strong>
					</div>
				</div>
				<div v-resize="{ handler: handleDebouncedResize, debounce: 200 }" class="resizable-box">
					<p>Debounced at 200ms</p>
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ debounceCode }}</code></pre>
			</div>
		</div>

		<!-- Composable API -->
		<div class="demo-section">
			<h2>Composable API - useResize</h2>
			<p class="description">Programmatically track element resize using the composable</p>
			<div class="demo-box">
				<div class="info-panel">
					<div class="info-item">
						Width: <strong>{{ Math.round(composableWidth) }}px</strong>
					</div>
					<div class="info-item">
						Height: <strong>{{ Math.round(composableHeight) }}px</strong>
					</div>
				</div>
				<div ref="composableRef" class="resizable-box">
					<p>Resize the window or container to see changes (debounced at 100ms)</p>
				</div>
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
						<td>Resize event handler (required)</td>
					</tr>
					<tr>
						<td>debounce</td>
						<td>Number</td>
						<td>0</td>
						<td>Debounce time in ms</td>
					</tr>
					<tr>
						<td>box</td>
						<td>String</td>
						<td>'content-box'</td>
						<td>Box model to observe</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable resize observer</td>
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
	gap: 16px;
	margin-bottom: 16px;
	flex-wrap: wrap;
}

.info-item {
	background: white;
	padding: 10px 16px;
	border-radius: 6px;
	font-size: 14px;
}

.info-item strong {
	color: #42b883;
}

.resizable-box {
	padding: 30px;
	background: white;
	border: 2px dashed #42b883;
	border-radius: 8px;
	text-align: center;
	min-height: 100px;
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
