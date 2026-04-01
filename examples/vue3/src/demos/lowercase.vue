<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useLowercase } from 'directix'

const text1 = ref('')
const text2 = ref('')
const text3 = ref('HELLO WORLD')

// Composable API demo
const composableText = ref('HELLO WORLD')
const composableFirst = ref(false)
const { transformed: lowercaseResult, original: lowercaseOriginal } = useLowercase({
	text: composableText,
	first: composableFirst,
})

const composableCode = `import { ref } from 'vue'
import { useLowercase } from 'directix'

const text = ref('HELLO WORLD')
const { transformed, original } = useLowercase({ text })
// transformed.value = 'hello world'

// Lowercase first character only
const { transformed: firstLower } = useLowercase({
	text,
	first: true,
})
// firstLower.value = 'hELLO WORLD'`
</script>

<template>
	<div>
		<h2>v-lowercase</h2>
		<p class="desc">
			The v-lowercase directive transforms text to lowercase. It works on both input elements and regular elements.
		</p>

		<h3>Basic Usage - Input Element</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Transform all characters to lowercase</strong></p>
				<input v-lowercase v-model="text1" placeholder="Type something..." class="input" />
				<p class="hint">Model value: {{ text1 }}</p>
			</div>
		</div>

		<h3>Lowercase First Character Only</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Using first: true</strong></p>
				<input v-lowercase="{ first: true }" v-model="text2" placeholder="Type something..." class="input" />
				<p class="hint">Model value: {{ text2 }}</p>
			</div>
		</div>

		<h3>On Non-Input Elements</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Original:</strong></p>
				<p class="text-demo">{{ text3 }}</p>
			</div>
			<div class="demo-item">
				<p><strong>Lowercase all:</strong></p>
				<p v-lowercase class="text-demo">{{ text3 }}</p>
			</div>
			<div class="demo-item">
				<p><strong>Lowercase first only:</strong></p>
				<p v-lowercase="{ first: true }" class="text-demo">{{ text3 }}</p>
			</div>
		</div>

		<h3>Code Example</h3>
		<pre class="code"><code>&lt;!-- Transform all characters --&gt;
&lt;input v-lowercase v-model="text" /&gt;

&lt;!-- Transform first character only --&gt;
&lt;input v-lowercase="{ first: true }" v-model="text" /&gt;

&lt;!-- On non-input elements --&gt;
&lt;p v-lowercase&gt;HELLO WORLD&lt;/p&gt;</code></pre>

		<!-- Composable API -->
		<DemoSection title="Composable API - useLowercase" description="Using useLowercase composable for programmatic text transformation">
			<div class="demo-box">
				<div class="demo-row">
					<div class="demo-item">
						<p><strong>Input Text</strong></p>
						<input v-model="composableText" class="input" placeholder="Type something..." />
					</div>
					<div class="demo-item">
						<p><strong>Transform Mode</strong></p>
						<label class="checkbox-label">
							<input type="checkbox" v-model="composableFirst" />
							First character only
						</label>
					</div>
				</div>
				<div class="demo-row">
					<div class="demo-item">
						<p><strong>Original:</strong></p>
						<p class="text-demo">{{ lowercaseOriginal }}</p>
					</div>
					<div class="demo-item">
						<p><strong>Transformed:</strong></p>
						<p class="text-demo result">{{ lowercaseResult }}</p>
					</div>
				</div>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>
	</div>
</template>

<style scoped>
h3 {
	margin-top: 24px;
	margin-bottom: 12px;
	color: #333;
}

.desc {
	color: #666;
	margin-bottom: 20px;
}

.demo-row {
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
	margin-bottom: 16px;
}

.demo-item {
	flex: 1;
	min-width: 200px;
	padding: 16px;
	background: #f8f9fa;
	border-radius: 8px;
}

.demo-item strong {
	display: block;
	margin-bottom: 8px;
	color: #667eea;
}

.input {
	width: 100%;
	padding: 10px 12px;
	border: 2px solid #e2e8f0;
	border-radius: 6px;
	font-size: 14px;
	transition: border-color 0.2s;
}

.input:focus {
	outline: none;
	border-color: #667eea;
}

.hint {
	margin-top: 8px;
	font-size: 12px;
	color: #666;
	font-family: monospace;
}

.text-demo {
	font-size: 18px;
	font-weight: 500;
}

.text-demo.result {
	color: #667eea;
}

.code {
	background: #2d3748;
	color: #e2e8f0;
	padding: 16px;
	border-radius: 8px;
	overflow-x: auto;
	font-size: 14px;
	line-height: 1.6;
}

.demo-box {
	padding: 20px;
	background: #f8f9fa;
	border-radius: 8px;
	margin-bottom: 12px;
}

.checkbox-label {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	font-size: 14px;
	color: #444;
}

.checkbox-label input[type="checkbox"] {
	width: 18px;
	height: 18px;
	accent-color: #667eea;
}
</style>
