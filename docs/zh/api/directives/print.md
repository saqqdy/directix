# v-print

Print specific elements with customizable options. Perfect for generating printable documents.

> **Since:** `1.3.0`

## Usage

### Basic

```vue
<template>
  <div v-print>
    <h1>Invoice</h1>
    <p>Click anywhere on this element to print.</p>
  </div>
</template>
```

### With Options

```vue
<template>
  <div v-print="{ title: 'My Document', preview: true }">
    <h1>Report</h1>
    <p>Content to print...</p>
  </div>
  <button @click="printDocument">Print</button>
</template>
```

## API

### Types

```typescript
interface PrintOptions {
  title?: string
  preview?: boolean
  timeout?: number // default: 1000
  beforePrint?: () => void | Promise<void>
  afterPrint?: () => void
  styles?: string
  media?: string // default: 'print'
}
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `title` | `string` | Document title | Print document title |
| `preview` | `boolean` | `false` | Show print preview |
| `timeout` | `number` | `1000` | Timeout for print dialog |
| `beforePrint` | `() => void \| Promise<void>` | - | Callback before printing |
| `afterPrint` | `() => void` | - | Callback after printing |
| `styles` | `string` | - | Additional CSS styles for print |
| `media` | `string` | `'print'` | Media type for styles |

## Composable Usage

You can also use the `usePrint` composable for the same functionality:

```vue
<script setup>
import { usePrint } from 'directix'

const { isPrinting, print } = usePrint({
  title: 'My Document',
  onBeforePrint: () => {
    console.log('About to print...')
    return true
  },
  onAfterPrint: () => {
    console.log('Print complete!')
  }
})

async function handlePrint() {
  await print('#content')
}
</script>

<template>
  <div>
    <button @click="handlePrint" :disabled="isPrinting">
      {{ isPrinting ? 'Printing...' : 'Print' }}
    </button>
    <div id="content">Content to print</div>
  </div>
</template>
```

### API

```typescript
interface UsePrintOptions {
  /** 打印文档的标题 */
  title?: string | Ref<string>
  /** 注入的额外 CSS 样式 */
  styles?: string | string[] | Ref<string | string[]>
  /** 包含的额外 CSS URL */
  cssUrls?: string[] | Ref<string[]>
  /** 打印前的回调，返回 false 取消打印 */
  onBeforePrint?: () => boolean | void
  /** 打印后的回调 */
  onAfterPrint?: () => void
  /** 是否在新窗口打印 @default false */
  newWindow?: boolean | Ref<boolean>
  /** 打印容器的自定义类名 */
  printClass?: string | Ref<string>
}

interface UsePrintReturn {
  /** 是否正在打印 */
  isPrinting: Ref<boolean>
  /** 打印指定元素或选择器 */
  print: (target?: string | HTMLElement) => Promise<void>
  /** 打印当前页面 */
  printPage: () => Promise<void>
}
```

## Examples

### Invoice Printing

```vue
<template>
  <div v-print="{ title: 'Invoice #' + invoiceId, beforePrint: formatInvoice }">
    <h1>Invoice #{{ invoiceId }}</h1>
    <table>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.price }}</td>
      </tr>
    </table>
    <div class="total">Total: {{ total }}</div>
  </div>
</template>
```

### Custom Print Styles

```vue
<template>
  <article v-print="{
    title: 'Article',
    styles: '@page { margin: 2cm; } body { font-size: 12pt; }'
  }">
    <h1>{{ title }}</h1>
    <p>{{ content }}</p>
  </article>
</template>
```
