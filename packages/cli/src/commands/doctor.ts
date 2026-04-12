import path from 'node:path'
import chalk from 'chalk'
import fs from 'fs-extra'

interface CheckResult {
	name: string
	status: 'ok' | 'warning' | 'error'
	message: string
}

export async function doctor(): Promise<void> {
	console.log(chalk.cyan('Directix Doctor'))
	console.log(chalk.gray('Checking your Directix setup...\n'))

	const results: CheckResult[] = []

	// Check Node.js version
	const nodeVersion = process.version
	const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10)
	results.push({
		name: 'Node.js version',
		status: majorVersion >= 16 ? 'ok' : 'warning',
		message: `${nodeVersion} (recommended: 18+)`,
	})

	// Check package.json exists
	const cwd = process.cwd()
	const packageJsonPath = path.join(cwd, 'package.json')
	const hasPackageJson = await fs.pathExists(packageJsonPath)
	results.push({
		name: 'package.json',
		status: hasPackageJson ? 'ok' : 'error',
		message: hasPackageJson ? 'Found' : 'Not found',
	})

	// Check for Vue
	if (hasPackageJson) {
		try {
			const packageJson = await fs.readJson(packageJsonPath)
			const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }

			const vueVersion = deps.vue
			results.push({
				name: 'Vue',
				status: vueVersion ? 'ok' : 'warning',
				message: vueVersion || 'Not found',
			})

			const directixVersion = deps.directix
			results.push({
				name: 'Directix',
				status: directixVersion ? 'ok' : 'warning',
				message: directixVersion || 'Not found',
			})
		} catch {
			results.push({
				name: 'package.json',
				status: 'error',
				message: 'Failed to parse',
			})
		}
	}

	// Check for src directory
	const srcPath = path.join(cwd, 'src')
	const hasSrc = await fs.pathExists(srcPath)
	results.push({
		name: 'src directory',
		status: hasSrc ? 'ok' : 'warning',
		message: hasSrc ? 'Found' : 'Not found',
	})

	// Check for directives directory
	if (hasSrc) {
		const directivesPath = path.join(srcPath, 'directives')
		const hasDirectives = await fs.pathExists(directivesPath)
		results.push({
			name: 'src/directives',
			status: hasDirectives ? 'ok' : 'warning',
			message: hasDirectives ? 'Found' : 'Not found',
		})
	}

	// Print results
	for (const result of results) {
		const statusIcon = result.status === 'ok' ? chalk.green('✓') : result.status === 'warning' ? chalk.yellow('⚠') : chalk.red('✗')
		console.log(`${statusIcon} ${chalk.bold(result.name)}: ${result.message}`)
	}

	// Summary
	const errors = results.filter(r => r.status === 'error').length
	const warnings = results.filter(r => r.status === 'warning').length

	console.log()
	if (errors > 0) {
		console.log(chalk.red(`Found ${errors} error(s) and ${warnings} warning(s)`))
		process.exit(1)
	} else if (warnings > 0) {
		console.log(chalk.yellow(`Found ${warnings} warning(s)`))
	} else {
		console.log(chalk.green('All checks passed!'))
	}
}
