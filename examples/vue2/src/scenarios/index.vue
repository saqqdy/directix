<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import FormValidation from './FormValidation.vue'
import PermissionManagement from './PermissionManagement.vue'
import ImageGallery from './ImageGallery.vue'
import InfiniteScrollList from './InfiniteScrollList.vue'
import RichTextEditor from './RichTextEditor.vue'
import GestureInteraction from './GestureInteraction.vue'
import DataVisualization from './DataVisualization.vue'
import DragSort from './DragSort.vue'
import PrintExport from './PrintExport.vue'
import FullscreenMedia from './FullscreenMedia.vue'

interface Scenario {
	id: string
	name: string
	icon: string
	component: any
}

const scenarios: Scenario[] = [
	{ id: 'form', name: '表单验证系统', icon: '📝', component: FormValidation },
	{ id: 'permission', name: '权限管理', icon: '🔐', component: PermissionManagement },
	{ id: 'gallery', name: '图片画廊', icon: '🖼️', component: ImageGallery },
	{ id: 'infinite', name: '无限滚动列表', icon: '📜', component: InfiniteScrollList },
	{ id: 'richtext', name: '富文本编辑', icon: '📄', component: RichTextEditor },
	{ id: 'gesture', name: '手势交互', icon: '👆', component: GestureInteraction },
	{ id: 'dataviz', name: '数据可视化', icon: '📊', component: DataVisualization },
	{ id: 'drag', name: '拖拽排序', icon: '🔀', component: DragSort },
	{ id: 'print', name: '打印导出', icon: '🖨️', component: PrintExport },
	{ id: 'fullscreen', name: '全屏媒体', icon: '📺', component: FullscreenMedia },
]

export default defineComponent({
	name: 'ScenariosIndex',
	setup() {
		const activeScenario = ref('form')

		const selectScenario = (id: string) => {
			activeScenario.value = id
		}

		const activeComponent = computed(() => {
			return scenarios.find(s => s.id === activeScenario.value)?.component
		})

		return {
			scenarios,
			activeScenario,
			selectScenario,
			activeComponent,
		}
	},
})
</script>

<template>
	<div class="scenarios-page">
		<header class="page-header">
			<h1>实际应用场景示例</h1>
			<p>展示 Directix 指令在实际项目中的综合应用</p>
		</header>

		<nav class="scenario-nav">
			<button
				v-for="scenario in scenarios"
				:key="scenario.id"
				:class="['nav-item', { active: activeScenario === scenario.id }]"
				@click="selectScenario(scenario.id)"
			>
				<span class="nav-icon">{{ scenario.icon }}</span>
				<span class="nav-name">{{ scenario.name }}</span>
			</button>
		</nav>

		<div class="scenario-content">
			<component :is="activeComponent" />
		</div>
	</div>
</template>

<style scoped>
.scenarios-page {
	padding: 20px;
	max-width: 900px;
}

.page-header {
	margin-bottom: 24px;
}

.page-header h1 {
	color: #42b883;
	margin-bottom: 8px;
}

.page-header p {
	color: #666;
}

.scenario-nav {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	margin-bottom: 24px;
	padding-bottom: 16px;
	border-bottom: 1px solid #eee;
}

.nav-item {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 8px 12px;
	background: #f5f5f5;
	border: 1px solid #eee;
	border-radius: 6px;
	cursor: pointer;
	font-size: 13px;
}

.nav-item.active {
	background: #42b883;
	color: white;
	border-color: #42b883;
}

.nav-icon {
	font-size: 16px;
}

.scenario-content {
	background: #fff;
	border-radius: 12px;
	border: 1px solid #eee;
}
</style>