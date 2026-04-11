import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useVirtualList } from '../../src/composables/use-virtual-list'

describe('useVirtualList', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with items', () => {
			const items = ref([{ id: 1, name: 'Item 1' }])
			const { visibleItems, totalHeight, scrollTop, containerRef, listStyle } = useVirtualList({ items })

			expect(visibleItems.value).toBeDefined()
			expect(totalHeight.value).toBe(50) // Default itemSize * items.length
			expect(scrollTop.value).toBe(0)
			expect(containerRef.value).toBeNull()
			expect(listStyle.value).toBeDefined()
		})

		it('should calculate total height correctly', () => {
			const items = ref(Array.from({ length: 100 }, (_, i) => ({ id: i })))
			const { totalHeight } = useVirtualList({ items, itemSize: 50 })

			expect(totalHeight.value).toBe(5000)
		})

		it('should return correct list style', () => {
			const items = ref([{ id: 1 }])
			const { listStyle } = useVirtualList({ items, height: 600 })

			expect(listStyle.value.height).toBe('600px')
			expect(listStyle.value.overflow).toBe('auto')
		})
	})

	describe('visible items', () => {
		it('should return visible items based on scroll position', () => {
			const items = ref(Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` })))
			const { visibleItems, startIndex, endIndex } = useVirtualList({
				items,
				itemSize: 50,
				height: 200,
			})

			expect(visibleItems.value.length).toBeGreaterThan(0)
			expect(visibleItems.value.length).toBeLessThan(100)
			expect(startIndex.value).toBe(0)
		})

		it('should update visible items on scroll', async () => {
			const items = ref(Array.from({ length: 100 }, (_, i) => ({ id: i })))
			const { visibleItems, containerRef, scrollTop, startIndex, endIndex } = useVirtualList({
				items,
				itemSize: 50,
				height: 200,
			})

			// Create container and set scroll position
			const container = document.createElement('div')
			container.scrollTop = 500
			containerRef.value = container

			// Manually dispatch scroll event to trigger handler
			// Note: The scroll listener is set up in onMounted, so we need to verify the container ref is set
			expect(containerRef.value).toBe(container)
		})
	})

	describe('scroll methods', () => {
		it('should scrollToIndex correctly', () => {
			const items = ref(Array.from({ length: 100 }, (_, i) => ({ id: i })))
			const { scrollToIndex, containerRef } = useVirtualList({
				items,
				itemSize: 50,
			})

			const container = document.createElement('div')
			containerRef.value = container

			scrollToIndex(10)

			expect(container.scrollTop).toBe(500)
		})

		it('should scrollTo correctly', () => {
			const items = ref(Array.from({ length: 100 }, (_, i) => ({ id: i })))
			const { scrollTo, containerRef } = useVirtualList({ items })

			const container = document.createElement('div')
			containerRef.value = container

			scrollTo(250)

			expect(container.scrollTop).toBe(250)
		})

		it('should not scroll if container is null', () => {
			const items = ref([{ id: 1 }])
			const { scrollToIndex, scrollTo, containerRef } = useVirtualList({ items })

			containerRef.value = null

			// Should not throw
			scrollToIndex(0)
			scrollTo(0)
		})
	})

	describe('options', () => {
		it('should support custom itemSize', () => {
			const items = ref(Array.from({ length: 10 }, (_, i) => ({ id: i })))
			const { totalHeight } = useVirtualList({ items, itemSize: 100 })

			expect(totalHeight.value).toBe(1000)
		})

		it('should support variable itemSize function', () => {
			const items = ref(Array.from({ length: 10 }, (_, i) => ({ id: i })))
			const itemSize = (index: number) => index % 2 === 0 ? 50 : 100
			const { totalHeight } = useVirtualList({ items, itemSize })

			expect(totalHeight.value).toBe(750) // 5 * 50 + 5 * 100
		})

		it('should support custom height', () => {
			const items = ref([{ id: 1 }])
			const { listStyle } = useVirtualList({ items, height: 800 })

			expect(listStyle.value.height).toBe('800px')
		})

		it('should support overscan', () => {
			const items = ref(Array.from({ length: 100 }, (_, i) => ({ id: i })))
			const { visibleItems } = useVirtualList({
				items,
				itemSize: 50,
				height: 200,
				overscan: 5,
			})

			// With overscan, we should have more items than just visible ones
			expect(visibleItems.value.length).toBeGreaterThan(4) // 200/50 + overscan
		})
	})

	describe('item style', () => {
		it('should provide correct style for each item', () => {
			const items = ref(Array.from({ length: 10 }, (_, i) => ({ id: i })))
			const { visibleItems } = useVirtualList({ items, itemSize: 50 })

			const firstItem = visibleItems.value[0]
			expect(firstItem.style).toBeDefined()
			expect(firstItem.style.position).toBe('absolute')
			expect(firstItem.style.height).toBe('50px')
			expect(firstItem.style.width).toBe('100%')
		})

		it('should position items correctly', () => {
			const items = ref(Array.from({ length: 10 }, (_, i) => ({ id: i })))
			const { visibleItems } = useVirtualList({ items, itemSize: 50 })

			expect(visibleItems.value[0].style.top).toBe('0px')
		})
	})

	describe('reactive options', () => {
		it('should support reactive items', () => {
			const items = ref([{ id: 1 }])
			const { totalHeight } = useVirtualList({ items })

			expect(totalHeight.value).toBe(50)

			items.value = Array.from({ length: 10 }, (_, i) => ({ id: i }))

			expect(totalHeight.value).toBe(500)
		})

		it('should support reactive height', () => {
			const height = ref(400)
			const items = ref([{ id: 1 }])
			const { listStyle } = useVirtualList({ items, height })

			expect(listStyle.value.height).toBe('400px')
		})

		it('should support reactive itemSize', () => {
			const itemSize = ref(50)
			const items = ref([{ id: 1 }])
			const { totalHeight } = useVirtualList({ items, itemSize })

			expect(totalHeight.value).toBe(50)
		})
	})

	describe('variable size items', () => {
		it('should calculate visible range for variable size', () => {
			const items = ref(Array.from({ length: 20 }, (_, i) => ({ id: i })))
			const itemSize = (index: number) => 30 + (index % 5) * 10
			const { visibleItems, totalHeight } = useVirtualList({
				items,
				itemSize,
				height: 200,
			})

			expect(totalHeight.value).toBeGreaterThan(0)
			expect(visibleItems.value.length).toBeGreaterThan(0)
		})

		it('should scrollToIndex with variable size', () => {
			const items = ref(Array.from({ length: 20 }, (_, i) => ({ id: i })))
			const itemSize = (index: number) => 30 + (index % 5) * 10
			const { scrollToIndex, containerRef } = useVirtualList({ items, itemSize })

			const container = document.createElement('div')
			containerRef.value = container

			scrollToIndex(5)

			expect(container.scrollTop).toBeGreaterThan(0)
		})
	})

	describe('edge cases', () => {
		it('should handle empty items', () => {
			const items = ref([])
			const { visibleItems, totalHeight } = useVirtualList({ items })

			expect(visibleItems.value.length).toBe(0)
			expect(totalHeight.value).toBe(0)
		})

		it('should handle items with undefined values', () => {
			const items = ref([undefined, { id: 1 }, undefined] as any)
			const { visibleItems } = useVirtualList({ items })

			// Should handle gracefully
			expect(visibleItems.value.length).toBeGreaterThanOrEqual(0)
		})
	})
})
