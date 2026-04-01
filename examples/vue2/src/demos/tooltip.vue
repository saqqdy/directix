<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useTooltip } from 'directix'

export default defineComponent({
	name: 'TooltipDemo',
	setup() {
		// Composable API demo
		const composableBtnRef = ref<HTMLElement | null>(null)
		const composableContent = ref('Composable tooltip')
		const composablePlacement = ref<'top' | 'bottom' | 'left' | 'right'>('top')
		const composableDisabled = ref(false)

		const { isVisible, show, hide, bind } = useTooltip({
			content: composableContent,
			placement: composablePlacement,
			trigger: 'hover',
			disabled: composableDisabled
		})

		onMounted(() => {
			if (composableBtnRef.value) {
				bind(composableBtnRef.value)
			}
		})

		const composableCode = `import { ref, onMounted } from 'vue'
import { useTooltip } from 'directix'

const buttonRef = ref(null)
const { isVisible, show, hide, bind } = useTooltip({
  content: 'Tooltip text',
  placement: 'top',
  trigger: 'hover'
})

onMounted(() => {
  if (buttonRef.value) {
    bind(buttonRef.value)
  }
})`

		return {
			composableBtnRef,
			composableContent,
			composablePlacement,
			composableDisabled,
			isVisible,
			show,
			hide,
			composableCode
		}
	},
	data() {
		return {
			showManualTooltip: false,
		}
	},
})
</script>

<template>
	<div>
		<h2>v-tooltip</h2>
		<p class="desc">
			The v-tooltip directive creates tooltips on hover, focus, or click with customizable positioning and styling.
		</p>

		<h3>Basic Usage - Hover</h3>
		<div class="demo-row center">
			<button v-tooltip="'This is a simple tooltip'" class="btn">Hover me</button>
		</div>

		<h3>Placement</h3>
		<div class="demo-row center gap">
			<button v-tooltip="{ content: 'Top tooltip', placement: 'top' }" class="btn">Top</button>
			<button v-tooltip="{ content: 'Bottom tooltip', placement: 'bottom' }" class="btn">Bottom</button>
			<button v-tooltip="{ content: 'Left tooltip', placement: 'left' }" class="btn">Left</button>
			<button v-tooltip="{ content: 'Right tooltip', placement: 'right' }" class="btn">Right</button>
		</div>

		<h3>Trigger Types</h3>
		<div class="demo-row center gap">
			<button v-tooltip="{ content: 'Hover triggered', trigger: 'hover' }" class="btn">Hover</button>
			<button v-tooltip="{ content: 'Click triggered', trigger: 'click' }" class="btn">Click</button>
			<button v-tooltip="{ content: 'Focus triggered', trigger: 'focus' }" class="btn">Focus</button>
		</div>

		<h3>Delay</h3>
		<div class="demo-row center gap">
			<button v-tooltip="{ content: 'Show delay: 500ms', delay: 500 }" class="btn">Delay Show</button>
			<button v-tooltip="{ content: 'Hide delay: 1000ms', hideDelay: 1000 }" class="btn">Delay Hide</button>
		</div>

		<h3>Without Arrow</h3>
		<div class="demo-row center">
			<button v-tooltip="{ content: 'No arrow tooltip', arrow: false }" class="btn">No Arrow</button>
		</div>

		<h3>Manual Control</h3>
		<div class="demo-row center gap">
			<button v-tooltip="{ content: 'Manual tooltip - click button to toggle', trigger: 'manual', disabled: !showManualTooltip }" class="btn">
				Manual Tooltip
			</button>
			<button @click="showManualTooltip = !showManualTooltip" class="btn secondary">
				{{ showManualTooltip ? 'Hide' : 'Show' }} Tooltip
			</button>
		</div>

		<h3>Composable API - useTooltip</h3>
		<div class="demo-row">
			<div class="composable-controls">
				<label>
					Content:
					<input type="text" v-model="composableContent" class="text-input" />
				</label>
				<label>
					Placement:
					<select v-model="composablePlacement" class="select-input">
						<option value="top">Top</option>
						<option value="bottom">Bottom</option>
						<option value="left">Left</option>
						<option value="right">Right</option>
					</select>
				</label>
			</div>
			<div class="composable-demo">
				<button ref="composableBtnRef" class="btn">
					Hover me (Composable)
				</button>
				<span class="status">Visible: {{ isVisible }}</span>
			</div>
		</div>
		<pre class="code"><code>{{ composableCode }}</code></pre>

		<h3>Code Example</h3>
		<pre class="code"><code>&lt;!-- Basic usage --&gt;
&lt;button v-tooltip="'Tooltip text'"&gt;Hover me&lt;/button&gt;

&lt;!-- With placement --&gt;
&lt;button v-tooltip="{ content: 'Tooltip', placement: 'top' }"&gt;Top&lt;/button&gt;

&lt;!-- Different triggers --&gt;
&lt;button v-tooltip="{ content: 'Tooltip', trigger: 'click' }"&gt;Click&lt;/button&gt;

&lt;!-- With delay --&gt;
&lt;button v-tooltip="{ content: 'Tooltip', delay: 500 }"&gt;Delay&lt;/button&gt;</code></pre>
	</div>
</template>

<style scoped>
h3 {
	margin-top: 24px;
	margin-bottom: 12px;
	color: #333;
}

.desc {
	color: #666;
	margin-bottom: 20px;
}

.demo-row {
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
	margin-bottom: 16px;
	padding: 40px 20px;
	background: #f8f9fa;
	border-radius: 8px;
}

.center {
	justify-content: center;
	align-items: center;
}

.gap {
	gap: 30px;
}

.btn {
	padding: 10px 20px;
	background: #667eea;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	transition: background 0.2s;
}

.btn:hover {
	background: #5a67d8;
}

.btn.secondary {
	background: #e2e8f0;
	color: #333;
}

.btn.secondary:hover {
	background: #cbd5e0;
}

.code {
	background: #2d3748;
	color: #e2e8f0;
	padding: 16px;
	border-radius: 8px;
	overflow-x: auto;
	font-size: 14px;
	line-height: 1.6;
}

/* Composable API styles */
.composable-controls {
	display: flex;
	gap: 16px;
	align-items: center;
	margin-bottom: 16px;
	flex-wrap: wrap;
}

.composable-controls label {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	color: #333;
}

.text-input {
	padding: 6px 12px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 14px;
	width: 180px;
}

.select-input {
	padding: 6px 12px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 14px;
}

.composable-demo {
	display: flex;
	align-items: center;
	gap: 16px;
}

.status {
	font-family: monospace;
	font-size: 13px;
	color: #666;
	background: #e2e8f0;
	padding: 4px 8px;
	border-radius: 4px;
}
</style>
