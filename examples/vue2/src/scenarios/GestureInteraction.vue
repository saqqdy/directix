<script setup lang="ts">
import { ref } from 'vue'

// 手势交互场景 - v-touch, v-swipe, v-pan, v-pinch

const touchInfo = ref({
	start: null as { x: number; y: number } | null,
	move: null as { x: number; y: number } | null,
	end: null as { x: number; y: number } | null,
})

const panPosition = ref({ x: 0, y: 0 })
const pinchScale = ref(1)
const swipeDirection = ref('')

const onTouchStart = (e: { x: number; y: number }) => {
	touchInfo.value.start = e
}

const onTouchMove = (e: { x: number; y: number }) => {
	touchInfo.value.move = e
}

const onTouchEnd = (e: { x: number; y: number }) => {
	touchInfo.value.end = e
}

const onPan = (e: { deltaX: number; deltaY: number }) => {
	panPosition.value.x += e.deltaX
	panPosition.value.y += e.deltaY
}

const onPinch = (e: { scale: number }) => {
	pinchScale.value = e.scale
}

const onSwipe = (e: { direction: string }) => {
	swipeDirection.value = e.direction
}
</script>

<template>
	<div class="scenario-container">
		<h2>手势交互</h2>
		<p class="description">结合 v-touch、v-swipe、v-pan、v-pinch 实现移动端手势操作</p>

		<!-- 触摸事件 -->
		<div class="demo-section">
			<h3>触摸事件（v-touch）</h3>
			<div
				v-touch="{
					onStart: onTouchStart,
					onMove: onTouchMove,
					onEnd: onTouchEnd,
				}"
				class="touch-area"
			>
				<p>在此区域触摸</p>
				<div class="touch-info">
					<div v-if="touchInfo.start">
						起点: ({{ touchInfo.start.x.toFixed(0) }}, {{ touchInfo.start.y.toFixed(0) }})
					</div>
					<div v-if="touchInfo.move">
						当前位置: ({{ touchInfo.move.x.toFixed(0) }}, {{ touchInfo.move.y.toFixed(0) }})
					</div>
					<div v-if="touchInfo.end">
						终点: ({{ touchInfo.end.x.toFixed(0) }}, {{ touchInfo.end.y.toFixed(0) }})
					</div>
				</div>
			</div>
		</div>

		<!-- 平移手势 -->
		<div class="demo-section">
			<h3>平移手势（v-pan）</h3>
			<div class="pan-container">
				<div
					v-pan="{ onPan }"
					class="pan-element"
					:style="{
						transform: `translate(${panPosition.x}px, ${panPosition.y}px)`,
					}"
				>
					拖动我
				</div>
			</div>
			<button class="reset-btn" @click="panPosition = { x: 0, y: 0 }">
				重置位置
			</button>
		</div>

		<!-- 捏合手势 -->
		<div class="demo-section">
			<h3>捏合缩放（v-pinch）</h3>
			<div class="pinch-container">
				<div
					v-pinch="{ onPinch }"
					class="pinch-element"
					:style="{
						transform: `scale(${pinchScale})`,
					}"
				>
					双指捏合缩放
				</div>
			</div>
			<button class="reset-btn" @click="pinchScale = 1">
				重置缩放
			</button>
		</div>

		<!-- 滑动手势 -->
		<div class="demo-section">
			<h3>滑动手势（v-swipe）</h3>
			<div
				v-swipe="{ onSwipe }"
				class="swipe-area"
			>
				<p>在此区域滑动</p>
				<p class="swipe-result" v-if="swipeDirection">
					滑动方向: <strong>{{ swipeDirection }}</strong>
				</p>
			</div>
		</div>

		<div class="code-section">
			<h3>使用的指令</h3>
			<ul>
				<li><strong>v-touch</strong> - 基础触摸事件监听</li>
				<li><strong>v-pan</strong> - 平移手势检测</li>
				<li><strong>v-pinch</strong> - 捏合缩放手势</li>
				<li><strong>v-swipe</strong> - 滑动手势识别</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
.scenario-container {
	padding: 20px;
	max-width: 600px;
}

h2 {
	color: #42b883;
	margin-bottom: 8px;
}

.description {
	color: #666;
	margin-bottom: 20px;
}

.demo-section {
	margin-bottom: 24px;
}

.demo-section h3 {
	font-size: 14px;
	margin-bottom: 12px;
	color: #333;
}

.touch-area {
	height: 150px;
	background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
	cursor: pointer;
	user-select: none;
}

.touch-info {
	margin-top: 10px;
	font-size: 12px;
	opacity: 0.9;
}

.pan-container {
	height: 150px;
	background: #f5f5f5;
	border-radius: 8px;
	position: relative;
	overflow: hidden;
}

.pan-element {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 80px;
	height: 80px;
	background: #42b883;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	cursor: grab;
	font-size: 12px;
	text-align: center;
	margin: -40px 0 0 -40px;
}

.pinch-container {
	height: 200px;
	background: #f5f5f5;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.pinch-element {
	width: 100px;
	height: 100px;
	background: #35495e;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	font-size: 12px;
	text-align: center;
	cursor: pointer;
	user-select: none;
}

.reset-btn {
	margin-top: 10px;
	padding: 6px 12px;
	background: #f5f5f5;
	border: 1px solid #ddd;
	border-radius: 4px;
	cursor: pointer;
	font-size: 12px;
}

.swipe-area {
	height: 120px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
	cursor: pointer;
	user-select: none;
}

.swipe-result {
	margin-top: 8px;
	font-size: 14px;
}

.code-section {
	margin-top: 20px;
	padding: 15px;
	background: #fff;
	border-radius: 6px;
	border: 1px solid #eee;
}

.code-section h3 {
	font-size: 14px;
	margin-bottom: 10px;
}

.code-section ul {
	list-style: none;
	padding: 0;
}

.code-section li {
	padding: 4px 0;
	font-size: 13px;
}
</style>