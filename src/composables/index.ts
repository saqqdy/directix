/**
 * Composables - Vue Composition API functions for directive functionality
 *
 * These composables provide the same functionality as the directives,
 * but in a composable format that can be used within setup functions.
 */

// Blur composable
export { useBlur } from './use-blur'
export type { UseBlurOptions, UseBlurReturn } from './use-blur'

// Capitalcase composable
export { capitalizeText, capitalizeWord, createCapitalizer, useCapitalcase } from './use-capitalcase'
export type { UseCapitalcaseOptions, UseCapitalcaseReturn } from './use-capitalcase'

// Click delay composable
export { createDelayedClick, useClickDelay } from './use-click-delay'
export type { ClickDelayHandler, UseClickDelayOptions, UseClickDelayReturn } from './use-click-delay'

// Click outside composable
export { useClickOutside } from './use-click-outside'
export type { ClickOutsideHandler, UseClickOutsideOptions, UseClickOutsideReturn } from './use-click-outside'

// Click wave composable
export { useClickWave } from './use-click-wave'
export type { UseClickWaveOptions, UseClickWaveReturn } from './use-click-wave'

// Context menu composable
export { useContextMenu } from './use-context-menu'
export type { ContextMenuItem, UseContextMenuOptions, UseContextMenuReturn } from './use-context-menu'

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

// Counter composable
export { useCounter } from './use-counter'
export type { CounterEasing, UseCounterOptions, UseCounterReturn } from './use-counter'

// Debounce composable
export { debounceFn, useDebounce } from './use-debounce'
export type { ComposableDebouncedFunction, UseDebounceOptions, UseDebounceReturn } from './use-debounce'

// Draggable composable
export { useDraggable } from './use-draggable'
export type { DraggableAxis, Position, UseDraggableOptions, UseDraggableReturn } from './use-draggable'

// Ellipsis composable
export { truncateText, useEllipsis, wouldTextTruncate } from './use-ellipsis'
export type { UseEllipsisOptions, UseEllipsisReturn } from './use-ellipsis'

// Emoji composable
export { useEmoji } from './use-emoji'
export type { UseEmojiOptions, UseEmojiReturn } from './use-emoji'

// Export composable
export { useExport } from './use-export'
export type { ExportFormat, UseExportOptions, UseExportReturn } from './use-export'

// Fade composable
export { useFade } from './use-fade'
export type { UseFadeOptions, UseFadeReturn } from './use-fade'

// Focus composable
export { useFocus } from './use-focus'
export type { UseFocusOptions, UseFocusReturn } from './use-focus'

// Fullscreen composable
export { useFullscreen } from './use-fullscreen'
export type { UseFullscreenOptions, UseFullscreenReturn } from './use-fullscreen'

// Highlight composable
export { useHighlight } from './use-highlight'
export type { UseHighlightOptions, UseHighlightReturn } from './use-highlight'

// Hotkey composable
export { useHotkey } from './use-hotkey'
export type { HotkeyDefinition, UseHotkeyOptions, UseHotkeyReturn } from './use-hotkey'

// Hover composable
export { useHover } from './use-hover'
export type { UseHoverOptions, UseHoverReturn } from './use-hover'

// Image preview composable
export { useImagePreview } from './use-image-preview'
export type { UseImagePreviewOptions, UseImagePreviewReturn } from './use-image-preview'

// Infinite scroll composable
export { useInfiniteScroll } from './use-infinite-scroll'
export type { UseInfiniteScrollOptions, UseInfiniteScrollReturn } from './use-infinite-scroll'

// Intersect composable
export { useIntersect } from './use-intersect'
export type { IntersectHandler, UseIntersectOptions, UseIntersectReturn } from './use-intersect'

// Lazy composable
export { useLazy } from './use-lazy'
export type { LazyState, UseLazyOptions, UseLazyReturn } from './use-lazy'

// Loading composable
export { useLoading } from './use-loading'
export type { UseLoadingOptions, UseLoadingReturn } from './use-loading'

// Long press composable
export { useLongPress } from './use-long-press'
export type { UseLongPressOptions, UseLongPressReturn } from './use-long-press'

// Lottie composable
export { useLottie } from './use-lottie'
export type { LottieAnimationState, UseLottieOptions, UseLottieReturn } from './use-lottie'

// Lowercase composable
export { createLowercaser, lowercaseText, useLowercase } from './use-lowercase'
export type { UseLowercaseOptions, UseLowercaseReturn } from './use-lowercase'

// Mask composable
export { useMask } from './use-mask'
export type { UseMaskOptions, UseMaskReturn } from './use-mask'

// Money composable
export { createMoneyFormatter, formatMoney, parseMoney, useMoney } from './use-money'
export type { UseMoneyOptions, UseMoneyReturn } from './use-money'

// Mutation composable
export { useMutation } from './use-mutation'
export type { MutationHandler, UseMutationOptions, UseMutationReturn } from './use-mutation'

// Number composable
export { createNumberFormatter, formatNumber, parseNumber, useNumber } from './use-number'
export type { UseNumberOptions, UseNumberReturn } from './use-number'

// Pan composable
export { usePan } from './use-pan'
export type { PanEvent, UsePanOptions, UsePanReturn } from './use-pan'

// Parallax composable
export { useParallax } from './use-parallax'
export type { UseParallaxOptions, UseParallaxReturn } from './use-parallax'

// Permission composable
export { createPermissionChecker, usePermission } from './use-permission'
export type { PermissionMode, UsePermissionOptions, UsePermissionReturn } from './use-permission'

// Pinch composable
export { usePinch } from './use-pinch'
export type { PinchEvent, UsePinchOptions, UsePinchReturn } from './use-pinch'

// Print composable
export { quickPrint, usePrint } from './use-print'
export type { PrintBeforeCallback, PrintCompleteCallback, UsePrintOptions, UsePrintReturn } from './use-print'

// Progress composable
export { useProgress } from './use-progress'
export type { UseProgressOptions, UseProgressReturn } from './use-progress'

// Pull refresh composable
export { usePullRefresh } from './use-pull-refresh'
export type { PullRefreshHandler, PullRefreshState, UsePullRefreshOptions, UsePullRefreshReturn } from './use-pull-refresh'

// Resize composable
export { useResize } from './use-resize'
export type { ResizeInfo, UseResizeOptions, UseResizeReturn } from './use-resize'

// Ripple composable
export { useRipple } from './use-ripple'
export type { UseRippleOptions, UseRippleReturn } from './use-ripple'

// Rotate gesture composable
export { useRotateGesture } from './use-rotate-gesture'
export type { RotateGestureEvent, UseRotateGestureOptions, UseRotateGestureReturn } from './use-rotate-gesture'

// Sanitize composable
export { useSanitize } from './use-sanitize'
export type { UseSanitizeOptions, UseSanitizeReturn } from './use-sanitize'

// Scroll composable
export { useScroll } from './use-scroll'
export type { ScrollDirection, ScrollInfo, UseScrollOptions, UseScrollReturn } from './use-scroll'

// Skeleton composable
export { useSkeleton } from './use-skeleton'
export type { SkeletonAnimation, UseSkeletonOptions, UseSkeletonReturn } from './use-skeleton'

// Sticky composable
export { useSticky } from './use-sticky'
export type { UseStickyOptions, UseStickyReturn } from './use-sticky'

// Swipe composable
export { useSwipe } from './use-swipe'
export type { SwipeDirection, SwipeHandler, UseSwipeOptions, UseSwipeReturn } from './use-swipe'

// Throttle composable
export { throttleFn, useThrottle } from './use-throttle'
export type { ComposableThrottledFunction, UseThrottleOptions, UseThrottleReturn } from './use-throttle'

// Tooltip composable
export { useTooltip } from './use-tooltip'
export type { TooltipPlacement, TooltipTrigger, UseTooltipOptions, UseTooltipReturn } from './use-tooltip'

// Touch composable
export { useTouch } from './use-touch'
export type { TouchGesture, TouchGestureEvent, UseTouchOptions, UseTouchReturn } from './use-touch'

// Trim composable
export { createTrimmer, trimText, useTrim } from './use-trim'
export type { TrimPosition, UseTrimOptions, UseTrimReturn } from './use-trim'

// Truncate composable
export { useTruncate } from './use-truncate'
export type { TruncatePosition, UseTruncateOptions, UseTruncateReturn } from './use-truncate'

// Typewriter composable
export { useTypewriter } from './use-typewriter'
export type { UseTypewriterOptions, UseTypewriterReturn } from './use-typewriter'

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
