#!/usr/bin/env node
import { cac } from 'cac'
import chalk from 'chalk'
import { createComposable } from './commands/create-composable.js'
import { createDirective } from './commands/create-directive.js'
import { doctor } from './commands/doctor.js'
import { initProject } from './commands/init.js'
import { runMigrate } from './commands/migrate.js'

const cli = cac('directix')

// Global version
cli
	.version('1.0.0')
	.help()

// Create command
cli
	.command('create <type> <name>', 'Create a new directive or composable')
	.option('-f, --force', 'Overwrite existing files')
	.example('directix create directive v-my-directive')
	.example('directix create composable useMyFeature')
	.action(async (type: string, name: string, options: { force?: boolean }) => {
		if (type === 'directive') {
			await createDirective(name, options)
		} else if (type === 'composable') {
			await createComposable(name, options)
		} else {
			console.log(chalk.red(`Unknown type: ${type}. Use 'directive' or 'composable'.`))
			process.exit(1)
		}
	})

// Init command
cli
	.command('init [name]', 'Initialize a new Directix project')
	.option('-t, --template <template>', 'Project template (vue2, vue3, nuxt)', { default: 'vue3' })
	.example('directix init my-project')
	.example('directix init my-project --template nuxt')
	.action(async (name: string | undefined, options: { template: string }) => {
		await initProject(name, options)
	})

// Doctor command
cli
	.command('doctor', 'Check your Directix setup')
	.action(async () => {
		await doctor()
	})

// Migrate command
cli
	.command('migrate', 'Migrate from older versions or other libraries')
	.option('-f, --from <library>', 'Source library (directix-v1, vueuse, v-directives)')
	.option('-d, --dry-run', 'Show changes without applying them')
	.option('-v, --verbose', 'Show detailed output')
	.option('-o, --output <file>', 'Output report to file')
	.option('--format <format>', 'Report format (text, json, markdown)', { default: 'text' })
	.example('directix migrate')
	.example('directix migrate --from vueuse --dry-run')
	.example('directix migrate --output report.md --format markdown')
	.action(async (options: {
		from?: string
		dryRun?: boolean
		verbose?: boolean
		output?: string
		format?: 'text' | 'json' | 'markdown'
	}) => {
		await runMigrate(options)
	})

// i18n commands
cli
	.command('i18n:extract', 'Extract translation messages from source')
	.option('--output <file>', 'Output file path', { default: 'i18n-extracted.json' })
	.action(async options => {
		const { extractMessages } = await import('./commands/i18n-extract.js')
		await extractMessages(options)
	})

cli
	.command('i18n:validate', 'Validate locale completeness')
	.option('--locale <code>', 'Validate specific locale')
	.option('--threshold <num>', 'Minimum coverage threshold', { default: 90 })
	.action(async options => {
		const { validateLocales } = await import('./commands/i18n-validate.js')
		await validateLocales(options)
	})

cli
	.command('i18n:sync', 'Sync locale structure with base')
	.option('--base <locale>', 'Base locale', { default: 'en-US' })
	.option('--target <locale>', 'Target locale to sync')
	.action(async options => {
		const { syncLocale } = await import('./commands/i18n-sync.js')
		await syncLocale(options)
	})

cli.parse()
