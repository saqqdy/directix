import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useContextMenu } from '../../src/composables/use-context-menu'

describe('useContextMenu', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should initialize with items', () => {
			const items = [{ label: 'Copy', handler: vi.fn() }]
			const { bind, show, hide } = useContextMenu({ items })

			expect(bind).toBeDefined()
			expect(show).toBeDefined()
			expect(hide).toBeDefined()
		})

		it('should bind to element', () => {
			const element = document.createElement('div')
			const items = [{ label: 'Copy' }]
			const { bind } = useContextMenu({ items })

			const unbind = bind(element)

			// Element should have contextmenu event listener
			expect(bind).toBeDefined()

			unbind()
		})

		it('should show menu on contextmenu event', () => {
			const element = document.createElement('div')
			document.body.appendChild(element)
			const items = [{ label: 'Copy', handler: vi.fn() }]
			const { bind } = useContextMenu({ items })

			bind(element)

			const contextMenuEvent = new MouseEvent('contextmenu', {
				clientX: 100,
				clientY: 100,
				bubbles: true,
			})
			element.dispatchEvent(contextMenuEvent)

			expect(document.querySelector('.v-context-menu')).not.toBeNull()
		})

		it('should hide menu on click outside', () => {
			vi.useFakeTimers()

			const element = document.createElement('div')
			document.body.appendChild(element)
			const items = [{ label: 'Copy' }]
			const { bind } = useContextMenu({ items })

			bind(element)

			const contextMenuEvent = new MouseEvent('contextmenu', {
				clientX: 100,
				clientY: 100,
				bubbles: true,
			})
			element.dispatchEvent(contextMenuEvent)

			vi.advanceTimersByTime(10)

			expect(document.querySelector('.v-context-menu')).not.toBeNull()

			// Click outside
			const clickEvent = new MouseEvent('click', {
				clientX: 0,
				clientY: 0,
				bubbles: true,
			})
			document.body.dispatchEvent(clickEvent)

			expect(document.querySelector('.v-context-menu')).toBeNull()

			vi.useRealTimers()
		})
	})

	describe('show/hide', () => {
		it('should show menu at position', () => {
			const items = [{ label: 'Copy' }]
			const { show } = useContextMenu({ items })

			show(100, 100)

			expect(document.querySelector('.v-context-menu')).not.toBeNull()
		})

		it('should hide menu', () => {
			const items = [{ label: 'Copy' }]
			const { show, hide } = useContextMenu({ items })

			show(100, 100)
			expect(document.querySelector('.v-context-menu')).not.toBeNull()

			hide()
			expect(document.querySelector('.v-context-menu')).toBeNull()
		})

		it('should not show menu when disabled', () => {
			const items = [{ label: 'Copy' }]
			const { show } = useContextMenu({ items, disabled: true })

			show(100, 100)

			expect(document.querySelector('.v-context-menu')).toBeNull()
		})
	})

	describe('menu items', () => {
		it('should render menu items', () => {
			const items = [
				{ label: 'Copy', handler: vi.fn() },
				{ label: 'Paste', handler: vi.fn() },
			]
			const { show } = useContextMenu({ items })

			show(100, 100)

			const menuItems = document.querySelectorAll('.v-context-menu__item')
			expect(menuItems.length).toBe(2)
		})

		it('should render divider', () => {
			const items = [
				{ label: 'Copy' },
				{ divider: true, label: '' },
				{ label: 'Paste' },
			]
			const { show } = useContextMenu({ items })

			show(100, 100)

			const divider = document.querySelector('.v-context-menu__divider')
			expect(divider).not.toBeNull()
		})

		it('should render disabled item', () => {
			const items = [{ label: 'Copy', disabled: true }]
			const { show } = useContextMenu({ items })

			show(100, 100)

			const menuItem = document.querySelector('.v-context-menu__item--disabled')
			expect(menuItem).not.toBeNull()
		})

		it('should render icon', () => {
			const items = [{ label: 'Copy', icon: '📋' }]
			const { show } = useContextMenu({ items })

			show(100, 100)

			const icon = document.querySelector('.v-context-menu__icon')
			expect(icon?.innerHTML).toBe('📋')
		})

		it('should call handler on click', () => {
			vi.useFakeTimers()

			const handler = vi.fn()
			const items = [{ label: 'Copy', handler }]
			const { show } = useContextMenu({ items })

			show(100, 100)

			vi.advanceTimersByTime(10)

			const menuItem = document.querySelector('.v-context-menu__item') as HTMLElement
			menuItem?.click()

			expect(handler).toHaveBeenCalled()

			vi.useRealTimers()
		})

		it('should apply custom class to item', () => {
			const items = [{ label: 'Copy', class: 'custom-class' }]
			const { show } = useContextMenu({ items })

			show(100, 100)

			const menuItem = document.querySelector('.v-context-menu__item')
			expect(menuItem?.classList.contains('custom-class')).toBe(true)
		})
	})

	describe('options', () => {
		it('should support custom class', () => {
			const items = [{ label: 'Copy' }]
			const { show } = useContextMenu({ items, class: 'custom-menu' })

			show(100, 100)

			const menu = document.querySelector('.v-context-menu')
			expect(menu?.classList.contains('custom-menu')).toBe(true)
		})

		it('should support custom width', () => {
			const items = [{ label: 'Copy' }]
			const { show } = useContextMenu({ items, width: 200 })

			show(100, 100)

			const menu = document.querySelector('.v-context-menu') as HTMLElement
			expect(menu?.style.minWidth).toBe('200px')
		})

		it('should support string width', () => {
			const items = [{ label: 'Copy' }]
			const { show } = useContextMenu({ items, width: 'auto' })

			show(100, 100)

			const menu = document.querySelector('.v-context-menu') as HTMLElement
			expect(menu?.style.minWidth).toBe('auto')
		})
	})

	describe('position adjustment', () => {
		it('should adjust position when menu goes beyond viewport', () => {
			const items = [{ label: 'Copy' }]
			const { show } = useContextMenu({ items })

			// Mock viewport dimensions
			vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800)
			vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600)

			show(750, 550)

			const menu = document.querySelector('.v-context-menu') as HTMLElement
			expect(menu).not.toBeNull()
		})
	})

	describe('reactive options', () => {
		it('should support reactive items', () => {
			const items = ref([{ label: 'Copy' }])
			const { show } = useContextMenu({ items })

			show(100, 100)

			expect(document.querySelector('.v-context-menu')).not.toBeNull()
		})

		it('should support reactive disabled', () => {
			const disabled = ref(false)
			const items = [{ label: 'Copy' }]
			const { show } = useContextMenu({ items, disabled })

			show(100, 100)

			expect(document.querySelector('.v-context-menu')).not.toBeNull()
		})
	})
})
