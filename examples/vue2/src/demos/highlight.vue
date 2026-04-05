<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'HighlightDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	data() {
		return {
			text1: 'This is an important message about Vue.js development.',
			text2: 'Vue and React are popular JavaScript frameworks for building modern web applications.',
			text3: 'Vue is great. vue is also great. VUE is still great.',
			text4: 'Search results will highlight matching keywords for better visibility.',
			searchText: 'Vue',
			dynamicText: 'Vue 3 introduces the Composition API, which provides better TypeScript support and code organization in Vue applications.',
		}
	},
	computed: {
		basicCode(): string {
			return `<p v-highlight="'important'">
  This is an important message.
</p>`
		},
		multipleCode(): string {
			return `<p v-highlight="['Vue', 'React', 'JavaScript']">
  Vue and React are popular JavaScript frameworks.
</p>`
		},
		optionsCode(): string {
			return `<p v-highlight="{
  keywords: 'highlight',
  className: 'my-highlight',
  style: 'background: yellow; color: black;',
  caseSensitive: true,
  wholeWord: true,
  tag: 'mark'
}">
  This will highlight the word.
</p>`
		},
		composableCode(): string {
			return `import { useHighlight } from 'directix'

const { highlight, clear } = useHighlight({
  className: 'v-highlight',
  caseSensitive: false
})

// Highlight keywords in text
const result = highlight(text, ['Vue', 'React'])

// Clear highlights
clear()`
		},
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-highlight</h1>
		<p class="intro">
			A directive for highlighting keywords in text content. Perfect for search results, emphasis, and content highlighting.
		</p>

		<!-- Scenario 1: Basic usage -->
		<DemoSection title="Basic Usage" description="Highlight a single keyword">
			<div class="demo-box">
				<p v-highlight="'important'" class="highlight-text">
					{{ text1 }}
				</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Multiple keywords -->
		<DemoSection title="Multiple Keywords" description="Highlight multiple different keywords">
			<div class="demo-box">
				<p v-highlight="['Vue', 'React', 'JavaScript']" class="highlight-text">
					{{ text2 }}
				</p>
			</div>
			<CodeBlock :code="multipleCode" />
		</DemoSection>

		<!-- Scenario 3: Case sensitive -->
		<DemoSection title="Case Sensitive" description="Match exact case">
			<div class="demo-box">
				<div class="compare">
					<div>
						<span class="label">Case insensitive (default):</span>
						<p v-highlight="'Vue'" class="highlight-text">
							{{ text3 }}
						</p>
					</div>
					<div>
						<span class="label">Case sensitive:</span>
						<p v-highlight="{ keywords: 'Vue', caseSensitive: true }" class="highlight-text">
							{{ text3 }}
						</p>
					</div>
				</div>
			</div>
		</DemoSection>

		<!-- Scenario 4: Custom style -->
		<DemoSection title="Custom Style" description="Apply custom styling to highlights">
			<div class="demo-box">
				<p v-highlight="{
					keywords: ['highlight', 'keywords', 'visibility'],
					className: 'custom-highlight',
					style: 'background: linear-gradient(120deg, #ffd700 0%, #ffec8b 100%); color: #333; padding: 2px 4px; border-radius: 3px;'
				}" class="highlight-text">
					{{ text4 }}
				</p>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Dynamic highlight -->
		<DemoSection title="Dynamic Highlight" description="Highlight based on search input">
			<div class="demo-box">
				<input
					v-model="searchText"
					class="input"
					placeholder="Type to search..."
				/>
				<p v-highlight="searchText" class="highlight-text">
					{{ dynamicText }}
				</p>
				<p class="hint">Type a word to highlight it in the text above</p>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useHighlight" description="Using useHighlight composable">
			<div class="demo-box">
				<CodeBlock :code="composableCode" />
			</div>
		</DemoSection>

		<!-- API Reference -->
		<DemoSection title="API">
			<table class="api-table">
				<thead>
					<tr>
						<th>Property</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>keywords</td>
						<td>String | String[]</td>
						<td>-</td>
						<td>Keywords to highlight (required)</td>
					</tr>
					<tr>
						<td>className</td>
						<td>String</td>
						<td>'v-highlight'</td>
						<td>CSS class for highlights</td>
					</tr>
					<tr>
						<td>style</td>
						<td>String</td>
						<td>-</td>
						<td>Inline style for highlights</td>
					</tr>
					<tr>
						<td>caseSensitive</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Match case</td>
					</tr>
					<tr>
						<td>wholeWord</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Match whole words only</td>
					</tr>
					<tr>
						<td>tag</td>
						<td>String</td>
						<td>'mark'</td>
						<td>HTML tag for highlights</td>
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

.highlight-text {
	line-height: 1.8;
	font-size: 16px;
}

.input {
	width: 100%;
	padding: 12px 14px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
	margin-bottom: 16px;
}

.input:focus {
	outline: none;
	border-color: #42b883;
}

.compare {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
}

.compare .label {
	display: block;
	font-size: 13px;
	font-weight: 600;
	color: #666;
	margin-bottom: 8px;
}

.hint {
	font-size: 13px;
	color: #888;
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
</style>

<style>
/* Default highlight style */
.v-highlight {
	background: #ffeb3b;
	padding: 1px 2px;
	border-radius: 2px;
}

/* Custom highlight style */
.custom-highlight {
	font-weight: 600;
}
</style>
