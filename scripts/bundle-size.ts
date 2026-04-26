/**
 * Bundle Size Monitor and Reporter
 * Tracks and reports bundle sizes for optimization
 */
import { execSync } from 'node:child_process'
import { existsSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = resolve(__dirname, '..')
const distDir = resolve(rootDir, 'dist')

interface SizeInfo {
	file: string
	size: number
	sizeFormatted: string
	gzipSize?: number
	gzipFormatted?: string
	target?: string
	status: 'pass' | 'warning' | 'fail'
}

// Size targets (in KB)
const SIZE_TARGETS: Record<string, { maxSize: number, warningSize: number }> = {
	'index.mjs': { maxSize: 30, warningSize: 25 },
	'index.cjs': { maxSize: 30, warningSize: 25 },
	'index.iife.min.js': { maxSize: 25, warningSize: 20 },
	'composables.mjs': { maxSize: 10, warningSize: 8 },
	'directives/*.mjs': { maxSize: 2, warningSize: 1.5 },
	'packages/core.mjs': { maxSize: 5, warningSize: 4 },
	'packages/shared.mjs': { maxSize: 5, warningSize: 4 },
}

function getFileSize(filePath: string): number {
	if (!existsSync(filePath)) return 0
	const stats = execSync(`wc -c < ${filePath}`, { encoding: 'utf-8' }).trim()
	return parseInt(stats, 10)
}

function getGzipSize(filePath: string): number {
	if (!existsSync(filePath)) return 0
	try {
		const stats = execSync(`gzip -c ${filePath} | wc -c`, { encoding: 'utf-8' }).trim()
		return parseInt(stats, 10)
	} catch {
		return 0
	}
}

function formatSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function checkStatus(file: string, sizeKB: number): 'pass' | 'warning' | 'fail' {
	// Check specific file targets
	for (const [pattern, targets] of Object.entries(SIZE_TARGETS)) {
		if (pattern.includes('*')) {
			// Wildcard pattern for directives
			if (file.includes('directives/') && file.endsWith('.mjs')) {
				if (sizeKB > targets.maxSize) return 'fail'
				if (sizeKB > targets.warningSize) return 'warning'
				return 'pass'
			}
		} else if (file.endsWith(pattern) || file === pattern) {
			if (sizeKB > targets.maxSize) return 'fail'
			if (sizeKB > targets.warningSize) return 'warning'
			return 'pass'
		}
	}

	// Default targets
	if (sizeKB > 50) return 'fail'
	if (sizeKB > 30) return 'warning'
	return 'pass'
}

function analyzeBundle(): SizeInfo[] {
	const results: SizeInfo[] = []

	// Main bundle files
	const mainFiles = ['index.mjs', 'index.cjs', 'index.iife.min.js']

	for (const file of mainFiles) {
		const filePath = resolve(distDir, file)
		if (existsSync(filePath)) {
			const size = getFileSize(filePath)
			const gzipSize = getGzipSize(filePath)
			const sizeKB = size / 1024

			results.push({
				file,
				size,
				sizeFormatted: formatSize(size),
				gzipSize,
				gzipFormatted: formatSize(gzipSize),
				status: checkStatus(file, sizeKB),
			})
		}
	}

	// Package files
	const packagesDir = resolve(distDir, 'packages')
	if (existsSync(packagesDir)) {
		const files = execSync(`find ${packagesDir} -name "*.mjs"`, { encoding: 'utf-8' })
			.trim()
			.split('\n')
			.filter(Boolean)

		for (const filePath of files) {
			const file = `packages/${filePath.split('/').pop()}`
			const size = getFileSize(filePath)
			const gzipSize = getGzipSize(filePath)
			const sizeKB = size / 1024

			results.push({
				file,
				size,
				sizeFormatted: formatSize(size),
				gzipSize,
				gzipFormatted: formatSize(gzipSize),
				status: checkStatus(file, sizeKB),
			})
		}
	}

	// Directive files
	const directivesDir = resolve(distDir, 'directives')
	if (existsSync(directivesDir)) {
		const files = execSync(`find ${directivesDir} -name "*.mjs"`, { encoding: 'utf-8' })
			.trim()
			.split('\n')
			.filter(Boolean)
			.sort()

		for (const filePath of files) {
			const file = `directives/${filePath.split('/').pop()}`
			const size = getFileSize(filePath)
			const gzipSize = getGzipSize(filePath)
			const sizeKB = size / 1024

			results.push({
				file,
				size,
				sizeFormatted: formatSize(size),
				gzipSize,
				gzipFormatted: formatSize(gzipSize),
				status: checkStatus(file, sizeKB),
			})
		}
	}

	// Composables
	const composablesFile = resolve(distDir, 'composables.mjs')
	if (existsSync(composablesFile)) {
		const size = getFileSize(composablesFile)
		const gzipSize = getGzipSize(composablesFile)
		const sizeKB = size / 1024

		results.push({
			file: 'composables.mjs',
			size,
			sizeFormatted: formatSize(size),
			gzipSize,
			gzipFormatted: formatSize(gzipSize),
			status: checkStatus('composables.mjs', sizeKB),
		})
	}

	return results
}

function printReport(results: SizeInfo[]) {
	console.log('\n📊 Bundle Size Report')
	console.log('='.repeat(60))

	// Summary
	const totalSize = results.reduce((sum, r) => sum + r.size, 0)
	const totalGzip = results.reduce((sum, r) => sum + (r.gzipSize || 0), 0)
	const passCount = results.filter(r => r.status === 'pass').length
	const warnCount = results.filter(r => r.status === 'warning').length
	const failCount = results.filter(r => r.status === 'fail').length

	console.log(`\nTotal: ${formatSize(totalSize)} (${formatSize(totalGzip)} gzip)`)
	console.log(`Files: ${results.length} (${passCount} pass, ${warnCount} warning, ${failCount} fail)`)

	// Main bundles
	console.log('\n📦 Main Bundle:')
	console.log('─'.repeat(60))
	const mainResults = results.filter(r => !r.file.includes('/'))
	for (const r of mainResults) {
		const icon = r.status === 'pass' ? '✓' : r.status === 'warning' ? '⚠' : '✗'
		const color = r.status === 'pass' ? '\x1B[32m' : r.status === 'warning' ? '\x1B[33m' : '\x1B[31m'
		console.log(`  ${color}${icon}\x1B[0m ${r.file}: ${r.sizeFormatted} (${r.gzipFormatted} gzip)`)
	}

	// Packages
	const packageResults = results.filter(r => r.file.startsWith('packages/'))
	if (packageResults.length > 0) {
		console.log('\n📦 Core Packages:')
		console.log('─'.repeat(60))
		for (const r of packageResults) {
			const icon = r.status === 'pass' ? '✓' : r.status === 'warning' ? '⚠' : '✗'
			const color = r.status === 'pass' ? '\x1B[32m' : r.status === 'warning' ? '\x1B[33m' : '\x1B[31m'
			console.log(`  ${color}${icon}\x1B[0m ${r.file}: ${r.sizeFormatted} (${r.gzipFormatted} gzip)`)
		}
	}

	// Directives summary
	const directiveResults = results.filter(r => r.file.startsWith('directives/'))
	if (directiveResults.length > 0) {
		console.log('\n📦 Individual Directives:')
		console.log('─'.repeat(60))

		// Show largest and smallest
		const sorted = [...directiveResults].sort((a, b) => b.size - a.size)
		const largest = sorted.slice(0, 3)
		const smallest = sorted.slice(-3).reverse()

		console.log('  Largest:')
		for (const r of largest) {
			const icon = r.status === 'pass' ? '✓' : r.status === 'warning' ? '⚠' : '✗'
			const color = r.status === 'pass' ? '\x1B[32m' : r.status === 'warning' ? '\x1B[33m' : '\x1B[31m'
			console.log(`    ${color}${icon}\x1B[0m ${r.file}: ${r.sizeFormatted}`)
		}

		console.log('  Smallest:')
		for (const r of smallest) {
			const icon = r.status === 'pass' ? '✓' : '⚠'
			const color = r.status === 'pass' ? '\x1B[32m' : '\x1B[33m'
			console.log(`    ${color}${icon}\x1B[0m ${r.file}: ${r.sizeFormatted}`)
		}

		console.log(`  Total: ${directiveResults.length} directives`)
	}

	// Failures
	if (failCount > 0) {
		console.log('\n❌ Files exceeding size limits:')
		console.log('─'.repeat(60))
		for (const r of results.filter(r => r.status === 'fail')) {
			console.log(`  ${r.file}: ${r.sizeFormatted} - exceeds limit`)
		}
	}

	console.log(`\n${'='.repeat(60)}`)
}

function generateJsonReport(results: SizeInfo[]): object {
	return {
		timestamp: new Date().toISOString(),
		summary: {
			totalFiles: results.length,
			totalSize: results.reduce((sum, r) => sum + r.size, 0),
			totalGzip: results.reduce((sum, r) => sum + (r.gzipSize || 0), 0),
			passCount: results.filter(r => r.status === 'pass').length,
			warningCount: results.filter(r => r.status === 'warning').length,
			failCount: results.filter(r => r.status === 'fail').length,
		},
		files: results.map(r => ({
			file: r.file,
			size: r.size,
			sizeFormatted: r.sizeFormatted,
			gzipSize: r.gzipSize,
			gzipFormatted: r.gzipFormatted,
			status: r.status,
		})),
	}
}

function main() {
	if (!existsSync(distDir)) {
		console.error('❌ dist directory not found. Run build first.')
		process.exit(1)
	}

	const results = analyzeBundle()
	printReport(results)

	// Save JSON report
	const report = generateJsonReport(results)
	const reportPath = resolve(distDir, 'bundle-size-report.json')
	writeFileSync(reportPath, JSON.stringify(report, null, 2))
	console.log(`\n📄 Report saved to: ${reportPath}`)

	// Exit with error if any failures
	const failCount = results.filter(r => r.status === 'fail').length
	if (failCount > 0) {
		console.log(`\n❌ ${failCount} file(s) exceed size limits`)
		process.exit(1)
	}
}

main()
