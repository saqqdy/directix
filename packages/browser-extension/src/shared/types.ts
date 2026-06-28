/**
 * Shared types for Browser Extension
 */

export interface DirectiveInstance {
	id: string
	name: string
	element: string
	attrs: string[]
	value: string | null
	modifiers: string[]
	timestamp: number
	binding: {
		value: any
		oldValue: any | null
		arg?: string
		modifiers: Record<string, boolean>
	}
	state: DirectiveState
}

export interface DirectiveState {
	mounted: boolean
	updatedCount: number
	error?: string
	warnings?: string[]
}

export interface PerformanceMetric {
	id: string
	directiveName: string
	type: 'mount' | 'update' | 'unmount'
	duration: number
	startTime: number
	endTime: number
	memory?: number
	timestamp: number
}

export interface StateInfo {
	id: string
	tag: string
	classes: string
	dataset: Record<string, string | undefined>
	directiveName: string
	value: any
	modifiers: string[]
}

export interface Issue {
	id: string
	type: 'error' | 'warning' | 'info'
	directiveName: string
	element: string
	message: string
	description: string
	suggestion?: string
	severity: 'high' | 'medium' | 'low'
	timestamp: number
}

export interface FilterOptions {
	search: string
	types: string[]
	severities: string[]
	timeRange: {
		start: number
		end: number
	}
}

export interface MessagePayload {
	type: string
	payload?: any
	tabId?: number
	target?: 'background' | 'content' | 'devtools'
}

export interface ConnectionStatus {
	connected: boolean
	tabId: number | null
	lastUpdate: number
	error?: string
}

export interface ExportFormat {
	type: 'json' | 'csv' | 'html'
	includeTimestamps: boolean
	includePerformance: boolean
	includeIssues: boolean
}
