import { isBrowser } from '@directix/core'
import { onUnmounted, ref, type Ref, unref, watch } from 'vue'

/**
 * Key alias map
 */
const KEY_ALIASES: Record<string, string> = {
	esc: 'Escape',
	space: ' ',
	up: 'ArrowUp',
	down: 'ArrowDown',
	left: 'ArrowLeft',
	right: 'ArrowRight',
	enter: 'Enter',
	tab: 'Tab',
	backspace: 'Backspace',
	delete: 'Delete',
	insert: 'Insert',
	home: 'Home',
	end: 'End',
	pageup: 'PageUp',
	pagedown: 'PageDown',
	plus: '+',
	minus: '-',
}

/**
 * Modifier keys
 */
const MODIFIERS = new Set(['ctrl', 'alt', 'shift', 'meta'])

/**
 * Hotkey definition
 */
export interface HotkeyDefinition {
	/**
	 * Key combination (e.g., 'ctrl+s', 'alt+shift+a')
	 */
	key: string

	/**
	 * Handler function
	 */
	handler: (event: KeyboardEvent) => void

	/**
	 * Whether to prevent default behavior
	 * @default true
	 */
	prevent?: boolean

	/**
	 * Whether to stop propagation
	 * @default false
	 */
	stop?: boolean

	/**
	 * Whether to trigger on keyup instead of keydown
	 * @default false
	 */
	keyup?: boolean

	/**
	 * Whether the hotkey is disabled
	 * @default false
	 */
	disabled?: boolean | Ref<boolean>
}

/**
 * Options for useHotkey composable
 */
export interface UseHotkeyOptions {
	/**
	 * Single hotkey definition
	 */
	hotkey?: HotkeyDefinition

	/**
	 * Multiple hotkey definitions
	 */
	hotkeys?: HotkeyDefinition[]

	/**
	 * Target element to bind events (defaults to document)
	 */
	target?: HTMLElement | Ref<HTMLElement | null>

	/**
	 * Whether to enable the hotkey(s)
	 * @default true
	 */
	enabled?: boolean | Ref<boolean>
}

/**
 * Return type for useHotkey composable
 */
export interface UseHotkeyReturn {
	/**
	 * Whether the hotkey is currently enabled
	 */
	enabled: Ref<boolean>

	/**
	 * Enable the hotkey
	 */
	enable: () => void

	/**
	 * Disable the hotkey
	 */
	disable: () => void

	/**
	 * Toggle the hotkey
	 */
	toggle: () => void

	/**
	 * Add a hotkey
	 */
	add: (hotkey: HotkeyDefinition) => void

	/**
	 * Remove a hotkey by key
	 */
	remove: (key: string) => void

	/**
	 * Remove all hotkeys
	 */
	clear: () => void
}

/**
 * Parse hotkey string into modifiers and key
 */
function parseHotkey(hotkey: string): { modifiers: Set<string>, key: string } {
	const parts = hotkey.toLowerCase().split('+').map(p => p.trim())
	const modifiers = new Set<string>()
	let key = ''

	for (const part of parts) {
		if (MODIFIERS.has(part)) {
			modifiers.add(part)
		} else {
			key = KEY_ALIASES[part] || part
		}
	}

	return { key, modifiers }
}

/**
 * Check if event matches hotkey
 */
function matchesHotkey(event: KeyboardEvent, definition: { modifiers: Set<string>, key: string }): boolean {
	// Check modifiers
	if (definition.modifiers.has('ctrl') !== (event.ctrlKey || event.metaKey)) return false
	if (definition.modifiers.has('alt') !== event.altKey) return false
	if (definition.modifiers.has('shift') !== event.shiftKey) return false
	if (definition.modifiers.has('meta') !== event.metaKey) return false

	// Check key (case-insensitive)
	const eventKey = event.key
	const targetKey = definition.key

	return eventKey.toLowerCase() === targetKey.toLowerCase()
}

/**
 * Composable for handling keyboard shortcuts
 *
 * @param options - Configuration options
 * @returns Hotkey utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { useHotkey } from 'directix'
 *
 * const { enable, disable, add, remove } = useHotkey({
 *   hotkeys: [
 *     { key: 'ctrl+s', handler: (e) => save() },
 *     { key: 'ctrl+z', handler: (e) => undo() },
 *   ]
 * })
 *
 * // Add dynamic hotkey
 * add({ key: 'esc', handler: (e) => closeModal() })
 * </script>
 * ```
 */
export function useHotkey(options: UseHotkeyOptions = {}): UseHotkeyReturn {
	const {
		hotkey,
		hotkeys = [],
		target,
		enabled: initialEnabled = true,
	} = options

	const enabled = ref(unref(initialEnabled))
	const hotkeyMap = new Map<string, HotkeyDefinition[]>()

	let currentTarget: HTMLElement | Document | null = null,
		keydownHandler: ((e: KeyboardEvent) => void) | null = null,
		keyupHandler: ((e: KeyboardEvent) => void) | null = null

	// Initialize hotkeys
	if (hotkey) {
		addHotkey(hotkey)
	}
	hotkeys.forEach(addHotkey)

	function addHotkey(def: HotkeyDefinition): void {
		// Parse the hotkey to get the actual key (without modifiers)
		const parsed = parseHotkey(def.key)
		const key = parsed.key.toLowerCase()
		if (!hotkeyMap.has(key)) {
			hotkeyMap.set(key, [])
		}
		hotkeyMap.get(key)!.push(def)
	}

	function removeHotkey(key: string): void {
		hotkeyMap.delete(key.toLowerCase())
	}

	function clearHotkeys(): void {
		hotkeyMap.clear()
	}

	function handleKeyEvent(event: KeyboardEvent, isKeyup: boolean): void {
		if (!enabled.value) return

		const key = event.key.toLowerCase()
		const definitions = hotkeyMap.get(key)

		if (!definitions) return

		for (const def of definitions) {
			// Check disabled
			if (unref(def.disabled)) continue

			// Check keyup/keydown
			if (!!def.keyup !== isKeyup) continue

			// Parse and match
			const parsed = parseHotkey(def.key)
			if (matchesHotkey(event, parsed)) {
				if (def.prevent !== false) {
					event.preventDefault()
				}
				if (def.stop) {
					event.stopPropagation()
				}
				def.handler(event)
				break
			}
		}
	}

	function bind(): void {
		if (!isBrowser()) return

		unbind()

		currentTarget = target ? unref(target) : document

		keydownHandler = (e: KeyboardEvent) => handleKeyEvent(e, false)
		keyupHandler = (e: KeyboardEvent) => handleKeyEvent(e, true)

		currentTarget?.addEventListener('keydown', keydownHandler as (e: Event) => void)
		currentTarget?.addEventListener('keyup', keyupHandler as (e: Event) => void)
	}

	function unbind(): void {
		if (currentTarget) {
			if (keydownHandler) {
				currentTarget.removeEventListener('keydown', keydownHandler as (e: Event) => void)
			}
			if (keyupHandler) {
				currentTarget.removeEventListener('keyup', keyupHandler as (e: Event) => void)
			}
		}
		currentTarget = null
		keydownHandler = null
		keyupHandler = null
	}

	function enable(): void {
		enabled.value = true
	}

	function disable(): void {
		enabled.value = false
	}

	function toggle(): void {
		enabled.value = !enabled.value
	}

	// Watch for enabled changes
	watch(enabled, newEnabled => {
		if (newEnabled) {
			bind()
		} else {
			unbind()
		}
	})

	// Watch for target changes
	if (target && typeof target === 'object' && 'value' in target) {
		watch(target, () => {
			if (enabled.value) {
				bind()
			}
		})
	}

	// Initial bind
	if (enabled.value) {
		bind()
	}

	// Cleanup on unmount
	onUnmounted(() => {
		unbind()
	})

	return {
		enabled,
		enable,
		disable,
		toggle,
		add: addHotkey,
		remove: removeHotkey,
		clear: clearHotkeys,
	}
}
