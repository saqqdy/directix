# v-highlight

Highlight keywords in text content.

> **Since:** `1.5.0`

## Usage

### Basic

```vue
<template>
  <p v-highlight="'important'">This is an important message.</p>
</template>
```

### Multiple Keywords

```vue
<template>
  <p v-highlight="['Vue', 'React']">Vue and React are popular frameworks.</p>
</template>
```

### With Options

```vue
<template>
  <p v-highlight="{
    keywords: 'highlight',
    className: 'my-highlight',
    style: 'background: yellow; color: black;',
    caseSensitive: true
  }">
    This will highlight the word.
  </p>
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `keywords` | `string \| string[]` | - | Keywords to highlight |
| `className` | `string` | `'v-highlight'` | CSS class for highlighted text |
| `style` | `string` | - | Inline style for highlighted text |
| `tag` | `string` | `'mark'` | HTML tag for highlighted text |
| `caseSensitive` | `boolean` | `false` | Case sensitive matching |
| `wholeWord` | `boolean` | `false` | Match whole words only |

### Binding Types

```ts
type HighlightBinding = string | string[] | HighlightOptions
```

## Examples

### Search Highlight

```vue
<template>
  <input v-model="searchQuery" placeholder="Search..." />
  <p v-highlight="{ keywords: searchQuery, caseSensitive: false }">
    This is some searchable content with keywords to find.
  </p>
</template>
```

### With Custom Style

```vue
<template>
  <p v-highlight="{
    keywords: ['important', 'urgent'],
    style: 'background: #ffeb3b; padding: 0 4px; border-radius: 2px;'
  }">
    This is an important and urgent notification.
  </p>
</template>
```

## Composable API

For programmatic use, you can use the `useHighlight` composable:

```typescript
import { useHighlight } from 'directix'

const { highlight, clear, updateKeywords } = useHighlight({
  keywords: ['important', 'key'],
  className: 'highlight',
  caseSensitive: false
})

// Highlight text manually
const highlighted = highlight('This is important content')

// Clear highlights
clear()

// Update keywords
updateKeywords(['new', 'keywords'])
```

### UseHighlightReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `highlight` | `(text: string) => string` | Highlight text manually |
| `clear` | `() => void` | Clear all highlights |
| `updateKeywords` | `(keywords: string[]) => void` | Update keywords to highlight |
## Code Generator

<DirectiveConfigurator name="highlight" description="Highlight keywords in text content." />
