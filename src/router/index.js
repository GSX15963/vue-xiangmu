import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    name: 'APPHome',
    path: '/',
    component: () => import('@/views/home')
  },
  {
    name: 'APPLogin',
    path: '/login',
    component: () => import('@/views/login')
  }
  ]
})
