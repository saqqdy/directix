import { defineDirective } from '@directix/core'
import { debounce, parseTime } from '@directix/shared'
import type { DirectiveBinding } from '@directix/core'

/**
 * 防抖函数类型
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
	(...args: Parameters<T>): void
	cancel: () => void
	flush: () => void
}

/**
 * 防抖指令选项
 */
export interface DebounceOptions<T extends (...args: any[]) => any = any> {
	/**
   * 要防抖的函数
   */
	handler: T

	/**
   * 延迟时间（毫秒）
   * @default 300
   */
	wait?: number

	/**
   * 是否在延迟开始前立即调用
   * @default false
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
export type DebounceBinding<T extends (...args: any[]) => any = any> =
  | T
  | DebounceOptions<T>

/**
 * 元素状态存储
 */
interface DebounceState {
	debouncedFn: DebouncedFunction<any>
	eventType: string
	options: DebounceOptions
}

/**
 * v-debounce 指令
 *
 * @example
 * ```vue
 * <template>
 *   <input v-debounce="handleInput" />
 *   <input v-debounce:500ms="handleInput" />
 *   <input v-debounce="{ handler: handleInput, wait: 500 }" />
 *   <div v-debounce.scroll="handleScroll">滚动防抖</div>
 *   <div v-debounce:100.scroll="handleScroll">100ms 滚动防抖</div>
 * </template>
 * ```
 */
export const vDebounce = defineDirective<DebounceBinding, HTMLElement>({
	name: 'debounce',
	ssr: false,
	defaults: {
		wait: 300,
		leading: false,
		trailing: true,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value, binding)
		// 优先使用修饰符指定的事件类型，否则根据元素类型推断
		const eventType = getEventTypeFromModifiers(binding.modifiers) || getEventType(el)

		// 创建防抖函数
		const debouncedFn = debounce(options.handler, options.wait, {
			leading: options.leading,
			trailing: options.trailing,
		})

		// 绑定事件
		el.addEventListener(eventType, debouncedFn as any)

		;(el as any).__debounce = {
			debouncedFn,
			eventType,
			options,
		}
	},

	updated(el, binding) {
		const state: DebounceState = (el as any).__debounce

		if (!state) return

		const newOptions = normalizeOptions(binding.value, binding)

		// 如果配置变化，重新创建防抖函数
		if (
			newOptions.wait !== state.options.wait ||
			newOptions.leading !== state.options.leading ||
			newOptions.trailing !== state.options.trailing
		) {
			// 取消旧的
			state.debouncedFn.cancel()

			// 创建新的
			const debouncedFn = debounce(newOptions.handler, newOptions.wait, {
				leading: newOptions.leading,
				trailing: newOptions.trailing,
			})

			el.removeEventListener(state.eventType, state.debouncedFn as any)
			el.addEventListener(state.eventType, debouncedFn as any)

			;(el as any).__debounce = {
				debouncedFn,
				eventType: state.eventType,
				options: newOptions,
			}
		} else if (newOptions.handler !== state.options.handler) {
			// 只更新 handler
			state.options.handler = newOptions.handler
		}
	},

	unmounted(el) {
		const state: DebounceState = (el as any).__debounce

		if (!state) return

		state.debouncedFn.cancel()
		el.removeEventListener(state.eventType, state.debouncedFn as any)
		delete (el as any).__debounce
	},
})

/**
 * 标准化选项
 */
function normalizeOptions(
	binding: DebounceBinding,
	directiveBinding: DirectiveBinding<DebounceBinding>,
): DebounceOptions {
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

export default vDebounce
