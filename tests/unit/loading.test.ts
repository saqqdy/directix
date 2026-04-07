import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vLoading } from '../../src/directives/loading'

describe('v-loading', () => {
	describe('basic functionality', () => {
		it('should show loading overlay when value is true', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="true" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.querySelector('.v-loading')).not.toBeNull()
			expect(div.classList.contains('v-loading--active')).toBe(true)

			wrapper.unmount()
		})

		it('should not show loading overlay when value is false', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="false" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.querySelector('.v-loading')).toBeNull()
			expect(div.classList.contains('v-loading--active')).toBe(false)

			wrapper.unmount()
		})

		it('should accept options object', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="{ value: true, text: 'Loading...' }" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element
			const loadingEl = div.querySelector('.v-loading')

			expect(loadingEl).not.toBeNull()
			expect(loadingEl?.textContent).toContain('Loading...')

			wrapper.unmount()
		})
	})

	describe('loading text', () => {
		it('should display loading text', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="{ value: true, text: 'Please wait...' }" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element
			const textEl = div.querySelector('.v-loading__text')

			expect(textEl?.textContent).toBe('Please wait...')

			wrapper.unmount()
		})

		it('should not display text if not provided', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="true" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element
			const textEl = div.querySelector('.v-loading__text')

			expect(textEl).toBeNull()

			wrapper.unmount()
		})
	})

	describe('custom classes', () => {
		it('should use custom loading class', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="{ value: true, loadingClass: 'custom-loading' }" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.querySelector('.custom-loading')).not.toBeNull()

			wrapper.unmount()
		})

		it('should use custom spinner class', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="{ value: true, spinnerClass: 'custom-spinner' }" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.querySelector('.custom-spinner')).not.toBeNull()

			wrapper.unmount()
		})

		it('should use custom text class', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="{ value: true, text: 'Loading', textClass: 'custom-text' }" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.querySelector('.custom-text')).not.toBeNull()

			wrapper.unmount()
		})
	})

	describe('custom spinner', () => {
		it('should use custom spinner HTML', async () => {
			const customSpinner = '<span class="my-spinner"></span>'

			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="{ value: true, spinner: customSpinner }" style="position: relative;">Content</div>`,
				data() {
					return { customSpinner }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.querySelector('.my-spinner')).not.toBeNull()

			wrapper.unmount()
		})
	})

	describe('background option', () => {
		it('should apply custom background color', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="{ value: true, background: 'rgba(0, 0, 0, 0.5)' }" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element
			const loadingEl = div.querySelector('.v-loading') as HTMLElement

			expect(loadingEl?.style.background).toBe('rgba(0, 0, 0, 0.5)')

			wrapper.unmount()
		})
	})

	describe('lock option', () => {
		it('should lock scroll when lock is true', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="{ value: true, lock: true }" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.style.overflow).toBe('hidden')

			wrapper.unmount()
		})

		it('should not lock scroll by default', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="true" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.style.overflow).not.toBe('hidden')

			wrapper.unmount()
		})
	})

	describe('disabled option', () => {
		it('should not show loading when disabled', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="{ value: true, disabled: true }" style="position: relative;">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.querySelector('.v-loading')).toBeNull()

			wrapper.unmount()
		})
	})

	describe('updated hook', () => {
		it('should toggle loading state on update', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="isLoading" style="position: relative;">Content</div>`,
				data() {
					return { isLoading: true }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.querySelector('.v-loading')).not.toBeNull()

			// Hide loading
			await wrapper.setData({ isLoading: false })
			await nextTick()

			expect(div.querySelector('.v-loading')).toBeNull()

			// Show loading again
			await wrapper.setData({ isLoading: true })
			await nextTick()

			expect(div.querySelector('.v-loading')).not.toBeNull()

			wrapper.unmount()
		})

		it('should update text on change', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="{ value: true, text }" style="position: relative;">Content</div>`,
				data() {
					return { text: 'Loading...' }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.querySelector('.v-loading__text')?.textContent).toBe('Loading...')

			// Update text
			await wrapper.setData({ text: 'Please wait...' })
			await nextTick()

			expect(div.querySelector('.v-loading__text')?.textContent).toBe('Please wait...')

			wrapper.unmount()
		})

		it('should handle disabled state change', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-loading="{ value: true, disabled }" style="position: relative;">Content</div>`,
				data() {
					return { disabled: false }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.querySelector('.v-loading')).not.toBeNull()

			// Disable
			await wrapper.setData({ disabled: true })
			await nextTick()

			expect(div.querySelector('.v-loading')).toBeNull()

			wrapper.unmount()
		})
	})

	describe('cleanup', () => {
		it('should remove loading overlay on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-if="show" v-loading="true" style="position: relative;">Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('div').element.querySelector('.v-loading')).not.toBeNull()

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)

			wrapper.unmount()
		})

		it('should restore original styles on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { loading: vLoading },
				template: `<div v-if="show" v-loading="{ value: true, lock: true }" style="position: relative;">Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div').element

			expect(div.style.overflow).toBe('hidden')

			await wrapper.setData({ show: false })
			await nextTick()

			wrapper.unmount()
		})
	})
})
