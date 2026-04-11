import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vRipple } from '../../src/directives/ripple'

describe('v-ripple', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should add v-ripple class on mount', () => {
			const TestComponent = defineComponent({
				directives: { ripple: vRipple },
				template: `<button v-ripple>Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').classes()).toContain('v-ripple')
		})

		it('should create ripple on click', async () => {
			const TestComponent = defineComponent({
				directives: { ripple: vRipple },
				template: `<button v-ripple>Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			const ripple = button.find('.v-ripple__wave')
			expect(ripple.exists()).toBe(true)
		})

		it('should create ripple element with correct styles', async () => {
			const TestComponent = defineComponent({
				directives: { ripple: vRipple },
				template: `<button v-ripple>Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			const ripple = button.find('.v-ripple__wave')
			expect(ripple.exists()).toBe(true)
			expect((ripple.element as HTMLElement).style.position).toBe('absolute')
		})
	})

	describe('color options', () => {
		it('should accept color as string', async () => {
			const TestComponent = defineComponent({
				directives: { ripple: vRipple },
				template: `<button v-ripple="'red'">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			const ripple = button.find('.v-ripple__wave')
			expect(ripple.element.getAttribute('style')).toContain('background-color: red')
		})
	})

	describe('disabled option', () => {
		it('should not create ripple when disabled is true', async () => {
			const TestComponent = defineComponent({
				directives: { ripple: vRipple },
				template: `<button v-ripple="{ disabled: true }">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			expect(button.find('.v-ripple__wave').exists()).toBe(false)
		})

		it('should not create ripple when binding is false', async () => {
			const TestComponent = defineComponent({
				directives: { ripple: vRipple },
				template: `<button v-ripple="false">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			expect(button.find('.v-ripple__wave').exists()).toBe(false)
		})
	})

	describe('cleanup', () => {
		it('should remove class and event listener on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { ripple: vRipple },
				template: `<button v-if="show" v-ripple>Click me</button>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('button').classes()).toContain('v-ripple')

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('button').exists()).toBe(false)
		})
	})
})
