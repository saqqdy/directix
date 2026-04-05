import { defineDirective, isBrowser } from '@directix/core'

/**
 * Chart type
 */
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea'

/**
 * Chart dataset
 */
export interface ChartDataset {
	/** Dataset label */
	label?: string
	/** Data values */
	data: number[]
	/** Background color(s) */
	backgroundColor?: string | string[]
	/** Border color(s) */
	borderColor?: string | string[]
	/** Border width */
	borderWidth?: number
	/** Additional chart-specific options */
	[key: string]: any
}

/**
 * Chart directive options
 */
export interface ChartOptions {
	/** Chart type */
	type?: ChartType

	/** Chart labels */
	labels: string[]

	/** Chart datasets */
	datasets: ChartDataset[]

	/** Chart width */
	width?: number | string

	/** Chart height */
	height?: number | string

	/** Whether to maintain aspect ratio */
	maintainAspectRatio?: boolean

	/** Whether to show legend */
	legend?: boolean

	/** Chart title */
	title?: string

	/** Custom Chart.js options */
	chartOptions?: Record<string, any>

	/** Callback when chart is created */
	onCreated?: (chart: any) => void

	/** Callback when chart is updated */
	onUpdated?: (chart: any) => void
}

/**
 * Directive binding value type
 */
export type ChartBinding = ChartOptions | { labels: string[], datasets: ChartDataset[] }

/**
 * Element state storage
 */
interface ChartState {
	options: ChartOptions
	chart: any
	canvas: HTMLCanvasElement | null
	chartLib: any
}

/**
 * Normalize options
 */
function normalizeOptions(binding: ChartBinding): ChartOptions {
	if (!binding) {
		return { labels: [], datasets: [] }
	}

	return {
		type: 'bar',
		maintainAspectRatio: true,
		legend: true,
		...binding,
	}
}

/**
 * Dynamically load Chart.js
 */
async function loadChartJs(): Promise<any> {
	if ((window as any).Chart) {
		return (window as any).Chart
	}

	try {
		const Chart = await import('chart.js/auto')
		;(window as any).Chart = Chart.default || Chart
		return Chart.default || Chart
	} catch {
		console.warn('[Directix] v-chart: chart.js not found. Please install it: npm install chart.js')
		return null
	}
}

/**
 * Build Chart.js configuration
 */
function buildChartConfig(options: ChartOptions): Record<string, any> {
	const config: Record<string, any> = {
		type: options.type || 'bar',
		data: {
			labels: options.labels,
			datasets: options.datasets,
		},
		options: {
			maintainAspectRatio: options.maintainAspectRatio !== false,
			plugins: {
				legend: {
					display: options.legend !== false,
				},
			},
			...(options.chartOptions || {}),
		},
	}

	if (options.title) {
		config.options.plugins.title = {
			display: true,
			text: options.title,
		}
	}

	return config
}

/**
 * v-chart directive
 * Simple chart binding
 *
 * @example
 * ```vue
 * <template>
 *   <canvas v-chart="chartConfig"></canvas>
 *
 *   <canvas v-chart="{
 *     type: 'bar',
 *     labels: ['Jan', 'Feb', 'Mar'],
 *     datasets: [{
 *       label: 'Sales',
 *       data: [12, 19, 3],
 *       backgroundColor: '#42b883'
 *     }]
 *   }"></canvas>
 * </template>
 * ```
 */
export const vChart = defineDirective<ChartBinding, HTMLCanvasElement>({
	name: 'chart',
	ssr: false,

	mounted(el, binding) {
		if (!isBrowser()) return

		const options = normalizeOptions(binding.value)

		const state: ChartState = {
			options,
			chart: null,
			canvas: el,
			chartLib: null,
		}

		;(el as any).__chart = state

		// Set dimensions
		if (options.width) {
			el.style.width = typeof options.width === 'number' ? `${options.width}px` : options.width
		}
		if (options.height) {
			el.style.height = typeof options.height === 'number' ? `${options.height}px` : options.height
		}

		// Initialize chart
		initChart(state)

		el.classList.add('v-chart')
	},

	updated(el, binding) {
		const state: ChartState = (el as any).__chart

		if (!state) return

		const newOptions = normalizeOptions(binding.value)
		state.options = newOptions

		if (state.chart) {
			// Update chart data
			state.chart.data.labels = newOptions.labels
			state.chart.data.datasets = newOptions.datasets

			// Update options if needed
			if (newOptions.chartOptions) {
				state.chart.options = {
					...state.chart.options,
					...newOptions.chartOptions,
				}
			}

			state.chart.update()
			state.options.onUpdated?.(state.chart)
		}
	},

	unmounted(el) {
		const state: ChartState = (el as any).__chart

		if (!state) return

		if (state.chart) {
			state.chart.destroy()
		}

		el.classList.remove('v-chart')
		delete (el as any).__chart
	},
})

/**
 * Initialize chart
 */
async function initChart(state: ChartState): Promise<void> {
	const Chart = await loadChartJs()

	if (!Chart || !state.canvas) return

	state.chartLib = Chart

	const config = buildChartConfig(state.options)

	state.chart = new Chart(state.canvas, config)

	state.options.onCreated?.(state.chart)
}

export default vChart
