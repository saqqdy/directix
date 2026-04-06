<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useExport } from 'directix'

export default defineComponent({
	name: 'ExportDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	data() {
		return {
			tableData: [
				{ id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', salary: 85000 },
				{ id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', salary: 72000 },
				{ id: 3, name: 'Bob Wilson', email: 'bob@example.com', department: 'Sales', salary: 68000 },
				{ id: 4, name: 'Alice Brown', email: 'alice@example.com', department: 'Engineering', salary: 92000 },
				{ id: 5, name: 'Charlie Davis', email: 'charlie@example.com', department: 'HR', salary: 65000 }
			],
			lastExport: '',
			// Composable methods
			exportCSV: (() => {}) as () => void,
			exportJSON: (() => {}) as () => void,
			exportHTML: (() => {}) as () => void,
			exportText: (() => {}) as () => void,
		}
	},
	computed: {
		basicCode(): string {
			return `<button v-export="data">
  Export CSV
</button>

<script>
const data = [
  { name: 'John', email: 'john@example.com' },
  { name: 'Jane', email: 'jane@example.com' }
]
<\/script>`
		},
		formatCode(): string {
			return `<button v-export="{
  data: tableData,
  format: 'json',
  filename: 'my-data'
}">
  Export JSON
</button>`
		},
		columnsCode(): string {
			return `<button v-export="{
  data: tableData,
  format: 'csv',
  columns: ['name', 'email'],
  headers: { name: 'Name', email: 'Email Address' },
  includeHeaders: true
}">
  Export Custom Columns
</button>`
		},
		callbacksCode(): string {
			return `<button v-export="{
  data: tableData,
  format: 'csv',
  filename: 'report',
  onBeforeExport: () => confirm('Export data?'),
  onAfterExport: () => { lastExport = new Date().toLocaleTimeString() }
}">
  Export with Confirmation
</button>`
		},
		composableCode(): string {
			return `import { useExport } from 'directix'

const data = [
  { name: 'John', email: 'john@example.com' },
  { name: 'Jane', email: 'jane@example.com' }
]

const { exportCSV, exportJSON, exportHTML, exportText } = useExport({
  data,
  filename: 'users'
})

// Export as CSV
exportCSV()

// Export as JSON
exportJSON()

// Export as HTML table
exportHTML()

// Export as plain text
exportText()`
		},
	},
	methods: {
		handleBeforeExport() {
			return confirm('Export data?')
		},
		handleAfterExport() {
			this.lastExport = new Date().toLocaleTimeString()
		},
	},
	created() {
		// Initialize composable in created hook
		const exports = useExport({
			data: this.tableData,
			filename: 'employees',
			onAfterExport: () => {
				this.lastExport = new Date().toLocaleTimeString()
			}
		})
		// Bind methods to instance
		this.exportCSV = exports.exportCSV
		this.exportJSON = exports.exportJSON
		this.exportHTML = exports.exportHTML
		this.exportText = exports.exportText
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-export</h1>
		<p class="intro">
			A directive for exporting data to CSV, JSON, HTML, or TXT format with customizable columns and headers.
		</p>

		<!-- Data preview -->
		<DemoSection title="Sample Data" description="Data to be exported">
			<div class="demo-box">
				<table class="data-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Department</th>
							<th>Salary</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in tableData" :key="row.id">
							<td>{{ row.id }}</td>
							<td>{{ row.name }}</td>
							<td>{{ row.email }}</td>
							<td>{{ row.department }}</td>
							<td>${{ row.salary.toLocaleString() }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</DemoSection>

		<!-- Scenario 1: Basic CSV export -->
		<DemoSection title="Basic CSV Export" description="Export all data as CSV">
			<div class="demo-box">
				<button v-export="tableData" class="btn">
					Export CSV
				</button>
				<p class="hint">Click to download all data as CSV file</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Different formats -->
		<DemoSection title="Different Formats" description="Export as JSON, HTML, or TXT">
			<div class="demo-box">
				<div class="button-group">
					<button v-export="{ data: tableData, format: 'csv', filename: 'employees' }" class="btn">
						Export CSV
					</button>
					<button v-export="{ data: tableData, format: 'json', filename: 'employees' }" class="btn btn-secondary">
						Export JSON
					</button>
					<button v-export="{ data: tableData, format: 'html', filename: 'employees' }" class="btn btn-outline">
						Export HTML
					</button>
					<button v-export="{ data: tableData, format: 'txt', filename: 'employees' }" class="btn btn-dark">
						Export TXT
					</button>
				</div>
			</div>
			<CodeBlock :code="formatCode" />
		</DemoSection>

		<!-- Scenario 3: Custom columns -->
		<DemoSection title="Custom Columns" description="Export specific columns with custom headers">
			<div class="demo-box">
				<div class="button-group">
					<button
						v-export="{
							data: tableData,
							format: 'csv',
							columns: ['name', 'email'],
							headers: { name: 'Full Name', email: 'Email Address' },
							filename: 'contacts'
						}"
						class="btn"
					>
						Export Contacts
					</button>
					<button
						v-export="{
							data: tableData,
							format: 'csv',
							columns: ['name', 'department', 'salary'],
							headers: { name: 'Employee', department: 'Dept', salary: 'Annual Salary' },
							filename: 'salaries'
						}"
						class="btn btn-secondary"
					>
						Export Salary Report
					</button>
				</div>
				<p class="hint">Custom columns and headers for specific export needs</p>
			</div>
			<CodeBlock :code="columnsCode" />
		</DemoSection>

		<!-- Scenario 4: With callbacks -->
		<DemoSection title="With Callbacks" description="Handle export events">
			<div class="demo-box">
				<button
					v-export="{
						data: tableData,
						format: 'csv',
						filename: 'report',
						onBeforeExport: handleBeforeExport,
						onAfterExport: handleAfterExport
					}"
					class="btn"
				>
					Export with Confirmation
				</button>
				<p v-if="lastExport" class="hint">Last exported at: {{ lastExport }}</p>
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useExport" description="Using useExport composable">
			<div class="demo-box">
				<div class="button-group">
					<button @click="exportCSV" class="btn">Export CSV</button>
					<button @click="exportJSON" class="btn btn-secondary">Export JSON</button>
					<button @click="exportHTML" class="btn btn-outline">Export HTML</button>
					<button @click="exportText" class="btn btn-dark">Export TXT</button>
				</div>
				<p v-if="lastExport" class="hint">Last exported at: {{ lastExport }}</p>
				<p v-else class="hint">Using useExport composable for programmatic export</p>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>

		<!-- API Reference -->
		<DemoSection title="API">
			<table class="api-table">
				<thead>
					<tr>
						<th>Property</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>data</td>
						<td>Any[]</td>
						<td>-</td>
						<td>Data to export (required)</td>
					</tr>
					<tr>
						<td>format</td>
						<td>String</td>
						<td>'csv'</td>
						<td>Export format: csv, json, html, txt</td>
					</tr>
					<tr>
						<td>filename</td>
						<td>String</td>
						<td>'export'</td>
						<td>Filename without extension</td>
					</tr>
					<tr>
						<td>columns</td>
						<td>String[]</td>
						<td>-</td>
						<td>Columns to export</td>
					</tr>
					<tr>
						<td>headers</td>
						<td>Object</td>
						<td>-</td>
						<td>Custom header names</td>
					</tr>
					<tr>
						<td>includeHeaders</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Include header row</td>
					</tr>
					<tr>
						<td>delimiter</td>
						<td>String</td>
						<td>','</td>
						<td>CSV delimiter</td>
					</tr>
				</tbody>
			</table>
		</DemoSection>
	</div>
</template>

<style scoped>
.demo-page {
	max-width: 900px;
}

h1 {
	margin-bottom: 8px;
}

.intro {
	color: #666;
	margin-bottom: 24px;
}

.demo-box {
	padding: 20px;
	background: #f8f9fa;
	border-radius: 8px;
	margin-bottom: 12px;
}

.data-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
}

.data-table th,
.data-table td {
	padding: 10px 12px;
	text-align: left;
	border-bottom: 1px solid #e5e7eb;
}

.data-table th {
	background: #f3f4f6;
	font-weight: 600;
	color: #374151;
}

.data-table tbody tr:hover {
	background: #f9fafb;
}

.button-group {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.btn {
	padding: 12px 24px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
}

.btn:hover {
	background: #3aa876;
}

.btn-secondary {
	background: #10b981;
}

.btn-secondary:hover {
	background: #059669;
}

.btn-outline {
	background: transparent;
	border: 1px solid #42b883;
	color: #42b883;
}

.btn-dark {
	background: #374151;
}

.btn-dark:hover {
	background: #1f2937;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
}

.api-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
}

.api-table th,
.api-table td {
	padding: 12px;
	text-align: left;
	border-bottom: 1px solid #eee;
}

.api-table th {
	background: #f8f9fa;
	font-weight: 600;
}
</style>
