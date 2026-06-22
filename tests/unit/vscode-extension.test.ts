import { describe, expect, it } from 'vitest'

// Test the DirectiveCompletionProvider data structures and logic
describe('DirectiveCompletionProvider', () => {
	it('should have completion data for all 57 directives', async () => {
		const { directives } = await import('../../packages/vscode-extension/src/data/directives')
		expect(directives.length).toBe(57)
	})

	it('each directive should have required fields', async () => {
		const { directives } = await import('../../packages/vscode-extension/src/data/directives')
		for (const d of directives) {
			expect(d.name).toMatch(/^v-[a-z-]+$/)
			expect(d.description).toBeTruthy()
			expect(d.category).toBeTruthy()
			expect(d.ssr).toBeDefined()
			expect(d.since).toBeTruthy()
			expect(d.priority).toMatch(/^(high|medium|low)$/)
			expect(Array.isArray(d.params)).toBe(true)
			expect(Array.isArray(d.modifiers)).toBe(true)
			expect(d.example).toBeTruthy()
		}
	})

	it('should have unique directive names', async () => {
		const { directives } = await import('../../packages/vscode-extension/src/data/directives')
		const names = directives.map(d => d.name)
		expect(new Set(names).size).toBe(names.length)
	})

	it('should cover all categories', async () => {
		const { directives } = await import('../../packages/vscode-extension/src/data/directives')
		const categories = new Set(directives.map(d => d.category))
		expect(categories.has('事件')).toBe(true)
		expect(categories.has('表单')).toBe(true)
		expect(categories.has('可见性')).toBe(true)
		expect(categories.has('滚动')).toBe(true)
		expect(categories.has('安全')).toBe(true)
		expect(categories.has('效果')).toBe(true)
	})
})

describe('DiagnosticsProvider', () => {
	it('should have activate and dispose methods', async () => {
		const { DiagnosticsProvider } = await import('../../packages/vscode-extension/src/features/DiagnosticsProvider')
		const provider = new DiagnosticsProvider()
		expect(typeof provider.activate).toBe('function')
		expect(typeof provider.dispose).toBe('function')
	})
})

describe('PerformanceAnalyzer', () => {
	it('should track directive instances per file', async () => {
		const { PerformanceAnalyzer } = await import('../../packages/vscode-extension/src/features/PerfAnalyzer')
		const analyzer = new PerformanceAnalyzer()
		analyzer.record({ directive: 'v-debounce', file: 'test.vue', line: 1, mountTime: 5.2 })
		analyzer.record({ directive: 'v-debounce', file: 'test.vue', line: 10, updateTime: 3.1 })
		expect((analyzer as any).perfData.length).toBe(2)
	})

	it('should have activate, record, and analyzeDocument', async () => {
		const { PerformanceAnalyzer } = await import('../../packages/vscode-extension/src/features/PerfAnalyzer')
		const analyzer = new PerformanceAnalyzer()
		expect(typeof analyzer.activate).toBe('function')
		expect(typeof analyzer.record).toBe('function')
		expect(typeof analyzer.analyzeDocument).toBe('function')
	})
})

describe('StateInspector', () => {
	it('should have activate and dispose methods', async () => {
		const { StateInspector } = await import('../../packages/vscode-extension/src/features/StateInspector')
		const inspector = new StateInspector()
		expect(typeof inspector.activate).toBe('function')
		expect(typeof inspector.dispose).toBe('function')
	})
})

describe('ConfigEditor', () => {
	it('should be importable', async () => {
		const { ConfigEditor } = await import('../../packages/vscode-extension/src/features/ConfigEditor')
		expect(ConfigEditor).toBeDefined()
	})
})
