import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vFullscreen } from '../../src/directives/fullscreen'

// Mock fullscreen APIs
const mockFullscreenElement = { value: null as Element | null }
const mockFullscreenEnabled = { value: true }

Object.defineProperty(document, 'fullscreenEnabled', {
	get: () => mockFullscreenEnabled.value,
	configurable: true,
})

Object.defineProperty(document, 'fullscreenElement', {
	get: () => mockFullscreenElement.value,
	configurable: true,
})

describe('v-fullscreen', () => {
	beforeEach(() => {
		mockFullscreenElement.value = null
		mockFullscreenEnabled.value = true
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should add fullscreen class on mount', () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen>Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-fullscreen')
		})

		it('should add toggleFullscreen method to element', () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen>Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			expect(typeof element.toggleFullscreen).toBe('function')
		})

		it('should not initialize if fullscreen is not supported', () => {
			mockFullscreenEnabled.value = false

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen>Content</div>`,
			})

			const wrapper = mount(TestComponent)

			// Should not add v-fullscreen class if not supported
			expect(wrapper.find('div').element.classList.contains('v-fullscreen')).toBe(false)
		})
	})

	describe('options', () => {
		it('should use custom fullscreen class', () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ fullscreenClass: 'my-fullscreen' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-fullscreen')
		})

		it('should accept initial state', () => {
			const requestFullscreen = vi.fn().mockResolvedValue(undefined)
			HTMLElement.prototype.requestFullscreen = requestFullscreen

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ initialState: true }">Content</div>`,
			})

			mount(TestComponent)

			expect(requestFullscreen).toHaveBeenCalled()
		})

		it('should accept boolean binding', () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="true">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-fullscreen')
		})

		it('should support toggleKey option', () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ toggleKey: 'f' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-fullscreen')
		})

		it('should support disabled toggleKey', () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ toggleKey: false }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-fullscreen')
		})
	})

	describe('callbacks', () => {
		it('should call onEnter when entering fullscreen', async () => {
			const onEnter = vi.fn()
			const requestFullscreen = vi.fn().mockResolvedValue(undefined)
			HTMLElement.prototype.requestFullscreen = requestFullscreen

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ onEnter }">Content</div>`,
				data() {
					return { onEnter }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			// Toggle fullscreen
			await element.toggleFullscreen()

			// Simulate fullscreen change
			mockFullscreenElement.value = element
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(onEnter).toHaveBeenCalled()
		})

		it('should call onExit when exiting fullscreen', async () => {
			const onExit = vi.fn()
			const requestFullscreen = vi.fn().mockResolvedValue(undefined)
			const exitFullscreen = vi.fn().mockResolvedValue(undefined)
			HTMLElement.prototype.requestFullscreen = requestFullscreen
			document.exitFullscreen = exitFullscreen

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ onExit }">Content</div>`,
				data() {
					return { onExit }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			// First enter fullscreen
			await element.toggleFullscreen()
			mockFullscreenElement.value = element
			document.dispatchEvent(new Event('fullscreenchange'))

			// Then exit
			await element.toggleFullscreen()
			mockFullscreenElement.value = null
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(onExit).toHaveBeenCalled()
		})

		it('should call onChange when fullscreen state changes', async () => {
			const onChange = vi.fn()
			const requestFullscreen = vi.fn().mockResolvedValue(undefined)
			HTMLElement.prototype.requestFullscreen = requestFullscreen

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ onChange }">Content</div>`,
				data() {
					return { onChange }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			// Toggle fullscreen
			await element.toggleFullscreen()

			// Simulate fullscreen change
			mockFullscreenElement.value = element
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(onChange).toHaveBeenCalledWith(true)
		})
	})

	describe('keyboard handling', () => {
		it('should exit fullscreen on Escape key by default', async () => {
			const exitFullscreen = vi.fn().mockResolvedValue(undefined)
			document.exitFullscreen = exitFullscreen
			const requestFullscreen = vi.fn().mockResolvedValue(undefined)
			HTMLElement.prototype.requestFullscreen = requestFullscreen

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen>Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			// Enter fullscreen
			await element.toggleFullscreen()
			mockFullscreenElement.value = element
			document.dispatchEvent(new Event('fullscreenchange'))

			// Press Escape
			const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
			document.dispatchEvent(escapeEvent)

			expect(exitFullscreen).toHaveBeenCalled()
		})

		it('should use custom toggleKey', async () => {
			const exitFullscreen = vi.fn().mockResolvedValue(undefined)
			document.exitFullscreen = exitFullscreen
			const requestFullscreen = vi.fn().mockResolvedValue(undefined)
			HTMLElement.prototype.requestFullscreen = requestFullscreen

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ toggleKey: 'f' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			// Enter fullscreen
			await element.toggleFullscreen()
			mockFullscreenElement.value = element
			document.dispatchEvent(new Event('fullscreenchange'))

			// Press custom key
			const keyEvent = new KeyboardEvent('keydown', { key: 'f' })
			document.dispatchEvent(keyEvent)

			expect(exitFullscreen).toHaveBeenCalled()
		})

		it('should not respond to keyboard when toggleKey is false', async () => {
			const exitFullscreen = vi.fn().mockResolvedValue(undefined)
			document.exitFullscreen = exitFullscreen
			const requestFullscreen = vi.fn().mockResolvedValue(undefined)
			HTMLElement.prototype.requestFullscreen = requestFullscreen

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ toggleKey: false }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			// Enter fullscreen
			await element.toggleFullscreen()
			mockFullscreenElement.value = element
			document.dispatchEvent(new Event('fullscreenchange'))

			// Press Escape
			const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
			document.dispatchEvent(escapeEvent)

			expect(exitFullscreen).not.toHaveBeenCalled()
		})
	})

	describe('updated hook', () => {
		it('should update options when binding changes', async () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="currentOptions">Content</div>`,
				data() {
					return {
						currentOptions: { fullscreenClass: 'class-a' },
					}
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ currentOptions: { fullscreenClass: 'class-b' } })

			expect(wrapper.find('.v-fullscreen').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-if="show" v-fullscreen>Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-fullscreen').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-fullscreen').exists()).toBe(false)
		})

		it('should exit fullscreen on unmount', async () => {
			const exitFullscreen = vi.fn().mockResolvedValue(undefined)
			document.exitFullscreen = exitFullscreen
			const requestFullscreen = vi.fn().mockResolvedValue(undefined)
			HTMLElement.prototype.requestFullscreen = requestFullscreen

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-if="show" v-fullscreen>Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			// Enter fullscreen
			await element.toggleFullscreen()
			mockFullscreenElement.value = element
			document.dispatchEvent(new Event('fullscreenchange'))

			// Unmount
			await wrapper.setData({ show: false })
			await nextTick()

			expect(exitFullscreen).toHaveBeenCalled()
		})

		it('should remove toggleFullscreen method on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-if="show" v-fullscreen>Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			expect(typeof element.toggleFullscreen).toBe('function')

			await wrapper.setData({ show: false })
			await nextTick()

			expect(element.toggleFullscreen).toBeUndefined()
		})
	})

	describe('fullscreen class management', () => {
		it('should add active class when entering fullscreen', async () => {
			const requestFullscreen = vi.fn().mockResolvedValue(undefined)
			HTMLElement.prototype.requestFullscreen = requestFullscreen

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen>Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			// Toggle fullscreen
			await element.toggleFullscreen()

			// Simulate fullscreen change
			mockFullscreenElement.value = element
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(wrapper.find('div').classes()).toContain('v-fullscreen--active')
		})

		it('should use custom fullscreen class', async () => {
			const requestFullscreen = vi.fn().mockResolvedValue(undefined)
			HTMLElement.prototype.requestFullscreen = requestFullscreen

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen="{ fullscreenClass: 'my-active' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			// Toggle fullscreen
			await element.toggleFullscreen()

			// Simulate fullscreen change
			mockFullscreenElement.value = element
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(wrapper.find('div').classes()).toContain('my-active')
		})

		it('should remove active class when exiting fullscreen', async () => {
			const requestFullscreen = vi.fn().mockResolvedValue(undefined)
			const exitFullscreen = vi.fn().mockResolvedValue(undefined)
			HTMLElement.prototype.requestFullscreen = requestFullscreen
			document.exitFullscreen = exitFullscreen

			const TestComponent = defineComponent({
				directives: { fullscreen: vFullscreen },
				template: `<div v-fullscreen>Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as any

			// Enter fullscreen
			await element.toggleFullscreen()
			mockFullscreenElement.value = element
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(wrapper.find('div').classes()).toContain('v-fullscreen--active')

			// Exit fullscreen
			await element.toggleFullscreen()
			mockFullscreenElement.value = null
			document.dispatchEvent(new Event('fullscreenchange'))

			expect(wrapper.find('div').classes()).not.toContain('v-fullscreen--active')
		})
	})
})
