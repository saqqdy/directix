<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useSkeleton } from 'directix'

// Scenario 1: Basic skeleton
const isLoading1 = ref(true)

// Scenario 2: Different animations
const isLoading2 = ref(true)

// Scenario 3: Custom style
const isLoading3 = ref(true)

// Composable API demo
const composableLoading = ref(true)
const { show, hide } = useSkeleton({
	animation: 'wave',
	color: '#e8e8e8'
})

const basicCode = `<!-- Basic skeleton -->
<div v-skeleton="isLoading">
  Content here
</div>

<button @click="isLoading = !isLoading">
  Toggle Loading
</button>`

const animationCode = `<!-- Wave animation (default) -->
<div v-skeleton="{ loading: isLoading, animation: 'wave' }">
  Wave
</div>

<!-- Pulse animation -->
<div v-skeleton="{ loading: isLoading, animation: 'pulse' }">
  Pulse
</div>

<!-- No animation -->
<div v-skeleton="{ loading: isLoading, animation: 'none' }">
  Static
</div>`

const customCode = `<div v-skeleton="{
  loading: isLoading,
  width: 200,
  height: 20,
  radius: 4,
  color: '#f0f0f0',
  animationColor: '#f8f8f8'
}">
  Custom styled skeleton
</div>`

const composableCode = `import { useSkeleton } from 'directix'

const { show, hide } = useSkeleton({
  animation: 'wave',
  color: '#e8e8e8'
})

// Show skeleton
show()

// Hide skeleton
hide()`
</script>

<template>
	<div class="demo-page">
		<h1>v-skeleton</h1>
		<p class="intro">
			A directive for showing skeleton loading states. Perfect for content placeholders while data is being fetched.
		</p>

		<!-- Scenario 1: Basic skeleton -->
		<DemoSection title="Basic Usage" description="Toggle skeleton loading state">
			<div class="demo-box">
				<div class="skeleton-grid">
					<div v-skeleton="isLoading1" class="skeleton-item">
						<h3>Card Title</h3>
						<p>Card description goes here. This is placeholder content.</p>
					</div>
					<div v-skeleton="isLoading1" class="skeleton-item">
						<h3>Another Card</h3>
						<p>More placeholder content for demonstration.</p>
					</div>
				</div>
				<button @click="isLoading1 = !isLoading1" class="btn">
					{{ isLoading1 ? 'Show Content' : 'Show Skeleton' }}
				</button>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Different animations -->
		<DemoSection title="Animation Types" description="Wave, pulse, or no animation">
			<div class="demo-box">
				<div class="animation-grid">
					<div>
						<span class="label">Wave (default)</span>
						<div v-skeleton="{ loading: isLoading2, animation: 'wave' }" class="skeleton-bar">
							Loaded content
						</div>
					</div>
					<div>
						<span class="label">Pulse</span>
						<div v-skeleton="{ loading: isLoading2, animation: 'pulse' }" class="skeleton-bar">
							Loaded content
						</div>
					</div>
					<div>
						<span class="label">None</span>
						<div v-skeleton="{ loading: isLoading2, animation: 'none' }" class="skeleton-bar">
							Loaded content
						</div>
					</div>
				</div>
				<button @click="isLoading2 = !isLoading2" class="btn">
					Toggle All
				</button>
			</div>
			<CodeBlock :code="animationCode" />
		</DemoSection>

		<!-- Scenario 3: Custom style -->
		<DemoSection title="Custom Style" description="Customize skeleton appearance">
			<div class="demo-box">
				<div v-skeleton="{
					loading: isLoading3,
					animation: 'wave',
					color: '#e8e8e8',
					animationColor: '#f5f5f5',
					radius: 8
				}" class="custom-skeleton">
					<h3>Custom Skeleton</h3>
					<p>This skeleton has custom colors and border radius.</p>
				</div>
				<button @click="isLoading3 = !isLoading3" class="btn">
					Toggle
				</button>
			</div>
			<CodeBlock :code="customCode" />
		</DemoSection>

		<!-- Profile skeleton example -->
		<DemoSection title="Profile Card Example" description="Complete skeleton for profile card">
			<div class="demo-box">
				<div class="profile-card">
					<div v-skeleton="{ loading: isLoading1, width: 80, height: 80, radius: '50%' }" class="profile-avatar">
						<img src="https://i.pravatar.cc/80" alt="Avatar" />
					</div>
					<div class="profile-info">
						<div v-skeleton="{ loading: isLoading1, width: 150, height: 20 }" class="profile-name">
							John Doe
						</div>
						<div v-skeleton="{ loading: isLoading1, width: 100, height: 14 }" class="profile-role">
							Software Engineer
						</div>
					</div>
					<div v-skeleton="isLoading1" class="profile-bio">
						<p>Full-stack developer with 5+ years of experience building web applications.</p>
					</div>
				</div>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useSkeleton" description="Using useSkeleton composable">
			<div class="demo-box">
				<div class="button-group">
					<button @click="show()" class="btn">Show Skeleton</button>
					<button @click="hide()" class="btn btn-secondary">Hide Skeleton</button>
				</div>
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
						<td>loading</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Show skeleton state</td>
					</tr>
					<tr>
						<td>animation</td>
						<td>String</td>
						<td>'wave'</td>
						<td>'wave', 'pulse', 'none'</td>
					</tr>
					<tr>
						<td>width</td>
						<td>String | Number</td>
						<td>'100%'</td>
						<td>Skeleton width</td>
					</tr>
					<tr>
						<td>height</td>
						<td>String | Number</td>
						<td>'1em'</td>
						<td>Skeleton height</td>
					</tr>
					<tr>
						<td>radius</td>
						<td>String | Number</td>
						<td>'4px'</td>
						<td>Border radius</td>
					</tr>
					<tr>
						<td>color</td>
						<td>String</td>
						<td>'#e8e8e8'</td>
						<td>Base color</td>
					</tr>
					<tr>
						<td>animationColor</td>
						<td>String</td>
						<td>'#f0f0f0'</td>
						<td>Animation highlight color</td>
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

.skeleton-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-bottom: 16px;
}

.skeleton-item {
	background: white;
	padding: 20px;
	border-radius: 8px;
	min-height: 100px;
}

.skeleton-item h3 {
	margin: 0 0 8px 0;
	font-size: 16px;
	color: #333;
}

.skeleton-item p {
	margin: 0;
	font-size: 14px;
	color: #666;
	line-height: 1.5;
}

.animation-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
	margin-bottom: 16px;
}

.animation-grid .label {
	display: block;
	font-size: 12px;
	color: #666;
	margin-bottom: 8px;
}

.skeleton-bar {
	background: white;
	padding: 20px;
	border-radius: 6px;
	text-align: center;
	color: #333;
}

.custom-skeleton {
	background: white;
	padding: 30px;
	border-radius: 8px;
	text-align: center;
	min-height: 80px;
}

.custom-skeleton h3 {
	margin: 0 0 8px 0;
}

.custom-skeleton p {
	margin: 0;
	color: #666;
}

.profile-card {
	background: white;
	padding: 24px;
	border-radius: 12px;
	text-align: center;
	margin-bottom: 16px;
}

.profile-avatar {
	width: 80px;
	height: 80px;
	margin: 0 auto 16px;
	border-radius: 50%;
	overflow: hidden;
}

.profile-avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.profile-info {
	margin-bottom: 16px;
}

.profile-name {
	font-size: 18px;
	font-weight: 600;
	color: #333;
	margin-bottom: 4px;
}

.profile-role {
	font-size: 14px;
	color: #666;
}

.profile-bio {
	font-size: 14px;
	color: #666;
	line-height: 1.6;
}

.btn {
	padding: 12px 24px;
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

.btn-secondary {
	background: #6b7280;
}

.button-group {
	display: flex;
	gap: 12px;
	justify-content: center;
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
