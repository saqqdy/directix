import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
	// Event interaction directives
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
	// Format directives
	{
		path: '/truncate',
		name: 'Truncate',
		component: () => import('@/demos/truncate.vue'),
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
		path: '/image-preview',
		name: 'ImagePreview',
		component: () => import('@/demos/image-preview.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
