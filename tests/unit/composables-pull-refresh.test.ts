import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { usePullRefresh } from '../../src/composables/use-pull-refresh'

describe('usePullRefresh', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with handler', () => {
			const handler = vi.fn()
			const { state, distance, isPulling, events, containerRef, refresh } = usePullRefresh({ handler })

			expect(state.value).toBe('idle')
			expect(distance.value).toBe(0)
			expect(isPulling.value).toBe(false)
			expect(events.touchstart).toBeDefined()
			expect(events.touchmove).toBeDefined()
			expect(events.touchend).toBeDefined()
			expect(containerRef).toBeDefined()
			expect(refresh).toBeDefined()
		})

		it('should handle touchstart', () => {
			const handler = vi.fn()
			const element = document.createElement('div')
			element.scrollTop = 0
			const { events, containerRef, isPulling } = usePullRefresh({ handler })

			containerRef.value = element

			const touchEvent = {
				touches: [{ clientY: 100 }],
			} as unknown as TouchEvent

			events.touchstart(touchEvent)

			expect(isPulling.value).toBe(true)
		})

		it('should not start pulling when scrolled', () => {
			const handler = vi.fn()
			const element = document.createElement('div')
			element.scrollTop = 10
			const { events, containerRef, isPulling } = usePullRefresh({ handler })

			containerRef.value = element

			const touchEvent = {
				touches: [{ clientY: 100 }],
			} as unknown as TouchEvent

			events.touchstart(touchEvent)

			expect(isPulling.value).toBe(false)
		})
	})

	describe('touchmove', () => {
		it('should update distance on pull down', () => {
			const handler = vi.fn()
			const element = document.createElement('div')
			element.scrollTop = 0
			const { events, containerRef, distance, state } = usePullRefresh({ handler })

			containerRef.value = element

			const startEvent = {
				touches: [{ clientY: 100 }],
			} as unknown as TouchEvent
			events.touchstart(startEvent)

			const moveEvent = {
				touches: [{ clientY: 150 }],
				preventDefault: vi.fn(),
			} as unknown as TouchEvent
			events.touchmove(moveEvent)

			expect(distance.value).toBeGreaterThan(0)
			expect(state.value).toBe('pulling')
		})

		it('should set state to ready when threshold reached', () => {
			const handler = vi.fn()
			const element = document.createElement('div')
			element.scrollTop = 0
			const { events, containerRef, state } = usePullRefresh({ handler, distance: 30 })

			containerRef.value = element

			const startEvent = {
				touches: [{ clientY: 100 }],
			} as unknown as TouchEvent
			events.touchstart(startEvent)

			const moveEvent = {
				touches: [{ clientY: 200 }],
				preventDefault: vi.fn(),
			} as unknown as TouchEvent
			events.touchmove(moveEvent)

			expect(state.value).toBe('ready')
		})

		it('should not pull when disabled', () => {
			const handler = vi.fn()
			const element = document.createElement('div')
			const { events, containerRef, distance } = usePullRefresh({ handler, disabled: true })

			containerRef.value = element

			const startEvent = {
				touches: [{ clientY: 100 }],
			} as unknown as TouchEvent
			events.touchstart(startEvent)

			const moveEvent = {
				touches: [{ clientY: 150 }],
				preventDefault: vi.fn(),
			} as unknown as TouchEvent
			events.touchmove(moveEvent)

			expect(distance.value).toBe(0)
		})

		it('should reset on upward swipe', () => {
			const handler = vi.fn()
			const element = document.createElement('div')
			element.scrollTop = 0
			const { events, containerRef, distance, state } = usePullRefresh({ handler })

			containerRef.value = element

			const startEvent = {
				touches: [{ clientY: 100 }],
			} as unknown as TouchEvent
			events.touchstart(startEvent)

			const moveEvent = {
				touches: [{ clientY: 50 }], // Upward swipe
				preventDefault: vi.fn(),
			} as unknown as TouchEvent
			events.touchmove(moveEvent)

			expect(distance.value).toBe(0)
			expect(state.value).toBe('idle')
		})
	})

	describe('touchend', () => {
		it('should trigger refresh when ready', async () => {
			const handler = vi.fn().mockResolvedValue(undefined)
			const element = document.createElement('div')
			element.scrollTop = 0
			const { events, containerRef, state } = usePullRefresh({ handler, distance: 30 })

			containerRef.value = element

			const startEvent = {
				touches: [{ clientY: 100 }],
			} as unknown as TouchEvent
			events.touchstart(startEvent)

			const moveEvent = {
				touches: [{ clientY: 200 }],
				preventDefault: vi.fn(),
			} as unknown as TouchEvent
			events.touchmove(moveEvent)

			events.touchend()

			expect(state.value).toBe('loading')
		})

		it('should reset when not ready', () => {
			const handler = vi.fn()
			const element = document.createElement('div')
			element.scrollTop = 0
			const { events, containerRef, state, distance } = usePullRefresh({ handler, distance: 100 })

			containerRef.value = element

			const startEvent = {
				touches: [{ clientY: 100 }],
			} as unknown as TouchEvent
			events.touchstart(startEvent)

			const moveEvent = {
				touches: [{ clientY: 130 }], // Small pull
				preventDefault: vi.fn(),
			} as unknown as TouchEvent
			events.touchmove(moveEvent)

			events.touchend()

			expect(state.value).toBe('idle')
			expect(distance.value).toBe(0)
		})
	})

	describe('refresh', () => {
		it('should call handler and set success state', async () => {
			const handler = vi.fn().mockResolvedValue(undefined)
			const { refresh, state } = usePullRefresh({ handler, successDuration: 100 })

			refresh()

			expect(state.value).toBe('loading')

			await vi.runAllTimersAsync()

			expect(handler).toHaveBeenCalled()
			expect(state.value).toBe('idle')
		})

		it('should set error state on handler failure', async () => {
			const handler = vi.fn().mockRejectedValue(new Error('Test error'))
			const { refresh, state } = usePullRefresh({ handler, errorDuration: 100 })

			refresh()

			await vi.runAllTimersAsync()

			expect(state.value).toBe('idle')
		})
	})

	describe('options', () => {
		it('should use custom distance threshold', () => {
			const handler = vi.fn()
			const element = document.createElement('div')
			element.scrollTop = 0
			const { events, containerRef, state } = usePullRefresh({ handler, distance: 100 })

			containerRef.value = element

			const startEvent = {
				touches: [{ clientY: 100 }],
			} as unknown as TouchEvent
			events.touchstart(startEvent)

			const moveEvent = {
				touches: [{ clientY: 200 }],
				preventDefault: vi.fn(),
			} as unknown as TouchEvent
			events.touchmove(moveEvent)

			// Should still be pulling (not ready) because distance is 100
			expect(state.value).toBe('pulling')
		})

		it('should respect maxDistance', () => {
			const handler = vi.fn()
			const element = document.createElement('div')
			element.scrollTop = 0
			const { events, containerRef, distance } = usePullRefresh({ handler, maxDistance: 50 })

			containerRef.value = element

			const startEvent = {
				touches: [{ clientY: 100 }],
			} as unknown as TouchEvent
			events.touchstart(startEvent)

			const moveEvent = {
				touches: [{ clientY: 300 }], // Large pull
				preventDefault: vi.fn(),
			} as unknown as TouchEvent
			events.touchmove(moveEvent)

			expect(distance.value).toBeLessThanOrEqual(50)
		})
	})

	describe('reactive options', () => {
		it('should support reactive distance', () => {
			const distance = ref(60)
			const handler = vi.fn()
			const { containerRef, state } = usePullRefresh({ handler, distance })

			containerRef.value = document.createElement('div')

			expect(state.value).toBe('idle')
		})

		it('should support reactive disabled', () => {
			const disabled = ref(false)
			const handler = vi.fn()
			const { state } = usePullRefresh({ handler, disabled })

			expect(state.value).toBe('idle')
		})
	})
})
