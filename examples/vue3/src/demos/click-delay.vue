<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

// Scenario 1: Basic usage
const clickCount = ref(0)
const handleClick = () => {
	clickCount.value++
}

// Scenario 2: Custom delay time
const customDelayCount = ref(0)
const handleCustomDelay = () => {
	customDelayCount.value++
}

// Scenario 3: Disabled state
const disabled = ref(false)
const disabledClickCount = ref(0)
const handleDisabledClick = () => {
	disabledClickCount.value++
}

// Scenario 4: Without visual feedback
const noFeedbackCount = ref(0)
const handleNoFeedback = () => {
	noFeedbackCount.value++
}

// Scenario 5: Form submit simulation
const submitCount = ref(0)
const isSubmitting = ref(false)
const handleSubmit = () => {
	isSubmitting.value = true
	submitCount.value++
	// Simulate async operation
	setTimeout(() => {
		isSubmitting.value = false
	}, 2000)
}

const basicCode = `<button v-click-delay="handleClick">
  Click Me (300ms delay)
</button>`

const customDelayCode = `<button v-click-delay:500="handleClick">
  Click Me (500ms delay)
</button>

<button v-click-delay:1s="handleClick">
  Click Me (1s delay)
</button>`

const disabledCode = `<button v-click-delay="{ handler: handleClick, disabled: isDisabled }">
  Conditional Click Delay
</button>

<label>
  <input type="checkbox" v-model="disabled" />
  Disable click delay
</label>`

const optionsCode = `<button v-click-delay="{
  handler: handleClick,
  delay: 500,
  feedback: false
}">
  No Visual Feedback
</button>`

const formCode = `<button v-click-delay="{
  handler: submitForm,
  delay: 1000,
  pendingClass: 'is-submitting'
}">
  {{ isSubmitting ? 'Submitting...' : 'Submit' }}
</button>`
</script>

<template>
	<div class="demo-page">
		<h1>v-click-delay</h1>
		<p class="intro">
			A directive that prevents repeated clicks within a specified time period. Useful for preventing duplicate form submissions and button spam.
		</p>

		<!-- Scenario 1: Basic usage -->
		<DemoSection title="Basic Usage" description="Prevent repeated clicks with 300ms default delay">
			<div class="demo-box">
				<button v-click-delay="handleClick" class="btn">
					Click Me (300ms delay)
				</button>
				<p class="result">Click count: <strong>{{ clickCount }}</strong></p>
				<p class="hint">Try clicking rapidly - only one click registers every 300ms</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Custom delay time -->
		<DemoSection title="Custom Delay Time" description="Use argument to specify delay: v-click-delay:500 or v-click-delay:1s">
			<div class="demo-box">
				<div class="button-group">
					<button v-click-delay:500="handleCustomDelay" class="btn">
						500ms Delay
					</button>
					<button v-click-delay:1s="handleCustomDelay" class="btn">
						1s Delay
					</button>
				</div>
				<p class="result">Click count: <strong>{{ customDelayCount }}</strong></p>
				<p class="hint">Different delay times for different buttons</p>
			</div>
			<CodeBlock :code="customDelayCode" />
		</DemoSection>

		<!-- Scenario 3: Disabled state -->
		<DemoSection title="Disabled State" description="Dynamically enable/disable the click delay">
			<div class="demo-box">
				<button
					v-click-delay="{ handler: handleDisabledClick, disabled: disabled }"
					class="btn"
					:class="{ 'btn-disabled': disabled }"
				>
					{{ disabled ? 'Delay Disabled' : 'Click Me' }}
				</button>
				<p class="result">Click count: <strong>{{ disabledClickCount }}</strong></p>
				<label class="checkbox">
					<input type="checkbox" v-model="disabled" />
					<span>Disable click delay</span>
				</label>
				<p class="hint">When disabled, rapid clicks will all register</p>
			</div>
			<CodeBlock :code="disabledCode" />
		</DemoSection>

		<!-- Scenario 4: Without visual feedback -->
		<DemoSection title="Without Visual Feedback" description="Disable the default pending CSS class">
			<div class="demo-box">
				<button
					v-click-delay="{ handler: handleNoFeedback, feedback: false }"
					class="btn"
				>
					No Visual Feedback
				</button>
				<p class="result">Click count: <strong>{{ noFeedbackCount }}</strong></p>
				<p class="hint">No CSS class is added during the delay period</p>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Scenario 5: Form submit simulation -->
		<DemoSection title="Form Submit Simulation" description="Prevent double submission on async operations">
			<div class="demo-box">
				<button
					v-click-delay="{ handler: handleSubmit, delay: 1000 }"
					class="btn btn-primary"
					:disabled="isSubmitting"
				>
					{{ isSubmitting ? 'Submitting...' : 'Submit Form' }}
				</button>
				<p class="result">Submit count: <strong>{{ submitCount }}</strong></p>
				<p class="hint">Simulates a 2-second async operation. Click delay prevents duplicate submissions.</p>
			</div>
			<CodeBlock :code="formCode" />
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
						<td>Click handler function (required)</td>
					</tr>
					<tr>
						<td>delay</td>
						<td>Number</td>
						<td>300</td>
						<td>Delay time in milliseconds</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Whether to disable the directive</td>
					</tr>
					<tr>
						<td>feedback</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Whether to add CSS class during delay</td>
					</tr>
					<tr>
						<td>pendingClass</td>
						<td>String</td>
						<td>'v-click-delay--pending'</td>
						<td>CSS class added during delay</td>
					</tr>
				</tbody>
			</table>

			<h4 style="margin-top: 20px;">Argument Syntax</h4>
			<p>Use the argument to specify delay time:</p>
			<ul class="arg-list">
				<li><code>v-click-delay:500</code> - 500 milliseconds</li>
				<li><code>v-click-delay:500ms</code> - 500 milliseconds</li>
				<li><code>v-click-delay:1s</code> - 1 second</li>
				<li><code>v-click-delay:2s</code> - 2 seconds</li>
			</ul>
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

.result {
	margin-top: 12px;
	font-size: 14px;
}

.result strong {
	color: #667eea;
	font-size: 18px;
}

.btn {
	padding: 10px 20px;
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

.btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.btn-primary {
	background: #28a745;
}

.btn-primary:hover {
	background: #218838;
}

.btn-disabled {
	opacity: 0.7;
	border: 2px dashed #ccc;
}

.button-group {
	display: flex;
	gap: 12px;
}

.checkbox {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 12px;
	cursor: pointer;
}

.checkbox input {
	width: 16px;
	height: 16px;
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

.arg-list {
	margin-top: 8px;
	padding-left: 20px;
}

.arg-list li {
	margin: 4px 0;
}

.arg-list code {
	background: #f0f0f0;
	padding: 2px 6px;
	border-radius: 4px;
}
</style>
