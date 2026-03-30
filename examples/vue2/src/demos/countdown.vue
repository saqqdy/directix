<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'CountdownDemo',
	components: { DemoSection, CodeBlock },
	data() {
		return {
			completed: false,
				callbackTargetTime: Date.now() + 5000,
			basicCode: `<span v-countdown="targetDate"></span>`,
			formatCode: `<span v-countdown="{
  target: targetDate,
  format: 'dd:hh:mm:ss'
}"></span>`,
			callbackCode: `<span v-countdown="{
  target: targetDate,
  format: 'mm:ss',
  onComplete: () => console.log('Done!')
}"></span>`
		}
	},
	computed: {
		targetTime1(): number {
			return Date.now() + 2 * 60 * 1000
		},
		targetTime2(): number {
			return Date.now() + 1 * 60 * 60 * 1000
		},
		targetTime3(): number {
			return Date.now() + 24 * 60 * 60 * 1000
		}
	},
	methods: {
		handleComplete() {
			this.completed = true
		},
		resetCallback() {
			this.completed = false
				this.callbackTargetTime = Date.now() + 5000
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-countdown</h1>
		<p class="intro">
			Displays a countdown timer to a target time. Supports multiple formats and completion callbacks.
		</p>

		<DemoSection title="Basic Usage" description="Countdown to a target time">
			<div class="demo-box">
				<div class="countdown-item">
					<span class="label">2 minutes from now:</span>
					<span v-countdown="targetTime1" class="countdown-value"></span>
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<DemoSection title="Format Options" description="Different display formats">
			<div class="demo-box">
				<div class="countdown-item">
					<span class="label">1 hour (hh:mm:ss):</span>
					<span v-countdown="{ target: targetTime2, format: 'hh:mm:ss' }" class="countdown-value"></span>
				</div>
				<div class="countdown-item">
					<span class="label">1 day (dd:hh:mm:ss):</span>
					<span v-countdown="{ target: targetTime3, format: 'dd:hh:mm:ss' }" class="countdown-value"></span>
				</div>
				<div class="countdown-item">
					<span class="label">Minutes only (mm:ss):</span>
					<span v-countdown="{ target: targetTime1, format: 'mm:ss' }" class="countdown-value"></span>
				</div>
			</div>
			<CodeBlock :code="formatCode" />
		</DemoSection>

		<DemoSection title="Completion Callback" description="Trigger action when countdown ends">
			<div class="demo-box">
				<div class="countdown-item">
					<span class="label">5 seconds (watch it complete):</span>
					<span
						v-countdown="{
							target: callbackTargetTime,
							format: 'ss',
							onComplete: handleComplete
						}"
						class="countdown-value"
						:class="{ 'countdown-done': completed }"
					></span>
					<span v-if="completed" class="done-badge">Done!</span>
				</div>
				<button @click="resetCallback" class="reset-btn">Reset</button>
			</div>
			<CodeBlock :code="callbackCode" />
		</DemoSection>

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
						<td>target</td>
						<td>Date | number | string</td>
						<td>-</td>
						<td>Target time (required)</td>
					</tr>
					<tr>
						<td>format</td>
						<td>String | Function</td>
						<td>'hh:mm:ss'</td>
						<td>Display format</td>
					</tr>
					<tr>
						<td>interval</td>
						<td>Number</td>
						<td>1000</td>
						<td>Update interval in ms</td>
					</tr>
					<tr>
						<td>onComplete</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when countdown ends</td>
					</tr>
					<tr>
						<td>autoStart</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Auto-start countdown</td>
					</tr>
				</tbody>
			</table>

			<h4 style="margin-top: 20px;">Format Placeholders</h4>
			<ul class="arg-list">
				<li><code>dd</code> - Days (2 digits)</li>
				<li><code>hh</code> - Hours (2 digits)</li>
				<li><code>mm</code> - Minutes (2 digits)</li>
				<li><code>ss</code> - Seconds (2 digits)</li>
			</ul>
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

.countdown-item {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 16px;
	padding: 12px;
	background: white;
	border-radius: 8px;
	border: 1px solid #e0e0e0;
}

.countdown-item:last-child {
	margin-bottom: 0;
}

.label {
	font-size: 14px;
	color: #666;
	min-width: 180px;
}

.countdown-value {
	font-size: 24px;
	font-weight: 600;
	color: #42b883;
	font-family: 'Courier New', monospace;
}

.countdown-done {
	color: #28a745;
}

.done-badge {
	background: #28a745;
	color: white;
	padding: 4px 12px;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 600;
}

.reset-btn {
	padding: 8px 16px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	margin-top: 12px;
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

.arg-list {
	margin-top: 8px;
	padding-left: 20px;
}

.arg-list li {
	margin: 4px 0;
}

.arg-list code {
	background: #f0f0f0;
	padding: 2px 6px;
	border-radius: 4px;
}
</style>
