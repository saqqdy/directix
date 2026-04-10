# v-export

Export data to CSV, JSON, HTML, or TXT.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <button v-export="exportData">Export CSV</button>
</template>

<script setup>
const exportData = {
  data: [
    { name: 'John', email: 'john@example.com', age: 30 },
    { name: 'Jane', email: 'jane@example.com', age: 25 }
  ]
}
</script>
```

### Export JSON

```vue
<template>
  <button v-export="{ data: tableData, format: 'json', filename: 'my-data' }">
    Export JSON
  </button>
</template>
```

### Custom Columns

```vue
<template>
  <button v-export="{
    data: tableData,
    format: 'csv',
    columns: ['name', 'email'],
    headers: { name: 'Name', email: 'Email Address' }
  }">
    Export with custom columns
  </button>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `data` | `any[]` | - | Data to export |
| `format` | `'csv' \| 'json' \| 'html' \| 'txt'` | `'csv'` | Export format |
| `filename` | `string` | `'export'` | File name without extension |
| `columns` | `string[]` | - | Columns to export |
| `headers` | `Record<string, string>` | - | Header label mapping |
| `delimiter` | `string` | `','` | CSV delimiter |
| `beforeExport` | `() => void \| boolean` | - | Callback before export, return false to cancel |
| `afterExport` | `() => void` | - | Callback after export |

## Examples

### Export HTML Table

```vue
<template>
  <button v-export="{
    data: tableData,
    format: 'html',
    filename: 'report',
    headers: { name: 'Name', email: 'Email', age: 'Age' }
  }">
    Export HTML
  </button>
</template>
```

### With Confirmation

```vue
<template>
  <button v-export="{
    data: tableData,
    format: 'csv',
    beforeExport: () => confirm('Export data?')
  }">
    Export CSV
  </button>
</template>
```

## Composable API

For programmatic use, you can use the `useExport` composable:

```typescript
import { useExport } from 'directix'

const { exportCSV, exportJSON, exportHTML, exportTXT } = useExport()

// Export as CSV
exportCSV(data, { filename: 'my-data', columns: ['name', 'email'] })

// Export as JSON
exportJSON(data, { filename: 'my-data' })

// Export as HTML
exportHTML(data, { filename: 'report' })

// Export as TXT
exportTXT(data, { filename: 'output' })
```

### UseExportReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `exportCSV` | `(data: any[], options?: ExportOptions) => void` | Export as CSV |
| `exportJSON` | `(data: any[], options?: ExportOptions) => void` | Export as JSON |
| `exportHTML` | `(data: any[], options?: ExportOptions) => void` | Export as HTML |
| `exportTXT` | `(data: any[], options?: ExportOptions) => void` | Export as TXT |
## Code Generator

<DirectiveConfigurator name="export" description="Export data to CSV, JSON, HTML, or TXT." />
