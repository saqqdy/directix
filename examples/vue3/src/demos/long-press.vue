<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useLongPress } from 'directix'

// Scenario 1: Basic long press
const pressCount = ref(0)
const handleLongPress = () => {
	pressCount.value++
}

// Scenario 2: With duration
const customDurationCount = ref(0)
const remaining = ref(0)
const handleCustomDuration = () => {
	customDurationCount.value++
}
const handleTick = (ms: number) => {
	remaining.value = ms
}

// Scenario 3: With callbacks
const pressState = ref('Waiting')
const handleStart = () => {
	pressState.value = 'Pressing...'
}
const handleComplete = () => {
	pressState.value = 'Completed!'
}
const handleCancel = () => {
	pressState.value = 'Cancelled'
}

const basicCode = `<button v-long-press="handleLongPress">
  Long Press Me
</button>`

const durationCode = `<button v-long-press="{
  handler: handleLongPress,
  duration: 1000,
  onTick: updateProgress
}">
  Hold for 1 second
</button>`

const callbacksCode = `<button v-long-press="{
  handler: handleComplete,
  onStart: handleStart,
  onCancel: handleCancel
}">
  Press and Hold
</button>`

// Composable API demo
const composableBtnRef = ref<HTMLElement | null>(null)
const composableCount = ref(0)
const composableRemaining = ref(0)
const composableState = ref('Waiting')

const { isPressing: composableIsPressing, bind: bindLongPress } = useLongPress({
	duration: 800,
	onStart: () => {
		composableState.value = 'Pressing...'
	},
	onTrigger: () => {
		composableCount.value++
		composableState.value = 'Completed!'
	},
	onCancel: () => {
		composableState.value = 'Cancelled'
	},
	onTick: (remaining) => {
		composableRemaining.value = remaining
	}
})

onMounted(() => {
	if (composableBtnRef.value) {
		bindLongPress(composableBtnRef.value)
	}
})

const composableCode = `import { ref, onMounted } from 'vue'
import { useLongPress } from 'directix'

const buttonRef = ref<HTMLElement | null>(null)
const count = ref(0)

const { isPressing, bind } = useLongPress({
  duration: 800,
  onTrigger: () => {
    count.value++
  },
  onTick: (remaining) => {
    console.log(\`\${remaining}ms remaining\`)
  }
})

onMounted(() => {
  if (buttonRef.value) {
    bind(buttonRef.value)
  }
})`
</script>

<template>
	<div class="demo-page">
		<h1>v-long-press</h1>
		<p class="intro">
			A directive that triggers a callback after holding down for a specified duration. Great for context menus, confirmations, and special actions.
		</p>

		<!-- Scenario 1: Basic long press -->
		<DemoSection title="Basic Usage" description="Trigger callback after default 500ms hold">
			<div class="demo-box">
				<div class="result-display">
					Long press count: <strong>{{ pressCount }}</strong>
				</div>
				<button v-long-press="handleLongPress" class="press-btn">
					Long Press Me (500ms)
				</button>
				<p class="hint">Hold for 500ms to trigger</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With duration -->
		<DemoSection title="Custom Duration" description="Customize the hold duration">
			<div class="demo-box">
				<div class="result-display">
					Count: <strong>{{ customDurationCount }}</strong>
					<span v-if="remaining > 0" class="timer">{{ remaining }}ms remaining</span>
				</div>
				<button
					v-long-press="{
						handler: handleCustomDuration,
						duration: 1000,
						onTick: handleTick
					}"
					class="press-btn custom"
				>
					Hold for 1 Second
				</button>
				<p class="hint">Hold for 1000ms with tick feedback</p>
			</div>
			<CodeBlock :code="durationCode" />
		</DemoSection>

		<!-- Scenario 3: With callbacks -->
		<DemoSection title="With Callbacks" description="Handle start, complete, and cancel events">
			<div class="demo-box">
				<div class="state-display" :class="pressState.toLowerCase()">
					State: <strong>{{ pressState }}</strong>
				</div>
				<button
					v-long-press="{
						handler: handleComplete,
						onStart: handleStart,
						onCancel: handleCancel,
						duration: 800
					}"
					class="press-btn callback"
				>
					Press and Hold
				</button>
				<p class="hint">Try pressing and releasing early to see cancel</p>
			</div>
			<CodeBlock :code="callbacksCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useLongPress" description="Using useLongPress composable for programmatic control">
			<div class="demo-box">
				<div class="state-display" :class="composableState.toLowerCase()">
					State: <strong>{{ composableState }}</strong>
					<span v-if="composableIsPressing && composableRemaining > 0" class="timer">
						{{ composableRemaining }}ms remaining
					</span>
				</div>
				<div class="result-display">
					Long press count: <strong>{{ composableCount }}</strong>
				</div>
				<button ref="composableBtnRef" class="press-btn composable">
					Composable Demo (800ms)
				</button>
				<p class="hint">This uses the useLongPress composable instead of the directive</p>
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
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when long press completes (required)</td>
					</tr>
					<tr>
						<td>duration</td>
						<td>Number</td>
						<td>500</td>
						<td>Duration in ms to trigger</td>
					</tr>
					<tr>
						<td>distance</td>
						<td>Number</td>
						<td>10</td>
						<td>Max movement before cancel (px)</td>
					</tr>
					<tr>
						<td>onStart</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when press starts</td>
					</tr>
					<tr>
						<td>onCancel</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when press is cancelled</td>
					</tr>
					<tr>
						<td>onTick</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback during press with remaining time</td>
					</tr>
					<tr>
						<td>tickInterval</td>
						<td>Number</td>
						<td>100</td>
						<td>Interval for onTick callback (ms)</td>
					</tr>
					<tr>
						<td>prevent</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Prevent default behavior</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable long press</td>
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
	text-align: center;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
}

.result-display,
.state-display {
	padding: 16px;
	background: white;
	border-radius: 8px;
	margin-bottom: 16px;
	font-size: 16px;
}

.result-display strong {
	color: #667eea;
}

.timer {
	margin-left: 12px;
	color: #888;
	font-size: 14px;
}

.state-display.waiting strong {
	color: #888;
}

.state-display.pressing strong {
	color: #ed8936;
}

.state-display.completed strong {
	color: #48bb78;
}

.state-display.cancelled strong {
	color: #f56565;
}

.press-btn {
	padding: 16px 32px;
	font-size: 16px;
	font-weight: 600;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	background: linear-gradient(135deg, #667eea, #764ba2);
	color: white;
	user-select: none;
	-webkit-user-select: none;
	touch-action: manipulation;
}

.press-btn:hover {
	opacity: 0.9;
}

.press-btn:active {
	transform: scale(0.98);
}

.press-btn.custom {
	background: linear-gradient(135deg, #ed8936, #dd6b20);
}

.press-btn.callback {
	background: linear-gradient(135deg, #48bb78, #38a169);
}

.press-btn.composable {
	background: linear-gradient(135deg, #9f7aea, #805ad5);
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
