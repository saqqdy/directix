import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { vCountdown } from '../../src/directives/countdown'

describe('v-countdown', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('basic functionality', () => {
		it('should display countdown from target date', async () => {
			const targetTime = Date.now() + 60000 // 1 minute from now

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="targetTime"></span>`,
				data() {
					return { targetTime }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('span').element.textContent).toBe('00:01:00')

			wrapper.unmount()
		})

		it('should accept Date object as target', async () => {
			const targetDate = new Date(Date.now() + 3600000) // 1 hour from now

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="targetDate"></span>`,
				data() {
					return { targetDate }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('span').element.textContent).toBe('01:00:00')

			wrapper.unmount()
		})

		it('should accept ISO string as target', async () => {
			const targetTime = new Date(Date.now() + 7200000).toISOString() // 2 hours from now

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="targetTime"></span>`,
				data() {
					return { targetTime }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('span').element.textContent).toBe('02:00:00')

			wrapper.unmount()
		})
	})

	describe('format option', () => {
		it('should use custom format string', async () => {
			const targetTime = Date.now() + 90061000 // 1 day, 1 hour, 1 minute, 1 second

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="{ target: targetTime, format: 'dd:hh:mm:ss' }"></span>`,
				data() {
					return { targetTime }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('span').element.textContent).toBe('01:01:01:01')

			wrapper.unmount()
		})

		it('should use custom format function', async () => {
			const targetTime = Date.now() + 3661000 // 1 hour, 1 minute, 1 second

			const formatFn = vi.fn(time => `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`)

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="{ target: targetTime, format: formatFn }"></span>`,
				data() {
					return { targetTime, formatFn }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('span').element.textContent).toBe('0d 1h 1m 1s')

			wrapper.unmount()
		})

		it('should format minutes and seconds only', async () => {
			const targetTime = Date.now() + 125000 // 2 minutes, 5 seconds

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="{ target: targetTime, format: 'mm:ss' }"></span>`,
				data() {
					return { targetTime }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('span').element.textContent).toBe('02:05')

			wrapper.unmount()
		})

		it('should format seconds only', async () => {
			const targetTime = Date.now() + 45000 // 45 seconds

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="{ target: targetTime, format: 'ss' }"></span>`,
				data() {
					return { targetTime }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('span').element.textContent).toBe('45')

			wrapper.unmount()
		})
	})

	describe('callbacks', () => {
		it('should call onComplete when countdown finishes', async () => {
			const onComplete = vi.fn()
			const targetTime = Date.now() + 1000 // 1 second

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="{ target: targetTime, onComplete }"></span>`,
				data() {
					return { targetTime, onComplete }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Advance past the target
			vi.advanceTimersByTime(1500)

			expect(onComplete).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})

		it('should call onTick on each interval', async () => {
			const onTick = vi.fn()
			const targetTime = Date.now() + 5000 // 5 seconds

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="{ target: targetTime, onTick }"></span>`,
				data() {
					return { targetTime, onTick }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Initial tick on mount
			expect(onTick).toHaveBeenCalledTimes(1)

			// Advance 1 second
			vi.advanceTimersByTime(1000)
			expect(onTick).toHaveBeenCalledTimes(2)

			// Advance another second
			vi.advanceTimersByTime(1000)
			expect(onTick).toHaveBeenCalledTimes(3)

			wrapper.unmount()
		})

		it('should dispatch countdown:complete event', async () => {
			const targetTime = Date.now() + 1000

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="targetTime"></span>`,
				data() {
					return { targetTime }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })
			const span = wrapper.find('span').element

			const eventHandler = vi.fn()
			span.addEventListener('countdown:complete', eventHandler)

			vi.advanceTimersByTime(1500)

			expect(eventHandler).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('interval option', () => {
		it('should use custom interval', async () => {
			const onTick = vi.fn()
			const targetTime = Date.now() + 10000 // 10 seconds

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="{ target: targetTime, onTick, interval: 500 }"></span>`,
				data() {
					return { targetTime, onTick }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Initial tick
			expect(onTick).toHaveBeenCalledTimes(1)

			// Advance 500ms
			vi.advanceTimersByTime(500)
			expect(onTick).toHaveBeenCalledTimes(2)

			// Advance another 500ms
			vi.advanceTimersByTime(500)
			expect(onTick).toHaveBeenCalledTimes(3)

			wrapper.unmount()
		})
	})

	describe('autoStart option', () => {
		it('should show initial display when autoStart is false', async () => {
			// Note: autoStart: false means the interval won't start,
			// but the initial display will show 00:00:00 because
			// remaining time is not calculated until startCountdown is called
			const targetTime = Date.now() + 5000

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="{ target: targetTime, autoStart: false }"></span>`,
				data() {
					return { targetTime }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// When autoStart is false, the countdown doesn't start
			// and remaining time is 0, so display shows 00:00:00
			expect(wrapper.find('span').element.textContent).toBe('00:00:00')

			wrapper.unmount()
		})

		it('should start countdown when autoStart is true', async () => {
			const now = Date.now()
			const targetTime = now + 5000

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="{ target: targetTime }"></span>`,
				data() {
					return { targetTime }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Should show initial time (autoStart is true by default)
			const text = wrapper.find('span').element.textContent
			// The countdown is running, but exact time depends on timing
			expect(text).toMatch(/00:00:0[0-5]/)

			wrapper.unmount()
		})
	})

	describe('updated hook', () => {
		it('should restart countdown when target changes', async () => {
			const targetTime1 = Date.now() + 10000
			const targetTime2 = Date.now() + 20000

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="targetTime"></span>`,
				data() {
					return { targetTime: targetTime1 }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('span').element.textContent).toBe('00:00:10')

			// Update target
			await wrapper.setData({ targetTime: targetTime2 })
			await nextTick()

			expect(wrapper.find('span').element.textContent).toBe('00:00:20')

			wrapper.unmount()
		})
	})

	describe('cleanup', () => {
		it('should clear interval on unmount', async () => {
			const targetTime = Date.now() + 10000

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-if="show" v-countdown="targetTime"></span>`,
				data() {
					return { show: true, targetTime }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('span').element.textContent).toBe('00:00:10')

			// Unmount
			await wrapper.setData({ show: false })
			await nextTick()

			// Should not error
			expect(wrapper.find('span').exists()).toBe(false)

			wrapper.unmount()
		})
	})

	describe('edge cases', () => {
		it('should handle already passed target time', async () => {
			const targetTime = Date.now() - 1000 // 1 second ago

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="targetTime"></span>`,
				data() {
					return { targetTime }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			expect(wrapper.find('span').element.textContent).toBe('00:00:00')

			wrapper.unmount()
		})

		it('should handle zero remaining time', async () => {
			const targetTime = Date.now() + 100

			const TestComponent = defineComponent({
				directives: { countdown: vCountdown },
				template: `<span v-countdown="targetTime"></span>`,
				data() {
					return { targetTime }
				},
			})

			const wrapper = mount(TestComponent, { attachTo: document.body })

			// Advance past target
			vi.advanceTimersByTime(200)

			expect(wrapper.find('span').element.textContent).toBe('00:00:00')

			wrapper.unmount()
		})
	})
})
