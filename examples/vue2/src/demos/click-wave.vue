<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useClickWave } from 'directix'

export default defineComponent({
	name: 'ClickWaveDemo',
	setup() {
		// Basic usage counter
		const basicClickCount = ref(0)
		const customColorClickCount = ref(0)

		// Code examples
		const basicCode = `<button v-click-wave>
  Click me for wave effect
</button>`

		const colorCode = `<!-- With custom color -->
<button v-click-wave="'rgba(255, 255, 255, 0.3)'">
  Custom color wave
</button>

<!-- Hex color -->
<button v-click-wave="'#ff0000'">
  Red wave
</button>`

		const optionsCode = `<button v-click-wave="{
  color: 'rgba(255, 255, 255, 0.4)',
  duration: 400,
  sizeRatio: 2
}">
  Customized wave
</button>`

		const composableCode = `import { ref, onMounted } from 'vue'
import { useClickWave } from 'directix'

const buttonRef = ref(null)
const { bind, trigger } = useClickWave({
  color: 'rgba(255, 255, 255, 0.4)',
  duration: 600
})

// Bind wave effect to element
onMounted(() => bind(buttonRef.value))

// Trigger wave manually
trigger() // triggers at center
trigger({ x: 50, y: 50 }) // triggers at custom position`

		// Composable API demo
		const waveRef = ref<HTMLElement | null>(null)
		const { bind, trigger } = useClickWave({
			color: 'rgba(255, 255, 255, 0.4)',
			duration: 600
		})

		// Bind wave effect on mount
		onMounted(() => {
			if (waveRef.value) {
				bind(waveRef.value)
			}
		})

		// Manually trigger wave at center
		const triggerCenter = () => {
			trigger()
		}

		// Manually trigger wave at custom position
		const triggerCorner = () => {
			const el = waveRef.value
			if (el) {
				const rect = el.getBoundingClientRect()
				trigger({ x: rect.width / 4, y: rect.height / 4 })
			}
		}

		return {
			basicClickCount,
			customColorClickCount,
			basicCode,
			colorCode,
			optionsCode,
			composableCode,
			waveRef,
			triggerCenter,
			triggerCorner
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-click-wave</h1>
		<p class="intro">
			A simplified ripple effect directive that creates a wave animation on click. Perfect for buttons and interactive elements.
		</p>

		<!-- Scenario 1: Basic usage -->
		<div class="demo-section">
			<h2>Basic Usage</h2>
			<p class="description">Click to see the wave effect</p>
			<div class="demo-box">
				<button v-click-wave class="btn-primary" @click="basicClickCount++">
					Click me! ({{ basicClickCount }} clicks)
				</button>
				<p class="hint">Click the button to see the wave effect</p>
			</div>
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: Custom color -->
		<div class="demo-section">
			<h2>Custom Colors</h2>
			<p class="description">Customize the wave color</p>
			<div class="demo-box">
				<div class="button-group">
					<button v-click-wave="'rgba(255, 255, 255, 0.3)'" class="btn-primary" @click="customColorClickCount++">
						White Wave
					</button>
					<button v-click-wave="'rgba(0, 0, 0, 0.2)'" class="btn-light" @click="customColorClickCount++">
						Dark Wave
					</button>
					<button v-click-wave="'#ff6b6b'" class="btn-danger" @click="customColorClickCount++">
						Red Wave
					</button>
				</div>
				<p class="hint">Total clicks: {{ customColorClickCount }}</p>
			</div>
			<div class="code-block">
				<pre><code>{{ colorCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 3: With options -->
		<div class="demo-section">
			<h2>With Options</h2>
			<p class="description">Customize duration and size</p>
			<div class="demo-box">
				<div class="button-group">
					<button v-click-wave="{ color: 'rgba(255, 255, 255, 0.4)', duration: 400 }" class="btn-primary">
						Fast (400ms)
					</button>
					<button v-click-wave="{ color: 'rgba(255, 255, 255, 0.4)', duration: 800 }" class="btn-primary">
						Slow (800ms)
					</button>
					<button v-click-wave="{ color: 'rgba(255, 255, 255, 0.4)', sizeRatio: 2 }" class="btn-primary">
						Large Wave
					</button>
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ optionsCode }}</code></pre>
			</div>
		</div>

		<!-- Different button styles -->
		<div class="demo-section">
			<h2>Different Button Styles</h2>
			<p class="description">Wave effect works with any button style</p>
			<div class="demo-box">
				<div class="button-group">
					<button v-click-wave class="btn-small">Small</button>
					<button v-click-wave class="btn-large">Large Button</button>
					<button v-click-wave class="btn-rounded">Rounded</button>
					<button v-click-wave class="btn-outline">Outline</button>
				</div>
			</div>
		</div>

		<!-- Composable API -->
		<div class="demo-section">
			<h2>Composable API - useClickWave</h2>
			<p class="description">Using useClickWave composable</p>
			<div class="demo-box">
				<div class="button-group">
					<button ref="waveRef" class="btn-primary">
						Click Me
					</button>
					<button @click="triggerCenter" class="btn-secondary">Trigger Center</button>
					<button @click="triggerCorner" class="btn-secondary">Trigger Corner</button>
				</div>
				<p class="hint">Wave bound on mount. Click first button for normal wave, or use trigger buttons for manual control.</p>
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
						<th>Property</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>color</td>
						<td>String</td>
						<td>'currentColor'</td>
						<td>Wave color</td>
					</tr>
					<tr>
						<td>duration</td>
						<td>Number</td>
						<td>500</td>
						<td>Animation duration in ms</td>
					</tr>
					<tr>
						<td>sizeRatio</td>
						<td>Number</td>
						<td>1.5</td>
						<td>Wave size relative to element</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable wave effect</td>
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

.button-group {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.btn-primary {
	padding: 12px 24px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	position: relative;
	overflow: hidden;
}

.btn-primary:hover {
	background: #3aa876;
}

.btn-secondary {
	padding: 12px 24px;
	background: #6b7280;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
}

.btn-light {
	padding: 12px 24px;
	background: #f3f4f6;
	color: #333;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	position: relative;
	overflow: hidden;
}

.btn-danger {
	padding: 12px 24px;
	background: #ef4444;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	position: relative;
	overflow: hidden;
}

.btn-small {
	padding: 8px 16px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 12px;
	position: relative;
	overflow: hidden;
}

.btn-large {
	padding: 16px 32px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-size: 16px;
	position: relative;
	overflow: hidden;
}

.btn-rounded {
	padding: 12px 24px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 50px;
	cursor: pointer;
	font-size: 14px;
	position: relative;
	overflow: hidden;
}

.btn-outline {
	padding: 12px 24px;
	background: transparent;
	color: #42b883;
	border: 2px solid #42b883;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	position: relative;
	overflow: hidden;
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
