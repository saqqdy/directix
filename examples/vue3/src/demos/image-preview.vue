<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useImagePreview } from 'directix'

const showPreview = ref(true)

function handleOpen() {
	console.log('Preview opened')
}

function handleClose() {
	console.log('Preview closed')
}

// Composable API demo
const composableImageRef = ref<HTMLImageElement | null>(null)
const { isOpen, currentSrc, open, close, bind } = useImagePreview({
	onOpen: () => console.log('Composable: Preview opened'),
	onClose: () => console.log('Composable: Preview closed')
})

onMounted(() => {
	if (composableImageRef.value) {
		bind(composableImageRef.value)
	}
})

const composableCode = `import { ref, onMounted } from 'vue'
import { useImagePreview } from 'directix'

const imageRef = ref(null)
const { isOpen, open, close, bind } = useImagePreview({
	onOpen: () => console.log('Preview opened'),
	onClose: () => console.log('Preview closed')
})

onMounted(() => {
	if (imageRef.value) {
		bind(imageRef.value)
	}
})

// Or programmatically open any image
function openCustomImage() {
	open('https://example.com/high-res.jpg')
}`

// Custom options state
const customOptions = ref({
	closeOnClickOutside: true,
	showCloseButton: true,
	zIndex: 9999,
	enablePinchZoom: true,
	enableDoubleTap: true,
	enableSwipeClose: true,
	showZoomIndicator: true,
})
</script>

<template>
	<div>
		<h2>v-image-preview</h2>
		<p class="desc">
			The v-image-preview directive creates a modal preview when clicking on images. Optimized for mobile with pinch zoom, double tap, and swipe gestures.
		</p>

		<h3>Basic Usage</h3>
		<div class="demo-row">
			<img
				v-image-preview
				src="https://picsum.photos/seed/demo1/200/150"
				data-preview="https://picsum.photos/seed/demo1/800/600"
				alt="Click to preview"
				class="preview-img"
			/>
			<p class="hint">Click image to preview (mobile: pinch, double tap, swipe down)</p>
		</div>

		<h3>Multiple Images</h3>
		<div class="demo-row gap">
			<img
				v-image-preview
				src="https://picsum.photos/seed/demo2/150/150"
				data-preview="https://picsum.photos/seed/demo2/600/600"
				alt="Nature"
				class="preview-img small"
			/>
			<img
				v-image-preview
				src="https://picsum.photos/seed/demo3/150/150"
				data-preview="https://picsum.photos/seed/demo3/600/600"
				alt="City"
				class="preview-img small"
			/>
			<img
				v-image-preview
				src="https://picsum.photos/seed/demo4/150/150"
				data-preview="https://picsum.photos/seed/demo4/600/600"
				alt="Ocean"
				class="preview-img small"
			/>
		</div>

		<h3>With Mobile Options</h3>
		<div class="options-demo">
			<div class="options-controls">
				<label class="checkbox-item">
					<input type="checkbox" v-model="customOptions.enablePinchZoom" />
					<span>Pinch to zoom</span>
				</label>
				<label class="checkbox-item">
					<input type="checkbox" v-model="customOptions.enableDoubleTap" />
					<span>Double tap zoom</span>
				</label>
				<label class="checkbox-item">
					<input type="checkbox" v-model="customOptions.enableSwipeClose" />
					<span>Swipe up to close</span>
				</label>
				<label class="checkbox-item">
					<input type="checkbox" v-model="customOptions.showZoomIndicator" />
					<span>Show zoom indicator</span>
				</label>
			</div>
			<div class="demo-row">
				<img
					v-image-preview="{
						previewSrc: 'https://picsum.photos/seed/demo5/1200/900',
						enablePinchZoom: customOptions.enablePinchZoom,
						enableDoubleTap: customOptions.enableDoubleTap,
						enableSwipeClose: customOptions.enableSwipeClose,
						showZoomIndicator: customOptions.showZoomIndicator,
						closeOnClickOutside: customOptions.closeOnClickOutside,
						showCloseButton: customOptions.showCloseButton,
						zIndex: customOptions.zIndex,
						onOpen: handleOpen,
						onClose: handleClose
					}"
					src="https://picsum.photos/seed/demo5/200/150"
					alt="With options"
					class="preview-img"
				/>
				<p class="hint">Try different options and click to preview</p>
			</div>
		</div>

		<h3>Toggle Enable/Disable</h3>
		<div class="demo-row">
			<img
				v-image-preview="{ disabled: !showPreview }"
				src="https://picsum.photos/seed/demo6/200/150"
				data-preview="https://picsum.photos/seed/demo6/800/600"
				alt="Toggle preview"
				class="preview-img"
				:style="{ cursor: showPreview ? 'zoom-in' : 'default' }"
			/>
			<button @click="showPreview = !showPreview" class="btn">
				{{ showPreview ? 'Disable' : 'Enable' }} Preview
			</button>
		</div>

		<h3>Non-Image Element</h3>
		<div class="demo-row">
			<div
				v-image-preview="{ src: 'https://picsum.photos/seed/demo7/800/600' }"
				class="preview-card"
			>
				Click to preview image
			</div>
		</div>

		<h3>Composable API (useImagePreview)</h3>
		<div class="composable-demo">
			<div class="demo-row">
				<img
					ref="composableImageRef"
					src="https://picsum.photos/seed/composable/200/150"
					data-preview="https://picsum.photos/seed/composable/800/600"
					alt="Composable preview"
					class="preview-img"
				/>
				<div class="composable-controls">
					<span class="status-badge" :class="{ active: isOpen }">
						{{ isOpen ? 'Preview Open' : 'Preview Closed' }}
					</span>
					<button @click="open('https://picsum.photos/seed/custom/800/600')" class="btn">
						Open Custom Image
					</button>
					<button v-if="isOpen" @click="close" class="btn btn-secondary">
						Close Preview
					</button>
				</div>
			</div>
			<p class="hint">Using useImagePreview composable for programmatic control</p>
			<pre class="code"><code>{{ composableCode }}</code></pre>
		</div>

		<h3>Mobile Gestures</h3>
		<div class="gestures-info">
			<div class="gesture-item">
				<span class="gesture-icon">👌</span>
				<span class="gesture-text"><strong>Pinch to zoom</strong> - Use two fingers to zoom in/out</span>
			</div>
			<div class="gesture-item">
				<span class="gesture-icon">👆👆</span>
				<span class="gesture-text"><strong>Double tap</strong> - Quick zoom toggle (1x → 2.5x)</span>
			</div>
			<div class="gesture-item">
				<span class="gesture-icon">👆</span>
				<span class="gesture-text"><strong>Swipe up</strong> - Close preview (when not zoomed)</span>
			</div>
			<div class="gesture-item">
				<span class="gesture-icon">🖱️</span>
				<span class="gesture-text"><strong>Desktop</strong> - Scroll wheel to zoom, drag to pan</span>
			</div>
		</div>

		<h3>Code Example</h3>
		<pre class="code"><code>&lt;!-- Basic usage with data-preview --&gt;
&lt;img
  v-image-preview
  src="thumbnail.jpg"
  data-preview="full.jpg"
/&gt;

&lt;!-- With mobile options --&gt;
&lt;img
  v-image-preview="{
    previewSrc: 'full.jpg',
    enablePinchZoom: true,
    enableDoubleTap: true,
    enableSwipeClose: true,
    showZoomIndicator: true,
    minScale: 0.5,
    maxScale: 5
  }"
  src="thumbnail.jpg"
/&gt;

&lt;!-- On non-image element --&gt;
&lt;div v-image-preview="{ src: 'image.jpg' }"&gt;
  Click to preview
&lt;/div&gt;</code></pre>
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
	line-height: 1.6;
}

.demo-row {
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
	align-items: center;
	margin-bottom: 16px;
}

.gap {
	gap: 16px;
}

.preview-img {
	border-radius: 8px;
	cursor: zoom-in;
	transition: transform 0.2s, box-shadow 0.2s;
}

.preview-img:hover {
	transform: scale(1.02);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.preview-img.small {
	width: 120px;
	height: 120px;
	object-fit: cover;
}

.preview-card {
	padding: 40px 60px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border-radius: 12px;
	cursor: zoom-in;
	font-weight: 500;
	transition: transform 0.2s;
}

.preview-card:hover {
	transform: scale(1.02);
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

.btn-secondary {
	background: #e0e0e0;
	color: #333;
}

.btn-secondary:hover {
	background: #d0d0d0;
}

.hint {
	color: #666;
	font-size: 14px;
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

.options-demo {
	background: #f8fafc;
	border-radius: 12px;
	padding: 16px;
	margin-bottom: 16px;
}

.options-controls {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	margin-bottom: 16px;
	padding-bottom: 16px;
	border-bottom: 1px solid #e2e8f0;
}

.checkbox-item {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	font-size: 14px;
	color: #4a5568;
}

.checkbox-item input[type='checkbox'] {
	width: 16px;
	height: 16px;
	cursor: pointer;
}

.composable-demo {
	background: #f8fafc;
	border-radius: 12px;
	padding: 16px;
	margin-bottom: 16px;
}

.composable-controls {
	display: flex;
	align-items: center;
	gap: 12px;
}

.status-badge {
	padding: 6px 12px;
	border-radius: 20px;
	font-size: 13px;
	font-weight: 500;
	background: #e0e0e0;
	color: #666;
	transition: all 0.3s;
}

.status-badge.active {
	background: #48bb78;
	color: white;
}

.gestures-info {
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
	border-radius: 12px;
	padding: 16px;
	margin-bottom: 16px;
}

.gesture-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 8px 0;
	border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.gesture-item:last-child {
	border-bottom: none;
}

.gesture-icon {
	font-size: 20px;
	min-width: 40px;
	text-align: center;
}

.gesture-text {
	color: #4a5568;
	font-size: 14px;
}
</style>
