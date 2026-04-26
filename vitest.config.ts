import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [vue()],

	test: {
		globals: true,
		environment: 'jsdom',
		include: ['tests/**/*.test.ts', 'packages/**/*.test.ts'],
		exclude: ['node_modules', 'dist'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			include: ['src/**'],
			exclude: [
				'node_modules/**',
				'tests/**',
				'**/*.d.ts',
				'**/*.config.*',
				'docs/**',
				'examples/**',
				'playground/**',
				'src/nuxt/**', // Nuxt module tested separately
				'src/types/**', // Type definitions only, no executable code
				'src/index.ts', // Main entry point with barrel exports and install
				'src/utils/index.ts', // Just re-exports
				'src/composables/index.ts', // Just re-exports
				'src/directives/index.ts', // Just re-exports
				'src/plugin/registry.ts', // External API registry, mock-based testing
				'src/utils/a11y.ts', // Browser-dependent, needs E2E testing
				'src/utils/mobile.ts', // Browser-dependent, needs E2E testing
			],
			thresholds: {
				lines: 85,
				functions: 85,
				branches: 80,
				statements: 85,
			},
		},
		setupFiles: ['./tests/setup.ts'],
		// Performance optimizations
		pool: 'threads',
		poolOptions: {
			threads: {
				singleThread: false,
				minThreads: 1,
				maxThreads: 4,
			},
		},
		// Test timeouts
		testTimeout: 10000,
		hookTimeout: 10000,
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
