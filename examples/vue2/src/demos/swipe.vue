<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'SwipeDemo',
	components: { DemoSection, CodeBlock },
	data() {
		return {
			swipeDirection: '',
			swipeCount: 0,
			basicCode: `<div v-swipe="handleSwipe">
  Swipe in any direction
</div>`,
			directionCode: `<div v-swipe="{
  onLeft: () => prevSlide(),
  onRight: () => nextSlide()
}">
  Swipe left/right only
</div>`,
			horizontalCode: `<div v-swipe="{
  handler: handleSwipe,
  directions: ['left', 'right']
}">
  Horizontal swipes only
</div>`
		}
	},
	methods: {
		handleSwipe(direction: string) {
			this.swipeDirection = direction
			this.swipeCount++
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-swipe</h1>
		<p class="intro">
			Detects swipe gestures on touch devices. Supports four directions with customizable thresholds and callbacks.
		</p>

		<DemoSection title="Basic Usage" description="Detect swipes in any direction">
			<div class="demo-box">
				<div
					v-swipe="(dir) => handleSwipe(dir)"
					class="swipe-area"
				>
					<p>Swipe in any direction</p>
					<div class="arrows">
						<span>↑</span>
						<span>←  →</span>
						<span>↓</span>
					</div>
					<p class="result" v-if="swipeDirection">
						Last swipe: <strong>{{ swipeDirection }}</strong>
					</p>
					<p class="count">Total swipes: {{ swipeCount }}</p>
				</div>
				<p class="hint">Use touch gestures on mobile or drag on desktop</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<DemoSection title="Direction Callbacks" description="Individual callbacks for each direction">
			<div class="demo-box">
				<div
					v-swipe="{
						onLeft: () => handleSwipe('left'),
						onRight: () => handleSwipe('right'),
						onUp: () => handleSwipe('up'),
						onDown: () => handleSwipe('down'),
						threshold: 50
					}"
					class="swipe-area"
				>
					<p>Swipe with individual callbacks</p>
					<div class="arrows">
						<span>↑</span>
						<span>←  →</span>
						<span>↓</span>
					</div>
				</div>
			</div>
			<CodeBlock :code="directionCode" />
		</DemoSection>

		<DemoSection title="Horizontal Only" description="Limit to specific directions">
			<div class="demo-box">
				<div
					v-swipe="{
						handler: (dir) => handleSwipe(dir),
						directions: ['left', 'right'],
						threshold: 80
					}"
					class="swipe-area horizontal"
				>
					<p>← Swipe left or right only →</p>
				</div>
			</div>
			<CodeBlock :code="horizontalCode" />
		</DemoSection>

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
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>Handler called with (direction, event)</td>
					</tr>
					<tr>
						<td>threshold</td>
						<td>Number</td>
						<td>50</td>
						<td>Minimum distance to trigger (px)</td>
					</tr>
					<tr>
						<td>maxTime</td>
						<td>Number</td>
						<td>300</td>
						<td>Maximum swipe duration (ms)</td>
					</tr>
					<tr>
						<td>directions</td>
						<td>Array</td>
						<td>['left', 'right', 'up', 'down']</td>
						<td>Allowed directions</td>
					</tr>
					<tr>
						<td>onLeft/onRight/onUp/onDown</td>
						<td>Function</td>
						<td>-</td>
						<td>Direction-specific callbacks</td>
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

.swipe-area {
	background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
	color: white;
	padding: 40px;
	border-radius: 12px;
	text-align: center;
	touch-action: pan-y;
	user-select: none;
}

.swipe-area.horizontal {
	background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.arrows {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin: 16px 0;
	font-size: 20px;
}

.arrows span:nth-child(2) {
	display: flex;
	justify-content: center;
	gap: 40px;
}

.result {
	margin-top: 16px;
	font-size: 18px;
}

.result strong {
	color: #ffd700;
}

.count {
	font-size: 14px;
	opacity: 0.8;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
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
