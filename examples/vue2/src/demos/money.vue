<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'MoneyDemo',
	data() {
		return {
			usd: '',
			eur: '',
			gbp: '',
			tryIt: '',
			displayPrice: 1234567.89,
		}
	},
})
</script>

<template>
	<div>
		<h2>v-money</h2>
		<p class="desc">
			Format currency values with symbol, thousands separator, and decimal precision. Formatting applies on blur.
		</p>

		<h3>Basic Usage - USD</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>US Dollar ($)</strong></p>
				<input v-money v-model="usd" placeholder="Enter price..." class="input" />
				<p class="hint">Model: {{ usd }}</p>
			</div>
		</div>

		<h3>Different Currencies</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Euro (€)</strong></p>
				<input v-money="{ symbol: '€' }" v-model="eur" placeholder="Enter price..." class="input" />
				<p class="hint">Model: {{ eur }}</p>
			</div>
			<div class="demo-item">
				<p><strong>Yen (¥, no decimals)</strong></p>
				<input v-money="{ symbol: '¥', precision: 0 }" placeholder="Enter price..." class="input" />
			</div>
			<div class="demo-item">
				<p><strong>Pound (£)</strong></p>
				<input v-money="{ symbol: '£' }" v-model="gbp" placeholder="Enter price..." class="input" />
				<p class="hint">Model: {{ gbp }}</p>
			</div>
		</div>

		<h3>Symbol Position</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Before (default)</strong></p>
				<input v-money placeholder="Type amount..." class="input" />
				<p class="hint">$100.00 format</p>
			</div>
			<div class="demo-item">
				<p><strong>After</strong></p>
				<input v-money="{ symbol: ' €', symbolPosition: 'after' }" placeholder="Type amount..." class="input" />
				<p class="hint">100.00 € format</p>
			</div>
		</div>

		<h3>Try It Yourself</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Type any amount:</strong></p>
				<input v-money="{ symbol: '$' }" v-model="tryIt" placeholder="Type and blur to format..." class="input" />
				<p class="hint">Only numbers allowed, formats on blur</p>
			</div>
		</div>

		<h3>Display Only (Non-Input)</h3>
		<div class="demo-row">
			<div class="demo-item preview">
				<p><strong>USD:</strong></p>
				<p v-money class="formatted-value">{{ displayPrice }}</p>
			</div>
			<div class="demo-item preview">
				<p><strong>EUR:</strong></p>
				<p v-money="{ symbol: '€' }" class="formatted-value">{{ displayPrice }}</p>
			</div>
			<div class="demo-item preview">
				<p><strong>JPY:</strong></p>
				<p v-money="{ symbol: '¥', precision: 0 }" class="formatted-value">{{ displayPrice }}</p>
			</div>
		</div>

		<h3>Code Example</h3>
		<pre class="code"><code>&lt;!-- Basic usage (USD) --&gt;
&lt;input v-money v-model="price" /&gt;

&lt;!-- Different currency --&gt;
&lt;input v-money="{ symbol: '€' }" v-model="price" /&gt;

&lt;!-- Symbol after value --&gt;
&lt;input v-money="{ symbol: ' €', symbolPosition: 'after' }" /&gt;

&lt;!-- No decimals (like Yen) --&gt;
&lt;input v-money="{ symbol: '¥', precision: 0 }" /&gt;

&lt;!-- Display only --&gt;
&lt;span v-money="{ symbol: '$' }"&gt;{{ 1234.56 }}&lt;/span&gt;</code></pre>
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
	line-height: 1.6;
}

.demo-row {
	display: flex;
	gap: 16px;
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

.demo-item.preview {
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
}

.demo-item strong {
	display: block;
	margin-bottom: 8px;
	color: #667eea;
	font-size: 14px;
}

.input {
	width: 100%;
	padding: 12px 14px;
	border: 2px solid #e2e8f0;
	border-radius: 8px;
	font-size: 16px;
	font-family: 'Monaco', 'Menlo', monospace;
	transition: all 0.2s;
	background: white;
	box-sizing: border-box;
}

.input:focus {
	outline: none;
	border-color: #667eea;
	box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input::placeholder {
	color: #a0aec0;
	font-family: system-ui, sans-serif;
}

.hint {
	margin-top: 10px;
	font-size: 12px;
	color: #718096;
	font-family: 'Monaco', 'Menlo', monospace;
}

.formatted-value {
	font-size: 18px;
	font-weight: 600;
	color: #2d3748;
	font-family: 'Monaco', 'Menlo', monospace;
}

.code {
	background: #2d3748;
	color: #e2e8f0;
	padding: 16px;
	border-radius: 8px;
	overflow-x: auto;
	font-size: 13px;
	line-height: 1.7;
}
</style>
