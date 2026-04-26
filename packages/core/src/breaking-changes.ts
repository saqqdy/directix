/**
 * Breaking Changes Warning System for Directix
 * Provides early warning for upcoming breaking changes in future versions
 */

// ============================================================================
// Types
// ============================================================================

export type ChangeSeverity = 'low' | 'medium' | 'high' | 'critical'
export type ChangeStatus = 'planned' | 'deprecated' | 'removed'
export type ChangeCategory = 'api' | 'behavior' | 'config' | 'type' | 'directive'

export interface BreakingChangeDefinition {
	id: string
	version: string
	description: string
	severity: ChangeSeverity
	status: ChangeStatus
	category: ChangeCategory
	affectedAPIs: string[]
	migrationGuide: string
	detectionPattern?: RegExp
	autoFixable: boolean
	deprecatedIn?: string
	removedIn?: string
	alternatives?: string[]
	examples?: {
		before: string
		after: string
	}
}

export interface BreakingChangeDetection {
	changeId: string
	location: {
		file?: string
		line?: number
		column?: number
		snippet?: string
	}
	matchedPattern: string
	severity: ChangeSeverity
	suggestion: string
}

export interface BreakingChangesConfig {
	enabled: boolean
	targetVersion: string
	warnLevel: 'none' | 'low' | 'medium' | 'high' | 'all'
	consoleOutput: boolean
	throwOnCritical: boolean
	customHandlers: {
		onDetected?: (detection: BreakingChangeDetection) => void
		onWarning?: (change: BreakingChangeDefinition) => void
		onCritical?: (change: BreakingChangeDefinition) => void
	}
}

export interface BreakingChangesReport {
	targetVersion: string
	generatedAt: number
	totalChanges: number
	bySeverity: Record<ChangeSeverity, number>
	byCategory: Record<ChangeCategory, number>
	byStatus: Record<ChangeStatus, number>
	changes: BreakingChangeDefinition[]
	detections: BreakingChangeDetection[]
	readyForMigration: boolean
	migrationEffort: 'low' | 'medium' | 'high' | 'critical'
	recommendations: string[]
}

// ============================================================================
// Breaking Changes Registry
// ============================================================================

export const BREAKING_CHANGES_REGISTRY: BreakingChangeDefinition[] = [
	// v2.0.0 Breaking Changes
	{
		id: 'v2-drop-vue2-support',
		version: '2.0.0',
		description: 'Vue 2 support will be removed. Vue 3.x will be the minimum required version.',
		severity: 'critical',
		status: 'planned',
		category: 'api',
		affectedAPIs: ['Vue 2 directives', '@vue/composition-api'],
		migrationGuide: 'Upgrade to Vue 3.x. Use the migration build of Vue 3 for gradual migration.',
		autoFixable: false,
		deprecatedIn: '1.10.0',
		removedIn: '2.0.0',
		alternatives: ['Vue 3.x'],
	},
	{
		id: 'v2-rename-directives',
		version: '2.0.0',
		description: 'Directive naming will be standardized to kebab-case. CamelCase directive names will be removed.',
		severity: 'medium',
		status: 'planned',
		category: 'directive',
		affectedAPIs: ['vClickOutside', 'vLazyLoad', 'vInfiniteScroll'],
		migrationGuide: 'Use kebab-case directive names: v-click-outside, v-lazy-load, v-infinite-scroll',
		detectionPattern: /v[A-Z][a-zA-Z]+/g,
		autoFixable: true,
		deprecatedIn: '1.10.0',
		removedIn: '2.0.0',
		examples: {
			before: '<div v-click-outside="handler"></div>',
			after: '<div v-click-outside="handler"></div>',
		},
	},
	{
		id: 'v2-option-structure',
		version: '2.0.0',
		description: 'Directive option structure will be simplified. Legacy option formats will be removed.',
		severity: 'high',
		status: 'planned',
		category: 'config',
		affectedAPIs: ['directive options', 'binding.value'],
		migrationGuide: 'Update directive options to use the new flat structure.',
		autoFixable: false,
		deprecatedIn: '1.11.0',
		removedIn: '2.0.0',
	},
	{
		id: 'v2-handler-signature',
		version: '2.0.0',
		description: 'Handler function signatures will be standardized. Old handler patterns will be removed.',
		severity: 'medium',
		status: 'planned',
		category: 'api',
		affectedAPIs: ['handlers', 'callbacks'],
		migrationGuide: 'Update handlers to use (value, oldValue, binding) signature.',
		autoFixable: true,
		deprecatedIn: '1.11.0',
		removedIn: '2.0.0',
	},
	{
		id: 'v2-remove-deprecated-utils',
		version: '2.0.0',
		description: 'Deprecated utility functions will be removed.',
		severity: 'low',
		status: 'deprecated',
		category: 'api',
		affectedAPIs: ['deepMerge', 'shallowMerge', 'isObjectLike'],
		migrationGuide: 'Use native alternatives or lodash equivalents.',
		detectionPattern: /\b(deepMerge|shallowMerge|isObjectLike)\b/g,
		autoFixable: false,
		deprecatedIn: '1.9.0',
		removedIn: '2.0.0',
		alternatives: ['Object.assign', 'structuredClone', 'typeof check'],
	},
	{
		id: 'v2-type-exports',
		version: '2.0.0',
		description: 'Type exports will be reorganized. Some types will be renamed or removed.',
		severity: 'medium',
		status: 'planned',
		category: 'type',
		affectedAPIs: ['DirectiveBinding', 'DirectiveConfig'],
		migrationGuide: 'Update type imports. Use renamed types from the new locations.',
		autoFixable: false,
		deprecatedIn: '1.11.0',
		removedIn: '2.0.0',
	},
	{
		id: 'v2-default-behavior',
		version: '2.0.0',
		description: 'Default behavior for some directives will change. Review and update directive usage.',
		severity: 'medium',
		status: 'planned',
		category: 'behavior',
		affectedAPIs: ['v-debounce', 'v-throttle'],
		migrationGuide: 'Explicitly specify options instead of relying on defaults.',
		autoFixable: false,
		deprecatedIn: '1.11.0',
		removedIn: '2.0.0',
	},
	{
		id: 'v2-event-names',
		version: '2.0.0',
		description: 'Custom event names will be standardized. Old event names will be removed.',
		severity: 'low',
		status: 'planned',
		category: 'api',
		affectedAPIs: ['on:click', 'on:change'],
		migrationGuide: 'Use the new event naming convention.',
		autoFixable: true,
		deprecatedIn: '1.11.0',
		removedIn: '2.0.0',
	},
]

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_BREAKING_CHANGES_CONFIG: BreakingChangesConfig = {
	enabled: true,
	targetVersion: '2.0.0',
	warnLevel: 'medium',
	consoleOutput: true,
	throwOnCritical: false,
	customHandlers: {},
}

// ============================================================================
// Breaking Changes Manager
// ============================================================================

let _config: BreakingChangesConfig = DEFAULT_BREAKING_CHANGES_CONFIG
const _warnedChanges: Set<string> = new Set()

/**
 * Configure breaking changes warning system
 */
export function configureBreakingChanges(config: Partial<BreakingChangesConfig>): void {
	_config = {
		...DEFAULT_BREAKING_CHANGES_CONFIG,
		...config,
		customHandlers: { ...DEFAULT_BREAKING_CHANGES_CONFIG.customHandlers, ...config.customHandlers },
	}
}

/**
 * Get current configuration
 */
export function getBreakingChangesConfig(): BreakingChangesConfig {
	return { ..._config }
}

/**
 * Get breaking changes for a specific version
 */
export function getBreakingChangesForVersion(version: string): BreakingChangeDefinition[] {
	return BREAKING_CHANGES_REGISTRY.filter(change => change.version === version)
}

/**
 * Get all breaking changes
 */
export function getAllBreakingChanges(): BreakingChangeDefinition[] {
	return [...BREAKING_CHANGES_REGISTRY]
}

/**
 * Get breaking changes by severity
 */
export function getBreakingChangesBySeverity(severity: ChangeSeverity): BreakingChangeDefinition[] {
	return BREAKING_CHANGES_REGISTRY.filter(change => change.severity === severity)
}

/**
 * Get breaking changes by category
 */
export function getBreakingChangesByCategory(category: ChangeCategory): BreakingChangeDefinition[] {
	return BREAKING_CHANGES_REGISTRY.filter(change => change.category === category)
}

/**
 * Check if an API is affected by breaking changes
 */
export function isAPIAffected(apiName: string, version?: string): boolean {
	return BREAKING_CHANGES_REGISTRY.some(
		change =>
			(!version || change.version === version)
			&& change.affectedAPIs.some(affected => affected.includes(apiName)),
	)
}

/**
 * Get breaking changes affecting a specific API
 */
export function getBreakingChangesForAPI(apiName: string): BreakingChangeDefinition[] {
	return BREAKING_CHANGES_REGISTRY.filter(change =>
		change.affectedAPIs.some(affected => affected.includes(apiName)),
	)
}

/**
 * Detect breaking changes in code
 */
export function detectBreakingChangesInCode(
	code: string,
	options?: { file?: string },
): BreakingChangeDetection[] {
	const detections: BreakingChangeDetection[] = []

	for (const change of BREAKING_CHANGES_REGISTRY) {
		if (!change.detectionPattern) continue

		const matches = code.matchAll(change.detectionPattern)
		for (const match of matches) {
			if (match.index === undefined) continue

			const lines = code.substring(0, match.index).split('\n')
			const line = lines.length
			const column = lines[lines.length - 1].length + 1

			detections.push({
				changeId: change.id,
				location: {
					file: options?.file,
					line,
					column,
					snippet: match[0],
				},
				matchedPattern: match[0],
				severity: change.severity,
				suggestion: change.migrationGuide,
			})
		}
	}

	return detections
}

/**
 * Warn about a breaking change (once)
 */
export function warnBreakingChange(changeId: string): void {
	if (!_config.enabled) return
	if (_warnedChanges.has(changeId)) return

	const change = BREAKING_CHANGES_REGISTRY.find(c => c.id === changeId)
	if (!change) return

	const shouldWarn
		= _config.warnLevel === 'all'
			|| (_config.warnLevel === 'low' && ['low', 'medium', 'high', 'critical'].includes(change.severity))
			|| (_config.warnLevel === 'medium' && ['medium', 'high', 'critical'].includes(change.severity))
			|| (_config.warnLevel === 'high' && ['high', 'critical'].includes(change.severity))

	if (!shouldWarn) return

	_warnedChanges.add(changeId)

	const prefix = `[Directix Breaking Change]`
	const statusEmoji = change.status === 'removed' ? '🚨' : change.status === 'deprecated' ? '⚠️' : '📢'
	const severityLabel = change.severity.toUpperCase()

	const message = `${prefix} ${statusEmoji} [${severityLabel}] ${change.description}
  Version: ${change.version}
  Status: ${change.status}
  Affected APIs: ${change.affectedAPIs.join(', ')}
  Migration: ${change.migrationGuide}`

	if (_config.consoleOutput) {
		if (change.severity === 'critical') {
			console.error(message)
		} else if (change.severity === 'high') {
			console.warn(message)
		} else {
			console.info(message)
		}
	}

	// Call custom handlers
	_config.customHandlers.onWarning?.(change)

	if (change.severity === 'critical') {
		_config.customHandlers.onCritical?.(change)
		if (_config.throwOnCritical) {
			throw new Error(`Critical breaking change detected: ${change.description}`)
		}
	}
}

/**
 * Check API usage and warn if affected
 */
export function checkAPIUsage(apiName: string): void {
	const affectedChanges = getBreakingChangesForAPI(apiName)
	for (const change of affectedChanges) {
		warnBreakingChange(change.id)
	}
}

/**
 * Generate comprehensive breaking changes report
 */
export function generateBreakingChangesReport(
	targetVersion: string = _config.targetVersion,
): BreakingChangesReport {
	const changes = BREAKING_CHANGES_REGISTRY.filter(
		change => change.version === targetVersion || change.removedIn === targetVersion,
	)

	const bySeverity: Record<ChangeSeverity, number> = {
		low: 0,
		medium: 0,
		high: 0,
		critical: 0,
	}

	const byCategory: Record<ChangeCategory, number> = {
		type: 0,
		api: 0,
		behavior: 0,
		config: 0,
		directive: 0,
	}

	const byStatus: Record<ChangeStatus, number> = {
		planned: 0,
		deprecated: 0,
		removed: 0,
	}

	for (const change of changes) {
		bySeverity[change.severity]++
		byCategory[change.category]++
		byStatus[change.status]++
	}

	// Determine migration effort
	let migrationEffort: 'low' | 'medium' | 'high' | 'critical'
	if (bySeverity.critical > 0) {
		migrationEffort = 'critical'
	} else if (bySeverity.high > 2 || bySeverity.medium > 5) {
		migrationEffort = 'high'
	} else if (bySeverity.medium > 2 || bySeverity.low > 5) {
		migrationEffort = 'medium'
	} else {
		migrationEffort = 'low'
	}

	// Generate recommendations
	const recommendations: string[] = []

	if (bySeverity.critical > 0) {
		recommendations.push('Critical changes detected. Plan migration carefully before upgrading.')
	}

	if (byCategory.api > 0) {
		recommendations.push('API changes detected. Review and update API usage before migration.')
	}

	if (byCategory.directive > 0) {
		recommendations.push('Directive changes detected. Update directive usage and names.')
	}

	if (byCategory.type > 0) {
		recommendations.push('Type changes detected. Update TypeScript definitions.')
	}

	const autoFixable = changes.filter(c => c.autoFixable)
	if (autoFixable.length > 0) {
		recommendations.push(`${autoFixable.length} changes can be auto-fixed using the migration tool.`)
	}

	return {
		targetVersion,
		generatedAt: Date.now(),
		totalChanges: changes.length,
		bySeverity,
		byCategory,
		byStatus,
		changes,
		detections: [],
		readyForMigration: migrationEffort === 'low',
		migrationEffort,
		recommendations,
	}
}

/**
 * Clear warned changes cache
 */
export function clearWarnedChanges(): void {
	_warnedChanges.clear()
}

/**
 * Get warned changes
 */
export function getWarnedChanges(): string[] {
	return Array.from(_warnedChanges)
}

/**
 * Create a deprecation warning helper
 */
export function createDeprecationWarning(
	changeId: string,
	deprecatedAPI: string,
	alternative: string,
): () => void {
	let warned = false

	return () => {
		if (warned) return
		warned = true

		const change = BREAKING_CHANGES_REGISTRY.find(c => c.id === changeId)
		const message = `[Directix] "${deprecatedAPI}" is deprecated${change ? ` and will be removed in v${change.removedIn}` : ''}. Use "${alternative}" instead.`

		if (_config.consoleOutput) {
			console.warn(message)
		}
	}
}

/**
 * Version comparison utility
 */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
	const partsA = a.split('.').map(Number)
	const partsB = b.split('.').map(Number)

	for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
		const numA = partsA[i] || 0
		const numB = partsB[i] || 0

		if (numA < numB) return -1
		if (numA > numB) return 1
	}

	return 0
}

/**
 * Check if a version is affected by any breaking changes
 */
export function isVersionAffected(version: string): boolean {
	return BREAKING_CHANGES_REGISTRY.some(
		change =>
			change.version === version
			|| change.deprecatedIn === version
			|| change.removedIn === version,
	)
}

/**
 * Get migration timeline
 */
export function getMigrationTimeline(): Array<{
	version: string
	changes: BreakingChangeDefinition[]
	milestone: 'deprecated' | 'removed'
}> {
	const timeline: Map<string, { deprecated: BreakingChangeDefinition[], removed: BreakingChangeDefinition[] }>
		= new Map()

	for (const change of BREAKING_CHANGES_REGISTRY) {
		if (change.deprecatedIn) {
			if (!timeline.has(change.deprecatedIn)) {
				timeline.set(change.deprecatedIn, { deprecated: [], removed: [] })
			}
			timeline.get(change.deprecatedIn)!.deprecated.push(change)
		}

		if (change.removedIn) {
			if (!timeline.has(change.removedIn)) {
				timeline.set(change.removedIn, { deprecated: [], removed: [] })
			}
			timeline.get(change.removedIn)!.removed.push(change)
		}
	}

	const result: Array<{ version: string, changes: BreakingChangeDefinition[], milestone: 'deprecated' | 'removed' }>
		= []

	for (const [version, milestones] of timeline) {
		if (milestones.deprecated.length > 0) {
			result.push({ version, changes: milestones.deprecated, milestone: 'deprecated' })
		}
		if (milestones.removed.length > 0) {
			result.push({ version, changes: milestones.removed, milestone: 'removed' })
		}
	}

	return result.sort((a, b) => compareVersions(a.version, b.version))
}
