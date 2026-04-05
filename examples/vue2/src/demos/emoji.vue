<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'EmojiDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	data() {
		return {
			basicText: '',
			replacementText: '',
			allowListText: '',
			blockListText: '',
			composableText: '',
		}
	},
	methods: {
		stripEmojis(text: string): string {
			return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
		},
		containsEmoji(text: string): boolean {
			return /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu.test(text)
		},
		checkEmoji() {
			alert(this.containsEmoji(this.composableText) ? 'Contains emoji!' : 'No emoji')
		},
	},
	computed: {
		basicCode(): string {
			return `<!-- Strip all emojis -->
<input v-emoji type="text" v-model="text" />`
		},
		replacementCode(): string {
			return `<input v-emoji="{ strip: true, replacement: '*' }" type="text" />`
		},
		allowCode(): string {
			return `<!-- Allow specific emojis -->
<input v-emoji="{ allowList: ['😊', '👍'] }" type="text" />

<!-- Only 😊 and 👍 will be allowed, others stripped -->`
		},
		blockCode(): string {
			return `<!-- Block specific emojis -->
<input v-emoji="{ blockList: ['🚫', '❌'] }" type="text" />

<!-- 🚫 and ❌ will be stripped, others allowed -->`
		},
		composableCode(): string {
			return `import { useEmoji } from 'directix'

const { stripEmojis, containsEmoji } = useEmoji({ strip: true })

// Strip emojis from text
const cleaned = stripEmojis('Hello 😊 World! 👋')
// Result: 'Hello  World! '

// Check if text contains emojis
const hasEmoji = containsEmoji('Hello 😊')
// Result: true`
		},
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-emoji</h1>
		<p class="intro">
			A directive for filtering or restricting emoji input in text fields. Perfect for forms that need to be emoji-free or allow only specific emojis.
		</p>

		<!-- Scenario 1: Basic strip -->
		<DemoSection title="Basic Strip" description="Strip all emojis from input">
			<div class="demo-box">
				<input
					v-emoji
					v-model="basicText"
					type="text"
					class="input"
					placeholder="Type with emojis, they will be stripped"
				/>
				<p class="hint">Try typing: Hello 😊 World 🌍</p>
				<p class="result">Value: "{{ basicText }}"</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With replacement -->
		<DemoSection title="With Replacement" description="Replace emojis with a character">
			<div class="demo-box">
				<input
					v-emoji="{ strip: true, replacement: '*' }"
					v-model="replacementText"
					type="text"
					class="input"
					placeholder="Emojis will be replaced with *"
				/>
				<p class="hint">Try typing: I ❤️ Vue 🚀</p>
				<p class="result">Value: "{{ replacementText }}"</p>
			</div>
			<CodeBlock :code="replacementCode" />
		</DemoSection>

		<!-- Scenario 3: Allow list -->
		<DemoSection title="Allow List" description="Allow only specific emojis">
			<div class="demo-box">
				<input
					v-emoji="{ allowList: ['😊', '👍', '❤️'] }"
					v-model="allowListText"
					type="text"
					class="input"
					placeholder="Only 😊 👍 ❤️ allowed"
				/>
				<p class="hint">Only 😊, 👍, and ❤️ will be kept. Try: Great 👍 job 😊 🎉</p>
				<p class="result">Value: "{{ allowListText }}"</p>
			</div>
			<CodeBlock :code="allowCode" />
		</DemoSection>

		<!-- Scenario 4: Block list -->
		<DemoSection title="Block List" description="Block specific emojis">
			<div class="demo-box">
				<input
					v-emoji="{ blockList: ['🚫', '❌', '⛔'] }"
					v-model="blockListText"
					type="text"
					class="input"
					placeholder="🚫 ❌ ⛔ will be blocked"
				/>
				<p class="hint">🚫, ❌, and ⛔ will be stripped. Try: Pass ✅ Fail ❌</p>
				<p class="result">Value: "{{ blockListText }}"</p>
			</div>
			<CodeBlock :code="blockCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useEmoji" description="Using useEmoji composable">
			<div class="demo-box">
				<input
					v-model="composableText"
					type="text"
					class="input"
					placeholder="Type something..."
				/>
				<div class="button-group">
					<button @click="composableText = stripEmojis(composableText)" class="btn">
						Strip Emojis
					</button>
					<button @click="checkEmoji" class="btn btn-secondary">
						Check for Emoji
					</button>
				</div>
				<p class="hint">Use the buttons to strip or check for emojis programmatically</p>
			</div>
			<CodeBlock :code="composableCode" />
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
						<td>strip</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Strip emojis from input</td>
					</tr>
					<tr>
						<td>allowList</td>
						<td>String[]</td>
						<td>-</td>
						<td>Emojis to allow</td>
					</tr>
					<tr>
						<td>blockList</td>
						<td>String[]</td>
						<td>-</td>
						<td>Emojis to block</td>
					</tr>
					<tr>
						<td>replacement</td>
						<td>String</td>
						<td>''</td>
						<td>Character to replace with</td>
					</tr>
					<tr>
						<td>onEmoji</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when emoji detected</td>
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

.input {
	width: 100%;
	padding: 12px 14px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
	margin-bottom: 12px;
}

.input:focus {
	outline: none;
	border-color: #42b883;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-bottom: 8px;
}

.result {
	font-size: 14px;
	color: #42b883;
	font-family: monospace;
	background: white;
	padding: 8px 12px;
	border-radius: 4px;
}

.button-group {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
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

.btn-secondary {
	background: #6b7280;
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
