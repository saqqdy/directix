import { expect, test } from '@playwright/test'

test.describe('v-copy directive', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/directives/copy')
	})

	test('should copy text to clipboard on click', async ({ page, context }) => {
		// Grant clipboard permissions
		await context.grantPermissions(['clipboard-read', 'clipboard-write'])

		const copyButton = page.getByTestId('copy-basic')
		await copyButton.click()

		// Check success indicator
		await expect(page.getByTestId('copy-success')).toBeVisible()

		// Verify clipboard content
		const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
		expect(clipboardText).toBe('Text to copy')
	})

	test('should call onSuccess callback', async ({ page, context }) => {
		await context.grantPermissions(['clipboard-read', 'clipboard-write'])

		const copyButton = page.getByTestId('copy-callback')
		await copyButton.click()

		// Check callback indicator
		await expect(page.getByTestId('callback-result')).toHaveText('Copied!')
	})

	test('should handle disabled state', async ({ page }) => {
		const copyButton = page.getByTestId('copy-disabled')
		await copyButton.click()

		// Should not show success indicator
		await expect(page.getByTestId('copy-success')).not.toBeVisible()
	})
})

test.describe('v-debounce directive', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/directives/debounce')
	})

	test('should debounce input events', async ({ page }) => {
		const input = page.getByTestId('debounce-input')
		const result = page.getByTestId('debounce-result')

		// Type multiple characters quickly
		await input.fill('test')
		await input.fill('testing')
		await input.fill('debounced')

		// Wait for debounce to complete
		await page.waitForTimeout(350)

		// Should only have the final value
		await expect(result).toHaveText('debounced')
	})

	test('should respect custom wait time', async ({ page }) => {
		const input = page.getByTestId('debounce-custom')
		const result = page.getByTestId('debounce-custom-result')

		await input.fill('test')
		await page.waitForTimeout(300)

		// Should not have updated yet (500ms debounce)
		await expect(result).toHaveText('')

		await page.waitForTimeout(250)

		// Now it should have updated
		await expect(result).toHaveText('test')
	})
})

test.describe('v-throttle directive', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/directives/throttle')
	})

	test('should throttle click events', async ({ page }) => {
		const button = page.getByTestId('throttle-button')
		const counter = page.getByTestId('throttle-counter')

		// Click multiple times quickly
		for (let i = 0; i < 5; i++) {
			await button.click()
		}

		// Should only have incremented once
		await expect(counter).toHaveText('1')

		// Wait for throttle to complete
		await page.waitForTimeout(350)

		// Click again
		await button.click()
		await expect(counter).toHaveText('2')
	})
})

test.describe('v-click-outside directive', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/directives/click-outside')
	})

	test('should detect clicks outside element', async ({ page }) => {
		const dropdown = page.getByTestId('dropdown')
		const outside = page.getByTestId('outside-area')

		// Open dropdown
		await dropdown.click()
		await expect(dropdown).toHaveAttribute('data-open', 'true')

		// Click outside
		await outside.click()
		await expect(dropdown).toHaveAttribute('data-open', 'false')
	})

	test('should not trigger on inside clicks', async ({ page }) => {
		const dropdown = page.getByTestId('dropdown')
		const innerButton = page.getByTestId('dropdown-inner')

		// Open dropdown
		await dropdown.click()
		await expect(dropdown).toHaveAttribute('data-open', 'true')

		// Click inside
		await innerButton.click()
		await expect(dropdown).toHaveAttribute('data-open', 'true')
	})
})

test.describe('v-long-press directive', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/directives/long-press')
	})

	test('should trigger on long press', async ({ page }) => {
		const button = page.getByTestId('long-press-button')
		const result = page.getByTestId('long-press-result')

		// Long press
		await button.dispatchEvent('mousedown')
		await page.waitForTimeout(600)
		await button.dispatchEvent('mouseup')

		await expect(result).toHaveText('Long pressed!')
	})

	test('should not trigger on short press', async ({ page }) => {
		const button = page.getByTestId('long-press-button')
		const result = page.getByTestId('long-press-result')

		// Short press
		await button.dispatchEvent('mousedown')
		await page.waitForTimeout(100)
		await button.dispatchEvent('mouseup')

		await expect(result).toHaveText('')
	})
})

test.describe('v-focus directive', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/directives/focus')
	})

	test('should focus element on mount', async ({ page }) => {
		const input = page.getByTestId('auto-focus-input')

		await expect(input).toBeFocused()
	})

	test('should focus when condition is true', async ({ page }) => {
		const toggle = page.getByTestId('focus-toggle')
		const input = page.getByTestId('conditional-focus')

		await toggle.click()
		await expect(input).toBeFocused()
	})
})

test.describe('v-hover directive', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/directives/hover')
	})

	test('should detect hover state', async ({ page }) => {
		const element = page.getByTestId('hover-element')
		const status = page.getByTestId('hover-status')

		await element.hover()
		await expect(status).toHaveText('Hovering')

		await page.mouse.move(0, 0)
		await expect(status).toHaveText('Not hovering')
	})
})

test.describe('v-loading directive', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/directives/loading')
	})

	test('should show loading state', async ({ page }) => {
		const container = page.getByTestId('loading-container')

		await expect(container).toHaveAttribute('data-loading', 'true')
		await expect(container.locator('.v-loading-spinner')).toBeVisible()
	})

	test('should hide loading when done', async ({ page }) => {
		const container = page.getByTestId('loading-container')
		const toggle = page.getByTestId('loading-toggle')

		await toggle.click()
		await expect(container).toHaveAttribute('data-loading', 'false')
		await expect(container.locator('.v-loading-spinner')).not.toBeVisible()
	})
})
