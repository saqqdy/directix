const { execFileSync } = require('node:child_process')
const fs = require('node:fs')

// Compile TypeScript files
function build(): void {
	const tscArgs = ['--outDir', 'dist', '--target', 'es2020', '--module', 'es2020', '--lib', 'es2020,dom']
	// Compile devtools.ts
	execFileSync('npx', ['tsc', 'devtools.ts', ...tscArgs], { stdio: 'inherit' })
	// Compile panel.ts
	execFileSync('npx', ['tsc', 'panel.ts', ...tscArgs], { stdio: 'inherit' })

	// Copy static files
	fs.copyFileSync('manifest.json', 'dist/manifest.json')
	fs.copyFileSync('devtools.html', 'dist/devtools.html')
	fs.copyFileSync('panel.html', 'dist/panel.html')

	if (!fs.existsSync('dist/icons')) fs.mkdirSync('dist/icons', { recursive: true })

	// eslint-disable-next-line no-console
	console.log('✅ DevTools extension built to dist/')
}

build()
