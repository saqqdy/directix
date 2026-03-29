import { describe, expect, it } from 'vitest'
import { vTruncate } from '../../src/directives/truncate'

describe('v-truncate', () => {
	describe('directive definition', () => {
		it('should be defined', () => {
			expect(vTruncate).toBeDefined()
		})

		it('should have correct name', () => {
			expect(vTruncate.name).toBe('truncate')
		})

		it('should support SSR', () => {
			expect(vTruncate.ssr).toBe(true)
		})
	})

	describe('truncateText function', () => {
		// Test the internal logic by verifying the directive exists and is correctly configured
		it('should be a function', () => {
			expect(typeof vTruncate.mounted).toBe('function')
			expect(typeof vTruncate.updated).toBe('function')
			expect(typeof vTruncate.unmounted).toBe('function')
		})
	})
})
