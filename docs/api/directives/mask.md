# v-mask

Input mask formatting for structured input.

> **Since:** `1.1.0`

## Usage

### Basic

```vue
<template>
  <!-- Phone number -->
  <input v-mask="'(###) ###-####'" placeholder="Phone" />

  <!-- SSN -->
  <input v-mask="'###-##-####'" placeholder="SSN" />

  <!-- Date -->
  <input v-mask="'##/##/####'" placeholder="Date" />
</template>
```

### With Options

```vue
<template>
  <input v-mask="{
    mask: '##/##/####',
    placeholder: '_',
    onComplete: handleComplete
  }" placeholder="Date" />
</template>

<script setup>
function handleComplete(value) {
  console.log('Complete date:', value)
}
</script>
```

## Mask Tokens

| Token | Pattern | Description |
| ----- | ------- | ----------- |
| `#` | `[0-9]` | Digit (0-9) |
| `A` | `[A-Za-z]` | Letter (a-z, A-Z) |
| `N` | `[A-Za-z0-9]` | Alphanumeric (a-z, A-Z, 0-9) |
| `X` | `.` | Any character |

## API

### Types

```typescript
interface MaskOptions {
  /** Mask pattern */
  mask: string
  /** Placeholder character */
  placeholder?: string
  /** Show mask placeholder on focus */
  showPlaceholder?: boolean
  /** Show mask on blur */
  showMaskOnBlur?: boolean
  /** Clear incomplete value on blur */
  clearIncomplete?: boolean
  /** Disable the mask */
  disabled?: boolean
  /** Callback on value change */
  onChange?: (value: string, rawValue: string) => void
  /** Callback when mask is complete */
  onComplete?: (value: string) => void
}

type MaskBinding = string | MaskOptions
```

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `mask` | `string` | - | Mask pattern (required) |
| `placeholder` | `string` | `'_'` | Placeholder character |
| `showPlaceholder` | `boolean` | `true` | Show placeholder on focus |
| `showMaskOnBlur` | `boolean` | `false` | Show mask on blur |
| `clearIncomplete` | `boolean` | `false` | Clear incomplete on blur |
| `disabled` | `boolean` | `false` | Disable the mask |
| `onChange` | `Function` | - | Callback on value change |
| `onComplete` | `Function` | - | Callback when complete |

## Examples

### Common Formats

```vue
<template>
  <div>
    <label>Phone:</label>
    <input v-mask="'(###) ###-####'" type="tel" />
  </div>

  <div>
    <label>Credit Card:</label>
    <input v-mask="'#### #### #### ####'" type="text" />
  </div>

  <div>
    <label>Date (MM/DD/YYYY):</label>
    <input v-mask="'##/##/####'" type="text" />
  </div>

  <div>
    <label>Time:</label>
    <input v-mask="'##:##'" type="text" />
  </div>

  <div>
    <label>Product Code:</label>
    <input v-mask="'AAA-####'" type="text" />
  </div>
</template>
```

### With Validation

```vue
<template>
  <form @submit.prevent="submit">
    <input
      v-mask="{
        mask: '##/##/####',
        onComplete: validateDate
      }"
      v-model="date"
      placeholder="MM/DD/YYYY"
    />
    <span v-if="error" class="error">{{ error }}</span>
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('')
const error = ref('')

function validateDate(value) {
  const [month, day, year] = value.split('/')
  const m = parseInt(month), d = parseInt(day), y = parseInt(year)

  if (m < 1 || m > 12) {
    error.value = 'Invalid month'
  } else if (d < 1 || d > 31) {
    error.value = 'Invalid day'
  } else {
    error.value = ''
  }
}
</script>
```

## Composable API

For programmatic use, you can use the `useMask` composable:

```typescript
import { useMask } from 'directix'

const { getFormattedValue, getRawValue, isComplete, bind } = useMask({
  mask: '(###) ###-####',
  placeholder: '_',
  showPlaceholder: true,
  showMaskOnBlur: false,
  clearIncomplete: false,
  disabled: false,
  onChange: (value, rawValue) => console.log('Changed:', value, rawValue),
  onComplete: (value) => console.log('Complete:', value)
})

// Format value
const formatted = getFormattedValue('1234567890')

// Get raw value
const raw = getRawValue('(123) 456-7890')

// Check if complete
if (isComplete('(123) 456-7890')) {
  console.log('Mask is complete')
}

// Bind to input
onMounted(() => bind(inputRef.value))
```

### UseMaskOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `mask` | `string \| Ref<string>` | - | Mask pattern (required) |
| `placeholder` | `string` | `'_'` | Placeholder character |
| `showPlaceholder` | `boolean` | `true` | Show placeholder on focus |
| `showMaskOnBlur` | `boolean` | `false` | Show mask on blur |
| `clearIncomplete` | `boolean` | `false` | Clear incomplete on blur |
| `disabled` | `boolean \| Ref<boolean>` | `false` | Disable the mask |
| `onChange` | `(value: string, rawValue: string) => void` | - | Callback on value change |
| `onComplete` | `(value: string) => void` | - | Callback when complete |

### UseMaskReturn

| Property | Type | Description |
| -------- | ---- | ----------- |
| `getFormattedValue` | `(value: string) => string` | Get formatted value |
| `getRawValue` | `(value: string) => string` | Get raw value (without mask literals) |
| `isComplete` | `(value: string) => boolean` | Check if mask is complete |
| `bind` | `(element: HTMLInputElement \| HTMLTextAreaElement) => () => void` | Bind mask to an input element |

### Example

```vue
<script setup>
import { ref } from 'vue'
import { useMask } from 'directix'

const inputRef = ref(null)
const { bind, getRawValue } = useMask({
  mask: '###-##-####',
  placeholder: '_'
})

onMounted(() => bind(inputRef.value))
</script>

<template>
  <input ref="inputRef" type="text" />
</template>
```
