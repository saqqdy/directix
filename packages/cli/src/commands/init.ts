import path from 'node:path'
import chalk from 'chalk'
import fs from 'fs-extra'
import ora from 'ora'
import prompts from 'prompts'

interface Options {
	template: string
}

const VUE3_TEMPLATE = {
	'package.json': JSON.stringify({
		name: 'my-directix-project',
		type: 'module',
		version: '1.0.0',
		scripts: {
			dev: 'vite',
			build: 'vite build',
		},
		dependencies: {
			directix: 'latest',
			vue: '^3.4.0',
		},
		devDependencies: {
			'@vitejs/plugin-vue': '^5.0.0',
			vite: '^5.0.0',
		},
	}, null, 2),
	'vite.config.js': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
`,
	'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Directix Project</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
`,
	'src/main.js': `import { createApp } from 'vue'
import Directix from 'directix'
import App from './App.vue'

import 'directix/style.css'

const app = createApp(App)
app.use(Directix)
app.mount('#app')
`,
	'src/App.vue': `<template>
  <div class="container">
    <h1>Directix Demo</h1>

    <h2>v-copy</h2>
    <button v-copy="'Hello, Directix!'">Copy Text</button>

    <h2>v-debounce</h2>
    <input v-debounce="{ handler: handleInput, wait: 300 }" placeholder="Type to test debounce" />

    <h2>v-throttle</h2>
    <button v-throttle="{ handler: handleClick, limit: 500 }">Click (throttled)</button>

    <h2>v-focus</h2>
    <input v-focus placeholder="Auto-focused" />
  </div>
</template>

<script setup>
function handleInput(value) {
  console.log('Debounced input:', value)
}

function handleClick() {
  console.log('Throttled click')
}
</script>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h1, h2 {
  color: #333;
}

input, button {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
}
</style>
`,
}

const NUXT_TEMPLATE = {
	'package.json': JSON.stringify({
		name: 'my-directix-nuxt',
		version: '1.0.0',
		scripts: {
			dev: 'nuxt dev',
			build: 'nuxt build',
			generate: 'nuxt generate',
		},
		dependencies: {
			directix: 'latest',
			nuxt: '^3.10.0',
		},
	}, null, 2),
	'nuxt.config.ts': `// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['directix/nuxt'],
})
`,
	'app.vue': `<template>
  <div class="container">
    <h1>Directix + Nuxt Demo</h1>

    <button v-copy="'Hello from Nuxt!'">Copy Text</button>
  </div>
</template>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
`,
}

export async function initProject(name: string | undefined, options: Options): Promise<void> {
	// Prompt for name if not provided
	if (!name) {
		const response = await prompts({
			name: 'projectName',
			type: 'text',
			message: 'Project name:',
			initial: 'my-directix-project',
		})
		name = response.projectName
	}

	// Exit if name is still undefined (user cancelled prompt)
	if (!name) {
		console.log(chalk.red('Project name is required'))
		process.exit(1)
	}

	const spinner = ora(`Initializing project ${name}...`).start()

	try {
		const cwd = process.cwd()
		const projectPath = path.join(cwd, name)

		// Check if directory exists
		if (await fs.pathExists(projectPath)) {
			spinner.fail(chalk.red(`Directory already exists: ${projectPath}`))
			process.exit(1)
		}

		// Get template
		const template = options.template === 'nuxt' ? NUXT_TEMPLATE : VUE3_TEMPLATE

		// Create project directory
		await fs.ensureDir(projectPath)

		// Write template files
		for (const [filePath, content] of Object.entries(template)) {
			const fullPath = path.join(projectPath, filePath)
			await fs.ensureDir(path.dirname(fullPath))
			await fs.writeFile(fullPath, content)
		}

		spinner.succeed(chalk.green(`Project created: ${projectPath}`))

		console.log()
		console.log(chalk.cyan('Next steps:'))
		console.log(chalk.gray(`  cd ${name}`))
		console.log(chalk.gray(`  pnpm install`))
		console.log(chalk.gray(`  pnpm dev`))
		console.log()
		console.log(chalk.cyan('Documentation:'))
		console.log(chalk.gray('  https://directix.saqqdy.com'))
	} catch (error) {
		spinner.fail(chalk.red(`Failed to initialize project: ${error}`))
		process.exit(1)
	}
}
