<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useProgress } from 'directix'

export default defineComponent({
	name: 'ProgressDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	setup() {
		const progressContainerRef = ref<HTMLElement | null>(null)
		const { value: composableValue, percent, setValue, reset, bind } = useProgress({
			value: 0,
			color: '#42b883',
		})

		onMounted(() => {
			if (progressContainerRef.value) {
				bind(progressContainerRef.value)
			}
		})

		return {
			progressContainerRef,
			composableValue,
			percent,
			setValue,
			reset,
		}
	},
	data() {
		return {
			progress1: 50,
			progress2: 70,
			progress3: 35,
			progress4: 60,
			indeterminate: true,
		}
	},
	computed: {
		basicCode(): string {
			return `<div v-progress="50">
  Progress at 50%
</div>

<!-- Dynamic value -->
<div v-progress="progressValue">
  Content
</div>`
		},
		optionsCode(): string {
			return `<div v-progress="{
  value: progressValue,
  color: '#42b883',
  height: 8,
  showText: true,
  striped: true,
  animated: true
}">
  Content
</div>`
		},
		indeterminateCode(): string {
			return `<div v-progress="{ indeterminate: true }">
  Loading...
</div>`
		},
		composableCode(): string {
			return `import { useProgress } from 'directix'

const { value, percent, setValue, increment, decrement, reset } = useProgress({
  value: 0,
  max: 100,
  color: '#42b883'
})

// Control progress
setValue(50)      // Set to 50%
increment(10)     // Add 10%
decrement(5)      // Subtract 5%
reset()           // Reset to 0%`
		},
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-progress</h1>
		<p class="intro">
			A directive for displaying progress bars on elements. Supports determinate, indeterminate, striped, and animated modes.
		</p>

		<!-- Scenario 1: Basic progress -->
		<DemoSection title="Basic Usage" description="Simple progress bar">
			<div class="demo-box">
				<div v-progress="progress1" class="progress-container">
					<p>Progress: {{ progress1 }}%</p>
				</div>
				<div class="controls">
					<input type="range" v-model.number="progress1" min="0" max="100" />
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Custom style -->
		<DemoSection title="Custom Style" description="Customize colors and height">
			<div class="demo-box">
				<div
					v-progress="{
						value: progress2,
						color: '#10b981',
						height: 10,
						backgroundColor: 'rgba(16, 185, 129, 0.1)'
					}"
					class="progress-container"
				>
					<p>Green Progress: {{ progress2 }}%</p>
				</div>
				<div class="controls">
					<input type="range" v-model.number="progress2" min="0" max="100" />
				</div>
			</div>
		</DemoSection>

		<!-- Scenario 3: With text -->
		<DemoSection title="With Percentage Text" description="Show percentage on the bar">
			<div class="demo-box">
				<div
					v-progress="{
						value: progress3,
						height: 24,
						showText: true,
						color: '#42b883'
					}"
					class="progress-container"
				>
					<p>Text Progress</p>
				</div>
				<div class="controls">
					<input type="range" v-model.number="progress3" min="0" max="100" />
				</div>
			</div>
		</DemoSection>

		<!-- Scenario 4: Striped and animated -->
		<DemoSection title="Striped & Animated" description="Stripe patterns with animation">
			<div class="demo-box">
				<div class="progress-grid">
					<div v-progress="{ value: progress4, striped: true, color: '#42b883' }" class="progress-item">
						<span>Striped</span>
					</div>
					<div v-progress="{ value: progress4, striped: true, animated: true, color: '#10b981' }" class="progress-item">
						<span>Animated Stripes</span>
					</div>
				</div>
				<div class="controls">
					<input type="range" v-model.number="progress4" min="0" max="100" />
				</div>
			</div>
		</DemoSection>

		<!-- Scenario 5: Indeterminate -->
		<DemoSection title="Indeterminate" description="Loading state with unknown progress">
			<div class="demo-box">
				<div v-progress="{ indeterminate: indeterminate, color: '#f59e0b' }" class="progress-container">
					<p>{{ indeterminate ? 'Loading...' : 'Loaded!' }}</p>
				</div>
				<button @click="indeterminate = !indeterminate" class="btn">
					Toggle Loading
				</button>
			</div>
			<CodeBlock :code="indeterminateCode" />
		</DemoSection>

		<!-- Position options -->
		<DemoSection title="Position Options" description="Top or bottom placement">
			<div class="demo-box">
				<div v-progress="{ value: 50, position: 'top' }" class="progress-item">
					<span>Top Position</span>
				</div>
				<div v-progress="{ value: 50, position: 'bottom' }" class="progress-item">
					<span>Bottom Position</span>
				</div>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useProgress" description="Using useProgress composable">
			<div class="demo-box">
				<div ref="progressContainerRef" class="progress-container composable-demo">
					<p>Progress Bar Area</p>
				</div>
				<div class="button-group">
					<button @click="setValue(25)" class="btn">25%</button>
					<button @click="setValue(50)" class="btn">50%</button>
					<button @click="setValue(75)" class="btn">75%</button>
					<button @click="reset()" class="btn btn-secondary">Reset</button>
				</div>
				<p class="hint">Current: {{ Math.round(percent) }}%</p>
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
						<td>value</td>
						<td>Number</td>
						<td>0</td>
						<td>Progress value (0-100)</td>
					</tr>
					<tr>
						<td>height</td>
						<td>Number</td>
						<td>4</td>
						<td>Bar height in pixels</td>
					</tr>
					<tr>
						<td>color</td>
						<td>String</td>
						<td>'#42b883'</td>
						<td>Progress bar color</td>
					</tr>
					<tr>
						<td>backgroundColor</td>
						<td>String</td>
						<td>'rgba(0,0,0,0.1)'</td>
						<td>Background color</td>
					</tr>
					<tr>
						<td>showText</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Show percentage text</td>
					</tr>
					<tr>
						<td>striped</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Stripe pattern</td>
					</tr>
					<tr>
						<td>animated</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Animate stripes</td>
					</tr>
					<tr>
						<td>indeterminate</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Loading state</td>
					</tr>
					<tr>
						<td>position</td>
						<td>String</td>
						<td>'top'</td>
						<td>'top' or 'bottom'</td>
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

.progress-container {
	position: relative;
	padding: 30px 20px;
	background: white;
	border-radius: 8px;
	margin-bottom: 16px;
	text-align: center;
}

.progress-container p {
	margin: 0;
	font-weight: 600;
	color: #333;
}

.progress-item {
	position: relative;
	padding: 20px;
	background: white;
	border-radius: 8px;
	margin-bottom: 12px;
	text-align: center;
}

.progress-item span {
	font-weight: 600;
	color: #333;
}

.progress-grid {
	display: grid;
	gap: 12px;
}

.controls {
	display: flex;
	justify-content: center;
	margin-top: 16px;
}

.controls input[type="range"] {
	width: 200px;
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

.btn:hover {
	background: #3aa876;
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

.button-group {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
	justify-content: center;
	margin-top: 16px;
}

.btn-secondary {
	background: #10b981;
}

.btn-secondary:hover {
	background: #059669;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
	text-align: center;
}

.composable-demo {
	background: white;
	margin-bottom: 16px;
}
</style>
