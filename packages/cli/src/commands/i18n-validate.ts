import path from 'node:path'
import chalk from 'chalk'
import { glob } from 'glob'

interface ValidateOptions {
	locale?: string
	threshold?: number
}

interface FlatEntry {
	key: string
	value: string
}

interface LocaleReport {
	locale: string
	missing: string[]
	extra: string[]
	coverage: number
	keys: FlatEntry[]
}

/**
 * Validate locale completeness against base locale
 */
export async function validateLocales(options: ValidateOptions): Promise<void> {
	console.log(chalk.cyan('Directix i18n Validate'))
	console.log(chalk.gray('Checking locale completeness...\n'))

	const cwd = process.cwd()

	// Find all locale files
	const localeFiles = await findLocaleFiles(cwd)

	if (localeFiles.length === 0) {
		console.log(chalk.yellow('No locale files found.'))
		return
	}

	// Load all locales
	const locales = await loadLocales(localeFiles)

	if (!locales['en-US']) {
		console.log(chalk.red('Base locale (en-US) not found.'))
		process.exit(1)
	}

	const baseKeys = flattenKeys(locales['en-US'])
	const baseKeySet = new Set(baseKeys.map(e => e.key))

	console.log(chalk.gray(`Base locale (en-US) has ${baseKeySet.size} keys.\n`))

	// Filter to specific locale if requested
	const targets = options.locale ? [options.locale] : Object.keys(locales).filter(l => l !== 'en-US')
	let hasFailure = false

	for (const localeCode of targets) {
		if (!locales[localeCode]) {
			console.log(chalk.yellow(`Locale ${localeCode} not found.`))
			continue
		}

		const report = validateAgainstBase(locales[localeCode], localeCode, baseKeySet)
		displayReport(report)

		const threshold = options.threshold ?? 90
		if (report.coverage < threshold) {
			hasFailure = true
		}
	}

	if (hasFailure) {
		console.log(chalk.red(`\nCoverage below threshold (${options.threshold ?? 90}%).`))
		process.exit(1)
	} else {
		console.log(chalk.green('\nAll locales meet the coverage threshold.'))
	}
}

async function findLocaleFiles(cwd: string): Promise<string[]> {
	return glob(['packages/i18n/src/locales/*.ts'], {
		cwd,
		absolute: true,
		ignore: ['**/node_modules/**', '**/dist/**'],
	})
}

async function loadLocales(files: string[]): Promise<Record<string, Record<string, any>>> {
	const locales: Record<string, Record<string, any>> = {}

	for (const file of files) {
		try {
			const localeCode = path.basename(file, '.ts')

			// Use dynamic import to load the locale module
			const mod = await import(file)
			const exported = mod.default || mod[Object.keys(mod)[0]]
			if (exported && typeof exported === 'object') {
				locales[localeCode] = exported
			}
		} catch {
			// Skip files that can't be loaded
		}
	}

	return locales
}

function flattenKeys(obj: Record<string, any>, prefix = ''): FlatEntry[] {
	const entries: FlatEntry[] = []

	for (const [key, value] of Object.entries(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key
		if (typeof value === 'object' && value !== null) {
			entries.push(...flattenKeys(value, fullKey))
		} else {
			entries.push({ key: fullKey, value: String(value) })
		}
	}

	return entries
}

function validateAgainstBase(
	locale: Record<string, any>,
	localeCode: string,
	baseKeySet: Set<string>,
): LocaleReport {
	const targetEntries = flattenKeys(locale)
	const targetKeySet = new Set(targetEntries.map(e => e.key))

	const missing: string[] = []
	for (const key of baseKeySet) {
		if (!targetKeySet.has(key)) {
			missing.push(key)
		}
	}

	const extra: string[] = []
	for (const key of targetKeySet) {
		if (!baseKeySet.has(key)) {
			extra.push(key)
		}
	}

	const coverage = baseKeySet.size > 0 ? ((baseKeySet.size - missing.length) / baseKeySet.size) * 100 : 100

	return {
		locale: localeCode,
		missing,
		extra,
		coverage: Math.round(coverage * 100) / 100,
		keys: targetEntries,
	}
}

function displayReport(report: LocaleReport): void {
	const statusIcon = report.coverage >= 90 ? chalk.green('✓') : report.coverage >= 70 ? chalk.yellow('⚠') : chalk.red('✗')

	console.log(`${statusIcon} ${chalk.bold(report.locale)}: ${chalk.gray(`${report.coverage}% coverage`)}`)

	if (report.missing.length > 0) {
		console.log(chalk.yellow(`  Missing keys (${report.missing.length}):`))
		for (const key of report.missing.slice(0, 10)) {
			console.log(chalk.gray(`    - ${key}`))
		}
		if (report.missing.length > 10) {
			console.log(chalk.gray(`    ... and ${report.missing.length - 10} more`))
		}
	}

	if (report.extra.length > 0) {
		console.log(chalk.blue(`  Extra keys (${report.extra.length}):`))
		for (const key of report.extra.slice(0, 5)) {
			console.log(chalk.gray(`    + ${key}`))
		}
		if (report.extra.length > 5) {
			console.log(chalk.gray(`    ... and ${report.extra.length - 5} more`))
		}
	}

	console.log()
}
