import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		redirect: '/click-outside',
	},
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
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
