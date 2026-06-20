import {
	clearDelegatedHandlers,
	configureEventDelegation,
	DEFAULT_EVENT_DELEGATION_CONFIG,
	getDelegationStats,
	getEventDelegationConfig,
	pauseDelegatedHandler,
	registerDelegatedHandler,
	resumeDelegatedHandler,
	unregisterDelegatedHandler,
} from '@directix/core'
/**
 * Tests for EventDelegationManager (v2.2.0)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('EventDelegationManager', () => {
	beforeEach(() => {
		clearDelegatedHandlers()
	})

	afterEach(() => {
		clearDelegatedHandlers()
	})

	describe('configureEventDelegation', () => {
		it('should apply default config', () => {
			const config = getEventDelegationConfig()
			expect(config.enabled).toBe(DEFAULT_EVENT_DELEGATION_CONFIG.enabled)
			expect(config.capture).toBe(DEFAULT_EVENT_DELEGATION_CONFIG.capture)
			expect(config.maxHandlers).toBe(DEFAULT_EVENT_DELEGATION_CONFIG.maxHandlers)
		})

		it('should allow custom config', () => {
			configureEventDelegation({ maxHandlers: 500, capture: true })
			const config = getEventDelegationConfig()
			expect(config.maxHandlers).toBe(500)
			expect(config.capture).toBe(true)
		})
	})

	describe('registerDelegatedHandler', () => {
		it('should register a handler and return an ID', () => {
			const id = registerDelegatedHandler('.btn', 'click', vi.fn())
			expect(id).toBeTruthy()
			expect(id).toMatch(/^dh-\d+$/)
		})

		it('should register multiple handlers', () => {
			const id1 = registerDelegatedHandler('.btn', 'click', vi.fn())
			const id2 = registerDelegatedHandler('.link', 'click', vi.fn())
			expect(id1).not.toBe(id2)

			const stats = getDelegationStats()
			expect(stats.totalHandlers).toBe(2)
		})

		it('should track active handlers', () => {
			registerDelegatedHandler('.btn', 'click', vi.fn())
			const stats = getDelegationStats()
			expect(stats.activeHandlers).toBe(1)
		})

		it('should track event types', () => {
			registerDelegatedHandler('.btn', 'click', vi.fn())
			registerDelegatedHandler('.link', 'mouseover', vi.fn())
			const stats = getDelegationStats()
			expect(stats.eventTypes).toContain('click')
			expect(stats.eventTypes).toContain('mouseover')
		})
	})

	describe('unregisterDelegatedHandler', () => {
		it('should remove a handler', () => {
			const id = registerDelegatedHandler('.btn', 'click', vi.fn())
			unregisterDelegatedHandler(id)
			const stats = getDelegationStats()
			expect(stats.totalHandlers).toBe(0)
		})

		it('should handle non-existent handler gracefully', () => {
			expect(() => unregisterDelegatedHandler('non-existent')).not.toThrow()
		})
	})

	describe('pauseDelegatedHandler / resumeDelegatedHandler', () => {
		it('should pause a handler', () => {
			const id = registerDelegatedHandler('.btn', 'click', vi.fn())
			pauseDelegatedHandler(id)
			const stats = getDelegationStats()
			expect(stats.activeHandlers).toBe(0)
		})

		it('should resume a paused handler', () => {
			const id = registerDelegatedHandler('.btn', 'click', vi.fn())
			pauseDelegatedHandler(id)
			resumeDelegatedHandler(id)
			const stats = getDelegationStats()
			expect(stats.activeHandlers).toBe(1)
		})
	})

	describe('getDelegationStats', () => {
		it('should return correct stats', () => {
			registerDelegatedHandler('.btn', 'click', vi.fn())
			registerDelegatedHandler('.link', 'click', vi.fn())

			const stats = getDelegationStats()
			expect(stats.totalHandlers).toBe(2)
			expect(stats.activeHandlers).toBe(2)
			expect(stats.totalInvocations).toBe(0)
			expect(stats.rootListenerCount).toBeGreaterThanOrEqual(0)
		})
	})

	describe('clearDelegatedHandlers', () => {
		it('should remove all handlers', () => {
			registerDelegatedHandler('.btn', 'click', vi.fn())
			registerDelegatedHandler('.link', 'mouseover', vi.fn())
			clearDelegatedHandlers()
			const stats = getDelegationStats()
			expect(stats.totalHandlers).toBe(0)
		})
	})
})
