/**
 * Vue DevTools Integration
 *
 * Provides debugging capabilities for Directix through Vue DevTools.
 * Shows registered directives, plugins, and performance metrics.
 */

import { isBrowser, isVue3 } from './env'

/**
 * DevTools API type
 */
interface DevtoolsHook {
	apps: any[]
	on: (event: string, callback: (...args: any[]) => void) => void
	emit: (event: string, ...args: any[]) => void
	Vue?: any
	enabled?: boolean
}

/**
 * DevTools state
 */
interface DevtoolsState {
	enabled: boolean
	directives: Map<string, DirectiveInfo>
	plugins: Map<string, PluginInfo>
	events: DevtoolsEvent[]
	maxEvents: number
}

/**
 * Directive info for DevTools
 */
export interface DirectiveInfo {
	name: string
	element?: string
	bindings: number
	lastUpdated: number
	options?: Record<string, any>
}

/**
 * Plugin info for DevTools
 */
export interface PluginInfo {
	name: string
	version: string
	description?: string
	enabled: boolean
	registeredAt: number
}

/**
 * DevTools event
 */
export interface DevtoolsEvent {
	type: 'directive:mounted' | 'directive:updated' | 'directive:unmounted' | 'plugin:install' | 'plugin:uninstall'
	name: string
	timestamp: number
	data?: any
}

/**
 * Global DevTools state
 */
const state: DevtoolsState = {
	enabled: false,
	directives: new Map(),
	plugins: new Map(),
	events: [],
	maxEvents: 100,
}

/**
 * Get the DevTools hook
 */
function getDevtoolsHook(): DevtoolsHook | null {
	if (!isBrowser()) return null

	const win = window as any
	return win.__VUE_DEVTOOLS_GLOBAL_HOOK__ || null
}

/**
 * Check if DevTools is available
 */
export function isDevtoolsAvailable(): boolean {
	return getDevtoolsHook() !== null
}

/**
 * Enable DevTools integration
 */
export function enableDevtools(): void {
	if (!isBrowser()) return

	const hook = getDevtoolsHook()
	if (!hook) {
		console.warn('[Directix] Vue DevTools not detected. Install Vue DevTools extension to enable debugging.')
		return
	}

	state.enabled = true

	// Register custom devtools plugin for Vue 3
	if (isVue3()) {
		setupVue3Devtools(hook)
	} else {
		setupVue2Devtools(hook)
	}

	console.info('[Directix] DevTools integration enabled')
}

/**
 * Setup DevTools for Vue 3
 */
function setupVue3Devtools(hook: DevtoolsHook): void {
	// Listen for app initialization
	hook.on('app:init', (app: any) => {
		// Register Directix inspector
		registerInspector(app)
	})

	// Listen for component updates
	hook.on('component:updated', (component: any) => {
		updateDirectiveBindings(component)
	})
}

/**
 * Setup DevTools for Vue 2
 */
function setupVue2Devtools(hook: DevtoolsHook): void {
	if (!hook.Vue) return

	// Register custom inspector for Vue 2
	hook.emit('inspector:add', {
		id: 'directix',
		app: hook.Vue,
		label: 'Directix',
		icon: 'view_grid',
		treeFilterPlaceholder: 'Search directives',
	})

	// Populate inspector data
	hook.on('inspector:tree', (payload: any) => {
		if (payload.app === hook.Vue && payload.inspectorId === 'directix') {
			payload.rootNodes = getDirectiveTree()
		}
	})

	hook.on('inspector:state', (payload: any) => {
		if (payload.app === hook.Vue && payload.inspectorId === 'directix') {
			payload.state = getDirectiveState(payload.nodeId)
		}
	})
}

/**
 * Register custom inspector for Vue 3
 */
function registerInspector(app: any): void {
	const hook = getDevtoolsHook()
	if (!hook) return

	// Custom inspector definition
	const inspector = {
		id: 'directix',
		app,
		label: 'Directix',
		icon: 'view_grid',
		treeFilterPlaceholder: 'Search directives...',
	}

	hook.emit('custom-inspector:add', inspector)

	// Handle tree request
	hook.on('custom-inspector:tree', (payload: any) => {
		if (payload.inspectorId === 'directix') {
			payload.rootNodes = getDirectiveTree()
		}
	})

	// Handle state request
	hook.on('custom-inspector:state', (payload: any) => {
		if (payload.inspectorId === 'directix') {
			payload.state = getDirectiveState(payload.nodeId)
		}
	})
}

/**
 * Get directive tree for inspector
 */
function getDirectiveTree(): any[] {
	const nodes: any[] = []

	// Add directives node
	const directiveNodes = Array.from(state.directives.entries()).map(([name, info]) => ({
		id: `directive:${name}`,
		label: `v-${name}`,
		children: [],
		tags: [
			{
				label: `${info.bindings} bindings`,
				textColor: 0x666666,
				backgroundColor: 0xEEEEEE,
			},
		],
	}))

	nodes.push({
		id: 'directives',
		label: 'Directives',
		children: directiveNodes,
		tags: [
			{
				label: `${state.directives.size}`,
				textColor: 0xFFFFFF,
				backgroundColor: 0x42B883,
			},
		],
	})

	// Add plugins node
	const pluginNodes = Array.from(state.plugins.entries()).map(([name, info]) => ({
		id: `plugin:${name}`,
		label: name,
		children: [],
		tags: [
			{
				label: info.version,
				textColor: 0x666666,
				backgroundColor: 0xEEEEEE,
			},
		],
	}))

	nodes.push({
		id: 'plugins',
		label: 'Plugins',
		children: pluginNodes,
		tags: [
			{
				label: `${state.plugins.size}`,
				textColor: 0xFFFFFF,
				backgroundColor: 0x42B883,
			},
		],
	})

	// Add events node
	const recentEvents = state.events.slice(-20)
	const eventNodes = recentEvents.map((event, index) => ({
		id: `event:${index}`,
		label: `${event.type}:${event.name}`,
		children: [],
		tags: [
			{
				label: new Date(event.timestamp).toLocaleTimeString(),
				textColor: 0x666666,
				backgroundColor: 0xEEEEEE,
			},
		],
	}))

	nodes.push({
		id: 'events',
		label: 'Events',
		children: eventNodes,
		tags: [
			{
				label: `${state.events.length}`,
				textColor: 0xFFFFFF,
				backgroundColor: 0x42B883,
			},
		],
	})

	return nodes
}

/**
 * Get directive state for inspector
 */
function getDirectiveState(nodeId: string): any {
	if (nodeId.startsWith('directive:')) {
		const name = nodeId.replace('directive:', '')
		const info = state.directives.get(name)
		if (info) {
			return [
				{
					key: 'info',
					value: {
						name: info.name,
						bindings: info.bindings,
						lastUpdated: new Date(info.lastUpdated).toLocaleString(),
						element: info.element || 'unknown',
						options: info.options,
					},
					editable: false,
				},
			]
		}
	}

	if (nodeId.startsWith('plugin:')) {
		const name = nodeId.replace('plugin:', '')
		const info = state.plugins.get(name)
		if (info) {
			return [
				{
					key: 'info',
					value: {
						name: info.name,
						version: info.version,
						description: info.description,
						enabled: info.enabled,
						registeredAt: new Date(info.registeredAt).toLocaleString(),
					},
					editable: false,
				},
			]
		}
	}

	if (nodeId.startsWith('event:')) {
		const index = Number.parseInt(nodeId.replace('event:', ''))
		const event = state.events[state.events.length - 20 + index]
		if (event) {
			return [
				{
					key: 'event',
					value: {
						name: event.name,
						type: event.type,
						timestamp: new Date(event.timestamp).toLocaleString(),
						data: event.data,
					},
					editable: false,
				},
			]
		}
	}

	return []
}

/**
 * Update directive bindings from component
 */
function updateDirectiveBindings(_component: any): void {
	// This would be called when component updates
	// We can track which directives are active
}

/**
 * Register a directive for DevTools tracking
 */
export function trackDirective(name: string, info?: Partial<DirectiveInfo>): void {
	if (!state.enabled) return

	const existing = state.directives.get(name)
	if (existing) {
		state.directives.set(name, {
			...existing,
			bindings: existing.bindings + 1,
			lastUpdated: Date.now(),
			...info,
		})
	} else {
		state.directives.set(name, {
			name,
			bindings: 1,
			lastUpdated: Date.now(),
			...info,
		})
	}

	addEvent('directive:mounted', name)
}

/**
 * Unregister a directive from DevTools tracking
 */
export function untrackDirective(name: string): void {
	if (!state.enabled) return

	const existing = state.directives.get(name)
	if (existing) {
		state.directives.set(name, {
			...existing,
			bindings: Math.max(0, existing.bindings - 1),
			lastUpdated: Date.now(),
		})
	}

	addEvent('directive:unmounted', name)
}

/**
 * Register a plugin for DevTools tracking
 */
export function trackPlugin(info: PluginInfo): void {
	if (!state.enabled) return

	state.plugins.set(info.name, {
		...info,
		registeredAt: Date.now(),
	})

	addEvent('plugin:install', info.name, { version: info.version })
}

/**
 * Unregister a plugin from DevTools tracking
 */
export function untrackPlugin(name: string): void {
	if (!state.enabled) return

	const info = state.plugins.get(name)
	if (info) {
		state.plugins.set(name, { ...info, enabled: false })
	}

	addEvent('plugin:uninstall', name)
}

/**
 * Add event to DevTools event log
 */
function addEvent(type: DevtoolsEvent['type'], name: string, data?: any): void {
	state.events.push({
		name,
		type,
		timestamp: Date.now(),
		data,
	})

	// Trim events if exceeding max
	if (state.events.length > state.maxEvents) {
		state.events = state.events.slice(-state.maxEvents)
	}
}

/**
 * Disable DevTools integration
 */
export function disableDevtools(): void {
	state.enabled = false
}

/**
 * Get DevTools state (for external access)
 */
export function getDevtoolsState(): {
	enabled: boolean
	directiveCount: number
	pluginCount: number
	eventCount: number
} {
	return {
		enabled: state.enabled,
		directiveCount: state.directives.size,
		pluginCount: state.plugins.size,
		eventCount: state.events.length,
	}
}

/**
 * Clear DevTools state
 */
export function clearDevtoolsState(): void {
	state.directives.clear()
	state.plugins.clear()
	state.events = []
}
