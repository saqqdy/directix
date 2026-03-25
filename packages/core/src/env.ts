/**
 * Vue 版本检测
 */
let _vueVersion: 2 | 3 | null = null

/**
 * 获取当前 Vue 版本
 */
export function getVueVersion(): 2 | 3 {
	if (_vueVersion !== null) return _vueVersion

	// 尝试检测 Vue 版本
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
		// Vue 不可用
	}

	// 默认返回 Vue 3
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
 * 是否 Vue 2
 */
export const isVue2 = (): boolean => getVueVersion() === 2

/**
 * 是否 Vue 3
 */
export const isVue3 = (): boolean => getVueVersion() === 3

/**
 * 是否浏览器环境
 */
export const isBrowser = (): boolean => {
	return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * 是否服务端渲染
 */
export const isSSR = (): boolean => !isBrowser()

/**
 * 是否支持 Passive 事件监听
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
 * 是否支持 IntersectionObserver
 */
export const supportsIntersectionObserver = (): boolean => {
	return isBrowser() && 'IntersectionObserver' in window
}

/**
 * 是否支持 ResizeObserver
 */
export const supportsResizeObserver = (): boolean => {
	return isBrowser() && 'ResizeObserver' in window
}

/**
 * 是否支持 Clipboard API
 */
export const supportsClipboard = (): boolean => {
	return isBrowser() && 'clipboard' in navigator
}

/**
 * 是否支持 MutationObserver
 */
export const supportsMutationObserver = (): boolean => {
	return isBrowser() && 'MutationObserver' in window
}
