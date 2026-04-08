import type { DirectiveOptions } from '../../types'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import * as directives from '../../directives'

export default defineNuxtPlugin(nuxtApp => {
	const config = useRuntimeConfig()
	const directiveNames = (config.public as any).directix?.directiveNames || []
	const directiveOptions = (config.public as any).directix?.directiveOptions || {}

	// Register all enabled directives
	for (const name of directiveNames) {
		const directive = (directives as Record<string, any>)[name]
		if (directive) {
			// Convert v-directive-name to directive-name
			const directiveName = name.slice(1)
			nuxtApp.vueApp.directive(directiveName, directive)

			// Apply options if provided
			const options = directiveOptions[name] as DirectiveOptions | undefined
			if (options?.config) {
				// Some directives have configure functions
				const configureKey = `configure${name.charAt(1).toUpperCase() + name.slice(2).replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase())}`
				if (typeof (directives as Record<string, any>)[configureKey] === 'function') {
					(directives as Record<string, any>)[configureKey](options.config)
				}
			}
		}
	}
})
