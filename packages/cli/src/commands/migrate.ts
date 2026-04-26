import path from 'node:path'
import {
	detectLegacyUsage,
	estimateMigrationEffort,
	generateMigrationReport,
	getMigrationRules,
	migrate,
	type MigrationOptions,
	type MigrationSource,
} from '@directix/core'
import chalk from 'chalk'
import fs from 'fs-extra'
import { glob } from 'glob'

interface MigrateOptions {
	from?: string
	dryRun?: boolean
	verbose?: boolean
	format?: 'text' | 'json' | 'markdown'
	output?: string
}

/**
 * Run migration command
 */
export async function runMigrate(options: MigrateOptions): Promise<void> {
	console.log(chalk.cyan('Directix Migration Tool'))
	console.log(chalk.gray('Analyzing your codebase...\n'))

	const cwd = process.cwd()
	const source: MigrationSource = (options.from as MigrationSource) || 'directix-v1'

	// Find all relevant files
	const files = await findSourceFiles(cwd)

	if (files.length === 0) {
		console.log(chalk.yellow('No source files found to analyze.'))
		return
	}

	console.log(chalk.gray(`Found ${files.length} files to analyze.\n`))

	// Analyze all files
	const results = await analyzeFiles(files, source)

	// Generate combined report
	const combinedReport = combineReports(results)

	// Display summary
	displaySummary(combinedReport, options)

	// Estimate effort
	const effort = estimateMigrationEffort(combinedReport.report)
	console.log(chalk.cyan('\nMigration Effort:'))
	console.log(chalk.gray(`  Estimated time: ${effort.estimatedTime}`))
	console.log(chalk.gray(`  Difficulty: ${effort.difficulty}`))
	console.log(chalk.gray(`  Auto-fixable: ${effort.autoFixablePercentage}%`))

	// Generate report
	const reportContent = generateMigrationReport(combinedReport.report, options.format || 'text')

	// Output report
	if (options.output) {
		await fs.writeFile(options.output, reportContent, 'utf-8')
		console.log(chalk.green(`\nReport saved to: ${options.output}`))
	}

	// Dry run or actual migration
	if (options.dryRun) {
		console.log(chalk.yellow('\n[Dry Run] No files were modified.'))
		console.log(chalk.gray('Remove --dry-run to apply changes.'))
	} else if (combinedReport.report.totalIssues > 0) {
		console.log(chalk.cyan('\nApplying migrations...'))

		const migrationOptions: MigrationOptions = {
			source,
			rules: getMigrationRules(source),
			dryRun: options.dryRun || false,
			verbose: options.verbose || false,
			preserveComments: true,
			formatOutput: true,
		}

		const migrationStats = await applyMigrations(files, migrationOptions, options.verbose || false)

		console.log(chalk.green('\nMigration complete!'))
		console.log(chalk.gray(`  Files processed: ${migrationStats.filesProcessed}`))
		console.log(chalk.gray(`  Files changed: ${migrationStats.filesChanged}`))
		console.log(chalk.gray(`  Total changes: ${migrationStats.totalChanges}`))

		if (migrationStats.warnings > 0) {
			console.log(chalk.yellow(`  Warnings: ${migrationStats.warnings}`))
		}
	} else {
		console.log(chalk.green('\nNo migration needed! Your code is up to date.'))
	}

	// Display detailed report if verbose
	if (options.verbose) {
		console.log(`\n${chalk.cyan('Detailed Report:')}`)
		console.log(chalk.gray('─'.repeat(60)))
		console.log(reportContent)
	}
}

interface FileAnalysisResult {
	file: string
	report: ReturnType<typeof detectLegacyUsage>
}

interface CombinedReport {
	report: ReturnType<typeof detectLegacyUsage>
	fileReports: FileAnalysisResult[]
}

async function findSourceFiles(cwd: string): Promise<string[]> {
	const patterns = [
		'**/*.{vue,js,ts,jsx,tsx}',
	]

	return glob(patterns, {
		cwd,
		absolute: true,
		ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/coverage/**'],
	})
}

async function analyzeFiles(files: string[], source: MigrationSource): Promise<FileAnalysisResult[]> {
	const results: FileAnalysisResult[] = []

	for (const file of files) {
		try {
			const content = await fs.readFile(file, 'utf-8')
			const report = detectLegacyUsage(content, source)

			if (report.totalIssues > 0) {
				results.push({ file, report })
			}
		} catch {
			// Skip files that can't be read
		}
	}

	return results
}

function combineReports(results: FileAnalysisResult[]): CombinedReport {
	const combinedReport: ReturnType<typeof detectLegacyUsage> = {
		deprecatedAPIs: [],
		breakingChanges: [],
		warnings: [],
		suggestions: [],
		totalIssues: 0,
		severity: 'low',
	}

	for (const result of results) {
		const relativePath = path.relative(process.cwd(), result.file)

		combinedReport.deprecatedAPIs.push(
			...result.report.deprecatedAPIs.map(api => ({
				...api,
				location: `${relativePath}:${api.location}`,
			})),
		)

		combinedReport.breakingChanges.push(
			...result.report.breakingChanges.map(bc => ({
				...bc,
				location: `${relativePath}:${bc.location}`,
			})),
		)

		combinedReport.warnings.push(
			...result.report.warnings.map(w => ({
				...w,
				location: `${relativePath}:${w.location}`,
			})),
		)

		combinedReport.suggestions.push(
			...result.report.suggestions.map(s => ({
				...s,
				location: `${relativePath}:${s.location}`,
			})),
		)

		combinedReport.totalIssues += result.report.totalIssues
	}

	// Recalculate severity
	if (combinedReport.totalIssues > 10 || combinedReport.breakingChanges.some(bc => bc.type === 'api')) {
		combinedReport.severity = 'high'
	} else if (combinedReport.totalIssues > 5 || combinedReport.breakingChanges.length > 0) {
		combinedReport.severity = 'medium'
	}

	return { report: combinedReport, fileReports: results }
}

function displaySummary(combined: CombinedReport, options: MigrateOptions): void {
	const { report } = combined

	console.log(chalk.bold('\nSummary:'))
	console.log(chalk.gray(`  Source: ${options.from || 'directix-v1'}`))
	console.log(chalk.gray(`  Total issues: ${report.totalIssues}`))

	const severityColor = report.severity === 'high' ? chalk.red : report.severity === 'medium' ? chalk.yellow : chalk.green
	console.log(chalk.gray(`  Severity: ${severityColor(report.severity.toUpperCase())}`))

	if (report.deprecatedAPIs.length > 0) {
		console.log(chalk.yellow(`\n  Deprecated APIs: ${report.deprecatedAPIs.length}`))
		if (options.verbose) {
			const grouped = groupBy(report.deprecatedAPIs, 'name')
			for (const [name, apis] of Object.entries(grouped)) {
				console.log(chalk.gray(`    - ${name}: ${apis.length} occurrences`))
			}
		}
	}

	if (report.breakingChanges.length > 0) {
		console.log(chalk.red(`\n  Breaking Changes: ${report.breakingChanges.length}`))
		if (options.verbose) {
			for (const bc of report.breakingChanges) {
				console.log(chalk.gray(`    - ${bc.name}: ${bc.description}`))
			}
		}
	}

	if (report.suggestions.length > 0) {
		const autoFixable = report.suggestions.filter(s => s.autoFixable).length
		console.log(chalk.cyan(`\n  Suggestions: ${report.suggestions.length} (${autoFixable} auto-fixable)`))
	}
}

function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
	return array.reduce(
		(result, item) => {
			const groupKey = String(item[key])
			if (!result[groupKey]) {
				result[groupKey] = []
			}
			result[groupKey].push(item)
			return result
		},
		{} as Record<string, T[]>,
	)
}

async function applyMigrations(
	files: string[],
	options: MigrationOptions,
	verbose: boolean,
): Promise<{
	filesProcessed: number
	filesChanged: number
	totalChanges: number
	autoFixes: number
	manualFixes: number
	warnings: number
	errors: number
}> {
	const stats = {
		filesProcessed: 0,
		filesChanged: 0,
		totalChanges: 0,
		autoFixes: 0,
		manualFixes: 0,
		warnings: 0,
		errors: 0,
	}

	for (const file of files) {
		try {
			const content = await fs.readFile(file, 'utf-8')
			const result = migrate(content, options)

			stats.filesProcessed++

			if (result.changes.length > 0) {
				stats.filesChanged++
				stats.totalChanges += result.changes.length
				stats.autoFixes += result.changes.filter(c => c.type === 'replace').length

				if (!options.dryRun) {
					await fs.writeFile(file, result.code, 'utf-8')
				}

				if (verbose) {
					const relativePath = path.relative(process.cwd(), file)
					console.log(chalk.gray(`  Updated: ${relativePath} (${result.changes.length} changes)`))
				}
			}

			stats.warnings += result.warnings.length
		} catch {
			stats.errors++
		}
	}

	return stats
}
