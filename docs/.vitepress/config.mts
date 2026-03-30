import { defineConfig } from 'vitepress'

export default defineConfig({
	base: '/directix/',
	head: [
		['link', { href: '/directix/logo.svg', rel: 'icon' }],
		['meta', { name: 'theme-color', content: '#42b883' }],
	],

	locales: {
		root: {
			description: 'A Vue directives library for Vue 2 and Vue 3',
			label: 'English',
			lang: 'en',
			themeConfig: {
				darkModeSwitchLabel: 'Theme',
				darkModeSwitchTitle: 'Switch to dark theme',
				docFooter: { next: 'Next', prev: 'Previous' },
				editLink: {
					pattern: 'https://github.com/saqqdy/directix/edit/master/docs/:path',
					text: 'Edit this page on GitHub',
				},
				footer: {
					copyright: 'Copyright © 2024-present saqqdy',
					message: 'Released under the MIT License.',
				},
				langMenuLabel: 'Language',
				lastUpdated: {
					formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
					text: 'Last updated',
				},
				lightModeSwitchTitle: 'Switch to light theme',
				nav: [
					{ activeMatch: '/guide/', link: '/guide/', text: 'Guide' },
					{ activeMatch: '/api/', link: '/api/', text: 'API' },
					{ activeMatch: '/examples/', link: '/examples/', text: 'Examples' },
					{
						items: [
							{ link: 'https://github.com/saqqdy/directix', text: 'GitHub' },
							{ link: 'https://www.npmjs.com/package/directix', text: 'NPM' },
						],
						text: 'Links',
					},
				],
				outline: { label: 'On this page' },
				returnToTopLabel: 'Return to top',
				sidebar: {
					'/api/': [
						{
							items: [{ link: '/api/', text: 'Overview' }],
							text: 'API Reference',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/directives/click-outside', text: 'v-click-outside' },
								{ link: '/api/directives/click-delay', text: 'v-click-delay' },
								{ link: '/api/directives/debounce', text: 'v-debounce' },
								{ link: '/api/directives/throttle', text: 'v-throttle' },
								{ link: '/api/directives/long-press', text: 'v-long-press' },
								{ link: '/api/directives/hover', text: 'v-hover' },
								{ link: '/api/directives/ripple', text: 'v-ripple' },
								{ link: '/api/directives/touch', text: 'v-touch' },
								{ link: '/api/directives/swipe', text: 'v-swipe' },
								{ link: '/api/directives/hotkey', text: 'v-hotkey' },
							],
							text: 'Event Directives',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/directives/lazy', text: 'v-lazy' },
								{ link: '/api/directives/intersect', text: 'v-intersect' },
								{ link: '/api/directives/visible', text: 'v-visible' },
								{ link: '/api/directives/loading', text: 'v-loading' },
								{ link: '/api/directives/image-preview', text: 'v-image-preview' },
							],
							text: 'Visibility Directives',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/directives/scroll', text: 'v-scroll' },
								{ link: '/api/directives/infinite-scroll', text: 'v-infinite-scroll' },
								{ link: '/api/directives/sticky', text: 'v-sticky' },
								{ link: '/api/directives/pull-refresh', text: 'v-pull-refresh' },
							],
							text: 'Scroll Directives',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/directives/copy', text: 'v-copy' },
								{ link: '/api/directives/focus', text: 'v-focus' },
								{ link: '/api/directives/mask', text: 'v-mask' },
								{ link: '/api/directives/trim', text: 'v-trim' },
								{ link: '/api/directives/capitalcase', text: 'v-capitalcase' },
								{ link: '/api/directives/lowercase', text: 'v-lowercase' },
								{ link: '/api/directives/uppercase', text: 'v-uppercase' },
								{ link: '/api/directives/money', text: 'v-money' },
								{ link: '/api/directives/number', text: 'v-number' },
							],
							text: 'Form Directives',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/directives/tooltip', text: 'v-tooltip' },
								{ link: '/api/directives/draggable', text: 'v-draggable' },
								{ link: '/api/directives/truncate', text: 'v-truncate' },
								{ link: '/api/directives/ellipsis', text: 'v-ellipsis' },
								{ link: '/api/directives/watermark', text: 'v-watermark' },
								{ link: '/api/directives/print', text: 'v-print' },
								{ link: '/api/directives/virtual-list', text: 'v-virtual-list' },
								{ link: '/api/directives/countdown', text: 'v-countdown' },
							],
							text: 'UI Directives',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/directives/permission', text: 'v-permission' },
								{ link: '/api/directives/sanitize', text: 'v-sanitize' },
							],
							text: 'Security Directives',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/directives/resize', text: 'v-resize' },
								{ link: '/api/directives/mutation', text: 'v-mutation' },
							],
							text: 'Observer Directives',
						},
					],
					'/examples/': [
						{
							items: [{ link: '/examples/', text: 'Overview' }],
							text: 'Examples',
						},
						{
							items: [
								{ link: '/examples/click-outside', text: 'Click Outside' },
								{ link: '/examples/copy', text: 'Copy' },
								{ link: '/examples/debounce', text: 'Debounce' },
								{ link: '/examples/throttle', text: 'Throttle' },
								{ link: '/examples/focus', text: 'Focus' },
							],
							text: 'Demos',
						},
					],
					'/guide/': [
						{
							items: [
								{ link: '/guide/', text: 'Introduction' },
								{ link: '/guide/installation', text: 'Installation' },
								{ link: '/guide/quick-start', text: 'Quick Start' },
							],
							text: 'Getting Started',
						},
						{
							items: [
								{ link: '/guide/events', text: 'Event Directives' },
								{ link: '/guide/visibility', text: 'Visibility Directives' },
								{ link: '/guide/scroll', text: 'Scroll Directives' },
								{ link: '/guide/forms', text: 'Form Directives' },
								{ link: '/guide/security', text: 'Security Directives' },
								{ link: '/guide/observers', text: 'Observer Directives' },
							],
							text: 'Categories',
						},
					],
				},
				sidebarMenuLabel: 'Menu',
			},
			title: 'Directix',
		},
		zh: {
			description: '支持 Vue 2 和 Vue 3 的 Vue 指令库',
			label: '简体中文',
			lang: 'zh-CN',
			link: '/zh/',
			themeConfig: {
				darkModeSwitchLabel: '主题',
				darkModeSwitchTitle: '切换到深色模式',
				docFooter: { next: '下一页', prev: '上一页' },
				editLink: {
					pattern: 'https://github.com/saqqdy/directix/edit/master/docs/:path',
					text: '在 GitHub 上编辑此页',
				},
				footer: {
					copyright: '版权所有 © 2024-present saqqdy',
					message: '基于 MIT 许可发布',
				},
				langMenuLabel: '语言',
				lastUpdated: {
					formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
					text: '最后更新于',
				},
				lightModeSwitchTitle: '切换到浅色模式',
				nav: [
					{ activeMatch: '/zh/guide/', link: '/zh/guide/', text: '指南' },
					{ activeMatch: '/zh/api/', link: '/zh/api/', text: 'API' },
					{ activeMatch: '/zh/examples/', link: '/zh/examples/', text: '示例' },
					{
						items: [
							{ link: 'https://github.com/saqqdy/directix', text: 'GitHub' },
							{ link: 'https://www.npmjs.com/package/directix', text: 'NPM' },
						],
						text: '链接',
					},
				],
				outline: { label: '页面导航' },
				returnToTopLabel: '回到顶部',
				sidebar: {
					'/zh/api/': [
						{
							items: [{ link: '/zh/api/', text: '概览' }],
							text: 'API 参考',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/directives/click-outside', text: 'v-click-outside' },
								{ link: '/zh/api/directives/click-delay', text: 'v-click-delay' },
								{ link: '/zh/api/directives/debounce', text: 'v-debounce' },
								{ link: '/zh/api/directives/throttle', text: 'v-throttle' },
								{ link: '/zh/api/directives/long-press', text: 'v-long-press' },
								{ link: '/zh/api/directives/hover', text: 'v-hover' },
								{ link: '/zh/api/directives/ripple', text: 'v-ripple' },
								{ link: '/zh/api/directives/touch', text: 'v-touch' },
								{ link: '/zh/api/directives/swipe', text: 'v-swipe' },
								{ link: '/zh/api/directives/hotkey', text: 'v-hotkey' },
							],
							text: '事件指令',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/directives/lazy', text: 'v-lazy' },
								{ link: '/zh/api/directives/intersect', text: 'v-intersect' },
								{ link: '/zh/api/directives/visible', text: 'v-visible' },
								{ link: '/zh/api/directives/loading', text: 'v-loading' },
								{ link: '/zh/api/directives/image-preview', text: 'v-image-preview' },
							],
							text: '可见性指令',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/directives/scroll', text: 'v-scroll' },
								{ link: '/zh/api/directives/infinite-scroll', text: 'v-infinite-scroll' },
								{ link: '/zh/api/directives/sticky', text: 'v-sticky' },
								{ link: '/zh/api/directives/pull-refresh', text: 'v-pull-refresh' },
							],
							text: '滚动指令',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/directives/copy', text: 'v-copy' },
								{ link: '/zh/api/directives/focus', text: 'v-focus' },
								{ link: '/zh/api/directives/mask', text: 'v-mask' },
								{ link: '/zh/api/directives/trim', text: 'v-trim' },
								{ link: '/zh/api/directives/capitalcase', text: 'v-capitalcase' },
								{ link: '/zh/api/directives/lowercase', text: 'v-lowercase' },
								{ link: '/zh/api/directives/uppercase', text: 'v-uppercase' },
								{ link: '/zh/api/directives/money', text: 'v-money' },
								{ link: '/zh/api/directives/number', text: 'v-number' },
							],
							text: '表单指令',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/directives/tooltip', text: 'v-tooltip' },
								{ link: '/zh/api/directives/draggable', text: 'v-draggable' },
								{ link: '/zh/api/directives/truncate', text: 'v-truncate' },
								{ link: '/zh/api/directives/ellipsis', text: 'v-ellipsis' },
								{ link: '/zh/api/directives/watermark', text: 'v-watermark' },
								{ link: '/zh/api/directives/print', text: 'v-print' },
								{ link: '/zh/api/directives/virtual-list', text: 'v-virtual-list' },
								{ link: '/zh/api/directives/countdown', text: 'v-countdown' },
							],
							text: 'UI 指令',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/directives/permission', text: 'v-permission' },
								{ link: '/zh/api/directives/sanitize', text: 'v-sanitize' },
							],
							text: '安全指令',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/directives/resize', text: 'v-resize' },
								{ link: '/zh/api/directives/mutation', text: 'v-mutation' },
							],
							text: '观察者指令',
						},
					],
					'/zh/examples/': [
						{
							items: [{ link: '/zh/examples/', text: '概览' }],
							text: '示例',
						},
						{
							items: [
								{ link: '/zh/examples/click-outside', text: 'Click Outside' },
								{ link: '/zh/examples/copy', text: 'Copy' },
								{ link: '/zh/examples/debounce', text: 'Debounce' },
								{ link: '/zh/examples/throttle', text: 'Throttle' },
								{ link: '/zh/examples/focus', text: 'Focus' },
							],
							text: '演示',
						},
					],
					'/zh/guide/': [
						{
							items: [
								{ link: '/zh/guide/', text: '介绍' },
								{ link: '/zh/guide/installation', text: '安装' },
								{ link: '/zh/guide/quick-start', text: '快速上手' },
							],
							text: '开始',
						},
						{
							items: [
								{ link: '/zh/guide/events', text: '事件指令' },
								{ link: '/zh/guide/visibility', text: '可见性指令' },
								{ link: '/zh/guide/scroll', text: '滚动指令' },
								{ link: '/zh/guide/forms', text: '表单指令' },
								{ link: '/zh/guide/security', text: '安全指令' },
								{ link: '/zh/guide/observers', text: '观察者指令' },
							],
							text: '分类',
						},
					],
				},
				sidebarMenuLabel: '菜单',
			},
			title: 'Directix',
		},
	},

	themeConfig: {
		logo: '/logo.svg',
		search: {
			provider: 'local',
		},
		siteTitle: 'Directix',
		socialLinks: [{ icon: 'github', link: 'https://github.com/saqqdy/directix' }],
	},

	title: 'Directix',
})
