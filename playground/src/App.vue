<script setup lang="ts">
import { ref, computed } from 'vue'
import DirectiveSelector from './components/DirectiveSelector.vue'
import ConfigPanel from './components/ConfigPanel.vue'
import CodePreview from './components/CodePreview.vue'
import type { DirectiveConfig, PlayroundState } from './types'

type MainTab = 'code' | 'preview' | 'docs'

const activeTab = ref<MainTab>('code')

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
				<button class="btn-secondary" @click="handleShare" title="Share configuration">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="18" cy="5" r="3"></circle>
						<circle cx="6" cy="12" r="3"></circle>
						<circle cx="18" cy="19" r="3"></circle>
						<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
						<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
					</svg>
					Share
				</button>
				<button class="btn-primary" @click="handleExport" title="Export configuration">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					Export
				</button>
			</div>
		</header>

		<DirectiveSelector
			:selected="playgroundState.selectedDirective"
			@select="handleDirectiveSelect"
		/>

		<main class="main-content">
			<div class="tabs">
				<div
					class="tab"
					:class="{ active: activeTab === 'code' }"
					@click="activeTab = 'code'"
				>
					Generated Code
				</div>
				<div
					class="tab"
					:class="{ active: activeTab === 'preview' }"
					@click="activeTab = 'preview'"
				>
					Live Preview
				</div>
				<div
					class="tab"
					:class="{ active: activeTab === 'docs' }"
					@click="activeTab = 'docs'"
				>
					Documentation
				</div>
			</div>

			<CodePreview
				v-if="selectedDirectiveConfig"
				:directive="selectedDirectiveConfig"
				:values="playgroundState.parameterValues"
				:vue-version="playgroundState.vueVersion"
				:mode="activeTab"
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
