<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

// 表单验证场景 - v-debounce, v-mask, v-trim, v-focus

export default defineComponent({
	name: 'FormValidation',
	setup() {
		const form = ref({
			username: '',
			phone: '',
			email: '',
			amount: '',
			password: '',
		})

		const errors = ref<Record<string, string>>({})

		// 验证规则
		const validators: Record<string, (v: string) => string> = {
			username: (v: string) => v.length >= 3 ? '' : '用户名至少3个字符',
			phone: (v: string) => /^\d{11}$/.test(v) ? '' : '请输入有效的手机号',
			email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : '请输入有效的邮箱',
			amount: (v: string) => parseFloat(v) > 0 ? '' : '金额必须大于0',
			password: (v: string) => v.length >= 6 ? '' : '密码至少6个字符',
		}

		// 防抖验证
		const validateField = (field: string, value: string) => {
			errors.value[field] = validators[field]?.(value) || ''
		}

		// 表单提交
		const handleSubmit = () => {
			Object.entries(form.value).forEach(([field, value]) => {
				validateField(field, value)
			})

			const hasErrors = Object.values(errors.value).some(e => e)
			if (hasErrors) {
				console.warn('表单验证失败')
				return
			}

			console.log('提交表单:', form.value)
			alert('表单提交成功！')
		}

		// 重置表单
		const resetForm = () => {
			form.value = {
				username: '',
				phone: '',
				email: '',
				amount: '',
				password: '',
			}
			errors.value = {}
		}

		// 计算属性
		const isValid = computed(() => {
			return Object.values(form.value).every(v => v) &&
				Object.values(errors.value).every(e => !e)
		})

		return {
			form,
			errors,
			validateField,
			handleSubmit,
			resetForm,
			isValid,
		}
	},
})
</script>

<template>
	<div class="scenario-container">
		<h2>表单验证系统</h2>
		<p class="description">结合 v-debounce、v-mask、v-trim、v-focus 实现完整的表单验证方案</p>

		<div class="demo-section">
			<form class="form-container" @submit.prevent="handleSubmit">
				<!-- 用户名输入 -->
				<div class="form-group">
					<label>用户名</label>
					<div class="input-wrapper">
						<input
							v-model.trim="form.username"
							v-debounce:500ms="{ handler: () => validateField('username', form.username), wait: 500 }"
							v-focus
							type="text"
							placeholder="请输入用户名"
							class="form-input"
							:class="{ error: errors.username }"
						/>
						<span v-if="errors.username" class="error-text">{{ errors.username }}</span>
					</div>
					<small class="hint">v-debounce 防抖验证 + v-trim 自动去空格 + v-focus 自动聚焦</small>
				</div>

				<!-- 手机号输入 -->
				<div class="form-group">
					<label>手机号</label>
					<div class="input-wrapper">
						<input
							v-model="form.phone"
							v-mask="{ mask: '###########', placeholder: '_' }"
							type="text"
							placeholder="请输入手机号"
							class="form-input"
							:class="{ error: errors.phone }"
						/>
						<span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
					</div>
					<small class="hint">v-mask 输入掩码限制格式</small>
				</div>

				<!-- 邮箱输入 -->
				<div class="form-group">
					<label>邮箱</label>
					<div class="input-wrapper">
						<input
							v-model.trim="form.email"
							v-debounce="{ handler: () => validateField('email', form.email), wait: 300 }"
							type="email"
							placeholder="请输入邮箱"
							class="form-input"
							:class="{ error: errors.email }"
						/>
						<span v-if="errors.email" class="error-text">{{ errors.email }}</span>
					</div>
					<small class="hint">v-debounce 实时验证</small>
				</div>

				<!-- 金额输入 -->
				<div class="form-group">
					<label>金额</label>
					<div class="input-wrapper">
						<input
							v-model="form.amount"
							v-money="{ currency: '¥', precision: 2 }"
							type="text"
							placeholder="请输入金额"
							class="form-input"
							:class="{ error: errors.amount }"
						/>
						<span v-if="errors.amount" class="error-text">{{ errors.amount }}</span>
					</div>
					<small class="hint">v-money 格式化金额输入</small>
				</div>

				<!-- 密码输入 -->
				<div class="form-group">
					<label>密码</label>
					<div class="input-wrapper">
						<input
							v-model.trim="form.password"
							v-debounce:300="{ handler: () => validateField('password', form.password) }"
							type="password"
							placeholder="请输入密码"
							class="form-input"
							:class="{ error: errors.password }"
						/>
						<span v-if="errors.password" class="error-text">{{ errors.password }}</span>
					</div>
					<small class="hint">v-trim 自动去空格 + v-debounce 验证</small>
				</div>

				<!-- 操作按钮 -->
				<div class="form-actions">
					<button
						type="submit"
						class="btn-primary"
						:disabled="!isValid"
					>
						提交表单
					</button>
					<button
						type="button"
						class="btn-secondary"
						@click="resetForm"
					>
						重置
					</button>
				</div>
			</form>
		</div>

		<div class="code-section">
			<h3>使用的指令</h3>
			<ul>
				<li><strong>v-debounce</strong> - 防抖验证，避免频繁触发</li>
				<li><strong>v-mask</strong> - 输入掩码，限制输入格式</li>
				<li><strong>v-trim</strong> - 自动去除首尾空格</li>
				<li><strong>v-focus</strong> - 自动聚焦到输入框</li>
				<li><strong>v-money</strong> - 格式化金额输入</li>
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

.form-container {
	background: #f9f9f9;
	padding: 20px;
	border-radius: 8px;
	border: 1px solid #eee;
}

.form-group {
	margin-bottom: 16px;
}

.form-group label {
	display: block;
	font-weight: 500;
	margin-bottom: 8px;
	color: #333;
}

.input-wrapper {
	position: relative;
}

.form-input {
	width: 100%;
	padding: 10px 12px;
	border: 2px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
	transition: border-color 0.2s;
}

.form-input:focus {
	border-color: #42b883;
	outline: none;
}

.form-input.error {
	border-color: #f56c6c;
}

.error-text {
	color: #f56c6c;
	font-size: 12px;
	margin-top: 4px;
	display: block;
}

.hint {
	color: #999;
	font-size: 11px;
	margin-top: 4px;
	display: block;
}

.form-actions {
	display: flex;
	gap: 12px;
	margin-top: 20px;
}

.btn-primary {
	padding: 10px 20px;
	background: #42b883;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 500;
}

.btn-primary:disabled {
	background: #ccc;
	cursor: not-allowed;
}

.btn-secondary {
	padding: 10px 20px;
	background: #f5f5f5;
	color: #666;
	border: 1px solid #ddd;
	border-radius: 6px;
	cursor: pointer;
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
