# 09 - Vue DevTools Debugging Tips

**Duration: 8 minutes**

## Video Info

- Title: Vue DevTools Debugging Tips
- Series: Advanced
- Level: Intermediate
- Prerequisites: Vue DevTools basics

## Chapters

1. Enable DevTools Integration (1.5 min)
2. Directix Inspector Panel (2.5 min)
3. Directive Lifecycle Tracking (2 min)
4. Performance Debugging (2 min)

## Detailed Script

### Opening (0:00-0:10)

Today we learn how to use Vue DevTools to debug Directix directives.

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

### Chapter 3: Lifecycle Tracking (4:10-6:10)

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

### Chapter 4: Performance Debugging (6:10-8:00)

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

### Summary

Today we learned:
- Enable DevTools integration
- Use Directix Inspector panel
- Track directive lifecycle
- Debug performance issues

Next video covers plugin system and community extensions.

## Exercises

1. Enable DevTools integration, view active directives on current page
2. Use trackDirective to track custom directive lifecycle
3. Use performance monitoring to find slowest executing directive

## Resources

- [DevTools Integration Docs](https://saqqdy.github.io/directix/guide/devtools)
- [Performance Monitoring API](https://saqqdy.github.io/directix/api/performance)