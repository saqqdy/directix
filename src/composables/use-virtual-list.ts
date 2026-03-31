import { computed, onMounted, onUnmounted, ref, type Ref, unref } from 'vue'

/**
 * Virtual list item size function
 */
export type ItemSizeFunction = (index: number) => number

/**
 * Options for useVirtualList composable
 */
export interface UseVirtualListOptions<T = any> {
	/**
	 * Array of items to render
	 * @required
	 */
	items: Ref<T[]> | T[]

	/**
	 * Height of each item (in pixels)
	 * Can be a fixed number or a function
	 * @default 50
	 */
	itemSize?: number | ItemSizeFunction | Ref<number | ItemSizeFunction>

	/**
	 * Height of the container (in pixels)
	 * @default 400
	 */
	height?: number | Ref<number>

	/**
	 * Number of extra items to render above/below visible area
	 * @default 3
	 */
	overscan?: number | Ref<number>

	/**
	 * Key field name for items
	 * @default 'id'
	 */
	keyField?: string
}

/**
 * Virtual list item info
 */
export interface VirtualListItem<T = any> {
	/**
	 * The item data
	 */
	item: T

	/**
	 * Index in the original list
	 */
	index: number

	/**
	 * Computed style for positioning
	 */
	style: {
		position: string
		top: string
		height: string
		width: string
	}
}

/**
 * Return type for useVirtualList composable
 */
export interface UseVirtualListReturn<T = any> {
	/**
	 * Currently visible items
	 */
	visibleItems: Ref<VirtualListItem<T>[]>

	/**
	 * Total height of the list
	 */
	totalHeight: Ref<number>

	/**
	 * Current scroll position
	 */
	scrollTop: Ref<number>

	/**
	 * Start index of visible items
	 */
	startIndex: Ref<number>

	/**
	 * End index of visible items
	 */
	endIndex: Ref<number>

	/**
	 * Scroll to a specific index
	 */
	scrollToIndex: (index: number) => void

	/**
	 * Scroll to a specific position
	 */
	scrollTo: (scrollTop: number) => void

	/**
	 * Container ref to bind to the scroll container
	 */
	containerRef: Ref<HTMLElement | null>

	/**
	 * List style for the wrapper element
	 */
	listStyle: Ref<{ height: string, overflow: string, position: string }>
}

/**
 * Composable for virtual list rendering
 *
 * @param options - Configuration options
 * @returns Virtual list utilities and state
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useVirtualList } from 'directix'
 *
 * const items = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` })))
 *
 * const {
 *   visibleItems,
 *   totalHeight,
 *   containerRef,
 *   listStyle,
 *   scrollToIndex
 * } = useVirtualList({
 *   items,
 *   itemSize: 50,
 *   height: 600
 * })
 * </script>
 *
 * <template>
 *   <div ref="containerRef" :style="listStyle">
 *     <div :style="{ height: totalHeight + 'px', position: 'relative' }">
 *       <div
 *         v-for="{ item, index, style } in visibleItems"
 *         :key="item.id"
 *         :style="style"
 *       >
 *         {{ item.name }}
 *       </div>
 *     </div>
 *   </div>
 * </template>
 * ```
 */
export function useVirtualList<T = any>(
	options: UseVirtualListOptions<T>,
): UseVirtualListReturn<T> {
	const {
		items,
		itemSize = 50,
		height = 400,
		overscan = 3,
		keyField: _keyField = 'id',
	} = options

	// State
	const containerRef = ref<HTMLElement | null>(null)
	const scrollTop = ref(0)
	const startIndex = ref(0)
	const endIndex = ref(0)

	// Getters
	const getItems = (): T[] => unref(items)
	const getItemSizeValue = (): number | ItemSizeFunction => unref(itemSize)
	const getHeight = (): number => unref(height)
	const getOverscan = (): number => unref(overscan)

	/**
	 * Calculate total height of all items
	 */
	const totalHeight = computed(() => {
		const itemsList = getItems()
		const size = getItemSizeValue()

		if (typeof size === 'function') {
			let total = 0
			for (let i = 0; i < itemsList.length; i++) {
				total += size(i)
			}
			return total
		}

		return size * itemsList.length
	})

	/**
	 * Calculate visible range based on scroll position
	 */
	function calculateVisibleRange(): { start: number, end: number, offsetY: number } {
		const itemsList = getItems()
		const size = getItemSizeValue()
		const containerHeight = getHeight()
		const overscanValue = getOverscan()
		const currentScrollTop = scrollTop.value

		let start = 0,
			end = 0,
			offsetY = 0

		if (typeof size === 'function') {
			// Variable size items
			let currentOffset = 0
			for (let i = 0; i < itemsList.length; i++) {
				const itemHeight = size(i)
				if (currentOffset + itemHeight > currentScrollTop) {
					start = i
					offsetY = currentOffset
					break
				}
				currentOffset += itemHeight
			}

			// Find end index
			end = start
			currentOffset = offsetY
			while (end < itemsList.length && currentOffset < currentScrollTop + containerHeight) {
				currentOffset += size(end)
				end++
			}

			// Add overscan
			start = Math.max(0, start - overscanValue)
			end = Math.min(itemsList.length, end + overscanValue)

			// Recalculate offset for overscan
			currentOffset = 0
			for (let i = 0; i < start; i++) {
				currentOffset += size(i)
			}
			offsetY = currentOffset
		} else {
			// Fixed size items
			start = Math.max(0, Math.floor(currentScrollTop / size) - overscanValue)
			end = Math.min(itemsList.length, Math.ceil((currentScrollTop + containerHeight) / size) + overscanValue)
			offsetY = start * size
		}

		return { start, end, offsetY }
	}

	/**
	 * Get visible items with positioning
	 */
	const visibleItems = computed(() => {
		const itemsList = getItems()
		const size = getItemSizeValue()
		const { start, end, offsetY } = calculateVisibleRange()

		startIndex.value = start
		endIndex.value = end

		const result: VirtualListItem<T>[] = []

		let currentOffset = offsetY
		for (let i = start; i < end; i++) {
			const item = itemsList[i]
			if (item !== undefined) {
				const itemHeight = typeof size === 'function' ? size(i) : size

				result.push({
					item,
					index: i,
					style: {
						position: 'absolute',
						top: `${currentOffset}px`,
						height: `${itemHeight}px`,
						width: '100%',
					},
				})

				currentOffset += itemHeight
			}
		}

		return result
	})

	/**
	 * Container style
	 */
	const listStyle = computed(() => ({
		height: `${getHeight()}px`,
		overflow: 'auto' as const,
		position: 'relative' as const,
	}))

	/**
	 * Handle scroll event
	 */
	function handleScroll(event: Event): void {
		const target = event.target as HTMLElement
		scrollTop.value = target.scrollTop
	}

	/**
	 * Scroll to a specific index
	 */
	function scrollToIndex(index: number): void {
		if (!containerRef.value) return

		const size = getItemSizeValue()
		const itemsList = getItems()

		if (typeof size === 'function') {
			// Calculate offset for variable size
			let offset = 0
			for (let i = 0; i < Math.min(index, itemsList.length); i++) {
				offset += size(i)
			}
			containerRef.value.scrollTop = offset
		} else {
			containerRef.value.scrollTop = index * size
		}
	}

	/**
	 * Scroll to a specific position
	 */
	function scrollTo(position: number): void {
		if (!containerRef.value) return
		containerRef.value.scrollTop = position
	}

	// Setup scroll listener
	onMounted(() => {
		if (containerRef.value) {
			containerRef.value.addEventListener('scroll', handleScroll, { passive: true })
		}
	})

	// Cleanup
	onUnmounted(() => {
		if (containerRef.value) {
			containerRef.value.removeEventListener('scroll', handleScroll)
		}
	})

	return {
		visibleItems,
		totalHeight,
		scrollTop,
		startIndex,
		endIndex,
		scrollToIndex,
		scrollTo,
		containerRef,
		listStyle,
	}
}
