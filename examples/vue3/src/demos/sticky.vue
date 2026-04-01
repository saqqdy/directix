<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useSticky } from 'directix'

// Composable API demo
const composableStickyRef = ref<HTMLElement | null>(null)
const composableIsSticky = ref(false)
const { isSticky, bind } = useSticky({
	offsetTop: 0,
	onStick: (sticky) => {
		composableIsSticky.value = sticky
	}
})

onMounted(() => {
	if (composableStickyRef.value) {
		bind(composableStickyRef.value)
	}
})

const composableCode = `import { ref, onMounted } from 'vue'
import { useSticky } from 'directix'

const headerRef = ref(null)
const { isSticky, bind } = useSticky({
	offsetTop: 60,
	onStick: (sticky) => console.log('Sticky:', sticky)
})

onMounted(() => {
	if (headerRef.value) {
		bind(headerRef.value)
	}
})`

// Scenario 3: With callback
const isStickyDirective = ref(false)
const handleStickyChange = (sticky: boolean) => {
	isStickyDirective.value = sticky
}

const basicCode = `<nav v-sticky class="sticky-nav">
  Navigation Content
</nav>`

const offsetCode = `<div v-sticky="50">
  Sticks 50px from top
</div>`

const callbackCode = `<div v-sticky="{ top: 0, onChange: handleStickyChange }">
  {{ isSticky ? 'Sticky!' : 'Normal' }}
</div>`
</script>

<template>
	<div class="demo-page">
		<h1>v-sticky</h1>
		<p class="intro">
			A directive for creating sticky positioned elements that stay fixed when scrolling. Pure JavaScript implementation without CSS position:sticky.
		</p>

		<!-- Scenario 1: Basic sticky -->
		<DemoSection title="Basic Usage" description="Element sticks to top when scrolled">
			<div class="demo-box">
				<div class="scroll-container">
					<div class="scroll-spacer">Scroll down to see sticky behavior</div>
					<nav v-sticky class="sticky-nav">
						<span class="nav-item">Home</span>
						<span class="nav-item">About</span>
						<span class="nav-item">Contact</span>
					</nav>
					<div class="scroll-content">
						<p v-for="i in 10" :key="i">Content line {{ i }}</p>
					</div>
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With offset -->
		<DemoSection title="With Top Offset" description="Stick with distance from top">
			<div class="demo-box">
				<div class="scroll-container">
					<div class="scroll-spacer">Scroll down</div>
					<div v-sticky="30" class="sticky-box with-offset">
						Sticky with 30px offset from top
					</div>
					<div class="scroll-content">
						<p v-for="i in 10" :key="i">Content line {{ i }}</p>
					</div>
				</div>
			</div>
			<CodeBlock :code="offsetCode" />
		</DemoSection>

		<!-- Scenario 3: With callback -->
		<DemoSection title="With Change Callback" description="Track sticky state changes">
			<div class="demo-box">
				<div class="status-badge" :class="{ active: isStickyDirective }">
					{{ isStickyDirective ? 'Currently Sticky' : 'Normal Position' }}
				</div>
				<div class="scroll-container">
					<div class="scroll-spacer">Scroll to trigger sticky</div>
					<div
						v-sticky="{ top: 0, onChange: handleStickyChange }"
						class="sticky-box tracked"
					>
						Sticky Element with Callback
					</div>
					<div class="scroll-content">
						<p v-for="i in 10" :key="i">Content line {{ i }}</p>
					</div>
				</div>
			</div>
			<CodeBlock :code="callbackCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API (useSticky)" description="Use useSticky for programmatic sticky control">
			<div class="demo-box">
				<div class="status-badge" :class="{ active: composableIsSticky }">
					{{ composableIsSticky ? 'Currently Sticky' : 'Normal Position' }}
				</div>
				<div class="scroll-container">
					<div class="scroll-spacer">Scroll to see composable sticky</div>
					<div
						ref="composableStickyRef"
						class="sticky-box composable"
						:class="{ 'is-sticky': composableIsSticky }"
					>
						useSticky Composable
					</div>
					<div class="scroll-content">
						<p v-for="i in 10" :key="i">Content line {{ i }}</p>
					</div>
				</div>
				<p class="hint">Using useSticky composable for manual binding and state tracking</p>
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
						<td>top</td>
						<td>Number/String</td>
						<td>0</td>
						<td>Top offset when sticky</td>
					</tr>
					<tr>
						<td>bottom</td>
						<td>Number/String</td>
						<td>-</td>
						<td>Bottom offset when sticky</td>
					</tr>
					<tr>
						<td>zIndex</td>
						<td>Number</td>
						<td>100</td>
						<td>Z-index when sticky</td>
					</tr>
					<tr>
						<td>stickyClass</td>
						<td>String</td>
						<td>'v-sticky--fixed'</td>
						<td>CSS class when sticky</td>
					</tr>
					<tr>
						<td>onChange</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when sticky state changes</td>
					</tr>
					<tr>
						<td>container</td>
						<td>String/Element</td>
						<td>-</td>
						<td>Custom scroll container</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Disable sticky behavior</td>
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

.scroll-container {
	height: 300px;
	overflow-y: auto;
	background: white;
	border-radius: 8px;
	border: 2px solid #e0e0e0;
	position: relative;
}

.scroll-spacer {
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #888;
	font-size: 14px;
	background: #f8f9fa;
}

.scroll-content {
	padding: 20px;
}

.scroll-content p {
	padding: 12px;
	margin: 4px 0;
	background: #f8f9fa;
	border-radius: 4px;
}

.sticky-nav {
	display: flex;
	gap: 20px;
	padding: 16px 20px;
	background: linear-gradient(135deg, #667eea, #764ba2);
	color: white;
	font-weight: 500;
}

.nav-item {
	cursor: pointer;
	opacity: 0.9;
}

.nav-item:hover {
	opacity: 1;
}

.sticky-box {
	padding: 16px 20px;
	background: #48bb78;
	color: white;
	font-weight: 600;
	text-align: center;
}

.sticky-box.with-offset {
	background: linear-gradient(135deg, #ed8936, #dd6b20);
}

.sticky-box.tracked {
	background: linear-gradient(135deg, #667eea, #764ba2);
}

.sticky-box.composable {
	background: linear-gradient(135deg, #38b2ac, #319795);
}

.sticky-box.is-sticky {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.status-badge {
	display: inline-block;
	padding: 8px 16px;
	margin-bottom: 12px;
	border-radius: 20px;
	font-size: 13px;
	font-weight: 500;
	background: #e0e0e0;
	color: #666;
	transition: all 0.3s;
}

.status-badge.active {
	background: #48bb78;
	color: white;
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
