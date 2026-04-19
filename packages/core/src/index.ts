// Adapters (for advanced usage)
export * from './adapter'

// Directive definition
export { defineDirective, defineDirectiveGroup } from './define'

// DevTools integration
export {
	clearDevtoolsState,
	disableDevtools,
	enableDevtools,
	getDevtoolsState,
	isDevtoolsAvailable,
	trackDirective,
	trackPlugin,
	untrackDirective,
	untrackPlugin,
	type DevtoolsEvent,
	type DirectiveInfo,
	type PluginInfo,
} from './devtools'

// Environment detection
export {
	getVueVersion,
	isBrowser,
	isSSR,
	isVue2,
	isVue3,
	isVue27,
	resetVueVersion,
	setVueVersion,
	supportsClipboard,
	supportsIntersectionObserver,
	supportsMutationObserver,
	supportsPassive,
	supportsResizeObserver,
	type VueVersion,
} from './env'

// Performance monitoring
export {
	calculateStats,
	clearPerformanceMetrics,
	configurePerformance,
	disablePerformance,
	enablePerformance,
	endMeasure,
	exportPerformanceData,
	getDirectiveMetrics,
	getMostFrequentDirectives,
	getPerformanceMetrics,
	getPerformanceReport,
	getSlowestDirectives,
	isPerformanceEnabled,
	measurePerformance,
	measurePerformanceAsync,
	startMeasure,
	withPerformanceMonitoring,
	type DirectivePerformance,
	type PerformanceConfig,
	type PerformanceMetric,
	type PerformanceStats,
} from './performance'

// Types
export * from './types'

// Warning system
export {
	assert,
	assertPositive,
	assertRange,
	assertType,
	debug,
	directiveError,
	directiveWarn,
	error,
	info,
	setWarningDevMode,
	setWarningI18n,
	setWarningLevel,
	warn,
	warnDeprecated,
	warnInvalidParam,
	warnMissingParam,
	warnNotSupported,
	warnSSRNotSupported,
} from './warning'
