<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

// Scenario 1: Basic sanitization
const userInput1 = ref('<p>Safe paragraph</p><script>alert("xss")</script>')

// Scenario 2: With allowed tags
const userInput2 = ref('<b>Bold</b> and <i>italic</i> and <script>alert("xss")</script>')

// Scenario 3: Custom handler
const userInput3 = ref('<p onclick="alert(1)">Click me</p><a href="javascript:void(0)">Link</a>')

const basicCode = `<div v-sanitize v-html="userContent"></div>`

const allowedTagsCode = `<div v-sanitize="{ allowedTags: ['b', 'i', 'u'] }" v-html="content">
</div>`

const optionsCode = `<div v-sanitize="{
  allowedTags: ['p', 'a', 'b', 'i'],
  allowedAttributes: ['href', 'title'],
  allowClass: true
}" v-html="content">
</div>`
</script>

<template>
	<div class="demo-page">
		<h1>v-sanitize</h1>
		<p class="intro">
			A directive for sanitizing HTML content to prevent XSS attacks. Removes dangerous tags and attributes while preserving safe content.
		</p>

		<!-- Scenario 1: Basic sanitization -->
		<DemoSection title="Basic Usage" description="Remove dangerous scripts automatically">
			<div class="demo-box">
				<div class="input-group">
					<label>Input HTML:</label>
					<textarea v-model="userInput1" class="html-input" rows="2"></textarea>
				</div>
				<div class="result-section">
					<div class="result-label">Sanitized Output:</div>
					<div v-sanitize v-html="userInput1" class="html-output"></div>
				</div>
				<p class="hint">Script tags are automatically removed</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Allowed tags -->
		<DemoSection title="Allowed Tags" description="Specify which tags to keep">
			<div class="demo-box">
				<div class="input-group">
					<label>Input HTML:</label>
					<textarea v-model="userInput2" class="html-input" rows="2"></textarea>
				</div>
				<div class="result-section">
					<div class="result-label">Sanitized (only b, i, u allowed):</div>
					<div v-sanitize="{ allowedTags: ['b', 'i', 'u'] }" v-html="userInput2" class="html-output"></div>
				</div>
			</div>
			<CodeBlock :code="allowedTagsCode" />
		</DemoSection>

		<!-- Scenario 3: Full options -->
		<DemoSection title="Full Options" description="Control attributes, styles, and more">
			<div class="demo-box">
				<div class="input-group">
					<label>Input HTML:</label>
					<textarea v-model="userInput3" class="html-input" rows="2"></textarea>
				</div>
				<div class="result-section">
					<div class="result-label">Sanitized with options:</div>
					<div
						v-sanitize="{
							allowedTags: ['p', 'a', 'b', 'i'],
							allowedAttributes: ['href', 'title'],
							allowClass: true
						}"
						v-html="userInput3"
						class="html-output"
					></div>
				</div>
				<p class="hint">Dangerous attributes like onclick are removed</p>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Dangerous tags reference -->
		<DemoSection title="Always Removed">
			<div class="dangerous-tags">
				<span v-for="tag in ['script', 'iframe', 'object', 'embed', 'form', 'input', 'style', 'link', 'meta', 'base']" :key="tag" class="tag-badge">
					{{ tag }}
				</span>
			</div>
			<p class="hint">These tags are always removed for security</p>
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
						<td>allowedTags</td>
						<td>Array</td>
						<td>['b','i','u','strong','em','br','p','span','div']</td>
						<td>Tags to allow</td>
					</tr>
					<tr>
						<td>allowedAttributes</td>
						<td>Array</td>
						<td>['title','alt','href','src']</td>
						<td>Attributes to allow</td>
					</tr>
					<tr>
						<td>allowDataUrls</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Allow data: URLs</td>
					</tr>
					<tr>
						<td>allowStyles</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Allow style attribute</td>
					</tr>
					<tr>
						<td>allowClass</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Allow class attribute</td>
					</tr>
					<tr>
						<td>allowId</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Allow id attribute</td>
					</tr>
					<tr>
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>Custom sanitize function</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable sanitization</td>
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

.html-input {
	width: 100%;
	padding: 12px;
	font-family: monospace;
	font-size: 13px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	resize: vertical;
}

.html-input:focus {
	outline: none;
	border-color: #667eea;
}

.result-section {
	margin-top: 16px;
}

.result-label {
	font-weight: 500;
	margin-bottom: 8px;
	color: #333;
}

.html-output {
	padding: 16px;
	background: white;
	border-radius: 8px;
	border: 2px solid #48bb78;
	min-height: 40px;
}

.dangerous-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.tag-badge {
	padding: 6px 12px;
	background: #fed7d7;
	color: #c53030;
	border-radius: 4px;
	font-size: 13px;
	font-family: monospace;
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
