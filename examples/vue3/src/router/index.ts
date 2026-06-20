import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: '/click-outside',
	},
	// Event directives
	{
		path: '/click-outside',
		name: 'ClickOutside',
		component: () => import('@/demos/click-outside.vue'),
	},
	{
		path: '/click-delay',
		name: 'ClickDelay',
		component: () => import('@/demos/click-delay.vue'),
	},
	{
		path: '/copy',
		name: 'Copy',
		component: () => import('@/demos/copy.vue'),
	},
	{
		path: '/debounce',
		name: 'Debounce',
		component: () => import('@/demos/debounce.vue'),
	},
	{
		path: '/throttle',
		name: 'Throttle',
		component: () => import('@/demos/throttle.vue'),
	},
	{
		path: '/focus',
		name: 'Focus',
		component: () => import('@/demos/focus.vue'),
	},
	{
		path: '/hotkey',
		name: 'Hotkey',
		component: () => import('@/demos/hotkey.vue'),
	},
	// Visibility directives
	{
		path: '/lazy',
		name: 'Lazy',
		component: () => import('@/demos/lazy.vue'),
	},
	{
		path: '/intersect',
		name: 'Intersect',
		component: () => import('@/demos/intersect.vue'),
	},
	{
		path: '/visible',
		name: 'Visible',
		component: () => import('@/demos/visible.vue'),
	},
	{
		path: '/loading',
		name: 'Loading',
		component: () => import('@/demos/loading.vue'),
	},
	// Scroll directives
	{
		path: '/scroll',
		name: 'Scroll',
		component: () => import('@/demos/scroll.vue'),
	},
	{
		path: '/infinite-scroll',
		name: 'InfiniteScroll',
		component: () => import('@/demos/infinite-scroll.vue'),
	},
	{
		path: '/sticky',
		name: 'Sticky',
		component: () => import('@/demos/sticky.vue'),
	},
	// Interaction directives
	{
		path: '/long-press',
		name: 'LongPress',
		component: () => import('@/demos/long-press.vue'),
	},
	{
		path: '/hover',
		name: 'Hover',
		component: () => import('@/demos/hover.vue'),
	},
	{
		path: '/ripple',
		name: 'Ripple',
		component: () => import('@/demos/ripple.vue'),
	},
	// Format directives
	{
		path: '/truncate',
		name: 'Truncate',
		component: () => import('@/demos/truncate.vue'),
	},
	{
		path: '/ellipsis',
		name: 'Ellipsis',
		component: () => import('@/demos/ellipsis.vue'),
	},
	{
		path: '/uppercase',
		name: 'Uppercase',
		component: () => import('@/demos/uppercase.vue'),
	},
	{
		path: '/lowercase',
		name: 'Lowercase',
		component: () => import('@/demos/lowercase.vue'),
	},
	{
		path: '/capitalcase',
		name: 'Capitalcase',
		component: () => import('@/demos/capitalcase.vue'),
	},
	{
		path: '/number',
		name: 'Number',
		component: () => import('@/demos/number.vue'),
	},
	{
		path: '/money',
		name: 'Money',
		component: () => import('@/demos/money.vue'),
	},
	{
		path: '/trim',
		name: 'Trim',
		component: () => import('@/demos/trim.vue'),
	},
	// UI directives
	{
		path: '/tooltip',
		name: 'Tooltip',
		component: () => import('@/demos/tooltip.vue'),
	},
	{
		path: '/draggable',
		name: 'Draggable',
		component: () => import('@/demos/draggable.vue'),
	},
	{
		path: '/touch',
		name: 'Touch',
		component: () => import('@/demos/touch.vue'),
	},
	{
		path: '/swipe',
		name: 'Swipe',
		component: () => import('@/demos/swipe.vue'),
	},
	{
		path: '/image-preview',
		name: 'ImagePreview',
		component: () => import('@/demos/image-preview.vue'),
	},
	{
		path: '/countdown',
		name: 'Countdown',
		component: () => import('@/demos/countdown.vue'),
	},
	{
		path: '/watermark',
		name: 'Watermark',
		component: () => import('@/demos/watermark.vue'),
	},
	{
		path: '/print',
		name: 'Print',
		component: () => import('@/demos/print.vue'),
	},
	// Form directives
	{
		path: '/mask',
		name: 'Mask',
		component: () => import('@/demos/mask.vue'),
	},
	// Security directives
	{
		path: '/permission',
		name: 'Permission',
		component: () => import('@/demos/permission.vue'),
	},
	{
		path: '/sanitize',
		name: 'Sanitize',
		component: () => import('@/demos/sanitize.vue'),
	},
	// Observer directives
	{
		path: '/resize',
		name: 'Resize',
		component: () => import('@/demos/resize.vue'),
	},
	{
		path: '/mutation',
		name: 'Mutation',
		component: () => import('@/demos/mutation.vue'),
	},
	// Performance directives
	{
		path: '/virtual-list',
		name: 'VirtualList',
		component: () => import('@/demos/virtual-list.vue'),
	},
	// Mobile directives
	{
		path: '/pull-refresh',
		name: 'PullRefresh',
		component: () => import('@/demos/pull-refresh.vue'),
	},
	// v1.5.0 directives
	{
		path: '/blur',
		name: 'Blur',
		component: () => import('@/demos/blur.vue'),
	},
	{
		path: '/skeleton',
		name: 'Skeleton',
		component: () => import('@/demos/skeleton.vue'),
	},
	{
		path: '/click-wave',
		name: 'ClickWave',
		component: () => import('@/demos/click-wave.vue'),
	},
	{
		path: '/context-menu',
		name: 'ContextMenu',
		component: () => import('@/demos/context-menu.vue'),
	},
	{
		path: '/counter',
		name: 'Counter',
		component: () => import('@/demos/counter.vue'),
	},
	{
		path: '/emoji',
		name: 'Emoji',
		component: () => import('@/demos/emoji.vue'),
	},
	{
		path: '/export',
		name: 'Export',
		component: () => import('@/demos/export.vue'),
	},
	{
		path: '/fade',
		name: 'Fade',
		component: () => import('@/demos/fade.vue'),
	},
	{
		path: '/fullscreen',
		name: 'Fullscreen',
		component: () => import('@/demos/fullscreen.vue'),
	},
	{
		path: '/highlight',
		name: 'Highlight',
		component: () => import('@/demos/highlight.vue'),
	},
	{
		path: '/lottie',
		name: 'Lottie',
		component: () => import('@/demos/lottie.vue'),
	},
	{
		path: '/pan',
		name: 'Pan',
		component: () => import('@/demos/pan.vue'),
	},
	{
		path: '/parallax',
		name: 'Parallax',
		component: () => import('@/demos/parallax.vue'),
	},
	{
		path: '/pinch',
		name: 'Pinch',
		component: () => import('@/demos/pinch.vue'),
	},
	{
		path: '/progress',
		name: 'Progress',
		component: () => import('@/demos/progress.vue'),
	},
	{
		path: '/rotate-gesture',
		name: 'RotateGesture',
		component: () => import('@/demos/rotate-gesture.vue'),
	},
	{
		path: '/typewriter',
		name: 'Typewriter',
		component: () => import('@/demos/typewriter.vue'),
	},
	// v1.9.0 Scenario Examples
	{
		path: '/scenarios',
		name: 'Scenarios',
		component: () => import('@/scenarios/index.vue'),
	},
	{
		path: '/scenarios/form-validation',
		name: 'FormValidation',
		component: () => import('@/scenarios/FormValidation.vue'),
	},
	{
		path: '/scenarios/permission-management',
		name: 'PermissionManagement',
		component: () => import('@/scenarios/PermissionManagement.vue'),
	},
	{
		path: '/scenarios/image-gallery',
		name: 'ImageGallery',
		component: () => import('@/scenarios/ImageGallery.vue'),
	},
	{
		path: '/scenarios/infinite-scroll-list',
		name: 'InfiniteScrollList',
		component: () => import('@/scenarios/InfiniteScrollList.vue'),
	},
	{
		path: '/scenarios/rich-text-editor',
		name: 'RichTextEditor',
		component: () => import('@/scenarios/RichTextEditor.vue'),
	},
	{
		path: '/scenarios/gesture-interaction',
		name: 'GestureInteraction',
		component: () => import('@/scenarios/GestureInteraction.vue'),
	},
	{
		path: '/scenarios/data-visualization',
		name: 'DataVisualization',
		component: () => import('@/scenarios/DataVisualization.vue'),
	},
	{
		path: '/scenarios/drag-sort',
		name: 'DragSort',
		component: () => import('@/scenarios/DragSort.vue'),
	},
	{
		path: '/scenarios/print-export',
		name: 'PrintExport',
		component: () => import('@/scenarios/PrintExport.vue'),
	},
	{
		path: '/scenarios/fullscreen-media',
		name: 'FullscreenMedia',
		component: () => import('@/scenarios/FullscreenMedia.vue'),
	},
	// v1.10.0 Features
	{
		path: '/a11y',
		name: 'A11y',
		component: () => import('@/demos/a11y.vue'),
	},
	{
		path: '/security-audit',
		name: 'SecurityAudit',
		component: () => import('@/demos/security-audit.vue'),
	},
	// v1.11.0 Features
	{
		path: '/composables',
		name: 'Composables',
		component: () => import('@/demos/composables.vue'),
	},
	{
		path: '/enterprise',
		name: 'Enterprise',
		component: () => import('@/demos/enterprise.vue'),
	},
	{
		path: '/performance',
		name: 'Performance',
		component: () => import('@/demos/performance.vue'),
	},
	// v2.0.0 Features
	{
		path: '/web-components',
		name: 'WebComponents',
		component: () => import('@/demos/web-components.vue'),
	},
	// v1.9.0 Features
	{
		path: '/i18n',
		name: 'I18n',
		component: () => import('@/demos/i18n.vue'),
	},
	{
		path: '/plugin-system',
		name: 'PluginSystem',
		component: () => import('@/demos/plugin-system.vue'),
	},
	{
		path: '/devtools',
		name: 'DevTools',
		component: () => import('@/demos/devtools.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
