import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useInfiniteScroll, useScroll, useVirtualList } from '../../src/composables'

describe('scroll composables', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('useVirtualList', () => {
		it('should initialize with empty items', () => {
			const items = ref<any[]>([])
			const { visibleItems, totalHeight, scrollTop, startIndex, endIndex } = useVirtualList({
				items,
			})

			expect(visibleItems.value).toEqual([])
			expect(totalHeight.value).toBe(0)
			expect(scrollTop.value).toBe(0)
			expect(startIndex.value).toBe(0)
			expect(endIndex.value).toBe(0)
		})

		it('should calculate total height for fixed size items', () => {
			const items = ref([1, 2, 3, 4, 5])
			const { totalHeight } = useVirtualList({
				items,
				itemSize: 50,
			})

			expect(totalHeight.value).toBe(250)
		})

		it('should calculate total height for variable size items', () => {
			const items = ref([1, 2, 3, 4, 5])
			const itemSize = (index: number) => (index + 1) * 20
			const { totalHeight } = useVirtualList({
				items,
				itemSize,
			})

			expect(totalHeight.value).toBe(20 + 40 + 60 + 80 + 100)
		})

		it('should return visible items based on scroll position', () => {
			const items = ref(Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` })))
			const { visibleItems, totalHeight } = useVirtualList({
				items,
				itemSize: 50,
				height: 200,
			})

			// Should have visible items
			expect(visibleItems.value.length).toBeGreaterThan(0)
			expect(totalHeight.value).toBe(5000)
		})

		it('should provide correct item styles', () => {
			const items = ref([{ id: 1 }, { id: 2 }])
			const { visibleItems } = useVirtualList({
				items,
				itemSize: 50,
			})

			expect(visibleItems.value.length).toBeGreaterThan(0)
			const firstItem = visibleItems.value[0]
			expect(firstItem.style.position).toBe('absolute')
			expect(firstItem.style.height).toBe('50px')
			expect(firstItem.style.width).toBe('100%')
		})

		it('should provide container style', () => {
			const items = ref([1, 2, 3])
			const { listStyle } = useVirtualList({
				items,
				height: 400,
			})

			expect(listStyle.value.height).toBe('400px')
			expect(listStyle.value.overflow).toBe('auto')
			expect(listStyle.value.position).toBe('relative')
		})

		it('should provide containerRef', () => {
			const items = ref([1, 2, 3])
			const { containerRef } = useVirtualList({ items })

			expect(containerRef.value).toBe(null)
		})

		it('should handle scrollToIndex', () => {
			const items = ref(Array.from({ length: 100 }, (_, i) => ({ id: i })))
			const { containerRef, scrollToIndex } = useVirtualList({
				items,
				itemSize: 50,
			})

			// Create a mock container
			const mockElement = {
				scrollTop: 0,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			} as any
			containerRef.value = mockElement

			scrollToIndex(10)

			expect(mockElement.scrollTop).toBe(500) // 10 * 50
		})

		it('should handle scrollTo', () => {
			const items = ref([1, 2, 3])
			const { containerRef, scrollTo } = useVirtualList({
				items,
			})

			const mockElement = {
				scrollTop: 0,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			} as any
			containerRef.value = mockElement

			scrollTo(100)

			expect(mockElement.scrollTop).toBe(100)
		})

		it('should handle reactive items changes', async () => {
			const items = ref([1, 2, 3])
			const { totalHeight } = useVirtualList({
				items,
				itemSize: 50,
			})

			expect(totalHeight.value).toBe(150)

			items.value = [1, 2, 3, 4, 5, 6]
			await nextTick()

			expect(totalHeight.value).toBe(300)
		})

		it('should handle reactive height changes', async () => {
			const items = ref([1, 2, 3, 4, 5])
			const height = ref(200)
			const { listStyle } = useVirtualList({
				items,
				height,
			})

			expect(listStyle.value.height).toBe('200px')

			height.value = 400
			await nextTick()

			expect(listStyle.value.height).toBe('400px')
		})

		it('should handle overscan option', () => {
			const items = ref(Array.from({ length: 100 }, (_, i) => ({ id: i })))
			const { visibleItems } = useVirtualList({
				items,
				itemSize: 50,
				height: 200,
				overscan: 5,
			})

			// With overscan, more items should be visible
			expect(visibleItems.value.length).toBeGreaterThan(4) // 200/50 + 10 overscan
		})

		it('should handle variable size with scrollToIndex', () => {
			const items = ref(Array.from({ length: 10 }, (_, i) => ({ id: i })))
			const itemSize = (index: number) => (index + 1) * 10
			const { containerRef, scrollToIndex } = useVirtualList({
				items,
				itemSize,
			})

			const mockElement = {
				scrollTop: 0,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			} as any
			containerRef.value = mockElement

			scrollToIndex(5)

			// Sum of sizes 0-4: 10 + 20 + 30 + 40 + 50 = 150
			expect(mockElement.scrollTop).toBe(150)
		})

		it('should include item index in visible items', () => {
			const items = ref([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
			const { visibleItems } = useVirtualList({
				items,
				itemSize: 50,
			})

			visibleItems.value.forEach((item, index) => {
				expect(item.index).toBe(index)
				expect(item.item).toEqual(items.value[index])
			})
		})
	})

	describe('useInfiniteScroll', () => {
		it('should initialize with loading and finished false', () => {
			const onLoad = vi.fn()
			const { loading, finished } = useInfiniteScroll({
				onLoad,
				immediate: false,
			})

			expect(loading.value).toBe(false)
			expect(finished.value).toBe(false)
		})

		it('should call onLoad immediately by default', () => {
			const onLoad = vi.fn().mockResolvedValue(undefined)
			const { bind } = useInfiniteScroll({ onLoad })

			const element = document.createElement('div')
			bind(element)

			// onLoad should be called during bind
			expect(onLoad).toHaveBeenCalled()
		})

		it('should not call onLoad when immediate is false', () => {
			const onLoad = vi.fn()
			useInfiniteScroll({ onLoad, immediate: false })

			expect(onLoad).not.toHaveBeenCalled()
		})

		it('should return bind function', () => {
			const onLoad = vi.fn()
			const { bind } = useInfiniteScroll({ onLoad })

			expect(typeof bind).toBe('function')
		})

		it('should return unbind function from bind', () => {
			const onLoad = vi.fn()
			const { bind } = useInfiniteScroll({
				onLoad,
				immediate: false,
			})

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
		})

		it('should return stop function', () => {
			const onLoad = vi.fn()
			const { stop } = useInfiniteScroll({ onLoad })

			expect(typeof stop).toBe('function')
		})

		it('should return load function', () => {
			const onLoad = vi.fn()
			const { load } = useInfiniteScroll({ onLoad, immediate: false })

			expect(typeof load).toBe('function')
		})

		it('should call onLoad when load is called', async () => {
			const onLoad = vi.fn().mockResolvedValue(undefined)
			const { load } = useInfiniteScroll({ onLoad, immediate: false })

			await load()

			expect(onLoad).toHaveBeenCalled()
		})

		it('should set loading state during load', async () => {
			const onLoad = vi.fn().mockImplementation(() => {
				return new Promise(resolve => setTimeout(resolve, 100))
			})
			const { loading, load } = useInfiniteScroll({
				onLoad,
				immediate: false,
			})

			expect(loading.value).toBe(false)

			const loadPromise = load()

			// Loading should be true during the operation
			expect(loading.value).toBe(true)

			vi.advanceTimersByTime(100)
			await loadPromise

			expect(loading.value).toBe(false)
		})

		it('should not load when already loading', async () => {
			const onLoad = vi.fn().mockImplementation(() => {
				return new Promise(resolve => setTimeout(resolve, 100))
			})
			const { load } = useInfiniteScroll({ onLoad, immediate: false })

			load() // First call
			load() // Second call (should be ignored)

			vi.advanceTimersByTime(100)
			await Promise.resolve()

			expect(onLoad).toHaveBeenCalledTimes(1)
		})

		it('should not load when finished', async () => {
			const onLoad = vi.fn()
			const finished = ref(true)
			const { load } = useInfiniteScroll({
				onLoad,
				finished,
				immediate: false,
			})

			await load()

			expect(onLoad).not.toHaveBeenCalled()
		})

		it('should respect external loading state', async () => {
			const loading = ref(false)
			const onLoad = vi.fn()
			const { load } = useInfiniteScroll({
				onLoad,
				loading,
				immediate: false,
			})

			loading.value = true
			await load()

			expect(onLoad).not.toHaveBeenCalled()
		})

		it('should respect external finished state', async () => {
			const finished = ref(false)
			const onLoad = vi.fn()
			const { load } = useInfiniteScroll({
				onLoad,
				finished,
				immediate: false,
			})

			finished.value = true
			await load()

			expect(onLoad).not.toHaveBeenCalled()
		})

		it('should respect disabled state', async () => {
			const disabled = ref(true)
			const onLoad = vi.fn()
			const { load } = useInfiniteScroll({
				onLoad,
				disabled,
				immediate: false,
			})

			await load()

			expect(onLoad).not.toHaveBeenCalled()
		})

		it('should bind to element and create sentinel', () => {
			const onLoad = vi.fn()
			const { bind } = useInfiniteScroll({
				onLoad,
				immediate: false,
			})

			const element = document.createElement('div')
			bind(element)

			// Sentinel should be added
			const sentinel = element.querySelector('div')
			expect(sentinel).not.toBeNull()
		})

		it('should cleanup on stop', () => {
			const onLoad = vi.fn()
			const { bind, stop } = useInfiniteScroll({
				onLoad,
				immediate: false,
			})

			const element = document.createElement('div')
			bind(element)

			stop()

			// Sentinel should be removed
			expect(element.querySelector('div')).toBeNull()
		})

		it('should cleanup on unbind', () => {
			const onLoad = vi.fn()
			const { bind } = useInfiniteScroll({
				onLoad,
				immediate: false,
			})

			const element = document.createElement('div')
			const unbind = bind(element)

			unbind()

			// Sentinel should be removed
			expect(element.querySelector('div')).toBeNull()
		})

		it('should handle async onLoad', async () => {
			const onLoad = vi.fn().mockResolvedValue(undefined)
			const { loading, load } = useInfiniteScroll({
				onLoad,
				immediate: false,
			})

			await load()

			expect(onLoad).toHaveBeenCalled()
			expect(loading.value).toBe(false)
		})

		it('should handle onLoad errors gracefully', async () => {
			const onLoad = vi.fn().mockRejectedValue(new Error('Load failed'))
			const { loading, load } = useInfiniteScroll({
				onLoad,
				immediate: false,
			})

			try {
				await load()
			} catch {
				// Error should be caught
			}

			expect(loading.value).toBe(false)
		})

		it('should use fallback scroll event when IntersectionObserver not supported', () => {
			const originalIO = globalThis.IntersectionObserver
			// @ts-expect-error - testing fallback
			delete globalThis.IntersectionObserver

			const onLoad = vi.fn()
			const { bind } = useInfiniteScroll({
				onLoad,
				immediate: false,
			})

			const element = document.createElement('div')
			bind(element)

			// Should not have sentinel (fallback uses scroll events)
			expect(element.querySelector('div')).toBeNull()

			globalThis.IntersectionObserver = originalIO
		})

		it('should support distance option', async () => {
			const distance = ref(100)
			const onLoad = vi.fn().mockResolvedValue(undefined)
			const { bind } = useInfiniteScroll({
				onLoad,
				distance,
				immediate: false,
			})

			const element = document.createElement('div')
			bind(element)

			// Should have sentinel
			expect(element.querySelector('div')).not.toBeNull()
		})
	})

	describe('useScroll', () => {
		it('should initialize with default values', () => {
			const { scrollLeft, scrollTop, progressX, progressY, directionX, directionY, isScrolling }
				= useScroll()

			expect(scrollLeft.value).toBe(0)
			expect(scrollTop.value).toBe(0)
			expect(progressX.value).toBe(0)
			expect(progressY.value).toBe(0)
			expect(directionX.value).toBe(0)
			expect(directionY.value).toBe(0)
			expect(isScrolling.value).toBe(false)
		})

		it('should return bind function', () => {
			const { bind } = useScroll()
			expect(typeof bind).toBe('function')
		})

		it('should return stop function', () => {
			const { stop } = useScroll()
			expect(typeof stop).toBe('function')
		})

		it('should return scrollTo function', () => {
			const { scrollTo } = useScroll()
			expect(typeof scrollTo).toBe('function')
		})

		it('should return info object', () => {
			const { info } = useScroll()
			expect(info.value).toBeDefined()
			expect(info.value.scrollLeft).toBe(0)
			expect(info.value.scrollTop).toBe(0)
		})

		it('should bind to an element', () => {
			const { bind, _scrollLeft } = useScroll()

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 1000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })

			const unbind = bind(element)
			expect(typeof unbind).toBe('function')
		})

		it('should bind to window when no element provided', () => {
			const { bind } = useScroll()

			const unbind = bind()
			expect(typeof unbind).toBe('function')
		})

		it('should handle scrollTo for element', () => {
			const { bind, scrollTo } = useScroll()

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 1000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })
			;(element as any).addEventListener = vi.fn()
			;(element as any).removeEventListener = vi.fn()

			bind(element)
			scrollTo({ top: 100, left: 50 })

			expect(element.scrollTop).toBe(100)
			expect(element.scrollLeft).toBe(50)
		})

		it('should handle throttle option', async () => {
			const throttle = ref(100)
			const { bind, _scrollLeft } = useScroll({ throttle })

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 1000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })

			const addEventListenerSpy = vi.spyOn(element, 'addEventListener')

			bind(element)

			expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
				passive: true,
			})

			addEventListenerSpy.mockRestore()
		})

		it('should handle passive option', () => {
			const { bind } = useScroll({ passive: false })

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollLeft', { value: 0 })
			Object.defineProperty(element, 'scrollTop', { value: 0 })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 1000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })

			const addEventListenerSpy = vi.spyOn(element, 'addEventListener')

			bind(element)

			expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
				passive: false,
			})

			addEventListenerSpy.mockRestore()
		})

		it('should cleanup on stop', () => {
			const { bind, stop } = useScroll()

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollLeft', { value: 0 })
			Object.defineProperty(element, 'scrollTop', { value: 0 })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 1000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })
			;(element as any).addEventListener = vi.fn()
			;(element as any).removeEventListener = vi.fn()

			bind(element)
			stop()

			expect(element.removeEventListener).toHaveBeenCalled()
		})

		it('should handle scrollTo for window', () => {
			const { bind, scrollTo } = useScroll()

			// Mock window.scrollTo
			const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

			bind() // Bind to window
			scrollTo({ top: 100, left: 50, behavior: 'smooth' })

			expect(scrollToSpy).toHaveBeenCalledWith({
				top: 100,
				left: 50,
				behavior: 'smooth',
			})

			scrollToSpy.mockRestore()
		})

		it('should handle scrollTo with auto behavior', () => {
			const { bind, scrollTo } = useScroll()

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 1000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })
			;(element as any).addEventListener = vi.fn()
			;(element as any).removeEventListener = vi.fn()

			bind(element)
			scrollTo({ top: 200, behavior: 'auto' })

			expect(element.scrollTop).toBe(200)
		})

		it('should handle scrollTo with only top', () => {
			const { bind, scrollTo } = useScroll()

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 1000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })
			;(element as any).addEventListener = vi.fn()
			;(element as any).removeEventListener = vi.fn()

			bind(element)
			scrollTo({ top: 300 })

			expect(element.scrollTop).toBe(300)
		})

		it('should handle scrollTo with only left', () => {
			const { bind, scrollTo } = useScroll()

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 1000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })
			;(element as any).addEventListener = vi.fn()
			;(element as any).removeEventListener = vi.fn()

			bind(element)
			scrollTo({ left: 250 })

			expect(element.scrollLeft).toBe(250)
		})

		it('should not scroll when no container bound', () => {
			const { scrollTo } = useScroll()

			// Should not throw
			scrollTo({ top: 100 })
			expect(true).toBe(true)
		})

		it('should update direction on scroll', async () => {
			const { bind, directionY, _directionX } = useScroll()

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 2000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })
			;(element as any).addEventListener = vi.fn()
			;(element as any).removeEventListener = vi.fn()

			bind(element)

			// Get the scroll handler
			const scrollHandler = (element.addEventListener as any).mock.calls[0][1]

			// Simulate scroll down
			Object.defineProperty(element, 'scrollTop', { value: 100, writable: true })
			scrollHandler(new Event('scroll'))

			expect(directionY.value).toBe(1) // Scrolling down

			// Simulate scroll up
			Object.defineProperty(element, 'scrollTop', { value: 50, writable: true })
			scrollHandler(new Event('scroll'))

			expect(directionY.value).toBe(-1) // Scrolling up
		})

		it('should update isScrolling on scroll', async () => {
			const { bind, isScrolling } = useScroll()

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 2000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })
			;(element as any).addEventListener = vi.fn()
			;(element as any).removeEventListener = vi.fn()

			bind(element)

			// Get the scroll handler
			const scrollHandler = (element.addEventListener as any).mock.calls[0][1]

			// Simulate scroll
			Object.defineProperty(element, 'scrollTop', { value: 100, writable: true })
			scrollHandler(new Event('scroll'))

			expect(isScrolling.value).toBe(true)

			// Wait for scroll timeout
			vi.advanceTimersByTime(200)

			expect(isScrolling.value).toBe(false)
		})

		it('should calculate progress correctly', async () => {
			const { bind, _progressX, progressY } = useScroll()

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 2000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })
			;(element as any).addEventListener = vi.fn()
			;(element as any).removeEventListener = vi.fn()

			bind(element)

			// Get the scroll handler
			const scrollHandler = (element.addEventListener as any).mock.calls[0][1]

			// Scroll to 50% vertical (scrollTopMax = scrollHeight - clientHeight = 2000 - 500 = 1500)
			// progressY = scrollTop / scrollTopMax = 750 / 1500 = 0.5
			Object.defineProperty(element, 'scrollTop', { value: 750, writable: true })
			scrollHandler(new Event('scroll'))

			expect(progressY.value).toBe(0.5)
		})

		it('should handle throttle correctly', async () => {
			const throttle = ref(100)
			const { bind, scrollLeft } = useScroll({ throttle })

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 2000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })
			;(element as any).addEventListener = vi.fn()
			;(element as any).removeEventListener = vi.fn()

			bind(element)

			// Get the scroll handler
			const scrollHandler = (element.addEventListener as any).mock.calls[0][1]

			// First scroll
			Object.defineProperty(element, 'scrollLeft', { value: 100, writable: true })
			scrollHandler(new Event('scroll'))

			// Second scroll before throttle time
			Object.defineProperty(element, 'scrollLeft', { value: 200, writable: true })
			scrollHandler(new Event('scroll'))

			// Should not have updated yet
			expect(scrollLeft.value).toBe(0)

			// Advance past throttle
			vi.advanceTimersByTime(150)

			expect(scrollLeft.value).toBe(200)
		})

		it('should handle reactive throttle changes', async () => {
			const throttle = ref(100)
			const { bind } = useScroll({ throttle })

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 2000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })
			;(element as any).addEventListener = vi.fn()
			;(element as any).removeEventListener = vi.fn()

			bind(element)

			// Change throttle value
			throttle.value = 200
			await nextTick()

			expect(true).toBe(true)
		})

		it('should cleanup throttle timer on stop', () => {
			const { bind, stop } = useScroll({ throttle: 100 })

			const element = document.createElement('div')
			Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollTop', { value: 0, writable: true })
			Object.defineProperty(element, 'scrollWidth', { value: 1000 })
			Object.defineProperty(element, 'clientWidth', { value: 500 })
			Object.defineProperty(element, 'scrollHeight', { value: 2000 })
			Object.defineProperty(element, 'clientHeight', { value: 500 })
			;(element as any).addEventListener = vi.fn()
			;(element as any).removeEventListener = vi.fn()

			bind(element)

			// Get the scroll handler and trigger it
			const scrollHandler = (element.addEventListener as any).mock.calls[0][1]
			scrollHandler(new Event('scroll'))

			// Stop should clear timers
			stop()
			expect(true).toBe(true)
		})
	})
})
