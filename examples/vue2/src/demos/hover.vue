<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useHover } from 'directix'

export default defineComponent({
	name: 'HoverDemo',
	setup() {
		const isHovering = ref(false)
		const handleHover = (hovering: boolean) => {
			isHovering.value = hovering
		}

		const hoverState = ref('Not hovering')
		const handleEnter = () => {
			hoverState.value = 'Mouse entered!'
		}
		const handleLeave = () => {
			hoverState.value = 'Mouse left'
		}

		const delayedHover = ref(false)

		// Scenario 4: With custom class
		const customClassHover = ref(false)

		// Composable API demo
		const composableHoverRef = ref<HTMLElement | null>(null)
		const { isHovering: composableIsHovering } = useHover(composableHoverRef)

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

		const composableCode = `import { ref } from 'vue'
import { useHover } from 'directix'

const elementRef = ref<HTMLElement | null>(null)
const { isHovering } = useHover(elementRef)

// In template: <div ref="elementRef">Hover me</div>`

		return {
			isHovering,
			handleHover,
			hoverState,
			handleEnter,
			handleLeave,
			delayedHover,
			customClassHover,
			composableHoverRef,
			composableIsHovering,
			basicCode,
			enterLeaveCode,
			delayCode,
			classCode,
			composableCode
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-hover</h1>
		<p class="intro">
			A directive for tracking hover state on elements. Provides callbacks for enter/leave events and automatic class toggling.
		</p>

		<!-- Scenario 1: Basic hover -->
		<div class="demo-section">
			<h2>Basic Usage</h2>
			<p class="description">Track hover state with a callback</p>
			<div class="demo-box">
				<div v-hover="handleHover" class="hover-box" :class="{ active: isHovering }">
					{{ isHovering ? 'Hovering!' : 'Hover Me' }}
				</div>
				<p class="hint">Hover state: {{ isHovering }}</p>
			</div>
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: Enter/Leave callbacks -->
		<div class="demo-section">
			<h2>Enter/Leave Callbacks</h2>
			<p class="description">Separate callbacks for mouse enter and leave</p>
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
			<div class="code-block">
				<pre><code>{{ enterLeaveCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 3: With delay -->
		<div class="demo-section">
			<h2>With Delay</h2>
			<p class="description">Add delays before triggering hover state</p>
			<div class="demo-box">
				<div
					v-hover="{
						handler: (h) => delayedHover = h,
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
			<div class="code-block">
				<pre><code>{{ delayCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 4: With custom class -->
		<div class="demo-section">
			<h2>Custom Hover Class</h2>
			<p class="description">Automatically toggle a CSS class on hover</p>
			<div class="demo-box">
				<div v-hover="{ class: 'custom-hover' }" class="hover-box styled">
					Hover to add custom class
				</div>
				<p class="hint">Adds 'custom-hover' class when hovering</p>
			</div>
			<div class="code-block">
				<pre><code>{{ classCode }}</code></pre>
			</div>
		</div>

		<!-- Composable API -->
		<div class="demo-section">
			<h2>Composable API</h2>
			<p class="description">Use useHover for programmatic hover tracking</p>
			<div class="demo-box">
				<div ref="composableHoverRef" class="hover-box" :class="{ active: composableIsHovering }">
					{{ composableIsHovering ? 'Hovering!' : 'Hover Me (Composable)' }}
				</div>
				<p class="hint">Hover state: {{ composableIsHovering }}</p>
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
	background: #42b883;
	color: white;
	border-color: #42b883;
}

.hover-box.colored {
	background: linear-gradient(135deg, #f6f8fb, #eef1f5);
}

.hover-box.colored.v-hover {
	background: linear-gradient(135deg, #42b883, #35495e);
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
