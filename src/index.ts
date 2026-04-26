import type { DirectiveInstallOptions } from '@directix/core'
import type { App, Directive, Plugin } from 'vue'
import { setVueVersion } from '@directix/core'
import {
	vBlur,
	vCapitalcase,
	vClickDelay,
	vClickOutside,
	vClickWave,
	vContextMenu,
	vCopy,
	vCountdown,
	vCounter,
	vDebounce,
	vDraggable,
	vEllipsis,
	vEmoji,
	vExport,
	vFade,
	vFocus,
	vFullscreen,
	vHighlight,
	vHotkey,
	vHover,
	vImagePreview,
	vInfiniteScroll,
	vIntersect,
	vLazy,
	vLoading,
	vLongPress,
	vLottie,
	vLowercase,
	vMask,
	vMoney,
	vMutation,
	vNumber,
	vPan,
	vParallax,
	vPermission,
	vPinch,
	vPrint,
	vProgress,
	vPullRefresh,
	vResize,
	vRipple,
	vRotateGesture,
	vSanitize,
	vScroll,
	vSkeleton,
	vSticky,
	vSwipe,
	vThrottle,
	vTooltip,
	vTouch,
	vTrim,
	vTruncate,
	vTypewriter,
	vUppercase,
	vVirtualList,
	vVisible,
	vWatermark,
} from './directives'

// Export composables
export * from './composables'

// Export all directives
// Export directives (types are exported from composables to avoid duplicates)
export {
	configurePermission,
	getPermissionConfig,
	vBlur,
	vCapitalcase,
	vClickDelay,
	vClickOutside,
	vClickWave,
	vContextMenu,
	vCopy,
	vCountdown,
	vCounter,
	vDebounce,
	vDraggable,
	vEllipsis,
	vEmoji,
	vExport,
	vFade,
	vFocus,
	vFullscreen,
	vHighlight,
	vHotkey,
	vHover,
	vImagePreview,
	vInfiniteScroll,
	vIntersect,
	vLazy,
	vLoading,
	vLongPress,
	vLottie,
	vLowercase,
	vMask,
	vMoney,
	vMutation,
	vNumber,
	vPan,
	vParallax,
	vPermission,
	vPinch,
	vPrint,
	vProgress,
	vPullRefresh,
	vResize,
	vRipple,
	vRotateGesture,
	vSanitize,
	vScroll,
	vSkeleton,
	vSticky,
	vSwipe,
	vThrottle,
	vTooltip,
	vTouch,
	vTrim,
	vTruncate,
	vTypewriter,
	vUppercase,
	vVirtualList,
	vVisible,
	vWatermark,
} from './directives'

// Export plugin system
export * from './plugin'

// Export v1.10.0 utilities
// A11y (Accessibility) utilities
export {
	announce,
	applyAriaAttributes,
	clearAnnouncer,
	clearAriaAttributes,
	computedWithCleanup,
	ensureTeleportTarget,
	generateAriaId,
	getAutoAriaConfig,
	teleportContent,
	useDirectiveInstance,
	useFocusTrap,
	useKeyboardNavigation,
	useLazyOptimized,
	useSuspenseDirective,
	watchEffectBinding,
} from './utils'

// Re-export Vue 3 optimization & A11y types
export type {
	AnnounceOptions,
	ARIAConfig,
	ARIALivePriority,
	ARIAPopupType,
	ARIARole,
	AutoAriaOptions,
	ComputedWithCleanupOptions,
	DirectiveInstanceOptions,
	FocusTrapOptions,
	KeyboardNavigationConfig,
	OptimizedLazyOptions,
	OptimizedLazyState,
	SuspenseDirectiveState,
	TeleportEnhanceOptions,
	UseDirectiveInstanceReturn,
	UseFocusTrapReturn,
	UseKeyboardNavigationReturn,
	UseLazyOptimizedReturn,
	UseSuspenseDirectiveReturn,
	WatchEffectBindingOptions,
} from './utils'

// Security utilities
export {
	createSafeContentHandler,
	escapeHtml,
	getCSPNonce,
	injectScriptCSP,
	injectStylesCSP,
	isUrlSafe,
	SafeContentHandler,
	sanitizeHtml,
	sanitizeUrl,
	SecurityAudit,
	stripHtml,
	unescapeHtml,
} from './utils'

// Security types
export type {
	CSPConfig,
	DependencyVulnerability,
	SecurityReport,
	SecurityVulnerability,
	XSSProtectionConfig,
} from './utils'

// Mobile/touch optimization utilities
export {
	addNonPassiveListener,
	addPassiveListener,
	getDevicePixelRatio,
	isMobileDevice,
	isTouchDevice,
	ObjectPool,
	triggerHaptic,
	useEnhancedTouch,
	usePWA,
} from './utils'

// Mobile types
export type {
	ExtendedGestureType,
	ExtendedTouchEvent,
	PWAConfig,
	TouchFeedbackConfig,
	TouchGestureThresholds,
	UseEnhancedTouchOptions,
	UseEnhancedTouchReturn,
	UsePWAReturn,
} from './utils'

// Export Web Components utilities
export * from './web-components'

// Export core utilities
export * from '@directix/core'

// Export i18n
export * from '@directix/i18n'

// All directives list
const allDirectives: Record<string, Directive> = {
	blur: vBlur,
	'click-outside': vClickOutside,
	'click-delay': vClickDelay,
	'click-wave': vClickWave,
	'context-menu': vContextMenu,
	copy: vCopy,
	debounce: vDebounce,
	throttle: vThrottle,
	focus: vFocus,
	hotkey: vHotkey,
	lazy: vLazy,
	intersect: vIntersect,
	visible: vVisible,
	loading: vLoading,
	scroll: vScroll,
	'infinite-scroll': vInfiniteScroll,
	sticky: vSticky,
	'long-press': vLongPress,
	hover: vHover,
	ripple: vRipple,
	mask: vMask,
	permission: vPermission,
	sanitize: vSanitize,
	resize: vResize,
	mutation: vMutation,
	truncate: vTruncate,
	ellipsis: vEllipsis,
	uppercase: vUppercase,
	lowercase: vLowercase,
	capitalcase: vCapitalcase,
	number: vNumber,
	money: vMoney,
	trim: vTrim,
	tooltip: vTooltip,
	draggable: vDraggable,
	touch: vTouch,
	swipe: vSwipe,
	'image-preview': vImagePreview,
	countdown: vCountdown,
	watermark: vWatermark,
	print: vPrint,
	'virtual-list': vVirtualList,
	'pull-refresh': vPullRefresh,
	counter: vCounter,
	emoji: vEmoji,
	export: vExport,
	fade: vFade,
	fullscreen: vFullscreen,
	highlight: vHighlight,
	lottie: vLottie,
	pan: vPan,
	parallax: vParallax,
	pinch: vPinch,
	progress: vProgress,
	'rotate-gesture': vRotateGesture,
	skeleton: vSkeleton,
	typewriter: vTypewriter,
}

/**
 * Install all directives
 */
const install = (app: App | any, options: DirectiveInstallOptions = {}): void => {
	// Detect Vue version from app instance
	// Vue 2: app is the Vue constructor (has version static property, has directive static method)
	// Vue 3: app is an app instance (has config property, version on app.constructor or as _context)

	let vueVersion: 2 | 3 | null = null

	// Check if it's Vue 2 constructor
	if (typeof app === 'function' && app.version?.startsWith('2')) {
		vueVersion = 2
	} else if (app?.config && app?.version?.startsWith('3')) {
		// Check if it's Vue 3 app instance
		vueVersion = 3
	} else if (typeof app?.directive === 'function' && typeof app?.mixin === 'function' && app.version?.startsWith('2')) {
		// Check for Vue 2 static methods (directive, component, mixin, etc.)
		vueVersion = 2
	} else if (typeof window !== 'undefined') {
		// Fallback: check global Vue
		const win = window as any

		if (win.Vue?.version?.startsWith('2')) {
			vueVersion = 2
		} else if (win.Vue?.version?.startsWith('3')) {
			vueVersion = 3
		}
	}

	// Set the detected version
	if (vueVersion) {
		setVueVersion(vueVersion)
	}

	const { directives, all = false } = options

	if (all || !directives) {
		// Register all directives
		Object.entries(allDirectives).forEach(([name, directive]) => {
			app.directive(name, directive)
		})
	} else {
		// Register specified directives
		directives.forEach(name => {
			const directive = allDirectives[name]

			if (directive) {
				app.directive(name, directive)
			} else {
				console.warn(`[Directix] Unknown directive: ${name}`)
			}
		})
	}
}

/**
 * Directix plugin
 */
export const Directix: Plugin = {
	install,
}

// Export shared utilities (excluding tools with the same name as directives)
export {
	deepClone,
	deepMerge,
	generateId,
	get,
	isArray,
	isBoolean,
	isEmpty,
	isFunction,
	isNumber,
	isObject,
	isPromise,
	isString,
	parseTime,
	set,
} from '@directix/shared'
