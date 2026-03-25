import { defineDirective, isBrowser } from '@directix/core'

/**
 * 焦点指令选项
 */
export interface FocusOptions {
	/**
	 * 是否自动聚焦
	 * @default true
	 */
	focus?: boolean

	/**
	 * 是否在每次更新时重新聚焦
	 * @default false
	 */
	refocus?: boolean

	/**
	 * 聚焦时的回调
	 */
	onFocus?: (el: HTMLElement) => void

	/**
	 * 失焦时的回调
	 */
	onBlur?: (el: HTMLElement) => void
}

/**
 * 指令绑定值类型
 */
export type FocusBinding = boolean | FocusOptions

/**
 * 元素状态存储
 */
interface FocusState {
	options: FocusOptions
	handleFocus: () => void
	handleBlur: () => void
}

const FOCUSABLE_TAGS = new Set(['input', 'textarea', 'select', 'button'])

/**
 * v-focus 指令
 *
 * @example
 * ```vue
 * <template>
 *   <input v-focus />
 *   <input v-focus="{ focus: true, refocus: true }" />
 * </template>
 * ```
 */
export const vFocus = defineDirective<FocusBinding, HTMLElement>({
	name: 'focus',
	ssr: false,
	defaults: {
		focus: true,
		refocus: false,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (!options.focus || !isFocusable(el)) {
			if (options.focus) {
				console.warn('[Directix] v-focus: Element is not focusable')
			}

			return
		}

		const handleFocus = (): void => options.onFocus?.(el)
		const handleBlur = (): void => options.onBlur?.(el)

		el.addEventListener('focus', handleFocus)
		el.addEventListener('blur', handleBlur)

		;(el as any).__focus = {
			options,
			handleFocus,
			handleBlur,
		} as FocusState

		el.focus()
	},

	updated(el, binding) {
		const state: FocusState | undefined = (el as any).__focus

		if (!state) return

		const newOptions = normalizeOptions(binding.value)

		// 只在回调变化时更新事件监听器
		if (newOptions.onFocus !== state.options.onFocus) {
			el.removeEventListener('focus', state.handleFocus)
			state.handleFocus = () => newOptions.onFocus?.(el)
			el.addEventListener('focus', state.handleFocus)
		}

		if (newOptions.onBlur !== state.options.onBlur) {
			el.removeEventListener('blur', state.handleBlur)
			state.handleBlur = () => newOptions.onBlur?.(el)
			el.addEventListener('blur', state.handleBlur)
		}

		state.options = newOptions

		// refocus 时重新聚焦
		if (newOptions.refocus && newOptions.focus) {
			el.focus()
		}
	},

	unmounted(el) {
		const state: FocusState | undefined = (el as any).__focus

		if (!state) return

		el.removeEventListener('focus', state.handleFocus)
		el.removeEventListener('blur', state.handleBlur)
		delete (el as any).__focus
	},
})

/**
 * 标准化选项
 */
function normalizeOptions(binding: FocusBinding | undefined): FocusOptions {
	if (typeof binding === 'boolean') {
		return { focus: binding }
	}

	return {
		focus: true,
		...binding,
	}
}

/**
 * 检查元素是否可聚焦
 */
function isFocusable(el: HTMLElement): boolean {
	if (!isBrowser()) return false

	const tagName = el.tagName.toLowerCase()

	// 表单元素
	if (FOCUSABLE_TAGS.has(tagName)) {
		return !(el as HTMLInputElement).disabled
	}

	// 可编辑元素
	if (el.isContentEditable) return true

	// tabindex 属性
	const tabindex = el.getAttribute('tabindex')

	if (tabindex != null) return tabindex !== '-1'

	// 链接元素
	if (tagName === 'a' || tagName === 'area') {
		return el.hasAttribute('href')
	}

	return false
}

export default vFocus
