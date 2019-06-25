import Vue from 'vue'
import App from './App.vue'
// 引入router路由，用于单页面应用程序
import router from './router'
// 引入ElementUI 组件路由，用来引用组件
import ElementUI from 'element-ui'
// 引入ElementUI 组件样式
import 'element-ui/lib/theme-chalk/index.css'
// 引入自己的公共样式
import './styles/index.less'
// 挂载ElementUI
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
