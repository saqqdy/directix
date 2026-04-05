import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, shallowRef, unref, watch } from 'vue'

/**
 * Chart type
 */
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea'

/**
 * Chart dataset
 */
export interface ChartDataset {
	label?: string
	data: number[]
	backgroundColor?: string | string[]
	borderColor?: string | string[]
	borderWidth?: number
	[key: string]: any
}

/**
 * Options for useChart composable
 */
export interface UseChartOptions {
	/** Chart type */
	type?: ChartType | Ref<ChartType>

	/** Chart labels */
	labels: string[] | Ref<string[]>

	/** Chart datasets */
	datasets: ChartDataset[] | Ref<ChartDataset[]>

	/** Chart options */
	chartOptions?: Record<string, any>

	/** Callback on created */
	onCreated?: (chart: any) => void

	/** Callback on updated */
	onUpdated?: (chart: any) => void
}

/**
 * Return type for useChart composable
 */
export interface UseChartReturn {
	/** Chart instance */
	chart: Ref<any>

	/** Update chart data */
	update: () => void

	/** Destroy chart */
	destroy: () => void

	/** Bind chart to a canvas element */
	bind: (element: HTMLCanvasElement) => () => void
}

/**
 * Load Chart.js library
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
		console.warn('[Directix] useChart: chart.js not found. Install: npm install chart.js')
		return null
	}
}

/**
 * Composable for simple chart binding
 *
 * @param options - Configuration options
 * @returns Chart utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useChart } from 'directix'
 *
 * const canvasRef = ref(null)
 * const { bind } = useChart({
 *   type: 'bar',
 *   labels: ['Jan', 'Feb', 'Mar'],
 *   datasets: [{
 *     label: 'Sales',
 *     data: [12, 19, 3],
 *     backgroundColor: '#42b883'
 *   }]
 * })
 *
 * onMounted(() => bind(canvasRef.value))
 * </script>
 *
 * <template>
 *   <canvas ref="canvasRef"></canvas>
 * </template>
 * ```
 */
export function useChart(options: UseChartOptions): UseChartReturn {
	const chart = shallowRef<any>(null)

	let currentElement: HTMLCanvasElement | null = null,
		ChartLib: any = null

	async function initChart(): Promise<void> {
		ChartLib = await loadChartJs()
		if (!ChartLib || !currentElement) return

		const type = unref(options.type) || 'bar'
		const labels = unref(options.labels)
		const datasets = unref(options.datasets)

		chart.value = new ChartLib(currentElement, {
			type,
			data: {
				labels,
				datasets,
			},
			options: options.chartOptions || {},
		})

		options.onCreated?.(chart.value)
	}

	function update(): void {
		if (!chart.value) return

		chart.value.data.labels = unref(options.labels)
		chart.value.data.datasets = unref(options.datasets)
		chart.value.update()

		options.onUpdated?.(chart.value)
	}

	function destroy(): void {
		if (chart.value) {
			chart.value.destroy()
			chart.value = null
		}
	}

	function bind(element: HTMLCanvasElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element
		element.classList.add('v-chart')

		initChart()

		// Watch for data changes
		if (typeof options.labels !== 'string' && !Array.isArray(options.labels)) {
			watch(options.labels, update)
		}
		if (typeof options.datasets !== 'string' && !Array.isArray(options.datasets)) {
			watch(options.datasets, update, { deep: true })
		}

		return unbind
	}

	function unbind(): void {
		destroy()
		if (currentElement) {
			currentElement.classList.remove('v-chart')
		}
		currentElement = null
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		chart,
		update,
		destroy,
		bind,
	}
}
