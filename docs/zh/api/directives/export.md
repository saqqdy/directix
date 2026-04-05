# v-export

导出数据为 CSV、JSON、HTML 或 TXT 格式。

> **起始版本：** `1.5.0`

## 用法

### 基本导出 CSV

```vue
<template>
  <button v-export="tableData">导出 CSV</button>
</template>

<script setup>
const tableData = [
  { name: 'John', email: 'john@example.com', age: 30 },
  { name: 'Jane', email: 'jane@example.com', age: 25 }
]
</script>
```

### 导出 JSON

```vue
<template>
  <button v-export="{ data: tableData, format: 'json', filename: 'my-data' }">
    导出 JSON
  </button>
</template>
```

### 自定义列和表头

```vue
<template>
  <button v-export="{
    data: tableData,
    format: 'csv',
    columns: ['name', 'email'],
    headers: { name: '姓名', email: '邮箱地址' }
  }">
    导出自定义列
  </button>
</template>
```

### 导出 HTML 表格

```vue
<template>
  <button v-export="{ data: tableData, format: 'html', filename: 'table' }">
    导出 HTML
  </button>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `data` | `any[] \| object \| string` | - | 要导出的数据 |
| `format` | `'csv' \| 'json' \| 'txt' \| 'html'` | `'csv'` | 导出格式 |
| `filename` | `string` | `'export'` | 文件名（不含扩展名） |
| `includeHeaders` | `boolean` | `true` | 是否包含表头（CSV） |
| `delimiter` | `string` | `','` | CSV 分隔符 |
| `columns` | `string[]` | - | 要导出的列 |
| `headers` | `Record<string, string>` | - | 自定义表头映射 |
| `onBeforeExport` | `() => boolean \| void` | - | 导出前回调，返回 false 取消导出 |
| `onAfterExport` | `() => void` | - | 导出后回调 |
| `onError` | `(error: Error) => void` | - | 错误回调 |

### 绑定值类型

```ts
type ExportBinding = ExportOptions | ExportOptions['data']
```

## Composable 用法

你也可以使用 `useExport` composable 来实现相同功能：

```vue
<script setup>
import { ref } from 'vue'
import { useExport } from 'directix'

const tableData = ref([
  { name: 'John', email: 'john@example.com', age: 30 },
  { name: 'Jane', email: 'jane@example.com', age: 25 }
])

const { exportCSV, exportJSON, exportHTML } = useExport({ 
  data: tableData, 
  filename: 'users' 
})
</script>

<template>
  <button @click="exportCSV">导出 CSV</button>
  <button @click="exportJSON">导出 JSON</button>
  <button @click="exportHTML">导出 HTML</button>
</template>
```

### API

```typescript
type ExportFormat = 'csv' | 'json' | 'txt' | 'html'

interface UseExportOptions {
  /** 要导出的数据 */
  data: any[] | object | string | Ref<any[] | object | string>
  /** 导出格式 */
  format?: ExportFormat | Ref<ExportFormat>
  /** 文件名（不含扩展名） */
  filename?: string | Ref<string>
  /** 是否包含表头（CSV） */
  includeHeaders?: boolean
  /** CSV 分隔符 */
  delimiter?: string
  /** 要导出的列 */
  columns?: string[]
  /** 自定义表头映射 */
  headers?: Record<string, string>
  /** 导出前回调 */
  onBeforeExport?: () => boolean | void
  /** 导出后回调 */
  onAfterExport?: () => void
  /** 错误回调 */
  onError?: (error: Error) => void
}

interface UseExportReturn {
  /** 导出数据 */
  exportData: (format?: ExportFormat) => void
  /** 导出为 CSV */
  exportCSV: () => void
  /** 导出为 JSON */
  exportJSON: () => void
  /** 导出为 HTML */
  exportHTML: () => void
  /** 导出为文本 */
  exportText: () => void
}
```
