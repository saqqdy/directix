<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'TrimDemo',
	data() {
		return {
			text1: '',
			text2: '',
			text3: '',
		}
	},
})
</script>

<template>
	<div>
		<h2>v-trim</h2>
		<p class="desc">
			The v-trim directive removes whitespace from text. It works on both input elements and regular elements.
		</p>

		<h3>Basic Usage - Trim Both Sides</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Type with spaces, then blur to see result</strong></p>
				<input v-trim v-model="text1" placeholder="  Type with spaces  " class="input" />
				<p class="hint">Model value: "{{ text1 }}"</p>
			</div>
		</div>

		<h3>Trim Position</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Trim start only</strong></p>
				<input v-trim="{ position: 'start' }" v-model="text2" placeholder="  spaces at start  " class="input" />
				<p class="hint">Model: "{{ text2 }}"</p>
			</div>
			<div class="demo-item">
				<p><strong>Trim end only</strong></p>
				<input v-trim="{ position: 'end' }" v-model="text3" placeholder="  spaces at end  " class="input" />
				<p class="hint">Model: "{{ text3 }}"</p>
			</div>
		</div>

		<h3>On Non-Input Elements</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Original:</strong></p>
				<pre class="text-demo">|   Hello World   |</pre>
				<p class="hint">| shows boundary, spaces inside</p>
			</div>
			<div class="demo-item">
				<p><strong>Trimmed:</strong></p>
				<pre v-trim class="text-demo">|   Hello World   |</pre>
				<p class="hint">Result: |Hello World|</p>
			</div>
		</div>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Trim start:</strong></p>
				<pre v-trim="{ position: 'start' }" class="text-demo">|   Hello World   |</pre>
				<p class="hint">Result: |Hello World   |</p>
			</div>
			<div class="demo-item">
				<p><strong>Trim end:</strong></p>
				<pre v-trim="{ position: 'end' }" class="text-demo">|   Hello World   |</pre>
				<p class="hint">Result: |   Hello World|</p>
			</div>
		</div>

		<h3>Trim on Blur vs Input</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Trim on blur (default)</strong></p>
				<input v-trim="{ onInput: false, onBlur: true }" placeholder="Blur to trim" class="input" />
			</div>
			<div class="demo-item">
				<p><strong>Trim on input</strong></p>
				<input v-trim="{ onInput: true, onBlur: false }" placeholder="Trim as you type" class="input" />
			</div>
		</div>

		<h3>Code Example</h3>
		<pre class="code"><code>&lt;!-- Basic usage --&gt;
&lt;input v-trim v-model="text" /&gt;

&lt;!-- Trim position --&gt;
&lt;input v-trim="{ position: 'start' }" v-model="text" /&gt;
&lt;input v-trim="{ position: 'end' }" v-model="text" /&gt;

&lt;!-- On non-input elements --&gt;
&lt;p v-trim&gt;   Text with spaces   &lt;/p&gt;</code></pre>
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
	color: #333;
	margin: 0;
	background: #edf2f7;
	padding: 8px 12px;
	border-radius: 6px;
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
