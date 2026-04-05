# v-chart

简单的图表绑定指令，支持 Chart.js。

> **起始版本：** `1.5.0`

## 用法

### 基本

```vue
<template>
  <canvas v-chart="chartConfig"></canvas>
</template>

<script setup>
const chartConfig = {
  type: 'bar',
  labels: ['一月', '二月', '三月'],
  datasets: [{
    label: '销量',
    data: [12, 19, 3],
    backgroundColor: '#42b883'
  }]
}
</script>
```

### 折线图

```vue
<template>
  <canvas v-chart="{
    type: 'line',
    labels: ['周一', '周二', '周三', '周四', '周五'],
    datasets: [{
      label: '访问量',
      data: [65, 59, 80, 81, 56],
      borderColor: '#42b883',
      fill: false
    }]
  }"></canvas>
</template>
```

### 饼图

```vue
<template>
  <canvas v-chart="{
    type: 'pie',
    labels: ['Vue', 'React', 'Angular'],
    datasets: [{
      data: [40, 30, 30],
      backgroundColor: ['#42b883', '#61dafb', '#dd0031']
    }]
  }"></canvas>
</template>
```

## API

### 选项

| 选项 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------ | ---- |
| `type` | `'line' \| 'bar' \| 'pie' \| 'doughnut' \| 'radar' \| 'polarArea'` | `'bar'` | 图表类型 |
| `labels` | `string[]` | - | 图表标签（必填） |
| `datasets` | `ChartDataset[]` | - | 数据集（必填） |
| `width` | `number \| string` | - | 图表宽度 |
| `height` | `number \| string` | - | 图表高度 |
| `maintainAspectRatio` | `boolean` | `true` | 是否保持宽高比 |
| `legend` | `boolean` | `true` | 是否显示图例 |
| `title` | `string` | - | 图表标题 |
| `chartOptions` | `Record<string, any>` | - | 自定义 Chart.js 选项 |
| `onCreated` | `(chart: any) => void` | - | 图表创建时的回调 |
| `onUpdated` | `(chart: any) => void` | - | 图表更新时的回调 |

### ChartDataset

```ts
interface ChartDataset {
  label?: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  [key: string]: any
}
```

## 依赖

需要安装 `chart.js`：

```bash
npm install chart.js
```

## Composable

也可以使用 `useChart` 组合式函数：

```vue
<script setup>
import { ref } from 'vue'
import { useChart } from 'directix'

const canvasRef = ref(null)
const labels = ref(['一月', '二月', '三月'])
const datasets = ref([{
  label: '销量',
  data: [12, 19, 3],
  backgroundColor: '#42b883'
}])

const { chart, update, bind } = useChart({
  type: 'bar',
  labels,
  datasets,
  onCreated: (c) => console.log('图表已创建')
})

onMounted(() => bind(canvasRef.value))
</script>

<template>
  <canvas ref="canvasRef"></canvas>
  <button @click="update">更新数据</button>
</template>
```

### Composable API

| 属性/方法 | 类型 | 描述 |
| --------- | ---- | ---- |
| `chart` | `Ref<any>` | 图表实例 |
| `update()` | `() => void` | 更新图表数据 |
| `destroy()` | `() => void` | 销毁图表 |
| `bind(el)` | `(element: HTMLCanvasElement) => () => void` | 绑定到 canvas 元素 |
