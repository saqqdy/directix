import type { ContextMenuItem } from '../../src/directives'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vContextMenu } from '../../src/directives'

describe('v-context-menu', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		// Clean up any leftover menus
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should mount without errors', () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="items">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should accept options object', () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="{ items }">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			expect(wrapper.find('div').exists()).toBe(true)
		})

		it('should show menu on contextmenu event', async () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }, { label: 'Paste' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="items">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			const menu = document.querySelector('.v-context-menu')
			expect(menu).not.toBeNull()
		})
	})

	describe('menu items', () => {
		it('should render menu items', async () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }, { label: 'Paste' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="items">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			const menuItems = document.querySelectorAll('.v-context-menu__item')
			expect(menuItems.length).toBe(2)
		})

		it('should render divider', async () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }, { label: '', divider: true }, { label: 'Delete' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="items">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			const divider = document.querySelector('.v-context-menu__divider')
			expect(divider).not.toBeNull()
		})

		it('should handle disabled items', async () => {
			const items: ContextMenuItem[] = [{ label: 'Copy', disabled: true }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="items">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			const menuItem = document.querySelector('.v-context-menu__item')
			expect(menuItem?.classList.contains('v-context-menu__item--disabled')).toBe(true)
		})

		it('should call handler on item click', async () => {
			const handler = vi.fn()
			const items: ContextMenuItem[] = [{ label: 'Copy', handler }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="items">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			const menuItem = document.querySelector('.v-context-menu__item') as HTMLElement
			menuItem?.click()

			expect(handler).toHaveBeenCalled()
		})

		it('should close menu after item click', async () => {
			const handler = vi.fn()
			const items: ContextMenuItem[] = [{ label: 'Copy', handler }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="items">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			const menuItem = document.querySelector('.v-context-menu__item') as HTMLElement
			menuItem?.click()

			await nextTick()

			const menu = document.querySelector('.v-context-menu')
			expect(menu).toBeNull()
		})
	})

	describe('options', () => {
		it('should use custom width', async () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="{ items, width: 200 }">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			const menu = document.querySelector('.v-context-menu') as HTMLElement
			expect(menu?.style.minWidth).toBe('200px')
		})

		it('should use custom class', async () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="{ items, class: 'custom-menu' }">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			const menu = document.querySelector('.v-context-menu')
			expect(menu?.classList.contains('custom-menu')).toBe(true)
		})

		it('should not show menu when disabled', async () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="{ items, disabled: true }">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			const menu = document.querySelector('.v-context-menu')
			expect(menu).toBeNull()
		})
	})

	describe('callbacks', () => {
		it('should call onBeforeShow callback', async () => {
			const onBeforeShow = vi.fn()
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="{ items, onBeforeShow }">Right click</div>`,
				data() {
					return { items, onBeforeShow }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			expect(onBeforeShow).toHaveBeenCalled()
		})

		it('should not show menu if onBeforeShow returns false', async () => {
			const onBeforeShow = vi.fn().mockReturnValue(false)
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="{ items, onBeforeShow }">Right click</div>`,
				data() {
					return { items, onBeforeShow }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			const menu = document.querySelector('.v-context-menu')
			expect(menu).toBeNull()
		})

		it('should call onAfterShow callback', async () => {
			const onAfterShow = vi.fn()
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="{ items, onAfterShow }">Right click</div>`,
				data() {
					return { items, onAfterShow }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			expect(onAfterShow).toHaveBeenCalled()
		})

		it('should call onHide callback when menu closes', async () => {
			const onHide = vi.fn()
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="{ items, onHide }">Right click</div>`,
				data() {
					return { items, onHide }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			// Click outside to close - need to advance timers for the setTimeout
			vi.advanceTimersByTime(10)
			document.body.click()

			vi.advanceTimersByTime(10)
			await nextTick()

			expect(onHide).toHaveBeenCalled()
		})
	})

	describe('click outside', () => {
		it('should close menu on click outside', async () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="items">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			expect(document.querySelector('.v-context-menu')).not.toBeNull()

			// Advance timers for the setTimeout in the directive
			vi.advanceTimersByTime(10)

			// Click outside
			document.body.click()

			vi.advanceTimersByTime(10)
			await nextTick()

			expect(document.querySelector('.v-context-menu')).toBeNull()
		})
	})

	describe('update', () => {
		it('should update items on binding change', async () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-context-menu="items">Right click</div>`,
				data() {
					return { items }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ items: [{ label: 'Paste' }] })
			await nextTick()

			const div = wrapper.find('div')
			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			const menuItem = document.querySelector('.v-context-menu__item')
			expect(menuItem?.textContent).toBe('Paste')
		})
	})

	describe('cleanup', () => {
		it('should remove event listener on unmount', async () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-if="show" v-context-menu="items">Right click</div>`,
				data() {
					return { show: true, items }
				},
			})

			const wrapper = mount(TestComponent)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('div').exists()).toBe(false)
		})

		it('should remove menu on unmount', async () => {
			const items: ContextMenuItem[] = [{ label: 'Copy' }]
			const TestComponent = defineComponent({
				directives: { contextMenu: vContextMenu },
				template: `<div v-if="show" v-context-menu="items">Right click</div>`,
				data() {
					return { show: true, items }
				},
			})

			const wrapper = mount(TestComponent)
			const div = wrapper.find('div')

			await div.trigger('contextmenu', {
				clientX: 100,
				clientY: 100,
			})

			await nextTick()

			expect(document.querySelector('.v-context-menu')).not.toBeNull()

			await wrapper.setData({ show: false })
			await nextTick()

			expect(document.querySelector('.v-context-menu')).toBeNull()
		})
	})
})
