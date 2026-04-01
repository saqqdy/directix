<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useVisible } from 'directix'

export default defineComponent({
	name: 'VisibleDemo',
	setup() {
		const showElement = ref(true)

		const visibilityHistory = ref<string[]>([])
		const handleVisibilityChange = (isVisible: boolean) => {
			visibilityHistory.value.push(isVisible ? 'Shown' : 'Hidden')
			if (visibilityHistory.value.length > 5) {
				visibilityHistory.value.shift()
			}
		}

		const useHidden = ref(true)
		const toggleHidden = ref(true)

		const showAnimated = ref(true)

		const basicCode = `<div v-visible="showElement">
	  Toggle visibility
	</div>

	<button @click="showElement = !showElement">
	  Toggle
	</button>`

		const handlerCode = `<div v-visible="{ handler: handleVisibilityChange }">
	  Track visibility changes
	</div>`

		const hiddenCode = `<div v-visible="{ useHidden: true, initial: true }">
	  Uses visibility: hidden instead of display: none
	</div>`

		const animatedCode = `<div
	  v-visible="{ initial: showAnimated, useHidden: true }"
	  class="animated-box"
	>
	  Animated visibility
	</div>`

		// Composable API demo
		const composableElement = ref<HTMLElement | null>(null)
		const composableHistory = ref<string[]>([])

		const { visible, show, hide, toggle, bind } = useVisible({
			initial: false,
			onChange: (v) => {
				composableHistory.value.push(v ? 'Shown' : 'Hidden')
				if (composableHistory.value.length > 5) {
					composableHistory.value.shift()
				}
			},
		})

		onMounted(() => {
			if (composableElement.value) {
				bind(composableElement.value)
			}
		})

		const composableCode = `import { ref, onMounted } from 'vue'
import { useVisible } from 'directix'

const element = ref(null)
const { visible, show, hide, toggle, bind } = useVisible({
  initial: false,
  onChange: (v) => console.log('Visible:', v)
})

onMounted(() => bind(element.value))

// Programmatic control
show()
hide()
toggle()`

		return {
			showElement,
			visibilityHistory,
			handleVisibilityChange,
			useHidden,
			toggleHidden,
			showAnimated,
			basicCode,
			handlerCode,
			hiddenCode,
			animatedCode,
			// Composable API
			composableElement,
			visible,
			show,
			hide,
			toggle,
			composableHistory,
			composableCode,
		}
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-visible</h1>
		<p class="intro">
			A directive for controlling element visibility. Supports both display:none and visibility:hidden modes.
		</p>

		<!-- Scenario 1: Basic toggle -->
		<div class="demo-section">
			<h2>Basic Usage</h2>
			<p class="description">Toggle element visibility with a boolean value</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="showElement = !showElement">
						{{ showElement ? 'Hide' : 'Show' }} Element
					</button>
				</div>
				<div v-visible="showElement" class="visible-box">
					This element is {{ showElement ? 'visible' : 'hidden' }}
				</div>
				<p class="hint">Element uses display: none when hidden</p>
			</div>
			<div class="code-block">
				<pre><code>{{ basicCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 2: With handler callback -->
		<div class="demo-section">
			<h2>With Handler</h2>
			<p class="description">Track visibility changes with a callback</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="toggleHidden = !toggleHidden">
						Toggle
					</button>
				</div>
				<div
					v-visible="{ handler: handleVisibilityChange, initial: toggleHidden }"
					class="visible-box colored"
				>
					Visibility tracked
				</div>
				<div class="history">
					<strong>History:</strong> {{ visibilityHistory.join(' -> ') || 'No changes yet' }}
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ handlerCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 3: Use visibility: hidden -->
		<div class="demo-section">
			<h2>Visibility Hidden Mode</h2>
			<p class="description">Use visibility:hidden instead of display:none</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="useHidden = !useHidden">
						Toggle
					</button>
				</div>
				<div class="container-row">
					<div
						v-visible="{ useHidden: true, initial: useHidden }"
						class="visible-box small"
					>
						Box 1
					</div>
					<div class="visible-box small">
						Box 2 (stays in position)
					</div>
				</div>
				<p class="hint">visibility:hidden preserves element's space in layout</p>
			</div>
			<div class="code-block">
				<pre><code>{{ hiddenCode }}</code></pre>
			</div>
		</div>

		<!-- Scenario 4: Animated visibility -->
		<div class="demo-section">
			<h2>Animated Visibility</h2>
			<p class="description">Combine with CSS transitions for smooth effects</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="showAnimated = !showAnimated">
						Toggle with Animation
					</button>
				</div>
				<div v-visible="{ initial: showAnimated, useHidden: true }" class="animated-box">
					Animated Element
				</div>
			</div>
			<div class="code-block">
				<pre><code>{{ animatedCode }}</code></pre>
			</div>
		</div>

		<!-- Composable API -->
		<div class="demo-section">
			<h2>Composable API</h2>
			<p class="description">使用 useVisible composable 编程式控制可见性</p>
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="show">Show</button>
					<button class="btn" @click="hide">Hide</button>
					<button class="btn" @click="toggle">Toggle</button>
				</div>
				<div ref="composableElement" class="visible-box composable-box">
					Current state: <strong>{{ visible ? 'Visible' : 'Hidden' }}</strong>
				</div>
				<div class="history">
					<strong>History:</strong> {{ composableHistory.join(' -> ') || 'No changes yet' }}
				</div>
				<p class="hint">使用 composable 可以编程式控制可见性并追踪状态变化</p>
			</div>
			<div class="code-block">
				<pre><code>{{ composableCode }}</code></pre>
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
						<td>initial</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Initial visibility state</td>
					</tr>
					<tr>
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when visibility changes</td>
					</tr>
					<tr>
						<td>useHidden</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Use visibility:hidden instead of display:none</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable visibility control</td>
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

.controls {
	margin-bottom: 16px;
	display: flex;
	gap: 12px;
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

.visible-box {
	padding: 30px;
	background: #42b883;
	color: white;
	border-radius: 8px;
	text-align: center;
	font-weight: 600;
}

.visible-box.colored {
	background: linear-gradient(135deg, #42b883, #35495e);
}

.visible-box.small {
	padding: 20px;
	flex: 1;
}

.visible-box.composable-box {
	background: linear-gradient(135deg, #667eea, #764ba2);
}

.container-row {
	display: flex;
	gap: 12px;
}

.history {
	margin-top: 12px;
	padding: 12px;
	background: white;
	border-radius: 6px;
	font-size: 14px;
}

.animated-box {
	padding: 30px;
	background: linear-gradient(135deg, #48bb78, #38a169);
	color: white;
	border-radius: 8px;
	text-align: center;
	font-weight: 600;
	transition: opacity 0.5s, transform 0.5s;
}

.animated-box.v-hidden {
	opacity: 0;
	transform: scale(0.95);
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
