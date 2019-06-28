import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 因为要设置页面的访问权限，所以这里就不能默认导出整个new Router 实例了
const router = new Router({
  routes: [
    // {
    //   // 路由名字，跳转的时候直接$router.push({name: 'xxx'})
    //   name: 'APPHome',
    //   path: '/',
    //   component: () => import('@/views/home')
    // },
    { // 配置路由
      name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [ // 所有 children 路由都显示到父路由的 router-view中
        {
          name: 'home',
          path: '', // 表示 layout 的默认子路由
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish', // 表示 layout 的默认子路由
          component: () => import('@/views/publish')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
// 所有路由导航都要经过这里，to 就是去哪儿，from就是来自哪里，next 允许通过的方法
router.beforeEach((to, from, next) => {
  // 如果不是登录页面，就判断登录的状态；
  if (to.name !== 'login') {
    const userInfo = window.localStorage.getItem('user_info')
    // 没有登录就跳转到登录页
    if (!userInfo) {
      return next({
        name: 'login'
      })
    } else {
      // 登录了就允许通过
      next()
    }
  } else {
    // 如果登录了，就不允许在访问登录页面；没有登录才能访问登录页面
    // eslint-disable-next-line no-undef
    if (userInfo) {
      next(false)
    } else {
      next()
    }
  }
})

export default router
