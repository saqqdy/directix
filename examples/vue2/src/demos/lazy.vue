<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'LazyDemo',
	setup() {
		const basicImageUrl = 'https://picsum.photos/400/300?random=1'
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

		return {
			basicImageUrl,
			placeholderUrl,
			imageUrl,
			errorImageUrl,
			handleLoad,
			basicCode,
			optionsCode,
			bgCode
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-lazy</h1>
		<p class="intro">
			A directive for lazy loading images when they enter the viewport. Supports both img elements and background images.
		</p>

		<!-- Scenario 1: Basic usage -->
		<div class="demo-section">
			<h2>Basic Usage</h2>
			<p class="description">Image loads when it enters the viewport</p>
			<div class="demo-box">
				<div class="image-container">
					<img v-lazy="basicImageUrl" alt="Lazy loaded image" class="demo-image" />
				</div>
				<p class="hint">Scroll down to see lazy loading in action</p>
			</div>
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: With placeholder and error handling -->
		<div class="demo-section">
			<h2>With Placeholder & Error Handling</h2>
			<p class="description">Shows placeholder while loading, error image on failure</p>
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
			<div class="code-block">
				<pre><code>{{ optionsCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 3: Background image lazy loading -->
		<div class="demo-section">
			<h2>Background Image</h2>
			<p class="description">Lazy load background images on any element</p>
			<div class="demo-box">
				<div
					v-lazy="'https://picsum.photos/400/200?random=3'"
					class="background-container"
				>
					<span class="bg-text">Lazy Background Image</span>
				</div>
				<p class="hint">Works with background-image property</p>
			</div>
			<div class="code-block">
				<pre><code>{{ bgCode }}</code></pre>
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
