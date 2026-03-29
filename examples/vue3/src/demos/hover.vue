<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

// Scenario 1: Basic hover
const isHovering = ref(false)
const handleHover = (hovering: boolean) => {
	isHovering.value = hovering
}

// Scenario 2: Enter/Leave callbacks
const hoverState = ref('Not hovering')
const handleEnter = () => {
	hoverState.value = 'Mouse entered!'
}
const handleLeave = () => {
	hoverState.value = 'Mouse left'
}

// Scenario 3: With delay
const delayedHover = ref(false)

// Scenario 4: With custom class (class is auto-toggled by directive)

const basicCode = `<div v-hover="handleHover">
  {{ isHovering ? 'Hovering!' : 'Hover me' }}
</div>`

const enterLeaveCode = `<div v-hover="{
  onEnter: handleEnter,
  onLeave: handleLeave
}">
  Hover element
</div>`

const delayCode = `<div v-hover="{
  handler: handleHover,
  enterDelay: 300,
  leaveDelay: 200
}">
  Delayed hover response
</div>`

const classCode = `<div v-hover="{ class: 'is-hovering' }">
  Custom hover class
</div>`
</script>

<template>
	<div class="demo-page">
		<h1>v-hover</h1>
		<p class="intro">
			A directive for tracking hover state on elements. Provides callbacks for enter/leave events and automatic class toggling.
		</p>

		<!-- Scenario 1: Basic hover -->
		<DemoSection title="Basic Usage" description="Track hover state with a callback">
			<div class="demo-box">
				<div v-hover="handleHover" class="hover-box" :class="{ active: isHovering }">
					{{ isHovering ? 'Hovering!' : 'Hover Me' }}
				</div>
				<p class="hint">Hover state: {{ isHovering }}</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Enter/Leave callbacks -->
		<DemoSection title="Enter/Leave Callbacks" description="Separate callbacks for mouse enter and leave">
			<div class="demo-box">
				<div class="state-display">{{ hoverState }}</div>
				<div
					v-hover="{
						onEnter: handleEnter,
						onLeave: handleLeave
					}"
					class="hover-box colored"
				>
					Hover to trigger callbacks
				</div>
			</div>
			<CodeBlock :code="enterLeaveCode" />
		</DemoSection>

		<!-- Scenario 3: With delay -->
		<DemoSection title="With Delay" description="Add delays before triggering hover state">
			<div class="demo-box">
				<div
					v-hover="{
						handler: (h: boolean) => delayedHover = h,
						enterDelay: 300,
						leaveDelay: 200
					}"
					class="hover-box"
					:class="{ active: delayedHover }"
				>
					{{ delayedHover ? 'Delayed Hover!' : 'Hover (300ms delay)' }}
				</div>
				<p class="hint">300ms delay on enter, 200ms on leave</p>
			</div>
			<CodeBlock :code="delayCode" />
		</DemoSection>

		<!-- Scenario 4: With custom class -->
		<DemoSection title="Custom Hover Class" description="Automatically toggle a CSS class on hover">
			<div class="demo-box">
				<div v-hover="{ class: 'custom-hover' }" class="hover-box styled">
					Hover to add custom class
				</div>
				<p class="hint">Adds 'custom-hover' class when hovering</p>
			</div>
			<CodeBlock :code="classCode" />
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
						<td>Callback with hover state (isHovering, event)</td>
					</tr>
					<tr>
						<td>onEnter</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when mouse enters</td>
					</tr>
					<tr>
						<td>onLeave</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when mouse leaves</td>
					</tr>
					<tr>
						<td>class</td>
						<td>String</td>
						<td>'v-hover'</td>
						<td>CSS class to add when hovering</td>
					</tr>
					<tr>
						<td>enterDelay</td>
						<td>Number</td>
						<td>0</td>
						<td>Delay before triggering enter (ms)</td>
					</tr>
					<tr>
						<td>leaveDelay</td>
						<td>Number</td>
						<td>0</td>
						<td>Delay before triggering leave (ms)</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable hover tracking</td>
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

.state-display {
	padding: 12px 20px;
	background: white;
	border-radius: 6px;
	margin-bottom: 16px;
	font-size: 14px;
	color: #666;
}

.hover-box {
	padding: 30px 50px;
	background: white;
	border: 2px solid #e0e0e0;
	border-radius: 12px;
	font-size: 18px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	display: inline-block;
}

.hover-box.active {
	background: #667eea;
	color: white;
	border-color: #667eea;
}

.hover-box.colored {
	background: linear-gradient(135deg, #f6f8fb, #eef1f5);
}

.hover-box.colored.v-hover {
	background: linear-gradient(135deg, #667eea, #764ba2);
	color: white;
}

.hover-box.styled {
	border-width: 3px;
}

.hover-box.styled.custom-hover {
	background: linear-gradient(135deg, #48bb78, #38a169);
	color: white;
	border-color: #48bb78;
	transform: scale(1.05);
	box-shadow: 0 8px 20px rgba(72, 187, 120, 0.3);
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
