<script setup lang="ts">
import { ref } from 'vue'
import { useLoading } from 'directix'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

// Scenario 1: Basic loading
const isLoading1 = ref(false)
const toggleLoading1 = () => {
	isLoading1.value = true
	setTimeout(() => {
		isLoading1.value = false
	}, 2000)
}

// Scenario 2: With text
const isLoading2 = ref(false)
const startLoading2 = () => {
	isLoading2.value = true
	setTimeout(() => {
		isLoading2.value = false
	}, 2000)
}

// Scenario 3: Full screen loading
const isLoading3 = ref(false)
const startLoading3 = () => {
	isLoading3.value = true
	setTimeout(() => {
		isLoading3.value = false
	}, 2000)
}

// Scenario 4: With lock
const isLoading4 = ref(false)
const startLoading4 = () => {
	isLoading4.value = true
	setTimeout(() => {
		isLoading4.value = false
	}, 3000)
}

// Composable API
const composableContainerRef = ref<HTMLElement | null>(null)
const { isLoading: composableIsLoading, setLoading } = useLoading(composableContainerRef)

const toggleComposableLoading = () => {
	setLoading(true)
	setTimeout(() => {
		setLoading(false)
	}, 2000)
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

const composableCode = `import { ref } from 'vue'
import { useLoading } from 'directix'

const containerRef = ref<HTMLElement | null>(null)
const { isLoading, setLoading } = useLoading(containerRef)

const startLoading = () => {
  setLoading(true)
  // ... async operation
  setLoading(false)
}

// In template: <div ref="containerRef">Content</div>`
</script>

<template>
	<div class="demo-page">
		<h1>v-loading</h1>
		<p class="intro">
			A directive that displays a loading overlay on elements. Perfect for indicating async operations.
		</p>

		<!-- Scenario 1: Basic loading -->
		<DemoSection title="Basic Usage" description="Show loading overlay while processing">
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
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With text -->
		<DemoSection title="With Loading Text" description="Display custom text during loading">
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
			<CodeBlock :code="textCode" />
		</DemoSection>

		<!-- Scenario 3: Full screen loading -->
		<DemoSection title="Full Screen Loading" description="Cover the entire viewport">
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="startLoading3" :disabled="isLoading3">
						Full Screen Loading
					</button>
				</div>
			</div>
			<div v-if="isLoading3" v-loading="true" class="fullscreen-overlay"></div>
			<CodeBlock :code="fullscreenCode" />
		</DemoSection>

		<!-- Scenario 4: With lock -->
		<DemoSection title="With Scroll Lock" description="Lock scrolling while loading">
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
			<CodeBlock :code="lockCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API" description="Use useLoading for programmatic loading control">
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="toggleComposableLoading" :disabled="composableIsLoading">
						{{ composableIsLoading ? 'Loading...' : 'Start Loading (Composable)' }}
					</button>
				</div>
				<div ref="composableContainerRef" v-loading="composableIsLoading" class="loading-container">
					<p>Composable loading content</p>
					<p>Using useLoading for programmatic control</p>
				</div>
				<p class="hint">Using useLoading composable for programmatic loading</p>
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

.controls {
	margin-bottom: 16px;
}

.btn {
	padding: 10px 20px;
	background: #667eea;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
}

.btn:hover:not(:disabled) {
	background: #5a6fd6;
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
	stroke: #667eea;
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
