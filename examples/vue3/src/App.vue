<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const currentPath = ref(route.path)

interface Demo {
	path: string
	name: string
	desc: string
	version: string
}

interface Category {
	name: string
	icon: string
	expanded: boolean
	demos: Demo[]
}

// Category definitions (expanded will be set based on current route)
const categoryDefinitions: Omit<Category, 'expanded'>[] = [
	{
		name: 'Event',
		icon: '⚡',
		demos: [
			{ path: '/click-outside', name: 'v-click-outside', desc: 'Click outside detection', version: '1.0.0' },
			{ path: '/click-delay', name: 'v-click-delay', desc: 'Prevent repeated clicks', version: '1.3.0' },
			{ path: '/click-wave', name: 'v-click-wave', desc: 'Click wave effect', version: '1.5.0' },
			{ path: '/copy', name: 'v-copy', desc: 'Copy to clipboard', version: '1.0.0' },
			{ path: '/debounce', name: 'v-debounce', desc: 'Debounce events', version: '1.0.0' },
			{ path: '/throttle', name: 'v-throttle', desc: 'Throttle events', version: '1.0.0' },
			{ path: '/focus', name: 'v-focus', desc: 'Auto focus', version: '1.0.0' },
			{ path: '/hotkey', name: 'v-hotkey', desc: 'Keyboard shortcuts', version: '1.3.0' },
			{ path: '/context-menu', name: 'v-context-menu', desc: 'Right-click menu', version: '1.5.0' },
		],
	},
	{
		name: 'Visibility',
		icon: '👁',
		demos: [
			{ path: '/lazy', name: 'v-lazy', desc: 'Lazy loading images', version: '1.1.0' },
			{ path: '/intersect', name: 'v-intersect', desc: 'Intersection observer', version: '1.1.0' },
			{ path: '/visible', name: 'v-visible', desc: 'Visibility control', version: '1.1.0' },
			{ path: '/loading', name: 'v-loading', desc: 'Loading overlay', version: '1.1.0' },
			{ path: '/blur', name: 'v-blur', desc: 'Blur overlay effect', version: '1.5.0' },
			{ path: '/skeleton', name: 'v-skeleton', desc: 'Skeleton loading', version: '1.5.0' },
		],
	},
	{
		name: 'Scroll',
		icon: '📜',
		demos: [
			{ path: '/scroll', name: 'v-scroll', desc: 'Scroll event handler', version: '1.1.0' },
			{ path: '/infinite-scroll', name: 'v-infinite-scroll', desc: 'Infinite scrolling', version: '1.1.0' },
			{ path: '/sticky', name: 'v-sticky', desc: 'Sticky positioning', version: '1.1.0' },
			{ path: '/parallax', name: 'v-parallax', desc: 'Parallax scrolling', version: '1.5.0' },
			{ path: '/progress', name: 'v-progress', desc: 'Progress bar', version: '1.5.0' },
		],
	},
	{
		name: 'Interaction',
		icon: '👆',
		demos: [
			{ path: '/long-press', name: 'v-long-press', desc: 'Long press detection', version: '1.1.0' },
			{ path: '/hover', name: 'v-hover', desc: 'Hover state tracking', version: '1.1.0' },
			{ path: '/ripple', name: 'v-ripple', desc: 'Material ripple effect', version: '1.1.0' },
		],
	},
	{
		name: 'Format',
		icon: '✏️',
		demos: [
			{ path: '/truncate', name: 'v-truncate', desc: 'Text truncation', version: '1.2.0' },
			{ path: '/ellipsis', name: 'v-ellipsis', desc: 'Multi-line ellipsis', version: '1.3.0' },
			{ path: '/uppercase', name: 'v-uppercase', desc: 'Uppercase transform', version: '1.2.0' },
			{ path: '/lowercase', name: 'v-lowercase', desc: 'Lowercase transform', version: '1.2.0' },
			{ path: '/capitalcase', name: 'v-capitalcase', desc: 'Title case', version: '1.2.0' },
			{ path: '/number', name: 'v-number', desc: 'Number formatting', version: '1.2.0' },
			{ path: '/money', name: 'v-money', desc: 'Currency formatting', version: '1.2.0' },
			{ path: '/trim', name: 'v-trim', desc: 'Whitespace trimming', version: '1.2.0' },
		],
	},
	{
		name: 'UI',
		icon: '🎨',
		demos: [
			{ path: '/tooltip', name: 'v-tooltip', desc: 'Tooltip directive', version: '1.2.0' },
			{ path: '/draggable', name: 'v-draggable', desc: 'Drag and drop', version: '1.2.0' },
			{ path: '/touch', name: 'v-touch', desc: 'Touch gestures', version: '1.2.0' },
			{ path: '/swipe', name: 'v-swipe', desc: 'Swipe detection', version: '1.3.0' },
			{ path: '/image-preview', name: 'v-image-preview', desc: 'Image preview modal', version: '1.2.0' },
			{ path: '/countdown', name: 'v-countdown', desc: 'Countdown timer', version: '1.3.0' },
			{ path: '/watermark', name: 'v-watermark', desc: 'Watermark overlay', version: '1.3.0' },
			{ path: '/print', name: 'v-print', desc: 'Print element', version: '1.3.0' },
		],
	},
	{
		name: 'Form',
		icon: '📝',
		demos: [{ path: '/mask', name: 'v-mask', desc: 'Input masking', version: '1.1.0' }],
	},
	{
		name: 'Security',
		icon: '🔒',
		demos: [
			{ path: '/permission', name: 'v-permission', desc: 'Permission control', version: '1.1.0' },
			{ path: '/sanitize', name: 'v-sanitize', desc: 'HTML sanitization', version: '1.1.0' },
		],
	},
	{
		name: 'Observer',
		icon: '🔍',
		demos: [
			{ path: '/resize', name: 'v-resize', desc: 'Resize observer', version: '1.1.0' },
			{ path: '/mutation', name: 'v-mutation', desc: 'Mutation observer', version: '1.1.0' },
		],
	},
	{
		name: 'Performance',
		icon: '🚀',
		demos: [
			{ path: '/virtual-list', name: 'v-virtual-list', desc: 'Virtual list rendering', version: '1.3.0' },
		],
	},
	{
		name: 'Mobile',
		icon: '📱',
		demos: [
			{ path: '/pull-refresh', name: 'v-pull-refresh', desc: 'Pull to refresh', version: '1.3.0' },
			{ path: '/pan', name: 'v-pan', desc: 'Pan gesture', version: '1.5.0' },
			{ path: '/pinch', name: 'v-pinch', desc: 'Pinch to zoom', version: '1.5.0' },
			{ path: '/rotate-gesture', name: 'v-rotate-gesture', desc: 'Rotation gesture', version: '1.5.0' },
		],
	},
	{
		name: 'Animation',
		icon: '✨',
		demos: [
			{ path: '/fade', name: 'v-fade', desc: 'Fade in/out', version: '1.5.0' },
			{ path: '/typewriter', name: 'v-typewriter', desc: 'Typewriter effect', version: '1.5.0' },
			{ path: '/counter', name: 'v-counter', desc: 'Number counter', version: '1.5.0' },
			{ path: '/lottie', name: 'v-lottie', desc: 'Lottie animations', version: '1.5.0' },
		],
	},
	{
		name: 'Data',
		icon: '📊',
		demos: [
			{ path: '/export', name: 'v-export', desc: 'Export data', version: '1.5.0' },
			{ path: '/highlight', name: 'v-highlight', desc: 'Highlight keywords', version: '1.5.0' },
		],
	},
	{
		name: 'Media',
		icon: '🎬',
		demos: [
			{ path: '/fullscreen', name: 'v-fullscreen', desc: 'Fullscreen mode', version: '1.5.0' },
		],
	},
	{
		name: 'Input',
		icon: '⌨️',
		demos: [
			{ path: '/emoji', name: 'v-emoji', desc: 'Emoji filter', version: '1.5.0' },
		],
	},
]

// Create reactive categories with expanded state
const categories = reactive<Category[]>(
	categoryDefinitions.map(def => ({
		...def,
		expanded: false,
	}))
)

// Find which category contains the current path
function findCategoryByPath(path: string): string | null {
	for (const def of categoryDefinitions) {
		if (def.demos.some(demo => demo.path === path)) {
			return def.name
		}
	}
	return null
}

// Update expanded state based on current route
function updateExpandedState(path: string) {
	const activeCategoryName = findCategoryByPath(path)
	categories.forEach(category => {
		category.expanded = category.name === activeCategoryName
	})
}

// Watch route changes
watch(
	() => route.path,
	(newPath) => {
		currentPath.value = newPath
		updateExpandedState(newPath)
	}
)

// Initialize on mount
onMounted(() => {
	updateExpandedState(route.path)
})

function toggleCategory(category: Category) {
	category.expanded = !category.expanded
}
</script>

<template>
	<div class="app">
		<header class="header">
			<h1>Directix Examples</h1>
			<p>Vue Directives Library - Demo & Testing</p>
		</header>

		<div class="container">
			<nav class="sidebar">
				<div v-for="category in categories" :key="category.name" class="nav-category">
					<div class="category-header" @click="toggleCategory(category)">
						<span class="category-icon">{{ category.icon }}</span>
						<span class="category-name">{{ category.name }}</span>
						<span class="category-count">({{ category.demos.length }})</span>
						<span class="category-toggle">{{ category.expanded ? '▼' : '▶' }}</span>
					</div>
					<div v-show="category.expanded" class="category-items">
						<router-link
							v-for="demo in category.demos"
							:key="demo.path"
							:to="demo.path"
							class="nav-item"
							:class="{ active: currentPath === demo.path }"
						>
							<span class="nav-name">
								{{ demo.name }}
								<span class="nav-version" :class="'v' + demo.version.replace(/\./g, '-')">{{ demo.version }}</span>
							</span>
							<span class="nav-desc">{{ demo.desc }}</span>
						</router-link>
					</div>
				</div>
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
	font-family:
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		Roboto,
		Oxygen,
		Ubuntu,
		Cantarell,
		sans-serif;
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
	width: 260px;
	flex-shrink: 0;
	max-height: calc(100vh - 150px);
	overflow-y: auto;
}

.nav-category {
	margin-bottom: 8px;
}

.category-header {
	display: flex;
	align-items: center;
	padding: 10px 12px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border-radius: 8px;
	cursor: pointer;
	user-select: none;
	transition: opacity 0.2s;
}

.category-header:hover {
	opacity: 0.9;
}

.category-icon {
	margin-right: 8px;
	font-size: 14px;
}

.category-name {
	flex: 1;
	font-weight: 600;
	font-size: 13px;
}

.category-count {
	font-size: 11px;
	opacity: 0.8;
	margin-right: 8px;
}

.category-toggle {
	font-size: 10px;
	opacity: 0.8;
}

.category-items {
	padding-top: 6px;
}

.nav-item {
	display: block;
	padding: 10px 14px;
	margin-bottom: 4px;
	background: white;
	border-radius: 6px;
	text-decoration: none;
	color: #333;
	transition: all 0.2s;
	border: 2px solid transparent;
	font-size: 13px;
}

.nav-item:hover {
	border-color: #667eea;
}

.nav-item.active {
	background: #667eea;
	color: white;
}

.nav-item.active .nav-version {
	background: rgba(255, 255, 255, 0.25);
	color: #fff;
}

.nav-name {
	display: flex;
	align-items: center;
	gap: 8px;
	font-weight: 600;
	margin-bottom: 2px;
}

.nav-version {
	font-size: 10px;
	font-weight: 500;
	padding: 1px 6px;
	border-radius: 10px;
	background: #e8f5e9;
	color: #2e7d32;
}

/* Version colors */
.nav-version.v1-0-0 {
	background: #e3f2fd;
	color: #1565c0;
}

.nav-version.v1-1-0 {
	background: #fff3e0;
	color: #e65100;
}

.nav-version.v1-2-0 {
	background: #e8f5e9;
	color: #2e7d32;
}

.nav-version.v1-3-0 {
	background: #fce4ec;
	color: #c2185b;
}

.nav-version.v1-4-0 {
	background: #e0f2fe;
	color: #0369a1;
}

.nav-version.v1-5-0 {
	background: #f3e8ff;
	color: #7c3aed;
}

.nav-desc {
	font-size: 11px;
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
