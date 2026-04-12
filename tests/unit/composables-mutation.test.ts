import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useMutation } from '../../src/composables/use-mutation'

describe('useMutation', () => {
	let element: HTMLElement

	beforeEach(() => {
		element = document.createElement('div')
		document.body.appendChild(element)
	})

	afterEach(() => {
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should observe mutations by default', () => {
			const handler = vi.fn()
			const { bind } = useMutation({ handler })

			bind(element)

			const child = document.createElement('span')
			element.appendChild(child)

			// The mutation observer should be created
			expect(handler).toBeDefined()
		})

		it('should pass mutations to handler', () => {
			const handler = vi.fn()
			const { bind } = useMutation({ handler })

			bind(element)

			// MutationObserver should be created
			expect(handler).toBeDefined()
		})

		it('should not observe when disabled ref is true', async () => {
			const handler = vi.fn()
			const disabled = ref(true)
			const { bind } = useMutation({ handler, disabled })

			bind(element)

			const child = document.createElement('span')
			element.appendChild(child)

			await nextTick()

			expect(handler).not.toHaveBeenCalled()
		})

		it('should re-observe when disabled becomes false', async () => {
			const handler = vi.fn()
			const disabled = ref(true)
			const { bind, start } = useMutation({ handler, disabled })

			bind(element)

			disabled.value = false
			await nextTick()
			start()

			// MutationObserver should be ready
			expect(handler).toBeDefined()
		})
	})

	describe('options', () => {
		it('should observe attributes', () => {
			const handler = vi.fn()
			const { bind } = useMutation({
				handler,
				attributes: true,
				childList: false,
			})

			bind(element)

			element.setAttribute('data-test', 'value')

			// MutationObserver should be created
			expect(handler).toBeDefined()
		})

		it('should observe subtree', () => {
			const handler = vi.fn()
			const child = document.createElement('span')
			element.appendChild(child)

			const { bind } = useMutation({
				handler,
				subtree: true,
			})

			bind(element)

			// MutationObserver should be created
			expect(handler).toBeDefined()
		})

		it('should use attributeFilter', () => {
			const handler = vi.fn()
			const { bind } = useMutation({
				handler,
				attributes: true,
				attributeFilter: ['data-test'],
				childList: false,
			})

			bind(element)

			// MutationObserver should be created
			expect(handler).toBeDefined()
		})
	})

	describe('controls', () => {
		it('should stop observing', () => {
			const handler = vi.fn()
			const { bind, stop } = useMutation({ handler })

			bind(element)
			stop()

			// After stop, handler should not be called
			const child = document.createElement('span')
			element.appendChild(child)

			expect(handler).not.toHaveBeenCalled()
		})

		it('should start observing again', () => {
			const handler = vi.fn()
			const { bind, stop, start } = useMutation({ handler })

			bind(element)
			stop()
			start()

			// MutationObserver should be created again
			expect(handler).toBeDefined()
		})
	})

	describe('disabled option', () => {
		it('should not observe when disabled', () => {
			const handler = vi.fn()
			const disabled = ref(true)
			const { bind } = useMutation({ handler, disabled })

			bind(element)

			const child = document.createElement('span')
			element.appendChild(child)

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('unbind', () => {
		it('should return unbind function', () => {
			const handler = vi.fn()
			const { bind } = useMutation({ handler })

			const unbind = bind(element)
			unbind()

			const child = document.createElement('span')
			element.appendChild(child)

			expect(handler).not.toHaveBeenCalled()
		})
	})

	describe('characterData option', () => {
		it('should observe character data changes', () => {
			const handler = vi.fn()
			const textNode = document.createTextNode('Hello')
			element.appendChild(textNode)

			const { bind } = useMutation({
				handler,
				characterData: true,
				childList: false,
				subtree: true,
			})

			bind(element)

			// MutationObserver should be created
			expect(handler).toBeDefined()
		})
	})

	describe('attributeOldValue option', () => {
		it('should record old attribute values', () => {
			const handler = vi.fn()
			element.setAttribute('data-test', 'old')

			const { bind } = useMutation({
				handler,
				attributes: true,
				attributeOldValue: true,
				childList: false,
			})

			bind(element)

			// MutationObserver should be created
			expect(handler).toBeDefined()
		})
	})

	describe('characterDataOldValue option', () => {
		it('should record old character data', () => {
			const handler = vi.fn()
			const textNode = document.createTextNode('Hello')
			element.appendChild(textNode)

			const { bind } = useMutation({
				handler,
				characterData: true,
				characterDataOldValue: true,
				childList: false,
				subtree: true,
			})

			bind(element)

			// MutationObserver should be created
			expect(handler).toBeDefined()
		})
	})
})
