<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDebounce } from 'directix'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'DebounceDemo',
	components: { DemoSection, CodeBlock },
	setup() {
		// Composable API
		const composableSearchText = ref('')
		const composableSearchResults = ref<string[]>([])
		const composableSearchCount = ref(0)

		const handleComposableSearch = useDebounce(() => {
			composableSearchCount.value++
			const fruits = ['Apple', 'Banana', 'Orange', 'Grape']
			composableSearchResults.value = fruits.filter(f =>
				f.toLowerCase().includes(composableSearchText.value.toLowerCase())
			)
		}, 300)

		const composableCode = `import { ref } from 'vue'
import { useDebounce } from 'directix'

const searchText = ref('')
const searchResults = ref<string[]>([])

const handleSearch = useDebounce(() => {
  searchResults.value = filterItems(searchText.value)
}, 300)

// In template: @input="handleSearch"`

		return {
			composableSearchText,
			composableSearchResults,
			composableSearchCount,
			handleComposableSearch,
			composableCode
		}
	},
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
			Input debounce directive that triggers handler after user stops typing for a period, commonly used for search, form validation, etc.
		</p>

		<!-- Scenario 1: Basic usage - Search -->
		<DemoSection title="Basic Usage - Search" description="Default 300ms debounce, triggers search after stopping input">
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
				<p class="hint">Type multiple characters quickly, search only triggers 300ms after stopping</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Custom delay time -->
		<DemoSection title="Custom Delay Time" description="Use arg or options to configure delay">
			<div class="demo-box">
				<div class="delay-inputs">
					<div class="input-group">
						<label>500ms debounce:</label>
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
				<p class="hint">Use v-debounce:500 to specify 500ms delay</p>
			</div>
			<CodeBlock :code="customDelayCode" />
		</DemoSection>

		<!-- Scenario 3: Leading option -->
		<DemoSection title="Leading Option" description="Triggers immediately on first input, then debounces">
			<div class="demo-box">
				<div class="compare">
					<div class="compare-item">
						<label>Default (trailing only):</label>
						<input
							v-debounce="{
								handler: () => trailingCount++,
								wait: 300,
								trailing: true
							}"
							class="input"
							placeholder="300ms after stop"
						/>
						<span class="count">Count: {{ trailingCount }} (triggers after delay)</span>
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
						<span class="count">Count: {{ leadingCount }} (immediate first trigger)</span>
					</div>
				</div>
				<p class="hint">Type quickly: left only triggers after stopping, right triggers immediately on first input</p>
				<button class="btn-reset" @click="resetLeadingDemo">Reset Counters</button>
			</div>
			<CodeBlock :code="leadingCode" />
		</DemoSection>

		<!-- Scenario 4: Auto-save form -->
		<DemoSection title="Practical Use - Form Auto-save" description="Auto-save after user stops typing">
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

		<!-- Composable API -->
		<DemoSection title="Composable API" description="Use useDebounce for programmatic debounce">
			<div class="demo-box">
				<input
					v-model="composableSearchText"
					@input="handleComposableSearch"
					class="input"
					placeholder="Type to search (composable)..."
				/>
				<div class="stats">
					<span>API calls: <strong>{{ composableSearchCount }}</strong></span>
					<span>Results: {{ composableSearchResults.length }}</span>
				</div>
				<div v-if="composableSearchResults.length" class="results">
					<div v-for="item in composableSearchResults" :key="item" class="result-item">
						{{ item }}
					</div>
				</div>
				<p class="hint">Using useDebounce composable for programmatic debouncing</p>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>

		<!-- API Reference -->
		<DemoSection title="API">
			<CodeBlock :code="optionsCode" />
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
						<td>Debounce handler function (required)</td>
					</tr>
					<tr>
						<td>wait</td>
						<td>Number</td>
						<td>300</td>
						<td>Delay time (milliseconds)</td>
					</tr>
					<tr>
						<td>leading</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Whether to trigger at the start</td>
					</tr>
					<tr>
						<td>trailing</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Whether to trigger at the end</td>
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
