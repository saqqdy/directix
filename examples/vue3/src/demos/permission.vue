<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { configurePermission, usePermission } from 'directix'

// User state
const userRoles = ref<string[]>(['editor'])
const userPermissions = ref<string[]>(['read', 'write', 'edit'])
const availableRoles = ['admin', 'editor', 'viewer']
const availablePermissions = ['read', 'write', 'edit', 'delete', 'manage']

// Setup permission config - use computed to make it reactive
onMounted(() => {
	configurePermission({
		getPermissions: () => userPermissions.value,
		getRoles: () => userRoles.value,
		roleMap: {
			admin: ['*'],
			editor: ['read', 'write', 'edit'],
			viewer: ['read']
		}
	})
})

// Composable API demo - check permissions programmatically
const { granted: isAdmin } = usePermission({
	value: 'admin',
	getPermissions: () => userPermissions.value,
	getRoles: () => userRoles.value,
	roleMap: {
		admin: ['*'],
		editor: ['read', 'write', 'edit'],
		viewer: ['read']
	}
})

const { granted: canDelete } = usePermission({
	value: 'delete',
	getPermissions: () => userPermissions.value,
	getRoles: () => userRoles.value,
	roleMap: {
		admin: ['*'],
		editor: ['read', 'write', 'edit'],
		viewer: ['read']
	}
})

const { granted: canEditAndDelete } = usePermission({
	value: ['edit', 'delete'],
	mode: 'every',
	getPermissions: () => userPermissions.value,
	getRoles: () => userRoles.value,
	roleMap: {
		admin: ['*'],
		editor: ['read', 'write', 'edit'],
		viewer: ['read']
	}
})

const composableCode = `import { usePermission } from 'directix'

// Check single permission
const { granted: isAdmin } = usePermission({
  value: 'admin',
  getPermissions: () => userPermissions,
  getRoles: () => userRoles,
  roleMap: { admin: ['*'], editor: ['read', 'write'] }
})

// Check multiple permissions (AND logic)
const { granted: canEditAndDelete } = usePermission({
  value: ['edit', 'delete'],
  mode: 'every',
  getPermissions: () => userPermissions,
  getRoles: () => userRoles,
  roleMap: { admin: ['*'], editor: ['read', 'write'] }
})

// Use in template
<button v-if="isAdmin">Admin Only</button>
<button v-if="canDelete" :disabled="!canEditAndDelete">Delete</button>`

// Force re-render key when permissions change
const permissionKey = computed(() => `${userRoles.value.join(',')}:${userPermissions.value.join(',')}`)

const toggleRole = (role: string) => {
	const index = userRoles.value.indexOf(role)
	if (index > -1) {
		userRoles.value.splice(index, 1)
	} else {
		userRoles.value.push(role)
	}
}

const togglePermission = (perm: string) => {
	const index = userPermissions.value.indexOf(perm)
	if (index > -1) {
		userPermissions.value.splice(index, 1)
	} else {
		userPermissions.value.push(perm)
	}
}

const basicCode = `<button v-permission="'admin'">
  Admin Only
</button>`

const multipleCode = `<button v-permission="['admin', 'editor']">
  Admin or Editor
</button>`

const modeCode = `<button v-permission="{
  value: ['read', 'write'],
  mode: 'every'
}">
  Requires both permissions
</button>`

const actionCode = `<button v-permission="{
  value: 'admin',
  action: 'disable'
}">
  Disabled for non-admin
</button>`
</script>

<template>
	<div class="demo-page">
		<h1>v-permission</h1>
		<p class="intro">
			A directive for controlling element visibility and state based on user permissions. Supports role-based and permission-based access control.
		</p>

		<!-- Permission Controls -->
		<DemoSection title="Configure Permissions" description="Toggle roles and permissions to test">
			<div class="demo-box">
				<div class="control-section">
					<h4>Roles:</h4>
					<div class="toggle-group">
						<button
							v-for="role in availableRoles"
							:key="role"
							:class="['toggle-btn', { active: userRoles.includes(role) }]"
							@click="toggleRole(role)"
						>
							{{ role }}
						</button>
					</div>
				</div>
				<div class="control-section">
					<h4>Permissions:</h4>
					<div class="toggle-group">
						<button
							v-for="perm in availablePermissions"
							:key="perm"
							:class="['toggle-btn', { active: userPermissions.includes(perm) }]"
							@click="togglePermission(perm)"
						>
							{{ perm }}
						</button>
					</div>
				</div>
			</div>
		</DemoSection>

		<!-- Scenario 1: Single permission -->
		<DemoSection title="Single Permission" description="Show only for users with permission">
			<div class="demo-box" :key="permissionKey">
				<div class="button-row">
					<button v-permission="'admin'" class="demo-btn admin">
						Admin Only
					</button>
					<button v-permission="'delete'" class="demo-btn danger">
						Delete (needs 'delete')
					</button>
					<button v-permission="'read'" class="demo-btn success">
						Read (needs 'read')
					</button>
				</div>
				<p class="hint">Buttons appear/disappear based on permissions</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Multiple permissions -->
		<DemoSection title="Multiple Permissions" description="Any one permission is enough (OR logic)">
			<div class="demo-box" :key="permissionKey">
				<div class="button-row">
					<button v-permission="['admin', 'editor']" class="demo-btn primary">
						Admin OR Editor
					</button>
					<button v-permission="['delete', 'manage']" class="demo-btn danger">
						Delete OR Manage
					</button>
				</div>
			</div>
			<CodeBlock :code="multipleCode" />
		</DemoSection>

		<!-- Scenario 3: Mode 'every' -->
		<DemoSection title="All Permissions Required" description="All permissions required (AND logic)">
			<div class="demo-box" :key="permissionKey">
				<div class="button-row">
					<button
						v-permission="{ value: ['read', 'write'], mode: 'every' }"
						class="demo-btn warning"
					>
						Read AND Write
					</button>
					<button
						v-permission="{ value: ['read', 'delete'], mode: 'every' }"
						class="demo-btn danger"
					>
						Read AND Delete
					</button>
				</div>
			</div>
			<CodeBlock :code="modeCode" />
		</DemoSection>

		<!-- Scenario 4: Different actions -->
		<DemoSection title="Different Actions" description="Remove, disable, or hide elements">
			<div class="demo-box" :key="permissionKey">
				<div class="action-grid">
					<div class="action-item">
						<span class="label">action: 'remove'</span>
						<button v-permission="{ value: 'admin', action: 'remove' }" class="demo-btn">
							Admin Only
						</button>
					</div>
					<div class="action-item">
						<span class="label">action: 'disable'</span>
						<button v-permission="{ value: 'admin', action: 'disable' }" class="demo-btn">
							Admin Only
						</button>
					</div>
					<div class="action-item">
						<span class="label">action: 'hide'</span>
						<button v-permission="{ value: 'admin', action: 'hide' }" class="demo-btn">
							Admin Only
						</button>
					</div>
				</div>
			</div>
			<CodeBlock :code="actionCode" />
		</DemoSection>

		<!-- Composable API Demo -->
		<DemoSection title="Composable API - usePermission" description="Check permissions programmatically">
			<div class="demo-box" :key="permissionKey">
				<div class="composable-grid">
					<div class="composable-item">
						<span class="label">isAdmin</span>
						<span :class="['status-badge', isAdmin ? 'granted' : 'denied']">
							{{ isAdmin ? 'Granted' : 'Denied' }}
						</span>
					</div>
					<div class="composable-item">
						<span class="label">canDelete</span>
						<span :class="['status-badge', canDelete ? 'granted' : 'denied']">
							{{ canDelete ? 'Granted' : 'Denied' }}
						</span>
					</div>
					<div class="composable-item">
						<span class="label">canEditAndDelete</span>
						<span :class="['status-badge', canEditAndDelete ? 'granted' : 'denied']">
							{{ canEditAndDelete ? 'Granted' : 'Denied' }}
						</span>
					</div>
				</div>
				<div class="demo-buttons">
					<button :disabled="!isAdmin" class="demo-btn admin">
						Admin Only ({{ isAdmin ? 'Visible' : 'Hidden' }})
					</button>
					<button :disabled="!canDelete" class="demo-btn danger">
						Delete ({{ canDelete ? 'Enabled' : 'Disabled' }})
					</button>
				</div>
				<p class="hint">Change permissions above to see reactive updates</p>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>

		<!-- API Reference -->
		<DemoSection title="API">
			<table class="api-table">
				<thead>
					<tr>
						<th>Parameter</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>value</td>
						<td>String/Array</td>
						<td>-</td>
						<td>Permission(s) to check (required)</td>
					</tr>
					<tr>
						<td>mode</td>
						<td>'some' | 'every'</td>
						<td>'some'</td>
						<td>Logic for multiple permissions</td>
					</tr>
					<tr>
						<td>action</td>
						<td>'remove' | 'disable' | 'hide'</td>
						<td>'remove'</td>
						<td>Action when permission denied</td>
					</tr>
					<tr>
						<td>check</td>
						<td>Function</td>
						<td>-</td>
						<td>Custom permission check function</td>
					</tr>
					<tr>
						<td>onChange</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback on permission change</td>
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

.control-section {
	margin-bottom: 16px;
}

.control-section h4 {
	margin-bottom: 8px;
	color: #333;
}

.toggle-group {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.toggle-btn {
	padding: 8px 16px;
	border: 2px solid #e0e0e0;
	border-radius: 6px;
	background: white;
	cursor: pointer;
	font-size: 14px;
	transition: all 0.2s;
}

.toggle-btn.active {
	background: #667eea;
	border-color: #667eea;
	color: white;
}

.button-row {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.demo-btn {
	padding: 12px 24px;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 500;
	transition: opacity 0.2s;
}

.demo-btn.admin {
	background: linear-gradient(135deg, #f56565, #e53e3e);
	color: white;
}

.demo-btn.primary {
	background: linear-gradient(135deg, #667eea, #764ba2);
	color: white;
}

.demo-btn.success {
	background: linear-gradient(135deg, #48bb78, #38a169);
	color: white;
}

.demo-btn.warning {
	background: linear-gradient(135deg, #ed8936, #dd6b20);
	color: white;
}

.demo-btn.danger {
	background: linear-gradient(135deg, #f56565, #e53e3e);
	color: white;
}

.v-permission--disabled {
	opacity: 0.5;
	cursor: not-allowed !important;
}

.action-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 16px;
}

.action-item {
	text-align: center;
}

.action-item .label {
	display: block;
	margin-bottom: 8px;
	font-size: 12px;
	color: #888;
	font-family: monospace;
}

.action-item .demo-btn {
	width: 100%;
	background: #f0f0f0;
}

.composable-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	gap: 12px;
	margin-bottom: 16px;
}

.composable-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 16px;
	background: white;
	border-radius: 6px;
	border: 1px solid #e0e0e0;
}

.composable-item .label {
	font-family: monospace;
	font-size: 13px;
	color: #666;
}

.status-badge {
	padding: 4px 10px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
}

.status-badge.granted {
	background: #c6f6d5;
	color: #276749;
}

.status-badge.denied {
	background: #fed7d7;
	color: #c53030;
}

.demo-buttons {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.demo-buttons .demo-btn {
	opacity: 1;
}

.demo-buttons .demo-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
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
