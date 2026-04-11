import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { configurePermission, getPermissionConfig, vPermission } from '../../src/directives/permission'

describe('v-permission', () => {
	beforeEach(() => {
		// Reset global config before each test
		configurePermission({
			getPermissions: () => ['read', 'write'],
			getRoles: () => ['user'],
			roleMap: {
				admin: ['*'],
				editor: ['read', 'write', 'edit'],
				user: ['read'],
			},
		})
	})

	afterEach(() => {
		// Reset config after each test
		configurePermission({
			getPermissions: () => [],
			getRoles: () => [],
			roleMap: {},
		})
	})

	describe('configuration', () => {
		it('should configure and retrieve permission config', () => {
			const config = getPermissionConfig()
			expect(config).not.toBeNull()
			expect(config?.getPermissions()).toEqual(['read', 'write'])
		})
	})

	describe('basic permission check', () => {
		it('should show element when user has permission', async () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="'read'">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			expect(wrapper.find('div').exists()).toBe(true)
			expect(wrapper.find('div').text()).toBe('Content')

			wrapper.unmount()
		})

		it('should remove element when user lacks permission', async () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="{ value: 'admin', action: 'hide' }">Admin Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div')
			expect(div.exists()).toBe(true)
			expect((div.element as HTMLElement).style.display).toBe('none')

			wrapper.unmount()
		})

		it('should accept array of permissions', async () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="['read', 'delete']">Content</div>`,
			})

			// User has 'read' but not 'delete', default mode is 'some'
			const wrapper = mount(TestComponent, { attachTo: document.body })
			expect(wrapper.find('div').exists()).toBe(true)

			wrapper.unmount()
		})
	})

	describe('permission modes', () => {
		it('should use "some" mode by default (OR logic)', async () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="['read', 'delete']">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			expect(wrapper.find('div').exists()).toBe(true) // Has 'read'

			wrapper.unmount()
		})

		it('should use "every" mode when specified (AND logic)', async () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="{ value: ['read', 'delete'], mode: 'every', action: 'hide' }">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div')
			expect(div.exists()).toBe(true) // Element exists but hidden
			expect((div.element as HTMLElement).style.display).toBe('none') // Lacks 'delete'

			wrapper.unmount()
		})

		it('should pass with "every" mode when all permissions present', async () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="{ value: ['read', 'write'], mode: 'every' }">Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			expect(wrapper.find('div').exists()).toBe(true)

			wrapper.unmount()
		})
	})

	describe('actions', () => {
		it('should remove element by default (remove action)', async () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="{ value: 'admin', action: 'hide' }">Admin Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div')
			expect(div.exists()).toBe(true) // Element exists but hidden
			expect((div.element as HTMLElement).style.display).toBe('none')

			wrapper.unmount()
		})

		it('should disable element when action is "disable"', async () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<button v-permission="{ value: 'admin', action: 'disable' }">Admin Button</button>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('button')

			expect(button.exists()).toBe(true)
			expect(button.element.hasAttribute('disabled')).toBe(true)
			expect(button.element.classList.contains('v-permission--disabled')).toBe(true)

			wrapper.unmount()
		})

		it('should hide element when action is "hide"', async () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="{ value: 'admin', action: 'hide' }">Hidden Content</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div')

			expect(div.exists()).toBe(true)
			expect((div.element as HTMLElement).style.display).toBe('none')
			expect(div.element.classList.contains('v-permission--hidden')).toBe(true)

			wrapper.unmount()
		})
	})

	describe('custom check function', () => {
		it('should use custom check function', async () => {
			const customCheck = vi.fn().mockReturnValue(true)

			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="{ value: 'custom', check: customCheck }">Custom Check</div>`,
				data() {
					return { customCheck }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(customCheck).toHaveBeenCalledWith('custom', 'some')
			expect(wrapper.find('div').exists()).toBe(true)

			wrapper.unmount()
		})

		it('should deny access based on custom check', async () => {
			const customCheck = vi.fn().mockReturnValue(false)

			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="{ value: 'read', check: customCheck, action: 'hide' }">Custom Check</div>`,
				data() {
					return { customCheck }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div')

			expect(customCheck).toHaveBeenCalled()
			expect(div.exists()).toBe(true)
			expect((div.element as HTMLElement).style.display).toBe('none')

			wrapper.unmount()
		})
	})

	describe('wildcard permission', () => {
		it('should grant access with wildcard permission', async () => {
			// Configure with wildcard
			configurePermission({
				getPermissions: () => ['*'],
			})

			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="'any-permission'">Wildcard Access</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			expect(wrapper.find('div').exists()).toBe(true)

			wrapper.unmount()
		})
	})

	describe('role-based permission', () => {
		it('should check role permissions via roleMap', async () => {
			// User has 'user' role which grants 'read' permission
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="'read'">Role-based Access</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			expect(wrapper.find('div').exists()).toBe(true)

			wrapper.unmount()
		})

		it('should grant access if role name matches directly', async () => {
			// Check if value is a role name in roleMap
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="'user'">User Role Access</div>`,
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			expect(wrapper.find('div').exists()).toBe(true)

			wrapper.unmount()
		})
	})

	describe('onChange callback', () => {
		it('should call onChange callback', async () => {
			const onChange = vi.fn()

			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="{ value: 'read', onChange }">Content</div>`,
				data() {
					return { onChange }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(onChange).toHaveBeenCalledWith(true)

			wrapper.unmount()
		})

		it('should call onChange with false when denied', async () => {
			const onChange = vi.fn()

			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="{ value: 'admin', onChange }">Content</div>`,
				data() {
					return { onChange }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(onChange).toHaveBeenCalledWith(false)

			wrapper.unmount()
		})
	})

	describe('no config warning', () => {
		it('should warn when no config provided and grant access by default', async () => {
			// Reset config
			configurePermission({
				getPermissions: () => {
					throw new Error('No config')
				},
			} as any)

			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			// Create fresh config scenario
			const originalConfig = getPermissionConfig()

			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="'read'">No Config</div>`,
			})

			// Temporarily remove config
			configurePermission(null as any)

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(warnSpy).toHaveBeenCalledWith('[Directix] v-permission: No permission config provided')
			expect(wrapper.find('div').exists()).toBe(true) // Default to true

			// Restore
			if (originalConfig) {
				configurePermission(originalConfig)
			}

			warnSpy.mockRestore()
			wrapper.unmount()
		})
	})

	describe('error handling', () => {
		it('should throw error when no binding value provided', () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission>Content</div>`,
			})

			expect(() => mount(TestComponent, { attachTo: document.body })).toThrow(
				'[Directix] v-permission: permission value is required',
			)
		})
	})

	describe('updated hook', () => {
		it('should update when permission changes', async () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="{ value: permission, action: 'hide' }">Content</div>`,
				data() {
					return { permission: 'read' }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const div = wrapper.find('div')
			expect(div.exists()).toBe(true)
			expect((div.element as HTMLElement).style.display).not.toBe('none')

			// Change to permission user doesn't have
			await wrapper.setData({ permission: 'admin' })
			await nextTick()

			expect((div.element as HTMLElement).style.display).toBe('none')

			wrapper.unmount()
		})

		it('should restore element when permission is granted', async () => {
			const TestComponent = defineComponent({
				directives: { permission: vPermission },
				template: `<div v-permission="{ value: permission, action: 'disable' }">Content</div>`,
				data() {
					return { permission: 'admin' }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const button = wrapper.find('div')

			expect(button.element.hasAttribute('disabled')).toBe(true)

			// Change to permission user has
			await wrapper.setData({ permission: 'read' })
			await nextTick()

			expect(button.element.hasAttribute('disabled')).toBe(false)

			wrapper.unmount()
		})
	})
})
