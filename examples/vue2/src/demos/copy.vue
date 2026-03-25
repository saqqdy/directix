<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

// 场景1: 基础用法
const basicText = ref('Hello, Directix!')
const basicCopied = ref(false)
const handleBasicCopy = () => {
	basicCopied.value = true
	window.setTimeout(() => { basicCopied.value = false }, 2000)
}

// 场景2: 复制动态内容
const dynamicText = ref('Dynamic content here')
const dynamicCopied = ref(false)
const handleDynamicCopy = () => {
	dynamicCopied.value = true
	window.setTimeout(() => { dynamicCopied.value = false }, 2000)
}

// 场景3: 回调函数
const callbackText = ref('Copy with callback')
const lastCopyTime = ref<string | null>(null)
const handleCopySuccess = (text: string) => {
	lastCopyTime.value = new Date().toLocaleTimeString()
	console.log('Copied:', text)
}

// 场景4: 复制按钮
const codeText = `import { createApp } from 'vue'
import { Directix } from 'directix'

const app = createApp(App)
app.use(Directix)`

const basicCode = `<button v-copy="{ value: text, onSuccess: onCopy }">
  {{ copied ? 'Copied!' : 'Copy' }}
</button>`

const dynamicCode = `<input v-model="text" />
<button v-copy="{ value: text }">Copy Input Value</button>`

const callbackCode = `<button v-copy="{
  value: text,
  onSuccess: (text) => {
    console.log('Copied:', text)
  },
  onError: (err) => {
    console.error('Copy failed:', err)
  }
}">
  Copy with Callback
</button>`

const optionsCode = `interface CopyOptions {
  value: string                        // 要复制的文本
  onSuccess?: (text: string) => void   // 成功回调
  onError?: (err: Error) => void       // 失败回调
}`
</script>

<template>
	<div class="demo-page">
		<h1>v-copy</h1>
		<p class="intro">
			点击复制文本到剪贴板的指令，支持静态文本、动态内容和回调函数。
		</p>

		<!-- 场景1: 基础用法 -->
		<DemoSection title="基础用法" description="点击按钮复制文本">
			<div class="demo-box">
				<div class="copy-row">
					<input v-model="basicText" class="input" />
					<button
						v-copy="{
							value: basicText,
							onSuccess: handleBasicCopy
						}"
						class="btn"
						:class="{ copied: basicCopied }"
					>
						{{ basicCopied ? '✓ Copied!' : 'Copy' }}
					</button>
				</div>
				<p class="hint">修改输入框内容后点击复制按钮</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- 场景2: 复制动态内容 -->
		<DemoSection title="复制动态内容" description="绑定响应式数据，复制当前值">
			<div class="demo-box">
				<div class="copy-row">
					<input v-model="dynamicText" class="input" placeholder="输入要复制的内容" />
					<button
						v-copy="{
							value: dynamicText,
							onSuccess: handleDynamicCopy
						}"
						class="btn"
						:class="{ copied: dynamicCopied }"
					>
						{{ dynamicCopied ? '✓ Copied!' : 'Copy Input' }}
					</button>
				</div>
				<p class="hint">当前值: "{{ dynamicText }}"</p>
			</div>
			<CodeBlock :code="dynamicCode" />
		</DemoSection>

		<!-- 场景3: 回调函数 -->
		<DemoSection title="回调函数" description="使用 onSuccess 和 onError 处理复制结果">
			<div class="demo-box">
				<div class="copy-row">
					<input v-model="callbackText" class="input" />
					<button
						v-copy="{
							value: callbackText,
							onSuccess: handleCopySuccess
						}"
						class="btn"
					>
						Copy with Callback
					</button>
				</div>
				<p class="hint" v-if="lastCopyTime">
					Last copied at: <strong>{{ lastCopyTime }}</strong>
				</p>
			</div>
			<CodeBlock :code="callbackCode" />
		</DemoSection>

		<!-- 场景4: 复制代码块 -->
		<DemoSection title="复制代码块" description="实际应用场景 - 代码复制按钮">
			<div class="demo-box">
				<div class="code-container">
					<div class="code-header">
						<span>main.ts</span>
						<button
							v-copy="codeText"
							class="btn-small"
						>
							Copy Code
						</button>
					</div>
					<pre class="code-content">{{ codeText }}</pre>
				</div>
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
						<th>说明</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>value</td>
						<td>String</td>
						<td>要复制的文本内容（必填）</td>
					</tr>
					<tr>
						<td>onSuccess</td>
						<td>Function</td>
						<td>复制成功回调，参数为复制的文本</td>
					</tr>
					<tr>
						<td>onError</td>
						<td>Function</td>
						<td>复制失败回调，参数为错误对象</td>
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

.copy-row {
	display: flex;
	gap: 12px;
	align-items: center;
}

.input {
	flex: 1;
	padding: 10px 14px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
}

.input:focus {
	outline: none;
	border-color: #667eea;
}

.btn {
	padding: 10px 20px;
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

.btn.copied {
	background: #10b981;
}

.btn-small {
	padding: 6px 12px;
	background: rgba(255, 255, 255, 0.2);
	color: white;
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 4px;
	cursor: pointer;
	font-size: 12px;
}

.btn-small:hover {
	background: rgba(255, 255, 255, 0.3);
}

.code-container {
	background: #1e1e1e;
	border-radius: 8px;
	overflow: hidden;
}

.code-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 16px;
	background: #2d2d2d;
	color: #888;
	font-size: 13px;
}

.code-content {
	padding: 16px;
	margin: 0;
	color: #d4d4d4;
	font-family: 'Fira Code', monospace;
	font-size: 13px;
	overflow-x: auto;
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
