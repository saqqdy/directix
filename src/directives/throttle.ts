import { defineDirective } from '@directix/core'
import { parseTime, throttle } from '@directix/shared'
import type { DirectiveBinding } from '@directix/core'

/**
 * 节流函数类型
 */
export interface ThrottledFunction<T extends (...args: any[]) => any> {
	(...args: Parameters<T>): void
	cancel: () => void
}

/**
 * 节流指令选项
 */
export interface ThrottleOptions<T extends (...args: any[]) => any = any> {
	/**
   * 要节流的函数
   */
	handler: T

	/**
   * 延迟时间（毫秒）
   * @default 300
   */
	wait?: number

	/**
   * 是否在延迟开始前立即调用
   * @default true
   */
	leading?: boolean

	/**
   * 是否在延迟结束后调用
   * @default true
   */
	trailing?: boolean
}

/**
 * 指令绑定值类型
 */
export type ThrottleBinding<T extends (...args: any[]) => any = any> =
  | T
  | ThrottleOptions<T>

/**
 * 元素状态存储
 */
interface ThrottleState {
	throttledFn: ThrottledFunction<any>
	eventType: string
	options: ThrottleOptions
}

/**
 * v-throttle 指令
 *
 * @example
 * ```vue
 * <template>
 *   <button v-throttle="handleClick">节流按钮</button>
 *   <button v-throttle:1s="handleClick">1秒节流</button>
 *   <div v-throttle.scroll="handleScroll">滚动节流</div>
 *   <div v-throttle:100.scroll="handleScroll">100ms 滚动节流</div>
 * </template>
 * ```
 */
export const vThrottle = defineDirective<ThrottleBinding, HTMLElement>({
	name: 'throttle',
	ssr: false,
	defaults: {
		wait: 300,
		leading: true,
		trailing: true,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value, binding)
		// 优先使用修饰符指定的事件类型，否则根据元素类型推断
		const eventType = getEventTypeFromModifiers(binding.modifiers) || getEventType(el)

		// 创建节流函数
		const throttledFn = throttle(options.handler, options.wait, {
			leading: options.leading,
			trailing: options.trailing,
		})

		// 绑定事件
		el.addEventListener(eventType, throttledFn as any)

		;(el as any).__throttle = {
			throttledFn,
			eventType,
			options,
		}
	},

	updated(el, binding) {
		const state: ThrottleState = (el as any).__throttle

		if (!state) return

		const newOptions = normalizeOptions(binding.value, binding)

		// 如果配置变化，重新创建节流函数
		if (
			newOptions.wait !== state.options.wait ||
			newOptions.leading !== state.options.leading ||
			newOptions.trailing !== state.options.trailing
		) {
			// 取消旧的
			state.throttledFn.cancel()

			// 创建新的
			const throttledFn = throttle(newOptions.handler, newOptions.wait, {
				leading: newOptions.leading,
				trailing: newOptions.trailing,
			})

			el.removeEventListener(state.eventType, state.throttledFn as any)
			el.addEventListener(state.eventType, throttledFn as any)

			;(el as any).__throttle = {
				throttledFn,
				eventType: state.eventType,
				options: newOptions,
			}
		} else if (newOptions.handler !== state.options.handler) {
			// 只更新 handler
			state.options.handler = newOptions.handler
		}
	},

	unmounted(el) {
		const state: ThrottleState = (el as any).__throttle

		if (!state) return

		state.throttledFn.cancel()
		el.removeEventListener(state.eventType, state.throttledFn as any)
		delete (el as any).__throttle
	},
})

/**
 * 标准化选项
 */
function normalizeOptions(
	binding: ThrottleBinding,
	directiveBinding: DirectiveBinding<ThrottleBinding>,
): ThrottleOptions {
	const wait = parseTime(directiveBinding.arg) || 300

	if (typeof binding === 'function') {
		return { handler: binding, wait }
	}

	return { ...binding, wait: binding.wait || wait }
}

/**
 * 获取元素默认事件类型
 */
function getEventType(el: HTMLElement): string {
	const tagName = el.tagName.toLowerCase()

	if (tagName === 'input' || tagName === 'textarea') {
		return 'input'
	}

	return 'click'
}

/**
 * 支持事件类型的修饰符列表
 */
const EVENT_MODIFIERS = [
	'click',
	'input',
	'change',
	'submit',
	'scroll',
	'resize',
	'mouseenter',
	'mouseleave',
	'mousemove',
	'mousedown',
	'mouseup',
	'keydown',
	'keyup',
	'focus',
	'blur',
	'touchstart',
	'touchmove',
	'touchend',
] as const

/**
 * 从修饰符中提取事件类型
 */
function getEventTypeFromModifiers(modifiers: Record<string, boolean>): string | null {
	for (const modifier of EVENT_MODIFIERS) {
		if (modifiers[modifier]) {
			return modifier
		}
	}

	return null
}

export default vThrottle
