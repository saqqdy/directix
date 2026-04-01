<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useNumber } from 'directix'

export default defineComponent({
	name: 'NumberDemo',
	setup() {
		// Composable API
		const composableCount = ref(1234567)
		const composablePercentage = ref(85.5)

		const { formatted: formattedCount } = useNumber({
			value: composableCount,
			precision: 0
		})

		const { formatted: formattedPercentage } = useNumber({
			value: composablePercentage,
			precision: 1,
			suffix: '%'
		})

		const composableCode = `<script setup>
import { ref } from 'vue'
import { useNumber } from 'directix'

const count = ref(1234567)
const percentage = ref(85.5)

const { formatted: formattedCount } = useNumber({
  value: count,
  precision: 0
})
// formattedCount.value = '1,234,567'

const { formatted: formattedPercent } = useNumber({
  value: percentage,
  precision: 1,
  suffix: '%'
})
// formattedPercent.value = '85.5%'
<\/script>

<template>
  <span>{{ formattedCount }}</span>
  <span>{{ formattedPercent }}</span>
</template>`

		return {
			composableCount,
			composablePercentage,
			formattedCount,
			formattedPercentage,
			composableCode
		}
	},
	data() {
		return {
			basic: '1234567',
			precision2: '12345.67',
			percent: '85.5',
			tryIt: '',
			negative: '-1234.56',
			constrained: '',
			// Display only examples
			number1: 1234567,
			number2: 1234567.89,
			number3: -9876543.21,
			number4: 42,
			number5: 1000000,
		}
	},
})
</script>

<template>
	<div>
		<h2>v-number</h2>
		<p class="desc">
			Format numbers with thousands separators and decimal precision. Input is filtered during typing, formatting applies on blur.
		</p>

		<h3>Basic Usage - Thousands Separator</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Type or edit (blur to format):</strong></p>
				<input v-number v-model="basic" class="input" />
				<p class="hint">Model: {{ basic }}</p>
			</div>
		</div>

		<h3>Decimal Precision</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>2 decimal places:</strong></p>
				<input v-number="{ precision: 2 }" v-model="precision2" class="input" />
				<p class="hint">Model: {{ precision2 }}</p>
			</div>
			<div class="demo-item">
				<p><strong>With prefix &amp; suffix:</strong></p>
				<input v-number="{ precision: 1, prefix: '~', suffix: '%' }" v-model="percent" class="input" />
				<p class="hint">Model: {{ percent }}</p>
			</div>
		</div>

		<h3>Try It Yourself</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Type any number:</strong></p>
				<input v-number="{ precision: 2 }" v-model="tryIt" placeholder="Type and blur to format..." class="input" />
				<p class="hint">Only numbers allowed, formats on blur</p>
			</div>
		</div>

		<h3>Constraints</h3>
		<div class="demo-row">
			<div class="demo-item">
				<p><strong>Negative allowed:</strong></p>
				<input v-number="{ precision: 2 }" v-model="negative" class="input" />
				<p class="hint">Model: {{ negative }}</p>
			</div>
			<div class="demo-item">
				<p><strong>Min: 0, Max: 10000:</strong></p>
				<input v-number="{ precision: 0, min: 0, max: 10000 }" v-model="constrained" placeholder="0 - 10,000" class="input" />
				<p class="hint">Values clamped to range</p>
			</div>
		</div>

		<h3>Display Only (Non-Input Elements)</h3>
		<p class="section-desc">Use v-number on any element to display formatted numbers.</p>

		<h4>Basic Formatting</h4>
		<div class="demo-row">
			<div class="demo-item preview">
				<p><strong>Raw value:</strong></p>
				<p class="raw-value">{{ number1 }}</p>
			</div>
			<div class="demo-item preview">
				<p><strong>Integer (default):</strong></p>
				<p v-number class="formatted-value">{{ number1 }}</p>
			</div>
			<div class="demo-item preview">
				<p><strong>2 decimals:</strong></p>
				<p v-number="{ precision: 2 }" class="formatted-value">{{ number1 }}</p>
			</div>
		</div>

		<h4>With Prefix &amp; Suffix</h4>
		<div class="demo-row">
			<div class="demo-item preview">
				<p><strong>Currency ($):</strong></p>
				<p v-number="{ precision: 2, prefix: '$' }" class="formatted-value">{{ number2 }}</p>
			</div>
			<div class="demo-item preview">
				<p><strong>Percentage (%):</strong></p>
				<p v-number="{ precision: 1, suffix: '%' }" class="formatted-value">{{ number4 }}</p>
			</div>
			<div class="demo-item preview">
				<p><strong>Units (kg):</strong></p>
				<p v-number="{ precision: 0, suffix: ' kg' }" class="formatted-value">{{ number5 }}</p>
			</div>
		</div>

		<h4>Negative Numbers</h4>
		<div class="demo-row">
			<div class="demo-item preview">
				<p><strong>Raw negative:</strong></p>
				<p class="raw-value">{{ number3 }}</p>
			</div>
			<div class="demo-item preview">
				<p><strong>Formatted:</strong></p>
				<p v-number="{ precision: 2 }" class="formatted-value negative">{{ number3 }}</p>
			</div>
			<div class="demo-item preview">
				<p><strong>With prefix:</strong></p>
				<p v-number="{ precision: 2, prefix: '$' }" class="formatted-value negative">{{ number3 }}</p>
			</div>
		</div>

		<h4>Different Separators</h4>
		<div class="demo-row">
			<div class="demo-item preview">
				<p><strong>European style (.,):</strong></p>
				<p v-number="{ precision: 2, separator: '.', decimal: ',' }" class="formatted-value">{{ number2 }}</p>
			</div>
			<div class="demo-item preview">
				<p><strong>Indian style:</strong></p>
				<p v-number="{ precision: 0, separator: ',' }" class="formatted-value">{{ number1 }}</p>
			</div>
		</div>

		<h3>Composable API (useNumber)</h3>
			<p class="section-desc">Format numbers programmatically with reactive values.</p>
			<div class="demo-row">
				<div class="demo-item preview">
					<p><strong>Integer with separator:</strong></p>
					<p class="formatted-value">{{ formattedCount }}</p>
					<p class="hint">Raw: {{ composableCount }}</p>
				</div>
				<div class="demo-item preview">
					<p><strong>Percentage:</strong></p>
					<p class="formatted-value">{{ formattedPercentage }}</p>
					<p class="hint">Raw: {{ composablePercentage }}</p>
				</div>
			</div>
			<pre class="code"><code>{{ composableCode }}</code></pre>

			<h3>Code Example</h3>
		<pre class="code"><code>&lt;!-- Basic usage --&gt;
&lt;input v-number v-model="value" /&gt;

&lt;!-- With decimal precision --&gt;
&lt;input v-number="{ precision: 2 }" v-model="price" /&gt;

&lt;!-- With prefix and suffix --&gt;
&lt;input v-number="{ precision: 1, prefix: '~', suffix: '%' }" /&gt;

&lt;!-- With min/max constraints --&gt;
&lt;input v-number="{ min: 0, max: 100 }" /&gt;

&lt;!-- Display only on any element --&gt;
&lt;span v-number="{ precision: 2, prefix: '$' }"&gt;{{ 1234567.89 }}&lt;/span&gt;
&lt;div v-number="{ suffix: ' kg' }"&gt;{{ 1000 }}&lt;/div&gt;</code></pre>
	</div>
</template>

<style scoped>
h3 {
	margin-top: 24px;
	margin-bottom: 12px;
	color: #333;
}

h4 {
	margin-top: 16px;
	margin-bottom: 8px;
	color: #555;
	font-size: 14px;
}

.desc,
.section-desc {
	color: #666;
	margin-bottom: 16px;
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
	min-width: 180px;
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
	font-size: 13px;
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

.raw-value {
	font-size: 14px;
	font-family: 'Monaco', 'Menlo', monospace;
	color: #718096;
	background: #edf2f7;
	padding: 8px 12px;
	border-radius: 6px;
}

.formatted-value {
	font-size: 18px;
	font-weight: 600;
	color: #2d3748;
	font-family: 'Monaco', 'Menlo', monospace;
}

.formatted-value.negative {
	color: #e53e3e;
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
