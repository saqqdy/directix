import { defineDirective } from '@directix/core'
import { getElement, off, on } from '@directix/shared'

/**
 * 点击外部处理函数
 */
export type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void

/**
 * 点击外部指令选项
 */
export interface ClickOutsideOptions {
	/**
   * 点击外部时的回调函数
   * @required
   */
	handler: ClickOutsideHandler

	/**
   * 排除的元素选择器或元素引用
   */
	exclude?: (string | HTMLElement | (() => HTMLElement | null))[]

	/**
   * 是否使用捕获模式
   * @default true
   */
	capture?: boolean

	/**
   * 监听的事件类型
   * @default ['click']
   */
	events?: ('click' | 'mousedown' | 'mouseup' | 'touchstart' | 'touchend')[]

	/**
   * 是否禁用
   * @default false
   */
	disabled?: boolean

	/**
   * 停止传播
   * @default false
   */
	stop?: boolean

	/**
   * 阻止默认行为
   * @default false
   */
	prevent?: boolean
}

/**
 * 指令绑定值类型
 */
export type ClickOutsideBinding = ClickOutsideHandler | ClickOutsideOptions

/**
 * 元素状态存储
 */
interface ClickOutsideState {
	options: ClickOutsideOptions
	handlers: Map<string, (event: Event) => void>
}

/**
 * v-click-outside 指令
 *
 * @example
 * ```vue
 * <template>
 *   <div v-click-outside="handleClickOutside">
 *     下拉菜单
 *   </div>
 * </template>
 * ```
 */
export const vClickOutside = defineDirective<ClickOutsideBinding, HTMLElement>({
	name: 'click-outside',
	ssr: false,
	defaults: {
		capture: true,
		events: ['click'],
		disabled: false,
		stop: false,
		prevent: false,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled) return

		const state: ClickOutsideState = {
			options,
			handlers: new Map(),
		}

    ;(el as any).__clickOutside = state

		// 创建事件处理器
		const createHandler = (_eventType: string) => {
			return (event: Event) => {
				// 检查事件目标
				if (!isValidClick(el, event, options)) {
					return
				}

				// 停止传播
				if (options.stop) {
					event.stopPropagation()
				}

				// 阻止默认行为
				if (options.prevent) {
					event.preventDefault()
				}

				// 调用处理函数
				options.handler(event as MouseEvent | TouchEvent)
			}
		}

		// 绑定事件
		options.events!.forEach(eventType => {
			const handler = createHandler(eventType)

			state.handlers.set(eventType, handler)

			const listenerOptions = {
				capture: options.capture,
				passive: !options.prevent,
			}

			on(document, eventType, handler, listenerOptions)
		})
	},

	updated(el, binding) {
		const state: ClickOutsideState = (el as any).__clickOutside

		if (!state) return

		const oldOptions = state.options
		const newOptions = normalizeOptions(binding.value)

		// 如果禁用状态变化
		if (oldOptions.disabled !== newOptions.disabled) {
			if (newOptions.disabled) {
				// 移除所有监听
				state.handlers.forEach((handler, eventType) => {
					off(document, eventType, handler, { capture: oldOptions.capture })
				})
				state.handlers.clear()
			} else {
				// 重新添加监听
				const createHandler = (_eventType: string) => {
					return (event: Event) => {
						if (!isValidClick(el, event, newOptions)) return
						if (newOptions.stop) event.stopPropagation()
						if (newOptions.prevent) event.preventDefault()
						newOptions.handler(event as MouseEvent | TouchEvent)
					}
				}

				newOptions.events!.forEach(eventType => {
					const handler = createHandler(eventType)

					state.handlers.set(eventType, handler)
					on(document, eventType, handler, {
						capture: newOptions.capture,
						passive: !newOptions.prevent,
					})
				})
			}
		}

		state.options = newOptions
	},

	unmounted(el) {
		const state: ClickOutsideState = (el as any).__clickOutside

		if (!state) return

		// 移除所有事件监听
		state.handlers.forEach((handler, eventType) => {
			off(document, eventType, handler, { capture: state.options.capture })
		})

		delete (el as any).__clickOutside
	},
})

/**
 * 标准化选项
 */
function normalizeOptions(binding: ClickOutsideBinding | undefined): ClickOutsideOptions {
	if (typeof binding === 'function') {
		return {
			handler: binding,
			capture: true,
			events: ['click'],
			disabled: false,
			stop: false,
			prevent: false,
		}
	}

	if (!binding) {
		throw new Error('[Directix] v-click-outside: handler is required')
	}

	return {
		capture: binding.capture ?? true,
		events: binding.events ?? ['click'],
		disabled: binding.disabled ?? false,
		stop: binding.stop ?? false,
		prevent: binding.prevent ?? false,
		...binding,
	}
}

/**
 * 检查点击是否有效（在元素外部）
 */
function isValidClick(
	el: HTMLElement,
	event: Event,
	options: ClickOutsideOptions,
): boolean {
	const target = event.target as Node

	// 检查是否点击了元素本身或其子元素
	if (el.contains(target)) {
		return false
	}

	// 检查排除元素
	if (options.exclude?.length) {
		for (const exclude of options.exclude) {
			const excludeEl = typeof exclude === 'function' ? exclude() : getElement(exclude)

			if (excludeEl && (excludeEl === target || excludeEl.contains(target))) {
				return false
			}
		}
	}

	return true
}

export default vClickOutside
