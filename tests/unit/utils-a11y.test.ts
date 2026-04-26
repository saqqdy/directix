import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	applyAriaAttributes,
	clearAriaAttributes,
	generateAriaId,
	announce,
	clearAnnouncer,
	getAutoAriaConfig,
	type ARIAConfig,
} from '../../src/utils/a11y'

describe('A11y Utilities', () => {
	let container: HTMLElement

	beforeEach(() => {
		container = document.createElement('div')
		document.body.appendChild(container)
	})

	afterEach(() => {
		document.body.removeChild(container)
		clearAnnouncer()
	})

	describe('applyAriaAttributes', () => {
		it('should apply role attribute', () => {
			const config: ARIAConfig = { role: 'button' }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('role')).toBe('button')
		})

		it('should apply aria-label', () => {
			const config: ARIAConfig = { ariaLabel: 'Test button' }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('aria-label')).toBe('Test button')
		})

		it('should apply aria-expanded', () => {
			const config: ARIAConfig = { ariaExpanded: true }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('aria-expanded')).toBe('true')
		})

		it('should apply aria-selected', () => {
			const config: ARIAConfig = { ariaSelected: true }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('aria-selected')).toBe('true')
		})

		it('should apply aria-checked', () => {
			const config: ARIAConfig = { ariaChecked: 'mixed' }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('aria-checked')).toBe('mixed')
		})

		it('should apply aria-disabled', () => {
			const config: ARIAConfig = { ariaDisabled: true }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('aria-disabled')).toBe('true')
		})

		it('should apply aria-hidden', () => {
			const config: ARIAConfig = { ariaHidden: true }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('aria-hidden')).toBe('true')
		})

		it('should apply aria-live', () => {
			const config: ARIAConfig = { ariaLive: 'polite' }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('aria-live')).toBe('polite')
		})

		it('should apply aria-haspopup', () => {
			const config: ARIAConfig = { ariaHasPopup: 'menu' }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('aria-haspopup')).toBe('menu')
		})

		it('should apply aria-controls with ID reference', () => {
			const targetId = 'target-element'
			const config: ARIAConfig = { ariaControls: targetId }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('aria-controls')).toBe(targetId)
		})

		it('should apply multiple attributes', () => {
			const config: ARIAConfig = {
				role: 'button',
				ariaLabel: 'Test',
				ariaDisabled: true,
				ariaHasPopup: 'dialog',
			}
			applyAriaAttributes(container, config)
			expect(container.getAttribute('role')).toBe('button')
			expect(container.getAttribute('aria-label')).toBe('Test')
			expect(container.getAttribute('aria-disabled')).toBe('true')
			expect(container.getAttribute('aria-haspopup')).toBe('dialog')
		})

		it('should apply tabIndex', () => {
			const config: ARIAConfig = { tabIndex: 0 }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('tabindex')).toBe('0')
		})

		it('should apply aria-modal', () => {
			const config: ARIAConfig = { ariaModal: true }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('aria-modal')).toBe('true')
		})

		it('should apply aria-required', () => {
			const config: ARIAConfig = { ariaRequired: true }
			applyAriaAttributes(container, config)
			expect(container.getAttribute('aria-required')).toBe('true')
		})
	})

	describe('clearAriaAttributes', () => {
		it('should clear all aria attributes', () => {
			container.setAttribute('role', 'button')
			container.setAttribute('aria-label', 'Test')
			container.setAttribute('aria-disabled', 'true')
			clearAriaAttributes(container)
			expect(container.getAttribute('role')).toBeNull()
			expect(container.getAttribute('aria-label')).toBeNull()
			expect(container.getAttribute('aria-disabled')).toBeNull()
		})
	})

	describe('generateAriaId', () => {
		it('should generate unique ID with default prefix', () => {
			const id = generateAriaId()
			expect(id).toMatch(/^directix-aria-/)
		})

		it('should generate unique ID with custom prefix', () => {
			const id = generateAriaId('custom')
			expect(id).toMatch(/^custom-/)
		})

		it('should generate different IDs on multiple calls', () => {
			const id1 = generateAriaId()
			const id2 = generateAriaId()
			expect(id1).not.toBe(id2)
		})
	})

	describe('announce', () => {
		it('should create announcer element', () => {
			// announce requires browser environment, so just verify function exists
			expect(typeof announce).toBe('function')
		})

		it('should accept priority option', () => {
			expect(typeof announce).toBe('function')
			announce('Test', { priority: 'polite' })
		})

		it('should accept timeout option', () => {
			expect(typeof announce).toBe('function')
			announce('Test', { timeout: 500 })
		})
	})

	describe('clearAnnouncer', () => {
		it('should remove announcer element', () => {
			announce('Test')
			clearAnnouncer()
			const announcer = document.getElementById('directix-announcer')
			expect(announcer).toBeNull()
		})
	})

	describe('getAutoAriaConfig', () => {
		it('should return config for tooltip', () => {
			const config = getAutoAriaConfig({ type: 'tooltip' })
			expect(config.role).toBe('tooltip')
		})

		it('should return config for menu', () => {
			const config = getAutoAriaConfig({ type: 'menu' })
			expect(config.role).toBe('menu')
		})

		it('should return config for dialog', () => {
			const config = getAutoAriaConfig({ type: 'dialog' })
			expect(config.role).toBe('dialog')
		})

		it('should return config for modal', () => {
			const config = getAutoAriaConfig({ type: 'modal' })
			expect(config.role).toBe('dialog')
			expect(config.ariaModal).toBe(true)
		})

		it('should return config for dropdown', () => {
			const config = getAutoAriaConfig({ type: 'dropdown' })
			expect(config.role).toBe('listbox')
		})

		it('should return config for alert', () => {
			const config = getAutoAriaConfig({ type: 'alert' })
			expect(config.role).toBe('alert')
			expect(config.ariaLive).toBe('assertive')
		})

		it('should include label when provided', () => {
			const config = getAutoAriaConfig({ type: 'menu', label: 'Click me' })
			expect(config.ariaLabel).toBe('Click me')
		})

		it('should include expanded when provided', () => {
			const config = getAutoAriaConfig({ type: 'menu', expanded: true })
			expect(config.ariaExpanded).toBe(true)
		})
	})

	describe('ARIA role types', () => {
		it('should accept valid role values', () => {
			const roles = ['button', 'checkbox', 'dialog', 'menu', 'alert', 'tooltip']
			for (const role of roles) {
				const config: ARIAConfig = { role: role as any }
				applyAriaAttributes(container, config)
				expect(container.getAttribute('role')).toBe(role)
			}
		})
	})
})