<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

// Scenario 1: Basic usage
const clickCount = ref(0)
const lastClickTime = ref<string | null>(null)

const handleClick = () => {
	clickCount.value++
	lastClickTime.value = new Date().toLocaleTimeString()
}

// Scenario 2: Custom delay time
const customCount = ref(0)

// Scenario 3: Leading vs trailing
const leadingCount = ref(0)
const trailingCount = ref(0)

// Scenario 4: Scroll events
const scrollCount = ref(0)
const scrollPosition = ref(0)

const handleScroll = (event: Event) => {
	const target = event.target as HTMLElement
	scrollPosition.value = target.scrollTop
	scrollCount.value++
}

// Scenario 5: Form submission
const submitCount = ref(0)
const lastSubmitTime = ref<string | null>(null)
const isSubmitting = ref(false)

const handleSubmit = () => {
	submitCount.value++
	lastSubmitTime.value = new Date().toLocaleTimeString()
	// Simulate submission
	isSubmitting.value = true
	setTimeout(() => {
		isSubmitting.value = false
	}, 500)
}

const basicCode = `<button v-throttle="handleClick">
  Click Me
</button>

<script setup>
const handleClick = () => {
  console.log('Throttled click!')
}
<\/script>`

const customDelayCode = `<!-- 使用 arg 指定延迟时间 -->
<button v-throttle:1000="handler">1s Throttle</button>

<!-- 使用 options 配置 -->
<button v-throttle="{ handler: fn, wait: 500 }">500ms Throttle</button>`

const optionsCode = `interface ThrottleOptions {
  handler: Function      // 节流处理函数
  wait?: number          // 节流时间，默认 300ms
  leading?: boolean      // 是否在开始时触发，默认 true
  trailing?: boolean     // 是否在结束时触发，默认 true
}`

const scrollCode = `<!-- 使用 .scroll 修饰符指定滚动事件 -->
<div v-throttle:100.scroll="handleScroll">
  Scrollable content
</div>

<!-- 也支持 resize、mousemove 等事件 -->
<Window v-throttle.resize="handleResize" />`
</script>

<template>
	<div class="demo-page">
		<h1>v-throttle</h1>
		<p class="intro">
			Throttle directive that limits event trigger frequency, commonly used for button clicks, scroll events, window resize, etc.
		</p>

		<!-- Scenario 1: Basic usage - Button click -->
		<DemoSection title="Basic Usage - Button Click" description="Default 300ms throttle, prevents repeated clicks">
			<div class="demo-box">
				<button v-throttle="handleClick" class="btn">
					Click Me (300ms throttle)
				</button>
				<div class="stats">
					<span>Click count: <strong>{{ clickCount }}</strong></span>
					<span v-if="lastClickTime">Last: {{ lastClickTime }}</span>
				</div>
				<p class="hint">Click button rapidly, triggers at most once every 300ms</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Custom delay time -->
		<DemoSection title="Custom Delay Time" description="Use arg or options to configure throttle time">
			<div class="demo-box">
				<div class="button-row">
					<button
						v-throttle:500="() => customCount++"
						class="btn"
					>
						500ms
					</button>
					<button
						v-throttle:1000="() => customCount++"
						class="btn"
					>
						1000ms
					</button>
					<button
						v-throttle:2000="() => customCount++"
						class="btn"
					>
						2000ms
					</button>
				</div>
				<div class="stats">
					<span>Total count: <strong>{{ customCount }}</strong></span>
				</div>
				<p class="hint">Buttons with different throttle times</p>
			</div>
			<CodeBlock :code="customDelayCode" />
		</DemoSection>

		<!-- Scenario 3: Leading vs trailing -->
		<DemoSection title="Leading vs Trailing" description="Control when throttling triggers">
			<div class="demo-box">
				<div class="compare">
					<div class="compare-item">
						<button
							v-throttle="{
								handler: () => leadingCount++,
								wait: 1000,
								leading: true,
								trailing: false
							}"
							class="btn"
						>
							Leading Only
						</button>
						<span class="count">Count: {{ leadingCount }}</span>
						<p class="small-hint">Immediate trigger, no trailing</p>
					</div>
					<div class="compare-item">
						<button
							v-throttle="{
								handler: () => trailingCount++,
								wait: 1000,
								leading: false,
								trailing: true
							}"
							class="btn"
						>
							Trailing Only
						</button>
						<span class="count">Count: {{ trailingCount }}</span>
						<p class="small-hint">Delayed trigger, no immediate</p>
					</div>
				</div>
				<p class="hint">Click rapidly to compare the difference between modes</p>
			</div>
		</DemoSection>

		<!-- Scenario 4: Scroll events -->
		<DemoSection title="Scroll Event Throttling" description="Limit scroll event processing frequency">
			<div class="demo-box">
				<div
					v-throttle:100.scroll="handleScroll"
					class="scroll-container"
				>
					<div class="scroll-content">
						<p v-for="i in 20" :key="i">Scroll item {{ i }}</p>
					</div>
				</div>
				<div class="stats">
					<span>Scroll events: <strong>{{ scrollCount }}</strong></span>
					<span>Position: {{ Math.round(scrollPosition) }}px</span>
				</div>
				<p class="hint">Use .scroll modifier to specify scroll event, triggers at most every 100ms</p>
			</div>
			<CodeBlock :code="scrollCode" />
		</DemoSection>

		<!-- Scenario 5: Submit button -->
		<DemoSection title="Practical Use - Form Submission" description="Prevent duplicate form submissions">
			<div class="demo-box">
				<form class="form" @submit.prevent>
					<input class="input" type="text" placeholder="Username" />
					<button
						v-throttle:2000="handleSubmit"
						class="btn submit-btn"
						type="submit"
						:disabled="isSubmitting"
					>
						{{ isSubmitting ? 'Submitting...' : 'Submit (2s cooldown)' }}
					</button>
				</form>
				<div class="stats">
					<span>Submit count: <strong>{{ submitCount }}</strong></span>
					<span v-if="lastSubmitTime">Last: {{ lastSubmitTime }}</span>
				</div>
				<p class="hint">Click button rapidly, only one submission within 2 seconds</p>
			</div>
		</DemoSection>

		<!-- API Reference -->
		<DemoSection title="API">
			<CodeBlock :code="optionsCode" />
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
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>Throttle handler function (required)</td>
					</tr>
					<tr>
						<td>wait</td>
						<td>Number</td>
						<td>300</td>
						<td>Throttle time (milliseconds)</td>
					</tr>
					<tr>
						<td>leading</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Whether to trigger at the start</td>
					</tr>
					<tr>
						<td>trailing</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Whether to trigger at the end</td>
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

.small-hint {
	font-size: 12px;
	color: #888;
	margin-top: 4px;
}

.btn {
	padding: 12px 24px;
	background: #667eea;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	transition: all 0.2s;
}

.btn:hover {
	background: #5a6fd6;
}

.btn:active {
	transform: scale(0.98);
}

.stats {
	display: flex;
	gap: 20px;
	margin-top: 12px;
	font-size: 14px;
	color: #666;
}

.stats strong {
	color: #667eea;
}

.button-row {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.compare {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
}

.compare-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.count {
	font-size: 14px;
	color: #667eea;
	font-weight: 600;
}

.scroll-container {
	height: 150px;
	overflow-y: auto;
	border: 1px solid #ddd;
	border-radius: 6px;
	background: white;
}

.scroll-content {
	padding: 12px;
}

.scroll-content p {
	padding: 8px 0;
	border-bottom: 1px solid #f0f0f0;
	margin: 0;
}

.form {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.input {
	padding: 10px 14px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
	flex: 1;
	min-width: 200px;
}

.input:focus {
	outline: none;
	border-color: #667eea;
}

.submit-btn {
	background: #10b981;
}

.submit-btn:hover {
	background: #059669;
}

.submit-btn:disabled {
	background: #9ca3af;
	cursor: not-allowed;
	opacity: 0.7;
}

.api-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
	margin-top: 16px;
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
