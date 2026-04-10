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

## Composable API

For programmatic use, you can use the `usePrint` composable:

```typescript
import { usePrint, quickPrint } from 'directix'

const { isPrinting, print, printPage } = usePrint({
  title: 'My Document',
  styles: '@page { margin: 2cm; }',
  cssUrls: ['/print.css'],
  onBeforePrint: () => console.log('About to print...'),
  onAfterPrint: () => console.log('Print complete!'),
  newWindow: false,
  printClass: 'print-content'
})

// Print specific element
await print('#content')

// Print current page
await printPage()

// Quick print function
quickPrint('#content', { title: 'Quick Print' })
```

### UsePrintOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `title` | `string \| Ref<string>` | - | Title for printed document |
| `styles` | `string \| string[] \| Ref` | - | Additional CSS styles |
| `cssUrls` | `string[] \| Ref<string[]>` | `[]` | Additional CSS URLs |
| `onBeforePrint` | `() => boolean \| void` | - | Callback before printing (return false to cancel) |
| `onAfterPrint` | `() => void` | - | Callback after printing |
| `newWindow` | `boolean \| Ref<boolean>` | `false` | Print in new window |
| `printClass` | `string \| Ref<string>` | - | Custom class for print container |

### UsePrintReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `isPrinting` | `Ref<boolean>` | Whether printing is in progress |
| `print` | `(target?: string \| HTMLElement) => Promise<void>` | Print specified element |
| `printPage` | `() => Promise<void>` | Print current page |

### Example

```vue
<script setup>
import { usePrint } from 'directix'

const { isPrinting, print } = usePrint({
  title: 'My Document',
  onAfterPrint: () => console.log('Print complete!')
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
## Code Generator

<DirectiveConfigurator name="print" description="Print specific elements with customizable options. Perfect for generating printable documents." />
