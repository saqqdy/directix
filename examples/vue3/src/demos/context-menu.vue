<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { useContextMenu } from 'directix'

// Scenario 1: Basic context menu
const basicItems = [
	{ label: 'Copy', handler: () => alert('Copied!') },
	{ label: 'Paste', handler: () => alert('Pasted!') },
	{ divider: true, label: '' },
	{ label: 'Delete', handler: () => alert('Deleted!') }
]

// Scenario 2: With icons
const iconItems = [
	{ label: 'Edit', icon: '✏️', handler: () => console.log('Edit') },
	{ label: 'Duplicate', icon: '📋', handler: () => console.log('Duplicate') },
	{ divider: true, label: '' },
	{ label: 'Share', icon: '🔗', handler: () => console.log('Share') },
	{ label: 'Download', icon: '⬇️', handler: () => console.log('Download') }
]

// Scenario 3: With disabled items
const disabledItems = [
	{ label: 'Undo', handler: () => console.log('Undo') },
	{ label: 'Redo', handler: () => console.log('Redo'), disabled: true },
	{ divider: true, label: '' },
	{ label: 'Cut', handler: () => console.log('Cut') },
	{ label: 'Copy', handler: () => console.log('Copy') },
	{ label: 'Paste', handler: () => console.log('Paste'), disabled: true }
]

// Scenario 4: Custom styled
const customItems = [
	{ label: 'View Profile', handler: () => console.log('View') },
	{ label: 'Send Message', handler: () => console.log('Message') },
	{ divider: true, label: '' },
	{ label: 'Block User', handler: () => console.log('Block'), class: 'danger' }
]

// Composable API demo
const composableItems = [
	{ label: 'Item 1', handler: () => console.log('Item 1') },
	{ label: 'Item 2', handler: () => console.log('Item 2') }
]

const { show, hide, setItems } = useContextMenu({
	items: composableItems
})

const basicCode = `<div v-context-menu="menuItems">
  Right click here
</div>

<script setup>
const menuItems = [
  { label: 'Copy', handler: () => console.log('Copy') },
  { label: 'Paste', handler: () => console.log('Paste') },
  { divider: true, label: '' },
  { label: 'Delete', handler: () => console.log('Delete') }
]
<\/script>`

const iconCode = `<div v-context-menu="[
  { label: 'Edit', icon: '✏️', handler: handleEdit },
  { label: 'Delete', icon: '🗑️', handler: handleDelete }
]">
  Right click for menu with icons
</div>`

const optionsCode = `<div v-context-menu="{
  items: menuItems,
  width: 200,
  class: 'my-context-menu',
  onBeforeShow: (e) => {
    // Return false to prevent menu
    return true
  },
  onAfterShow: () => console.log('Menu shown'),
  onHide: () => console.log('Menu hidden')
}">
  Right click for custom menu
</div>`

const composableCode = `import { useContextMenu } from 'directix'

const { show, hide, setItems } = useContextMenu({
  items: menuItems
})

// Show menu at position
show(x, y)

// Hide menu
hide()

// Update menu items
setItems(newItems)`
</script>

<template>
	<div class="demo-page">
		<h1>v-context-menu</h1>
		<p class="intro">
			A directive for creating custom right-click context menus with full customization support.
		</p>

		<!-- Scenario 1: Basic usage -->
		<DemoSection title="Basic Usage" description="Right-click to show context menu">
			<div class="demo-box">
				<div v-context-menu="basicItems" class="context-area">
					<p>Right-click anywhere in this area</p>
					<p class="hint-text">Standard context menu with basic actions</p>
				</div>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: With icons -->
		<DemoSection title="With Icons" description="Menu items with icons">
			<div class="demo-box">
				<div v-context-menu="iconItems" class="context-area">
					<p>Right-click for menu with icons</p>
					<p class="hint-text">Icons are rendered before the label</p>
				</div>
			</div>
			<CodeBlock :code="iconCode" />
		</DemoSection>

		<!-- Scenario 3: With disabled items -->
		<DemoSection title="Disabled Items" description="Menu with disabled items">
			<div class="demo-box">
				<div v-context-menu="disabledItems" class="context-area">
					<p>Right-click for menu with disabled items</p>
					<p class="hint-text">Some actions may be unavailable</p>
				</div>
			</div>
		</DemoSection>

		<!-- Scenario 4: Custom styled -->
		<DemoSection title="Custom Styled" description="Menu with custom item classes">
			<div class="demo-box">
				<div v-context-menu="{ items: customItems, width: 180 }" class="context-area">
					<p>Right-click for custom styled menu</p>
					<p class="hint-text">Danger item has special styling</p>
				</div>
			</div>
			<CodeBlock :code="optionsCode" />
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useContextMenu" description="Using useContextMenu composable">
			<div class="demo-box">
				<div class="button-group">
					<button @click="show(100, 100)" class="btn">Show Menu at (100, 100)</button>
					<button @click="hide()" class="btn btn-secondary">Hide Menu</button>
				</div>
				<p class="hint">Programmatically control the context menu</p>
			</div>
			<CodeBlock :code="composableCode" />
		</DemoSection>

		<!-- API Reference -->
		<DemoSection title="API">
			<table class="api-table">
				<thead>
					<tr>
						<th>Property</th>
						<th>Type</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>label</td>
						<td>String</td>
						<td>Menu item text</td>
					</tr>
					<tr>
						<td>handler</td>
						<td>Function</td>
						<td>Click handler</td>
					</tr>
					<tr>
						<td>icon</td>
						<td>String</td>
						<td>Icon (emoji or HTML)</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>Disable the item</td>
					</tr>
					<tr>
						<td>divider</td>
						<td>Boolean</td>
						<td>Show as divider</td>
					</tr>
					<tr>
						<td>class</td>
						<td>String</td>
						<td>Custom CSS class</td>
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

.context-area {
	padding: 40px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 8px;
	color: white;
	text-align: center;
	cursor: context-menu;
	user-select: none;
}

.context-area p {
	margin: 0;
}

.hint-text {
	font-size: 13px;
	opacity: 0.8;
	margin-top: 8px !important;
}

.button-group {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.btn {
	padding: 12px 24px;
	background: #667eea;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
}

.btn:hover {
	background: #5a6fd6;
}

.btn-secondary {
	background: #6b7280;
}

.hint {
	font-size: 13px;
	color: #888;
	margin-top: 12px;
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
</style>

<style>
/* Custom context menu item style */
.v-context-menu__item.danger {
	color: #ef4444 !important;
}

.v-context-menu__item.danger:hover {
	background: #fef2f2 !important;
}
</style>
