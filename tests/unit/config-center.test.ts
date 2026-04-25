import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	configureConfigCenter,
	DEFAULT_CONFIG_CENTER_CONFIG,
	deleteConfig,
	exportConfig,
	getAllConfig,
	getConfig,
	getConfigCenterConfig,
	getConfigSnapshots,
	getConfigStats,
	importConfig,
	initConfigCenter,
	resetConfigCenter,
	rollbackConfig,
	setConfig,
	watchConfig,
} from '../../packages/core/src/config-center'

describe('Config Center', () => {
	beforeEach(async () => {
		resetConfigCenter()
		configureConfigCenter(DEFAULT_CONFIG_CENTER_CONFIG)
		await initConfigCenter()
	})

	afterEach(() => {
		resetConfigCenter()
	})

	describe('configureConfigCenter', () => {
		it('should configure config center', () => {
			configureConfigCenter({ cache: { key: 'test', enabled: false, ttl: 1000 } })
			const config = getConfigCenterConfig()
			expect(config.cache.enabled).toBe(false)
		})
	})

	describe('setConfig and getConfig', () => {
		it('should set and get config value', () => {
			setConfig('test-key', 'test-value')
			expect(getConfig('test-key')).toBe('test-value')
		})

		it('should return default value for missing key', () => {
			expect(getConfig('missing', 'default')).toBe('default')
		})

		it('should set object values', () => {
			setConfig('obj', { foo: 'bar' })
			expect(getConfig('obj')).toEqual({ foo: 'bar' })
		})
	})

	describe('deleteConfig', () => {
		it('should delete config value', () => {
			setConfig('to-delete', 'value')
			deleteConfig('to-delete')
			expect(getConfig('to-delete')).toBeUndefined()
		})
	})

	describe('getAllConfig', () => {
		it('should return all config values', () => {
			setConfig('key1', 'value1')
			setConfig('key2', 'value2')
			const all = getAllConfig()
			expect(all.key1).toBe('value1')
			expect(all.key2).toBe('value2')
		})
	})

	describe('watchConfig', () => {
		it('should watch config changes', () => {
			const callback = vi.fn()
			watchConfig('watched-key', callback)

			setConfig('watched-key', 'new-value')

			expect(callback).toHaveBeenCalled()
		})

		it('should watch all config changes with *', () => {
			const callback = vi.fn()
			watchConfig('*', callback)

			setConfig('any-key', 'any-value')

			expect(callback).toHaveBeenCalled()
		})

		it('should return unsubscribe function', () => {
			const callback = vi.fn()
			const unsubscribe = watchConfig('test', callback)

			setConfig('test', 'value1')
			expect(callback).toHaveBeenCalledTimes(1)

			unsubscribe()
			setConfig('test', 'value2')
			expect(callback).toHaveBeenCalledTimes(1)
		})
	})

	describe('exportConfig', () => {
		it('should export as JSON', () => {
			setConfig('key', 'value')
			const exported = exportConfig('json')
			const parsed = JSON.parse(exported)
			expect(parsed.key).toBe('value')
		})

		it('should export as YAML', () => {
			setConfig('key', 'value')
			const exported = exportConfig('yaml')
			expect(exported).toContain('key: "value"')
		})

		it('should export as env', () => {
			setConfig('apiKey', 'test123')
			const exported = exportConfig('env')
			expect(exported).toContain('APIKEY=test123')
		})
	})

	describe('importConfig', () => {
		it('should import JSON config', async () => {
			await importConfig('{"imported":"value"}', 'json')
			expect(getConfig('imported')).toBe('value')
		})
	})

	describe('getConfigSnapshots', () => {
		it('should return snapshots', () => {
			setConfig('key1', 'value1')
			setConfig('key2', 'value2')

			const snapshots = getConfigSnapshots()
			expect(snapshots.length).toBeGreaterThan(0)
		})
	})

	describe('rollbackConfig', () => {
		it('should rollback to snapshot', () => {
			setConfig('key', 'value1')
			const snapshots = getConfigSnapshots()
			const version = snapshots[0].version

			setConfig('key', 'value2')

			const result = rollbackConfig(version)
			expect(result).toBe(true)
			expect(getConfig('key')).toBe('value1')
		})

		it('should return false for invalid version', () => {
			const result = rollbackConfig('invalid-version')
			expect(result).toBe(false)
		})
	})

	describe('getConfigStats', () => {
		it('should return stats', () => {
			setConfig('key', 'value')
			const stats = getConfigStats()
			expect(stats.totalKeys).toBe(1)
			expect(typeof stats.snapshotCount).toBe('number')
		})
	})

	describe('resetConfigCenter', () => {
		it('should reset all config', () => {
			setConfig('key', 'value')
			resetConfigCenter()
			expect(getConfig('key')).toBeUndefined()
		})
	})
})

describe('DEFAULT_CONFIG_CENTER_CONFIG', () => {
	it('should have correct default values', () => {
		expect(DEFAULT_CONFIG_CENTER_CONFIG.mergeStrategy).toBe('deepMerge')
		expect(DEFAULT_CONFIG_CENTER_CONFIG.cache.enabled).toBe(true)
		expect(DEFAULT_CONFIG_CENTER_CONFIG.sync.enabled).toBe(false)
		expect(DEFAULT_CONFIG_CENTER_CONFIG.validation.enabled).toBe(false)
	})
})
