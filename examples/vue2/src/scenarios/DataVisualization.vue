<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
	name: 'DataVisualization',
	setup() {
		const progressValue = ref(0)
		const counterValue = ref(10000)

		// 使用 ref 存储目标时间戳，以便更新时触发指令重新渲染
		const countdownTarget = ref(Date.now() + 60 * 1000)
		const oneHourLater = ref(Date.now() + 3600000)
		const oneDayLater = ref(Date.now() + 86400000)

		const animateProgress = () => {
			progressValue.value = 0
			const interval = setInterval(() => {
				progressValue.value += 5
				if (progressValue.value >= 100) {
					clearInterval(interval)
				}
			}, 100)
		}

		const animateCounter = () => {
			counterValue.value = Math.floor(Math.random() * 10000) + 1000
		}

		const startCountdown = () => {
			countdownTarget.value = Date.now() + 60 * 1000
		}

		onMounted(() => {
			animateProgress()
		})

		return {
			progressValue,
			counterValue,
			countdownTarget,
			oneHourLater,
			oneDayLater,
			animateProgress,
			animateCounter,
			startCountdown,
		}
	},
})
</script>

<template>
	<div class="scenario-container">
		<h2>数据可视化</h2>
		<p class="description">结合 v-progress、v-counter、v-countdown 实现数据展示动画</p>

		<!-- 进度条 -->
		<div class="demo-section">
			<h3>进度条（v-progress）</h3>
			<div class="progress-demo">
				<div
					v-progress="{ value: progressValue, showText: true }"
					class="progress-bar"
				></div>
				<button class="btn" @click="animateProgress">
					重新动画
				</button>
			</div>

			<div class="progress-variants">
				<div class="variant">
					<label>线性进度</label>
					<div v-progress="{ value: 75, strokeWidth: 8 }" class="progress-line"></div>
				</div>
				<div class="variant">
					<label>环形进度</label>
					<div v-progress="{ value: 50, type: 'circle' }" class="progress-circle"></div>
				</div>
			</div>
		</div>

		<!-- 数字动画 -->
		<div class="demo-section">
			<h3>数字动画（v-counter）</h3>
			<div class="counter-demo">
				<div class="counter-value">
					<span v-counter="{ value: counterValue, duration: 2000 }">0</span>
				</div>
				<button class="btn" @click="animateCounter">
					随机数值
				</button>
			</div>

			<div class="counter-variants">
				<div class="stat-card">
					<span v-counter="{ value: 1234, duration: 1000 }" class="stat-number">0</span>
					<span class="stat-label">用户数</span>
				</div>
				<div class="stat-card">
					<span v-counter="{ value: 5678, duration: 1000 }" class="stat-number">0</span>
					<span class="stat-label">访问量</span>
				</div>
				<div class="stat-card">
					<span v-counter="{ value: 99.9, decimals: 1, duration: 1000 }" class="stat-number">0</span>
					<span class="stat-label">成功率%</span>
				</div>
			</div>
		</div>

		<!-- 倒计时 -->
		<div class="demo-section">
			<h3>倒计时（v-countdown）</h3>
			<div class="countdown-demo">
				<div class="countdown-display">
					<span v-countdown="{ target: countdownTarget, format: 'mm:ss' }"></span>
				</div>
				<button class="btn" @click="startCountdown">
					重新开始
				</button>
			</div>

			<div class="countdown-variants">
				<div class="time-block">
					<span v-countdown="{ target: oneHourLater, format: 'hh:mm:ss' }"></span>
					<label>时:分:秒</label>
				</div>
				<div class="time-block">
					<span v-countdown="{ target: oneDayLater, format: 'dd:hh:mm:ss' }"></span>
					<label>天:时:分:秒</label>
				</div>
			</div>
		</div>

		<div class="code-section">
			<h3>使用的指令</h3>
			<ul>
				<li><strong>v-progress</strong> - 进度条动画展示</li>
				<li><strong>v-counter</strong> - 数字递增动画</li>
				<li><strong>v-countdown</strong> - 倒计时显示</li>
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

.btn {
	padding: 8px 16px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 12px;
}

.progress-demo {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
}

.progress-bar {
	flex: 1;
	height: 12px;
	background: #f5f5f5;
	border-radius: 6px;
}

.progress-variants {
	display: flex;
	gap: 16px;
}

.variant {
	flex: 1;
}

.variant label {
	font-size: 12px;
	color: #666;
	margin-bottom: 8px;
	display: block;
}

.progress-line {
	height: 8px;
	background: #f5f5f5;
	border-radius: 4px;
}

.progress-circle {
	width: 60px;
	height: 60px;
}

.counter-demo {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 16px;
}

.counter-value {
	font-size: 32px;
	font-weight: bold;
	color: #42b883;
	min-width: 100px;
}

.counter-variants {
	display: flex;
	gap: 16px;
}

.stat-card {
	flex: 1;
	padding: 16px;
	background: #f9f9f9;
	border-radius: 8px;
	text-align: center;
}

.stat-number {
	font-size: 24px;
	font-weight: bold;
	color: #42b883;
}

.stat-label {
	font-size: 12px;
	color: #666;
	display: block;
	margin-top: 4px;
}

.countdown-demo {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 16px;
}

.countdown-display {
	font-size: 28px;
	font-weight: bold;
	color: #35495e;
	background: #f5f5f5;
	padding: 12px 20px;
	border-radius: 8px;
}

.countdown-variants {
	display: flex;
	gap: 16px;
}

.time-block {
	flex: 1;
	padding: 12px;
	background: #f9f9f9;
	border-radius: 6px;
	text-align: center;
}

.time-block span {
	font-size: 16px;
	font-weight: 500;
}

.time-block label {
	font-size: 11px;
	color: #666;
	display: block;
	margin-top: 4px;
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
