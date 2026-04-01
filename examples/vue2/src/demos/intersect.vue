<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Vue from 'vue'
import { useIntersect } from 'directix'

export default defineComponent({
	name: 'IntersectDemo',
	setup() {
		// Scenario 1: Multiple items tracking
		const containerRef1 = ref<HTMLElement | null>(null)
		const itemStates = ref([false, false, false, false, false])

		const handleItemIntersect = (index: number, isIntersecting: boolean) => {
			// Vue 2 requires Vue.set for array reactivity
			Vue.set(itemStates.value, index, isIntersecting)
		}

		// Scenario 2: Enter/Leave with counter
		const containerRef2 = ref<HTMLElement | null>(null)
		const enterCount = ref(0)
		const leaveCount = ref(0)

		// Scenario 3: Once mode
		const containerRef3 = ref<HTMLElement | null>(null)
		const triggeredItems = ref([false, false, false, false, false])

		const triggerOnce = (index: number) => {
			// Vue 2 requires Vue.set for array reactivity
			Vue.set(triggeredItems.value, index, true)
		}

		// Scenario 4: Visibility percentage
		const containerRef4 = ref<HTMLElement | null>(null)
		const visibilityPercent = ref(0)

		const handleVisibilityChange = (isIntersecting: boolean, entry: IntersectionObserverEntry) => {
			visibilityPercent.value = Math.round(entry.intersectionRatio * 100)
		}

		const basicCode = `<!-- Track multiple items in scroll container -->
<div ref="containerRef" class="scroll-container">
  <div
    v-for="(item, i) in items"
    :key="i"
    v-intersect="{
      root: containerRef,
      onEnter: () => handleEnter(i),
      onLeave: () => handleLeave(i)
    }"
    :class="{ visible: isVisible[i] }"
  >
    {{ item }}
  </div>
</div>`

		const onceCode = `<div v-intersect="{
  root: containerRef,
  once: true,
  onEnter: handleTrigger
}">
  Triggers only once
</div>`

		const thresholdCode = `<div v-intersect="{
  root: containerRef,
  threshold: [0, 0.25, 0.5, 0.75, 1],
  onChange: handleVisibilityChange
}">
  Track visibility percentage
</div>`

		// Composable API demo
		const composableContainerRef = ref<HTMLElement | null>(null)
		const composableTargetRef = ref<HTMLElement | null>(null)
		const composableIsVisible = ref(false)
		const composableRatio = ref(0)

		const { isIntersecting, ratio, bind } = useIntersect({
			threshold: 0.5,
			onEnter: () => {
				composableIsVisible.value = true
			},
			onLeave: () => {
				composableIsVisible.value = false
			}
		})

		onMounted(() => {
			if (composableTargetRef.value) {
				bind(composableTargetRef.value)
			}
		})

		const composableCode = `<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useIntersect } from 'directix'

export \default defineComponent({
  setup() {
    const targetRef = ref<HTMLElement | null>(null)
    const { isIntersecting, ratio, bind } = useIntersect({
      threshold: 0.5,
      onEnter: () => console.log('Entered'),
      onLeave: () => console.log('Left')
    })

    onMounted(() => bind(targetRef.value))

    return { targetRef, isIntersecting, ratio }
  }
})
<\/script>

<template>
  <div ref="targetRef" :class="{ visible: isIntersecting }">
    Visibility: {{ Math.round(ratio * 100) }}%
  </div>
</template>`

		return {
			containerRef1,
			itemStates,
			handleItemIntersect,
			containerRef2,
			enterCount,
			leaveCount,
			containerRef3,
			triggeredItems,
			triggerOnce,
			containerRef4,
			visibilityPercent,
			handleVisibilityChange,
			basicCode,
			onceCode,
			thresholdCode,
			// Composable API
			composableContainerRef,
			composableTargetRef,
			composableIsVisible,
			composableRatio,
			isIntersecting,
			ratio,
			composableCode
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-intersect</h1>
		<p class="intro">
			A directive that uses IntersectionObserver to detect when elements enter or leave the viewport or a scroll container.
		</p>

		<!-- Scenario 1: Multiple items with real-time status -->
		<div class="demo-section">
			<h2>Track Multiple Elements</h2>
			<p class="description">Scroll to see items highlight when they enter the container</p>
			<div class="demo-box">
				<div class="status-row">
					<span class="status-label">Item Status:</span>
					<span
						v-for="(state, i) in itemStates"
						:key="i"
						class="status-dot"
						:class="{ active: state }"
						:title="`Item ${i + 1}: ${state ? 'Visible' : 'Hidden'}`"
					>
						{{ i + 1 }}
					</span>
				</div>
				<div ref="containerRef1" class="scroll-container">
					<div class="scroll-content">
						<div
							v-for="(item, i) in itemStates"
							:key="i"
							v-intersect="{
								root: containerRef1,
								onEnter: () => handleItemIntersect(i, true),
								onLeave: () => handleItemIntersect(i, false)
							}"
							class="track-item"
							:class="{ visible: itemStates[i] }"
						>
							Item {{ i + 1 }}
							<span class="item-status">{{ itemStates[i] ? '👁 Visible' : '👁‍🗨 Hidden' }}</span>
						</div>
					</div>
				</div>
				<p class="hint">Scroll up/down to see items toggle between visible/hidden states</p>
			</div>
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: Enter/Leave counter -->
		<div class="demo-section">
			<h2>Enter/Leave Counter</h2>
			<p class="description">Count how many times element enters and leaves</p>
			<div class="demo-box">
				<div class="counter-row">
					<div class="counter">
						<span class="counter-value">{{ enterCount }}</span>
						<span class="counter-label">Times Entered</span>
					</div>
					<div class="counter">
						<span class="counter-value">{{ leaveCount }}</span>
						<span class="counter-label">Times Left</span>
					</div>
				</div>
				<div ref="containerRef2" class="scroll-container">
					<div class="scroll-content tall">
						<div class="spacer">Scroll down ↓</div>
						<div
							v-intersect="{
								root: containerRef2,
								onEnter: () => enterCount++,
								onLeave: () => leaveCount++
							}"
							class="counter-box"
						>
							Scroll me in and out
						</div>
						<div class="spacer">Scroll up ↑</div>
					</div>
				</div>
				<p class="hint">Scroll up/down to see the counter increase</p>
			</div>
		</div>

		<!-- Scenario 3: Once mode -->
		<div class="demo-section">
			<h2>Once Mode</h2>
			<p class="description">Each item triggers only once, then stops observing</p>
			<div class="demo-box">
				<div class="status-row">
					<span class="status-label">Triggered:</span>
					<span
						v-for="(triggered, i) in triggeredItems"
						:key="i"
						class="status-dot"
						:class="{ active: triggered }"
					>
						{{ i + 1 }}
					</span>
				</div>
				<div ref="containerRef3" class="scroll-container">
					<div class="scroll-content">
						<div
							v-for="(_, i) in triggeredItems"
							:key="i"
							v-intersect="{
								root: containerRef3,
								once: true,
								onEnter: () => triggerOnce(i)
							}"
							class="once-item"
							:class="{ triggered: triggeredItems[i] }"
						>
							{{ triggeredItems[i] ? '✓ Triggered!' : 'Not yet' }}
						</div>
					</div>
				</div>
				<p class="hint">Each item only triggers once. Scroll away and back - triggered items stay triggered.</p>
			</div>
			<div class="code-block">
				<pre><code>{{ onceCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 4: Visibility percentage -->
		<div class="demo-section">
			<h2>Visibility Percentage</h2>
			<p class="description">Track how much of the element is visible</p>
			<div class="demo-box">
				<div class="visibility-display">
					<div class="visibility-bar">
						<div class="visibility-fill" :style="{ width: visibilityPercent + '%' }"></div>
					</div>
					<span class="visibility-text">{{ visibilityPercent }}% visible</span>
				</div>
				<div class="visibility-scroll-wrapper">
					<div ref="containerRef4" class="visibility-scroll">
						<div class="visibility-track">
							<div class="visibility-spacer"></div>
							<div
								v-intersect="{
									root: containerRef4,
									threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
									onChange: handleVisibilityChange
								}"
								class="visibility-box"
							>
								Track my visibility
							</div>
							<div class="visibility-spacer"></div>
						</div>
					</div>
				</div>
				<p class="hint">Scroll horizontally to see the visibility percentage change (0% - 100%)</p>
			</div>
			<div class="code-block">
				<pre><code>{{ thresholdCode }}</code></pre>
			</div>
		</div>

		<!-- Composable API -->
		<div class="demo-section">
			<h2>Composable API - useIntersect</h2>
			<p class="description">Programmatically detect element intersection using the composable</p>
			<div class="demo-box">
				<div class="status-row">
					<span class="status-label">Status:</span>
					<span class="status-dot" :class="{ active: composableIsVisible }">
						{{ composableIsVisible ? 'Visible' : 'Hidden' }}
					</span>
					<span class="status-label">Ratio: {{ Math.round(ratio * 100) }}%</span>
				</div>
				<div ref="composableContainerRef" class="scroll-container">
					<div class="scroll-content tall">
						<div class="spacer">Scroll down</div>
						<div
							ref="composableTargetRef"
							class="track-item"
							:class="{ visible: composableIsVisible }"
						>
							Track my visibility
							<span class="item-status">{{ composableIsVisible ? 'Visible' : 'Hidden' }}</span>
						</div>
						<div class="spacer">Scroll up</div>
					</div>
				</div>
				<p class="hint">Scroll to see the composable track intersection state</p>
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
						<td>Callback when element intersects</td>
					</tr>
					<tr>
						<td>onEnter</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when element enters viewport</td>
					</tr>
					<tr>
						<td>onLeave</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when element leaves viewport</td>
					</tr>
					<tr>
						<td>onChange</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback with isIntersecting boolean</td>
					</tr>
					<tr>
						<td>root</td>
						<td>Element</td>
						<td>null</td>
						<td>Root element for intersection (scroll container)</td>
					</tr>
					<tr>
						<td>rootMargin</td>
						<td>String</td>
						<td>'0px'</td>
						<td>Margin around root</td>
					</tr>
					<tr>
						<td>threshold</td>
						<td>Number/Array</td>
						<td>0</td>
						<td>Threshold(s) to trigger callback</td>
					</tr>
					<tr>
						<td>once</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Trigger only once</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable observer</td>
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
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
}

/* Status indicators */
.status-row {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 16px;
	flex-wrap: wrap;
}

.status-label {
	font-weight: 500;
	color: #333;
}

.status-dot {
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: #e0e0e0;
	color: #888;
	font-size: 14px;
	font-weight: 600;
	transition: all 0.3s;
}

.status-dot.active {
	background: #42b883;
	color: white;
}

/* Scroll containers */
.scroll-container {
	height: 180px;
	overflow-y: auto;
	overflow-x: hidden;
	background: white;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
}

.scroll-content {
	padding: 60px 16px;
}

.scroll-content.tall {
	padding: 100px 16px;
}

.spacer {
	padding: 40px;
	text-align: center;
	color: #999;
	font-size: 14px;
}

/* Track items */
.track-item {
	padding: 24px;
	margin-bottom: 60px;
	background: #f0f0f0;
	border: 3px solid #ddd;
	border-radius: 8px;
	text-align: center;
	transition: all 0.3s;
}

.track-item:last-child {
	margin-bottom: 0;
}

.track-item.visible {
	background: linear-gradient(135deg, #42b883, #35495e);
	border-color: #42b883;
	color: white;
}

.item-status {
	font-size: 12px;
	opacity: 0.8;
	margin-left: 8px;
}

/* Counter */
.counter-row {
	display: flex;
	gap: 24px;
	margin-bottom: 16px;
}

.counter {
	text-align: center;
}

.counter-value {
	display: block;
	font-size: 32px;
	font-weight: 700;
	color: #42b883;
}

.counter-label {
	font-size: 12px;
	color: #888;
}

.counter-box {
	padding: 40px;
	background: linear-gradient(135deg, #ed8936, #dd6b20);
	color: white;
	border-radius: 8px;
	text-align: center;
	font-weight: 600;
	font-size: 18px;
}

/* Once items */
.once-item {
	padding: 24px;
	margin-bottom: 60px;
	background: #f0f0f0;
	border: 3px dashed #ccc;
	border-radius: 8px;
	text-align: center;
	transition: all 0.3s;
}

.once-item.triggered {
	background: #48bb78;
	border-style: solid;
	border-color: #48bb78;
	color: white;
}

/* Visibility */
.visibility-display {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 16px;
}

.visibility-bar {
	flex: 1;
	height: 24px;
	background: #e0e0e0;
	border-radius: 12px;
	overflow: hidden;
}

.visibility-fill {
	height: 100%;
	background: linear-gradient(90deg, #42b883, #35495e);
	transition: width 0.15s;
}

.visibility-text {
	font-weight: 600;
	color: #42b883;
	min-width: 100px;
	text-align: right;
}

/* Visibility scroll - horizontal scrolling demo */
.visibility-scroll-wrapper {
	width: 100%;
	max-width: 300px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	background: white;
	overflow: hidden;
}

.visibility-scroll {
	width: 100%;
	height: 120px;
	overflow-x: auto;
	overflow-y: hidden;
}

.visibility-track {
	display: flex;
	width: max-content;
	min-width: 100%;
	align-items: center;
	height: 100%;
}

.visibility-spacer {
	width: 300px;
	height: 100%;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #bbb;
	font-size: 13px;
}

.visibility-spacer:first-child::after {
	content: '← Scroll this way';
}

.visibility-spacer:last-child::after {
	content: 'Scroll this way →';
}

.visibility-box {
	width: 300px;
	height: 80px;
	margin: 0;
	background: linear-gradient(135deg, #42b883, #35495e);
	color: white;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	flex-shrink: 0;
}

/* Code block */
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

/* API table */
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
