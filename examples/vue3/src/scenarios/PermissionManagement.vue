<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { configurePermission } from 'directix'

// 权限管理场景 - v-permission, v-click-outside

// 模拟用户权限
const currentUser = ref({
	name: 'Admin',
	role: 'admin',
	permissions: ['user:read', 'user:write', 'user:delete', 'system:config'],
})

// 配置 v-permission 指令读取当前权限
onMounted(() => {
	configurePermission({
		getPermissions: () => currentUser.value.permissions,
	})
})

// 权限变化时强制重新渲染
const permissionKey = computed(() => currentUser.value.permissions.join(','))

// 菜单项
const menuItems = ref([
	{ id: 1, name: '用户列表', permission: 'user:read', icon: '👥' },
	{ id: 2, name: '添加用户', permission: 'user:write', icon: '➕' },
	{ id: 3, name: '删除用户', permission: 'user:delete', icon: '🗑️' },
	{ id: 4, name: '系统设置', permission: 'system:config', icon: '⚙️' },
	{ id: 5, name: '数据统计', permission: 'system:stats', icon: '📊' },
	{ id: 6, name: '日志查看', permission: 'system:logs', icon: '📋' },
])

// 下拉菜单状态
const dropdownOpen = ref(false)

const toggleDropdown = () => {
	dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
	dropdownOpen.value = false
}

// 模拟角色切换
const roles = ['admin', 'editor', 'viewer']
const switchRole = (role: string) => {
	if (role === 'admin') {
		currentUser.value = {
			name: 'Admin',
			role,
			permissions: ['user:read', 'user:write', 'user:delete', 'system:config'],
		}
	} else if (role === 'editor') {
		currentUser.value = {
			name: 'Editor',
			role,
			permissions: ['user:read', 'user:write'],
		}
	} else {
		currentUser.value = {
			name: 'Viewer',
			role,
			permissions: ['user:read'],
		}
	}
}
</script>

<template>
	<div class="scenario-container" :key="permissionKey">
		<h2>权限管理系统</h2>
		<p class="description">结合 v-permission、v-click-outside 实现 RBAC 权限控制</p>

		<!-- 角色切换 -->
		<div class="role-switcher">
			<span>当前角色：</span>
			<button
				v-for="role in roles"
				:key="role"
				:class="['role-btn', { active: currentUser.role === role }]"
				@click="switchRole(role)"
			>
				{{ role }}
			</button>
		</div>

		<!-- 权限信息 -->
		<div class="permission-info">
			<strong>{{ currentUser.name }}</strong> 的权限：
			<span class="permission-tag" v-for="p in currentUser.permissions" :key="p">
				{{ p }}
			</span>
		</div>

		<!-- 菜单项 - 根据 v-permission 自动显示/隐藏 -->
		<div class="demo-section">
			<h3>菜单项（根据权限显示）</h3>
			<div class="menu-list">
				<div
					v-for="item in menuItems"
					:key="item.id"
					v-permission="{ value: item.permission, mode: 'any' }"
					class="menu-item"
				>
					<span class="icon">{{ item.icon }}</span>
					<span class="name">{{ item.name }}</span>
					<code class="perm-code">{{ item.permission }}</code>
				</div>
			</div>
		</div>

		<!-- 下拉菜单 - v-click-outside 示例 -->
		<div class="demo-section">
			<h3>下拉菜单（v-click-outside）</h3>
			<div class="dropdown-container" v-click-outside="closeDropdown">
				<button class="dropdown-trigger" @click="toggleDropdown">
					操作菜单 ▼
				</button>
				<div v-if="dropdownOpen" class="dropdown-menu">
					<div
						v-permission="'user:write'"
						class="dropdown-item"
						@click="dropdownOpen = false"
					>
						编辑
					</div>
					<div
						v-permission="'user:delete'"
						class="dropdown-item danger"
						@click="dropdownOpen = false"
					>
						删除
					</div>
					<div class="dropdown-item" @click="dropdownOpen = false">
						查看详情
					</div>
				</div>
			</div>
		</div>

		<!-- 操作按钮 -->
		<div class="demo-section">
			<h3>操作按钮</h3>
			<div class="button-group">
				<button v-permission="'user:read'" class="btn">
					查看用户
				</button>
				<button v-permission="'user:write'" class="btn primary">
					添加用户
				</button>
				<button v-permission="'user:delete'" class="btn danger">
					删除用户
				</button>
				<button v-permission="'system:config'" class="btn">
					系统配置
				</button>
			</div>
		</div>

		<div class="code-section">
			<h3>使用的指令</h3>
			<ul>
				<li><strong>v-permission</strong> - 根据权限控制元素显示/隐藏</li>
				<li><strong>v-click-outside</strong> - 点击外部关闭下拉菜单</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
.scenario-container {
	padding: 20px;
	max-width: 600px;
}

h2 {
	color: #42b883;
	margin-bottom: 8px;
}

.description {
	color: #666;
	margin-bottom: 20px;
}

.role-switcher {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 16px;
}

.role-btn {
	padding: 6px 12px;
	border: 1px solid #ddd;
	background: #fff;
	border-radius: 4px;
	cursor: pointer;
}

.role-btn.active {
	background: #42b883;
	color: white;
	border-color: #42b883;
}

.permission-info {
	background: #f5f5f5;
	padding: 10px 15px;
	border-radius: 6px;
	margin-bottom: 20px;
}

.permission-tag {
	display: inline-block;
	background: #e8f4ec;
	color: #42b883;
	padding: 2px 8px;
	border-radius: 4px;
	font-size: 12px;
	margin-left: 6px;
}

.demo-section {
	margin-bottom: 24px;
}

.demo-section h3 {
	font-size: 14px;
	margin-bottom: 12px;
	color: #333;
}

.menu-list {
	background: #fff;
	border: 1px solid #eee;
	border-radius: 8px;
	overflow: hidden;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 12px 16px;
	border-bottom: 1px solid #eee;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-item .icon {
	margin-right: 10px;
}

.menu-item .name {
	flex: 1;
}

.perm-code {
	font-size: 11px;
	color: #999;
	background: #f5f5f5;
	padding: 2px 6px;
	border-radius: 3px;
}

.dropdown-container {
	position: relative;
	display: inline-block;
}

.dropdown-trigger {
	padding: 10px 16px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
}

.dropdown-menu {
	position: absolute;
	top: 100%;
	left: 0;
	margin-top: 4px;
	background: white;
	border: 1px solid #eee;
	border-radius: 6px;
	min-width: 150px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	z-index: 10;
}

.dropdown-item {
	padding: 10px 16px;
	cursor: pointer;
}

.dropdown-item:hover {
	background: #f5f5f5;
}

.dropdown-item.danger {
	color: #f56c6c;
}

.button-group {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

.btn {
	padding: 8px 16px;
	border: 1px solid #ddd;
	background: white;
	border-radius: 6px;
	cursor: pointer;
}

.btn.primary {
	background: #42b883;
	color: white;
	border-color: #42b883;
}

.btn.danger {
	color: #f56c6c;
	border-color: #f56c6c;
}

.code-section {
	margin-top: 20px;
	padding: 15px;
	background: #fff;
	border-radius: 6px;
	border: 1px solid #eee;
}

.code-section h3 {
	font-size: 14px;
	margin-bottom: 10px;
}

.code-section ul {
	list-style: none;
	padding: 0;
}

.code-section li {
	padding: 4px 0;
	font-size: 13px;
}
</style>