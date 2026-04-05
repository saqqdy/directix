<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'TypewriterDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	data() {
		return {
			basicText: 'Hello, World! Welcome to Directix.',
			slowText: 'This text types slowly...',
			loopText: 'This message will loop forever!',
			dynamicText: 'Type something new!',
			dynamicKey: 0,
		}
	},
	computed: {
		basicCode(): string {
			return `<!-- Simple usage -->
<span v-typewriter="'Hello, World!'"></span>

<!-- Dynamic text -->
<span v-typewriter="message"></span>`
		},
		optionsCode(): string {
			return `<span v-typewriter="{
  text: 'Typing animation',
  speed: 100,
  delay: 500,
  cursor: '_',
  cursorBlink: true
}"></span>`
		},
		loopCode(): string {
			return `<span v-typewriter="{
  text: 'Loop message',
  loop: true,
  deleteDelay: 1000,
  deleteSpeed: 30
}"></span>`
		},
		composableCode(): string {
			return `import { useTypewriter } from 'directix'

const { start, pause, resume, reset } = useTypewriter({
  text: 'Hello, World!',
  speed: 50
})

// Control animation
start()   // Start typing
pause()   // Pause animation
resume()  // Resume animation
reset()   // Reset to beginning`
		},
	},
	methods: {
		replay() {
			this.dynamicKey++
		},
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-typewriter</h1>
		<p class="intro">
			A directive for creating typewriter animation effects. Text appears character by character with customizable speed and cursor.
		</p>

		<!-- Scenario 1: Basic typewriter -->
		<DemoSection title="Basic Usage" description="Simple typewriter effect">
			<div class="demo-box">
				<div class="typewriter-display">
					<span v-typewriter="basicText"></span>
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With options -->
		<DemoSection title="With Options" description="Customize speed and appearance">
			<div class="demo-box">
				<div class="typewriter-display">
					<span v-typewriter="{
						text: slowText,
						speed: 100,
						delay: 500,
						cursor: '▌',
						cursorBlink: true
					}"></span>
				</div>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Scenario 3: Loop mode -->
		<DemoSection title="Loop Mode" description="Continuously type and delete">
			<div class="demo-box">
				<div class="typewriter-display">
					<span v-typewriter="{
						text: loopText,
						loop: true,
						speed: 60,
						deleteDelay: 1500,
						deleteSpeed: 40
					}"></span>
				</div>
				<p class="hint">This message will loop forever</p>
			</div>
			<CodeBlock :code="loopCode" />
		</DemoSection>

		<!-- Scenario 4: Custom cursor -->
		<DemoSection title="Custom Cursor" description="Different cursor styles">
			<div class="demo-box">
				<div class="cursor-grid">
					<div>
						<span class="label">Pipe cursor:</span>
						<span v-typewriter="{ text: 'Default pipe', cursor: '|' }"></span>
					</div>
					<div>
						<span class="label">Underscore cursor:</span>
						<span v-typewriter="{ text: 'Underscore style', cursor: '_' }"></span>
					</div>
					<div>
						<span class="label">Block cursor:</span>
						<span v-typewriter="{ text: 'Block style', cursor: '▌' }"></span>
					</div>
					<div>
						<span class="label">No cursor:</span>
						<span v-typewriter="{ text: 'No cursor here', cursor: false }"></span>
					</div>
				</div>
			</div>
		</DemoSection>

		<!-- Dynamic text -->
		<DemoSection title="Dynamic Text" description="Change text dynamically">
			<div class="demo-box">
				<div class="typewriter-display">
					<span v-typewriter="dynamicText" :key="dynamicKey"></span>
				</div>
				<div class="controls">
					<input v-model="dynamicText" class="input" placeholder="Type new message" />
					<button @click="replay" class="btn">Replay</button>
				</div>
			</div>
		</DemoSection>

		<!-- Multiple messages example -->
		<DemoSection title="Multiple Messages" description="Typewriter for list of messages">
			<div class="demo-box">
				<div class="messages">
					<div v-typewriter="{ text: 'First message loads...', speed: 80 }" class="message"></div>
					<div v-typewriter="{ text: 'Second message appears...', speed: 80, delay: 1500 }" class="message"></div>
					<div v-typewriter="{ text: 'Third message completes!', speed: 80, delay: 3000 }" class="message"></div>
				</div>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useTypewriter" description="Using useTypewriter composable">
			<div class="demo-box">
				<p class="hint">Programmatic control with composable</p>
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
						<td>text</td>
						<td>String</td>
						<td>-</td>
						<td>Text to type (required)</td>
					</tr>
					<tr>
						<td>speed</td>
						<td>Number</td>
						<td>50</td>
						<td>Typing speed in ms</td>
					</tr>
					<tr>
						<td>delay</td>
						<td>Number</td>
						<td>0</td>
						<td>Delay before starting</td>
					</tr>
					<tr>
						<td>loop</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Loop the animation</td>
					</tr>
					<tr>
						<td>deleteDelay</td>
						<td>Number</td>
						<td>1500</td>
						<td>Delay before deleting (loop)</td>
					</tr>
					<tr>
						<td>deleteSpeed</td>
						<td>Number</td>
						<td>30</td>
						<td>Delete speed in ms</td>
					</tr>
					<tr>
						<td>cursor</td>
						<td>String | false</td>
						<td>'|'</td>
						<td>Cursor character</td>
					</tr>
					<tr>
						<td>cursorBlink</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Blink animation</td>
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

.typewriter-display {
	background: #1a1a2e;
	color: #42b883;
	padding: 24px;
	border-radius: 8px;
	font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
	font-size: 18px;
	min-height: 70px;
	display: flex;
	align-items: center;
}

.cursor-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
}

.cursor-grid > div {
	background: white;
	padding: 16px;
	border-radius: 6px;
}

.cursor-grid .label {
	display: block;
	font-size: 12px;
	color: #666;
	margin-bottom: 8px;
}

.messages {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.message {
	background: white;
	padding: 16px;
	border-radius: 6px;
	font-family: 'SF Mono', monospace;
	color: #333;
}

.controls {
	display: flex;
	gap: 12px;
	margin-top: 16px;
}

.input {
	flex: 1;
	padding: 10px 14px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
}

.input:focus {
	outline: none;
	border-color: #42b883;
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

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
	text-align: center;
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
