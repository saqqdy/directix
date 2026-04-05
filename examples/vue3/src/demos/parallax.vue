<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

const speed1 = ref(0.2)
const speed2 = ref(0.5)
const speed3 = ref(0.8)

const basicCode = `<!-- Simple parallax -->
<div v-parallax>Parallax content</div>

<!-- With speed factor -->
<div v-parallax="0.3">Slower parallax</div>

<!-- With options -->
<div v-parallax="{ speed: 0.5, reverse: true }">
  Reverse parallax
</div>`

const multiCode = `<!-- Multi-layer parallax -->
<div class="scene">
  <div v-parallax="0.1" class="layer far">Far layer</div>
  <div v-parallax="0.5" class="layer mid">Middle layer</div>
  <div v-parallax="0.9" class="layer near">Near layer</div>
</div>`
</script>

<template>
	<div class="demo-page">
		<h1>v-parallax</h1>
		<p class="intro">
			Creates parallax scrolling effects where elements move at different speeds relative to scroll position, creating depth and visual interest.
		</p>

		<!-- Speed Comparison -->
		<DemoSection title="Speed Comparison" description="Scroll inside the container to see different speeds">
			<div class="demo-box">
				<div class="scroll-container">
					<div class="scroll-content">
						<div class="spacer"></div>

						<div class="parallax-row">
							<div class="speed-bar slow" v-parallax="speed1">
								<span>Speed {{ speed1 }}</span>
							</div>
						</div>

						<div class="spacer small"></div>

						<div class="parallax-row">
							<div class="speed-bar medium" v-parallax="speed2">
								<span>Speed {{ speed2 }}</span>
							</div>
						</div>

						<div class="spacer small"></div>

						<div class="parallax-row">
							<div class="speed-bar fast" v-parallax="speed3">
								<span>Speed {{ speed3 }}</span>
							</div>
						</div>

						<div class="spacer"></div>
					</div>
				</div>

				<div class="controls">
					<label>
						<span>Slow: {{ speed1 }}</span>
						<input type="range" v-model.number="speed1" min="0" max="1" step="0.1" />
					</label>
					<label>
						<span>Medium: {{ speed2 }}</span>
						<input type="range" v-model.number="speed2" min="0" max="1" step="0.1" />
					</label>
					<label>
						<span>Fast: {{ speed3 }}</span>
						<input type="range" v-model.number="speed3" min="0" max="1" step="0.1" />
					</label>
				</div>
				<p class="hint">Scroll inside the container above to see elements move at different speeds</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Multi-Layer Scene -->
		<DemoSection title="Multi-Layer Scene" description="Layers at different depths create 3D effect">
			<div class="demo-box">
				<div class="scroll-container tall">
					<div class="scroll-content">
						<div class="spacer"></div>

						<div class="scene">
							<div v-parallax="0.15" class="scene-layer sky">
								<div class="sun"></div>
								<div class="cloud c1"></div>
								<div class="cloud c2"></div>
							</div>

							<div v-parallax="0.4" class="scene-layer mountains">
								<div class="mountain m1"></div>
								<div class="mountain m2"></div>
							</div>

							<div v-parallax="0.7" class="scene-layer trees">
								<span class="tree">🌲</span>
								<span class="tree">🌳</span>
								<span class="tree">🌲</span>
							</div>
						</div>

						<div class="spacer"></div>
					</div>
				</div>
				<p class="hint">Scroll to see layers at different depths</p>
			</div>
			<CodeBlock :code="multiCode" />
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
						<td>Parallax speed factor (0-1). 0 = fixed, 1 = normal scroll</td>
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

/* Scroll Container */
.scroll-container {
	height: 300px;
	overflow-y: auto;
	overflow-x: hidden;
	background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%);
	border-radius: 8px;
	border: 2px solid #ccc;
}

.scroll-container.tall {
	height: 400px;
}

.scroll-content {
	position: relative;
}

.spacer {
	height: 200px;
}

.spacer.small {
	height: 80px;
}

/* Speed Bars */
.parallax-row {
	padding: 0 20px;
}

.speed-bar {
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	color: white;
	font-weight: 600;
	font-size: 16px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.speed-bar.slow {
	background: linear-gradient(135deg, #667eea, #764ba2);
}

.speed-bar.medium {
	background: linear-gradient(135deg, #f093fb, #f5576c);
}

.speed-bar.fast {
	background: linear-gradient(135deg, #4facfe, #00f2fe);
}

/* Controls */
.controls {
	display: flex;
	gap: 24px;
	justify-content: center;
	margin-top: 16px;
	flex-wrap: wrap;
}

.controls label {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	color: #666;
}

.controls input[type='range'] {
	width: 120px;
}

/* Scene */
.scene {
	position: relative;
	height: 280px;
	overflow: hidden;
	border-radius: 12px;
	background: linear-gradient(to bottom, #87ceeb 0%, #b0e0e6 100%);
	margin: 0 20px;
}

.scene-layer {
	position: absolute;
	width: 100%;
	height: 100%;
}

/* Sky */
.sun {
	position: absolute;
	top: 30px;
	right: 50px;
	width: 50px;
	height: 50px;
	background: radial-gradient(circle, #ffd700, #ff8c00);
	border-radius: 50%;
	box-shadow: 0 0 30px #ffd700;
}

.cloud {
	position: absolute;
	background: white;
	border-radius: 50px;
	opacity: 0.9;
}

.c1 {
	top: 40px;
	left: 20%;
	width: 80px;
	height: 30px;
}

.c2 {
	top: 70px;
	left: 60%;
	width: 60px;
	height: 25px;
}

/* Mountains */
.mountains {
	bottom: 0;
	height: 150px;
}

.mountain {
	position: absolute;
	bottom: 0;
	border-style: solid;
	border-color: transparent transparent #6b7280 transparent;
}

.m1 {
	left: 0;
	border-width: 0 100px 120px 100px;
}

.m2 {
	right: 0;
	border-width: 0 120px 140px 120px;
	border-color: transparent transparent #4b5563 transparent;
}

/* Trees */
.trees {
	bottom: 0;
	height: 80px;
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
	padding: 0 20px;
}

.tree {
	font-size: 40px;
}

/* Hint */
.hint {
	font-size: 13px;
	color: #888;
	margin-top: 16px;
	text-align: center;
}

/* API Table */
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
