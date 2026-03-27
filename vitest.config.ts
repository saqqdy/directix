/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],

	test: {
		globals: true,
		environment: 'jsdom',
		include: ['tests/**/*.test.ts', 'packages/**/*.test.ts'],
		exclude: ['node_modules', 'dist'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/**'],
			exclude: [
				'node_modules/**',
				'tests/**',
				'**/*.d.ts',
				'**/*.config.*',
			],
		},
		setupFiles: ['./tests/setup.ts'],
	},

	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@directix/core': resolve(__dirname, 'packages/core/src'),
			'@directix/shared': resolve(__dirname, 'packages/shared/src'),
		},
	},
})
