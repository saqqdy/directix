<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'CounterDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	data() {
		return {
			targetValue1: 1000,
			targetValue2: 1234.56,
			targetValue3: 1000000,
			targetValue4: 999.99,
		}
	},
	methods: {
		randomizeValue1() {
			this.targetValue1 = Math.floor(Math.random() * 10000)
		},
		randomizeValue2() {
			this.targetValue2 = Math.random() * 10000
		},
		randomizeValue3() {
			this.targetValue3 = Math.floor(Math.random() * 10000000)
		},
		randomizeValue4() {
			this.targetValue4 = Math.random() * 1000
		},
	},
	computed: {
		basicCode(): string {
			return `<span v-counter="1000">0</span>

<!-- Dynamic value -->
<span v-counter="targetValue">0</span>`
		},
		formatCode(): string {
			return `<span v-counter="{
  value: 10000,
  duration: 3000,
  decimals: 2,
  useGrouping: true
}">0</span>`
		},
		customCode(): string {
			return `<span v-counter="{
  value: price,
  formatter: (v) => '$' + v.toFixed(2),
  easing: 'easeOutExpo'
}">$0.00</span>`
		},
		composableCode(): string {
			return `import { useCounter } from 'directix'

const { start, pause, reset, update } = useCounter({
  startValue: 0,
  endValue: 1000,
  duration: 2000,
  formatter: (v) => \`$\${v.toFixed(2)}\`
})

// Control the animation
start()         // Start animation
pause()         // Pause animation
reset()         // Reset to start value
update(500)     // Update end value`
		},
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-counter</h1>
		<p class="intro">
			An animated number counter directive that smoothly transitions from one number to another with customizable easing and formatting.
		</p>

		<!-- Scenario 1: Basic usage -->
		<DemoSection title="Basic Usage" description="Simple number counter animation">
			<div class="demo-box">
				<div class="counter-display">
					<span v-counter="targetValue1">0</span>
				</div>
				<div class="controls">
					<button @click="randomizeValue1" class="btn">
						Random Value
					</button>
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With decimals and formatting -->
		<DemoSection title="Decimals & Formatting" description="Counter with decimal places and thousands separator">
			<div class="demo-box">
				<div class="counter-display">
					<span v-counter="{
						value: targetValue2,
						duration: 2000,
						decimals: 2,
						useGrouping: true,
						locale: 'en-US'
					}">0</span>
				</div>
				<div class="controls">
					<button @click="randomizeValue2" class="btn">
						Random Value
					</button>
				</div>
			</div>
			<CodeBlock :code="formatCode" />
		</DemoSection>

		<!-- Scenario 3: Large numbers -->
		<DemoSection title="Large Numbers" description="Counter for large values with grouping">
			<div class="demo-box">
				<div class="counter-display large">
					<span v-counter="{
						value: targetValue3,
						duration: 3000,
						useGrouping: true,
						easing: 'easeOutExpo'
					}">0</span>
				</div>
				<div class="controls">
					<button @click="randomizeValue3" class="btn">
						Random Large Value
					</button>
				</div>
			</div>
		</DemoSection>

		<!-- Scenario 4: Custom formatter -->
		<DemoSection title="Custom Formatter" description="Currency formatted counter">
			<div class="demo-box">
				<div class="counter-display currency">
					<span v-counter="{
						value: targetValue4,
						duration: 2000,
						decimals: 2,
						formatter: (v) => '$' + v.toFixed(2)
					}">$0.00</span>
				</div>
				<div class="controls">
					<button @click="randomizeValue4" class="btn">
						Random Price
					</button>
				</div>
			</div>
			<CodeBlock :code="customCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useCounter" description="Using useCounter composable for programmatic control">
			<div class="demo-box">
				<p class="hint">Control counter animation programmatically with the composable API</p>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>

		<!-- Easing options -->
		<DemoSection title="Easing Options" description="Different easing functions">
			<div class="demo-box">
				<div class="easing-grid">
					<div class="easing-item">
						<span class="label">linear</span>
						<span v-counter="{ value: 100, duration: 2000, easing: 'linear' }">0</span>
					</div>
					<div class="easing-item">
						<span class="label">easeOut</span>
						<span v-counter="{ value: 100, duration: 2000, easing: 'easeOut' }">0</span>
					</div>
					<div class="easing-item">
						<span class="label">easeInOut</span>
						<span v-counter="{ value: 100, duration: 2000, easing: 'easeInOut' }">0</span>
					</div>
					<div class="easing-item">
						<span class="label">easeOutQuart</span>
						<span v-counter="{ value: 100, duration: 2000, easing: 'easeOutQuart' }">0</span>
					</div>
					<div class="easing-item">
						<span class="label">easeOutExpo</span>
						<span v-counter="{ value: 100, duration: 2000, easing: 'easeOutExpo' }">0</span>
					</div>
				</div>
			</div>
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

.counter-display {
	font-size: 48px;
	font-weight: bold;
	color: #42b883;
	text-align: center;
	padding: 30px 0;
	font-family: 'SF Mono', 'Monaco', monospace;
}

.counter-display.large {
	font-size: 56px;
}

.counter-display.currency {
	color: #10b981;
}

.controls {
	text-align: center;
}

.hint {
	font-size: 13px;
	color: #888;
	text-align: center;
}

.btn {
	padding: 12px 24px;
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

.easing-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 16px;
}

.easing-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 16px;
	background: white;
	border-radius: 8px;
}

.easing-item .label {
	font-size: 12px;
	color: #666;
	font-family: monospace;
}

.easing-item span:last-child {
	font-size: 24px;
	font-weight: bold;
	color: #42b883;
	font-family: 'SF Mono', monospace;
}
</style>
