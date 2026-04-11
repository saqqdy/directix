import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vRotateGesture } from '../../src/directives/rotate-gesture'

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

describe('v-rotate-gesture', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should add v-rotate-gesture class on mount', () => {
			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture>Rotate me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-rotate-gesture')
		})

		it('should accept function as handler', () => {
			const onRotate = vi.fn()
			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="onRotate">Rotate me</div>`,
				data() {
					return { onRotate }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-rotate-gesture').exists()).toBe(true)
		})

		it('should accept options object', () => {
			const onRotate = vi.fn()
			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="{ onRotate }">Rotate me</div>`,
				data() {
					return { onRotate }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-rotate-gesture').exists()).toBe(true)
		})
	})

	describe('options', () => {
		it('should support enableTransform', () => {
			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="{ enableTransform: true }">Rotate me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-rotate-gesture').exists()).toBe(true)
		})

		it('should support transformOrigin', () => {
			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="{ transformOrigin: 'top left' }">Rotate me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-rotate-gesture').exists()).toBe(true)
		})

		it('should support preventDefault option', () => {
			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="{ preventDefault: false }">Rotate me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-rotate-gesture').exists()).toBe(true)
		})

		it('should support stopPropagation option', () => {
			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="{ stopPropagation: true }">Rotate me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-rotate-gesture').exists()).toBe(true)
		})
	})

	describe('touch events', () => {
		it('should handle rotation start with two fingers', async () => {
			const onStart = vi.fn()
			const onRotate = vi.fn()

			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="{ onStart, onRotate }">Rotate me</div>`,
				data() {
					return { onStart, onRotate }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start with two fingers horizontal
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Move to rotate
			const moveEvent1 = createTouchEvent('touchmove', [
				{ clientX: 100, clientY: 50, identifier: 0 },
				{ clientX: 200, clientY: 150, identifier: 1 },
			])
			el.dispatchEvent(moveEvent1)

			expect(onStart).toHaveBeenCalled()
			expect(onRotate).toHaveBeenCalled()
		})

		it('should not trigger callbacks for single touch', async () => {
			const onRotate = vi.fn()

			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="onRotate">Rotate me</div>`,
				data() {
					return { onRotate }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Single touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			const moveEvent = createTouchEvent('touchmove', [{ clientX: 110, clientY: 100, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onRotate).not.toHaveBeenCalled()
		})

		it('should calculate correct angle', async () => {
			const onRotate = vi.fn()

			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="onRotate">Rotate me</div>`,
				data() {
					return { onRotate }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start horizontal
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Rotate 90 degrees clockwise
			const moveEvent = createTouchEvent('touchmove', [
				{ clientX: 100, clientY: 50, identifier: 0 },
				{ clientX: 100, clientY: 150, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			expect(onRotate).toHaveBeenCalled()
			const call = onRotate.mock.calls[0][0]
			// Angle should be around 90 degrees
			expect(Math.abs(call.angle)).toBeCloseTo(90, 0)
		})
	})

	describe('transform', () => {
		it('should apply transform when enableTransform is true', async () => {
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				transform: 'rotate(0deg)',
			} as CSSStyleDeclaration)

			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="{ enableTransform: true }">Rotate me</div>`,
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start rotation
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Move to rotate
			const moveEvent = createTouchEvent('touchmove', [
				{ clientX: 100, clientY: 50, identifier: 0 },
				{ clientX: 100, clientY: 150, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			expect(el.style.transform).toContain('rotate')
		})

		it('should use custom transformOrigin', async () => {
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				transform: 'rotate(0deg)',
			} as CSSStyleDeclaration)

			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="{ enableTransform: true, transformOrigin: 'top left' }">Rotate me</div>`,
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start rotation
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Move to rotate
			const moveEvent = createTouchEvent('touchmove', [
				{ clientX: 100, clientY: 50, identifier: 0 },
				{ clientX: 100, clientY: 150, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			expect(el.style.transformOrigin).toBe('top left')
		})
	})

	describe('event modifiers', () => {
		it('should call preventDefault when preventDefault is true', async () => {
			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="{ preventDefault: true }">Rotate me</div>`,
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
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="{ stopPropagation: true }">Rotate me</div>`,
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
			const onRotate1 = vi.fn()
			const onRotate2 = vi.fn()

			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="currentHandler">Rotate me</div>`,
				data() {
					return {
						currentHandler: onRotate1,
					}
				},
			})

			const wrapper = mount(TestComponent)

			// Update handler
			await wrapper.setData({ currentHandler: onRotate2 })

			// Verify component still has v-rotate-gesture class
			expect(wrapper.find('.v-rotate-gesture').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const onRotate = vi.fn()
			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-if="show" v-rotate-gesture="onRotate">Rotate me</div>`,
				data() {
					return { onRotate, show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-rotate-gesture').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-rotate-gesture').exists()).toBe(false)
		})
	})

	describe('rotation event data', () => {
		it('should provide correct center coordinates', async () => {
			const onRotate = vi.fn()

			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="onRotate">Rotate me</div>`,
				data() {
					return { onRotate }
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
				{ clientX: 100, clientY: 50, identifier: 0 },
				{ clientX: 200, clientY: 150, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			expect(onRotate).toHaveBeenCalled()
			const call = onRotate.mock.calls[0][0]
			// Center should be at 150, 100
			expect(call.centerX).toBe(150)
			expect(call.centerY).toBe(100)
		})

		it('should provide isFirst flag on first rotation', async () => {
			const onStart = vi.fn()

			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="{ onStart }">Rotate me</div>`,
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
				{ clientX: 100, clientY: 50, identifier: 0 },
				{ clientX: 100, clientY: 150, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			expect(onStart).toHaveBeenCalled()
			expect(onStart.mock.calls[0][0].isFirst).toBe(true)
		})

		it('should provide rotation relative to start', async () => {
			const onRotate = vi.fn()

			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="onRotate">Rotate me</div>`,
				data() {
					return { onRotate }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start horizontal
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Move to rotate
			const moveEvent = createTouchEvent('touchmove', [
				{ clientX: 100, clientY: 50, identifier: 0 },
				{ clientX: 100, clientY: 150, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			expect(onRotate).toHaveBeenCalled()
			const call = onRotate.mock.calls[0][0]
			// rotation should be the delta from initial angle
			expect(typeof call.rotation).toBe('number')
		})

		it('should provide radians value', async () => {
			const onRotate = vi.fn()

			const TestComponent = defineComponent({
				directives: { rotateGesture: vRotateGesture },
				template: `<div v-rotate-gesture="onRotate">Rotate me</div>`,
				data() {
					return { onRotate }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start horizontal
			const startEvent = createTouchEvent('touchstart', [
				{ clientX: 100, clientY: 100, identifier: 0 },
				{ clientX: 200, clientY: 100, identifier: 1 },
			])
			el.dispatchEvent(startEvent)

			// Move to rotate
			const moveEvent = createTouchEvent('touchmove', [
				{ clientX: 100, clientY: 50, identifier: 0 },
				{ clientX: 100, clientY: 150, identifier: 1 },
			])
			el.dispatchEvent(moveEvent)

			expect(onRotate).toHaveBeenCalled()
			const call = onRotate.mock.calls[0][0]
			expect(typeof call.radians).toBe('number')
		})
	})
})
