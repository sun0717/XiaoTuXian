// import './assets/main.css'
// 引入初始化样式文件
import '@/styles/common.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 全局指令注册
import { lazyPlugin } from '@/directives'
import { componentPlugin } from '@/components'
import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(lazyPlugin)
app.use(componentPlugin)
app.mount('#app')

