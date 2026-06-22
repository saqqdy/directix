<script setup lang="ts">
const activeTab = ref('click-outside')
const showDropdown = ref(false)
const copyText = ref('Hello from Directix!')
const { copy, copied } = useCopy({ source: copyText })
const { isHovering } = useHover({ onEnter: () => console.log('Hover entered!') })

// v2.4.0: Use Directix VS Code extension for IntelliSense, diagnostics & snippets
// v2.4.0: Use Directix Browser DevTools for directive inspection & perf analysis
// The Nuxt module auto-imports all composables and auto-registers directives

// Demo data
interface Demo {
	id: string
	name: string
	description: string
	code: string
}

const demos: Demo[] = [
	{
		id: 'click-outside',
		name: 'v-click-outside',
		description: 'Click outside to close dropdown',
		code: `<div v-click-outside="handleClose">
  <button @click="show = !show">Toggle</button>
  <div v-show="show">Dropdown Content</div>
</div>`,
	},
	{
		id: 'copy',
		name: 'v-copy',
		description: 'Click to copy text',
		code: `<button v-copy="text">Copy</button>
<!-- Or with composable -->
const { copy, copied } = useCopy({ source: text })`,
	},
	{
		id: 'debounce',
		name: 'v-debounce',
		description: 'Debounce input events',
		code: `<input v-debounce:500="handleChange" />`,
	},
	{
		id: 'hover',
		name: 'v-hover',
		description: 'Track hover state',
		code: `<div v-hover="handleHover">Hover me</div>
<!-- Or with composable -->
const { isHovering } = useHover()`,
	},
	{
		id: 'i18n',
		name: 'i18n',
		description: '8 languages with auto-detection',
		code: `import { LocaleDetector, LocaleLoader } from 'directix'
// Auto-detect user language
const locale = LocaleDetector.detect()
// Dynamic loading
const messages = await LocaleLoader.load('ko-KR')`,
	},
]

function handleDropdownClose() {
	showDropdown.value = false
}

const handleClick = useDebounceFn((e: Event) => {
	console.log('Debounced click:', e)
}, 300)

// i18n demo - uses auto-imported composables from Directix Nuxt module
const detectedLocale = ref('zh-CN')
const i18nSampleMessage = ref('')
const i18nLanguages = [
	{ code: 'zh-CN', name: '中文', flag: '🇨🇳' },
	{ code: 'en-US', name: 'English', flag: '🇺🇸' },
	{ code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
	{ code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
	{ code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
	{ code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
	{ code: 'es-ES', name: 'Español', flag: '🇪🇸' },
	{ code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
]

async function switchI18nLocale(code: string) {
	detectedLocale.value = code
	try {
		const { LocaleLoader } = await import('directix/i18n')
		const messages = await LocaleLoader.load(code as any)
		i18nSampleMessage.value = messages.directives.debounce?.description || 'No sample available'
	} catch {
		i18nSampleMessage.value = 'Failed to load locale'
	}
}

onMounted(async () => {
	const { LocaleDetector } = await import('directix/i18n')
	detectedLocale.value = LocaleDetector.detect()
	switchI18nLocale(detectedLocale.value)
})
</script>

<template>
	<div class="min-h-screen bg-gray-100">
		<header class="bg-gradient-to-r from-green-500 to-teal-500 text-white py-8 px-4">
			<div class="max-w-4xl mx-auto">
				<h1 class="text-3xl font-bold mb-2">
					Directix + Nuxt 3
				</h1>
				<p class="text-green-100">
					Official Nuxt 3 module for Directix directives
				</p>
			</div>
		</header>

		<main class="max-w-4xl mx-auto py-8 px-4">
			<!-- Features Section -->
			<section class="mb-8">
				<h2 class="text-xl font-semibold mb-4 text-gray-800">
					Features
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="bg-white rounded-lg p-4 shadow-sm">
						<h3 class="font-medium text-green-600 mb-2">
							Auto-import Composables
						</h3>
						<p class="text-gray-600 text-sm">
							All composables are automatically imported. No need to import manually.
						</p>
					</div>
					<div class="bg-white rounded-lg p-4 shadow-sm">
						<h3 class="font-medium text-green-600 mb-2">
							Directive Auto-registration
						</h3>
						<p class="text-gray-600 text-sm">
							Directives are automatically registered. Use them directly in templates.
						</p>
					</div>
					<div class="bg-white rounded-lg p-4 shadow-sm">
						<h3 class="font-medium text-green-600 mb-2">
							SSR Compatible
						</h3>
						<p class="text-gray-600 text-sm">
							Proper handling of client-side only directives for SSR.
						</p>
					</div>
					<div class="bg-white rounded-lg p-4 shadow-sm">
						<h3 class="font-medium text-green-600 mb-2">
							Selective Inclusion
						</h3>
						<p class="text-gray-600 text-sm">
							Include or exclude specific directives via configuration.
						</p>
					</div>
				</div>
			</section>

			<!-- Demo Tabs -->
			<section class="mb-8">
				<h2 class="text-xl font-semibold mb-4 text-gray-800">
					Live Demo
				</h2>
				<div class="bg-white rounded-lg shadow-sm overflow-hidden">
					<div class="flex border-b">
						<button
							v-for="demo in demos"
							:key="demo.id"
							class="px-4 py-2 text-sm font-medium transition-colors"
							:class="activeTab === demo.id
								? 'text-green-600 border-b-2 border-green-500'
								: 'text-gray-500 hover:text-gray-700'"
							@click="activeTab = demo.id"
						>
							{{ demo.name }}
						</button>
					</div>

					<div class="p-6">
						<!-- Click Outside Demo -->
						<div v-if="activeTab === 'click-outside'" v-click-outside="handleDropdownClose" class="relative inline-block">
							<button
								class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
								@click="showDropdown = !showDropdown"
							>
								Toggle Dropdown
								<span class="ml-2">{{ showDropdown ? '▲' : '▼' }}</span>
							</button>
							<div
								v-show="showDropdown"
								class="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg py-2 min-w-[150px] z-10"
							>
								<a href="#" class="block px-4 py-2 hover:bg-gray-100">Option 1</a>
								<a href="#" class="block px-4 py-2 hover:bg-gray-100">Option 2</a>
								<a href="#" class="block px-4 py-2 hover:bg-gray-100">Option 3</a>
							</div>
						</div>

						<!-- Copy Demo -->
						<div v-else-if="activeTab === 'copy'" class="space-y-4">
							<div class="flex gap-2 items-center">
								<input
									v-model="copyText"
									class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
								>
								<button
									v-copy="copyText"
									class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
								>
									Directive Copy
								</button>
							</div>
							<div class="flex gap-2 items-center">
								<button
									class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
									@click="copy()"
								>
									{{ copied ? '✓ Copied!' : 'Composable Copy' }}
								</button>
								<span class="text-sm text-gray-500">Using useCopy composable (auto-imported)</span>
							</div>
						</div>

						<!-- Debounce Demo -->
						<div v-else-if="activeTab === 'debounce'" class="space-y-4">
							<input
								v-debounce:500="handleClick"
								type="text"
								placeholder="Type to test debounce (500ms)"
								class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
							>
							<p class="text-sm text-gray-500">
								Input events are debounced by 500ms. Check console for logs.
							</p>
						</div>

						<!-- Hover Demo -->
						<div v-else-if="activeTab === 'hover'" class="space-y-4">
							<div
								v-hover="{ onEnter: () => console.log('Directive: hover entered'), onLeave: () => console.log('Directive: hover left') }"
								class="inline-block px-6 py-4 bg-gray-100 rounded-lg transition-colors cursor-pointer"
								:class="{ 'bg-green-100': isHovering }"
							>
								Hover over me (check console for directive logs)
							</div>
							<div
								class="inline-block px-6 py-4 bg-teal-100 rounded-lg ml-4"
								:class="{ 'ring-2 ring-teal-500': isHovering }"
							>
								useHover state: {{ isHovering ? 'Hovering' : 'Not hovering' }}
							</div>
						</div>

						<!-- i18n Demo -->
						<div v-else-if="activeTab === 'i18n'" class="space-y-4">
							<p class="text-gray-600">
								Directix supports 8 languages with auto-detection and dynamic loading.
							</p>
							<div class="grid grid-cols-4 gap-2">
								<div v-for="lang in i18nLanguages" :key="lang.code" class="bg-gray-50 px-3 py-2 rounded text-center cursor-pointer hover:bg-green-50 transition-colors" :class="{ 'bg-green-100 ring-1 ring-green-400': detectedLocale === lang.code }" @click="switchI18nLocale(lang.code)">
									<div class="text-lg">{{ lang.flag }}</div>
									<div class="text-xs text-gray-600">{{ lang.name }}</div>
								</div>
							</div>
							<div v-if="i18nSampleMessage" class="bg-gray-50 rounded p-3 text-sm">
								<strong>Detect:</strong> {{ detectedLocale }}<br>
								<strong>Sample:</strong> {{ i18nSampleMessage }}
							</div>
						</div>

						<!-- Code Display -->
						<div class="mt-6 bg-gray-900 rounded-lg p-4 overflow-x-auto">
							<pre class="text-sm text-gray-300"><code>{{ demos.find(d => d.id === activeTab)?.code }}</code></pre>
						</div>
					</div>
				</div>
			</section>

			<!-- Configuration Section -->
			<section class="mb-8">
				<h2 class="text-xl font-semibold mb-4 text-gray-800">
					Configuration
				</h2>
				<div class="bg-white rounded-lg shadow-sm p-6">
					<p class="text-gray-600 mb-4">
						Configure Directix in your <code class="bg-gray-100 px-2 py-1 rounded">nuxt.config.ts</code>:
					</p>
					<div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
						<pre class="text-sm text-gray-300"><code>export default defineNuxtConfig({
  modules: ['directix/nuxt'],

  directix: {
    enabled: true,
    autoImportComposables: true,

    // Only include specific directives
    include: ['v-click-outside', 'v-copy', 'v-debounce'],

    // Or exclude specific directives
    exclude: ['v-ripple'],

    // Default options for directives
    directiveOptions: {
      'v-permission': {
        config: {
          getPermissions: () => ['read', 'write']
        }
      }
    }
  }
})</code></pre>
					</div>
				</div>
			</section>

			<!-- Auto-imported Composables -->
			<section>
				<h2 class="text-xl font-semibold mb-4 text-gray-800">
					Auto-imported Composables
				</h2>
				<div class="bg-white rounded-lg shadow-sm p-6">
					<p class="text-gray-600 mb-4">
						All composables are auto-imported. Here are some commonly used ones:
					</p>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
						<div class="bg-gray-50 px-3 py-2 rounded">useCopy</div>
						<div class="bg-gray-50 px-3 py-2 rounded">useDebounce</div>
						<div class="bg-gray-50 px-3 py-2 rounded">useThrottle</div>
						<div class="bg-gray-50 px-3 py-2 rounded">useHover</div>
						<div class="bg-gray-50 px-3 py-2 rounded">useFocus</div>
						<div class="bg-gray-50 px-3 py-2 rounded">useIntersect</div>
						<div class="bg-gray-50 px-3 py-2 rounded">useScroll</div>
						<div class="bg-gray-50 px-3 py-2 rounded">useResize</div>
						<div class="bg-gray-50 px-3 py-2 rounded">useClickOutside</div>
						<div class="bg-gray-50 px-3 py-2 rounded">useLongPress</div>
						<div class="bg-gray-50 px-3 py-2 rounded">useSwipe</div>
						<div class="bg-gray-50 px-3 py-2 rounded">useDraggable</div>
					</div>
					<p class="text-gray-500 text-sm mt-4">
						... and 45 more composables available!
					</p>
				</div>
			</section>
		</main>
	</div>
</template>

<style>
@reference 'tailwindcss';
</style>
