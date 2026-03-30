import { defineDirective } from '@directix/core'

export type HotkeyHandler = (event: KeyboardEvent) => void

export type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta'

export interface HotkeyDefinition {
	key: string
	modifiers?: ModifierKey[]
	handler: HotkeyHandler
	prevent?: boolean
	stop?: boolean
	disabled?: boolean
	global?: boolean
}

export type HotkeyBinding
	= | HotkeyHandler
		| HotkeyDefinition
		| HotkeyDefinition[]
		| Record<string, HotkeyHandler | HotkeyDefinition>

interface HotkeyEntry {
	key: string
	modifiers: Set<ModifierKey>
	handler: HotkeyHandler
	prevent: boolean
	stop: boolean
	disabled: boolean
}

interface HotkeyState {
	entries: HotkeyEntry[]
	handler: (event: KeyboardEvent) => void
}

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

const MODIFIER_KEYS = new Set(['ctrl', 'alt', 'shift', 'meta'])

function normalizeKey(key: string): string {
	const lowerKey = key.toLowerCase()
	return KEY_ALIASES[lowerKey] || lowerKey
}

function parseHotkeyString(hotkey: string): { key: string, modifiers: ModifierKey[] } {
	const parts = hotkey.toLowerCase().split(/[+.]/)
	const modifiers: ModifierKey[] = []
	let key = ''

	for (const part of parts) {
		if (MODIFIER_KEYS.has(part)) {
			modifiers.push(part as ModifierKey)
		} else {
			key = normalizeKey(part)
		}
	}

	return { key, modifiers }
}

function matchesHotkey(event: KeyboardEvent, entry: HotkeyEntry): boolean {
	if (normalizeKey(event.key) !== entry.key) return false

	const eventModifiers = new Set<ModifierKey>()
	if (event.ctrlKey) eventModifiers.add('ctrl')
	if (event.altKey) eventModifiers.add('alt')
	if (event.shiftKey) eventModifiers.add('shift')
	if (event.metaKey) eventModifiers.add('meta')

	if (eventModifiers.size !== entry.modifiers.size) return false

	for (const mod of entry.modifiers) {
		if (!eventModifiers.has(mod)) return false
	}

	return true
}

function createEntry(
	key: string,
	modifiers: ModifierKey[],
	handler: HotkeyHandler,
	options: { prevent?: boolean, stop?: boolean, disabled?: boolean } = {},
): HotkeyEntry {
	return {
		key: normalizeKey(key),
		modifiers: new Set(modifiers),
		handler,
		prevent: options.prevent ?? true,
		stop: options.stop ?? true,
		disabled: options.disabled ?? false,
	}
}

function normalizeBinding(
	binding: HotkeyBinding,
	arg: string | undefined,
	modifiers: Record<string, boolean>,
): HotkeyEntry[] {
	// Argument syntax: v-hotkey:ctrl.s="handler" or v-hotkey:escape="handler"
	if (arg) {
		const argLower = arg.toLowerCase()
		const argIsModifier = MODIFIER_KEYS.has(argLower)

		let key: string
		const parsedModifiers: ModifierKey[] = []

		if (argIsModifier) {
			// v-hotkey:ctrl.s -> arg is modifier, key in directive modifiers
			parsedModifiers.push(argLower as ModifierKey)
			for (const mod of Object.keys(modifiers)) {
				const modLower = mod.toLowerCase()
				if (MODIFIER_KEYS.has(modLower)) {
					parsedModifiers.push(modLower as ModifierKey)
				} else {
					key = normalizeKey(mod)
				}
			}
		} else {
			// v-hotkey:escape -> arg is the key
			const parsed = parseHotkeyString(arg)
			key = parsed.key
			parsedModifiers.push(...parsed.modifiers)
			for (const mod of Object.keys(modifiers)) {
				const modLower = mod.toLowerCase()
				if (MODIFIER_KEYS.has(modLower)) {
					parsedModifiers.push(modLower as ModifierKey)
				}
			}
		}

		const handler = typeof binding === 'function' ? binding : (binding as HotkeyDefinition).handler
		return [createEntry(key!, parsedModifiers, handler)]
	}

	// Function without arg - invalid
	if (typeof binding === 'function') {
		console.warn('[Directix] v-hotkey: hotkey definition required (use v-hotkey:ctrl.s="handler")')
		return []
	}

	// Array syntax: [{ key: 's', modifiers: ['ctrl'], handler }]
	if (Array.isArray(binding)) {
		return binding.map(item =>
			createEntry(item.key, item.modifiers || [], item.handler, {
				prevent: item.prevent,
				stop: item.stop,
				disabled: item.disabled,
			}),
		)
	}

	// Object syntax
	if (typeof binding === 'object' && binding !== null) {
		// Single HotkeyDefinition: { key: 's', handler }
		if ('handler' in binding && typeof binding.handler === 'function') {
			const def = binding as HotkeyDefinition
			return [createEntry(def.key, def.modifiers || [], def.handler, def)]
		}

		// Record syntax: { 'ctrl+s': handler }
		const entries: HotkeyEntry[] = []
		for (const [hotkeyStr, value] of Object.entries(binding)) {
			const { key, modifiers: parsedModifiers } = parseHotkeyString(hotkeyStr)
			const handler = typeof value === 'function' ? value : value.handler
			const options = typeof value === 'object' ? value : {}
			entries.push(createEntry(key, parsedModifiers, handler, options))
		}
		return entries
	}

	return []
}

function createKeydownHandler(state: HotkeyState) {
	return (event: KeyboardEvent) => {
		for (const entry of state.entries) {
			if (entry.disabled) continue
			if (!matchesHotkey(event, entry)) continue

			if (entry.prevent) event.preventDefault()
			if (entry.stop) event.stopPropagation()
			entry.handler(event)
			return
		}
	}
}

function setupState(el: HTMLElement, entries: HotkeyEntry[]): HotkeyState | null {
	if (entries.length === 0) return null

	const state: HotkeyState = { entries, handler: null as any }
	state.handler = createKeydownHandler(state)

	el.tabIndex = el.tabIndex || -1
	el.addEventListener('keydown', state.handler)
	;(el as any).__hotkey = state

	return state
}

export const vHotkey = defineDirective<HotkeyBinding, HTMLElement>({
	name: 'hotkey',
	ssr: true,

	mounted(el, binding) {
		const entries = normalizeBinding(binding.value, binding.arg, binding.modifiers)
		setupState(el, entries)
	},

	updated(el, binding) {
		const state: HotkeyState | undefined = (el as any).__hotkey
		const newEntries = normalizeBinding(binding.value, binding.arg, binding.modifiers)

		if (state) {
			state.entries = newEntries
		} else {
			setupState(el, newEntries)
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
