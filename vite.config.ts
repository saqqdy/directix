import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

const banner =
	`/*!\n` +
	` * ${pkg.name} v${pkg.version}\n` +
	` * ${pkg.description}\n` +
	` * (c) 2021-present saqqdy <https://github.com/saqqdy>\n` +
	` * Released under the MIT License.\n` +
	` */`

export default defineConfig({
	plugins: [
		dts({
			include: ['src/**/*.ts', 'packages/**/*.ts'],
			outDir: 'dist',
			rollupTypes: true,
		}),
	],

	build: {
		target: 'es2015',
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'Directix',
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
			external: ['vue'],
			output: {
				banner,
				globals: {
					vue: 'Vue',
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
		},
	},
})
