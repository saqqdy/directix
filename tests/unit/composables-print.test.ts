import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { quickPrint, usePrint } from '../../src/composables/use-print'

describe('usePrint', () => {
	beforeEach(() => {
		// Mock window.open
		vi.spyOn(window, 'open').mockReturnValue({
			document: {
				open: vi.fn(),
				write: vi.fn(),
				close: vi.fn(),
				querySelectorAll: vi.fn().mockReturnValue([]),
			},
			focus: vi.fn(),
			print: vi.fn(),
			close: vi.fn(),
		} as any)
	})

	afterEach(() => {
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { isPrinting, print, printPage } = usePrint()

			expect(isPrinting.value).toBe(false)
			expect(print).toBeDefined()
			expect(printPage).toBeDefined()
		})

		it('should print element by selector', async () => {
			const element = document.createElement('div')
			element.id = 'content'
			element.innerHTML = 'Test content'
			document.body.appendChild(element)

			const { print, isPrinting } = usePrint()

			await print('#content')

			expect(isPrinting.value).toBe(false)
		})

		it('should print element directly', async () => {
			const element = document.createElement('div')
			element.innerHTML = 'Test content'
			document.body.appendChild(element)

			const { print } = usePrint()

			await print(element)

			expect(document.querySelector('iframe')).not.toBeNull()
		})

		it('should print body by default', async () => {
			const { print } = usePrint()

			await print()

			expect(document.querySelector('iframe')).not.toBeNull()
		})

		it('should warn if target not found', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			const { print } = usePrint()

			await print('#nonexistent')

			expect(warnSpy).toHaveBeenCalled()
		})
	})

	describe('options', () => {
		it('should use custom title', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { print } = usePrint({ title: 'Custom Title' })

			await print(element)

			expect(document.querySelector('iframe')).not.toBeNull()
		})

		it('should use custom styles', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { print } = usePrint({ styles: '.test { color: red; }' })

			await print(element)

			expect(document.querySelector('iframe')).not.toBeNull()
		})

		it('should use array styles', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { print } = usePrint({ styles: ['.test { color: red; }', '.other { margin: 0; }'] })

			await print(element)

			expect(document.querySelector('iframe')).not.toBeNull()
		})

		it('should use CSS URLs', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { print } = usePrint({ cssUrls: ['https://example.com/style.css'] })

			await print(element)

			expect(document.querySelector('iframe')).not.toBeNull()
		})

		it('should print in new window', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { print } = usePrint({ newWindow: true })

			await print(element)

			expect(window.open).toHaveBeenCalled()
		})
	})

	describe('callbacks', () => {
		it('should call onBeforePrint callback', async () => {
			const onBeforePrint = vi.fn().mockReturnValue(true)
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { print } = usePrint({ onBeforePrint })

			await print(element)

			expect(onBeforePrint).toHaveBeenCalled()
		})

		it('should cancel print if onBeforePrint returns false', async () => {
			const onBeforePrint = vi.fn().mockReturnValue(false)
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { print, isPrinting } = usePrint({ onBeforePrint })

			await print(element)

			expect(onBeforePrint).toHaveBeenCalled()
			expect(isPrinting.value).toBe(false)
		})

		it('should call onAfterPrint callback', async () => {
			const onAfterPrint = vi.fn()
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { print } = usePrint({ onAfterPrint })

			await print(element)

			expect(onAfterPrint).toHaveBeenCalled()
		})
	})

	describe('reactive options', () => {
		it('should support reactive title', async () => {
			const title = ref('Custom Title')
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { print } = usePrint({ title })

			await print(element)

			expect(document.querySelector('iframe')).not.toBeNull()
		})

		it('should support reactive styles', async () => {
			const styles = ref('.test { color: red; }')
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { print } = usePrint({ styles })

			await print(element)

			expect(document.querySelector('iframe')).not.toBeNull()
		})

		it('should support reactive newWindow', async () => {
			const newWindow = ref(false)
			const element = document.createElement('div')
			document.body.appendChild(element)

			const { print } = usePrint({ newWindow })

			await print(element)

			expect(document.querySelector('iframe')).not.toBeNull()
		})
	})

	describe('printPage', () => {
		it('should print the current page', async () => {
			const { printPage } = usePrint()

			await printPage()

			expect(document.querySelector('iframe')).not.toBeNull()
		})
	})

	describe('quickPrint', () => {
		it('should quick print element by selector', async () => {
			const element = document.createElement('div')
			element.id = 'content'
			document.body.appendChild(element)

			await quickPrint('#content')

			expect(document.querySelector('iframe')).not.toBeNull()
		})

		it('should quick print element directly', async () => {
			const element = document.createElement('div')
			document.body.appendChild(element)

			await quickPrint(element)

			expect(document.querySelector('iframe')).not.toBeNull()
		})
	})
})
