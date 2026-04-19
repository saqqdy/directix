/**
 * Plugin Registry - Community plugin discovery and installation
 *
 * Provides access to the community plugin repository for discovering,
 * searching, and installing third-party Directix plugins.
 */

import type { PluginManager } from './manager'
import type { PluginCategory, PluginRegistryData, PluginRegistryEntry } from './types'

/**
 * Default registry URL
 */
const DEFAULT_REGISTRY_URL = 'https://directix.dev/plugins.json'

/**
 * Plugin registry class
 */
export class PluginRegistry {
	private registryUrl: string
	private cache: PluginRegistryData | null = null
	private cacheTime: number = 0
	private cacheTTL: number = 1000 * 60 * 30 // 30 minutes

	constructor(registryUrl?: string) {
		this.registryUrl = registryUrl || DEFAULT_REGISTRY_URL
	}

	/**
	 * Fetch plugin registry data
	 */
	private async fetchData(): Promise<PluginRegistryData> {
		// Check cache
		if (this.cache && Date.now() - this.cacheTime < this.cacheTTL) {
			return this.cache
		}

		try {
			// Try fetching from URL
			const response = await fetch(this.registryUrl)
			if (!response.ok) {
				throw new Error(`Failed to fetch registry: ${response.status}`)
			}
			const data = (await response.json()) as PluginRegistryData
			this.cache = data
			this.cacheTime = Date.now()
			return data
		} catch {
			// Return empty registry if fetch fails
			console.warn('[Directix] Failed to fetch plugin registry, using empty cache')
			return {
				version: 1,
				updated: new Date().toISOString().split('T')[0],
				plugins: [],
			}
		}
	}

	/**
	 * Set registry data directly (useful for testing or local development)
	 */
	setData(data: PluginRegistryData): void {
		this.cache = data
		this.cacheTime = Date.now()
	}

	/**
	 * Get all plugins from the registry
	 */
	async getAll(): Promise<PluginRegistryEntry[]> {
		const data = await this.fetchData()
		return data.plugins
	}

	/**
	 * Get a plugin by name
	 */
	async getByName(name: string): Promise<PluginRegistryEntry | undefined> {
		const plugins = await this.getAll()
		return plugins.find(p => p.name === name || p.package === name)
	}

	/**
	 * Search plugins by query
	 */
	async search(query: string): Promise<PluginRegistryEntry[]> {
		const plugins = await this.getAll()
		const lowerQuery = query.toLowerCase()

		return plugins.filter(plugin => {
			return (
				plugin.name.toLowerCase().includes(lowerQuery)
				|| plugin.description.toLowerCase().includes(lowerQuery)
				|| plugin.keywords.some(k => k.toLowerCase().includes(lowerQuery))
				|| plugin.author.toLowerCase().includes(lowerQuery)
			)
		})
	}

	/**
	 * Get plugins by category
	 */
	async getByCategory(category: PluginCategory): Promise<PluginRegistryEntry[]> {
		const plugins = await this.getAll()
		return plugins.filter(p => p.category === category)
	}

	/**
	 * Get registry metadata
	 */
	async getMeta(): Promise<{ version: number, updated: string, count: number }> {
		const data = await this.fetchData()
		return {
			version: data.version,
			updated: data.updated,
			count: data.plugins.length,
		}
	}

	/**
	 * Install a plugin from the registry
	 *
	 * Note: This is a helper for programmatic installation.
	 * For production use, install the package with your package manager first.
	 */
	async install(name: string, manager: PluginManager): Promise<void> {
		const entry = await this.getByName(name)
		if (!entry) {
			throw new Error(`[Directix] Plugin "${name}" not found in registry`)
		}

		// Try to dynamically import the plugin
		try {
			const pluginModule = await import(/* @vite-ignore */ entry.package)
			const plugin = pluginModule.default || pluginModule

			if (typeof plugin.install === 'function') {
				await manager.register(plugin)
			} else {
				throw new TypeError(`[Directix] Invalid plugin format: ${entry.package}`)
			}
		} catch {
			throw new Error(
				`[Directix] Failed to install plugin "${name}". `
				+ `Please install the package "${entry.package}" first: npm install ${entry.package}`,
			)
		}
	}
}

/**
 * Global registry instance
 */
let globalRegistry: PluginRegistry | null = null

/**
 * Get or create the global plugin registry
 */
export function getPluginRegistry(registryUrl?: string): PluginRegistry {
	if (!globalRegistry) {
		globalRegistry = new PluginRegistry(registryUrl)
	}
	return globalRegistry
}

/**
 * Reset the global plugin registry
 */
export function resetPluginRegistry(): void {
	globalRegistry = null
}
