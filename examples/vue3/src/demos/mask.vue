<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useMask } from 'directix'

// Scenario 1: Basic mask
const phone = ref('')

// Scenario 2: Date mask
const date = ref('')

// Scenario 3: Custom options
const ssn = ref('')
const ssnComplete = ref(false)
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

// Composable API demo
const composableInputRef = ref<HTMLInputElement | null>(null)
const composableValue = ref('')
const composableRaw = ref('')
const composableComplete = ref(false)

const { bind, getRawValue, isComplete } = useMask({
	mask: '(###) ###-####',
	placeholder: '_',
	onChange: (_value, raw) => {
		composableRaw.value = raw
		composableComplete.value = isComplete(composableValue.value)
	},
	onComplete: () => {
		composableComplete.value = true
	}
})

onMounted(() => {
	if (composableInputRef.value) {
		bind(composableInputRef.value)
	}
})

const composableCode = `import { ref, onMounted } from 'vue'
import { useMask } from 'directix'

const inputRef = ref<HTMLInputElement | null>(null)
const value = ref('')

const { bind, getRawValue, isComplete } = useMask({
  mask: '(###) ###-####',
  placeholder: '_',
  onChange: (value, raw) => {
    console.log('Raw value:', raw)
  },
  onComplete: (value) => {
    console.log('Complete:', value)
  }
})

onMounted(() => {
  if (inputRef.value) {
    bind(inputRef.value)
  }
})`
</script>

<template>
	<div class="demo-page">
		<h1>v-mask</h1>
		<p class="intro">
			An input masking directive that formats user input according to a pattern. Perfect for phone numbers, dates, credit cards, and other formatted inputs.
		</p>

		<!-- Scenario 1: Basic mask -->
		<DemoSection title="Phone Number" description="Format phone numbers automatically">
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
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Date mask -->
		<DemoSection title="Date Input" description="Format dates with automatic separators">
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
			<CodeBlock :code="dateCode" />
		</DemoSection>

		<!-- Scenario 3: Custom options -->
		<DemoSection title="SSN with Validation" description="Track completion and get raw value">
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
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Mask tokens reference -->
		<DemoSection title="Mask Tokens">
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
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useMask" description="Using useMask composable for programmatic control">
			<div class="demo-box">
				<div class="input-group">
					<label>Phone Number (Composable):</label>
					<input
						ref="composableInputRef"
						v-model="composableValue"
						placeholder="(___) ___-____"
						class="mask-input"
						:class="{ complete: composableComplete }"
					/>
				</div>
				<div class="value-display">
					<strong>Formatted:</strong> {{ composableValue || '(empty)' }}
				</div>
				<div class="value-display">
					<strong>Raw:</strong> {{ composableRaw || '(empty)' }}
				</div>
				<p class="hint">This uses the useMask composable instead of the directive</p>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>

		<!-- API Reference -->
		<DemoSection title="API">
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
						<td>mask</td>
						<td>String</td>
						<td>-</td>
						<td>Mask pattern (required)</td>
					</tr>
					<tr>
						<td>placeholder</td>
						<td>String</td>
						<td>'_'</td>
						<td>Placeholder character</td>
					</tr>
					<tr>
						<td>showPlaceholder</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Show placeholder on focus</td>
					</tr>
					<tr>
						<td>showMaskOnBlur</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Show mask on blur</td>
					</tr>
					<tr>
						<td>clearIncomplete</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Clear incomplete on blur</td>
					</tr>
					<tr>
						<td>onChange</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback on value change (value, rawValue)</td>
					</tr>
					<tr>
						<td>onComplete</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when mask is complete</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable masking</td>
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
	border-color: #667eea;
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

.api-table code {
	background: #f0f0f0;
	padding: 2px 6px;
	border-radius: 4px;
	font-size: 13px;
}
</style>
