import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [
		dts({
			include: ['src/**/*.ts', 'packages/**/*.ts'],
			outDir: 'dist',
			rollupTypes: true,
		}),
	],

	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'Directix',
			formats: ['es', 'cjs'],
			fileName: format => {
				const map: Record<string, string> = {
					es: 'index.esm.js',
					cjs: 'index.cjs.js',
				}

				return map[format]
			},
		},

		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},

		sourcemap: true,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
	},

	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@directix/core': resolve(__dirname, 'packages/core/src'),
			'@directix/shared': resolve(__dirname, 'packages/shared/src'),
		},
	},
})
