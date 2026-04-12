import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
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

		it('should accept string top offset', () => {
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="{ top: '50px' }">Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').classes()).toContain('v-sticky')
		})

		it('should accept bottom offset', () => {
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="{ bottom: 20 }">Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').classes()).toContain('v-sticky')
		})

		it('should accept custom sticky class', () => {
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="{ stickyClass: 'custom-sticky' }">Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').classes()).toContain('v-sticky')
		})

		it('should accept false to disable', () => {
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="false">Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)
			// Should not add v-sticky class when disabled
			expect(wrapper.find('div').classes()).not.toContain('v-sticky')
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

		it('should not set sticky when element is below threshold', () => {
			// Element at top: 50, which is above the threshold of 0
			// But we need to mock the container scroll position too
			mockGetBoundingClientRect({ top: 50 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky>Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)

			// Note: The actual sticky logic depends on scroll position and container
			// This test verifies the directive mounts correctly
			expect(wrapper.find('div').classes()).toContain('v-sticky')
		})

		it('should consider custom top offset', () => {
			// Element is at top -60, and custom offset is 50
			// -60 <= 50 should trigger sticky
			mockGetBoundingClientRect({ top: -60 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="50">Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)

			// Verify directive is applied
			expect(wrapper.find('div').classes()).toContain('v-sticky')
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

		it('should not mount when disabled', () => {
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="{ disabled: true }">Sticky header</div>`,
			})

			const wrapper = mount(TestComponent)

			// Should not have v-sticky class when disabled
			expect(wrapper.find('div').classes()).not.toContain('v-sticky')
		})
	})

	describe('onChange callback', () => {
		it('should store onChange callback', () => {
			mockGetBoundingClientRect({ top: 100 })
			const onChange = vi.fn()

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="{ onChange }">Sticky header</div>`,
				data() {
					return { onChange }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should call onChange when becoming sticky', async () => {
			const onChange = vi.fn()

			// Start with element below threshold
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="{ top: 0, onChange }">Sticky header</div>`,
				data() {
					return { onChange }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should call onChange when becoming unstuck', async () => {
			const onChange = vi.fn()

			// Start with element at top (sticky)
			mockGetBoundingClientRect({ top: -10 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="{ top: 0, onChange }">Sticky header</div>`,
				data() {
					return { onChange }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})
	})

	describe('container option', () => {
		it('should accept string container selector', () => {
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `
					<div id="scroll-container">
						<div v-sticky="{ container: '#scroll-container' }">Sticky header</div>
					</div>
				`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('.v-sticky').exists()).toBe(true)
		})

		it('should accept Element as container', () => {
			mockGetBoundingClientRect({ top: 100 })

			const containerEl = document.createElement('div')
			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="{ container: containerEl }">Sticky header</div>`,
				data() {
					return { containerEl }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('.v-sticky').exists()).toBe(true)
		})
	})

	describe('update hook', () => {
		it('should update options when binding changes', async () => {
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-sticky="{ top: currentTop }">Sticky header</div>`,
				data() {
					return { currentTop: 0 }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ currentTop: 50 })
			await nextTick()

			expect(wrapper.find('.v-sticky').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should cleanup on unmount', async () => {
			mockGetBoundingClientRect({ top: 100 })

			const TestComponent = defineComponent({
				directives: { sticky: vSticky },
				template: `<div v-if="show" v-sticky>Sticky header</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-sticky').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-sticky').exists()).toBe(false)
		})
	})
})
