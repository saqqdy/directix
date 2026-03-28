/**
 * Vue version type
 * - 2: Vue 2.6.x (requires @vue/composition-api for Composition API)
 * - 2.7: Vue 2.7.x (has built-in Composition API support)
 * - 3: Vue 3.x
 */
export type VueVersion = 2 | 2.7 | 3

/**
 * Vue version detection
 */
let _vueVersion: VueVersion | null = null,
	_isVue2: boolean | null = null,
	_isVue27: boolean | null = null,
	_isVue3: boolean | null = null

/**
 * Parse version string to VueVersion
 */
function parseVersion(version: string): VueVersion | null {
	if (version.startsWith('2.7')) return 2.7
	if (version.startsWith('2')) return 2
	if (version.startsWith('3')) return 3

	return null
}

/**
 * Get current Vue version
 */
export function getVueVersion(): VueVersion {
	if (_vueVersion !== null) return _vueVersion

	// Method 1: Check environment variable (highest priority)
	if (typeof process !== 'undefined') {
		const envVersion = process.env.DIRECTIX_VUE_VERSION

		if (envVersion === '2.7') {
			_vueVersion = 2.7

			return _vueVersion
		}
		if (envVersion === '2') {
			_vueVersion = 2

			return _vueVersion
		}
		if (envVersion === '3') {
			_vueVersion = 3

			return _vueVersion
		}
	}

	// Method 2: Try require (CommonJS/Node.js)
	try {
		// eslint-disable-next-line ts/no-require-imports
		const vue = require('vue')
		const version = parseVersion(vue?.version)

		if (version !== null) {
			_vueVersion = version

			return _vueVersion
		}
	} catch {
		// require failed, continue to other methods
	}

	// Method 3: Check browser environment
	if (typeof window !== 'undefined') {
		const win = window as any
		const vue = win.Vue

		// Check version string
		if (vue?.version) {
			const version = parseVersion(vue.version)

			if (version !== null) {
				_vueVersion = version

				return _vueVersion
			}
		}

		// Check Vue 2 specific API
		if (typeof vue?.observable === 'function') {
			_vueVersion = 2

			return _vueVersion
		}

		// Check Vue 3 specific API
		if (typeof vue?.createApp === 'function' && typeof vue?.observable !== 'function') {
			_vueVersion = 3

			return _vueVersion
		}

		// Check devtools hook
		const devtools = win.__VUE_DEVTOOLS_GLOBAL_HOOK__

		if (devtools?.Vue?.version) {
			const version = parseVersion(devtools.Vue.version)

			if (version !== null) {
				_vueVersion = version

				return _vueVersion
			}
		}
		if (devtools?.apps?.length) {
			_vueVersion = 3

			return _vueVersion
		}
	}

	// Default to Vue 3 but warn
	if (_vueVersion === null) {
		if (typeof window !== 'undefined') {
			console.warn(
				'[Directix] Unable to detect Vue version, defaulting to Vue 3. ' +
				'Set DIRECTIX_VUE_VERSION=2 or call setVueVersion(2) if using Vue 2.',
			)
		}
		_vueVersion = 3
	}

	return _vueVersion
}

/**
 * Set Vue version explicitly (for cases where auto-detection fails)
 */
export function setVueVersion(version: VueVersion): void {
	_vueVersion = version
	_isVue2 = version === 2 || version === 2.7
	_isVue27 = version === 2.7
	_isVue3 = version === 3
}

/**
 * Reset Vue version (useful for testing)
 */
export function resetVueVersion(): void {
	_vueVersion = null
	_isVue2 = null
	_isVue27 = null
	_isVue3 = null
}

/**
 * Check if Vue 2 (includes 2.7)
 */
export function isVue2(): boolean {
	if (_isVue2 === null) {
		const version = getVueVersion()

		_isVue2 = version === 2 || version === 2.7
	}

	return _isVue2
}

/**
 * Check if Vue 2.7 (has built-in Composition API support)
 */
export function isVue27(): boolean {
	if (_isVue27 === null) {
		_isVue27 = getVueVersion() === 2.7
	}

	return _isVue27
}

/**
 * Check if Vue 3
 */
export function isVue3(): boolean {
	if (_isVue3 === null) {
		_isVue3 = getVueVersion() === 3
	}

	return _isVue3
}

/**
 * Check if browser environment
 */
export const isBrowser = (): boolean => {
	return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * Check if server-side rendering
 */
export const isSSR = (): boolean => !isBrowser()

/**
 * Check if passive event listening is supported
 */
export const supportsPassive = (): boolean => {
	if (!isBrowser()) return false

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

/**
 * Check if IntersectionObserver is supported
 */
export const supportsIntersectionObserver = (): boolean => {
	return isBrowser() && 'IntersectionObserver' in window
}

/**
 * Check if ResizeObserver is supported
 */
export const supportsResizeObserver = (): boolean => {
	return isBrowser() && 'ResizeObserver' in window
}

/**
 * Check if Clipboard API is supported
 */
export const supportsClipboard = (): boolean => {
	return isBrowser() && 'clipboard' in navigator
}

/**
 * Check if MutationObserver is supported
 */
export const supportsMutationObserver = (): boolean => {
	return isBrowser() && 'MutationObserver' in window
}
