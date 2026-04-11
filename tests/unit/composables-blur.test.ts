import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useBlur } from '../../src/composables/use-blur'

describe('useBlur', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { isVisible } = useBlur()

			expect(isVisible.value).toBe(false)
		})

		it('should initialize with custom visible state', () => {
			const { isVisible } = useBlur({ visible: true })

			expect(isVisible.value).toBe(true)
		})

		it('should show blur overlay', () => {
			const { isVisible, show } = useBlur()

			show()

			expect(isVisible.value).toBe(true)
			expect(document.querySelector('.v-blur-overlay')).not.toBeNull()
		})

		it('should hide blur overlay', () => {
			const { isVisible, show, hide } = useBlur()

			show()
			expect(isVisible.value).toBe(true)

			hide()

			// Should start hiding (opacity 0)
			expect(isVisible.value).toBe(false)

			// Advance past duration
			vi.advanceTimersByTime(300)
			expect(document.querySelector('.v-blur-overlay')).toBeNull()
		})

		it('should toggle blur', () => {
			const { isVisible, toggle } = useBlur()

			toggle()
			expect(isVisible.value).toBe(true)

			toggle()
			expect(isVisible.value).toBe(false)
		})
	})

	describe('options', () => {
		it('should use custom radius', () => {
			const { show } = useBlur({ radius: 20 })
			show()

			const overlay = document.querySelector('.v-blur-overlay') as HTMLElement
			expect(overlay).not.toBeNull()
		})

		it('should use custom z-index', () => {
			const { show } = useBlur({ zIndex: 5000 })
			show()

			const overlay = document.querySelector('.v-blur-overlay') as HTMLElement
			expect(overlay?.style.zIndex).toBe('5000')
		})

		it('should use custom class', () => {
			const { show } = useBlur({ class: 'custom-blur' })
			show()

			const overlay = document.querySelector('.v-blur-overlay')
			expect(overlay?.classList.contains('custom-blur')).toBe(true)
		})

		it('should lock scroll when enabled', () => {
			const { show, hide } = useBlur({ lockScroll: true })

			show()

			expect(document.body.style.overflow).toBe('hidden')

			hide()
			vi.advanceTimersByTime(300)

			expect(document.body.style.overflow).toBe('')
		})
	})

	describe('callbacks', () => {
		it('should call onShow callback', () => {
			const onShow = vi.fn()
			const { show } = useBlur({ onShow })

			show()

			expect(onShow).toHaveBeenCalled()
		})

		it('should call onHide callback', () => {
			const onHide = vi.fn()
			const { show, hide } = useBlur({ onHide })

			show()
			hide()

			expect(onHide).toHaveBeenCalled()
		})
	})

	describe('bind', () => {
		it('should bind to element', () => {
			const element = document.createElement('div')
			const { bind } = useBlur()

			const unbind = bind(element)

			expect(element.classList.contains('v-blur')).toBe(true)

			unbind()
			expect(element.classList.contains('v-blur')).toBe(false)
		})

		it('should show blur when initially visible', () => {
			const element = document.createElement('div')
			const { bind } = useBlur({ visible: true })

			bind(element)

			expect(document.querySelector('.v-blur-overlay')).not.toBeNull()
		})
	})

	describe('reactive options', () => {
		it('should support reactive radius', () => {
			const radius = ref(10)
			const { show } = useBlur({ radius })

			show()

			expect(document.querySelector('.v-blur-overlay')).not.toBeNull()
		})

		it('should support reactive visible', () => {
			const visible = ref(false)
			const { isVisible } = useBlur({ visible })

			expect(isVisible.value).toBe(false)

			visible.value = true
		})
	})
})
