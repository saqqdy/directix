// Event directives
export { vClickOutside, default as clickOutside } from './click-outside'
export type { ClickOutsideOptions, ClickOutsideBinding, ClickOutsideHandler } from './click-outside'

export { vCopy, default as copy } from './copy'
export type { CopyOptions, CopyBinding, CopySuccessCallback, CopyErrorCallback } from './copy'

export { vDebounce, default as debounce } from './debounce'
export type { DebounceOptions, DebounceBinding, DebouncedFunction } from './debounce'

export { vThrottle, default as throttle } from './throttle'
export type { ThrottleOptions, ThrottleBinding, ThrottledFunction } from './throttle'

export { vFocus, default as focus } from './focus'
export type { FocusOptions, FocusBinding } from './focus'

// Visibility directives
export { vLazy, default as lazy } from './lazy'
export type { LazyOptions, LazyBinding, LazyState } from './lazy'

export { vIntersect, default as intersect } from './intersect'
export type { IntersectOptions, IntersectBinding, IntersectHandler } from './intersect'

export { vVisible, default as visible } from './visible'
export type { VisibleOptions, VisibleBinding, VisibleHandler } from './visible'

export { vLoading, default as loading } from './loading'
export type { LoadingOptions, LoadingBinding } from './loading'

// Scroll directives
export { vScroll, default as scroll } from './scroll'
export type { ScrollOptions, ScrollBinding, ScrollHandler, ScrollInfo } from './scroll'

export { vInfiniteScroll, default as infiniteScroll } from './infinite-scroll'
export type { InfiniteScrollOptions, InfiniteScrollBinding, InfiniteScrollHandler } from './infinite-scroll'

export { vSticky, default as sticky } from './sticky'
export type { StickyOptions, StickyBinding } from './sticky'

// Event interaction directives
export { vLongPress, default as longPress } from './long-press'
export type { LongPressOptions, LongPressBinding, LongPressHandler } from './long-press'

export { vHover, default as hover } from './hover'
export type { HoverOptions, HoverBinding, HoverHandler } from './hover'

export { vRipple, default as ripple } from './ripple'
export type { RippleOptions, RippleBinding } from './ripple'

// Form directives
export { vMask, default as mask } from './mask'
export type { MaskOptions, MaskBinding } from './mask'

// Security directives
export { vPermission, default as permission, configurePermission, getPermissionConfig } from './permission'
export type { PermissionOptions, PermissionBinding, PermissionAction, PermissionConfig } from './permission'

export { vSanitize, default as sanitize } from './sanitize'
export type { SanitizeOptions, SanitizeBinding, SanitizeHandler } from './sanitize'

// Observer directives
export { vResize, default as resize } from './resize'
export type { ResizeOptions, ResizeBinding, ResizeHandler, ResizeInfo } from './resize'

export { vMutation, default as mutation } from './mutation'
export type { MutationOptions, MutationBinding, MutationHandler } from './mutation'

// Format directives
export { vTruncate, default as truncate } from './truncate'
export type { TruncateOptions, TruncateBinding, TruncatePosition } from './truncate'

export { vUppercase, default as uppercase } from './uppercase'
export type { UppercaseOptions, UppercaseBinding } from './uppercase'

export { vLowercase, default as lowercase } from './lowercase'
export type { LowercaseOptions, LowercaseBinding } from './lowercase'

export { vCapitalcase, default as capitalcase } from './capitalcase'
export type { CapitalcaseOptions, CapitalcaseBinding } from './capitalcase'

export { vNumber, default as number } from './number'
export type { NumberOptions, NumberBinding } from './number'

export { vMoney, default as money } from './money'
export type { MoneyOptions, MoneyBinding } from './money'

export { vTrim, default as trim } from './trim'
export type { TrimOptions, TrimBinding, TrimPosition } from './trim'

// UI directives
export { vTooltip, default as tooltip } from './tooltip'
export type { TooltipOptions, TooltipBinding, TooltipPlacement, TooltipTrigger } from './tooltip'

export { vDraggable, default as draggable } from './draggable'
export type { DraggableOptions, DraggableBinding, DraggableAxis } from './draggable'

export { vTouch, default as touch } from './touch'
export type { TouchOptions, SwipeDirection } from './touch'

export { vImagePreview, default as imagePreview } from './image-preview'
export type { ImagePreviewOptions, ImagePreviewBinding } from './image-preview'
