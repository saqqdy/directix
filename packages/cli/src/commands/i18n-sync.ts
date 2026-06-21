import path from 'node:path'
import chalk from 'chalk'
import fs from 'fs-extra'
import { glob } from 'glob'

interface SyncOptions {
	base?: string
	target?: string
}

/**
 * Sync locale structure with base locale
 */
export async function syncLocale(options: SyncOptions): Promise<void> {
	const baseCode = options.base || 'en-US'
	const targetCode = options.target

	if (!targetCode) {
		console.log(chalk.red('Target locale is required. Use --target <locale>'))
		process.exit(1)
	}

	console.log(chalk.cyan('Directix i18n Sync'))
	console.log(chalk.gray(`Syncing ${targetCode} with base locale ${baseCode}...\n`))

	const cwd = process.cwd()

	// Find locale files
	const baseFile = await findLocaleFile(cwd, baseCode)
	const targetFile = await findLocaleFile(cwd, targetCode)

	if (!baseFile) {
		console.log(chalk.red(`Base locale file (${baseCode}) not found.`))
		process.exit(1)
	}

	if (!targetFile) {
		console.log(chalk.red(`Target locale file (${targetCode}) not found.`))
		process.exit(1)
	}

	// Load locale objects
	const baseObj = await loadLocale(baseFile)
	const targetObj = await loadLocale(targetFile)

	// Sync: add missing keys, remove extra keys
	const { synced, added, removed } = syncObjects(baseObj, targetObj)

	if (added.length === 0 && removed.length === 0) {
		console.log(chalk.green('Locale is already in sync. No changes needed.'))
		return
	}

	// Write back the target file
	await writeLocale(targetFile, targetCode, synced)

	console.log(chalk.green(`Synced ${targetCode} with ${baseCode}:`))
	if (added.length > 0) {
		console.log(chalk.cyan(`  Added ${added.length} missing keys (with TODO prefix):`))
		for (const key of added.slice(0, 10)) {
			console.log(chalk.gray(`    + ${key}`))
		}
		if (added.length > 10) {
			console.log(chalk.gray(`    ... and ${added.length - 10} more`))
		}
	}
	if (removed.length > 0) {
		console.log(chalk.yellow(`  Removed ${removed.length} extra keys:`))
		for (const key of removed.slice(0, 10)) {
			console.log(chalk.gray(`    - ${key}`))
		}
		if (removed.length > 10) {
			console.log(chalk.gray(`    ... and ${removed.length - 10} more`))
		}
	}

	console.log(chalk.green(`\nUpdated: ${path.relative(cwd, targetFile)}`))
}

async function findLocaleFile(cwd: string, localeCode: string): Promise<string | null> {
	const files = await glob([`packages/i18n/src/locales/${localeCode}.ts`], {
		cwd,
		absolute: true,
	})
	return files[0] || null
}

async function loadLocale(file: string): Promise<Record<string, any>> {
	// Use dynamic import to load the locale module
	const mod = await import(file)
	const exported = mod.default || mod[Object.keys(mod)[0]]
	if (exported && typeof exported === 'object') {
		return exported
	}
	return {}
}

function syncObjects(
	base: Record<string, any>,
	target: Record<string, any>,
	prefix = '',
): { synced: Record<string, any>, added: string[], removed: string[] } {
	const synced: Record<string, any> = { ...target }
	const added: string[] = []
	const removed: string[] = []

	// Add missing keys from base
	for (const [key, value] of Object.entries(base)) {
		const fullKey = prefix ? `${prefix}.${key}` : key

		if (!(key in synced)) {
			if (typeof value === 'object' && value !== null) {
				synced[key] = deepCloneWithTodo(value)
			} else {
				synced[key] = `TODO: ${value}`
			}
			added.push(fullKey)
		} else if (typeof value === 'object' && value !== null && typeof synced[key] === 'object' && synced[key] !== null) {
			const sub = syncObjects(value, synced[key], fullKey)
			synced[key] = sub.synced
			added.push(...sub.added)
			removed.push(...sub.removed)
		}
	}

	// Remove extra keys not in base
	for (const key of Object.keys(synced)) {
		const fullKey = prefix ? `${prefix}.${key}` : key

		if (!(key in base)) {
			delete synced[key]
			removed.push(fullKey)
		}
	}

	return { synced, added, removed }
}

function deepCloneWithTodo(obj: Record<string, any>): Record<string, any> {
	const result: Record<string, any> = {}

	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === 'object' && value !== null) {
			result[key] = deepCloneWithTodo(value)
		} else {
			result[key] = `TODO: ${value}`
		}
	}

	return result
}

async function writeLocale(file: string, localeCode: string, obj: Record<string, any>): Promise<void> {
	const varName = localeCode.replace(/-/g, '')
	const content = `import type { I18nMessages } from '../types'\n\nexport const ${varName}: I18nMessages = ${serializeObject(obj, 0)}\n`
	await fs.writeFile(file, content, 'utf-8')
}

function serializeObject(obj: Record<string, any>, indent: number): string {
	const pad = '\t'.repeat(indent)
	const innerPad = '\t'.repeat(indent + 1)
	const entries = Object.entries(obj)

	if (entries.length === 0) return '{}'

	const lines = entries.map(([key, value]) => {
		const safeKey = /^[\w$][\w$]*$/.test(key) ? key : `'${key}'`
		if (typeof value === 'object' && value !== null) {
			return `${innerPad}${safeKey}: ${serializeObject(value, indent + 1)}`
		}
		const escaped = String(value).replace(/\\/g, '\\\\').replace(/'/g, '\\\'')
		return `${innerPad}${safeKey}: '${escaped}'`
	})

	return `{\n${lines.join(',\n')},\n${pad}}`
}
