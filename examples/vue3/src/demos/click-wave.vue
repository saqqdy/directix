<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useClickWave } from 'directix'

// Scenario 1: Basic usage
const basicClickCount = ref(0)

// Scenario 2: Custom color
const customColorClickCount = ref(0)

// Scenario 3: With options
const optionsClickCount = ref(0)

// Composable API demo - demonstrates manual binding
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
const triggerCustom = () => {
	const el = waveRef.value
	if (el) {
		const rect = el.getBoundingClientRect()
		trigger({ x: rect.width / 4, y: rect.height / 4 })
	}
}

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

const composableCode = `import { ref } from 'vue'
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
</script>

<template>
	<div class="demo-page">
		<h1>v-click-wave</h1>
		<p class="intro">
			A simplified ripple effect directive that creates a wave animation on click. Perfect for buttons and interactive elements.
		</p>

		<!-- Scenario 1: Basic usage -->
		<DemoSection title="Basic Usage" description="Click to see the wave effect">
			<div class="demo-box">
				<button v-click-wave class="btn-primary" @click="basicClickCount++">
					Click me! ({{ basicClickCount }} clicks)
				</button>
				<p class="hint">Click the button to see the wave effect</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Custom color -->
		<DemoSection title="Custom Colors" description="Customize the wave color">
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
			<CodeBlock :code="colorCode" />
		</DemoSection>

		<!-- Scenario 3: With options -->
		<DemoSection title="With Options" description="Customize duration and size">
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
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Different button styles -->
		<DemoSection title="Different Button Styles" description="Wave effect works with any button style">
			<div class="demo-box">
				<div class="button-group">
					<button v-click-wave class="btn-small">Small</button>
					<button v-click-wave class="btn-large">Large Button</button>
					<button v-click-wave class="btn-rounded">Rounded</button>
					<button v-click-wave class="btn-outline">Outline</button>
				</div>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useClickWave" description="Using useClickWave composable">
			<div class="demo-box">
				<div class="button-group">
					<button ref="waveRef" class="btn-primary">
						Click Me
					</button>
					<button @click="triggerCenter" class="btn-secondary">Trigger Center</button>
					<button @click="triggerCustom" class="btn-secondary">Trigger Corner</button>
				</div>
				<p class="hint">Wave bound on mount. Click first button for normal wave, or use trigger buttons for manual control.</p>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>

		<!-- API Reference -->
		<DemoSection title="API">
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

.button-group {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.btn-primary {
	padding: 12px 24px;
	background: #667eea;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	position: relative;
	overflow: hidden;
}

.btn-primary:hover {
	background: #5a6fd6;
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
	background: #667eea;
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
	background: #667eea;
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
	background: #667eea;
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
	color: #667eea;
	border: 2px solid #667eea;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	position: relative;
	overflow: hidden;
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
