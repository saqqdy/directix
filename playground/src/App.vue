<script setup lang="ts">
import { ref, computed } from 'vue'
import DirectiveSelector from './components/DirectiveSelector.vue'
import ConfigPanel from './components/ConfigPanel.vue'
import CodePreview from './components/CodePreview.vue'
import type { DirectiveConfig, PlayroundState } from './types'

const playgroundState = ref<PlayroundState>({
  selectedDirective: null,
  parameterValues: {},
  vueVersion: 'vue3',
  outputFormat: 'template'
})

const selectedDirectiveConfig = ref<DirectiveConfig | null>(null)

function handleDirectiveSelect(config: DirectiveConfig) {
  selectedDirectiveConfig.value = config
  playgroundState.value.selectedDirective = config.name

  // Initialize with default values
  const defaults: Record<string, any> = {}
  for (const param of config.parameters) {
    if (param.default !== undefined) {
      defaults[param.name] = param.default
    }
  }
  playgroundState.value.parameterValues = defaults
}

function handleValuesChange(values: Record<string, any>) {
  playgroundState.value.parameterValues = values
}

function handleVueVersionChange(version: 'vue2' | 'vue3') {
  playgroundState.value.vueVersion = version
}

function handleExport() {
  // Export current configuration
  console.log('Export:', {
    directive: selectedDirectiveConfig.value,
    values: playgroundState.value.parameterValues,
    vueVersion: playgroundState.value.vueVersion
  })
}

function handleShare() {
  // Generate shareable URL
  const config = btoa(JSON.stringify({
    directive: playgroundState.value.selectedDirective,
    values: playgroundState.value.parameterValues,
    vueVersion: playgroundState.value.vueVersion
  }))

  const shareUrl = `${window.location.origin}?config=${config}`
  navigator.clipboard.writeText(shareUrl)
  alert('Share link copied to clipboard!')
}
</script>

<template>
	<div class="playground">
		<header class="playground-header">
			<h1>
				<svg width="32" height="32" viewBox="0 0 128 128" fill="none">
					<path d="M64 8L8 40v48l56 32 56-32V40L64 8z" fill="#42b883"/>
					<path d="M64 24L24 48v32l40 24 40-24V48L64 24z" fill="#35495e"/>
					<path d="M64 40L40 56v16l24 16 24-16V56L64 40z" fill="#42b883"/>
				</svg>
				Directix Playground
			</h1>
			<div class="header-actions">
				<div class="vue-version-toggle">
					<button
						:class="{ active: playgroundState.vueVersion === 'vue2' }"
						@click="handleVueVersionChange('vue2')"
					>
						Vue 2
					</button>
					<button
						:class="{ active: playgroundState.vueVersion === 'vue3' }"
						@click="handleVueVersionChange('vue3')"
					>
						Vue 3
					</button>
				</div>
				<button class="btn-secondary" @click="handleShare">Share</button>
				<button class="btn-primary" @click="handleExport">Export</button>
			</div>
		</header>

		<DirectiveSelector
			:selected="playgroundState.selectedDirective"
			@select="handleDirectiveSelect"
		/>

		<main class="main-content">
			<div class="tabs">
				<div class="tab active">Generated Code</div>
				<div class="tab">Live Preview</div>
				<div class="tab">Documentation</div>
			</div>

			<CodePreview
				v-if="selectedDirectiveConfig"
				:directive="selectedDirectiveConfig"
				:values="playgroundState.parameterValues"
				:vue-version="playgroundState.vueVersion"
			/>

			<div v-else class="empty-state">
				<h3>Select a Directive</h3>
				<p>Choose a directive from the sidebar to configure and generate code</p>
			</div>
		</main>

		<ConfigPanel
			v-if="selectedDirectiveConfig"
			:directive="selectedDirectiveConfig"
			:values="playgroundState.parameterValues"
			@update:values="handleValuesChange"
		/>
	</div>
</template>
