# 04 - Form Directives Deep Dive

**Duration: 10 minutes**

## Video Info

- Title: Form Directives Deep Dive
- Series: Getting Started
- Level: Beginner
- Prerequisites: Vue form binding

## Chapters

1. v-copy Copy (2 min)
2. v-mask Input Masking (2 min)
3. v-focus Auto Focus (1.5 min)
4. v-trim / v-uppercase / v-lowercase (2 min)
5. v-money / v-number Number Handling (2.5 min)

## Detailed Script

### Opening (0:00-0:10)

Today we learn Directix's form directives that greatly simplify form handling.

### Chapter 1: v-copy (0:10-2:10)

> **Visual: Copy button effect**

**Basic Usage:**

```vue
<template>
  <button v-copy="textToCopy">Copy</button>
</template>

<script setup>
const textToCopy = ref('Hello Directix!')
</script>
```

**Copy Element Content:**

```vue
<template>
  <!-- Copy input value -->
  <input v-model="inputVal" />
  <button v-copy="inputVal">Copy Input Value</button>
</template>
```

**Copy Callbacks:**

```vue
<template>
  <button v-copy="{
    value: apiKey,
    onSuccess: () => showToast('Copied to clipboard'),
    onError: () => showToast('Copy failed')
  }">
    Copy API Key
  </button>
</template>
```

### Chapter 2: v-mask (2:10-4:10)

> **Visual: Various formatted input effects**

**Phone Number Format:**

```vue
<template>
  <input v-mask="'### #### ####'" placeholder="Phone" />
</template>
```

**Date Format:**

```vue
<template>
  <input v-mask="'####/##/##'" placeholder="YYYY/MM/DD" />
</template>
```

**Custom Masks:**

```vue
<template>
  <!-- # = digit, A = letter, * = any char -->
  <input v-mask="'##-AA-****'" placeholder="Custom" />

  <!-- IP Address -->
  <input v-mask="'###.###.###.###'" placeholder="IP Address" />

  <!-- Credit Card -->
  <input v-mask="'#### #### #### ####'" placeholder="Card Number" />
</template>
```

### Chapter 3: v-focus (4:10-5:40)

> **Visual: Search box auto-focus effect**

```vue
<template>
  <!-- Auto-focus after page load -->
  <input v-focus placeholder="Search..." />
</template>
```

**Conditional Focus:**

```vue
<template>
  <input v-focus="shouldFocus" placeholder="Search..." />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const shouldFocus = ref(false)

onMounted(() => {
  // Focus after dialog opens
  shouldFocus.value = true
})
</script>
```

### Chapter 4: Text Transform Directives (5:40-7:40)

> **Visual: Text transformation effects**

**v-trim Auto-trim Spaces:**

```vue
<template>
  <input v-trim v-model="name" placeholder="Trim leading/trailing spaces" />
</template>
```

**v-uppercase Uppercase:**

```vue
<template>
  <input v-uppercase v-model="code" placeholder="Auto uppercase" />
</template>
```

**v-lowercase Lowercase:**

```vue
<template>
  <input v-lowercase v-model="email" placeholder="Auto lowercase" />
</template>
```

**v-capitalcase Capitalize:**

```vue
<template>
  <input v-capitalcase v-model="name" placeholder="Capitalize first letter" />
</template>
```

### Chapter 5: Number Handling (7:40-10:00)

> **Visual: Currency input effect**

**v-money Currency Format:**

```vue
<template>
  <!-- Auto-format as currency -->
  <input v-money v-model="price" placeholder="Amount" />

  <!-- Custom configuration -->
  <input v-money="{
    prefix: '$',
    suffix: '',
    precision: 2,
    thousands: ','
  }" v-model="amount" />
</template>
```

**v-number Number Input:**

```vue
<template>
  <!-- Only allow numbers -->
  <input v-number v-model="count" placeholder="Quantity" />

  <!-- Custom configuration -->
  <input v-number="{
    min: 0,
    max: 100,
    precision: 0,
    negative: false
  }" v-model="age" placeholder="Age" />
</template>
```

**Combined Usage:**

```vue
<template>
  <form>
    <input v-trim v-capitalize v-model="name" placeholder="Name" />
    <input v-lowercase v-model="email" placeholder="Email" />
    <input v-money v-model="price" placeholder="Price" />
    <input v-number="{ min: 1, max: 99 }" v-model="quantity" placeholder="Qty" />
    <button type="submit">Submit</button>
  </form>
</template>
```

### Summary

Today we learned six form directives:
- v-copy - One-click copy
- v-mask - Input masking and formatting
- v-focus - Auto focus
- v-trim/v-uppercase/v-lowercase/v-capitalcase - Text transformation
- v-money/v-number - Number handling

Next video covers visibility and lazy loading directives.

## Exercises

1. Implement an API Key display component with copy button
2. Create phone input with v-mask formatted as 138 0000 0000
3. Implement a price input with v-money showing ¥ prefix and 2 decimals

## Resources

- [Form Directives Docs](https://saqqdy.github.io/directix/guide/forms)
- [v-copy API](https://saqqdy.github.io/directix/api/directives/copy)
- [v-mask API](https://saqqdy.github.io/directix/api/directives/mask)