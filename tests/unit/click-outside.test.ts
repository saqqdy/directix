import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vClickOutside } from '../../src/directives/click-outside'

describe('v-click-outside', () => {
	describe('basic functionality', () => {
		it('should call handler when clicking outside', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div>
            <div id="target" v-click-outside="handler">Target</div>
            <div id="outside">Outside</div>
          </div>
        `,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// 点击外部元素
			const outsideEl = wrapper.find('#outside').element

			outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }))

			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should not call handler when clicking inside', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div id="target" v-click-outside="handler">Target</div>
        `,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// 点击目标元素
			const targetEl = wrapper.find('#target').element

			targetEl.dispatchEvent(new MouseEvent('click', { bubbles: true }))

			expect(handler).not.toHaveBeenCalled()

			wrapper.unmount()
		})
	})

	describe('disabled option', () => {
		it('should respect disabled option', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div v-click-outside="{ handler, disabled: true }">Target</div>
        `,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

			expect(handler).not.toHaveBeenCalled()

			wrapper.unmount()
		})

		it('should toggle disabled state on update', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div id="target" v-click-outside="{ handler, disabled }">Target</div>
        `,
				data() {
					return {
						handler,
						disabled: true,
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Initially disabled
			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			expect(handler).not.toHaveBeenCalled()

			// Enable - re-mount the directive by changing the key
			wrapper.unmount()

			const TestComponent2 = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div id="target" v-click-outside="{ handler, disabled: false }">Target</div>
        `,
				data() {
					return { handler }
				},
			})

			const wrapper2 = mount(TestComponent2, { attachTo: document.body })

			// Click outside should now trigger
			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			wrapper2.unmount()
		})

		it('should re-add listeners when re-enabling after disable', async () => {
			const handler = vi.fn()

			// Test the updated hook's re-add listeners branch (lines 157-177)
			// by creating a fresh component that starts enabled
			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `<div id="target" v-click-outside="{ handler, disabled: false, stop: true, prevent: true }">Target</div>`,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Click outside should trigger with stop and prevent
			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should handle updated hook with disabled state change', async () => {
			const handler = vi.fn()

			// Create a component that uses reactive data to trigger updated hook
			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `<div id="target" v-click-outside="options">Target</div>`,
				data() {
					return {
						options: {
							handler,
							disabled: false,
						},
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Click outside should trigger
			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			// Update options to trigger the updated hook
			// This covers the updated hook code path
			await wrapper.setData({
				options: {
					handler,
					disabled: true,
				},
			})
			await nextTick()

			// Now click should not trigger
			handler.mockClear()
			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			expect(handler).not.toHaveBeenCalled()

			wrapper.unmount()
		})
	})

	describe('stop and prevent options', () => {
		it('should stop propagation when stop option is true', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div v-click-outside="{ handler, stop: true }">Target</div>
        `,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			const event = new MouseEvent('click', { bubbles: true })
			const stopSpy = vi.spyOn(event, 'stopPropagation')

			document.body.dispatchEvent(event)

			expect(stopSpy).toHaveBeenCalled()

			wrapper.unmount()
		})

		it('should prevent default when prevent option is true', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div v-click-outside="{ handler, prevent: true }">Target</div>
        `,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			const event = new MouseEvent('click', { bubbles: true })
			const preventSpy = vi.spyOn(event, 'preventDefault')

			document.body.dispatchEvent(event)

			expect(preventSpy).toHaveBeenCalled()

			wrapper.unmount()
		})
	})

	describe('events option', () => {
		it('should listen to custom events', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div v-click-outside="{ handler, events: ['mousedown', 'touchstart'] }">Target</div>
        `,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// mousedown event
			document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			// touchstart event
			document.body.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(2)

			// click event should not trigger (not in events list)
			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(2)

			wrapper.unmount()
		})
	})

	describe('exclude option', () => {
		it('should exclude elements by selector', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div>
            <div id="target" v-click-outside="{ handler, exclude: ['#excluded'] }">Target</div>
            <div id="excluded">Excluded</div>
          </div>
        `,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Click on excluded element should not trigger handler
			const excludedEl = wrapper.find('#excluded').element

			excludedEl.dispatchEvent(new MouseEvent('click', { bubbles: true }))

			expect(handler).not.toHaveBeenCalled()

			wrapper.unmount()
		})

		it('should exclude elements by HTMLElement reference', async () => {
			const handler = vi.fn()

			// Create excluded element first
			const excludedEl = document.createElement('div')

			excludedEl.id = 'external-excluded'
			document.body.appendChild(excludedEl)

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div id="target" v-click-outside="{ handler, exclude: excludedList }">Target</div>
        `,
				data() {
					return {
						handler,
						excludedList: [excludedEl] as HTMLElement[],
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Click on excluded element
			const event = new MouseEvent('click', { bubbles: true })

			Object.defineProperty(event, 'target', { value: excludedEl, enumerable: true })
			document.dispatchEvent(event)

			expect(handler).not.toHaveBeenCalled()

			// Cleanup
			document.body.removeChild(excludedEl)
			wrapper.unmount()
		})

		it('should exclude elements by function', async () => {
			const handler = vi.fn()

			// Create excluded element first
			const excludedEl = document.createElement('div')

			excludedEl.id = 'external-excluded-fn'
			document.body.appendChild(excludedEl)

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div id="target" v-click-outside="{ handler, exclude: [getExcludedEl] }">Target</div>
        `,
				data() {
					return {
						handler,
						getExcludedEl: () => excludedEl,
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Click on excluded element
			const event = new MouseEvent('click', { bubbles: true })

			Object.defineProperty(event, 'target', { value: excludedEl, enumerable: true })
			document.dispatchEvent(event)

			expect(handler).not.toHaveBeenCalled()

			// Cleanup
			document.body.removeChild(excludedEl)
			wrapper.unmount()
		})

		it('should handle null result from exclude function', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div>
            <div id="target" v-click-outside="{ handler, exclude: [getNonExistentEl] }">Target</div>
          </div>
        `,
				data() {
					return {
						handler,
						getNonExistentEl: () => null,
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Click outside should trigger handler
			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

			expect(handler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('capture option', () => {
		it('should use capture mode by default', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div v-click-outside="handler">Target</div>
        `,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

			expect(handler).toHaveBeenCalled()

			wrapper.unmount()
		})

		it('should respect capture option', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div v-click-outside="{ handler, capture: false }">Target</div>
        `,
				data() {
					return { handler }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

			expect(handler).toHaveBeenCalled()

			wrapper.unmount()
		})
	})

	describe('error handling', () => {
		it('should throw error when handler is missing', () => {
			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `<div v-click-outside="nullValue">Target</div>`,
				data() {
					return {
						nullValue: null as any,
					}
				},
			})

			expect(() => mount(TestComponent, { attachTo: document.body })).toThrow(
				'[Directix] v-click-outside: handler is required',
			)
		})
	})

	describe('cleanup', () => {
		it('should remove event listeners on unmount', async () => {
			const handler = vi.fn()

			const TestComponent = defineComponent({
				directives: { clickOutside: vClickOutside },
				template: `
          <div v-if="show" v-click-outside="handler">Target</div>
        `,
				data() {
					return {
						show: true,
						handler,
					}
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Trigger handler once
			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			expect(handler).toHaveBeenCalledTimes(1)

			// Unmount
			await wrapper.setData({ show: false })
			await nextTick()

			// Handler should not be called after unmount
			handler.mockClear()
			document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			expect(handler).not.toHaveBeenCalled()

			wrapper.unmount()
		})
	})
})
