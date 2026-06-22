/**
 * Performance analyzer for Directix directives.
 * Tracks mount/update/unmount timing and generates optimization suggestions.
 */

interface PerfMetric {
	mount: { count: number, total: number, max: number, avg: number }
	update: { count: number, total: number, max: number, avg: number }
	unmount: { count: number, total: number, max: number, avg: number }
}

interface PerfReport {
	directives: Array<{
		directiveId: string
		mount: { count: number, total: number, max: number, avg: number }
		update: { count: number, total: number, max: number, avg: number }
		unmount: { count: number, total: number, max: number, avg: number }
		total: number
	}>
	summary: {
		totalTime: number
		slowDirectives: Array<{ directiveId: string, total: number }>
		recommendations: string[]
	}
	timestamp: string
}

export class PerformanceAnalyzer {
	private metrics: Map<string, PerfMetric> = new Map()

	record(directiveId: string, operation: 'mount' | 'update' | 'unmount', duration: number): void {
		const existing = this.metrics.get(directiveId) || {
			mount: { count: 0, total: 0, max: 0, avg: 0 },
			update: { count: 0, total: 0, max: 0, avg: 0 },
			unmount: { count: 0, total: 0, max: 0, avg: 0 },
		}

		const m = existing[operation]
		m.count++
		m.total += duration
		m.max = Math.max(m.max, duration)
		m.avg = m.total / m.count

		this.metrics.set(directiveId, existing)
	}

	getReport(): PerfReport {
		const allMetrics = Array.from(this.metrics.entries()).map(([id, metrics]) => ({
			directiveId: id,
			...metrics,
			total: metrics.mount.total + metrics.update.total + metrics.unmount.total,
		}))

		return {
			directives: allMetrics,
			summary: {
				totalTime: allMetrics.reduce((sum, m) => sum + m.total, 0),
				slowDirectives: allMetrics.filter(m => m.total > 16).sort((a, b) => b.total - a.total),
				recommendations: this.generateRecommendations(allMetrics),
			},
			timestamp: new Date().toISOString(),
		}
	}

	clear(): void {
		this.metrics.clear()
	}

	private generateRecommendations(metrics: Array<{ directiveId: string, mount: { max: number }, update: { count: number, avg: number } }>): string[] {
		const recs: string[] = []
		for (const m of metrics) {
			if (m.mount.max > 50) recs.push(`⚠️ ${m.directiveId}: Slow mount (${m.mount.max.toFixed(2)}ms)`)
			if (m.update.avg > 16) recs.push(`⚠️ ${m.directiveId}: Heavy updates (avg ${m.update.avg.toFixed(2)}ms)`)
			if (m.update.count > 100) recs.push(`ℹ️ ${m.directiveId}: Excessive updates (${m.update.count})`)
		}
		return recs
	}
}
