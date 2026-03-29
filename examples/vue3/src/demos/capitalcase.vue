<script setup lang="ts">
import { ref } from 'vue'

const text1 = ref('')
const text2 = ref('')
const text3 = ref('the quick brown fox jumps over the lazy dog')
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

.code {
	background: #2d3748;
	color: #e2e8f0;
	padding: 16px;
	border-radius: 8px;
	overflow-x: auto;
	font-size: 14px;
	line-height: 1.6;
}
</style>
