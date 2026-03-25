<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'App',
	data() {
		return {
			demos: [
				{ path: '/click-outside', name: 'v-click-outside', desc: '点击外部检测' },
				{ path: '/copy', name: 'v-copy', desc: '复制到剪贴板' },
				{ path: '/debounce', name: 'v-debounce', desc: '防抖指令' },
				{ path: '/throttle', name: 'v-throttle', desc: '节流指令' },
				{ path: '/focus', name: 'v-focus', desc: '自动聚焦' },
			],
		}
	},
})
</script>

<template>
	<div class="app">
		<header class="header">
			<h1>Directix Examples (Vue 2)</h1>
			<p>Vue Directives Library - Demo & Testing</p>
		</header>

		<div class="container">
			<nav class="sidebar">
				<router-link
					v-for="demo in demos"
					:key="demo.path"
					:to="demo.path"
					class="nav-item"
					active-class="active"
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
	background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
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
	border-color: #42b883;
}

.nav-item.active {
	background: #42b883;
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
