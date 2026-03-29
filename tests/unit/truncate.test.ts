import type { ObjectDirective } from 'vue'
import { describe, expect, it } from 'vitest'
import { vTruncate } from '../../src/directives/truncate'

describe('v-truncate', () => {
	describe('directive definition', () => {
		it('should be defined', () => {
			expect(vTruncate).toBeDefined()
		})

		it('should have mounted hook', () => {
			expect((vTruncate as ObjectDirective).mounted).toBeDefined()
		})

		it('should have updated hook', () => {
			expect((vTruncate as ObjectDirective).updated).toBeDefined()
		})

		it('should have unmounted hook', () => {
			expect((vTruncate as ObjectDirective).unmounted).toBeDefined()
		})
	})
})
