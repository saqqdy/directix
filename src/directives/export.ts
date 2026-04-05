import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

/**
 * Export format type
 */
export type ExportFormat = 'csv' | 'json' | 'txt' | 'html'

/**
 * Export directive options
 */
export interface ExportOptions {
	/**
	 * Data to export
	 */
	data: any[] | object | string

	/**
	 * Export format
	 * @default 'csv'
	 */
	format?: ExportFormat

	/**
	 * Filename (without extension)
	 * @default 'export'
	 */
	filename?: string

	/**
	 * Whether to include headers (for CSV)
	 * @default true
	 */
	includeHeaders?: boolean

	/**
	 * Custom delimiter for CSV
	 * @default ','
	 */
	delimiter?: string

	/**
	 * Columns to export (for array of objects)
	 */
	columns?: string[]

	/**
	 * Custom headers mapping
	 */
	headers?: Record<string, string>

	/**
	 * Callback before export
	 */
	onBeforeExport?: () => boolean | void

	/**
	 * Callback after export
	 */
	onAfterExport?: () => void

	/**
	 * Callback on error
	 */
	onError?: (error: Error) => void
}

/**
 * Directive binding value type
 */
export type ExportBinding = ExportOptions | ExportOptions['data']

/**
 * Element state storage
 */
interface ExportState {
	options: ExportOptions
	clickHandler: () => void
}

/**
 * Normalize options
 */
function normalizeOptions(binding: ExportBinding): ExportOptions {
	if (!binding || typeof binding === 'string' || Array.isArray(binding)) {
		return { data: binding, format: 'csv', filename: 'export' }
	}

	const opts = binding as ExportOptions
	return {
		format: 'csv',
		filename: 'export',
		includeHeaders: true,
		delimiter: ',',
		...opts,
		data: opts.data ?? [],
	}
}

/**
 * Convert data to CSV
 */
function toCSV(data: any[], options: ExportOptions): string {
	if (!Array.isArray(data) || data.length === 0) {
		return ''
	}

	const delimiter = options.delimiter || ','
	const columns = options.columns || Object.keys(data[0])
	const headers = options.headers || {}

	// Build header row
	const headerRow = options.includeHeaders ? `${columns.map(col => headers[col] || col).join(delimiter)}\n` : ''

	// Build data rows
	const dataRows = data
		.map(row =>
			columns
				.map(col => {
					const value = row[col]
					// Escape quotes and wrap in quotes if contains delimiter or newline
					if (typeof value === 'string' && (value.includes(delimiter) || value.includes('\n') || value.includes('"'))) {
						return `"${value.replace(/"/g, '""')}"`
					}
					return value ?? ''
				})
				.join(delimiter),
		)
		.join('\n')

	return headerRow + dataRows
}

/**
 * Convert data to JSON
 */
function toJSON(data: any): string {
	return JSON.stringify(data, null, 2)
}

/**
 * Convert data to HTML table
 */
function toHTML(data: any[], options: ExportOptions): string {
	if (!Array.isArray(data) || data.length === 0) {
		return ''
	}

	const columns = options.columns || Object.keys(data[0])
	const headers = options.headers || {}

	let html = '<table border="1">\n'

	// Build header
	if (options.includeHeaders) {
		html += '  <thead>\n    <tr>\n'
		for (const col of columns) {
			html += `      <th>${headers[col] || col}</th>\n`
		}
		html += '    </tr>\n  </thead>\n'
	}

	// Build body
	html += '  <tbody>\n'
	for (const row of data) {
		html += '    <tr>\n'
		for (const col of columns) {
			html += `      <td>${row[col] ?? ''}</td>\n`
		}
		html += '    </tr>\n'
	}
	html += '  </tbody>\n</table>'

	return html
}

/**
 * Download content as file
 */
function downloadFile(content: string, filename: string, format: ExportFormat): void {
	const mimeTypes: Record<ExportFormat, string> = {
		csv: 'text/csv;charset=utf-8;',
		json: 'application/json;charset=utf-8;',
		txt: 'text/plain;charset=utf-8;',
		html: 'text/html;charset=utf-8;',
	}

	const blob = new Blob([content], { type: mimeTypes[format] })
	const url = URL.createObjectURL(blob)

	const link = document.createElement('a')
	link.href = url
	link.download = `${filename}.${format}`

	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)

	URL.revokeObjectURL(url)
}

/**
 * Export data
 */
function exportData(options: ExportOptions): void {
	const { data, format = 'csv', filename = 'export' } = options

	let content: string

	switch (format) {
		case 'json':
			content = toJSON(data)
			break
		case 'html':
			content = toHTML(Array.isArray(data) ? data : [data], options)
			break
		case 'txt':
			content = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
			break
		case 'csv':
		default:
			content = toCSV(Array.isArray(data) ? data : [data], options)
			break
	}

	downloadFile(content, filename, format)
}

/**
 * v-export directive
 *
 * @example
 * ```vue
 * <template>
 *   <button v-export="exportData">Export CSV</button>
 *
 *   <button v-export="{ data: tableData, format: 'json', filename: 'my-data' }">
 *     Export JSON
 *   </button>
 *
 *   <button v-export="{
 *     data: tableData,
 *     format: 'csv',
 *     columns: ['name', 'email'],
 *     headers: { name: 'Name', email: 'Email Address' }
 *   }">
 *     Export with custom columns
 *   </button>
 * </template>
 *
 * <script setup>
 * const tableData = [
 *   { name: 'John', email: 'john@example.com', age: 30 },
 *   { name: 'Jane', email: 'jane@example.com', age: 25 }
 * ]
 * </script>
 * ```
 */
export const vExport = defineDirective<ExportBinding, HTMLElement>({
	name: 'export',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (!isBrowser()) return

		const state: ExportState = {
			options,
			clickHandler: () => {
				// Check before export callback
				if (state.options.onBeforeExport?.() === false) {
					return
				}

				try {
					exportData(state.options)
					state.options.onAfterExport?.()
				} catch (error) {
					state.options.onError?.(error as Error)
				}
			},
		}

		;(el as any).__export = state

		on(el, 'click', state.clickHandler)

		// Add visual cue
		el.classList.add('v-export')
	},

	updated(el, binding) {
		const state: ExportState = (el as any).__export

		if (!state) return

		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: ExportState = (el as any).__export

		if (!state) return

		off(el, 'click', state.clickHandler)
		el.classList.remove('v-export')

		delete (el as any).__export
	},
})

export default vExport
