# v-emoji

Filter or restrict emoji input.

> **Since:** `1.5.0`

## Usage

### Strip All Emojis

```vue
<template>
  <input v-emoji type="text" placeholder="No emojis allowed" />
</template>
```

### Strip with Replacement

```vue
<template>
  <input v-emoji="{ strip: true, replacement: '*' }" type="text" />
</template>
```

### Allow Specific Emojis

```vue
<template>
  <input v-emoji="{ allowList: ['😊', '👍'] }" type="text" />
</template>
```

### Block Specific Emojis

```vue
<template>
  <input v-emoji="{ blockList: ['🚫', '❌'] }" type="text" />
</template>
```

## API

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `strip` | `boolean` | `true` | Whether to strip emojis |
| `replacement` | `string` | `''` | Character to replace emojis with |
| `allowList` | `string[]` | - | List of allowed emojis |
| `blockList` | `string[]` | - | List of blocked emojis |

## Examples

### Form Input

```vue
<template>
  <form @submit="handleSubmit">
    <input v-emoji v-model="username" placeholder="Username (no emojis)" />
    <textarea v-emoji="{ strip: true, replacement: '' }" placeholder="Comment"></textarea>
    <button type="submit">Submit</button>
  </form>
</template>
```

### Chat Input with Allowed Emojis

```vue
<template>
  <input v-emoji="{ allowList: ['😊', '👍', '❤️', '🎉'] }" type="text" />
</template>
```

## Composable API

For programmatic use, you can use the `useEmoji` composable:

```typescript
import { useEmoji } from 'directix'

const { stripEmojis, containsEmoji, filterEmojis } = useEmoji({
  strip: true,
  allowList: ['😊', '👍']
})

// Strip emojis from string
const clean = stripEmojis('Hello 😊 World 👍') // 'Hello  World '

// Check if string contains emoji
const hasEmoji = containsEmoji('Hello 😊') // true

// Filter emojis from string
const filtered = filterEmojis('Hello 😊 World 👍')
// { text: 'Hello  World ', emojis: ['😊', '👍'] }
```

### UseEmojiReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `stripEmojis` | `(text: string) => string` | Strip emojis from text |
| `containsEmoji` | `(text: string) => boolean` | Check if text contains emoji |
| `filterEmojis` | `(text: string) => { text: string, emojis: string[] }` | Filter and return emojis |
## Code Generator

<DirectiveConfigurator name="emoji" description="Filter or restrict emoji input." />
