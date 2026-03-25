<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

// 场景1: 基础用法
const clickCount = ref(0)
const lastClickTime = ref<string | null>(null)

const handleClick = () => {
	clickCount.value++
	lastClickTime.value = new Date().toLocaleTimeString()
}

// 场景2: 自定义延迟时间
const customCount = ref(0)

// 场景3: leading vs trailing
const leadingCount = ref(0)
const trailingCount = ref(0)

// 场景4: 滚动事件
const scrollCount = ref(0)
const scrollPosition = ref(0)

const handleScroll = (event: Event) => {
	const target = event.target as HTMLElement
	scrollPosition.value = target.scrollTop
	scrollCount.value++
}

// 场景5: 表单提交
const submitCount = ref(0)
const lastSubmitTime = ref<string | null>(null)
const isSubmitting = ref(false)

const handleSubmit = () => {
	submitCount.value++
	lastSubmitTime.value = new Date().toLocaleTimeString()
	// 模拟提交
	isSubmitting.value = true
	setTimeout(() => {
		isSubmitting.value = false
	}, 500)
}

const basicCode = `<button v-throttle="handleClick">
  Click Me
</button>

<script setup>
const handleClick = () => {
  console.log('Throttled click!')
}
<\/script>`

const customDelayCode = `<!-- 使用 arg 指定延迟时间 -->
<button v-throttle:1000="handler">1s Throttle</button>

<!-- 使用 options 配置 -->
<button v-throttle="{ handler: fn, wait: 500 }">500ms Throttle</button>`

const optionsCode = `interface ThrottleOptions {
  handler: Function      // 节流处理函数
  wait?: number          // 节流时间，默认 300ms
  leading?: boolean      // 是否在开始时触发，默认 true
  trailing?: boolean     // 是否在结束时触发，默认 true
}`

const scrollCode = `<!-- 使用 .scroll 修饰符指定滚动事件 -->
<div v-throttle:100.scroll="handleScroll">
  Scrollable content
</div>

<!-- 也支持 resize、mousemove 等事件 -->
<Window v-throttle.resize="handleResize" />`
</script>

<template>
	<div class="demo-page">
		<h1>v-throttle</h1>
		<p class="intro">
			节流指令，限制事件触发频率，常用于按钮点击、滚动事件、窗口调整等场景。
		</p>

		<!-- 场景1: 基础用法 - 按钮点击 -->
		<DemoSection title="基础用法 - 按钮点击" description="默认 300ms 节流，防止重复点击">
			<div class="demo-box">
				<button v-throttle="handleClick" class="btn">
					Click Me (300ms throttle)
				</button>
				<div class="stats">
					<span>Click count: <strong>{{ clickCount }}</strong></span>
					<span v-if="lastClickTime">Last: {{ lastClickTime }}</span>
				</div>
				<p class="hint">快速连续点击按钮，最多每 300ms 触发一次</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- 场景2: 自定义延迟时间 -->
		<DemoSection title="自定义延迟时间" description="使用 arg 或 options 配置节流时间">
			<div class="demo-box">
				<div class="button-row">
					<button
						v-throttle:500="() => customCount++"
						class="btn"
					>
						500ms
					</button>
					<button
						v-throttle:1000="() => customCount++"
						class="btn"
					>
						1000ms
					</button>
					<button
						v-throttle:2000="() => customCount++"
						class="btn"
					>
						2000ms
					</button>
				</div>
				<div class="stats">
					<span>Total count: <strong>{{ customCount }}</strong></span>
				</div>
				<p class="hint">不同节流时间的按钮</p>
			</div>
			<CodeBlock :code="customDelayCode" />
		</DemoSection>

		<!-- 场景3: leading vs trailing -->
		<DemoSection title="Leading vs Trailing" description="控制节流的触发时机">
			<div class="demo-box">
				<div class="compare">
					<div class="compare-item">
						<button
							v-throttle="{
								handler: () => leadingCount++,
								wait: 1000,
								leading: true,
								trailing: false
							}"
							class="btn"
						>
							Leading Only
						</button>
						<span class="count">Count: {{ leadingCount }}</span>
						<p class="small-hint">立即触发，不追尾</p>
					</div>
					<div class="compare-item">
						<button
							v-throttle="{
								handler: () => trailingCount++,
								wait: 1000,
								leading: false,
								trailing: true
							}"
							class="btn"
						>
							Trailing Only
						</button>
						<span class="count">Count: {{ trailingCount }}</span>
						<p class="small-hint">延迟触发，不立即</p>
					</div>
				</div>
				<p class="hint">快速点击对比两种模式的区别</p>
			</div>
		</DemoSection>

		<!-- 场景4: 滚动事件 -->
		<DemoSection title="滚动事件节流" description="限制滚动事件处理频率">
			<div class="demo-box">
				<div
					v-throttle:100.scroll="handleScroll"
					class="scroll-container"
				>
					<div class="scroll-content">
						<p v-for="i in 20" :key="i">Scroll item {{ i }}</p>
					</div>
				</div>
				<div class="stats">
					<span>Scroll events: <strong>{{ scrollCount }}</strong></span>
					<span>Position: {{ Math.round(scrollPosition) }}px</span>
				</div>
				<p class="hint">使用 .scroll 修饰符指定滚动事件，最多每 100ms 触发一次</p>
			</div>
			<CodeBlock :code="scrollCode" />
		</DemoSection>

		<!-- 场景5: 提交按钮 -->
		<DemoSection title="实际应用 - 表单提交" description="防止表单重复提交">
			<div class="demo-box">
				<form class="form" @submit.prevent>
					<input class="input" type="text" placeholder="Username" />
					<button
						v-throttle:2000="handleSubmit"
						class="btn submit-btn"
						type="submit"
						:disabled="isSubmitting"
					>
						{{ isSubmitting ? 'Submitting...' : 'Submit (2s cooldown)' }}
					</button>
				</form>
				<div class="stats">
					<span>Submit count: <strong>{{ submitCount }}</strong></span>
					<span v-if="lastSubmitTime">Last: {{ lastSubmitTime }}</span>
				</div>
				<p class="hint">快速点击按钮，2 秒内只会提交一次</p>
			</div>
		</DemoSection>

		<!-- API 说明 -->
		<DemoSection title="API">
			<CodeBlock :code="optionsCode" />
			<table class="api-table">
				<thead>
					<tr>
						<th>参数</th>
						<th>类型</th>
						<th>默认值</th>
						<th>说明</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>节流处理函数（必填）</td>
					</tr>
					<tr>
						<td>wait</td>
						<td>Number</td>
						<td>300</td>
						<td>节流时间（毫秒）</td>
					</tr>
					<tr>
						<td>leading</td>
						<td>Boolean</td>
						<td>true</td>
						<td>是否在开始时触发</td>
					</tr>
					<tr>
						<td>trailing</td>
						<td>Boolean</td>
						<td>true</td>
						<td>是否在结束时触发</td>
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

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
}

.small-hint {
	font-size: 12px;
	color: #888;
	margin-top: 4px;
}

.btn {
	padding: 12px 24px;
	background: #667eea;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	transition: all 0.2s;
}

.btn:hover {
	background: #5a6fd6;
}

.btn:active {
	transform: scale(0.98);
}

.stats {
	display: flex;
	gap: 20px;
	margin-top: 12px;
	font-size: 14px;
	color: #666;
}

.stats strong {
	color: #667eea;
}

.button-row {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.compare {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
}

.compare-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.count {
	font-size: 14px;
	color: #667eea;
	font-weight: 600;
}

.scroll-container {
	height: 150px;
	overflow-y: auto;
	border: 1px solid #ddd;
	border-radius: 6px;
	background: white;
}

.scroll-content {
	padding: 12px;
}

.scroll-content p {
	padding: 8px 0;
	border-bottom: 1px solid #f0f0f0;
	margin: 0;
}

.form {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.input {
	padding: 10px 14px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
	flex: 1;
	min-width: 200px;
}

.input:focus {
	outline: none;
	border-color: #667eea;
}

.submit-btn {
	background: #10b981;
}

.submit-btn:hover {
	background: #059669;
}

.submit-btn:disabled {
	background: #9ca3af;
	cursor: not-allowed;
	opacity: 0.7;
}

.api-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
	margin-top: 16px;
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
