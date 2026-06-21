# Changelog

All notable changes to this project will be documented in this file.

## [2.3.0] - 2026-06-20

### Internationalization Expansion Release

This release significantly expands i18n support with 5 new languages, locale detection, and dynamic loading utilities.

### Added

#### New Language Support

- Korean (ko-KR) locale with full translation coverage
- French (fr-FR) locale with full translation coverage
- German (de-DE) locale with full translation coverage
- Spanish (es-ES) locale with full translation coverage
- Russian (ru-RU) locale with full translation coverage

#### New Utilities

- `LocaleDetector` class - Auto-detect user's preferred language with localStorage persistence
  - `detect(fallback?)` - Detect locale with priority: stored > browser > default
  - `setLocale(locale)` - Set and persist locale preference
  - `clearLocale()` - Clear stored preference
  - `normalizeLocale(lang)` - Normalize browser language to supported code
  - `isSupported(locale)` - Check if locale is supported
  - `getSupportedLocales()` - Get all supported locale codes
- `LocaleLoader` class - Dynamic loading and caching of locale messages
  - `load(locale)` - Load locale with caching and deduplication
  - `preload(locales)` - Preload multiple locales
  - `register(locale, messages)` - Register locale directly (for SSR)
  - `clearCache()` - Clear locale cache
  - `isLoaded(locale)` - Check if locale is cached
  - `getCachedLocales()` - Get all cached locale codes

#### Updated Exports

- All 5 new locale messages (koKR, frFR, deDE, esES, ruRU) exported from `directix`
- `LocaleDetector` and `LocaleLoader` exported from `directix`

```typescript
import { LocaleDetector, LocaleLoader, koKR, frFR, deDE, esES, ruRU } from 'directix'
```

### Changed

- `LocaleCode` type now includes `'ko-KR' | 'fr-FR' | 'de-DE' | 'es-ES' | 'ru-RU'`
- i18n documentation updated to reflect 8 supported languages (was 3)

---

## [2.2.0] - 2026-06-21

### Performance Optimization Release

This release focuses on extreme performance optimization: smaller bundle sizes, faster runtime, and better memory efficiency. Target: single directive ≤ 1KB gzip, full bundle ≤ 20KB gzip.

### Added

#### Event Delegation Manager

Global event delegation to reduce DOM event listeners:

- `EventDelegationManager` - Manager class for global event delegation
- `configureEventDelegation(config)` - Configure event delegation settings
- `registerDelegatedHandler(selector, event, handler)` - Register a delegated event handler
- `unregisterDelegatedHandler(id)` - Unregister a delegated handler
- `pauseDelegatedHandler(id)` / `resumeDelegatedHandler(id)` - Pause/resume handlers
- `getDelegationStats()` - Get delegation statistics
- `startDelegation()` / `stopDelegation()` - Start/stop delegation

```ts
import { registerDelegatedHandler, unregisterDelegatedHandler } from 'directix'

const id = registerDelegatedHandler('.btn', 'click', (event, target) => {
  console.log('Button clicked:', target)
})
// Later: unregisterDelegatedHandler(id)
```

#### Batch Processor & DOM Batch Updater

Batch operations to avoid layout thrashing:

- `BatchProcessor<T, R>` - Generic batch processor with priority queue
- `DOMBatchUpdater` - Read/write separated DOM batch updater
- `getDOMBatchUpdater()` - Get global DOM batch updater
- `domRead(fn)` / `domWrite(fn)` - Schedule DOM read/write operations

```ts
import { domRead, domWrite } from 'directix'

// Read current layout (batched)
domRead(() => {
  const height = element.offsetHeight
  // Schedule write based on read value
  domWrite(() => {
    element.style.transform = `translateY(${height}px)`
  })
})
```

#### Virtual List Optimizer

Performance optimizations for virtual scrolling:

- `VirtualListOptimizer` - Optimizer class with dynamic height caching and VNode recycling
- `getVirtualListOptimizer()` - Get global optimizer instance
- Dynamic item height caching with `cacheItemHeight()` / `getItemHeight()`
- Visible range calculation with `calculateVisibleRange()`
- VNode recycling pool with `recycleVNode()` / `acquireRecycledVNode()`
- Scroll direction detection and velocity tracking

```ts
import { VirtualListOptimizer } from 'directix'

const optimizer = new VirtualListOptimizer({ bufferSize: 5, dynamicHeight: true })
optimizer.init(1000, 600)
optimizer.cacheItemHeight(0, 48)
const range = optimizer.calculateVisibleRange(scrollTop)
```

#### Memory Leak Detector

Automatic detection and reporting of memory leaks:

- `configureMemoryLeakDetector(config)` - Configure detector settings
- `trackResource(type, description, cleanup)` - Track resources that need cleanup
- `untrackResource(id)` / `cleanupResource(id)` - Manage tracked resources
- `takeSnapshot()` - Take a memory snapshot for comparison
- `getLeakReports()` - Get detected leak reports
- `startLeakDetection()` / `stopLeakDetection()` - Start/stop periodic detection

```ts
import { trackResource, cleanupResource } from 'directix'

const id = trackResource('event-listener', 'scroll handler', () => {
  window.removeEventListener('scroll', handler)
})
// When component unmounts: cleanupResource(id)
```

### Enhanced

#### ObjectPool Improvements

- Added `autoExpand` option to allow pool growth beyond maxSize
- Added `preWarm(count)` method to pre-populate the pool
- Enhanced `getStats()` with `inUseCount`, `acquireCount`, `releaseCount`, `utilizationRate`

#### WeakCache Improvements

- Added LRU eviction strategy for strong cache entries
- Added `getStats()` with `hitCount`, `missCount`, `hitRate`, `strongCacheSize`

### Build Optimization

- Updated `sideEffects` in package.json for more granular tree-shaking
- Added `compact: true` output option for smaller bundle size
- Enhanced tree-shaking configuration

### Compatibility

- **No breaking changes** - All new APIs are additive
- Vue 2.6+ and Vue 3.0+ supported
- Web Components compatible
- Node.js 16.14+ required

---

## [2.1.0] - 2026-06-06

### Enhanced Web Components Support

This release significantly enhances Web Components support with Shadow DOM, SSR safety, lifecycle hooks, and more.

### Added

#### Enhanced Web Components API

New utilities for advanced Web Components usage:

- `CustomElementLifecycleHooks` - Lifecycle hooks interface (onConnect, onDisconnect, onAdopt, onAttributeChange)
- `SSRSafeCustomElement` - SSR-safe custom element type
- `isCustomElementDefined(name)` - Check if a custom element is already defined
- `whenCustomElementDefined(name)` - Async wait for custom element definition
- `getRegisteredCustomElements()` - Get all registered custom element names
- `hydrateCustomElements(root)` - Hydrate custom elements on client (SSR support)
- `createSSRSafeCustomElement(name, directive, options)` - Create SSR-safe custom elements

#### Extended CustomElementDirectiveOptions

New options for `defineCustomElementDirective` and `createDirectiveElement`:

- `styles` - CSS styles to inject into shadow DOM (string or string[])
- `observedAttributes` - Custom list of attributes to observe
- `lifecycle` - Lifecycle hooks for custom element events
- `slots` - Enable slot content projection

```ts
import { defineCustomElementDirective, vLazy } from 'directix'

defineCustomElementDirective({
  name: 'lazy-img',
  directive: vLazy,
  shadow: true,
  styles: ':host { display: block; }',
  lifecycle: {
    onConnect: (el) => console.log('Connected', el),
    onDisconnect: (el) => console.log('Disconnected', el),
  },
})
```

### SSR Support

Declarative Shadow DOM for server-side rendering:

```ts
import { createSSRSafeCustomElement, vLazy } from 'directix'

const LazyImage = createSSRSafeCustomElement('lazy-image', vLazy, {
  shadow: true,
  styles: ':host { display: block; }',
})

// SSR render
const html = LazyImage.ssrRender({ src: 'image.jpg', alt: 'Image' })

// Browser registration
if (typeof window !== 'undefined') {
  customElements.define('lazy-image', LazyImage.elementClass)
}
```

### Compatibility

- **Vue 2.6+** - Fully supported
- **Vue 3.0+** - Fully supported with performance optimizations
- **Web Components** - Enhanced with Shadow DOM, SSR, lifecycle hooks
- **No breaking changes** - All v2.0.0 code continues to work

---

## [2.0.0] - 2026-05-05

### Major Update - Web Components Support with Vue 2/3 Compatibility

This is a major version release that adds Web Components support while maintaining full Vue 2 and Vue 3 compatibility. No breaking changes for existing users.

### Added

#### Web Components Support

New utilities for using directives with Custom Elements:

- `isCustomElement(el)` - Check if an element is a custom element
- `applyDirectiveToCustomElement(el, directive, value, options)` - Apply Vue directive to custom element
- `defineCustomElementDirective(options)` - Define a custom element wrapping a directive
- `createDirectiveElement(name, directive, options)` - Create custom element class from directive
- `registerDirectiveElements(elements)` - Register multiple directives as custom elements

```ts
import { vLazy, defineCustomElementDirective } from 'directix'

defineCustomElementDirective({
  name: 'lazy-img',
  directive: vLazy,
})
// Now usable as: <lazy-img src="..."></lazy-img>
```

### Changed

#### Vue 3 Conditional Optimizations

- **markRaw for DOM elements (Vue 3 only)** - Better performance, no unnecessary reactivity
- **shallowReactive for directive state (Vue 3 only)** - Optimized for large objects
- **Runtime version detection maintained** - Ensures Vue 2/3 compatibility

### Compatibility

- **Vue 2.6+** - Fully supported (continues to work)
- **Vue 3.0+** - Fully supported with performance optimizations
- **Web Components** - New feature, works with both Vue versions
- **No breaking changes** - Existing code continues to work without modifications

---

## [1.11.0] - 2026-05-13

### Added

#### Stability and Compatibility Enhancements

Comprehensive browser compatibility and backward compatibility guarantees.

- **BrowserCompatibilityConfig** - Target browser configuration with fallback strategies
  - Support for Chrome 80+, Firefox 78+, Safari 14+, Edge 88+, Samsung 12+
  - Fallback options for IntersectionObserver, ResizeObserver, Clipboard API, MutationObserver
  - Polyfill strategy options (auto, manual, none)
- **MigrationHelper** - Legacy code migration assistant
  - `detectLegacyUsage()` - Detect deprecated APIs and breaking changes
  - `migrate()` - Auto-migrate code with configurable rules
  - `generateReport()` - Generate migration reports
- **Backward Compatibility Tests** - Test suite covering v1.0.0 ~ v1.10.0 API compatibility
- **Browser Compatibility Matrix** - Cross-browser testing for desktop and mobile

#### Performance Limit Optimization

Extreme performance optimization for bundle size, runtime, and memory.

- **Bundle Optimization** - Code splitting and tree-shaking improvements
  - Single directive ≤ 1KB, core bundle ≤ 15KB, full bundle ≤ 25KB
  - Aggressive tree-shaking with side effects preservation
  - Terser compression with console removal
- **Runtime Optimization**
  - Event delegation with global listener pool
  - Batch processing for event handlers
  - Virtualization for DOM, scroll, and list
  - Lazy initialization for directives, events, and observers
- **Memory Optimization**
  - ObjectPool for event and observer entry reuse
  - WeakMap for element state and observers
  - Automatic cleanup on unmount/destroy
  - Memory monitoring with threshold warnings
- **Performance Benchmarks** - Performance metrics tracking
  - Mount time: vClickOutside < 1ms, vDebounce < 0.5ms, vLazy < 2ms
  - Update time: < 0.1ms for most directives
  - Memory usage: < 1KB per directive, < 100 bytes per instance

#### Enterprise Features

Enterprise-grade permission management, audit logging, and monitoring.

- **EnterprisePermissionConfig** - Enterprise permission system
  - Multiple permission sources (static, API, cache)
  - Role definitions with inheritance support
  - Dynamic role assignment
  - Permission check caching with TTL
  - Audit logging for permission checks
- **AuditLogConfig / AuditLogger** - Audit logging system
  - Multiple storage types (memory, localStorage, indexedDB, API)
  - Log levels (debug, info, warn, error)
  - Sensitive information filtering
  - Batch reporting with configurable interval
  - `logDirectiveAction()` - Log directive operations
  - `query()` - Query audit logs
  - `export()` - Export logs as JSON/CSV
- **ConfigCenter** - Configuration center integration
  - Multiple sources (static, API, Nacos, Apollo)
  - Auto-refresh with interval
  - Encryption support (AES, RSA)
  - Schema validation
- **Monitoring Integration** - Performance and error monitoring
  - Performance monitoring with sample rate
  - Error monitoring with uncaught exception capture
  - Behavior tracking (clicks, inputs)
  - Alert rules with severity levels
  - Multiple alert channels (email, webhook, Slack)

#### v2.0.0 Migration Preparation

Migration tools and breaking changes warning system.

- **Migration CLI Command** - `directix migrate --from directix-v1`
  - `--dry-run` - Preview changes without modification
  - `--auto-fix` - Auto-fix where possible
  - `--backup` - Backup files before migration
  - `--interactive` - Step-by-step confirmation
- **generateBreakingChangesReport()** - Generate breaking changes report for target version
- **detectBreakingChangesInCode()** - Detect potential breaking changes in code
- **createCompatLayer()** - Compatibility layer for gradual migration
  - `legacyNaming` - Support legacy CamelCase directive names
  - `legacyOptions` - Support legacy option structure
- **Migration Documentation** - Comprehensive v2.0 migration guide (EN/ZH-CN)

### Changed

- Updated dependencies for better compatibility
- Improved package exports configuration
- Enhanced backward compatibility test coverage

## [1.10.0] - 2026-05-06

### Added

#### Vue 3 Optimization Preview

Vue 3-specific optimizations as a preview before v2.0.0, leveraging Vue 3's reactive system for better performance.

- **useLazyOptimized** - Lazy loading with `shallowRef` for reduced reactivity overhead
- **useDirectiveInstance** - Directive instance management with `markRaw` for DOM elements and `reactive` for state
- **computedWithCleanup** - Computed refs with automatic cleanup on dependency changes
- **watchEffectBinding** - watchEffect integration for directive binding tracking
- **useSuspenseDirective** - Suspense-ready composable for async directives with loading/error/data state
- **ensureTeleportTarget** - Auto-create teleport target elements
- **teleportContent** - Teleport content to target with automatic cleanup

#### Mobile Optimization

Enhanced mobile support with advanced gesture recognition and performance optimizations.

- **useEnhancedTouch** - Enhanced touch gesture composable with:
  - Extended gesture types: tap, doubleTap, longPress, swipe, pan, pinch, pinchIn, pinchOut, rotate, twoFingerTap, edgeSwipe
  - Configurable gesture thresholds (tap, longPress, swipe, pinch, rotate, doubleTap, swipeVelocity)
  - Haptic feedback support (light, medium, heavy, selection)
  - Visual feedback with configurable CSS class and duration
  - Gesture priority and debounce/throttle support
  - Passive event listener optimization
- **triggerHaptic** - Trigger device vibration for haptic feedback
- **applyVisualFeedback** - Apply visual touch feedback to elements
- **addPassiveListener / addNonPassiveListener** - Passive event listener helpers
- **isTouchDevice / isMobileDevice** - Device detection utilities
- **getDevicePixelRatio** - Device pixel ratio detection
- **ObjectPool** - Object pool for memory optimization (acquire/release pattern)
- **usePWA** - PWA support composable with:
  - Service Worker registration and lifecycle management
  - Online/offline state tracking
  - Update detection and notification
  - Unregistration support

#### Accessibility (A11y)

Comprehensive accessibility utilities for building inclusive directive experiences.

- **ARIA Configuration System** - `ARIAConfig` interface with full ARIA attribute support:
  - Role types (60+ ARIA roles)
  - State attributes (expanded, selected, checked, disabled, hidden, busy, pressed, current)
  - Property attributes (label, labelledBy, describedBy, controls, owns, hasPopup, autoComplete)
  - Live region attributes (live, atomic, relevant)
  - Value attributes (valueNow, valueMin, valueMax, valueText)
  - Form attributes (placeholder, required, readonly)
  - Modal attribute (ariaModal)
- **applyAriaAttributes** - Apply ARIA attributes to elements with automatic cleanup
- **clearAriaAttributes** - Remove all ARIA attributes from elements
- **generateAriaId** - Generate unique IDs for ARIA references
- **announce** - Screen reader announcements with priority control (polite/assertive)
- **clearAnnouncer** - Clear screen reader announcer
- **useKeyboardNavigation** - Keyboard navigation composable with:
  - Configurable navigation keys (next, prev, select, close, home, end)
  - Focus trap support
  - Roving tabindex for accessible component navigation
  - Linear, grid, and tree navigation modes
  - Loop navigation support
  - Return focus on close
- **useFocusTrap** - Focus trap composable with:
  - Initial focus configuration (element, selector, or function)
  - Outside click handling
  - Escape key deactivation
  - Activate/deactivate lifecycle callbacks
- **getAutoAriaConfig** - Auto-generate ARIA config for common directive types (tooltip, menu, dialog, popover, dropdown, modal, alert, region)

#### Security Enhancement

Enhanced XSS protection, CSP compatibility, and security audit tools.

- **sanitizeHtml** - Advanced HTML sanitizer with:
  - Configurable allowed tags and attributes
  - Protocol validation (javascript:, data:, vbscript:, file:)
  - Dangerous pattern detection (script injection, event handlers, CSS expressions)
  - Custom filter support
  - Tag-specific attribute allowlists
- **isUrlSafe / sanitizeUrl** - URL validation and sanitization
- **escapeHtml / unescapeHtml** - HTML entity encoding/decoding
- **stripHtml** - Strip all HTML tags from string
- **getCSPNonce** - Extract CSP nonce from meta tags or script elements
- **injectStylesCSP** - CSP-safe style injection with nonce support
- **injectScriptCSP** - CSP-safe script injection with nonce support
- **SecurityAudit** - Security audit utility with:
  - `scanHtml()` - Scan HTML for XSS vulnerabilities
  - `checkCSP()` - Check Content Security Policy configuration
  - `generateReport()` - Generate comprehensive security reports
  - `formatReport()` - Format reports as text, JSON, or HTML
- **SafeContentHandler** - Safe content handler class for directive use
- **createSafeContentHandler** - Factory function for safe content handlers

## [1.9.0] - 2026-04-29

### Added

#### Internationalization (i18n) System

Full i18n support for directive messages and documentation.

- **i18n Architecture** - New `@directix/i18n` package for internationalization
- **Locale Support** - Built-in support for:
  - Chinese (zh-CN) - Complete translations
  - English (en-US) - Complete translations
  - Japanese (ja-JP) - Complete translations
- **Message System** - Localized error messages, warnings, and help text
- **API Documentation** - All directive parameters documented in multiple languages

#### Unified Warning System

Improved developer experience with structured error messages.

- **Warning Module** - New `@directix/core/warning` module
- **Warning Levels** - Support for debug, info, warn, error levels
- **Directive Context** - Directive name included in warning messages
- **Parameter Validation** - Structured validation messages with expected/received values
- **Assertion Helpers** - `assert`, `assertType`, `assertPositive`, `assertRange`
- **i18n Integration** - Warnings support internationalization

#### Plugin System

Extensible plugin architecture for community contributions.

- **Plugin Manager** - `PluginManager` class for plugin lifecycle
- **Plugin API** - `DirectixPlugin` interface for plugin definition
- **Directive Extensions** - Extend existing directives with custom hooks
- **Plugin Context** - Rich context for plugin operations
- **Dependency Resolution** - Automatic dependency checking
- **Hook System** - beforeInstall, afterInstall, beforeUninstall, afterUninstall hooks

#### Community Plugin Registry

Discover and install community plugins programmatically.

- **PluginRegistry Class** - Browse, search, and install third-party plugins
- **Plugin Categories** - Event, visibility, scroll, form, UI, security, observer, gesture
- **Search API** - Search by name, keywords, description, author
- **Installation Helper** - Programmatic plugin installation with dependency checking
- **Custom Registry URL** - Support for private/enterprise plugin registries

#### Directive Templates

Simplified directive creation with templates.

- **createDirectiveTemplate** - Template-based directive creation
- **createEventDirective** - Event-based directive template
- **createStyleDirective** - Style-based directive template

#### Timezone & Locale Utilities

Region-specific formatting for dates, numbers, and currencies.

- **Timezone Detection** - `getTimezoneInfo()` for user timezone detection
- **Locale Detection** - `detectLocaleInfo()` for user locale detection
- **Date Formatting** - `formatDateLocale()` with region-specific patterns
- **Number Formatting** - `formatNumberLocale()` with proper separators
- **Currency Formatting** - `formatCurrencyLocale()` with locale symbols
- **Supported Regions** - CN, US, JP, DE, FR, GB, KR, IN with custom formats

#### Vue DevTools Integration

Debug directives directly in Vue DevTools.

- **DevTools Module** - New `@directix/core/devtools` module
- **Custom Inspector** - Dedicated Directix panel in DevTools
- **Directive Tracking** - Track mounted directives and their bindings
- **Plugin Tracking** - View registered plugins and their status
- **Event Log** - Real-time directive lifecycle events
- **Vue 2 & Vue 3** - Support for both Vue versions

#### Performance Monitoring

Measure directive performance with detailed metrics.

- **Performance Module** - New `@directix/core/performance` module
- **Lifecycle Metrics** - Measure mount, update, unmount phases
- **Statistical Analysis** - P50, P95, P99 percentiles
- **Warning Thresholds** - Configurable performance warnings
- **Sampling Rate** - Control metric collection overhead
- **Report Generation** - Export performance data for analysis

#### Practical Scenario Examples

10+ real-world examples demonstrating directive combinations.

- **Form Validation** - v-debounce, v-mask, v-trim, v-focus
- **Permission Management** - v-permission, v-click-outside
- **Image Gallery** - v-lazy, v-image-preview, v-swipe
- **Infinite Scroll List** - v-infinite-scroll, v-virtual-list, v-loading
- **Rich Text Editor** - v-sanitize, v-highlight, v-emoji
- **Gesture Interaction** - v-touch, v-swipe, v-pan, v-pinch
- **Data Visualization** - v-progress, v-counter, v-countdown
- **Drag Sort** - v-draggable, v-intersect
- **Print Export** - v-print, v-export
- **Fullscreen Media** - v-fullscreen, v-lottie

### Changed

- Enhanced type exports from `@directix/i18n`
- Updated Vite configuration for i18n package
- Updated TypeScript configuration with i18n path alias
- Extended `PluginRegistryEntry` with `category`, `repository`, `homepage`, `license` fields
- Added `PluginCategory` and `PluginRegistryData` types
- `PluginManager` now exposes `getRegistry()` for accessing the plugin registry
- i18n documentation now includes timezone and locale utilities section

## [1.8.0] - 2026-04-22

### Added

#### Test Coverage Enhancement

Comprehensive test suite with 90%+ coverage target.

##### Unit Tests

- Enhanced Vitest configuration with coverage thresholds
- Added test utilities for mocking DOM APIs
- New test files for core directives:
  - `v-ripple` - Material ripple effect tests
  - `v-intersect` - Intersection Observer tests
  - `v-infinite-scroll` - Infinite scrolling tests
  - `v-resize` - Resize Observer tests
  - `v-scroll` - Scroll event handler tests
  - `v-visible` - Visibility control tests
  - `v-mutation` - Mutation Observer tests
  - `v-sanitize` - HTML sanitization tests
  - `v-sticky` - Sticky positioning tests
  - `v-mask` - Input mask tests
  - `v-watermark` - Watermark overlay tests
  - `v-draggable` - Draggable element tests
  - `v-tooltip` - Tooltip directive tests

##### E2E Tests

- Playwright test framework setup
- Cross-browser testing support (Chrome, Firefox, Safari)
- Mobile device testing support
- E2E test suites for directive interactions

##### CI/CD Integration

- GitHub Actions workflow for automated testing
- Coverage reporting with Codecov
- Bundle size monitoring
- Automated release workflow

#### Performance Optimization

##### Bundle Size Monitoring

- Added `tinybench` for benchmarking
- Performance benchmark test suite
- Bundle size CI check

##### Performance Benchmarks

Benchmark tests for core utilities:
- Debounce/throttle performance
- Number/money formatting
- Text transformations
- HTML sanitization
- Input masking

#### VS Code Extension

Official VS Code extension for enhanced developer experience.

##### Features

- **IntelliSense** - Auto-completion for all directives
- **Hover Documentation** - Inline documentation on hover
- **Code Snippets** - Quick code snippets for directives
- **Documentation Links** - Jump to official documentation

##### Available Snippets

- `vcopy` - v-copy directive
- `vdebounce` - v-debounce directive
- `vthrottle` - v-throttle directive
- `vclickoutside` - v-click-outside directive
- And 20+ more...

#### CLI Tool

Command-line tool for Directix development.

##### Commands

- `directix create directive <name>` - Create a new directive
- `directix create composable <name>` - Create a new composable
- `directix init [name]` - Initialize a new project
- `directix doctor` - Check your Directix setup

##### Project Templates

- Vue 3 + Vite template
- Vue 2 + Vite template
- Nuxt 3 template

### Changed

- Improved test coverage to 32%+
- Enhanced CI/CD pipeline with E2E tests
- Better documentation with test examples
- TypeScript configuration updated to exclude tests folder from type checking for cleaner CI builds

### Technical Details

- Added `@playwright/test` for E2E testing
- Added `tinybench` for performance benchmarking
- Created `tests/benchmark/` directory for performance tests
- Created `tests/e2e/` directory for E2E tests
- Added `playwright.config.ts` for Playwright configuration
- Created `.github/workflows/` for CI/CD automation
- Created `packages/vscode-extension/` for VS Code extension
- Created `packages/cli/` for CLI tool

---

## [1.7.1] - 2026-04-11

### Fixed

- **Playground** - Fixed Monaco Editor not loading content properly
- **Playground** - Fixed syntax highlighting showing raw HTML tags in code preview
- **Playground** - Fixed Vue version toggle not syncing with code display
- **Playground** - Removed redundant vue-version-toggle in header (duplicated with internal tabs)

### Changed

- **Documentation** - Unified playground page layout with other documentation pages
- **Documentation** - Improved Playground component styling to match site design
- **Playground** - Simplified UI by removing duplicate controls
- **TypeScript** - Fixed unused variable warnings in DirectiveConfigurator.vue

---

## [1.7.0] - 2026-04-15

### Added

#### Visual Configuration Tool

Interactive playground for configuring directives and generating code.

##### Playground Features

- **Online Playground** - Live editing environment with Vue 2/3 support
- **Directive Selector** - Browse and select from 57+ directives
- **Visual Configurator** - Interactive parameter configuration panel
- **Code Generator** - Generate Vue 2/3/Composable/Nuxt code snippets
- **TypeScript Types** - Full type definitions generation
- **Monaco Editor** - CDN-loaded code editor with syntax highlighting (optional)
- **Live Preview** - Real-time directive effect preview
- **Copy/Download** - One-click copy or download generated code

##### Configuration Presets

Pre-built templates for common directive configurations:
- `v-debounce` - Search input, form validation
- `v-throttle` - Scroll handler, click handler
- `v-lazy` - Image lazy loading
- `v-permission` - Role-based access control
- And more...

##### Documentation Integration

- Embedded Playground in each directive documentation page
- Quick code generator (`<DirectiveConfigurator />`) for instant code snippets
- Standalone Playground page for interactive exploration

#### Deployment

- Playground deployment scripts (GitHub Pages, Vercel, Netlify, S3)
- CDN resource optimization for Monaco Editor
- Added `build:playground` and `deploy:playground` npm scripts

### Changed

- Updated README with Playground section
- Updated documentation with interactive code generators
- Optimized Monaco Editor loading via CDN (removed npm dependency)
- Improved development plan with completed v1.7.0 tasks

### Technical Details

- Monaco Editor loaded dynamically from jsdelivr CDN
- Reduced playground bundle size by removing monaco-editor dependency
- Added Monaco loading state indicator
- Improved code preview with syntax highlighting fallback

---

## [1.6.0] - 2026-04-08

### Added

#### Nuxt Module

Official Nuxt 3 module for seamless integration with Nuxt applications.

##### Features

- **Auto-import composables** - All composables are automatically imported in Nuxt apps
- **Directive auto-registration** - Directives are automatically registered as Vue directives
- **Selective inclusion** - Include or exclude specific directives via configuration
- **SSR compatibility** - Proper handling of client-side only directives

##### Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['directix/nuxt'],
  
  directix: {
    // Enable/disable the module
    enabled: true,
    
    // Only include specific directives
    include: ['v-click-outside', 'v-copy', 'v-debounce'],
    
    // Or exclude specific directives
    exclude: ['v-ripple'],
    
    // Default options for directives
    directiveOptions: {
      'v-permission': {
        config: {
          getPermissions: () => ['read', 'write']
        }
      }
    },
    
    // Auto-import composables (default: true)
    autoImportComposables: true
  }
})
```

##### Usage in Nuxt

```vue
<template>
  <div v-click-outside="handleClose">
    <button v-copy="text">Copy</button>
  </div>
</template>

<script setup>
// Composables are auto-imported
const { copy, copied } = useCopy({ source: text })
const { isHovering } = useHover({ onEnter: handleEnter })
</script>
```

#### Package Exports

- Added `./nuxt` export path for Nuxt module
- Full TypeScript support with type definitions

### Changed

- Updated package.json with Nuxt module exports
- Improved module structure for better tree-shaking

---

## [1.5.0] - 2026-04-06

### Added

#### New Directives (17 new directives, total 57)

##### High-Value Directives

###### v-click-wave
- Simplified ripple effect with easier configuration
- Customizable color, duration, and size ratio
- Perfect for buttons and interactive elements

###### v-context-menu
- Right-click context menu with full customization
- Support for icons, dividers, and disabled items
- Automatic viewport boundary detection
- Custom render function support

###### v-fullscreen
- Toggle fullscreen mode for any element
- Cross-browser support with vendor prefixes
- Keyboard shortcut support (Escape to exit)
- Callbacks for enter/exit/change events

##### Utility Directives

###### v-skeleton
- Skeleton loading placeholder with animations
- Multiple animation types: wave, pulse, none
- Preserves original content dimensions
- Toggle loading state dynamically

###### v-export
- Export data to CSV, JSON, HTML, or TXT
- Custom column selection and header mapping
- Before/after export callbacks
- Automatic file download

###### v-highlight
- Highlight keywords in text content
- Support for single or multiple keywords
- Case-sensitive and whole-word options
- Customizable highlight tag and style

##### Mobile Gestures

###### v-emoji
- Filter or restrict emoji input
- Allow list and block list support
- Custom replacement character
- Works with input and textarea elements

###### v-pan
- Pan/drag gesture detection
- Support for touch and mouse events
- Direction constraints (horizontal/vertical/all)
- Threshold and velocity tracking

###### v-pinch
- Two-finger pinch/zoom gesture
- Min/max scale constraints
- Optional transform application
- Center point tracking

###### v-rotate-gesture
- Two-finger rotation gesture
- Optional transform application
- Angle and rotation tracking
- Works alongside pinch gesture

##### Visual Enhancement

###### v-blur
- Background blur overlay effect
- Customizable radius and overlay color
- Scroll lock option
- Show/hide callbacks

###### v-fade
- Fade in/out transition effect
- Customizable duration and easing
- Min/max opacity control
- Direction support (in/out/toggle)

###### v-parallax
- Parallax scrolling effect
- Adjustable speed factor
- Horizontal/vertical support
- Mobile breakpoint support

###### v-lottie
- Lottie animation player
- Play/pause/stop controls
- Speed and direction control
- Loop and autoplay support

###### v-typewriter
- Typewriter text animation
- Loop mode with delete animation
- Customizable speed and cursor
- Character-by-character callbacks

#### New Composables (17 new composables)

All 17 new directives have corresponding composable functions:

| Composable | Directive | Description |
|------------|-----------|-------------|
| `useClickWave` | v-click-wave | Click wave effect |
| `useContextMenu` | v-context-menu | Context menu control |
| `useFullscreen` | v-fullscreen | Fullscreen mode control |
| `useSkeleton` | v-skeleton | Skeleton loading state |
| `useExport` | v-export | Data export utilities |
| `useHighlight` | v-highlight | Keyword highlighting |
| `useEmoji` | v-emoji | Emoji filtering |
| `usePan` | v-pan | Pan gesture detection |
| `usePinch` | v-pinch | Pinch gesture detection |
| `useRotateGesture` | v-rotate-gesture | Rotation gesture detection |
| `useBlur` | v-blur | Blur overlay control |
| `useFade` | v-fade | Fade transition control |
| `useParallax` | v-parallax | Parallax scrolling |
| `useLottie` | v-lottie | Lottie animation control |
| `useTypewriter` | v-typewriter | Typewriter effect |
| `useProgress` | v-progress | Progress bar animation |
| `useCounter` | v-counter | Counter animation |

### Changed

- Extracted shared utilities to `@directix/shared` package for better code organization
- Updated README with all 57 directives and 57 composables
- Improved directive count accuracy
- Vue 2 demos now use consistent pattern with other demo files (`defineComponent` + `setup()`)
- Improved Composable API demo section with interactive trigger buttons

### Fixed

- `useClickWave`: Fixed incorrect API documentation - the composable returns `{ bind, trigger }` instead of `{ enable, disable }`
- Updated Vue 3 click-wave demo to correctly use `bind()` and `trigger()` methods
- Updated Vue 2 click-wave demo to use Composition API with `defineComponent` + `setup()` pattern
- Updated README.md and README_CN.md with correct `useClickWave` usage examples

---

## [1.4.1] - 2026-04-01

### Fixed

- `useInfiniteScroll`: Fix IntersectionObserver root parameter type error - Window is not a valid root, now correctly passes `null` when scroll parent is Window
- `useTrim`: Add null/undefined/empty string handling to prevent runtime errors

### Changed

- Improved composables exports in `src/composables/index.ts` - added explicit exports for `useInfiniteScroll`, `useLazy`, `useLoading`, `useMask`, `useMutation`, `useRipple`, `useSanitize`, `useSticky`, `useTooltip`, `useTruncate`
- Export `configurePermission` and `getPermissionConfig` functions from main entry point

---

## [1.4.0] - 2026-03-31

### Added

#### Composables (Composition API)

All 40 directives now have corresponding composable functions for use with the Composition API.

**Event Composables:**
- `useClickOutside` - Detect clicks outside an element with `exclude`, `capture`, `stop`, `prevent` options
- `useClickDelay` - Delay click execution to prevent repeated clicks
- `useHotkey` - Handle keyboard shortcuts with modifier keys and key aliases support
- `useLongPress` - Detect long press gestures with `duration`, `distance` options
- `useSwipe` - Detect swipe gestures in all four directions with mouse support
- `useTouch` - Detect touch gestures (swipe, pinch, rotate, tap, long press)

**UI Composables:**
- `useDraggable` - Make elements draggable with `axis`, `constrain`, `boundary`, `handle`, `grid` options
- `useFocus` - Manage element focus with `onFocus`, `onBlur` callbacks
- `useHover` - Track hover state with `enterDelay`, `leaveDelay` options
- `useVisible` - Control element visibility with `useHidden` option
- `useLoading` - Show loading overlay with custom spinner
- `useRipple` - Material Design ripple effect
- `useTooltip` - Tooltip control with positioning
- `useWatermark` - Watermark overlay with protection option
- `useEllipsis` - Text ellipsis overflow with multi-line support

**Scroll & Viewport Composables:**
- `useScroll` - Track scroll position with direction and progress detection
- `useIntersect` - Detect element intersection with viewport
- `useResize` - Track element resize with debounce option
- `useInfiniteScroll` - Infinite scrolling for lists
- `useSticky` - Sticky positioning
- `useVirtualList` - Virtual list for large datasets

**Form & Input Composables:**
- `useCopy` - Copy text to clipboard with reactive source binding
- `useDebounce` - Debounce function calls with `leading`, `trailing` options
- `useThrottle` - Throttle function calls with `leading`, `trailing` options
- `useMask` - Input masking with tokens support
- `usePermission` - Permission checking with role-based mapping

**Format Composables:**
- `useCapitalcase` - Transform text to title case
- `useLowercase` - Transform text to lowercase
- `useUppercase` - Transform text to uppercase
- `useTruncate` - Truncate text with position options
- `useTrim` - Trim whitespace from text
- `useNumber` - Format numbers with thousands separator
- `useMoney` - Format currency values

**Media & Content Composables:**
- `useLazy` - Lazy load images with IntersectionObserver
- `useImagePreview` - Image preview modal with zoom support
- `useSanitize` - Sanitize HTML content to prevent XSS
- `useMutation` - DOM mutation observer
- `usePrint` - Print content with custom styles
- `useCountdown` - Countdown timer functionality
- `usePullRefresh` - Pull to refresh for mobile

#### Utility Functions

- `debounceFn` - Standalone debounce function wrapper with `cancel` and `flush` methods
- `throttleFn` - Standalone throttle function wrapper with `cancel` method
- `createPermissionChecker` - Create reusable permission checker with shared configuration

#### Demo Updates

- Added Composable API demo sections to all 40 Vue 3 demo files
- Added Composable API demo sections to all 40 Vue 2 demo files
- Each directive demo now shows both directive usage and composable usage

### Changed

- Updated main entry to export all composables
- Updated README.md and README_CN.md with composables documentation
- Corrected directive count from 42 to 40

### Fixed

- Improved TypeScript type definitions for composables
- Fixed ESLint `no-undef` errors with `EventListener` type assertions

---

## [1.3.0] - 2026-03-30

### Added

#### New Directives (9 new directives, total 42)

##### Event Directives

###### v-click-delay
- Prevent repeated clicks within a specified time period
- Support custom delay time via arg (`v-click-delay:500`)
- Support `pendingClass` option for visual feedback during delay
- Support `disabled` option to toggle functionality
- Support both mouse and touch events
- SSR compatible

###### v-hotkey
- Keyboard shortcut handling for elements
- Support modifier keys (ctrl, alt, shift, meta)
- Support multiple hotkey formats: arg syntax, object syntax, array syntax
- Support key aliases (esc, space, up, down, left, right, enter, etc.)
- Require element focus for hotkey activation
- SSR compatible

##### UI Directives

###### v-countdown
- Display countdown timer to a target time
- Support Date object, timestamp, or ISO string as target
- Support multiple format strings (dd:hh:mm:ss, hh:mm:ss, mm:ss, ss)
- Support custom format function
- Support `onComplete` and `onTick` callbacks
- Support `autoStart` option
- SSR compatible

###### v-ellipsis
- Single and multi-line text truncation with ellipsis
- Support `lines` option for multi-line truncation
- Support `expandable` option to toggle expand on click
- Support `titleBehavior` option ('auto', 'always', 'none')
- Use CSS `-webkit-line-clamp` for multi-line ellipsis
- SSR compatible

###### v-print
- Print element content on click or immediately
- Support `target` option to print specific element
- Support custom `title` and `styles` for printed document
- Support `newWindow` option for printing in new window
- Support `onBeforePrint` and `onAfterPrint` callbacks
- Auto-include existing stylesheets in print output
- SSR compatible

###### v-watermark
- Add watermark overlay to elements
- Support single or multi-line text content
- Support custom font, color, rotation, and gap options
- Support `protect` option to prevent watermark removal
- Use MutationObserver for protection against tampering
- SSR compatible

##### Mobile Directives

###### v-pull-refresh
- Pull-to-refresh functionality for mobile
- Support custom `distance` and `maxDistance` thresholds
- Support custom indicator text for each state
- Support `onStateChange` callback
- Visual feedback during pull and refresh
- Auto-reset after success/error

###### v-swipe
- Swipe gesture detection
- Support all four directions (left, right, up, down)
- Support custom `threshold` and `maxTime` options
- Support direction-specific callbacks (`onLeft`, `onRight`, `onUp`, `onDown`)
- Support mouse events for desktop testing
- Support `preventScrollOnSwipe` option

##### Performance Directives

###### v-virtual-list
- Virtual scrolling for large lists
- Support fixed or variable item sizes
- Support `overscan` option for smooth scrolling
- Support custom render function
- Efficient DOM reuse with calculated visibility
- Auto-update on resize with ResizeObserver

### Changed

- Updated v-hotkey to require element focus (no longer global)
- Improved v-swipe with mouse support for desktop testing
- Refactored v-pull-refresh implementation for better state management
- Updated documentation for all new directives
- Added comprehensive demos for new directives

### Fixed

- Fixed type assertions in directive tests
- Fixed lifecycle hook checks in tests

---

## [1.2.0] - 2026-03-29

### Added

#### New Directives (11 new directives, total 33)

##### Format Directives

###### v-truncate
- Truncate text to specified length
- Support `position: 'start' | 'middle' | 'end'` options
- Support `useCss` option for CSS-based truncation
- Support `showTitle` option to show full text on hover
- SSR compatible

###### v-uppercase
- Transform text to uppercase
- Support `first: true` option to only capitalize first character
- Support input elements with real-time transformation
- SSR compatible

###### v-lowercase
- Transform text to lowercase
- Support `first: true` option to only lowercase first character
- Support input elements with real-time transformation
- SSR compatible

###### v-capitalcase
- Transform text to title case (capitalize each word)
- Support `every: false` option to only capitalize first word
- Support `keepLower` option for words to keep lowercase (articles, prepositions)
- Support input elements with real-time transformation
- SSR compatible

##### Form Directives

###### v-number
- Format numbers with thousands separator
- Support `precision` option for decimal places
- Support `prefix` and `suffix` options
- Support `min` and `max` value constraints
- Support input elements with real-time formatting
- SSR compatible

###### v-money
- Format currency values
- Support custom `symbol` and `symbolPosition` options
- Support all v-number options (precision, separator, etc.)
- Support `showSymbolOnFocus` option for editing
- SSR compatible

###### v-trim
- Trim whitespace from text
- Support `position: 'start' | 'end' | 'both'` options
- Support `onInput` and `onBlur` trigger options
- Support custom characters to trim
- SSR compatible

##### UI Directives

###### v-tooltip
- Tooltip directive with positioning
- Support `placement: 'top' | 'bottom' | 'left' | 'right'` options
- Support `trigger: 'hover' | 'click' | 'focus' | 'manual'` options
- Support `delay` and `hideDelay` options
- Support `arrow` option for tooltip arrow
- Support `onShow` and `onHide` callbacks
- Auto-positioning to stay within viewport

###### v-image-preview
- Image preview modal with zoom support
- Support click to preview images
- Support `previewSrc` for higher resolution image
- Support pinch zoom on mobile
- Support double tap to zoom
- Support swipe up to close
- Support `closeOnClickOutside` and `closeOnEsc` options
- Support `showCloseButton` and `showZoomIndicator` options
- Support `onOpen` and `onClose` callbacks

##### Effect Directives

###### v-draggable
- Make elements draggable
- Support `axis: 'x' | 'y' | 'both'` constraint
- Support `constrain` option to limit within parent
- Support `boundary` option for custom boundary
- Support `handle` option for drag handle
- Support `grid` option for snap-to-grid
- Support `onStart`, `onDrag`, `onEnd` callbacks

##### Event Directives

###### v-touch
- Touch gesture detection
- Support swipe detection (`onSwipe`, `onSwipeLeft`, `onSwipeRight`, `onSwipeUp`, `onSwipeDown`)
- Support pinch detection (`onPinch`)
- Support rotate detection (`onRotate`)
- Support tap detection (`onTap`)
- Support long press detection (`onLongPress`)
- Configurable thresholds for all gestures

### Changed

- Improved TypeScript type definitions for all directives
- Better SSR compatibility across all directives
- Optimized bundle size with better tree-shaking
- Updated README with all 33 directives documentation
- Added comprehensive usage examples for new directives

### Fixed

- Fixed type errors in image-preview directive (CSSStyleDeclaration)
- Fixed type errors in tooltip directive (docHide handler)
- Fixed event listener cleanup in complex directives

---

## [1.1.0] - 2026-03-29

### Added

#### New Directives

##### v-lazy
- Lazy load images with IntersectionObserver
- Support `src`, `placeholder`, `error` options
- Support `preload` option for early loading
- Support `onLoad` and `onError` callbacks
- Support custom IntersectionObserver

##### v-permission
- Permission-based element control
- Support single/multiple permission checks
- Support `mode: 'some' | 'every'` for OR/AND logic
- Support role-based permission mapping
- Support wildcard `'*'` for full access
- Support `action: 'remove' | 'disable' | 'hide'` when permission denied
- Support custom `check` function
- SSR compatible

##### v-long-press
- Detect long press events on elements
- Support custom duration via `duration` option
- Support `onStart`, `onEnd`, `onCancel` callbacks
- Support mobile touch events

##### v-hover
- Detect hover state on elements
- Support `onEnter`, `onLeave` callbacks
- Support `delay` option for delayed trigger

##### v-ripple
- Material Design ripple effect
- Support custom color via `color` option
- Support `duration` option for animation duration
- Support `disabled` option to toggle effect

##### v-scroll
- Scroll event handling with debounce support
- Support custom scroll container detection
- Support `onScroll` callback with scroll info
- Support `throttle` option for performance

##### v-resize
- Element resize observer using ResizeObserver
- Support `onResize` callback with size info
- Support `debounce` option for performance
- Support `box` option for border-box/content-box

##### v-intersect
- Element intersection detection using IntersectionObserver
- Support `onEnter`, `onLeave`, `onChange` callbacks
- Support `threshold` and `rootMargin` options
- Support `once` option for single trigger

##### v-infinite-scroll
- Infinite scrolling for lists
- Support custom distance threshold
- Support `disabled` option to toggle
- Support `immediate` option for initial check
- Support custom scroll container

##### v-sticky
- Sticky positioning with fallback
- Support `offsetTop` option
- Support custom scroll container detection
- Support `onStick` callback

##### v-mask
- Input masking for formatted input
- Support tokens: `#` (digit), `A` (letter), `N` (alphanumeric), `X` (any)
- Support `placeholder` option
- Support `onComplete` and `onChange` callbacks
- Support `clearIncomplete` option

##### v-sanitize
- Sanitize HTML content to prevent XSS
- Built-in DOMPurify integration
- Support custom `allowedTags` option
- Support custom `allowedAttributes` option
- SSR compatible

##### v-loading
- Loading overlay for elements
- Support custom loading text
- Support custom spinner HTML
- Support `lock` option to prevent scrolling
- Support `background` option
- SSR compatible

##### v-visible
- Control element visibility with animation support
- Support `useHidden` option for `visibility: hidden`
- Support transition end events
- Support `handler` callback for visibility changes
- SSR compatible

##### v-mutation
- DOM mutation observer using MutationObserver
- Support `onMutate` callback with mutation records
- Support `options` for MutationObserver config
- Support `debounce` option for performance

#### SSR Support

The following directives now support SSR:
- `v-permission` - Permission checks work on server
- `v-sanitize` - HTML sanitization works on server
- `v-focus` - Safely skips focus on server
- `v-visible` - Safely skips visibility on server
- `v-loading` - Safely skips DOM manipulation on server
- `v-debounce` - Safely skips event binding on server
- `v-throttle` - Safely skips event binding on server

#### Examples

- Added comprehensive demo pages for all new directives
- Vue 2 and Vue 3 example projects updated with all directives
- Interactive demos with code snippets

### Changed

- Improved `defineDirective` SSR handling
- Better error messages for directive configuration
- Optimized directive performance

### Fixed

- Fixed v-intersect observer cleanup on unmount
- Fixed v-sticky scroll container detection
- Fixed v-mask cursor position on input
- Fixed v-permission wildcard handling

---

## [1.0.0] - 2026-03-27

### Added

#### Core Infrastructure
- Core adapter layer for Vue 2/3 compatibility using adapter pattern
- `defineDirective` factory function for unified directive definition
- **vue-demi integration** for seamless Vue 2/3 compatibility
- Shared utilities (DOM, events, utils)
- TypeScript support with full type definitions
- Vite build configuration with `vite-plugin-dts`
- Vitest test configuration with jsdom
- ESLint 9 flat config with `@eslint-sets/eslint-config`

#### Build Outputs
- **ESM format** (`dist/index.mjs`) - For modern bundlers
- **CJS format** (`dist/index.cjs`) - For Node.js environments
- **IIFE format** (`dist/index.iife.js`) - For CDN usage
- **Minified IIFE** (`dist/index.iife.min.js`) - For production CDN usage
- **Type declarations** (`dist/index.d.ts`) - Full TypeScript support
- **Source maps** for all formats

#### Directives

##### v-click-outside
- Detect clicks outside an element
- Support `exclude` option to exclude specific elements
- Support `disabled` option to toggle detection
- Support `events` option to customize event types (click, touchstart, etc.)
- Support `capture`, `stop`, `prevent` options

##### v-copy
- Copy text to clipboard
- Support Clipboard API with fallback to `execCommand`
- Support `onSuccess` and `onError` callbacks
- Support dynamic text binding

##### v-debounce
- Debounce event handlers
- Support custom delay time via arg (`v-debounce:500`)
- Support `leading` and `trailing` options
- Return debounced function with `cancel` and `flush` methods

##### v-throttle
- Throttle event handlers
- Support custom delay time via arg (`v-throttle:1000`)
- Support `leading` and `trailing` options
- Return throttled function with `cancel` method

##### v-focus
- Auto focus an element on mount
- Support `focus` option to conditionally focus
- Support `refocus` option to re-focus on updates

#### Examples
- Vue 3 example project (`examples/vue3/`)
- Vue 2 example project (`examples/vue2/`)
- Interactive demo pages with Vue Router
- Code snippets for each directive

#### Testing
- Unit tests for all implemented directives
- Test coverage setup with v8 provider

#### Documentation
- VitePress documentation site (`docs/`)
- Bilingual support (English & Chinese)
- API reference for each directive
- Usage examples with live demos
- StackBlitz online demo integration
- README with quick start guide

### Breaking Changes

None (initial release)

### Migration Guide

#### For Vue 2.0-2.6 Users

If you're using Vue 2.0-2.6, you need to install `@vue/composition-api` as a peer dependency:

```bash
npm install @vue/composition-api
```

Vue 2.7+ has built-in Composition API support, so no additional dependencies are needed.

#### CDN Users

The CDN build has changed from `dist/index.umd.js` to `dist/index.iife.min.js`:

```html
<!-- Old -->
<script src="https://unpkg.com/directix/dist/index.umd.js"></script>

<!-- New -->
<script src="https://unpkg.com/directix/dist/index.iife.min.js"></script>
```

The new CDN build includes `vue-demi` bundled internally for seamless Vue 2/3 compatibility.

### Deprecated

None

### Removed

None

### Fixed

None

### Security

None

---

## Roadmap

### v1.7.1 (2026-04-11) ✅ Released
- Playground bug fixes and UI improvements

### v1.7.0 (2026-04-15) ✅ Released
- Visual configuration tool
- Online Playground with live preview
- Code generator (Vue 2/3/Composable/Nuxt)
- Configuration presets and templates
- Documentation embedded Playground
- Monaco Editor integration via CDN

### v1.8.0 (2026-04-22) ✅ Released
- Test coverage improvement (90%+)
- Performance optimization (bundle size, runtime)
- VS Code extension (autocompletion, hover docs, snippets)
- CLI tool (create directive, init project, doctor, migrate)

### v1.9.0 (2026-04-29) ✅ Released
- Interactive documentation with live editing
- 10+ real-world scenario examples
- i18n support (EN/ZH-CN/JA)
- Developer experience improvements (error messages, DevTools integration)
- Plugin system for community extensions

### v1.10.0 (2026-05-06)
- Vue 3 exclusive optimizations preview (Suspense, Teleport)
- Mobile optimization (touch gestures, PWA support)
- Accessibility (ARIA, keyboard navigation, screen readers)
- Security enhancements (XSS protection, CSP compatibility)

### v1.11.0 (2026-05-13)
- Stability and compatibility enhancements
- Performance limit optimization (bundle size, runtime, memory)
- Enterprise features (permissions, audit logs, config center, monitoring)
- v2.0.0 migration preparation (migration tool, breaking changes warnings)

### v2.0.0 (Future)
- Vue 3 exclusive optimizations
- Web Components support
