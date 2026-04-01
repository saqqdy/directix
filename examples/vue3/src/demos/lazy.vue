<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useLazy } from 'directix'

// Composable API demo
const lazyImageRef = ref<HTMLImageElement | null>(null)
const { state, isLoading, isLoaded, bind } = useLazy({
	src: 'https://picsum.photos/400/300?random=10',
	placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e0e0e0" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ELoading...%3C/text%3E%3C/svg%3E',
	onLoad: () => {
		console.log('Composable: Image loaded')
	}
})

onMounted(() => {
	if (lazyImageRef.value) {
		bind(lazyImageRef.value)
	}
})

const composableCode = `import { ref, onMounted } from 'vue'
import { useLazy } from 'directix'

const imageRef = ref(null)
const { state, isLoading, isLoaded, bind } = useLazy({
	src: 'https://example.com/image.jpg',
	placeholder: '/placeholder.jpg',
	onLoad: (el) => console.log('Loaded!')
})

onMounted(() => {
	if (imageRef.value) {
		bind(imageRef.value)
	}
})`

// Scenario 1: Basic usage
const basicImageUrl = 'https://picsum.photos/400/300?random=1'

// Scenario 2: With placeholder and error handling
const placeholderUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ccc" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ELoading...%3C/text%3E%3C/svg%3E'
const imageUrl = 'https://picsum.photos/400/300?random=2'
const errorImageUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23fee" width="400" height="300"/%3E%3Ctext fill="%23c00" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EFailed to load%3C/text%3E%3C/svg%3E'

const handleLoad = () => {
	// Image loaded callback
}

const basicCode = `<img v-lazy="imageUrl" alt="Lazy loaded image" />`

const optionsCode = `<img
  v-lazy="{
    src: imageUrl,
    placeholder: placeholderUrl,
    error: errorImageUrl,
    onLoad: handleLoad
  }"
  alt="Lazy loaded image with options"
/>`

const bgCode = `<div
  v-lazy="backgroundImageUrl"
  class="background-container"
>
  Lazy background image
</div>`
</script>

<template>
	<div class="demo-page">
		<h1>v-lazy</h1>
		<p class="intro">
			A directive for lazy loading images when they enter the viewport. Supports both img elements and background images.
		</p>

		<!-- Scenario 1: Basic usage -->
		<DemoSection title="Basic Usage" description="Image loads when it enters the viewport">
			<div class="demo-box">
				<div class="image-container">
					<img v-lazy="basicImageUrl" alt="Lazy loaded image" class="demo-image" />
				</div>
				<p class="hint">Scroll down to see lazy loading in action</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With placeholder and error handling -->
		<DemoSection title="With Placeholder & Error Handling" description="Shows placeholder while loading, error image on failure">
			<div class="demo-box">
				<div class="image-container">
					<img
						v-lazy="{
							src: imageUrl,
							placeholder: placeholderUrl,
							error: errorImageUrl,
							onLoad: handleLoad
						}"
						alt="Lazy loaded image with options"
						class="demo-image"
					/>
				</div>
				<p class="hint">Placeholder shows while image loads</p>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Scenario 3: Background image lazy loading -->
		<DemoSection title="Background Image" description="Lazy load background images on any element">
			<div class="demo-box">
				<div
					v-lazy="'https://picsum.photos/400/200?random=3'"
					class="background-container"
				>
					<span class="bg-text">Lazy Background Image</span>
				</div>
				<p class="hint">Works with background-image property</p>
			</div>
			<CodeBlock :code="bgCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API (useLazy)" description="Use useLazy for programmatic lazy loading control">
			<div class="demo-box">
				<div class="image-container">
					<img ref="lazyImageRef" alt="Composable lazy loaded image" class="demo-image" />
				</div>
				<div class="state-info">
					<span class="state-label">State:</span>
					<span class="state-value" :class="state">{{ state }}</span>
					<span v-if="isLoading" class="loading-indicator">Loading...</span>
					<span v-if="isLoaded" class="loaded-indicator">Loaded!</span>
				</div>
				<p class="hint">Using useLazy composable for manual binding and state tracking</p>
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
						<td>src</td>
						<td>String</td>
						<td>-</td>
						<td>Image source URL (required)</td>
					</tr>
					<tr>
						<td>placeholder</td>
						<td>String</td>
						<td>-</td>
						<td>Placeholder image URL</td>
					</tr>
					<tr>
						<td>error</td>
						<td>String</td>
						<td>-</td>
						<td>Error image URL when loading fails</td>
					</tr>
					<tr>
						<td>preload</td>
						<td>Number</td>
						<td>0</td>
						<td>Preload distance in pixels</td>
					</tr>
					<tr>
						<td>attempt</td>
						<td>Number</td>
						<td>1</td>
						<td>Number of retry attempts</td>
					</tr>
					<tr>
						<td>onLoad</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when image loads successfully</td>
					</tr>
					<tr>
						<td>onError</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when image fails to load</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable lazy loading</td>
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

.image-container {
	display: inline-block;
	border-radius: 8px;
	overflow: hidden;
}

.demo-image {
	display: block;
	max-width: 100%;
	height: auto;
	border-radius: 8px;
}

.background-container {
	width: 400px;
	height: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	background-size: cover;
	background-position: center;
	background-color: #eee;
}

.bg-text {
	background: rgba(0, 0, 0, 0.6);
	color: white;
	padding: 12px 24px;
	border-radius: 6px;
	font-weight: 500;
}

.state-info {
	margin-top: 12px;
	display: flex;
	align-items: center;
	gap: 8px;
}

.state-label {
	font-weight: 500;
	color: #333;
}

.state-value {
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	font-family: monospace;
	background: #e0e0e0;
}

.state-value.pending {
	background: #fff3cd;
	color: #856404;
}

.state-value.loading {
	background: #cce5ff;
	color: #004085;
}

.state-value.loaded {
	background: #d4edda;
	color: #155724;
}

.state-value.error {
	background: #f8d7da;
	color: #721c24;
}

.loading-indicator {
	color: #004085;
	font-size: 12px;
}

.loaded-indicator {
	color: #155724;
	font-size: 12px;
	font-weight: 500;
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
