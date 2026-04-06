<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useProgress } from 'directix'

// Basic
const progress1 = ref(50)

// Custom style
const progress2 = ref(70)

// With text
const progress3 = ref(35)

// Striped
const progress4 = ref(60)

// Indeterminate
const indeterminate = ref(true)

// Composable API
const progressRef = ref<HTMLElement | null>(null)
const { percent, setValue, reset, bind } = useProgress({ value: 0, color: '#667eea' })

onMounted(() => {
	if (progressRef.value) bind(progressRef.value)
})

const basicCode = `<div v-progress="50">50%</div>

<!-- Dynamic -->
<div v-progress="progressValue">Content</div>`

const stripedCode = `<div v-progress="{ value: 60, striped: true }">Striped</div>

<div v-progress="{ value: 60, striped: true, animated: true }">
  Animated
</div>`

const indeterminateCode = `<div v-progress="{ indeterminate: true }">
  Loading...
</div>`

const composableCode = `import { useProgress } from 'directix'

const { percent, setValue, reset, bind } = useProgress({
  value: 0,
  color: '#667eea'
})

// Bind to element
onMounted(() => bind(containerRef.value))

// Control progress
setValue(50)
reset()`
</script>

<template>
	<div class="demo-page">
		<h1>v-progress</h1>
		<p class="intro">
			Displays progress bars on elements with support for determinate, indeterminate, striped, and animated modes.
		</p>

		<!-- Basic -->
		<DemoSection title="Basic Usage" description="Simple progress bar">
			<div class="demo-box">
				<div v-progress="progress1" class="progress-container">
					<p>Progress: {{ progress1 }}%</p>
				</div>
				<input type="range" v-model.number="progress1" min="0" max="100" class="slider" />
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Custom Style -->
		<DemoSection title="Custom Style" description="Customize color and height">
			<div class="demo-box">
				<div
					v-progress="{ value: progress2, color: '#10b981', height: 10, backgroundColor: 'rgba(16, 185, 129, 0.1)' }"
					class="progress-container"
				>
					<p>{{ progress2 }}%</p>
				</div>
				<input type="range" v-model.number="progress2" min="0" max="100" class="slider" />
			</div>
		</DemoSection>

		<!-- With Text -->
		<DemoSection title="With Text" description="Show percentage on the bar">
			<div class="demo-box">
				<div v-progress="{ value: progress3, height: 24, showText: true, color: '#667eea' }" class="progress-container">
					<p>Text Progress</p>
				</div>
				<input type="range" v-model.number="progress3" min="0" max="100" class="slider" />
			</div>
		</DemoSection>

		<!-- Striped -->
		<DemoSection title="Striped & Animated" description="Stripe patterns with animation">
			<div class="demo-box">
				<div class="progress-grid">
					<div v-progress="{ value: progress4, striped: true, color: '#667eea' }" class="progress-item">
						Striped
					</div>
					<div v-progress="{ value: progress4, striped: true, animated: true, color: '#10b981' }" class="progress-item">
						Animated Stripes
					</div>
				</div>
				<input type="range" v-model.number="progress4" min="0" max="100" class="slider" />
			</div>
			<CodeBlock :code="stripedCode" />
		</DemoSection>

		<!-- Indeterminate -->
		<DemoSection title="Indeterminate" description="Loading state">
			<div class="demo-box">
				<div v-progress="{ indeterminate, color: '#f59e0b' }" class="progress-container">
					<p>{{ indeterminate ? 'Loading...' : 'Loaded!' }}</p>
				</div>
				<button @click="indeterminate = !indeterminate" class="btn">
					Toggle Loading
				</button>
			</div>
			<CodeBlock :code="indeterminateCode" />
		</DemoSection>

		<!-- Position -->
		<DemoSection title="Position" description="Top or bottom placement">
			<div class="demo-box">
				<div v-progress="{ value: 50, position: 'top' }" class="progress-item">Top</div>
				<div v-progress="{ value: 50, position: 'bottom' }" class="progress-item">Bottom</div>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API" description="Using useProgress composable">
			<div class="demo-box">
				<div ref="progressRef" class="progress-container">
					<p>Progress Bar Area</p>
				</div>
				<div class="btn-group">
					<button @click="setValue(25)" class="btn">25%</button>
					<button @click="setValue(50)" class="btn">50%</button>
					<button @click="setValue(75)" class="btn">75%</button>
					<button @click="reset()" class="btn btn-secondary">Reset</button>
				</div>
				<p class="hint">Current: {{ Math.round(percent) }}%</p>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>

		<!-- API -->
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
					<tr><td>value</td><td>Number</td><td>0</td><td>Progress value (0-100)</td></tr>
					<tr><td>height</td><td>Number</td><td>4</td><td>Bar height in pixels</td></tr>
					<tr><td>color</td><td>String</td><td>'#42b883'</td><td>Progress bar color</td></tr>
					<tr><td>backgroundColor</td><td>String</td><td>'rgba(0,0,0,0.1)'</td><td>Background color</td></tr>
					<tr><td>showText</td><td>Boolean</td><td>false</td><td>Show percentage text</td></tr>
					<tr><td>striped</td><td>Boolean</td><td>false</td><td>Stripe pattern</td></tr>
					<tr><td>animated</td><td>Boolean</td><td>false</td><td>Animate stripes</td></tr>
					<tr><td>indeterminate</td><td>Boolean</td><td>false</td><td>Loading state</td></tr>
					<tr><td>position</td><td>String</td><td>'top'</td><td>'top' or 'bottom'</td></tr>
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

.progress-container {
	position: relative;
	padding: 24px 20px;
	background: white;
	border-radius: 8px;
	text-align: center;
}

.progress-container p {
	margin: 0;
	font-weight: 600;
	color: #333;
}

.progress-item {
	position: relative;
	padding: 16px 20px;
	background: white;
	border-radius: 8px;
	text-align: center;
	font-weight: 600;
	color: #333;
}

.progress-item + .progress-item {
	margin-top: 12px;
}

.progress-grid {
	display: grid;
	gap: 12px;
}

.slider {
	width: 200px;
	display: block;
	margin: 16px auto 0;
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

.btn:hover {
	background: #5a6fd6;
}

.btn-secondary {
	background: #10b981;
}

.btn-secondary:hover {
	background: #059669;
}

.btn-group {
	display: flex;
	gap: 12px;
	justify-content: center;
	margin-top: 16px;
	flex-wrap: wrap;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
	text-align: center;
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
