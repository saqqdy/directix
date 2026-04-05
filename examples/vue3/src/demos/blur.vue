<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useBlur } from 'directix'

// Scenario 1: Basic usage
const isBlurred = ref(false)

// Scenario 2: Custom radius
const customRadius = ref(15)
const showCustomBlur = ref(false)

// Scenario 3: With options
const optionsBlur = ref(false)

// Composable API demo
const { show: composableShow, hide: composableHide, toggle: composableToggle } = useBlur({
	radius: 10,
	overlayColor: 'rgba(0, 0, 0, 0.5)',
	onShow: () => console.log('Blur shown'),
	onHide: () => console.log('Blur hidden')
})

const basicCode = `<!-- Simple blur -->
<div v-blur="isBlurred">Content behind blur</div>

<button @click="isBlurred = !isBlurred">
  {{ isBlurred ? 'Hide' : 'Show' }} Blur
</button>`

const radiusCode = `<!-- With radius -->
<div v-blur="15">Blur with 15px radius</div>

<!-- Dynamic radius -->
<div v-blur="customRadius">Dynamic blur radius</div>`

const optionsCode = `<div v-blur="{
  visible: isBlurred,
  radius: 20,
  overlayColor: 'rgba(255, 255, 255, 0.3)',
  lockScroll: true
}">
  Content
</div>`

const composableCode = `import { useBlur } from 'directix'

const { show, hide, toggle } = useBlur({
  radius: 10,
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  onShow: () => console.log('Blur shown'),
  onHide: () => console.log('Blur hidden')
})

// Usage
show()   // Show blur overlay
hide()   // Hide blur overlay
toggle() // Toggle blur overlay`
</script>

<template>
	<div class="demo-page">
		<h1>v-blur</h1>
		<p class="intro">
			A directive that creates a background blur overlay effect, perfect for modal backgrounds, focus states, and visual hierarchy.
		</p>

		<!-- Scenario 1: Basic usage -->
		<DemoSection title="Basic Usage" description="Toggle blur overlay on content">
			<div class="demo-box">
				<div class="blur-container" v-blur="isBlurred">
					<div class="content">
						<h3>Content Behind Blur</h3>
						<p>This content will be blurred when the overlay is active.</p>
					</div>
				</div>
				<button @click="isBlurred = !isBlurred" class="btn">
					{{ isBlurred ? 'Hide' : 'Show' }} Blur
				</button>
				<p class="hint">Click the button to toggle the blur overlay</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Custom radius -->
		<DemoSection title="Custom Radius" description="Adjust the blur intensity">
			<div class="demo-box">
				<div class="blur-container" v-blur="showCustomBlur ? customRadius : false">
					<div class="content">
						<h3>Custom Blur Radius: {{ customRadius }}px</h3>
					</div>
				</div>
				<div class="controls">
					<label>
						Radius: {{ customRadius }}px
						<input type="range" v-model.number="customRadius" min="1" max="30" />
					</label>
					<button @click="showCustomBlur = !showCustomBlur" class="btn">
						{{ showCustomBlur ? 'Hide' : 'Show' }} Blur
					</button>
				</div>
			</div>
			<CodeBlock :code="radiusCode" />
		</DemoSection>

		<!-- Scenario 3: With options -->
		<DemoSection title="With Options" description="Full configuration with overlay color and scroll lock">
			<div class="demo-box">
				<div
					class="blur-container"
					v-blur="{
						visible: optionsBlur,
						radius: 20,
						overlayColor: 'rgba(102, 126, 234, 0.3)',
						lockScroll: true
					}"
				>
					<div class="content">
						<h3>Styled Blur Overlay</h3>
						<p>Semi-transparent colored overlay with scroll lock</p>
					</div>
				</div>
				<button @click="optionsBlur = !optionsBlur" class="btn">
					{{ optionsBlur ? 'Hide' : 'Show' }} Custom Blur
				</button>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useBlur" description="Using useBlur composable for programmatic control">
			<div class="demo-box">
				<div class="button-group">
					<button @click="composableShow()" class="btn">Show Blur</button>
					<button @click="composableHide()" class="btn btn-secondary">Hide Blur</button>
					<button @click="composableToggle()" class="btn btn-outline">Toggle</button>
				</div>
				<p class="hint">This uses the useBlur composable instead of the directive</p>
			</div>
			<CodeBlock :code="composableCode" />
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

.blur-container {
	position: relative;
	min-height: 150px;
	border-radius: 8px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	margin-bottom: 16px;
}

.content {
	padding: 30px;
	color: white;
	text-align: center;
}

.content h3 {
	margin: 0 0 8px 0;
}

.content p {
	margin: 0;
	opacity: 0.9;
}

.btn {
	padding: 10px 20px;
	background: #667eea;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	transition: all 0.2s;
	margin-right: 8px;
}

.btn:hover {
	background: #5a6fd6;
}

.btn-secondary {
	background: #6b7280;
}

.btn-secondary:hover {
	background: #4b5563;
}

.btn-outline {
	background: transparent;
	border: 1px solid #667eea;
	color: #667eea;
}

.btn-outline:hover {
	background: #667eea;
	color: white;
}

.controls {
	display: flex;
	align-items: center;
	gap: 20px;
	flex-wrap: wrap;
}

.controls label {
	display: flex;
	flex-direction: column;
	gap: 8px;
	font-size: 14px;
	color: #666;
}

.controls input[type="range"] {
	width: 200px;
}

.button-group {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}
</style>
