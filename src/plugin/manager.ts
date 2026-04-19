/**
 * Plugin Manager - Core plugin management system
 *
 * Handles plugin registration, lifecycle, and dependency resolution.
 */

import type { App, Directive } from 'vue'
import type { PluginRegistry } from './registry'
import type { DirectiveExtension, DirectixPlugin, PluginConfig, PluginContext, PluginHook, PluginHookCallback } from './types'
import { getPluginRegistry } from './registry'

/**
 * Plugin manager class
 */
export class PluginManager {
	private plugins = new Map<string, DirectixPlugin>()
	private hooks = new Map<PluginHook, PluginHookCallback[]>()
	private directives = new Map<string, Directive>()
	private composables = new Map<string, any>()
	private extensions = new Map<string, DirectiveExtension[]>()
	private app: App | null = null
	private config: PluginConfig

	constructor(config: PluginConfig = {}) {
		this.config = {
			debug: false,
			autoLoadOfficial: false,
			...config,
		}
	}

	/**
	 * Get the plugin registry instance
	 */
	getRegistry(): PluginRegistry {
		return getPluginRegistry(this.config.registryUrl)
	}

	/**
	 * Set the Vue app instance
	 */
	setApp(app: App): void {
		this.app = app
	}

	/**
	 * Register a plugin
	 */
	async register(plugin: DirectixPlugin): Promise<void> {
		if (this.plugins.has(plugin.meta.name)) {
			console.warn(`[Directix] Plugin "${plugin.meta.name}" is already registered`)
			return
		}

		// Check dependencies
		if (plugin.dependencies?.length) {
			for (const dep of plugin.dependencies) {
				if (!this.plugins.has(dep)) {
					throw new Error(`[Directix] Plugin "${plugin.meta.name}" requires "${dep}" to be installed first`)
				}
			}
		}

		const ctx = this.createContext(plugin)

		// Fire beforeInstall hooks
		await this.fireHooks('beforeInstall', plugin, ctx)

		// Install the plugin
		await plugin.install(ctx)

		// Register the plugin
		this.plugins.set(plugin.meta.name, plugin)

		// Fire afterInstall hooks
		await this.fireHooks('afterInstall', plugin, ctx)

		if (this.config.debug) {
			console.info(`[Directix] Plugin "${plugin.meta.name}" v${plugin.meta.version} installed`)
		}
	}

	/**
	 * Unregister a plugin
	 */
	async unregister(name: string): Promise<void> {
		const plugin = this.plugins.get(name)
		if (!plugin) {
			console.warn(`[Directix] Plugin "${name}" is not registered`)
			return
		}

		const ctx = this.createContext(plugin)

		// Fire beforeUninstall hooks
		await this.fireHooks('beforeUninstall', plugin, ctx)

		// Uninstall the plugin
		if (plugin.uninstall) {
			await plugin.uninstall(ctx)
		}

		// Remove the plugin
		this.plugins.delete(name)

		// Fire afterUninstall hooks
		await this.fireHooks('afterUninstall', plugin, ctx)

		if (this.config.debug) {
			console.info(`[Directix] Plugin "${name}" uninstalled`)
		}
	}

	/**
	 * Check if a plugin is registered
	 */
	has(name: string): boolean {
		return this.plugins.has(name)
	}

	/**
	 * Get a registered plugin
	 */
	get(name: string): DirectixPlugin | undefined {
		return this.plugins.get(name)
	}

	/**
	 * Get all registered plugins
	 */
	getAll(): DirectixPlugin[] {
		return Array.from(this.plugins.values())
	}

	/**
	 * Register a hook
	 */
	onHook(hook: PluginHook, callback: PluginHookCallback): void {
		if (!this.hooks.has(hook)) {
			this.hooks.set(hook, [])
		}
		this.hooks.get(hook)!.push(callback)
	}

	/**
	 * Remove a hook
	 */
	offHook(hook: PluginHook, callback: PluginHookCallback): void {
		const hooks = this.hooks.get(hook)
		if (hooks) {
			const index = hooks.indexOf(callback)
			if (index > -1) {
				hooks.splice(index, 1)
			}
		}
	}

	/**
	 * Register a directive extension
	 */
	extendDirective(extension: DirectiveExtension): void {
		const { target } = extension
		if (!this.extensions.has(target)) {
			this.extensions.set(target, [])
		}
		this.extensions.get(target)!.push(extension)
	}

	/**
	 * Get extensions for a directive
	 */
	getExtensions(directiveName: string): DirectiveExtension[] {
		return this.extensions.get(directiveName) || []
	}

	/**
	 * Get a registered directive
	 */
	getDirective(name: string): Directive | undefined {
		return this.directives.get(name)
	}

	/**
	 * Get a registered composable
	 */
	getComposable(name: string): any {
		return this.composables.get(name)
	}

	/**
	 * Create plugin context
	 */
	private createContext(plugin: DirectixPlugin): PluginContext {
		return {
			app: this.app!,
			registerDirective: (name: string, directive: Directive) => {
				this.directives.set(name, directive)
				if (this.app) {
					this.app.directive(name, directive)
				}
			},
			registerComposable: (name: string, composable: any) => {
				this.composables.set(name, composable)
			},
			getDirective: (name: string) => this.directives.get(name),
			warn: (message: string) => console.warn(`[Directix:${plugin.meta.name}] ${message}`),
			error: (message: string) => console.error(`[Directix:${plugin.meta.name}] ${message}`),
			meta: plugin.meta,
		}
	}

	/**
	 * Fire hooks
	 */
	private async fireHooks(hook: PluginHook, plugin: DirectixPlugin, ctx: PluginContext): Promise<void> {
		const callbacks = this.hooks.get(hook) || []
		for (const callback of callbacks) {
			await callback(plugin, ctx)
		}
	}
}

/**
 * Global plugin manager instance
 */
let globalManager: PluginManager | null = null

/**
 * Get or create the global plugin manager
 */
export function getPluginManager(config?: PluginConfig): PluginManager {
	if (!globalManager) {
		globalManager = new PluginManager(config)
	}
	return globalManager
}

/**
 * Reset the global plugin manager
 */
export function resetPluginManager(): void {
	globalManager = null
}

/**
 * Define a Directix plugin
 */
export function definePlugin(plugin: DirectixPlugin): DirectixPlugin {
	return plugin
}
