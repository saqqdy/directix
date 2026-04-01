<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useSwipe } from 'directix'

// Basic Usage
const swipeDirection = ref('')
const swipeCount = ref(0)
const handleSwipe = (direction: string) => {
	swipeDirection.value = direction
	swipeCount.value++
}

// Direction Callbacks
const directionSwipe = ref('')
const handleDirectionSwipe = (direction: string) => {
	directionSwipe.value = direction
}

// Horizontal Only
const horizontalSwipe = ref('')
const handleHorizontalSwipe = (direction: string) => {
	horizontalSwipe.value = direction
}

const basicCode = `<div v-swipe="handleSwipe">
  Swipe in any direction
</div>`

const directionCode = `<div v-swipe="{
  onLeft: () => prevSlide(),
  onRight: () => nextSlide()
}">
  Swipe left/right only
</div>`

const horizontalCode = `<div v-swipe="{
  handler: handleSwipe,
  directions: ['left', 'right']
}">
  Horizontal swipes only
</div>`

// Composable API demo
const composableSwipeRef = ref<HTMLElement | null>(null)
const composableSwipeDirection = ref('')
const composableSwipeCount = ref(0)
const {
	direction: composableDirection,
	isSwiping: composableIsSwiping,
	bind: bindSwipe
} = useSwipe({
	threshold: 30,
	onLeft: () => {
		composableSwipeDirection.value = 'left'
		composableSwipeCount.value++
	},
	onRight: () => {
		composableSwipeDirection.value = 'right'
		composableSwipeCount.value++
	},
	onUp: () => {
		composableSwipeDirection.value = 'up'
		composableSwipeCount.value++
	},
	onDown: () => {
		composableSwipeDirection.value = 'down'
		composableSwipeCount.value++
	}
})

onMounted(() => {
	if (composableSwipeRef.value) {
		bindSwipe(composableSwipeRef.value)
	}
})

const composableCode = `import { ref, onMounted } from 'vue'
import { useSwipe } from 'directix'

const container = ref(null)
const { direction, isSwiping, bind } = useSwipe({
  threshold: 30,
  onLeft: () => prevSlide(),
  onRight: () => nextSlide()
})

onMounted(() => {
  bind(container.value)
})

// Usage in template:
// <div ref="container" class="swipe-area">
//   Swipe me!
//   Last direction: {{ direction }}
// </div>`
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
						onLeft: () => handleDirectionSwipe('left'),
						onRight: () => handleDirectionSwipe('right'),
						onUp: () => handleDirectionSwipe('up'),
						onDown: () => handleDirectionSwipe('down'),
						threshold: 30
					}"
					class="swipe-area"
				>
					<p>Swipe with individual callbacks</p>
					<div class="arrows">
						<span>↑</span>
						<span>←  →</span>
						<span>↓</span>
					</div>
					<p class="result" v-if="directionSwipe">
						Last swipe: <strong>{{ directionSwipe }}</strong>
					</p>
					<p class="hint" v-else>Swipe to see direction</p>
				</div>
			</div>
			<CodeBlock :code="directionCode" />
		</DemoSection>

		<DemoSection title="Horizontal Only" description="Limit to specific directions">
			<div class="demo-box">
				<div
					v-swipe="{
						handler: (dir) => handleHorizontalSwipe(dir),
						directions: ['left', 'right'],
						threshold: 30
					}"
					class="swipe-area horizontal"
				>
					<p>← Swipe left or right only →</p>
					<p class="result" v-if="horizontalSwipe">
						Last swipe: <strong>{{ horizontalSwipe }}</strong>
					</p>
					<p class="hint" v-else>Swipe horizontally</p>
				</div>
			</div>
			<CodeBlock :code="horizontalCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useSwipe" description="Using useSwipe composable for programmatic swipe detection">
			<div class="demo-box">
				<div
					ref="composableSwipeRef"
					class="swipe-area composable"
				>
					<p>Swipe in any direction (Composable)</p>
					<div class="arrows">
						<span>↑</span>
						<span>←  →</span>
						<span>↓</span>
					</div>
					<p class="result" v-if="composableSwipeDirection">
						Last swipe: <strong>{{ composableSwipeDirection }}</strong>
					</p>
					<p class="hint" v-else>Swipe to see direction</p>
					<p class="count">Total swipes: {{ composableSwipeCount }}</p>
				</div>
				<p class="hint">This uses the useSwipe composable instead of the directive</p>
			</div>
			<CodeBlock :code="composableCode" />
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
						<td>30</td>
						<td>Minimum distance to trigger (px)</td>
					</tr>
					<tr>
						<td>maxTime</td>
						<td>Number</td>
						<td>500</td>
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
					<tr>
						<td>mouse</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Enable mouse support</td>
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
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	padding: 40px;
	border-radius: 12px;
	text-align: center;
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

.swipe-area .hint {
	color: rgba(255, 255, 255, 0.7);
	margin-top: 8px;
}

.swipe-area.composable {
	background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
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
