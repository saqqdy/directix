import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useLoading } from '../../src/composables/use-loading'

describe('useLoading', () => {
	let element: HTMLElement

	beforeEach(() => {
		element = document.createElement('div')
		// Set initial position to avoid style changes
		element.style.position = 'absolute'
		document.body.appendChild(element)
	})

	afterEach(() => {
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should initialize with default state', () => {
			const { loading } = useLoading()

			expect(loading.value).toBe(false)
		})

		it('should initialize with custom initial state', () => {
			const { loading } = useLoading({ initial: true })

			expect(loading.value).toBe(true)
		})

		it('should start loading', () => {
			const { loading, start } = useLoading()

			start()

			expect(loading.value).toBe(true)
		})

		it('should stop loading', () => {
			const { loading, start, stop } = useLoading()

			start()
			expect(loading.value).toBe(true)

			stop()
			expect(loading.value).toBe(false)
		})

		it('should toggle loading', () => {
			const { loading, toggle } = useLoading()

			toggle()
			expect(loading.value).toBe(true)

			toggle()
			expect(loading.value).toBe(false)
		})
	})

	describe('bind', () => {
		it('should show loading overlay when loading is true', async () => {
			const { bind, start } = useLoading()

			bind(element)
			start()
			await nextTick()

			const overlay = element.querySelector('.v-loading')
			expect(overlay).not.toBeNull()
		})

		it('should not show overlay when loading is false', () => {
			const { bind } = useLoading()

			bind(element)

			const overlay = element.querySelector('.v-loading')
			expect(overlay).toBeNull()
		})

		it('should add active class when loading', async () => {
			const { bind, start } = useLoading()

			bind(element)
			start()
			await nextTick()

			expect(element.classList.contains('v-loading--active')).toBe(true)
		})

		it('should return unbind function', () => {
			const { bind } = useLoading()

			const unbind = bind(element)

			expect(typeof unbind).toBe('function')
		})
	})

	describe('loading overlay', () => {
		it('should create spinner element', async () => {
			const { bind, start } = useLoading()

			bind(element)
			start()
			await nextTick()

			const spinner = element.querySelector('.v-loading__spinner')
			expect(spinner).not.toBeNull()
		})

		it('should show loading text', async () => {
			const { bind, start } = useLoading({ text: 'Loading...' })

			bind(element)
			start()
			await nextTick()

			const textEl = element.querySelector('.v-loading__text')
			expect(textEl?.textContent).toBe('Loading...')
		})

		it('should use custom classes', async () => {
			const { bind, start } = useLoading({
				loadingClass: 'custom-loading',
				spinnerClass: 'custom-spinner',
			})

			bind(element)
			start()
			await nextTick()

			expect(element.querySelector('.custom-loading')).not.toBeNull()
			expect(element.querySelector('.custom-spinner')).not.toBeNull()
		})

		it('should use custom background', async () => {
			const { bind, start } = useLoading({ background: 'rgba(0, 0, 0, 0.5)' })

			bind(element)
			start()
			await nextTick()

			const overlay = element.querySelector('.v-loading') as HTMLElement
			expect(overlay.style.background).toContain('rgba(0, 0, 0, 0.5)')
		})
	})

	describe('lock option', () => {
		it('should lock scroll when loading', async () => {
			const { bind, start } = useLoading({ lock: true })

			bind(element)
			start()
			await nextTick()

			expect(element.style.overflow).toBe('hidden')
		})

		it('should restore scroll when loading stops', async () => {
			const { bind, start, stop } = useLoading({ lock: true })

			bind(element)
			start()
			await nextTick()
			stop()
			await nextTick()

			expect(element.style.overflow).toBe('')
		})
	})

	describe('reactive text', () => {
		it('should update text when text ref changes', async () => {
			const text = ref('Loading...')
			const { bind, start } = useLoading({ text })

			bind(element)
			start()
			await nextTick()

			const textEl = element.querySelector('.v-loading__text')
			expect(textEl?.textContent).toBe('Loading...')

			text.value = 'Please wait...'
			await nextTick()
			expect(textEl?.textContent).toBe('Please wait...')
		})
	})
})
