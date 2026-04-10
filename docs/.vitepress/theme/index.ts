import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import DirectiveConfigurator from '../components/DirectiveConfigurator.vue'
import Playground from '../components/Playground.vue'
import './style.css'

export default {
	enhanceApp({ app, router: _router, siteData: _siteData }) {
		// register global components
		app.component('Playground', Playground)
		app.component('DirectiveConfigurator', DirectiveConfigurator)
	},
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {})
	},
} satisfies Theme
