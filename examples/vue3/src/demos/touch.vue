<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTouch } from 'directix'

// ==================== Composable API ====================
// Touch composable refs
const touchContainerRef = ref<HTMLElement | null>(null)
const touchContainerRef2 = ref<HTMLElement | null>(null)
const composableSwipeDirection = ref('')
const composableTapCount = ref(0)
const composableScale = ref(1)
const composableAngle = ref(0)
const composableGesture = ref<string | null>(null)

// Touch composable for swipe detection
const { gesture: swipeGesture, bind: bindSwipe } = useTouch({
	onSwipe: (e) => {
		composableSwipeDirection.value = e.direction || ''
		setTimeout(() => {
			composableSwipeDirection.value = ''
		}, 500)
	},
})

// Touch composable for tap and long press
const { gesture: tapGesture, bind: bindTap } = useTouch({
	onTap: () => {
		composableTapCount.value++
	},
	onLongPress: () => {
		composableGesture.value = 'longPress'
		setTimeout(() => {
			composableGesture.value = null
		}, 800)
	},
})

// Touch composable for pinch and rotate
const { bind: bindPinch } = useTouch({
	onPinch: (e) => {
		if (e.scale) {
			composableScale.value = Math.max(0.5, Math.min(3, Math.round(e.scale * 100) / 100))
		}
	},
	onRotate: (e) => {
		if (e.rotation) {
			composableAngle.value = Math.round(composableAngle.value + e.rotation)
		}
	},
})

const composableBoxStyle = computed(() => ({
	transform: `scale(${composableScale.value}) rotate(${composableAngle.value}deg)`,
}))

function resetComposableTransform() {
	composableScale.value = 1
	composableAngle.value = 0
}

onMounted(() => {
	if (touchContainerRef.value) bindSwipe(touchContainerRef.value)
	if (touchContainerRef2.value) {
		bindTap(touchContainerRef2.value)
		bindPinch(touchContainerRef2.value)
	}
})

const composableCode = `<script setup>
import { ref, onMounted } from 'vue'
import { useTouch } from 'directix'

const containerRef = ref(null)
const lastDirection = ref('')

const { gesture, bind } = useTouch({
  onSwipe: (e) => {
    lastDirection.value = e.direction
  },
  onTap: () => console.log('Tapped!'),
  onLongPress: () => console.log('Long pressed!'),
  onPinch: (e) => console.log('Pinch scale:', e.scale),
  onRotate: (e) => console.log('Rotation:', e.rotation),
})

onMounted(() => bind(containerRef.value))
<\/script>

<template>
  <div ref="containerRef">
    Current gesture: {{ gesture }}
    Swipe direction: {{ lastDirection }}
  </div>
</template>`

// ==================== Directive API ====================
// Swipe state
const lastSwipe = ref('')
const swipeCount = ref(0)
const swipeDirection = ref('')

// Directional swipe state
const activeDirection = ref('')
const directionCounts = ref({ left: 0, right: 0, up: 0, down: 0 })

// Tap state
const tapCount = ref(0)
const showTapEffect = ref(false)

// Long press state
const isLongPressing = ref(false)
const longPressCount = ref(0)

// Pinch & Rotate state
const scale = ref(1)
const angle = ref(0)
const boxStyle = computed(() => ({
	transform: `scale(${scale.value}) rotate(${angle.value}deg)`,
}))

// Swipe handlers
function handleSwipe(direction: string) {
	lastSwipe.value = direction
	swipeCount.value++
	swipeDirection.value = direction
	setTimeout(() => {
		swipeDirection.value = ''
	}, 500)
}

// Directional swipe handler
function handleDirectionSwipe(direction: 'left' | 'right' | 'up' | 'down') {
	activeDirection.value = direction
	directionCounts.value[direction]++
	setTimeout(() => {
		activeDirection.value = ''
	}, 300)
}

// Tap handler
function handleTap() {
	tapCount.value++
	showTapEffect.value = true
	setTimeout(() => {
		showTapEffect.value = false
	}, 300)
}

// Long press handler
function handleLongPress() {
	isLongPressing.value = true
	longPressCount.value++
	setTimeout(() => {
		isLongPressing.value = false
	}, 800)
}

// Pinch handler
function handlePinch(s: number) {
	scale.value = Math.max(0.5, Math.min(3, Math.round(s * 100) / 100))
}

// Rotate handler
function handleRotate(a: number) {
	angle.value = Math.round(a)
}

// Reset pinch & rotate
function resetTransform() {
	scale.value = 1
	angle.value = 0
}

// Get direction arrow
function getDirectionArrow(direction: string): string {
	const arrows: Record<string, string> = { left: '←', right: '→', up: '↑', down: '↓' }
	return arrows[direction] || ''
}
</script>

<template>
	<div class="touch-demo">
		<h2>v-touch</h2>
		<p class="desc">
			Touch gesture detection directive supporting swipe, pinch, rotate, tap, and long press.
		</p>

		<!-- Swipe Detection -->
		<h3>Swipe Detection</h3>
		<p class="hint">Swipe in any direction (works with mouse drag on desktop)</p>
		<div class="demo-row">
			<div v-touch="{ onSwipe: handleSwipe }" class="swipe-box" :class="{ 'swipe-active': swipeDirection }">
				<div class="swipe-content">
					<div class="swipe-icon">👆</div>
					<p>Swipe in any direction</p>
					<div class="swipe-result" v-if="lastSwipe">
						<span class="arrow">{{ getDirectionArrow(lastSwipe) }}</span>
						<span>{{ lastSwipe }}</span>
					</div>
				</div>
				<div class="swipe-count">Total swipes: {{ swipeCount }}</div>
			</div>
		</div>

		<!-- Tap Detection -->
		<h3>Tap Detection</h3>
		<p class="hint">Tap the box below</p>
		<div class="demo-row">
			<div v-touch="{ onTap: handleTap }" class="tap-box" :class="{ 'tap-effect': showTapEffect }">
				<div class="tap-content">
					<div class="tap-icon">👆</div>
					<p>Tap me!</p>
				</div>
				<div class="tap-counter">
					<span class="count">{{ tapCount }}</span>
					<span>taps</span>
				</div>
				<div class="ripple" v-if="showTapEffect"></div>
			</div>
		</div>

		<!-- Long Press -->
		<h3>Long Press</h3>
		<p class="hint">Hold the box for 500ms</p>
		<div class="demo-row">
			<div v-touch="{ onLongPress: handleLongPress }" class="press-box" :class="{ pressing: isLongPressing }">
				<div class="press-content">
					<div class="press-icon">👇</div>
					<p>Hold me</p>
					<p class="press-hint">500ms to trigger</p>
				</div>
				<div class="press-indicator" v-if="isLongPressing">
					<span class="success-text">✓ Long Press Detected!</span>
				</div>
				<div class="press-count">Triggered: {{ longPressCount }} times</div>
			</div>
		</div>

		<!-- Pinch & Rotate -->
		<h3>Pinch & Rotate (Two Fingers)</h3>
		<p class="hint">Use two fingers to pinch zoom or rotate</p>
		<div class="demo-row">
			<div v-touch="{ onPinch: handlePinch, onRotate: handleRotate }" class="pinch-container">
				<div class="pinch-box" :style="boxStyle">
					<div class="pinch-icon">🖼️</div>
					<p>Transform me</p>
				</div>
			</div>
			<div class="pinch-info">
				<div class="info-item">
					<span class="label">Scale:</span>
					<span class="value">{{ scale.toFixed(2) }}x</span>
				</div>
				<div class="info-item">
					<span class="label">Angle:</span>
					<span class="value">{{ angle }}°</span>
				</div>
				<button class="reset-btn" @click="resetTransform">Reset</button>
			</div>
		</div>

		<!-- Directional Swipes -->
		<h3>Directional Swipes</h3>
		<p class="hint">Swipe in the arrow direction (larger area = easier to swipe)</p>
		<div class="direction-grid">
			<div
				v-touch="{ onSwipeLeft: () => handleDirectionSwipe('left') }"
				class="direction-box left"
				:class="{ active: activeDirection === 'left' }"
			>
				<span class="arrow">←</span>
				<span class="text">Swipe Left</span>
				<span class="count">{{ directionCounts.left }}</span>
			</div>
			<div
				v-touch="{ onSwipeRight: () => handleDirectionSwipe('right') }"
				class="direction-box right"
				:class="{ active: activeDirection === 'right' }"
			>
				<span class="arrow">→</span>
				<span class="text">Swipe Right</span>
				<span class="count">{{ directionCounts.right }}</span>
			</div>
			<div
				v-touch="{ onSwipeUp: () => handleDirectionSwipe('up') }"
				class="direction-box up"
				:class="{ active: activeDirection === 'up' }"
			>
				<span class="arrow">↑</span>
				<span class="text">Swipe Up</span>
				<span class="count">{{ directionCounts.up }}</span>
			</div>
			<div
				v-touch="{ onSwipeDown: () => handleDirectionSwipe('down') }"
				class="direction-box down"
				:class="{ active: activeDirection === 'down' }"
			>
				<span class="arrow">↓</span>
				<span class="text">Swipe Down</span>
				<span class="count">{{ directionCounts.down }}</span>
			</div>
		</div>

		<!-- Note -->
		<div class="note">
			<strong>Note:</strong> Works on touch devices and desktop (mouse drag). For pinch/rotate, use touch
			devices or Chrome DevTools device emulation.
		</div>

		<!-- Composable API Demo -->
		<h3>Composable API</h3>
		<p class="hint">Using useTouch composable for programmatic touch gesture detection</p>

		<div class="demo-row">
			<div ref="touchContainerRef" class="swipe-box composable-swipe">
				<div class="swipe-content">
					<div class="swipe-icon">👆</div>
					<p>useTouch - Swipe</p>
					<div class="swipe-result" v-if="composableSwipeDirection">
						<span class="arrow">{{ getDirectionArrow(composableSwipeDirection) }}</span>
						<span>{{ composableSwipeDirection }}</span>
					</div>
					<div class="gesture-info">Gesture: {{ swipeGesture || 'none' }}</div>
				</div>
			</div>
		</div>

		<div class="demo-row">
			<div ref="touchContainerRef2" class="composable-box">
				<div class="composable-content">
					<div class="composable-icon">🖐️</div>
					<p>useTouch - Multi-gesture</p>
					<p class="composable-hint">Tap, Long Press, Pinch, Rotate</p>
				</div>
				<div class="composable-stats">
					<div class="stat-item">
						<span>Taps:</span>
						<strong>{{ composableTapCount }}</strong>
					</div>
					<div class="stat-item">
						<span>Scale:</span>
						<strong>{{ composableScale.toFixed(2) }}x</strong>
					</div>
					<div class="stat-item">
						<span>Angle:</span>
						<strong>{{ composableAngle }}°</strong>
					</div>
					<div class="stat-item">
						<span>Gesture:</span>
						<strong>{{ composableGesture || tapGesture || 'none' }}</strong>
					</div>
				</div>
				<button class="reset-btn small" @click="resetComposableTransform">Reset</button>
			</div>
		</div>

		<pre class="code"><code>{{ composableCode }}</code></pre>

		<!-- Directive Code Example -->
		<h3>Directive Code Example</h3>
		<pre class="code"><code>&lt;!-- Swipe detection --&gt;
&lt;div v-touch="{ onSwipe: handleSwipe }"&gt;Swipe me&lt;/div&gt;

&lt;!-- Specific direction --&gt;
&lt;div v-touch="{ onSwipeLeft: handleLeft }"&gt;Swipe left&lt;/div&gt;

&lt;!-- Tap detection --&gt;
&lt;div v-touch="{ onTap: handleTap }"&gt;Tap me&lt;/div&gt;

&lt;!-- Long press --&gt;
&lt;div v-touch="{ onLongPress: handleLongPress }"&gt;Hold me&lt;/div&gt;

&lt;!-- Pinch and rotate --&gt;
&lt;div v-touch="{ onPinch: handlePinch, onRotate: handleRotate }"&gt;
  Use two fingers
&lt;/div&gt;</code></pre>
	</div>
</template>

<style scoped>
.touch-demo {
	max-width: 800px;
	margin: 0 auto;
}

h2 {
	color: #2c3e50;
	margin-bottom: 8px;
}

h3 {
	color: #34495e;
	margin-top: 32px;
	margin-bottom: 8px;
}

.desc {
	color: #666;
	margin-bottom: 24px;
	line-height: 1.6;
}

.hint {
	color: #888;
	font-size: 14px;
	margin-bottom: 12px;
}

.demo-row {
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
	margin-bottom: 24px;
}

/* Swipe Box */
.swipe-box {
	flex: 1;
	min-height: 180px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
	position: relative;
	overflow: hidden;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	user-select: none;
	cursor: grab;
}

.swipe-box:active {
	cursor: grabbing;
}

.swipe-box.swipe-active {
	transform: scale(0.98);
	box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.swipe-content {
	text-align: center;
}

.swipe-icon {
	font-size: 32px;
	margin-bottom: 12px;
}

.swipe-result {
	margin-top: 16px;
	font-size: 20px;
	font-weight: 600;
	background: rgba(255, 255, 255, 0.2);
	padding: 8px 20px;
	border-radius: 20px;
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.swipe-result .arrow {
	font-size: 24px;
}

.swipe-count {
	position: absolute;
	bottom: 12px;
	font-size: 13px;
	opacity: 0.8;
}

/* Tap Box */
.tap-box {
	flex: 1;
	min-height: 150px;
	background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
	position: relative;
	overflow: hidden;
	user-select: none;
	cursor: pointer;
	transition: transform 0.15s ease;
}

.tap-box.tap-effect {
	transform: scale(0.95);
}

.tap-content {
	text-align: center;
	z-index: 1;
}

.tap-icon {
	font-size: 28px;
	margin-bottom: 8px;
}

.tap-counter {
	margin-top: 16px;
	display: flex;
	align-items: baseline;
	gap: 6px;
	z-index: 1;
}

.tap-counter .count {
	font-size: 36px;
	font-weight: 700;
}

.ripple {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 200px;
	height: 200px;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	transform: translate(-50%, -50%) scale(0);
	animation: ripple 0.3s ease-out;
}

@keyframes ripple {
	to {
		transform: translate(-50%, -50%) scale(2);
		opacity: 0;
	}
}

/* Press Box */
.press-box {
	flex: 1;
	min-height: 150px;
	background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
	position: relative;
	overflow: hidden;
	user-select: none;
	cursor: pointer;
	transition: transform 0.2s ease;
}

.press-box.pressing {
	transform: scale(1.02);
}

.press-content {
	text-align: center;
}

.press-icon {
	font-size: 28px;
	margin-bottom: 8px;
}

.press-hint {
	font-size: 13px;
	opacity: 0.8;
	margin-top: 4px;
}

.press-indicator {
	margin-top: 12px;
}

.success-text {
	font-weight: 600;
	font-size: 16px;
	background: rgba(255, 255, 255, 0.2);
	padding: 6px 16px;
	border-radius: 16px;
}

.press-count {
	position: absolute;
	bottom: 12px;
	font-size: 13px;
	opacity: 0.8;
}

/* Pinch Container */
.pinch-container {
	flex: 1;
	min-height: 200px;
	background: #f8f9fa;
	border: 2px dashed #dee2e6;
	border-radius: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	user-select: none;
}

.pinch-box {
	text-align: center;
	color: #495057;
	transition: transform 0.1s ease;
}

.pinch-icon {
	font-size: 48px;
	margin-bottom: 12px;
}

.pinch-info {
	width: 140px;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.info-item {
	background: #f8f9fa;
	padding: 12px 16px;
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.info-item .label {
	color: #6c757d;
	font-size: 14px;
}

.info-item .value {
	font-weight: 600;
	font-size: 16px;
	color: #343a40;
}

.reset-btn {
	padding: 10px 16px;
	background: #343a40;
	color: white;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	transition: background 0.2s;
}

.reset-btn:hover {
	background: #212529;
}

/* Direction Grid */
.direction-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
	margin-bottom: 24px;
}

.direction-box {
	min-height: 120px;
	background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
	user-select: none;
	cursor: grab;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	position: relative;
}

.direction-box:active {
	cursor: grabbing;
}

.direction-box.active {
	transform: scale(0.95);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.direction-box .arrow {
	font-size: 36px;
	font-weight: 700;
}

.direction-box .text {
	font-size: 14px;
	margin-top: 8px;
	font-weight: 500;
}

.direction-box .count {
	position: absolute;
	top: 8px;
	right: 12px;
	font-size: 12px;
	background: rgba(255, 255, 255, 0.3);
	padding: 2px 8px;
	border-radius: 10px;
}

.direction-box.left {
	background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.direction-box.right {
	background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
	color: #666;
}

.direction-box.up {
	background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
	color: #666;
}

.direction-box.down {
	background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
}

/* Note */
.note {
	background: linear-gradient(135deg, #fff9c4 0%, #fff3e0 100%);
	padding: 16px 20px;
	border-radius: 12px;
	color: #6d4c41;
	margin-bottom: 24px;
	line-height: 1.6;
}

/* Code Block */
.code {
	background: #1e1e2e;
	color: #cdd6f4;
	padding: 20px;
	border-radius: 12px;
	overflow-x: auto;
	font-size: 14px;
	line-height: 1.7;
	font-family: 'Fira Code', 'Consolas', monospace;
}

/* Composable Demo Styles */
.composable-swipe {
	background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.gesture-info {
	margin-top: 8px;
	font-size: 13px;
	opacity: 0.8;
}

.composable-box {
	flex: 1;
	min-height: 200px;
	background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
	position: relative;
	overflow: hidden;
	user-select: none;
	cursor: pointer;
}

.composable-content {
	text-align: center;
	margin-bottom: 16px;
}

.composable-icon {
	font-size: 32px;
	margin-bottom: 8px;
}

.composable-hint {
	font-size: 12px;
	opacity: 0.7;
	margin-top: 4px;
}

.composable-stats {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 8px;
	width: 100%;
	max-width: 280px;
}

.stat-item {
	background: rgba(255, 255, 255, 0.1);
	padding: 8px 12px;
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 13px;
}

.stat-item strong {
	color: #a5b4fc;
}

.reset-btn.small {
	padding: 6px 12px;
	font-size: 12px;
	margin-top: 12px;
	background: rgba(255, 255, 255, 0.1);
}

.reset-btn.small:hover {
	background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 600px) {
	.direction-grid {
		grid-template-columns: 1fr;
	}

	.pinch-info {
		width: 100%;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.info-item {
		flex: 1;
		min-width: 80px;
	}

	.reset-btn {
		flex: 1;
	}
}
</style>
