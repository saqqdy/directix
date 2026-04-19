<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

// 无限滚动列表场景 - v-infinite-scroll, v-virtual-list, v-loading

interface ListItem {
	id: number
	title: string
	description: string
	avatar: string
}

export default defineComponent({
	name: 'InfiniteScrollList',
	setup() {
		const items = ref<ListItem[]>([])
		const loading = ref(false)
		const hasMore = ref(true)
		const page = ref(1)

		// 生成模拟数据
		const generateItems = (start: number, count: number): ListItem[] => {
			return Array.from({ length: count }, (_, i) => ({
				id: start + i,
				title: `项目 ${start + i}`,
				description: `这是项目 ${start + i} 的描述信息，包含一些详细内容。`,
				avatar: `https://i.pravatar.cc/40?img=${(start + i) % 70}`,
			}))
		}

		// 初始化数据
		onMounted(() => {
			items.value = generateItems(1, 20)
		})

		// 加载更多
		const loadMore = async () => {
			if (loading.value || !hasMore.value) return

			loading.value = true
			page.value++

			// 模拟网络请求
			await new Promise(resolve => setTimeout(resolve, 1000))

			const newItems = generateItems(items.value.length + 1, 10)
			items.value = [...items.value, ...newItems]

			if (items.value.length >= 100) {
				hasMore.value = false
			}

			loading.value = false
		}

		// 虚拟列表数据
		const virtualItems = ref(Array.from({ length: 1000 }, (_, i) => ({
			id: i + 1,
			text: `虚拟列表项 ${i + 1}`,
		})))

		return {
			items,
			loading,
			hasMore,
			loadMore,
			virtualItems,
		}
	},
})
</script>

<template>
	<div class="scenario-container">
		<h2>无限滚动列表</h2>
		<p class="description">结合 v-infinite-scroll、v-virtual-list、v-loading 实现大数据列表优化</p>

		<!-- 无限滚动列表 -->
		<div class="demo-section">
			<h3>无限滚动加载</h3>
			<div
				class="scroll-container"
				v-infinite-scroll="{
					handler: loadMore,
					distance: 100,
					disabled: loading || !hasMore,
				}"
			>
				<div class="item-list">
					<div
						v-for="item in items"
						:key="item.id"
						class="list-item"
					>
						<img :src="item.avatar" class="avatar" />
						<div class="item-content">
							<h4>{{ item.title }}</h4>
							<p>{{ item.description }}</p>
						</div>
					</div>
				</div>

				<!-- 加载状态 -->
				<div v-loading="loading" class="loading-container">
					<span v-if="!loading && !hasMore" class="no-more">
						没有更多数据了
					</span>
				</div>
			</div>
		</div>

		<!-- 虚拟列表 -->
		<div class="demo-section">
			<h3>虚拟列表（v-virtual-list）</h3>
			<p class="hint">渲染 1000 条数据，使用虚拟滚动优化性能</p>
			<div
				v-virtual-list="{
					items: virtualItems,
					itemSize: 40,
				}"
				class="virtual-container"
			>
				<div
					v-for="item in virtualItems"
					:key="item.id"
					class="virtual-item"
				>
					{{ item.text }}
				</div>
			</div>
		</div>

		<div class="code-section">
			<h3>使用的指令</h3>
			<ul>
				<li><strong>v-infinite-scroll</strong> - 滚动到底部自动加载更多</li>
				<li><strong>v-virtual-list</strong> - 虚拟滚动渲染大数据列表</li>
				<li><strong>v-loading</strong> - 加载状态指示器</li>
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

.hint {
	font-size: 12px;
	color: #999;
	margin-bottom: 8px;
}

.scroll-container {
	height: 300px;
	overflow-y: auto;
	border: 1px solid #eee;
	border-radius: 8px;
}

.item-list {
	padding: 8px;
}

.list-item {
	display: flex;
	align-items: center;
	padding: 12px;
	background: #fff;
	border-radius: 6px;
	margin-bottom: 8px;
	border: 1px solid #f0f0f0;
}

.avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin-right: 12px;
}

.item-content h4 {
	margin: 0 0 4px 0;
	font-size: 14px;
}

.item-content p {
	margin: 0;
	font-size: 12px;
	color: #666;
}

.loading-container {
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.no-more {
	color: #999;
	font-size: 12px;
}

.virtual-container {
	height: 200px;
	overflow-y: auto;
	border: 1px solid #eee;
	border-radius: 8px;
}

.virtual-item {
	height: 40px;
	display: flex;
	align-items: center;
	padding: 0 12px;
	border-bottom: 1px solid #f0f0f0;
	font-size: 13px;
}

.virtual-item:hover {
	background: #f9f9f9;
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
