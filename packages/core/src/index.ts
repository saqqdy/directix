// Types
export * from './types'

// Environment detection
export {
	getVueVersion,
	isVue2,
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
