# Observer Directives

Observer directives help you observe DOM changes and element resizing.

## v-resize

Observe element resize using ResizeObserver.

### Basic Usage

```vue
<template>
  <div v-resize="handleResize">Resize me</div>
</template>

<script setup>
function handleResize(entry) {
  console.log('New size:', entry.contentRect.width, entry.contentRect.height)
}
</script>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Resize event handler (required) |
| `box` | `'content-box' \| 'border-box'` | `'content-box'` | Box model to observe |
| `debounce` | `number` | `0` | Debounce time in milliseconds |

### Resize Info

The handler receives a `ResizeObserverEntry` with:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `contentRect` | `DOMRectReadOnly` | Content rectangle |
| `borderBoxSize` | `Array` | Border box size |
| `contentBoxSize` | `Array` | Content box size |

## v-mutation

Observe DOM mutations using MutationObserver.

### Basic Usage

```vue
<template>
  <div v-mutation="handleMutation">
    Observe my changes
  </div>
</template>

<script setup>
function handleMutation(mutations, observer) {
  mutations.forEach(mutation => {
    console.log('Type:', mutation.type)
    console.log('Target:', mutation.target)
  })
}
</script>
```

### API

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `handler` | `Function` | - | Callback when mutations occur (required) |
| `attributes` | `boolean` | `false` | Observe attribute changes |
| `attributeFilter` | `string[]` | - | Specific attributes to observe |
| `childList` | `boolean` | `true` | Observe child node changes |
| `subtree` | `boolean` | `false` | Observe all descendants |
| `characterData` | `boolean` | `false` | Observe text content changes |

### Mutation Types

| Type | Description |
| ---- | ----------- |
| `attributes` | Attribute was added, removed, or changed |
| `childList` | Child nodes were added or removed |
| `characterData` | Text content was changed |

### Examples

#### Observe Child Changes

```vue
<template>
  <div v-mutation="{
    handler: handleChange,
    childList: true,
    subtree: true
  }">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
  </div>
</template>
```

#### Observe Attributes

```vue
<template>
  <div v-mutation="{
    handler: handleAttributeChange,
    attributes: true,
    attributeFilter: ['class', 'style']
  }">
    Watch class and style changes
  </div>
</template>
```
