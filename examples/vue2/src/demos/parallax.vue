<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'ParallaxDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	data() {
		return {
			speed: 0.5,
			reverseSpeed: 0.3,
		}
	},
	computed: {
		basicCode(): string {
			return `<!-- Simple parallax -->
<div v-parallax>Parallax content</div>

<!-- With speed factor -->
<div v-parallax="0.3">Slower parallax</div>`
		},
		optionsCode(): string {
			return `<div v-parallax="{
  speed: 0.5,
  reverse: true,
  horizontal: false,
  mobileBreakpoint: 768
}">
  Reverse parallax, disabled on mobile
</div>`
		},
		composableCode(): string {
			return `import { useParallax } from 'directix'

const { offset, isActive, bind } = useParallax({
  speed: 0.5,
  reverse: false
})

// Bind to element
onMounted(() => bind(containerRef.value))

// Access current offset
console.log('Parallax offset:', offset.value)`
		},
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-parallax</h1>
		<p class="intro">
			A directive for creating parallax scrolling effects. Elements move at different speeds relative to scroll position for depth effects.
		</p>

		<!-- Scenario 1: Basic parallax -->
		<DemoSection title="Basic Usage" description="Simple parallax effect">
			<div class="demo-box">
				<div class="parallax-container">
					<div v-parallax="speed" class="parallax-layer">
						<div class="parallax-content">
							<h3>Parallax Layer</h3>
							<p>Speed: {{ speed }}</p>
						</div>
					</div>
				</div>
				<div class="controls">
					<label>
						Speed: {{ speed }}
						<input type="range" v-model.number="speed" min="0.1" max="1" step="0.1" />
					</label>
				</div>
				<p class="hint">Scroll the page to see the effect. Higher values = faster movement.</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Reverse direction -->
		<DemoSection title="Reverse Direction" description="Parallax moving opposite to scroll">
			<div class="demo-box">
				<div class="parallax-container">
					<div
						v-parallax="{
							speed: reverseSpeed,
							reverse: true
						}"
						class="parallax-layer reverse"
					>
						<div class="parallax-content">
							<h3>Reverse Parallax</h3>
							<p>Moves opposite to scroll</p>
						</div>
					</div>
				</div>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Multi-layer demo -->
		<DemoSection title="Multi-Layer Parallax" description="Multiple layers at different speeds">
			<div class="demo-box">
				<div class="multi-layer-container">
					<div v-parallax="0.2" class="layer layer-1">
						<span>Layer 1 (0.2)</span>
					</div>
					<div v-parallax="0.5" class="layer layer-2">
						<span>Layer 2 (0.5)</span>
					</div>
					<div v-parallax="0.8" class="layer layer-3">
						<span>Layer 3 (0.8)</span>
					</div>
				</div>
				<p class="hint">Scroll to see layers move at different speeds</p>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useParallax" description="Using useParallax composable">
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
						<td>speed</td>
						<td>Number</td>
						<td>0.5</td>
						<td>Parallax speed factor (0-1)</td>
					</tr>
					<tr>
						<td>enabled</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Enable/disable effect</td>
					</tr>
					<tr>
						<td>reverse</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Reverse direction</td>
					</tr>
					<tr>
						<td>horizontal</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Horizontal parallax</td>
					</tr>
					<tr>
						<td>mobileBreakpoint</td>
						<td>Number</td>
						<td>-</td>
						<td>Disable below this width</td>
					</tr>
					<tr>
						<td>minScroll / maxScroll</td>
						<td>Number</td>
						<td>-</td>
						<td>Scroll position limits</td>
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

.parallax-container {
	height: 200px;
	overflow: hidden;
	border-radius: 8px;
	position: relative;
	background: #333;
}

.parallax-layer {
	position: relative;
	height: 100%;
	will-change: transform;
}

.parallax-layer.reverse {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.parallax-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: white;
	text-align: center;
}

.parallax-content h3 {
	margin: 0 0 8px 0;
	font-size: 20px;
}

.parallax-content p {
	margin: 0;
	opacity: 0.9;
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

.multi-layer-container {
	position: relative;
	height: 250px;
	overflow: hidden;
	border-radius: 8px;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.layer {
	position: absolute;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-weight: bold;
}

.layer-1 {
	height: 80px;
	top: 30px;
	background: rgba(66, 184, 131, 0.3);
}

.layer-2 {
	height: 80px;
	top: 90px;
	background: rgba(118, 75, 162, 0.3);
}

.layer-3 {
	height: 80px;
	top: 150px;
	background: rgba(16, 185, 129, 0.3);
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
