import type {
	CapitalcaseBinding,
	CapitalcaseOptions,
	ClickOutsideBinding,
	ClickOutsideHandler,
	ClickOutsideOptions,
	CopyBinding,
	CopyErrorCallback,
	CopyOptions,
	CopySuccessCallback,
	DebounceBinding,
	DebounceOptions,
	DraggableBinding,
	DraggableOptions,
	FocusBinding,
	FocusOptions,
	HoverBinding,
	HoverOptions,
	ImagePreviewBinding,
	ImagePreviewOptions,
	InfiniteScrollBinding,
	InfiniteScrollOptions,
	IntersectBinding,
	IntersectOptions,
	LazyBinding,
	LazyOptions,
	LoadingBinding,
	LoadingOptions,
	LongPressBinding,
	LongPressOptions,
	LowercaseBinding,
	LowercaseOptions,
	MaskBinding,
	MaskOptions,
	MoneyBinding,
	MoneyOptions,
	MutationBinding,
	MutationOptions,
	NumberBinding,
	NumberOptions,
	PermissionBinding,
	PermissionConfig,
	PermissionOptions,
	ResizeBinding,
	ResizeOptions,
	RippleBinding,
	RippleOptions,
	SanitizeBinding,
	SanitizeOptions,
	ScrollBinding,
	ScrollOptions,
	StickyBinding,
	StickyOptions,
	SwipeDirection,
	ThrottleBinding,
	ThrottleOptions,
	TooltipBinding,
	TooltipOptions,
	TouchOptions,
	TrimBinding,
	TrimOptions,
	TruncateBinding,
	TruncateOptions,
	UppercaseBinding,
	UppercaseOptions,
	VisibleBinding,
	VisibleOptions,
} from '../../src/directives'
import { describe, expect, it } from 'vitest'
import {
	// Format directives
	capitalcase,
	clickOutside,
	copy,
	debounce,
	draggable,
	focus,
	// Event directives
	vClickOutside,
	vCopy,
	vDebounce,
	vDraggable,
	vFocus,
	vHover,
	vImagePreview,
	// Scroll directives
	vInfiniteScroll,
	// Visibility directives
	vIntersect,
	vLazy,
	vLoading,
	vLongPress,
	// Form directives
	vLowercase,
	vMask,
	vMoney,
	// Observer directives
	vMutation,
	vNumber,
	// Security directives
	vPermission,
	vResize,
	// Effect directives
	vRipple,
	vSanitize,
	vScroll,
	vSticky,
	vThrottle,
	vTooltip,
	vTouch,
	vTruncate,
	vTrim,
	vUppercase,
	vVisible,
	lowercase,
	money,
	number,
	throttle,
	tooltip,
	truncate,
	trim,
	uppercase,
} from '../../src/directives'

describe('src/directives/index.ts', () => {
	describe('event directive exports', () => {
		it('should export vClickOutside and default alias', () => {
			expect(vClickOutside).toBeDefined()
			expect(clickOutside).toBe(vClickOutside)
		})

		it('should export vCopy and default alias', () => {
			expect(vCopy).toBeDefined()
			expect(copy).toBe(vCopy)
		})

		it('should export vDebounce and default alias', () => {
			expect(vDebounce).toBeDefined()
			expect(debounce).toBe(vDebounce)
		})

		it('should export vThrottle and default alias', () => {
			expect(vThrottle).toBeDefined()
			expect(throttle).toBe(vThrottle)
		})

		it('should export vFocus and default alias', () => {
			expect(vFocus).toBeDefined()
			expect(focus).toBe(vFocus)
		})

		it('should export vLongPress', () => {
			expect(vLongPress).toBeDefined()
		})

		it('should export vHover', () => {
			expect(vHover).toBeDefined()
		})

		it('should export vTouch', () => {
			expect(vTouch).toBeDefined()
		})
	})

	describe('visibility directive exports', () => {
		it('should export vLazy', () => {
			expect(vLazy).toBeDefined()
		})

		it('should export vIntersect', () => {
			expect(vIntersect).toBeDefined()
		})

		it('should export vVisible', () => {
			expect(vVisible).toBeDefined()
		})

		it('should export vLoading', () => {
			expect(vLoading).toBeDefined()
		})

		it('should export vImagePreview', () => {
			expect(vImagePreview).toBeDefined()
		})
	})

	describe('scroll directive exports', () => {
		it('should export vScroll', () => {
			expect(vScroll).toBeDefined()
		})

		it('should export vInfiniteScroll', () => {
			expect(vInfiniteScroll).toBeDefined()
		})

		it('should export vSticky', () => {
			expect(vSticky).toBeDefined()
		})
	})

	describe('form directive exports', () => {
		it('should export vMask', () => {
			expect(vMask).toBeDefined()
		})

		it('should export vTrim', () => {
			expect(vTrim).toBeDefined()
			expect(trim).toBe(vTrim)
		})

		it('should export vMoney', () => {
			expect(vMoney).toBeDefined()
			expect(money).toBe(vMoney)
		})

		it('should export vNumber', () => {
			expect(vNumber).toBeDefined()
			expect(number).toBe(vNumber)
		})
	})

	describe('format directive exports', () => {
		it('should export vUppercase and default alias', () => {
			expect(vUppercase).toBeDefined()
			expect(uppercase).toBe(vUppercase)
		})

		it('should export vLowercase and default alias', () => {
			expect(vLowercase).toBeDefined()
			expect(lowercase).toBe(vLowercase)
		})

		it('should export vCapitalcase and default alias', () => {
			expect(vCapitalcase).toBeDefined()
			expect(capitalcase).toBe(vCapitalcase)
		})

		it('should export vTruncate and default alias', () => {
			expect(vTruncate).toBeDefined()
			expect(truncate).toBe(vTruncate)
		})
	})

	describe('security directive exports', () => {
		it('should export vPermission', () => {
			expect(vPermission).toBeDefined()
		})

		it('should export vSanitize', () => {
			expect(vSanitize).toBeDefined()
		})
	})

	describe('observer directive exports', () => {
		it('should export vResize', () => {
			expect(vResize).toBeDefined()
		})

		it('should export vMutation', () => {
			expect(vMutation).toBeDefined()
		})
	})

	describe('effect directive exports', () => {
		it('should export vRipple', () => {
			expect(vRipple).toBeDefined()
		})

		it('should export vDraggable', () => {
			expect(vDraggable).toBeDefined()
			expect(draggable).toBe(vDraggable)
		})
	})

	describe('ui directive exports', () => {
		it('should export vTooltip and default alias', () => {
			expect(vTooltip).toBeDefined()
			expect(tooltip).toBe(vTooltip)
		})
	})

	describe('type exports', () => {
		// Type exports are compile-time only, but we can verify the types are correct
		it('should export ClickOutside types', () => {
			const options: ClickOutsideOptions = {
				handler: () => {},
			}

			expect(options.handler).toBeDefined()

			const handler: ClickOutsideHandler = () => {}

			expect(handler).toBeDefined()

			const binding: ClickOutsideBinding = handler

			expect(binding).toBeDefined()
		})

		it('should export Copy types', () => {
			const options: CopyOptions = {
				value: 'test',
			}

			expect(options.value).toBe('test')

			const binding: CopyBinding = 'test'

			expect(binding).toBe('test')

			const successCallback: CopySuccessCallback = () => {}

			expect(successCallback).toBeDefined()

			const errorCallback: CopyErrorCallback = () => {}

			expect(errorCallback).toBeDefined()
		})

		it('should export Debounce types', () => {
			const options: DebounceOptions = {
				handler: () => {},
			}

			expect(options.handler).toBeDefined()

			const binding: DebounceBinding = () => {}

			expect(binding).toBeDefined()
		})

		it('should export Throttle types', () => {
			const options: ThrottleOptions = {
				handler: () => {},
			}

			expect(options.handler).toBeDefined()

			const binding: ThrottleBinding = () => {}

			expect(binding).toBeDefined()
		})

		it('should export Focus types', () => {
			const options: FocusOptions = {
				focus: true,
			}

			expect(options.focus).toBeTruthy()

			const binding: FocusBinding = true

			expect(binding).toBeTruthy()
		})

		it('should export LongPress types', () => {
			const options: LongPressOptions = {
				handler: () => {},
			}

			expect(options.handler).toBeDefined()

			const binding: LongPressBinding = () => {}

			expect(binding).toBeDefined()
		})

		it('should export Hover types', () => {
			const options: HoverOptions = {
				onEnter: () => {},
			}

			expect(options.onEnter).toBeDefined()

			const binding: HoverBinding = options

			expect(binding).toBeDefined()
		})

		it('should export Lazy types', () => {
			const options: LazyOptions = {
				src: 'test.jpg',
			}

			expect(options.src).toBe('test.jpg')

			const binding: LazyBinding = 'test.jpg'

			expect(binding).toBe('test.jpg')
		})

		it('should export Intersect types', () => {
			const options: IntersectOptions = {
				onEnter: () => {},
			}

			expect(options.onEnter).toBeDefined()

			const binding: IntersectBinding = options

			expect(binding).toBeDefined()
		})

		it('should export Visible types', () => {
			const options: VisibleOptions = {
				initial: true,
			}

			expect(options.initial).toBeTruthy()

			const binding: VisibleBinding = true

			expect(binding).toBeTruthy()
		})

		it('should export Loading types', () => {
			const options: LoadingOptions = {
				value: true,
			}

			expect(options.value).toBeTruthy()

			const binding: LoadingBinding = true

			expect(binding).toBeTruthy()
		})

		it('should export Scroll types', () => {
			const options: ScrollOptions = {
				handler: () => {},
			}

			expect(options.handler).toBeDefined()

			const binding: ScrollBinding = options

			expect(binding).toBeDefined()
		})

		it('should export InfiniteScroll types', () => {
			const options: InfiniteScrollOptions = {
				handler: () => {},
			}

			expect(options.handler).toBeDefined()

			const binding: InfiniteScrollBinding = () => {}

			expect(binding).toBeDefined()
		})

		it('should export Sticky types', () => {
			const options: StickyOptions = {
				top: 10,
			}

			expect(options.top).toBe(10)

			const binding: StickyBinding = options

			expect(binding).toBeDefined()
		})

		it('should export Mask types', () => {
			const options: MaskOptions = {
				mask: '###-##-####',
			}

			expect(options.mask).toBe('###-##-####')

			const binding: MaskBinding = '###-##-####'

			expect(binding).toBe('###-##-####')
		})

		it('should export Permission types', () => {
			const options: PermissionOptions = {
				value: 'admin',
			}

			expect(options.value).toBe('admin')

			const binding: PermissionBinding = 'admin'

			expect(binding).toBe('admin')

			const config: PermissionConfig = {
				getPermissions: () => ['read'],
			}

			expect(config.getPermissions).toBeDefined()
		})

		it('should export Sanitize types', () => {
			const options: SanitizeOptions = {
				allowedTags: ['b', 'i', 'p'],
			}

			expect(options.allowedTags).toEqual(['b', 'i', 'p'])

			const binding: SanitizeBinding = true

			expect(binding).toBeTruthy()
		})

		it('should export Resize types', () => {
			const options: ResizeOptions = {
				handler: () => {},
			}

			expect(options.handler).toBeDefined()

			const binding: ResizeBinding = options

			expect(binding).toBeDefined()
		})

		it('should export Mutation types', () => {
			const options: MutationOptions = {
				handler: () => {},
			}

			expect(options.handler).toBeDefined()

			const binding: MutationBinding = options

			expect(binding).toBeDefined()
		})

		it('should export Ripple types', () => {
			const options: RippleOptions = {
				color: 'primary',
			}

			expect(options.color).toBe('primary')

			const binding: RippleBinding = true

			expect(binding).toBeTruthy()
		})

		// New v1.2.0 types
		it('should export Uppercase types', () => {
			const options: UppercaseOptions = {
				first: true,
			}

			expect(options.first).toBeTruthy()

			const binding: UppercaseBinding = 'test'

			expect(binding).toBe('test')
		})

		it('should export Lowercase types', () => {
			const options: LowercaseOptions = {
				first: true,
			}

			expect(options.first).toBeTruthy()

			const binding: LowercaseBinding = 'TEST'

			expect(binding).toBe('TEST')
		})

		it('should export Capitalcase types', () => {
			const options: CapitalcaseOptions = {
				every: true,
			}

			expect(options.every).toBeTruthy()

			const binding: CapitalcaseBinding = 'hello world'

			expect(binding).toBe('hello world')
		})

		it('should export Truncate types', () => {
			const options: TruncateOptions = {
				length: 10,
			}

			expect(options.length).toBe(10)

			const binding: TruncateBinding = 10

			expect(binding).toBe(10)
		})

		it('should export Trim types', () => {
			const options: TrimOptions = {
				position: 'both',
			}

			expect(options.position).toBe('both')

			const binding: TrimBinding = true

			expect(binding).toBeTruthy()
		})

		it('should export Number types', () => {
			const options: NumberOptions = {
				precision: 2,
			}

			expect(options.precision).toBe(2)

			const binding: NumberBinding = {}

			expect(binding).toBeDefined()
		})

		it('should export Money types', () => {
			const options: MoneyOptions = {
				symbol: '$',
			}

			expect(options.symbol).toBe('$')

			const binding: MoneyBinding = {}

			expect(binding).toBeDefined()
		})

		it('should export Tooltip types', () => {
			const options: TooltipOptions = {
				content: 'test',
			}

			expect(options.content).toBe('test')

			const binding: TooltipBinding = 'test'

			expect(binding).toBe('test')
		})

		it('should export Draggable types', () => {
			const options: DraggableOptions = {
				axis: 'x',
			}

			expect(options.axis).toBe('x')

			const binding: DraggableBinding = true

			expect(binding).toBeTruthy()
		})

		it('should export Touch types', () => {
			const options: TouchOptions = {
				onSwipe: () => {},
			}

			expect(options.onSwipe).toBeDefined()
		})

		it('should export SwipeDirection type', () => {
			const directions: SwipeDirection[] = ['left', 'right', 'up', 'down']

			expect(directions).toHaveLength(4)
		})

		it('should export ImagePreview types', () => {
			const options: ImagePreviewOptions = {
				src: 'test.jpg',
			}

			expect(options.src).toBe('test.jpg')

			const binding: ImagePreviewBinding = 'test.jpg'

			expect(binding).toBe('test.jpg')
		})
	})
})
