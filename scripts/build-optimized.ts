/**
 * Bundle optimization build script
 * Generates optimized individual directive builds for tree-shaking
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = resolve(__dirname, '..')
const distDir = resolve(rootDir, 'dist')

const pkg = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf-8'))

const banner
	= `/*!\n`
		+ ` * ${pkg.name} v${pkg.version}\n`
		+ ` * ${pkg.description}\n`
		+ ` * (c) 2021-present saqqdy <https://github.com/saqqdy>\n`
		+ ` * Released under the MIT License.\n`
		+ ` */`

interface BuildTarget {
	entry: string
	output: string
	external?: string[]
}

// Individual directive builds for optimal tree-shaking
const directiveTargets: BuildTarget[] = [
	{ entry: 'src/directives/click-outside/index.ts', output: 'click-outside' },
	{ entry: 'src/directives/copy/index.ts', output: 'copy' },
	{ entry: 'src/directives/debounce/index.ts', output: 'debounce' },
	{ entry: 'src/directives/throttle/index.ts', output: 'throttle' },
	{ entry: 'src/directives/lazy/index.ts', output: 'lazy' },
	{ entry: 'src/directives/permission/index.ts', output: 'permission' },
	{ entry: 'src/directives/long-press/index.ts', output: 'long-press' },
	{ entry: 'src/directives/hover/index.ts', output: 'hover' },
	{ entry: 'src/directives/focus/index.ts', output: 'focus' },
	{ entry: 'src/directives/ripple/index.ts', output: 'ripple' },
	{ entry: 'src/directives/scroll/index.ts', output: 'scroll' },
	{ entry: 'src/directives/resize/index.ts', output: 'resize' },
	{ entry: 'src/directives/intersect/index.ts', output: 'intersect' },
	{ entry: 'src/directives/infinite-scroll/index.ts', output: 'infinite-scroll' },
	{ entry: 'src/directives/sticky/index.ts', output: 'sticky' },
	{ entry: 'src/directives/mask/index.ts', output: 'mask' },
	{ entry: 'src/directives/sanitize/index.ts', output: 'sanitize' },
	{ entry: 'src/directives/loading/index.ts', output: 'loading' },
	{ entry: 'src/directives/visible/index.ts', output: 'visible' },
	{ entry: 'src/directives/mutation/index.ts', output: 'mutation' },
	{ entry: 'src/directives/tooltip/index.ts', output: 'tooltip' },
	{ entry: 'src/directives/draggable/index.ts', output: 'draggable' },
	{ entry: 'src/directives/touch/index.ts', output: 'touch' },
	{ entry: 'src/directives/image-preview/index.ts', output: 'image-preview' },
	{ entry: 'src/directives/truncate/index.ts', output: 'truncate' },
	{ entry: 'src/directives/uppercase/index.ts', output: 'uppercase' },
	{ entry: 'src/directives/lowercase/index.ts', output: 'lowercase' },
	{ entry: 'src/directives/capitalcase/index.ts', output: 'capitalcase' },
	{ entry: 'src/directives/trim/index.ts', output: 'trim' },
	{ entry: 'src/directives/number/index.ts', output: 'number' },
	{ entry: 'src/directives/money/index.ts', output: 'money' },
	{ entry: 'src/directives/skeleton/index.ts', output: 'skeleton' },
]

// Core modules
const coreTargets: BuildTarget[] = [
	{ entry: 'packages/core/src/index.ts', output: 'core' },
	{ entry: 'packages/shared/src/index.ts', output: 'shared' },
	{ entry: 'packages/i18n/src/index.ts', output: 'i18n' },
]

// Composables
const composableTargets: BuildTarget[] = [
	{ entry: 'src/composables/index.ts', output: 'composables' },
]

function ensureDir(dir: string) {
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true })
	}
}

function buildTarget(target: BuildTarget, outputDir: string) {
	const entryPath = resolve(rootDir, target.entry)

	if (!existsSync(entryPath)) {
		console.log(`  ⚠ Skipping ${target.output} - entry not found`)
		return false
	}

	const outFile = join(outputDir, `${target.output}.mjs`)

	try {
		// Build ESM
		execSync(
			`npx esbuild ${entryPath} --bundle --format=esm --outfile=${outFile} --external:vue --external:@nuxt/kit --external:@nuxt/schema --tree-shaking=true --minify-syntax --minify-identifiers`,
			{ stdio: 'pipe', cwd: rootDir },
		)

		// Prepend banner
		const content = readFileSync(outFile, 'utf-8')
		writeFileSync(outFile, `${banner}\n${content}`)

		console.info(`  ✓ Built ${target.output}.mjs`)
		return true
	} catch {
		console.info(`  ⚠ Failed to build ${target.output}`)
		return false
	}
}

function generateSizeReport() {
	console.log('\n📊 Bundle Size Report:')
	console.log('─'.repeat(50))

	const mainFiles = ['index.mjs', 'index.cjs', 'index.iife.min.js']

	for (const file of mainFiles) {
		const filePath = resolve(distDir, file)
		if (existsSync(filePath)) {
			const stats = execSync(`wc -c < ${filePath}`, { encoding: 'utf-8' }).trim()
			const sizeKB = (parseInt(stats, 10) / 1024).toFixed(1)
			console.log(`  ${file}: ${sizeKB} KB`)
		}
	}

	// Check individual directives
	const directivesDir = resolve(distDir, 'directives')
	if (existsSync(directivesDir)) {
		console.log('\n  Individual Directives:')
		const files = execSync(`ls ${directivesDir}/*.mjs 2>/dev/null || true`, { encoding: 'utf-8' })
			.trim()
			.split('\n')
			.filter(Boolean)

		for (const file of files.slice(0, 5)) {
			const stats = execSync(`wc -c < ${file}`, { encoding: 'utf-8' }).trim()
			const sizeKB = (parseInt(stats, 10) / 1024).toFixed(2)
			const name = file.split('/').pop()
			console.log(`    ${name}: ${sizeKB} KB`)
		}
		if (files.length > 5) {
			console.log(`    ... and ${files.length - 5} more`)
		}
	}

	console.log('─'.repeat(50))
}

function main() {
	console.log('🚀 Building optimized bundles...\n')

	// Clean dist
	if (existsSync(distDir)) {
		rmSync(distDir, { recursive: true })
	}
	ensureDir(distDir)

	// Build main bundle
	console.info('📦 Building main bundle...')
	try {
		execSync('npx vite build', { stdio: 'inherit', cwd: rootDir })
		console.info('  ✓ Main bundle built\n')
	} catch {
		console.error('  ✗ Failed to build main bundle')
		process.exit(1)
	}

	// Build individual directives
	console.log('📦 Building individual directives...')
	const directivesDir = resolve(distDir, 'directives')
	ensureDir(directivesDir)

	let builtCount = 0
	for (const target of directiveTargets) {
		if (buildTarget(target, directivesDir)) {
			builtCount++
		}
	}
	console.log(`  Built ${builtCount}/${directiveTargets.length} directives\n`)

	// Build core packages
	console.log('📦 Building core packages...')
	const packagesDir = resolve(distDir, 'packages')
	ensureDir(packagesDir)

	for (const target of coreTargets) {
		buildTarget(target, packagesDir)
	}

	// Build composables
	console.log('\n📦 Building composables...')
	buildTarget(composableTargets[0], distDir)

	// Generate size report
	generateSizeReport()

	console.log('\n✅ Build complete!')
}

main()
