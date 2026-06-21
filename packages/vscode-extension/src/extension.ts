import * as vscode from 'vscode'
/* eslint-disable no-template-curly-in-string */

// Directive definitions
const directives = [
	{
		name: 'v-blur',
		description: 'Adds blur effect to element background',
		detail: 'Applies a CSS blur effect to the element background.',
		documentation: new vscode.MarkdownString(`**v-blur** - Blur Effect

Applies a CSS blur effect to the element background.

**Usage:**
\`\`\`vue
<div v-blur="5">Blurred background</div>
<div v-blur="{ value: 5, transition: 'all 0.3s' }">Smooth blur</div>
\`\`\`

**Options:**
- \`value\` - Blur radius in px
- \`transition\` - CSS transition for smooth effect
- \`disabled\` - Disable blur`),
		snippet: 'v-blur="$1"',
	},
	{
		name: 'v-capitalcase',
		description: 'Capitalizes first letter of each word',
		detail: 'Transforms text input to capitalize the first letter of each word.',
		documentation: new vscode.MarkdownString(`**v-capitalcase** - Capitalize Words

Capitalizes the first letter of each word in input.

**Usage:**
\`\`\`vue
<input v-capitalcase />
<input v-capitalcase="{ locale: 'en' }" />
\`\`\`

**Options:**
- \`locale\` - Locale for capitalization rules`),
		snippet: 'v-capitalcase',
	},
	{
		name: 'v-click-delay',
		description: 'Prevents rapid repeated clicks',
		detail: 'Prevents rapid repeated clicks by enforcing a delay between clicks.',
		documentation: new vscode.MarkdownString(`**v-click-delay** - Click Delay

Prevents rapid repeated clicks by enforcing a minimum delay.

**Usage:**
\`\`\`vue
<button v-click-delay="300">Submit</button>
<button v-click-delay="{ delay: 500, disabled: false }">Save</button>
\`\`\`

**Options:**
- \`delay\` - Minimum delay in ms between clicks (default: 300)
- \`disabled\` - Disable the delay`),
		snippet: 'v-click-delay="${1:300}"',
	},
	{
		name: 'v-click-outside',
		description: 'Detect clicks outside element',
		detail: 'Triggers callback when user clicks outside the element.',
		documentation: new vscode.MarkdownString(`**v-click-outside** - Click Outside Detection

Triggers callback when clicking outside the bound element.

**Usage:**
\`\`\`vue
<div v-click-outside="handleClickOutside">
  <p>Clicking outside triggers callback</p>
</div>
\`\`\`

**Options:**
- \`handler\` - Click outside handler
- \`disabled\` - Disable detection
- \`include\` - Elements to include
- \`exclude\` - Elements to exclude`),
		snippet: 'v-click-outside="$1"',
	},
	{
		name: 'v-click-wave',
		description: 'Click wave/ripple animation effect',
		detail: 'Adds a click wave/ripple animation effect to elements.',
		documentation: new vscode.MarkdownString(`**v-click-wave** - Click Wave Animation

Adds a click wave/ripple animation effect to elements.

**Usage:**
\`\`\`vue
<button v-click-wave>Click me</button>
<button v-click-wave="{ color: 'currentColor', duration: 600 }">Custom wave</button>
\`\`\`

**Options:**
- \`color\` - Wave color
- \`duration\` - Animation duration in ms
- \`disabled\` - Disable animation`),
		snippet: 'v-click-wave',
	},
	{
		name: 'v-context-menu',
		description: 'Custom right-click context menu',
		detail: 'Displays a custom context menu on right-click.',
		documentation: new vscode.MarkdownString(`**v-context-menu** - Custom Context Menu

Displays a custom context menu on right-click.

**Usage:**
\`\`\`vue
<div v-context-menu="menuItems">Right-click me</div>
<div v-context-menu="{ items: menuItems, offsetX: 0, offsetY: 0 }">Custom offset</div>
\`\`\`

**Options:**
- \`items\` - Menu item array
- \`offsetX\` - Horizontal offset
- \`offsetY\` - Vertical offset
- \`disabled\` - Disable context menu`),
		snippet: 'v-context-menu="$1"',
	},
	{
		name: 'v-copy',
		description: 'Copy text to clipboard on click',
		detail: 'Copies the bound value to clipboard when the element is clicked.',
		documentation: new vscode.MarkdownString(`**v-copy** - Copy to Clipboard

Copies text to clipboard when element is clicked.

**Usage:**
\`\`\`vue
<button v-copy="'Text to copy'">Copy</button>
<button v-copy="{ value: text, onSuccess: handleSuccess }">Copy</button>
\`\`\`

**Options:**
- \`value\` - Text to copy
- \`disabled\` - Disable copy
- \`title\` - Tooltip title
- \`onSuccess\` - Success callback
- \`onError\` - Error callback`),
		snippet: 'v-copy="$1"',
	},
	{
		name: 'v-countdown',
		description: 'Countdown timer display',
		detail: 'Displays a countdown timer with customizable format.',
		documentation: new vscode.MarkdownString(`**v-countdown** - Countdown Timer

Displays a countdown timer on the element.

**Usage:**
\`\`\`vue
<span v-countdown="60">60s</span>
<span v-countdown="{ time: 3600, format: 'HH:mm:ss', onEnd: handleEnd }">1 hour</span>
\`\`\`

**Options:**
- \`time\` - Countdown time in seconds
- \`format\` - Display format (HH:mm:ss)
- \`onEnd\` - Callback when countdown ends
- \`onTick\` - Callback on each tick
- \`autoStart\` - Auto start countdown`),
		snippet: 'v-countdown="$1"',
	},
	{
		name: 'v-counter',
		description: 'Animated number counter',
		detail: 'Animates a number change with counting effect.',
		documentation: new vscode.MarkdownString(`**v-counter** - Animated Counter

Animates number changes with a counting effect.

**Usage:**
\`\`\`vue
<span v-counter="count">{{ count }}</span>
<span v-counter="{ value: count, duration: 1000, separator: ',' }">{{ count }}</span>
\`\`\`

**Options:**
- \`value\` - Target number value
- \`duration\` - Animation duration in ms (default: 1000)
- \`separator\` - Thousands separator
- \`decimalPlaces\` - Decimal places
- \`easing\` - Easing function`),
		snippet: 'v-counter="$1"',
	},
	{
		name: 'v-debounce',
		description: 'Debounce event handler',
		detail: 'Delays the execution of an event handler until after a specified wait time.',
		documentation: new vscode.MarkdownString(`**v-debounce** - Debounce Event Handler

Delays event handler execution until after wait time has elapsed.

**Usage:**
\`\`\`vue
<input v-debounce="{ handler: handleInput, wait: 300 }" />
<button v-debounce="{ handler: handleClick, wait: 500 }">Click</button>
\`\`\`

**Options:**
- \`handler\` - Event handler function
- \`wait\` - Wait time in ms (default: 300)
- \`leading\` - Trigger on leading edge
- \`trailing\` - Trigger on trailing edge`),
		snippet: 'v-debounce="{ handler: $1, wait: ${2:300} }"',
	},
	{
		name: 'v-draggable',
		description: 'Draggable element',
		detail: 'Makes element draggable.',
		documentation: new vscode.MarkdownString(`**v-draggable** - Draggable Element

Makes element draggable.

**Usage:**
\`\`\`vue
<div v-draggable>Drag me</div>
<div v-draggable="{ axis: 'x', constrain: true }">Constrained drag</div>
\`\`\`

**Options:**
- \`axis\` - Drag axis (x/y/both)
- \`constrain\` - Constrain to parent
- \`handle\` - Drag handle selector`),
		snippet: 'v-draggable',
	},
	{
		name: 'v-ellipsis',
		description: 'Text ellipsis',
		detail: 'Adds text ellipsis overflow.',
		documentation: new vscode.MarkdownString(`**v-ellipsis** - Text Ellipsis

Adds text ellipsis overflow.

**Usage:**
\`\`\`vue
<p v-ellipsis="2">Long text with multiple lines...</p>
\`\`\`

**Options:**
- \`lines\` - Number of lines before ellipsis (default: 1)`),
		snippet: 'v-ellipsis="${1:1}"',
	},
	{
		name: 'v-emoji',
		description: 'Filter/restrict emoji input',
		detail: 'Filters or restricts emoji characters in input fields.',
		documentation: new vscode.MarkdownString(`**v-emoji** - Emoji Filter

Filters or restricts emoji characters in input fields.

**Usage:**
\`\`\`vue
<input v-emoji />
<input v-emoji="{ mode: 'filter', replace: '' }" />
\`\`\`

**Options:**
- \`mode\` - Filter mode ('filter' or 'block')
- \`replace\` - Replacement string for emojis`),
		snippet: 'v-emoji',
	},
	{
		name: 'v-export',
		description: 'Export data (CSV/JSON/HTML/TXT)',
		detail: 'Exports data to various formats including CSV, JSON, HTML, and TXT.',
		documentation: new vscode.MarkdownString(`**v-export** - Data Export

Exports data to CSV, JSON, HTML, or TXT format.

**Usage:**
\`\`\`vue
<button v-export="{ data: tableData, filename: 'report', type: 'csv' }">Export CSV</button>
<button v-export="{ data: tableData, filename: 'report', type: 'json' }">Export JSON</button>
\`\`\`

**Options:**
- \`data\` - Data to export
- \`filename\` - Output filename
- \`type\` - Export format (csv/json/html/txt)
- \`headers\` - Column headers for CSV/HTML`),
		snippet: 'v-export="{ data: $1, filename: \'${2:export}\', type: \'${3|csv,json,html,txt|}\' }"',
	},
	{
		name: 'v-fade',
		description: 'Fade in/out transition effect',
		detail: 'Adds fade in/out transition effect based on visibility.',
		documentation: new vscode.MarkdownString(`**v-fade** - Fade Transition

Adds fade in/out transition effect based on visibility.

**Usage:**
\`\`\`vue
<div v-fade="isVisible">Fading content</div>
<div v-fade="{ value: isVisible, duration: 500, delay: 200 }">Custom fade</div>
\`\`\`

**Options:**
- \`value\` - Visibility state
- \`duration\` - Transition duration in ms (default: 300)
- \`delay\` - Transition delay in ms
- \`mode\` - Transition mode ('in-out' or 'out-in')`),
		snippet: 'v-fade="$1"',
	},
	{
		name: 'v-focus',
		description: 'Auto-focus element',
		detail: 'Automatically focuses element on mount.',
		documentation: new vscode.MarkdownString(`**v-focus** - Auto Focus

Automatically focuses element on mount.

**Usage:**
\`\`\`vue
<input v-focus />
<input v-focus="shouldFocus" />
\`\`\``),
		snippet: 'v-focus',
	},
	{
		name: 'v-fullscreen',
		description: 'Toggle fullscreen mode',
		detail: 'Toggles fullscreen mode for the element.',
		documentation: new vscode.MarkdownString(`**v-fullscreen** - Fullscreen Toggle

Toggles fullscreen mode for the element.

**Usage:**
\`\`\`vue
<div v-fullscreen="isFullscreen">Fullscreen content</div>
\`\`\`

**Options:**
- \`value\` - Fullscreen state
- \`onEnter\` - Callback on enter fullscreen
- \`onExit\` - Callback on exit fullscreen`),
		snippet: 'v-fullscreen="$1"',
	},
	{
		name: 'v-highlight',
		description: 'Highlight keywords in text',
		detail: 'Highlights specified keywords within the element text content.',
		documentation: new vscode.MarkdownString(`**v-highlight** - Highlight Keywords

Highlights specified keywords within text content.

**Usage:**
\`\`\`vue
<p v-highlight="'important'">This is important text</p>
<p v-highlight="{ keyword: 'search', color: 'yellow' }">Search results</p>
\`\`\`

**Options:**
- \`keyword\` - Keyword(s) to highlight
- \`color\` - Highlight background color
- \`tag\` - Wrapper tag (default: 'mark')
- \`caseSensitive\` - Case-sensitive matching`),
		snippet: 'v-highlight="$1"',
	},
	{
		name: 'v-hotkey',
		description: 'Keyboard shortcuts',
		detail: 'Binds keyboard shortcuts to element.',
		documentation: new vscode.MarkdownString(`**v-hotkey** - Keyboard Shortcuts

Binds keyboard shortcuts to element.

**Usage:**
\`\`\`vue
<div v-hotkey="{ 'ctrl+s': handleSave, 'ctrl+z': handleUndo }">
  Press Ctrl+S to save
</div>
\`\`\``),
		snippet: 'v-hotkey="$1"',
	},
	{
		name: 'v-hover',
		description: 'Detect hover state',
		detail: 'Tracks hover state changes on element.',
		documentation: new vscode.MarkdownString(`**v-hover** - Hover State Detection

Tracks hover state and triggers callbacks.

**Usage:**
\`\`\`vue
<div v-hover="{ onEnter: handleEnter, onLeave: handleLeave }">
  Hover me
</div>
\`\`\`

**Options:**
- \`onEnter\` - Mouse enter callback
- \`onLeave\` - Mouse leave callback
- \`disabled\` - Disable detection`),
		snippet: 'v-hover="{ onEnter: $1, onLeave: $2 }"',
	},
	{
		name: 'v-image-preview',
		description: 'Image preview/lightbox',
		detail: 'Adds image preview/lightbox functionality on click.',
		documentation: new vscode.MarkdownString(`**v-image-preview** - Image Preview

Adds image preview/lightbox functionality on click.

**Usage:**
\`\`\`vue
<img v-image-preview :src="imageUrl" />
<img v-image-preview="{ zoomable: true, rotatable: true }" :src="imageUrl" />
\`\`\`

**Options:**
- \`zoomable\` - Enable zoom (default: true)
- \`rotatable\` - Enable rotation (default: true)
- \`closable\` - Enable close button (default: true)
- \`onClose\` - Close callback`),
		snippet: 'v-image-preview',
	},
	{
		name: 'v-infinite-scroll',
		description: 'Infinite scroll',
		detail: 'Implements infinite scrolling.',
		documentation: new vscode.MarkdownString(`**v-infinite-scroll** - Infinite Scroll

Implements infinite scrolling for lists.

**Usage:**
\`\`\`vue
<div v-infinite-scroll="loadMore" class="scroll-container">
  <div v-for="item in items" :key="item.id">{{ item.name }}</div>
</div>
\`\`\`

**Options:**
- \`handler\` - Load more handler
- \`distance\` - Distance from bottom to trigger
- \`disabled\` - Disable infinite scroll
- \`loading\` - Loading state`),
		snippet: 'v-infinite-scroll="$1"',
	},
	{
		name: 'v-intersect',
		description: 'Intersection Observer',
		detail: 'Triggers callback when element intersects viewport.',
		documentation: new vscode.MarkdownString(`**v-intersect** - Intersection Observer

Triggers callback when element intersects viewport.

**Usage:**
\`\`\`vue
<div v-intersect="handleIntersect">Observe me</div>
<div v-intersect="{ onEnter: handleEnter, onLeave: handleLeave }">Track visibility</div>
\`\`\`

**Options:**
- \`handler\` - Intersection handler
- \`onEnter\` - Enter viewport callback
- \`onLeave\` - Leave viewport callback
- \`threshold\` - Intersection threshold
- \`rootMargin\` - Root margin
- \`once\` - Trigger only once`),
		snippet: 'v-intersect="$1"',
	},
	{
		name: 'v-lazy',
		description: 'Lazy load images',
		detail: 'Lazy loads images when they enter viewport.',
		documentation: new vscode.MarkdownString(`**v-lazy** - Lazy Load Images

Lazy loads images when entering viewport.

**Usage:**
\`\`\`vue
<img v-lazy="imageUrl" />
<img v-lazy="{ src: imageUrl, placeholder: placeholderUrl }" />
\`\`\`

**Options:**
- \`src\` - Image source
- \`placeholder\` - Placeholder image
- \`threshold\` - Intersection threshold
- \`rootMargin\` - Root margin`),
		snippet: 'v-lazy="$1"',
	},
	{
		name: 'v-loading',
		description: 'Show loading state',
		detail: 'Displays loading indicator on element.',
		documentation: new vscode.MarkdownString(`**v-loading** - Loading State

Displays loading indicator on element.

**Usage:**
\`\`\`vue
<div v-loading="isLoading">Content</div>
<div v-loading="{ value: isLoading, text: 'Loading...' }">Content</div>
\`\`\`

**Options:**
- \`value\` - Loading state
- \`text\` - Loading text
- \`spinner\` - Spinner type
- \`background\` - Background color`),
		snippet: 'v-loading="$1"',
	},
	{
		name: 'v-long-press',
		description: 'Detect long press gesture',
		detail: 'Triggers callback after long press gesture.',
		documentation: new vscode.MarkdownString(`**v-long-press** - Long Press Detection

Triggers callback after holding for specified duration.

**Usage:**
\`\`\`vue
<button v-long-press="{ handler: handleLongPress, duration: 500 }">
  Hold me
</button>
\`\`\`

**Options:**
- \`handler\` - Long press handler
- \`duration\` - Press duration in ms (default: 500)
- \`disabled\` - Disable detection`),
		snippet: 'v-long-press="{ handler: $1, duration: ${2:500} }"',
	},
	{
		name: 'v-lottie',
		description: 'Lottie animation player',
		detail: 'Plays Lottie animations on the element.',
		documentation: new vscode.MarkdownString(`**v-lottie** - Lottie Animation Player

Plays Lottie animations on the element.

**Usage:**
\`\`\`vue
<div v-lottie="animationData" />
<div v-lottie="{ path: '/anim.json', loop: true, autoplay: true }" />
\`\`\`

**Options:**
- \`path\` - Animation JSON path
- \`animationData\` - Animation data object
- \`loop\` - Loop animation (default: true)
- \`autoplay\` - Auto play (default: true)
- \`speed\` - Playback speed`),
		snippet: 'v-lottie="$1"',
	},
	{
		name: 'v-lowercase',
		description: 'Lowercase transform',
		detail: 'Transforms input to lowercase.',
		documentation: new vscode.MarkdownString(`**v-lowercase** - Lowercase Transform

Transforms input to lowercase.

**Usage:**
\`\`\`vue
<input v-lowercase />
\`\`\``),
		snippet: 'v-lowercase',
	},
	{
		name: 'v-mask',
		description: 'Input mask',
		detail: 'Applies input mask pattern.',
		documentation: new vscode.MarkdownString(`**v-mask** - Input Mask

Applies mask pattern to input fields.

**Usage:**
\`\`\`vue
<input v-mask="'###-##-####'" placeholder="SSN" />
<input v-mask="'(###) ###-####'" placeholder="Phone" />
\`\`\`

**Patterns:**
- \`#\` - Digit
- \`A\` - Letter
- \`N\` - Alphanumeric
- \`X\` - Any character`),
		snippet: 'v-mask="$1"',
	},
	{
		name: 'v-money',
		description: 'Money format',
		detail: 'Formats input as money value.',
		documentation: new vscode.MarkdownString(`**v-money** - Money Format

Formats input as money value.

**Usage:**
\`\`\`vue
<input v-money />
<input v-money="{ symbol: '¥', precision: 2 }" />
\`\`\`

**Options:**
- \`symbol\` - Currency symbol
- \`precision\` - Decimal places
- \`thousandSeparator\` - Thousands separator
- \`decimalSeparator\` - Decimal separator`),
		snippet: 'v-money',
	},
	{
		name: 'v-mutation',
		description: 'DOM mutation observer',
		detail: 'Observes DOM mutations on the element.',
		documentation: new vscode.MarkdownString(`**v-mutation** - DOM Mutation Observer

Observes DOM mutations on the element and triggers callbacks.

**Usage:**
\`\`\`vue
<div v-mutation="handleMutation">Observed content</div>
<div v-mutation="{ handler: handleMutation, attributes: true, childList: true }">Watch changes</div>
\`\`\`

**Options:**
- \`handler\` - Mutation handler
- \`attributes\` - Observe attribute changes
- \`childList\` - Observe child node changes
- \`subtree\` - Observe entire subtree
- \`characterData\` - Observe text content changes`),
		snippet: 'v-mutation="$1"',
	},
	{
		name: 'v-number',
		description: 'Number format',
		detail: 'Formats input as number.',
		documentation: new vscode.MarkdownString(`**v-number** - Number Format

Formats input as number.

**Usage:**
\`\`\`vue
<input v-number />
<input v-number="{ precision: 2, thousandSeparator: ',' }" />
\`\`\`

**Options:**
- \`precision\` - Decimal places
- \`thousandSeparator\` - Thousands separator
- \`decimalSeparator\` - Decimal separator`),
		snippet: 'v-number',
	},
	{
		name: 'v-pan',
		description: 'Pan/drag gesture',
		detail: 'Handles pan/drag gesture on the element.',
		documentation: new vscode.MarkdownString(`**v-pan** - Pan/Drag Gesture

Handles pan/drag gesture on the element.

**Usage:**
\`\`\`vue
<div v-pan="handlePan">Pan me</div>
<div v-pan="{ onPanStart: handleStart, onPanMove: handleMove, onPanEnd: handleEnd }">Custom handlers</div>
\`\`\`

**Options:**
- \`onPanStart\` - Pan start callback
- \`onPanMove\` - Pan move callback
- \`onPanEnd\` - Pan end callback
- \`direction\` - Pan direction ('horizontal'/'vertical'/'all')
- \`threshold\` - Minimum distance to trigger`),
		snippet: 'v-pan="$1"',
	},
	{
		name: 'v-parallax',
		description: 'Parallax scrolling effect',
		detail: 'Adds parallax scrolling effect to the element.',
		documentation: new vscode.MarkdownString(`**v-parallax** - Parallax Scrolling

Adds parallax scrolling effect to the element.

**Usage:**
\`\`\`vue
<div v-parallax="0.5">Parallax content</div>
<img v-parallax="{ speed: 0.3, direction: 'vertical' }" :src="image" />
\`\`\`

**Options:**
- \`speed\` - Parallax speed factor (0-1)
- \`direction\` - Scroll direction ('vertical'/'horizontal')
- \`min\` - Minimum translate value
- \`max\` - Maximum translate value`),
		snippet: 'v-parallax="$1"',
	},
	{
		name: 'v-permission',
		description: 'Permission control',
		detail: 'Controls element visibility based on permissions.',
		documentation: new vscode.MarkdownString(`**v-permission** - Permission Control

Controls element visibility based on user permissions.

**Usage:**
\`\`\`vue
<button v-permission="'admin'">Admin only</button>
<button v-permission="['admin', 'editor']">Multiple roles</button>
\`\`\``),
		snippet: 'v-permission="$1"',
	},
	{
		name: 'v-pinch',
		description: 'Pinch/zoom gesture',
		detail: 'Handles pinch/zoom gesture on the element.',
		documentation: new vscode.MarkdownString(`**v-pinch** - Pinch/Zoom Gesture

Handles pinch/zoom gesture on the element.

**Usage:**
\`\`\`vue
<div v-pinch="handlePinch">Pinch me</div>
<div v-pinch="{ onPinchStart: handleStart, onPinchMove: handleMove, onPinchEnd: handleEnd }">Custom handlers</div>
\`\`\`

**Options:**
- \`onPinchStart\` - Pinch start callback
- \`onPinchMove\` - Pinch move callback
- \`onPinchEnd\` - Pinch end callback
- \`minScale\` - Minimum scale factor
- \`maxScale\` - Maximum scale factor`),
		snippet: 'v-pinch="$1"',
	},
	{
		name: 'v-print',
		description: 'Print specific area content',
		detail: 'Prints the content of the bound element.',
		documentation: new vscode.MarkdownString(`**v-print** - Print Area

Prints the content of the bound element.

**Usage:**
\`\`\`vue
<div v-print>Print this area</div>
<button v-print="'#print-area'">Print specific area</button>
\`\`\`

**Options:**
- \`target\` - Selector of element to print
- \`title\` - Print document title
- \`style\` - Custom print styles
- \`beforePrint\` - Callback before printing
- \`afterPrint\` - Callback after printing`),
		snippet: 'v-print',
	},
	{
		name: 'v-progress',
		description: 'Animated progress bar',
		detail: 'Displays an animated progress bar on the element.',
		documentation: new vscode.MarkdownString(`**v-progress** - Animated Progress Bar

Displays an animated progress bar on the element.

**Usage:**
\`\`\`vue
<div v-progress="percentage" />
<div v-progress="{ value: percentage, color: '#42b883', height: 4 }" />
\`\`\`

**Options:**
- \`value\` - Progress percentage (0-100)
- \`color\` - Progress bar color
- \`height\` - Bar height in px
- \`animated\` - Enable animation (default: true)
- \`striped\` - Striped style`),
		snippet: 'v-progress="$1"',
	},
	{
		name: 'v-pull-refresh',
		description: 'Pull to refresh',
		detail: 'Implements pull-to-refresh gesture for the element.',
		documentation: new vscode.MarkdownString(`**v-pull-refresh** - Pull to Refresh

Implements pull-to-refresh gesture for the element.

**Usage:**
\`\`\`vue
<div v-pull-refresh="handleRefresh">
  <div v-for="item in items" :key="item.id">{{ item.name }}</div>
</div>
\`\`\`

**Options:**
- \`handler\` - Refresh handler (must return a Promise)
- \`distance\` - Pull distance threshold in px (default: 50)
- \`disabled\` - Disable pull refresh
- \`onPulling\` - Callback while pulling`),
		snippet: 'v-pull-refresh="$1"',
	},
	{
		name: 'v-resize',
		description: 'Resize Observer',
		detail: 'Triggers callback when element resizes.',
		documentation: new vscode.MarkdownString(`**v-resize** - Resize Observer

Triggers callback when element resizes.

**Usage:**
\`\`\`vue
<div v-resize="handleResize">Resize me</div>
<div v-resize="{ handler: handleResize, debounce: 200 }">Debounced resize</div>
\`\`\`

**Options:**
- \`handler\` - Resize handler
- \`debounce\` - Debounce time in ms
- \`box\` - Box model to observe`),
		snippet: 'v-resize="$1"',
	},
	{
		name: 'v-ripple',
		description: 'Material ripple effect',
		detail: 'Adds material design ripple effect on click.',
		documentation: new vscode.MarkdownString(`**v-ripple** - Material Ripple Effect

Adds material design ripple effect on click.

**Usage:**
\`\`\`vue
<button v-ripple>Click me</button>
<button v-ripple="'rgba(255, 255, 255, 0.3)'">Custom color</button>
<button v-ripple="{ color: 'red', duration: 800 }">Custom options</button>
\`\`\`

**Options:**
- \`color\` - Ripple color
- \`duration\` - Animation duration in ms
- \`disabled\` - Disable ripple`),
		snippet: 'v-ripple',
	},
	{
		name: 'v-rotate-gesture',
		description: 'Two-finger rotation gesture',
		detail: 'Handles two-finger rotation gesture on the element.',
		documentation: new vscode.MarkdownString(`**v-rotate-gesture** - Rotation Gesture

Handles two-finger rotation gesture on the element.

**Usage:**
\`\`\`vue
<div v-rotate-gesture="handleRotate">Rotate me</div>
<div v-rotate-gesture="{ onRotateStart: handleStart, onRotateMove: handleMove, onRotateEnd: handleEnd }">Custom handlers</div>
\`\`\`

**Options:**
- \`onRotateStart\` - Rotation start callback
- \`onRotateMove\` - Rotation move callback
- \`onRotateEnd\` - Rotation end callback
- \`minAngle\` - Minimum angle to trigger
- \`enabled\` - Enable/disable gesture`),
		snippet: 'v-rotate-gesture="$1"',
	},
	{
		name: 'v-sanitize',
		description: 'HTML sanitization',
		detail: 'Sanitizes HTML content.',
		documentation: new vscode.MarkdownString(`**v-sanitize** - HTML Sanitization

Sanitizes HTML content to prevent XSS.

**Usage:**
\`\`\`vue
<div v-sanitize v-html="userContent"></div>
\`\`\``),
		snippet: 'v-sanitize',
	},
	{
		name: 'v-scroll',
		description: 'Scroll event handler',
		detail: 'Handles scroll events with scroll info.',
		documentation: new vscode.MarkdownString(`**v-scroll** - Scroll Event Handler

Handles scroll events with detailed scroll information.

**Usage:**
\`\`\`vue
<div v-scroll="handleScroll" class="scroll-container">Content</div>
\`\`\`

**Options:**
- \`handler\` - Scroll handler
- \`throttle\` - Throttle time in ms
- \`passive\` - Use passive listener`),
		snippet: 'v-scroll="$1"',
	},
	{
		name: 'v-skeleton',
		description: 'Skeleton loading',
		detail: 'Displays skeleton loading placeholder.',
		documentation: new vscode.MarkdownString(`**v-skeleton** - Skeleton Loading

Displays skeleton loading placeholder.

**Usage:**
\`\`\`vue
<div v-skeleton="isLoading">Content</div>
\`\`\``),
		snippet: 'v-skeleton="$1"',
	},
	{
		name: 'v-sticky',
		description: 'Sticky positioning',
		detail: 'Makes element sticky with configurable offset and behavior.',
		documentation: new vscode.MarkdownString(`**v-sticky** - Sticky Positioning

Makes element sticky with configurable offset and behavior.

**Usage:**
\`\`\`vue
<div v-sticky>Sticky header</div>
<div v-sticky="{ top: 60, zIndex: 100 }">Custom sticky</div>
\`\`\`

**Options:**
- \`top\` - Top offset in px (default: 0)
- \`zIndex\` - Z-index value
- \`container\` - Container selector
- \`disabled\` - Disable sticky`),
		snippet: 'v-sticky="{ top: ${1:0} }"',
	},
	{
		name: 'v-swipe',
		description: 'Swipe/slide switching',
		detail: 'Detects swipe gestures for slide/tab switching.',
		documentation: new vscode.MarkdownString(`**v-swipe** - Swipe Gesture

Detects swipe gestures for slide/tab switching.

**Usage:**
\`\`\`vue
<div v-swipe="handleSwipe">Swipe me</div>
<div v-swipe="{ onSwipeLeft: prevTab, onSwipeRight: nextTab }">Swipe navigation</div>
\`\`\`

**Options:**
- \`onSwipeLeft\` - Left swipe callback
- \`onSwipeRight\` - Right swipe callback
- \`onSwipeUp\` - Up swipe callback
- \`onSwipeDown\` - Down swipe callback
- \`threshold\` - Minimum swipe distance`),
		snippet: 'v-swipe="$1"',
	},
	{
		name: 'v-throttle',
		description: 'Throttle event handler',
		detail: 'Limits the rate at which an event handler can fire.',
		documentation: new vscode.MarkdownString(`**v-throttle** - Throttle Event Handler

Limits the rate at which event handler can fire.

**Usage:**
\`\`\`vue
<button v-throttle="{ handler: handleClick, limit: 300 }">Click</button>
<input v-throttle="{ handler: handleInput, limit: 500 }" />
\`\`\`

**Options:**
- \`handler\` - Event handler function
- \`limit\` - Time limit in ms (default: 300)
- \`leading\` - Trigger on leading edge
- \`trailing\` - Trigger on trailing edge`),
		snippet: 'v-throttle="{ handler: $1, limit: ${2:300} }"',
	},
	{
		name: 'v-touch',
		description: 'Touch gesture handler',
		detail: 'Handles various touch gestures on the element.',
		documentation: new vscode.MarkdownString(`**v-touch** - Touch Gesture Handler

Handles various touch gestures on the element.

**Usage:**
\`\`\`vue
<div v-touch="{ tap: handleTap, press: handlePress, swipe: handleSwipe }">Touch me</div>
\`\`\`

**Options:**
- \`tap\` - Tap callback
- \`press\` - Long press callback
- \`swipe\` - Swipe callback
- \`drag\` - Drag callback
- \`pinch\` - Pinch callback
- \`rotate\` - Rotate callback`),
		snippet: 'v-touch="$1"',
	},
	{
		name: 'v-tooltip',
		description: 'Tooltip directive',
		detail: 'Displays tooltip on hover/focus.',
		documentation: new vscode.MarkdownString(`**v-tooltip** - Tooltip

Displays tooltip on hover/focus.

**Usage:**
\`\`\`vue
<button v-tooltip="'Tooltip text'">Hover me</button>
<button v-tooltip="{ content: 'Tooltip', placement: 'bottom' }">Custom</button>
\`\`\`

**Options:**
- \`content\` - Tooltip content
- \`placement\` - Position (top/bottom/left/right)
- \`trigger\` - Trigger type (hover/click/focus)
- \`delay\` - Show delay in ms`),
		snippet: 'v-tooltip="$1"',
	},
	{
		name: 'v-trim',
		description: 'Trim whitespace',
		detail: 'Trims whitespace from input.',
		documentation: new vscode.MarkdownString(`**v-trim** - Trim Whitespace

Trims whitespace from input.

**Usage:**
\`\`\`vue
<input v-trim />
\`\`\``),
		snippet: 'v-trim',
	},
	{
		name: 'v-truncate',
		description: 'Text truncation',
		detail: 'Truncates text to specified length.',
		documentation: new vscode.MarkdownString(`**v-truncate** - Text Truncation

Truncates text to specified length.

**Usage:**
\`\`\`vue
<p v-truncate="50">Long text to truncate...</p>
\`\`\`

**Options:**
- \`length\` - Max characters before truncation (default: 50)
- \`omission\` - String to append when truncated (default: '...')`),
		snippet: 'v-truncate="${1:50}"',
	},
	{
		name: 'v-typewriter',
		description: 'Typewriter text animation',
		detail: 'Animates text with a typewriter effect.',
		documentation: new vscode.MarkdownString(`**v-typewriter** - Typewriter Animation

Animates text with a typewriter effect.

**Usage:**
\`\`\`vue
<p v-typewriter="'Hello, World!'">Typewriter text</p>
<p v-typewriter="{ text: 'Hello!', speed: 100, cursor: '|' }">Custom speed</p>
\`\`\`

**Options:**
- \`text\` - Text to animate
- \`speed\` - Typing speed in ms (default: 50)
- \`cursor\` - Cursor character
- \`loop\` - Loop animation (default: false)
- \`onDelete\` - Callback when text is fully typed`),
		snippet: 'v-typewriter="$1"',
	},
	{
		name: 'v-uppercase',
		description: 'Uppercase transform',
		detail: 'Transforms input to uppercase.',
		documentation: new vscode.MarkdownString(`**v-uppercase** - Uppercase Transform

Transforms input to uppercase.

**Usage:**
\`\`\`vue
<input v-uppercase />
\`\`\``),
		snippet: 'v-uppercase',
	},
	{
		name: 'v-virtual-list',
		description: 'Virtual scrolling for large lists',
		detail: 'Implements virtual scrolling to handle large lists efficiently.',
		documentation: new vscode.MarkdownString(`**v-virtual-list** - Virtual Scrolling

Implements virtual scrolling to handle large lists efficiently.

**Usage:**
\`\`\`vue
<div v-virtual-list="{ data: items, itemSize: 50, height: 500 }">
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</div>
\`\`\`

**Options:**
- \`data\` - Array of items to render
- \`itemSize\` - Height of each item in px
- \`height\` - Container height in px
- \`buffer\` - Number of extra items to render outside viewport
- \`keyField\` - Unique key field name`),
		snippet: 'v-virtual-list="{ data: $1, itemSize: ${2:50} }"',
	},
	{
		name: 'v-visible',
		description: 'Visibility control',
		detail: 'Controls element visibility.',
		documentation: new vscode.MarkdownString(`**v-visible** - Visibility Control

Controls element visibility with animation support.

**Usage:**
\`\`\`vue
<div v-visible="isVisible">Content</div>
\`\`\``),
		snippet: 'v-visible="$1"',
	},
	{
		name: 'v-watermark',
		description: 'Add watermark',
		detail: 'Adds watermark overlay to element.',
		documentation: new vscode.MarkdownString(`**v-watermark** - Watermark Overlay

Adds watermark overlay to element.

**Usage:**
\`\`\`vue
<div v-watermark="'Confidential'">Protected content</div>
<div v-watermark="{ content: 'Draft', fontSize: 24 }">Customized</div>
\`\`\`

**Options:**
- \`content\` - Watermark text
- \`fontSize\` - Font size
- \`color\` - Text color
- \`rotate\` - Rotation angle
- \`gap\` - Gap between watermarks`),
		snippet: 'v-watermark="$1"',
	},
]

export function activate(context: vscode.ExtensionContext): void {
	// Register completion item provider
	const completionProvider = vscode.languages.registerCompletionItemProvider(
		['vue', 'html'],
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substring(0, position.character)

				// Check if we're in a position where directive completion makes sense
				if (!linePrefix.endsWith('v-') && !linePrefix.match(/\s+v-$/)) {
					// Also trigger after space in tag
					if (!linePrefix.match(/<[a-z][a-z0-9]*\s*[^>]*\s$/i)) {
						return undefined
					}
				}

				return directives.map(directive => {
					const item = new vscode.CompletionItem(directive.name, vscode.CompletionItemKind.Property)
					item.detail = directive.description
					item.documentation = directive.documentation
					item.insertText = new vscode.SnippetString(directive.snippet)
					return item
				})
			},
		},
		'-',
	)

	// Register hover provider
	const hoverProvider = vscode.languages.registerHoverProvider(
		['vue', 'html'],
		{
			provideHover(document: vscode.TextDocument, position: vscode.Position) {
				const range = document.getWordRangeAtPosition(position, /v-[a-z-]+/)
				if (!range) {
					return undefined
				}

				const word = document.getText(range)
				const directive = directives.find(d => d.name === word)

				if (!directive) {
					return undefined
				}

				const markdown = directive.documentation
				markdown.isTrusted = true

				return new vscode.Hover(markdown, range)
			},
		},
	)

	// Register command to open documentation
	const openDocsCommand = vscode.commands.registerCommand('directix.openDocs', () => {
		vscode.env.openExternal(vscode.Uri.parse('https://directix.saqqdy.com'))
	})

	// Register definition provider for jumping to docs
	const definitionProvider = vscode.languages.registerDefinitionProvider(
		['vue', 'html'],
		{
			provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
				const range = document.getWordRangeAtPosition(position, /v-[a-z-]+/)
				if (!range) {
					return undefined
				}

				const word = document.getText(range)
				const directive = directives.find(d => d.name === word)

				if (!directive) {
					return undefined
				}

				// Open external documentation
				const docUrl = `https://directix.saqqdy.com/directives/${word.replace('v-', '')}.html`
				vscode.env.openExternal(vscode.Uri.parse(docUrl))

				return undefined
			},
		},
	)

	context.subscriptions.push(completionProvider, hoverProvider, openDocsCommand, definitionProvider)
}

export function deactivate(): void {}
