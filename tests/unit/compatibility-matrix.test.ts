import {
	BROWSER_TARGETS,
	FEATURE_MATRIX,
	generateBrowserslistConfig,
	getBrowserCompatibilityReport,
	getBrowsersSupportingFeature,
	getCompatibilityMatrix,
	getFeatureSupport,
	isBrowserSupported,
	MOBILE_DEVICES,
} from '@directix/core'

/**
 * Tests for compatibility test matrix
 */
import { describe, expect, it } from 'vitest'

describe('Compatibility Test Matrix', () => {
	describe('Browser Targets', () => {
		it('should have defined browser targets', () => {
			expect(BROWSER_TARGETS.length).toBeGreaterThan(0)
			expect(BROWSER_TARGETS.some(b => b.name === 'Chrome')).toBe(true)
			expect(BROWSER_TARGETS.some(b => b.name === 'Firefox')).toBe(true)
			expect(BROWSER_TARGETS.some(b => b.name === 'Safari')).toBe(true)
			expect(BROWSER_TARGETS.some(b => b.name === 'Edge')).toBe(true)
		})

		it('should have minimum versions defined', () => {
			BROWSER_TARGETS.forEach(target => {
				expect(target.minVersion).toBeGreaterThan(0)
				expect(target.currentVersion).toBeGreaterThanOrEqual(target.minVersion)
			})
		})

		it('should have features for each browser', () => {
			BROWSER_TARGETS.forEach(target => {
				expect(target.features.length).toBeGreaterThan(0)
			})
		})
	})

	describe('isBrowserSupported', () => {
		it('should return true for supported Chrome version', () => {
			expect(isBrowserSupported('Chrome', 100)).toBe(true)
			expect(isBrowserSupported('Chrome', 80)).toBe(true)
		})

		it('should return false for unsupported Chrome version', () => {
			expect(isBrowserSupported('Chrome', 70)).toBe(false)
			expect(isBrowserSupported('Chrome', 60)).toBe(false)
		})

		it('should return true for supported Firefox version', () => {
			expect(isBrowserSupported('Firefox', 100)).toBe(true)
			expect(isBrowserSupported('Firefox', 78)).toBe(true)
		})

		it('should return false for unsupported Firefox version', () => {
			expect(isBrowserSupported('Firefox', 60)).toBe(false)
		})

		it('should return true for supported Safari version', () => {
			expect(isBrowserSupported('Safari', 16)).toBe(true)
			expect(isBrowserSupported('Safari', 14)).toBe(true)
		})

		it('should return false for unsupported Safari version', () => {
			expect(isBrowserSupported('Safari', 12)).toBe(false)
		})

		it('should be case insensitive', () => {
			expect(isBrowserSupported('chrome', 100)).toBe(true)
			expect(isBrowserSupported('CHROME', 100)).toBe(true)
			expect(isBrowserSupported('FireFox', 100)).toBe(true)
		})

		it('should return false for unknown browser', () => {
			expect(isBrowserSupported('Unknown', 100)).toBe(false)
		})
	})

	describe('getFeatureSupport', () => {
		it('should return feature support for Chrome', () => {
			const support = getFeatureSupport('Chrome', 'IntersectionObserver')
			expect(support).toBeDefined()
			expect(support?.supported).toBe(true)
		})

		it('should return feature support for Firefox', () => {
			const support = getFeatureSupport('Firefox', 'ResizeObserver')
			expect(support).toBeDefined()
			expect(support?.supported).toBe(true)
		})

		it('should return undefined for unknown feature', () => {
			const support = getFeatureSupport('Chrome', 'UnknownFeature')
			expect(support).toBeUndefined()
		})

		it('should indicate polyfill availability', () => {
			const intersectionSupport = getFeatureSupport('Chrome', 'IntersectionObserver')
			expect(intersectionSupport?.polyfillAvailable).toBe(true)
		})
	})

	describe('getBrowsersSupportingFeature', () => {
		it('should return all browsers supporting IntersectionObserver', () => {
			const browsers = getBrowsersSupportingFeature('IntersectionObserver')
			expect(browsers.length).toBeGreaterThan(0)
			expect(browsers.some(b => b.name === 'Chrome')).toBe(true)
			expect(browsers.some(b => b.name === 'Firefox')).toBe(true)
		})

		it('should return empty array for unknown feature', () => {
			const browsers = getBrowsersSupportingFeature('UnknownFeature')
			expect(browsers).toHaveLength(0)
		})
	})

	describe('getBrowserCompatibilityReport', () => {
		it('should generate report for supported browser', () => {
			const report = getBrowserCompatibilityReport('Chrome', 100)

			expect(report.supported).toBe(true)
			expect(report.features.length).toBeGreaterThan(0)
			expect(report.recommendations.length).toBe(0)
		})

		it('should generate report for unsupported browser', () => {
			const report = getBrowserCompatibilityReport('Chrome', 60)

			expect(report.supported).toBe(false)
			expect(report.recommendations.length).toBeGreaterThan(0)
			expect(report.recommendations[0]).toContain('Upgrade')
		})

		it('should handle unknown browser', () => {
			const report = getBrowserCompatibilityReport('Unknown', 100)

			expect(report.supported).toBe(false)
			expect(report.features).toHaveLength(0)
		})
	})

	describe('generateBrowserslistConfig', () => {
		it('should generate valid browserslist configuration', () => {
			const config = generateBrowserslistConfig()

			expect(config.length).toBeGreaterThan(0)
			expect(config.some(c => c.includes('Chrome'))).toBe(true)
			expect(config.some(c => c.includes('Firefox'))).toBe(true)
			expect(config.some(c => c.includes('Safari'))).toBe(true)
			expect(config.some(c => c.includes('Edge'))).toBe(true)
		})

		it('should include mobile browsers', () => {
			const config = generateBrowserslistConfig()

			expect(config.some(c => c.includes('iOS'))).toBe(true)
			expect(config.some(c => c.includes('Android'))).toBe(true)
		})
	})

	describe('getCompatibilityMatrix', () => {
		it('should return full compatibility matrix', () => {
			const matrix = getCompatibilityMatrix()

			expect(matrix.browsers).toBeDefined()
			expect(matrix.features).toBeDefined()
			expect(matrix.mobileDevices).toBeDefined()
			expect(matrix.browsers.length).toBeGreaterThan(0)
		})
	})

	describe('Feature Matrix', () => {
		it('should have defined features', () => {
			expect(Object.keys(FEATURE_MATRIX).length).toBeGreaterThan(0)
			expect(FEATURE_MATRIX.intersectionObserver).toBeDefined()
			expect(FEATURE_MATRIX.resizeObserver).toBeDefined()
			expect(FEATURE_MATRIX.clipboardApi).toBeDefined()
		})

		it('should have browser support for each feature', () => {
			Object.values(FEATURE_MATRIX).forEach(feature => {
				expect(feature.browserSupport).toBeDefined()
				expect(Object.keys(feature.browserSupport).length).toBeGreaterThan(0)
			})
		})

		it('should indicate fallback availability', () => {
			expect(FEATURE_MATRIX.intersectionObserver.fallbackAvailable).toBe(true)
			expect(FEATURE_MATRIX.resizeObserver.fallbackAvailable).toBe(true)
			expect(FEATURE_MATRIX.mutationObserver.fallbackAvailable).toBe(false)
		})
	})

	describe('Mobile Devices', () => {
		it('should have defined mobile devices', () => {
			expect(MOBILE_DEVICES.length).toBeGreaterThan(0)
			expect(MOBILE_DEVICES.some(d => d.name === 'iPhone')).toBe(true)
			expect(MOBILE_DEVICES.some(d => d.name === 'iPad')).toBe(true)
			expect(MOBILE_DEVICES.some(d => d.name.includes('Android'))).toBe(true)
		})

		it('should have OS and browser info for each device', () => {
			MOBILE_DEVICES.forEach(device => {
				expect(device.os).toBeDefined()
				expect(device.osMinVersion).toBeDefined()
				expect(device.browser).toBeDefined()
				expect(device.browserMinVersion).toBeDefined()
			})
		})
	})
})
