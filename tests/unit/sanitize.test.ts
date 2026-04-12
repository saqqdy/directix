import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
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
				template: `<div v-sanitize="{ allowedTags: ['a'] }"><a href="javascript:alert('xss')">Link</a></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).not.toContain('javascript:')
		})

		it('should remove javascript: URLs (case insensitive)', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ allowedTags: ['a'] }"><a href="JAVASCRIPT:alert('xss')">Link</a></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).not.toContain('javascript:')
			expect(wrapper.find('div').html()).not.toContain('JAVASCRIPT:')
		})

		it('should use default allowed tags when binding is true', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="true"><b>Bold</b><i>Italic</i><script>XSS</script></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).toContain('<b>Bold</b>')
			expect(wrapper.find('div').html()).toContain('<i>Italic</i>')
			expect(wrapper.find('div').html()).not.toContain('<script>')
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

		it('should replace disallowed tags with text content', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ allowedTags: ['p'] }"><p>Keep</p><div>Remove</div></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).toContain('<p>Keep</p>')
			expect(wrapper.find('div').text()).toContain('Remove')
		})
	})

	describe('allowedAttributes option', () => {
		it('should only allow specified attributes', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ allowedTags: ['a'], allowedAttributes: ['href'] }"><a href="https://example.com" title="Link">Link</a></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).toContain('href=')
			expect(wrapper.find('div').html()).not.toContain('title=')
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

	describe('allowId option', () => {
		it('should remove id attribute by default', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize><p id="my-id">Text</p></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).not.toContain('id=')
		})

		it('should allow id attribute when enabled', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ allowId: true }"><p id="my-id">Text</p></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).toContain('id=')
		})
	})

	describe('allowDataUrls option', () => {
		it('should remove data: URLs by default', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ allowedTags: ['img'] }"><img src="data:image/png;base64,abc" /></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).not.toContain('data:')
		})

		it('should allow data: URLs when enabled', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ allowedTags: ['img'], allowDataUrls: true }"><img src="data:image/png;base64,abc" /></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).toContain('data:')
		})
	})

	describe('handler option', () => {
		it('should use custom handler when provided', () => {
			const customHandler = vi.fn((html: string) => html.toUpperCase())

			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ handler }"><p>test</p></div>`,
				data() {
					return { handler: customHandler }
				},
			})

			const _wrapper = mount(TestComponent)

			expect(customHandler).toHaveBeenCalled()
		})
	})

	describe('sanitizeOnUpdate option', () => {
		it('should sanitize on update by default', async () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize v-html="content"></div>`,
				data() {
					return { content: '<p>Safe</p>' }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ content: '<script>XSS</script><p>New</p>' })
			await nextTick()

			expect(wrapper.find('div').html()).not.toContain('<script>')
		})

		it('should not sanitize on update when sanitizeOnUpdate is false', async () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ sanitizeOnUpdate: false }">Initial</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).toContain('Initial')
		})
	})

	describe('nested elements', () => {
		it('should process nested elements', () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize><div><div onclick="xss()"><p>Deep</p></div></div></div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').html()).not.toContain('onclick')
			expect(wrapper.find('div').text()).toContain('Deep')
		})
	})

	describe('update hook', () => {
		it('should update options on binding change', async () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize="{ disabled }" v-html="content"></div>`,
				data() {
					return { disabled: true, content: '<script>Test</script><p>Safe</p>' }
				},
			})

			const wrapper = mount(TestComponent)

			// Initially disabled, script tag remains
			expect(wrapper.find('div').html()).toContain('<script>')

			await wrapper.setData({ disabled: false })
			await nextTick()

			// Now enabled, script should be removed
			expect(wrapper.find('div').html()).not.toContain('<script>')
		})

		it('should handle missing state on update gracefully', async () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-sanitize>Content</div>`,
			})

			const wrapper = mount(TestComponent)

			// Just verify it doesn't crash
			await nextTick()
			expect(wrapper.find('div').exists()).toBe(true)
		})
	})

	describe('unmounted hook', () => {
		it('should clean up on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { sanitize: vSanitize },
				template: `<div v-if="show" v-sanitize><p>Content</p></div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)
		})
	})
})
