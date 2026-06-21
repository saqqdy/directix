import path from 'node:path'
import chalk from 'chalk'
import fs from 'fs-extra'
import { glob } from 'glob'

interface ExtractOptions {
	output?: string
}

interface ExtractedMessage {
	key: string
	value: string
	file: string
	line: number
}

/**
 * Extract translation messages from source files
 */
export async function extractMessages(options: ExtractOptions): Promise<void> {
	console.log(chalk.cyan('Directix i18n Extract'))
	console.log(chalk.gray('Scanning source files for translation keys...\n'))

	const cwd = process.cwd()

	// Find all source files in packages/*/src
	const files = await findSourceFiles(cwd)

	if (files.length === 0) {
		console.log(chalk.yellow('No source files found to scan.'))
		return
	}

	console.log(chalk.gray(`Found ${files.length} files to scan.\n`))

	// Extract messages from all files
	const messages = await extractFromFile(files)

	if (messages.length === 0) {
		console.log(chalk.yellow('No translation messages found.'))
		return
	}

	// Deduplicate by key+value
	const uniqueMessages = deduplicateMessages(messages)

	console.log(chalk.green(`Extracted ${uniqueMessages.length} unique translation messages.`))

	// Build output
	const output = uniqueMessages.map(({ key, value }) => ({
		key,
		value,
		locations: messages
			.filter(m => m.key === key && m.value === value)
			.map(m => ({ file: path.relative(cwd, m.file), line: m.line })),
	}))

	// Write output
	const outputPath = options.output || 'i18n-extracted.json'
	await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8')
	console.log(chalk.green(`\nOutput saved to: ${outputPath}`))
}

async function findSourceFiles(cwd: string): Promise<string[]> {
	const patterns = ['packages/*/src/**/*.{vue,js,ts,jsx,tsx}']

	return glob(patterns, {
		cwd,
		absolute: true,
		ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
	})
}

async function extractFromFile(files: string[]): Promise<ExtractedMessage[]> {
	const messages: ExtractedMessage[] = []
	// Match translation patterns: warn("..."), error("..."), t("..."), $t("...")
	const pattern = /(?:warn|error|t|\$t)\(\s*['"`]([^'"`]+)['"`]/g

	for (const file of files) {
		try {
			const content = await fs.readFile(file, 'utf-8')
			const lines = content.split('\n')

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i]

				pattern.lastIndex = 0
				for (let match = pattern.exec(line); match !== null; match = pattern.exec(line)) {
					messages.push({
						key: match[1],
						value: match[1],
						file,
						line: i + 1,
					})
				}
			}
		} catch {
			// Skip files that can't be read
		}
	}

	return messages
}

function deduplicateMessages(messages: ExtractedMessage[]): ExtractedMessage[] {
	const seen = new Set<string>()
	const unique: ExtractedMessage[] = []

	for (const msg of messages) {
		const key = `${msg.key}::${msg.value}`
		if (!seen.has(key)) {
			seen.add(key)
			unique.push(msg)
		}
	}

	return unique
}
