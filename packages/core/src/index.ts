// Adapters (for advanced usage)
export * from './adapter'

// Directive definition
export { defineDirective, defineDirectiveGroup } from './define'

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
