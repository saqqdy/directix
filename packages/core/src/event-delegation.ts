/**
 * Event Delegation Manager for Directix
 * Provides global event delegation to reduce DOM event listeners
 * and improve performance for directive-heavy applications.
 *
 * @since 2.2.0
 */

// ============================================================================
// Types
// ============================================================================

export interface EventDelegationConfig {
	/** Whether event delegation is enabled */
	enabled: boolean
	/** Root element for delegation (defaults to document) */
	root: Element | Document | null
	/** Events to delegate */
	events: string[]
	/** Whether to use capture phase */
	capture: boolean
	/** Maximum number of delegated handlers */
	maxHandlers: number
	/** Whether to automatically clean up unused handlers */
	autoCleanup: boolean
	/** Cleanup interval in ms (only when autoCleanup is true) */
	cleanupInterval: number
}

export interface DelegatedHandler {
	/** Unique ID */
	id: string
	/** CSS selector to match */
	selector: string
	/** Event type */
	event: string
	/** Handler function */
	handler: (event: Event, target: Element) => void
	/** Priority (lower = earlier) */
	priority: number
	/** Whether this handler is active */
	active: boolean
	/** Number of times this handler was invoked */
	invokeCount: number
	/** Creation timestamp */
	createdAt: number
}

export interface DelegationStats {
	/** Total registered handlers */
	totalHandlers: number
	/** Active handlers */
	activeHandlers: number
	/** Delegated event types */
	eventTypes: string[]
	/** Total invocations */
	totalInvocations: number
	/** Number of root listeners */
	rootListenerCount: number
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_EVENT_DELEGATION_CONFIG: EventDelegationConfig = {
	enabled: true,
	root: null,
	events: ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'keydown', 'input', 'change'],
	capture: false,
	maxHandlers: 1000,
	autoCleanup: true,
	cleanupInterval: 120000,
}

// ============================================================================
// Event Delegation Manager
// ============================================================================

let _config: EventDelegationConfig = { ...DEFAULT_EVENT_DELEGATION_CONFIG },
	_cleanupTimer: ReturnType<typeof setInterval> | null = null,
	_idCounter = 0
const _handlers: Map<string, DelegatedHandler> = new Map()
const _handlersByEvent: Map<string, DelegatedHandler[]> = new Map()
const _rootListeners: Map<string, (event: Event) => void> = new Map()

/**
 * Configure event delegation
 */
export function configureEventDelegation(config: Partial<EventDelegationConfig>): void {
	_config = { ...DEFAULT_EVENT_DELEGATION_CONFIG, ...config }

	if (_config.enabled) {
		startDelegation()
	} else {
		stopDelegation()
	}
}

/**
 * Get current event delegation configuration
 */
export function getEventDelegationConfig(): EventDelegationConfig {
	return { ..._config }
}

/**
 * Register a delegated event handler
 *
 * @param selector - CSS selector to match
 * @param event - Event type to listen for
 * @param handler - Handler function
 * @param options - Additional options
 * @returns Handler ID for removal
 */
export function registerDelegatedHandler(
	selector: string,
	event: string,
	handler: (event: Event, target: Element) => void,
	options: { priority?: number } = {},
): string {
	if (!_config.enabled) {
		// Fallback: return a unique ID but don't delegate
		const id = `dh-${++_idCounter}`
		return id
	}

	if (_handlers.size >= _config.maxHandlers) {
		console.warn(
			`[Directix] EventDelegationManager: Maximum handlers (${_config.maxHandlers}) reached. `
			+ 'Consider increasing maxHandlers or cleaning up unused handlers.',
		)
	}

	const id = `dh-${++_idCounter}`

	const delegatedHandler: DelegatedHandler = {
		id,
		selector,
		event,
		handler,
		priority: options.priority ?? 100,
		active: true,
		invokeCount: 0,
		createdAt: Date.now(),
	}

	_handlers.set(id, delegatedHandler)

	// Add to event-indexed map
	const eventHandlers = _handlersByEvent.get(event) ?? []
	eventHandlers.push(delegatedHandler)
	// Sort by priority
	eventHandlers.sort((a, b) => a.priority - b.priority)
	_handlersByEvent.set(event, eventHandlers)

	// Ensure root listener exists for this event type
	ensureRootListener(event)

	return id
}

/**
 * Unregister a delegated event handler
 */
export function unregisterDelegatedHandler(id: string): void {
	const handler = _handlers.get(id)
	if (!handler) return

	handler.active = false
	_handlers.delete(id)

	// Remove from event-indexed map
	const eventHandlers = _handlersByEvent.get(handler.event)
	if (eventHandlers) {
		const index = eventHandlers.findIndex(h => h.id === id)
		if (index !== -1) {
			eventHandlers.splice(index, 1)
		}
		// If no more handlers for this event, remove root listener
		if (eventHandlers.length === 0) {
			removeRootListener(handler.event)
			_handlersByEvent.delete(handler.event)
		}
	}
}

/**
 * Pause a delegated handler without removing it
 */
export function pauseDelegatedHandler(id: string): void {
	const handler = _handlers.get(id)
	if (handler) {
		handler.active = false
	}
}

/**
 * Resume a paused delegated handler
 */
export function resumeDelegatedHandler(id: string): void {
	const handler = _handlers.get(id)
	if (handler) {
		handler.active = true
	}
}

/**
 * Get delegation statistics
 */
export function getDelegationStats(): DelegationStats {
	let totalInvocations = 0,
		activeCount = 0

	for (const handler of _handlers.values()) {
		totalInvocations += handler.invokeCount
		if (handler.active) activeCount++
	}

	return {
		totalHandlers: _handlers.size,
		activeHandlers: activeCount,
		eventTypes: Array.from(_handlersByEvent.keys()),
		totalInvocations,
		rootListenerCount: _rootListeners.size,
	}
}

/**
 * Remove all handlers and stop delegation
 */
export function clearDelegatedHandlers(): void {
	stopDelegation()
	_handlers.clear()
	_handlersByEvent.clear()
	_rootListeners.clear()
}

/**
 * Start event delegation
 */
export function startDelegation(): void {
	const events = _config.events

	for (const event of events) {
		if (_handlersByEvent.has(event) || _rootListeners.has(event)) {
			continue // Already has handlers or listener
		}
		ensureRootListener(event)
	}

	// Start auto-cleanup timer
	if (_config.autoCleanup && _cleanupTimer === null) {
		_cleanupTimer = setInterval(cleanupStaleHandlers, _config.cleanupInterval)
	}
}

/**
 * Stop event delegation (removes all root listeners)
 */
export function stopDelegation(): void {
	for (const [event, listener] of _rootListeners) {
		const rootEl = _config.root ?? document
		rootEl.removeEventListener(event, listener, _config.capture)
	}
	_rootListeners.clear()

	if (_cleanupTimer !== null) {
		clearInterval(_cleanupTimer)
		_cleanupTimer = null
	}
}

// ============================================================================
// Internal Helpers
// ============================================================================

function ensureRootListener(event: string): void {
	if (_rootListeners.has(event)) return

	const root = _config.root ?? document

	const listener = (eventObj: Event): void => {
		handleDelegatedEvent(event, eventObj)
	}

	root.addEventListener(event, listener, _config.capture)
	_rootListeners.set(event, listener)
}

function removeRootListener(event: string): void {
	const listener = _rootListeners.get(event)
	if (!listener) return

	const root = _config.root ?? document
	root.removeEventListener(event, listener, _config.capture)
	_rootListeners.delete(event)
}

function handleDelegatedEvent(eventType: string, event: Event): void {
	const handlers = _handlersByEvent.get(eventType)
	if (!handlers || handlers.length === 0) return

	const target = event.target as Element | null
	if (!target) return

	// Walk up from target to root, checking selectors
	for (const handler of handlers) {
		if (!handler.active) continue

		// Check if target matches the selector
		let matched: Element | null = null
		try {
			// Use closest() for efficient ancestor matching
			matched = target.closest(handler.selector)
		} catch {
			// Invalid selector, skip
			continue
		}

		if (matched) {
			handler.invokeCount++
			try {
				handler.handler(event, matched)
			} catch (error) {
				console.warn(
					`[Directix] EventDelegationManager: Handler "${handler.id}" error:`,
					error,
				)
			}

			// If handler called stopImmediatePropagation, stop processing
			if ((event as any).cancelBubble) break
		}
	}
}

function cleanupStaleHandlers(): void {
	const now = Date.now()
	const staleIds: string[] = []

	for (const [id, handler] of _handlers) {
		// Remove handlers that have been inactive for a long time
		if (!handler.active && now - handler.createdAt > 300000) {
			staleIds.push(id)
		}
	}

	for (const id of staleIds) {
		unregisterDelegatedHandler(id)
	}
}
