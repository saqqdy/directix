<script setup lang="ts">
defineProps<{
	code: string
}>()
</script>

<template>
	<div class="code-block">
		<pre><code>{{ code }}</code></pre>
	</div>
</template>

<style scoped>
.code-block {
	background: #1e1e1e;
	border-radius: 8px;
	padding: 16px;
	margin: 12px 0;
	overflow-x: auto;
}

.code-block pre {
	margin: 0;
}

.code-block code {
	font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
	font-size: 13px;
	color: #d4d4d4;
	line-height: 1.6;
}
</style>
