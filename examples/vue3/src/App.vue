<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentPath = ref(router.currentRoute)

const demos = [
	// Event directives
	{ path: '/click-outside', name: 'v-click-outside', desc: 'Click outside detection' },
	{ path: '/copy', name: 'v-copy', desc: 'Copy to clipboard' },
	{ path: '/debounce', name: 'v-debounce', desc: 'Debounce directive' },
	{ path: '/throttle', name: 'v-throttle', desc: 'Throttle directive' },
	{ path: '/focus', name: 'v-focus', desc: 'Auto focus' },
	// Visibility directives
	{ path: '/lazy', name: 'v-lazy', desc: 'Lazy loading images' },
	{ path: '/intersect', name: 'v-intersect', desc: 'Intersection observer' },
	{ path: '/visible', name: 'v-visible', desc: 'Visibility control' },
	{ path: '/loading', name: 'v-loading', desc: 'Loading overlay' },
	// Scroll directives
	{ path: '/scroll', name: 'v-scroll', desc: 'Scroll event handler' },
	{ path: '/infinite-scroll', name: 'v-infinite-scroll', desc: 'Infinite scrolling' },
	{ path: '/sticky', name: 'v-sticky', desc: 'Sticky positioning' },
	// Event interaction directives
	{ path: '/long-press', name: 'v-long-press', desc: 'Long press detection' },
	{ path: '/hover', name: 'v-hover', desc: 'Hover state tracking' },
	{ path: '/ripple', name: 'v-ripple', desc: 'Material ripple effect' },
	// Form directives
	{ path: '/mask', name: 'v-mask', desc: 'Input masking' },
	// Security directives
	{ path: '/permission', name: 'v-permission', desc: 'Permission control' },
	{ path: '/sanitize', name: 'v-sanitize', desc: 'HTML sanitization' },
	// Observer directives
	{ path: '/resize', name: 'v-resize', desc: 'Resize observer' },
	{ path: '/mutation', name: 'v-mutation', desc: 'Mutation observer' },
	// Format directives
	{ path: '/truncate', name: 'v-truncate', desc: 'Text truncation' },
	{ path: '/uppercase', name: 'v-uppercase', desc: 'Uppercase transform' },
	{ path: '/lowercase', name: 'v-lowercase', desc: 'Lowercase transform' },
	{ path: '/capitalcase', name: 'v-capitalcase', desc: 'Title case' },
	{ path: '/number', name: 'v-number', desc: 'Number formatting' },
	{ path: '/money', name: 'v-money', desc: 'Currency formatting' },
	{ path: '/trim', name: 'v-trim', desc: 'Whitespace trimming' },
	// UI directives
	{ path: '/tooltip', name: 'v-tooltip', desc: 'Tooltip directive' },
	{ path: '/draggable', name: 'v-draggable', desc: 'Drag and drop' },
	{ path: '/touch', name: 'v-touch', desc: 'Touch gestures' },
	{ path: '/image-preview', name: 'v-image-preview', desc: 'Image preview modal' },
]
</script>

<template>
	<div class="app">
		<header class="header">
			<h1>Directix Examples</h1>
			<p>Vue Directives Library - Demo & Testing</p>
		</header>

		<div class="container">
			<nav class="sidebar">
				<router-link
					v-for="demo in demos"
					:key="demo.path"
					:to="demo.path"
					class="nav-item"
					:class="{ active: currentPath.path === demo.path }"
				>
					<span class="nav-name">{{ demo.name }}</span>
					<span class="nav-desc">{{ demo.desc }}</span>
				</router-link>
			</nav>

			<main class="content">
				<router-view />
			</main>
		</div>
	</div>
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
		Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	background: #f5f7fa;
	color: #333;
}

.app {
	min-height: 100vh;
}

.header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	padding: 30px;
	text-align: center;
}

.header h1 {
	font-size: 2rem;
	margin-bottom: 8px;
}

.header p {
	opacity: 0.9;
}

.container {
	display: flex;
	max-width: 1400px;
	margin: 0 auto;
	padding: 20px;
	gap: 20px;
}

.sidebar {
	width: 220px;
	flex-shrink: 0;
	max-height: calc(100vh - 150px);
	overflow-y: auto;
}

.nav-item {
	display: block;
	padding: 12px 16px;
	margin-bottom: 8px;
	background: white;
	border-radius: 8px;
	text-decoration: none;
	color: #333;
	transition: all 0.2s;
	border: 2px solid transparent;
}

.nav-item:hover {
	border-color: #667eea;
}

.nav-item.active {
	background: #667eea;
	color: white;
}

.nav-name {
	display: block;
	font-weight: 600;
	margin-bottom: 4px;
}

.nav-desc {
	font-size: 12px;
	opacity: 0.7;
}

.content {
	flex: 1;
	background: white;
	border-radius: 12px;
	padding: 24px;
	min-height: 600px;
}
</style>
