import type { I18nMessages } from '../types'

export const enUS: I18nMessages = {
	directives: {
		debounce: {
			description: 'Debounce directive - delay event handler execution',
			params: {
				wait: 'Delay time in milliseconds',
				leading: 'Whether to invoke before delay starts',
				trailing: 'Whether to invoke after delay ends',
			},
			errors: {
				invalid_wait: 'Invalid "wait" parameter, must be a positive number',
				invalid_handler: 'Handler must be a function',
			},
		},
		throttle: {
			description: 'Throttle directive - limit event trigger frequency',
			params: {
				interval: 'Execution interval in milliseconds',
				leading: 'Whether to invoke at interval start',
				trailing: 'Whether to invoke at interval end',
			},
			errors: {
				invalid_interval: 'Invalid "interval" parameter, must be a positive number',
				invalid_handler: 'Handler must be a function',
			},
		},
		copy: {
			description: 'Copy directive - copy text to clipboard on click',
			params: {
				value: 'Text to copy',
				onSuccess: 'Copy success callback',
				onError: 'Copy error callback',
			},
			errors: {
				empty_value: 'No text to copy',
				clipboard_failed: 'Clipboard API failed, falling back to execCommand',
			},
		},
		lazy: {
			description: 'Lazy loading directive - defer image or component loading',
			params: {
				src: 'Image source URL',
				threshold: 'Intersection threshold',
				rootMargin: 'Root margin',
			},
			errors: {
				invalid_src: 'Invalid "src" parameter',
				observer_failed: 'Failed to create IntersectionObserver',
			},
		},
		permission: {
			description: 'Permission directive - control element visibility by permissions',
			params: {
				value: 'Permission value or array',
				mode: 'Permission mode: any or all',
			},
			errors: {
				empty_permission: 'Permission value cannot be empty',
				invalid_mode: 'Mode must be "any" or "all"',
			},
		},
		mask: {
			description: 'Input mask directive - format input content',
			params: {
				pattern: 'Mask pattern',
				placeholder: 'Placeholder character',
				allowIncomplete: 'Allow incomplete input',
			},
			errors: {
				invalid_pattern: 'Invalid "pattern" parameter',
			},
		},
		hotkey: {
			description: 'Hotkey directive - bind keyboard shortcuts',
			params: {
				key: 'Keyboard shortcut combination',
				handler: 'Handler function',
				prevent: 'Whether to prevent default behavior',
			},
			errors: {
				invalid_key: 'Invalid hotkey format',
				conflict: 'Hotkey conflict: {key}',
			},
		},
		clickoutside: {
			description: 'Click outside directive - detect clicks outside element',
			params: {
				handler: 'Handler function for outside clicks',
				exclude: 'Elements to exclude',
			},
			errors: {
				invalid_handler: 'Handler must be a function',
			},
		},
		longpress: {
			description: 'Long press directive - detect long press gesture',
			params: {
				duration: 'Press duration in milliseconds',
				handler: 'Long press handler function',
			},
			errors: {
				invalid_duration: 'Duration must be a positive number',
			},
		},
		draggable: {
			description: 'Draggable directive - make element draggable',
			params: {
				axis: 'Drag axis: x, y, or empty',
				bounds: 'Drag bounds',
				handle: 'Drag handle selector',
			},
			errors: {
				invalid_bounds: 'Invalid "bounds" parameter',
			},
		},
		intersect: {
			description: 'Intersect directive - observe element visibility',
			params: {
				threshold: 'Visibility threshold',
				rootMargin: 'Root margin',
				once: 'Whether to trigger only once',
			},
			errors: {
				observer_failed: 'Failed to create IntersectionObserver',
			},
		},
		loading: {
			description: 'Loading directive - display loading state',
			params: {
				value: 'Whether loading',
				text: 'Loading text',
				spinner: 'Loading spinner',
			},
		},
		skeleton: {
			description: 'Skeleton directive - display content placeholder',
			params: {
				value: 'Whether to show skeleton',
				variant: 'Skeleton variant',
				animation: 'Animation type',
			},
		},
		virtualList: {
			description: 'Virtual list directive - optimize large data rendering',
			params: {
				itemSize: 'Item height',
				buffer: 'Buffer size',
				estimatedSize: 'Estimated size',
			},
			errors: {
				invalid_itemSize: 'itemSize must be a positive number',
			},
		},
		infiniteScroll: {
			description: 'Infinite scroll directive - load more on scroll',
			params: {
				handler: 'Load more handler function',
				distance: 'Trigger distance',
				disabled: 'Whether disabled',
			},
			errors: {
				invalid_handler: 'Handler must be a function',
			},
		},
		watermark: {
			description: 'Watermark directive - add watermark overlay',
			params: {
				content: 'Watermark content',
				fontSize: 'Font size',
				color: 'Watermark color',
				opacity: 'Opacity',
			},
			errors: {
				empty_content: 'Watermark content cannot be empty',
			},
		},
		contextmenu: {
			description: 'Context menu directive - custom right-click menu',
			params: {
				items: 'Menu items list',
				handler: 'Menu item click handler',
			},
			errors: {
				empty_items: 'Menu items list cannot be empty',
			},
		},
		fullscreen: {
			description: 'Fullscreen directive - toggle element fullscreen',
			params: {
				value: 'Whether fullscreen',
				onEnter: 'Enter fullscreen callback',
				onExit: 'Exit fullscreen callback',
			},
			errors: {
				not_supported: 'Fullscreen API is not supported in this browser',
			},
		},
		imagePreview: {
			description: 'Image preview directive - click to preview image',
			params: {
				src: 'Image source URL',
				list: 'Image list',
				initialIndex: 'Initial index',
			},
			errors: {
				invalid_src: 'Invalid "src" parameter',
			},
		},
		tooltip: {
			description: 'Tooltip directive - show hover tooltip',
			params: {
				content: 'Tooltip content',
				placement: 'Display position',
				trigger: 'Trigger method',
			},
			errors: {
				empty_content: 'Tooltip content cannot be empty',
			},
		},
		lottie: {
			description: 'Lottie animation directive - play Lottie animations',
			params: {
				path: 'Animation file path',
				animationData: 'Animation data',
				loop: 'Whether to loop',
				autoplay: 'Whether to autoplay',
			},
			errors: {
				invalid_source: 'Must provide path or animationData',
				load_failed: 'Failed to load Lottie animation',
			},
		},
		swipe: {
			description: 'Swipe gesture directive - detect swipe direction',
			params: {
				threshold: 'Swipe threshold',
				velocity: 'Velocity threshold',
				onSwipe: 'Swipe callback',
			},
			errors: {
				invalid_threshold: 'Threshold must be a positive number',
			},
		},
		touch: {
			description: 'Touch gesture directive - unified touch event handling',
			params: {
				onStart: 'Touch start callback',
				onMove: 'Touch move callback',
				onEnd: 'Touch end callback',
			},
		},
		pan: {
			description: 'Pan gesture directive - detect pan operations',
			params: {
				threshold: 'Trigger threshold',
				direction: 'Pan direction: all, horizontal, vertical',
			},
		},
		pinch: {
			description: 'Pinch gesture directive - detect zoom operations',
			params: {
				threshold: 'Zoom threshold',
				onPinch: 'Zoom callback',
			},
		},
		rotateGesture: {
			description: 'Rotate gesture directive - detect rotation operations',
			params: {
				threshold: 'Rotation angle threshold',
				onRotate: 'Rotation callback',
			},
		},
		parallax: {
			description: 'Parallax directive - create parallax scrolling effect',
			params: {
				speed: 'Parallax speed',
				direction: 'Parallax direction',
			},
		},
		typewriter: {
			description: 'Typewriter directive - typewriter text animation',
			params: {
				text: 'Text to display',
				speed: 'Typing speed',
				delay: 'Start delay',
			},
			errors: {
				empty_text: 'Text content cannot be empty',
			},
		},
		countdown: {
			description: 'Countdown directive - display countdown timer',
			params: {
				time: 'Countdown time in milliseconds',
				format: 'Time format',
				onFinish: 'Finish callback',
			},
			errors: {
				invalid_time: 'Time must be a positive number',
			},
		},
		counter: {
			description: 'Counter directive - number animation',
			params: {
				from: 'Start value',
				to: 'End value',
				duration: 'Animation duration',
				decimals: 'Decimal places',
			},
			errors: {
				invalid_range: 'From and to must be numbers',
			},
		},
		progress: {
			description: 'Progress directive - display progress bar',
			params: {
				value: 'Progress value (0-100)',
				showText: 'Whether to show text',
				strokeWidth: 'Stroke width',
			},
			errors: {
				invalid_value: 'Value must be between 0 and 100',
			},
		},
		emoji: {
			description: 'Emoji picker directive - emoji selector',
			params: {
				onSelect: 'Select callback',
				exclude: 'Emoji categories to exclude',
			},
		},
		money: {
			description: 'Money input directive - format currency amounts',
			params: {
				currency: 'Currency symbol',
				precision: 'Decimal places',
				thousands: 'Thousands separator',
			},
		},
		number: {
			description: 'Number input directive - restrict numeric input',
			params: {
				min: 'Minimum value',
				max: 'Maximum value',
				precision: 'Decimal places',
			},
			errors: {
				invalid_range: 'Min must be less than max',
			},
		},
		truncate: {
			description: 'Truncate directive - truncate text',
			params: {
				length: 'Maximum length',
				omission: 'Omission string',
			},
			errors: {
				invalid_length: 'Length must be a positive integer',
			},
		},
		ellipsis: {
			description: 'Ellipsis directive - CSS text overflow ellipsis',
			params: {
				lines: 'Maximum lines',
			},
		},
		highlight: {
			description: 'Highlight directive - highlight text content',
			params: {
				keyword: 'Highlight keyword',
				color: 'Highlight color',
				className: 'CSS class name',
			},
			errors: {
				empty_keyword: 'Keyword cannot be empty',
			},
		},
		sanitize: {
			description: 'Sanitize directive - sanitize HTML content',
			params: {
				allowedTags: 'Allowed tags',
				allowedAttrs: 'Allowed attributes',
			},
		},
		focus: {
			description: 'Focus directive - auto-focus element',
			params: {
				value: 'Whether to focus',
				preventScroll: 'Whether to prevent scroll',
			},
		},
		visible: {
			description: 'Visibility directive - control element visibility',
			params: {
				value: 'Whether visible',
			},
		},
		blur: {
			description: 'Blur directive - blur element content',
			params: {
				value: 'Blur amount',
				transition: 'Transition effect',
			},
		},
		hover: {
			description: 'Hover directive - detect mouse hover',
			params: {
				onEnter: 'Enter callback',
				onLeave: 'Leave callback',
			},
		},
		fade: {
			description: 'Fade directive - fade in/out effect',
			params: {
				duration: 'Animation duration',
				delay: 'Delay time',
			},
		},
		clickWave: {
			description: 'Click wave directive - click ripple effect',
			params: {
				color: 'Ripple color',
				duration: 'Animation duration',
			},
		},
		clickDelay: {
			description: 'Click delay directive - prevent rapid clicks',
			params: {
				delay: 'Delay time',
			},
			errors: {
				invalid_delay: 'Delay must be a positive number',
			},
		},
		scroll: {
			description: 'Scroll directive - scroll behavior control',
			params: {
				behavior: 'Scroll behavior',
				smooth: 'Whether to smooth scroll',
			},
		},
		sticky: {
			description: 'Sticky directive - sticky positioning',
			params: {
				offsetTop: 'Top offset',
				offsetBottom: 'Bottom offset',
			},
		},
		print: {
			description: 'Print directive - print element content',
			params: {
				title: 'Print title',
				onBefore: 'Before print callback',
				onAfter: 'After print callback',
			},
		},
		export_: {
			description: 'Export directive - export element content',
			params: {
				type: 'Export type: image, pdf',
				filename: 'Filename',
				quality: 'Quality',
			},
			errors: {
				unsupported_type: 'Unsupported export type',
			},
		},
		pullRefresh: {
			description: 'Pull refresh directive - pull-to-refresh functionality',
			params: {
				onRefresh: 'Refresh callback',
				distance: 'Trigger distance',
			},
			errors: {
				invalid_handler: 'onRefresh must be a function',
			},
		},
		resize: {
			description: 'Resize directive - observe element size changes',
			params: {
				handler: 'Size change callback',
				debounce: 'Debounce time',
			},
			errors: {
				observer_failed: 'Failed to create ResizeObserver',
			},
		},
		mutation: {
			description: 'Mutation directive - observe DOM mutations',
			params: {
				handler: 'Mutation callback',
				options: 'Observer options',
			},
			errors: {
				observer_failed: 'Failed to create MutationObserver',
			},
		},
		ripple: {
			description: 'Ripple directive - Material Design ripple effect',
			params: {
				color: 'Ripple color',
				duration: 'Animation duration',
			},
		},
		uppercase: {
			description: 'Uppercase directive - convert to uppercase',
		},
		lowercase: {
			description: 'Lowercase directive - convert to lowercase',
		},
		capitalcase: {
			description: 'Capitalize directive - capitalize first letter',
		},
		trim: {
			description: 'Trim directive - trim whitespace',
		},
	},
	errors: {
		invalid_param: 'Invalid parameter "{param}"',
		missing_required: 'Missing required parameter "{param}"',
		type_error: 'Type error for parameter "{param}": expected {expected}, got {actual}',
		value_out_of_range: 'Parameter "{param}" is out of range, should be between {min} and {max}',
		not_supported: '{feature} is not supported in the current environment',
		ssr_not_supported: 'Directive {directive} does not support SSR',
	},
	warnings: {
		deprecated: '{feature} is deprecated, please use {alternative}',
		experimental: '{feature} is experimental and may change in future versions',
		performance: '{feature} may affect performance, use with caution',
		fallback: '{feature} failed, falling back to {alternative}',
	},
	help: {
		installation: 'Install with npm install directix',
		usage: 'Register the Directix plugin in your Vue app',
		contribution: 'See CONTRIBUTING.md for how to contribute',
	},
}
