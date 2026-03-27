import { describe, expect, it } from 'vitest'
import {
	clickOutside,
	copy,
	debounce,
	focus,
	throttle,
	vClickOutside,
	vCopy,
	vDebounce,
	vFocus,
	vThrottle,
} from '../../src/directives'
import type {
	ClickOutsideBinding,
	ClickOutsideHandler,
	ClickOutsideOptions,
	CopyBinding,
	CopyErrorCallback,
	CopyOptions,
	CopySuccessCallback,
	DebounceBinding,
	DebounceOptions,
	FocusBinding,
	FocusOptions,
	ThrottleBinding,
	ThrottleOptions,
} from '../../src/directives'

describe('src/directives/index.ts', () => {
	describe('directive exports', () => {
		it('should export vClickOutside and default alias', () => {
			expect(vClickOutside).toBeDefined()
			expect(clickOutside).toBe(vClickOutside)
		})

		it('should export vCopy and default alias', () => {
			expect(vCopy).toBeDefined()
			expect(copy).toBe(vCopy)
		})

		it('should export vDebounce and default alias', () => {
			expect(vDebounce).toBeDefined()
			expect(debounce).toBe(vDebounce)
		})

		it('should export vThrottle and default alias', () => {
			expect(vThrottle).toBeDefined()
			expect(throttle).toBe(vThrottle)
		})

		it('should export vFocus and default alias', () => {
			expect(vFocus).toBeDefined()
			expect(focus).toBe(vFocus)
		})
	})

	describe('type exports', () => {
		// Type exports are compile-time only, but we can verify the types are correct
		it('should export ClickOutside types', () => {
			const options: ClickOutsideOptions = {
				handler: () => {},
			}

			expect(options.handler).toBeDefined()

			const handler: ClickOutsideHandler = () => {}

			expect(handler).toBeDefined()

			const binding: ClickOutsideBinding = handler

			expect(binding).toBeDefined()
		})

		it('should export Copy types', () => {
			const options: CopyOptions = {
				value: 'test',
			}

			expect(options.value).toBe('test')

			const binding: CopyBinding = 'test'

			expect(binding).toBe('test')

			const successCallback: CopySuccessCallback = () => {}

			expect(successCallback).toBeDefined()

			const errorCallback: CopyErrorCallback = () => {}

			expect(errorCallback).toBeDefined()
		})

		it('should export Debounce types', () => {
			const options: DebounceOptions = {
				handler: () => {},
			}

			expect(options.handler).toBeDefined()

			const binding: DebounceBinding = () => {}

			expect(binding).toBeDefined()
		})

		it('should export Throttle types', () => {
			const options: ThrottleOptions = {
				handler: () => {},
			}

			expect(options.handler).toBeDefined()

			const binding: ThrottleBinding = () => {}

			expect(binding).toBeDefined()
		})

		it('should export Focus types', () => {
			const options: FocusOptions = {
				focus: true,
			}

			expect(options.focus).toBeTruthy()

			const binding: FocusBinding = true

			expect(binding).toBeTruthy()
		})
	})
})
