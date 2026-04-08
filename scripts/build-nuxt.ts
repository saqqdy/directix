import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = resolve(__dirname, '..')
const distDir = resolve(rootDir, 'dist')
const nuxtDistDir = resolve(distDir, 'nuxt')

const pkg = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf-8'))

const banner
	= `/*!\n`
		+ ` * ${pkg.name} v${pkg.version}\n`
		+ ` * ${pkg.description}\n`
		+ ` * (c) 2021-present saqqdy <https://github.com/saqqdy>\n`
		+ ` * Released under the MIT License.\n`
		+ ` */`

async function buildNuxtModule() {
	console.log('Building Nuxt module...')

	// Build ESM
	await build({
		entryPoints: [resolve(rootDir, 'src/nuxt/index.ts')],
		bundle: true,
		platform: 'neutral',
		format: 'esm',
		outfile: resolve(nuxtDistDir, 'index.mjs'),
		external: ['vue', '@nuxt/kit', '@nuxt/schema', '@nuxt/app', '#app', '#imports'],
		banner: { js: banner },
		sourcemap: true,
		minify: false,
	})
	console.log('✓ Built dist/nuxt/index.mjs')

	// Build CJS with import.meta.url polyfill
	await build({
		entryPoints: [resolve(rootDir, 'src/nuxt/index.ts')],
		bundle: true,
		platform: 'node',
		format: 'cjs',
		outfile: resolve(nuxtDistDir, 'index.cjs'),
		external: ['vue', '@nuxt/kit', '@nuxt/schema', '@nuxt/app', '#app', '#imports'],
		banner: {
			js: `${banner}
const _importMetaUrl = require('url').pathToFileURL(__filename).toString();
`,
		},
		footer: { js: 'module.exports = module.exports.default;' },
		define: { 'import.meta.url': '_importMetaUrl' },
		sourcemap: true,
		minify: false,
	})
	console.log('✓ Built dist/nuxt/index.cjs')

	// Create type declaration file
	const dtsContent = `${banner}
import type { NuxtModule } from '@nuxt/schema'

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
  directiveOptions?: Record<string, any>

  /**
   * Whether to auto-import composables
   * @default true
   */
  autoImportComposables?: boolean
}

declare const directixModule: NuxtModule<ModuleOptions>

export default directixModule
`

	writeFileSync(resolve(nuxtDistDir, 'index.d.ts'), dtsContent)
	console.log('✓ Built dist/nuxt/index.d.ts')
}

buildNuxtModule().catch(err => {
	console.error('Failed to build Nuxt module:', err)
	process.exit(1)
})
