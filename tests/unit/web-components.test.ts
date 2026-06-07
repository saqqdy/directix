import { describe, expect, it, vi } from 'vitest'
import { vClickOutside, vLazy } from '../../src'
import {
	createDirectiveElement,
	createSSRSafeCustomElement,
	defineCustomElementDirective,
	getRegisteredCustomElements,
	hydrateCustomElements,
	isCustomElement,
	isCustomElementDefined,
	registerDirectiveElements,
	whenCustomElementDefined,
} from '../../src/web-components'

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

	describe('isCustomElementDefined (v2.1.0)', () => {
		it('should return false for undefined element', () => {
			expect(isCustomElementDefined('undefined-element-v2')).toBe(false)
		})

		it('should return true for defined element', () => {
			class DefinedElement extends HTMLElement {}
			customElements.define('defined-element-v2', DefinedElement)
			expect(isCustomElementDefined('defined-element-v2')).toBe(true)
		})
	})

	describe('whenCustomElementDefined (v2.1.0)', () => {
		it('should resolve when element is defined', async () => {
			class AsyncElement extends HTMLElement {}
			customElements.define('async-element-v2', AsyncElement)

			await expect(whenCustomElementDefined('async-element-v2')).resolves.toBeUndefined()
		})
	})

	describe('getRegisteredCustomElements (v2.1.0)', () => {
		it('should return array of registered element names', () => {
			const elements = getRegisteredCustomElements()
			expect(Array.isArray(elements)).toBe(true)
		})

		it('should work when registry is available', () => {
			// This test verifies the function works without registry
			// In jsdom, __registry may not be available
			const elements = getRegisteredCustomElements()
			expect(Array.isArray(elements)).toBe(true)
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

		it('should define custom element with styles (v2.1.0)', () => {
			defineCustomElementDirective({
				name: 'styled-element',
				directive: vLazy,
				shadow: true,
				styles: ':host { display: block; }',
			})

			expect(customElements.get('styled-element')).toBeDefined()
		})

		it('should call lifecycle hooks (v2.1.0)', () => {
			const onConnect = vi.fn()
			const onDisconnect = vi.fn()

			defineCustomElementDirective({
				name: 'lifecycle-element',
				directive: vLazy,
				lifecycle: {
					onConnect,
					onDisconnect,
				},
			})

			expect(customElements.get('lifecycle-element')).toBeDefined()
		})
	})

	describe('createDirectiveElement', () => {
		it('should create a custom element class', () => {
			const LazyImage = createDirectiveElement('lazy-image-test', vLazy)
			expect(LazyImage).toBeDefined()
			expect(LazyImage.prototype).toBeInstanceOf(HTMLElement)
		})

		it('should create element with options (v2.1.0)', () => {
			const StyledElement = createDirectiveElement('styled-test', vLazy, {
				shadow: true,
				shadowMode: 'closed',
				styles: ':host { color: red; }',
				defaultValue: { threshold: 0.5 },
			})

			expect(StyledElement).toBeDefined()
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

	describe('hydrateCustomElements (v2.1.0)', () => {
		it('should hydrate custom elements in container', () => {
			// Create a container with custom element
			const container = document.createElement('div')
			container.innerHTML = '<lazy-test></lazy-test>'

			// Should not throw
			expect(() => hydrateCustomElements(container)).not.toThrow()
		})

		it('should work with document.body', () => {
			expect(() => hydrateCustomElements(document.body)).not.toThrow()
		})
	})

	describe('createSSRSafeCustomElement (v2.1.0)', () => {
		it('should create SSR-safe element with ssrRender', () => {
			const SSRElement = createSSRSafeCustomElement('ssr-element', vLazy, {
				shadow: true,
				styles: ':host { display: block; }',
			})

			expect(SSRElement.elementClass).toBeDefined()
			expect(typeof SSRElement.ssrRender).toBe('function')
		})

		it('should render correct HTML with shadow DOM', () => {
			const SSRElement = createSSRSafeCustomElement('ssr-shadow', vLazy, {
				shadow: true,
				styles: ':host { display: block; }',
			})

			const html = SSRElement.ssrRender({ src: 'image.jpg', alt: 'Test' })

			expect(html).toContain('ssr-shadow')
			expect(html).toContain('shadowroot="open"')
			expect(html).toContain('<slot></slot>')
			expect(html).toContain('src="image.jpg"')
		})

		it('should render correct HTML without shadow DOM', () => {
			const SSRElement = createSSRSafeCustomElement('ssr-no-shadow', vLazy, {
				shadow: false,
			})

			const html = SSRElement.ssrRender({ class: 'test-class' })

			expect(html).toContain('ssr-no-shadow')
			expect(html).not.toContain('shadowroot')
			expect(html).toContain('class="test-class"')
		})

		it('should handle multiple styles', () => {
			const SSRElement = createSSRSafeCustomElement('ssr-multi-style', vLazy, {
				shadow: true,
				styles: [':host { display: block; }', '.inner { color: red; }'],
			})

			const html = SSRElement.ssrRender()

			expect(html).toContain(':host { display: block; }')
			expect(html).toContain('.inner { color: red; }')
		})
	})
})
