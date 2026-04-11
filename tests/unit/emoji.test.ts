import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vEmoji } from '../../src/directives/emoji'

describe('v-emoji', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should add v-emoji class on mount', () => {
			const TestComponent = defineComponent({
				directives: { emoji: vEmoji },
				template: `<input v-emoji type="text" />`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('input').classes()).toContain('v-emoji')
		})

		it('should strip emojis from initial value', () => {
			const TestComponent = defineComponent({
				directives: { emoji: vEmoji },
				template: `<input v-emoji value="Hello 😀 World" type="text" />`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('input').element.value).toBe('Hello  World')
		})

		it('should not strip emojis when disabled', () => {
			const TestComponent = defineComponent({
				directives: { emoji: vEmoji },
				template: `<input v-emoji="false" value="Hello 😀 World" type="text" />`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('input').element.value).toBe('Hello 😀 World')
		})
	})

	describe('input handling', () => {
		it('should strip emojis on input', async () => {
			const TestComponent = defineComponent({
				directives: { emoji: vEmoji },
				template: `<input v-emoji type="text" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('Test 😊 Message')

			expect(input.element.value).toBe('Test  Message')
		})

		it('should use custom replacement character', async () => {
			const TestComponent = defineComponent({
				directives: { emoji: vEmoji },
				template: `<input v-emoji="{ replacement: '*' }" type="text" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('Test 😊 Message')

			expect(input.element.value).toBe('Test * Message')
		})
	})

	describe('allow/block lists', () => {
		it('should allow specified emojis', async () => {
			const TestComponent = defineComponent({
				directives: { emoji: vEmoji },
				template: `<input v-emoji="{ allowList: ['😊', '👍'] }" type="text" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('Test 😊 👎 Message')

			// 😊 should be kept, 👎 should be stripped
			expect(input.element.value).toBe('Test 😊  Message')
		})

		it('should block specified emojis', async () => {
			const TestComponent = defineComponent({
				directives: { emoji: vEmoji },
				template: `<input v-emoji="{ blockList: ['👎'] }" type="text" />`,
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('Test 👎 Message')

			expect(input.element.value).toBe('Test  Message')
		})
	})

	describe('callbacks', () => {
		it('should call onEmoji callback when emoji is detected', async () => {
			const onEmoji = vi.fn()
			const TestComponent = defineComponent({
				directives: { emoji: vEmoji },
				template: `<input v-emoji="{ onEmoji }" type="text" />`,
				data() {
					return { onEmoji }
				},
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('Test 😊')

			expect(onEmoji).toHaveBeenCalled()
		})

		it('should call onStrip callback when text is changed', async () => {
			const onStrip = vi.fn()
			const TestComponent = defineComponent({
				directives: { emoji: vEmoji },
				template: `<input v-emoji="{ onStrip }" type="text" />`,
				data() {
					return { onStrip }
				},
			})

			const wrapper = mount(TestComponent)
			const input = wrapper.find('input')

			await input.setValue('Test 😊')

			expect(onStrip).toHaveBeenCalledWith('Test 😊', 'Test ')
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { emoji: vEmoji },
				template: `<input v-if="show" v-emoji type="text" />`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-emoji').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-emoji').exists()).toBe(false)
		})
	})
})
