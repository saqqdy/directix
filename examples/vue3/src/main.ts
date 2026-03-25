import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

// 使用 Directix 插件方式注册所有指令
import { Directix } from 'directix'

const app = createApp(App)

app.use(router)
app.use(Directix)

app.mount('#app')
