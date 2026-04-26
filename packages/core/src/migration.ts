/**
 * Migration helper module for Directix
 * Provides tools for detecting and migrating from older versions or other libraries
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Migration source type
 */
export type MigrationSource = 'directix-v1' | 'vueuse' | 'v-directives' | 'custom'

/**
 * Legacy API detection result
 */
export interface LegacyUsageReport {
	deprecatedAPIs: DeprecatedAPI[]
	breakingChanges: BreakingChange[]
	warnings: MigrationWarning[]
	suggestions: MigrationSuggestion[]
	totalIssues: number
	severity: 'low' | 'medium' | 'high'
}

/**
 * Deprecated API information
 */
export interface DeprecatedAPI {
	name: string
	location: string
	line: number
	deprecatedIn: string
	removedIn: string
	replacement: string
	migrationCode?: string
}

/**
 * Breaking change information
 */
export interface BreakingChange {
	type: 'api' | 'behavior' | 'signature' | 'option'
	name: string
	location: string
	line: number
	description: string
	migration: string
}

/**
 * Migration warning
 */
export interface MigrationWarning {
	message: string
	location: string
	line: number
	severity: 'info' | 'warning' | 'error'
}

/**
 * Migration suggestion
 */
export interface MigrationSuggestion {
	original: string
	suggested: string
	location: string
	line: number
	autoFixable: boolean
}

/**
 * Migration options
 */
export interface MigrationOptions {
	source: MigrationSource
	rules: MigrationRule[]
	dryRun: boolean
	verbose: boolean
	preserveComments: boolean
	formatOutput: boolean
}

/**
 * Migration rule
 */
export interface MigrationRule {
	pattern: RegExp | string
	replacement: string
	description: string
	autoFixable: boolean
}

/**
 * Migration result
 */
export interface MigrationResult {
	code: string
	changes: CodeChange[]
	warnings: string[]
	stats: MigrationStats
}

/**
 * Code change information
 */
export interface CodeChange {
	type: 'replace' | 'insert' | 'delete'
	location: string
	line: number
	original: string
	new: string
	description: string
}

/**
 * Migration statistics
 */
export interface MigrationStats {
	filesProcessed: number
	filesChanged: number
	totalChanges: number
	autoFixes: number
	manualFixes: number
	warnings: number
	errors: number
}

// ============================================================================
// Deprecated APIs Registry
// ============================================================================

/**
 * Registry of deprecated APIs from different sources
 */
const DEPRECATED_APIS_REGISTRY: Record<MigrationSource, DeprecatedAPIPattern[]> = {
	'directix-v1': [
		{
			name: 'v-debounce.immediate modifier',
			pattern: /v-debounce\.immediate/g,
			deprecatedIn: '1.5.0',
			removedIn: '2.0.0',
			replacement: 'v-debounce with { immediate: true } option',
			migrationCode: 'v-debounce="{ handler, wait, immediate: true }"',
		},
		{
			name: 'v-throttle.leading modifier',
			pattern: /v-throttle\.leading/g,
			deprecatedIn: '1.5.0',
			removedIn: '2.0.0',
			replacement: 'v-throttle with { leading: true } option',
			migrationCode: 'v-throttle="{ handler, wait, leading: true }"',
		},
		{
			name: 'v-copy.static modifier',
			pattern: /v-copy\.static/g,
			deprecatedIn: '1.8.0',
			removedIn: '2.0.0',
			replacement: 'v-copy with value directly',
			migrationCode: 'v-copy="text"',
		},
	],
	vueuse: [
		{
			name: 'useDebounceFn',
			pattern: /useDebounceFn/g,
			deprecatedIn: 'vueuse',
			removedIn: 'n/a',
			replacement: 'useDebounce from @directix/core',
			migrationCode: 'import { useDebounce } from "@directix/core"',
		},
		{
			name: 'useThrottleFn',
			pattern: /useThrottleFn/g,
			deprecatedIn: 'vueuse',
			removedIn: 'n/a',
			replacement: 'useThrottle from @directix/core',
			migrationCode: 'import { useThrottle } from "@directix/core"',
		},
		{
			name: 'useIntersectionObserver',
			pattern: /useIntersectionObserver/g,
			deprecatedIn: 'vueuse',
			removedIn: 'n/a',
			replacement: 'useIntersection from @directix/core',
			migrationCode: 'import { useIntersection } from "@directix/core"',
		},
	],
	'v-directives': [
		{
			name: 'v-clickaway',
			pattern: /v-clickaway/g,
			deprecatedIn: 'v-directives',
			removedIn: 'n/a',
			replacement: 'v-click-outside from directix',
			migrationCode: 'v-click-outside="handler"',
		},
		{
			name: 'v-lazy-img',
			pattern: /v-lazy-img/g,
			deprecatedIn: 'v-directives',
			removedIn: 'n/a',
			replacement: 'v-lazy from directix',
			migrationCode: 'v-lazy="imageUrl"',
		},
	],
	custom: [],
}

interface DeprecatedAPIPattern {
	pattern: RegExp
	name: string
	deprecatedIn: string
	removedIn: string
	replacement: string
	migrationCode?: string
}

// ============================================================================
// Breaking Changes Registry
// ============================================================================

const BREAKING_CHANGES_REGISTRY: Record<string, BreakingChangeInfo[]> = {
	'1.5.0': [
		{
			name: 'v-debounce',
			type: 'signature',
			description: 'Changed from modifier-based to object-based API',
			migration: 'Use v-debounce="{ handler, wait }" instead of v-debounce.wait="handler"',
		},
		{
			name: 'v-throttle',
			type: 'signature',
			description: 'Changed from modifier-based to object-based API',
			migration: 'Use v-throttle="{ handler, wait }" instead of v-throttle.wait="handler"',
		},
	],
	'1.8.0': [
		{
			name: 'install function',
			type: 'api',
			description: 'Directix.install() removed, use createDirectix() instead',
			migration: 'Replace Directix.install() with createDirectix({ directives: [...] })',
		},
	],
	'2.0.0': [
		{
			name: 'Vue 2 support removed',
			type: 'behavior',
			description: 'Vue 2 compatibility layer removed',
			migration: 'Upgrade to Vue 3 or use directix@1.x for Vue 2 support',
		},
	],
}

interface BreakingChangeInfo {
	type: 'api' | 'behavior' | 'signature' | 'option'
	name: string
	description: string
	migration: string
}

// ============================================================================
// Migration Helper Functions
// ============================================================================

/**
 * Detect legacy usage in code
 */
export function detectLegacyUsage(code: string, source: MigrationSource = 'directix-v1'): LegacyUsageReport {
	const deprecatedAPIs: DeprecatedAPI[] = []
	const breakingChanges: BreakingChange[] = []
	const warnings: MigrationWarning[] = []
	const suggestions: MigrationSuggestion[] = []

	// Check for deprecated APIs
	const patterns = DEPRECATED_APIS_REGISTRY[source] || []

	for (const patternInfo of patterns) {
		const matches = findMatches(code, patternInfo.pattern)

		for (const match of matches) {
			deprecatedAPIs.push({
				name: patternInfo.name,
				location: match.location,
				line: match.line,
				deprecatedIn: patternInfo.deprecatedIn,
				removedIn: patternInfo.removedIn,
				replacement: patternInfo.replacement,
				migrationCode: patternInfo.migrationCode,
			})

			if (patternInfo.migrationCode) {
				suggestions.push({
					original: match.text,
					suggested: patternInfo.migrationCode,
					location: match.location,
					line: match.line,
					autoFixable: patternInfo.migrationCode !== undefined,
				})
			}
		}
	}

	// Check for potential breaking changes
	checkBreakingChanges(code, breakingChanges, warnings)

	// Calculate severity
	const totalIssues = deprecatedAPIs.length + breakingChanges.length + warnings.length
	let severity: 'low' | 'medium' | 'high' = 'low'

	if (totalIssues > 10 || breakingChanges.some(bc => bc.type === 'api')) {
		severity = 'high'
	} else if (totalIssues > 5 || breakingChanges.length > 0) {
		severity = 'medium'
	}

	return {
		deprecatedAPIs,
		breakingChanges,
		warnings,
		suggestions,
		totalIssues,
		severity,
	}
}

interface MatchResult {
	text: string
	location: string
	line: number
}

function findMatches(code: string, pattern: RegExp): MatchResult[] {
	const matches: MatchResult[] = []
	const lines = code.split('\n')

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		const lineMatches = line.match(pattern)

		if (lineMatches) {
			matches.push({
				text: lineMatches[0],
				location: `line ${i + 1}`,
				line: i + 1,
			})
		}
	}

	return matches
}

function checkBreakingChanges(
	code: string,
	breakingChanges: BreakingChange[],
	warnings: MigrationWarning[],
): void {
	// Check for Vue 2 specific code
	if (/Vue\.component\(|new Vue\(/.test(code)) {
		warnings.push({
			message: 'Vue 2 syntax detected - will need changes for Vue 3',
			location: 'codebase',
			line: 0,
			severity: 'warning',
		})
	}

	// Check for Options API in components
	if (/export default\s*\{[\s\S]*methods:/.test(code)) {
		warnings.push({
			message: 'Options API detected - consider using Composition API',
			location: 'codebase',
			line: 0,
			severity: 'info',
		})
	}

	// Check for this.$directix usage
	if (/this\.\$directix/.test(code)) {
		breakingChanges.push({
			name: 'this.$directix',
			type: 'api',
			location: 'codebase',
			line: 0,
			description: 'Global injection pattern changed',
			migration: 'Use useDirectix() composable instead',
		})
	}
}

/**
 * Apply migration rules to code
 */
export function migrate(code: string, options: MigrationOptions): MigrationResult {
	const changes: CodeChange[] = []
	const warnings: string[] = []
	let migratedCode = code

	// Apply each rule
	for (const rule of options.rules) {
		const pattern = typeof rule.pattern === 'string' ? new RegExp(rule.pattern, 'g') : rule.pattern
		const matches = findMatches(migratedCode, pattern)

		if (rule.autoFixable && matches.length > 0) {
			migratedCode = migratedCode.replace(pattern, rule.replacement)

			for (const match of matches) {
				changes.push({
					type: 'replace',
					location: match.location,
					line: match.line,
					original: match.text,
					new: rule.replacement,
					description: rule.description,
				})
			}
		} else if (!rule.autoFixable && matches.length > 0) {
			for (const match of matches) {
				warnings.push(`Manual fix needed at ${match.location}: ${rule.description}`)
			}
		}
	}

	// Calculate stats
	const stats: MigrationStats = {
		filesProcessed: 1,
		filesChanged: changes.length > 0 ? 1 : 0,
		totalChanges: changes.length,
		autoFixes: changes.filter(c => c.type === 'replace').length,
		manualFixes: warnings.length,
		warnings: warnings.length,
		errors: 0,
	}

	return {
		code: migratedCode,
		changes,
		warnings,
		stats,
	}
}

/**
 * Generate migration report
 */
export function generateMigrationReport(report: LegacyUsageReport, format: 'text' | 'json' | 'markdown'): string {
	if (format === 'json') {
		return JSON.stringify(report, null, 2)
	}

	if (format === 'markdown') {
		return generateMarkdownReport(report)
	}

	return generateTextReport(report)
}

function generateTextReport(report: LegacyUsageReport): string {
	const lines: string[] = []

	lines.push('='.repeat(60))
	lines.push('Directix Migration Report')
	lines.push('='.repeat(60))
	lines.push('')
	lines.push(`Total Issues: ${report.totalIssues}`)
	lines.push(`Severity: ${report.severity.toUpperCase()}`)
	lines.push('')

	if (report.deprecatedAPIs.length > 0) {
		lines.push('Deprecated APIs:')
		lines.push('-'.repeat(40))
		for (const api of report.deprecatedAPIs) {
			lines.push(`  ${api.name}`)
			lines.push(`    Location: ${api.location}`)
			lines.push(`    Deprecated: ${api.deprecatedIn}, Removed: ${api.removedIn}`)
			lines.push(`    Replacement: ${api.replacement}`)
			if (api.migrationCode) {
				lines.push(`    Migration: ${api.migrationCode}`)
			}
			lines.push('')
		}
	}

	if (report.breakingChanges.length > 0) {
		lines.push('Breaking Changes:')
		lines.push('-'.repeat(40))
		for (const bc of report.breakingChanges) {
			lines.push(`  ${bc.name} (${bc.type})`)
			lines.push(`    Description: ${bc.description}`)
			lines.push(`    Migration: ${bc.migration}`)
			lines.push('')
		}
	}

	if (report.suggestions.length > 0) {
		lines.push('Suggestions:')
		lines.push('-'.repeat(40))
		for (const suggestion of report.suggestions) {
			lines.push(`  ${suggestion.location}`)
			lines.push(`    Original: ${suggestion.original}`)
			lines.push(`    Suggested: ${suggestion.suggested}`)
			lines.push(`    Auto-fixable: ${suggestion.autoFixable ? 'Yes' : 'No'}`)
			lines.push('')
		}
	}

	return lines.join('\n')
}

function generateMarkdownReport(report: LegacyUsageReport): string {
	const lines: string[] = []

	lines.push('# Directix Migration Report')
	lines.push('')
	lines.push(`**Total Issues:** ${report.totalIssues}`)
	lines.push(`**Severity:** ${report.severity}`)
	lines.push('')

	if (report.deprecatedAPIs.length > 0) {
		lines.push('## Deprecated APIs')
		lines.push('')
		lines.push('| API | Location | Deprecated | Removed | Replacement |')
		lines.push('|-----|----------|------------|---------|-------------|')
		for (const api of report.deprecatedAPIs) {
			lines.push(`| ${api.name} | ${api.location} | ${api.deprecatedIn} | ${api.removedIn} | ${api.replacement} |`)
		}
		lines.push('')
	}

	if (report.breakingChanges.length > 0) {
		lines.push('## Breaking Changes')
		lines.push('')
		for (const bc of report.breakingChanges) {
			lines.push(`### ${bc.name}`)
			lines.push('')
			lines.push(`- **Type:** ${bc.type}`)
			lines.push(`- **Description:** ${bc.description}`)
			lines.push(`- **Migration:** ${bc.migration}`)
			lines.push('')
		}
	}

	if (report.suggestions.length > 0) {
		lines.push('## Suggestions')
		lines.push('')
		lines.push('| Location | Original | Suggested | Auto-fixable |')
		lines.push('|----------|----------|-----------|--------------|')
		for (const suggestion of report.suggestions) {
			lines.push(`| ${suggestion.location} | ${suggestion.original} | ${suggestion.suggested} | ${suggestion.autoFixable ? '✓' : '✗'} |`)
		}
		lines.push('')
	}

	return lines.join('\n')
}

/**
 * Get migration rules for a specific source
 */
export function getMigrationRules(source: MigrationSource): MigrationRule[] {
	const rules: MigrationRule[] = []

	const patterns = DEPRECATED_APIS_REGISTRY[source] || []

	for (const patternInfo of patterns) {
		if (patternInfo.migrationCode) {
			rules.push({
				pattern: patternInfo.pattern,
				replacement: patternInfo.migrationCode,
				description: `Migrate ${patternInfo.name} to ${patternInfo.replacement}`,
				autoFixable: true,
			})
		}
	}

	return rules
}

/**
 * Get breaking changes for version
 */
export function getBreakingChangesForVersion(version: string): BreakingChangeInfo[] {
	return BREAKING_CHANGES_REGISTRY[version] || []
}

/**
 * Check if code needs migration
 */
export function needsMigration(code: string, source: MigrationSource = 'directix-v1'): boolean {
	const report = detectLegacyUsage(code, source)
	return report.totalIssues > 0
}

/**
 * Estimate migration effort
 */
export function estimateMigrationEffort(report: LegacyUsageReport): {
	estimatedTime: string
	difficulty: 'easy' | 'medium' | 'hard'
	autoFixablePercentage: number
} {
	const autoFixable = report.suggestions.filter(s => s.autoFixable).length
	const total = report.suggestions.length || 1
	const autoFixablePercentage = Math.round((autoFixable / total) * 100)

	let difficulty: 'easy' | 'medium' | 'hard' = 'easy',
		estimatedTime = '5 minutes'

	if (report.severity === 'high') {
		difficulty = 'hard'
		estimatedTime = '1-2 hours'
	} else if (report.severity === 'medium') {
		difficulty = 'medium'
		estimatedTime = '15-30 minutes'
	} else if (autoFixablePercentage < 50) {
		difficulty = 'medium'
		estimatedTime = '30 minutes'
	}

	return {
		estimatedTime,
		difficulty,
		autoFixablePercentage,
	}
}
