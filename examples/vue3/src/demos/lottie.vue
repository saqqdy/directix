<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useLottie } from 'directix'

// Sample animation URL (public Lottie animation)
const animationUrl = 'https://assets2.lottiefiles.com/packages/lf20_UJNc2t.json'

// Scenario 1: Basic usage
const basicEl = ref<HTMLElement>()

// Scenario 2: With options
const optionsEl = ref<HTMLElement>()

// Scenario 3: Speed control
const speed = ref(1)
const speedEl = ref<HTMLElement>()

// Control Methods demo
const controlEl = ref<HTMLElement>()

// Composable API demo
const composableEl = ref<HTMLElement>()
const { play, pause, stop, setSpeed, setDirection, bind } = useLottie({
	animationData: animationUrl,
	autoplay: true,
	loop: true
})

onMounted(() => {
	if (composableEl.value) {
		bind(composableEl.value)
	}
})

const basicCode = `<!-- With URL -->
<div v-lottie="'https://assets.example.com/animation.json'"></div>

<!-- With animation data -->
<div v-lottie="animationData"></div>`

const optionsCode = `<div v-lottie="{
  animationData: animationData,
  autoplay: true,
  loop: true,
  speed: 1.5,
  renderer: 'svg'
}"></div>`

const controlCode = `<!-- Element exposes methods -->
<div v-lottie="animationData" ref="el"></div>

<script setup>
const el = ref()

// Control methods
el.value.lottiePlay()
el.value.lottiePause()
el.value.lottieStop()
el.value.lottieSetSpeed(2)
el.value.lottieSetDirection(-1)
<\/script>`

const composableCode = `import { ref, onMounted } from 'vue'
import { useLottie } from 'directix'

const el = ref<HTMLElement>()
const { play, pause, stop, setSpeed, setDirection, bind } = useLottie({
  animationData: animationUrl,
  autoplay: true,
  loop: true
})

onMounted(() => {
  if (el.value) bind(el.value)
})

// Control animation
play()           // Play animation
pause()          // Pause animation
stop()           // Stop and reset
setSpeed(2)      // Set speed to 2x
setDirection(-1) // Reverse direction`

function handlePlay() {
	;(controlEl.value as any)?.lottiePlay?.()
}

function handlePause() {
	;(controlEl.value as any)?.lottiePause?.()
}

function handleStop() {
	;(controlEl.value as any)?.lottieStop?.()
}
</script>

<template>
	<div class="demo-page">
		<h1>v-lottie</h1>
		<p class="intro">
			A directive for rendering Lottie animations. Supports remote URLs and local animation data with full playback control.
		</p>

		<div class="note">
			<strong>Note:</strong> lottie-web must be installed: <code>npm install lottie-web</code>
		</div>

		<!-- Scenario 1: Basic usage -->
		<DemoSection title="Basic Usage" description="Load animation from URL">
			<div class="demo-box">
				<div ref="basicEl" v-lottie="animationUrl" class="animation-container"></div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With options -->
		<DemoSection title="With Options" description="Customize animation settings">
			<div class="demo-box">
				<div
					ref="optionsEl"
					v-lottie="{
						animationData: animationUrl,
						autoplay: true,
						loop: true,
						speed: 1,
						renderer: 'svg'
					}"
					class="animation-container"
				></div>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Scenario 3: Speed control -->
		<DemoSection title="Speed Control" description="Adjust animation speed dynamically">
			<div class="demo-box">
				<div
					ref="speedEl"
					v-lottie="{
						animationData: animationUrl,
						autoplay: true,
						loop: true,
						speed: speed
					}"
					class="animation-container small"
				></div>
				<div class="controls">
					<label>
						Speed: {{ speed }}x
						<input type="range" v-model.number="speed" min="0.1" max="3" step="0.1" />
					</label>
				</div>
			</div>
		</DemoSection>

		<!-- Control methods -->
		<DemoSection title="Control Methods" description="Programmatic playback control">
			<div class="demo-box">
				<div ref="controlEl" v-lottie="animationUrl" class="animation-container"></div>
				<div class="button-group">
					<button @click="handlePlay" class="btn">Play</button>
					<button @click="handlePause" class="btn btn-secondary">Pause</button>
					<button @click="handleStop" class="btn btn-outline">Stop</button>
				</div>
				<p class="hint">Control animation using exposed methods</p>
			</div>
			<CodeBlock :code="controlCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useLottie" description="Using useLottie composable">
			<div class="demo-box">
				<div ref="composableEl" class="animation-container"></div>
				<div class="button-group">
					<button @click="play()" class="btn">Play</button>
					<button @click="pause()" class="btn btn-secondary">Pause</button>
					<button @click="stop()" class="btn btn-outline">Stop</button>
					<button @click="setSpeed(2)" class="btn">2x Speed</button>
					<button @click="setDirection(-1)" class="btn">Reverse</button>
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
						<td>animationData</td>
						<td>Object | String</td>
						<td>-</td>
						<td>Animation JSON or URL (required)</td>
					</tr>
					<tr>
						<td>autoplay</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Auto play on load</td>
					</tr>
					<tr>
						<td>loop</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Loop animation</td>
					</tr>
					<tr>
						<td>speed</td>
						<td>Number</td>
						<td>1</td>
						<td>Playback speed (0.1-3)</td>
					</tr>
					<tr>
						<td>direction</td>
						<td>1 | -1</td>
						<td>1</td>
						<td>1=forward, -1=reverse</td>
					</tr>
					<tr>
						<td>renderer</td>
						<td>String</td>
						<td>'svg'</td>
						<td>Renderer: svg, canvas, html</td>
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
	background: #fff3cd;
	border-radius: 6px;
	font-size: 13px;
	color: #856404;
	margin-bottom: 24px;
}

.note code {
	background: rgba(0, 0, 0, 0.1);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
}

.demo-box {
	padding: 20px;
	background: #f8f9fa;
	border-radius: 8px;
	margin-bottom: 12px;
}

.animation-container {
	width: 200px;
	height: 200px;
	margin: 0 auto;
	background: white;
	border-radius: 8px;
}

.animation-container.small {
	width: 150px;
	height: 150px;
}

.controls {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 16px;
}

.controls label {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	color: #666;
}

.controls input[type="range"] {
	width: 200px;
}

.button-group {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
	justify-content: center;
	margin-top: 16px;
}

.btn {
	padding: 10px 20px;
	background: #667eea;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
}

.btn:hover {
	background: #5a6fd6;
}

.btn-secondary {
	background: #6b7280;
}

.btn-outline {
	background: transparent;
	border: 1px solid #667eea;
	color: #667eea;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
	text-align: center;
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
