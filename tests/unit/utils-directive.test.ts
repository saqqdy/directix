import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	createNormalizer,
	normalizeHandlerOptions,
	normalizeTimeOptions,
	type TimerManager,
	useTimer,
} from '../../src/utils/directive'

describe('src/utils/directive.ts', () => {
	describe('createNormalizer', () => {
		describe('function binding', () => {
			it('should normalize function binding with handlerKey', () => {
				const handler = vi.fn()
				const normalize = createNormalizer<{ capture: boolean, disabled: boolean, handler?: typeof handler }>({
					defaults: { capture: true, disabled: false },
					handlerKey: 'handler',
				})

				const result = normalize(handler)

				expect(result).toEqual({
					capture: true,
					disabled: false,
					handler,
				})
			})

			it('should return defaults without handlerKey when binding is function', () => {
				const handler = vi.fn()
				const normalize = createNormalizer({
					defaults: { disabled: false },
				})

				const result = normalize(handler)

				expect(result).toEqual({ disabled: false })
			})
		})

		describe('string binding', () => {
			it('should normalize string binding with valueKey', () => {
				const normalize = createNormalizer<{ disabled: boolean, value?: string }>({
					defaults: { disabled: false },
					valueKey: 'value',
				})

				const result = normalize('test-value')

				expect(result).toEqual({
					value: 'test-value',
					disabled: false,
				})
			})

			it('should return defaults without valueKey when binding is string', () => {
				const normalize = createNormalizer({
					defaults: { disabled: false },
				})

				const result = normalize('test-value')

				expect(result).toEqual({ disabled: false })
			})
		})

		describe('boolean binding', () => {
			it('should set disabled to false when binding is true', () => {
				const normalize = createNormalizer({
					defaults: { disabled: false, capture: true },
				})

				const result = normalize(true)

				expect(result).toEqual({
					disabled: false,
					capture: true,
				})
			})

			it('should set disabled to true when binding is false', () => {
				const normalize = createNormalizer({
					defaults: { disabled: false, capture: true },
				})

				const result = normalize(false)

				expect(result).toEqual({
					disabled: true,
					capture: true,
				})
			})
		})

		describe('object binding', () => {
			it('should merge object binding with defaults', () => {
				const normalize = createNormalizer({
					defaults: { capture: true, disabled: false },
				})

				const result = normalize({ capture: false, custom: 'value' })

				expect(result).toEqual({
					capture: false,
					disabled: false,
					custom: 'value',
				})
			})

			it('should override default values with object properties', () => {
				const normalize = createNormalizer({
					defaults: { a: 1, b: 2, c: 3 },
				})

				const result = normalize({ b: 20, c: 30 })

				expect(result).toEqual({
					a: 1,
					b: 20,
					c: 30,
				})
			})
		})

		describe('null/undefined binding', () => {
			it('should return defaults for null binding', () => {
				const normalize = createNormalizer({
					defaults: { disabled: false, capture: true },
				})

				const result = normalize(null)

				expect(result).toEqual({ disabled: false, capture: true })
			})

			it('should return defaults for undefined binding', () => {
				const normalize = createNormalizer({
					defaults: { disabled: false, capture: true },
				})

				const result = normalize(undefined)

				expect(result).toEqual({ disabled: false, capture: true })
			})
		})

		describe('complex scenarios', () => {
			it('should handle all options together', () => {
				const normalize = createNormalizer<{ disabled: boolean, capture: boolean, interval: number, handler?: typeof fn, value?: string }>({
					defaults: { disabled: false, capture: false, interval: 300 },
					handlerKey: 'handler',
					valueKey: 'value',
				})

				// Function binding
				const fn = vi.fn()
				expect(normalize(fn)).toEqual({
					disabled: false,
					capture: false,
					interval: 300,
					handler: fn,
				})

				// String binding
				expect(normalize('test')).toEqual({
					value: 'test',
					disabled: false,
					capture: false,
					interval: 300,
				})

				// Object binding
				expect(normalize({ capture: true })).toEqual({
					disabled: false,
					capture: true,
					interval: 300,
				})
			})
		})
	})

	describe('normalizeHandlerOptions', () => {
		it('should normalize function binding', () => {
			const handler = vi.fn()
			const result = normalizeHandlerOptions(handler, {})

			expect(result).toEqual({
				handler,
			})
		})

		it('should normalize object binding', () => {
			const handler = vi.fn()
			const result = normalizeHandlerOptions<{ handler?: typeof handler, disabled: boolean, custom: string }>(
				{ handler, disabled: true, custom: 'value' },
				{ disabled: false, custom: '' },
			)

			expect(result).toEqual({
				handler,
				disabled: true,
				custom: 'value',
			})
		})

		it('should handle undefined binding', () => {
			const result = normalizeHandlerOptions(undefined, {})

			expect(result).toEqual({})
		})

		it('should handle null binding', () => {
			const result = normalizeHandlerOptions(null as any, {})

			expect(result).toEqual({})
		})

		it('should preserve default handler', () => {
			const defaultHandler = vi.fn()
			const result = normalizeHandlerOptions(undefined, { handler: defaultHandler })

			expect(result).toEqual({
				handler: defaultHandler,
			})
		})

		it('should override default handler with binding handler', () => {
			const defaultHandler = vi.fn()
			const bindingHandler = vi.fn()
			const result = normalizeHandlerOptions(
				{ handler: bindingHandler },
				{ handler: defaultHandler },
			)

			expect(result).toEqual({
				handler: bindingHandler,
			})
		})
	})

	describe('normalizeTimeOptions', () => {
		it('should normalize function binding with time from arg', () => {
			const handler = vi.fn()
			const mockBinding = {
				value: handler,
				arg: '500',
			} as any

			const result = normalizeTimeOptions(handler, mockBinding, { wait: 300 })

			expect(result).toEqual({
				handler,
				wait: 500,
			})
		})

		it('should parse time with unit (e.g., 1s)', () => {
			const handler = vi.fn()
			const mockBinding = {
				value: handler,
				arg: '1s',
			} as any

			const result = normalizeTimeOptions(handler, mockBinding, { wait: 300 })

			expect(result).toEqual({
				handler,
				wait: 1000,
			})
		})

		it('should use default wait when arg is invalid', () => {
			const handler = vi.fn()
			const mockBinding = {
				value: handler,
				arg: null,
			} as any

			const result = normalizeTimeOptions(handler, mockBinding, { wait: 300 })

			expect(result).toEqual({
				handler,
				wait: 300,
			})
		})

		it('should normalize object binding', () => {
			const handler = vi.fn()
			const mockBinding = {
				value: { handler, disabled: true },
				arg: '200',
			} as any

			const result = normalizeTimeOptions<{ handler?: typeof handler, disabled?: boolean, wait?: number }>(
				{ handler, disabled: true },
				mockBinding,
				{ wait: 300 },
			)

			expect(result).toEqual({
				handler,
				disabled: true,
				wait: 200,
			})
		})

		it('should use binding wait over arg wait', () => {
			const handler = vi.fn()
			const mockBinding = {
				value: { handler, wait: 800 },
				arg: '500',
			} as any

			const result = normalizeTimeOptions(
				{ handler, wait: 800 },
				mockBinding,
				{ wait: 300 },
			)

			expect(result).toEqual({
				handler,
				wait: 800,
			})
		})

		it('should handle undefined binding', () => {
			const mockBinding = {
				value: undefined,
				arg: '500',
			} as any

			const result = normalizeTimeOptions(undefined, mockBinding, { wait: 300 })

			expect(result).toEqual({
				wait: 500,
			})
		})
	})

	describe('useTimer', () => {
		let timer: TimerManager

		beforeEach(() => {
			vi.useFakeTimers()
			timer = useTimer()
		})

		afterEach(() => {
			timer.clearAll()
			vi.useRealTimers()
		})

		describe('setTimeout', () => {
			it('should set a timeout and return id', () => {
				const callback = vi.fn()
				const id = timer.setTimeout(callback, 1000)

				expect(id).toBeDefined()
				expect(callback).not.toHaveBeenCalled()
			})

			it('should call callback after delay', () => {
				const callback = vi.fn()
				timer.setTimeout(callback, 1000)

				vi.advanceTimersByTime(1000)

				expect(callback).toHaveBeenCalled()
			})

			it('should track multiple timeouts', () => {
				const callback1 = vi.fn()
				const callback2 = vi.fn()

				timer.setTimeout(callback1, 500)
				timer.setTimeout(callback2, 1000)

				vi.advanceTimersByTime(500)
				expect(callback1).toHaveBeenCalled()
				expect(callback2).not.toHaveBeenCalled()

				vi.advanceTimersByTime(500)
				expect(callback2).toHaveBeenCalled()
			})

			it('should remove timeout from tracking after execution', () => {
				const callback = vi.fn()
				timer.setTimeout(callback, 100)

				vi.advanceTimersByTime(100)

				expect(timer.hasActive()).toBe(false)
			})
		})

		describe('clearTimeout', () => {
			it('should clear a specific timeout', () => {
				const callback = vi.fn()
				const id = timer.setTimeout(callback, 1000)

				timer.clearTimeout(id)
				vi.advanceTimersByTime(1000)

				expect(callback).not.toHaveBeenCalled()
			})

			it('should remove timeout from tracking', () => {
				const callback = vi.fn()
				const id = timer.setTimeout(callback, 1000)

				timer.clearTimeout(id)

				expect(timer.hasActive()).toBe(false)
			})
		})

		describe('setInterval', () => {
			it('should set an interval and return id', () => {
				const callback = vi.fn()
				const id = timer.setInterval(callback, 500)

				expect(id).toBeDefined()
			})

			it('should call callback repeatedly', () => {
				const callback = vi.fn()
				timer.setInterval(callback, 500)

				vi.advanceTimersByTime(500)
				expect(callback).toHaveBeenCalledTimes(1)

				vi.advanceTimersByTime(500)
				expect(callback).toHaveBeenCalledTimes(2)

				vi.advanceTimersByTime(1000)
				expect(callback).toHaveBeenCalledTimes(4)
			})

			it('should track active intervals', () => {
				const callback = vi.fn()
				timer.setInterval(callback, 500)

				expect(timer.hasActive()).toBe(true)
			})
		})

		describe('clearInterval', () => {
			it('should clear a specific interval', () => {
				const callback = vi.fn()
				const id = timer.setInterval(callback, 500)

				vi.advanceTimersByTime(500)
				expect(callback).toHaveBeenCalledTimes(1)

				timer.clearInterval(id)
				vi.advanceTimersByTime(1000)

				expect(callback).toHaveBeenCalledTimes(1)
			})

			it('should remove interval from tracking', () => {
				const callback = vi.fn()
				const id = timer.setInterval(callback, 500)

				expect(timer.hasActive()).toBe(true)

				timer.clearInterval(id)

				expect(timer.hasActive()).toBe(false)
			})
		})

		describe('clearAll', () => {
			it('should clear all timeouts and intervals', () => {
				const timeoutCallback = vi.fn()
				const intervalCallback = vi.fn()

				timer.setTimeout(timeoutCallback, 500)
				timer.setInterval(intervalCallback, 300)

				timer.clearAll()

				vi.advanceTimersByTime(1000)

				expect(timeoutCallback).not.toHaveBeenCalled()
				expect(intervalCallback).not.toHaveBeenCalled()
			})

			it('should reset hasActive to false', () => {
				timer.setTimeout(() => {}, 500)
				timer.setInterval(() => {}, 300)

				expect(timer.hasActive()).toBe(true)

				timer.clearAll()

				expect(timer.hasActive()).toBe(false)
			})

			it('should be safe to call when empty', () => {
				expect(() => timer.clearAll()).not.toThrow()
				expect(timer.hasActive()).toBe(false)
			})
		})

		describe('hasActive', () => {
			it('should return false when no active timers', () => {
				expect(timer.hasActive()).toBe(false)
			})

			it('should return true when timeout is active', () => {
				timer.setTimeout(() => {}, 1000)
				expect(timer.hasActive()).toBe(true)
			})

			it('should return true when interval is active', () => {
				timer.setInterval(() => {}, 1000)
				expect(timer.hasActive()).toBe(true)
			})

			it('should return false after timeout completes', () => {
				timer.setTimeout(() => {}, 100)

				vi.advanceTimersByTime(100)

				expect(timer.hasActive()).toBe(false)
			})

			it('should return true after interval fires (still active)', () => {
				timer.setInterval(() => {}, 100)

				vi.advanceTimersByTime(100)

				expect(timer.hasActive()).toBe(true)
			})
		})

		describe('multiple timer managers', () => {
			it('should manage timers independently', () => {
				const timer2 = useTimer()
				const callback1 = vi.fn()
				const callback2 = vi.fn()

				timer.setTimeout(callback1, 100)
				timer2.setTimeout(callback2, 200)

				vi.advanceTimersByTime(100)
				expect(callback1).toHaveBeenCalled()
				expect(callback2).not.toHaveBeenCalled()

				vi.advanceTimersByTime(100)
				expect(callback2).toHaveBeenCalled()

				timer2.clearAll()
			})
		})
	})
})
