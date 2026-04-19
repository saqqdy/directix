/**
 * Directix Plugin System
 *
 * Allows users to:
 * - Create custom directives
 * - Extend existing directives with hooks
 * - Register third-party plugins
 * - Share directives with the community
 */

import type { App, Directive } from 'vue'

/**
 * Plugin metadata
 */
export interface PluginMeta {
	/** Plugin name */
	name: string
	/** Plugin version */
	version: string
	/** Plugin description */
	description?: string
	/** Author name */
	author?: string
	/** License */
	license?: string
	/** Repository URL */
	repository?: string
	/** Keywords for discovery */
	keywords?: string[]
}

/**
 * Plugin context - provides utilities for plugins
 */
export interface PluginContext {
	/** Vue app instance */
	app: App
	/** Register a directive */
	registerDirective: (name: string, directive: Directive) => void
	/** Register a composable */
	registerComposable: (name: string, composable: any) => void
	/** Get an existing directive */
	getDirective: (name: string) => Directive | undefined
	/** Show a warning */
	warn: (message: string) => void
	/** Show an error */
	error: (message: string) => void
	/** Plugin metadata */
	meta: PluginMeta
}

/**
 * Plugin definition
 */
export interface DirectixPlugin {
	/** Plugin metadata */
	meta: PluginMeta
	/** Install function - called when plugin is registered */
	install: (ctx: PluginContext) => void | Promise<void>
	/** Uninstall function - called when plugin is removed */
	uninstall?: (ctx: PluginContext) => void | Promise<void>
	/** Plugin dependencies */
	dependencies?: string[]
}

/**
 * Plugin hook types
 */
export type PluginHook = 'beforeInstall' | 'afterInstall' | 'beforeUninstall' | 'afterUninstall'

/**
 * Plugin hook callback
 */
export type PluginHookCallback = (plugin: DirectixPlugin, ctx: PluginContext) => void | Promise<void>

/**
 * Directive extension hook
 */
export interface DirectiveExtension {
	/** Target directive name */
	target: string
	/** Hook to extend */
	hook: 'mounted' | 'updated' | 'unmounted' | 'beforeMount' | 'afterMount'
	/** Extension handler */
	handler: (el: any, binding: any, vnode: any, prevVnode?: any) => void | Promise<void>
}

/**
 * Plugin configuration
 */
export interface PluginConfig {
	/** Enable debug mode */
	debug?: boolean
	/** Plugin registry URL */
	registryUrl?: string
	/** Auto-load official plugins */
	autoLoadOfficial?: boolean
}

/**
 * Plugin registry entry
 */
export interface PluginRegistryEntry {
	/** Plugin name */
	name: string
	/** Plugin version */
	version: string
	/** Plugin description */
	description: string
	/** NPM package name */
	package: string
	/** Author */
	author: string
	/** Keywords */
	keywords: string[]
	/** Download count */
	downloads?: number
	/** GitHub stars */
	stars?: number
}
