<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'FocusDemo',
	components: { DemoSection, CodeBlock },
	data() {
		return {
			showInput: false,
			focusEnabled: true,
			focusCount: 0,
			blurCount: 0,
			refocusValue: 'Hello',
			refocusEnabled: true,
			basicCode: `<!-- 自动聚焦 -->
<input v-focus />

<!-- 条件聚焦 -->
<input v-focus="shouldFocus" />`,
			callbackCode: `<input v-focus="{
  focus: true,
  onFocus: (el) => {
    console.log('Focused!', el)
  },
  onBlur: (el) => {
    console.log('Blurred!', el)
  }
}" />`,
			refocusCode: `<!-- refocus: true 时，每次更新都会重新聚焦 -->
<input
  v-focus="{ focus: true, refocus: true }"
  v-model="value"
/>

<!-- 点击按钮更新数据，焦点会自动回到输入框 -->
<button @click="updateValue">Update Value</button>`,
			optionsCode: `interface FocusOptions {
  focus?: boolean      // 是否自动聚焦，默认 true
  refocus?: boolean    // 是否在每次更新时重新聚焦，默认 false
  onFocus?: (el: HTMLElement) => void  // 聚焦回调
  onBlur?: (el: HTMLElement) => void   // 失焦回调
}`,
		}
	},
	methods: {
		toggleInput() {
			this.showInput = !this.showInput
		},
		handleFocus() {
			this.focusCount++
		},
		handleBlur() {
			this.blurCount++
		},
		updateRefocusValue() {
			this.refocusValue = 'Updated at ' + new Date().toLocaleTimeString()
		},
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-focus</h1>
		<p class="intro">
			自动聚焦指令，在元素挂载时自动获取焦点，常用于表单输入、弹窗输入框等场景。
		</p>

		<!-- 场景1: 基础用法 -->
		<DemoSection title="基础用法" description="元素挂载时自动获取焦点">
			<div class="demo-box">
				<button class="btn" @click="toggleInput">
					{{ showInput ? 'Hide' : 'Show' }} Input
				</button>
				<div v-if="showInput" class="input-container">
					<input
						v-focus
						class="input"
						type="text"
						placeholder="I will be focused automatically!"
					/>
				</div>
				<p class="hint">点击按钮显示输入框，输入框会自动获取焦点</p>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- 场景2: 条件聚焦 -->
		<DemoSection title="条件聚焦" description="根据条件决定是否自动聚焦">
			<div class="demo-box">
				<div class="control">
					<label class="checkbox">
						<input type="checkbox" v-model="focusEnabled" />
						<span>Enable auto focus</span>
					</label>
				</div>
				<div class="inputs">
					<div class="input-group">
						<label>With focus={{ focusEnabled }}:</label>
						<input
							:key="'conditional-' + focusEnabled"
							v-focus="focusEnabled"
							class="input"
							type="text"
							:placeholder="focusEnabled ? 'Will focus' : 'No focus'"
						/>
					</div>
				</div>
				<p class="hint">切换复选框控制是否自动聚焦</p>
			</div>
		</DemoSection>

		<!-- 场景3: 回调函数 -->
		<DemoSection title="回调函数" description="监听聚焦和失焦事件">
			<div class="demo-box">
				<input
					v-focus="{
						focus: true,
						onFocus: handleFocus,
						onBlur: handleBlur
					}"
					class="input"
					type="text"
					placeholder="Focus and blur me!"
				/>
				<div class="stats">
					<span>Focus count: <strong>{{ focusCount }}</strong></span>
					<span>Blur count: <strong>{{ blurCount }}</strong></span>
				</div>
				<p class="hint">聚焦和失焦时会触发回调函数</p>
			</div>
			<CodeBlock :code="callbackCode" />
		</DemoSection>

		<!-- 场景4: refocus -->
		<DemoSection title="Refocus 选项" description="数据更新后自动重新聚焦">
			<div class="demo-box">
				<div class="refocus-demo">
					<div class="input-group">
						<label>Without refocus:</label>
						<input
							v-model="refocusValue"
							v-focus
							class="input"
							type="text"
							placeholder="Type something..."
						/>
					</div>
					<div class="input-group">
						<label>With refocus: {{ refocusEnabled }}</label>
						<input
							v-model="refocusValue"
							v-focus="{ focus: true, refocus: refocusEnabled }"
							class="input"
							type="text"
							placeholder="Type something..."
						/>
					</div>
				</div>
				<div class="refocus-actions">
					<button class="btn" @click="updateRefocusValue">Update Value</button>
					<span class="hint">点击按钮后，右边输入框会自动获取焦点</span>
				</div>
			</div>
			<CodeBlock :code="refocusCode" />
		</DemoSection>

		<!-- 场景5: 实际应用 - 登录表单 -->
		<DemoSection title="实际应用 - 登录表单" description="打开页面时自动聚焦到用户名输入框">
			<div class="demo-box">
				<form class="login-form" @submit.prevent>
					<div class="form-group">
						<label>Username</label>
						<input
							v-focus
							class="input"
							type="text"
							placeholder="Auto focused"
						/>
					</div>
					<div class="form-group">
						<label>Password</label>
						<input class="input" type="password" placeholder="Password" />
					</div>
					<button class="btn" type="submit">Login</button>
				</form>
				<p class="hint">用户名输入框自动聚焦，提升用户体验</p>
			</div>
		</DemoSection>

		<!-- API 说明 -->
		<DemoSection title="API">
			<CodeBlock :code="optionsCode" />
			<table class="api-table">
				<thead>
					<tr>
						<th>参数</th>
						<th>类型</th>
						<th>默认值</th>
						<th>说明</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>focus</td>
						<td>Boolean</td>
						<td>true</td>
						<td>是否自动聚焦</td>
					</tr>
					<tr>
						<td>refocus</td>
						<td>Boolean</td>
						<td>false</td>
						<td>是否在每次更新时重新聚焦</td>
					</tr>
					<tr>
						<td>onFocus</td>
						<td>Function</td>
						<td>-</td>
						<td>聚焦时的回调函数</td>
					</tr>
					<tr>
						<td>onBlur</td>
						<td>Function</td>
						<td>-</td>
						<td>失焦时的回调函数</td>
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
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
}

.btn:hover {
	background: #3aa876;
}

.input {
	width: 100%;
	padding: 10px 14px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
}

.input:focus {
	outline: none;
	border-color: #42b883;
	box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.input-container {
	margin-top: 16px;
}

.control {
	margin-bottom: 16px;
}

.checkbox {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
}

.checkbox input {
	width: 16px;
	height: 16px;
}

.inputs {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.input-group {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.input-group label {
	font-size: 13px;
	font-weight: 500;
	color: #666;
}

.stats {
	display: flex;
	gap: 20px;
	margin-top: 12px;
	font-size: 14px;
	color: #666;
}

.stats strong {
	color: #42b883;
}

.refocus-demo {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
}

.refocus-actions {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-top: 16px;
}

.refocus-actions .hint {
	margin-top: 0;
}

.login-form {
	max-width: 300px;
}

.form-group {
	margin-bottom: 16px;
}

.form-group label {
	display: block;
	margin-bottom: 6px;
	font-size: 14px;
	font-weight: 500;
}

.api-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
	margin-top: 16px;
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
