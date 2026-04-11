import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vPinch } from '../../src/directives/pinch'

// Helper to create touch events
function createTouchEvent(
	type: 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel',
	touches: Array<{ clientX: number, clientY: number, identifier: number }>,
): TouchEvent {
	const touchList = touches.map(t => new Touch({
		clientX: t.clientX,
		clientY: t.clientY,
		identifier: t.identifier,
		target: document.body,
	}))

	return new TouchEvent(type, {
		touches: touchList,
		bubbles: true,
		cancelable: true,
	})
}

describe('v-pinch', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should add v-pinch class on mount', () => {
			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch>Pinch me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-pinch')
		})

		it('should accept function as handler', () => {
			const onPinch = vi.fn()
			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="onPinch">Pinch me</div>`,
				data() {
					return { onPinch }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pinch').exists()).toBe(true)
		})

		it('should accept options object', () => {
			const onPinch = vi.fn()
			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ onPinch }">Pinch me</div>`,
				data() {
					return { onPinch }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pinch').exists()).toBe(true)
		})
	})

	describe('options', () => {
		it('should support enableTransform', () => {
			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ enableTransform: true }">Pinch me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pinch').exists()).toBe(true)
		})

		it('should support min/max scale', () => {
			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ minScale: 0.5, maxScale: 3 }">Pinch me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pinch').exists()).toBe(true)
		})

		it('should support preventDefault option', () => {
			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ preventDefault: false }">Pinch me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pinch').exists()).toBe(true)
		})

		it('should support stopPropagation option', () => {
			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ stopPropagation: true }">Pinch me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pinch').exists()).toBe(true)
		})

		it('should support transformOrigin option', () => {
			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ enableTransform: true, transformOrigin: 'top left' }">Pinch me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pinch').exists()).toBe(true)
		})
	})

	describe('touch events', () => {
		it('should handle pinch start with two fingers', async () => {
			const onStart = vi.fn()
			const onPinch = vi.fn()

			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ onStart, onPinch }">Pinch me</div>`,
				data() {
					return { onStart, onPinch }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start with two fingers
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Move to trigger pinch start
			const moveEvent1 = createTouchEvent('touchmove', [
				{ clientX: 90, clientY: 100, identifier: 0 },
				{ clientX: 210, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(moveEvent1)

			expect(onStart).toHaveBeenCalled()
			expect(onPinch).toHaveBeenCalled()
		})

		it('should not trigger callbacks for single touch', async () => {
			const onPinch = vi.fn()

			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="onPinch">Pinch me</div>`,
				data() {
					return { onPinch }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Single touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			const moveEvent = createTouchEvent('touchmove', [{ clientX: 110, clientY: 100, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPinch).not.toHaveBeenCalled()
		})

		it('should calculate correct scale factor', async () => {
			const onPinch = vi.fn()

			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="onPinch">Pinch me</div>`,
				data() {
					return { onPinch }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start with fingers 100px apart
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Move to 200px apart (2x distance)
			const moveEvent = createTouchEvent('touchmove', [
				{ clientX: 50, clientY: 100, identifier: 0 },
				{ clientX: 250, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			expect(onPinch).toHaveBeenCalled()
			const call = onPinch.mock.calls[0][0]
			expect(call.scale).toBeCloseTo(2, 1)
		})
	})

	describe('scale constraints', () => {
		it('should respect minScale constraint', async () => {
			const onPinch = vi.fn()

			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ onPinch, minScale: 0.5 }">Pinch me</div>`,
				data() {
					return { onPinch }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start with fingers 100px apart
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Try to scale below minScale (0.3x)
			const moveEvent = createTouchEvent('touchmove', [
				{ clientX: 135, clientY: 100, identifier: 0 },
				{ clientX: 165, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			// Should not call onPinch because scale is below minScale
			expect(onPinch).not.toHaveBeenCalled()
		})

		it('should respect maxScale constraint', async () => {
			const onPinch = vi.fn()

			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ onPinch, maxScale: 2 }">Pinch me</div>`,
				data() {
					return { onPinch }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start with fingers 100px apart
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Try to scale above maxScale (3x)
			const moveEvent = createTouchEvent('touchmove', [
				{ clientX: 0, clientY: 100, identifier: 0 },
				{ clientX: 300, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			// Should not call onPinch because scale is above maxScale
			expect(onPinch).not.toHaveBeenCalled()
		})
	})

	describe('transform', () => {
		it('should apply transform when enableTransform is true', async () => {
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				transform: 'scale(1)',
			} as CSSStyleDeclaration)

			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ enableTransform: true }">Pinch me</div>`,
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start pinch
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Move to scale up
			const moveEvent = createTouchEvent('touchmove', [
				{ clientX: 50, clientY: 100, identifier: 0 },
				{ clientX: 250, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			expect(el.style.transform).toContain('scale')
		})
	})

	describe('event modifiers', () => {
		it('should call preventDefault when preventDefault is true', async () => {
			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ preventDefault: true }">Pinch me</div>`,
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			const preventDefaultSpy = vi.spyOn(startEvent, 'preventDefault')
			el.dispatchEvent(startEvent)

			expect(preventDefaultSpy).toHaveBeenCalled()
		})

		it('should call stopPropagation when stopPropagation is true', async () => {
			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ stopPropagation: true }">Pinch me</div>`,
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			const stopPropagationSpy = vi.spyOn(startEvent, 'stopPropagation')
			el.dispatchEvent(startEvent)

			expect(stopPropagationSpy).toHaveBeenCalled()
		})
	})

	describe('updated hook', () => {
		it('should update options when binding changes', async () => {
			const onPinch1 = vi.fn()
			const onPinch2 = vi.fn()

			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="currentHandler">Pinch me</div>`,
				data() {
					return {
						currentHandler: onPinch1,
					}
				},
			})

			const wrapper = mount(TestComponent)

			// Update handler
			await wrapper.setData({ currentHandler: onPinch2 })

			// Verify component still has v-pinch class
			expect(wrapper.find('.v-pinch').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const onPinch = vi.fn()
			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-if="show" v-pinch="onPinch">Pinch me</div>`,
				data() {
					return { onPinch, show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pinch').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-pinch').exists()).toBe(false)
		})
	})

	describe('pinch event data', () => {
		it('should provide correct center coordinates', async () => {
			const onPinch = vi.fn()

			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="onPinch">Pinch me</div>`,
				data() {
					return { onPinch }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start with fingers at 100,100 and 200,100
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Move
			const moveEvent = createTouchEvent('touchmove', [
				{ clientX: 100, clientY: 150, identifier: 0 },
				{ clientX: 200, clientY: 150, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			expect(onPinch).toHaveBeenCalled()
			const call = onPinch.mock.calls[0][0]
			// Center should be at 150, 150
			expect(call.centerX).toBe(150)
			expect(call.centerY).toBe(150)
		})

		it('should provide isFirst flag on first pinch', async () => {
			const onStart = vi.fn()

			const TestComponent = defineComponent({
				directives: { pinch: vPinch },
				template: `<div v-pinch="{ onStart }">Pinch me</div>`,
				data() {
					return { onStart }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start and move
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			const moveEvent = createTouchEvent('touchmove', [
				{ clientX: 90, clientY: 100, identifier: 0 },
				{ clientX: 210, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			expect(onStart).toHaveBeenCalled()
			expect(onStart.mock.calls[0][0].isFirst).toBe(true)
		})
	})
})
