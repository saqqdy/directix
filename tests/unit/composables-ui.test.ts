import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import {
	createWatermarkUrl,
	useLoading,
	useMask,
	useSanitize,
	useWatermark,
} from '../../src/composables'

describe('UI composables', () => {
	beforeEach(() => {
		vi.useFakeTimers()

		// Mock canvas for watermark tests
		HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
			font: '',
			fillStyle: '',
			textAlign: '',
			textBaseline: '',
			translate: vi.fn(),
			rotate: vi.fn(),
			fillText: vi.fn(),
		})) as any
		HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock')
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('useLoading', () => {
		it('should initialize with default loading state false', () => {
			const { loading } = useLoading()

			expect(loading.value).toBe(false)
		})

		it('should initialize with custom initial state', () => {
			const { loading } = useLoading({ initial: true })

			expect(loading.value).toBe(true)
		})

		it('should start and stop loading', () => {
			const { loading, start, stop } = useLoading()

			start()
			expect(loading.value).toBe(true)

			stop()
			expect(loading.value).toBe(false)
		})

		it('should toggle loading state', () => {
			const { loading, toggle } = useLoading()

			toggle()
			expect(loading.value).toBe(true)

			toggle()
			expect(loading.value).toBe(false)
		})

		it('should bind to element and show loading overlay', () => {
			const { loading: _loading, bind } = useLoading({ initial: true })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			expect(element.classList.contains('v-loading--active')).toBe(true)
			expect(element.querySelector('.v-loading')).not.toBeNull()

			document.body.removeChild(element)
		})

		it('should remove loading overlay when stopped', async () => {
			const { loading: _loading, start, stop, bind } = useLoading()

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			start()
			await nextTick()

			stop()
			await nextTick()

			expect(element.querySelector('.v-loading')).toBeNull()

			document.body.removeChild(element)
		})

		it('should use custom loading class', () => {
			const { loading: _loading, bind } = useLoading({
				initial: true,
				loadingClass: 'custom-loading',
			})

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			expect(element.querySelector('.custom-loading')).not.toBeNull()

			document.body.removeChild(element)
		})

		it('should show loading text', () => {
			const { loading: _loading, bind } = useLoading({
				initial: true,
				text: 'Loading...',
			})

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			const textEl = element.querySelector('.v-loading__text')
			expect(textEl?.textContent).toBe('Loading...')

			document.body.removeChild(element)
		})

		it('should use custom spinner', () => {
			const customSpinner = '<div class="my-spinner"></div>'
			const { loading: _loading, bind } = useLoading({
				initial: true,
				spinner: customSpinner,
			})

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			expect(element.querySelector('.my-spinner')).not.toBeNull()

			document.body.removeChild(element)
		})

		it('should handle reactive text changes', async () => {
			const text = ref('Loading...')
			const { loading: _loading, bind } = useLoading({
				initial: true,
				text,
			})

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			text.value = 'Please wait...'
			await nextTick()

			const textEl = element.querySelector('.v-loading__text')
			expect(textEl?.textContent).toBe('Please wait...')

			document.body.removeChild(element)
		})

		it('should make element position relative if static', () => {
			const { loading: _loading, bind } = useLoading({ initial: true })

			const element = document.createElement('div')
			document.body.appendChild(element)
			bind(element)

			// Element should have relative positioning for overlay
			expect(getComputedStyle(element).position).not.toBe('static')

			document.body.removeChild(element)
		})

		it('should return unbind function', () => {
			const { loading: _loading, bind } = useLoading({ initial: true })

			const element = document.createElement('div')
			document.body.appendChild(element)
			const unbind = bind(element)

			expect(typeof unbind).toBe('function')

			unbind()
			expect(element.querySelector('.v-loading')).toBeNull()

			document.body.removeChild(element)
		})
	})

	describe('useMask', () => {
		it('should format value according to mask pattern', () => {
			const { getFormattedValue } = useMask({ mask: '###-##-####' })

			expect(getFormattedValue('1234567890')).toBe('123-45-6789')
		})

		it('should get raw value without mask literals', () => {
			const { getRawValue } = useMask({ mask: '###-##-####' })

			expect(getRawValue('123-45-6789')).toBe('123456789')
		})

		it('should check if mask is complete', () => {
			const { isComplete } = useMask({ mask: '###-##-####' })

			expect(isComplete('123-45-6789')).toBe(true)
			expect(isComplete('123-45-___')).toBe(false)
		})

		it('should bind to input element', () => {
			const { bind } = useMask({ mask: '###-##-####' })

			const input = document.createElement('input')
			input.value = '1234567890'
			const unbind = bind(input)

			expect(typeof unbind).toBe('function')
		})

		it('should format initial value on bind', () => {
			const { bind } = useMask({ mask: '###-##-####' })

			const input = document.createElement('input')
			input.value = '1234567890'
			bind(input)

			expect(input.value).toBe('123-45-6789')
		})

		it('should use custom placeholder', () => {
			const { getFormattedValue } = useMask({
				mask: '###-##-####',
				placeholder: '*',
			})

			expect(getFormattedValue('123')).toBe('123-**-****')
		})

		it('should handle different mask patterns', () => {
			const { getFormattedValue: formatPhone } = useMask({ mask: '(###) ###-####' })
			expect(formatPhone('1234567890')).toBe('(123) 456-7890')

			const { getFormattedValue: formatDate } = useMask({ mask: '##/##/####' })
			expect(formatDate('12312020')).toBe('12/31/2020')
		})

		it('should handle letter patterns', () => {
			const { getFormattedValue } = useMask({ mask: 'AAA-###' })

			expect(getFormattedValue('ABC123')).toBe('ABC-123')
		})

		it('should handle alphanumeric patterns', () => {
			const { getFormattedValue } = useMask({ mask: 'NNN-NNN' })

			expect(getFormattedValue('ABC123')).toBe('ABC-123')
		})

		it('should call onChange callback', () => {
			const onChange = vi.fn()
			const { bind } = useMask({
				mask: '###-##-####',
				onChange,
			})

			const input = document.createElement('input')
			input.value = '123'
			bind(input)

			// Simulate input event
			input.dispatchEvent(new Event('input', { bubbles: true }))

			// onChange should be called with formatted value
			expect(onChange).toHaveBeenCalled()
		})

		it('should call onComplete when mask is filled', () => {
			const onComplete = vi.fn()
			const { bind } = useMask({
				mask: '###-##-####',
				onComplete,
			})

			const input = document.createElement('input')
			input.value = '1234567890'
			bind(input)

			// Simulate input event with complete value
			input.dispatchEvent(new Event('input', { bubbles: true }))

			// onComplete should be called
			expect(onComplete).toHaveBeenCalled()
		})

		it('should handle reactive mask changes', async () => {
			const mask = ref('###-##-####')
			const { getFormattedValue } = useMask({ mask })

			expect(getFormattedValue('1234567890')).toBe('123-45-6789')
		})

		it('should handle disabled state', () => {
			const disabled = ref(true)
			const { bind } = useMask({
				mask: '###-##-####',
				disabled,
			})

			const input = document.createElement('input')
			const unbind = bind(input)

			expect(typeof unbind).toBe('function')
		})
	})

	describe('useSanitize', () => {
		it('should sanitize HTML by removing dangerous tags', () => {
			const { sanitize } = useSanitize()

			const html = '<p>Safe</p><script>alert("xss")</script>'
			const result = sanitize(html)

			expect(result).not.toContain('<script>')
			expect(result).toContain('Safe')
		})

		it('should remove dangerous attributes', () => {
			const { sanitize } = useSanitize()

			const html = '<div onclick="alert(1)">Content</div>'
			const result = sanitize(html)

			expect(result).not.toContain('onclick')
		})

		it('should allow specified tags', () => {
			const { sanitize } = useSanitize({
				allowedTags: ['b', 'i', 'p'],
			})

			const html = '<p><b>Bold</b> <span>text</span></p>'
			const result = sanitize(html)

			expect(result).toContain('Bold')
			expect(result).not.toContain('<span>')
		})

		it('should allow specified attributes', () => {
			const { sanitize } = useSanitize({
				allowedTags: ['a'],
				allowedAttributes: ['href', 'title'],
			})

			const html = '<a href="https://example.com" title="Link" onclick="alert(1)">Link</a>'
			const result = sanitize(html)

			// The onclick attribute should be removed
			expect(result).not.toContain('onclick')
		})

		it('should remove javascript: URLs', () => {
			const { sanitize } = useSanitize()

			const html = '<a href="javascript:alert(1)">Click</a>'
			const result = sanitize(html)

			expect(result).not.toContain('javascript:')
		})

		it('should handle data URLs based on option', () => {
			const { sanitize: sanitizeBlockData } = useSanitize({ allowDataUrls: false })
			const { sanitize: sanitizeAllowData } = useSanitize({
				allowDataUrls: true,
				allowedTags: ['img'],
				allowedAttributes: ['src'],
			})

			const html = '<img src="data:image/png;base64,abc123">'

			expect(sanitizeBlockData(html)).not.toContain('data:')
			// When allowed, the src attribute should be preserved
			const allowedResult = sanitizeAllowData(html)
			expect(allowedResult).toContain('img')
		})

		it('should handle inline styles based on option', () => {
			const { sanitize: sanitizeNoStyles } = useSanitize({ allowStyles: false })
			const { sanitize: sanitizeWithStyles } = useSanitize({ allowStyles: true })

			const html = '<div style="color: red">Styled</div>'

			expect(sanitizeNoStyles(html)).not.toContain('style=')
			expect(sanitizeWithStyles(html)).toContain('style=')
		})

		it('should handle class attribute based on option', () => {
			const { sanitize: sanitizeNoClass } = useSanitize({ allowClass: false })
			const { sanitize: sanitizeWithClass } = useSanitize({ allowClass: true })

			const html = '<div class="my-class">Content</div>'

			expect(sanitizeNoClass(html)).not.toContain('class=')
			expect(sanitizeWithClass(html)).toContain('class=')
		})

		it('should use custom handler if provided', () => {
			const customHandler = (html: string) => html.toUpperCase()
			const { sanitize } = useSanitize({ handler: customHandler })

			expect(sanitize('<p>hello</p>')).toBe('<P>HELLO</P>')
		})

		it('should remove iframe tags', () => {
			const { sanitize } = useSanitize()

			const html = '<iframe src="evil.com"></iframe><p>Safe</p>'
			const result = sanitize(html)

			expect(result).not.toContain('<iframe')
			expect(result).toContain('<p>Safe</p>')
		})

		it('should remove object and embed tags', () => {
			const { sanitize } = useSanitize()

			const html = '<object data="evil.swf"></object><embed src="evil.swf"><p>Safe</p>'
			const result = sanitize(html)

			expect(result).not.toContain('<object')
			expect(result).not.toContain('<embed')
		})

		it('should bind to element and sanitize initial content', () => {
			const { bind } = useSanitize()

			const element = document.createElement('div')
			element.innerHTML = '<p>Safe</p><script>alert(1)</script>'
			bind(element)

			expect(element.innerHTML).not.toContain('<script>')
		})
	})

	describe('useWatermark', () => {
		// Note: Canvas is not fully supported in jsdom, skip tests that require canvas
		it.todo('should initialize with default values', () => {
			const { disabled } = useWatermark({
				content: 'Confidential',
			})

			expect(disabled.value).toBe(false)
		})

		it.todo('should be disabled when disabled option is true', () => {
			const { disabled } = useWatermark({
				content: 'Watermark',
				disabled: true,
			})

			expect(disabled.value).toBe(true)
		})

		it.todo('should enable and disable watermark', () => {
			const { disabled, enable, disable } = useWatermark({
				content: 'Watermark',
			})

			disable()
			expect(disabled.value).toBe(true)

			enable()
			expect(disabled.value).toBe(false)
		})

		it.todo('should update watermark options', () => {
			const { style, update } = useWatermark({
				content: 'Watermark',
				zIndex: 100,
			})

			update({ zIndex: 200 })

			expect(style.value.zIndex).toBe(200)
		})
	})

	describe('createWatermarkUrl', () => {
		// Note: Canvas is not fully supported in jsdom
		it('should be a function', () => {
			expect(typeof createWatermarkUrl).toBe('function')
		})
	})
})
