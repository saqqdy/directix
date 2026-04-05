<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useRotateGesture } from 'directix'

// Scenario 1: Basic rotation
const rotationAngle = ref(0)
const rotationDirection = ref('')

function handleRotate(e: any) {
	rotationAngle.value = Math.round(e.angle)
	rotationDirection.value = e.rotation > 0 ? 'Clockwise' : 'Counter-clockwise'
}

// Scenario 2: With transform
const transformAngle = ref(0)

// Composable API demo
const composableEl = ref<HTMLElement>()
useRotateGesture(composableEl, {
	onRotate: (e) => console.log('Rotation:', e.rotation)
})

const basicCode = `<div v-rotate="handleRotate">
  Rotate with two fingers
</div>

<script setup>
function handleRotate(e) {
  console.log('Angle:', e.angle)
  console.log('Rotation:', e.rotation)
}
<\/script>`

const transformCode = `<div v-rotate="{
  onRotate: handleRotate,
  enableTransform: true,
  transformOrigin: 'center center'
}">
  Rotate to spin element
</div>`

const composableCode = `import { useRotateGesture } from 'directix'

const el = ref<HTMLElement>()

const { enable, disable } = useRotateGesture(el, {
  onRotate: (e) => console.log('Rotation:', e.rotation),
  onStart: (e) => console.log('Rotation started'),
  onEnd: (e) => console.log('Rotation ended')
})`
</script>

<template>
	<div class="demo-page">
		<h1>v-rotate-gesture</h1>
		<p class="intro">
			A directive for handling two-finger rotation gestures on touch devices. Perfect for rotating images, dials, and interactive elements.
		</p>

		<div class="note">
			<strong>Note:</strong> This is a touch-only gesture. Use on mobile or tablet devices with multi-touch support.
		</div>

		<!-- Scenario 1: Basic rotation -->
		<DemoSection title="Basic Usage" description="Detect rotation gestures">
			<div class="demo-box">
				<div
					v-rotate-gesture="handleRotate"
					class="rotate-area"
				>
					<div class="rotate-content">
						<p class="angle">{{ rotationAngle }}°</p>
						<p class="direction">{{ rotationDirection || 'Rotate me' }}</p>
						<p class="hint-text">Use two fingers to rotate</p>
					</div>
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With transform -->
		<DemoSection title="With Transform" description="Rotate to spin element">
			<div class="demo-box">
				<div
					v-rotate-gesture="{
						onRotate: (e) => transformAngle = e.angle,
						enableTransform: true
					}"
					class="rotate-area transform"
					:style="{ transform: `rotate(${transformAngle}deg)` }"
				>
					<div class="rotate-content">
						<div class="dial">
							<div class="dial-marker"></div>
						</div>
						<p class="hint-text">Pinch and rotate</p>
					</div>
				</div>
			</div>
			<CodeBlock :code="transformCode" />
		</DemoSection>

		<!-- Event info -->
		<DemoSection title="Event Data" description="Information available in rotation events">
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
							<td>angle</td>
							<td>Number</td>
							<td>Current angle in degrees</td>
						</tr>
						<tr>
							<td>radians</td>
							<td>Number</td>
							<td>Current angle in radians</td>
						</tr>
						<tr>
							<td>rotation</td>
							<td>Number</td>
							<td>Rotation relative to start</td>
						</tr>
						<tr>
							<td>centerX / centerY</td>
							<td>Number</td>
							<td>Center point between fingers</td>
						</tr>
						<tr>
							<td>isFirst</td>
							<td>Boolean</td>
							<td>First rotation event</td>
						</tr>
						<tr>
							<td>isFinal</td>
							<td>Boolean</td>
							<td>Final rotation event</td>
						</tr>
					</tbody>
				</table>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useRotateGesture" description="Using useRotateGesture composable">
			<div class="demo-box">
				<div ref="composableEl" class="rotate-area">
					<div class="rotate-content">
						<p>Using useRotateGesture</p>
						<p class="hint-text">Check console for events</p>
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
						<td>Callback when rotation starts</td>
					</tr>
					<tr>
						<td>onRotate</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback during rotation</td>
					</tr>
					<tr>
						<td>onEnd</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when rotation ends</td>
					</tr>
					<tr>
						<td>enableTransform</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Apply rotation transform</td>
					</tr>
					<tr>
						<td>transformOrigin</td>
						<td>String</td>
						<td>'center center'</td>
						<td>CSS transform-origin</td>
					</tr>
					<tr>
						<td>preventDefault</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Prevent default behavior</td>
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

.rotate-area {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 8px;
	padding: 60px 40px;
	touch-action: none;
	user-select: none;
}

.rotate-area.transform {
	transition: transform 0.1s ease-out;
}

.rotate-content {
	text-align: center;
	color: white;
}

.rotate-content p {
	margin: 0 0 8px 0;
}

.rotate-content .angle {
	font-size: 48px;
	font-weight: bold;
}

.rotate-content .direction {
	font-size: 16px;
	text-transform: capitalize;
}

.dial {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
	margin: 0 auto 16px;
	position: relative;
	border: 3px solid white;
}

.dial-marker {
	position: absolute;
	top: 0;
	left: 50%;
	width: 3px;
	height: 15px;
	background: white;
	transform: translateX(-50%);
	border-radius: 2px;
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
