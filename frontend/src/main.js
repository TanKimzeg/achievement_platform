import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 全局样式
import '@/styles/index.scss'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 创建应用实例
const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 配置NProgress
NProgress.configure({ 
  showSpinner: false,
  minimum: 0.2,
  easing: 'ease',
  speed: 500
})

// 使用插件
app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})

// 挂载应用
app.mount('#app')