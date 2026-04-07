import type { NuxtModule } from '@nuxt/schema'
import type { DirectiveOptions } from '../types'
import { addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import * as directives from '../directives'

export interface ModuleOptions {
	/**
	 * Whether to enable the module
	 * @default true
	 */
	enabled?: boolean

	/**
	 * Directives to include (if not specified, all directives are included)
	 */
	include?: string[]

	/**
	 * Directives to exclude
	 */
	exclude?: string[]

	/**
	 * Default options for specific directives
	 */
	directiveOptions?: Record<string, DirectiveOptions>

	/**
	 * Whether to auto-import composables
	 * @default true
	 */
	autoImportComposables?: boolean
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'directix',
		configKey: 'directix',
		compatibility: {
			nuxt: '>=3.0.0',
		},
	},
	defaults: {
		enabled: true,
		autoImportComposables: true,
	},
	setup(options, nuxt) {
		if (!options.enabled) return

		const resolver = createResolver(import.meta.url)

		// Get directive names
		const allDirectiveNames = Object.keys(directives).filter(name => name.startsWith('v'))

		// Filter directives based on include/exclude options
		const directiveNames = allDirectiveNames.filter(name => {
			if (options.exclude?.includes(name)) return false
			if (options.include && !options.include.includes(name)) return false
			return true
		})

		// Add plugin to register directives
		addPlugin({
			src: resolver.resolve('./runtime/plugin'),
			mode: 'client',
		})

		// Auto-import composables
		if (options.autoImportComposables) {
			const composableNames = directiveNames.map(name => {
				// Convert v-directive-name to useDirectiveName
				const parts = name.slice(1).split('-')
				const camelCase = parts.map((part, index) =>
					index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
				).join('')
				return `use${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`
			})

			addImports(
				composableNames.map(name => ({
					name,
					as: name,
					from: 'directix',
				})),
			)
		}

		// Expose options to runtime config
		nuxt.options.runtimeConfig.directix = {
			directiveNames,
			directiveOptions: options.directiveOptions || {},
		}
	},
}) as NuxtModule<ModuleOptions>
