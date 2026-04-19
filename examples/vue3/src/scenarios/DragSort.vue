<script setup lang="ts">
import { ref } from 'vue'

// 拖拽排序场景 - v-draggable, v-intersect

interface SortItem {
	id: number
	title: string
	description: string
	color: string
}

interface IntersectEntry {
	isIntersecting: boolean
}

const items = ref<SortItem[]>([
	{ id: 1, title: '任务 A', description: '完成首页设计', color: '#42b883' },
	{ id: 2, title: '任务 B', description: '开发用户模块', color: '#35495e' },
	{ id: 3, title: '任务 C', description: '编写单元测试', color: '#ff6b6b' },
	{ id: 4, title: '任务 D', description: '优化性能瓶颈', color: '#4ecdc4' },
	{ id: 5, title: '任务 E', description: '文档更新', color: '#45b7d1' },
	{ id: 6, title: '任务 F', description: '代码审查', color: '#f9ca24' },
])

const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const visibleItems = ref(new Set<number>())

// 列表排序拖拽
const onDragStart = (e: DragEvent, index: number) => {
	draggedIndex.value = index
	if (e.dataTransfer) {
		e.dataTransfer.effectAllowed = 'move'
		e.dataTransfer.setData('text/plain', String(index))
	}
}

const onDragOver = (e: DragEvent, index: number) => {
	e.preventDefault()
	if (draggedIndex.value === null || draggedIndex.value === index) return
	dragOverIndex.value = index
}

const onDragLeave = () => {
	dragOverIndex.value = null
}

const onDrop = (e: DragEvent, targetIndex: number) => {
	e.preventDefault()
	if (draggedIndex.value === null || draggedIndex.value === targetIndex) return

	const newItems = [...items.value]
	const draggedItem = newItems[draggedIndex.value]
	newItems.splice(draggedIndex.value, 1)
	newItems.splice(targetIndex, 0, draggedItem)
	items.value = newItems

	draggedIndex.value = null
	dragOverIndex.value = null
}

const onDragEnd = () => {
	draggedIndex.value = null
	dragOverIndex.value = null
}

// 可见性检测
const onIntersect = (index: number, isIntersecting: boolean) => {
	if (isIntersecting) {
		visibleItems.value.add(index)
	} else {
		visibleItems.value.delete(index)
	}
}

const handleIntersect = (index: number) => (entry: IntersectEntry) => {
	onIntersect(index, entry.isIntersecting)
}

// 自由拖拽卡片位置
const cardPositions = ref<Record<number, { x: number; y: number }>>({
	1: { x: 20, y: 20 },
	2: { x: 180, y: 60 },
	3: { x: 100, y: 120 },
})

const updateCardPosition = (id: number, pos: { x: number; y: number }) => {
	cardPositions.value[id] = pos
}
</script>

<template>
	<div class="scenario-container">
		<h2>拖拽排序</h2>
		<p class="description">结合原生拖拽 API、v-draggable、v-intersect 实现多种拖拽交互</p>

		<!-- 拖拽排序列表 -->
		<div class="demo-section">
			<h3>📋 列表拖拽排序</h3>
			<p class="hint">拖动任务卡片可调整顺序</p>
			<div class="drag-list">
				<div
					v-for="(item, index) in items"
					:key="item.id"
					draggable="true"
					v-intersect="{
						threshold: 0.5,
						handler: handleIntersect(index),
					}"
					class="drag-item"
					:class="{
						dragging: draggedIndex === index,
						'drag-over': dragOverIndex === index,
						'drag-over-top': dragOverIndex === index && draggedIndex !== null && draggedIndex > index,
						'drag-over-bottom': dragOverIndex === index && draggedIndex !== null && draggedIndex < index,
					}"
					@dragstart="onDragStart($event, index)"
					@dragover="onDragOver($event, index)"
					@dragleave="onDragLeave"
					@drop="onDrop($event, index)"
					@dragend="onDragEnd"
				>
					<div class="drag-handle" :style="{ background: item.color }">
						<span>⋮⋮</span>
					</div>
					<div class="item-content">
						<span class="item-title">{{ item.title }}</span>
						<span class="item-desc">{{ item.description }}</span>
					</div>
					<span class="item-index">{{ index + 1 }}</span>
				</div>
			</div>
		</div>

		<!-- 可见性指示 -->
		<div class="demo-section">
			<h3>👁 可见性检测</h3>
			<p class="hint">滚动上方列表，可见项会被高亮标记</p>
			<div class="visibility-status">
				<span
					v-for="i in items.length"
					:key="i"
					class="status-dot"
					:class="{ active: visibleItems.has(i - 1) }"
				>
					{{ i }}
				</span>
			</div>
		</div>

		<!-- 自由拖拽卡片 -->
		<div class="demo-section">
			<h3>🎴 自由拖拽卡片（v-draggable）</h3>
			<p class="hint">在区域内自由拖动卡片位置</p>
			<div class="card-grid">
				<div
					v-for="item in items.slice(0, 3)"
					:key="'card-' + item.id"
					v-draggable="{
						constrain: true,
						onDrag: (pos) => updateCardPosition(item.id, pos),
					}"
					class="draggable-card"
					:style="{
						background: item.color,
						transform: `translate(${cardPositions[item.id]?.x || 0}px, ${cardPositions[item.id]?.y || 0}px)`,
					}"
				>
					<span class="card-title">{{ item.title }}</span>
				</div>
			</div>
		</div>

		<div class="code-section">
			<h3>使用的指令</h3>
			<ul>
				<li><strong>原生 draggable</strong> - HTML5 拖拽 API 实现列表排序</li>
				<li><strong>v-draggable</strong> - 自由拖拽移动元素</li>
				<li><strong>v-intersect</strong> - 检测元素可见性</li>
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

.demo-section {
	margin-bottom: 24px;
}

.demo-section h3 {
	font-size: 14px;
	margin-bottom: 8px;
	color: #333;
}

.hint {
	font-size: 12px;
	color: #999;
	margin-bottom: 12px;
}

.drag-list {
	background: #f5f7fa;
	border-radius: 12px;
	padding: 12px;
	max-height: 320px;
	overflow-y: auto;
}

.drag-item {
	display: flex;
	align-items: center;
	padding: 12px;
	background: white;
	border-radius: 10px;
	margin-bottom: 8px;
	border: 2px solid transparent;
	cursor: grab;
	transition: all 0.2s ease;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.drag-item:last-child {
	margin-bottom: 0;
}

.drag-item:hover {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	transform: translateY(-1px);
}

.drag-item.dragging {
	opacity: 0.5;
	transform: scale(0.98);
	cursor: grabbing;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.drag-item.drag-over {
	border-color: #42b883;
	background: #f0faf6;
}

.drag-item.drag-over-top {
	border-top-color: #42b883;
	border-top-width: 3px;
}

.drag-item.drag-over-bottom {
	border-bottom-color: #42b883;
	border-bottom-width: 3px;
}

.drag-handle {
	width: 32px;
	height: 32px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12px;
	color: white;
	font-size: 14px;
	font-weight: bold;
	flex-shrink: 0;
}

.item-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.item-title {
	font-size: 14px;
	font-weight: 600;
	color: #333;
}

.item-desc {
	font-size: 12px;
	color: #888;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.item-index {
	width: 24px;
	height: 24px;
	background: #f0f0f0;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 11px;
	font-weight: 600;
	color: #666;
	flex-shrink: 0;
}

.visibility-status {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.status-dot {
	width: 36px;
	height: 36px;
	background: #e8e8e8;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 13px;
	font-weight: 600;
	color: #999;
	transition: all 0.3s ease;
}

.status-dot.active {
	background: #42b883;
	color: white;
	transform: scale(1.1);
	box-shadow: 0 2px 8px rgba(66, 184, 131, 0.4);
}

.card-grid {
	height: 220px;
	background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
	border-radius: 12px;
	position: relative;
	overflow: hidden;
	border: 2px dashed #ddd;
}

.draggable-card {
	position: absolute;
	padding: 16px 24px;
	border-radius: 12px;
	color: white;
	font-weight: 600;
	cursor: grab;
	user-select: none;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	transition: box-shadow 0.2s;
}

.draggable-card:hover {
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.draggable-card:nth-child(1) {
	top: 20px;
	left: 20px;
}

.draggable-card:nth-child(2) {
	top: 50px;
	left: 180px;
}

.draggable-card:nth-child(3) {
	top: 110px;
	left: 90px;
}

.card-title {
	font-size: 14px;
}

.code-section {
	margin-top: 20px;
	padding: 16px;
	background: #fff;
	border-radius: 10px;
	border: 1px solid #eee;
}

.code-section h3 {
	font-size: 14px;
	margin-bottom: 12px;
	color: #333;
}

.code-section ul {
	list-style: none;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.code-section li {
	padding: 8px 12px;
	background: #f8f9fa;
	border-radius: 6px;
	font-size: 13px;
}

.code-section li strong {
	color: #42b883;
}
</style>
