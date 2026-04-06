/**
 * Check if value is a string
 */
export function isString(value: unknown): value is string {
	return typeof value === 'string'
}

/**
 * Check if value is a number
 */
export function isNumber(value: unknown): value is number {
	return typeof value === 'number' && !isNaN(value)
}

/**
 * Check if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
	return typeof value === 'boolean'
}

/**
 * Check if value is a function
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
	return typeof value === 'function'
}

/**
 * Check if value is an object
 */
export function isObject(value: unknown): value is Record<string, any> {
	return typeof value === 'object' && value !== null
}

/**
 * Check if value is an array
 */
export function isArray(value: unknown): value is any[] {
	return Array.isArray(value)
}

/**
 * Check if value is empty
 */
export function isEmpty(value: unknown): boolean {
	if (value === null || value === undefined) return true
	if (isString(value) || isArray(value)) return value.length === 0
	if (isObject(value)) return Object.keys(value).length === 0

	return false
}

/**
 * Check if value is a Promise
 */
export function isPromise<T = any>(value: unknown): value is Promise<T> {
	return isObject(value) && isFunction((value as any).then)
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj
	}

	if (Array.isArray(obj)) {
		return obj.map(item => deepClone(item)) as unknown as T
	}

	const cloned = {} as T

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			cloned[key] = deepClone(obj[key])
		}
	}

	return cloned
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(
	target: T,
	...sources: Partial<T>[]
): T {
	if (!sources.length) return target

	const source = sources.shift()

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) {
					Object.assign(target, { [key]: {} })
				}
				deepMerge(
					target[key] as Record<string, any>,
					source[key] as Record<string, any>,
				)
			} else {
				Object.assign(target, { [key]: source[key] })
			}
		}
	}

	return deepMerge(target, ...sources)
}

/**
 * Get nested property value by path
 */
export function get<T = any>(
	obj: Record<string, any>,
	path: string,
	defaultValue?: T,
): T {
	const keys = path.split('.')
	let result: any = obj

	for (const key of keys) {
		if (result === null || result === undefined) {
			return defaultValue as T
		}
		result = result[key]
	}

	return (result === undefined ? defaultValue : result) as T
}

/**
 * Set nested property value by path
 */
export function set(obj: Record<string, any>, path: string, value: any): void {
	const keys = path.split('.')
	const lastKey = keys.pop()!
	let current = obj

	for (const key of keys) {
		if (current[key] === undefined) {
			current[key] = {}
		}
		current = current[key]
	}

	current[lastKey] = value
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number = 300,
	options: { leading?: boolean, trailing?: boolean } = {},
): ((...args: Parameters<T>) => void) & { cancel: () => void, flush: () => void } {
	let timerId: ReturnType<typeof setTimeout> | null = null,
		lastArgs: Parameters<T> | null = null,
		lastThis: any = null

	const { leading = false, trailing = true } = options

	const invokeFunc = (): void => {
		if (lastArgs) {
			func.apply(lastThis, lastArgs)
			lastArgs = null
			lastThis = null
		}
	}

	const debounced = function (this: any, ...args: Parameters<T>): void {
		lastArgs = args
		// eslint-disable-next-line ts/no-this-alias
		lastThis = this

		if (timerId) {
			clearTimeout(timerId)
		}

		if (leading && !timerId) {
			invokeFunc()
		}

		timerId = setTimeout(() => {
			if (trailing) {
				invokeFunc()
			}
			timerId = null
		}, wait)
	} as ((...args: Parameters<T>) => void) & { cancel: () => void, flush: () => void }

	debounced.cancel = () => {
		if (timerId) {
			clearTimeout(timerId)
			timerId = null
		}
		lastArgs = null
		lastThis = null
	}

	debounced.flush = () => {
		if (timerId) {
			clearTimeout(timerId)
			invokeFunc()
			timerId = null
		}
	}

	return debounced
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	wait: number = 300,
	options: { leading?: boolean, trailing?: boolean } = {},
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
	let timerId: ReturnType<typeof setTimeout> | null = null,
		lastArgs: Parameters<T> | null = null,
		lastThis: any = null,
		lastCallTime = 0

	const { leading = true, trailing = true } = options

	const invokeFunc = (): void => {
		if (lastArgs) {
			func.apply(lastThis, lastArgs)
			lastArgs = null
			lastThis = null
		}
	}

	const throttled = function (this: any, ...args: Parameters<T>): void {
		const now = Date.now()

		if (!lastCallTime && !leading) {
			lastCallTime = now
		}

		const remaining = wait - (now - lastCallTime)

		lastArgs = args
		// eslint-disable-next-line ts/no-this-alias
		lastThis = this

		if (remaining <= 0 || remaining > wait) {
			if (timerId) {
				clearTimeout(timerId)
				timerId = null
			}
			lastCallTime = now
			invokeFunc()
		} else if (!timerId && trailing) {
			timerId = setTimeout(() => {
				lastCallTime = leading ? Date.now() : 0
				timerId = null
				invokeFunc()
			}, remaining)
		}
	} as ((...args: Parameters<T>) => void) & { cancel: () => void }

	throttled.cancel = () => {
		if (timerId) {
			clearTimeout(timerId)
			timerId = null
		}
		lastCallTime = 0
		lastArgs = null
		lastThis = null
	}

	return throttled
}

/**
 * Parse time argument
 * Supports formats: "300" | "300ms" | "1s"
 */
export function parseTime(arg?: string): number | null {
	if (!arg) return null

	if (arg.endsWith('ms')) {
		return parseInt(arg, 10)
	}

	if (arg.endsWith('s')) {
		return parseFloat(arg) * 1000
	}

	const num = parseInt(arg, 10)

	return isNaN(num) ? null : num
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = ''): string {
	return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Calculate distance between two points
 */
export function getDistance(
	p1: { x: number, y: number },
	p2: { x: number, y: number },
): number {
	return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
}

/**
 * Clamp value within min/max bounds
 */
export function clamp(value: number, min?: number, max?: number): number {
	let result = value
	if (min !== undefined) result = Math.max(min, result)
	if (max !== undefined) result = Math.min(max, result)
	return result
}

/**
 * Escape special regex characters in a string
 */
export function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
