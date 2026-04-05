<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'SkeletonDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	data() {
		return {
			// 默认 true，进入页面直接显示骨架屏效果
			isLoading1: true,
			isLoading2: true,
			isLoading3: true,
			isProfileLoading: true,
			isArticleLoading: true,
		}
	},
	computed: {
		basicCode(): string {
			return `<!-- Basic skeleton -->
<div v-skeleton="isLoading" class="card">
  <h3>Card Title</h3>
  <p>Card description here...</p>
</div>

<button @click="isLoading = !isLoading">
  {{ isLoading ? 'Show Content' : 'Show Skeleton' }}
</button>`
		},
		animationCode(): string {
			return `<!-- Wave animation (default) -->
<div v-skeleton="{ loading: isLoading, animation: 'wave' }">
  Wave animation
</div>

<!-- Pulse animation -->
<div v-skeleton="{ loading: isLoading, animation: 'pulse' }">
  Pulse animation
</div>

<!-- No animation -->
<div v-skeleton="{ loading: isLoading, animation: 'none' }">
  Static skeleton
</div>`
		},
		customCode(): string {
			return `<div v-skeleton="{
  loading: isLoading,
  animation: 'wave',
  color: '#e0e0e0',
  animationColor: '#f0f0f0',
  radius: 12
}">
  Custom styled content
</div>`
		},
		profileCode(): string {
			return `<!-- Avatar with circle skeleton -->
<div v-skeleton="{
  loading: isLoading,
  width: 64,
  height: 64,
  radius: '50%'
}" class="avatar">
  <img src="avatar.jpg" />
</div>

<!-- Text lines -->
<div v-skeleton="{
  loading: isLoading,
  width: 120,
  height: 16,
  radius: 4
}" class="name">John Doe</div>`
		},
		articleCode(): string {
			return `<!-- Article card skeleton -->
<div v-skeleton="isLoading" class="article-card">
  <h3>Article Title</h3>
  <p>Article content preview...</p>
</div>`
		},
		composableCode(): string {
			return `import { useSkeleton } from 'directix'

const { show, hide } = useSkeleton({
  animation: 'wave',
  color: '#e8e8e8'
})

// Show skeleton
show()

// Hide skeleton
hide()`
		},
	},
})
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
					<div class="animation-item">
						<span class="label">Wave (default)</span>
						<div v-skeleton="{ loading: isLoading2, animation: 'wave' }" class="skeleton-bar">
							Loaded content
						</div>
					</div>
					<div class="animation-item">
						<span class="label">Pulse</span>
						<div v-skeleton="{ loading: isLoading2, animation: 'pulse' }" class="skeleton-bar">
							Loaded content
						</div>
					</div>
					<div class="animation-item">
						<span class="label">None</span>
						<div v-skeleton="{ loading: isLoading2, animation: 'none' }" class="skeleton-bar">
							Loaded content
						</div>
					</div>
				</div>
				<button @click="isLoading2 = !isLoading2" class="btn">
					{{ isLoading2 ? 'Show Content' : 'Show Skeleton' }}
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
					color: '#e0e0e0',
					animationColor: '#f5f5f5',
					radius: 12
				}" class="custom-skeleton">
					<h3>Custom Skeleton</h3>
					<p>This skeleton has custom colors and border radius.</p>
				</div>
				<button @click="isLoading3 = !isLoading3" class="btn">
					{{ isLoading3 ? 'Show Content' : 'Show Skeleton' }}
				</button>
			</div>
			<CodeBlock :code="customCode" />
		</DemoSection>

		<!-- Profile skeleton example -->
		<DemoSection title="Profile Card Example" description="Complete skeleton for profile card">
			<div class="demo-box">
				<div class="profile-card">
					<div class="profile-header">
						<div v-skeleton="{
							loading: isProfileLoading,
							width: 64,
							height: 64,
							radius: '50%',
							animation: 'wave'
						}" class="profile-avatar">
							<img src="https://i.pravatar.cc/64" alt="Avatar" />
						</div>
						<div class="profile-info">
							<div v-skeleton="{
								loading: isProfileLoading,
								width: 120,
								height: 18,
								radius: 4
							}" class="profile-name">
								John Doe
							</div>
							<div v-skeleton="{
								loading: isProfileLoading,
								width: 80,
								height: 14,
								radius: 4
							}" class="profile-role">
								Software Engineer
							</div>
						</div>
					</div>
					<div v-skeleton="{
						loading: isProfileLoading,
						height: 14,
						radius: 4
					}" class="profile-bio">
						Full-stack developer with 5+ years of experience building web applications. Passionate about clean code and user experience.
					</div>
					<div class="profile-stats">
						<div v-skeleton="{
							loading: isProfileLoading,
							width: 60,
							height: 24,
							radius: 4
						}" class="stat">
							<span class="stat-value">128</span>
							<span class="stat-label">Posts</span>
						</div>
						<div v-skeleton="{
							loading: isProfileLoading,
							width: 60,
							height: 24,
							radius: 4
						}" class="stat">
							<span class="stat-value">1.2K</span>
							<span class="stat-label">Followers</span>
						</div>
						<div v-skeleton="{
							loading: isProfileLoading,
							width: 60,
							height: 24,
							radius: 4
						}" class="stat">
							<span class="stat-value">256</span>
							<span class="stat-label">Following</span>
						</div>
					</div>
				</div>
				<button @click="isProfileLoading = !isProfileLoading" class="btn">
					{{ isProfileLoading ? 'Show Content' : 'Show Skeleton' }}
				</button>
			</div>
			<CodeBlock :code="profileCode" />
		</DemoSection>

		<!-- Article List Example -->
		<DemoSection title="Article List Example" description="Multiple skeleton items in a list">
			<div class="demo-box">
				<div class="article-list">
					<div v-for="i in 3" :key="i" v-skeleton="isArticleLoading" class="article-item">
						<div v-skeleton="{
							loading: isArticleLoading,
							width: 80,
							height: 60,
							radius: 8
						}" class="article-thumb">
							<img :src="`https://picsum.photos/80/60?random=${i}`" alt="thumbnail" />
						</div>
						<div class="article-content">
							<div v-skeleton="{
								loading: isArticleLoading,
								width: '80%',
								height: 16,
								radius: 4
							}" class="article-title">
								Article Title {{ i }}
							</div>
							<div v-skeleton="{
								loading: isArticleLoading,
								width: '100%',
								height: 12,
								radius: 4
							}" class="article-desc">
								This is a short description of the article content...
							</div>
							<div class="article-meta">
								<span v-skeleton="{
									loading: isArticleLoading,
									width: 60,
									height: 12,
									radius: 4
								}" class="meta-item">5 min read</span>
								<span v-skeleton="{
									loading: isArticleLoading,
									width: 80,
									height: 12,
									radius: 4
								}" class="meta-item">Jan 15, 2024</span>
							</div>
						</div>
					</div>
				</div>
				<button @click="isArticleLoading = !isArticleLoading" class="btn">
					{{ isArticleLoading ? 'Show Content' : 'Show Skeleton' }}
				</button>
			</div>
			<CodeBlock :code="articleCode" />
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

.animation-item {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.animation-item .label {
	font-size: 12px;
	color: #666;
}

.skeleton-bar {
	background: white;
	padding: 20px;
	border-radius: 6px;
	text-align: center;
	color: #333;
	min-height: 24px;
}

.custom-skeleton {
	background: white;
	padding: 30px;
	border-radius: 12px;
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

/* Profile Card */
.profile-card {
	background: white;
	padding: 20px;
	border-radius: 12px;
	margin-bottom: 16px;
}

.profile-header {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 16px;
}

.profile-avatar {
	width: 64px;
	height: 64px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
}

.profile-avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.profile-info {
	flex: 1;
	min-width: 0;
}

.profile-name {
	font-size: 18px;
	font-weight: 600;
	color: #333;
	margin-bottom: 4px;
	line-height: 18px;
}

.profile-role {
	font-size: 14px;
	color: #666;
	line-height: 14px;
}

.profile-bio {
	font-size: 14px;
	color: #555;
	line-height: 1.6;
	margin-bottom: 16px;
}

.profile-stats {
	display: flex;
	gap: 24px;
	padding-top: 16px;
	border-top: 1px solid #eee;
}

.stat {
	text-align: center;
}

.stat-value {
	display: block;
	font-weight: 600;
	color: #333;
}

.stat-label {
	font-size: 12px;
	color: #666;
}

/* Article List */
.article-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-bottom: 16px;
}

.article-item {
	display: flex;
	gap: 16px;
	background: white;
	padding: 12px;
	border-radius: 8px;
}

.article-thumb {
	width: 80px;
	height: 60px;
	border-radius: 8px;
	overflow: hidden;
	flex-shrink: 0;
}

.article-thumb img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.article-content {
	flex: 1;
	min-width: 0;
}

.article-title {
	font-size: 15px;
	font-weight: 600;
	color: #333;
	margin-bottom: 6px;
	line-height: 16px;
}

.article-desc {
	font-size: 13px;
	color: #666;
	margin-bottom: 8px;
	line-height: 12px;
}

.article-meta {
	display: flex;
	gap: 12px;
}

.meta-item {
	font-size: 12px;
	color: #999;
}

.btn {
	padding: 12px 24px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	transition: background 0.2s;
}

.btn:hover {
	background: #3aa876;
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
