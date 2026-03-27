<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentPath = ref(router.currentRoute)

const demos = [
	{ path: '/click-outside', name: 'v-click-outside', desc: 'Click outside detection' },
	{ path: '/copy', name: 'v-copy', desc: 'Copy to clipboard' },
	{ path: '/debounce', name: 'v-debounce', desc: 'Debounce directive' },
	{ path: '/throttle', name: 'v-throttle', desc: 'Throttle directive' },
	{ path: '/focus', name: 'v-focus', desc: 'Auto focus' },
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
