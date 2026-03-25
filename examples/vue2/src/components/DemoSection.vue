<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			default: ''
		}
	}
})
</script>

<template>
	<section class="demo-section">
		<h2 class="section-title">{{ title }}</h2>
		<p v-if="description" class="section-desc">{{ description }}</p>
		<slot />
	</section>
</template>

<style scoped>
.demo-section {
	margin-bottom: 32px;
}

.section-title {
	font-size: 1.25rem;
	color: #333;
	margin-bottom: 8px;
	padding-bottom: 8px;
	border-bottom: 2px solid #eee;
}

.section-desc {
	color: #666;
	font-size: 14px;
	margin-bottom: 16px;
}
</style>
