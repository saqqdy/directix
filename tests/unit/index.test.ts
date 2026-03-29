import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { Directix } from '../../src'
import * as directives from '../../src/directives'
import * as coreExports from '@directix/core'
import * as sharedExports from '@directix/shared'

describe('src/index.ts', () => {
	describe('Directix plugin', () => {
		it('should install all directives when all option is true', () => {
			const app = createApp({})

			app.use(Directix, { all: true })

			// Event directives
			expect(app.directive('click-outside')).toBeDefined()
			expect(app.directive('copy')).toBeDefined()
			expect(app.directive('debounce')).toBeDefined()
			expect(app.directive('throttle')).toBeDefined()
			expect(app.directive('focus')).toBeDefined()
			expect(app.directive('long-press')).toBeDefined()
			expect(app.directive('hover')).toBeDefined()

			// Visibility directives
			expect(app.directive('lazy')).toBeDefined()
			expect(app.directive('intersect')).toBeDefined()
			expect(app.directive('visible')).toBeDefined()
			expect(app.directive('loading')).toBeDefined()

			// Scroll directives
			expect(app.directive('scroll')).toBeDefined()
			expect(app.directive('infinite-scroll')).toBeDefined()
			expect(app.directive('sticky')).toBeDefined()

			// Form directives
			expect(app.directive('mask')).toBeDefined()

			// Security directives
			expect(app.directive('permission')).toBeDefined()
			expect(app.directive('sanitize')).toBeDefined()

			// Observer directives
			expect(app.directive('resize')).toBeDefined()
			expect(app.directive('mutation')).toBeDefined()

			// Effect directives
			expect(app.directive('ripple')).toBeDefined()
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

			app.use(Directix, { directives: ['copy', 'focus', 'permission'] })

			expect(app.directive('copy')).toBeDefined()
			expect(app.directive('focus')).toBeDefined()
			expect(app.directive('permission')).toBeDefined()
			expect(app.directive('click-outside')).toBeUndefined()
			expect(app.directive('debounce')).toBeUndefined()
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
		it('should export all event directives', () => {
			expect(directives.vClickOutside).toBeDefined()
			expect(directives.vCopy).toBeDefined()
			expect(directives.vDebounce).toBeDefined()
			expect(directives.vThrottle).toBeDefined()
			expect(directives.vFocus).toBeDefined()
			expect(directives.vLongPress).toBeDefined()
			expect(directives.vHover).toBeDefined()
		})

		it('should export all visibility directives', () => {
			expect(directives.vLazy).toBeDefined()
			expect(directives.vIntersect).toBeDefined()
			expect(directives.vVisible).toBeDefined()
			expect(directives.vLoading).toBeDefined()
		})

		it('should export all scroll directives', () => {
			expect(directives.vScroll).toBeDefined()
			expect(directives.vInfiniteScroll).toBeDefined()
			expect(directives.vSticky).toBeDefined()
		})

		it('should export all form directives', () => {
			expect(directives.vMask).toBeDefined()
		})

		it('should export all security directives', () => {
			expect(directives.vPermission).toBeDefined()
			expect(directives.vSanitize).toBeDefined()
		})

		it('should export all observer directives', () => {
			expect(directives.vResize).toBeDefined()
			expect(directives.vMutation).toBeDefined()
		})

		it('should export all effect directives', () => {
			expect(directives.vRipple).toBeDefined()
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
