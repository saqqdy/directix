<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'RotateGestureDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	data() {
		return {
			rotationAngle: 0,
			rotationDirection: '',
		}
	},
	computed: {
		basicCode(): string {
			return `<div v-rotate-gesture="handleRotate">
  Rotate with two fingers
</div>

<script>
function handleRotate(e) {
  console.log('Angle:', e.angle)
  console.log('Rotation:', e.rotation)
}
<\/script>`
		},
		transformCode(): string {
			return `<!-- Let directive handle transform -->
<div v-rotate-gesture="{
  enableTransform: true,
  transformOrigin: 'center center'
}">
  Rotate to spin element
</div>

<!-- Or handle transform yourself -->
<div v-rotate-gesture="{
  onRotate: (e) => angle = e.angle
}"
  :style="{ transform: 'rotate(' + angle + 'deg)' }">
  Rotate to spin element
</div>`
		},
		composableCode(): string {
			return `import { ref, onMounted } from 'vue'
import { useRotateGesture } from 'directix'

const el = ref<HTMLElement>()
const rotation = ref(0)

const { bind } = useRotateGesture({
  onRotate: (e) => rotation.value = e.rotation
})

onMounted(() => {
  if (el.value) bind(el.value)
})`
		},
	},
	methods: {
		handleRotate(e: any) {
			this.rotationAngle = Math.round(e.angle)
			this.rotationDirection = e.rotation > 0 ? 'Clockwise' : 'Counter-clockwise'
		},
	},
})
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
						enableTransform: true
					}"
					class="rotate-area transform"
				>
					<div class="rotate-content">
						<div class="dial">
							<div class="dial-marker"></div>
						</div>
						<p class="hint-text">Pinch and rotate</p>
						<p class="hint-text">(directive handles transform internally)</p>
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
				<CodeBlock :code="composableCode" />
			</div>
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
	background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
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
