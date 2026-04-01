<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useCopy } from 'directix'

// Scenario 1: Basic usage
const basicText = ref('Hello, Directix!')
const basicCopied = ref(false)
const handleBasicCopy = () => {
	basicCopied.value = true
	window.setTimeout(() => { basicCopied.value = false }, 2000)
}

// Scenario 2: Copy dynamic content
const dynamicText = ref('Dynamic content here')
const dynamicCopied = ref(false)
const handleDynamicCopy = () => {
	dynamicCopied.value = true
	window.setTimeout(() => { dynamicCopied.value = false }, 2000)
}

// Scenario 3: Callback functions
const callbackText = ref('Copy with callback')
const lastCopyTime = ref<string | null>(null)
const handleCopySuccess = (text: string) => {
	lastCopyTime.value = new Date().toLocaleTimeString()
	console.log('Copied:', text)
}

// Scenario 4: Code block copy
const codeText = `import { createApp } from 'vue'
import { Directix } from 'directix'

const app = createApp(App)
app.use(Directix)`

// Composable API demo
const composableText = ref('Composable API demo')
const { copy: composableCopy, copied: composableCopied } = useCopy({ source: composableText })

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

const composableCode = `import { ref } from 'vue'
import { useCopy } from 'directix'

const text = ref('Hello World')
const { copy, copied, isSupported } = useCopy({ source: text })

// Or use inline text
const { copy } = useCopy()

async function handleCopy() {
  await copy('Custom text')
}`
</script>

<template>
	<div class="demo-page">
		<h1>v-copy</h1>
		<p class="intro">
			A directive that copies text to clipboard, supporting static text, dynamic content, and callbacks.
		</p>

		<!-- Scenario 1: Basic usage -->
		<DemoSection title="Basic Usage" description="Click button to copy text">
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
				<p class="hint">Modify the input and click the copy button</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Copy dynamic content -->
		<DemoSection title="Copy Dynamic Content" description="Bind reactive data, copy current value">
			<div class="demo-box">
				<div class="copy-row">
					<input v-model="dynamicText" class="input" placeholder="Enter content to copy" />
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
				<p class="hint">Current value: "{{ dynamicText }}"</p>
			</div>
			<CodeBlock :code="dynamicCode" />
		</DemoSection>

		<!-- Scenario 3: Callback functions -->
		<DemoSection title="Callback Functions" description="Use onSuccess and onError to handle copy results">
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

		<!-- Scenario 4: Code block copy -->
		<DemoSection title="Code Block Copy" description="Practical use case - code copy button">
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

		<!-- Composable API -->
		<DemoSection title="Composable API - useCopy" description="Using useCopy composable for programmatic control">
			<div class="demo-box">
				<div class="copy-row">
					<input v-model="composableText" class="input" />
					<button
						@click="composableCopy()"
						class="btn"
						:class="{ copied: composableCopied }"
					>
						{{ composableCopied ? '✓ Copied!' : 'Copy (Composable)' }}
					</button>
				</div>
				<p class="hint">This uses the useCopy composable instead of the directive</p>
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
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>value</td>
						<td>String</td>
						<td>Text content to copy (required)</td>
					</tr>
					<tr>
						<td>onSuccess</td>
						<td>Function</td>
						<td>Success callback, receives copied text</td>
					</tr>
					<tr>
						<td>onError</td>
						<td>Function</td>
						<td>Error callback, receives error object</td>
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
