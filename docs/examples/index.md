# Examples

Explore interactive examples for each directive.

## Online Demo

Try Directix online with StackBlitz:

| Demo | Link |
| ---- | ---- |
| Vue 3 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue3) |
| Vue 2 | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/saqqdy/directix/tree/master/examples/vue2) |

## Directive Examples

### Event Directives

- [Click Outside](/examples/click-outside) - Detect clicks outside elements
- [Debounce](/examples/debounce) - Debounce event handlers
- [Throttle](/examples/throttle) - Throttle event handlers
- [Long Press](/examples/long-press) - Long press gesture detection
- [Context Menu](/examples/context-menu) - Custom right-click context menu

### Form Directives

- [Copy](/examples/copy) - Copy text to clipboard
- [Focus](/examples/focus) - Auto focus elements

### Visibility Directives

- [Lazy Loading](/examples/lazy) - Image and component lazy loading
- [Infinite Scroll & Virtual List](/examples/infinite-scroll-virtual-list) - Large dataset handling

### Security Directives

- [Permission](/examples/permission) - Permission-based UI control
- [Watermark](/examples/watermark) - Content watermarking

## Local Development

Clone the repository and run the examples locally:

```bash
# Clone the repository
git clone https://github.com/saqqdy/directix.git
cd directix

# Install dependencies
pnpm install

# Run Vue 3 examples
pnpm example:dev

# Or run Vue 2 examples
cd examples/vue2
pnpm install
pnpm dev
```
