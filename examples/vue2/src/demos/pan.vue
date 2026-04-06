<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { usePan } from 'directix'

export default defineComponent({
	name: 'PanDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	setup() {
		// Composable API demo
		const composableEl = ref<HTMLElement>()
		const composablePosition = ref({ x: 0, y: 0 })
		const composableDir = ref('')

		const { isPanning, direction, distance, bind } = usePan({
			onPan: (e) => {
				composablePosition.value = { x: e.deltaX, y: e.deltaY }
				composableDir.value = e.direction
			}
		})

		onMounted(() => {
			if (composableEl.value) {
				bind(composableEl.value)
			}
		})

		const composableCode = `import { ref, onMounted } from 'vue'
import { usePan } from 'directix'

const el = ref<HTMLElement>()

const { isPanning, direction, distance, bind } = usePan({
  onPan: (e) => {
    console.log('Direction:', e.direction)
    console.log('Distance:', e.distance)
  },
  onStart: (e) => console.log('Pan started'),
  onEnd: (e) => console.log('Pan ended')
})

onMounted(() => {
  if (el.value) {
    bind(el.value)
  }
})`

		return {
			composableEl,
			composablePosition,
			composableDir,
			composableCode
		}
	},
	data() {
		return {
			panPosition: { x: 0, y: 0 },
			panDirection: '',
			horizontalOffset: 0,
			thresholdPan: { x: 0, y: 0, distance: 0 },
		}
	},
	methods: {
		handlePan(e: any) {
			this.panPosition = { x: e.deltaX, y: e.deltaY }
			this.panDirection = e.direction
		},
		handleHorizontalPan(e: any) {
			this.horizontalOffset = e.deltaX
		},
		handleThresholdPan(e: any) {
			this.thresholdPan = { x: e.deltaX, y: e.deltaY, distance: e.distance }
		},
	},
	computed: {
		basicCode(): string {
			return `<div v-pan="{ onPan: handlePan }">
  Drag me around
</div>

<script>
function handlePan(e) {
  console.log('Direction:', e.direction)
  console.log('Delta:', e.deltaX, e.deltaY)
  console.log('Distance:', e.distance)
}
<\/script>`
		},
		directionCode(): string {
			return `<div v-pan="{
  onPan: handlePan,
  direction: 'horizontal',
  threshold: 20
}">
  Horizontal pan only
</div>`
		},
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-pan</h1>
		<p class="intro">
			A directive for handling pan/drag gestures on touch and mouse devices. Perfect for swipeable content and drag interactions.
		</p>

		<!-- Scenario 1: Basic pan -->
		<DemoSection title="Basic Usage" description="Pan in any direction">
			<div class="demo-box">
				<div
					v-pan="{ onPan: handlePan }"
					class="pan-area"
				>
					<div class="pan-content">
						<p class="direction">Direction: {{ panDirection || '-' }}</p>
						<p class="position">Delta: {{ Math.round(panPosition.x) }}, {{ Math.round(panPosition.y) }}</p>
						<p class="hint-text">Drag or swipe anywhere</p>
					</div>
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Horizontal only -->
		<DemoSection title="Horizontal Only" description="Constrain to horizontal panning">
			<div class="demo-box">
				<div
					v-pan="{
						onPan: handleHorizontalPan,
						direction: 'horizontal',
						threshold: 5
					}"
					class="pan-area horizontal"
				>
					<div class="slider-track">
						<div class="slider-thumb" :style="{ left: `${Math.min(Math.max(horizontalOffset + 100, 0), 200)}px` }"></div>
					</div>
					<p class="hint-text">Swipe left/right</p>
				</div>
			</div>
			<CodeBlock :code="directionCode" />
		</DemoSection>

		<!-- Scenario 3: With threshold -->
		<DemoSection title="With Threshold" description="Minimum distance before pan starts">
			<div class="demo-box">
				<div
					v-pan="{
						onPan: handleThresholdPan,
						threshold: 50
					}"
					class="pan-area"
				>
					<div class="pan-content">
						<p>Distance: {{ Math.round(thresholdPan.distance) }}px</p>
						<p class="hint-text">Pan starts after 50px threshold</p>
					</div>
				</div>
			</div>
		</DemoSection>

		<!-- Event info -->
		<DemoSection title="Event Data" description="Information available in pan events">
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
							<td>direction</td>
							<td>String</td>
							<td>'left' | 'right' | 'up' | 'down'</td>
						</tr>
						<tr>
							<td>deltaX / deltaY</td>
							<td>Number</td>
							<td>Distance from start position</td>
						</tr>
						<tr>
							<td>distance</td>
							<td>Number</td>
							<td>Total distance traveled</td>
						</tr>
						<tr>
							<td>velocity</td>
							<td>Number</td>
							<td>Pan velocity</td>
						</tr>
						<tr>
							<td>isFirst</td>
							<td>Boolean</td>
							<td>First pan event</td>
						</tr>
						<tr>
							<td>isFinal</td>
							<td>Boolean</td>
							<td>Final pan event</td>
						</tr>
					</tbody>
				</table>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - usePan" description="Using usePan composable">
			<div class="demo-box">
				<div ref="composableEl" class="pan-area">
					<div class="pan-content">
						<p class="direction">Direction: {{ composableDir || '-' }}</p>
						<p class="position">Delta: {{ Math.round(composablePosition.x) }}, {{ Math.round(composablePosition.y) }}</p>
						<p class="hint-text">Using usePan composable (bind method)</p>
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
						<td>Callback when pan starts</td>
					</tr>
					<tr>
						<td>onPan</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback during pan</td>
					</tr>
					<tr>
						<td>onEnd</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when pan ends</td>
					</tr>
					<tr>
						<td>threshold</td>
						<td>Number</td>
						<td>10</td>
						<td>Min distance to trigger</td>
					</tr>
					<tr>
						<td>direction</td>
						<td>String</td>
						<td>'all'</td>
						<td>'horizontal', 'vertical', 'all'</td>
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

.demo-box {
	padding: 20px;
	background: #f8f9fa;
	border-radius: 8px;
	margin-bottom: 12px;
}

.pan-area {
	background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
	border-radius: 8px;
	padding: 40px;
	touch-action: none;
	user-select: none;
	cursor: grab;
}

.pan-area:active {
	cursor: grabbing;
}

.pan-area.horizontal {
	padding: 30px 40px;
}

.pan-content {
	text-align: center;
	color: white;
}

.pan-content p {
	margin: 0 0 8px 0;
}

.pan-content .direction {
	font-size: 24px;
	font-weight: bold;
	text-transform: capitalize;
}

.pan-content .position {
	font-size: 16px;
	font-family: monospace;
}

.hint-text {
	font-size: 13px;
	opacity: 0.8;
}

.slider-track {
	width: 200px;
	height: 8px;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 4px;
	margin: 0 auto;
	position: relative;
}

.slider-thumb {
	width: 24px;
	height: 24px;
	background: white;
	border-radius: 50%;
	position: absolute;
	top: -8px;
	transform: translateX(-50%);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
