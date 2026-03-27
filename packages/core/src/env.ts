/**
 * Vue version detection
 */
let _vueVersion: 2 | 3 | null = null

/**
 * Get current Vue version
 */
export function getVueVersion(): 2 | 3 {
	if (_vueVersion !== null) return _vueVersion

	// Try to detect Vue version
	try {
		// Use dynamic import for ESM compatibility
		// eslint-disable-next-line ts/no-require-imports
		const vue = require('vue')

		if (vue?.version?.startsWith('2')) {
			_vueVersion = 2
		} else if (vue?.version?.startsWith('3')) {
			_vueVersion = 3
		}
	} catch {
		// Vue not available
	}

	// Default to Vue 3
	if (_vueVersion === null) {
		if (typeof window !== 'undefined') {
			console.warn(
				'[Directix] Unable to detect Vue version, defaulting to Vue 3. ' +
				'Please ensure Vue is installed correctly.',
			)
		}
		_vueVersion = 3
	}

	return _vueVersion
}

/**
 * Check if Vue 2
 */
export const isVue2 = (): boolean => getVueVersion() === 2

/**
 * Check if Vue 3
 */
export const isVue3 = (): boolean => getVueVersion() === 3

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
