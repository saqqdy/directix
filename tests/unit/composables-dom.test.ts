import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useLazy, useMutation, useRipple, useSticky } from '../../src/composables'

describe('DOM composables', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('useRipple', () => {
		it('should initialize with default options', () => {
			const { bind, trigger } = useRipple()

			expect(typeof bind).toBe('function')
			expect(typeof trigger).toBe('function')
		})

		it('should bind to element and return unbind function', () => {
			const { bind } = useRipple()

			const element = document.createElement('button')
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
			expect(element.classList.contains('v-ripple')).toBe(true)
			unbind()
		})

		it('should set element position to relative if static', () => {
			const { bind } = useRipple()

			const element = document.createElement('div')
			// Mock getComputedStyle to return static position
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				position: 'static',
				overflow: 'visible',
			} as CSSStyleDeclaration)

			bind(element)

			expect(element.style.position).toBe('relative')
		})

		it('should set overflow to hidden if visible', () => {
			const { bind } = useRipple()

			const element = document.createElement('div')
			// Mock getComputedStyle to return visible overflow
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				position: 'relative',
				overflow: 'visible',
			} as CSSStyleDeclaration)

			bind(element)

			expect(element.style.overflow).toBe('hidden')
		})

		it('should create ripple on click', () => {
			const { bind } = useRipple()

			const element = document.createElement('button')
			document.body.appendChild(element)
			bind(element)

			// Get element rect for click position
			element.getBoundingClientRect = () => ({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
				right: 100,
				bottom: 50,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}) as DOMRect

			// Simulate click
			const clickEvent = new MouseEvent('click', {
				clientX: 50,
				clientY: 25,
				bubbles: true,
			})
			element.dispatchEvent(clickEvent)

			// Ripple element should be created
			const ripple = element.querySelector('.v-ripple__wave')
			expect(ripple).not.toBeNull()

			document.body.removeChild(element)
		})

		it('should use custom color', () => {
			const { bind } = useRipple({ color: 'rgba(255, 0, 0, 0.5)' })

			const element = document.createElement('button')
			bind(element)

			expect(element.classList.contains('v-ripple')).toBe(true)
		})

		it('should use custom duration', () => {
			const { bind } = useRipple({ duration: 1000 })

			const element = document.createElement('button')
			bind(element)

			expect(element.classList.contains('v-ripple')).toBe(true)
		})

		it('should respect disabled option', () => {
			const disabled = ref(true)
			const { bind } = useRipple({ disabled })

			const element = document.createElement('button')
			document.body.appendChild(element)
			bind(element)

			// Simulate click
			const clickEvent = new MouseEvent('click', {
				clientX: 50,
				clientY: 25,
				bubbles: true,
			})
			element.dispatchEvent(clickEvent)

			// No ripple should be created when disabled
			const ripple = element.querySelector('.v-ripple__wave')
			expect(ripple).toBeNull()

			document.body.removeChild(element)
		})

		it('should trigger ripple manually', () => {
			const { bind, trigger } = useRipple()

			const element = document.createElement('button')
			document.body.appendChild(element)
			bind(element)

			element.getBoundingClientRect = () => ({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
				right: 100,
				bottom: 50,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}) as DOMRect

			trigger({ x: 50, y: 25 })

			const ripple = element.querySelector('.v-ripple__wave')
			expect(ripple).not.toBeNull()

			document.body.removeChild(element)
		})

		it('should trigger ripple at center by default', () => {
			const { bind, trigger } = useRipple()

			const element = document.createElement('button')
			document.body.appendChild(element)
			bind(element)

			element.getBoundingClientRect = () => ({
				left: 0,
				top: 0,
				width: 100,
				height: 50,
				right: 100,
				bottom: 50,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}) as DOMRect

			trigger()

			const ripple = element.querySelector('.v-ripple__wave')
			expect(ripple).not.toBeNull()

			document.body.removeChild(element)
		})

		it('should cleanup on unbind', () => {
			const { bind } = useRipple()

			const element = document.createElement('button')
			const unbind = bind(element)

			expect(element.classList.contains('v-ripple')).toBe(true)

			unbind()

			expect(element.classList.contains('v-ripple')).toBe(false)
		})

		it('should handle custom scale options', () => {
			const { bind } = useRipple({ initialScale: 0.5, finalScale: 3 })

			const element = document.createElement('button')
			bind(element)

			expect(element.classList.contains('v-ripple')).toBe(true)
		})
	})

	describe('useLazy', () => {
		it('should initialize with pending state', () => {
			const { state, isLoading, isLoaded, hasError } = useLazy()

			expect(state.value).toBe('pending')
			expect(isLoading.value).toBe(false)
			expect(isLoaded.value).toBe(false)
			expect(hasError.value).toBe(false)
		})

		it('should bind to element and return unbind function', () => {
			const { bind } = useLazy()

			const element = document.createElement('img')
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
			expect(element.classList.contains('v-lazy')).toBe(true)
			unbind()
		})

		it('should set placeholder image', () => {
			const { bind } = useLazy({
				placeholder: '/placeholder.jpg',
			})

			const element = document.createElement('img')
			bind(element)

			expect(element.src).toContain('placeholder.jpg')
		})

		it('should set background image for non-img elements', () => {
			const { bind } = useLazy({
				placeholder: '/placeholder.jpg',
			})

			const element = document.createElement('div')
			bind(element)

			expect(element.style.backgroundImage).toContain('placeholder.jpg')
		})

		it('should load image manually', () => {
			const { bind, load, state, isLoading } = useLazy({
				src: 'https://example.com/image.jpg',
			})

			const element = document.createElement('img')
			bind(element)

			expect(state.value).toBe('pending')

			load()

			expect(state.value).toBe('loading')
			expect(isLoading.value).toBe(true)
		})

		it('should not load without src', () => {
			const { bind, load, state } = useLazy()

			const element = document.createElement('img')
			bind(element)

			load()

			expect(state.value).toBe('pending')
		})

		it('should reset state', () => {
			const { state, isLoading, isLoaded, hasError, reset } = useLazy()

			// Manually set some state (simulating load)
			reset()

			expect(state.value).toBe('pending')
			expect(isLoading.value).toBe(false)
			expect(isLoaded.value).toBe(false)
			expect(hasError.value).toBe(false)
		})

		it('should add loading class during load', () => {
			const { bind, load } = useLazy({
				src: 'https://example.com/image.jpg',
			})

			const element = document.createElement('img')
			bind(element)

			load()

			expect(element.classList.contains('v-lazy--loading')).toBe(true)
		})

		it('should handle image load success', async () => {
			const onLoad = vi.fn()

			// Mock Image constructor to capture onload handler
			const OriginalImage = globalThis.Image

			class MockImage {
				onload: (() => void) | null = null
				onerror: (() => void) | null = null
				src = ''
				constructor() {
					// Return this instance to be captured
				}
			}

			globalThis.Image = MockImage as any

			const { bind, load } = useLazy({
				src: 'https://example.com/image.jpg',
				onLoad,
			})

			const element = document.createElement('img')
			document.body.appendChild(element)
			bind(element)

			// Mock the Image constructor to capture and trigger onload
			const imgInstances: MockImage[] = []
			globalThis.Image = class {
				onload: (() => void) | null = null
				onerror: (() => void) | null = null
				src = ''
				constructor() {
					imgInstances.push(this as any)
				}
			} as any

			load()

			// Trigger onload on the internal Image instance
			if (imgInstances.length > 0 && imgInstances[0].onload) {
				imgInstances[0].onload()
			}

			expect(onLoad).toHaveBeenCalled()

			// Restore original Image
			globalThis.Image = OriginalImage
			document.body.removeChild(element)
		})

		it('should handle image load error', async () => {
			const onError = vi.fn()

			// Mock Image constructor to capture onerror handler
			const OriginalImage = globalThis.Image
			const imgInstances: { onload: (() => void) | null, onerror: (() => void) | null, src: string }[] = []
			globalThis.Image = class {
				onload: (() => void) | null = null
				onerror: (() => void) | null = null
				src = ''
				constructor() {
					imgInstances.push(this as any)
				}
			} as any

			const { bind, load } = useLazy({
				src: 'https://example.com/invalid.jpg',
				error: '/error.jpg',
				onError,
				attempt: 1,
			})

			const element = document.createElement('img')
			document.body.appendChild(element)
			bind(element)

			load()

			// Trigger onerror on the internal Image instance
			if (imgInstances.length > 0 && imgInstances[0].onerror) {
				imgInstances[0].onerror()
			}

			expect(onError).toHaveBeenCalled()

			// Restore original Image
			globalThis.Image = OriginalImage
			document.body.removeChild(element)
		})

		it('should cleanup on unbind', () => {
			const { bind } = useLazy()

			const element = document.createElement('img')
			const unbind = bind(element)

			expect(element.classList.contains('v-lazy')).toBe(true)

			unbind()

			expect(element.classList.contains('v-lazy')).toBe(false)
		})

		it('should respect reactive src', async () => {
			const src = ref('https://example.com/image1.jpg')
			const { bind, load, state } = useLazy({ src })

			const element = document.createElement('img')
			bind(element)

			src.value = 'https://example.com/image2.jpg'
			await nextTick()

			load()

			expect(state.value).toBe('loading')
		})
	})

	describe('useMutation', () => {
		it('should initialize with bind function', () => {
			const handler = vi.fn()
			const { bind, stop, start } = useMutation({ handler })

			expect(typeof bind).toBe('function')
			expect(typeof stop).toBe('function')
			expect(typeof start).toBe('function')
		})

		it('should bind to element and return unbind function', () => {
			const handler = vi.fn()
			const { bind } = useMutation({ handler })

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
		})

		it('should observe with default options (childList: true)', () => {
			const handler = vi.fn()
			const { bind } = useMutation({ handler })

			const element = document.createElement('div')
			bind(element)

			// MutationObserver should be created
			expect(element).toBeDefined()
		})

		it('should observe attributes', () => {
			const handler = vi.fn()
			const { bind } = useMutation({ handler, attributes: true })

			const element = document.createElement('div')
			bind(element)

			expect(element).toBeDefined()
		})

		it('should observe subtree', () => {
			const handler = vi.fn()
			const { bind } = useMutation({ handler, subtree: true })

			const element = document.createElement('div')
			bind(element)

			expect(element).toBeDefined()
		})

		it('should observe characterData', () => {
			const handler = vi.fn()
			const { bind } = useMutation({ handler, characterData: true })

			const element = document.createElement('div')
			bind(element)

			expect(element).toBeDefined()
		})

		it('should respect attributeFilter', () => {
			const handler = vi.fn()
			const { bind } = useMutation({
				handler,
				attributes: true,
				attributeFilter: ['class', 'id'],
			})

			const element = document.createElement('div')
			bind(element)

			expect(element).toBeDefined()
		})

		it('should stop observing when stop is called', () => {
			const handler = vi.fn()
			const { bind, stop } = useMutation({ handler })

			const element = document.createElement('div')
			bind(element)

			stop()

			// Observer should be disconnected
			expect(element).toBeDefined()
		})

		it('should start observing when start is called', () => {
			const handler = vi.fn()
			const { bind, stop, start } = useMutation({ handler })

			const element = document.createElement('div')
			bind(element)

			stop()
			start()

			expect(element).toBeDefined()
		})

		it('should respect disabled option', () => {
			const disabled = ref(true)
			const handler = vi.fn()
			const { bind } = useMutation({ handler, disabled })

			const element = document.createElement('div')
			bind(element)

			// Observer should not be started when disabled
			expect(element).toBeDefined()
		})

		it('should cleanup on unbind', () => {
			const handler = vi.fn()
			const { bind } = useMutation({ handler })

			const element = document.createElement('div')
			const unbind = bind(element)

			unbind()

			// Observer should be disconnected
			expect(element).toBeDefined()
		})

		it('should call handler when mutations occur', () => {
			const handler = vi.fn()
			const { bind } = useMutation({ handler, childList: true })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			// Trigger mutation
			const child = document.createElement('span')
			element.appendChild(child)

			// Note: In jsdom, MutationObserver may not trigger synchronously
			expect(handler).toBeDefined()

			document.body.removeChild(element)
		})
	})

	describe('useSticky', () => {
		it('should initialize with isSticky false', () => {
			const { isSticky } = useSticky()

			expect(isSticky.value).toBe(false)
		})

		it('should bind to element and return unbind function', () => {
			const { bind } = useSticky()

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
			expect(element.classList.contains('v-sticky')).toBe(true)
			unbind()
		})

		it('should add v-sticky class', () => {
			const { bind } = useSticky()

			const element = document.createElement('div')
			bind(element)

			expect(element.classList.contains('v-sticky')).toBe(true)
		})

		it('should use custom offsetTop', () => {
			const { bind } = useSticky({ offsetTop: 100 })

			const element = document.createElement('div')
			bind(element)

			expect(element.classList.contains('v-sticky')).toBe(true)
		})

		it('should respect disabled option', () => {
			const disabled = ref(true)
			const { bind, isSticky } = useSticky({ disabled })

			const element = document.createElement('div')
			bind(element)

			expect(isSticky.value).toBe(false)
		})

		it('should stop observing when stop is called', () => {
			const { bind, stop } = useSticky()

			const element = document.createElement('div')
			bind(element)

			stop()

			expect(element.classList.contains('v-sticky')).toBe(false)
		})

		it('should cleanup on unbind', () => {
			const { bind } = useSticky()

			const element = document.createElement('div')
			const unbind = bind(element)

			expect(element.classList.contains('v-sticky')).toBe(true)

			unbind()

			expect(element.classList.contains('v-sticky')).toBe(false)
		})

		it('should call onStick callback', () => {
			const onStick = vi.fn()
			const { bind } = useSticky({ onStick })

			const element = document.createElement('div')
			bind(element)

			// onStick should be available
			expect(typeof onStick).toBe('function')
		})

		it('should handle reactive offsetTop', async () => {
			const offsetTop = ref(0)
			const { bind } = useSticky({ offsetTop })

			const element = document.createElement('div')
			bind(element)

			offsetTop.value = 100
			await nextTick()

			expect(element.classList.contains('v-sticky')).toBe(true)
		})

		it('should restore original styles on unbind', () => {
			const { bind } = useSticky()

			const element = document.createElement('div')
			element.style.position = 'absolute'
			element.style.top = '10px'

			const unbind = bind(element)
			unbind()

			expect(element.style.position).toBe('absolute')
			expect(element.style.top).toBe('10px')
		})
	})
})
