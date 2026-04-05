import { defineDirective, isBrowser } from '@directix/core'
import { off, on } from '@directix/shared'

/**
 * Context menu item
 */
export interface ContextMenuItem {
	/** Item label */
	label: string
	/** Click handler */
	handler?: () => void
	/** Whether the item is disabled */
	disabled?: boolean
	/** Divider before this item */
	divider?: boolean
	/** Custom icon */
	icon?: string
	/** Custom class */
	class?: string
}

/**
 * Context menu directive options
 */
export interface ContextMenuOptions {
	/** Menu items */
	items: ContextMenuItem[]
	/** Custom class for menu container */
	class?: string
	/** Menu width */
	width?: number | string
	/** Whether to disable the context menu */
	disabled?: boolean
	/** Custom render function for menu item */
	renderItem?: (item: ContextMenuItem, index: number) => HTMLElement
	/** Callback before menu shows */
	onBeforeShow?: (e: MouseEvent) => boolean | void
	/** Callback after menu shows */
	onAfterShow?: () => void
	/** Callback after menu hides */
	onHide?: () => void
}

/**
 * Directive binding value type
 */
export type ContextMenuBinding = ContextMenuItem[] | ContextMenuOptions

/**
 * Element state storage
 */
interface ContextMenuState {
	options: ContextMenuOptions
	contextMenuHandler: (e: MouseEvent) => void
	menuElement: HTMLDivElement | null
	clickOutsideHandler: (e: MouseEvent) => void
}

/**
 * Normalize options
 */
function normalizeOptions(binding: ContextMenuBinding): ContextMenuOptions {
	if (Array.isArray(binding)) {
		return { items: binding }
	}
	return binding
}

/**
 * Create menu element
 */
function createMenu(options: ContextMenuOptions, x: number, y: number): HTMLDivElement {
	const menu = document.createElement('div')
	menu.className = `v-context-menu ${options.class || ''}`

	const width = options.width ? (typeof options.width === 'number' ? `${options.width}px` : options.width) : '150px'
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

	options.items.forEach((item, index) => {
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

		if (options.renderItem) {
			const customItem = options.renderItem(item, index)
			menu.appendChild(customItem)
		} else {
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
					removeMenu(menu)
				})

				menuItem.addEventListener('mouseenter', () => {
					menuItem.style.background = '#f5f5f5'
				})

				menuItem.addEventListener('mouseleave', () => {
					menuItem.style.background = 'transparent'
				})
			}

			menu.appendChild(menuItem)
		}
	})

	return menu
}

/**
 * Remove menu from DOM
 */
function removeMenu(menu: HTMLDivElement | null): void {
	if (menu && menu.parentNode) {
		menu.parentNode.removeChild(menu)
	}
}

/**
 * Adjust menu position to stay within viewport
 */
function adjustMenuPosition(menu: HTMLDivElement, x: number, y: number): void {
	const rect = menu.getBoundingClientRect()
	const viewportWidth = window.innerWidth
	const viewportHeight = window.innerHeight

	// Adjust horizontal position
	if (x + rect.width > viewportWidth) {
		menu.style.left = `${viewportWidth - rect.width - 8}px`
	}

	// Adjust vertical position
	if (y + rect.height > viewportHeight) {
		menu.style.top = `${viewportHeight - rect.height - 8}px`
	}
}

/**
 * v-context-menu directive
 *
 * @example
 * ```vue
 * <template>
 *   <div v-context-menu="menuItems">Right click here</div>
 *   <div v-context-menu="{ items: menuItems, width: 200 }">Custom width</div>
 * </template>
 *
 * <script setup>
 * const menuItems = [
 *   { label: 'Copy', handler: () => console.log('Copy') },
 *   { label: 'Paste', handler: () => console.log('Paste') },
 *   { divider: true, label: '' },
 *   { label: 'Delete', handler: () => console.log('Delete') }
 * ]
 * </script>
 * ```
 */
export const vContextMenu = defineDirective<ContextMenuBinding, HTMLElement>({
	name: 'context-menu',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		const state: ContextMenuState = {
			options,
			contextMenuHandler: (e: MouseEvent) => {
				e.preventDefault()

				// Remove existing menu
				if (state.menuElement) {
					removeMenu(state.menuElement)
				}

				// Call before show callback
				if (options.onBeforeShow?.(e) === false) {
					return
				}

				// Create and show menu
				state.menuElement = createMenu(state.options, e.clientX, e.clientY)
				document.body.appendChild(state.menuElement)

				// Adjust position
				adjustMenuPosition(state.menuElement, e.clientX, e.clientY)

				// Add click outside handler
				setTimeout(() => {
					document.addEventListener('click', state.clickOutsideHandler)
				}, 0)

				options.onAfterShow?.()
			},
			menuElement: null,
			clickOutsideHandler: (e: MouseEvent) => {
				const target = e.target as Node

				// Don't close if clicking inside menu
				if (state.menuElement && state.menuElement.contains(target)) {
					return
				}

				removeMenu(state.menuElement)
				state.menuElement = null
				document.removeEventListener('click', state.clickOutsideHandler)
				options.onHide?.()
			},
		}

		;(el as any).__contextMenu = state

		on(el, 'contextmenu', state.contextMenuHandler as (e: Event) => void)
	},

	updated(el, binding) {
		const state: ContextMenuState = (el as any).__contextMenu

		if (!state) return

		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: ContextMenuState = (el as any).__contextMenu

		if (!state) return

		off(el, 'contextmenu', state.contextMenuHandler as (e: Event) => void)

		// Remove menu if still visible
		if (state.menuElement) {
			removeMenu(state.menuElement)
			document.removeEventListener('click', state.clickOutsideHandler)
		}

		delete (el as any).__contextMenu
	},
})

export default vContextMenu
