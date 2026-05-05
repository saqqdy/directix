<template>
  <div class="demo-container">
    <h2>Vue DevTools Integration</h2>
    <p class="description">
      Debug directives directly in Vue DevTools. Track directive usage, performance metrics, and events.
    </p>

    <!-- DevTools Status -->
    <section class="demo-section">
      <h3>DevTools Status</h3>
      <div class="demo-box">
        <div class="status-card">
          <div class="status-icon" :class="devtoolsAvailable ? 'available' : 'unavailable'">
            {{ devtoolsAvailable ? '✓' : '✗' }}
          </div>
          <div class="status-info">
            <h4>Vue DevTools</h4>
            <p>{{ devtoolsAvailable ? 'Detected and Connected' : 'Not Detected' }}</p>
            <p class="hint">
              Install Vue DevTools browser extension to enable debugging features.
            </p>
          </div>
        </div>
        <div class="actions">
          <button @click="enableDevtools" :disabled="!devtoolsAvailable">
            Enable Integration
          </button>
          <button @click="disableDevtools">Disable Integration</button>
        </div>
      </div>
    </section>

    <!-- Directive Tracking -->
    <section class="demo-section">
      <h3>Directive Tracking</h3>
      <div class="demo-box">
        <p>Track directive usage for debugging in DevTools:</p>
        <div class="tracking-demo">
          <input
            v-debounce="{ handler: handleInput, wait: 300 }"
            type="text"
            placeholder="Type to trigger tracking..."
          />
          <button
            v-long-press="{ handler: handleLongPress, duration: 500 }"
            @click="handleClick"
          >
            Hold for tracking
          </button>
        </div>
        <div class="tracking-stats">
          <div class="stat-item">
            <span class="label">v-debounce calls:</span>
            <span class="value">{{ debounceCalls }}</span>
          </div>
          <div class="stat-item">
            <span class="label">v-long-press triggers:</span>
            <span class="value">{{ longPressTriggers }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Directive Inspector -->
    <section class="demo-section">
      <h3>Directive Inspector</h3>
      <div class="demo-box">
        <p>View registered directives and their bindings:</p>
        <div class="inspector-grid">
          <div
            v-for="directive in trackedDirectives"
            :key="directive.name"
            class="inspector-item"
          >
            <div class="directive-name">v-{{ directive.name }}</div>
            <div class="directive-stats">
              <span class="bindings">{{ directive.bindings }} bindings</span>
              <span class="updated">Last: {{ formatTime(directive.lastUpdated) }}</span>
            </div>
          </div>
          <div v-if="trackedDirectives.length === 0" class="empty">
            Enable DevTools to see directive tracking
          </div>
        </div>
      </div>
    </section>

    <!-- Event Log -->
    <section class="demo-section">
      <h3>Event Log</h3>
      <div class="demo-box">
        <p>Recent directive events captured by DevTools:</p>
        <div class="event-log">
          <div
            v-for="event in recentEvents"
            :key="event.timestamp"
            class="event-item"
            :class="event.type"
          >
            <span class="event-time">{{ formatTime(event.timestamp) }}</span>
            <span class="event-type">{{ event.type }}</span>
            <span class="event-name">{{ event.name }}</span>
          </div>
          <div v-if="recentEvents.length === 0" class="empty">
            No events recorded yet
          </div>
        </div>
        <button @click="clearEvents">Clear Events</button>
      </div>
    </section>

    <!-- Performance Metrics -->
    <section class="demo-section">
      <h3>Performance Metrics in DevTools</h3>
      <div class="demo-box">
        <p>View directive performance metrics:</p>
        <div class="metrics-table">
          <table>
            <thead>
              <tr>
                <th>Directive</th>
                <th>Mount Time</th>
                <th>Update Time</th>
                <th>Memory</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="metric in performanceMetrics" :key="metric.name">
                <td>v-{{ metric.name }}</td>
                <td>{{ metric.mountTime }}ms</td>
                <td>{{ metric.updateTime }}ms</td>
                <td>{{ metric.memory }}KB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Debug Mode -->
    <section class="demo-section">
      <h3>Debug Mode</h3>
      <div class="demo-box">
        <div class="debug-controls">
          <label>
            <input type="checkbox" v-model="debugMode" @change="toggleDebugMode" />
            Enable Debug Mode (verbose logs)
          </label>
        </div>
        <div class="debug-output">
          <div
            v-for="log in debugLogs"
            :key="log.id"
            class="log-item"
            :class="log.level"
          >
            <span class="log-prefix">[{{ log.level }}]</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Usage Tips -->
    <section class="demo-section">
      <h3>DevTools Usage Tips</h3>
      <div class="demo-box">
        <ul class="tips-list">
          <li>
            <strong>Directix Inspector</strong> - View all registered directives in a custom inspector tab
          </li>
          <li>
            <strong>Component Events</strong> - Directive events appear in the component timeline
          </li>
          <li>
            <strong>Performance Timeline</strong> - Directive mount/update times visible in performance view
          </li>
          <li>
            <strong>State Inspection</strong> - Click a directive to see its current binding values
          </li>
          <li>
            <strong>Hot Reload</strong> - Directive state persists during hot module replacement
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  enableDevtools,
  disableDevtools,
  isDevtoolsAvailable,
  trackDirective,
  untrackDirective,
  getDevtoolsState,
  clearDevtoolsState,
} from 'directix'

export default {
  name: 'DevToolsDemo',
  directives: {
    debounce: {},
    longPress: {},
  },
  setup() {
    // DevTools status
    const devtoolsAvailable = ref(false)
    const devtoolsEnabled = ref(false)

    // Tracking
    const debounceCalls = ref(0)
    const longPressTriggers = ref(0)
    const trackedDirectives = ref([])
    const recentEvents = ref([])

    // Performance
    const performanceMetrics = ref([
      { name: 'debounce', mountTime: 0.3, updateTime: 0.1, memory: 0.5 },
      { name: 'throttle', mountTime: 0.2, updateTime: 0.1, memory: 0.4 },
      { name: 'click-outside', mountTime: 0.8, updateTime: 0.05, memory: 1.2 },
      { name: 'lazy', mountTime: 1.5, updateTime: 0.2, memory: 2.0 },
      { name: 'long-press', mountTime: 0.4, updateTime: 0.1, memory: 0.6 },
    ])

    // Debug mode
    const debugMode = ref(false)
    const debugLogs = ref([])

    const enableDevtoolsAction = () => {
      enableDevtools()
      devtoolsEnabled.value = true
      updateDevtoolsState()
      addDebugLog('info', 'DevTools integration enabled')
    }

    const disableDevtoolsAction = () => {
      disableDevtools()
      devtoolsEnabled.value = false
      updateDevtoolsState()
      addDebugLog('info', 'DevTools integration disabled')
    }

    const updateDevtoolsState = () => {
      const state = getDevtoolsState()
      devtoolsEnabled.value = state.enabled
    }

    // Handlers
    const handleInput = () => {
      debounceCalls.value++
      trackDirective('debounce', { element: 'input' })
      addDebugLog('debug', 'v-debounce triggered')
      updateTrackedDirectives()
    }

    const handleClick = () => {
      addDebugLog('debug', 'Button clicked')
    }

    const handleLongPress = () => {
      longPressTriggers.value++
      trackDirective('long-press', { element: 'button' })
      addDebugLog('debug', 'v-long-press triggered after 500ms')
      updateTrackedDirectives()
    }

    const updateTrackedDirectives = () => {
      const state = getDevtoolsState()
      // Simulated tracked directives for demo
      trackedDirectives.value = [
        { name: 'debounce', bindings: debounceCalls.value, lastUpdated: Date.now() },
        { name: 'long-press', bindings: longPressTriggers.value, lastUpdated: Date.now() },
      ]
    }

    const clearEventsAction = () => {
      clearDevtoolsState()
      trackedDirectives.value = []
      recentEvents.value = []
      debounceCalls.value = 0
      longPressTriggers.value = 0
      addDebugLog('info', 'DevTools state cleared')
    }

    const toggleDebugMode = () => {
      if (debugMode.value) {
        addDebugLog('info', 'Debug mode enabled - verbose logs active')
      } else {
        addDebugLog('info', 'Debug mode disabled')
      }
    }

    const addDebugLog = (level, message) => {
      if (!debugMode.value && level === 'debug') return
      debugLogs.value.unshift({
        id: Date.now(),
        level,
        message,
        timestamp: new Date(),
      })
      if (debugLogs.value.length > 50) {
        debugLogs.value.pop()
      }
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString()
    }

    onMounted(() => {
      devtoolsAvailable.value = isDevtoolsAvailable()
      if (devtoolsAvailable.value) {
        enableDevtoolsAction()
      }
    })

    onUnmounted(() => {
      disableDevtools()
    })

    return {
      // Status
      devtoolsAvailable,
      devtoolsEnabled,
      enableDevtools: enableDevtoolsAction,
      disableDevtools: disableDevtoolsAction,

      // Tracking
      debounceCalls,
      longPressTriggers,
      trackedDirectives,
      recentEvents,
      handleInput,
      handleClick,
      handleLongPress,
      clearEvents: clearEventsAction,

      // Performance
      performanceMetrics,

      // Debug
      debugMode,
      debugLogs,
      toggleDebugMode,

      // Helpers
      formatTime,
    }
  },
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.demo-section h3 {
  margin-bottom: 15px;
  color: #42b883;
}

.demo-box {
  padding: 15px;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.status-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 50%;
}

.status-icon.available {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-icon.unavailable {
  background: #ffebee;
  color: #c62828;
}

button {
  padding: 8px 16px;
  margin: 5px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #35495e;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.tracking-demo {
  display: flex;
  gap: 15px;
  margin: 15px 0;
}

.tracking-demo input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.tracking-stats {
  margin-top: 15px;
}

.stat-item {
  display: flex;
  gap: 10px;
  padding: 5px 0;
}

.inspector-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.inspector-item {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.directive-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.directive-stats {
  font-size: 12px;
  color: #666;
}

.event-log {
  max-height: 200px;
  overflow-y: auto;
  margin: 15px 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.event-item {
  display: flex;
  gap: 10px;
  padding: 8px;
  font-size: 12px;
}

.event-item.directive-mounted {
  background: #e8f5e9;
}

.event-item.directive-updated {
  background: #fff3e0;
}

.event-item.directive-unmounted {
  background: #ffebee;
}

.metrics-table table {
  width: 100%;
  border-collapse: collapse;
}

.metrics-table th, .metrics-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.debug-controls {
  margin: 15px 0;
}

.debug-output {
  max-height: 150px;
  overflow-y: auto;
  background: #263238;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
}

.log-item {
  padding: 4px 0;
}

.log-prefix {
  color: #42b883;
}

.log-item.debug .log-prefix {
  color: #78909c;
}

.log-item.info .log-prefix {
  color: #4fc3f7;
}

.log-item.warn .log-prefix {
  color: #ffb74d;
}

.log-message {
  color: #e0e0e0;
}

.tips-list {
  list-style: none;
  padding: 0;
}

.tips-list li {
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.empty {
  padding: 20px;
  text-align: center;
  color: #999;
}
</style>