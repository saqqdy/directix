# Directix E2E 测试使用指南

## 概述

Directix 使用 Playwright 进行端到端 (E2E) 测试，确保指令在真实浏览器环境中的正确行为。

## 技术栈

- **Playwright** - 跨浏览器自动化测试框架
- **@playwright/test** - Playwright 测试运行器

## 安装

```bash
# 安装 Playwright
pnpm add -D @playwright/test

# 安装浏览器
npx playwright install
```

## 配置

配置文件位于项目根目录 [playwright.config.ts](../playwright.config.ts)：

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm dev:playground',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

### 配置说明

| 配置项 | 说明 |
|--------|------|
| `testDir` | 测试文件目录 |
| `fullyParallel` | 完全并行执行测试 |
| `forbidOnly` | CI 环境禁止使用 `.only` |
| `retries` | 失败重试次数 |
| `workers` | 并行工作进程数 |
| `reporter` | 测试报告格式 |
| `baseURL` | 测试基础 URL |
| `trace` | 追踪记录策略 |
| `screenshot` | 截图策略 |
| `video` | 视频录制策略 |
| `projects` | 测试项目配置 |
| `webServer` | 开发服务器配置 |

## 测试文件结构

测试文件位于 `tests/e2e/` 目录：

```
tests/e2e/
└── directives.spec.ts    # 指令 E2E 测试
```

## 运行测试

### 运行所有测试

```bash
pnpm test:e2e
```

### 运行特定浏览器

```bash
# Chromium
npx playwright test --project=chromium

# Firefox
npx playwright test --project=firefox

# Safari (webkit)
npx playwright test --project=webkit

# 移动端 Chrome
npx playwright test --project="Mobile Chrome"

# 移动端 Safari
npx playwright test --project="Mobile Safari"
```

### 运行特定测试文件

```bash
npx playwright test tests/e2e/directives.spec.ts
```

### 运行特定测试用例

```bash
npx playwright test -g "v-copy"
```

### 调试模式

```bash
# 打开 UI 模式
npx playwright test --ui

# 调试模式
npx playwright test --debug
```

### 查看测试报告

```bash
npx playwright show-report
```

## 编写测试用例

### 基本结构

```typescript
import { expect, test } from '@playwright/test'

test.describe('指令名称', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/directives/指令名称')
  })

  test('测试用例描述', async ({ page }) => {
    // 测试逻辑
  })
})
```

### 测试示例

#### v-copy 测试

```typescript
test.describe('v-copy directive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/directives/copy')
  })

  test('should copy text to clipboard on click', async ({ page, context }) => {
    // 授予剪贴板权限
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const copyButton = page.getByTestId('copy-basic')
    await copyButton.click()

    // 检查成功指示器
    await expect(page.getByTestId('copy-success')).toBeVisible()

    // 验证剪贴板内容
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toBe('Text to copy')
  })

  test('should handle disabled state', async ({ page }) => {
    const copyButton = page.getByTestId('copy-disabled')
    await copyButton.click()

    // 不应显示成功指示器
    await expect(page.getByTestId('copy-success')).not.toBeVisible()
  })
})
```

#### v-debounce 测试

```typescript
test.describe('v-debounce directive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/directives/debounce')
  })

  test('should debounce input events', async ({ page }) => {
    const input = page.getByTestId('debounce-input')
    const result = page.getByTestId('debounce-result')

    // 快速输入多个字符
    await input.fill('test')
    await input.fill('testing')
    await input.fill('debounced')

    // 等待防抖完成
    await page.waitForTimeout(350)

    // 应该只有最终值
    await expect(result).toHaveText('debounced')
  })

  test('should respect custom wait time', async ({ page }) => {
    const input = page.getByTestId('debounce-custom')
    const result = page.getByTestId('debounce-custom-result')

    await input.fill('test')
    await page.waitForTimeout(300)

    // 还不应该更新 (500ms 防抖)
    await expect(result).toHaveText('')

    await page.waitForTimeout(250)

    // 现在应该更新了
    await expect(result).toHaveText('test')
  })
})
```

#### v-click-outside 测试

```typescript
test.describe('v-click-outside directive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/directives/click-outside')
  })

  test('should detect clicks outside element', async ({ page }) => {
    const dropdown = page.getByTestId('dropdown')
    const outside = page.getByTestId('outside-area')

    // 打开下拉菜单
    await dropdown.click()
    await expect(dropdown).toHaveAttribute('data-open', 'true')

    // 点击外部
    await outside.click()
    await expect(dropdown).toHaveAttribute('data-open', 'false')
  })

  test('should not trigger on inside clicks', async ({ page }) => {
    const dropdown = page.getByTestId('dropdown')
    const innerButton = page.getByTestId('dropdown-inner')

    // 打开下拉菜单
    await dropdown.click()
    await expect(dropdown).toHaveAttribute('data-open', 'true')

    // 点击内部
    await innerButton.click()
    await expect(dropdown).toHaveAttribute('data-open', 'true')
  })
})
```

#### v-long-press 测试

```typescript
test.describe('v-long-press directive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/directives/long-press')
  })

  test('should trigger on long press', async ({ page }) => {
    const button = page.getByTestId('long-press-button')
    const result = page.getByTestId('long-press-result')

    // 长按
    await button.dispatchEvent('mousedown')
    await page.waitForTimeout(600)
    await button.dispatchEvent('mouseup')

    await expect(result).toHaveText('Long pressed!')
  })

  test('should not trigger on short press', async ({ page }) => {
    const button = page.getByTestId('long-press-button')
    const result = page.getByTestId('long-press-result')

    // 短按
    await button.dispatchEvent('mousedown')
    await page.waitForTimeout(100)
    await button.dispatchEvent('mouseup')

    await expect(result).toHaveText('')
  })
})
```

## 常用断言

### 元素状态

```typescript
// 可见性
await expect(element).toBeVisible()
await expect(element).not.toBeVisible()

// 存在性
await expect(element).toBeInTheDocument()

// 文本内容
await expect(element).toHaveText('Expected text')
await expect(element).toContainText('partial')

// 属性
await expect(element).toHaveAttribute('data-value', '123')
await expect(element).toHaveClass('active')

// 表单值
await expect(input).toHaveValue('input value')
await expect(checkbox).toBeChecked()

// 焦点
await expect(input).toBeFocused()
```

### 页面状态

```typescript
// URL
await expect(page).toHaveURL('/expected-path')

// 标题
await expect(page).toHaveTitle('Page Title')
```

## 页面对象模式

对于复杂测试，推荐使用页面对象模式：

```typescript
// tests/e2e/pages/DirectivesPage.ts
export class DirectivesPage {
  constructor(private page: Page) {}

  async goto(directive: string) {
    await this.page.goto(`/directives/${directive}`)
  }

  async clickCopyButton() {
    await this.page.getByTestId('copy-basic').click()
  }

  async getCopyResult() {
    return this.page.getByTestId('copy-success')
  }
}

// 使用
test('should copy', async ({ page }) => {
  const directivesPage = new DirectivesPage(page)
  await directivesPage.goto('copy')
  await directivesPage.clickCopyButton()
  await expect(directivesPage.getCopyResult()).toBeVisible()
})
```

## CI 集成

### GitHub Actions

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## 最佳实践

1. **使用 data-testid** - 使用 `data-testid` 属性定位元素，避免依赖 CSS 选择器
2. **避免硬编码等待** - 使用 `expect` 自动重试，而非 `waitForTimeout`
3. **测试用户行为** - 测试真实用户交互，而非实现细节
4. **保持测试独立** - 每个测试应该独立，不依赖其他测试的结果
5. **清理测试数据** - 在 `afterEach` 中清理测试产生的数据

## 调试技巧

### 截图

```typescript
await page.screenshot({ path: 'screenshot.png' })
```

### 追踪

```typescript
// 在测试中手动启动追踪
await page.context().tracing.start({ screenshots: true, snapshots: true })
// ... 测试逻辑
await page.context().tracing.stop({ path: 'trace.zip' })
```

### 控制台日志

```typescript
page.on('console', msg => console.log('PAGE LOG:', msg.text()))
```

### 慢动作

```typescript
// 在配置中添加
use: {
  launchOptions: {
    slowMo: 1000, // 每个操作延迟 1 秒
  },
}
```

## 常见问题

### Q: 剪贴板测试失败？

A: 确保授予剪贴板权限：

```typescript
await context.grantPermissions(['clipboard-read', 'clipboard-write'])
```

### Q: 测试超时？

A: 增加超时时间：

```typescript
test('long running test', async ({ page }) => {
  test.setTimeout(60000) // 60 秒
  // ...
})
```

### Q: 元素找不到？

A: 使用 `waitForSelector`：

```typescript
await page.waitForSelector('[data-testid="my-element"]')
```
