import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

import ElTablePlus from './components/index'

const app = createApp(App)
app.use(ElementPlus)
app.use(ElTablePlus)
app.mount('#app')
