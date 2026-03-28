# Vue 检测代码优化计划

## 一、版本检测逻辑优化

### 1. 当前问题：`require` 在 ESM 环境中不可靠

```typescript
// 当前代码（env.ts:13-28）
try {
  const vue = require('vue')  // ❌ 在 Vite/ESM 环境可能失败
  if (vue?.version?.startsWith('2')) { ... }
} catch {
  // require failed, continue to other methods
}
```

### 借鉴 vue-demi：区分 Vue 2.7

```typescript
// vue-demi 的做法
if (Vue.version.startsWith('2.7.')) {
  // Vue 2.7 原生支持 Composition API
} else if (Vue.version.startsWith('2.')) {
  // Vue 2.6 需要安装 @vue/composition-api
}
```

**优化建议：**
```typescript
export type VueVersion = 2 | 2.7 | 3

export function getVueVersion(): VueVersion {
  // ...
  if (vue?.version) {
    if (vue.version.startsWith('2.7')) return 2.7
    if (vue.version.startsWith('2')) return 2
    if (vue.version.startsWith('3')) return 3
  }
}
```

---

### 2. 当前问题：检测逻辑过于复杂且重复

```typescript
// 当前代码有多次重复的 window 检查
if (typeof window !== 'undefined') {
  // Method 2: Check global Vue instance
}

if (typeof window !== 'undefined') {
  // Method 3: Check for Vue 2 specific behavior
}
```

**优化建议：合并检测逻辑**

```typescript
export function getVueVersion(): 2 | 3 {
  if (_vueVersion !== null) return _vueVersion

  // 1. 静态导入检测（构建时确定）
  // vue-demi 的思路：构建时已经确定版本

  // 2. 运行时检测（合并所有 window 相关检测）
  if (typeof window !== 'undefined') {
    const win = window as any

    // 优先检测全局 Vue
    const vue = win.Vue
    if (vue?.version) {
      _vueVersion = vue.version.startsWith('2') ? 2 : 3
      return _vueVersion
    }

    // 检测 Vue 特有 API
    if (typeof vue?.observable === 'function') {
      _vueVersion = 2
      return _vueVersion
    }
    if (typeof vue?.createApp === 'function') {
      _vueVersion = 3
      return _vueVersion
    }
  }

  // 3. 最后尝试 require
  try {
    const vue = require('vue')
    if (vue?.version?.startsWith('2')) {
      _vueVersion = 2
    } else if (vue?.version?.startsWith('3')) {
      _vueVersion = 3
    }
  } catch {}

  // 默认值
  if (_vueVersion === null) {
    _vueVersion = 3
  }
  return _vueVersion
}
```

---

## 二、LazyDirective 优化

### 3. 当前问题：每个钩子都调用 `getOrCreateDirective()`

```typescript
// 当前代码（define.ts:70-153）
const lazyDirective: any = {
  bind(el: B, binding: any, vnode: any) {
    const directive = getOrCreateDirective()  // 每次都调用
    if (directive.bind) {
      directive.bind(el, binding, vnode)
    }
  },
  // ... 11 个钩子，每个都重复这个模式
}
```

**优化建议：缓存后直接调用**

```typescript
function createLazyDirective<T, B extends Element>(hooks: DirectiveHooks<T, B>): Directive {
  let cachedDirective: any = null
  let versionDetected = false

  // 统一的检测入口
  function detectAndCache() {
    if (!versionDetected) {
      versionDetected = true
      cachedDirective = getVueVersion() === 2
        ? createVue2Directive(hooks)
        : createVue3Directive(hooks)
    }
    return cachedDirective
  }

  // 生成器函数，减少重复代码
  function createHook(hookName: string) {
    return function(el: B, binding: any, vnode: any, prevVnode?: any) {
      const directive = detectAndCache()
      directive[hookName]?.(el, binding, vnode, prevVnode)
    }
  }

  return {
    // Vue 2 hooks
    bind: createHook('bind'),
    inserted: createHook('inserted'),
    update: createHook('update'),
    componentUpdated: createHook('componentUpdated'),
    unbind: createHook('unbind'),
    // Vue 3 hooks
    created: createHook('created'),
    beforeMount: createHook('beforeMount'),
    mounted: createHook('mounted'),
    beforeUpdate: createHook('beforeUpdate'),
    updated: createHook('updated'),
    beforeUnmount: createHook('beforeUnmount'),
    unmounted: createHook('unmounted'),
  } as Directive
}
```

**优化效果：**
- 代码量从 ~85 行减少到 ~30 行
- 消除重复的 `if (directive.xxx)` 判断
- 更易维护和扩展

---

## 三、借鉴 vue-demi 的设计思路

### 4. 提供环境变量支持

**建议增加：**

```typescript
export function getVueVersion(): 2 | 3 {
  if (_vueVersion !== null) return _vueVersion

  // 优先检查环境变量
  if (typeof process !== 'undefined') {
    const envVersion = process.env.DIRECTIX_VUE_VERSION
    if (envVersion === '2') return (_vueVersion = 2)
    if (envVersion === '3') return (_vueVersion = 3)
  }

  // ... 其他检测逻辑
}
```

---

### 5. Vue 2.7 特殊处理

```typescript
// vue-demi 对 Vue 2.7 的处理
// Vue 2.7 内置 Composition API，不需要额外安装 @vue/composition-api

interface VueVersionInfo {
  version: 2 | 2.7 | 3
  hasCompositionAPI: boolean
}

export function getVueInfo(): VueVersionInfo {
  // ...
  return {
    version: detectedVersion,
    hasCompositionAPI: version === 3 || version === 2.7
  }
}
```

---

## 四、代码结构优化

### 6. 当前问题：`isVue2()` 和 `isVue3()` 每次都调用函数

```typescript
// 当前代码
export const isVue2 = (): boolean => getVueVersion() === 2
export const isVue3 = (): boolean => getVueVersion() === 3
```

**优化建议：缓存结果**

```typescript
// vue-demi 的做法：静态变量
export const isVue2 = /* 计算一次 */
export const isVue3 = /* 计算一次 */

// 或者使用 getter 延迟计算
let _isVue2: boolean | null = null
let _isVue3: boolean | null = null

export function isVue2(): boolean {
  if (_isVue2 === null) {
    _isVue2 = getVueVersion() === 2
  }
  return _isVue2
}

export function isVue3(): boolean {
  if (_isVue3 === null) {
    _isVue3 = getVueVersion() === 3
  }
  return _isVue3
}
```

---

## 五、优化清单汇总

| # | 优化点 | 文件 | 优先级 | 预期收益 | 状态 |
|---|--------|------|--------|----------|------|
| 1 | 区分 Vue 2.7 版本 | `env.ts` | 高 | 更精确的版本支持 | ✅ 已完成 |
| 2 | 合并 window 检测逻辑 | `env.ts` | 中 | 代码更简洁 | ✅ 已完成 |
| 3 | LazyDirective 使用生成器模式 | `define.ts` | 高 | 减少 ~50 行代码 | ✅ 已完成 |
| 4 | 支持环境变量配置 | `env.ts` | 中 | CI/CD 更友好 | ✅ 已完成 |
| 5 | 缓存 isVue2/isVue3 结果 | `env.ts` | 低 | 微小性能提升 | ✅ 已完成 |
| 6 | 添加 resetVueVersion 用于测试 | `env.ts` | 低 | 测试更方便 | ✅ 已完成 |

---

## 六、实现顺序

```
阶段 1（高优先级）:
├── 优化 LazyDirective 生成器模式 ✅
└── 区分 Vue 2.7 版本 ✅

阶段 2（中优先级）:
├── 合并 window 检测逻辑 ✅
└── 支持环境变量配置 ✅

阶段 3（低优先级）:
├── 缓存 isVue2/isVue3 ✅
└── 添加测试辅助函数 ✅
```

---

## 七、完成总结

所有优化项目已于 2026-03-28 完成。主要变更：

1. **VueVersion 类型**：从 `2 | 3` 扩展为 `2 | 2.7 | 3`
2. **新增 `isVue27()` 函数**：检测 Vue 2.7（内置 Composition API 支持）
3. **`isVue2()` 行为调整**：现在包含 Vue 2.7（返回 true）
4. **环境变量支持**：`DIRECTIX_VUE_VERSION` 现在接受 `2`、`2.7`、`3`
5. **版本解析函数**：新增 `parseVersion()` 统一版本字符串解析逻辑
