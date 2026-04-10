<script setup lang="ts">
import { computed, watch } from 'vue'
import type { DirectiveConfig, DirectiveParameter } from '../types'

const props = defineProps<{
  directive: DirectiveConfig
  values: Record<string, any>
}>()

const emit = defineEmits<{
  'update:values': [values: Record<string, any>]
}>()

const localValues = computed({
  get: () => props.values,
  set: (newValues) => emit('update:values', newValues)
})

function updateValue(name: string, value: any) {
  emit('update:values', {
    ...props.values,
    [name]: value
  })
}

function getInputType(param: DirectiveParameter): string {
  switch (param.type) {
    case 'number':
      return 'number'
    case 'boolean':
      return 'checkbox'
    case 'string':
    default:
      return 'text'
  }
}

function getDefaultForType(param: DirectiveParameter): any {
  if (param.default !== undefined) return param.default

  switch (param.type) {
    case 'string':
      return ''
    case 'number':
      return param.min || 0
    case 'boolean':
      return false
    case 'array':
      return []
    case 'object':
      return {}
    default:
      return null
  }
}

function getExampleValue(param: DirectiveParameter): string {
  switch (param.type) {
    case 'string':
      return `'${param.name}'`
    case 'number':
      return String(param.default || 100)
    case 'boolean':
      return String(param.default || true)
    case 'function':
      return `(${param.name}Handler)`
    case 'array':
      return '[]'
    case 'object':
      return '{}'
    default:
      return ''
  }
}

function resetToDefaults() {
  const defaults: Record<string, any> = {}
  for (const param of props.directive.parameters) {
    defaults[param.name] = param.default !== undefined ? param.default : getDefaultForType(param)
  }
  emit('update:values', defaults)
}
</script>

<template>
	<aside class="config-panel">
		<div class="config-panel-header">
			<h2>{{ directive.displayName }}</h2>
			<p>{{ directive.description }}</p>
		</div>

		<div class="config-form">
			<div
				v-for="param in directive.parameters"
				:key="param.name"
				class="config-field"
			>
				<label :for="param.name">
					{{ param.name }}
					<span v-if="param.required" style="color: var(--error-color)">*</span>
				</label>
				<div class="description">{{ param.description }}</div>

				<!-- String input -->
				<input
					v-if="param.type === 'string'"
					:id="param.name"
					type="text"
					:value="values[param.name] ?? param.default ?? ''"
					:placeholder="getExampleValue(param)"
					@input="updateValue(param.name, ($event.target as HTMLInputElement).value)"
				/>

				<!-- Number input with optional range -->
				<div v-else-if="param.type === 'number'" class="range-input">
					<input
						v-if="param.min !== undefined && param.max !== undefined"
						:id="param.name"
						type="range"
						:min="param.min"
						:max="param.max"
						:step="param.step || 1"
						:value="values[param.name] ?? param.default ?? param.min"
						@input="updateValue(param.name, Number(($event.target as HTMLInputElement).value))"
					/>
					<input
						v-else
						:id="param.name"
						type="number"
						:step="param.step"
						:value="values[param.name] ?? param.default ?? 0"
						@input="updateValue(param.name, Number(($event.target as HTMLInputElement).value))"
					/>
					<span class="value">{{ values[param.name] ?? param.default ?? 0 }}</span>
				</div>

				<!-- Boolean checkbox -->
				<label v-else-if="param.type === 'boolean'" class="checkbox-label">
					<input
						:id="param.name"
						type="checkbox"
						:checked="values[param.name] ?? param.default ?? false"
						@change="updateValue(param.name, ($event.target as HTMLInputElement).checked)"
					/>
					<span>{{ param.name }}</span>
				</label>

				<!-- Select dropdown -->
				<select
					v-else-if="param.type === 'select'"
					:id="param.name"
					:value="values[param.name] ?? param.default"
					@change="updateValue(param.name, ($event.target as HTMLSelectElement).value)"
				>
					<option
						v-for="option in param.options"
						:key="option.value"
						:value="option.value"
					>
						{{ option.label }}
					</option>
				</select>

				<!-- Function handler -->
				<div v-else-if="param.type === 'function'" class="function-input">
					<code>{{ param.name }}Handler</code>
					<small>Function will be generated in code</small>
				</div>

				<!-- Array input -->
				<textarea
					v-else-if="param.type === 'array'"
					:id="param.name"
					rows="2"
					:value="JSON.stringify(values[param.name] ?? param.default ?? [])"
					@input="updateValue(param.name, JSON.parse(($event.target as HTMLTextAreaElement).value))"
				/>

				<!-- Object input -->
				<textarea
					v-else-if="param.type === 'object'"
					:id="param.name"
					rows="3"
					:value="JSON.stringify(values[param.name] ?? param.default ?? {})"
					@input="updateValue(param.name, JSON.parse(($event.target as HTMLTextAreaElement).value))"
				/>

				<!-- Default text input -->
				<input
					v-else
					:id="param.name"
					type="text"
					:value="values[param.name] ?? param.default ?? ''"
					@input="updateValue(param.name, ($event.target as HTMLInputElement).value)"
				/>
			</div>

			<button class="generate-btn" @click="resetToDefaults">
				Reset to Defaults
			</button>
		</div>
	</aside>
</template>

<style scoped>
.function-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background: var(--code-bg);
  border-radius: 6px;
}

.function-input code {
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 13px;
  color: var(--primary-color);
}

.function-input small {
  font-size: 11px;
  color: var(--text-secondary);
}
</style>
