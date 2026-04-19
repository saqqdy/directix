# 03 - 常用事件指令

**时长：12 分钟**

## 视频信息

- 标题：常用事件指令
- 系列：入门系列
- 难度：初级
- 前置知识：Vue 事件处理基础

## 章节目录

1. v-debounce 防抖（3 分钟）
2. v-throttle 节流（2 分钟）
3. v-click-outside 点击外部（2 分钟）
4. v-long-press 长按（2 分钟）
5. v-hotkey 快捷键（3 分钟）

## 详细脚本

### 开场（0:00-0:15）

> **画面：开场动画 + 标题**

大家好，今天我们来学习 Directix 中最常用的事件指令。这些指令能帮你处理各种用户交互场景。

### 第一章：v-debounce 防抖（0:15-3:15）

> **画面：展示防抖概念动画**

首先是最常用的防抖指令。防抖是什么意思呢？用户连续操作时，只在停止操作后执行一次。

> **画面：VS Code 演示**

**基础用法：**

```vue
<template>
  <input 
    v-debounce="handleSearch" 
    placeholder="搜索..."
  />
</template>

<script setup>
const handleSearch = (value) => {
  console.log('搜索:', value)
  // 执行 API 请求
}
</script>
```

**指定延迟时间：**

```vue
<template>
  <!-- 默认 300ms -->
  <input v-debounce="search1" />
  
  <!-- 自定义延迟 -->
  <input v-debounce:500="search2" />
  
  <!-- 使用修饰符语法 -->
  <input v-debounce:500ms="search3" />
</template>
```

**防抖配置对象：**

```vue
<template>
  <input v-debounce="{
    handler: handleSearch,
    wait: 500,
    leading: false,  // 首次是否立即执行
    trailing: true   // 结束后是否执行
  }" />
</template>
```

> **画面：展示防抖效果演示**

典型应用场景：
- 搜索输入框
- 窗口 resize 事件
- 表单验证

### 第二章：v-throttle 节流（3:15-5:15）

> **画面：展示节流概念动画**

节流和防抖类似，但有所不同：节流是每隔固定时间执行一次。

> **画面：VS Code 演示**

**基础用法：**

```vue
<template>
  <button v-throttle="handleSubmit">
    提交
  </button>
</template>

<script setup>
const handleSubmit = () => {
  console.log('提交表单')
  // 重复点击会被节流
}
</script>
```

**指定间隔时间：**

```vue
<template>
  <!-- 默认 300ms -->
  <button v-throttle="submit1">提交</button>
  
  <!-- 自定义间隔 -->
  <button v-throttle:1000="submit2">提交</button>
  
  <!-- 使用修饰符语法 -->
  <button v-throttle:1s="submit3">提交</button>
</template>
```

**节流配置对象：**

```vue
<template>
  <button v-throttle="{
    handler: handleClick,
    wait: 1000,
    leading: true,   // 开始边界执行
    trailing: false  // 结束边界执行
  }">
    点击
  </button>
</template>
```

> **画面：对比防抖和节流**

防抖 vs 节流：
- 防抖：等待停止，最后执行一次
- 节流：固定间隔，持续执行

典型场景：
- 按钮重复点击防护
- 滚动事件处理
- 鼠标移动事件

### 第三章：v-click-outside 点击外部（5:15-7:15）

> **画面：展示下拉菜单关闭效果**

点击外部是一个非常实用的指令，常用于关闭下拉菜单、模态框等。

> **画面：VS Code 演示**

**基础用法：**

```vue
<template>
  <div>
    <button @click="show = !show">切换</button>
    <div 
      v-if="show" 
      v-click-outside="closeMenu"
      class="dropdown"
    >
      菜单内容
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

const closeMenu = () => {
  show.value = false
}
</script>
```

**排除特定元素：**

```vue
<template>
  <div>
    <!-- 点击这个按钮不会关闭 -->
    <button ref="trigger">打开</button>
    <div v-click-out:trigger="closeMenu">
      内容
    </div>
  </div>
</template>
```

**配置对象：**

```vue
<template>
  <div v-click-outside="{
    handler: closeMenu,
    exclude: ['button', '.exclude-class'],
    active: true  // 是否启用
  }">
    内容
  </div>
</template>
```

> **画面：展示实际应用**

典型场景：
- 下拉菜单
- 模态框
- 侧边栏

### 第四章：v-long-press 长按（7:15-9:15）

> **画面：展示长按效果**

长按指令用于处理用户长按元素的场景。

> **画面：VS Code 演示**

**基础用法：**

```vue
<template>
  <button v-long-press="handleLongPress">
    长按我
  </button>
</template>

<script setup>
const handleLongPress = () => {
  alert('长按触发！')
}
</script>
```

**自定义时长：**

```vue
<template>
  <!-- 默认 500ms -->
  <button v-long-press="handler1">500ms</button>
  
  <!-- 自定义时长 -->
  <button v-long-press:1000="handler2">1秒</button>
  
  <!-- 修饰符语法 -->
  <button v-long-press:1s="handler3">1秒</button>
</template>
```

**配置对象：**

```vue
<template>
  <button v-long-press="{
    handler: handleLongPress,
    duration: 800,
    onStart: () => console.log('开始长按'),
    onFinish: () => console.log('长按完成'),
    onCancel: () => console.log('长按取消')
  }">
    长按我
  </button>
</template>
```

> **画面：展示进度条效果**

可以配合进度条显示长按进度：

```vue
<template>
  <button 
    v-long-press="{
      handler: submit,
      duration: 2000,
      onUpdate: (progress) => percent = progress
    }"
  >
    <div class="progress" :style="{ width: percent + '%' }"></div>
    长按确认
  </button>
</template>
```

### 第五章：v-hotkey 快捷键（9:15-12:00）

> **画面：展示快捷键效果**

快捷键指令让你的应用支持键盘快捷操作。

> **画面：VS Code 演示**

**基础用法：**

```vue
<template>
  <div v-hotkey="hotkeys">
    按 Ctrl+S 保存
  </div>
</template>

<script setup>
const hotkeys = {
  'ctrl+s': (e) => {
    e.preventDefault()
    console.log('保存')
  },
  'ctrl+enter': () => {
    console.log('提交')
  }
}
</script>
```

**多个快捷键：**

```vue
<template>
  <div v-hotkey="{
    'ctrl+s': save,
    'ctrl+z': undo,
    'ctrl+y': redo,
    'escape': cancel,
    'enter': submit
  }">
    编辑区域
  </div>
</script>
```

**作用范围：**

```vue
<template>
  <!-- 只在元素聚焦时生效 -->
  <input 
    v-hotkey:focus="{
      'ctrl+a': selectAll,
      'escape': clear
    }"
  />
  
  <!-- 全局快捷键 -->
  <div v-hotkey:global="globalHotkeys">
    应用内容
  </div>
</template>
```

**组合键支持：**

支持以下修饰键：
- `ctrl` / `control`
- `alt` / `option`
- `shift`
- `meta` / `cmd` / `command`

```vue
<template>
  <div v-hotkey="{
    'ctrl+s': save,
    'ctrl+shift+s': saveAs,
    'ctrl+alt+delete': forceQuit,
    'cmd+s': save,  // Mac 兼容
  }">
  </div>
</template>
```

### 总结（11:50-12:00）

> **画面：总结要点**

今天我们学习了五个常用事件指令：
- v-debounce - 防抖，适合搜索框
- v-throttle - 节流，适合按钮点击
- v-click-outside - 点击外部关闭
- v-long-press - 长按操作
- v-hotkey - 键盘快捷键

下集我们将学习表单指令。再见！

> **画面：片尾动画 + 下集预告**

## 配套代码

本视频示例代码：[GitHub - examples/vue3](https://github.com/saqqdy/directix/tree/master/examples/vue3)

## 练习题

1. 创建一个搜索框，使用 v-debounce 实现 300ms 防抖
2. 实现一个按钮，使用 v-throttle 防止 1 秒内重复点击
3. 使用 v-click-outside 实现一个下拉菜单，点击外部关闭
4. 实现一个删除按钮，需要长按 2 秒才能触发删除
5. 为编辑器添加 Ctrl+S 保存快捷键

## 相关资源

- [事件指令文档](https://saqqdy.github.io/directix/guide/events)
- [v-debounce API](https://saqqdy.github.io/directix/api/directives/debounce)
- [v-throttle API](https://saqqdy.github.io/directix/api/directives/throttle)