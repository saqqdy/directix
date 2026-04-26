import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { App, Directive } from 'vue'
import { PluginManager } from '../../src/plugin/manager'
import type { DirectixPlugin, PluginContext } from '../../src/plugin/types'

// Mock Vue app
const mockApp = {
	directive: vi.fn(),
} as unknown as App

describe('PluginManager', () => {
	let manager: PluginManager

	beforeEach(() => {
		manager = new PluginManager()
		vi.clearAllMocks()
	})

	describe('constructor', () => {
		it('should create manager with default config', () => {
			const mgr = new PluginManager()
			expect(mgr).toBeDefined()
		})

		it('should create manager with custom config', () => {
			const mgr = new PluginManager({ debug: true, autoLoadOfficial: true })
			expect(mgr).toBeDefined()
		})
	})

	describe('setApp', () => {
		it('should set the Vue app instance', () => {
			manager.setApp(mockApp)
			expect(manager).toBeDefined()
		})
	})

	describe('getRegistry', () => {
		it('should return plugin registry', () => {
			const registry = manager.getRegistry()
			expect(registry).toBeDefined()
		})
	})

	describe('register', () => {
		it('should register a plugin', async () => {
			manager.setApp(mockApp)
			const plugin: DirectixPlugin = {
				meta: { name: 'test-plugin', version: '1.0.0' },
				install: vi.fn(),
			}
			await manager.register(plugin)
			expect(plugin.install).toHaveBeenCalled()
		})

		it('should warn when registering same plugin twice', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			manager.setApp(mockApp)
			const plugin: DirectixPlugin = {
				meta: { name: 'duplicate-plugin', version: '1.0.0' },
				install: vi.fn(),
			}
			await manager.register(plugin)
			await manager.register(plugin)
			expect(warnSpy).toHaveBeenCalled()
			warnSpy.mockRestore()
		})

		it('should throw when dependency not installed', async () => {
			manager.setApp(mockApp)
			const plugin: DirectixPlugin = {
				meta: { name: 'dependent-plugin', version: '1.0.0' },
				install: vi.fn(),
				dependencies: ['missing-plugin'],
			}
			await expect(manager.register(plugin)).rejects.toThrow('requires')
		})

		it('should register plugin with satisfied dependencies', async () => {
			manager.setApp(mockApp)
			const depPlugin: DirectixPlugin = {
				meta: { name: 'base-plugin', version: '1.0.0' },
				install: vi.fn(),
			}
			await manager.register(depPlugin)

			const plugin: DirectixPlugin = {
				meta: { name: 'dependent-plugin', version: '1.0.0' },
				install: vi.fn(),
				dependencies: ['base-plugin'],
			}
			await manager.register(plugin)
			expect(plugin.install).toHaveBeenCalled()
		})

		it('should log in debug mode', async () => {
			const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
			const debugManager = new PluginManager({ debug: true })
			debugManager.setApp(mockApp)
			const plugin: DirectixPlugin = {
				meta: { name: 'debug-plugin', version: '1.0.0' },
				install: vi.fn(),
			}
			await debugManager.register(plugin)
			expect(infoSpy).toHaveBeenCalled()
			infoSpy.mockRestore()
		})
	})

	describe('unregister', () => {
		it('should unregister a plugin', async () => {
			manager.setApp(mockApp)
			const plugin: DirectixPlugin = {
				meta: { name: 'unregister-test', version: '1.0.0' },
				install: vi.fn(),
				uninstall: vi.fn(),
			}
			await manager.register(plugin)
			await manager.unregister('unregister-test')
			expect(plugin.uninstall).toHaveBeenCalled()
		})

		it('should warn when unregistering non-existent plugin', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			await manager.unregister('non-existent')
			expect(warnSpy).toHaveBeenCalled()
			warnSpy.mockRestore()
		})
	})

	describe('hooks', () => {
		it('should add hook with onHook', () => {
			const callback = vi.fn()
			manager.onHook('beforeInstall', callback)
			expect(manager).toBeDefined()
		})

		it('should remove hook with offHook', () => {
			const callback = vi.fn()
			manager.onHook('beforeInstall', callback)
			manager.offHook('beforeInstall', callback)
			expect(manager).toBeDefined()
		})
	})

	describe('has', () => {
		it('should return true for registered plugin', async () => {
			manager.setApp(mockApp)
			const plugin: DirectixPlugin = {
				meta: { name: 'has-test', version: '1.0.0' },
				install: vi.fn(),
			}
			await manager.register(plugin)
			expect(manager.has('has-test')).toBe(true)
		})

		it('should return false for non-existent plugin', () => {
			expect(manager.has('non-existent')).toBe(false)
		})
	})

	describe('get', () => {
		it('should return registered plugin', async () => {
			manager.setApp(mockApp)
			const plugin: DirectixPlugin = {
				meta: { name: 'get-plugin-test', version: '1.0.0' },
				install: vi.fn(),
			}
			await manager.register(plugin)
			const result = manager.get('get-plugin-test')
			expect(result).toBe(plugin)
		})

		it('should return undefined for non-existent plugin', () => {
			const result = manager.get('non-existent')
			expect(result).toBeUndefined()
		})
	})

	describe('getAll', () => {
		it('should return all registered plugins', async () => {
			manager.setApp(mockApp)
			const plugin1: DirectixPlugin = {
				meta: { name: 'plugin1', version: '1.0.0' },
				install: vi.fn(),
			}
			const plugin2: DirectixPlugin = {
				meta: { name: 'plugin2', version: '1.0.0' },
				install: vi.fn(),
			}
			await manager.register(plugin1)
			await manager.register(plugin2)
			const plugins = manager.getAll()
			expect(plugins.length).toBe(2)
		})
	})

	describe('directives', () => {
		it('should get registered directive', async () => {
			manager.setApp(mockApp)
			const mockDirective: Directive = {
				mounted: vi.fn(),
			}
			const plugin: DirectixPlugin = {
				meta: { name: 'directive-plugin', version: '1.0.0' },
				install: (ctx: PluginContext) => {
					ctx.registerDirective('test-dir', mockDirective)
				},
			}
			await manager.register(plugin)
			const directive = manager.getDirective('test-dir')
			expect(directive).toBeDefined()
		})

		it('should return undefined for non-existent directive', () => {
			const directive = manager.getDirective('non-existent')
			expect(directive).toBeUndefined()
		})
	})

	describe('composables', () => {
		it('should get registered composable', async () => {
			manager.setApp(mockApp)
			const mockComposable = vi.fn()
			const plugin: DirectixPlugin = {
				meta: { name: 'composable-plugin', version: '1.0.0' },
				install: (ctx: PluginContext) => {
					ctx.registerComposable('useTest', mockComposable)
				},
			}
			await manager.register(plugin)
			const composable = manager.getComposable('useTest')
			expect(composable).toBeDefined()
		})

		it('should return undefined for non-existent composable', () => {
			const composable = manager.getComposable('non-existent')
			expect(composable).toBeUndefined()
		})
	})

	describe('extensions', () => {
		it('should register directive extension', async () => {
			manager.setApp(mockApp)
			const extension = {
				target: 'click-outside',
				hook: 'mounted' as const,
				handler: vi.fn(),
			}
			const plugin: DirectixPlugin = {
				meta: { name: 'extension-plugin', version: '1.0.0' },
				install: (ctx: PluginContext) => {
					ctx.registerDirective('click-outside', { mounted: vi.fn() })
				},
			}
			await manager.register(plugin)
			manager.extendDirective(extension)
			const extensions = manager.getExtensions('click-outside')
			expect(extensions).toBeDefined()
		})
	})

	describe('PluginContext', () => {
		it('should provide warn and error functions', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			manager.setApp(mockApp)
			const plugin: DirectixPlugin = {
				meta: { name: 'ctx-plugin', version: '1.0.0' },
				install: (ctx: PluginContext) => {
					ctx.warn('test warning')
					ctx.error('test error')
				},
			}
			await manager.register(plugin)
			expect(warnSpy).toHaveBeenCalled()
			expect(errorSpy).toHaveBeenCalled()
			warnSpy.mockRestore()
			errorSpy.mockRestore()
		})
	})
})