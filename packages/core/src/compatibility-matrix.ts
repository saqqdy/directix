/**
 * Browser Compatibility Test Matrix for Directix
 * Defines supported browsers, versions, and test configurations
 */

// ============================================================================
// Types
// ============================================================================

export interface BrowserTarget {
	name: string
	minVersion: number
	currentVersion: number
	engine: 'blink' | 'gecko' | 'webkit'
	features: FeatureSupport[]
}

export interface FeatureSupport {
	name: string
	supported: boolean
	polyfillAvailable: boolean
	notes?: string
}

export interface CompatibilityMatrix {
	browsers: BrowserTarget[]
	features: Record<string, FeatureMatrix>
	mobileDevices: MobileDevice[]
}

export interface FeatureMatrix {
	name: string
	description: string
	browserSupport: Record<string, { minVersion: number, notes?: string }>
	fallbackAvailable: boolean
}

export interface MobileDevice {
	name: string
	os: string
	osMinVersion: string
	browser: string
	browserMinVersion: string
}

// ============================================================================
// Browser Targets
// ============================================================================

export const BROWSER_TARGETS: BrowserTarget[] = [
	{
		name: 'Chrome',
		minVersion: 80,
		currentVersion: 120,
		engine: 'blink',
		features: [
			{ name: 'IntersectionObserver', supported: true, polyfillAvailable: true },
			{ name: 'ResizeObserver', supported: true, polyfillAvailable: true },
			{ name: 'MutationObserver', supported: true, polyfillAvailable: false },
			{ name: 'Clipboard API', supported: true, polyfillAvailable: true },
			{ name: 'Pointer Events', supported: true, polyfillAvailable: true },
			{ name: 'CSS Grid', supported: true, polyfillAvailable: false },
			{ name: 'CSS Variables', supported: true, polyfillAvailable: false },
			{ name: 'Passive Events', supported: true, polyfillAvailable: false },
		],
	},
	{
		name: 'Firefox',
		minVersion: 78,
		currentVersion: 120,
		engine: 'gecko',
		features: [
			{ name: 'IntersectionObserver', supported: true, polyfillAvailable: true },
			{ name: 'ResizeObserver', supported: true, polyfillAvailable: true },
			{ name: 'MutationObserver', supported: true, polyfillAvailable: false },
			{ name: 'Clipboard API', supported: true, polyfillAvailable: true },
			{ name: 'Pointer Events', supported: true, polyfillAvailable: true },
			{ name: 'CSS Grid', supported: true, polyfillAvailable: false },
			{ name: 'CSS Variables', supported: true, polyfillAvailable: false },
			{ name: 'Passive Events', supported: true, polyfillAvailable: false },
		],
	},
	{
		name: 'Safari',
		minVersion: 14,
		currentVersion: 17,
		engine: 'webkit',
		features: [
			{ name: 'IntersectionObserver', supported: true, polyfillAvailable: true },
			{ name: 'ResizeObserver', supported: true, polyfillAvailable: true },
			{ name: 'MutationObserver', supported: true, polyfillAvailable: false },
			{ name: 'Clipboard API', supported: true, polyfillAvailable: true, notes: 'Partial support' },
			{ name: 'Pointer Events', supported: true, polyfillAvailable: true },
			{ name: 'CSS Grid', supported: true, polyfillAvailable: false },
			{ name: 'CSS Variables', supported: true, polyfillAvailable: false },
			{ name: 'Passive Events', supported: true, polyfillAvailable: false },
		],
	},
	{
		name: 'Edge',
		minVersion: 88,
		currentVersion: 120,
		engine: 'blink',
		features: [
			{ name: 'IntersectionObserver', supported: true, polyfillAvailable: true },
			{ name: 'ResizeObserver', supported: true, polyfillAvailable: true },
			{ name: 'MutationObserver', supported: true, polyfillAvailable: false },
			{ name: 'Clipboard API', supported: true, polyfillAvailable: true },
			{ name: 'Pointer Events', supported: true, polyfillAvailable: true },
			{ name: 'CSS Grid', supported: true, polyfillAvailable: false },
			{ name: 'CSS Variables', supported: true, polyfillAvailable: false },
			{ name: 'Passive Events', supported: true, polyfillAvailable: false },
		],
	},
	{
		name: 'Samsung Internet',
		minVersion: 12,
		currentVersion: 23,
		engine: 'blink',
		features: [
			{ name: 'IntersectionObserver', supported: true, polyfillAvailable: true },
			{ name: 'ResizeObserver', supported: true, polyfillAvailable: true },
			{ name: 'MutationObserver', supported: true, polyfillAvailable: false },
			{ name: 'Clipboard API', supported: true, polyfillAvailable: true },
			{ name: 'Pointer Events', supported: true, polyfillAvailable: true },
			{ name: 'CSS Grid', supported: true, polyfillAvailable: false },
			{ name: 'CSS Variables', supported: true, polyfillAvailable: false },
			{ name: 'Passive Events', supported: true, polyfillAvailable: false },
		],
	},
]

// ============================================================================
// Mobile Devices
// ============================================================================

export const MOBILE_DEVICES: MobileDevice[] = [
	{
		name: 'iPhone',
		os: 'iOS',
		osMinVersion: '14.0',
		browser: 'Safari',
		browserMinVersion: '14',
	},
	{
		name: 'iPad',
		os: 'iPadOS',
		osMinVersion: '14.0',
		browser: 'Safari',
		browserMinVersion: '14',
	},
	{
		name: 'Android Phone',
		os: 'Android',
		osMinVersion: '8.0',
		browser: 'Chrome',
		browserMinVersion: '80',
	},
	{
		name: 'Android Tablet',
		os: 'Android',
		osMinVersion: '8.0',
		browser: 'Chrome',
		browserMinVersion: '80',
	},
	{
		name: 'Samsung Galaxy',
		os: 'Android',
		osMinVersion: '10',
		browser: 'Samsung Internet',
		browserMinVersion: '12',
	},
]

// ============================================================================
// Feature Matrix
// ============================================================================

export const FEATURE_MATRIX: Record<string, FeatureMatrix> = {
	intersectionObserver: {
		name: 'IntersectionObserver',
		description: 'API for detecting element visibility',
		browserSupport: {
			Chrome: { minVersion: 51 },
			Firefox: { minVersion: 55 },
			Safari: { minVersion: 12.1 },
			Edge: { minVersion: 15 },
			Samsung: { minVersion: 5 },
		},
		fallbackAvailable: true,
	},
	resizeObserver: {
		name: 'ResizeObserver',
		description: 'API for detecting element size changes',
		browserSupport: {
			Chrome: { minVersion: 64 },
			Firefox: { minVersion: 69 },
			Safari: { minVersion: 13.1 },
			Edge: { minVersion: 79 },
			Samsung: { minVersion: 8 },
		},
		fallbackAvailable: true,
	},
	mutationObserver: {
		name: 'MutationObserver',
		description: 'API for observing DOM changes',
		browserSupport: {
			Chrome: { minVersion: 18 },
			Firefox: { minVersion: 14 },
			Safari: { minVersion: 6 },
			Edge: { minVersion: 12 },
			Samsung: { minVersion: 1.5 },
		},
		fallbackAvailable: false,
	},
	clipboardApi: {
		name: 'Clipboard API',
		description: 'Modern async clipboard API',
		browserSupport: {
			Chrome: { minVersion: 66 },
			Firefox: { minVersion: 63 },
			Safari: { minVersion: 13.1, notes: 'Partial support' },
			Edge: { minVersion: 79 },
			Samsung: { minVersion: 9 },
		},
		fallbackAvailable: true,
	},
	pointerEvents: {
		name: 'Pointer Events',
		description: 'Unified pointer input API',
		browserSupport: {
			Chrome: { minVersion: 55 },
			Firefox: { minVersion: 59 },
			Safari: { minVersion: 13 },
			Edge: { minVersion: 12 },
			Samsung: { minVersion: 6 },
		},
		fallbackAvailable: true,
	},
	cssGrid: {
		name: 'CSS Grid',
		description: 'CSS Grid Layout',
		browserSupport: {
			Chrome: { minVersion: 57 },
			Firefox: { minVersion: 52 },
			Safari: { minVersion: 10.1 },
			Edge: { minVersion: 16 },
			Samsung: { minVersion: 6 },
		},
		fallbackAvailable: false,
	},
	cssVariables: {
		name: 'CSS Variables',
		description: 'CSS Custom Properties',
		browserSupport: {
			Chrome: { minVersion: 49 },
			Firefox: { minVersion: 31 },
			Safari: { minVersion: 9.1 },
			Edge: { minVersion: 15 },
			Samsung: { minVersion: 5 },
		},
		fallbackAvailable: false,
	},
	passiveEvents: {
		name: 'Passive Event Listeners',
		description: 'Passive event listener option',
		browserSupport: {
			Chrome: { minVersion: 51 },
			Firefox: { minVersion: 49 },
			Safari: { minVersion: 10 },
			Edge: { minVersion: 15 },
			Samsung: { minVersion: 5 },
		},
		fallbackAvailable: false,
	},
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a browser version is supported
 */
export function isBrowserSupported(browserName: string, version: number): boolean {
	const target = BROWSER_TARGETS.find(t => t.name.toLowerCase() === browserName.toLowerCase())
	return target ? version >= target.minVersion : false
}

/**
 * Get feature support for a browser
 */
export function getFeatureSupport(browserName: string, featureName: string): FeatureSupport | undefined {
	const target = BROWSER_TARGETS.find(t => t.name.toLowerCase() === browserName.toLowerCase())
	return target?.features.find(f => f.name.toLowerCase() === featureName.toLowerCase())
}

/**
 * Get all supported browsers for a feature
 */
export function getBrowsersSupportingFeature(featureName: string): BrowserTarget[] {
	return BROWSER_TARGETS.filter(target =>
		target.features.some(f => f.name.toLowerCase() === featureName.toLowerCase() && f.supported),
	)
}

/**
 * Get compatibility report for a browser
 */
export function getBrowserCompatibilityReport(browserName: string, version: number): {
	supported: boolean
	features: FeatureSupport[]
	recommendations: string[]
} {
	const target = BROWSER_TARGETS.find(t => t.name.toLowerCase() === browserName.toLowerCase())
	const supported = target ? version >= target.minVersion : false
	const features = target?.features || []
	const recommendations: string[] = []

	if (!supported && target) {
		recommendations.push(`Upgrade ${browserName} to version ${target.minVersion}+`)
	}

	features.forEach(feature => {
		if (!feature.supported && feature.polyfillAvailable) {
			recommendations.push(`Enable polyfill for ${feature.name}`)
		}
	})

	return { supported, features, recommendations }
}

/**
 * Generate browserslist configuration
 */
export function generateBrowserslistConfig(): string[] {
	const config: string[] = []

	BROWSER_TARGETS.forEach(target => {
		const browserName = target.name.toLowerCase().replace(' ', '')
		if (browserName === 'samsung internet') {
			config.push(`Samsung >= ${target.minVersion}`)
		} else if (browserName === 'chrome') {
			config.push(`Chrome >= ${target.minVersion}`)
		} else if (browserName === 'firefox') {
			config.push(`Firefox >= ${target.minVersion}`)
		} else if (browserName === 'safari') {
			config.push(`Safari >= ${target.minVersion}`)
		} else if (browserName === 'edge') {
			config.push(`Edge >= ${target.minVersion}`)
		}
	})

	// Add mobile devices
	config.push('iOS >= 14')
	config.push('Android >= 80')

	return config
}

/**
 * Get full compatibility matrix
 */
export function getCompatibilityMatrix(): CompatibilityMatrix {
	return {
		browsers: BROWSER_TARGETS,
		features: FEATURE_MATRIX,
		mobileDevices: MOBILE_DEVICES,
	}
}
