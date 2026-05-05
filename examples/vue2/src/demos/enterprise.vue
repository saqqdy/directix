<template>
  <div class="enterprise-container">
    <header class="page-header">
      <h2>🏢 Enterprise Features</h2>
      <p>Audit logging, monitoring, configuration center, and permission management.</p>
    </header>

    <!-- Audit Logging -->
    <section class="ent-section">
      <div class="section-header">
        <span class="section-icon">📋</span>
        <h3>Audit Logging</h3>
      </div>
      <div class="section-body">
        <div class="action-bar">
          <button class="btn btn-info" @click="logDirectiveOp">
            <span class="btn-icon">📝</span> Directive Op
          </button>
          <button class="btn btn-success" @click="logPermissionCheck">
            <span class="btn-icon">🔑</span> Permission Check
          </button>
          <button class="btn btn-warn" @click="logSecurityViolation">
            <span class="btn-icon">🛡️</span> Security Violation
          </button>
          <button class="btn btn-error" @click="logPerformanceIssue">
            <span class="btn-icon">⚡</span> Performance Issue
          </button>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-num">{{ auditStats.totalEntries || 0 }}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-card stat-error">
            <div class="stat-num">{{ auditStats.byLevel?.error || 0 }}</div>
            <div class="stat-label">Errors</div>
          </div>
          <div class="stat-card stat-warn">
            <div class="stat-num">{{ auditStats.byLevel?.warn || 0 }}</div>
            <div class="stat-label">Warnings</div>
          </div>
          <div class="stat-card stat-info">
            <div class="stat-num">{{ auditStats.byLevel?.info || 0 }}</div>
            <div class="stat-label">Info</div>
          </div>
        </div>

        <div class="log-panel">
          <div class="panel-header">
            <span>Recent Logs</span>
            <span class="log-count">{{ recentLogs.length }} entries</span>
          </div>
          <div class="log-list">
            <div
              v-for="log in recentLogs"
              :key="log.id"
              class="log-row"
              :class="log.level"
            >
              <span class="log-badge" :class="log.level">{{ log.level }}</span>
              <span class="log-type">{{ log.type }}</span>
              <span class="log-msg">{{ log.message }}</span>
              <span class="log-ts">{{ formatTime(log.timestamp) }}</span>
            </div>
            <div v-if="recentLogs.length === 0" class="empty-state">
              Click buttons above to generate audit logs
            </div>
          </div>
        </div>

        <div class="action-bar secondary">
          <button class="btn btn-outline" @click="exportLogs">📥 Export JSON</button>
          <button class="btn btn-danger-outline" @click="clearLogs">🗑️ Clear</button>
        </div>
      </div>
    </section>

    <!-- Monitoring & Alerting -->
    <section class="ent-section">
      <div class="section-header">
        <span class="section-icon">📊</span>
        <h3>Monitoring & Alerting</h3>
      </div>
      <div class="section-body">
        <div class="action-bar">
          <button class="btn btn-info" @click="incrementCounter('directive-mounts')">⬆️ Simulate Mount</button>
          <button class="btn btn-info" @click="incrementCounter('directive-updates')">🔄 Simulate Update</button>
          <button class="btn btn-success" @click="recordLatency">⏱️ Record Latency</button>
          <button class="btn btn-warn" @click="checkHealth">🩺 Health Check</button>
        </div>

        <div class="metrics-row">
          <div class="metric-card">
            <div class="metric-icon">⬆️</div>
            <div class="metric-body">
              <div class="metric-val">{{ metrics.mounts }}</div>
              <div class="metric-name">Mounts</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">🔄</div>
            <div class="metric-body">
              <div class="metric-val">{{ metrics.updates }}</div>
              <div class="metric-name">Updates</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">⏱️</div>
            <div class="metric-body">
              <div class="metric-val">{{ metrics.avgLatency }}<small>ms</small></div>
              <div class="metric-name">Avg Latency</div>
            </div>
          </div>
          <div class="metric-card" :class="'health-' + healthStatus">
            <div class="metric-icon">{{ healthStatus === 'healthy' ? '✅' : healthStatus === 'degraded' ? '⚠️' : '❌' }}</div>
            <div class="metric-body">
              <div class="metric-val">{{ healthStatus }}</div>
              <div class="metric-name">Health</div>
            </div>
          </div>
        </div>

        <div class="alert-panel">
          <div class="panel-header">
            <span>Active Alerts</span>
            <span class="alert-count">{{ activeAlerts.length }}</span>
          </div>
          <div class="alert-list">
            <div
              v-for="alert in activeAlerts"
              :key="alert.id"
              class="alert-row"
              :class="alert.severity"
            >
              <span class="alert-severity">{{ alert.severity === 'critical' ? '🔴' : '🟡' }}</span>
              <span class="alert-name">{{ alert.name }}</span>
              <span class="alert-msg">{{ alert.message }}</span>
              <button class="btn btn-tiny" @click="acknowledgeAlert(alert.id)">✓ Ack</button>
            </div>
            <div v-if="activeAlerts.length === 0" class="empty-state">
              No active alerts — system running smoothly ✅
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Configuration Center -->
    <section class="ent-section">
      <div class="section-header">
        <span class="section-icon">⚙️</span>
        <h3>Configuration Center</h3>
      </div>
      <div class="section-body">
        <div class="config-layout">
          <div class="config-form">
            <h4>Directive Settings</h4>
            <div class="config-field">
              <label>Debounce Wait</label>
              <div class="input-group">
                <input v-model.number="config.debounceWait" type="number" @change="saveConfig" />
                <span class="input-unit">ms</span>
              </div>
            </div>
            <div class="config-field">
              <label>Throttle Wait</label>
              <div class="input-group">
                <input v-model.number="config.throttleWait" type="number" @change="saveConfig" />
                <span class="input-unit">ms</span>
              </div>
            </div>
            <div class="config-field">
              <label>Lazy Threshold</label>
              <div class="input-group">
                <input v-model.number="config.lazyThreshold" type="number" step="0.1" min="0" max="1" @change="saveConfig" />
                <span class="input-unit">0-1</span>
              </div>
            </div>
            <div class="config-toggle">
              <label>
                <input v-model="config.enableLogging" type="checkbox" @change="saveConfig" />
                <span class="toggle-label">Performance Logging</span>
              </label>
            </div>
            <div class="config-toggle">
              <label>
                <input v-model="config.enableDevTools" type="checkbox" @change="saveConfig" />
                <span class="toggle-label">DevTools Integration</span>
              </label>
            </div>
          </div>
          <div class="config-history">
            <h4>Snapshots</h4>
            <div v-if="configSnapshots.length === 0" class="empty-state small">
              Change a value to create snapshots
            </div>
            <div
              v-for="snapshot in configSnapshots"
              :key="snapshot.version"
              class="snapshot-row"
            >
              <span class="snap-version">v{{ snapshot.version }}</span>
              <span class="snap-time">{{ formatTime(snapshot.timestamp) }}</span>
              <button class="btn btn-tiny" @click="rollbackConfigEvent(snapshot.version)">↩ Rollback</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Permission Management -->
    <section class="ent-section">
      <div class="section-header">
        <span class="section-icon">🔐</span>
        <h3>Permission Management</h3>
      </div>
      <div class="section-body">
        <div class="perm-layout">
          <div class="perm-roles">
            <h4>Switch Role</h4>
            <div class="role-cards">
              <div
                v-for="role in roles"
                :key="role.id"
                class="role-card"
                :class="{ active: currentRole === role.id }"
                @click="selectRole(role.id)"
              >
                <div class="role-icon">{{ role.id === 'admin' ? '👑' : role.id === 'editor' ? '✏️' : '👁️' }}</div>
                <div class="role-name">{{ role.name }}</div>
                <div class="role-badge">{{ role.permissions.length }} perms</div>
              </div>
            </div>
          </div>

          <div class="perm-check">
            <h4>Check Permission</h4>
            <div class="check-row">
              <input
                v-model="permissionToCheck"
                placeholder="e.g. read, write, delete, admin"
                @keyup.enter="checkPermission"
              />
              <button class="btn btn-info" @click="checkPermission">Check</button>
            </div>
            <div v-if="permissionResult !== null" class="perm-result" :class="permissionResult ? 'granted' : 'denied'">
              <span class="result-icon">{{ permissionResult ? '✅' : '🚫' }}</span>
              {{ permissionResult ? 'Permission Granted' : 'Permission Denied' }}
            </div>

            <div class="quick-checks">
              <span class="quick-label">Quick check:</span>
              <button
                v-for="perm in ['read', 'write', 'delete', 'admin']"
                :key="perm"
                class="btn btn-tiny"
                :class="quickPermResults[perm] ? 'btn-success' : 'btn-danger-ghost'"
                @click="quickCheck(perm)"
              >
                {{ perm }}
              </button>
            </div>
          </div>

          <div class="perm-trail">
            <h4>Audit Trail</h4>
            <div class="trail-list">
              <div
                v-for="entry in permissionAuditTrail"
                :key="entry.id"
                class="trail-row"
                :class="entry.granted ? 'granted' : 'denied'"
              >
                <span class="trail-icon">{{ entry.granted ? '✅' : '🚫' }}</span>
                <span class="trail-perm">{{ entry.permission }}</span>
                <span class="trail-time">{{ formatTime(entry.timestamp) }}</span>
              </div>
              <div v-if="permissionAuditTrail.length === 0" class="empty-state small">
                Check permissions to see audit trail
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  logDirectiveOperation,
  logPermissionCheck,
  logSecurityViolation,
  logPerformanceIssue,
  getAuditLogStats,
  getAuditLogs,
  exportAuditLogs,
  clearAuditLogs,
  incrementCounter,
  getCounterValue,
  recordHistogram,
  acknowledgeAlert,
  addHealthCheck,
  getHealthStatus,
  getAlerts,
  getConfig,
  setConfig,
  getConfigSnapshots,
  rollbackConfig,
  configureEnterprisePermission,
  hasPermissionSync,
} from 'directix'

export default {
  name: 'EnterpriseFeaturesDemo',
  setup() {
    // ── Audit Logging ──
    const auditStats = ref({})
    const recentLogs = ref([])

    const updateAuditStats = () => {
      auditStats.value = getAuditLogStats()
      recentLogs.value = getAuditLogs({ limit: 10 })
    }

    const logDirectiveOp = () => {
      logDirectiveOperation('mount', 'v-debounce', { wait: 300 })
      updateAuditStats()
    }

    const permCheckCount = ref(0)

    const logPermissionCheckEvent = () => {
      permCheckCount.value++
      // Alternate between granted and denied to showcase both log levels
      const granted = permCheckCount.value % 3 !== 0
      const permission = granted ? 'read' : 'admin'
      logPermissionCheck(permission, granted, 'role-check', { userId: 'user-123' })
      updateAuditStats()
    }

    const logSecurityViolationEvent = () => {
      logSecurityViolation('xss-attempt', { input: '<script>alert(1)<\/script>' })
      updateAuditStats()
    }

    const logPerformanceIssueEvent = () => {
      logPerformanceIssue('slow-render', 1500, 1000)
      updateAuditStats()
    }

    const exportLogs = () => {
      const logs = exportAuditLogs('json')
      const blob = new Blob([logs], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'audit-logs-' + Date.now() + '.json'
      a.click()
      URL.revokeObjectURL(url)
    }

    const clearLogsEvent = () => {
      clearAuditLogs()
      updateAuditStats()
    }

    // ── Monitoring ──
    const metrics = reactive({ mounts: 0, updates: 0, avgLatency: 0 })
    const healthStatus = ref('healthy')
    const activeAlerts = ref([])
    const latencyRecords = ref([])

    const incrementCounterEvent = (name) => {
      incrementCounter(name)
      if (name === 'directive-mounts') {
        metrics.mounts = getCounterValue('directive-mounts')
      } else if (name === 'directive-updates') {
        metrics.updates = getCounterValue('directive-updates')
      }
    }

    const recordLatencyEvent = () => {
      const latency = Math.random() * 100 + 50
      recordHistogram('directive-latency', latency)
      latencyRecords.value.push(latency)
      const sum = latencyRecords.value.reduce((a, b) => a + b, 0)
      metrics.avgLatency = Math.round(sum / latencyRecords.value.length)
    }

    const checkHealthEvent = () => {
      const status = getHealthStatus()
      healthStatus.value = status.overall || 'healthy'
      activeAlerts.value = getAlerts({ status: 'active' })
    }

    const acknowledgeAlertEvent = (alertId) => {
      acknowledgeAlert(alertId, 'demo-user')
      activeAlerts.value = getAlerts({ status: 'active' })
    }

    // ── Configuration ──
    const config = reactive({
      debounceWait: 300,
      throttleWait: 300,
      lazyThreshold: 0.1,
      enableLogging: false,
      enableDevTools: true,
    })
    const configSnapshots = ref([])

    const saveConfig = () => {
      setConfig('directives', { ...config })
      configSnapshots.value = getConfigSnapshots()
    }

    const rollbackConfigEvent = (version) => {
      rollbackConfig(version)
      const current = getConfig('directives')
      if (current) Object.assign(config, current)
      configSnapshots.value = getConfigSnapshots()
    }

    // ── Permissions ──
    const roles = ref([
      { id: 'admin', name: 'Administrator', permissions: ['read', 'write', 'delete', 'admin'] },
      { id: 'editor', name: 'Editor', permissions: ['read', 'write'] },
      { id: 'viewer', name: 'Viewer', permissions: ['read'] },
    ])
    const currentRole = ref('editor')
    const permissionToCheck = ref('')
    const permissionResult = ref(null)
    const permissionAuditTrail = ref([])

    const quickPermResults = reactive({})

    const selectRole = (roleId) => {
      currentRole.value = roleId
      const role = roles.value.find(r => r.id === roleId)
      const manager = configureEnterprisePermission({
        sources: [{ type: 'static', permissions: role.permissions }],
        roles: {
          [roleId]: { name: role.name, permissions: role.permissions },
        },
      })
      manager.initialize().then(() => {
        updateQuickChecks()
      })
      permissionResult.value = null
    }

    const updateQuickChecks = () => {
      for (const perm of ['read', 'write', 'delete', 'admin']) {
        quickPermResults[perm] = hasPermissionSync(perm)
      }
    }

    const checkPermissionEvent = () => {
      if (!permissionToCheck.value.trim()) return
      const result = hasPermissionSync(permissionToCheck.value)
      permissionResult.value = result
      permissionAuditTrail.value.unshift({
        id: Date.now(),
        timestamp: new Date(),
        permission: permissionToCheck.value,
        granted: result,
      })
      if (permissionAuditTrail.value.length > 10) {
        permissionAuditTrail.value.pop()
      }
      updateQuickChecks()
    }

    const quickCheck = (perm) => {
      permissionToCheck.value = perm
      checkPermissionEvent()
    }

    // ── Helpers ──
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString()
    }

    onMounted(() => {
      addHealthCheck({
        name: 'memory',
        check: () => true,
        interval: 30000,
        timeout: 5000,
        enabled: true,
      })

      selectRole('editor')
      updateAuditStats()
      configSnapshots.value = getConfigSnapshots()
    })

    return {
      // Audit
      auditStats,
      recentLogs,
      logDirectiveOp,
      logPermissionCheck: logPermissionCheckEvent,
      logSecurityViolation: logSecurityViolationEvent,
      logPerformanceIssue: logPerformanceIssueEvent,
      exportLogs,
      clearLogs: clearLogsEvent,

      // Monitoring
      metrics,
      healthStatus,
      activeAlerts,
      incrementCounter: incrementCounterEvent,
      recordLatency: recordLatencyEvent,
      checkHealth: checkHealthEvent,
      acknowledgeAlert: acknowledgeAlertEvent,

      // Config
      config,
      configSnapshots,
      saveConfig,
      rollbackConfigEvent,

      // Permissions
      roles,
      currentRole,
      permissionToCheck,
      permissionResult,
      permissionAuditTrail,
      quickPermResults,
      selectRole,
      checkPermission: checkPermissionEvent,
      quickCheck,

      // Helpers
      formatTime,
    }
  },
}
</script>

<style scoped>
/* ── Base ── */
.enterprise-container {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 28px;
}
.page-header h2 {
  font-size: 22px;
  margin-bottom: 4px;
  color: #1a1a2e;
}
.page-header p {
  color: #666;
  font-size: 14px;
}

/* ── Section ── */
.ent-section {
  margin-bottom: 24px;
  border: 1px solid #e8ecf0;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  color: #fff;
}
.section-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}
.section-icon {
  font-size: 18px;
}

.section-body {
  padding: 20px;
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #42b883;
  color: #fff;
}
.btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
.btn:active {
  transform: translateY(0);
}
.btn-icon {
  font-size: 14px;
}

.btn-info { background: #1976d2; }
.btn-success { background: #2e7d32; }
.btn-warn { background: #e65100; }
.btn-error { background: #c62828; }

.btn-outline {
  background: transparent;
  color: #42b883;
  border: 1.5px solid #42b883;
}
.btn-outline:hover {
  background: #42b883;
  color: #fff;
}

.btn-danger-outline {
  background: transparent;
  color: #c62828;
  border: 1.5px solid #c62828;
}
.btn-danger-outline:hover {
  background: #c62828;
  color: #fff;
}

.btn-tiny {
  padding: 3px 10px;
  font-size: 11px;
  border-radius: 6px;
  background: #e0e0e0;
  color: #555;
  border: none;
  cursor: pointer;
}
.btn-tiny:hover {
  background: #bbb;
}

.btn-success.btn-tiny {
  background: #e8f5e9;
  color: #2e7d32;
}
.btn-danger-ghost.btn-tiny {
  background: #ffebee;
  color: #c62828;
}

/* ── Action bar ── */
.action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.action-bar.secondary {
  margin-top: 16px;
  margin-bottom: 0;
  justify-content: flex-end;
}

/* ── Stats Row ── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 10px;
  text-align: center;
  border: 1.5px solid #e8ecf0;
  transition: border-color 0.2s;
}
.stat-card:hover {
  border-color: #42b883;
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.2;
}
.stat-label {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-error .stat-num { color: #c62828; }
.stat-warn .stat-num { color: #e65100; }
.stat-info .stat-num { color: #1565c0; }

/* ── Log Panel ── */
.log-panel, .alert-panel {
  border: 1px solid #e8ecf0;
  border-radius: 10px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #f8f9fa;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  border-bottom: 1px solid #e8ecf0;
}

.log-count, .alert-count {
  font-size: 11px;
  background: #e0e0e0;
  padding: 2px 8px;
  border-radius: 10px;
  color: #666;
}

.log-list, .alert-list {
  max-height: 220px;
  overflow-y: auto;
}

.log-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  font-size: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;
}
.log-row:hover {
  background: #f8f9fa;
}
.log-row.error { border-left: 3px solid #c62828; }
.log-row.warn { border-left: 3px solid #e65100; }
.log-row.info { border-left: 3px solid #1565c0; }

.log-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: 4px;
  min-width: 48px;
  text-align: center;
}
.log-badge.error { background: #ffebee; color: #c62828; }
.log-badge.warn { background: #fff3e0; color: #e65100; }
.log-badge.info { background: #e3f2fd; color: #1565c0; }

.log-type {
  font-weight: 600;
  min-width: 120px;
  color: #333;
}
.log-msg {
  flex: 1;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.log-ts {
  color: #999;
  font-size: 11px;
  white-space: nowrap;
}

/* ── Metrics ── */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1.5px solid #e8ecf0;
  transition: border-color 0.2s;
}
.metric-card:hover {
  border-color: #42b883;
}
.metric-card.health-healthy { border-color: #4caf50; }
.metric-card.health-degraded { border-color: #ff9800; }
.metric-card.health-unhealthy { border-color: #f44336; }

.metric-icon {
  font-size: 24px;
}
.metric-val {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
}
.metric-val small {
  font-size: 12px;
  font-weight: 500;
  color: #888;
  margin-left: 2px;
}
.metric-name {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ── Alert Row ── */
.alert-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}
.alert-row.critical { background: #fff5f5; }
.alert-row.warning { background: #fffbeb; }

.alert-severity { font-size: 14px; }
.alert-name { font-weight: 600; color: #333; }
.alert-msg { flex: 1; color: #666; font-size: 12px; }

/* ── Config Layout ── */
.config-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
}

.config-form h4, .config-history h4 {
  font-size: 14px;
  margin: 0 0 12px 0;
  color: #555;
}

.config-field {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.config-field label {
  min-width: 140px;
  font-size: 13px;
  color: #555;
}
.input-group {
  display: flex;
  align-items: center;
  gap: 6px;
}
.input-group input {
  width: 80px;
  padding: 6px 10px;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  text-align: right;
}
.input-group input:focus {
  outline: none;
  border-color: #42b883;
}
.input-unit {
  font-size: 12px;
  color: #999;
}

.config-toggle {
  margin-bottom: 8px;
}
.config-toggle label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
  cursor: pointer;
}
.config-toggle input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #42b883;
}
.toggle-label {
  user-select: none;
}

.config-history {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px;
}

.snapshot-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #e8ecf0;
  font-size: 12px;
}
.snap-version {
  font-weight: 700;
  color: #42b883;
  font-family: monospace;
}
.snap-time {
  flex: 1;
  color: #888;
}

/* ── Permission Layout ── */
.perm-layout {
  display: grid;
  grid-template-columns: 220px 1fr 280px;
  gap: 24px;
}

.perm-roles h4, .perm-check h4, .perm-trail h4 {
  font-size: 14px;
  margin: 0 0 12px 0;
  color: #555;
}

.role-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.role-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #f8f9fa;
  border: 1.5px solid #e8ecf0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}
.role-card:hover {
  border-color: #42b883;
}
.role-card.active {
  background: #42b883;
  border-color: #42b883;
  color: #fff;
}
.role-icon {
  font-size: 20px;
}
.role-name {
  font-size: 13px;
  font-weight: 600;
  flex: 1;
}
.role-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(0,0,0,0.08);
}
.role-card.active .role-badge {
  background: rgba(255,255,255,0.25);
}

.check-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.check-row input {
  flex: 1;
  padding: 8px 12px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
}
.check-row input:focus {
  outline: none;
  border-color: #42b883;
}

.perm-result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 12px;
  transition: all 0.2s;
}
.perm-result.granted {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1.5px solid #a5d6a7;
}
.perm-result.denied {
  background: #ffebee;
  color: #c62828;
  border: 1.5px solid #ef9a9a;
}

.result-icon {
  font-size: 20px;
}

.quick-checks {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.quick-label {
  font-size: 12px;
  color: #888;
  margin-right: 4px;
}

.perm-trail {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px;
}
.trail-list {
  max-height: 240px;
  overflow-y: auto;
}
.trail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #e8ecf0;
  font-size: 12px;
}
.trail-row.granted .trail-perm { color: #2e7d32; }
.trail-row.denied .trail-perm { color: #c62828; }
.trail-icon { font-size: 14px; }
.trail-perm { font-weight: 600; flex: 1; }
.trail-time { color: #999; font-size: 11px; }

/* ── Empty state ── */
.empty-state {
  padding: 24px;
  text-align: center;
  color: #aaa;
  font-size: 13px;
}
.empty-state.small {
  padding: 16px;
  font-size: 12px;
}

/* ── Responsive ── */
@media (max-width: 800px) {
  .stats-row, .metrics-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .config-layout, .perm-layout {
    grid-template-columns: 1fr;
  }
}
</style>
