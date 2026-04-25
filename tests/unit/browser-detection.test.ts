import {
	detectBrowser,
	detectBrowserVendor,
	detectBrowserVersion,
	detectDeviceType,
	detectOS,
	getBrowserLanguage,
	getConnectionType,
	getDeviceMemory,
	getHardwareConcurrency,
	getUserAgent,
	isAndroid,
	isBrowserEnv,
	isChrome,
	isDesktop,
	isEdge,
	isFirefox,
	isInAppBrowser,
	isIOS,
	isLowMemoryDevice,
	isLowPerformanceDevice,
	isMacOS,
	isMobile,
	isQQBrowser,
	isSafari,
	isSamsungInternet,
	isSlowNetwork,
	isTablet,
	isTouchDevice,
	isUCBrowser,
	isWeChat,
	isWindows,
	supportsAsyncClipboardWrite,
	supportsClipboardAPI,
	supportsClipboardRead,
	supportsCSSFlexbox,
	supportsCSSGrid,
	supportsCSSVariables,
	supportsCustomElements,
	supportsGeolocation,
	supportsIndexedDB,
	supportsIntersectionObserver,
	supportsLocalStorage,
	supportsMutationObserver,
	supportsNotifications,
	supportsPassiveEvents,
	supportsPointerEvents,
	supportsRequestIdleCallback,
	supportsResizeObserver,
	supportsServiceWorkers,
	supportsSessionStorage,
	supportsShadowDOM,
	supportsWebAnimations,
	supportsWebSocket,
	supportsWebWorkers,
} from '@directix/shared'

/**
 * Tests for browser detection utilities
 */
import { afterEach, describe, expect, it, vi } from 'vitest'

// Mock user agent
const mockUserAgent = (ua: string) => {
	Object.defineProperty(navigator, 'userAgent', {
		value: ua,
		configurable: true,
	})
}

// Mock navigator properties
const _mockNavigator = (props: Record<string, any>) => {
	for (const [key, value] of Object.entries(props)) {
		Object.defineProperty(navigator, key, {
			value,
			configurable: true,
		})
	}
}

describe('Browser Detection Utilities', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('Environment Detection', () => {
		it('should detect browser environment', () => {
			expect(isBrowserEnv()).toBe(true)
		})

		it('should get user agent', () => {
			// Reset navigator.userAgent to a test value
			Object.defineProperty(navigator, 'userAgent', {
				value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
				configurable: true,
			})
			const ua = getUserAgent()
			expect(typeof ua).toBe('string')
			expect(ua.length).toBeGreaterThan(0)
		})
	})

	describe('Browser Vendor Detection', () => {
		it('should detect Chrome', () => {
			mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
			expect(detectBrowserVendor()).toBe('chrome')
			expect(isChrome()).toBe(true)
		})

		it('should detect Firefox', () => {
			mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0')
			expect(detectBrowserVendor()).toBe('firefox')
			expect(isFirefox()).toBe(true)
		})

		it('should detect Safari', () => {
			mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15')
			expect(detectBrowserVendor()).toBe('safari')
			expect(isSafari()).toBe(true)
		})

		it('should detect Edge', () => {
			mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59')
			expect(detectBrowserVendor()).toBe('edge')
			expect(isEdge()).toBe(true)
		})

		it('should detect WeChat browser', () => {
			mockUserAgent('Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.92 Mobile Safari/537.36 MicroMessenger/8.0.0')
			expect(isWeChat()).toBe(true)
		})

		it('should detect UC Browser', () => {
			mockUserAgent('Mozilla/5.0 (Linux; U; Android 10; en-US; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/13.0.0.1288 Mobile Safari/537.36')
			expect(isUCBrowser()).toBe(true)
		})

		it('should detect Samsung Internet', () => {
			mockUserAgent('Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/13.0 Chrome/83.0.4103.106 Mobile Safari/537.36')
			expect(isSamsungInternet()).toBe(true)
		})

		it('should detect QQ Browser', () => {
			mockUserAgent('Mozilla/5.0 (Linux; U; Android 10; en-US; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 MQQBrowser/12.0 Mobile Safari/537.36')
			expect(isQQBrowser()).toBe(true)
		})

		it('should detect in-app browser', () => {
			mockUserAgent('Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.92 Mobile Safari/537.36 MicroMessenger/8.0.0')
			expect(isInAppBrowser()).toBe(true)
		})
	})

	describe('Browser Version Detection', () => {
		it('should extract Chrome version', () => {
			mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
			expect(detectBrowserVersion()).toBe('91.0')
		})

		it('should extract Firefox version', () => {
			mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0')
			expect(detectBrowserVersion()).toBe('89.0')
		})
	})

	describe('OS Detection', () => {
		it('should detect Windows', () => {
			mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
			expect(detectOS()).toBe('windows')
			expect(isWindows()).toBe(true)
		})

		it('should detect macOS', () => {
			mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
			expect(detectOS()).toBe('macos')
			expect(isMacOS()).toBe(true)
		})

		it('should detect iOS', () => {
			mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1')
			expect(detectOS()).toBe('ios')
			expect(isIOS()).toBe(true)
		})

		it('should detect Android', () => {
			mockUserAgent('Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36')
			expect(detectOS()).toBe('android')
			expect(isAndroid()).toBe(true)
		})
	})

	describe('Device Type Detection', () => {
		it('should detect mobile device', () => {
			mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1')
			expect(detectDeviceType()).toBe('mobile')
			expect(isMobile()).toBe(true)
			expect(isTablet()).toBe(false)
			expect(isDesktop()).toBe(false)
		})

		it('should detect tablet device', () => {
			mockUserAgent('Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1')
			expect(detectDeviceType()).toBe('tablet')
			expect(isTablet()).toBe(true)
			expect(isMobile()).toBe(false)
			expect(isDesktop()).toBe(false)
		})

		it('should detect desktop device', () => {
			mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
			expect(detectDeviceType()).toBe('desktop')
			expect(isDesktop()).toBe(true)
			expect(isMobile()).toBe(false)
			expect(isTablet()).toBe(false)
		})
	})

	describe('Touch Detection', () => {
		it('should detect touch device', () => {
			// This depends on the test environment
			const result = isTouchDevice()
			expect(typeof result).toBe('boolean')
		})
	})

	describe('Language Detection', () => {
		it('should get browser language', () => {
			const lang = getBrowserLanguage()
			expect(typeof lang).toBe('string')
			expect(lang.length).toBeGreaterThan(0)
		})
	})

	describe('Full Browser Detection', () => {
		it('should return complete browser detection result', () => {
			mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

			const result = detectBrowser()

			expect(result.vendor).toBeDefined()
			expect(result.version).toBeDefined()
			expect(result.os).toBeDefined()
			expect(result.device).toBeDefined()
			expect(typeof result.isMobile).toBe('boolean')
			expect(typeof result.isTablet).toBe('boolean')
			expect(typeof result.isDesktop).toBe('boolean')
			expect(typeof result.isTouch).toBe('boolean')
			expect(result.language).toBeDefined()
			expect(result.userAgent).toBeDefined()
		})
	})

	describe('Feature Detection', () => {
		it('should check IntersectionObserver support', () => {
			const result = supportsIntersectionObserver()
			expect(typeof result).toBe('boolean')
		})

		it('should check ResizeObserver support', () => {
			const result = supportsResizeObserver()
			expect(typeof result).toBe('boolean')
		})

		it('should check MutationObserver support', () => {
			const result = supportsMutationObserver()
			expect(typeof result).toBe('boolean')
		})

		it('should check Clipboard API support', () => {
			const result = supportsClipboardAPI()
			expect(typeof result).toBe('boolean')
		})

		it('should check async clipboard write support', () => {
			const result = supportsAsyncClipboardWrite()
			expect(typeof result).toBe('boolean')
		})

		it('should check clipboard read support', () => {
			const result = supportsClipboardRead()
			expect(typeof result).toBe('boolean')
		})

		it('should check Pointer Events support', () => {
			const result = supportsPointerEvents()
			expect(typeof result).toBe('boolean')
		})

		it('should check Web Animations support', () => {
			const result = supportsWebAnimations()
			expect(typeof result).toBe('boolean')
		})

		it('should check requestIdleCallback support', () => {
			const result = supportsRequestIdleCallback()
			expect(typeof result).toBe('boolean')
		})

		it('should check Custom Elements support', () => {
			const result = supportsCustomElements()
			expect(typeof result).toBe('boolean')
		})

		it('should check Shadow DOM support', () => {
			const result = supportsShadowDOM()
			expect(typeof result).toBe('boolean')
		})

		it('should check CSS Grid support', () => {
			const result = supportsCSSGrid()
			expect(typeof result).toBe('boolean')
		})

		it('should check CSS Flexbox support', () => {
			const result = supportsCSSFlexbox()
			expect(typeof result).toBe('boolean')
		})

		it('should check CSS Variables support', () => {
			const result = supportsCSSVariables()
			expect(typeof result).toBe('boolean')
		})

		it('should check localStorage support', () => {
			const result = supportsLocalStorage()
			expect(typeof result).toBe('boolean')
		})

		it('should check sessionStorage support', () => {
			const result = supportsSessionStorage()
			expect(typeof result).toBe('boolean')
		})

		it('should check IndexedDB support', () => {
			const result = supportsIndexedDB()
			expect(typeof result).toBe('boolean')
		})

		it('should check Web Workers support', () => {
			const result = supportsWebWorkers()
			expect(typeof result).toBe('boolean')
		})

		it('should check Service Workers support', () => {
			const result = supportsServiceWorkers()
			expect(typeof result).toBe('boolean')
		})

		it('should check WebSocket support', () => {
			const result = supportsWebSocket()
			expect(typeof result).toBe('boolean')
		})

		it('should check Geolocation support', () => {
			const result = supportsGeolocation()
			expect(typeof result).toBe('boolean')
		})

		it('should check Notifications support', () => {
			const result = supportsNotifications()
			expect(typeof result).toBe('boolean')
		})

		it('should check passive events support', () => {
			const result = supportsPassiveEvents()
			expect(typeof result).toBe('boolean')
		})
	})

	describe('Performance Helpers', () => {
		it('should get hardware concurrency', () => {
			const cores = getHardwareConcurrency()
			expect(typeof cores).toBe('number')
			expect(cores).toBeGreaterThanOrEqual(1)
		})

		it('should get device memory', () => {
			const memory = getDeviceMemory()
			expect(typeof memory).toBe('number')
			expect(memory).toBeGreaterThan(0)
		})

		it('should check low memory device', () => {
			const result = isLowMemoryDevice()
			expect(typeof result).toBe('boolean')
		})

		it('should check low performance device', () => {
			const result = isLowPerformanceDevice()
			expect(typeof result).toBe('boolean')
		})

		it('should get connection type', () => {
			const type = getConnectionType()
			expect(typeof type).toBe('string')
		})

		it('should check slow network', () => {
			const result = isSlowNetwork()
			expect(typeof result).toBe('boolean')
		})
	})
})
