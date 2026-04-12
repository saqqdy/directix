import * as vscode from 'vscode'

// Directive definitions
const directives = [
	{
		name: 'v-copy',
		description: 'Copy text to clipboard on click',
		detail: 'Copies the bound value to clipboard when the element is clicked.',
		documentation: `**v-copy** - Copy to Clipboard

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
- \`onError\` - Error callback`,
		snippet: 'v-copy="$1"',
	},
	{
		name: 'v-debounce',
		description: 'Debounce event handler',
		detail: 'Delays the execution of an event handler until after a specified wait time.',
		documentation: `**v-debounce** - Debounce Event Handler

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
- \`trailing\` - Trigger on trailing edge`,
		// eslint-disable-next-line no-template-curly-in-string
		snippet: 'v-debounce="{ handler: $1, wait: ${2:300} }"',
	},
	{
		name: 'v-throttle',
		description: 'Throttle event handler',
		detail: 'Limits the rate at which an event handler can fire.',
		documentation: `**v-throttle** - Throttle Event Handler

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
- \`trailing\` - Trigger on trailing edge`,
		// eslint-disable-next-line no-template-curly-in-string
		snippet: 'v-throttle="{ handler: $1, limit: ${2:300} }"',
	},
	{
		name: 'v-click-outside',
		description: 'Detect clicks outside element',
		detail: 'Triggers callback when user clicks outside the element.',
		documentation: `**v-click-outside** - Click Outside Detection

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
- \`exclude\` - Elements to exclude`,
		snippet: 'v-click-outside="$1"',
	},
	{
		name: 'v-long-press',
		description: 'Detect long press gesture',
		detail: 'Triggers callback after long press gesture.',
		documentation: `**v-long-press** - Long Press Detection

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
- \`disabled\` - Disable detection`,
		// eslint-disable-next-line no-template-curly-in-string
		snippet: 'v-long-press="{ handler: $1, duration: ${2:500} }"',
	},
	{
		name: 'v-hover',
		description: 'Detect hover state',
		detail: 'Tracks hover state changes on element.',
		documentation: `**v-hover** - Hover State Detection

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
- \`disabled\` - Disable detection`,
		snippet: 'v-hover="{ onEnter: $1, onLeave: $2 }"',
	},
	{
		name: 'v-focus',
		description: 'Auto-focus element',
		detail: 'Automatically focuses element on mount.',
		documentation: `**v-focus** - Auto Focus

Automatically focuses element on mount.

**Usage:**
\`\`\`vue
<input v-focus />
<input v-focus="shouldFocus" />
\`\`\``,
		snippet: 'v-focus',
	},
	{
		name: 'v-lazy',
		description: 'Lazy load images',
		detail: 'Lazy loads images when they enter viewport.',
		documentation: `**v-lazy** - Lazy Load Images

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
- \`rootMargin\` - Root margin`,
		snippet: 'v-lazy="$1"',
	},
	{
		name: 'v-loading',
		description: 'Show loading state',
		detail: 'Displays loading indicator on element.',
		documentation: `**v-loading** - Loading State

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
- \`background\` - Background color`,
		snippet: 'v-loading="$1"',
	},
	{
		name: 'v-ripple',
		description: 'Material ripple effect',
		detail: 'Adds material design ripple effect on click.',
		documentation: `**v-ripple** - Material Ripple Effect

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
- \`disabled\` - Disable ripple`,
		snippet: 'v-ripple',
	},
	{
		name: 'v-intersect',
		description: 'Intersection Observer',
		detail: 'Triggers callback when element intersects viewport.',
		documentation: `**v-intersect** - Intersection Observer

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
- \`once\` - Trigger only once`,
		snippet: 'v-intersect="$1"',
	},
	{
		name: 'v-resize',
		description: 'Resize Observer',
		detail: 'Triggers callback when element resizes.',
		documentation: `**v-resize** - Resize Observer

Triggers callback when element resizes.

**Usage:**
\`\`\`vue
<div v-resize="handleResize">Resize me</div>
<div v-resize="{ handler: handleResize, debounce: 200 }">Debounced resize</div>
\`\`\`

**Options:**
- \`handler\` - Resize handler
- \`debounce\` - Debounce time in ms
- \`box\` - Box model to observe`,
		snippet: 'v-resize="$1"',
	},
	{
		name: 'v-scroll',
		description: 'Scroll event handler',
		detail: 'Handles scroll events with scroll info.',
		documentation: `**v-scroll** - Scroll Event Handler

Handles scroll events with detailed scroll information.

**Usage:**
\`\`\`vue
<div v-scroll="handleScroll" class="scroll-container">Content</div>
\`\`\`

**Options:**
- \`handler\` - Scroll handler
- \`throttle\` - Throttle time in ms
- \`passive\` - Use passive listener`,
		snippet: 'v-scroll="$1"',
	},
	{
		name: 'v-watermark',
		description: 'Add watermark',
		detail: 'Adds watermark overlay to element.',
		documentation: `**v-watermark** - Watermark Overlay

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
- \`gap\` - Gap between watermarks`,
		snippet: 'v-watermark="$1"',
	},
	{
		name: 'v-tooltip',
		description: 'Tooltip directive',
		detail: 'Displays tooltip on hover/focus.',
		documentation: `**v-tooltip** - Tooltip

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
- \`delay\` - Show delay in ms`,
		snippet: 'v-tooltip="$1"',
	},
	{
		name: 'v-permission',
		description: 'Permission control',
		detail: 'Controls element visibility based on permissions.',
		documentation: `**v-permission** - Permission Control

Controls element visibility based on user permissions.

**Usage:**
\`\`\`vue
<button v-permission="'admin'">Admin only</button>
<button v-permission="['admin', 'editor']">Multiple roles</button>
\`\`\``,
		snippet: 'v-permission="$1"',
	},
	{
		name: 'v-hotkey',
		description: 'Keyboard shortcuts',
		detail: 'Binds keyboard shortcuts to element.',
		documentation: `**v-hotkey** - Keyboard Shortcuts

Binds keyboard shortcuts to element.

**Usage:**
\`\`\`vue
<div v-hotkey="{ 'ctrl+s': handleSave, 'ctrl+z': handleUndo }">
  Press Ctrl+S to save
</div>
\`\`\``,
		snippet: 'v-hotkey="$1"',
	},
	{
		name: 'v-mask',
		description: 'Input mask',
		detail: 'Applies input mask pattern.',
		documentation: `**v-mask** - Input Mask

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
- \`X\` - Any character`,
		snippet: 'v-mask="$1"',
	},
	{
		name: 'v-uppercase',
		description: 'Uppercase transform',
		detail: 'Transforms input to uppercase.',
		documentation: `**v-uppercase** - Uppercase Transform

Transforms input to uppercase.

**Usage:**
\`\`\`vue
<input v-uppercase />
\`\`\``,
		snippet: 'v-uppercase',
	},
	{
		name: 'v-lowercase',
		description: 'Lowercase transform',
		detail: 'Transforms input to lowercase.',
		documentation: `**v-lowercase** - Lowercase Transform

Transforms input to lowercase.

**Usage:**
\`\`\`vue
<input v-lowercase />
\`\`\``,
		snippet: 'v-lowercase',
	},
	{
		name: 'v-money',
		description: 'Money format',
		detail: 'Formats input as money value.',
		documentation: `**v-money** - Money Format

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
- \`decimalSeparator\` - Decimal separator`,
		snippet: 'v-money',
	},
	{
		name: 'v-number',
		description: 'Number format',
		detail: 'Formats input as number.',
		documentation: `**v-number** - Number Format

Formats input as number.

**Usage:**
\`\`\`vue
<input v-number />
<input v-number="{ precision: 2, thousandSeparator: ',' }" />
\`\`\``,
		snippet: 'v-number',
	},
	{
		name: 'v-trim',
		description: 'Trim whitespace',
		detail: 'Trims whitespace from input.',
		documentation: `**v-trim** - Trim Whitespace

Trims whitespace from input.

**Usage:**
\`\`\`vue
<input v-trim />
\`\`\``,
		snippet: 'v-trim',
	},
	{
		name: 'v-infinite-scroll',
		description: 'Infinite scroll',
		detail: 'Implements infinite scrolling.',
		documentation: `**v-infinite-scroll** - Infinite Scroll

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
- \`loading\` - Loading state`,
		snippet: 'v-infinite-scroll="$1"',
	},
	{
		name: 'v-draggable',
		description: 'Draggable element',
		detail: 'Makes element draggable.',
		documentation: `**v-draggable** - Draggable Element

Makes element draggable.

**Usage:**
\`\`\`vue
<div v-draggable>Drag me</div>
<div v-draggable="{ axis: 'x', constrain: true }">Constrained drag</div>
\`\`\`

**Options:**
- \`axis\` - Drag axis (x/y/both)
- \`constrain\` - Constrain to parent
- \`handle\` - Drag handle selector`,
		snippet: 'v-draggable',
	},
	{
		name: 'v-visible',
		description: 'Visibility control',
		detail: 'Controls element visibility.',
		documentation: `**v-visible** - Visibility Control

Controls element visibility with animation support.

**Usage:**
\`\`\`vue
<div v-visible="isVisible">Content</div>
\`\`\``,
		snippet: 'v-visible="$1"',
	},
	{
		name: 'v-sanitize',
		description: 'HTML sanitization',
		detail: 'Sanitizes HTML content.',
		documentation: `**v-sanitize** - HTML Sanitization

Sanitizes HTML content to prevent XSS.

**Usage:**
\`\`\`vue
<div v-sanitize v-html="userContent"></div>
\`\`\``,
		snippet: 'v-sanitize',
	},
	{
		name: 'v-skeleton',
		description: 'Skeleton loading',
		detail: 'Displays skeleton loading placeholder.',
		documentation: `**v-skeleton** - Skeleton Loading

Displays skeleton loading placeholder.

**Usage:**
\`\`\`vue
<div v-skeleton="isLoading">Content</div>
\`\`\``,
		snippet: 'v-skeleton="$1"',
	},
	{
		name: 'v-ellipsis',
		description: 'Text ellipsis',
		detail: 'Adds text ellipsis overflow.',
		documentation: `**v-ellipsis** - Text Ellipsis

Adds text ellipsis overflow.

**Usage:**
\`\`\`vue
<p v-ellipsis="2">Long text with multiple lines...</p>
\`\`\``,
		// eslint-disable-next-line no-template-curly-in-string
		snippet: 'v-ellipsis="${1:1}"',
	},
	{
		name: 'v-truncate',
		description: 'Text truncation',
		detail: 'Truncates text to specified length.',
		documentation: `**v-truncate** - Text Truncation

Truncates text to specified length.

**Usage:**
\`\`\`vue
<p v-truncate="50">Long text to truncate...</p>
\`\`\``,
		// eslint-disable-next-line no-template-curly-in-string
		snippet: 'v-truncate="${1:50}"',
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
					item.documentation = new vscode.MarkdownString(directive.documentation)
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

				const markdown = new vscode.MarkdownString(directive.documentation)
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
