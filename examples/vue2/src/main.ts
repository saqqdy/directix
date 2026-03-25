import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import { Directix } from 'directix'

Vue.use(Router)
Vue.use(Directix)

import routes from './router'

const router = new Router({
	mode: 'history',
	routes,
})

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
