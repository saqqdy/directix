<script setup lang="ts">
import { ref } from 'vue'
import { useRipple } from 'directix'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

// Composable API
const composableButtonRef = ref<HTMLElement | null>(null)
useRipple(composableButtonRef, {
	color: 'rgba(255, 255, 255, 0.5)',
	duration: 600
})

const basicCode = `<button v-ripple>
  Click for Ripple
</button>`

const colorCode = `<button v-ripple="'rgba(255, 255, 255, 0.5)'">
  White Ripple
</button>`

const optionsCode = `<button v-ripple="{
  color: '#ff0000',
  duration: 800,
  initialScale: 0.5
}">
  Custom Ripple
</button>`

const disabledCode = `<button v-ripple="false">
  No Ripple
</button>`

const composableCode = `import { ref } from 'vue'
import { useRipple } from 'directix'

const buttonRef = ref<HTMLElement | null>(null)
useRipple(buttonRef, {
  color: 'rgba(255, 255, 255, 0.5)',
  duration: 600
})

// In template: <button ref="buttonRef">Click me</button>`
</script>

<template>
	<div class="demo-page">
		<h1>v-ripple</h1>
		<p class="intro">
			A Material Design ripple effect directive. Creates animated ripple waves on click for buttons and interactive elements.
		</p>

		<!-- Scenario 1: Basic ripple -->
		<DemoSection title="Basic Usage" description="Click to see ripple effect">
			<div class="demo-box">
				<div class="button-row">
					<button v-ripple class="ripple-btn primary">
						Primary Button
					</button>
					<button v-ripple class="ripple-btn secondary">
						Secondary Button
					</button>
				</div>
				<p class="hint">Click buttons to see ripple animation</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Custom color -->
		<DemoSection title="Custom Color" description="Specify ripple color as string">
			<div class="demo-box">
				<div class="button-row">
					<button v-ripple="'rgba(255, 255, 255, 0.5)'" class="ripple-btn dark">
						White Ripple
					</button>
					<button v-ripple="'rgba(0, 0, 0, 0.2)'" class="ripple-btn light">
						Dark Ripple
					</button>
				</div>
			</div>
			<CodeBlock :code="colorCode" />
		</DemoSection>

		<!-- Scenario 3: With options -->
		<DemoSection title="Custom Options" description="Customize duration and scale">
			<div class="demo-box">
				<div class="button-row">
					<button
						v-ripple="{
							color: 'rgba(255, 100, 100, 0.4)',
							duration: 800
						}"
						class="ripple-btn custom"
					>
						Slow Ripple (800ms)
					</button>
					<button
						v-ripple="{
							color: '#ffeb3b',
							duration: 400,
							initialScale: 0.5,
							finalScale: 3
						}"
						class="ripple-btn accent"
					>
						Fast & Big
					</button>
				</div>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Scenario 4: Disabled -->
		<DemoSection title="Disabled Ripple" description="Disable ripple effect">
			<div class="demo-box">
				<div class="button-row">
					<button v-ripple class="ripple-btn primary">
						With Ripple
					</button>
					<button v-ripple="false" class="ripple-btn disabled">
						No Ripple
					</button>
				</div>
			</div>
			<CodeBlock :code="disabledCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API" description="Use useRipple for programmatic ripple effect">
			<div class="demo-box">
				<div class="button-row">
					<button ref="composableButtonRef" class="ripple-btn primary">
						Composable Ripple
					</button>
				</div>
				<p class="hint">Using useRipple composable for programmatic ripple</p>
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
						<td>color</td>
						<td>String</td>
						<td>'currentColor'</td>
						<td>Ripple color (CSS color value)</td>
					</tr>
					<tr>
						<td>duration</td>
						<td>Number</td>
						<td>600</td>
						<td>Animation duration in ms</td>
					</tr>
					<tr>
						<td>initialScale</td>
						<td>Number</td>
						<td>0</td>
						<td>Initial scale of ripple</td>
					</tr>
					<tr>
						<td>finalScale</td>
						<td>Number</td>
						<td>2</td>
						<td>Final scale of ripple</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable ripple effect</td>
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
	margin-top: 16px;
}

.button-row {
	display: flex;
	gap: 16px;
	justify-content: center;
	flex-wrap: wrap;
}

.ripple-btn {
	padding: 14px 28px;
	font-size: 15px;
	font-weight: 600;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	overflow: hidden;
	position: relative;
}

.ripple-btn.primary {
	background: linear-gradient(135deg, #667eea, #764ba2);
	color: white;
}

.ripple-btn.secondary {
	background: #f0f0f0;
	color: #333;
}

.ripple-btn.dark {
	background: #333;
	color: white;
}

.ripple-btn.light {
	background: #f8f9fa;
	color: #333;
	border: 1px solid #ddd;
}

.ripple-btn.custom {
	background: linear-gradient(135deg, #667eea, #5a67d8);
	color: white;
}

.ripple-btn.accent {
	background: linear-gradient(135deg, #ed8936, #dd6b20);
	color: white;
}

.ripple-btn.disabled {
	background: #e0e0e0;
	color: #999;
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
