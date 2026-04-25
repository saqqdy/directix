import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	BREAKING_CHANGES_REGISTRY,
	checkAPIUsage,
	clearWarnedChanges,
	compareVersions,
	configureBreakingChanges,
	createDeprecationWarning,
	DEFAULT_BREAKING_CHANGES_CONFIG,
	detectBreakingChangesInCode,
	generateBreakingChangesReport,
	getAllBreakingChanges,
	getBreakingChangesByCategory,
	getBreakingChangesBySeverity,
	getBreakingChangesConfig,
	getBreakingChangesForAPI,
	getBreakingChangesForVersion,
	getMigrationTimeline,
	getWarnedChanges,
	isAPIAffected,
	isVersionAffected,
	warnBreakingChange,
} from '../../packages/core/src/breaking-changes'

describe('Breaking Changes Warning System', () => {
	afterEach(() => {
		clearWarnedChanges()
		configureBreakingChanges(DEFAULT_BREAKING_CHANGES_CONFIG)
	})

	describe('BREAKING_CHANGES_REGISTRY', () => {
		it('should contain breaking changes', () => {
			expect(BREAKING_CHANGES_REGISTRY.length).toBeGreaterThan(0)
		})

		it('should have valid breaking change definitions', () => {
			for (const change of BREAKING_CHANGES_REGISTRY) {
				expect(change.id).toBeDefined()
				expect(change.version).toBeDefined()
				expect(change.description).toBeDefined()
				expect(['low', 'medium', 'high', 'critical']).toContain(change.severity)
				expect(['planned', 'deprecated', 'removed']).toContain(change.status)
				expect(['api', 'behavior', 'config', 'directive', 'type']).toContain(change.category)
			}
		})
	})

	describe('configureBreakingChanges', () => {
		it('should configure warning system', () => {
			configureBreakingChanges({
				enabled: false,
				warnLevel: 'high',
			})
			const config = getBreakingChangesConfig()
			expect(config.enabled).toBe(false)
			expect(config.warnLevel).toBe('high')
		})
	})

	describe('getBreakingChangesForVersion', () => {
		it('should return changes for specific version', () => {
			const changes = getBreakingChangesForVersion('2.0.0')
			expect(changes.length).toBeGreaterThan(0)
			expect(changes.every(c => c.version === '2.0.0')).toBe(true)
		})

		it('should return empty array for unknown version', () => {
			const changes = getBreakingChangesForVersion('99.0.0')
			expect(changes).toEqual([])
		})
	})

	describe('getAllBreakingChanges', () => {
		it('should return all breaking changes', () => {
			const changes = getAllBreakingChanges()
			expect(changes.length).toBe(BREAKING_CHANGES_REGISTRY.length)
		})
	})

	describe('getBreakingChangesBySeverity', () => {
		it('should filter by severity', () => {
			const critical = getBreakingChangesBySeverity('critical')
			expect(critical.every(c => c.severity === 'critical')).toBe(true)
		})
	})

	describe('getBreakingChangesByCategory', () => {
		it('should filter by category', () => {
			const apiChanges = getBreakingChangesByCategory('api')
			expect(apiChanges.every(c => c.category === 'api')).toBe(true)
		})
	})

	describe('isAPIAffected', () => {
		it('should return true for affected APIs', () => {
			expect(isAPIAffected('Vue 2')).toBe(true)
		})

		it('should return false for unaffected APIs', () => {
			expect(isAPIAffected('nonExistentAPI')).toBe(false)
		})

		it('should filter by version', () => {
			const affected = isAPIAffected('Vue 2', '2.0.0')
			expect(affected).toBe(true)
		})
	})

	describe('getBreakingChangesForAPI', () => {
		it('should return changes for specific API', () => {
			const changes = getBreakingChangesForAPI('Vue 2')
			expect(changes.length).toBeGreaterThan(0)
		})
	})

	describe('detectBreakingChangesInCode', () => {
		it('should detect deprecated API usage', () => {
			const code = `const merged = deepMerge(obj1, obj2);`
			const detections = detectBreakingChangesInCode(code)
			expect(detections.some(d => d.matchedPattern === 'deepMerge')).toBe(true)
		})

		it('should return empty array for clean code', () => {
			const code = `const x = 1;`
			const detections = detectBreakingChangesInCode(code)
			expect(detections).toEqual([])
		})

		it('should include location information', () => {
			const code = `const a = deepMerge({}, {});`
			const detections = detectBreakingChangesInCode(code)
			expect(detections[0].location.line).toBeDefined()
			expect(detections[0].location.snippet).toBe('deepMerge')
		})

		it('should handle file parameter', () => {
			const code = `isObjectLike(x)`
			const detections = detectBreakingChangesInCode(code, { file: 'test.ts' })
			expect(detections[0].location.file).toBe('test.ts')
		})
	})

	describe('warnBreakingChange', () => {
		it('should warn once', () => {
			configureBreakingChanges({ warnLevel: 'low', consoleOutput: true })
			const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
			warnBreakingChange('v2-remove-deprecated-utils')
			warnBreakingChange('v2-remove-deprecated-utils')
			expect(consoleSpy).toHaveBeenCalledTimes(1)
			consoleSpy.mockRestore()
		})

		it('should not warn when disabled', () => {
			configureBreakingChanges({ enabled: false, consoleOutput: true })
			const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
			warnBreakingChange('v2-remove-deprecated-utils')
			expect(consoleSpy).not.toHaveBeenCalled()
			consoleSpy.mockRestore()
		})

		it('should respect warn level', () => {
			configureBreakingChanges({ warnLevel: 'high', consoleOutput: true })
			const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
			warnBreakingChange('v2-remove-deprecated-utils') // severity: low
			expect(consoleSpy).not.toHaveBeenCalled()
			consoleSpy.mockRestore()
		})

		it('should call custom handlers', () => {
			const onWarning = vi.fn()
			configureBreakingChanges({ warnLevel: 'low', consoleOutput: false, customHandlers: { onWarning } })
			warnBreakingChange('v2-remove-deprecated-utils')
			expect(onWarning).toHaveBeenCalled()
		})

		it('should throw on critical when configured', () => {
			configureBreakingChanges({ throwOnCritical: true })
			expect(() => warnBreakingChange('v2-drop-vue2-support')).toThrow()
		})
	})

	describe('checkAPIUsage', () => {
		it('should warn for affected APIs', () => {
			configureBreakingChanges({ warnLevel: 'low', consoleOutput: true })
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			checkAPIUsage('Vue 2')
			expect(consoleSpy).toHaveBeenCalled()
			consoleSpy.mockRestore()
		})
	})

	describe('generateBreakingChangesReport', () => {
		it('should generate comprehensive report', () => {
			const report = generateBreakingChangesReport('2.0.0')
			expect(report.targetVersion).toBe('2.0.0')
			expect(report.totalChanges).toBeGreaterThan(0)
			expect(report.bySeverity).toBeDefined()
			expect(report.byCategory).toBeDefined()
			expect(report.byStatus).toBeDefined()
			expect(report.migrationEffort).toBeDefined()
			expect(report.recommendations).toBeDefined()
		})

		it('should calculate bySeverity correctly', () => {
			const report = generateBreakingChangesReport('2.0.0')
			const total = report.bySeverity.low + report.bySeverity.medium + report.bySeverity.high + report.bySeverity.critical
			expect(total).toBe(report.totalChanges)
		})

		it('should determine migration effort based on severity', () => {
			const report = generateBreakingChangesReport('2.0.0')
			// Migration effort is determined by severity counts
			expect(['low', 'medium', 'high', 'critical']).toContain(report.migrationEffort)
		})
	})

	describe('clearWarnedChanges', () => {
		it('should clear warned changes', () => {
			configureBreakingChanges({ warnLevel: 'low', consoleOutput: false })
			warnBreakingChange('v2-remove-deprecated-utils')
			expect(getWarnedChanges().length).toBe(1)
			clearWarnedChanges()
			expect(getWarnedChanges().length).toBe(0)
		})
	})

	describe('getWarnedChanges', () => {
		it('should return warned change IDs', () => {
			configureBreakingChanges({ warnLevel: 'low', consoleOutput: false })
			warnBreakingChange('v2-remove-deprecated-utils')
			const warned = getWarnedChanges()
			expect(warned).toContain('v2-remove-deprecated-utils')
		})
	})

	describe('createDeprecationWarning', () => {
		it('should create a warning function', () => {
			configureBreakingChanges({ consoleOutput: true })
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const warnFn = createDeprecationWarning('v2-remove-deprecated-utils', 'oldAPI', 'newAPI')
			warnFn()
			expect(consoleSpy).toHaveBeenCalled()
			consoleSpy.mockRestore()
		})

		it('should only warn once', () => {
			configureBreakingChanges({ consoleOutput: true })
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const warnFn = createDeprecationWarning('v2-remove-deprecated-utils', 'oldAPI', 'newAPI')
			warnFn()
			warnFn()
			expect(consoleSpy).toHaveBeenCalledTimes(1)
			consoleSpy.mockRestore()
		})
	})

	describe('compareVersions', () => {
		it('should compare versions correctly', () => {
			expect(compareVersions('1.0.0', '2.0.0')).toBe(-1)
			expect(compareVersions('2.0.0', '1.0.0')).toBe(1)
			expect(compareVersions('1.0.0', '1.0.0')).toBe(0)
		})

		it('should handle different length versions', () => {
			expect(compareVersions('1.0', '1.0.0')).toBe(0)
			expect(compareVersions('1.0.1', '1.0')).toBe(1)
		})
	})

	describe('isVersionAffected', () => {
		it('should return true for affected versions', () => {
			expect(isVersionAffected('2.0.0')).toBe(true)
		})

		it('should return false for unaffected versions', () => {
			expect(isVersionAffected('0.0.1')).toBe(false)
		})
	})

	describe('getMigrationTimeline', () => {
		it('should return timeline sorted by version', () => {
			const timeline = getMigrationTimeline()
			expect(timeline.length).toBeGreaterThan(0)

			for (let i = 1; i < timeline.length; i++) {
				const cmp = compareVersions(timeline[i - 1].version, timeline[i].version)
				expect(cmp).toBeLessThanOrEqual(0)
			}
		})

		it('should include correct milestones', () => {
			const timeline = getMigrationTimeline()
			expect(timeline.every(t => ['deprecated', 'removed'].includes(t.milestone))).toBe(true)
		})
	})
})

describe('DEFAULT_BREAKING_CHANGES_CONFIG', () => {
	it('should have correct default values', () => {
		expect(DEFAULT_BREAKING_CHANGES_CONFIG.enabled).toBe(true)
		expect(DEFAULT_BREAKING_CHANGES_CONFIG.targetVersion).toBe('2.0.0')
		expect(DEFAULT_BREAKING_CHANGES_CONFIG.warnLevel).toBe('medium')
		expect(DEFAULT_BREAKING_CHANGES_CONFIG.consoleOutput).toBe(true)
		expect(DEFAULT_BREAKING_CHANGES_CONFIG.throwOnCritical).toBe(false)
	})
})
