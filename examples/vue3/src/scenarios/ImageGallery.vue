<script setup lang="ts">
import { ref } from 'vue'

// 图片画廊场景 - v-lazy, v-image-preview, v-swipe

interface SwipeEvent {
	direction: string
}

const images = ref([
	{ id: 1, src: 'https://picsum.photos/400/300?random=1', title: '图片 1' },
	{ id: 2, src: 'https://picsum.photos/400/300?random=2', title: '图片 2' },
	{ id: 3, src: 'https://picsum.photos/400/300?random=3', title: '图片 3' },
	{ id: 4, src: 'https://picsum.photos/400/300?random=4', title: '图片 4' },
	{ id: 5, src: 'https://picsum.photos/400/300?random=5', title: '图片 5' },
	{ id: 6, src: 'https://picsum.photos/400/300?random=6', title: '图片 6' },
	{ id: 7, src: 'https://picsum.photos/400/300?random=7', title: '图片 7' },
	{ id: 8, src: 'https://picsum.photos/400/300?random=8', title: '图片 8' },
])

const swipeDirection = ref('')
const onSwipe = (direction: string) => {
	swipeDirection.value = direction
}

const handleSwipe = (e: SwipeEvent) => {
	onSwipe(e.direction)
}
</script>

<template>
	<div class="scenario-container">
		<h2>图片画廊</h2>
		<p class="description">结合 v-lazy、v-image-preview、v-swipe 实现响应式图片展示</p>

		<!-- 图片网格 -->
		<div class="demo-section">
			<h3>图片网格（v-lazy + v-image-preview）</h3>
			<div class="image-grid">
				<div
					v-for="image in images"
					:key="image.id"
					class="image-card"
					v-image-preview="{ src: image.src, list: images.map(i => i.src) }"
				>
					<img
						v-lazy="{ src: image.src, threshold: 0.1 }"
						:alt="image.title"
						class="gallery-image"
					/>
					<div class="image-overlay">
						<span>{{ image.title }}</span>
						<small>点击预览</small>
					</div>
				</div>
			</div>
		</div>

		<!-- 滑动手势 -->
		<div class="demo-section">
			<h3>滑动手势检测（v-swipe）</h3>
			<div
				v-swipe="{ onSwipe: handleSwipe }"
				class="swipe-area"
			>
				<p>在此区域滑动</p>
				<p class="swipe-result" v-if="swipeDirection">
					检测到滑动方向: <strong>{{ swipeDirection }}</strong>
				</p>
			</div>
		</div>

		<div class="code-section">
			<h3>使用的指令</h3>
			<ul>
				<li><strong>v-lazy</strong> - 图片懒加载，优化首屏渲染</li>
				<li><strong>v-image-preview</strong> - 点击图片全屏预览</li>
				<li><strong>v-swipe</strong> - 滑动手势检测</li>
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

.image-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 12px;
}

.image-card {
	position: relative;
	border-radius: 8px;
	overflow: hidden;
	cursor: pointer;
}

.gallery-image {
	width: 100%;
	height: 120px;
	object-fit: cover;
	display: block;
}

.image-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
	color: white;
	padding: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 12px;
}

.swipe-area {
	height: 150px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
	user-select: none;
}

.swipe-area p {
	margin: 4px 0;
}

.swipe-result {
	font-size: 16px;
	font-weight: 500;
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
