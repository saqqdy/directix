import path from 'node:path'
import chalk from 'chalk'
import fs from 'fs-extra'
import ora from 'ora'

interface Options {
	force?: boolean
}

const COMPOSABLE_TEMPLATE = `import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * {name} options
 */
export interface {interfaceName}Options {
  /**
   * Whether to disable
   * @default false
   */
  disabled?: boolean
}

/**
 * {name} return type
 */
export interface {interfaceName}Return {
  /**
   * Current value
   */
  value: Ref<any>
}

/**
 * {name} composable
 *
 * @example
 * \`\`\`vue
 * <script setup>
 * import { {name} } from 'directix'
 *
 * const { value } = {name}({ disabled: false })
 * </script>
 * \`\`\`
 *
 * @param options - Configuration options
 * @returns Composable return value
 */
export function {name}(options: {interfaceName}Options = {}): {interfaceName}Return {
  const { disabled = false } = options
  const value = ref(null)

  // Implementation
  onMounted(() => {
    if (disabled) return
    // Setup logic
  })

  onUnmounted(() => {
    if (disabled) return
    // Cleanup logic
  })

  return {
    value,
  }
}

export default {name}
`

export async function createComposable(name: string, options: Options): Promise<void> {
	const spinner = ora(`Creating composable ${name}...`).start()

	try {
		// Normalize name
		const camelName = name.startsWith('use') ? name : `use${name.charAt(0).toUpperCase()}${name.slice(1)}`
		const interfaceName = `${camelName.charAt(0).toUpperCase() + camelName.slice(1)}Options`
		const kebabName = camelToKebab(camelName)

		// Determine file path
		const cwd = process.cwd()
		const filePath = path.join(cwd, 'src', 'composables', `${kebabName}.ts`)

		// Check if file exists
		if (await fs.pathExists(filePath) && !options.force) {
			spinner.fail(chalk.red(`File already exists: ${filePath}. Use --force to overwrite.`))
			process.exit(1)
		}

		// Ensure directory exists
		await fs.ensureDir(path.dirname(filePath))

		// Generate content
		const content = COMPOSABLE_TEMPLATE
			.replace(/{name}/g, camelName)
			.replace(/{interfaceName}/g, interfaceName)
			.replace(/{kebabName}/g, kebabName)

		// Write file
		await fs.writeFile(filePath, content)

		spinner.succeed(chalk.green(`Composable created: ${filePath}`))

		console.log()
		console.log(chalk.gray('Next steps:'))
		console.log(chalk.gray(`  1. Implement the composable logic in ${filePath}`))
		console.log(chalk.gray(`  2. Export from src/composables/index.ts`))
		console.log(chalk.gray(`  3. Add tests in tests/unit/${kebabName}.test.ts`))
	} catch (error) {
		spinner.fail(chalk.red(`Failed to create composable: ${error}`))
		process.exit(1)
	}
}

function camelToKebab(str: string): string {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
