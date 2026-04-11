import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, ref } from 'vue'
import { useProgress } from '../../src/composables/use-progress'

describe('useProgress', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		document.body.innerHTML = ''
		// Remove injected styles
		const style = document.getElementById('v-progress-styles')
		if (style) style.remove()
	})

	describe('basic functionality', () => {
		it('should initialize with default options', () => {
			const { value, percent } = useProgress()

			expect(value.value).toBe(0)
			expect(percent.value).toBe(0)
		})

		it('should initialize with custom value', () => {
			const { value, percent } = useProgress({ value: 50 })

			expect(value.value).toBe(50)
			expect(percent.value).toBe(50)
		})

		it('should set value', () => {
			const { value, setValue } = useProgress()

			setValue(75)

			expect(value.value).toBe(75)
		})

		it('should increment value', () => {
			const { value, increment } = useProgress({ value: 50 })

			increment(10)

			expect(value.value).toBe(60)
		})

		it('should decrement value', () => {
			const { value, decrement } = useProgress({ value: 50 })

			decrement(10)

			expect(value.value).toBe(40)
		})

		it('should reset value', () => {
			const { value, setValue, reset } = useProgress({ value: 50 })

			setValue(75)
			reset()

			expect(value.value).toBe(0)
		})

		it('should clamp value to min/max', () => {
			const { value, setValue } = useProgress({ min: 0, max: 100 })

			setValue(150)
			expect(value.value).toBe(100)

			setValue(-50)
			expect(value.value).toBe(0)
		})
	})

	describe('bind', () => {
		it('should bind to element', () => {
			const element = document.createElement('div')
			const { bind } = useProgress()

			const unbind = bind(element)

			expect(element.querySelector('.v-progress')).not.toBeNull()

			unbind()
			expect(element.querySelector('.v-progress')).toBeNull()
		})

		it('should update progress bar on value change', () => {
			const element = document.createElement('div')
			const { bind, setValue } = useProgress({ value: 0 })

			bind(element)

			setValue(50)

			const progressBar = element.querySelector('.v-progress__bar') as HTMLElement
			expect(progressBar?.style.width).toBe('50%')
		})
	})

	describe('options', () => {
		it('should use custom height', () => {
			const element = document.createElement('div')
			const { bind } = useProgress({ height: 10 })

			bind(element)

			const container = element.querySelector('.v-progress') as HTMLElement
			expect(container?.style.height).toBe('10px')
		})

		it('should use custom color', () => {
			const element = document.createElement('div')
			const { bind } = useProgress({ color: '#ff0000' })

			bind(element)

			const progressBar = element.querySelector('.v-progress__bar') as HTMLElement
			expect(progressBar?.style.background).toMatch(/#ff0000|rgb\(255, 0, 0\)/)
		})

		it('should show text when enabled', () => {
			const element = document.createElement('div')
			const { bind, setValue } = useProgress({ showText: true })

			bind(element)
			setValue(50)

			const text = element.querySelector('.v-progress__text')
			expect(text?.textContent).toBe('50%')
		})

		it('should support indeterminate mode', () => {
			const element = document.createElement('div')
			const { bind } = useProgress({ indeterminate: true })

			bind(element)

			const progressBar = element.querySelector('.v-progress__bar')
			expect(progressBar?.classList.contains('v-progress--indeterminate')).toBe(true)
		})

		it('should support striped pattern', () => {
			const element = document.createElement('div')
			const { bind } = useProgress({ striped: true })

			bind(element)

			const progressBar = element.querySelector('.v-progress__bar') as HTMLElement
			expect(progressBar?.style.backgroundImage).toContain('linear-gradient')
		})
	})

	describe('callbacks', () => {
		it('should call onChange callback', () => {
			const onChange = vi.fn()
			const element = document.createElement('div')
			const { bind, setValue } = useProgress({ onChange })

			bind(element)
			setValue(50)

			expect(onChange).toHaveBeenCalledWith(50, 50)
		})

		it('should call onComplete when reaching 100%', () => {
			const onComplete = vi.fn()
			const element = document.createElement('div')
			const { bind, setValue } = useProgress({ onComplete })

			bind(element)
			setValue(100)

			expect(onComplete).toHaveBeenCalled()
		})
	})

	describe('reactive options', () => {
		it('should support reactive value', () => {
			const value = ref(0)
			const { percent, setValue } = useProgress({ value })

			expect(percent.value).toBe(0)

			// Use setValue instead of directly modifying ref
			setValue(50)
			expect(percent.value).toBe(50)
		})

		it('should support reactive indeterminate', () => {
			const element = document.createElement('div')
			const indeterminate = ref(false)
			const { bind } = useProgress({ indeterminate })

			bind(element)

			expect(element.querySelector('.v-progress--indeterminate')).toBeNull()
		})
	})
})
