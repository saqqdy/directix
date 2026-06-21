# @directix/i18n

[![npm version](https://img.shields.io/npm/v/@directix/i18n.svg)](https://www.npmjs.com/package/@directix/i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[English](README.md) | 中文**

[Directix](https://github.com/saqqdy/directix) 的国际化支持 — 为所有指令提供本地化的警告消息、错误消息和帮助文本。

## 特性

- 🌍 **8 种内置语言** — zh-CN、en-US、ja-JP、ko-KR、fr-FR、de-DE、es-ES、ru-RU
- 🔍 **自动检测** — `LocaleDetector` 从浏览器设置和 localStorage 自动检测用户首选语言
- ⚡ **动态加载** — `LocaleLoader` 支持缓存和去重，按需加载语言包
- 🕐 **时区支持** — 时区检测和本地化的日期/数字/货币格式化
- 📝 **类型安全** — 完整的 TypeScript 支持，包含 `LocaleCode` 联合类型
- ✅ **校验** — 检查语言包完整性和翻译质量

## 安装

```bash
# pnpm
pnpm add @directix/i18n

# npm
npm install @directix/i18n

# yarn
yarn add @directix/i18n
```

## 使用

### 基本用法

```typescript
import { createI18n } from '@directix/i18n'
import enUS from '@directix/i18n/locales/en-US'
import zhCN from '@directix/i18n/locales/zh-CN'

const i18n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: { 'en-US': enUS, 'zh-CN': zhCN },
})

// 翻译一个 key
i18n.t('errors.invalid_param') // "Invalid parameter"

// 带参数翻译
i18n.t('warnings.deprecated', { api: 'v-old-directive' })

// 切换语言
i18n.setLocale('zh-CN')
i18n.t('errors.invalid_param') // "参数无效"
```

### 快捷方法

```typescript
import { setLocale, getLocale, t } from '@directix/i18n'

setLocale('ja-JP')
getLocale() // 'ja-JP'

t('errors.missing_required') // "必須パラメータが不足しています"
```

### 语言检测

```typescript
import { LocaleDetector } from '@directix/i18n'

// 自动检测（优先级：已存储 > 浏览器语言 > 默认）
const locale = LocaleDetector.detect() // 'ko-KR'、'fr-FR' 等

// 获取所有支持的语言
LocaleDetector.getSupportedLocales()
// ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES', 'ru-RU']

// 检查语言是否支持
LocaleDetector.isSupported('ko-KR') // true

// 规范化语言字符串
LocaleDetector.normalizeLocale('zh-TW') // 'zh-CN'
LocaleDetector.normalizeLocale('en-GB') // 'en-US'

// 设置并持久化偏好
LocaleDetector.setLocale('ja-JP')

// 清除已存储的偏好
LocaleDetector.clearLocale()
```

### 动态加载

```typescript
import { LocaleLoader } from '@directix/i18n'

// 按需加载语言包（首次加载后缓存）
const messages = await LocaleLoader.load('ko-KR')

// 预加载多个语言
await LocaleLoader.preload(['fr-FR', 'de-DE'])

// 直接注册消息（适用于 SSR）
LocaleLoader.register('zh-CN', zhCNMessages)

// 检查缓存状态
LocaleLoader.isLoaded('ko-KR') // true
LocaleLoader.getCachedLocales() // ['ko-KR', 'fr-FR', 'de-DE']

// 清除缓存
LocaleLoader.clearCache()
```

### 语言工具

```typescript
import {
  detectLocaleInfo,
  formatDateLocale,
  formatNumberLocale,
  formatCurrencyLocale,
  getTimezoneInfo,
  getLocaleDisplayName,
} from '@directix/i18n'

// 检测完整语言信息
const info = detectLocaleInfo(navigator.language)
// { language: 'en', region: 'US', script: undefined, ... }

// 按本地风格格式化日期
formatDateLocale(new Date(), 'en-US', { dateStyle: 'long' })
// "June 21, 2026"

// 按本地风格格式化数字
formatNumberLocale(1234567.89, 'de-DE')
// "1.234.567,89"

// 按本地风格格式化货币
formatCurrencyLocale(99.99, 'ja-JP', 'JPY')
// "￥100"

// 获取时区信息
const tz = getTimezoneInfo()
// { name: 'Asia/Shanghai', offset: -480, label: 'GMT+8' }

// 获取语言显示名称
getLocaleDisplayName('ko-KR', 'en') // "Korean (South Korea)"
```

## 支持的语言

| 代码 | 语言 | 旗帜 |
|------|------|------|
| `zh-CN` | 简体中文 | 🇨🇳 |
| `en-US` | 英语（美国） | 🇺🇸 |
| `ja-JP` | 日语 | 🇯🇵 |
| `ko-KR` | 韩语 | 🇰🇷 |
| `fr-FR` | 法语 | 🇫🇷 |
| `de-DE` | 德语 | 🇩🇪 |
| `es-ES` | 西班牙语 | 🇪🇸 |
| `ru-RU` | 俄语 | 🇷🇺 |

## API 参考

### 核心

| 函数 | 说明 |
|------|------|
| `createI18n(options)` | 创建 i18n 实例 |
| `setLocale(locale)` | 设置当前语言 |
| `getLocale()` | 获取当前语言 |
| `t(key, params?)` | 翻译消息键 |

### LocaleDetector

| 方法 | 说明 |
|------|------|
| `detect(fallback?)` | 自动检测用户语言 |
| `setLocale(locale)` | 设置并持久化语言偏好 |
| `clearLocale()` | 清除存储的偏好 |
| `normalizeLocale(lang)` | 规范化为支持的语言代码 |
| `isSupported(locale)` | 检查语言是否支持 |
| `isValidLocale(code)` | 验证语言代码字符串 |
| `getSupportedLocales()` | 获取所有支持的语言代码 |

### LocaleLoader

| 方法 | 说明 |
|------|------|
| `load(locale)` | 加载语言消息（带缓存） |
| `preload(locales)` | 预加载多个语言 |
| `register(locale, messages)` | 直接注册消息 |
| `clearCache()` | 清除缓存 |
| `isLoaded(locale)` | 检查语言是否已缓存 |
| `getCachedLocales()` | 获取已缓存的语言代码 |

### 语言工具

| 函数 | 说明 |
|------|------|
| `detectLocaleInfo(lang)` | 检测完整语言信息 |
| `formatDateLocale(date, locale, options?)` | 本地化日期格式化 |
| `formatNumberLocale(num, locale, options?)` | 本地化数字格式化 |
| `formatCurrencyLocale(amount, locale, currency)` | 本地化货币格式化 |
| `getTimezoneInfo()` | 检测时区信息 |
| `getLocaleDisplayName(locale, displayLocale?)` | 获取语言显示名称 |
| `getSupportedRegions(lang)` | 获取语言的地区列表 |
| `getDateFormat(locale)` | 获取日期格式模式 |
| `getNumberFormat(locale)` | 获取数字格式模式 |

## 相关

- [Directix](https://github.com/saqqdy/directix) — 主 Vue 指令库
- [@directix/core](https://github.com/saqqdy/directix/tree/master/packages/core) — 核心运行时引擎（使用 i18n 进行警告）

## 许可证

[MIT](https://opensource.org/licenses/MIT)
