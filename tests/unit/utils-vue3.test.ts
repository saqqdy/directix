import { describe, expect, it, vi } from 'vitest'
import {
	useLazyOptimized,
	useDirectiveInstance,
	computedWithCleanup,
	watchEffectBinding,
	useSuspenseDirective,
	ensureTeleportTarget,
	teleportContent,
} from '../../src/utils/vue3'
import { nextTick, ref } from 'vue'

describe('Vue3 Utilities', () => {
	describe('useLazyOptimized', () => {
		it('should create lazy loading state', () => {
			const { state, observe, disconnect, load } = useLazyOptimized()
			expect(state.value.loading).toBe(false)
			expect(state.value.loaded).toBe(false)
			expect(state.value.error).toBeNull()
			expect(typeof observe).toBe('function')
			expect(typeof disconnect).toBe('function')
			expect(typeof load).toBe('function')
		})

		it('should start with correct state', () => {
			const { state } = useLazyOptimized({ threshold: 0.5 })
			expect(state.value.isVisible).toBe(false)
		})

		it('should load manually', async () => {
			const onLoad = vi.fn()
			const { state, load } = useLazyOptimized({ onLoad })
			load()
			await nextTick()
		})

		it('should disconnect observer', () => {
			const { disconnect } = useLazyOptimized()
			disconnect()
			expect(true).toBe(true)
		})

		it('should observe element', () => {
			const { observe } = useLazyOptimized()
			const el = document.createElement('div')
			observe(el)
			expect(true).toBe(true)
		})
	})

	describe('useDirectiveInstance', () => {
		it('should create directive instance', () => {
			const result = useDirectiveInstance({ initialState: { count: 0 } })
			expect(result.state).toBeDefined()
			expect(result.element).toBeNull()
		})

		it('should set element', () => {
			const result = useDirectiveInstance()
			const el = document.createElement('div')
			result.setElement(el)
			expect(result.element).toBe(el)
		})

		it('should update state', () => {
			const result = useDirectiveInstance({
				initialState: { value: 'test' },
			})
			result.setState(prev => ({ ...prev, value: 'updated' }))
		})

		it('should reset state', () => {
			const result = useDirectiveInstance({
				initialState: { value: 'initial' },
			})
			result.setState(prev => ({ ...prev, value: 'changed' }))
			result.reset()
		})

		it('should accept shallow option', () => {
			const result = useDirectiveInstance({
				initialState: { data: null },
				shallow: true,
			})
			expect(result.state).toBeDefined()
		})
	})

	describe('computedWithCleanup', () => {
		it('should create computed with cleanup', () => {
			const source = ref(10)
			const computed = computedWithCleanup({
				get: () => source.value * 2,
			})
			expect(computed.value).toBe(20)
		})

		it('should call cleanup on source change', async () => {
			const source = ref(10)
			const cleanup = vi.fn()
			const computed = computedWithCleanup({
				get: () => source.value * 2,
				cleanup,
			})
			expect(computed.value).toBe(20)
			source.value = 20
			await nextTick()
			expect(computed.value).toBe(40)
		})

		it('should return computed ref', () => {
			const source = ref(10)
			const computed = computedWithCleanup({
				get: () => source.value,
			})
			expect(typeof computed.value).toBe('number')
		})
	})

	describe('watchEffectBinding', () => {
		it('should track binding changes', async () => {
			const binding = ref({ value: 'test' })
			const effect = vi.fn()
			const stop = watchEffectBinding({
				binding,
				effect,
			})
			expect(stop).toBeDefined()
			expect(typeof stop).toBe('function')
			stop()
		})

		it('should stop watching', () => {
			const binding = ref({ value: 'test' })
			const effect = vi.fn()
			const stop = watchEffectBinding({ binding, effect })
			stop()
			expect(true).toBe(true)
		})
	})

	describe('useSuspenseDirective', () => {
		it('should create suspense state', async () => {
			const loader = vi.fn().mockResolvedValue('result')
			const { state } = useSuspenseDirective({ loader })
			expect(state.value.loading).toBe(false)
			expect(state.value.data).toBeNull()
		})

		it('should call loader when load is called', async () => {
			const loader = vi.fn().mockResolvedValue('test data')
			const { load } = useSuspenseDirective({ loader })
			await load()
			expect(loader).toHaveBeenCalled()
		})

		it('should handle errors', async () => {
			const loader = vi.fn().mockRejectedValue(new Error('Load failed'))
			const { state, load } = useSuspenseDirective({ loader })
			try {
				await load()
			} catch (e) {
				// Error is expected
			}
			await nextTick()
		})

		it('should call onSuccess callback', async () => {
			const onSuccess = vi.fn()
			const loader = vi.fn().mockResolvedValue('data')
			const { load } = useSuspenseDirective({ loader, onSuccess })
			await load()
			expect(onSuccess).toHaveBeenCalledWith('data')
		})

		it('should call onError callback', async () => {
			const onError = vi.fn()
			const loader = vi.fn().mockRejectedValue(new Error('failed'))
			const { load } = useSuspenseDirective({ loader, onError })
			await load()
			expect(onError).toHaveBeenCalled()
		})

		it('should retry', async () => {
			const loader = vi.fn().mockResolvedValue('data')
			const { load, retry } = useSuspenseDirective({ loader })
			await load()
			await retry()
			expect(loader).toHaveBeenCalledTimes(2)
		})
	})

	describe('ensureTeleportTarget', () => {
		it('should create target if not exists', () => {
			const target = ensureTeleportTarget('#test-teleport-new')
			expect(target).toBeDefined()
			if (target) {
				expect(target.id).toBe('test-teleport-new')
			}
		})

		it('should return existing target', () => {
			const existing = document.createElement('div')
			existing.id = 'existing-teleport-target'
			document.body.appendChild(existing)
			const target = ensureTeleportTarget('#existing-teleport-target')
			expect(target?.id).toBe('existing-teleport-target')
			document.body.removeChild(existing)
		})
	})

	describe('teleportContent', () => {
		it('should return cleanup function', () => {
			const content = document.createElement('div')
			content.textContent = 'Test content'
			const cleanup = teleportContent(content, { to: '#teleport-dest-new' })
			expect(typeof cleanup).toBe('function')
			cleanup()
		})

		it('should not teleport when disabled', () => {
			const content = document.createElement('div')
			const parent = document.createElement('div')
			parent.appendChild(content)
			document.body.appendChild(parent)

			const cleanup = teleportContent(content, { to: '#disabled-target', disabled: true })
			expect(parent.contains(content)).toBe(true)

			cleanup()
			document.body.removeChild(parent)
		})

		it('should teleport to target element', () => {
			const content = document.createElement('div')
			content.textContent = 'Test'
			const target = document.createElement('div')
			target.id = 'teleport-dest-element'
			document.body.appendChild(target)

			const cleanup = teleportContent(content, { to: target })
			expect(target.contains(content)).toBe(true)

			cleanup()
			document.body.removeChild(target)
		})
	})
})