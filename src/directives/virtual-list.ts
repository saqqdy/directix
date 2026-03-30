import { defineDirective } from '@directix/core'

/**
 * Virtual list item size function
 */
export type ItemSizeFunction = (index: number) => number

/**
 * Virtual list render function
 */
export type VirtualListRenderFunction = (item: any, index: number) => string

/**
 * Virtual list directive options
 */
export interface VirtualListOptions<T = any> {
	/**
	 * Array of items to render
	 * @required
	 */
	items: T[]

	/**
	 * Height of each item (in pixels)
	 * Can be a fixed number or a function
	 * @default 50
	 */
	itemSize?: number | ItemSizeFunction

	/**
	 * Height of the container (in pixels)
	 * @default 400
	 */
	height?: number | string

	/**
	 * Number of extra items to render above/below visible area
	 * @default 3
	 */
	overscan?: number

	/**
	 * Custom render function
	 */
	render?: VirtualListRenderFunction

	/**
	 * Key field name for items
	 * @default 'id'
	 */
	keyField?: string

	/**
	 * Callback when scroll position changes
	 */
	onScroll?: (scrollTop: number) => void

	/**
	 * Callback when visible range changes
	 */
	onVisibleChange?: (startIndex: number, endIndex: number) => void
}

/**
 * Directive binding value type
 */
export type VirtualListBinding<T = any> = VirtualListOptions<T> | T[]

/**
 * Element state storage
 */
interface VirtualListState {
	options: VirtualListOptions
	containerEl: HTMLElement | null
	contentEl: HTMLElement | null
	scrollHandler: ((event: Event) => void) | null
	resizeObserver: ResizeObserver | null
	startIndex: number
	endIndex: number
	visibleItems: any[]
}

/**
 * Get item height
 */
function getItemSize(options: VirtualListOptions, index: number): number {
	if (typeof options.itemSize === 'function') {
		return options.itemSize(index)
	}
	return options.itemSize || 50
}

/**
 * Calculate total height
 */
function calculateTotalHeight(options: VirtualListOptions): number {
	if (typeof options.itemSize === 'function') {
		let total = 0
		for (let i = 0; i < options.items.length; i++) {
			total += options.itemSize(i)
		}
		return total
	}
	return (options.itemSize || 50) * options.items.length
}

/**
 * Calculate visible range
 */
function calculateVisibleRange(
	scrollTop: number,
	containerHeight: number,
	options: VirtualListOptions,
): { startIndex: number, endIndex: number, offsetY: number } {
	const items = options.items
	const itemSize = options.itemSize || 50
	const overscan = options.overscan || 3

	let startIndex = 0,
		endIndex = 0,
		offsetY = 0

	if (typeof itemSize === 'function') {
		// Variable size items
		let currentOffset = 0
		for (let i = 0; i < items.length; i++) {
			const size = itemSize(i)
			if (currentOffset + size > scrollTop) {
				startIndex = i
				offsetY = currentOffset
				break
			}
			currentOffset += size
		}

		// Find end index
		endIndex = startIndex
		currentOffset = offsetY
		while (endIndex < items.length && currentOffset < scrollTop + containerHeight) {
			currentOffset += itemSize(endIndex)
			endIndex++
		}

		// Add overscan
		startIndex = Math.max(0, startIndex - overscan)
		endIndex = Math.min(items.length, endIndex + overscan)

		// Recalculate offset for overscan
		currentOffset = 0
		for (let i = 0; i < startIndex; i++) {
			currentOffset += itemSize(i)
		}
		offsetY = currentOffset

		return { startIndex, endIndex, offsetY }
	}

	// Fixed size items
	startIndex = Math.max(0, Math.floor(scrollTop / itemSize) - overscan)
	endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemSize) + overscan)
	offsetY = startIndex * itemSize

	return { startIndex, endIndex, offsetY }
}

/**
 * Normalize options
 */
function normalizeOptions<T>(binding: VirtualListBinding<T>): VirtualListOptions<T> {
	if (Array.isArray(binding)) {
		return {
			items: binding,
			itemSize: 50,
			height: 400,
			overscan: 3,
			keyField: 'id',
		}
	}

	return {
		items: binding.items,
		itemSize: binding.itemSize ?? 50,
		height: binding.height ?? 400,
		overscan: binding.overscan ?? 3,
		render: binding.render,
		keyField: binding.keyField ?? 'id',
		onScroll: binding.onScroll,
		onVisibleChange: binding.onVisibleChange,
	}
}

/**
 * Create item element
 */
function createItemElement(
	item: any,
	index: number,
	options: VirtualListOptions,
): HTMLElement {
	const el = document.createElement('div')
	el.className = 'v-virtual-list__item'
	el.dataset.index = String(index)

	// Get item key
	const keyField = options.keyField || 'id'
	if (typeof item === 'object' && item !== null && keyField in item) {
		el.dataset.key = String(item[keyField])
	}

	// Set height
	const height = getItemSize(options, index)
	el.style.height = `${height}px`
	el.style.boxSizing = 'border-box'

	// Render content
	if (options.render) {
		el.innerHTML = options.render(item, index)
	} else {
		el.textContent = typeof item === 'object' ? JSON.stringify(item) : String(item)
	}

	return el
}

/**
 * v-virtual-list directive
 *
 * Renders a large list efficiently using virtualization.
 *
 * @example
 * ```vue
 * <template>
 *   <div v-virtual-list="{ items: largeList, itemSize: 50 }"></div>
 *
 *   <div v-virtual-list="{
 *     items: largeList,
 *     itemSize: (index) => index % 10 === 0 ? 100 : 50,
 *     height: 600,
 *     overscan: 5,
 *     render: (item, index) => `<div class="item">${item.name}</div>`
 *   }"></div>
 * </template>
 * ```
 */
export const vVirtualList = defineDirective<VirtualListBinding, HTMLElement>({
	name: 'virtual-list',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		// Setup container
		el.classList.add('v-virtual-list')
		el.style.height = typeof options.height === 'number' ? `${options.height}px` : options.height as string
		el.style.overflow = 'auto'
		el.style.position = 'relative'

		// Create content wrapper
		const contentEl = document.createElement('div')
		contentEl.className = 'v-virtual-list__content'
		contentEl.style.position = 'relative'
		contentEl.style.height = `${calculateTotalHeight(options)}px`
		el.appendChild(contentEl)

		// Create visible items wrapper
		const visibleEl = document.createElement('div')
		visibleEl.className = 'v-virtual-list__visible'
		visibleEl.style.position = 'absolute'
		visibleEl.style.top = '0'
		visibleEl.style.left = '0'
		visibleEl.style.right = '0'
		contentEl.appendChild(visibleEl)

		const state: VirtualListState = {
			options,
			containerEl: el,
			contentEl,
			scrollHandler: null,
			resizeObserver: null,
			startIndex: 0,
			endIndex: 0,
			visibleItems: [],
		}

		;(el as any).__virtualList = state

		// Create scroll handler
		const scrollHandler = (_event: Event): void => {
			const scrollTop = el.scrollTop
			const containerHeight = el.clientHeight

			// Calculate visible range
			const { startIndex, endIndex, offsetY } = calculateVisibleRange(
				scrollTop,
				containerHeight,
				state.options,
			)

			// Check if range changed
			if (startIndex !== state.startIndex || endIndex !== state.endIndex) {
				state.startIndex = startIndex
				state.endIndex = endIndex

				// Render visible items
				renderVisibleItems(visibleEl, state, offsetY)

				// Callback
				if (state.options.onVisibleChange) {
					state.options.onVisibleChange(startIndex, endIndex)
				}
			}

			// Scroll callback
			if (state.options.onScroll) {
				state.options.onScroll(scrollTop)
			}
		}

		state.scrollHandler = scrollHandler
		el.addEventListener('scroll', scrollHandler, { passive: true })

		// Initial render
		const { startIndex, endIndex, offsetY } = calculateVisibleRange(0, el.clientHeight, options)
		state.startIndex = startIndex
		state.endIndex = endIndex
		renderVisibleItems(visibleEl, state, offsetY)

		// Setup resize observer
		if (typeof ResizeObserver !== 'undefined') {
			const resizeObserver = new ResizeObserver(() => {
				// Recalculate on resize
				scrollHandler(new Event('scroll'))
			})
			resizeObserver.observe(el)
			state.resizeObserver = resizeObserver
		}
	},

	updated(el, binding) {
		const state: VirtualListState = (el as any).__virtualList

		if (!state) return

		const newOptions = normalizeOptions(binding.value)
		state.options = newOptions

		// Update content height
		if (state.contentEl) {
			state.contentEl.style.height = `${calculateTotalHeight(newOptions)}px`
		}

		// Force re-render
		const scrollTop = el.scrollTop
		const containerHeight = el.clientHeight
		const { startIndex, endIndex, offsetY } = calculateVisibleRange(
			scrollTop,
			containerHeight,
			newOptions,
		)
		state.startIndex = startIndex
		state.endIndex = endIndex

		const visibleEl = state.contentEl?.querySelector('.v-virtual-list__visible') as HTMLElement
		if (visibleEl) {
			renderVisibleItems(visibleEl, state, offsetY)
		}
	},

	unmounted(el) {
		const state: VirtualListState | undefined = (el as any).__virtualList

		if (!state) return

		if (state.scrollHandler) {
			el.removeEventListener('scroll', state.scrollHandler)
		}

		if (state.resizeObserver) {
			state.resizeObserver.disconnect()
		}

		delete (el as any).__virtualList
	},
})

/**
 * Render visible items
 */
function renderVisibleItems(
	visibleEl: HTMLElement,
	state: VirtualListState,
	offsetY: number,
): void {
	const { options, startIndex, endIndex } = state

	// Set transform
	visibleEl.style.transform = `translateY(${offsetY}px)`

	// Clear existing items
	visibleEl.innerHTML = ''

	// Render items
	for (let i = startIndex; i < endIndex; i++) {
		const item = options.items[i]
		if (item !== undefined) {
			const itemEl = createItemElement(item, i, options)
			visibleEl.appendChild(itemEl)
		}
	}
}

export default vVirtualList
