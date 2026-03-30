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
