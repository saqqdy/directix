import type { ComponentPublicInstance, Directive, VNode } from 'vue'

/**
 * 统一的指令绑定对象
 */
export interface DirectiveBinding<T = any> {
	/** 指令绑定的值 */
	value: T
	/** 上一次绑定的值 */
	oldValue: T | null
	/** 指令参数 (v-xxx:arg) */
	arg?: string
	/** 修饰符对象 (v-xxx.modifier) */
	modifiers: Record<string, boolean>
	/** 组件实例 */
	instance: ComponentPublicInstance | null
}

/**
 * 统一的指令钩子函数
 */
export interface DirectiveHooks<T = any, B extends Element = Element> {
	/**
   * 指令绑定到元素时调用
   * @param el 绑定的 DOM 元素
   * @param binding 绑定对象
   * @param vnode Vue 虚拟节点
   */
	mounted?: (el: B, binding: DirectiveBinding<T>, vnode: VNode) => void

	/**
   * 元素更新时调用
   * @param el 绑定的 DOM 元素
   * @param binding 新的绑定对象
   * @param vnode 新的虚拟节点
   * @param prevBinding 旧的绑定对象
   * @param prevVnode 旧的虚拟节点
   */
	updated?: (
		el: B,
		binding: DirectiveBinding<T>,
		vnode: VNode,
		prevBinding: DirectiveBinding<T>,
		prevVnode: VNode,
	) => void

	/**
   * 指令卸载时调用
   * @param el 绑定的 DOM 元素
   * @param binding 绑定对象
   * @param vnode 虚拟节点
   */
	unmounted?: (el: B, binding: DirectiveBinding<T>, vnode: VNode) => void
}

/**
 * 指令定义接口
 */
export interface DirectiveDefinition<T = any, B extends Element = Element>
	extends DirectiveHooks<T, B> {
	/** 指令名称 */
	name: string
	/** 指令版本 */
	version?: '2' | '3' | 'both'
	/** 是否服务端渲染兼容 */
	ssr?: boolean
	/** 默认值 */
	defaults?: Partial<T>
}

/**
 * Vue 2 指令钩子
 */
export interface Vue2DirectiveHooks {
	bind?: (el: any, binding: any, vnode: any, oldVnode: any) => void
	inserted?: (el: any, binding: any, vnode: any, oldVnode: any) => void
	update?: (el: any, binding: any, vnode: any, oldVnode: any) => void
	componentUpdated?: (el: any, binding: any, vnode: any, oldVnode: any) => void
	unbind?: (el: any, binding: any, vnode: any, oldVnode: any) => void
}

/**
 * Vue 3 指令钩子
 */
export interface Vue3DirectiveHooks {
	created?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	beforeMount?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	mounted?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	beforeUpdate?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	updated?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	beforeUnmount?: (el: any, binding: any, vnode: any, prevVnode: any) => void
	unmounted?: (el: any, binding: any, vnode: any, prevVnode: any) => void
}

/**
 * 跨版本指令类型（兼容 Vue 2/3）
 */
export type CrossVersionDirective = Directive | Vue2DirectiveHooks | Vue3DirectiveHooks

/**
 * 指令安装选项
 */
export interface DirectiveInstallOptions {
	/** 注册的指令名称列表，不传则注册全部 */
	directives?: string[]
	/** 是否注册全部指令 */
	all?: boolean
	/** 全局配置 */
	config?: Record<string, any>
}
