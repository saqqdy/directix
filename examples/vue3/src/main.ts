import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

// Register all directives using Directix plugin
import { Directix } from 'directix'

const app = createApp(App)

app.use(router)
app.use(Directix)

app.mount('#app')
