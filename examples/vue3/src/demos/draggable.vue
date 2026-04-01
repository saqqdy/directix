<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useDraggable } from 'directix'

const position = ref({ x: 0, y: 0 })
const axisXPosition = ref({ x: 0, y: 0 })
const axisYPosition = ref({ x: 0, y: 0 })

function handleDragStart(pos: { x: number; y: number }) {
	console.log('Drag start:', pos)
}

function handleDrag(pos: { x: number; y: number }) {
	position.value = pos
}

function handleDragEnd(pos: { x: number; y: number }) {
	console.log('Drag end:', pos)
}

function handleAxisXDrag(pos: { x: number; y: number }) {
	axisXPosition.value = pos
}

function handleAxisYDrag(pos: { x: number; y: number }) {
	axisYPosition.value = pos
}

// Composable API demo
const composableDragRef = ref<HTMLElement | null>(null)
const { position: composablePosition, isDragging: composableIsDragging, bind: bindDraggable } = useDraggable({
	constrain: true,
	onStart: (pos) => console.log('Drag start:', pos),
	onDrag: (pos) => console.log('Dragging:', pos),
	onEnd: (pos) => console.log('Drag end:', pos)
})

onMounted(() => {
	if (composableDragRef.value) {
		bindDraggable(composableDragRef.value)
	}
})

const composableCode = `import { ref, onMounted } from 'vue'
import { useDraggable } from 'directix'

const target = ref<HTMLElement | null>(null)
const { position, isDragging, bind } = useDraggable({
  constrain: true,
  onEnd: (pos) => console.log('Dropped at:', pos)
})

onMounted(() => {
  if (target.value) {
    bind(target.value)
  }
})`
</script>

<template>
	<div>
		<h2>v-draggable</h2>
		<p class="desc">
			The v-draggable directive makes elements draggable within a container or boundary.
		</p>

		<h3>Basic Usage</h3>
		<p class="hint">Drag the box anywhere in the container</p>
		<div class="demo-container">
			<div v-draggable class="draggable-box">
				<span class="drag-icon">⋮⋮</span>
				Drag me anywhere
			</div>
		</div>

		<h3>Axis Constraint</h3>
		<p class="hint">These boxes can only move along their constrained axis</p>
		<div class="axis-demo">
			<div class="axis-row">
				<div class="axis-label">X-Axis Only</div>
				<div class="axis-track horizontal">
					<div v-draggable="{ axis: 'x' }" class="draggable-box axis-box">
						<span class="arrow">↔</span>
						<span class="pos">X: {{ Math.round(axisXPosition.x) }}</span>
					</div>
				</div>
			</div>
			<div class="axis-row">
				<div class="axis-label">Y-Axis Only</div>
				<div class="axis-track vertical">
					<div v-draggable="{ axis: 'y', onDrag: handleAxisYDrag }" class="draggable-box axis-box">
						<span class="arrow">↕</span>
						<span class="pos">Y: {{ Math.round(axisYPosition.y) }}</span>
					</div>
				</div>
			</div>
		</div>

		<h3>Constrained to Parent</h3>
		<p class="hint">This box cannot be dragged outside the container</p>
		<div class="demo-container constrained">
			<div v-draggable="{ constrain: true }" class="draggable-box">
				Constrained
			</div>
		</div>

		<h3>With Handle</h3>
		<p class="hint">Only the header area can be used to drag</p>
		<div class="demo-container">
			<div v-draggable="{ handle: '.drag-handle' }" class="draggable-box with-handle">
				<div class="drag-handle">
					<span class="drag-icon">⋮⋮</span>
					<span>Drag Handle</span>
				</div>
				<div class="box-content">Content Area (not draggable)</div>
			</div>
		</div>

		<h3>Grid Snapping</h3>
		<p class="hint">Snaps to 40px grid increments</p>
		<div class="demo-container">
			<div v-draggable="{ grid: [40, 40] }" class="draggable-box">
				Snap 40px
			</div>
		</div>

		<h3>With Callbacks</h3>
		<p class="hint">Tracks position in real-time</p>
		<div class="demo-container">
			<div
				v-draggable="{
					onStart: handleDragStart,
					onDrag: handleDrag,
					onEnd: handleDragEnd
				}"
				class="draggable-box callback-box"
			>
				<div class="position-display">
					<span>X: {{ Math.round(position.x) }}</span>
					<span>Y: {{ Math.round(position.y) }}</span>
				</div>
			</div>
		</div>

		<h3>Code Example</h3>
		<pre class="code"><code>&lt;!-- Basic usage --&gt;
&lt;div v-draggable&gt;Drag me&lt;/div&gt;

&lt;!-- Axis constraint --&gt;
&lt;div v-draggable="{ axis: 'x' }"&gt;X only&lt;/div&gt;
&lt;div v-draggable="{ axis: 'y' }"&gt;Y only&lt;/div&gt;

&lt;!-- Constrained to parent --&gt;
&lt;div v-draggable="{ constrain: true }"&gt;Constrained&lt;/div&gt;

&lt;!-- With handle --&gt;
&lt;div v-draggable="{ handle: '.handle' }"&gt;
  &lt;div class="handle"&gt;Drag here&lt;/div&gt;
  &lt;div&gt;Content&lt;/div&gt;
&lt;/div&gt;

&lt;!-- Grid snapping --&gt;
&lt;div v-draggable="{ grid: [40, 40] }"&gt;Snap&lt;/div&gt;</code></pre>

		<!-- Composable API -->
		<DemoSection title="Composable API - useDraggable" description="Using useDraggable composable for programmatic control">
			<p class="hint">Drag the box - constrained to container using composable API</p>
			<div class="demo-container">
				<div
					ref="composableDragRef"
					class="draggable-box composable-box"
					:class="{ dragging: composableIsDragging }"
				>
					<span class="drag-icon">⋮⋮</span>
					<div class="position-display">
						<span>X: {{ Math.round(composablePosition.x) }}</span>
						<span>Y: {{ Math.round(composablePosition.y) }}</span>
					</div>
				</div>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>
	</div>
</template>

<style scoped>
h3 {
	margin-top: 24px;
	margin-bottom: 8px;
	color: #333;
}

.desc {
	color: #666;
	margin-bottom: 20px;
}

.hint {
	color: #888;
	font-size: 14px;
	margin-bottom: 12px;
}

.demo-container {
	position: relative;
	height: 180px;
	background: #f0f2f5;
	border-radius: 12px;
	margin-bottom: 16px;
	overflow: hidden;
	border: 1px solid #e0e0e0;
}

.demo-container.constrained {
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
}

.draggable-box {
	position: absolute;
	top: 20px;
	left: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	width: 150px;
	height: 80px;
	padding: 10px;
	border-radius: 10px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	font-size: 14px;
	text-align: center;
	cursor: grab;
	user-select: none;
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	transition: box-shadow 0.2s, transform 0.1s;
}

.draggable-box:hover {
	box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.draggable-box:active {
	cursor: grabbing;
}

.drag-icon {
	font-size: 16px;
	letter-spacing: -2px;
	opacity: 0.8;
}

/* Axis Demo */
.axis-demo {
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-bottom: 24px;
}

.axis-row {
	display: flex;
	align-items: stretch;
	gap: 16px;
}

.axis-label {
	width: 100px;
	display: flex;
	align-items: center;
	font-size: 14px;
	font-weight: 500;
	color: #555;
}

.axis-track {
	flex: 1;
	position: relative;
	background: #f0f2f5;
	border-radius: 8px;
	border: 1px solid #e0e0e0;
}

.axis-track.horizontal {
	height: 100px;
}

.axis-track.vertical {
	width: 100px;
	height: 200px;
}

.axis-box {
	width: 80px;
	height: 60px;
	font-size: 12px;
	flex-direction: column;
	gap: 4px;
	top: 20px;
	left: 20px;
	background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
	box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
}

.axis-box .arrow {
	font-size: 20px;
	font-weight: bold;
}

.axis-box .pos {
	font-size: 11px;
	opacity: 0.9;
}

/* With Handle */
.draggable-box.with-handle {
	flex-direction: column;
	align-items: stretch;
	width: 200px;
	padding: 0;
	cursor: default;
}

.drag-handle {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	padding: 10px 12px;
	border-radius: 10px 10px 0 0;
	border-bottom: 1px solid rgba(255, 255, 255, 0.15);
	background: rgba(0, 0, 0, 0.2);
	font-size: 13px;
	cursor: grab;
	transition: background 0.2s;
}

.drag-handle:hover {
	background: rgba(0, 0, 0, 0.35);
}

.drag-handle:active {
	cursor: grabbing;
	background: rgba(0, 0, 0, 0.4);
}

.box-content {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16px 8px;
	font-size: 12px;
	opacity: 0.85;
	cursor: not-allowed;
}

/* Callback Box */
.callback-box {
	flex-direction: column;
	gap: 4px;
}

/* Composable Box */
.composable-box {
	background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%);
	box-shadow: 0 4px 12px rgba(159, 122, 234, 0.3);
	flex-direction: column;
	gap: 4px;
}

.composable-box.dragging {
	box-shadow: 0 8px 24px rgba(159, 122, 234, 0.5);
}

.position-display {
	display: flex;
	gap: 16px;
	font-family: 'SF Mono', Monaco, monospace;
	font-size: 13px;
}

/* Code Block */
.code {
	padding: 16px;
	border-radius: 8px;
	background: #1e1e2e;
	color: #cdd6f4;
	font-size: 14px;
	line-height: 1.7;
	overflow-x: auto;
}

@media (max-width: 600px) {
	.axis-row {
		flex-direction: column;
	}

	.axis-label {
		width: auto;
	}

	.axis-track.vertical {
		width: 100%;
		height: 120px;
	}
}
</style>
