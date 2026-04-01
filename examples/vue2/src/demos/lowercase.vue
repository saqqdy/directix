<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useLowercase } from 'directix'

export default defineComponent({
	name: 'LowercaseDemo',
	setup() {
		const composableInput = ref('')
		const { transformed } = useLowercase({ source: composableInput })
		return { composableInput, transformed }
	},
	data() {
		return {
			text1: '',
			text2: '',
			text3: 'HELLO WORLD',
		}
	},
})
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

		<h3>Composable API</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>useLowercase - reactive transformation</strong></p>
				<input v-model="composableInput" placeholder="Type to see lowercase..." class="input" />
				<p class="hint">Transformed: {{ transformed }}</p>
			</div>
		</div>
		<pre class="code"><code>&lt;script&gt;
import { ref } from 'vue'
import { useLowercase } from 'directix'

const input = ref('')
const { transformed } = useLowercase({ source: input })
&lt;/script&gt;

&lt;template&gt;
  &lt;input v-model="input" /&gt;
  &lt;p&gt;{{ transformed }}&lt;/p&gt;
&lt;/template&gt;</code></pre>

		<h3>Code Example</h3>
		<pre class="code"><code>&lt;!-- Transform all characters --&gt;
	&lt;input v-lowercase v-model="text" /&gt;

	&lt;!-- Transform first character only --&gt;
	&lt;input v-lowercase="{ first: true }" v-model="text" /&gt;

	&lt;!-- On non-input elements --&gt;
	&lt;p v-lowercase&gt;HELLO WORLD&lt;/p&gt;</code></pre>
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
