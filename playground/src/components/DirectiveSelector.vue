<script setup lang="ts">
import { ref, computed } from 'vue'
import { directiveConfigs, directiveCategories, getDirectivesByCategory } from '../utils/directive-configs'
import type { DirectiveConfig } from '../types'

const props = defineProps<{
  selected: string | null
}>()

const emit = defineEmits<{
  select: [config: DirectiveConfig]
}>()

const searchQuery = ref('')

const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return directiveCategories
  }

  const query = searchQuery.value.toLowerCase()
  return directiveCategories.filter(category => {
    const directives = getDirectivesByCategory(category.name)
    return directives.some(d =>
      d.name.includes(query) ||
      d.displayName.includes(query) ||
      d.description.toLowerCase().includes(query)
    )
  })
})

function getDirectives(categoryName: string): DirectiveConfig[] {
  let directives = getDirectivesByCategory(categoryName)

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    directives = directives.filter(d =>
      d.name.includes(query) ||
      d.displayName.includes(query) ||
      d.description.toLowerCase().includes(query)
    )
  }

  return directives
}
</script>

<template>
	<aside class="directive-list">
		<div class="directive-list-header">
			<input
				v-model="searchQuery"
				type="text"
				placeholder="Search directives..."
			/>
		</div>

		<div
			v-for="category in filteredCategories"
			:key="category.name"
			class="directive-category"
		>
			<div class="directive-category-title">{{ category.name }}</div>

			<div
				v-for="directive in getDirectives(category.name)"
				:key="directive.name"
				class="directive-item" :class="[{ active: selected === directive.name }]"
				@click="emit('select', directive)"
			>
				<code>{{ directive.displayName }}</code>
				<span v-if="!directive.supportsVue2">Vue 3</span>
				<span v-else-if="!directive.supportsVue3">Vue 2</span>
			</div>
		</div>

		<div v-if="filteredCategories.length === 0" class="empty-state">
			<p>No directives found</p>
		</div>
	</aside>
</template>
