import {
	detectLegacyUsage,
	estimateMigrationEffort,
	generateMigrationReport,
	getBreakingChangesForVersion,
	getMigrationRules,
	migrate,
	type MigrationOptions,
	type MigrationSource,
	needsMigration,
} from '@directix/core'

/**
 * Tests for migration helper module
 */
import { describe, expect, it } from 'vitest'

describe('Migration Helper Module', () => {
	describe('detectLegacyUsage', () => {
		it('should detect no issues in clean code', () => {
			const code = `
        import { vDebounce, vThrottle } from 'directix'

        export default {
          directives: { vDebounce, vThrottle }
        }
      `

			const report = detectLegacyUsage(code, 'directix-v1')

			expect(report.totalIssues).toBe(0)
			expect(report.deprecatedAPIs).toHaveLength(0)
			expect(report.breakingChanges).toHaveLength(0)
		})

		it('should detect deprecated v-debounce.immediate modifier', () => {
			const code = `
        <template>
          <input v-debounce.immediate="handleInput" />
        </template>
      `

			const report = detectLegacyUsage(code, 'directix-v1')

			expect(report.totalIssues).toBeGreaterThan(0)
			expect(report.deprecatedAPIs.some(api => api.name === 'v-debounce.immediate modifier')).toBe(true)
		})

		it('should detect deprecated v-throttle.leading modifier', () => {
			const code = `
        <template>
          <button v-throttle.leading="handleClick">Click</button>
        </template>
      `

			const report = detectLegacyUsage(code, 'directix-v1')

			expect(report.deprecatedAPIs.some(api => api.name === 'v-throttle.leading modifier')).toBe(true)
		})

		it('should detect Vue 2 syntax', () => {
			const code = `
        new Vue({
          el: '#app',
          data: { message: 'Hello' }
        })
      `

			const report = detectLegacyUsage(code, 'directix-v1')

			expect(report.warnings.length).toBeGreaterThan(0)
			expect(report.warnings.some(w => w.message.includes('Vue 2'))).toBe(true)
		})

		it('should detect this.$directix usage', () => {
			const code = `
        export default {
          methods: {
            doSomething() {
              this.$directix.someMethod()
            }
          }
        }
      `

			const report = detectLegacyUsage(code, 'directix-v1')

			expect(report.breakingChanges.some(bc => bc.name === 'this.$directix')).toBe(true)
		})

		it('should detect VueUse APIs', () => {
			const code = `
        import { useDebounceFn, useThrottleFn } from '@vueuse/core'

        export function useFeature() {
          const debouncedFn = useDebounceFn(() => {}, 300)
          return { debouncedFn }
        }
      `

			const report = detectLegacyUsage(code, 'vueuse')

			expect(report.deprecatedAPIs.length).toBeGreaterThan(0)
			expect(report.deprecatedAPIs.some(api => api.name === 'useDebounceFn')).toBe(true)
		})

		it('should detect v-directives library patterns', () => {
			const code = `
        <template>
          <div v-clickaway="handleClick">Content</div>
          <img v-lazy-img="imageUrl" />
        </template>
      `

			const report = detectLegacyUsage(code, 'v-directives')

			expect(report.deprecatedAPIs.some(api => api.name === 'v-clickaway')).toBe(true)
			expect(report.deprecatedAPIs.some(api => api.name === 'v-lazy-img')).toBe(true)
		})

		it('should calculate correct severity', () => {
			const manyIssuesCode = `
        <input v-debounce.immediate="fn1" />
        <input v-debounce.immediate="fn2" />
        <input v-debounce.immediate="fn3" />
        <input v-debounce.immediate="fn4" />
        <input v-debounce.immediate="fn5" />
        <input v-debounce.immediate="fn6" />
      `

			const report = detectLegacyUsage(manyIssuesCode, 'directix-v1')

			expect(report.severity).toBe('medium')
		})
	})

	describe('migrate', () => {
		it('should apply migration rules', () => {
			const code = `<input v-debounce.immediate="handler" />`

			const options: MigrationOptions = {
				source: 'directix-v1',
				rules: getMigrationRules('directix-v1'),
				dryRun: false,
				verbose: false,
				preserveComments: true,
				formatOutput: true,
			}

			const result = migrate(code, options)

			expect(result.changes.length).toBeGreaterThan(0)
			expect(result.code).not.toContain('v-debounce.immediate')
		})

		it('should preserve comments when requested', () => {
			const code = `
        <!-- This is a comment -->
        <input v-debounce.immediate="handler" />
      `

			const options: MigrationOptions = {
				source: 'directix-v1',
				rules: getMigrationRules('directix-v1'),
				dryRun: false,
				verbose: false,
				preserveComments: true,
				formatOutput: false,
			}

			const result = migrate(code, options)

			expect(result.code).toContain('<!-- This is a comment -->')
		})

		it('should return correct stats', () => {
			const code = `<input v-debounce.immediate="handler" />`

			const options: MigrationOptions = {
				source: 'directix-v1',
				rules: getMigrationRules('directix-v1'),
				dryRun: false,
				verbose: false,
				preserveComments: true,
				formatOutput: false,
			}

			const result = migrate(code, options)

			expect(result.stats.filesProcessed).toBe(1)
			expect(result.stats.totalChanges).toBeGreaterThan(0)
		})
	})

	describe('generateMigrationReport', () => {
		it('should generate text report', () => {
			const code = `<input v-debounce.immediate="handler" />`
			const report = detectLegacyUsage(code, 'directix-v1')

			const textReport = generateMigrationReport(report, 'text')

			expect(textReport).toContain('Directix Migration Report')
			expect(textReport).toContain('Deprecated APIs')
		})

		it('should generate JSON report', () => {
			const code = `<input v-debounce.immediate="handler" />`
			const report = detectLegacyUsage(code, 'directix-v1')

			const jsonReport = generateMigrationReport(report, 'json')

			expect(() => JSON.parse(jsonReport)).not.toThrow()
			const parsed = JSON.parse(jsonReport)
			expect(parsed.totalIssues).toBe(report.totalIssues)
		})

		it('should generate markdown report', () => {
			const code = `<input v-debounce.immediate="handler" />`
			const report = detectLegacyUsage(code, 'directix-v1')

			const mdReport = generateMigrationReport(report, 'markdown')

			expect(mdReport).toContain('# Directix Migration Report')
			expect(mdReport).toContain('## Deprecated APIs')
		})
	})

	describe('getMigrationRules', () => {
		it('should return rules for directix-v1', () => {
			const rules = getMigrationRules('directix-v1')

			expect(rules.length).toBeGreaterThan(0)
			expect(rules.every(rule => rule.pattern)).toBe(true)
			expect(rules.every(rule => rule.replacement)).toBe(true)
		})

		it('should return rules for vueuse', () => {
			const rules = getMigrationRules('vueuse')

			expect(rules.length).toBeGreaterThan(0)
		})

		it('should return empty array for unknown source', () => {
			const rules = getMigrationRules('custom' as MigrationSource)

			expect(rules).toEqual([])
		})
	})

	describe('getBreakingChangesForVersion', () => {
		it('should return breaking changes for known version', () => {
			const changes = getBreakingChangesForVersion('2.0.0')

			expect(changes.length).toBeGreaterThan(0)
			expect(changes.every(c => c.id)).toBe(true)
		})

		it('should return empty array for unknown version', () => {
			const changes = getBreakingChangesForVersion('0.0.1')

			expect(changes).toEqual([])
		})
	})

	describe('needsMigration', () => {
		it('should return true for code with deprecated APIs', () => {
			const code = `<input v-debounce.immediate="handler" />`

			expect(needsMigration(code, 'directix-v1')).toBe(true)
		})

		it('should return false for clean code', () => {
			const code = `<input v-debounce="handler" />`

			expect(needsMigration(code, 'directix-v1')).toBe(false)
		})
	})

	describe('estimateMigrationEffort', () => {
		it('should estimate easy for few issues', () => {
			const code = `<input v-debounce.immediate="handler" />`
			const report = detectLegacyUsage(code, 'directix-v1')

			const effort = estimateMigrationEffort(report)

			expect(['easy', 'medium']).toContain(effort.difficulty)
			expect(effort.autoFixablePercentage).toBeGreaterThanOrEqual(0)
		})

		it('should estimate higher difficulty for many issues', () => {
			const code = `
        <input v-debounce.immediate="fn1" />
        <input v-debounce.immediate="fn2" />
        <input v-debounce.immediate="fn3" />
        <input v-debounce.immediate="fn4" />
        <input v-debounce.immediate="fn5" />
        <input v-debounce.immediate="fn6" />
        <input v-debounce.immediate="fn7" />
        <input v-debounce.immediate="fn8" />
        <input v-debounce.immediate="fn9" />
        <input v-debounce.immediate="fn10" />
        <input v-debounce.immediate="fn11" />
      `
			const report = detectLegacyUsage(code, 'directix-v1')

			const effort = estimateMigrationEffort(report)

			expect(['medium', 'hard']).toContain(effort.difficulty)
		})

		it('should calculate auto-fixable percentage', () => {
			const code = `<input v-debounce.immediate="handler" />`
			const report = detectLegacyUsage(code, 'directix-v1')

			const effort = estimateMigrationEffort(report)

			expect(effort.autoFixablePercentage).toBeGreaterThanOrEqual(0)
			expect(effort.autoFixablePercentage).toBeLessThanOrEqual(100)
		})
	})
})
