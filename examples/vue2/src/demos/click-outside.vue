<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'ClickOutsideDemo',
	components: { DemoSection, CodeBlock },
	data() {
		return {
			showDropdown: false,
			showModal: false,
			disabled: false,
			clickCount: 0,
			touchCount: 0,
			basicCode: `<div v-click-outside="handleClickOutside">
  <button @click="show = !show">Toggle Dropdown</button>
  <div v-show="show" class="dropdown">
    Dropdown Content
  </div>
</div>`,
			excludeCode: `<!-- 触发按钮只负责打开 -->
<button ref="triggerBtn" @click="openModal">Open Modal</button>

<!-- modal 使用 exclude 排除触发按钮 -->
<div v-if="showModal" v-click-outside="{
  handler: closeModal,
  exclude: [triggerBtn]
}">
  Modal Content
</div>`,
			disabledCode: `<div v-click-outside="{ handler: handleClick, disabled: isDisabled }">
  <p>Click outside to count</p>
  <label>
    <input type="checkbox" v-model="disabled" />
    Disable detection
  </label>
</div>`,
			eventsCode: `<div v-click-outside="{
  handler: handleClick,
  events: ['click', 'touchstart']
}">
  Responds to click and touch events
</div>`
		}
	},
	computed: {
		triggerBtnRef(): HTMLElement | null {
			return this.$refs.triggerBtnRef as HTMLElement | null
		}
	},
	methods: {
		handleDropdownClickOutside() {
			this.showDropdown = false
		},
		openModal() {
			this.showModal = true
		},
		closeModal() {
			this.showModal = false
		},
		handleDisabledClickOutside() {
			this.clickCount++
		},
		handleTouchClickOutside() {
			this.touchCount++
		}
	}
})
</script>

<template>
	<div class="demo-page">
		<h1>v-click-outside</h1>
		<p class="intro">
			A directive that detects clicks outside an element, commonly used for dropdowns, modals, popups, etc.
		</p>

		<!-- Scenario 1: Basic usage - Dropdown menu -->
		<DemoSection title="Basic Usage - Dropdown Menu" description="Click outside the dropdown to close it">
			<div class="demo-box">
				<div v-click-outside="handleDropdownClickOutside" class="dropdown-container">
					<button class="btn" @click="showDropdown = !showDropdown">
						Toggle Dropdown
						<span class="arrow">{{ showDropdown ? '▲' : '▼' }}</span>
					</button>
					<div v-show="showDropdown" class="dropdown">
						<div class="dropdown-item">Option 1</div>
						<div class="dropdown-item">Option 2</div>
						<div class="dropdown-item">Option 3</div>
					</div>
				</div>
				<p class="hint">Click outside the dropdown area to close the menu</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Exclude specific elements -->
		<DemoSection title="Exclude Specific Elements" description="Use exclude option to exclude the trigger button">
			<div class="demo-box">
				<button
					ref="triggerBtnRef"
					class="btn"
					@click="openModal"
				>
					Open Modal
				</button>
				<div
					v-if="showModal"
					v-click-outside="{
						handler: closeModal,
						exclude: [triggerBtnRef]
					}"
					class="modal"
				>
					<h3>Modal Title</h3>
					<p>Click outside to close this modal.</p>
				</div>
				<p class="hint">Clicking the button only opens, clicking other areas closes</p>
			</div>
			<CodeBlock :code="excludeCode" />
		</DemoSection>

		<!-- Scenario 3: Disabled state -->
		<DemoSection title="Disabled State" description="Use disabled option to dynamically control detection">
			<div class="demo-box">
				<div
					v-click-outside="{
						handler: handleDisabledClickOutside,
						disabled: disabled
					}"
					class="box interactive"
				>
					<p>Click outside count: <strong>{{ clickCount }}</strong></p>
					<label class="checkbox">
						<input type="checkbox" v-model="disabled" />
						<span>Disable click outside detection</span>
					</label>
				</div>
				<p class="hint">Check the checkbox to disable detection</p>
			</div>
			<CodeBlock :code="disabledCode" />
		</DemoSection>

		<!-- Scenario 4: Multiple event types -->
		<DemoSection title="Multiple Event Types" description="Use events option to specify event types">
			<div class="demo-box">
				<div
					v-click-outside="{
						handler: handleTouchClickOutside,
						events: ['click', 'touchstart']
					}"
					class="box interactive"
				>
					<p>Click/Touch outside count: <strong>{{ touchCount }}</strong></p>
				</div>
				<p class="hint">Listens to both click and touchstart events (mobile-friendly)</p>
			</div>
			<CodeBlock :code="eventsCode" />
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
						<td>handler</td>
						<td>Function</td>
						<td>-</td>
						<td>Callback when clicking outside (required)</td>
					</tr>
					<tr>
						<td>exclude</td>
						<td>Array</td>
						<td>[]</td>
						<td>Excluded element selectors or refs</td>
					</tr>
					<tr>
						<td>capture</td>
						<td>Boolean</td>
						<td>true</td>
						<td>Whether to use capture mode</td>
					</tr>
					<tr>
						<td>events</td>
						<td>Array</td>
						<td>['click']</td>
						<td>Event types to listen</td>
					</tr>
					<tr>
						<td>disabled</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Whether to disable detection</td>
					</tr>
					<tr>
						<td>stop</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Whether to stop event propagation</td>
					</tr>
					<tr>
						<td>prevent</td>
						<td>Boolean</td>
						<td>false</td>
						<td>Whether to prevent default behavior</td>
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

.btn {
	padding: 10px 20px;
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

.arrow {
	margin-left: 8px;
}

.dropdown-container {
	position: relative;
	display: inline-block;
}

.dropdown {
	position: absolute;
	top: 100%;
	left: 0;
	margin-top: 8px;
	background: white;
	border: 1px solid #ddd;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	min-width: 150px;
	z-index: 100;
}

.dropdown-item {
	padding: 10px 16px;
	cursor: pointer;
	transition: background 0.2s;
}

.dropdown-item:hover {
	background: #f0f0f0;
}

.modal {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: white;
	padding: 24px;
	border-radius: 12px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
	z-index: 1000;
	min-width: 300px;
}

.modal h3 {
	margin-bottom: 12px;
}

.box {
	padding: 20px;
	background: white;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
}

.box.interactive {
	display: inline-block;
}

.checkbox {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 12px;
	cursor: pointer;
}

.checkbox input {
	width: 16px;
	height: 16px;
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
