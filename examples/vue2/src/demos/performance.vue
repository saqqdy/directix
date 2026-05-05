<template>
  <div class="demo-container">
    <h2>Performance Monitoring</h2>
    <p class="description">
      Real-time performance monitoring for directives. Track mount times, update durations, memory usage, and identify bottlenecks.
    </p>

    <!-- Performance Status -->
    <section class="demo-section">
      <h3>Monitoring Status</h3>
      <div class="demo-box">
        <div class="status-bar">
          <div class="status-item">
            <span class="status-label">Status</span>
            <span class="status-value" :class="monitoringEnabled ? 'active' : 'inactive'">
              {{ monitoringEnabled ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">Samples</span>
            <span class="status-value">{{ totalSamples }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Duration</span>
            <span class="status-value">{{ monitoringDuration }}s</span>
          </div>
        </div>
        <div class="actions">
          <button @click="startMonitoring" :disabled="monitoringEnabled">
            Start Monitoring
          </button>
          <button @click="stopMonitoring" :disabled="!monitoringEnabled">
            Stop Monitoring
          </button>
          <button @click="resetMetrics" class="warning">Reset Metrics</button>
        </div>
      </div>
    </section>

    <!-- Real-time Metrics -->
    <section class="demo-section">
      <h3>Real-time Metrics</h3>
      <div class="demo-box">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-icon">⏱️</span>
              <span class="metric-name">Avg Mount Time</span>
            </div>
            <div class="metric-value">{{ avgMountTime.toFixed(2) }}ms</div>
            <div class="metric-bar">
              <div class="bar" :style="{ width: mountTimePercent + '%' }"></div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-icon">🔄</span>
              <span class="metric-name">Avg Update Time</span>
            </div>
            <div class="metric-value">{{ avgUpdateTime.toFixed(2) }}ms</div>
            <div class="metric-bar">
              <div class="bar" :style="{ width: updateTimePercent + '%' }"></div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-icon">💾</span>
              <span class="metric-name">Memory Usage</span>
            </div>
            <div class="metric-value">{{ memoryUsage.toFixed(1) }}KB</div>
            <div class="metric-bar">
              <div class="bar memory" :style="{ width: memoryPercent + '%' }"></div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-icon">📊</span>
              <span class="metric-name">Directives/Sec</span>
            </div>
            <div class="metric-value">{{ directivesPerSecond }}</div>
            <div class="metric-bar">
              <div class="bar rate" :style="{ width: ratePercent + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Directive Performance -->
    <section class="demo-section">
      <h3>Directive Performance Breakdown</h3>
      <div class="demo-box">
        <div class="performance-table">
          <table>
            <thead>
              <tr>
                <th>Directive</th>
                <th>Calls</th>
                <th>Avg Time</th>
                <th>Max Time</th>
                <th>Min Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stat in directiveStats" :key="stat.name">
                <td>v-{{ stat.name }}</td>
                <td>{{ stat.calls }}</td>
                <td>{{ stat.avgTime.toFixed(2) }}ms</td>
                <td>{{ stat.maxTime.toFixed(2) }}ms</td>
                <td>{{ stat.minTime.toFixed(2) }}ms</td>
                <td>
                  <span class="status-badge" :class="stat.status">
                    {{ stat.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Slowest Directives -->
    <section class="demo-section">
      <h3>Slowest Directives</h3>
      <div class="demo-box">
        <div class="slowest-list">
          <div
            v-for="(directive, index) in slowestDirectives"
            :key="directive.name"
            class="slowest-item"
          >
            <span class="rank">#{{ index + 1 }}</span>
            <span class="name">v-{{ directive.name }}</span>
            <span class="time">{{ directive.time.toFixed(2) }}ms</span>
            <div class="time-bar">
              <div
                class="bar"
                :style="{ width: (directive.time / slowestDirectives[0].time * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Performance Timeline -->
    <section class="demo-section">
      <h3>Performance Timeline</h3>
      <div class="demo-box">
        <div class="timeline-controls">
          <button @click="generateActivity">Generate Activity</button>
          <button @click="clearTimeline">Clear Timeline</button>
        </div>
        <div class="timeline">
          <div
            v-for="event in timelineEvents"
            :key="event.id"
            class="timeline-event"
            :class="event.type"
            :style="{ left: event.position + '%' }"
          >
            <div class="event-marker"></div>
            <div class="event-tooltip">
              <span class="event-name">v-{{ event.directive }}</span>
              <span class="event-duration">{{ event.duration }}ms</span>
            </div>
          </div>
        </div>
        <div class="timeline-axis">
          <span>0s</span>
          <span>5s</span>
          <span>10s</span>
        </div>
      </div>
    </section>

    <!-- Benchmark -->
    <section class="demo-section">
      <h3>Benchmark Suite</h3>
      <div class="demo-box">
        <div class="benchmark-controls">
          <button @click="runBenchmark" :disabled="benchmarkRunning">
            {{ benchmarkRunning ? 'Running...' : 'Run Benchmark' }}
          </button>
          <select v-model="benchmarkType">
            <option value="mount">Mount Performance</option>
            <option value="update">Update Performance</option>
            <option value="memory">Memory Usage</option>
          </select>
        </div>
        <div v-if="benchmarkResults" class="benchmark-results">
          <h4>Results</h4>
          <div class="result-item" v-for="(result, name) in benchmarkResults" :key="name">
            <span class="result-name">{{ name }}</span>
            <span class="result-value">{{ result.toFixed(3) }}ms</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Performance Report -->
    <section class="demo-section">
      <h3>Performance Report</h3>
      <div class="demo-box">
        <button @click="generateReport">Generate Report</button>
        <div v-if="performanceReport" class="report">
          <pre>{{ performanceReport }}</pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import {
  enablePerformance,
  disablePerformance,
  isPerformanceEnabled,
  startMeasure,
  endMeasure,
  getPerformanceMetrics,
  getDirectiveMetrics,
  getSlowestDirectives,
  getPerformanceReport,
  clearPerformanceMetrics,
  runBenchmark,
} from 'directix'

export default {
  name: 'PerformanceMonitoringDemo',
  setup() {
    // Status
    const monitoringEnabled = ref(false)
    const monitoringStartTime = ref(0)
    const totalSamples = ref(0)

    // Metrics
    const avgMountTime = ref(0)
    const avgUpdateTime = ref(0)
    const memoryUsage = ref(0)
    const directivesPerSecond = ref(0)

    // Directive stats
    const directiveStats = ref([
      { name: 'debounce', calls: 45, avgTime: 0.32, maxTime: 1.5, minTime: 0.1, status: 'good' },
      { name: 'throttle', calls: 32, avgTime: 0.28, maxTime: 0.9, minTime: 0.1, status: 'good' },
      { name: 'click-outside', calls: 18, avgTime: 0.85, maxTime: 2.1, minTime: 0.3, status: 'warning' },
      { name: 'lazy', calls: 12, avgTime: 1.2, maxTime: 3.5, minTime: 0.5, status: 'warning' },
      { name: 'long-press', calls: 8, avgTime: 0.4, maxTime: 1.0, minTime: 0.2, status: 'good' },
      { name: 'infinite-scroll', calls: 5, avgTime: 2.8, maxTime: 5.2, minTime: 1.8, status: 'slow' },
    ])

    // Slowest directives
    const slowestDirectives = ref([
      { name: 'infinite-scroll', time: 2.8 },
      { name: 'lazy', time: 1.2 },
      { name: 'click-outside', time: 0.85 },
      { name: 'long-press', time: 0.4 },
      { name: 'debounce', time: 0.32 },
    ])

    // Timeline
    const timelineEvents = ref([])

    // Benchmark
    const benchmarkRunning = ref(false)
    const benchmarkType = ref('mount')
    const benchmarkResults = ref(null)

    // Report
    const performanceReport = ref('')

    // Computed
    const monitoringDuration = computed(() => {
      if (!monitoringEnabled.value) return 0
      return Math.round((Date.now() - monitoringStartTime.value) / 1000)
    })

    const mountTimePercent = computed(() => Math.min(avgMountTime.value * 20, 100))
    const updateTimePercent = computed(() => Math.min(avgUpdateTime.value * 50, 100))
    const memoryPercent = computed(() => Math.min(memoryUsage.value / 10, 100))
    const ratePercent = computed(() => Math.min(directivesPerSecond.value, 100))

    // Actions
    const startMonitoring = () => {
      enablePerformance()
      monitoringEnabled.value = true
      monitoringStartTime.value = Date.now()
      totalSamples.value = 0
    }

    const stopMonitoring = () => {
      disablePerformance()
      monitoringEnabled.value = false
    }

    const resetMetrics = () => {
      clearPerformanceMetrics()
      avgMountTime.value = 0
      avgUpdateTime.value = 0
      memoryUsage.value = 0
      directivesPerSecond.value = 0
      totalSamples.value = 0
      timelineEvents.value = []
    }

    const generateActivity = () => {
      const directives = ['debounce', 'throttle', 'click-outside', 'lazy', 'long-press']
      const types = ['mount', 'update', 'unmount']

      for (let i = 0; i < 10; i++) {
        const directive = directives[Math.floor(Math.random() * directives.length)]
        const type = types[Math.floor(Math.random() * types.length)]
        const duration = Math.random() * 2 + 0.1

        timelineEvents.value.push({
          id: Date.now() + i,
          type,
          directive,
          duration: duration.toFixed(2),
          position: Math.random() * 100,
        })

        totalSamples.value++
        avgMountTime.value = (avgMountTime.value + duration) / 2
      }

      if (timelineEvents.value.length > 50) {
        timelineEvents.value = timelineEvents.value.slice(-50)
      }
    }

    const clearTimeline = () => {
      timelineEvents.value = []
    }

    const runBenchmarkAction = async () => {
      benchmarkRunning.value = true
      benchmarkResults.value = null

      // Simulate benchmark
      await new Promise(resolve => setTimeout(resolve, 2000))

      benchmarkResults.value = {
        'v-debounce': 0.234,
        'v-throttle': 0.189,
        'v-click-outside': 0.567,
        'v-lazy': 1.234,
        'v-long-press': 0.345,
      }

      benchmarkRunning.value = false
    }

    const generateReportAction = () => {
      performanceReport.value = JSON.stringify({
        timestamp: new Date().toISOString(),
        summary: {
          totalDirectives: 57,
          activeDirectives: directiveStats.value.length,
          avgMountTime: avgMountTime.value.toFixed(2) + 'ms',
          avgUpdateTime: avgUpdateTime.value.toFixed(2) + 'ms',
          memoryUsage: memoryUsage.value.toFixed(1) + 'KB',
        },
        slowestDirectives: slowestDirectives.value.map(d => ({
          name: 'v-' + d.name,
          avgTime: d.time.toFixed(2) + 'ms',
        })),
        recommendations: [
          'Consider using v-lazy with lower threshold for better initial load',
          'v-infinite-scroll shows high latency - consider virtualization',
          'Enable performance caching for repeated directive usage',
        ],
      }, null, 2)
    }

    // Simulate real-time updates when monitoring
    let updateInterval = null

    onMounted(() => {
      monitoringEnabled.value = isPerformanceEnabled()

      if (monitoringEnabled.value) {
        updateInterval = setInterval(() => {
          if (monitoringEnabled.value) {
            avgMountTime.value = Math.random() * 0.5 + 0.2
            avgUpdateTime.value = Math.random() * 0.2 + 0.05
            memoryUsage.value = Math.random() * 5 + 2
            directivesPerSecond.value = Math.floor(Math.random() * 50 + 20)
          }
        }, 1000)
      }
    })

    onUnmounted(() => {
      if (updateInterval) {
        clearInterval(updateInterval)
      }
      disablePerformance()
    })

    return {
      // Status
      monitoringEnabled,
      monitoringDuration,
      totalSamples,

      // Metrics
      avgMountTime,
      avgUpdateTime,
      memoryUsage,
      directivesPerSecond,
      mountTimePercent,
      updateTimePercent,
      memoryPercent,
      ratePercent,

      // Stats
      directiveStats,
      slowestDirectives,

      // Timeline
      timelineEvents,
      generateActivity,
      clearTimeline,

      // Benchmark
      benchmarkRunning,
      benchmarkType,
      benchmarkResults,
      runBenchmark: runBenchmarkAction,

      // Report
      performanceReport,
      generateReport: generateReportAction,

      // Actions
      startMonitoring,
      stopMonitoring,
      resetMetrics,
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

.status-bar {
  display: flex;
  gap: 30px;
  margin-bottom: 15px;
}

.status-item {
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: 12px;
  color: #666;
}

.status-value {
  font-size: 18px;
  font-weight: bold;
}

.status-value.active {
  color: #4caf50;
}

.status-value.inactive {
  color: #9e9e9e;
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

button.warning {
  background: #fb8c00;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.metric-card {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.metric-icon {
  font-size: 20px;
}

.metric-name {
  font-size: 12px;
  color: #666;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #42b883;
}

.metric-bar {
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin-top: 10px;
}

.metric-bar .bar {
  height: 100%;
  background: #42b883;
  border-radius: 2px;
  transition: width 0.3s;
}

.metric-bar .bar.memory {
  background: #9c27b0;
}

.metric-bar .bar.rate {
  background: #2196f3;
}

.performance-table table {
  width: 100%;
  border-collapse: collapse;
}

.performance-table th, .performance-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.good {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.warning {
  background: #fff3e0;
  color: #e65100;
}

.status-badge.slow {
  background: #ffebee;
  color: #c62828;
}

.slowest-list {
  margin-top: 15px;
}

.slowest-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  margin: 5px 0;
  background: #f5f5f5;
  border-radius: 4px;
}

.rank {
  width: 30px;
  font-weight: bold;
  color: #42b883;
}

.name {
  width: 150px;
}

.time {
  width: 80px;
  font-family: monospace;
}

.time-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
}

.time-bar .bar {
  height: 100%;
  background: linear-gradient(90deg, #42b883, #fb8c00);
  border-radius: 4px;
}

.timeline {
  height: 80px;
  background: #f5f5f5;
  border-radius: 8px;
  position: relative;
  margin: 15px 0;
}

.timeline-event {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.event-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #42b883;
  cursor: pointer;
}

.timeline-event.mount .event-marker {
  background: #4caf50;
}

.timeline-event.update .event-marker {
  background: #2196f3;
}

.timeline-event.unmount .event-marker {
  background: #f44336;
}

.event-tooltip {
  display: none;
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.timeline-event:hover .event-tooltip {
  display: block;
}

.timeline-axis {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.benchmark-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: #f5f5f5;
  margin: 5px 0;
  border-radius: 4px;
}

.report {
  margin-top: 15px;
  padding: 15px;
  background: #263238;
  border-radius: 8px;
  overflow-x: auto;
}

.report pre {
  color: #aed581;
  font-size: 12px;
  margin: 0;
}
</style>
