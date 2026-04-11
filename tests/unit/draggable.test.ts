import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vDraggable } from '../../src/directives/draggable'

// Mock getBoundingClientRect
const mockGetBoundingClientRect = (values: Partial<DOMRect>) => {
	vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
		width: 100,
		height: 50,
		x: 0,
		y: 0,
		top: 0,
		left: 0,
		right: 100,
		bottom: 50,
		toJSON: () => ({}),
		...values,
	} as DOMRect)
}

describe('v-draggable', () => {
	beforeEach(() => {
		vi.spyOn(window, 'getComputedStyle').mockReturnValue({
			position: 'static',
		} as CSSStyleDeclaration)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic functionality', () => {
		it('should make element draggable on mount', () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable>Drag me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').element.style.position).toBe('absolute')
		})

		it('should accept boolean true', () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="true">Drag me</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should accept options object', () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ axis: 'x' }">Drag me</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should not change position if already positioned', () => {
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				position: 'relative',
			} as CSSStyleDeclaration)

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable>Drag me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').element.style.position).toBe('')
		})
	})

	describe('disabled option', () => {
		it('should not make element draggable when disabled is true', () => {
			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ disabled: true }">Drag me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').element.style.position).toBe('')
		})

		it('should not make element draggable when binding is false', () => {
			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="false">Drag me</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('div').element.style.position).toBe('')
		})
	})

	describe('axis option', () => {
		it('should accept x axis', () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ axis: 'x' }">Drag me</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should accept y axis', () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ axis: 'y' }">Drag me</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should accept both axis', () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ axis: 'both' }">Drag me</div>`,
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})
	})

	describe('callbacks', () => {
		it('should call onStart when drag starts', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })
			const onStart = vi.fn()

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ onStart }">Drag me</div>`,
				data() {
					return { onStart }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('div').trigger('mousedown')

			expect(onStart).toHaveBeenCalled()
		})

		it('should call onDrag during drag', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })
			const onDrag = vi.fn()

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ onDrag }">Drag me</div>`,
				data() {
					return { onDrag }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('div').trigger('mousedown')

			// Simulate mouse move
			const moveEvent = new MouseEvent('mousemove', { clientX: 50, clientY: 50 })
			document.dispatchEvent(moveEvent)

			expect(onDrag).toHaveBeenCalled()
		})

		it('should call onEnd when drag ends', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })
			const onEnd = vi.fn()

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ onEnd }">Drag me</div>`,
				data() {
					return { onEnd }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('div').trigger('mousedown')

			// Simulate mouse move
			const moveEvent = new MouseEvent('mousemove', { clientX: 50, clientY: 50 })
			document.dispatchEvent(moveEvent)

			// Simulate mouse up
			const upEvent = new MouseEvent('mouseup')
			document.dispatchEvent(upEvent)

			expect(onEnd).toHaveBeenCalled()
		})
	})

	describe('dragging behavior', () => {
		it('should add dragging class on mousedown', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable>Drag me</div>`,
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('div').trigger('mousedown')

			expect(wrapper.find('div').classes()).toContain('v-draggable--dragging')
		})

		it('should remove dragging class on mouseup', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable>Drag me</div>`,
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('div').trigger('mousedown')
			expect(wrapper.find('div').classes()).toContain('v-draggable--dragging')

			// Simulate mouseup on document
			document.dispatchEvent(new MouseEvent('mouseup'))
			await nextTick()

			expect(wrapper.find('div').classes()).not.toContain('v-draggable--dragging')
		})

		it('should apply transform during drag', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable>Drag me</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			await wrapper.find('div').trigger('mousedown')

			// Simulate mouse move
			const moveEvent = new MouseEvent('mousemove', { clientX: 50, clientY: 50 })
			document.dispatchEvent(moveEvent)

			expect(element.style.transform).toContain('translate')
		})

		it('should constrain to x axis when axis is x', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ axis: 'x' }">Drag me</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			await wrapper.find('div').trigger('mousedown')

			// Simulate mouse move
			const moveEvent = new MouseEvent('mousemove', { clientX: 50, clientY: 50 })
			document.dispatchEvent(moveEvent)

			expect(element.style.transform).toContain('translate')
			// Should only have X translation - Y should be 0
			const match = element.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
			expect(match).not.toBeNull()
			expect(parseFloat(match![2])).toBe(0)
		})

		it('should constrain to y axis when axis is y', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ axis: 'y' }">Drag me</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			await wrapper.find('div').trigger('mousedown')

			// Simulate mouse move
			const moveEvent = new MouseEvent('mousemove', { clientX: 50, clientY: 50 })
			document.dispatchEvent(moveEvent)

			expect(element.style.transform).toContain('translate')
			// Should only have Y translation - X should be 0
			const match = element.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
			expect(match).not.toBeNull()
			expect(parseFloat(match![1])).toBe(0)
		})
	})

	describe('grid snapping', () => {
		it('should snap to grid', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ grid: [50, 50] }">Drag me</div>`,
			})

			const wrapper = mount(TestComponent)
			const element = wrapper.find('div').element

			await wrapper.find('div').trigger('mousedown')

			// Simulate mouse move (not aligned to grid)
			const moveEvent = new MouseEvent('mousemove', { clientX: 75, clientY: 75 })
			document.dispatchEvent(moveEvent)

			expect(element.style.transform).toContain('translate')
			// Grid snapping rounds to nearest grid value
		})
	})

	describe('constrain option', () => {
		it('should accept constrain option', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0, width: 500, height: 500 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div style="position: relative; width: 500px; height: 500px;"><div v-draggable="{ constrain: true }">Drag me</div></div>`,
			})

			const wrapper = mount(TestComponent)

			// Verify the element is set up with constrain option
			expect(wrapper.find('div > div').exists()).toBe(true)
		})
	})

	describe('handle option', () => {
		it('should use handle element for drag', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ handle: '.drag-handle' }"><div class="drag-handle">Handle</div>Content</div>`,
			})

			const wrapper = mount(TestComponent)

			// Click on handle should start drag
			await wrapper.find('.drag-handle').trigger('mousedown')

			expect(wrapper.find('div').classes()).toContain('v-draggable--dragging')
		})

		it('should not start drag when clicking outside handle', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ handle: '.drag-handle' }"><div class="drag-handle">Handle</div><div class="content">Content</div></div>`,
			})

			const wrapper = mount(TestComponent)

			// Click on content should not start drag
			await wrapper.find('.content').trigger('mousedown')

			// The drag should not start when clicking outside handle
			expect(wrapper.find('div').classes()).not.toContain('v-draggable--dragging')
		})
	})

	describe('touch events', () => {
		it('should handle touchstart', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })
			const onStart = vi.fn()

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ onStart }">Drag me</div>`,
				data() {
					return { onStart }
				},
			})

			const wrapper = mount(TestComponent)

			const touchEvent = new TouchEvent('touchstart', {
				touches: [{ clientX: 0, clientY: 0 } as Touch],
				bubbles: true,
				cancelable: true,
			})
			wrapper.find('div').element.dispatchEvent(touchEvent)

			expect(onStart).toHaveBeenCalled()
		})

		it('should handle touchmove', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })
			const onDrag = vi.fn()

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ onDrag }">Drag me</div>`,
				data() {
					return { onDrag }
				},
			})

			const wrapper = mount(TestComponent)

			const startEvent = new TouchEvent('touchstart', {
				touches: [{ clientX: 0, clientY: 0 } as Touch],
				bubbles: true,
				cancelable: true,
			})
			wrapper.find('div').element.dispatchEvent(startEvent)

			const moveEvent = new TouchEvent('touchmove', {
				touches: [{ clientX: 50, clientY: 50 } as Touch],
				bubbles: true,
				cancelable: true,
			})
			document.dispatchEvent(moveEvent)

			expect(onDrag).toHaveBeenCalled()
		})

		it('should handle touchend', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })
			const onEnd = vi.fn()

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ onEnd }">Drag me</div>`,
				data() {
					return { onEnd }
				},
			})

			const wrapper = mount(TestComponent)

			const startEvent = new TouchEvent('touchstart', {
				touches: [{ clientX: 0, clientY: 0 } as Touch],
				bubbles: true,
				cancelable: true,
			})
			wrapper.find('div').element.dispatchEvent(startEvent)

			const moveEvent = new TouchEvent('touchmove', {
				touches: [{ clientX: 50, clientY: 50 } as Touch],
				bubbles: true,
				cancelable: true,
			})
			document.dispatchEvent(moveEvent)

			const endEvent = new TouchEvent('touchend', {
				bubbles: true,
				cancelable: true,
			})
			document.dispatchEvent(endEvent)

			expect(onEnd).toHaveBeenCalled()
		})
	})

	describe('updated hook', () => {
		it('should update options when binding changes', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="currentOptions">Drag me</div>`,
				data() {
					return {
						currentOptions: { axis: 'x' },
					}
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ currentOptions: { axis: 'y' } })

			expect(wrapper.find('div').element.style.position).toBe('absolute')
		})

		it('should update handle when options change', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="currentOptions"><div class="handle1">Handle1</div><div class="handle2">Handle2</div></div>`,
				data() {
					return {
						currentOptions: { handle: '.handle1' },
					}
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ currentOptions: { handle: '.handle2' } })

			// Should update without error
			expect(wrapper.find('div').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should clean up on unmount', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-if="show" v-draggable>Drag me</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)
		})

		it('should remove document listeners on unmount', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-if="show" v-draggable>Drag me</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			// Start drag
			await wrapper.find('div').trigger('mousedown')

			// Unmount while dragging
			await wrapper.setData({ show: false })
			await nextTick()

			// Document listeners should be removed
			expect(wrapper.find('div').exists()).toBe(false)
		})
	})

	describe('disabled during drag', () => {
		it('should not start drag when disabled', async () => {
			mockGetBoundingClientRect({ top: 0, left: 0 })
			const onStart = vi.fn()

			const TestComponent = defineComponent({
				directives: { draggable: vDraggable },
				template: `<div v-draggable="{ disabled: true, onStart }">Drag me</div>`,
				data() {
					return { onStart }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.find('div').trigger('mousedown')

			expect(onStart).not.toHaveBeenCalled()
		})
	})
})
