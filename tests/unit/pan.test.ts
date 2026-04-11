import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vPan } from '../../src/directives/pan'

// Helper to create touch events
function createTouchEvent(
	type: 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel',
	touches: Array<{ clientX: number; clientY: number; identifier: number }>
): TouchEvent {
	const touchList = touches.map((t) => ({
		clientX: t.clientX,
		clientY: t.clientY,
		identifier: t.identifier,
		target: document.body,
	})) as unknown as Touch[]

	return new TouchEvent(type, {
		touches: touchList as unknown as TouchList,
		bubbles: true,
		cancelable: true,
	})
}

// Helper to create mouse events
function createMouseEvent(type: string, x: number, y: number): MouseEvent {
	return new MouseEvent(type, {
		clientX: x,
		clientY: y,
		bubbles: true,
		cancelable: true,
	})
}

describe('v-pan', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should add v-pan class on mount', () => {
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan>Pan me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').classes()).toContain('v-pan')
		})

		it('should accept function as handler', () => {
			const onPan = vi.fn()
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="onPan">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pan').exists()).toBe(true)
		})

		it('should accept options object', () => {
			const onPan = vi.fn()
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, threshold: 20 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pan').exists()).toBe(true)
		})
	})

	describe('options', () => {
		it('should use custom threshold', () => {
			const onPan = vi.fn()
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, threshold: 50 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pan').exists()).toBe(true)
		})

		it('should constrain direction', () => {
			const onPan = vi.fn()
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, direction: 'horizontal' }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pan').exists()).toBe(true)
		})

		it('should support preventDefault option', () => {
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ preventDefault: false }">Pan me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pan').exists()).toBe(true)
		})

		it('should support stopPropagation option', () => {
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ stopPropagation: true }">Pan me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pan').exists()).toBe(true)
		})

		it('should support pointers option for touch only', () => {
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ pointers: ['touch'] }">Pan me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pan').exists()).toBe(true)
		})

		it('should support pointers option for mouse only', () => {
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ pointers: ['mouse'] }">Pan me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pan').exists()).toBe(true)
		})
	})

	describe('touch events', () => {
		it('should handle pan start with touch', async () => {
			const onStart = vi.fn()
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onStart, onPan, threshold: 5 }">Pan me</div>`,
				data() {
					return { onStart, onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move to trigger pan
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 150, clientY: 100, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onStart).toHaveBeenCalled()
			expect(onPan).toHaveBeenCalled()
		})

		it('should not trigger callback before threshold', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, threshold: 50 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move only a small distance
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 120, clientY: 100, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan).not.toHaveBeenCalled()
		})
	})

	describe('mouse events', () => {
		it('should handle pan with mouse', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start with mouse
			const startEvent = createMouseEvent('mousedown', 100, 100)
			el.dispatchEvent(startEvent)

			// Move
			const moveEvent = createMouseEvent('mousemove', 150, 100)
			document.dispatchEvent(moveEvent)

			expect(onPan).toHaveBeenCalled()

			// End
			const endEvent = createMouseEvent('mouseup', 150, 100)
			document.dispatchEvent(endEvent)
		})
	})

	describe('direction constraint', () => {
		it('should only trigger for horizontal movement when direction is horizontal', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, direction: 'horizontal', threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move horizontally
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 150, clientY: 100, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan).toHaveBeenCalled()
		})

		it('should not trigger for vertical movement when direction is horizontal', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, direction: 'horizontal', threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move vertically
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 100, clientY: 150, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan).not.toHaveBeenCalled()
		})

		it('should only trigger for vertical movement when direction is vertical', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, direction: 'vertical', threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move vertically
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 100, clientY: 150, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan).toHaveBeenCalled()
		})
	})

	describe('event modifiers', () => {
		it('should call preventDefault when preventDefault is true', async () => {
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ preventDefault: true }">Pan me</div>`,
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			const preventDefaultSpy = vi.spyOn(startEvent, 'preventDefault')
			el.dispatchEvent(startEvent)

			expect(preventDefaultSpy).toHaveBeenCalled()
		})

		it('should call stopPropagation when stopPropagation is true', async () => {
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ stopPropagation: true }">Pan me</div>`,
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			const stopPropagationSpy = vi.spyOn(startEvent, 'stopPropagation')
			el.dispatchEvent(startEvent)

			expect(stopPropagationSpy).toHaveBeenCalled()
		})
	})

	describe('pan event data', () => {
		it('should provide correct direction', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move right
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 150, clientY: 100, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan).toHaveBeenCalled()
			expect(onPan.mock.calls[0][0].direction).toBe('right')
		})

		it('should provide correct deltaX and deltaY', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 150, clientY: 130, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan).toHaveBeenCalled()
			const call = onPan.mock.calls[0][0]
			expect(call.deltaX).toBe(50)
			expect(call.deltaY).toBe(30)
		})

		it('should provide correct distance', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 130, clientY: 140, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan).toHaveBeenCalled()
			const call = onPan.mock.calls[0][0]
			// Distance should be sqrt(30^2 + 40^2) = 50
			expect(call.distance).toBeCloseTo(50, 0)
		})

		it('should provide isFirst flag on first pan', async () => {
			const onStart = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onStart, threshold: 5 }">Pan me</div>`,
				data() {
					return { onStart }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start and move
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			const moveEvent = createTouchEvent('touchmove', [{ clientX: 150, clientY: 100, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onStart).toHaveBeenCalled()
			expect(onStart.mock.calls[0][0].isFirst).toBe(true)
		})

		it('should provide velocity', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 150, clientY: 100, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan).toHaveBeenCalled()
			const call = onPan.mock.calls[0][0]
			expect(typeof call.velocity).toBe('number')
		})
	})

	describe('updated hook', () => {
		it('should update options when binding changes', async () => {
			const onPan1 = vi.fn()
			const onPan2 = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="currentHandler">Pan me</div>`,
				data() {
					return {
						currentHandler: onPan1,
					}
				},
			})

			const wrapper = mount(TestComponent)

			// Update handler
			await wrapper.setData({ currentHandler: onPan2 })

			// Verify component still has v-pan class
			expect(wrapper.find('.v-pan').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const onPan = vi.fn()
			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-if="show" v-pan="onPan">Pan me</div>`,
				data() {
					return { onPan, show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-pan').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-pan').exists()).toBe(false)
		})
	})

	describe('pointers option', () => {
		it('should not respond to mouse events when pointers is touch only', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, pointers: ['touch'], threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Try to start with mouse
			const startEvent = createMouseEvent('mousedown', 100, 100)
			el.dispatchEvent(startEvent)

			// Move
			const moveEvent = createMouseEvent('mousemove', 150, 100)
			document.dispatchEvent(moveEvent)

			expect(onPan).not.toHaveBeenCalled()
		})

		it('should not respond to touch events when pointers is mouse only', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, pointers: ['mouse'], threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Try to start with touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 150, clientY: 100, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan).not.toHaveBeenCalled()
		})
	})

	describe('direction detection', () => {
		it('should detect left direction', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move left
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 50, clientY: 100, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan.mock.calls[0][0].direction).toBe('left')
		})

		it('should detect up direction', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move up
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 100, clientY: 50, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan.mock.calls[0][0].direction).toBe('up')
		})

		it('should detect down direction', async () => {
			const onPan = vi.fn()

			const TestComponent = defineComponent({
				directives: { pan: vPan },
				template: `<div v-pan="{ onPan, threshold: 5 }">Pan me</div>`,
				data() {
					return { onPan }
				},
			})

			const wrapper = mount(TestComponent)
			const el = wrapper.find('div').element as HTMLElement

			// Start touch
			const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }])
			el.dispatchEvent(startEvent)

			// Move down
			const moveEvent = createTouchEvent('touchmove', [{ clientX: 100, clientY: 150, identifier: 0 }])
			el.dispatchEvent(moveEvent)

			expect(onPan.mock.calls[0][0].direction).toBe('down')
		})
	})
})
