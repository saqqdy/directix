<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'MutationDemo',
	setup() {
		const mutationLog = ref<string[]>([])
		const childCount = ref(1)

		const handleMutation = (mutations: MutationRecord[]) => {
			mutations.forEach(mutation => {
				if (mutation.type === 'childList') {
					mutationLog.value.push(`Children changed: +${mutation.addedNodes.length} -${mutation.removedNodes.length}`)
				}
			})
			if (mutationLog.value.length > 5) {
				mutationLog.value.shift()
			}
		}

		const addChild = () => {
			childCount.value++
		}

		const removeChild = () => {
			if (childCount.value > 0) {
				childCount.value--
			}
		}

		const attrLog = ref<string[]>([])
		const boxClass = ref('box')

		const handleAttrMutation = (mutations: MutationRecord[]) => {
			mutations.forEach(mutation => {
				if (mutation.type === 'attributes') {
					attrLog.value.push(`Attribute "${mutation.attributeName}" changed`)
				}
			})
			if (attrLog.value.length > 5) {
				attrLog.value.shift()
			}
		}

		const toggleClass = () => {
			boxClass.value = boxClass.value === 'box' ? 'box active' : 'box'
		}

		const basicCode = `<div v-mutation="handleMutation">
  <div v-for="i in count" :key="i">Child {{ i }}</div>
</div>`

		const attrCode = `<div v-mutation="{
  handler: handleMutation,
  attributes: true,
  attributeFilter: ['class', 'style']
}">
  Observe attribute changes
</div>`

		return {
			mutationLog,
			childCount,
			handleMutation,
			addChild,
			removeChild,
			attrLog,
			boxClass,
			handleAttrMutation,
			toggleClass,
			basicCode,
			attrCode
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-mutation</h1>
		<p class="intro">
			A directive for observing DOM mutations using MutationObserver.
		</p>

		<!-- Scenario 1: Child list observation -->
		<div class="demo-section">
			<h2>Child List Changes</h2>
			<p class="description">Observe when child elements are added or removed</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="addChild">Add Child</button>
					<button class="btn secondary" @click="removeChild">Remove Child</button>
				</div>
				<div class="log-panel">
					<strong>Log:</strong> {{ mutationLog.length > 0 ? mutationLog.join(' | ') : 'No changes yet' }}
				</div>
				<div v-mutation="handleMutation" class="mutation-container">
					<div v-for="i in childCount" :key="i" class="child-item">
						Child {{ i }}
					</div>
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: Attribute observation -->
		<div class="demo-section">
			<h2>Attribute Changes</h2>
			<p class="description">Observe when attributes change</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="toggleClass">Toggle Class</button>
				</div>
				<div class="log-panel">
					<strong>Log:</strong> {{ attrLog.length > 0 ? attrLog.join(' | ') : 'No changes yet' }}
				</div>
				<div
					v-mutation="{
						handler: handleAttrMutation,
						attributes: true,
						attributeFilter: ['class', 'style']
					}"
					:class="boxClass"
					class="mutation-box"
				>
					Observe my attributes
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ attrCode }}</code></pre>
			</div>
		</div>

		<!-- API Reference -->
		<div class="demo-section">
			<h2>API</h2>
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
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>Mutation callback (required)</td>
					</tr>
					<tr>
						<td>attributes</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Observe attribute changes</td>
					</tr>
					<tr>
						<td>attributeFilter</td>
						<td>Array</td>
						<td>-</td>
						<td>Specific attributes to observe</td>
					</tr>
					<tr>
						<td>childList</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Observe child additions/removals</td>
					</tr>
					<tr>
						<td>subtree</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Observe all descendants</td>
					</tr>
					<tr>
						<td>characterData</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Observe text content changes</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable observer</td>
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

.controls {
	display: flex;
	gap: 12px;
	margin-bottom: 16px;
}

.btn {
	padding: 10px 20px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
}

.btn:hover {
	background: #3aa876;
}

.btn.secondary {
	background: #e0e0e0;
	color: #333;
}

.log-panel {
	padding: 12px;
	background: white;
	border-radius: 6px;
	margin-bottom: 16px;
	font-size: 13px;
	font-family: monospace;
}

.mutation-container {
	padding: 16px;
	background: white;
	border-radius: 8px;
	border: 2px dashed #42b883;
	min-height: 60px;
}

.child-item {
	display: inline-block;
	padding: 8px 16px;
	margin: 4px;
	background: #42b883;
	color: white;
	border-radius: 4px;
}

.mutation-box {
	padding: 20px;
	background: #f0f0f0;
	border-radius: 8px;
	text-align: center;
	transition: all 0.3s;
}

.mutation-box.active {
	background: #42b883;
	color: white;
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
