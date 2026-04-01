<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useCapitalcase } from 'directix'

const text1 = ref('')
const text2 = ref('')
const text3 = ref('the quick brown fox jumps over the lazy dog')

// Composable API demo
const composableText = ref('the quick brown fox jumps over the lazy dog')
const composableEvery = ref(true)
const { capitalized, original } = useCapitalcase({
	text: composableText,
	every: composableEvery,
})

const composableCode = `import { ref } from 'vue'
import { useCapitalcase } from 'directix'

const text = ref('the quick brown fox')
const { capitalized, original } = useCapitalcase({
	text,
	every: true, // Capitalize each word
})

// capitalized.value = 'The Quick Brown Fox'

// With every: false (capitalize first word only)
const { capitalized: sentenceCase } = useCapitalcase({
	text,
	every: false,
})
// sentenceCase.value = 'The quick brown fox'`
</script>

<template>
	<div>
		<h2>v-capitalcase</h2>
		<p class="desc">
			The v-capitalcase directive transforms text to title case (capitalizes the first letter of each word).
		</p>

		<h3>Basic Usage - Capitalize Each Word</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Type to see auto-capitalization</strong></p>
				<input v-capitalcase v-model="text1" placeholder="Type a title..." class="input" />
				<p class="hint">Model value: {{ text1 }}</p>
			</div>
		</div>

		<h3>Capitalize First Word Only</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Using every: false</strong></p>
				<input v-capitalcase="{ every: false }" v-model="text2" placeholder="Type a sentence..." class="input" />
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
				<p><strong>Capitalize each word:</strong></p>
				<p v-capitalcase class="text-demo">{{ text3 }}</p>
			</div>
			<div class="demo-item">
				<p><strong>Capitalize first only:</strong></p>
				<p v-capitalcase="{ every: false }" class="text-demo">{{ text3 }}</p>
			</div>
		</div>

		<h3>Custom Keep Lower Words</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Default (keeps common words lowercase):</strong></p>
				<p v-capitalcase class="text-demo">the lord of the rings</p>
			</div>
			<div class="demo-item">
				<p><strong>Keep all lowercase:</strong></p>
				<p v-capitalcase="{ keepLower: [] }" class="text-demo">the lord of the rings</p>
			</div>
		</div>

		<h3>Code Example</h3>
		<pre class="code"><code>&lt;!-- Capitalize each word --&gt;
&lt;input v-capitalcase v-model="title" /&gt;

&lt;!-- Capitalize first word only --&gt;
&lt;input v-capitalcase="{ every: false }" v-model="sentence" /&gt;

&lt;!-- On non-input elements --&gt;
&lt;p v-capitalcase&gt;the quick brown fox&lt;/p&gt;</code></pre>

		<!-- Composable API -->
		<DemoSection title="Composable API - useCapitalcase" description="Using useCapitalcase composable for programmatic text capitalization">
			<div class="demo-box">
				<div class="demo-row">
					<div class="demo-item">
						<p><strong>Input Text</strong></p>
						<input v-model="composableText" class="input" placeholder="Type something..." />
					</div>
					<div class="demo-item">
						<p><strong>Capitalize Mode</strong></p>
						<label class="checkbox-label">
							<input type="checkbox" v-model="composableEvery" />
							Capitalize every word
						</label>
					</div>
				</div>
				<div class="demo-row">
					<div class="demo-item">
						<p><strong>Original:</strong></p>
						<p class="text-demo">{{ original }}</p>
					</div>
					<div class="demo-item">
						<p><strong>Capitalized:</strong></p>
						<p class="text-demo result">{{ capitalized }}</p>
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
	font-size: 16px;
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
