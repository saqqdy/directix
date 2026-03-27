import { defineConfig } from 'vitepress'

export default defineConfig({
	base: '/directix/',
	head: [
		['link', { href: '/directix/logo.svg', rel: 'icon' }],
		['meta', { content: '#42b883', name: 'theme-color' }],
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
								{ link: '/api/directives/copy', text: 'v-copy' },
								{ link: '/api/directives/debounce', text: 'v-debounce' },
								{ link: '/api/directives/throttle', text: 'v-throttle' },
								{ link: '/api/directives/focus', text: 'v-focus' },
							],
							text: 'Directives',
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
								{ link: '/guide/forms', text: 'Form Directives' },
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
								{ link: '/zh/api/directives/copy', text: 'v-copy' },
								{ link: '/zh/api/directives/debounce', text: 'v-debounce' },
								{ link: '/zh/api/directives/throttle', text: 'v-throttle' },
								{ link: '/zh/api/directives/focus', text: 'v-focus' },
							],
							text: '指令',
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
								{ link: '/zh/guide/forms', text: '表单指令' },
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
