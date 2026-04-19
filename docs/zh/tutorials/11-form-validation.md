# 11 - 构建表单验证系统

**时长：15 分钟**

## 视频信息

- 标题：构建表单验证系统
- 系列：实战系列
- 难度：中级
- 前置知识：Vue 表单基础、Composables

## 章节目录

1. 需求分析与设计（2 分钟）
2. 表单结构搭建（3 分钟）
3. 实时验证实现（4 分钟）
4. 提交处理与反馈（3 分钟）
5. 优化与扩展（3 分钟）

## 详细脚本

### 开场（0:00-0:15）

今天我们通过一个实际案例，演示如何使用 Directix 构建一个完整的表单验证系统。

### 第一章：需求分析与设计（0:15-2:15）

> **画面：展示表单原型**

我们要创建一个用户注册表单，包含：
- 姓名（必填，首字母大写）
- 邮箱（必填，格式验证）
- 手机号（格式化显示，验证）
- 密码（强度验证）
- 确认密码（匹配验证）
- 提交按钮（防抖、节流）

使用到的指令：
- `v-trim` - 去除空格
- `v-capitalcase` - 首字母大写
- `v-lowercase` - 邮箱小写
- `v-mask` - 手机号格式化
- `v-debounce` - 实时验证防抖
- `v-throttle` - 提交节流
- `v-focus` - 错误字段聚焦

### 第二章：表单结构搭建（2:15-5:15）

> **画面：VS Code 演示**

```vue
<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <!-- 姓名 -->
    <div class="form-group">
      <label>姓名</label>
      <input
        v-model="form.name"
        v-trim
        v-capitalcase
        v-debounce:300="validateName"
        :class="{ error: errors.name }"
        placeholder="请输入姓名"
      />
      <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
    </div>

    <!-- 邮箱 -->
    <div class="form-group">
      <label>邮箱</label>
      <input
        v-model="form.email"
        v-trim
        v-lowercase
        v-debounce:300="validateEmail"
        type="email"
        :class="{ error: errors.email }"
        placeholder="请输入邮箱"
      />
      <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
    </div>

    <!-- 手机号 -->
    <div class="form-group">
      <label>手机号</label>
      <input
        v-model="form.phone"
        v-mask="'### #### ####'"
        v-debounce:300="validatePhone"
        :class="{ error: errors.phone }"
        placeholder="请输入手机号"
      />
      <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
    </div>

    <!-- 密码 -->
    <div class="form-group">
      <label>密码</label>
      <input
        v-model="form.password"
        v-debounce:300="validatePassword"
        type="password"
        :class="{ error: errors.password }"
        placeholder="请输入密码"
      />
      <div class="password-strength">
        <div :class="['bar', strength]"></div>
        <span>{{ strengthText }}</span>
      </div>
    </div>

    <!-- 确认密码 -->
    <div class="form-group">
      <label>确认密码</label>
      <input
        v-model="form.confirmPassword"
        v-debounce:300="validateConfirmPassword"
        type="password"
        :class="{ error: errors.confirmPassword }"
        placeholder="请再次输入密码"
      />
      <span v-if="errors.confirmPassword" class="error-msg">
        {{ errors.confirmPassword }}
      </span>
    </div>

    <!-- 提交按钮 -->
    <button
      type="submit"
      v-throttle:1000="handleSubmit"
      :disabled="!isFormValid || submitting"
    >
      {{ submitting ? '提交中...' : '注册' }}
    </button>
  </form>
</template>
```

### 第三章：实时验证实现（5:15-9:15）

> **画面：展示验证逻辑**

```vue
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDebounce } from 'directix'

// 表单数据
const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

// 错误信息
const errors = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

// 验证规则
const validators = {
  name: (value) => {
    if (!value) return '请输入姓名'
    if (value.length < 2) return '姓名至少2个字符'
    return ''
  },

  email: (value) => {
    if (!value) return '请输入邮箱'
    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(value)) return '邮箱格式不正确'
    return ''
  },

  phone: (value) => {
    const cleaned = value.replace(/\s/g, '')
    if (!cleaned) return '请输入手机号'
    if (!/^1[3-9]\d{9}$/.test(cleaned)) return '手机号格式不正确'
    return ''
  },

  password: (value) => {
    if (!value) return '请输入密码'
    if (value.length < 8) return '密码至少8位'
    if (!/[A-Z]/.test(value)) return '需包含大写字母'
    if (!/[0-9]/.test(value)) return '需包含数字'
    return ''
  },

  confirmPassword: (value) => {
    if (!value) return '请确认密码'
    if (value !== form.password) return '两次密码不一致'
    return ''
  }
}

// 验证函数
const validateName = () => { errors.name = validators.name(form.name) }
const validateEmail = () => { errors.email = validators.email(form.email) }
const validatePhone = () => { errors.phone = validators.phone(form.phone) }
const validatePassword = () => {
  errors.password = validators.password(form.password)
  updateStrength()
}
const validateConfirmPassword = () => {
  errors.confirmPassword = validators.confirmPassword(form.confirmPassword)
}

// 密码强度
const strength = ref('weak')
const strengthText = computed(() => {
  const map = { weak: '弱', medium: '中', strong: '强' }
  return map[strength.value]
})

const updateStrength = () => {
  const pwd = form.password
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  strength.value = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong'
}

// 表单是否有效
const isFormValid = computed(() => {
  return Object.values(errors).every(e => e === '')
    && Object.values(form).every(v => v !== '')
})

const submitting = ref(false)
</script>
```

### 第四章：提交处理与反馈（9:15-12:15）

> **画面：展示提交逻辑**

```vue
<script setup>
// ... 之前的代码

// 全局验证
const validateAll = () => {
  validateName()
  validateEmail()
  validatePhone()
  validatePassword()
  validateConfirmPassword()
  return isFormValid.value
}

// 聚焦到第一个错误字段
const focusFirstError = () => {
  const firstError = Object.keys(errors).find(key => errors[key])
  if (firstError) {
    const input = document.querySelector(`[v-model="form.${firstError}"]`)
    if (input) input.focus()
  }
}

// 提交处理
const handleSubmit = async () => {
  if (!validateAll()) {
    focusFirstError()
    return
  }

  submitting.value = true

  try {
    // 清理手机号空格
    const data = {
      ...form,
      phone: form.phone.replace(/\s/g, '')
    }

    await api.register(data)
    showToast('注册成功！')
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    showToast(error.message || '注册失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>
```

### 第五章：优化与扩展（12:15-15:00）

> **画面：展示优化代码**

**1. 使用 useDebounce 优化：**

```vue
<script setup>
import { useDebounce } from 'directix'

// 将验证函数转为防抖函数
const debouncedValidateName = useDebounce(validateName, 300)
</script>

<template>
  <input @input="debouncedValidateName" />
</template>
```

**2. 添加实时保存：**

```vue
<script setup>
import { useDebounce } from 'directix'

// 自动保存草稿
const { debouncedValue } = useDebounce(form, 1000)

watch(debouncedValue, () => {
  localStorage.setItem('register-draft', JSON.stringify(form))
})
</script>
```

**3. 添加复制功能：**

```vue
<template>
  <div class="form-group">
    <label>邀请码</label>
    <div class="input-group">
      <input v-model="inviteCode" readonly />
      <button v-copy="inviteCode">复制</button>
    </div>
  </div>
</template>
```

### 总结

今天我们完成了一个完整的表单验证系统：
- 使用多个指令组合实现功能
- 实时验证与错误提示
- 密码强度检测
- 提交节流防重复
- 用户体验优化

下集我们实现无限滚动列表。

## 练习题

1. 为表单添加验证码输入框，使用 v-mask 格式化
2. 实现表单数据本地存储，刷新后恢复
3. 添加提交成功的动画效果

## 完整代码

[GitHub - examples/vue3](https://github.com/saqqdy/directix/tree/master/examples/vue3)