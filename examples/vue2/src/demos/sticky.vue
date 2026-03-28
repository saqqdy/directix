<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'StickyDemo',
	setup() {
		const isSticky = ref(false)
		const handleStickyChange = (sticky: boolean) => {
			isSticky.value = sticky
		}

		const basicCode = `<nav v-sticky class="sticky-nav">
  Navigation Content
</nav>`

		const offsetCode = `<div v-sticky="50">
  Sticks 50px from top
</div>`

		const callbackCode = `<div v-sticky="{ top: 0, onChange: handleStickyChange }">
  {{ isSticky ? 'Sticky!' : 'Normal' }}
</div>`

		return {
			isSticky,
			handleStickyChange,
			basicCode,
			offsetCode,
			callbackCode
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-sticky</h1>
		<p class="intro">
			A directive for creating sticky positioned elements that stay fixed when scrolling.
		</p>

		<!-- Scenario 1: Basic sticky -->
		<div class="demo-section">
			<h2>Basic Usage</h2>
			<p class="description">Element sticks to top when scrolled</p>
			<div class="demo-box">
				<div class="scroll-container">
					<div class="scroll-spacer">Scroll down to see sticky behavior</div>
					<nav v-sticky class="sticky-nav">
						<span class="nav-item">Home</span>
						<span class="nav-item">About</span>
						<span class="nav-item">Contact</span>
					</nav>
					<div class="scroll-content">
						<p v-for="i in 10" :key="i">Content line {{ i }}</p>
					</div>
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: With offset -->
		<div class="demo-section">
			<h2>With Top Offset</h2>
			<p class="description">Stick with distance from top</p>
			<div class="demo-box">
				<div class="scroll-container">
					<div class="scroll-spacer">Scroll down</div>
					<div v-sticky="30" class="sticky-box with-offset">
						Sticky with 30px offset from top
					</div>
					<div class="scroll-content">
						<p v-for="i in 10" :key="i">Content line {{ i }}</p>
					</div>
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ offsetCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 3: With callback -->
		<div class="demo-section">
			<h2>With Change Callback</h2>
			<p class="description">Track sticky state changes</p>
			<div class="demo-box">
				<div class="status-badge" :class="{ active: isSticky }">
					{{ isSticky ? 'Currently Sticky' : 'Normal Position' }}
				</div>
				<div class="scroll-container">
					<div class="scroll-spacer">Scroll to trigger sticky</div>
					<div
						v-sticky="{ top: 0, onChange: handleStickyChange }"
						class="sticky-box tracked"
					>
						Sticky Element with Callback
					</div>
					<div class="scroll-content">
						<p v-for="i in 10" :key="i">Content line {{ i }}</p>
					</div>
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ callbackCode }}</code></pre>
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
						<td>top</td>
						<td>Number/String</td>
						<td>0</td>
						<td>Top offset when sticky</td>
					</tr>
					<tr>
						<td>bottom</td>
						<td>Number/String</td>
						<td>-</td>
						<td>Bottom offset when sticky</td>
					</tr>
					<tr>
						<td>zIndex</td>
						<td>Number</td>
						<td>100</td>
						<td>Z-index when sticky</td>
					</tr>
					<tr>
						<td>stickyClass</td>
						<td>String</td>
						<td>'v-sticky--fixed'</td>
						<td>CSS class when sticky</td>
					</tr>
					<tr>
						<td>onChange</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when sticky state changes</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable sticky behavior</td>
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

.scroll-container {
	height: 300px;
	overflow-y: auto;
	background: white;
	border-radius: 8px;
	border: 2px solid #e0e0e0;
	position: relative;
}

.scroll-spacer {
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #888;
	font-size: 14px;
	background: #f8f9fa;
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

.sticky-nav {
	display: flex;
	gap: 20px;
	padding: 16px 20px;
	background: linear-gradient(135deg, #42b883, #35495e);
	color: white;
	font-weight: 500;
}

.nav-item {
	cursor: pointer;
	opacity: 0.9;
}

.sticky-box {
	padding: 16px 20px;
	background: #48bb78;
	color: white;
	font-weight: 600;
	text-align: center;
}

.sticky-box.with-offset {
	background: linear-gradient(135deg, #ed8936, #dd6b20);
}

.sticky-box.tracked {
	background: linear-gradient(135deg, #42b883, #35495e);
}

.status-badge {
	display: inline-block;
	padding: 8px 16px;
	margin-bottom: 12px;
	border-radius: 20px;
	font-size: 13px;
	font-weight: 500;
	background: #e0e0e0;
	color: #666;
	transition: all 0.3s;
}

.status-badge.active {
	background: #48bb78;
	color: white;
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
