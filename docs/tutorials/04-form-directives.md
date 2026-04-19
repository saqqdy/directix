# 04 - 表单指令详解

**时长：10 分钟**

## 视频信息

- 标题：表单指令详解
- 系列：入门系列
- 难度：初级
- 前置知识：Vue 表单绑定

## 章节目录

1. v-copy 复制（2 分钟）
2. v-mask 输入掩码（2 分钟）
3. v-focus 自动聚焦（1.5 分钟）
4. v-trim / v-uppercase / v-lowercase（2 分钟）
5. v-money / v-number 数字处理（2.5 分钟）

## 详细脚本

### 开场（0:00-0:10）

今天我们来学习 Directix 的表单指令，它们能极大简化表单处理。

### 第一章：v-copy 复制（0:10-2:10）

> **画面：展示复制按钮效果**

**基础用法：**

```vue
<template>
  <button v-copy="textToCopy">复制</button>
</template>

<script setup>
const textToCopy = ref('Hello Directix!')
</script>
```

**复制元素内容：**

```vue
<template>
  <!-- 复制输入框的值 -->
  <input v-model="inputVal" />
  <button v-copy="inputVal">复制输入值</button>
</template>
```

**复制成功回调：**

```vue
<template>
  <button v-copy="{
    value: apiKey,
    onSuccess: () => showToast('已复制到剪贴板'),
    onError: () => showToast('复制失败')
  }">
    复制 API Key
  </button>
</template>
```

### 第二章：v-mask 输入掩码（2:10-4:10）

> **画面：展示各种格式化输入效果**

**手机号格式化：**

```vue
<template>
  <input v-mask="'### #### ####'" placeholder="手机号" />
</template>
```

**日期格式化：**

```vue
<template>
  <input v-mask="'####/##/##'" placeholder="YYYY/MM/DD" />
</template>
```

**自定义掩码：**

```vue
<template>
  <!-- # = 数字, A = 字母, * = 任意字符 -->
  <input v-mask="'##-AA-****'" placeholder="自定义" />
  
  <!-- IP 地址 -->
  <input v-mask="'###.###.###.###'" placeholder="IP 地址" />
  
  <!-- 信用卡号 -->
  <input v-mask="'#### #### #### ####'" placeholder="卡号" />
</template>
```

### 第三章：v-focus 自动聚焦（4:10-5:40）

> **画面：展示搜索框自动聚焦效果**

```vue
<template>
  <!-- 页面加载后自动聚焦 -->
  <input v-focus placeholder="搜索..." />
</template>
```

**条件聚焦：**

```vue
<template>
  <input v-focus="shouldFocus" placeholder="搜索..." />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const shouldFocus = ref(false)

onMounted(() => {
  // 对话框打开后聚焦
  shouldFocus.value = true
})
</script>
```

### 第四章：文本转换指令（5:40-7:40）

> **画面：展示文本转换效果**

**v-trim 自动去空格：**

```vue
<template>
  <input v-trim v-model="name" placeholder="去除首尾空格" />
</template>
```

**v-uppercase 大写转换：**

```vue
<template>
  <input v-uppercase v-model="code" placeholder="自动大写" />
</template>
```

**v-lowercase 小写转换：**

```vue
<template>
  <input v-lowercase v-model="email" placeholder="自动小写" />
</template>
```

**v-capitalcase 首字母大写：**

```vue
<template>
  <input v-capitalcase v-model="name" placeholder="首字母大写" />
</template>
```

### 第五章：数字处理指令（7:40-10:00）

> **画面：展示金额输入效果**

**v-money 金额格式化：**

```vue
<template>
  <!-- 自动格式化为金额 -->
  <input v-money v-model="price" placeholder="金额" />
  
  <!-- 自定义配置 -->
  <input v-money="{
    prefix: '¥',
    suffix: '',
    precision: 2,
    thousands: ','
  }" v-model="amount" />
</template>
```

**v-number 数字输入：**

```vue
<template>
  <!-- 只允许数字输入 -->
  <input v-number v-model="count" placeholder="数量" />
  
  <!-- 自定义配置 -->
  <input v-number="{
    min: 0,
    max: 100,
    precision: 0,
    negative: false
  }" v-model="age" placeholder="年龄" />
</template>
```

**组合使用：**

```vue
<template>
  <form>
    <input v-trim v-capitalize v-model="name" placeholder="姓名" />
    <input v-lowercase v-model="email" placeholder="邮箱" />
    <input v-money v-model="price" placeholder="价格" />
    <input v-number="{ min: 1, max: 99 }" v-model="quantity" placeholder="数量" />
    <button type="submit">提交</button>
  </form>
</template>
```

### 总结

今天学习了六个表单指令：
- v-copy - 一键复制
- v-mask - 输入掩码格式化
- v-focus - 自动聚焦
- v-trim/v-uppercase/v-lowercase/v-capitalcase - 文本转换
- v-money/v-number - 数字处理

下集我们将学习可见性与懒加载指令。

## 练习题

1. 实现一个 API Key 展示组件，点击复制按钮复制 Key
2. 创建手机号输入框，使用 v-mask 格式化为 138 0000 0000
3. 实现一个价格输入框，使用 v-money 显示 ¥ 前缀和两位小数

## 相关资源

- [表单指令文档](https://saqqdy.github.io/directix/guide/forms)
- [v-copy API](https://saqqdy.github.io/directix/api/directives/copy)
- [v-mask API](https://saqqdy.github.io/directix/api/directives/mask)
