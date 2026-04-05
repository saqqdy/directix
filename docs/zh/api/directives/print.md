# v-print

打印特定元素，支持自定义选项。非常适合生成可打印文档。

> **起始版本：** `1.3.0`

## 用法

### 基本

```vue
<template>
  <div v-print>
    <h1>发票</h1>
    <p>点击此元素任意位置即可打印。</p>
  </div>
</template>
```

### 带选项

```vue
<template>
  <div v-print="{ title: '我的文档', preview: true }">
    <h1>报告</h1>
    <p>要打印的内容...</p>
  </div>
  <button @click="printDocument">打印</button>
</template>
```

## API

### 类型

```typescript
interface PrintOptions {
  title?: string
  preview?: boolean
  timeout?: number // 默认: 1000
  beforePrint?: () => void | Promise<void>
  afterPrint?: () => void
  styles?: string
  media?: string // 默认: 'print'
}
```

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `title` | `string` | 文档标题 | 打印文档标题 |
| `preview` | `boolean` | `false` | 显示打印预览 |
| `timeout` | `number` | `1000` | 打印对话框超时时间 |
| `beforePrint` | `() => void \| Promise<void>` | - | 打印前回调 |
| `afterPrint` | `() => void` | - | 打印后回调 |
| `styles` | `string` | - | 打印时的额外 CSS 样式 |
| `media` | `string` | `'print'` | 样式的媒体类型 |

## Composable 用法

你也可以使用 `usePrint` composable 实现相同功能：

```vue
<script setup>
import { usePrint } from 'directix'

const { isPrinting, print } = usePrint({
  title: '我的文档',
  onBeforePrint: () => {
    console.log('准备打印...')
    return true
  },
  onAfterPrint: () => {
    console.log('打印完成！')
  }
})

async function handlePrint() {
  await print('#content')
}
</script>

<template>
  <div>
    <button @click="handlePrint" :disabled="isPrinting">
      {{ isPrinting ? '打印中...' : '打印' }}
    </button>
    <div id="content">要打印的内容</div>
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

## 示例

### 发票打印

```vue
<template>
  <div v-print="{ title: '发票 #' + invoiceId, beforePrint: formatInvoice }">
    <h1>发票 #{{ invoiceId }}</h1>
    <table>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.price }}</td>
      </tr>
    </table>
    <div class="total">总计: {{ total }}</div>
  </div>
</template>
```

### 自定义打印样式

```vue
<template>
  <article v-print="{
    title: '文章',
    styles: '@page { margin: 2cm; } body { font-size: 12pt; }'
  }">
    <h1>{{ title }}</h1>
    <p>{{ content }}</p>
  </article>
</template>
```
