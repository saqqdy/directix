/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'

	const component: DefineComponent<{}, {}, any>
	export default component
}

export interface DirectiveParameter {
	name: string
	type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'select'
	description: string
	default?: any
	required?: boolean
	options?: { label: string, value: any }[]
	min?: number
	max?: number
	step?: number
}

export interface DirectiveConfig {
	name: string
	displayName: string
	description: string
	category: string
	parameters: DirectiveParameter[]
	examples: DirectiveExample[]
	supportsVue2: boolean
	supportsVue3: boolean
	hasComposable: boolean
}

export interface DirectiveExample {
	title: string
	description: string
	code: string
}

export interface GeneratedCode {
	vue2?: string
	vue3?: string
	composable?: string
	nuxt?: string
	types?: string
}

export interface PlayroundState {
	selectedDirective: string | null
	parameterValues: Record<string, any>
	vueVersion: 'vue2' | 'vue3'
	outputFormat: 'template' | 'composable'
}
