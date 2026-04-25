<script setup lang="ts">
import { computed, ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import {
  sanitizeHtml,
  isUrlSafe,
  SecurityAudit,
} from 'directix'

// HTML Sanitization demo
const htmlInput = ref('<script>alert("xss")<\/script><p>Hello <b>World<\/b>!</p>')
const sanitizedOutput = computed(() => sanitizeHtml(htmlInput.value))
const sanitizationIssues = computed(() => SecurityAudit.scanHtml(htmlInput.value))

// URL Safety demo
const urlInput = ref('https://example.com')
const urlSafetyResult = computed(() => isUrlSafe(urlInput.value))

// Security Report demo
const reportHtml = ref('<div onclick="alert(1)">Click me</div>')
const securityReport = computed(() => SecurityAudit.generateReport(reportHtml.value))
const reportFormatted = computed(() => SecurityAudit.formatReport(securityReport.value, 'text'))

// CSP Check
const cspResult = SecurityAudit.checkCSP()

// Vulnerability severity colors
function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return '#d32f2f'
    case 'high': return '#f57c00'
    case 'medium': return '#fbc02d'
    case 'low': return '#388e3c'
    default: return '#757575'
  }
}

const sanitizeCode = `import { sanitizeHtml } from 'directix'

// Basic sanitization
const clean = sanitizeHtml(userInput)

// Custom config
const clean = sanitizeHtml(userInput, {
  allowedTags: ['b', 'i', 'p', 'a'],
  allowedAttributes: { a: ['href'], '*': ['class'] },
  detectDangerousPatterns: true,
})`

const urlCode = `import { isUrlSafe, sanitizeUrl } from 'directix'

// Check URL safety
if (isUrlSafe(redirectUrl)) {
  window.location.href = redirectUrl
}

// Sanitize URL
const safeUrl = sanitizeUrl(userInput)`

const auditCode = `import { SecurityAudit } from 'directix'

// Scan HTML for vulnerabilities
const issues = SecurityAudit.scanHtml(htmlContent)

// Generate full report
const report = SecurityAudit.generateReport(htmlContent)
console.log(SecurityAudit.formatReport(report, 'json'))

// Check CSP configuration
const { policies, warnings, recommendations } = SecurityAudit.checkCSP()

// Check dependencies (Node.js only)
const vulns = await SecurityAudit.checkDependencies()`
</script>

<template>
  <div class="demo-page">
    <h1>Security Audit & XSS Protection</h1>
    <p class="intro">
      Advanced XSS protection, CSP compatibility, and security audit tools. (v1.10.0)
    </p>

    <!-- HTML Sanitization -->
    <DemoSection title="HTML Sanitization" description="Sanitize HTML to prevent XSS attacks while preserving safe content">
      <div class="demo-box">
        <div class="form-row">
          <label class="label">Input HTML:</label>
          <textarea v-model="htmlInput" rows="3" class="textarea"></textarea>
        </div>
        <div class="form-row">
          <label class="label">Sanitized Output:</label>
          <div class="output" v-html="sanitizedOutput"></div>
        </div>
        <div class="form-row">
          <label class="label">Sanitized HTML:</label>
          <code class="code-output">{{ sanitizedOutput }}</code>
        </div>
        <div v-if="sanitizationIssues.length > 0" class="issues">
          <h4>Issues Found:</h4>
          <div
            v-for="(issue, i) in sanitizationIssues"
            :key="i"
            class="issue"
            :style="{ borderLeftColor: getSeverityColor(issue.severity) }"
          >
            <strong :style="{ color: getSeverityColor(issue.severity) }">{{ issue.severity.toUpperCase() }}</strong>
            - {{ issue.type }}: {{ issue.description }}
          </div>
        </div>
      </div>
      <CodeBlock :code="sanitizeCode" />
    </DemoSection>

    <!-- URL Safety -->
    <DemoSection title="URL Safety Check" description="Check if URLs are safe to use, blocking dangerous protocols like javascript:">
      <div class="demo-box">
        <div class="form-row">
          <input v-model="urlInput" type="text" placeholder="Enter URL..." class="input" />
          <span :class="['badge', urlSafetyResult ? 'safe' : 'unsafe']">
            {{ urlSafetyResult ? '✓ Safe' : '✗ Unsafe' }}
          </span>
        </div>
        <p class="hint">
          Try: <code class="clickable" @click="urlInput = 'javascript:alert(1)'">javascript:alert(1)</code> or
          <code class="clickable" @click="urlInput = 'https://example.com'">https://example.com</code>
        </p>
      </div>
      <CodeBlock :code="urlCode" />
    </DemoSection>

    <!-- Security Report -->
    <DemoSection title="Security Report Generator" description="Generate comprehensive security reports for HTML content">
      <div class="demo-box">
        <div class="form-row">
          <label class="label">HTML to scan:</label>
          <textarea v-model="reportHtml" rows="2" class="textarea"></textarea>
        </div>
        <div class="report">
          <pre>{{ reportFormatted }}</pre>
        </div>
      </div>
      <CodeBlock :code="auditCode" />
    </DemoSection>

    <!-- CSP Check -->
    <DemoSection title="Content Security Policy Check" description="Analyze current CSP configuration and provide recommendations">
      <div class="demo-box">
        <div v-if="cspResult.warnings.length > 0" class="warnings">
          <div v-for="(warning, i) in cspResult.warnings" :key="i" class="warning">
            ⚠️ {{ warning }}
          </div>
        </div>
        <div v-if="cspResult.recommendations.length > 0" class="recommendations">
          <h4>Recommendations:</h4>
          <ul>
            <li v-for="(rec, i) in cspResult.recommendations" :key="i">{{ rec }}</li>
          </ul>
        </div>
        <div v-if="Object.keys(cspResult.policies).length > 0" class="policies">
          <h4>Current Policies:</h4>
          <pre>{{ JSON.stringify(cspResult.policies, null, 2) }}</pre>
        </div>
        <div v-if="cspResult.warnings.length === 0 && Object.keys(cspResult.policies).length === 0">
          <p class="hint">No CSP meta tag detected on this page.</p>
        </div>
      </div>
    </DemoSection>

    <!-- API Reference -->
    <DemoSection title="API">
      <table class="api-table">
        <thead>
          <tr>
            <th>Function</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>sanitizeHtml(html, config?)</code></td>
            <td>Sanitize HTML to prevent XSS</td>
          </tr>
          <tr>
            <td><code>isUrlSafe(url, protocols?)</code></td>
            <td>Check if URL is safe</td>
          </tr>
          <tr>
            <td><code>sanitizeUrl(url, protocols?)</code></td>
            <td>Sanitize URL</td>
          </tr>
          <tr>
            <td><code>escapeHtml(str)</code></td>
            <td>Escape HTML entities</td>
          </tr>
          <tr>
            <td><code>SecurityAudit.scanHtml(html)</code></td>
            <td>Scan HTML for vulnerabilities</td>
          </tr>
          <tr>
            <td><code>SecurityAudit.checkCSP()</code></td>
            <td>Check CSP configuration</td>
          </tr>
          <tr>
            <td><code>SecurityAudit.generateReport(html?)</code></td>
            <td>Generate security report</td>
          </tr>
        </tbody>
      </table>
    </DemoSection>
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 900px;
}

h1 {
  margin-bottom: 8px;
}

.intro {
  color: #666;
  margin-bottom: 24px;
}

.demo-box {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.hint {
  font-size: 13px;
  color: #888;
  margin-top: 12px;
}

.form-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 15px;
}

.label {
  min-width: 100px;
  font-weight: 500;
  padding-top: 8px;
}

.input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.textarea {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: monospace;
  resize: vertical;
}

.output {
  flex: 1;
  padding: 10px 12px;
  background: white;
  border-radius: 6px;
  min-height: 30px;
}

.code-output {
  flex: 1;
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 13px;
}

.issues,
.warnings,
.recommendations,
.policies {
  margin-top: 15px;
  padding: 12px;
  background: #fff3e0;
  border-radius: 6px;
}

.issues h4,
.recommendations h4,
.policies h4 {
  margin-bottom: 8px;
  font-size: 14px;
}

.issue {
  padding: 8px 12px;
  margin: 6px 0;
  background: white;
  border-radius: 4px;
  border-left: 4px solid;
}

.warning {
  padding: 8px 12px;
  background: #fff8e1;
  border-radius: 4px;
  margin: 6px 0;
}

.recommendations ul {
  margin: 0;
  padding-left: 20px;
}

.recommendations li {
  margin: 4px 0;
}

.policies pre {
  margin: 0;
  font-size: 12px;
  white-space: pre-wrap;
}

.badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
}

.badge.safe {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge.unsafe {
  background: #ffebee;
  color: #c62828;
}

.clickable {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.clickable:hover {
  background: #e0e0e0;
}

.report {
  margin-top: 10px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
}

.report pre {
  margin: 0;
  white-space: pre-wrap;
  font-size: 12px;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.api-table th,
.api-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.api-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.api-table code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}
</style>