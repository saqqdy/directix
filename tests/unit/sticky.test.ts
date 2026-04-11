import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { vSticky } from '../../src/directives/sticky'

// Mock getBoundingClientRect
const mockGetBoundingClientRect = (values: Partial<DOMRect>) => {
	vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
		width: 100,
		height: 50,
		x: 0,
		y: 0,
		top: 0,
		left: 0,
		right: 100,
		bottom: 50,
		toJSON: () => ({}),
		...values,
	} as DOMRect)
}

describe('v-sticky', () => {
	beforeEach(() => {
		vi.spyOn(window, 'getComputedStyle').mockReturnValue({
			overflow: 'auto',
			overflowX: 'auto',
			overflowY: 'auto',
		} as CSSStyleDeclaration)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should add v-sticky class on mount', () => {
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky>Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-sticky')
		})

		it('should accept number as top offset', () => {
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="50">Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').classes()).toContain('v-sticky')
		})

		it('should accept options object', () => {
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="{ top: 50, zIndex: 1000 }">Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').classes()).toContain('v-sticky')
		})
	})

	describe('sticky state', () => {
		it('should set sticky when element is at top', () => {
			mockGetBoundingClientRect({ top: -10 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky>Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-sticky--fixed')
		})
	})

	describe('disabled option', () => {
		it('should not apply sticky when disabled', () => {
			mockGetBoundingClientRect({ top: -10 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="{ disabled: true }">Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).not.toContain('v-sticky--fixed')
		})
	})
})
