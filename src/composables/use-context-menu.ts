import { isBrowser } from '@directix/core'
import { onUnmounted, type Ref, unref } from 'vue'

/**
 * Context menu item
 */
export interface ContextMenuItem {
	label: string
	handler?: () => void
	disabled?: boolean
	divider?: boolean
	icon?: string
	class?: string
}

/**
 * Options for useContextMenu composable
 */
export interface UseContextMenuOptions {
	/** Menu items */
	items: ContextMenuItem[] | Ref<ContextMenuItem[]>

	/** Custom class for menu container */
	class?: string

	/** Menu width */
	width?: number | string

	/** Whether to disable */
	disabled?: boolean | Ref<boolean>
}

/**
 * Return type for useContextMenu composable
 */
export interface UseContextMenuReturn {
	/** Bind context menu to an element */
	bind: (element: HTMLElement) => () => void

	/** Show menu at position */
	show: (x: number, y: number) => void

	/** Hide menu */
	hide: () => void
}

/**
 * Create menu element
 */
function createMenuElement(
	x: number,
	y: number,
	items: ContextMenuItem[],
	options: UseContextMenuOptions,
): HTMLDivElement {
	const menu = document.createElement('div')
	menu.className = `v-context-menu ${options.class || ''}`

	const width = options.width ? typeof options.width === 'number' ? `${options.width}px` : options.width : '150px'

	menu.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    min-width: ${width};
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    padding: 4px 0;
    z-index: 9999;
    font-size: 14px;
  `

	items.forEach(item => {
		if (item.divider) {
			const divider = document.createElement('div')
			divider.className = 'v-context-menu__divider'
			divider.style.cssText = `
        height: 1px;
        background: #e8e8e8;
        margin: 4px 0;
      `
			menu.appendChild(divider)
		}

		const menuItem = document.createElement('div')
		menuItem.className = `v-context-menu__item ${item.class || ''}`

		if (item.disabled) {
			menuItem.classList.add('v-context-menu__item--disabled')
		}

		menuItem.style.cssText = `
      padding: 8px 16px;
      cursor: ${item.disabled ? 'not-allowed' : 'pointer'};
      color: ${item.disabled ? '#b0b0b0' : '#333'};
      display: flex;
      align-items: center;
      gap: 8px;
    `

		if (item.icon) {
			const icon = document.createElement('span')
			icon.className = 'v-context-menu__icon'
			icon.innerHTML = item.icon
			menuItem.appendChild(icon)
		}

		const label = document.createElement('span')
		label.textContent = item.label
		menuItem.appendChild(label)

		if (!item.disabled && item.handler) {
			menuItem.addEventListener('click', () => {
				item.handler!()
				menu.remove()
			})

			menuItem.addEventListener('mouseenter', () => {
				menuItem.style.background = '#f5f5f5'
			})

			menuItem.addEventListener('mouseleave', () => {
				menuItem.style.background = 'transparent'
			})
		}

		menu.appendChild(menuItem)
	})

	return menu
}

/**
 * Composable for creating context menus
 *
 * @param options - Configuration options
 * @returns Context menu utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useContextMenu } from 'directix'
 *
 * const containerRef = ref(null)
 * const items = [
 *   { label: 'Copy', handler: () => console.log('Copy') },
 *   { label: 'Paste', handler: () => console.log('Paste') },
 *   { divider: true, label: '' },
 *   { label: 'Delete', handler: () => console.log('Delete') }
 * ]
 *
 * const { bind } = useContextMenu({ items })
 *
 * onMounted(() => bind(containerRef.value))
 * </script>
 *
 * <template>
 *   <div ref="containerRef">Right click here</div>
 * </template>
 * ```
 */
export function useContextMenu(options: UseContextMenuOptions): UseContextMenuReturn {
	let currentElement: HTMLElement | null = null,
		contextMenuHandler: ((e: MouseEvent) => void) | null = null,
		menuElement: HTMLDivElement | null = null,
		clickOutsideHandler: ((e: MouseEvent) => void) | null = null

	function hide(): void {
		if (menuElement) {
			menuElement.remove()
			menuElement = null
		}
		if (clickOutsideHandler) {
			document.removeEventListener('click', clickOutsideHandler)
		}
	}

	function show(x: number, y: number): void {
		if (unref(options.disabled)) return

		hide()

		const items = unref(options.items)
		menuElement = createMenuElement(x, y, items, options)
		document.body.appendChild(menuElement)

		// Adjust position
		const rect = menuElement.getBoundingClientRect()
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight

		if (x + rect.width > viewportWidth) {
			menuElement.style.left = `${viewportWidth - rect.width - 8}px`
		}
		if (y + rect.height > viewportHeight) {
			menuElement.style.top = `${viewportHeight - rect.height - 8}px`
		}

		setTimeout(() => {
			clickOutsideHandler = (e: MouseEvent) => {
				const target = e.target as Node
				if (menuElement && !menuElement.contains(target)) {
					hide()
				}
			}
			document.addEventListener('click', clickOutsideHandler)
		}, 0)
	}

	function handleContextMenu(e: MouseEvent): void {
		e.preventDefault()
		show(e.clientX, e.clientY)
	}

	function bind(element: HTMLElement): () => void {
		if (!isBrowser()) return () => {}

		unbind()

		currentElement = element
		contextMenuHandler = handleContextMenu
		element.addEventListener('contextmenu', contextMenuHandler)

		return unbind
	}

	function unbind(): void {
		if (currentElement && contextMenuHandler) {
			currentElement.removeEventListener('contextmenu', contextMenuHandler)
		}
		hide()
		currentElement = null
		contextMenuHandler = null
	}

	onUnmounted(() => {
		unbind()
	})

	return {
		bind,
		show,
		hide,
	}
}
