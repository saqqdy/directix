/**
 * Event utilities for directives
 * Layer: Directive (depends on @directix/core)
 *
 * Re-exports from @directix/shared and adds directive-specific event utilities.
 */

// Event modifiers (directive-specific)
export {
	EVENT_MODIFIERS,
	getDefaultEventType,
	getEventTypeFromModifiers,
	type EventModifier,
} from '../../packages/shared/src/event-modifiers'

// Re-export event utilities from shared (low-level)
export {
	bindEvents,
	createKeyMatcher,
	delegate,
	emit,
	getCurrentTarget,
	getEventPosition,
	getEventTarget,
	off,
	on,
	preventDefault,
	stopEvent,
	stopPropagation,
	type EventHandlerMap,
	type EventOptions,
} from '@directix/shared'
