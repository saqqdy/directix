<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'SanitizeDemo',
	setup() {
		const userInput1 = ref(`<p>Safe paragraph</p><script>alert("xss")<\/script>`)
		const userInput2 = ref(`<b>Bold</b> and <i>italic</i> and <script>alert("xss")<\/script>`)
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

		return {
			userInput1,
			userInput2,
			userInput3,
			basicCode,
			allowedTagsCode,
			optionsCode
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-sanitize</h1>
		<p class="intro">
			A directive for sanitizing HTML content to prevent XSS attacks.
		</p>

		<!-- Scenario 1: Basic sanitization -->
		<div class="demo-section">
			<h2>Basic Usage</h2>
			<p class="description">Remove dangerous scripts automatically</p>
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
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: Allowed tags -->
		<div class="demo-section">
			<h2>Allowed Tags</h2>
			<p class="description">Specify which tags to keep</p>
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
			<div class="code-block">
				<pre><code>{{ allowedTagsCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 3: Full options -->
		<div class="demo-section">
			<h2>Full Options</h2>
			<p class="description">Control attributes, styles, and more</p>
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
			<div class="code-block">
				<pre><code>{{ optionsCode }}</code></pre>
			</div>
		</div>

		<!-- Dangerous tags reference -->
		<div class="demo-section">
			<h2>Always Removed</h2>
			<div class="dangerous-tags">
				<span v-for="tag in ['script', 'iframe', 'object', 'embed', 'form', 'input', 'style', 'link', 'meta', 'base']" :key="tag" class="tag-badge">
					{{ tag }}
				</span>
			</div>
			<p class="hint">These tags are always removed for security</p>
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
	border-color: #42b883;
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
</style>
