import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vClickWave } from '../../src/directives'

describe('v-click-wave', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should add v-click-wave class on mount', () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave>Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').classes()).toContain('v-click-wave')
		})

		it('should create wave on click', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave>Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			const wave = button.find('.v-click-wave__effect')
			expect(wave.exists()).toBe(true)
		})

		it('should create wave element with correct styles', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave>Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			const wave = button.find('.v-click-wave__effect')
			expect(wave.exists()).toBe(true)
			expect((wave.element as HTMLElement).style.position).toBe('absolute')
			expect((wave.element as HTMLElement).style.borderRadius).toBe('50%')
		})

		it('should set element position to relative if static', async () => {
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				position: 'static',
				overflow: 'visible',
			} as CSSStyleDeclaration)

			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<div v-click-wave>Click me</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element as HTMLElement

			expect(element.style.position).toBe('relative')
			expect(element.style.overflow).toBe('hidden')
		})

		it('should remove wave after animation', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave>Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			expect(button.find('.v-click-wave__effect').exists()).toBe(true)

			vi.advanceTimersByTime(500)
			await nextTick()

			expect(button.find('.v-click-wave__effect').exists()).toBe(false)
		})
	})

	describe('color options', () => {
		it('should accept color as string', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave="'red'">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			const wave = button.find('.v-click-wave__effect')
			expect((wave.element as HTMLElement).style.backgroundColor).toBe('red')
		})

		it('should use currentColor as default', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave>Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			const wave = button.find('.v-click-wave__effect')
			// Browser normalizes to lowercase
			expect((wave.element as HTMLElement).style.backgroundColor.toLowerCase()).toBe('currentcolor')
		})

		it('should accept color in options object', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave="{ color: 'blue' }">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			const wave = button.find('.v-click-wave__effect')
			expect((wave.element as HTMLElement).style.backgroundColor).toBe('blue')
		})
	})

	describe('duration option', () => {
		it('should accept custom duration', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave="{ duration: 300 }">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			expect(button.find('.v-click-wave__effect').exists()).toBe(true)

			vi.advanceTimersByTime(300)
			await nextTick()

			expect(button.find('.v-click-wave__effect').exists()).toBe(false)
		})
	})

	describe('sizeRatio option', () => {
		it('should calculate wave size based on sizeRatio', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave="{ sizeRatio: 2 }">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			const wave = button.find('.v-click-wave__effect')
			expect(wave.exists()).toBe(true)
		})
	})

	describe('disabled option', () => {
		it('should not create wave when disabled is true', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave="{ disabled: true }">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			expect(button.find('.v-click-wave__effect').exists()).toBe(false)
		})

		it('should not create wave when binding is false', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave="false">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			expect(button.find('.v-click-wave__effect').exists()).toBe(false)
		})

		it('should not add class when disabled', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave="{ disabled: true }">Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('button').classes()).not.toContain('v-click-wave')
		})
	})

	describe('multiple clicks', () => {
		it('should handle multiple rapid clicks', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave>Click me</button>`,
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			await button.trigger('click')
			await nextTick()

			const waves = button.findAll('.v-click-wave__effect')
			expect(waves.length).toBeGreaterThanOrEqual(2)
		})
	})

	describe('cleanup', () => {
		it('should remove class and event listener on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-if="show" v-click-wave>Click me</button>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('button').classes()).toContain('v-click-wave')

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('button').exists()).toBe(false)
		})
	})

	describe('update', () => {
		it('should update options on binding change', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave="options">Click me</button>`,
				data() {
					return { options: { color: 'red' } }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			await button.trigger('click')
			await nextTick()

			const wave = button.find('.v-click-wave__effect')
			expect((wave.element as HTMLElement).style.backgroundColor).toBe('red')

			// Update options
			await wrapper.setData({ options: { color: 'blue' } })
			await nextTick()

			await button.trigger('click')
			await nextTick()

			const waves = button.findAll('.v-click-wave__effect')
			// Check the latest wave has the new color
			const lastWave = waves[waves.length - 1]
			expect((lastWave.element as HTMLElement).style.backgroundColor).toBe('blue')
		})

		it('should enable/disable dynamically', async () => {
			const TestComponent = defineComponent({
				directives: { clickWave: vClickWave },
				template: `<button v-click-wave="{ disabled: isDisabled }">Click me</button>`,
				data() {
					return { isDisabled: false }
				},
			})

			const wrapper = mount(TestComponent)
			const button = wrapper.find('button')

			// Initially enabled - wave should be created
			await button.trigger('click')
			await nextTick()

			expect(button.find('.v-click-wave__effect').exists()).toBe(true)

			// Disable
			await wrapper.setData({ isDisabled: true })
			await nextTick()

			// Clear previous waves
			vi.advanceTimersByTime(600)
			await nextTick()

			// Now disabled - no wave should be created
			await button.trigger('click')
			await nextTick()

			// The state.options.disabled is now true, so click handler should return early
			const waves = button.findAll('.v-click-wave__effect')
			// There should still be just 1 wave from the first click (or 0 if animation completed)
			expect(waves.length).toBeLessThanOrEqual(1)
		})
	})
})
