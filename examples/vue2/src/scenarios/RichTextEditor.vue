<script setup lang="ts">
import { ref } from 'vue'

// 富文本编辑器场景 - v-sanitize, v-highlight, v-emoji

const editorContent = ref('<p>这是一段<strong>富文本</strong>内容。</p><p>支持<em>HTML标签</em>和<a href="#">链接</a>。</p>')

const searchKeyword = ref('富文本')
const rawHtml = ref('<script>alert("XSS")<\/script><p>安全的内容</p><img src=x onerror=alert("XSS")>')

const showEmojiPicker = ref(false)
const selectedEmoji = ref('')

const onEmojiSelect = (emoji: string) => {
	selectedEmoji.value = emoji
	showEmojiPicker.value = false
}
</script>

<template>
	<div class="scenario-container">
		<h2>富文本编辑器</h2>
		<p class="description">结合 v-sanitize、v-highlight、v-emoji 实现内容编辑与过滤</p>

		<!-- 高亮搜索 -->
		<div class="demo-section">
			<h3>关键词高亮（v-highlight）</h3>
			<div class="search-box">
				<input
					v-model="searchKeyword"
					type="text"
					placeholder="输入搜索关键词"
					class="search-input"
				/>
			</div>
			<div
				v-highlight="{ keyword: searchKeyword, color: '#ffeb3b' }"
				class="highlight-content"
			>
				这是一段包含富文本的示例内容。富文本编辑器可以处理各种格式。
				富文本的特点是支持多种样式和格式。
			</div>
		</div>

		<!-- XSS 防护 -->
		<div class="demo-section">
			<h3>XSS 防护（v-sanitize）</h3>
			<div class="sanitize-demo">
				<div class="raw-section">
					<h4>原始 HTML（危险）</h4>
					<code class="code-block">{{ rawHtml }}</code>
				</div>
				<div class="safe-section">
					<h4>净化后（安全）</h4>
					<div
						v-sanitize="{ allowedTags: ['p', 'strong', 'em', 'a'] }"
						class="sanitized-content"
						v-html="rawHtml"
					></div>
				</div>
			</div>
		</div>

		<!-- 表情选择 -->
		<div class="demo-section">
			<h3>表情选择（v-emoji）</h3>
			<div class="emoji-demo">
				<button
					class="emoji-trigger"
					@click="showEmojiPicker = !showEmojiPicker"
				>
					选择表情 {{ selectedEmoji }}
				</button>
				<div v-if="showEmojiPicker" class="emoji-picker">
					<div class="emoji-grid">
						<span
							v-for="emoji in ['😀', '😂', '🥰', '😎', '🤔', '👍', '👋', '🎉', '❤️', '⭐', '🔥', '✨']"
							:key="emoji"
							class="emoji-item"
							@click="onEmojiSelect(emoji)"
						>
							{{ emoji }}
						</span>
					</div>
				</div>
				<p v-if="selectedEmoji" class="selected-emoji">
					已选择: {{ selectedEmoji }}
				</p>
			</div>
		</div>

		<div class="code-section">
			<h3>使用的指令</h3>
			<ul>
				<li><strong>v-highlight</strong> - 高亮显示搜索关键词</li>
				<li><strong>v-sanitize</strong> - 净化 HTML 防止 XSS 攻击</li>
				<li><strong>v-emoji</strong> - 表情选择器</li>
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

.search-box {
	margin-bottom: 12px;
}

.search-input {
	width: 100%;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
}

.highlight-content {
	padding: 16px;
	background: #f9f9f9;
	border-radius: 6px;
	line-height: 1.8;
}

.sanitize-demo {
	display: grid;
	gap: 16px;
}

.raw-section,
.safe-section {
	padding: 12px;
	background: #f5f5f5;
	border-radius: 6px;
}

.raw-section h4,
.safe-section h4 {
	font-size: 12px;
	color: #666;
	margin: 0 0 8px 0;
}

.code-block {
	display: block;
	padding: 10px;
	background: #fff;
	border-radius: 4px;
	font-size: 11px;
	word-break: break-all;
	white-space: pre-wrap;
	color: #f56c6c;
}

.sanitized-content {
	padding: 10px;
	background: #fff;
	border-radius: 4px;
}

.emoji-demo {
	position: relative;
}

.emoji-trigger {
	padding: 10px 16px;
	background: #fff;
	border: 1px solid #ddd;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
}

.emoji-picker {
	position: absolute;
	top: 100%;
	left: 0;
	margin-top: 8px;
	padding: 12px;
	background: #fff;
	border: 1px solid #eee;
	border-radius: 8px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	z-index: 10;
}

.emoji-grid {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 8px;
}

.emoji-item {
	font-size: 20px;
	cursor: pointer;
	text-align: center;
	padding: 4px;
	border-radius: 4px;
}

.emoji-item:hover {
	background: #f5f5f5;
}

.selected-emoji {
	margin-top: 12px;
	font-size: 14px;
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