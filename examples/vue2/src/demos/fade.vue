<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'FadeDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	data() {
		return {
			isVisible1: true,
			showFadeIn: false,
			isVisible3: true,
			isVisible4: true,
		}
	},
	computed: {
		basicCode(): string {
			return `<!-- Toggle visibility with fade -->
<div v-fade="isVisible">Fade content</div>

<button @click="isVisible = !isVisible">
  Toggle
</button>`
		},
		directionCode(): string {
			return `<!-- Fade in only -->
<div v-fade="'in'">Fades in on mount</div>

<!-- Fade out only -->
<div v-fade="'out'">Fades out on mount</div>`
		},
		optionsCode(): string {
			return `<div v-fade="{
  visible: isVisible,
  duration: 500,
  easing: 'ease-in-out',
  minOpacity: 0,
  maxOpacity: 1,
  onComplete: (direction) => console.log('Fade complete')
}">
  Content
</div>`
		},
		composableCode(): string {
			return `import { useFade } from 'directix'

const { fadeIn, fadeOut, toggle } = useFade({
  duration: 300,
  easing: 'ease-in-out',
  onComplete: (direction) => console.log('Fade', direction)
})

// Control fade animation
fadeIn()   // Fade element in
fadeOut()  // Fade element out
toggle()   // Toggle fade state`
		},
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-fade</h1>
		<p class="intro">
			A directive for fade in/out transition effects. Perfect for showing/hiding content with smooth animations.
		</p>

		<!-- Scenario 1: Basic toggle -->
		<DemoSection title="Basic Toggle" description="Toggle visibility with fade animation">
			<div class="demo-box">
				<div class="fade-container">
					<div v-fade="isVisible1" class="fade-box">
						<h3>Fade Content</h3>
						<p>This content fades in and out smoothly.</p>
					</div>
				</div>
				<button @click="isVisible1 = !isVisible1" class="btn">
					{{ isVisible1 ? 'Hide' : 'Show' }}
				</button>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Direction -->
		<DemoSection title="Fade Direction" description="Fade in or out only">
			<div class="demo-box">
				<div class="fade-container">
					<div v-if="showFadeIn" v-fade="'in'" class="fade-box">
						<p>Faded in on appear</p>
					</div>
				</div>
				<button @click="showFadeIn = true" class="btn" :disabled="showFadeIn">
					Fade In
				</button>
				<button @click="showFadeIn = false" class="btn btn-secondary">
					Reset
				</button>
			</div>
			<CodeBlock :code="directionCode" />
		</DemoSection>

		<!-- Scenario 3: With options -->
		<DemoSection title="With Options" description="Customize duration and easing">
			<div class="demo-box">
				<div class="fade-container">
					<div
						v-fade="{
							visible: isVisible3,
							duration: 500,
							easing: 'ease-in-out',
							onComplete: (d) => console.log('Fade', d, 'complete')
						}"
						class="fade-box"
					>
						<h3>Slow Fade</h3>
						<p>500ms ease-in-out transition</p>
					</div>
				</div>
				<button @click="isVisible3 = !isVisible3" class="btn">
					{{ isVisible3 ? 'Hide' : 'Show' }}
				</button>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Scenario 4: Different durations -->
		<DemoSection title="Different Durations" description="Compare fade speeds">
			<div class="demo-box">
				<div class="duration-grid">
					<div>
						<span class="label">Fast (100ms)</span>
						<div v-fade="{ visible: isVisible4, duration: 100 }" class="fade-box small">
							Fast
						</div>
					</div>
					<div>
						<span class="label">Normal (300ms)</span>
						<div v-fade="{ visible: isVisible4, duration: 300 }" class="fade-box small">
							Normal
						</div>
					</div>
					<div>
						<span class="label">Slow (600ms)</span>
						<div v-fade="{ visible: isVisible4, duration: 600 }" class="fade-box small">
							Slow
						</div>
					</div>
				</div>
				<button @click="isVisible4 = !isVisible4" class="btn">
					Toggle All
				</button>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useFade" description="Using useFade composable">
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
						<td>visible</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Visibility state</td>
					</tr>
					<tr>
						<td>direction</td>
						<td>String</td>
						<td>'toggle'</td>
						<td>'in', 'out', or 'toggle'</td>
					</tr>
					<tr>
						<td>duration</td>
						<td>Number</td>
						<td>300</td>
						<td>Animation duration in ms</td>
					</tr>
					<tr>
						<td>easing</td>
						<td>String</td>
						<td>'ease'</td>
						<td>CSS easing function</td>
					</tr>
					<tr>
						<td>minOpacity</td>
						<td>Number</td>
						<td>0</td>
						<td>Minimum opacity</td>
					</tr>
					<tr>
						<td>maxOpacity</td>
						<td>Number</td>
						<td>1</td>
						<td>Maximum opacity</td>
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

.fade-container {
	min-height: 120px;
	margin-bottom: 16px;
}

.fade-box {
	padding: 30px;
	background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
	border-radius: 8px;
	color: white;
	text-align: center;
}

.fade-box h3 {
	margin: 0 0 8px 0;
}

.fade-box p {
	margin: 0;
	opacity: 0.9;
}

.fade-box.small {
	padding: 20px;
	font-weight: bold;
}

.btn {
	padding: 12px 24px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	margin-right: 8px;
}

.btn:hover {
	background: #3aa876;
}

.btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-secondary {
	background: #6b7280;
}

.duration-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
	margin-bottom: 16px;
}

.duration-grid .label {
	display: block;
	font-size: 12px;
	color: #666;
	margin-bottom: 8px;
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
