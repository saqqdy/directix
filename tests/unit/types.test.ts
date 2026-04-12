import type { DirectiveInstallOptions, DirectiveOptions } from '../../src/types'
import { describe, expect, it } from 'vitest'

describe('src/types/index.ts', () => {
	describe('DirectiveOptions', () => {
		it('should accept empty object', () => {
			const options: DirectiveOptions = {}
			expect(options).toBeDefined()
		})

		it('should accept enabled option', () => {
			const options: DirectiveOptions = {
				enabled: true,
			}
			expect(options.enabled).toBe(true)
		})

		it('should accept enabled set to false', () => {
			const options: DirectiveOptions = {
				enabled: false,
			}
			expect(options.enabled).toBe(false)
		})

		it('should accept config option', () => {
			const options: DirectiveOptions = {
				config: {
					customOption: 'value',
					anotherOption: 123,
				},
			}
			expect(options.config).toBeDefined()
			expect(options.config?.customOption).toBe('value')
		})

		it('should accept both enabled and config', () => {
			const options: DirectiveOptions = {
				enabled: true,
				config: {
					timeout: 300,
					retry: 3,
				},
			}
			expect(options.enabled).toBe(true)
			expect(options.config?.timeout).toBe(300)
		})
	})

	describe('DirectiveInstallOptions', () => {
		it('should accept empty object', () => {
			const options: DirectiveInstallOptions = {}
			expect(options).toBeDefined()
		})

		it('should accept directives array', () => {
			const options: DirectiveInstallOptions = {
				directives: ['copy', 'focus', 'debounce'],
			}
			expect(options.directives).toEqual(['copy', 'focus', 'debounce'])
		})

		it('should accept empty directives array', () => {
			const options: DirectiveInstallOptions = {
				directives: [],
			}
			expect(options.directives).toEqual([])
		})

		it('should accept all option set to true', () => {
			const options: DirectiveInstallOptions = {
				all: true,
			}
			expect(options.all).toBe(true)
		})

		it('should accept all option set to false', () => {
			const options: DirectiveInstallOptions = {
				all: false,
			}
			expect(options.all).toBe(false)
		})

		it('should accept both directives and all options', () => {
			const options: DirectiveInstallOptions = {
				directives: ['copy'],
				all: false,
			}
			expect(options.directives).toEqual(['copy'])
			expect(options.all).toBe(false)
		})
	})

	describe('type exports', () => {
		it('should export DirectiveOptions type', () => {
			const validateDirectiveOptions = (options: DirectiveOptions) => options
			const result = validateDirectiveOptions({ enabled: true })
			expect(result.enabled).toBe(true)
		})

		it('should export DirectiveInstallOptions type', () => {
			const validateInstallOptions = (options: DirectiveInstallOptions) => options
			const result = validateInstallOptions({ all: true })
			expect(result.all).toBe(true)
		})

		it('should allow partial DirectiveOptions', () => {
			const options1: DirectiveOptions = { enabled: true }
			const options2: DirectiveOptions = { config: { key: 'value' } }
			const options3: DirectiveOptions = {}

			expect(options1.enabled).toBe(true)
			expect(options2.config?.key).toBe('value')
			expect(options3).toEqual({})
		})

		it('should allow partial DirectiveInstallOptions', () => {
			const options1: DirectiveInstallOptions = { directives: ['copy'] }
			const options2: DirectiveInstallOptions = { all: true }
			const options3: DirectiveInstallOptions = {}

			expect(options1.directives).toEqual(['copy'])
			expect(options2.all).toBe(true)
			expect(options3).toEqual({})
		})
	})

	describe('type constraints', () => {
		it('should allow any value type in config', () => {
			const config: DirectiveOptions['config'] = {
				string: 'value',
				number: 123,
				boolean: true,
				object: { nested: 'value' },
				array: [1, 2, 3],
				null: null,
			}

			expect(config).toBeDefined()
		})

		it('should allow readonly directives array', () => {
			const options: DirectiveInstallOptions = {
				directives: ['copy'] as const,
			}
			expect(options.directives).toEqual(['copy'])
		})
	})
})
