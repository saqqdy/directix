# 示例

探索每个指令的交互式示例。

## 在线演示

通过 StackBlitz 在线体验 Directix：

| 演示 | 链接 |
| ---- | ---- |
| Vue 3 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3) |
| Vue 2 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue2) |

## 指令示例

### 事件指令

- [Click Outside](/zh/examples/click-outside) - 检测元素外部点击
- [Debounce](/zh/examples/debounce) - 防抖事件处理
- [Throttle](/zh/examples/throttle) - 节流事件处理

### 表单指令

- [Copy](/zh/examples/copy) - 复制文本到剪贴板
- [Focus](/zh/examples/focus) - 自动聚焦元素

## 本地开发

克隆仓库并在本地运行示例：

```bash
# 克隆仓库
git clone https://github.com/saqqdy/directix.git
cd directix

# 安装依赖
pnpm install

# 运行 Vue 3 示例
pnpm example:dev

# 或运行 Vue 2 示例
cd examples/vue2
pnpm install
pnpm dev
```
