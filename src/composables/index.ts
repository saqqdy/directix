/**
 * Composables - Vue Composition API functions for directive functionality
 *
 * These composables provide the same functionality as the directives,
 * but in a composable format that can be used within setup functions.
 */

// Capitalcase composable
export { capitalizeText, capitalizeWord, createCapitalizer, useCapitalcase } from './use-capitalcase'
export type { UseCapitalcaseOptions, UseCapitalcaseReturn } from './use-capitalcase'

// Click delay composable
export { createDelayedClick, useClickDelay } from './use-click-delay'
export type { ClickDelayHandler, UseClickDelayOptions, UseClickDelayReturn } from './use-click-delay'

// Click outside composable
export { useClickOutside } from './use-click-outside'
export type { ClickOutsideHandler, UseClickOutsideOptions, UseClickOutsideReturn } from './use-click-outside'

// Copy composable
export { useCopy } from './use-copy'
export type { UseCopyOptions, UseCopyReturn } from './use-copy'

// Countdown composable
export { calculateTime, formatTime, parseTargetTime, useCountdown } from './use-countdown'
export type {
	CountdownCompleteCallback,
	CountdownFormatFunction,
	CountdownTickCallback,
	CountdownTime,
	UseCountdownOptions,
	UseCountdownReturn,
} from './use-countdown'

// Debounce composable
export { debounceFn, useDebounce } from './use-debounce'
export type { ComposableDebouncedFunction, UseDebounceOptions, UseDebounceReturn } from './use-debounce'

// Draggable composable
export { useDraggable } from './use-draggable'
export type { DraggableAxis, Position, UseDraggableOptions, UseDraggableReturn } from './use-draggable'

// Ellipsis composable
export { truncateText, useEllipsis, wouldTextTruncate } from './use-ellipsis'
export type { UseEllipsisOptions, UseEllipsisReturn } from './use-ellipsis'

// Focus composable
export { useFocus } from './use-focus'
export type { UseFocusOptions, UseFocusReturn } from './use-focus'

// Hotkey composable
export { useHotkey } from './use-hotkey'
export type { HotkeyDefinition, UseHotkeyOptions, UseHotkeyReturn } from './use-hotkey'

// Hover composable
export { useHover } from './use-hover'
export type { UseHoverOptions, UseHoverReturn } from './use-hover'

// Image preview composable
export { useImagePreview } from './use-image-preview'
export type { UseImagePreviewOptions, UseImagePreviewReturn } from './use-image-preview'

// Intersect composable
export { useIntersect } from './use-intersect'
export type { IntersectHandler, UseIntersectOptions, UseIntersectReturn } from './use-intersect'

// Long press composable
export { useLongPress } from './use-long-press'
export type { UseLongPressOptions, UseLongPressReturn } from './use-long-press'

// Lowercase composable
export { createLowercaser, lowercaseText, useLowercase } from './use-lowercase'
export type { UseLowercaseOptions, UseLowercaseReturn } from './use-lowercase'

// Money composable
export { createMoneyFormatter, formatMoney, parseMoney, useMoney } from './use-money'
export type { UseMoneyOptions, UseMoneyReturn } from './use-money'

// Number composable
export { createNumberFormatter, formatNumber, parseNumber, useNumber } from './use-number'
export type { UseNumberOptions, UseNumberReturn } from './use-number'

// Permission composable
export { createPermissionChecker, usePermission } from './use-permission'
export type { PermissionMode, UsePermissionOptions, UsePermissionReturn } from './use-permission'

// Print composable
export { quickPrint, usePrint } from './use-print'
export type { PrintBeforeCallback, PrintCompleteCallback, UsePrintOptions, UsePrintReturn } from './use-print'

// Pull refresh composable
export { usePullRefresh } from './use-pull-refresh'
export type { PullRefreshHandler, PullRefreshState, UsePullRefreshOptions, UsePullRefreshReturn } from './use-pull-refresh'

// Resize composable
export { useResize } from './use-resize'
export type { ResizeInfo, UseResizeOptions, UseResizeReturn } from './use-resize'

// Scroll composable
export { useScroll } from './use-scroll'
export type { ScrollDirection, ScrollInfo, UseScrollOptions, UseScrollReturn } from './use-scroll'

// Swipe composable
export { useSwipe } from './use-swipe'
export type { SwipeDirection, SwipeHandler, UseSwipeOptions, UseSwipeReturn } from './use-swipe'

// Throttle composable
export { throttleFn, useThrottle } from './use-throttle'
export type { ComposableThrottledFunction, UseThrottleOptions, UseThrottleReturn } from './use-throttle'

// Touch composable
export { useTouch } from './use-touch'
export type { TouchGesture, TouchGestureEvent, UseTouchOptions, UseTouchReturn } from './use-touch'

// Trim composable
export { createTrimmer, trimText, useTrim } from './use-trim'
export type { TrimPosition, UseTrimOptions, UseTrimReturn } from './use-trim'

// Uppercase composable
export { createUppercaser, uppercaseText, useUppercase } from './use-uppercase'
export type { UseUppercaseOptions, UseUppercaseReturn } from './use-uppercase'

// Virtual list composable
export { useVirtualList } from './use-virtual-list'
export type {
	ItemSizeFunction,
	UseVirtualListOptions,
	UseVirtualListReturn,
	VirtualListItem,
} from './use-virtual-list'

// Visible composable
export { useVisible } from './use-visible'
export type { UseVisibleOptions, UseVisibleReturn } from './use-visible'

// Watermark composable
export { createWatermarkUrl, useWatermark } from './use-watermark'
export type { UseWatermarkOptions, UseWatermarkReturn } from './use-watermark'
