import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

const banner
	= `/*!\n`
		+ ` * ${pkg.name} v${pkg.version}\n`
		+ ` * ${pkg.description}\n`
		+ ` * (c) 2021-present saqqdy <https://github.com/saqqdy>\n`
		+ ` * Released under the MIT License.\n`
		+ ` */`

export default defineConfig({
	plugins: [
		dts({
			include: ['src/**/*.ts', 'packages/core/**/*.ts', 'packages/shared/**/*.ts', 'packages/i18n/**/*.ts'],
			exclude: ['src/nuxt/**'],
			outDir: 'dist',
			rollupTypes: true,
		}),
	],

	build: {
		target: 'es2015',
		lib: {
			name: 'Directix',
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['es', 'cjs', 'iife'],
			fileName: format => {
				const map: Record<string, string> = {
					es: 'index.mjs',
					cjs: 'index.cjs',
					iife: 'index.iife.js',
				}

				return map[format]
			},
		},

		rollupOptions: {
			external: ['vue', 'lottie-web', '@nuxt/kit', '@nuxt/schema', '#app', '#imports'],
			output: {
				banner,
				globals: {
					vue: 'Vue',
					'lottie-web': 'lottie',
					'@nuxt/kit': 'nuxtKit',
					'@nuxt/schema': 'nuxtSchema',
				},
				extend: true,
			},
		},

		sourcemap: true,
		minify: false,
	},

	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@directix/core': resolve(__dirname, 'packages/core/src'),
			'@directix/shared': resolve(__dirname, 'packages/shared/src'),
			'@directix/i18n': resolve(__dirname, 'packages/i18n/src'),
		},
	},
})
