<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useVisible } from 'directix'

// Scenario 1: Basic toggle
const showElement = ref(true)

// Scenario 2: With handler callback
const visibilityHistory = ref<string[]>([])
const handleVisibilityChange = (isVisible: boolean) => {
	visibilityHistory.value.push(isVisible ? 'Shown' : 'Hidden')
	if (visibilityHistory.value.length > 5) {
		visibilityHistory.value.shift()
	}
}

// Scenario 3: Use visibility: hidden
const useHidden = ref(true)
const toggleHidden = ref(true)

// Scenario 4: Animated visibility
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
const composableVisibleRef = ref<HTMLElement | null>(null)
const {
	visible: composableVisible,
	show: composableShow,
	hide: composableHide,
	toggle: composableToggle,
	bind: bindVisible
} = useVisible({ initial: true })

onMounted(() => {
	if (composableVisibleRef.value) {
		bindVisible(composableVisibleRef.value)
	}
})

const composableCode = `import { ref, onMounted } from 'vue'
import { useVisible } from 'directix'

const element = ref(null)
const { visible, show, hide, toggle, bind } = useVisible({
  initial: false,
  onChange: (v) => console.log('Visibility:', v)
})

onMounted(() => {
  bind(element.value)
})

// Usage in template:
// <button @click="toggle">Toggle</button>
// <div ref="element">Controlled by composable</div>`
</script>

<template>
	<div class="demo-page">
		<h1>v-visible</h1>
		<p class="intro">
			A directive for controlling element visibility. Supports both display:none and visibility:hidden modes.
		</p>

		<!-- Scenario 1: Basic toggle -->
		<DemoSection title="Basic Usage" description="Toggle element visibility with a boolean value">
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
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With handler callback -->
		<DemoSection title="With Handler" description="Track visibility changes with a callback">
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
					<strong>History:</strong> {{ visibilityHistory.join(' → ') || 'No changes yet' }}
				</div>
			</div>
			<CodeBlock :code="handlerCode" />
		</DemoSection>

		<!-- Scenario 3: Use visibility: hidden -->
		<DemoSection title="Visibility Hidden Mode" description="Use visibility:hidden instead of display:none">
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
			<CodeBlock :code="hiddenCode" />
		</DemoSection>

		<!-- Scenario 4: Animated visibility -->
		<DemoSection title="Animated Visibility" description="Combine with CSS transitions for smooth effects">
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
			<CodeBlock :code="animatedCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useVisible" description="Using useVisible composable for programmatic visibility control">
			<div class="demo-box">
				<div class="controls">
					<button class="btn" @click="composableShow">Show</button>
					<button class="btn secondary" @click="composableHide">Hide</button>
					<button class="btn" @click="composableToggle">Toggle</button>
				</div>
				<div
					ref="composableVisibleRef"
					class="visible-box composable"
				>
					Controlled by useVisible composable
					<br />
					Visible: {{ composableVisible }}
				</div>
				<p class="hint">This uses the useVisible composable instead of the directive</p>
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

.controls {
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
	background: #9ca3af;
}

.btn.secondary:hover {
	background: #6b7280;
}

.visible-box {
	padding: 30px;
	background: #667eea;
	color: white;
	border-radius: 8px;
	text-align: center;
	font-weight: 600;
}

.visible-box.colored {
	background: linear-gradient(135deg, #667eea, #764ba2);
}

.visible-box.composable {
	background: linear-gradient(135deg, #11998e, #38ef7d);
}

.visible-box.small {
	padding: 20px;
	flex: 1;
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
