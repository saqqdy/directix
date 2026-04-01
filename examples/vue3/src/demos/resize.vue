<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useResize } from 'directix'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

// Composable API demo
const composableRef = ref<HTMLElement | null>(null)
const { width: composableWidth, height: composableHeight, bind: bindResize } = useResize({
	debounce: 100,
	onResize: (info) => {
		console.log('Composable resize:', info.width, info.height)
	}
})

onMounted(() => {
	if (composableRef.value) {
		bindResize(composableRef.value)
	}
})

// Scenario 1: Basic resize
const dimensions = ref({ width: 0, height: 0 })
const handleResize = (entry: ResizeObserverEntry) => {
	dimensions.value = {
		width: Math.round(entry.contentRect.width),
		height: Math.round(entry.contentRect.height)
	}
}

// Scenario 2: With debounce
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
</div>`

const debounceCode = `<div v-resize="{ handler: handleResize, debounce: 200 }">
  Debounced resize
</div>`

const boxCode = `<div v-resize="{ handler: handleResize, box: 'border-box' }">
  Track border box size
</div>`

const composableCode = `<script setup>
import { ref, onMounted } from 'vue'
import { useResize } from 'directix'

const target = ref(null)
const { width, height, bind } = useResize({
  debounce: 100,
  onResize: (info) => console.log('Resized:', info.width, info.height)
})

onMounted(() => bind(target.value))
<\/script>

<template>
  <div ref="target">
    Size: {{ width }} x {{ height }}
  </div>
</template>`
</script>

<template>
	<div class="demo-page">
		<h1>v-resize</h1>
		<p class="intro">
			A directive for observing element resize using ResizeObserver. Get notified when an element's size changes.
		</p>

		<!-- Scenario 1: Basic resize -->
		<DemoSection title="Basic Usage" description="Track element size changes">
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
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With debounce -->
		<DemoSection title="Debounced Resize" description="Limit how often resize events fire">
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
			<CodeBlock :code="debounceCode" />
		</DemoSection>

		<!-- Scenario 3: Box model -->
		<DemoSection title="Box Model Options" description="Track different box sizes">
			<div class="demo-box">
				<div class="box-options">
					<div class="box-option">
						<code>content-box</code>
						<span>Content area only</span>
					</div>
					<div class="box-option">
						<code>border-box</code>
						<span>Include padding & border</span>
					</div>
					<div class="box-option">
						<code>device-pixel-content-box</code>
						<span>Device pixels</span>
					</div>
				</div>
			</div>
			<CodeBlock :code="boxCode" />
		</DemoSection>

		<!-- Composable API Demo -->
		<DemoSection title="Composable API (useResize)" description="Using the composable for programmatic resize tracking">
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
					<p>Resize tracked via useResize composable</p>
				</div>
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
						<td>onFallback</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback for browsers without ResizeObserver</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable resize observer</td>
					</tr>
				</tbody>
			</table>
			<h4 style="margin-top: 20px; margin-bottom: 12px;">ResizeInfo Object</h4>
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
						<td>width</td>
						<td>Number</td>
						<td>New width</td>
					</tr>
					<tr>
						<td>height</td>
						<td>Number</td>
						<td>New height</td>
					</tr>
					<tr>
						<td>contentRect</td>
						<td>DOMRectReadOnly</td>
						<td>Content rectangle</td>
					</tr>
					<tr>
						<td>borderBoxSize</td>
						<td>Array</td>
						<td>Border box size</td>
					</tr>
					<tr>
						<td>contentBoxSize</td>
						<td>Array</td>
						<td>Content box size</td>
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
	color: #667eea;
}

.resizable-box {
	padding: 30px;
	background: white;
	border: 2px dashed #667eea;
	border-radius: 8px;
	text-align: center;
	min-height: 100px;
}

.box-options {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.box-option {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	background: white;
	border-radius: 6px;
}

.box-option code {
	background: #f0f0f0;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 13px;
}

.box-option span {
	color: #666;
	font-size: 14px;
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
