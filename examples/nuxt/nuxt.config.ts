// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2026-04-09',
	devtools: { enabled: true },
	modules: ['directix/nuxt'],

	directix: {
		// Enable the module
		enabled: true,
		// Auto-import composables (default: true)
		autoImportComposables: true,
		// You can include specific directives
		// include: ['v-click-outside', 'v-copy', 'v-debounce'],
		// Or exclude specific directives
		// exclude: ['v-ripple'],
	},
})