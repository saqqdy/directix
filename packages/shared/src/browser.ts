/**
 * Browser detection and platform utilities for Directix
 * Lightweight browser detection without heavy dependencies
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Browser vendor
 */
export type BrowserVendor = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'ie' | 'unknown'

/**
 * Operating system
 */
export type OperatingSystem = 'windows' | 'macos' | 'linux' | 'ios' | 'android' | 'unknown'

/**
 * Device type
 */
export type DeviceType = 'desktop' | 'mobile' | 'tablet'

/**
 * Browser detection result
 */
export interface BrowserDetection {
	vendor: BrowserVendor
	version: string
	os: OperatingSystem
	device: DeviceType
	isMobile: boolean
	isTablet: boolean
	isDesktop: boolean
	isTouch: boolean
	language: string
	userAgent: string
}

// ============================================================================
// Detection Functions
// ============================================================================

/**
 * Check if running in browser environment
 */
export function isBrowserEnv(): boolean {
	return typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined'
}

/**
 * Get user agent string
 */
export function getUserAgent(): string {
	if (!isBrowserEnv()) return ''
	return navigator.userAgent
}

/**
 * Detect browser vendor
 */
export function detectBrowserVendor(): BrowserVendor {
	const ua = getUserAgent()

	if (/Edg\//.test(ua)) return 'edge'
	if (/Firefox\//.test(ua)) return 'firefox'
	if (/OPR\//.test(ua) || /Opera\//.test(ua)) return 'opera'
	if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'safari'
	if (/Chrome\//.test(ua)) return 'chrome'
	if (/MSIE|Trident\//.test(ua)) return 'ie'

	return 'unknown'
}

/**
 * Extract browser version
 */
export function detectBrowserVersion(): string {
	const ua = getUserAgent()
	const vendor = detectBrowserVendor()

	const patterns: Record<BrowserVendor, RegExp> = {
		chrome: /Chrome\/(\d+\.?\d*)/,
		firefox: /Firefox\/(\d+\.?\d*)/,
		safari: /Version\/(\d+\.?\d*)/,
		edge: /Edg\/(\d+\.?\d*)/,
		opera: /(?:OPR|Opera)\/(\d+\.?\d*)/,
		ie: /(?:MSIE |rv:)(\d+\.?\d*)/,
		unknown: /(\d+\.?\d*)/,
	}

	const match = ua.match(patterns[vendor])
	return match?.[1] || '0'
}

/**
 * Detect operating system
 */
export function detectOS(): OperatingSystem {
	const ua = getUserAgent()

	if (/Windows/.test(ua)) return 'windows'
	if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(ua)) return 'macos'
	if (/Linux/.test(ua) && !/Android/.test(ua)) return 'linux'
	if (/Android/.test(ua)) return 'android'
	if (/iPhone|iPad|iPod/.test(ua)) return 'ios'

	return 'unknown'
}

/**
 * Detect device type
 */
export function detectDeviceType(): DeviceType {
	if (!isBrowserEnv()) return 'desktop'

	const ua = getUserAgent()

	// Check for tablet
	if (/tablet|ipad/i.test(ua)) return 'tablet'
	if (/android/i.test(ua) && !/mobile/i.test(ua)) return 'tablet'

	// Check for mobile
	if (/mobile|iphone|ipod|android.*mobile/i.test(ua)) return 'mobile'

	return 'desktop'
}

/**
 * Check if device has touch support
 */
export function isTouchDevice(): boolean {
	if (!isBrowserEnv()) return false

	// Check for touch events
	if ('ontouchstart' in window) return true

	// Check for navigator.maxTouchPoints
	if (navigator.maxTouchPoints > 0) return true

	return false
}

/**
 * Get browser language
 */
export function getBrowserLanguage(): string {
	if (!isBrowserEnv()) return 'en'
	return navigator.language || (navigator as any).userLanguage || 'en'
}

/**
 * Get complete browser detection result
 */
export function detectBrowser(): BrowserDetection {
	const vendor = detectBrowserVendor()
	const version = detectBrowserVersion()
	const os = detectOS()
	const device = detectDeviceType()

	return {
		vendor,
		version,
		os,
		device,
		isMobile: device === 'mobile',
		isTablet: device === 'tablet',
		isDesktop: device === 'desktop',
		isTouch: isTouchDevice(),
		language: getBrowserLanguage(),
		userAgent: getUserAgent(),
	}
}

// ============================================================================
// Feature Detection
// ============================================================================

/**
 * Check if passive event listeners are supported
 */
export function supportsPassiveEvents(): boolean {
	if (!isBrowserEnv()) return false

	let supported = false
	try {
		const options = {
			get passive() {
				supported = true
				return false
			},
		}
		window.addEventListener('test', null as any, options)
		window.removeEventListener('test', null as any, options as any)
	} catch {
		supported = false
	}
	return supported
}

/**
 * Check if IntersectionObserver is supported
 */
export function supportsIntersectionObserver(): boolean {
	return isBrowserEnv() && 'IntersectionObserver' in window
}

/**
 * Check if ResizeObserver is supported
 */
export function supportsResizeObserver(): boolean {
	return isBrowserEnv() && 'ResizeObserver' in window
}

/**
 * Check if MutationObserver is supported
 */
export function supportsMutationObserver(): boolean {
	return isBrowserEnv() && 'MutationObserver' in window
}

/**
 * Check if Clipboard API is supported
 */
export function supportsClipboardAPI(): boolean {
	return isBrowserEnv() && 'clipboard' in navigator
}

/**
 * Check if async Clipboard write is supported
 */
export function supportsAsyncClipboardWrite(): boolean {
	if (!isBrowserEnv()) return false
	if (!supportsClipboardAPI()) return false
	return typeof navigator.clipboard.write === 'function'
}

/**
 * Check if Clipboard read is supported
 */
export function supportsClipboardRead(): boolean {
	if (!isBrowserEnv()) return false
	if (!supportsClipboardAPI()) return false
	return typeof navigator.clipboard.read === 'function'
}

/**
 * Check if Pointer Events are supported
 */
export function supportsPointerEvents(): boolean {
	return isBrowserEnv() && 'PointerEvent' in window
}

/**
 * Check if Web Animations API is supported
 */
export function supportsWebAnimations(): boolean {
	return isBrowserEnv() && 'animate' in Element.prototype
}

/**
 * Check if requestIdleCallback is supported
 */
export function supportsRequestIdleCallback(): boolean {
	return isBrowserEnv() && 'requestIdleCallback' in window
}

/**
 * Check if customElements are supported
 */
export function supportsCustomElements(): boolean {
	return isBrowserEnv() && 'customElements' in window
}

/**
 * Check if Shadow DOM is supported
 */
export function supportsShadowDOM(): boolean {
	return isBrowserEnv() && 'attachShadow' in Element.prototype
}

/**
 * Check if CSS Grid is supported
 */
export function supportsCSSGrid(): boolean {
	if (!isBrowserEnv()) return false

	const div = document.createElement('div')
	div.style.gridTemplateColumns = '1fr'
	return div.style.gridTemplateColumns === '1fr'
}

/**
 * Check if CSS Flexbox is supported
 */
export function supportsCSSFlexbox(): boolean {
	if (!isBrowserEnv()) return false

	const div = document.createElement('div')
	div.style.display = 'flex'
	return div.style.display === 'flex'
}

/**
 * Check if CSS Variables are supported
 */
export function supportsCSSVariables(): boolean {
	if (!isBrowserEnv()) return false

	const div = document.createElement('div')
	div.style.setProperty('--test', 'test')
	return div.style.getPropertyValue('--test') === 'test'
}

/**
 * Check if local storage is available
 */
export function supportsLocalStorage(): boolean {
	if (!isBrowserEnv()) return false

	try {
		const test = '__storage_test__'
		localStorage.setItem(test, test)
		localStorage.removeItem(test)
		return true
	} catch {
		return false
	}
}

/**
 * Check if session storage is available
 */
export function supportsSessionStorage(): boolean {
	if (!isBrowserEnv()) return false

	try {
		const test = '__storage_test__'
		sessionStorage.setItem(test, test)
		sessionStorage.removeItem(test)
		return true
	} catch {
		return false
	}
}

/**
 * Check if IndexedDB is available
 */
export function supportsIndexedDB(): boolean {
	return isBrowserEnv() && 'indexedDB' in window
}

/**
 * Check if Web Workers are available
 */
export function supportsWebWorkers(): boolean {
	return isBrowserEnv() && 'Worker' in window
}

/**
 * Check if Service Workers are available
 */
export function supportsServiceWorkers(): boolean {
	return isBrowserEnv() && 'serviceWorker' in navigator
}

/**
 * Check if WebSocket is available
 */
export function supportsWebSocket(): boolean {
	return isBrowserEnv() && 'WebSocket' in window
}

/**
 * Check if Geolocation is available
 */
export function supportsGeolocation(): boolean {
	return isBrowserEnv() && 'geolocation' in navigator
}

/**
 * Check if Notifications API is available
 */
export function supportsNotifications(): boolean {
	return isBrowserEnv() && 'Notification' in window
}

// ============================================================================
// Platform Helpers
// ============================================================================

/**
 * Check if iOS
 */
export function isIOS(): boolean {
	return detectOS() === 'ios'
}

/**
 * Check if Android
 */
export function isAndroid(): boolean {
	return detectOS() === 'android'
}

/**
 * Check if macOS
 */
export function isMacOS(): boolean {
	return detectOS() === 'macos'
}

/**
 * Check if Windows
 */
export function isWindows(): boolean {
	return detectOS() === 'windows'
}

/**
 * Check if running in Safari
 */
export function isSafari(): boolean {
	return detectBrowserVendor() === 'safari'
}

/**
 * Check if running in Chrome
 */
export function isChrome(): boolean {
	return detectBrowserVendor() === 'chrome'
}

/**
 * Check if running in Firefox
 */
export function isFirefox(): boolean {
	return detectBrowserVendor() === 'firefox'
}

/**
 * Check if running in Edge
 */
export function isEdge(): boolean {
	return detectBrowserVendor() === 'edge'
}

/**
 * Check if running in mobile browser
 */
export function isMobile(): boolean {
	return detectDeviceType() === 'mobile'
}

/**
 * Check if running in tablet browser
 */
export function isTablet(): boolean {
	return detectDeviceType() === 'tablet'
}

/**
 * Check if running in desktop browser
 */
export function isDesktop(): boolean {
	return detectDeviceType() === 'desktop'
}

// ============================================================================
// Vendor Specific Checks
// ============================================================================

/**
 * Check if running in WeChat browser
 */
export function isWeChat(): boolean {
	const ua = getUserAgent()
	return /MicroMessenger/i.test(ua)
}

/**
 * Check if running in UC Browser
 */
export function isUCBrowser(): boolean {
	const ua = getUserAgent()
	return /UCBrowser|UBrowser/i.test(ua)
}

/**
 * Check if running in Samsung Internet
 */
export function isSamsungInternet(): boolean {
	const ua = getUserAgent()
	return /SamsungBrowser/i.test(ua)
}

/**
 * Check if running in QQ Browser
 */
export function isQQBrowser(): boolean {
	const ua = getUserAgent()
	return /QQBrowser/i.test(ua)
}

/**
 * Check if running in embedded browser (in-app)
 */
export function isInAppBrowser(): boolean {
	const ua = getUserAgent()
	return /MicroMessenger|UCBrowser|QQBrowser|AlipayClient|Weibo/i.test(ua)
}

// ============================================================================
// Performance Helpers
// ============================================================================

/**
 * Get hardware concurrency (CPU cores)
 */
export function getHardwareConcurrency(): number {
	if (!isBrowserEnv()) return 1
	return navigator.hardwareConcurrency || 1
}

/**
 * Get device memory in GB (approximate)
 */
export function getDeviceMemory(): number {
	if (!isBrowserEnv()) return 4
	return (navigator as any).deviceMemory || 4
}

/**
 * Check if device has low memory
 */
export function isLowMemoryDevice(): boolean {
	return getDeviceMemory() < 4
}

/**
 * Check if device has low performance
 */
export function isLowPerformanceDevice(): boolean {
	return getHardwareConcurrency() < 4 || isLowMemoryDevice()
}

/**
 * Get network connection type
 */
export function getConnectionType(): string {
	if (!isBrowserEnv()) return 'unknown'

	const connection = (navigator as any).connection
	if (!connection) return 'unknown'

	return connection.effectiveType || connection.type || 'unknown'
}

/**
 * Check if on slow network
 */
export function isSlowNetwork(): boolean {
	const type = getConnectionType()
	return type === '2g' || type === 'slow-2g' || type === 'unknown'
}
