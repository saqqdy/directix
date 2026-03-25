<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'DebounceDemo',
	components: { DemoSection, CodeBlock },
	data() {
		return {
			searchText: '',
			searchResults: [] as string[],
			searchCount: 0,
			customText: '',
			customCount: 0,
			trailingCount: 0,
			leadingCount: 0,
			inputHistory: [] as string[],
			basicCode: `<input
  v-model="search"
  v-debounce="handleSearch"
  placeholder="Search..."
/>`,
			customDelayCode: `<!-- 使用 arg 指定延迟时间（毫秒） -->
<input v-debounce:500="handler" />

<!-- 使用 options 配置 -->
<input v-debounce="{
  handler: handleInput,
  wait: 500
}" />`,
			leadingCode: `<!-- trailing only (默认): 停止输入后触发 -->
<input v-debounce="{
  handler: handleInput,
  wait: 300,
  trailing: true
}" />

<!-- leading: 首次输入立即触发 -->
<input v-debounce="{
  handler: handleInput,
  wait: 300,
  leading: true
}" />`,
			optionsCode: `interface DebounceOptions {
  handler: Function      // 防抖处理函数
  wait?: number          // 延迟时间，默认 300ms
  leading?: boolean      // 是否在开始时触发，默认 false
  trailing?: boolean     // 是否在结束时触发，默认 true
}`
		}
	},
	methods: {
		handleSearch() {
			this.searchCount++
			// 模拟搜索
			const fruits = ['Apple', 'Banana', 'Orange', 'Grape']
			this.searchResults = fruits.filter(f =>
				f.toLowerCase().includes(this.searchText.toLowerCase())
			)
		},
		resetLeadingDemo() {
			this.trailingCount = 0
			this.leadingCount = 0
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-debounce</h1>
		<p class="intro">
			输入防抖指令，在用户停止输入一段时间后才触发处理函数，常用于搜索、表单验证等场景。
		</p>

		<!-- 场景1: 基础用法 - 搜索 -->
		<DemoSection title="基础用法 - 搜索" description="默认 300ms 防抖，停止输入后触发搜索">
			<div class="demo-box">
				<input
					v-model="searchText"
					v-debounce="handleSearch"
					class="input"
					placeholder="Type to search (e.g. 'app')..."
				/>
				<div class="stats">
					<span>API calls: <strong>{{ searchCount }}</strong></span>
					<span>Results: {{ searchResults.length }}</span>
				</div>
				<div v-if="searchResults.length" class="results">
					<div v-for="item in searchResults" :key="item" class="result-item">
						{{ item }}
					</div>
				</div>
				<p class="hint">快速输入多个字符，只有停止输入 300ms 后才会触发搜索</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- 场景2: 自定义延迟时间 -->
		<DemoSection title="自定义延迟时间" description="使用 arg 或 options 配置延迟时间">
			<div class="demo-box">
				<div class="delay-inputs">
					<div class="input-group">
						<label>500ms 防抖:</label>
						<input
							v-model="customText"
							v-debounce:500="() => customCount++"
							class="input"
							placeholder="500ms delay"
						/>
					</div>
				</div>
				<div class="stats">
					<span>Trigger count: <strong>{{ customCount }}</strong></span>
				</div>
				<p class="hint">使用 v-debounce:500 指定 500ms 延迟</p>
			</div>
			<CodeBlock :code="customDelayCode" />
		</DemoSection>

		<!-- 场景3: leading 选项 -->
		<DemoSection title="Leading 选项" description="首次输入立即触发，后续防抖">
			<div class="demo-box">
				<div class="compare">
					<div class="compare-item">
						<label>默认 (trailing only):</label>
						<input
							v-debounce="{
								handler: () => trailingCount++,
								wait: 300,
								trailing: true
							}"
							class="input"
							placeholder="300ms after stop"
						/>
						<span class="count">Count: {{ trailingCount }} (触发于延迟后)</span>
					</div>
					<div class="compare-item">
						<label>Leading:</label>
						<input
							v-debounce="{
								handler: () => leadingCount++,
								wait: 300,
								leading: true
							}"
							class="input"
							placeholder="Immediate first trigger"
						/>
						<span class="count">Count: {{ leadingCount }} (首次立即触发)</span>
					</div>
				</div>
				<p class="hint">快速输入: 左边只在停止后触发，右边首次输入立即触发</p>
				<button class="btn-reset" @click="resetLeadingDemo">Reset Counters</button>
			</div>
			<CodeBlock :code="leadingCode" />
		</DemoSection>

		<!-- 场景4: 实时显示输入历史 -->
		<DemoSection title="实际应用 - 表单自动保存" description="用户停止输入后自动保存">
			<div class="demo-box">
				<textarea
					v-debounce="{
						handler: () => inputHistory.push(new Date().toLocaleTimeString() + ': Auto-saved'),
						wait: 1000
					}"
					class="textarea"
					placeholder="Type something... will auto-save after 1 second"
					rows="3"
				></textarea>
				<div class="history">
					<strong>Auto-save Log:</strong>
					<div v-for="(log, i) in inputHistory.slice(-5)" :key="i" class="log-item">
						{{ log }}
					</div>
					<div v-if="!inputHistory.length" class="log-empty">
						No saves yet
					</div>
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
						<th>默认值</th>
						<th>说明</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>防抖处理函数（必填）</td>
					</tr>
					<tr>
						<td>wait</td>
						<td>Number</td>
						<td>300</td>
						<td>延迟时间（毫秒）</td>
					</tr>
					<tr>
						<td>leading</td>
						<td>Boolean</td>
						<td>false</td>
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

.input {
	width: 100%;
	padding: 12px 14px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
}

.input:focus {
	outline: none;
	border-color: #667eea;
}

.textarea {
	width: 100%;
	padding: 12px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
	font-family: inherit;
	resize: vertical;
}

.textarea:focus {
	outline: none;
	border-color: #667eea;
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

.results {
	margin-top: 16px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	overflow: hidden;
}

.result-item {
	padding: 10px 14px;
	border-bottom: 1px solid #f0f0f0;
}

.result-item:last-child {
	border-bottom: none;
}

.delay-inputs {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.input-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.input-group label {
	font-size: 13px;
	font-weight: 600;
	color: #666;
}

.compare {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
}

.compare-item {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.compare-item label {
	font-size: 13px;
	font-weight: 600;
	color: #666;
}

.compare-item .count {
	font-size: 12px;
	color: #888;
}

.history {
	margin-top: 16px;
	padding: 12px;
	background: #f0f0f0;
	border-radius: 6px;
	font-size: 13px;
}

.history strong {
	display: block;
	margin-bottom: 8px;
}

.log-item {
	padding: 4px 0;
	color: #10b981;
	font-family: monospace;
}

.log-empty {
	color: #888;
	font-style: italic;
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

.btn-reset {
	margin-top: 12px;
	padding: 8px 16px;
	background: #e0e0e0;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 13px;
	color: #666;
}

.btn-reset:hover {
	background: #d0d0d0;
}
</style>
