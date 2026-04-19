<script setup lang="ts">
import { ref } from 'vue'

// 全屏媒体场景 - v-fullscreen, v-lottie

const isFullscreen = ref(false)

const onFullscreenEnter = () => {
	isFullscreen.value = true
}

const onFullscreenExit = () => {
	isFullscreen.value = false
}

const toggleFullscreen = () => {
	isFullscreen.value = !isFullscreen.value
}

const mediaItems = ref([
	{ id: 1, title: '视频播放器', type: 'video', icon: '🎬' },
	{ id: 2, title: 'Lottie 动画', type: 'lottie', icon: '✨' },
	{ id: 3, title: '图片查看器', type: 'image', icon: '🖼️' },
])
</script>

<template>
	<div class="scenario-container">
		<h2>全屏媒体</h2>
		<p class="description">结合 v-fullscreen、v-lottie 实现媒体播放控制</p>

		<!-- 全屏控制 -->
		<div class="demo-section">
			<h3>全屏切换（v-fullscreen）</h3>
			<div
				v-fullscreen="{
					value: isFullscreen,
					onEnter: onFullscreenEnter,
					onExit: onFullscreenExit,
				}"
				class="media-player"
			>
				<div class="player-content">
					<span class="player-icon">🎬</span>
					<p>媒体播放器</p>
					<p class="status">{{ isFullscreen ? '全屏模式' : '窗口模式' }}</p>
				</div>
			</div>
			<button class="btn" @click="toggleFullscreen">
				{{ isFullscreen ? '退出全屏' : '进入全屏' }}
			</button>
		</div>

		<!-- Lottie 动画 -->
		<div class="demo-section">
			<h3>Lottie 动画（v-lottie）</h3>
			<div class="lottie-container">
				<div
					v-lottie="{
						path: 'https://assets2.lottiefiles.com/packages/lf20_UJNc2t.json',
						autoplay: true,
						loop: true,
					}"
					class="lottie-player"
				></div>
				<p class="hint">Lottie 动画自动播放并循环</p>
			</div>
		</div>

		<!-- 媒体卡片 -->
		<div class="demo-section">
			<h3>媒体卡片</h3>
			<div class="media-grid">
				<div
					v-for="item in mediaItems"
					:key="item.id"
					class="media-card"
				>
					<span class="card-icon">{{ item.icon }}</span>
					<h4>{{ item.title }}</h4>
					<p>{{ item.type }}</p>
				</div>
			</div>
		</div>

		<div class="code-section">
			<h3>使用的指令</h3>
			<ul>
				<li><strong>v-fullscreen</strong> - 全屏显示控制</li>
				<li><strong>v-lottie</strong> - Lottie 动画播放</li>
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

.media-player {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-radius: 8px;
	padding: 40px;
	text-align: center;
	color: white;
	min-height: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 12px;
}

.player-icon {
	font-size: 48px;
}

.player-content p {
	margin: 8px 0 0;
	opacity: 0.8;
}

.status {
	font-size: 12px;
	color: #42b883;
}

.btn {
	padding: 12px 20px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 500;
}

.lottie-container {
	text-align: center;
}

.lottie-player {
	width: 200px;
	height: 200px;
	margin: 0 auto;
	background: #f5f5f5;
	border-radius: 8px;
}

.hint {
	font-size: 12px;
	color: #999;
	margin-top: 8px;
}

.media-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12px;
}

.media-card {
	padding: 20px;
	background: #f9f9f9;
	border-radius: 8px;
	text-align: center;
	border: 1px solid #eee;
}

.card-icon {
	font-size: 32px;
	display: block;
	margin-bottom: 8px;
}

.media-card h4 {
	margin: 0 0 4px;
	font-size: 13px;
}

.media-card p {
	margin: 0;
	font-size: 11px;
	color: #999;
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