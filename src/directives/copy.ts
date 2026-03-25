import { defineDirective, supportsClipboard } from '@directix/core'

/**
 * 复制成功回调
 */
export type CopySuccessCallback = (text: string) => void

/**
 * 复制失败回调
 */
export type CopyErrorCallback = (error: Error) => void

/**
 * 复制指令选项
 */
export interface CopyOptions {
	/**
   * 要复制的文本
   * @required
   */
	value: string

	/**
   * 复制成功回调
   */
	onSuccess?: CopySuccessCallback

	/**
   * 复制失败回调
   */
	onError?: CopyErrorCallback

	/**
   * 复制按钮的提示文本
   */
	title?: string

	/**
   * 是否禁用
   * @default false
   */
	disabled?: boolean
}

/**
 * 指令绑定值类型
 */
export type CopyBinding = string | CopyOptions

/**
 * 元素状态存储
 */
interface CopyState {
	handler: () => void
	options: CopyOptions
}

/**
 * 复制文本到剪贴板
 * 优先使用 Clipboard API，降级使用 execCommand
 */
async function copyToClipboard(text: string): Promise<boolean> {
	// 方式一：使用 Clipboard API
	if (supportsClipboard()) {
		try {
			await navigator.clipboard.writeText(text)

			return true
		} catch {
			// 权限被拒绝或其他错误，降级处理
			console.warn('[Directix] Clipboard API failed, falling back to execCommand')
		}
	}

	// 方式二：使用 execCommand（已废弃但兼容性好）
	return copyWithExecCommand(text)
}

/**
 * 使用 execCommand 复制
 */
function copyWithExecCommand(text: string): boolean {
	// 创建临时 textarea
	const textarea = document.createElement('textarea')

	textarea.value = text

	// 设置样式使其不可见
	textarea.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    opacity: 0;
    pointer-events: none;
  `

	document.body.appendChild(textarea)

	try {
		// 选中并复制
		textarea.select()
		textarea.setSelectionRange(0, textarea.value.length)

		return document.execCommand('copy')
	} catch {
		return false
	} finally {
		// 清理
		document.body.removeChild(textarea)
	}
}

/**
 * v-copy 指令
 *
 * @example
 * ```vue
 * <template>
 *   <button v-copy="textToCopy">复制文本</button>
 * </template>
 * ```
 */
export const vCopy = defineDirective<CopyBinding, HTMLElement>({
	name: 'copy',
	ssr: false,

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled) return

		// 设置提示
		if (options.title) {
			el.setAttribute('title', options.title)
		}

		// 状态存储 - handler 会从这里读取最新值
		const state: CopyState = {
			handler: null as any,
			options,
		}

		// 添加点击事件 - 从 state 读取最新 options
		state.handler = async () => {
			const text = state.options.value

			if (!text) {
				console.warn('[Directix] v-copy: No text to copy')

				return
			}

			try {
				const success = await copyToClipboard(text)

				if (success) {
					state.options.onSuccess?.(text)
					el.dispatchEvent(new CustomEvent('copy:success', { detail: { text } }))
				} else {
					throw new Error('Copy failed')
				}
			} catch (err) {
				const error = err as Error

				state.options.onError?.(error)
				el.dispatchEvent(new CustomEvent('copy:error', { detail: { error } }))
			}
		}

		el.addEventListener('click', state.handler)
		;(el as any).__copy = state
	},

	updated(el, binding) {
		const state: CopyState = (el as any).__copy

		if (!state) return

		state.options = normalizeOptions(binding.value)

		if (state.options.title) {
			el.setAttribute('title', state.options.title)
		}
	},

	unmounted(el) {
		const state: CopyState = (el as any).__copy

		if (!state) return

		el.removeEventListener('click', state.handler)
		delete (el as any).__copy
	},
})

/**
 * 标准化选项
 */
function normalizeOptions(binding: CopyBinding): CopyOptions {
	if (typeof binding === 'string') {
		return { value: binding }
	}

	return binding
}

export default vCopy
