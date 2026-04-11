import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { vSanitize } from '../../src/directives/sanitize'

describe('v-sanitize', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should sanitize HTML content on mount', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize><script>alert('xss')</script><p>Safe content</p></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).not.toContain('<script>')
			expect(wrapper.find('div').html()).toContain('<p>Safe content</p>')
		})

		it('should remove dangerous tags', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize><iframe src="evil.com"></iframe><p>Content</p></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).not.toContain('<iframe')
			expect(wrapper.find('div').html()).toContain('<p>Content</p>')
		})

		it('should remove dangerous attributes', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize><p onclick="alert('xss')">Click me</p></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).not.toContain('onclick')
		})

		it('should remove javascript: URLs', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize><a href="javascript:alert('xss')">Link</a></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).not.toContain('javascript:')
		})
	})

	describe('allowedTags option', () => {
		it('should only allow specified tags', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ allowedTags: ['p'] }"><p>Paragraph</p><span>Span</span></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).toContain('<p>Paragraph</p>')
			expect(wrapper.find('div').html()).not.toContain('<span>')
		})
	})

	describe('disabled option', () => {
		it('should not sanitize when disabled is true', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ disabled: true }"><b>Bold</b></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).toContain('<b>Bold</b>')
		})

		it('should not sanitize when binding is false', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="false"><b>Bold</b></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).toContain('<b>Bold</b>')
		})
	})

	describe('allowStyles option', () => {
		it('should remove style attribute by default', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize><p style="color: red">Text</p></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).not.toContain('style=')
		})

		it('should allow style attribute when enabled', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ allowStyles: true }"><p style="color: red">Text</p></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).toContain('style=')
		})
	})

	describe('allowClass option', () => {
		it('should remove class attribute by default', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize><p class="my-class">Text</p></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).not.toContain('class=')
		})

		it('should allow class attribute when enabled', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ allowClass: true }"><p class="my-class">Text</p></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).toContain('class=')
		})
	})
})
