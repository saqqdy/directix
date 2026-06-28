# 09 - Vue DevTools 调试技巧

**时长：10 分钟**

## 视频信息

- 标题：Vue DevTools 调试技巧
- 系列：进阶系列
- 难度：中级
- 前置知识：Vue DevTools 基础

## 章节目录

1. 启用 DevTools 集成（1.5 分钟）
2. Directix Inspector 面板（2.5 分钟）
3. 浏览器扩展 DevTools 面板（2.5 分钟）
4. 指令生命周期追踪（2 分钟）
5. 性能问题调试（2 分钟）

## 详细脚本

### 开场（0:00-0:10）

今天学习如何使用 Vue DevTools 和 Directix 浏览器扩展来调试指令。

### 第一章：启用 DevTools 集成（0:10-1:40）

> **画面：展示 Vue DevTools**

首先确保已安装 Vue DevTools 浏览器扩展。

> **画面：VS Code 演示**

在应用入口启用集成：

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import Directix, { enableDevtools } from 'directix'

const app = createApp(App)
app.use(Directix)

// 开发环境启用 DevTools 集成
if (import.meta.env.DEV) {
  enableDevtools()
}

app.mount('#app')
```

### 第二章：Directix Inspector 面板（1:40-4:10）

> **画面：展示 DevTools Directix 面板**

打开 DevTools，切换到 "Directix" 标签页。你会看到三个部分：

**1. Directives 视图**

列出所有当前激活的指令：

- 指令名称
- 绑定数量
- 最后更新时间

点击指令查看详情：
- 绑定的元素信息
- 指令参数和修饰符
- 绑定值

**2. Plugins 视图**

显示已注册的插件：

- 插件名称和版本
- 注册时间
- 启用状态

**3. Events 视图**

实时事件日志：

- 指令挂载/卸载
- 插件安装/卸载
- 时间戳

### 第三章：浏览器扩展 DevTools 面板（4:10-6:40）

> **画面：展示 Chrome DevTools 中的 Directix 扩展**

Directix 浏览器扩展提供了专用的 DevTools 面板，具有高级功能：

**安装：**

1. 从 Chrome Web Store 安装 Directix Chrome 扩展
2. 打开 Chrome DevTools（`F12` 或 `Cmd+Option+I`）
3. 切换到 "Directix" 面板

**面板功能：**

扩展提供带有 4 个面板的标签式界面：

| 标签 | 描述 |
|------|------|
| **Directives** | 页面上所有活跃指令的实时列表 |
| **Performance** | 显示挂载/更新/卸载时间的可视化柱状图 |
| **Issues** | 检测到的问题和警告 |
| **Export** | 多种格式的诊断报告导出 |

**实时指令监控：**

扩展使用 MutationObserver 自动检测 DOM 变化：

- 新指令立即被检测
- 更新实时反映
- DOM 变化时自动刷新

**搜索与筛选：**

使用搜索栏和筛选标签缩小指令列表：

- 按指令名称搜索
- 按类别筛选（Event、Form、Visibility 等）
- 按挂载时间、更新次数或名称排序

**性能图表：**

可视化柱状图显示每个指令的时间：

- 挂载时间（初始设置）
- 更新时间（重渲染成本）
- 卸载时间（清理成本）

**诊断导出：**

导出多种格式的报告：

- **JSON** - 完整诊断数据带时间戳
- **CSV** - 电子表格友好格式
- **HTML** - 人类可读报告

```typescript
// 导出示例
const report = {
  timestamp: '2026-06-28T10:30:00Z',
  directives: [
    { name: 'v-debounce', mountTime: 2.5, updates: 15 }
  ],
  issues: [
    { type: 'performance', message: '检测到慢挂载' }
  ]
}
```

### 第四章：指令生命周期追踪（6:40-8:40）

> **画面：展示追踪功能**

在代码中追踪指令：

```typescript
import { trackDirective, untrackDirective } from 'directix'

// 自定义指令中集成追踪
const vMyDirective = {
  mounted(el, binding) {
    trackDirective('my-directive', {
      element: el.tagName,
      bindings: 1,
      options: binding.value
    })
    // ... 指令逻辑
  },

  unmounted(el) {
    untrackDirective('my-directive')
  }
}
```

> **画面：展示 Events 面板**

Events 面板会显示：
- `directive:mounted:my-directive`
- `directive:updated:my-directive`
- `directive:unmounted:my-directive`

### 第五章：性能问题调试（8:40-10:30）

> **画面：展示性能监控**

启用性能监控：

```typescript
import { enablePerformance, getSlowestDirectives } from 'directix'

// 启用性能监控
enablePerformance({
  warnThreshold: 16, // 超过 16ms 警告
  sampleRate: 1      // 100% 采样
})

// 开发控制台查看慢指令
console.table(getSlowestDirectives())
```

> **画面：展示性能数据**

性能报告包含：
- 每个指令的 mount/update/unmount 统计
- P50/P95/P99 延迟
- 总执行时间和调用次数

**常见性能问题：**

1. 指令内部频繁 DOM 操作
2. 缺少防抖/节流
3. 重复初始化

**VS Code 瓶颈检测：**

VS Code 扩展可以检测瓶颈：

| 类型 | 阈值 | 建议 |
|------|------|------|
| 慢挂载 | > 50ms | 减少初始 DOM 操作 |
| 慢更新 | > 16ms | 添加防抖/节流 |
| 过多更新 | > 100 | 优化响应式依赖 |
| 内存泄漏 | - | 确保卸载时清理 |

### 总结

今天学习了：
- 启用 DevTools 集成
- 使用 Directix Inspector 面板
- 使用浏览器扩展 DevTools 面板
- 追踪指令生命周期
- 性能问题调试

下集学习插件系统与社区扩展。

## 练习题

1. 启用 DevTools 集成，查看当前页面激活的指令
2. 安装浏览器扩展，探索 Performance 标签
3. 使用 trackDirective 追踪自定义指令的生命周期
4. 使用性能监控找出执行时间最长的指令
5. 导出诊断报告为 JSON 并分析数据

## 相关资源

- [DevTools 集成文档](https://saqqdy.github.io/directix/zh/guide/devtools)
- [浏览器扩展指南](https://saqqdy.github.io/directix/zh/guide/browser-extension)
- [性能监控 API](https://saqqdy.github.io/directix/zh/api/performance)
- [VS Code 扩展指南](https://saqqdy.github.io/directix/zh/guide/vscode-extension)