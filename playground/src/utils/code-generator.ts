import type { DirectiveConfig, GeneratedCode } from '../types'

interface GeneratorOptions {
	directive: DirectiveConfig
	values: Record<string, any>
	vueVersion: 'vue2' | 'vue3'
}

export function generateCode(options: GeneratorOptions): GeneratedCode {
	const { directive, values, vueVersion } = options

	return {
		vue3: generateVueCode(directive, values, 'vue3'),
		vue2: generateVueCode(directive, values, 'vue2'),
		composable: generateComposableCode(directive, values),
		nuxt: generateNuxtCode(directive, values),
		types: generateTypeDefinition(directive),
	}
}

function generateVueCode(
	directive: DirectiveConfig,
	values: Record<string, any>,
	version: 'vue2' | 'vue3',
): string {
	const directiveName = directive.name
	const bindingValue = generateBindingValue(directive, values)

	const template = version === 'vue3' ? `<template>
  <div v-${directiveName}="${bindingValue}">
    <!-- Your content here -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
${directive.hasComposable ? `import { use${pascalCase(directiveName)} } from 'directix'` : ''}

${generateScriptContent(directive, values, version)}
</script>` : `<template>
  <div v-${directiveName}="${bindingValue}">
    <!-- Your content here -->
  </div>
</template>

<script>
import { ref } from 'vue'
${directive.hasComposable ? `import { use${pascalCase(directiveName)} } from 'directix'` : ''}

export default {
  setup() {
    ${generateScriptContent(directive, values, version)}
  }
}
</script>`

	return template
}

function generateBindingValue(
	directive: DirectiveConfig,
	values: Record<string, any>,
): string {
	const params = directive.parameters

	// Simple value for single required parameter
	if (params.length === 1 && params[0].required) {
		const param = params[0]
		const value = values[param.name]

		if (param.type === 'function') {
			return param.name
		}

		if (param.type === 'string') {
			return `'${value || param.default || ''}'`
		}

		return String(value ?? param.default ?? '')
	}

	// Object syntax for multiple parameters
	const props: string[] = []

	for (const param of params) {
		if (!param.required && values[param.name] === undefined) continue

		const value = values[param.name] ?? param.default

		if (param.type === 'function') {
			props.push(`${param.name}: ${param.name}Handler`)
		} else if (param.type === 'string') {
			props.push(`${param.name}: '${value}'`)
		} else if (param.type === 'boolean') {
			props.push(`${param.name}: ${value}`)
		} else if (param.type === 'number') {
			props.push(`${param.name}: ${value}`)
		} else if (param.type === 'array') {
			props.push(`${param.name}: ${JSON.stringify(value || [])}`)
		} else if (param.type === 'object') {
			props.push(`${param.name}: ${JSON.stringify(value || {})}`)
		} else if (param.type === 'select') {
			if (typeof value === 'string') {
				props.push(`${param.name}: '${value}'`)
			} else {
				props.push(`${param.name}: ${JSON.stringify(value)}`)
			}
		}
	}

	if (props.length === 0) {
		return ''
	}

	if (props.length === 1) {
		return `{ ${props[0]} }`
	}

	return `{\n    ${props.join(',\n    ')}\n  }`
}

function generateScriptContent(
	directive: DirectiveConfig,
	values: Record<string, any>,
	version: 'vue2' | 'vue3',
): string {
	const lines: string[] = []

	// Generate function handlers
	for (const param of directive.parameters) {
		if (param.type === 'function' && values[param.name] !== false) {
			lines.push(`function ${param.name}Handler(...args: any[]) {`)
			lines.push(`  console.log('${param.name} called:', args)`)
			lines.push(`}`)
			lines.push('')
		}
	}

	// Generate state variables
	const stateVars = getStateVariables(directive, values)
	for (const [name, value] of Object.entries(stateVars)) {
		lines.push(`const ${name} = ref(${JSON.stringify(value)})`)
	}

	return lines.join('\n  ')
}

function getStateVariables(
	directive: DirectiveConfig,
	values: Record<string, any>,
): Record<string, any> {
	const vars: Record<string, any> = {}

	for (const param of directive.parameters) {
		if (param.type === 'boolean' && !param.required) {
			vars[param.name] = values[param.name] ?? param.default ?? false
		}
	}

	return vars
}

function generateComposableCode(
	directive: DirectiveConfig,
	values: Record<string, any>,
): string {
	const name = directive.name
	const composableName = `use${pascalCase(name)}`

	if (!directive.hasComposable) {
		return `// Composable not available for ${name}`
	}

	const props: string[] = []

	for (const param of directive.parameters) {
		const value = values[param.name] ?? param.default

		if (param.type === 'function') {
			props.push(`  ${param.name}: ${param.name}Handler`)
		} else if (param.type === 'string') {
			props.push(`  ${param.name}: '${value}'`)
		} else if (param.type === 'number') {
			props.push(`  ${param.name}: ${value}`)
		} else if (param.type === 'boolean') {
			props.push(`  ${param.name}: ${value}`)
		} else if (param.type === 'array') {
			props.push(`  ${param.name}: ${JSON.stringify(value || [])}`)
		}
	}

	const functionHandlers = directive.parameters
		.filter(p => p.type === 'function')
		.map(p => `function ${p.name}Handler(...args: any[]) {
  console.log('${p.name} called:', args)
}`)
		.join('\n\n')

	return `import { ${composableName} } from 'directix'

${functionHandlers || ''}

const result = ${composableName}({
${props.join(',\n')}
})

// Available methods:
${getComposableReturnValues(name)}
`
}

function getComposableReturnValues(directiveName: string): string {
	const returns: Record<string, string[]> = {
		'click-outside': ['bind', 'unbind'],
		debounce: ['run', 'cancel', 'flush', 'pending'],
		throttle: ['run', 'cancel', 'flush', 'pending'],
		copy: ['copy', 'copied', 'error', 'isSupported'],
		focus: ['focus', 'blur'],
		lazy: ['observe', 'unobserve', 'load'],
		permission: ['hasPermission', 'checkPermission'],
		'long-press': ['bind', 'unbind'],
		hover: ['isHovering', 'bind'],
		ripple: ['createRipple'],
		scroll: ['scrollTo', 'scrollToTop', 'scrollToBottom'],
		resize: ['observe', 'unobserve'],
		intersect: ['observe', 'unobserve', 'isIntersecting'],
		'infinite-scroll': ['loadMore', 'reset'],
		sticky: ['stick', 'unstick'],
		mask: ['format', 'parse'],
		sanitize: ['sanitize'],
		loading: ['start', 'stop', 'isLoading'],
		visible: ['show', 'hide', 'toggle', 'isVisible'],
		mutation: ['observe', 'unobserve'],
		countdown: ['start', 'stop', 'pause', 'reset', 'time'],
		counter: ['start', 'stop', 'reset', 'current'],
		progress: ['setProgress', 'increment', 'decrement'],
	}

	const defaultReturns = ['state', 'methods']

	return (returns[directiveName] || defaultReturns)
		.map(r => `// - ${r}`)
		.join('\n')
}

function generateNuxtCode(
	directive: DirectiveConfig,
	values: Record<string, any>,
): string {
	return `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],

  // Auto-imports all directives
  // Use directly in templates:
  // <div v-${directive.name}="${generateBindingValue(directive, values).replace(/"/g, '\'')}">
  //   Content
  // </div>
})
`
}

function generateTypeDefinition(directive: DirectiveConfig): string {
	const name = directive.name
	const optionsName = `${pascalCase(name)}Options`
	const bindingName = `${pascalCase(name)}Binding`

	const typeDefs = directive.parameters.map(p => {
		let type: string

		switch (p.type) {
			case 'string':
				type = 'string'
				break
			case 'number':
				type = 'number'
				break
			case 'boolean':
				type = 'boolean'
				break
			case 'array':
				type = 'any[]'
				break
			case 'object':
				type = 'Record<string, any>'
				break
			case 'function':
				type = '(...args: any[]) => void'
				break
			case 'select':
				type = p.options?.map(o => `'${o.value}'`).join(' | ') || 'string'
				break
			default:
				type = 'any'
		}

		const required = p.required ? '' : '?'
		return `  /** ${p.description} */\n  ${p.name}${required}: ${type}`
	})

	return `import type { DirectiveBinding } from 'vue'

export interface ${optionsName} {
${typeDefs.join('\n\n')}
}

export type ${bindingName} = ${optionsName} | DirectiveBinding<${optionsName}>

// Directive usage:
// v-${name}="${generateBindingValue(directive, {}).replace(/"/g, '\'')}"
`
}

function pascalCase(str: string): string {
	return str
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join('')
}
