<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useLoading } from 'directix'

export default defineComponent({
	name: 'LoadingDemo',
	setup() {
		const isLoading1 = ref(false)
		const toggleLoading1 = () => {
			isLoading1.value = true
			setTimeout(() => {
				isLoading1.value = false
			}, 2000)
		}

		const isLoading2 = ref(false)
		const startLoading2 = () => {
			isLoading2.value = true
			setTimeout(() => {
				isLoading2.value = false
			}, 2000)
		}

		const isLoading3 = ref(false)
		const startLoading3 = () => {
			isLoading3.value = true
			setTimeout(() => {
				isLoading3.value = false
			}, 2000)
		}

		const isLoading4 = ref(false)
		const startLoading4 = () => {
			isLoading4.value = true
			setTimeout(() => {
				isLoading4.value = false
			}, 3000)
		}

		const basicCode = `<div v-loading="isLoading">
  Content here
</div>

<button @click="isLoading = true">Start Loading</button>`

		const textCode = `<div v-loading="{ value: isLoading, text: 'Loading data...' }">
  Content here
</div>`

		const fullscreenCode = `<div
  v-loading="isLoading"
  class="fullscreen-container"
>
  Full screen loading
</div>`

		const lockCode = `<div v-loading="{ value: isLoading, lock: true }">
  Content is locked while loading
</div>`

		// Composable API demo
		const composableRef = ref<HTMLElement | null>(null)
		const { loading, start, stop, bind } = useLoading({
			text: 'Processing...',
			lock: true
		})

		const toggleComposableLoading = () => {
			start()
			setTimeout(() => {
				stop()
			}, 2000)
		}

		onMounted(() => {
			if (composableRef.value) {
				bind(composableRef.value)
			}
		})

		const composableCode = `<script setup>
import { ref, onMounted } from 'vue'
import { useLoading } from 'directix'

const containerRef = ref(null)
const { loading, start, stop, bind } = useLoading({
  text: 'Loading...',
  lock: true
})

onMounted(() => bind(containerRef.value))

async function fetchData() {
  start()
  await api.getData()
  stop()
}
<\/script>

<template>
  <div ref="containerRef">
    <button @click="fetchData">Fetch Data</button>
  </div>
</template>`

		return {
			isLoading1,
			toggleLoading1,
			isLoading2,
			startLoading2,
			isLoading3,
			startLoading3,
			isLoading4,
			startLoading4,
			basicCode,
			textCode,
			fullscreenCode,
			lockCode,
			// Composable API
			composableRef,
			loading,
			toggleComposableLoading,
			composableCode
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-loading</h1>
		<p class="intro">
			A directive that displays a loading overlay on elements. Perfect for indicating async operations.
		</p>

		<!-- Scenario 1: Basic loading -->
		<div class="demo-section">
			<h2>Basic Usage</h2>
			<p class="description">Show loading overlay while processing</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="toggleLoading1" :disabled="isLoading1">
						{{ isLoading1 ? 'Loading...' : 'Start Loading' }}
					</button>
				</div>
				<div v-loading="isLoading1" class="loading-container">
					<p>This content will be covered by loading overlay</p>
					<p>Click the button to see the loading effect</p>
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: With text -->
		<div class="demo-section">
			<h2>With Loading Text</h2>
			<p class="description">Display custom text during loading</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="startLoading2" :disabled="isLoading2">
						Load with Text
					</button>
				</div>
				<div v-loading="{ value: isLoading2, text: 'Fetching data...' }" class="loading-container">
					<p>Loading with custom text message</p>
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ textCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 3: Full screen loading -->
		<div class="demo-section">
			<h2>Full Screen Loading</h2>
			<p class="description">Cover the entire viewport</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="startLoading3" :disabled="isLoading3">
						Full Screen Loading
					</button>
				</div>
			</div>
			<div v-if="isLoading3" v-loading="true" class="fullscreen-overlay"></div>
			<div class="code-block">
				<pre><code>{{ fullscreenCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 4: With lock -->
		<div class="demo-section">
			<h2>With Scroll Lock</h2>
			<p class="description">Lock scrolling while loading</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="startLoading4" :disabled="isLoading4">
						Load with Lock
					</button>
				</div>
				<div v-loading="{ value: isLoading4, lock: true }" class="loading-container scrollable">
					<p v-for="i in 10" :key="i">Scrollable content line {{ i }}</p>
				</div>
				<p class="hint">Scrolling is locked while loading</p>
			</div>
			<div class="code-block">
				<pre><code>{{ lockCode }}</code></pre>
			</div>
		</div>

		<!-- Composable API -->
		<div class="demo-section">
			<h2>Composable API</h2>
			<p class="description">Use useLoading for programmatic control</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="toggleComposableLoading" :disabled="loading">
						{{ loading ? 'Loading...' : 'Start Loading (Composable)' }}
					</button>
				</div>
				<div ref="composableRef" class="loading-container">
					<p>This container uses the composable API</p>
					<p>The loading state is managed programmatically</p>
				</div>
				<p class="hint">Loading state: {{ loading ? 'Active' : 'Inactive' }}</p>
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
						<td>value</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Loading state</td>
					</tr>
					<tr>
						<td>text</td>
						<td>String</td>
						<td>-</td>
						<td>Loading text to display</td>
					</tr>
					<tr>
						<td>spinner</td>
						<td>String</td>
						<td>-</td>
						<td>Custom spinner HTML</td>
					</tr>
					<tr>
						<td>background</td>
						<td>String</td>
						<td>'rgba(255,255,255,0.9)'</td>
						<td>Background color</td>
					</tr>
					<tr>
						<td>lock</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Lock scroll while loading</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable loading</td>
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

.controls {
	margin-bottom: 16px;
}

.btn {
	padding: 10px 20px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
}

.btn:hover:not(:disabled) {
	background: #3aa876;
}

.btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.loading-container {
	position: relative;
	min-height: 120px;
	padding: 20px;
	background: white;
	border-radius: 8px;
	border: 1px solid #e0e0e0;
}

.loading-container.scrollable {
	max-height: 150px;
	overflow-y: auto;
}

.fullscreen-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
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

<style>
/* Global loading styles */
.v-loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.v-loading__spinner {
	width: 40px;
	height: 40px;
	animation: rotate 2s linear infinite;
}

.v-loading__circular {
	stroke: currentColor;
	stroke-dasharray: 90, 150;
	stroke-dashoffset: 0;
	stroke-linecap: round;
	animation: dash 1.5s ease-in-out infinite;
}

.v-loading__path {
	stroke: #42b883;
}

.v-loading__text {
	margin-top: 12px;
	color: #666;
	font-size: 14px;
}

@keyframes rotate {
	100% {
		transform: rotate(360deg);
	}
}

@keyframes dash {
	0% {
		stroke-dasharray: 1, 150;
		stroke-dashoffset: 0;
	}
	50% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -35;
	}
	100% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -124;
	}
}
</style>
