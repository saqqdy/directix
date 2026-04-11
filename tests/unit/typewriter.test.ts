import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vTypewriter } from '../../src/directives'

describe('v-typewriter', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('basic functionality', () => {
		it('should add v-typewriter class on mount', () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="'Hello'"></span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').classes()).toContain('v-typewriter')
		})

		it('should accept string as binding', () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="'Hello World'"></span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').classes()).toContain('v-typewriter')
		})

		it('should accept options object', () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hello' }"></span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').classes()).toContain('v-typewriter')
		})

		it('should clear initial content', () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="'Hello'">Initial content</span>`,
			})

			const wrapper = mount(TestComponent)
			// Content should be cleared (except cursor)
			expect(wrapper.find('span').text()).not.toContain('Initial content')
		})
	})

	describe('typing animation', () => {
		it('should type characters one by one', async () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hi', speed: 50 }"></span>`,
			})

			const wrapper = mount(TestComponent)
			const span = wrapper.find('span')

			// Initially empty (except cursor)
			expect(span.text().replace('|', '').replace('_', '')).toBe('')

			// After first character
			vi.advanceTimersByTime(50)
			await nextTick()

			expect(span.text()).toContain('H')

			// After second character
			vi.advanceTimersByTime(50)
			await nextTick()

			expect(span.text()).toContain('Hi')
		})

		it('should complete typing after duration', async () => {
			const text = 'Hello'
			const speed = 50
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: '${text}', speed: ${speed} }"></span>`,
			})

			const wrapper = mount(TestComponent)

			// Advance past all characters
			vi.advanceTimersByTime(text.length * speed + 100)
			await nextTick()

			expect(wrapper.find('span').text()).toContain('Hello')
		})

		it('should respect delay option', async () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hi', delay: 200, speed: 50 }"></span>`,
			})

			const wrapper = mount(TestComponent)
			const span = wrapper.find('span')

			// Before delay
			vi.advanceTimersByTime(100)
			await nextTick()

			expect(span.text().replace('|', '')).toBe('')

			// After delay + first character
			vi.advanceTimersByTime(150)
			await nextTick()

			expect(span.text()).toContain('H')
		})
	})

	describe('cursor options', () => {
		it('should show cursor by default', () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="'Hello'"></span>`,
			})

			const wrapper = mount(TestComponent)
			const cursor = wrapper.find('.v-typewriter__cursor')

			expect(cursor.exists()).toBe(true)
			expect(cursor.text()).toBe('|')
		})

		it('should use custom cursor', () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hello', cursor: '_' }"></span>`,
			})

			const wrapper = mount(TestComponent)
			const cursor = wrapper.find('.v-typewriter__cursor')

			expect(cursor.text()).toBe('_')
		})

		it('should hide cursor when false', () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hello', cursor: false }"></span>`,
			})

			const wrapper = mount(TestComponent)
			const cursor = wrapper.find('.v-typewriter__cursor')

			expect(cursor.exists()).toBe(false)
		})

		it('should add blink animation by default', () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="'Hello'"></span>`,
			})

			const wrapper = mount(TestComponent)
			const cursor = wrapper.find('.v-typewriter__cursor')

			expect((cursor.element as HTMLElement).style.animation).toContain('v-typewriter-blink')
		})

		it('should disable blink when cursorBlink is false', () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hello', cursorBlink: false }"></span>`,
			})

			const wrapper = mount(TestComponent)
			const cursor = wrapper.find('.v-typewriter__cursor')

			expect((cursor.element as HTMLElement).style.animation).toBe('')
		})
	})

	describe('callbacks', () => {
		it('should call onStart callback', async () => {
			const onStart = vi.fn()
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hi', onStart }"></span>`,
				data() {
					return { onStart }
				},
			})

			mount(TestComponent)

			// Wait for delay and start
			vi.advanceTimersByTime(100)
			await nextTick()

			expect(onStart).toHaveBeenCalled()
		})

		it('should call onComplete callback', async () => {
			const onComplete = vi.fn()
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hi', speed: 50, onComplete }"></span>`,
				data() {
					return { onComplete }
				},
			})

			mount(TestComponent)

			vi.advanceTimersByTime(200)
			await nextTick()

			expect(onComplete).toHaveBeenCalled()
		})

		it('should call onType callback for each character', async () => {
			const onType = vi.fn()
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hi', speed: 50, onType }"></span>`,
				data() {
					return { onType }
				},
			})

			mount(TestComponent)

			vi.advanceTimersByTime(200)
			await nextTick()

			expect(onType).toHaveBeenCalledTimes(2)
		})

		it('should call onDeleteStart callback in loop mode', async () => {
			const onDeleteStart = vi.fn()
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hi', loop: true, speed: 50, deleteDelay: 50, onDeleteStart }"></span>`,
				data() {
					return { onDeleteStart }
				},
			})

			mount(TestComponent)

			// Type + delay
			vi.advanceTimersByTime(200)
			await nextTick()

			expect(onDeleteStart).toHaveBeenCalled()
		})

		it('should call onDeleteComplete callback in loop mode', async () => {
			const onDeleteComplete = vi.fn()
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hi', loop: true, speed: 50, deleteSpeed: 30, deleteDelay: 50, onDeleteComplete }"></span>`,
				data() {
					return { onDeleteComplete }
				},
			})

			mount(TestComponent)

			// Type + delay + delete
			vi.advanceTimersByTime(300)
			await nextTick()

			expect(onDeleteComplete).toHaveBeenCalled()
		})
	})

	describe('speed options', () => {
		it('should use custom typing speed', async () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text: 'Hello', speed: 100 }"></span>`,
			})

			const wrapper = mount(TestComponent)

			// 100ms per char * 5 chars = 500ms
			vi.advanceTimersByTime(550)
			await nextTick()

			expect(wrapper.find('span').text()).toContain('Hello')
		})
	})

	describe('update', () => {
		it('should restart animation when text changes', async () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="{ text, speed: 50 }"></span>`,
				data() {
					return { text: 'Hello' }
				},
			})

			const wrapper = mount(TestComponent)
			const span = wrapper.find('span')

			// Complete first animation
			vi.advanceTimersByTime(300)
			await nextTick()

			expect(span.text()).toContain('Hello')

			// Change text
			await wrapper.setData({ text: 'World' })
			await nextTick()

			// Should restart
			vi.advanceTimersByTime(300)
			await nextTick()

			expect(span.text()).toContain('World')
		})
	})

	describe('cleanup', () => {
		it('should clear timeout on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-if="show" v-typewriter="{ text: 'Hello', speed: 50 }"></span>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('span').exists()).toBe(false)
		})

		it('should remove class on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-if="show" v-typewriter="'Hello'"></span>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('span').classes()).toContain('v-typewriter')

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('span').exists()).toBe(false)
		})
	})

	describe('empty text', () => {
		it('should not animate when text is empty', () => {
			const TestComponent = defineComponent({
				directives: { typewriter: vTypewriter },
				template: `<span v-typewriter="''"></span>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('span').classes()).not.toContain('v-typewriter')
		})
	})
})
