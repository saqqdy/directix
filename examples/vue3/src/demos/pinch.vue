<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { usePinch } from 'directix'

// Scenario 1: Basic pinch
const pinchScale = ref(1)
const pinchCenter = ref({ x: 0, y: 0 })

function handlePinch(e: any) {
	pinchScale.value = e.scale
	pinchCenter.value = { x: e.centerX, y: e.centerY }
}

// Scenario 2: With transform (directive handles transform internally)
// No need to track scale separately when enableTransform is true

// Composable API demo
const composableEl = ref<HTMLElement>()
const composableScale = ref(1)

const { scale, bind } = usePinch({
	onPinch: (e) => {
		composableScale.value = e.scale
	}
})

onMounted(() => {
	if (composableEl.value) {
		bind(composableEl.value)
	}
})

const basicCode = `<div v-pinch="handlePinch">
  Pinch to zoom
</div>

<script setup>
function handlePinch(e) {
  console.log('Scale:', e.scale)
  console.log('Center:', e.centerX, e.centerY)
}
<\/script>`

const transformCode = `<!-- Let directive handle transform -->
<div v-pinch="{
  enableTransform: true,
  minScale: 0.5,
  maxScale: 3
}">
  Pinch to scale element
</div>

<!-- Or handle transform yourself -->
<div v-pinch="{
  onPinch: (e) => scale = e.scale,
  minScale: 0.5,
  maxScale: 3
}"
  :style="{ transform: 'scale(' + scale + ')' }">
  Pinch to scale element
</div>`

const composableCode = `import { ref, onMounted } from 'vue'
import { usePinch } from 'directix'

const el = ref<HTMLElement>()
const scale = ref(1)

const { bind } = usePinch({
  onPinch: (e) => scale.value = e.scale
})

onMounted(() => {
  if (el.value) bind(el.value)
})`
</script>

<template>
	<div class="demo-page">
		<h1>v-pinch</h1>
		<p class="intro">
			A directive for handling pinch-to-zoom gestures on touch devices. Perfect for image zooming and scalable content.
		</p>

		<div class="note">
			<strong>Note:</strong> This is a touch-only gesture. Use on mobile or tablet devices with multi-touch support.
		</div>

		<!-- Scenario 1: Basic pinch -->
		<DemoSection title="Basic Usage" description="Detect pinch gestures">
			<div class="demo-box">
				<div
					v-pinch="handlePinch"
					class="pinch-area"
				>
					<div class="pinch-content">
						<p class="scale">Scale: {{ pinchScale.toFixed(2) }}</p>
						<p class="center">Center: {{ Math.round(pinchCenter.x) }}, {{ Math.round(pinchCenter.y) }}</p>
						<p class="hint-text">Pinch with two fingers</p>
					</div>
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With transform -->
		<DemoSection title="With Transform" description="Pinch to scale element">
			<div class="demo-box">
				<div
					v-pinch="{
						enableTransform: true,
						minScale: 0.5,
						maxScale: 2
					}"
					class="pinch-area transform"
				>
					<div class="pinch-content">
						<p class="hint-text">Pinch to zoom in/out</p>
						<p class="hint-text">(directive handles transform internally)</p>
					</div>
				</div>
			</div>
			<CodeBlock :code="transformCode" />
		</DemoSection>

		<!-- Event info -->
		<DemoSection title="Event Data" description="Information available in pinch events">
			<div class="demo-box">
				<table class="api-table">
					<thead>
						<tr>
							<th>Property</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>scale</td>
							<td>Number</td>
							<td>Scale factor (relative to start)</td>
						</tr>
						<tr>
							<td>distance</td>
							<td>Number</td>
							<td>Current finger distance</td>
						</tr>
						<tr>
							<td>initialDistance</td>
							<td>Number</td>
							<td>Initial finger distance</td>
						</tr>
						<tr>
							<td>centerX / centerY</td>
							<td>Number</td>
							<td>Center point between fingers</td>
						</tr>
						<tr>
							<td>isFirst</td>
							<td>Boolean</td>
							<td>First pinch event</td>
						</tr>
						<tr>
							<td>isFinal</td>
							<td>Boolean</td>
							<td>Final pinch event</td>
						</tr>
					</tbody>
				</table>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - usePinch" description="Using usePinch composable">
			<div class="demo-box">
				<div ref="composableEl" class="pinch-area">
					<div class="pinch-content">
						<p class="scale">{{ composableScale.toFixed(2) }}x</p>
						<p>Using usePinch composable</p>
					</div>
				</div>
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
						<td>onStart</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when pinch starts</td>
					</tr>
					<tr>
						<td>onPinch</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback during pinch</td>
					</tr>
					<tr>
						<td>onEnd</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when pinch ends</td>
					</tr>
					<tr>
						<td>minScale</td>
						<td>Number</td>
						<td>-</td>
						<td>Minimum scale factor</td>
					</tr>
					<tr>
						<td>maxScale</td>
						<td>Number</td>
						<td>-</td>
						<td>Maximum scale factor</td>
					</tr>
					<tr>
						<td>enableTransform</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Apply scale transform</td>
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

.note {
	padding: 12px 16px;
	background: #e3f2fd;
	border-radius: 6px;
	font-size: 13px;
	color: #1565c0;
	margin-bottom: 24px;
}

.demo-box {
	padding: 20px;
	background: #f8f9fa;
	border-radius: 8px;
	margin-bottom: 12px;
}

.pinch-area {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 8px;
	padding: 60px 40px;
	touch-action: none;
	user-select: none;
}

.pinch-area.transform {
	transition: transform 0.1s ease-out;
	transform-origin: center center;
}

.pinch-content {
	text-align: center;
	color: white;
}

.pinch-content p {
	margin: 0 0 8px 0;
}

.pinch-content .scale {
	font-size: 32px;
	font-weight: bold;
}

.pinch-content .center {
	font-size: 14px;
	font-family: monospace;
	opacity: 0.9;
}

.hint-text {
	font-size: 13px;
	opacity: 0.8;
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
