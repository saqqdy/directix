import { describe, expect, it } from 'vitest'
import { PerformanceAnalyzer } from '../../packages/browser-extension/src/devtools/perfAnalyzer'
import { StateInspector } from '../../packages/browser-extension/src/devtools/stateInspector'

describe('Browser Extension - PerformanceAnalyzer', () => {
	it('should track directive operations', () => {
		const analyzer = new PerformanceAnalyzer()
		analyzer.record('v-debounce', 'mount', 2.5)
		analyzer.record('v-debounce', 'update', 1.2)
		analyzer.record('v-throttle', 'mount', 3.0)

		const report = analyzer.getReport()
		expect(report.directives.length).toBe(2)
		expect(report.summary.totalTime).toBeCloseTo(6.7)
	})

	it('should generate recommendations for slow directives', () => {
		const analyzer = new PerformanceAnalyzer()
		analyzer.record('v-heavy', 'mount', 60)
		const report = analyzer.getReport()
		expect(report.summary.recommendations.length).toBeGreaterThan(0)
	})

	it('should clear metrics', () => {
		const analyzer = new PerformanceAnalyzer()
		analyzer.record('v-debounce', 'mount', 2.5)
		analyzer.clear()
		expect(analyzer.getReport().directives.length).toBe(0)
	})

	it('should detect slow mount (>50ms)', () => {
		const analyzer = new PerformanceAnalyzer()
		analyzer.record('v-slow', 'mount', 55)
		const report = analyzer.getReport()
		expect(report.summary.recommendations.some(r => r.includes('Slow mount'))).toBe(true)
	})

	it('should detect heavy updates (avg>16ms)', () => {
		const analyzer = new PerformanceAnalyzer()
		analyzer.record('v-heavy-update', 'update', 20)
		analyzer.record('v-heavy-update', 'update', 22)
		const report = analyzer.getReport()
		expect(report.summary.recommendations.some(r => r.includes('Heavy updates'))).toBe(true)
	})

	it('should detect excessive updates (>100)', () => {
		const analyzer = new PerformanceAnalyzer()
		for (let i = 0; i < 110; i++) {
			analyzer.record('v-excessive', 'update', 0.1)
		}
		const report = analyzer.getReport()
		expect(report.summary.recommendations.some(r => r.includes('Excessive updates'))).toBe(true)
	})
})

describe('Browser Extension - StateInspector', () => {
	it('should inspect element directives', () => {
		const el = document.createElement('div')
		el.setAttribute('v-debounce', 'handleInput')
		el.setAttribute('v-focus', '')

		const states = StateInspector.inspectElement(el)
		expect(states.length).toBe(2)
		expect(states[0].name).toBe('debounce')
		expect(states[1].name).toBe('focus')
	})

	it('should parse modifiers', () => {
		const el = document.createElement('div')
		el.setAttribute('v-scroll.passive', 'onScroll')
		const states = StateInspector.inspectElement(el)
		expect(states[0].modifiers).toContain('passive')
	})

	it('should return empty for elements without directives', () => {
		const el = document.createElement('div')
		el.className = 'test-class'
		const states = StateInspector.inspectElement(el)
		expect(states.length).toBe(0)
	})

	it('should detect missing cleanup as potential issue', () => {
		const el = document.createElement('div')
		;(el as any).__directix_debounce = { _mounted: true, _cleanup: null }
		el.setAttribute('v-debounce', 'handler')
		const states = StateInspector.inspectElement(el)
		expect(states[0].issues.some(i => i.includes('memory leak'))).toBe(true)
	})
})
