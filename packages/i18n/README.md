# @directix/i18n

[![npm version](https://img.shields.io/npm/v/@directix/i18n.svg)](https://www.npmjs.com/package/@directix/i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English** | **[中文文档](README_CN.md)**

Internationalization support for [Directix](https://github.com/saqqdy/directix) — provides locale-aware warning messages, error messages, and help text for all directives.

## Features

- 🌍 **8 Built-in Locales** — zh-CN, en-US, ja-JP, ko-KR, fr-FR, de-DE, es-ES, ru-RU
- 🔍 **Auto Detection** — `LocaleDetector` auto-detects user's preferred language from browser settings and localStorage
- ⚡ **Dynamic Loading** — `LocaleLoader` with caching and deduplication for on-demand locale loading
- 🕐 **Timezone Support** — Timezone detection and locale-aware date/number/currency formatting
- 📝 **Type Safe** — Full TypeScript support with `LocaleCode` union type
- ✅ **Validation** — Check locale completeness and translation quality

## Installation

```bash
# pnpm
pnpm add @directix/i18n

# npm
npm install @directix/i18n

# yarn
yarn add @directix/i18n
```

## Usage

### Basic Usage

```typescript
import { createI18n } from '@directix/i18n'
import enUS from '@directix/i18n/locales/en-US'
import zhCN from '@directix/i18n/locales/zh-CN'

const i18n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: { 'en-US': enUS, 'zh-CN': zhCN },
})

// Translate a key
i18n.t('errors.invalid_param') // "Invalid parameter"

// Translate with params
i18n.t('warnings.deprecated', { api: 'v-old-directive' })

// Switch locale
i18n.setLocale('zh-CN')
i18n.t('errors.invalid_param') // "参数无效"
```

### Quick Helpers

```typescript
import { setLocale, getLocale, t } from '@directix/i18n'

setLocale('ja-JP')
getLocale() // 'ja-JP'

t('errors.missing_required') // "必須パラメータが不足しています"
```

### Locale Detection

```typescript
import { LocaleDetector } from '@directix/i18n'

// Auto-detect (priority: stored > browser language > default)
const locale = LocaleDetector.detect() // 'ko-KR', 'fr-FR', etc.

// Get all supported locales
LocaleDetector.getSupportedLocales()
// ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES', 'ru-RU']

// Check if a locale is supported
LocaleDetector.isSupported('ko-KR') // true

// Normalize a language string
LocaleDetector.normalizeLocale('zh-TW') // 'zh-CN'
LocaleDetector.normalizeLocale('en-GB') // 'en-US'

// Set and persist preference
LocaleDetector.setLocale('ja-JP')

// Clear stored preference
LocaleDetector.clearLocale()
```

### Dynamic Loading

```typescript
import { LocaleLoader } from '@directix/i18n'

// Load a locale on demand (cached after first load)
const messages = await LocaleLoader.load('ko-KR')

// Preload multiple locales
await LocaleLoader.preload(['fr-FR', 'de-DE'])

// Register messages directly (useful for SSR)
LocaleLoader.register('zh-CN', zhCNMessages)

// Check cache status
LocaleLoader.isLoaded('ko-KR') // true
LocaleLoader.getCachedLocales() // ['ko-KR', 'fr-FR', 'de-DE']

// Clear cache
LocaleLoader.clearCache()
```

### Locale Utilities

```typescript
import {
  detectLocaleInfo,
  formatDateLocale,
  formatNumberLocale,
  formatCurrencyLocale,
  getTimezoneInfo,
  getLocaleDisplayName,
} from '@directix/i18n'

// Detect full locale info
const info = detectLocaleInfo(navigator.language)
// { language: 'en', region: 'US', script: undefined, ... }

// Format date in locale style
formatDateLocale(new Date(), 'en-US', { dateStyle: 'long' })
// "June 21, 2026"

// Format number in locale style
formatNumberLocale(1234567.89, 'de-DE')
// "1.234.567,89"

// Format currency in locale style
formatCurrencyLocale(99.99, 'ja-JP', 'JPY')
// "￥100"

// Get timezone info
const tz = getTimezoneInfo()
// { name: 'Asia/Shanghai', offset: -480, label: 'GMT+8' }

// Get locale display name
getLocaleDisplayName('ko-KR', 'en') // "Korean (South Korea)"
```

## Supported Locales

| Code | Language | Flag |
|------|----------|------|
| `zh-CN` | Simplified Chinese | 🇨🇳 |
| `en-US` | English (US) | 🇺🇸 |
| `ja-JP` | Japanese | 🇯🇵 |
| `ko-KR` | Korean | 🇰🇷 |
| `fr-FR` | French | 🇫🇷 |
| `de-DE` | German | 🇩🇪 |
| `es-ES` | Spanish | 🇪🇸 |
| `ru-RU` | Russian | 🇷🇺 |

## API Reference

### Core

| Function | Description |
|----------|-------------|
| `createI18n(options)` | Create an i18n instance |
| `setLocale(locale)` | Set current locale |
| `getLocale()` | Get current locale |
| `t(key, params?)` | Translate a message key |

### LocaleDetector

| Method | Description |
|--------|-------------|
| `detect(fallback?)` | Auto-detect user locale |
| `setLocale(locale)` | Set and persist locale preference |
| `clearLocale()` | Clear stored preference |
| `normalizeLocale(lang)` | Normalize to supported locale code |
| `isSupported(locale)` | Check if locale is supported |
| `isValidLocale(code)` | Validate locale code string |
| `getSupportedLocales()` | Get all supported locale codes |

### LocaleLoader

| Method | Description |
|--------|-------------|
| `load(locale)` | Load locale messages (cached) |
| `preload(locales)` | Preload multiple locales |
| `register(locale, messages)` | Register messages directly |
| `clearCache()` | Clear the cache |
| `isLoaded(locale)` | Check if locale is cached |
| `getCachedLocales()` | Get cached locale codes |

### Locale Utilities

| Function | Description |
|----------|-------------|
| `detectLocaleInfo(lang)` | Detect full locale information |
| `formatDateLocale(date, locale, options?)` | Locale-aware date formatting |
| `formatNumberLocale(num, locale, options?)` | Locale-aware number formatting |
| `formatCurrencyLocale(amount, locale, currency)` | Locale-aware currency formatting |
| `getTimezoneInfo()` | Detect timezone info |
| `getLocaleDisplayName(locale, displayLocale?)` | Get locale display name |
| `getSupportedRegions(lang)` | Get regions for a language |
| `getDateFormat(locale)` | Get date format pattern |
| `getNumberFormat(locale)` | Get number format pattern |

## Related

- [Directix](https://github.com/saqqdy/directix) — Main Vue directives library
- [@directix/core](https://github.com/saqqdy/directix/tree/master/packages/core) — Core runtime engine (uses i18n for warnings)

## License

[MIT](https://opensource.org/licenses/MIT)
