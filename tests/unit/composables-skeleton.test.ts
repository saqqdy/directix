import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useSkeleton } from '../../src/composables/use-skeleton'

describe('useSkeleton', () => {
	beforeEach(() => {
		// Remove any existing styles
		const style = document.getElementById('v-skeleton-styles')
		if (style) style.remove()
	})

	afterEach(() => {
		vi.restoreAllMocks()
		document.body.innerHTML = ''
		const style = document.getElementById('v-skeleton-styles')
		if (style) style.remove()
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { isLoading, show, hide, toggle, bind } = useSkeleton()

			expect(isLoading.value).toBe(true) // Default loading state
			expect(show).toBeDefined()
			expect(hide).toBeDefined()
			expect(toggle).toBeDefined()
			expect(bind).toBeDefined()
		})

		it('should initialize with custom loading state', () => {
			const { isLoading } = useSkeleton({ loading: false })

			expect(isLoading.value).toBe(false)
		})

		it('should bind to element', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind } = useSkeleton({ loading: true })

			bind(element)

			expect(element.classList.contains('v-skeleton-container')).toBe(true)
			expect(parent.querySelector('.v-skeleton')).not.toBeNull()
		})

		it('should unbind properly', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind } = useSkeleton({ loading: true })

			const unbind = bind(element)
			unbind()

			expect(element.classList.contains('v-skeleton-container')).toBe(false)
		})
	})

	describe('show/hide/toggle', () => {
		it('should show skeleton', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind, show, isLoading } = useSkeleton({ loading: false })

			bind(element)
			show()

			expect(isLoading.value).toBe(true)
			expect(parent.querySelector('.v-skeleton')).not.toBeNull()
		})

		it('should hide skeleton', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind, hide, isLoading } = useSkeleton({ loading: true })

			bind(element)
			hide()

			expect(isLoading.value).toBe(false)
			expect(parent.querySelector('.v-skeleton')).toBeNull()
		})

		it('should toggle skeleton', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind, toggle, isLoading } = useSkeleton({ loading: false })

			bind(element)
			toggle()

			expect(isLoading.value).toBe(true)
		})
	})

	describe('options', () => {
		it('should support wave animation', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind } = useSkeleton({ loading: true, animation: 'wave' })

			bind(element)

			const skeleton = parent.querySelector('.v-skeleton') as HTMLElement
			expect(skeleton?.style.animation).toContain('skeleton-wave')
		})

		it('should support pulse animation', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind } = useSkeleton({ loading: true, animation: 'pulse' })

			bind(element)

			const skeleton = parent.querySelector('.v-skeleton') as HTMLElement
			expect(skeleton?.style.animation).toContain('skeleton-pulse')
		})

		it('should support no animation', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind } = useSkeleton({ loading: true, animation: 'none' })

			bind(element)

			const skeleton = parent.querySelector('.v-skeleton') as HTMLElement
			expect(skeleton?.style.animation).toBe('')
		})

		it('should support custom width', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind } = useSkeleton({ loading: true, width: 200 })

			bind(element)

			const skeleton = parent.querySelector('.v-skeleton') as HTMLElement
			expect(skeleton?.style.width).toBe('200px')
		})

		it('should support custom height', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind } = useSkeleton({ loading: true, height: 50 })

			bind(element)

			const skeleton = parent.querySelector('.v-skeleton') as HTMLElement
			expect(skeleton?.style.height).toBe('50px')
		})

		it('should support custom border radius', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind } = useSkeleton({ loading: true, radius: 10 })

			bind(element)

			const skeleton = parent.querySelector('.v-skeleton') as HTMLElement
			expect(skeleton?.style.borderRadius).toBe('10px')
		})

		it('should support custom color', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind } = useSkeleton({ loading: true, color: '#cccccc' })

			bind(element)

			const skeleton = parent.querySelector('.v-skeleton') as HTMLElement
			// Color can be converted to rgb format by the browser
			expect(skeleton?.style.background).toMatch(/#c{6}|rgb\(204, 204, 204\)/)
		})

		it('should support custom class', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind } = useSkeleton({ loading: true, class: 'custom-skeleton' })

			bind(element)

			const skeleton = parent.querySelector('.v-skeleton')
			expect(skeleton?.classList.contains('custom-skeleton')).toBe(true)
		})
	})

	describe('styles injection', () => {
		it('should inject global styles', () => {
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind } = useSkeleton({ loading: true })

			bind(element)

			expect(document.getElementById('v-skeleton-styles')).not.toBeNull()
		})

		it('should not inject styles twice', () => {
			const parent = document.createElement('div')
			const element1 = document.createElement('div')
			const element2 = document.createElement('div')
			parent.appendChild(element1)
			parent.appendChild(element2)
			document.body.appendChild(parent)

			const { bind: bind1 } = useSkeleton({ loading: true })
			const { bind: bind2 } = useSkeleton({ loading: true })

			bind1(element1)
			bind2(element2)

			const styles = document.querySelectorAll('#v-skeleton-styles')
			expect(styles.length).toBe(1)
		})
	})

	describe('reactive options', () => {
		it('should support reactive loading', () => {
			const loading = ref(true)
			const parent = document.createElement('div')
			const element = document.createElement('div')
			element.innerHTML = 'Content'
			parent.appendChild(element)
			document.body.appendChild(parent)

			const { bind, isLoading } = useSkeleton({ loading })

			bind(element)

			expect(isLoading.value).toBe(true)
		})
	})
})
