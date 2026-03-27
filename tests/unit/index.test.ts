import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { Directix, vClickOutside, vCopy, vDebounce, vFocus, vThrottle } from '../../src'
import * as directives from '../../src/directives'
import * as coreExports from '@directix/core'
import * as sharedExports from '@directix/shared'

describe('src/index.ts', () => {
	describe('Directix plugin', () => {
		it('should install all directives when all option is true', () => {
			const app = createApp({})

			app.use(Directix, { all: true })

			expect(app.directive('click-outside')).toBeDefined()
			expect(app.directive('copy')).toBeDefined()
			expect(app.directive('debounce')).toBeDefined()
			expect(app.directive('throttle')).toBeDefined()
			expect(app.directive('focus')).toBeDefined()
		})

		it('should install all directives when no options provided', () => {
			const app = createApp({})

			app.use(Directix)

			expect(app.directive('click-outside')).toBeDefined()
			expect(app.directive('copy')).toBeDefined()
			expect(app.directive('debounce')).toBeDefined()
			expect(app.directive('throttle')).toBeDefined()
			expect(app.directive('focus')).toBeDefined()
		})

		it('should install specified directives only', () => {
			const app = createApp({})

			app.use(Directix, { directives: ['copy', 'focus'] })

			expect(app.directive('copy')).toBeDefined()
			expect(app.directive('focus')).toBeDefined()
			expect(app.directive('click-outside')).toBeUndefined()
			expect(app.directive('debounce')).toBeUndefined()
			expect(app.directive('throttle')).toBeUndefined()
		})

		it('should warn when unknown directive name is provided', () => {
			const warnSpy = vi.spyOn(console, 'warn')
			const app = createApp({})

			app.use(Directix, { directives: ['unknown-directive'] })

			expect(warnSpy).toHaveBeenCalledWith('[Directix] Unknown directive: unknown-directive')

			warnSpy.mockRestore()
		})

		it('should work with empty directives array', () => {
			const app = createApp({})

			app.use(Directix, { directives: [] })

			// No directives should be installed
			expect(app.directive('click-outside')).toBeUndefined()
			expect(app.directive('copy')).toBeUndefined()
		})
	})

	describe('exports', () => {
		it('should export all directives', () => {
			expect(vClickOutside).toBeDefined()
			expect(vCopy).toBeDefined()
			expect(vDebounce).toBeDefined()
			expect(vThrottle).toBeDefined()
			expect(vFocus).toBeDefined()
		})

		it('should re-export from directives/index.ts', () => {
			expect(directives.vClickOutside).toBe(vClickOutside)
			expect(directives.vCopy).toBe(vCopy)
			expect(directives.vDebounce).toBe(vDebounce)
			expect(directives.vThrottle).toBe(vThrottle)
			expect(directives.vFocus).toBe(vFocus)
		})

		it('should re-export core utilities', () => {
			expect(coreExports.defineDirective).toBeDefined()
			expect(coreExports.isBrowser).toBeDefined()
		})

		it('should re-export shared utilities', () => {
			expect(sharedExports.isString).toBeDefined()
			expect(sharedExports.isNumber).toBeDefined()
			expect(sharedExports.isBoolean).toBeDefined()
			expect(sharedExports.isFunction).toBeDefined()
			expect(sharedExports.isObject).toBeDefined()
			expect(sharedExports.isArray).toBeDefined()
			expect(sharedExports.isEmpty).toBeDefined()
			expect(sharedExports.isPromise).toBeDefined()
			expect(sharedExports.deepClone).toBeDefined()
			expect(sharedExports.deepMerge).toBeDefined()
			expect(sharedExports.get).toBeDefined()
			expect(sharedExports.set).toBeDefined()
			expect(sharedExports.parseTime).toBeDefined()
			expect(sharedExports.generateId).toBeDefined()
		})
	})
})
