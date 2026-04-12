import path from 'node:path'
import chalk from 'chalk'
import fs from 'fs-extra'
import ora from 'ora'

interface Options {
	force?: boolean
}

const DIRECTIVE_TEMPLATE = `import { defineDirective } from 'directix'

/**
 * {name} directive options
 */
export interface {interfaceName}Options {
  /**
   * Whether to disable
   * @default false
   */
  disabled?: boolean
}

export type {name}Binding = boolean | {interfaceName}Options

/**
 * v-{kebabName} directive
 *
 * @example
 * \`\`\`vue
 * <template>
 *   <div v-{kebabName}="{ disabled: false }">Content</div>
 * </template>
 * \`\`\`
 */
export const {name} = defineDirective<{name}Binding, HTMLElement>({
  name: '{kebabName}',
  ssr: false,

  mounted(el, binding) {
    // Implementation here
    console.log('{kebabName} mounted', binding.value)
  },

  updated(el, binding) {
    // Update logic here
  },

  unmounted(el) {
    // Cleanup logic here
  },
})

export default {name}
`

export async function createDirective(name: string, options: Options): Promise<void> {
	const spinner = ora(`Creating directive ${name}...`).start()

	try {
		// Normalize name
		const kebabName = name.startsWith('v-') ? name.slice(2) : name
		const camelName = kebabToCamel(`v-${kebabName}`)
		const interfaceName = camelName.charAt(0).toUpperCase() + camelName.slice(1)

		// Determine file path
		const cwd = process.cwd()
		const filePath = path.join(cwd, 'src', 'directives', `${kebabName}.ts`)

		// Check if file exists
		if (await fs.pathExists(filePath) && !options.force) {
			spinner.fail(chalk.red(`File already exists: ${filePath}. Use --force to overwrite.`))
			process.exit(1)
		}

		// Ensure directory exists
		await fs.ensureDir(path.dirname(filePath))

		// Generate content
		const content = DIRECTIVE_TEMPLATE
			.replace(/{name}/g, camelName)
			.replace(/{interfaceName}/g, interfaceName)
			.replace(/{kebabName}/g, kebabName)

		// Write file
		await fs.writeFile(filePath, content)

		spinner.succeed(chalk.green(`Directive created: ${filePath}`))

		console.log()
		console.log(chalk.gray('Next steps:'))
		console.log(chalk.gray(`  1. Implement the directive logic in ${filePath}`))
		console.log(chalk.gray(`  2. Export from src/directives/index.ts`))
		console.log(chalk.gray(`  3. Add tests in tests/unit/${kebabName}.test.ts`))
		console.log(chalk.gray(`  4. Add documentation in docs/directives/${kebabName}.md`))
	} catch (error) {
		spinner.fail(chalk.red(`Failed to create directive: ${error}`))
		process.exit(1)
	}
}

function kebabToCamel(str: string): string {
	return str.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
}
