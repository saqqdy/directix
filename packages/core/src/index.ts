// Types
export * from './types'

// Environment detection
export {
	type VueVersion,
	getVueVersion,
	setVueVersion,
	resetVueVersion,
	isVue2,
	isVue27,
	isVue3,
	isBrowser,
	isSSR,
	supportsPassive,
	supportsIntersectionObserver,
	supportsResizeObserver,
	supportsClipboard,
	supportsMutationObserver,
} from './env'

// Directive definition
export { defineDirective, defineDirectiveGroup } from './define'

// Adapters (for advanced usage)
export * from './adapter'
