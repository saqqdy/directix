<script setup lang="ts">
import { ref } from 'vue'

// 打印导出场景 - v-print, v-export

const printTitle = ref('Directix 文档')
const exportType = ref('image')

const onBeforePrint = () => {
	console.log('打印前处理...')
}

const onAfterPrint = () => {
	console.log('打印后恢复...')
}

const contentToPrint = ref(`
<h2>Directix 使用指南</h2>
<p>Directix 是一个功能强大的 Vue 自定义指令库。</p>
<ul>
	<li>支持 Vue 2 和 Vue 3</li>
	<li>57+ 个实用指令</li>
	<li>41+ 个组合式函数</li>
</ul>
<p>了解更多请访问：<a href="https://github.com/saqqdy/directix">GitHub</a></p>
`)
</script>

<template>
	<div class="scenario-container">
		<h2>打印导出</h2>
		<p class="description">结合 v-print、v-export 实现文档处理</p>

		<!-- 打印功能 -->
		<div class="demo-section">
			<h3>打印功能（v-print）</h3>
			<div class="print-settings">
				<input
					v-model="printTitle"
					type="text"
					placeholder="打印标题"
					class="input"
				/>
			</div>
			<div class="print-content" v-html="contentToPrint"></div>
			<div class="print-actions">
				<button
					v-print="{ title: printTitle, onBefore: onBeforePrint, onAfter: onAfterPrint }"
					class="btn print-btn"
				>
					打印此文档
				</button>
			</div>
		</div>

		<!-- 导出功能 -->
		<div class="demo-section">
			<h3>导出功能（v-export）</h3>
			<div class="export-preview">
				<div class="preview-card">
					<h4>卡片内容</h4>
					<p>这段内容可以导出为图片或 PDF</p>
					<div class="preview-image">📊</div>
				</div>
			</div>
			<div class="export-actions">
				<select v-model="exportType" class="select">
					<option value="image">PNG 图片</option>
					<option value="pdf">PDF 文档</option>
				</select>
				<button
					v-export="{ type: exportType, filename: 'directix-export' }"
					class="btn export-btn"
				>
					导出为 {{ exportType === 'image' ? 'PNG' : 'PDF' }}
				</button>
			</div>
		</div>

		<div class="code-section">
			<h3>使用的指令</h3>
			<ul>
				<li><strong>v-print</strong> - 打印元素内容</li>
				<li><strong>v-export</strong> - 导出为图片或 PDF</li>
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
	margin-bottom: 12px;
	color: #333;
}

.print-settings {
	margin-bottom: 12px;
}

.input {
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 6px;
	width: 200px;
}

.print-content {
	padding: 20px;
	background: #fff;
	border: 1px solid #eee;
	border-radius: 8px;
	margin-bottom: 12px;
}

.print-content h2 {
	color: #333;
	margin-bottom: 12px;
}

.print-content ul {
	padding-left: 20px;
}

.print-actions {
	display: flex;
	gap: 10px;
}

.btn {
	padding: 12px 20px;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 500;
}

.print-btn {
	background: #42b883;
	color: white;
}

.export-preview {
	margin-bottom: 12px;
}

.preview-card {
	padding: 20px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border-radius: 8px;
}

.preview-card h4 {
	margin: 0 0 8px 0;
}

.preview-image {
	font-size: 40px;
	margin-top: 12px;
}

.export-actions {
	display: flex;
	gap: 10px;
	align-items: center;
}

.select {
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 6px;
}

.export-btn {
	background: #35495e;
	color: white;
}

.code-section {
	margin-top: 20px;
	padding: 15px;
	background: #fff;
	border-radius: 6px;
	border: 1px solid #eee;
}

.code-section h3 {
	font-size: 14px;
	margin-bottom: 10px;
}

.code-section ul {
	list-style: none;
	padding: 0;
}

.code-section li {
	padding: 4px 0;
	font-size: 13px;
}
</style>