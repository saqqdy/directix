import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = resolve(__dirname, '..')
const distDir = resolve(rootDir, 'dist')

const pkg = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf-8'))

const banner =
	`/*!\n` +
	` * ${pkg.name} v${pkg.version}\n` +
	` * ${pkg.description}\n` +
	` * (c) 2021-present saqqdy <https://github.com/saqqdy>\n` +
	` * Released under the MIT License.\n` +
	` */`

// Read vue-demi iife
let vueDemiCode = ''

try {
	const vueDemiPath = require.resolve('vue-demi/lib/index.iife.js', { paths: [rootDir] })

	vueDemiCode = readFileSync(vueDemiPath, 'utf-8')
	console.log('✓ Loaded vue-demi/lib/index.iife.js')
} catch (e) {
	console.warn('Warning: vue-demi/lib/index.iife.js not found, skipping injection:', e)
}

// Process IIFE file - inject vue-demi code after banner
const iifeFile = resolve(distDir, 'index.iife.js')
let iifeContent = readFileSync(iifeFile, 'utf-8')

// Remove existing banner from iife content (it's added by vite)
const bannerRegex = /^\/\*![\s\S]*?\*\//

if (bannerRegex.test(iifeContent)) {
	iifeContent = iifeContent.replace(bannerRegex, '').trimStart()
}

// Write IIFE with banner + vue-demi code + original content
writeFileSync(iifeFile, `${banner}\n${vueDemiCode}\n${iifeContent}`)
console.log('✓ Processed dist/index.iife.js')

// Minify IIFE
execSync(
	`npx terser ${iifeFile} -o ${resolve(distDir, 'index.iife.min.js')} --compress --mangle --comments false`,
	{ stdio: 'inherit', cwd: rootDir },
)

// Prepend banner to minified file
const minified = readFileSync(resolve(distDir, 'index.iife.min.js'), 'utf-8')

writeFileSync(resolve(distDir, 'index.iife.min.js'), `${banner}\n${minified}`)
console.log('✓ Generated dist/index.iife.min.js')

// Process ESM and CJS files - ensure banner is at the top
const mjsFile = resolve(distDir, 'index.mjs')
let mjsContent = readFileSync(mjsFile, 'utf-8')

if (!mjsContent.startsWith('/*!')) {
	// Remove existing banner if present
	mjsContent = mjsContent.replace(bannerRegex, '').trimStart()
	writeFileSync(mjsFile, `${banner}\n${mjsContent}`)
	console.log('✓ Processed dist/index.mjs')
}

const cjsFile = resolve(distDir, 'index.cjs')
let cjsContent = readFileSync(cjsFile, 'utf-8')

if (!cjsContent.startsWith('/*!')) {
	// Remove existing banner if present
	cjsContent = cjsContent.replace(bannerRegex, '').trimStart()
	writeFileSync(cjsFile, `${banner}\n${cjsContent}`)
	console.log('✓ Processed dist/index.cjs')
}
