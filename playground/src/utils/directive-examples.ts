// Extended examples for all directives
export const directiveExamples: Record<string, { title: string, description: string, code: string, composableCode?: string }[]> = {
	'click-outside': [
		{
			title: 'Dropdown Menu',
			description: 'Close dropdown when clicking outside',
			code: `<template>
  <div class="dropdown-container" v-click-outside="closeDropdown">
    <button @click="isOpen = !isOpen" class="trigger">
      {{ isOpen ? 'Close' : 'Open' }} Menu
    </button>
    <div v-if="isOpen" class="dropdown">
      <a href="#" @click.prevent="selectItem('profile')">Profile</a>
      <a href="#" @click.prevent="selectItem('settings')">Settings</a>
      <a href="#" @click.prevent="selectItem('logout')">Logout</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

function closeDropdown() {
  isOpen.value = false
}

function selectItem(item) {
  console.log('Selected:', item)
  closeDropdown()
}
</script>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  min-width: 150px;
}
.dropdown a {
  display: block;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
}
.dropdown a:hover {
  background: #f5f5f5;
}
</style>`,
		},
		{
			title: 'Modal Dialog',
			description: 'Close modal on outside click with exclude',
			code: `<template>
  <div>
    <button @click="showModal = true">Open Modal</button>
    <div v-if="showModal" class="modal-overlay">
      <div v-click-outside="closeModal" class="modal">
        <h2>Modal Title</h2>
        <p>Click outside to close this modal.</p>
        <button @click="showModal = false">Close</button>
      </div>
    </div>
  </div>
</template>`,
		},
	],

	debounce: [
		{
			title: 'Search Input',
			description: 'Debounce search API calls',
			code: `<template>
  <div>
    <input
      v-debounce="{ handler: handleSearch, wait: 500 }"
      placeholder="Search..."
      type="text"
    />
    <div v-if="loading">Searching...</div>
    <ul v-if="results.length">
      <li v-for="result in results" :key="result.id">
        {{ result.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const results = ref([])

async function handleSearch(event) {
  const query = event.target.value
  if (!query) {
    results.value = []
    return
  }

  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  results.value = [
    { id: 1, name: \`Result for "\${query}"\` }
  ]
  loading.value = false
}
</script>`,
		},
		{
			title: 'Form Auto-save',
			description: 'Auto-save form with debounce',
			code: `<template>
  <form>
    <input v-debounce="{ handler: autoSave, wait: 1000 }" v-model="title" />
    <textarea v-debounce="{ handler: autoSave, wait: 1000 }" v-model="content" />
    <span v-if="saving">Saving...</span>
    <span v-if="saved">Saved!</span>
  </form>
</template>`,
		},
	],

	throttle: [
		{
			title: 'Scroll Handler',
			description: 'Throttle scroll event handling',
			code: `<template>
  <div
    v-throttle="{ handler: handleScroll, wait: 100 }"
    @scroll.passive="handleScroll"
    class="scroll-container"
  >
    <div class="content">
      Scroll position: {{ scrollTop }}px
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scrollTop = ref(0)

function handleScroll(event) {
  scrollTop.value = event.target.scrollTop
}
</script>

<style scoped>
.scroll-container {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
}
.content {
  height: 2000px;
  padding: 20px;
}
</style>`,
		},
		{
			title: 'Button Click',
			description: 'Prevent rapid button clicks',
			code: `<template>
  <button v-throttle="{ handler: submit, wait: 2000 }">
    Submit (max once per 2s)
  </button>
</template>

<script setup>
async function submit() {
  console.log('Submitting...')
  // API call here
}
</script>`,
		},
	],

	copy: [
		{
			title: 'Copy Code Block',
			description: 'Copy code with feedback',
			code: `<template>
  <div class="code-block">
    <pre><code>{{ code }}</code></pre>
    <button
      v-copy="{ value: code, onSuccess: () => copied = true }"
      @click="copied = false"
    >
      {{ copied ? 'Copied!' : 'Copy Code' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const code = \`const greeting = 'Hello, World!'
console.log(greeting)\`
const copied = ref(false)
</script>`,
		},
	],

	longpress: [
		{
			title: 'Context Menu Trigger',
			description: 'Show menu on long press',
			code: `<template>
  <div
    v-long-press="{ handler: showMenu, duration: 500 }"
    class="pressable"
    :class="{ pressing: isPressing }"
  >
    Press and hold for menu
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isPressing = ref(false)

function showMenu() {
  alert('Long press detected!')
}
</script>`,
		},
	],

	hover: [
		{
			title: 'Tooltip on Hover',
			description: 'Show tooltip with delay',
			code: `<template>
  <div v-hover="{ handler: handleHover, enterDelay: 200, leaveDelay: 100 }">
    Hover over me
    <div v-if="isHovered" class="tooltip">
      Tooltip content here
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isHovered = ref(false)

function handleHover(hovering) {
  isHovered.value = hovering
}
</script>`,
		},
	],

	hotkey: [
		{
			title: 'Save Shortcut',
			description: 'Ctrl+S to save',
			code: `<template>
  <div v-hotkey="{ handler: save, key: 'ctrl+s', prevent: true }">
    <textarea v-model="content" placeholder="Type something..."></textarea>
    <p>Press Ctrl+S to save</p>
    <span v-if="saved">Saved!</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('')
const saved = ref(false)

function save() {
  localStorage.setItem('content', content.value)
  saved.value = true
  setTimeout(() => saved.value = false, 2000)
}
</script>`,
		},
		{
			title: 'Multiple Shortcuts',
			description: 'Multiple keyboard shortcuts',
			code: `<template>
  <div>
    <div v-hotkey="{ handler: () => action('save'), key: 'ctrl+s' }"></div>
    <div v-hotkey="{ handler: () => action('copy'), key: 'ctrl+c' }"></div>
    <div v-hotkey="{ handler: () => action('undo'), key: 'ctrl+z' }"></div>
    <p>Ctrl+S: Save | Ctrl+C: Copy | Ctrl+Z: Undo</p>
  </div>
</template>

<script setup>
function action(type) {
  console.log('Action:', type)
}
</script>`,
		},
	],

	lazy: [
		{
			title: 'Image Gallery',
			description: 'Lazy load images in gallery',
			code: `<template>
  <div class="gallery">
    <img
      v-for="(src, i) in images"
      :key="i"
      v-lazy="{ src, preload: 100 }"
      :data-src="src"
      alt="Gallery image"
    />
  </div>
</template>

<script setup>
const images = [
  'https://picsum.photos/300/200?random=1',
  'https://picsum.photos/300/200?random=2',
  'https://picsum.photos/300/200?random=3',
]
</script>`,
		},
	],

	ripple: [
		{
			title: 'Material Button',
			description: 'Material design ripple effect',
			code: `<template>
  <button v-ripple="{ color: 'rgba(255,255,255,0.3)', duration: 600 }">
    Click Me
  </button>
</template>

<style scoped>
button {
  position: relative;
  overflow: hidden;
  padding: 12px 24px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>`,
		},
	],

	'infinite-scroll': [
		{
			title: 'Infinite List',
			description: 'Load more items on scroll',
			code: `<template>
  <div
    v-infinite-scroll="loadMore"
    :distance="100"
    class="infinite-list"
  >
    <div v-for="item in items" :key="item.id" class="item">
      {{ item.name }}
    </div>
    <div v-if="loading" class="loading">Loading...</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([])
const page = ref(1)
const loading = ref(false)

async function loadMore() {
  if (loading.value) return
  loading.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))

  const newItems = Array.from({ length: 20 }, (_, i) => ({
    id: items.value.length + i,
    name: \`Item \${items.value.length + i + 1}\`
  }))

  items.value.push(...newItems)
  page.value++
  loading.value = false
}

// Initial load
loadMore()
</script>`,
		},
	],

	tooltip: [
		{
			title: 'Simple Tooltip',
			description: 'Show tooltip on hover',
			code: `<template>
  <button v-tooltip="{ content: 'Click to submit form', placement: 'top' }">
    Submit
  </button>
</template>`,
		},
	],

	draggable: [
		{
			title: 'Draggable Element',
			description: 'Make element draggable',
			code: `<template>
  <div v-draggable="{ axis: 'both' }" class="draggable">
    Drag me around
  </div>
</template>

<style scoped>
.draggable {
  position: absolute;
  padding: 20px;
  background: #42b883;
  color: white;
  cursor: move;
  user-select: none;
}
</style>`,
		},
	],

	watermark: [
		{
			title: 'Document Watermark',
			description: 'Add watermark overlay',
			code: `<template>
  <div v-watermark="{ content: 'Confidential', fontSize: 16, color: 'rgba(0,0,0,0.1)' }">
    <p>Protected content here...</p>
  </div>
</template>`,
		},
	],

	countdown: [
		{
			title: 'Timer Countdown',
			description: 'Countdown timer display',
			code: `<template>
  <div>
    <span v-countdown="{ time: 3600, format: 'mm:ss' }">00:00</span>
    <button @click="startCountdown">Start</button>
  </div>
</template>`,
		},
	],

	counter: [
		{
			title: 'Animated Counter',
			description: 'Animate number counting',
			code: `<template>
  <div>
    <span v-counter="{ value: 10000, duration: 2000, decimals: 0 }">0</span>
  </div>
</template>`,
		},
	],
}

// Helper function to get examples for a directive
export function getDirectiveExamples(name: string) {
	return directiveExamples[name] || []
}
