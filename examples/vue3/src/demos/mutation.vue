<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

// Scenario 1: Basic mutation observer
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

// Scenario 2: Attribute observation
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
</script>

<template>
	<div class="demo-page">
		<h1>v-mutation</h1>
		<p class="intro">
			A directive for observing DOM mutations using MutationObserver. Detect changes to elements, attributes, and content.
		</p>

		<!-- Scenario 1: Child list observation -->
		<DemoSection title="Child List Changes" description="Observe when child elements are added or removed">
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
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Attribute observation -->
		<DemoSection title="Attribute Changes" description="Observe when attributes change">
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
			<CodeBlock :code="attrCode" />
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
						<td>attributeOldValue</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Record old attribute values</td>
					</tr>
					<tr>
						<td>characterDataOldValue</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Record old text content</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable observer</td>
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

.controls {
	display: flex;
	gap: 12px;
	margin-bottom: 16px;
}

.btn {
	padding: 10px 20px;
	background: #667eea;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
}

.btn:hover {
	background: #5a6fd6;
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
	border: 2px dashed #667eea;
	min-height: 60px;
}

.child-item {
	display: inline-block;
	padding: 8px 16px;
	margin: 4px;
	background: #667eea;
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
	background: #667eea;
	color: white;
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
