<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'FullscreenDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	data() {
		return {
			fullscreenState: false,
		}
	},
	computed: {
		basicCode(): string {
			return `<div v-fullscreen>
  Content to show in fullscreen
  <button @click="$el.toggleFullscreen()">Toggle</button>
</div>`
		},
		optionsCode(): string {
			return `<div v-fullscreen="{
  fullscreenClass: 'my-fullscreen',
  toggleKey: 'Escape',
  onEnter: () => console.log('Entered'),
  onExit: () => console.log('Exited')
}">
  Custom fullscreen content
</div>`
		},
		composableCode(): string {
			return `import { useFullscreen } from 'directix'

const { enter, exit, toggle, isFullscreen } = useFullscreen({
  onEnter: () => console.log('Entered fullscreen'),
  onExit: () => console.log('Exited fullscreen')
})

// Control fullscreen
enter()   // Enter fullscreen
exit()    // Exit fullscreen
toggle()  // Toggle fullscreen`
		},
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-fullscreen</h1>
		<p class="intro">
			A directive for toggling fullscreen mode on any element. Perfect for video players, presentations, and immersive content.
		</p>

		<!-- Scenario 1: Basic fullscreen -->
		<DemoSection title="Basic Usage" description="Click to toggle fullscreen mode">
			<div class="demo-box">
				<div ref="basicEl" v-fullscreen class="fullscreen-box">
					<h3>Fullscreen Content</h3>
					<p>Click the button below to enter/exit fullscreen mode.</p>
					<p class="hint-text">Press Escape to exit fullscreen</p>
					<button @click="$refs.basicEl.toggleFullscreen && $refs.basicEl.toggleFullscreen()" class="btn">
						Toggle Fullscreen
					</button>
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With callbacks -->
		<DemoSection title="With Callbacks" description="Handle fullscreen state changes">
			<div class="demo-box">
				<div
					ref="callbackEl"
					v-fullscreen="{
						fullscreenClass: 'custom-fullscreen',
						onEnter: () => fullscreenState = true,
						onExit: () => fullscreenState = false
					}"
					class="fullscreen-box"
					:class="{ 'is-fullscreen': fullscreenState }"
				>
					<h3>Fullscreen with Callbacks</h3>
					<p>State: {{ fullscreenState ? 'Fullscreen' : 'Normal' }}</p>
					<button @click="$refs.callbackEl.toggleFullscreen && $refs.callbackEl.toggleFullscreen()" class="btn">
						Toggle
					</button>
				</div>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useFullscreen" description="Using useFullscreen composable">
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
						<td>initialState</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Start in fullscreen mode</td>
					</tr>
					<tr>
						<td>fullscreenClass</td>
						<td>String</td>
						<td>'v-fullscreen--active'</td>
						<td>Class when fullscreen</td>
					</tr>
					<tr>
						<td>toggleKey</td>
						<td>String | false</td>
						<td>'Escape'</td>
						<td>Key to exit fullscreen</td>
					</tr>
					<tr>
						<td>onEnter</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback on enter</td>
					</tr>
					<tr>
						<td>onExit</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback on exit</td>
					</tr>
					<tr>
						<td>onChange</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback on state change</td>
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

.fullscreen-box {
	padding: 40px;
	background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
	border-radius: 8px;
	color: white;
	text-align: center;
	min-height: 200px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;
}

.fullscreen-box h3 {
	margin: 0;
	font-size: 24px;
}

.fullscreen-box p {
	margin: 0;
	opacity: 0.9;
}

.hint-text {
	font-size: 13px;
	opacity: 0.7;
}

.fullscreen-box.is-fullscreen {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.btn {
	padding: 12px 24px;
	background: white;
	color: #42b883;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 600;
}

.btn:hover {
	background: #f3f4f6;
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
