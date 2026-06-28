# 09 - Vue DevTools Debugging Tips

**Duration: 10 minutes**

## Video Info

- Title: Vue DevTools Debugging Tips
- Series: Advanced
- Level: Intermediate
- Prerequisites: Vue DevTools basics

## Chapters

1. Enable DevTools Integration (1.5 min)
2. Directix Inspector Panel (2.5 min)
3. Browser Extension DevTools Panel (2.5 min)
4. Directive Lifecycle Tracking (2 min)
5. Performance Debugging (2 min)

## Detailed Script

### Opening (0:00-0:10)

Today we learn how to use Vue DevTools and the Directix Browser Extension to debug directives.

### Chapter 1: Enable DevTools (0:10-1:40)

> **Visual: Vue DevTools**

First ensure Vue DevTools browser extension is installed.

> **Visual: VS Code demo**

Enable integration in app entry:

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import Directix, { enableDevtools } from 'directix'

const app = createApp(App)
app.use(Directix)

// Enable DevTools in development
if (import.meta.env.DEV) {
  enableDevtools()
}

app.mount('#app')
```

### Chapter 2: Directix Inspector Panel (1:40-4:10)

> **Visual: DevTools Directix panel**

Open DevTools, switch to "Directix" tab. You'll see three sections:

**1. Directives View**

Lists all currently active directives:

- Directive name
- Binding count
- Last updated time

Click directive for details:
- Bound element info
- Directive arguments and modifiers
- Binding value

**2. Plugins View**

Shows registered plugins:

- Plugin name and version
- Registration time
- Enabled status

**3. Events View**

Real-time event log:

- Directive mount/unmount
- Plugin install/uninstall
- Timestamps

### Chapter 3: Browser Extension DevTools Panel (4:10-6:40)

> **Visual: Chrome DevTools with Directix extension**

The Directix Browser Extension provides a dedicated DevTools panel with advanced features:

**Installation:**

1. Install the Directix Chrome Extension from the Chrome Web Store
2. Open Chrome DevTools (`F12` or `Cmd+Option+I`)
3. Switch to the "Directix" panel

**Panel Features:**

The extension provides a tabbed interface with 4 panels:

| Tab | Description |
|-----|-------------|
| **Directives** | Real-time list of all active directives on the page |
| **Performance** | Visual bar charts showing mount/update/unmount timing |
| **Issues** | Detected problems and warnings |
| **Export** | Export diagnostic reports in multiple formats |

**Real-time Directive Monitoring:**

The extension uses MutationObserver to auto-detect DOM changes:

- New directives are detected instantly
- Updates reflected in real-time
- Auto-refresh when DOM changes

**Search & Filter:**

Use the search bar and filter chips to narrow down the directive list:

- Search by directive name
- Filter by category (Event, Form, Visibility, etc.)
- Sort by mount time, update count, or name

**Performance Charts:**

Visual bar charts show timing per directive:

- Mount time (initial setup)
- Update time (re-render cost)
- Unmount time (cleanup cost)

**Diagnostic Export:**

Export reports in multiple formats:

- **JSON** - Full diagnostic data with timestamps
- **CSV** - Spreadsheet-friendly format
- **HTML** - Human-readable report

```typescript
// Export example
const report = {
  timestamp: '2026-06-28T10:30:00Z',
  directives: [
    { name: 'v-debounce', mountTime: 2.5, updates: 15 }
  ],
  issues: [
    { type: 'performance', message: 'Slow mount detected' }
  ]
}
```

### Chapter 4: Lifecycle Tracking (6:40-8:40)

> **Visual: Tracking feature**

Track directives in code:

```typescript
import { trackDirective, untrackDirective } from 'directix'

// Integrate tracking in custom directive
const vMyDirective = {
  mounted(el, binding) {
    trackDirective('my-directive', {
      element: el.tagName,
      bindings: 1,
      options: binding.value
    })
    // ... directive logic
  },

  unmounted(el) {
    untrackDirective('my-directive')
  }
}
```

> **Visual: Events panel**

Events panel shows:
- `directive:mounted:my-directive`
- `directive:updated:my-directive`
- `directive:unmounted:my-directive`

### Chapter 5: Performance Debugging (8:40-10:30)

> **Visual: Performance monitoring**

Enable performance monitoring:

```typescript
import { enablePerformance, getSlowestDirectives } from 'directix'

// Enable performance monitoring
enablePerformance({
  warnThreshold: 16, // Warn over 16ms
  sampleRate: 1      // 100% sampling
})

// View slow directives in console
console.table(getSlowestDirectives())
```

> **Visual: Performance data**

Performance report includes:
- Per-directive mount/update/unmount stats
- P50/P95/P99 latency
- Total execution time and call count

**Common Performance Issues:**

1. Frequent DOM operations in directive
2. Missing debounce/throttle
3. Repeated initialization

**VS Code Bottleneck Detection:**

The VS Code extension can detect bottlenecks:

| Type | Threshold | Suggestion |
|------|-----------|------------|
| Slow mount | > 50ms | Reduce initial DOM operations |
| Slow update | > 16ms | Add debounce/throttle |
| Excessive updates | > 100 | Optimize reactive dependencies |
| Memory leak | - | Ensure cleanup on unmount |

### Summary

Today we learned:
- Enable DevTools integration
- Use Directix Inspector panel
- Use Browser Extension DevTools panel
- Track directive lifecycle
- Debug performance issues

Next video covers plugin system and community extensions.

## Exercises

1. Enable DevTools integration, view active directives on current page
2. Install Browser Extension, explore the Performance tab
3. Use trackDirective to track custom directive lifecycle
4. Use performance monitoring to find slowest executing directive
5. Export diagnostic report as JSON and analyze the data

## Resources

- [DevTools Integration Docs](https://saqqdy.github.io/directix/guide/devtools)
- [Browser Extension Guide](https://saqqdy.github.io/directix/guide/browser-extension)
- [Performance Monitoring API](https://saqqdy.github.io/directix/api/performance)
- [VS Code Extension Guide](https://saqqdy.github.io/directix/guide/vscode-extension)