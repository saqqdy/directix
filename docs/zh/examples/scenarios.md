# 场景示例

展示 Directix 指令在实际项目中的组合使用。

## 表单验证系统

组合使用 `v-debounce`、`v-mask`、`v-trim`、`v-focus` 和 `v-money` 实现完整的表单验证方案。

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- 自动聚焦并防抖验证 -->
    <input
      v-model.trim="form.username"
      v-debounce:500ms="{ handler: () => validate('username'), wait: 500 }"
      v-focus
      placeholder="用户名"
    />
    
    <!-- 带输入掩码的手机号 -->
    <input
      v-model="form.phone"
      v-mask="{ pattern: '###########' }"
      placeholder="手机号"
    />
    
    <!-- 货币格式化输入 -->
    <input
      v-model="form.amount"
      v-money="{ currency: '¥', precision: 2 }"
      placeholder="金额"
    />
  </form>
</template>
```

## 权限管理

组合使用 `v-permission` 和 `v-click-outside` 实现 RBAC 权限控制。

```vue
<template>
  <!-- 仅对有写权限的用户显示 -->
  <button v-permission="'user:write'">编辑</button>
  
  <!-- 带点击外部检测的下拉菜单 -->
  <div v-click-outside="closeDropdown">
    <button @click="show = !show">操作</button>
    <div v-if="show">
      <div v-permission="'user:delete'">删除</div>
    </div>
  </div>
</template>
```

## 图片画廊

组合使用 `v-lazy`、`v-image-preview` 和 `v-swipe` 实现响应式图片展示。

```vue
<template>
  <div class="gallery">
    <div
      v-for="img in images"
      :key="img.id"
      v-image-preview="{ src: img.src }"
    >
      <img v-lazy="{ src: img.src }" />
    </div>
  </div>
  
  <!-- 移动端滑动手势检测 -->
  <div v-swipe="{ onSwipe: handleSwipe }">
    滑动导航
  </div>
</template>
```

## 无限滚动列表

组合使用 `v-infinite-scroll`、`v-virtual-list` 和 `v-loading` 优化大数据列表。

```vue
<template>
  <div
    v-infinite-scroll="{ handler: loadMore, distance: 100 }"
  >
    <div v-virtual-list="{ items, itemSize: 50 }">
      <template #default="{ item }">
        {{ item.text }}
      </template>
    </div>
    <div v-loading="loading">加载中...</div>
  </div>
</template>
```

## 富文本编辑

组合使用 `v-sanitize`、`v-highlight` 和 `v-emoji` 实现内容编辑。

```vue
<template>
  <!-- 高亮搜索关键词 -->
  <div v-highlight="{ keyword: searchKey, color: '#ffeb3b' }">
    {{ content }}
  </div>
  
  <!-- 净化 HTML 防止 XSS -->
  <div v-sanitize="{ allowedTags: ['p', 'strong', 'em'] }" v-html="rawHtml" />
</template>
```

## 手势交互

组合使用 `v-touch`、`v-swipe`、`v-pan` 和 `v-pinch` 实现移动端手势操作。

```vue
<template>
  <div
    v-touch="{ onStart, onMove, onEnd }"
    v-pan="{ onPan }"
    v-pinch="{ onPinch }"
  >
    触摸区域
  </div>
</template>
```

## 数据可视化

组合使用 `v-progress`、`v-counter` 和 `v-countdown` 实现数据展示动画。

```vue
<template>
  <div v-progress="{ value: 75, showText: true }" />
  <span v-counter="{ from: 0, to: 10000, duration: 2000 }" />
  <span v-countdown="{ time: 60000, format: 'mm:ss' }" />
</template>
```

## 拖拽排序

组合使用 `v-draggable` 和 `v-intersect` 实现可排序列表。

```vue
<template>
  <div
    v-for="item in items"
    :key="item.id"
    v-draggable="{ axis: 'y' }"
    v-intersect="{ handler: onVisible }"
  >
    {{ item.title }}
  </div>
</template>
```

## 打印导出

组合使用 `v-print` 和 `v-export` 实现文档处理。

```vue
<template>
  <button v-print="{ title: '报告' }">打印</button>
  <button v-export="{ type: 'image', filename: 'report' }">导出</button>
</template>
```

## 全屏媒体

组合使用 `v-fullscreen` 和 `v-lottie` 实现媒体播放控制。

```vue
<template>
  <div v-fullscreen="{ value: isFullscreen }">
    <div v-lottie="{ path: animationUrl, autoplay: true, loop: true }" />
  </div>
</template>
```