/**
 * Browser compatibility module for Directix
 * Provides browser detection, polyfill management, and fallback strategies
 */

import { isBrowser } from './env'

// ============================================================================
// Types
// ============================================================================

/**
 * Browser type
 */
export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'samsung' | 'uc' | 'wechat' | 'unknown'

/**
 * Platform type
 */
export type PlatformType = 'desktop' | 'mobile' | 'tablet'

/**
 * Support level
 */
export type SupportLevel = 'full' | 'partial' | 'none'

/**
 * Browser version info
 */
export interface BrowserInfo {
	type: BrowserType
	version: string
	major: number
	platform: PlatformType
	os: string
	supportLevel: SupportLevel
	features: BrowserFeatures
}

/**
 * Browser feature support status
 */
export interface BrowserFeatures {
	passive: boolean
	intersectionObserver: boolean
	resizeObserver: boolean
	mutationObserver: boolean
	clipboard: boolean
	clipboardItem: boolean
	clipboardWrite: boolean
	clipboardRead: boolean
	pointerEvents: boolean
	touchEvents: boolean
	webAnimations: boolean
	customElements: boolean
	shadowDom: boolean
	cssVariables: boolean
	cssGrid: boolean
	cssFlexbox: boolean
	es2020: boolean
	es2021: boolean
	es2022: boolean
}

/**
 * Browser target configuration
 */
export interface BrowserTarget {
	chrome?: string
	firefox?: string
	safari?: string
	edge?: string
	samsung?: string
}

/**
 * Fallback strategy configuration
 */
export interface FallbackConfig {
	intersectionObserver: boolean
	resizeObserver: boolean
	clipboard: boolean
	mutationObserver: boolean
	pointerEvents: boolean
	touchEvents: boolean
}

/**
 * Polyfill strategy
 */
export type PolyfillStrategy = 'auto' | 'manual' | 'none'

/**
 * Compatibility configuration
 */
export interface BrowserCompatibilityConfig {
	targets: BrowserTarget
	fallback: FallbackConfig
	polyfill: PolyfillStrategy
	warnOnUnsupported: boolean
	strictMode: boolean
}

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default browser targets
 */
export const DEFAULT_BROWSER_TARGETS: BrowserTarget = {
	chrome: '>= 80',
	firefox: '>= 78',
	safari: '>= 14',
	edge: '>= 88',
	samsung: '>= 12',
}

/**
 * Default fallback configuration
 */
export const DEFAULT_FALLBACK_CONFIG: FallbackConfig = {
	intersectionObserver: true,
	resizeObserver: true,
	clipboard: true,
	mutationObserver: true,
	pointerEvents: true,
	touchEvents: true,
}

// ============================================================================
// Browser Detection
// ============================================================================

let _browserInfo: BrowserInfo | null = null,
	_compatibilityConfig: BrowserCompatibilityConfig = {
		targets: DEFAULT_BROWSER_TARGETS,
		fallback: DEFAULT_FALLBACK_CONFIG,
		polyfill: 'auto',
		warnOnUnsupported: true,
		strictMode: false,
	}

/**
 * Parse version string to number
 */
function parseVersion(version: string): number {
	const match = version.match(/(\d+)/)
	return match ? parseInt(match[1], 10) : 0
}

/**
 * Get browser type and version from user agent
 */
function detectBrowser(): { type: BrowserType, version: string } {
	if (!isBrowser()) {
		return { type: 'unknown', version: '0' }
	}

	const ua = navigator.userAgent

	// WeChat (must check before other browsers)
	if (/MicroMessenger/i.test(ua)) {
		const match = ua.match(/MicroMessenger\/(\d+\.?\d*)/)
		return { type: 'wechat', version: match?.[1] || '0' }
	}

	// UC Browser
	if (/UCBrowser|UBrowser/i.test(ua)) {
		const match = ua.match(/UCBrowser\/(\d+\.?\d*)/)
		return { type: 'uc', version: match?.[1] || '0' }
	}

	// Samsung Internet
	if (/SamsungBrowser/i.test(ua)) {
		const match = ua.match(/SamsungBrowser\/(\d+\.?\d*)/)
		return { type: 'samsung', version: match?.[1] || '0' }
	}

	// Opera
	if (/OPR|Opera/i.test(ua)) {
		const match = ua.match(/(?:OPR|Opera)\/(\d+\.?\d*)/)
		return { type: 'opera', version: match?.[1] || '0' }
	}

	// Edge (Chromium-based)
	if (/Edg/i.test(ua)) {
		const match = ua.match(/Edg\/(\d+\.?\d*)/)
		return { type: 'edge', version: match?.[1] || '0' }
	}

	// Firefox
	if (/Firefox/i.test(ua)) {
		const match = ua.match(/Firefox\/(\d+\.?\d*)/)
		return { type: 'firefox', version: match?.[1] || '0' }
	}

	// Safari (must check after Chrome)
	if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
		const match = ua.match(/Version\/(\d+\.?\d*)/)
		return { type: 'safari', version: match?.[1] || '0' }
	}

	// Chrome
	if (/Chrome/i.test(ua)) {
		const match = ua.match(/Chrome\/(\d+\.?\d*)/)
		return { type: 'chrome', version: match?.[1] || '0' }
	}

	return { type: 'unknown', version: '0' }
}

/**
 * Detect platform type
 */
function detectPlatform(): PlatformType {
	if (!isBrowser()) return 'desktop'

	const ua = navigator.userAgent

	if (/tablet|ipad/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) {
		return 'tablet'
	}

	if (/mobile|iphone|ipod|android.*mobile/i.test(ua)) {
		return 'mobile'
	}

	return 'desktop'
}

/**
 * Detect operating system
 */
function detectOS(): string {
	if (!isBrowser()) return 'unknown'

	const ua = navigator.userAgent

	if (/Windows/i.test(ua)) return 'Windows'
	if (/Mac/i.test(ua)) return 'macOS'
	if (/Linux/i.test(ua)) return 'Linux'
	if (/Android/i.test(ua)) return 'Android'
	if (/iOS|iPhone|iPad|iPod/i.test(ua)) return 'iOS'

	return 'unknown'
}

/**
 * Detect browser feature support
 */
function detectFeatures(): BrowserFeatures {
	if (!isBrowser()) {
		return createEmptyFeatures()
	}

	const win = window as any
	const nav = navigator as any

	return {
		passive: checkPassiveSupport(),
		intersectionObserver: 'IntersectionObserver' in win,
		resizeObserver: 'ResizeObserver' in win,
		mutationObserver: 'MutationObserver' in win,
		clipboard: 'clipboard' in nav,
		clipboardItem: 'ClipboardItem' in win,
		clipboardWrite: checkClipboardWrite(),
		clipboardRead: checkClipboardRead(),
		pointerEvents: 'PointerEvent' in win,
		touchEvents: 'ontouchstart' in win || (nav.maxTouchPoints > 0),
		webAnimations: 'animate' in Element.prototype,
		customElements: 'customElements' in win,
		shadowDom: 'attachShadow' in Element.prototype,
		cssVariables: checkCSSSupport('--test', 'test'),
		cssGrid: checkCSSSupport('grid-template-columns', '1fr'),
		cssFlexbox: checkCSSSupport('display', 'flex'),
		es2020: checkES2020Support(),
		es2021: checkES2021Support(),
		es2022: checkES2022Support(),
	}
}

function createEmptyFeatures(): BrowserFeatures {
	return {
		passive: false,
		intersectionObserver: false,
		resizeObserver: false,
		mutationObserver: false,
		clipboard: false,
		clipboardItem: false,
		clipboardWrite: false,
		clipboardRead: false,
		pointerEvents: false,
		touchEvents: false,
		webAnimations: false,
		customElements: false,
		shadowDom: false,
		cssVariables: false,
		cssGrid: false,
		cssFlexbox: false,
		es2020: false,
		es2021: false,
		es2022: false,
	}
}

function checkPassiveSupport(): boolean {
	let supports = false
	try {
		const options = {
			get passive() {
				supports = true
				return false
			},
		}
		window.addEventListener('test', null as any, options)
		window.removeEventListener('test', null as any, options as any)
	} catch {
		supports = false
	}
	return supports
}

function checkClipboardWrite(): boolean {
	if (!isBrowser()) return false
	const nav = navigator as any
	if (!nav.clipboard) return false
	return typeof nav.clipboard.writeText === 'function' || typeof nav.clipboard.write === 'function'
}

function checkClipboardRead(): boolean {
	if (!isBrowser()) return false
	const nav = navigator as any
	if (!nav.clipboard) return false
	return typeof nav.clipboard.readText === 'function' || typeof nav.clipboard.read === 'function'
}

function checkCSSSupport(property: string, value: string): boolean {
	if (!isBrowser()) return false
	const div = document.createElement('div')
	div.style[property as any] = value
	return div.style[property as any] === value
}

function checkES2020Support(): boolean {
	try {
		// Check for optional chaining and nullish coalescing
		// eslint-disable-next-line no-eval
		eval('const a = {}; a?.b?.c ?? null')
		return true
	} catch {
		return false
	}
}

function checkES2021Support(): boolean {
	try {
		// Check for logical assignment operators
		// eslint-disable-next-line no-eval
		eval('let a = false; a ||= true')
		return true
	} catch {
		return false
	}
}

function checkES2022Support(): boolean {
	try {
		// Check for top-level await and class fields
		// eslint-disable-next-line no-eval
		eval('class A { static x = 1 }')
		return true
	} catch {
		return false
	}
}

/**
 * Determine support level based on browser and version
 */
function determineSupportLevel(type: BrowserType, major: number): SupportLevel {
	switch (type) {
		case 'chrome':
			return major >= 80 ? 'full' : major >= 60 ? 'partial' : 'none'
		case 'firefox':
			return major >= 78 ? 'full' : major >= 60 ? 'partial' : 'none'
		case 'safari':
			return major >= 14 ? 'full' : major >= 12 ? 'partial' : 'none'
		case 'edge':
			return major >= 88 ? 'full' : major >= 79 ? 'partial' : 'none'
		case 'samsung':
			return major >= 12 ? 'full' : major >= 10 ? 'partial' : 'none'
		case 'opera':
			return major >= 67 ? 'full' : major >= 50 ? 'partial' : 'none'
		case 'uc':
		case 'wechat':
			return 'partial' // Partial support due to limited testing
		default:
			return 'partial'
	}
}

/**
 * Get browser information
 */
export function getBrowserInfo(): BrowserInfo {
	if (_browserInfo) return _browserInfo

	const { type, version } = detectBrowser()
	const major = parseVersion(version)
	const platform = detectPlatform()
	const os = detectOS()
	const supportLevel = determineSupportLevel(type, major)
	const features = detectFeatures()

	_browserInfo = {
		type,
		version,
		major,
		platform,
		os,
		supportLevel,
		features,
	}

	return _browserInfo
}

/**
 * Configure browser compatibility settings
 */
export function configureCompatibility(config: Partial<BrowserCompatibilityConfig>): void {
	_compatibilityConfig = {
		..._compatibilityConfig,
		...config,
		targets: { ..._compatibilityConfig.targets, ...config.targets },
		fallback: { ..._compatibilityConfig.fallback, ...config.fallback },
	}
}

/**
 * Get current compatibility configuration
 */
export function getCompatibilityConfig(): BrowserCompatibilityConfig {
	return { ..._compatibilityConfig }
}

/**
 * Reset browser info cache (useful for testing)
 */
export function resetBrowserInfo(): void {
	_browserInfo = null
}

// ============================================================================
// Feature Support Checks
// ============================================================================

/**
 * Check if a feature is supported
 */
export function isFeatureSupported(feature: keyof BrowserFeatures): boolean {
	const info = getBrowserInfo()
	return info.features[feature]
}

/**
 * Check if current browser meets minimum requirements
 */
export function meetsMinimumRequirements(): boolean {
	const info = getBrowserInfo()
	return info.supportLevel !== 'none'
}

/**
 * Check if current browser is fully supported
 */
export function isFullySupported(): boolean {
	const info = getBrowserInfo()
	return info.supportLevel === 'full'
}

/**
 * Check if running in a known unsupported browser
 */
export function isUnsupportedBrowser(): boolean {
	const info = getBrowserInfo()
	return info.supportLevel === 'none'
}

/**
 * Get unsupported features list
 */
export function getUnsupportedFeatures(): (keyof BrowserFeatures)[] {
	const info = getBrowserInfo()
	return Object.entries(info.features)
		.filter(([, supported]) => !supported)
		.map(([feature]) => feature as keyof BrowserFeatures)
}

// ============================================================================
// Warning System
// ============================================================================

// eslint-disable-next-line one-var
let _warnedFeatures = new Set<string>()

/**
 * Warn about unsupported features
 */
export function warnUnsupportedFeatures(): void {
	if (!_compatibilityConfig.warnOnUnsupported) return

	const info = getBrowserInfo()

	if (info.supportLevel === 'none') {
		console.warn(
			`[Directix] Your browser (${info.type} ${info.version}) is not officially supported. `
			+ 'Some features may not work correctly.',
		)
		return
	}

	if (info.supportLevel === 'partial') {
		console.warn(
			`[Directix] Your browser (${info.type} ${info.version}) has partial support. `
			+ 'Some features may be degraded.',
		)
	}

	const unsupported = getUnsupportedFeatures()
	if (unsupported.length > 0) {
		console.warn(
			`[Directix] Some features are not supported in your browser: ${unsupported.join(', ')}`,
		)
	}
}

/**
 * Warn once about a specific feature
 */
export function warnUnsupportedFeatureOnce(feature: string, fallback?: string): void {
	if (_warnedFeatures.has(feature)) return
	_warnedFeatures.add(feature)

	const message = fallback ? `[Directix] "${feature}" is not supported, using fallback: ${fallback}` : `[Directix] "${feature}" is not supported in this browser`

	console.warn(message)
}

/**
 * Clear warned features cache
 */
export function clearWarnedFeatures(): void {
	_warnedFeatures = new Set<string>()
}

// ============================================================================
// Compatibility Report
// ============================================================================

/**
 * Compatibility report
 */
export interface CompatibilityReport {
	browser: BrowserInfo
	config: BrowserCompatibilityConfig
	unsupportedFeatures: (keyof BrowserFeatures)[]
	warnings: string[]
	recommendations: string[]
}

/**
 * Generate compatibility report
 */
export function generateCompatibilityReport(): CompatibilityReport {
	const browser = getBrowserInfo()
	const config = getCompatibilityConfig()
	const unsupportedFeatures = getUnsupportedFeatures()

	const warnings: string[] = []
	const recommendations: string[] = []

	// Check for critical unsupported features
	if (!browser.features.intersectionObserver && config.fallback.intersectionObserver) {
		warnings.push('IntersectionObserver is not supported - lazy loading will use fallback')
		recommendations.push('Consider adding intersection-observer polyfill for better performance')
	}

	if (!browser.features.resizeObserver && config.fallback.resizeObserver) {
		warnings.push('ResizeObserver is not supported - resize detection will use fallback')
		recommendations.push('Consider adding resize-observer-polyfill')
	}

	if (!browser.features.clipboard && config.fallback.clipboard) {
		warnings.push('Clipboard API is not supported - copy/paste will use fallback')
		recommendations.push('Copy functionality will use execCommand fallback')
	}

	if (!browser.features.passive) {
		warnings.push('Passive event listeners are not supported - scroll performance may be affected')
	}

	if (browser.supportLevel === 'partial') {
		recommendations.push('Consider upgrading your browser for the best experience')
	}

	return {
		browser,
		config,
		unsupportedFeatures,
		warnings,
		recommendations,
	}
}

// ============================================================================
// Polyfill Management
// ============================================================================

interface PolyfillInfo {
	name: string
	loaded: boolean
	required: boolean
}

const _polyfills = new Map<string, PolyfillInfo>()

/**
 * Register a polyfill
 */
export function registerPolyfill(name: string, required: boolean = false): void {
	_polyfills.set(name, { name, loaded: false, required })
}

/**
 * Mark a polyfill as loaded
 */
export function markPolyfillLoaded(name: string): void {
	const info = _polyfills.get(name)
	if (info) {
		info.loaded = true
	}
}

/**
 * Check if a polyfill is loaded
 */
export function isPolyfillLoaded(name: string): boolean {
	return _polyfills.get(name)?.loaded ?? false
}

/**
 * Get required polyfills that are not loaded
 */
export function getMissingPolyfills(): string[] {
	return Array.from(_polyfills.values())
		.filter(p => p.required && !p.loaded)
		.map(p => p.name)
}

/**
 * Get polyfill status
 */
export function getPolyfillStatus(): Record<string, { loaded: boolean, required: boolean }> {
	const result: Record<string, { loaded: boolean, required: boolean }> = {}
	_polyfills.forEach((info, name) => {
		result[name] = { loaded: info.loaded, required: info.required }
	})
	return result
}
