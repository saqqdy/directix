/**
 * Performance benchmarks for Directix directives
 * Run with: pnpm tsx tests/benchmark/index.ts
 */
import { Bench } from 'tinybench'

// Mock DOM environment for benchmarking (used for reference only)
void (() => {
	const mockElement = {
		addEventListener: () => {},
		removeEventListener: () => {},
		classList: { add: () => {}, remove: () => {} },
		style: {} as CSSStyleDeclaration,
		getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 100 }),
		appendChild: () => {},
		removeChild: () => {},
	} as unknown as HTMLElement
	void mockElement
})()

const bench = new Bench({ time: 1000, iterations: 100 })

// Debounce benchmark
bench.add('debounce - 1000 calls', () => {
	let timeout: ReturnType<typeof setTimeout> | null = null
	const debounce = (fn: (...args: unknown[]) => void, wait: number): ((...args: unknown[]) => void) => {
		return (...args: unknown[]) => {
			if (timeout) clearTimeout(timeout)
			timeout = setTimeout(() => fn(...args), wait)
		}
	}

	const debouncedFn = debounce(() => {}, 100)
	for (let i = 0; i < 1000; i++) {
		debouncedFn()
	}
})

// Throttle benchmark
bench.add('throttle - 1000 calls', () => {
	let lastTime = 0
	const throttle = (fn: (...args: unknown[]) => void, limit: number): ((...args: unknown[]) => void) => {
		return (...args: unknown[]) => {
			const now = Date.now()
			if (now - lastTime >= limit) {
				fn(...args)
				lastTime = now
			}
		}
	}

	const throttledFn = throttle(() => {}, 100)
	for (let i = 0; i < 1000; i++) {
		throttledFn()
	}
})

// Format number benchmark
bench.add('formatNumber - 1000 calls', () => {
	const formatNumber = (value: number, options: { precision?: number, thousandSeparator?: string, decimalSeparator?: string } = {}): string => {
		const { precision = 0, thousandSeparator = ',', decimalSeparator = '.' } = options
		const fixed = precision > 0 ? value.toFixed(precision) : String(Math.round(value))
		const [intPart, decPart] = fixed.split('.')
		const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
		return decPart ? `${formatted}${decimalSeparator}${decPart}` : formatted
	}

	for (let i = 0; i < 1000; i++) {
		formatNumber(1234567.8912, { precision: 2 })
	}
})

// Format money benchmark
bench.add('formatMoney - 1000 calls', () => {
	const formatMoney = (value: number, options: { symbol?: string, precision?: number, thousandSeparator?: string, decimalSeparator?: string } = {}): string => {
		const { symbol = '$', precision = 2, thousandSeparator = ',', decimalSeparator = '.' } = options
		const fixed = value.toFixed(precision)
		const [intPart, decPart] = fixed.split('.')
		const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
		return `${symbol}${decPart ? `${formatted}${decimalSeparator}${decPart}` : formatted}`
	}

	for (let i = 0; i < 1000; i++) {
		formatMoney(1234567.8912, { symbol: '¥', precision: 2 })
	}
})

// Text transform benchmark
bench.add('uppercase - 1000 calls', () => {
	const transform = (text: string): string => text.toUpperCase()
	for (let i = 0; i < 1000; i++) {
		transform('hello world, this is a test string for benchmarking')
	}
})

bench.add('lowercase - 1000 calls', () => {
	const transform = (text: string): string => text.toLowerCase()
	for (let i = 0; i < 1000; i++) {
		transform('HELLO WORLD, THIS IS A TEST STRING FOR BENCHMARKING')
	}
})

bench.add('capitalcase - 1000 calls', () => {
	const transform = (text: string): string => text.replace(/\b\w/g, char => char.toUpperCase())
	for (let i = 0; i < 1000; i++) {
		transform('hello world, this is a test string for benchmarking')
	}
})

// Truncate benchmark
bench.add('truncate - 1000 calls', () => {
	const truncate = (text: string, length: number, suffix: string = '...'): string => {
		if (text.length <= length) return text
		return text.slice(0, length) + suffix
	}
	for (let i = 0; i < 1000; i++) {
		truncate('This is a long text that needs to be truncated for display purposes', 20, '...')
	}
})

// Sanitize HTML benchmark
bench.add('sanitize - remove scripts - 1000 calls', () => {
	const sanitize = (html: string): string => {
		return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
	}
	for (let i = 0; i < 1000; i++) {
		sanitize('<div><p>Safe content</p><script>alert("xss")</script></div>')
	}
})

// Mask pattern benchmark
bench.add('mask - phone number - 1000 calls', () => {
	const mask = (value: string, pattern: string): string => {
		const digits = value.replace(/\D/g, '')
		let result = '',
			digitIndex = 0

		for (const char of pattern) {
			if (char === '#') {
				result += digits[digitIndex] || ''
				digitIndex++
			} else {
				result += char
			}
		}

		return result
	}

	for (let i = 0; i < 1000; i++) {
		mask('1234567890', '(###) ###-####')
	}
})

// Run benchmarks
async function runBenchmarks(): Promise<void> {
	console.info('🏃 Running Directix Performance Benchmarks...\n')

	await bench.run()

	const table = bench.table()
	if (table) {
		console.info(table)
	}

	// Summary
	console.info('\n📊 Summary:')
	const results = bench.results
	const avgLatency = results.reduce((sum, r) => {
		if (r && 'latency' in r && r.latency) {
			return sum + (r.latency.mean || 0)
		}
		return sum
	}, 0) / results.length
	console.info(`Average latency: ${avgLatency.toFixed(4)} ms`)
	console.info(`Total benchmarks: ${results.length}`)
}

runBenchmarks().catch(console.error)
