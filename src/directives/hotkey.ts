import { defineDirective } from '@directix/core'

/**
 * Hotkey handler
 */
export type HotkeyHandler = (event: KeyboardEvent) => void

/**
 * Modifier keys
 */
export type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta'

/**
 * Hotkey definition
 */
export interface HotkeyDefinition {
	/**
	 * Key to listen for (e.g., 's', 'enter', 'escape')
	 */
	key: string

	/**
	 * Required modifier keys
	 */
	modifiers?: ModifierKey[]

	/**
	 * Handler function
	 */
	handler: HotkeyHandler

	/**
	 * Whether to prevent default behavior
	 * @default true
	 */
	prevent?: boolean

	/**
	 * Whether to stop propagation
	 * @default true
	 */
	stop?: boolean

	/**
	 * Whether to disable this hotkey
	 * @default false
	 */
	disabled?: boolean
}

/**
 * Hotkey directive options
 * Can be a single hotkey definition, an array, or a record of hotkeys
 */
export type HotkeyBinding =
	| HotkeyHandler
	| HotkeyDefinition
	| HotkeyDefinition[]
	| Record<string, HotkeyHandler | HotkeyDefinition>

/**
 * Normalized hotkey entry
 */
interface HotkeyEntry {
	key: string
	modifiers: Set<ModifierKey>
	handler: HotkeyHandler
	prevent: boolean
	stop: boolean
	disabled: boolean
}

/**
 * Element state storage
 */
interface HotkeyState {
	entries: HotkeyEntry[]
	handler: (event: KeyboardEvent) => void
}

/**
 * Key aliases mapping
 */
const KEY_ALIASES: Record<string, string> = {
	esc: 'escape',
	space: ' ',
	up: 'arrowup',
	down: 'arrowdown',
	left: 'arrowleft',
	right: 'arrowright',
	enter: 'enter',
	tab: 'tab',
	delete: 'delete',
	backspace: 'backspace',
	insert: 'insert',
	home: 'home',
	end: 'end',
	pagedown: 'pagedown',
	pageup: 'pageup',
	f1: 'f1',
	f2: 'f2',
	f3: 'f3',
	f4: 'f4',
	f5: 'f5',
	f6: 'f6',
	f7: 'f7',
	f8: 'f8',
	f9: 'f9',
	f10: 'f10',
	f11: 'f11',
	f12: 'f12',
}

/**
 * Normalize key name
 */
function normalizeKey(key: string): string {
	const lowerKey = key.toLowerCase()
	return KEY_ALIASES[lowerKey] || lowerKey
}

/**
 * Parse hotkey string (e.g., 'ctrl+s', 'alt.shift.enter')
 */
function parseHotkeyString(hotkey: string): { key: string; modifiers: ModifierKey[] } {
	const parts = hotkey.toLowerCase().split(/[+.]/)
	const modifiers: ModifierKey[] = []
	let key = ''

	for (const part of parts) {
		if (part === 'ctrl' || part === 'alt' || part === 'shift' || part === 'meta') {
			modifiers.push(part)
		} else {
			key = normalizeKey(part)
		}
	}

	return { key, modifiers }
}

/**
 * Check if keyboard event matches hotkey entry
 */
function matchesHotkey(event: KeyboardEvent, entry: HotkeyEntry): boolean {
	// Check key
	if (normalizeKey(event.key) !== entry.key) {
		return false
	}

	// Check modifiers
	const eventModifiers = new Set<ModifierKey>()
	if (event.ctrlKey) eventModifiers.add('ctrl')
	if (event.altKey) eventModifiers.add('alt')
	if (event.shiftKey) eventModifiers.add('shift')
	if (event.metaKey) eventModifiers.add('meta')

	// Both must have same modifiers
	if (eventModifiers.size !== entry.modifiers.size) {
		return false
	}

	for (const mod of entry.modifiers) {
		if (!eventModifiers.has(mod)) {
			return false
		}
	}

	return true
}

/**
 * Normalize binding to hotkey entries
 */
function normalizeBinding(
	binding: HotkeyBinding,
	arg: string | undefined,
	modifiers: Record<string, boolean>,
): HotkeyEntry[] {
	const entries: HotkeyEntry[] = []

	// If arg is provided, it's the hotkey definition
	if (arg) {
		const { key, modifiers: parsedModifiers } = parseHotkeyString(arg)
		const additionalModifiers: ModifierKey[] = []

		if (modifiers.ctrl) additionalModifiers.push('ctrl')
		if (modifiers.alt) additionalModifiers.push('alt')
		if (modifiers.shift) additionalModifiers.push('shift')
		if (modifiers.meta) additionalModifiers.push('meta')

		const handler = typeof binding === 'function' ? binding : (binding as HotkeyDefinition).handler

		entries.push({
			key,
			modifiers: new Set([...parsedModifiers, ...additionalModifiers]),
			handler,
			prevent: true,
			stop: true,
			disabled: false,
		})

		return entries
	}

	// Function handler - need arg
	if (typeof binding === 'function') {
		console.warn('[Directix] v-hotkey: hotkey definition is required (use v-hotkey:ctrl.s="handler")')
		return entries
	}

	// Array of hotkeys
	if (Array.isArray(binding)) {
		for (const item of binding) {
			entries.push({
				key: normalizeKey(item.key),
				modifiers: new Set(item.modifiers || []),
				handler: item.handler,
				prevent: item.prevent ?? true,
				stop: item.stop ?? true,
				disabled: item.disabled ?? false,
			})
		}
		return entries
	}

	// Object with hotkey definitions
	if (typeof binding === 'object' && binding !== null) {
		// Check if it's a single HotkeyDefinition
		if ('handler' in binding && typeof binding.handler === 'function') {
			const def = binding as HotkeyDefinition
			entries.push({
				key: normalizeKey(def.key),
				modifiers: new Set(def.modifiers || []),
				handler: def.handler,
				prevent: def.prevent ?? true,
				stop: def.stop ?? true,
				disabled: def.disabled ?? false,
			})
			return entries
		}

		// Record<string, Handler | Definition>
		for (const [hotkeyStr, value] of Object.entries(binding)) {
			const { key, modifiers: parsedModifiers } = parseHotkeyString(hotkeyStr)
			const handler = typeof value === 'function' ? value : value.handler

			entries.push({
				key,
				modifiers: new Set(parsedModifiers),
				handler,
				prevent: typeof value === 'object' ? (value.prevent ?? true) : true,
				stop: typeof value === 'object' ? (value.stop ?? true) : true,
				disabled: typeof value === 'object' ? (value.disabled ?? false) : false,
			})
		}
	}

	return entries
}

/**
 * v-hotkey directive
 *
 * Binds keyboard shortcuts to elements.
 *
 * @example
 * ```vue
 * <template>
 *   <!-- Using argument syntax -->
 *   <input v-hotkey:ctrl.s="save" />
 *   <input v-hotkey:escape="cancel" />
 *
 *   <!-- Using object syntax -->
 *   <div v-hotkey="{ 'ctrl+s': save, 'escape': cancel }">
 *     Press Ctrl+S to save
 *   </div>
 *
 *   <!-- Using array syntax -->
 *   <div v-hotkey="[
 *     { key: 's', modifiers: ['ctrl'], handler: save },
 *     { key: 'escape', handler: cancel }
 *   ]">
 *     Multiple hotkeys
 *   </div>
 * </template>
 * ```
 */
export const vHotkey = defineDirective<HotkeyBinding, HTMLElement>({
	name: 'hotkey',
	ssr: true,

	mounted(el, binding) {
		const entries = normalizeBinding(binding.value, binding.arg, binding.modifiers)

		if (entries.length === 0) return

		const handler = (event: KeyboardEvent) => {
			for (const entry of entries) {
				if (entry.disabled) continue

				if (matchesHotkey(event, entry)) {
					if (entry.prevent) {
						event.preventDefault()
					}
					if (entry.stop) {
						event.stopPropagation()
					}
					entry.handler(event)
					return
				}
			}
		}

		const state: HotkeyState = {
			entries,
			handler,
		}

		;(el as any).__hotkey = state

		// Bind to element or document based on focus
		el.tabIndex = el.tabIndex || -1 // Make focusable
		el.addEventListener('keydown', handler)
	},

	updated(el, binding) {
		const state: HotkeyState | undefined = (el as any).__hotkey

		const newEntries = normalizeBinding(binding.value, binding.arg, binding.modifiers)

		if (state) {
			state.entries = newEntries
		} else if (newEntries.length > 0) {
			// Previously no hotkeys, now has hotkeys
			const handler = (event: KeyboardEvent) => {
				for (const entry of newEntries) {
					if (entry.disabled) continue

					if (matchesHotkey(event, entry)) {
						if (entry.prevent) event.preventDefault()
						if (entry.stop) event.stopPropagation()
						entry.handler(event)
						return
					}
				}
			}

			;(el as any).__hotkey = { entries: newEntries, handler }
			el.tabIndex = el.tabIndex || -1
			el.addEventListener('keydown', handler)
		}
	},

	unmounted(el) {
		const state: HotkeyState | undefined = (el as any).__hotkey

		if (!state) return

		el.removeEventListener('keydown', state.handler)
		delete (el as any).__hotkey
	},
})

export default vHotkey
