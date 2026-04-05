import { type Ref, unref } from 'vue'

/**
 * Export format type
 */
export type ExportFormat = 'csv' | 'json' | 'txt' | 'html'

/**
 * Options for useExport composable
 */
export interface UseExportOptions {
	/** Data to export */
	data: any[] | object | string | Ref<any[] | object | string>

	/** Export format */
	format?: ExportFormat | Ref<ExportFormat>

	/** Filename (without extension) */
	filename?: string | Ref<string>

	/** Whether to include headers (for CSV) */
	includeHeaders?: boolean

	/** Custom delimiter for CSV */
	delimiter?: string

	/** Columns to export */
	columns?: string[]

	/** Custom headers mapping */
	headers?: Record<string, string>

	/** Callback before export */
	onBeforeExport?: () => boolean | void

	/** Callback after export */
	onAfterExport?: () => void

	/** Callback on error */
	onError?: (error: Error) => void
}

/**
 * Return type for useExport composable
 */
export interface UseExportReturn {
	/** Export data */
	exportData: (format?: ExportFormat) => void

	/** Export as CSV */
	exportCSV: () => void

	/** Export as JSON */
	exportJSON: () => void

	/** Export as HTML */
	exportHTML: () => void

	/** Export as text */
	exportText: () => void
}

/**
 * Convert data to CSV
 */
function toCSV(data: any[], options: UseExportOptions): string {
	if (!Array.isArray(data) || data.length === 0) return ''

	const delimiter = options.delimiter || ','
	const columns = options.columns || Object.keys(data[0])
	const headers = options.headers || {}

	const headerRow = options.includeHeaders !== false ? `${columns.map(col => headers[col] || col).join(delimiter)}\n` : ''

	const dataRows = data
		.map(row =>
			columns
				.map(col => {
					const value = row[col]
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
 * Convert data to HTML table
 */
function toHTML(data: any[], options: UseExportOptions): string {
	if (!Array.isArray(data) || data.length === 0) return ''

	const columns = options.columns || Object.keys(data[0])
	const headers = options.headers || {}

	let html = '<table border="1">\n'

	if (options.includeHeaders !== false) {
		html += '  <thead>\n    <tr>\n'
		for (const col of columns) {
			html += `      <th>${headers[col] || col}</th>\n`
		}
		html += '    </tr>\n  </thead>\n'
	}

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
 * Download file
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
 * Composable for exporting data
 *
 * @param options - Configuration options
 * @returns Export utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { useExport } from 'directix'
 *
 * const data = [
 *   { name: 'John', email: 'john@example.com' },
 *   { name: 'Jane', email: 'jane@example.com' }
 * ]
 *
 * const { exportCSV, exportJSON } = useExport({ data, filename: 'users' })
 * </script>
 *
 * <template>
 *   <button @click="exportCSV">Export CSV</button>
 *   <button @click="exportJSON">Export JSON</button>
 * </template>
 * ```
 */
export function useExport(options: UseExportOptions): UseExportReturn {
	function doExport(format?: ExportFormat): void {
		if (options.onBeforeExport?.() === false) return

		try {
			const data = unref(options.data)
			const exportFormat = format || unref(options.format) || 'csv'
			const filename = unref(options.filename) || 'export'

			let content: string

			switch (exportFormat) {
				case 'json':
					content = JSON.stringify(data, null, 2)
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

			downloadFile(content, filename, exportFormat)
			options.onAfterExport?.()
		} catch (error) {
			options.onError?.(error as Error)
		}
	}

	function exportCSV(): void {
		doExport('csv')
	}

	function exportJSON(): void {
		doExport('json')
	}

	function exportHTML(): void {
		doExport('html')
	}

	function exportText(): void {
		doExport('txt')
	}

	return {
		exportData: doExport,
		exportCSV,
		exportJSON,
		exportHTML,
		exportText,
	}
}
