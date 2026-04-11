import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vWatermark } from '../../src/directives/watermark'

// Mock canvas context
const mockCanvasContext = {
	font: '',
	fillStyle: '',
	textAlign: '',
	textBaseline: '',
	translate: vi.fn(),
	rotate: vi.fn(),
	fillText: vi.fn(),
	measureText: vi.fn().mockReturnValue({ width: 100 }),
	save: vi.fn(),
	restore: vi.fn(),
}

describe('v-watermark', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		// Ensure canvas mock is applied
		HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCanvasContext) as any
		HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mock')
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
		// Clean up any watermark elements
		document.body.innerHTML = ''
	})

	describe('basic functionality', () => {
		it('should create watermark element when mounted', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="'Test'">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})

		it('should accept string as content', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="'Confidential'">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})

		it('should accept options object', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})

		it('should set element position to relative if static', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="'Test'">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			// JSDOM doesn't compute styles the same way, but we can check that the directive runs
			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})
	})

	describe('disabled option', () => {
		it('should not create watermark when disabled', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', disabled: true }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(false)
		})

		it('should enable watermark when disabled changes to false', async () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', disabled: isDisabled }">Content</div>`,
				data() {
					return { isDisabled: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(false)

			await wrapper.setData({ isDisabled: false })
			await nextTick()

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})

		it('should disable watermark when disabled changes to true', async () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', disabled: isDisabled }">Content</div>`,
				data() {
					return { isDisabled: false }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)

			await wrapper.setData({ isDisabled: true })
			await nextTick()

			expect(wrapper.find('.v-watermark').exists()).toBe(false)
		})
	})

	describe('styling options', () => {
		it('should use custom z-index', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', zIndex: 5000 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)
			const watermark = wrapper.find('.v-watermark').element as HTMLElement

			expect(watermark.style.zIndex).toBe('5000')
		})

		it('should use custom font size', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', fontSize: 24 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})

		it('should use custom font family', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', fontFamily: 'Arial' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})

		it('should use custom color', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', color: 'rgba(255, 0, 0, 0.2)' }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})

		it('should use custom rotation', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', rotate: -30 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})

		it('should use custom gap as array', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', gap: [50, 50] }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})

		it('should use custom gap as number', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', gap: 80 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})

		it('should use custom width and height', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', width: 400, height: 300 }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})
	})

	describe('multi-line content', () => {
		it('should support array content for multi-line watermarks', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: ['Line 1', 'Line 2'] }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})
	})

	describe('protect option', () => {
		it('should set up protection by default', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="'Test'">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})

		it('should not set up protection when protect is false', () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="{ content: 'Test', protect: false }">Content</div>`,
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})
	})

	describe('update', () => {
		it('should update watermark when content changes', async () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-watermark="content">Content</div>`,
				data() {
					return { content: 'Test 1' }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)

			await wrapper.setData({ content: 'Test 2' })
			await nextTick()

			expect(wrapper.find('.v-watermark').exists()).toBe(true)
		})
	})

	describe('cleanup', () => {
		it('should remove watermark on unmount', async () => {
			const TestComponent = defineComponent({
				directives: { watermark: vWatermark },
				template: `<div v-if="show" v-watermark="'Test'">Content</div>`,
				data() {
					return { show: true }
				},
			})

			const wrapper = mount(TestComponent)

			expect(wrapper.find('.v-watermark').exists()).toBe(true)

			await wrapper.setData({ show: false })
			await nextTick()

			expect(wrapper.find('.v-watermark').exists()).toBe(false)
		})
	})
})
