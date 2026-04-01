<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useMask } from 'directix'

export default defineComponent({
	name: 'MaskDemo',
	setup() {
		const phone = ref('')
		const date = ref('')
		const ssn = ref('')
		const ssnComplete = ref(false)

		// Composable API refs
		const composableInputRef = ref<HTMLInputElement | null>(null)
		const composableRawValue = ref('')
		const composableIsComplete = ref(false)

		const { bind, getRawValue, isComplete } = useMask({
			mask: '(###) ###-####',
			placeholder: '_',
			onChange: (_value, raw) => {
				composableRawValue.value = raw
				composableIsComplete.value = isComplete(_value)
			},
			onComplete: () => {
				composableIsComplete.value = true
			}
		})

		onMounted(() => {
			if (composableInputRef.value) {
				bind(composableInputRef.value)
			}
		})

		const handleSSNComplete = () => {
			ssnComplete.value = true
		}

		const handleSSNChange = (_value: string, raw: string) => {
			ssnComplete.value = raw.length === 9
		}

		const basicCode = `<input v-mask="'(###) ###-####'" placeholder="Phone number" />`

		const dateCode = `<input v-mask="'##/##/####'" placeholder="MM/DD/YYYY" />`

		const optionsCode = `<input
  v-mask="{
    mask: '###-##-####',
    placeholder: '_',
    onComplete: handleComplete
  }"
  placeholder="SSN"
/>`

		const composableCode = `<script setup>
import { ref, onMounted } from 'vue'
import { useMask } from 'directix'

const inputRef = ref(null)
const rawValue = ref('')

const { bind, getRawValue, isComplete } = useMask({
  mask: '(###) ###-####',
  placeholder: '_',
  onChange: (_value, raw) => {
    rawValue.value = raw
  }
})

onMounted(() => {
  if (inputRef.value) {
    bind(inputRef.value)
  }
})
<\/script>

<template>
  <input ref="inputRef" type="text" />
  <p>Raw value: {{ rawValue }}</p>
</template>`

		return {
			phone,
			date,
			ssn,
			ssnComplete,
			handleSSNComplete,
			handleSSNChange,
			basicCode,
			dateCode,
			optionsCode,
			// Composable API
			composableInputRef,
			composableRawValue,
			composableIsComplete,
			composableCode
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-mask</h1>
		<p class="intro">
			An input masking directive that formats user input according to a pattern.
		</p>

		<!-- Scenario 1: Basic mask -->
		<div class="demo-section">
			<h2>Phone Number</h2>
			<p class="description">Format phone numbers automatically</p>
			<div class="demo-box">
				<div class="input-group">
					<label>Phone Number:</label>
					<input v-mask="'(###) ###-####'" v-model="phone" placeholder="(___) ___-____" class="mask-input" />
				</div>
				<div class="value-display">
					<strong>Value:</strong> {{ phone || '(empty)' }}
				</div>
				<p class="hint">Mask pattern: (###) ###-####</p>
			</div>
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: Date mask -->
		<div class="demo-section">
			<h2>Date Input</h2>
			<p class="description">Format dates with automatic separators</p>
			<div class="demo-box">
				<div class="input-group">
					<label>Date:</label>
					<input v-mask="'##/##/####'" v-model="date" placeholder="MM/DD/YYYY" class="mask-input" />
				</div>
				<div class="value-display">
					<strong>Value:</strong> {{ date || '(empty)' }}
				</div>
				<p class="hint">Mask pattern: ##/##/####</p>
			</div>
			<div class="code-block">
				<pre><code>{{ dateCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 3: Custom options -->
		<div class="demo-section">
			<h2>SSN with Validation</h2>
			<p class="description">Track completion and get raw value</p>
			<div class="demo-box">
				<div class="input-group">
					<label>SSN:</label>
					<input
						v-mask="{
							mask: '###-##-####',
							placeholder: '_',
							onComplete: handleSSNComplete,
							onChange: handleSSNChange
						}"
						v-model="ssn"
						placeholder="___-__-____"
						class="mask-input"
						:class="{ complete: ssnComplete }"
					/>
				</div>
				<div class="value-display">
					<strong>Value:</strong> {{ ssn || '(empty)' }}
					<span v-if="ssnComplete" class="badge">Complete!</span>
				</div>
				<p class="hint">Mask pattern: ###-##-####</p>
			</div>
			<div class="code-block">
				<pre><code>{{ optionsCode }}</code></pre>
			</div>
		</div>

		<!-- Composable API -->
		<div class="demo-section">
			<h2>Composable API (useMask)</h2>
			<p class="description">Programmatically bind mask to input elements and get raw values</p>
			<div class="demo-box">
				<div class="input-group">
					<label>Phone (with useMask composable):</label>
					<input ref="composableInputRef" type="text" placeholder="(___) ___-____" class="mask-input" :class="{ complete: composableIsComplete }" />
				</div>
				<div class="value-display">
					<strong>Raw Value:</strong> {{ composableRawValue || '(empty)' }}
					<span v-if="composableIsComplete" class="badge">Complete!</span>
				</div>
				<p class="hint">Using useMask() composable with bind(), getRawValue(), and isComplete()</p>
			</div>
			<div class="code-block">
				<pre><code>{{ composableCode }}</code></pre>
			</div>
		</div>

		<!-- Mask tokens reference -->
		<div class="demo-section">
			<h2>Mask Tokens</h2>
			<table class="api-table">
				<thead>
					<tr>
						<th>Token</th>
						<th>Description</th>
						<th>Matches</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>#</code></td>
						<td>Digit</td>
						<td>0-9</td>
					</tr>
					<tr>
						<td><code>A</code></td>
						<td>Letter</td>
						<td>a-z, A-Z</td>
					</tr>
					<tr>
						<td><code>N</code></td>
						<td>Alphanumeric</td>
						<td>0-9, a-z, A-Z</td>
					</tr>
					<tr>
						<td><code>X</code></td>
						<td>Any character</td>
						<td>Any</td>
					</tr>
					<tr>
						<td><code>Other</code></td>
						<td>Literal character</td>
						<td>Exact match</td>
					</tr>
				</tbody>
			</table>
		</div>
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

.demo-section {
	margin-bottom: 32px;
}

.demo-section h2 {
	margin-bottom: 8px;
	font-size: 18px;
}

.description {
	color: #666;
	margin-bottom: 16px;
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

.input-group {
	margin-bottom: 16px;
}

.input-group label {
	display: block;
	margin-bottom: 8px;
	font-weight: 500;
	color: #333;
}

.mask-input {
	width: 100%;
	max-width: 300px;
	padding: 12px 16px;
	font-size: 16px;
	font-family: monospace;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	transition: border-color 0.2s;
}

.mask-input:focus {
	outline: none;
	border-color: #42b883;
}

.mask-input.complete {
	border-color: #48bb78;
	background: #f0fff4;
}

.value-display {
	padding: 12px;
	background: white;
	border-radius: 6px;
	font-size: 14px;
	font-family: monospace;
}

.badge {
	display: inline-block;
	margin-left: 8px;
	padding: 2px 8px;
	background: #48bb78;
	color: white;
	border-radius: 4px;
	font-size: 12px;
	font-family: sans-serif;
}

.code-block {
	background: #f4f4f5;
	border-radius: 8px;
	padding: 16px;
	overflow-x: auto;
}

.code-block pre {
	margin: 0;
}

.code-block code {
	font-family: 'Monaco', 'Menlo', monospace;
	font-size: 13px;
}

.api-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
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
