/**
 * Configuration Center Integration Module for Directix
 * Provides centralized configuration management with remote sync support
 */

// ============================================================================
// Types
// ============================================================================

export type ConfigSourceType = 'static' | 'api' | 'localStorage' | 'sessionStorage' | 'remote'

export interface ConfigSource {
	type: ConfigSourceType
	priority: number
	api?: {
		url: string
		method: 'GET' | 'POST'
		headers?: Record<string, string>
		refreshInterval?: number
		timeout?: number
	}
	storage?: {
		key: string
		encrypt?: boolean
	}
	static?: Record<string, any>
}

export interface ConfigCenterConfig {
	sources: ConfigSource[]
	mergeStrategy: 'override' | 'merge' | 'deepMerge'
	cache: {
		enabled: boolean
		ttl: number
		key: string
	}
	sync: {
		enabled: boolean
		broadcastChannel?: string
		onUpdate?: (key: string, value: any) => void
	}
	validation: {
		enabled: boolean
		schema?: Record<string, ConfigSchema>
	}
	encryption: {
		enabled: boolean
		algorithm: 'AES' | 'none'
		key?: string
	}
}

export interface ConfigSchema {
	type: 'string' | 'number' | 'boolean' | 'object' | 'array'
	required?: boolean
	default?: any
	enum?: any[]
	min?: number
	max?: number
	pattern?: string
	validator?: (value: any) => boolean
}

export interface ConfigChangeEvent {
	key: string
	oldValue: any
	newValue: any
	source: string
	timestamp: number
}

export interface ConfigSnapshot {
	version: string
	config: Record<string, any>
	timestamp: number
	source: string
	hash: string
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_CONFIG_CENTER_CONFIG: ConfigCenterConfig = {
	sources: [],
	mergeStrategy: 'deepMerge',
	cache: {
		key: '__directix_config',
		enabled: true,
		ttl: 300000,
	},
	sync: {
		enabled: false,
	},
	validation: {
		enabled: false,
	},
	encryption: {
		enabled: false,
		algorithm: 'none',
	},
}

// ============================================================================
// Configuration Center
// ============================================================================

let _config: ConfigCenterConfig = DEFAULT_CONFIG_CENTER_CONFIG,
	_values: Map<string, any> = new Map(),
	_broadcastChannel: BroadcastChannel | null = null,
	_refreshTimer: number | null = null,
	_initialized = false,
	_snapshots: ConfigSnapshot[] = []
const _listeners: Map<string, Set<(event: ConfigChangeEvent) => void>> = new Map()
const _globalListeners: Set<(event: ConfigChangeEvent) => void> = new Set()

/**
 * Configure configuration center
 */
export function configureConfigCenter(config: Partial<ConfigCenterConfig>): void {
	_config = {
		...DEFAULT_CONFIG_CENTER_CONFIG,
		...config,
		cache: { ...DEFAULT_CONFIG_CENTER_CONFIG.cache, ...config.cache },
		sync: { ...DEFAULT_CONFIG_CENTER_CONFIG.sync, ...config.sync },
		validation: { ...DEFAULT_CONFIG_CENTER_CONFIG.validation, ...config.validation },
		encryption: { ...DEFAULT_CONFIG_CENTER_CONFIG.encryption, ...config.encryption },
	}

	// Setup broadcast channel for sync
	if (_config.sync.enabled && typeof BroadcastChannel !== 'undefined') {
		_broadcastChannel = new BroadcastChannel(_config.sync.broadcastChannel || 'directix-config')
		_broadcastChannel.onmessage = event => {
			if (event.data.type === 'config-update') {
				_values.set(event.data.key, event.data.value)
				_config.sync.onUpdate?.(event.data.key, event.data.value)
			}
		}
	}
}

/**
 * Get current configuration
 */
export function getConfigCenterConfig(): ConfigCenterConfig {
	return { ..._config }
}

/**
 * Initialize configuration center
 */
export async function initConfigCenter(): Promise<void> {
	if (_initialized) return

	// Sort sources by priority
	const sortedSources = [..._config.sources].sort((a, b) => b.priority - a.priority)

	// Load from each source
	for (const source of sortedSources) {
		try {
			const values = await loadFromSource(source)
			mergeValues(values)
		} catch (error) {
			console.warn(`[Directix Config] Failed to load from ${source.type}:`, error)
		}
	}

	// Setup refresh timer for API sources
	setupRefreshTimer()

	// Load cached config
	loadCachedConfig()

	_initialized = true
}

/**
 * Load configuration from source
 */
async function loadFromSource(source: ConfigSource): Promise<Record<string, any>> {
	switch (source.type) {
		case 'static':
			return source.static || {}

		case 'api':
			return loadFromAPI(source)

		case 'localStorage':
		case 'sessionStorage':
			return loadFromStorage(source)

		default:
			return {}
	}
}

/**
 * Load from API
 */
async function loadFromAPI(source: ConfigSource): Promise<Record<string, any>> {
	if (!source.api) return {}

	try {
		const response = await fetch(source.api.url, {
			method: source.api.method,
			headers: source.api.headers,
		})

		if (!response.ok) {
			throw new Error(`API returned ${response.status}`)
		}

		return await response.json()
	} catch (error) {
		throw new Error(`API config load failed: ${error}`)
	}
}

/**
 * Load from storage
 */
function loadFromStorage(source: ConfigSource): Record<string, any> {
	if (typeof window === 'undefined') return {}

	const storage = source.type === 'localStorage' ? localStorage : sessionStorage
	const key = source.storage?.key || 'directix-config'
	const value = storage.getItem(key)

	if (!value) return {}

	try {
		return JSON.parse(value)
	} catch {
		return {}
	}
}

/**
 * Merge values based on strategy
 */
function mergeValues(newValues: Record<string, any>): void {
	for (const [key, value] of Object.entries(newValues)) {
		const oldValue = _values.get(key)

		if (_config.mergeStrategy === 'override') {
			_values.set(key, value)
		} else if (_config.mergeStrategy === 'merge') {
			_values.set(key, { ...oldValue, ...value })
		} else {
			_values.set(key, deepMerge(oldValue, value))
		}

		if (oldValue !== value) {
			emitChange(key, oldValue, value)
		}
	}
}

/**
 * Deep merge objects
 */
function deepMerge(target: any, source: any): any {
	if (typeof target !== 'object' || typeof source !== 'object') {
		return source
	}

	const result = { ...target }
	for (const key of Object.keys(source)) {
		if (typeof source[key] === 'object' && typeof target[key] === 'object') {
			result[key] = deepMerge(target[key], source[key])
		} else {
			result[key] = source[key]
		}
	}
	return result
}

/**
 * Setup refresh timer
 */
function setupRefreshTimer(): void {
	const apiSources = _config.sources.filter(s => s.type === 'api' && s.api?.refreshInterval)

	if (apiSources.length > 0 && typeof window !== 'undefined') {
		const minInterval = Math.min(...apiSources.map(s => s.api!.refreshInterval!))

		_refreshTimer = window.setInterval(async () => {
			for (const source of apiSources) {
				try {
					const values = await loadFromAPI(source)
					mergeValues(values)
				} catch {
					// Ignore refresh errors
				}
			}
		}, minInterval)
	}
}

/**
 * Load cached config
 */
function loadCachedConfig(): void {
	if (!_config.cache.enabled || typeof localStorage === 'undefined') return

	try {
		const cached = localStorage.getItem(_config.cache.key)
		if (cached) {
			const { config, timestamp } = JSON.parse(cached)
			if (Date.now() - timestamp < _config.cache.ttl) {
				mergeValues(config)
			}
		}
	} catch {
		// Ignore cache errors
	}
}

/**
 * Save to cache
 */
function saveToCache(): void {
	if (!_config.cache.enabled || typeof localStorage === 'undefined') return

	try {
		const cacheData = {
			config: Object.fromEntries(_values),
			timestamp: Date.now(),
		}
		localStorage.setItem(_config.cache.key, JSON.stringify(cacheData))
	} catch {
		// Ignore cache errors
	}
}

/**
 * Get configuration value
 */
export function getConfig<T = any>(key: string, defaultValue?: T): T {
	if (!_values.has(key)) {
		return defaultValue as T
	}

	const value = _values.get(key)

	// Validate if schema exists
	if (_config.validation.enabled && _config.validation.schema?.[key]) {
		const valid = validateValue(key, value)
		if (!valid) {
			return defaultValue ?? _config.validation.schema[key].default as T
		}
	}

	return value as T
}

/**
 * Set configuration value
 */
export function setConfig(key: string, value: any, source: string = 'manual'): void {
	const oldValue = _values.get(key)

	// Validate if schema exists
	if (_config.validation.enabled && _config.validation.schema?.[key]) {
		if (!validateValue(key, value)) {
			throw new Error(`Invalid config value for key: ${key}`)
		}
	}

	_values.set(key, value)
	saveToCache()
	emitChange(key, oldValue, value, source)

	// Broadcast to other tabs
	if (_broadcastChannel) {
		_broadcastChannel.postMessage({
			key,
			type: 'config-update',
			value,
		})
	}

	// Create snapshot
	createSnapshot(source)
}

/**
 * Validate value against schema
 */
function validateValue(key: string, value: any): boolean {
	const schema = _config.validation.schema?.[key]
	if (!schema) return true

	// Check required
	if (schema.required && value === undefined) return false

	// Check type
	if (schema.type) {
		const actualType = Array.isArray(value) ? 'array' : typeof value
		if (actualType !== schema.type) return false
	}

	// Check enum
	if (schema.enum && !schema.enum.includes(value)) return false

	// Check min/max
	if (schema.type === 'number') {
		if (schema.min !== undefined && value < schema.min) return false
		if (schema.max !== undefined && value > schema.max) return false
	}

	// Check pattern
	if (schema.pattern && schema.type === 'string') {
		if (!new RegExp(schema.pattern).test(value)) return false
	}

	// Custom validator
	if (schema.validator && !schema.validator(value)) return false

	return true
}

/**
 * Delete configuration value
 */
export function deleteConfig(key: string): void {
	const oldValue = _values.get(key)
	_values.delete(key)
	saveToCache()
	emitChange(key, oldValue, undefined, 'manual')
}

/**
 * Get all configuration values
 */
export function getAllConfig(): Record<string, any> {
	return Object.fromEntries(_values)
}

/**
 * Watch configuration changes
 */
export function watchConfig(
	key: string | '*',
	callback: (event: ConfigChangeEvent) => void,
): () => void {
	if (key === '*') {
		_globalListeners.add(callback)
		return () => _globalListeners.delete(callback)
	}

	if (!_listeners.has(key)) {
		_listeners.set(key, new Set())
	}

	_listeners.get(key)!.add(callback)
	return () => _listeners.get(key)?.delete(callback)
}

/**
 * Emit change event
 */
function emitChange(key: string, oldValue: any, newValue: any, source: string = 'unknown'): void {
	const event: ConfigChangeEvent = {
		key,
		oldValue,
		newValue,
		source,
		timestamp: Date.now(),
	}

	// Emit to specific listeners
	_listeners.get(key)?.forEach(cb => cb(event))

	// Emit to global listeners
	_globalListeners.forEach(cb => cb(event))
}

/**
 * Create configuration snapshot
 */
function createSnapshot(source: string): void {
	const config = Object.fromEntries(_values)
	const hash = generateHash(config)

	_snapshots.push({
		version: `v${_snapshots.length + 1}`,
		config,
		timestamp: Date.now(),
		source,
		hash,
	})

	// Keep only last 20 snapshots
	if (_snapshots.length > 20) {
		_snapshots = _snapshots.slice(-20)
	}
}

/**
 * Generate hash for config
 */
function generateHash(config: Record<string, any>): string {
	const str = JSON.stringify(config)
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = ((hash << 5) - hash) + str.charCodeAt(i)
		hash |= 0
	}
	return hash.toString(16)
}

/**
 * Get snapshots
 */
export function getConfigSnapshots(): ConfigSnapshot[] {
	return [..._snapshots]
}

/**
 * Rollback to snapshot
 */
export function rollbackConfig(version: string): boolean {
	const snapshot = _snapshots.find(s => s.version === version)
	if (!snapshot) return false

	_values = new Map(Object.entries(snapshot.config))
	saveToCache()

	for (const [key, value] of _values) {
		emitChange(key, undefined, value, 'rollback')
	}

	return true
}

/**
 * Export configuration
 */
export function exportConfig(format: 'json' | 'yaml' | 'env' = 'json'): string {
	const config = Object.fromEntries(_values)

	switch (format) {
		case 'yaml':
			return toYAML(config)

		case 'env':
			return toEnv(config)

		default:
			return JSON.stringify(config, null, 2)
	}
}

/**
 * Convert to YAML format
 */
function toYAML(config: Record<string, any>, indent: number = 0): string {
	const lines: string[] = []
	const prefix = '  '.repeat(indent)

	for (const [key, value] of Object.entries(config)) {
		if (typeof value === 'object' && !Array.isArray(value)) {
			lines.push(`${prefix}${key}:`)
			lines.push(toYAML(value, indent + 1))
		} else {
			const yamlValue = typeof value === 'string' ? `"${value}"` : String(value)
			lines.push(`${prefix}${key}: ${yamlValue}`)
		}
	}

	return lines.join('\n')
}

/**
 * Convert to env format
 */
function toEnv(config: Record<string, any>, prefix: string = ''): string {
	const lines: string[] = []

	for (const [key, value] of Object.entries(config)) {
		const envKey = prefix ? `${prefix}_${key.toUpperCase()}` : key.toUpperCase()

		if (typeof value === 'object' && !Array.isArray(value)) {
			lines.push(toEnv(value, envKey))
		} else {
			lines.push(`${envKey}=${value}`)
		}
	}

	return lines.join('\n')
}

/**
 * Import configuration
 */
export async function importConfig(
	data: string,
	format: 'json' | 'yaml' | 'env' = 'json',
	merge: boolean = true,
): Promise<void> {
	let config: Record<string, any>

	switch (format) {
		case 'yaml':
			config = parseYAML(data)
			break

		case 'env':
			config = parseEnv(data)
			break

		default:
			config = JSON.parse(data)
	}

	if (merge) {
		mergeValues(config)
	} else {
		_values = new Map(Object.entries(config))
	}

	saveToCache()
	createSnapshot('import')
}

/**
 * Parse YAML (simple implementation)
 */
function parseYAML(yaml: string): Record<string, any> {
	const result: Record<string, any> = {}
	const lines = yaml.split('\n')

	for (const line of lines) {
		if (!line.trim() || line.trim().startsWith('#')) continue

		const match = line.match(/^(\s*)([^:]+):\s*(.+)?$/)
		if (match) {
			// const indent = match[1].length // unused, kept for future nesting support
			const key = match[2].trim()
			const value = match[3]?.trim()

			if (value) {
				// Parse value
				if (value.startsWith('"') && value.endsWith('"')) {
					result[key] = value.slice(1, -1)
				} else if (value === 'true') {
					result[key] = true
				} else if (value === 'false') {
					result[key] = false
				} else if (!isNaN(Number(value))) {
					result[key] = Number(value)
				} else {
					result[key] = value
				}
			}
		}
	}

	return result
}

/**
 * Parse env format
 */
function parseEnv(env: string): Record<string, any> {
	const result: Record<string, any> = {}

	for (const line of env.split('\n')) {
		if (!line.trim() || line.startsWith('#')) continue

		const [key, value] = line.split('=')
		if (key && value) {
			result[key] = value
		}
	}

	return result
}

/**
 * Reset configuration center
 */
export function resetConfigCenter(): void {
	if (_refreshTimer) {
		clearInterval(_refreshTimer)
		_refreshTimer = null
	}

	_values.clear()
	_listeners.clear()
	_globalListeners.clear()
	_snapshots = []
	_initialized = false

	if (_broadcastChannel) {
		_broadcastChannel.close()
		_broadcastChannel = null
	}

	// Clear cached config from localStorage
	if (typeof localStorage !== 'undefined') {
		try {
			localStorage.removeItem(_config.cache.key)
		} catch {
			// Ignore storage errors
		}
	}

	// Reset config to defaults
	_config = DEFAULT_CONFIG_CENTER_CONFIG
}

/**
 * Sync configuration to remote
 */
export async function syncConfigToRemote(url: string, options?: {
	method?: 'POST' | 'PUT'
	headers?: Record<string, string>
}): Promise<boolean> {
	try {
		const response = await fetch(url, {
			method: options?.method ?? 'POST',
			headers: {
				'Content-Type': 'application/json',
				...options?.headers,
			},
			body: JSON.stringify(Object.fromEntries(_values)),
		})

		return response.ok
	} catch {
		return false
	}
}

/**
 * Get config statistics
 */
export function getConfigStats(): {
	totalKeys: number
	snapshotCount: number
	listenerCount: number
	cacheEnabled: boolean
	syncEnabled: boolean
} {
	return {
		totalKeys: _values.size,
		snapshotCount: _snapshots.length,
		listenerCount: _listeners.size + _globalListeners.size,
		cacheEnabled: _config.cache.enabled,
		syncEnabled: _config.sync.enabled,
	}
}
