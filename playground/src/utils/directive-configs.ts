import type { DirectiveConfig } from '../types'

export const directiveConfigs: DirectiveConfig[] = [
	// Event Directives
	{
		name: 'click-outside',
		displayName: 'v-click-outside',
		description: 'Detect clicks outside of an element',
		category: 'Event',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'handler',
				type: 'function',
				description: 'Callback function when click outside is detected',
				required: true,
			},
			{
				name: 'exclude',
				type: 'array',
				description: 'Elements to exclude from triggering',
				default: [],
			},
			{
				name: 'capture',
				type: 'boolean',
				description: 'Use capture mode for event listener',
				default: true,
			},
			{
				name: 'events',
				type: 'array',
				description: 'Events to listen for',
				default: ['click'],
			},
			{
				name: 'disabled',
				type: 'boolean',
				description: 'Disable the directive',
				default: false,
			},
		],
		examples: [
			{
				title: 'Basic Usage',
				description: 'Close dropdown when clicking outside',
				code: `<div v-click-outside="closeDropdown">
  <button @click="show = !show">Toggle</button>
  <div v-if="show" class="dropdown">Content</div>
</div>`,
			},
		],
	},
	{
		name: 'debounce',
		displayName: 'v-debounce',
		description: 'Debounce function execution on input events',
		category: 'Event',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'handler',
				type: 'function',
				description: 'Function to debounce',
				required: true,
			},
			{
				name: 'wait',
				type: 'number',
				description: 'Debounce delay in milliseconds',
				default: 300,
				min: 0,
				max: 10000,
				step: 50,
			},
			{
				name: 'leading',
				type: 'boolean',
				description: 'Execute on leading edge',
				default: false,
			},
			{
				name: 'trailing',
				type: 'boolean',
				description: 'Execute on trailing edge',
				default: true,
			},
		],
		examples: [
			{
				title: 'Search Input',
				description: 'Debounce search input',
				code: `<input v-debounce="{ handler: handleSearch, wait: 500 }" />`,
			},
		],
	},
	{
		name: 'throttle',
		displayName: 'v-throttle',
		description: 'Throttle function execution',
		category: 'Event',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'handler',
				type: 'function',
				description: 'Function to throttle',
				required: true,
			},
			{
				name: 'wait',
				type: 'number',
				description: 'Throttle interval in milliseconds',
				default: 300,
				min: 0,
				max: 10000,
				step: 50,
			},
			{
				name: 'leading',
				type: 'boolean',
				description: 'Execute on leading edge',
				default: true,
			},
			{
				name: 'trailing',
				type: 'boolean',
				description: 'Execute on trailing edge',
				default: true,
			},
		],
		examples: [
			{
				title: 'Scroll Handler',
				description: 'Throttle scroll event handling',
				code: `<div v-throttle="{ handler: handleScroll, wait: 200 }">Content</div>`,
			},
		],
	},
	{
		name: 'long-press',
		displayName: 'v-long-press',
		description: 'Detect long press gestures',
		category: 'Event',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'handler',
				type: 'function',
				description: 'Callback function on long press',
				required: true,
			},
			{
				name: 'duration',
				type: 'number',
				description: 'Duration in milliseconds to trigger',
				default: 500,
				min: 100,
				max: 5000,
				step: 100,
			},
			{
				name: 'disabled',
				type: 'boolean',
				description: 'Disable the directive',
				default: false,
			},
		],
		examples: [
			{
				title: 'Context Menu',
				description: 'Show context menu on long press',
				code: `<button v-long-press="{ handler: showMenu, duration: 600 }">
  Hold me
</button>`,
			},
		],
	},
	{
		name: 'hover',
		displayName: 'v-hover',
		description: 'Track hover state on elements',
		category: 'Event',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'handler',
				type: 'function',
				description: 'Callback when hover state changes',
				required: false,
			},
			{
				name: 'enterDelay',
				type: 'number',
				description: 'Delay before triggering enter (ms)',
				default: 0,
				min: 0,
				max: 2000,
			},
			{
				name: 'leaveDelay',
				type: 'number',
				description: 'Delay before triggering leave (ms)',
				default: 0,
				min: 0,
				max: 2000,
			},
		],
		examples: [
			{
				title: 'Tooltip',
				description: 'Show tooltip on hover',
				code: `<div v-hover="handleHover">
  Hover over me
  <span v-if="isHovering" class="tooltip">Tooltip</span>
</div>`,
			},
		],
	},
	{
		name: 'hotkey',
		displayName: 'v-hotkey',
		description: 'Bind keyboard shortcuts',
		category: 'Event',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'handler',
				type: 'function',
				description: 'Callback when hotkey is pressed',
				required: true,
			},
			{
				name: 'key',
				type: 'string',
				description: 'Key combination (e.g., "ctrl+s", "cmd+k")',
				required: true,
			},
			{
				name: 'prevent',
				type: 'boolean',
				description: 'Prevent default browser behavior',
				default: true,
			},
		],
		examples: [
			{
				title: 'Save Shortcut',
				description: 'Save on Ctrl+S',
				code: `<div v-hotkey="{ handler: save, key: 'ctrl+s' }">
  Press Ctrl+S to save
</div>`,
			},
		],
	},
	{
		name: 'click-delay',
		displayName: 'v-click-delay',
		description: 'Prevent rapid consecutive clicks',
		category: 'Event',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'handler',
				type: 'function',
				description: 'Click handler',
				required: true,
			},
			{
				name: 'delay',
				type: 'number',
				description: 'Minimum delay between clicks (ms)',
				default: 300,
				min: 0,
				max: 5000,
			},
		],
		examples: [
			{
				title: 'Submit Button',
				description: 'Prevent double submission',
				code: `<button v-click-delay="{ handler: submit, delay: 1000 }">
  Submit
</button>`,
			},
		],
	},

	// Form Directives
	{
		name: 'copy',
		displayName: 'v-copy',
		description: 'Copy text to clipboard on click',
		category: 'Form',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'value',
				type: 'string',
				description: 'Text to copy',
				required: true,
			},
			{
				name: 'onSuccess',
				type: 'function',
				description: 'Callback on successful copy',
			},
			{
				name: 'onError',
				type: 'function',
				description: 'Callback on copy failure',
			},
		],
		examples: [
			{
				title: 'Copy Button',
				description: 'Copy text on click',
				code: `<button v-copy="{ value: 'Hello World', onSuccess: () => alert('Copied!') }">
  Copy
</button>`,
			},
		],
	},
	{
		name: 'focus',
		displayName: 'v-focus',
		description: 'Auto-focus element on mount',
		category: 'Form',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'delay',
				type: 'number',
				description: 'Delay before focusing (ms)',
				default: 0,
				min: 0,
				max: 5000,
			},
			{
				name: 'disabled',
				type: 'boolean',
				description: 'Disable auto-focus',
				default: false,
			},
		],
		examples: [
			{
				title: 'Auto-focus Input',
				description: 'Focus input on mount',
				code: `<input v-focus placeholder="Auto-focused" />`,
			},
		],
	},
	{
		name: 'mask',
		displayName: 'v-mask',
		description: 'Input masking for formatted input',
		category: 'Form',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'pattern',
				type: 'string',
				description: 'Mask pattern (e.g., "####-####-####")',
				required: true,
			},
			{
				name: 'placeholder',
				type: 'string',
				description: 'Placeholder character',
				default: '_',
			},
		],
		examples: [
			{
				title: 'Phone Number',
				description: 'Format phone number input',
				code: `<input v-mask="'(###) ###-####'" placeholder="Phone number" />`,
			},
		],
	},
	{
		name: 'trim',
		displayName: 'v-trim',
		description: 'Trim whitespace from input',
		category: 'Form',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'position',
				type: 'select',
				description: 'Where to trim',
				default: 'both',
				options: [
					{ value: 'both', label: 'Both' },
					{ value: 'start', label: 'Start' },
					{ value: 'end', label: 'End' },
				],
			},
		],
		examples: [
			{
				title: 'Trim Input',
				description: 'Trim whitespace on blur',
				code: `<input v-trim v-model="text" />`,
			},
		],
	},

	// Format Directives
	{
		name: 'uppercase',
		displayName: 'v-uppercase',
		description: 'Convert text to uppercase',
		category: 'Format',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'locale',
				type: 'string',
				description: 'Locale for conversion',
				default: undefined,
			},
		],
		examples: [
			{
				title: 'Uppercase Text',
				description: 'Display text in uppercase',
				code: `<span v-uppercase>hello world</span>`,
			},
		],
	},
	{
		name: 'lowercase',
		displayName: 'v-lowercase',
		description: 'Convert text to lowercase',
		category: 'Format',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'locale',
				type: 'string',
				description: 'Locale for conversion',
				default: undefined,
			},
		],
		examples: [
			{
				title: 'Lowercase Text',
				description: 'Display text in lowercase',
				code: `<span v-lowercase>HELLO WORLD</span>`,
			},
		],
	},
	{
		name: 'capitalcase',
		displayName: 'v-capitalcase',
		description: 'Capitalize first letter',
		category: 'Format',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'locale',
				type: 'string',
				description: 'Locale for conversion',
				default: undefined,
			},
		],
		examples: [
			{
				title: 'Capitalize',
				description: 'Capitalize first letter',
				code: `<span v-capitalcase>hello world</span>`,
			},
		],
	},
	{
		name: 'number',
		displayName: 'v-number',
		description: 'Format numbers with separators',
		category: 'Format',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'decimals',
				type: 'number',
				description: 'Number of decimal places',
				default: 0,
				min: 0,
				max: 10,
			},
			{
				name: 'separator',
				type: 'string',
				description: 'Thousands separator',
				default: ',',
			},
			{
				name: 'decimalPoint',
				type: 'string',
				description: 'Decimal point character',
				default: '.',
			},
		],
		examples: [
			{
				title: 'Format Number',
				description: 'Display formatted number',
				code: `<span v-number="{ decimals: 2 }">1234567.89</span>`,
			},
		],
	},
	{
		name: 'money',
		displayName: 'v-money',
		description: 'Format currency values',
		category: 'Format',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'currency',
				type: 'string',
				description: 'Currency symbol',
				default: '$',
			},
			{
				name: 'decimals',
				type: 'number',
				description: 'Decimal places',
				default: 2,
				min: 0,
				max: 10,
			},
			{
				name: 'position',
				type: 'select',
				description: 'Symbol position',
				default: 'before',
				options: [
					{ value: 'before', label: 'Before' },
					{ value: 'after', label: 'After' },
				],
			},
		],
		examples: [
			{
				title: 'Format Currency',
				description: 'Display formatted money',
				code: `<span v-money="{ currency: '¥', decimals: 2 }">1234.5</span>`,
			},
		],
	},
	{
		name: 'truncate',
		displayName: 'v-truncate',
		description: 'Truncate text with ellipsis',
		category: 'Format',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'length',
				type: 'number',
				description: 'Maximum length',
				default: 100,
				min: 1,
				max: 1000,
			},
			{
				name: 'suffix',
				type: 'string',
				description: 'Suffix for truncated text',
				default: '...',
			},
		],
		examples: [
			{
				title: 'Truncate Text',
				description: 'Limit text length',
				code: `<p v-truncate="{ length: 50 }">Long text here...</p>`,
			},
		],
	},
	{
		name: 'ellipsis',
		displayName: 'v-ellipsis',
		description: 'Multi-line text ellipsis',
		category: 'Format',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'lines',
				type: 'number',
				description: 'Number of lines',
				default: 1,
				min: 1,
				max: 10,
			},
		],
		examples: [
			{
				title: 'Multi-line Ellipsis',
				description: 'Limit to specific lines',
				code: `<p v-ellipsis="3">Long text spanning multiple lines...</p>`,
			},
		],
	},

	// Visibility Directives
	{
		name: 'lazy',
		displayName: 'v-lazy',
		description: 'Lazy load images when visible',
		category: 'Visibility',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'src',
				type: 'string',
				description: 'Image source URL',
				required: true,
			},
			{
				name: 'placeholder',
				type: 'string',
				description: 'Placeholder image URL',
			},
			{
				name: 'preload',
				type: 'number',
				description: 'Preload distance in pixels',
				default: 0,
				min: 0,
				max: 1000,
			},
		],
		examples: [
			{
				title: 'Lazy Image',
				description: 'Load image when in viewport',
				code: `<img v-lazy="{ src: 'image.jpg', preload: 100 }" />`,
			},
		],
	},
	{
		name: 'intersect',
		displayName: 'v-intersect',
		description: 'Detect element intersection with viewport',
		category: 'Visibility',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'handler',
				type: 'function',
				description: 'Callback on intersection change',
				required: true,
			},
			{
				name: 'threshold',
				type: 'number',
				description: 'Intersection threshold (0-1)',
				default: 0,
				min: 0,
				max: 1,
				step: 0.1,
			},
			{
				name: 'rootMargin',
				type: 'string',
				description: 'Root margin for intersection',
				default: '0px',
			},
		],
		examples: [
			{
				title: 'Intersection Observer',
				description: 'Detect visibility',
				code: `<div v-intersect="handleIntersect">Am I visible?</div>`,
			},
		],
	},
	{
		name: 'visible',
		displayName: 'v-visible',
		description: 'Control element visibility',
		category: 'Visibility',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'value',
				type: 'boolean',
				description: 'Visibility state',
				required: true,
			},
		],
		examples: [
			{
				title: 'Toggle Visibility',
				description: 'Show/hide element',
				code: `<div v-visible="isVisible">Hidden or visible</div>`,
			},
		],
	},
	{
		name: 'loading',
		displayName: 'v-loading',
		description: 'Show loading state',
		category: 'Visibility',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'value',
				type: 'boolean',
				description: 'Loading state',
				required: true,
			},
			{
				name: 'text',
				type: 'string',
				description: 'Loading text',
				default: 'Loading...',
			},
			{
				name: 'background',
				type: 'string',
				description: 'Background color',
				default: 'rgba(255, 255, 255, 0.7)',
			},
		],
		examples: [
			{
				title: 'Loading Overlay',
				description: 'Show loading spinner',
				code: `<div v-loading="isLoading">Content</div>`,
			},
		],
	},

	// Scroll Directives
	{
		name: 'scroll',
		displayName: 'v-scroll',
		description: 'Track scroll position',
		category: 'Scroll',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'handler',
				type: 'function',
				description: 'Callback on scroll',
				required: true,
			},
			{
				name: 'throttle',
				type: 'number',
				description: 'Throttle interval (ms)',
				default: 100,
				min: 0,
				max: 1000,
			},
		],
		examples: [
			{
				title: 'Scroll Handler',
				description: 'Track scroll position',
				code: `<div v-scroll="handleScroll">Scrollable content</div>`,
			},
		],
	},
	{
		name: 'infinite-scroll',
		displayName: 'v-infinite-scroll',
		description: 'Infinite scrolling list',
		category: 'Scroll',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'handler',
				type: 'function',
				description: 'Load more callback',
				required: true,
			},
			{
				name: 'distance',
				type: 'number',
				description: 'Trigger distance from bottom (px)',
				default: 100,
				min: 0,
				max: 500,
			},
			{
				name: 'disabled',
				type: 'boolean',
				description: 'Disable loading',
				default: false,
			},
		],
		examples: [
			{
				title: 'Infinite List',
				description: 'Load more on scroll',
				code: `<div v-infinite-scroll="loadMore" :distance="200">
  <div v-for="item in items" :key="item.id">{{ item.name }}</div>
</div>`,
			},
		],
	},
	{
		name: 'sticky',
		displayName: 'v-sticky',
		description: 'Make element sticky',
		category: 'Scroll',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'top',
				type: 'number',
				description: 'Top offset in pixels',
				default: 0,
				min: 0,
				max: 500,
			},
			{
				name: 'zIndex',
				type: 'number',
				description: 'Z-index value',
				default: 100,
			},
		],
		examples: [
			{
				title: 'Sticky Header',
				description: 'Sticky navigation',
				code: `<nav v-sticky="{ top: 0 }">Navigation</nav>`,
			},
		],
	},

	// Security Directives
	{
		name: 'permission',
		displayName: 'v-permission',
		description: 'Permission-based element control',
		category: 'Security',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'value',
				type: 'string',
				description: 'Required permission(s)',
				required: true,
			},
			{
				name: 'action',
				type: 'select',
				description: 'Action when no permission',
				default: 'remove',
				options: [
					{ value: 'remove', label: 'Remove' },
					{ value: 'disable', label: 'Disable' },
					{ value: 'hide', label: 'Hide' },
				],
			},
		],
		examples: [
			{
				title: 'Permission Control',
				description: 'Hide unauthorized elements',
				code: `<button v-permission="'admin'">Admin Only</button>`,
			},
		],
	},
	{
		name: 'sanitize',
		displayName: 'v-sanitize',
		description: 'Sanitize HTML content',
		category: 'Security',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'allowedTags',
				type: 'array',
				description: 'Allowed HTML tags',
				default: ['b', 'i', 'em', 'strong', 'a'],
			},
		],
		examples: [
			{
				title: 'Sanitize HTML',
				description: 'Clean HTML content',
				code: `<div v-sanitize="userContent"></div>`,
			},
		],
	},

	// UI Directives
	{
		name: 'ripple',
		displayName: 'v-ripple',
		description: 'Material design ripple effect',
		category: 'UI',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'color',
				type: 'string',
				description: 'Ripple color',
				default: 'currentColor',
			},
			{
				name: 'duration',
				type: 'number',
				description: 'Animation duration (ms)',
				default: 600,
				min: 100,
				max: 2000,
			},
		],
		examples: [
			{
				title: 'Ripple Button',
				description: 'Add ripple effect',
				code: `<button v-ripple>Click me</button>`,
			},
		],
	},
	{
		name: 'click-wave',
		displayName: 'v-click-wave',
		description: 'Click wave animation',
		category: 'UI',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'color',
				type: 'string',
				description: 'Wave color',
				default: 'rgba(0, 0, 0, 0.1)',
			},
		],
		examples: [
			{
				title: 'Wave Effect',
				description: 'Simple click wave',
				code: `<button v-click-wave>Wave</button>`,
			},
		],
	},
	{
		name: 'tooltip',
		displayName: 'v-tooltip',
		description: 'Display tooltip on hover',
		category: 'UI',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'content',
				type: 'string',
				description: 'Tooltip content',
				required: true,
			},
			{
				name: 'placement',
				type: 'select',
				description: 'Tooltip position',
				default: 'top',
				options: [
					{ value: 'top', label: 'Top' },
					{ value: 'bottom', label: 'Bottom' },
					{ value: 'left', label: 'Left' },
					{ value: 'right', label: 'Right' },
				],
			},
			{
				name: 'delay',
				type: 'number',
				description: 'Show delay (ms)',
				default: 0,
				min: 0,
				max: 2000,
			},
		],
		examples: [
			{
				title: 'Tooltip',
				description: 'Show tooltip on hover',
				code: `<button v-tooltip="{ content: 'Help text', placement: 'top' }">
  Hover me
</button>`,
			},
		],
	},
	{
		name: 'draggable',
		displayName: 'v-draggable',
		description: 'Make element draggable',
		category: 'UI',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'axis',
				type: 'select',
				description: 'Drag axis',
				default: 'both',
				options: [
					{ value: 'both', label: 'Both' },
					{ value: 'x', label: 'X only' },
					{ value: 'y', label: 'Y only' },
				],
			},
			{
				name: 'boundary',
				type: 'string',
				description: 'Boundary selector',
			},
		],
		examples: [
			{
				title: 'Draggable Element',
				description: 'Make element draggable',
				code: `<div v-draggable>Drag me around</div>`,
			},
		],
	},
	{
		name: 'context-menu',
		displayName: 'v-context-menu',
		description: 'Custom right-click menu',
		category: 'UI',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'items',
				type: 'array',
				description: 'Menu items',
				required: true,
			},
			{
				name: 'disabled',
				type: 'boolean',
				description: 'Disable context menu',
				default: false,
			},
		],
		examples: [
			{
				title: 'Context Menu',
				description: 'Custom right-click menu',
				code: `<div v-context-menu="menuItems">Right-click me</div>`,
			},
		],
	},
	{
		name: 'fullscreen',
		displayName: 'v-fullscreen',
		description: 'Toggle fullscreen mode',
		category: 'UI',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'value',
				type: 'boolean',
				description: 'Fullscreen state',
				required: true,
			},
			{
				name: 'onChange',
				type: 'function',
				description: 'Callback on fullscreen change',
			},
		],
		examples: [
			{
				title: 'Fullscreen Toggle',
				description: 'Toggle fullscreen',
				code: `<div v-fullscreen="isFullscreen">
  <button @click="isFullscreen = !isFullscreen">Toggle Fullscreen</button>
</div>`,
			},
		],
	},
	{
		name: 'skeleton',
		displayName: 'v-skeleton',
		description: 'Skeleton loading placeholder',
		category: 'UI',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'loading',
				type: 'boolean',
				description: 'Show skeleton state',
				required: true,
			},
			{
				name: 'animation',
				type: 'select',
				description: 'Animation type',
				default: 'wave',
				options: [
					{ value: 'wave', label: 'Wave' },
					{ value: 'pulse', label: 'Pulse' },
					{ value: 'none', label: 'None' },
				],
			},
		],
		examples: [
			{
				title: 'Skeleton Loader',
				description: 'Loading placeholder',
				code: `<div v-skeleton="loading">
  Content here
</div>`,
			},
		],
	},
	{
		name: 'blur',
		displayName: 'v-blur',
		description: 'Apply blur effect',
		category: 'UI',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'value',
				type: 'boolean',
				description: 'Blur state',
				required: true,
			},
			{
				name: 'amount',
				type: 'number',
				description: 'Blur amount in pixels',
				default: 10,
				min: 1,
				max: 50,
			},
		],
		examples: [
			{
				title: 'Blur Effect',
				description: 'Apply blur overlay',
				code: `<div v-blur="isBlurred">Content</div>`,
			},
		],
	},
	{
		name: 'fade',
		displayName: 'v-fade',
		description: 'Fade in/out transition',
		category: 'UI',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'value',
				type: 'boolean',
				description: 'Visible state',
				required: true,
			},
			{
				name: 'duration',
				type: 'number',
				description: 'Transition duration (ms)',
				default: 300,
				min: 0,
				max: 2000,
			},
		],
		examples: [
			{
				title: 'Fade Transition',
				description: 'Fade in/out',
				code: `<div v-fade="isVisible">Fading content</div>`,
			},
		],
	},

	// Data Visualization
	{
		name: 'counter',
		displayName: 'v-counter',
		description: 'Animated number counter',
		category: 'Data',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'value',
				type: 'number',
				description: 'Target number',
				required: true,
			},
			{
				name: 'duration',
				type: 'number',
				description: 'Animation duration (ms)',
				default: 2000,
				min: 100,
				max: 10000,
			},
			{
				name: 'decimals',
				type: 'number',
				description: 'Decimal places',
				default: 0,
				min: 0,
				max: 10,
			},
		],
		examples: [
			{
				title: 'Animated Counter',
				description: 'Count up animation',
				code: `<span v-counter="{ value: 1000, duration: 2000 }">0</span>`,
			},
		],
	},
	{
		name: 'progress',
		displayName: 'v-progress',
		description: 'Progress bar animation',
		category: 'Data',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'value',
				type: 'number',
				description: 'Progress percentage',
				required: true,
				min: 0,
				max: 100,
			},
			{
				name: 'color',
				type: 'string',
				description: 'Progress bar color',
				default: '#42b883',
			},
		],
		examples: [
			{
				title: 'Progress Bar',
				description: 'Animated progress',
				code: `<div v-progress="75"></div>`,
			},
		],
	},
	{
		name: 'countdown',
		displayName: 'v-countdown',
		description: 'Countdown timer display',
		category: 'Data',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'time',
				type: 'number',
				description: 'Countdown time in seconds',
				required: true,
				min: 0,
			},
			{
				name: 'format',
				type: 'string',
				description: 'Display format',
				default: 'HH:mm:ss',
			},
			{
				name: 'onComplete',
				type: 'function',
				description: 'Callback on countdown complete',
			},
		],
		examples: [
			{
				title: 'Countdown Timer',
				description: 'Count down from time',
				code: `<span v-countdown="{ time: 3600, format: 'mm:ss' }">00:00</span>`,
			},
		],
	},

	// Utility Directives
	{
		name: 'watermark',
		displayName: 'v-watermark',
		description: 'Add watermark overlay',
		category: 'Utility',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'content',
				type: 'string',
				description: 'Watermark text',
				required: true,
			},
			{
				name: 'fontSize',
				type: 'number',
				description: 'Font size in pixels',
				default: 16,
				min: 8,
				max: 48,
			},
			{
				name: 'color',
				type: 'string',
				description: 'Watermark color',
				default: 'rgba(0, 0, 0, 0.1)',
			},
		],
		examples: [
			{
				title: 'Watermark',
				description: 'Add text watermark',
				code: `<div v-watermark="'Confidential'">Content</div>`,
			},
		],
	},
	{
		name: 'print',
		displayName: 'v-print',
		description: 'Print element content',
		category: 'Utility',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'selector',
				type: 'string',
				description: 'Element selector to print',
				default: undefined,
			},
		],
		examples: [
			{
				title: 'Print Button',
				description: 'Print on click',
				code: `<button v-print>Print Page</button>`,
			},
		],
	},
	{
		name: 'export',
		displayName: 'v-export',
		description: 'Export data to file',
		category: 'Utility',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'data',
				type: 'array',
				description: 'Data to export',
				required: true,
			},
			{
				name: 'filename',
				type: 'string',
				description: 'Output filename',
				default: 'export',
			},
			{
				name: 'format',
				type: 'select',
				description: 'Export format',
				default: 'csv',
				options: [
					{ value: 'csv', label: 'CSV' },
					{ value: 'json', label: 'JSON' },
					{ value: 'html', label: 'HTML' },
					{ value: 'txt', label: 'TXT' },
				],
			},
		],
		examples: [
			{
				title: 'Export Data',
				description: 'Export to CSV',
				code: `<button v-export="{ data: tableData, format: 'csv' }">Export CSV</button>`,
			},
		],
	},
	{
		name: 'highlight',
		displayName: 'v-highlight',
		description: 'Highlight search terms',
		category: 'Utility',
		supportsVue2: true,
		supportsVue3: true,
		hasComposable: true,
		parameters: [
			{
				name: 'keyword',
				type: 'string',
				description: 'Keyword to highlight',
				required: true,
			},
			{
				name: 'color',
				type: 'string',
				description: 'Highlight color',
				default: '#ffff00',
			},
		],
		examples: [
			{
				title: 'Highlight Text',
				description: 'Highlight matching text',
				code: `<p v-highlight="'important'">This is important text</p>`,
			},
		],
	},
]

export const directiveCategories = [
	{ name: 'Event', description: 'Event handling directives' },
	{ name: 'Form', description: 'Form input directives' },
	{ name: 'Format', description: 'Text formatting directives' },
	{ name: 'Visibility', description: 'Visibility control directives' },
	{ name: 'Scroll', description: 'Scroll behavior directives' },
	{ name: 'Security', description: 'Security-related directives' },
	{ name: 'UI', description: 'UI enhancement directives' },
	{ name: 'Data', description: 'Data visualization directives' },
	{ name: 'Utility', description: 'Utility directives' },
]

export function getDirectiveConfig(name: string): DirectiveConfig | undefined {
	return directiveConfigs.find(d => d.name === name)
}

export function getDirectivesByCategory(category: string): DirectiveConfig[] {
	return directiveConfigs.filter(d => d.category === category)
}
