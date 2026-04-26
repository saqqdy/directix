import { describe, expect, it } from 'vitest'
import { vClickOutside, vLazy } from '../../src'
import { createDirectiveElement, defineCustomElementDirective, isCustomElement, registerDirectiveElements } from '../../src/web-components'

describe('Web Components Support', () => {
	describe('isCustomElement', () => {
		it('should detect custom elements with hyphen', () => {
			const div = document.createElement('div')
			expect(isCustomElement(div)).toBe(false)

			const customEl = document.createElement('my-element')
			expect(isCustomElement(customEl)).toBe(true)
		})

		it('should detect registered custom elements', () => {
			// Register a custom element
			class MyTestElement extends HTMLElement {}
			customElements.define('test-element', MyTestElement)

			const testEl = document.createElement('test-element')
			expect(isCustomElement(testEl)).toBe(true)
		})
	})

	describe('defineCustomElementDirective', () => {
		it('should define a custom element from directive', () => {
			defineCustomElementDirective({
				name: 'lazy-test',
				directive: vLazy,
			})

			// Check if element is defined
			expect(customElements.get('lazy-test')).toBeDefined()
		})
	})

	describe('createDirectiveElement', () => {
		it('should create a custom element class', () => {
			const LazyImage = createDirectiveElement('lazy-image-test', vLazy)
			expect(LazyImage).toBeDefined()
			expect(LazyImage.prototype).toBeInstanceOf(HTMLElement)
		})
	})

	describe('registerDirectiveElements', () => {
		it('should register multiple directives as custom elements', () => {
			registerDirectiveElements({
				'lazy-custom': vLazy,
				'click-outside-custom': vClickOutside,
			})

			expect(customElements.get('lazy-custom')).toBeDefined()
			expect(customElements.get('click-outside-custom')).toBeDefined()
		})
	})
})
